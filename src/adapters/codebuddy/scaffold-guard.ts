import type { AdapterEvent } from "../../types";

/** Error code for a CodeBuddy turn whose text channel contains vendor agent scaffolding. */
export const CODEBUDDY_SCAFFOLD_ERROR_CODE = "vendor_scaffold_detected";

// CodeBuddy's observed DSML tags use FULLWIDTH VERTICAL LINE (U+FF5C), not ASCII pipes.
// Keep the exact spelling narrow: a bare "DSML" match would reject legitimate discussion of
// the protocol, while the tag prefix identifies vendor control markup rather than prose.
const DSML_OPEN = "<｜｜dsml｜｜";
const DSML_CLOSE = "</｜｜dsml｜｜";
const MARKERS = [DSML_OPEN, DSML_CLOSE] as const;
const MAX_MARKER_LENGTH = Math.max(...MARKERS.map(marker => marker.length));

export interface CodeBuddyScaffoldFilterResult {
  text: string;
  fail: string | null;
}

/** Longest suffix that may become an observed DSML marker after another stream delta. */
function heldSuffixLength(text: string): number {
  const limit = Math.min(MAX_MARKER_LENGTH - 1, text.length);
  for (let length = limit; length > 0; length--) {
    const suffix = text.slice(text.length - length).toLowerCase();
    if (MARKERS.some(marker => marker.startsWith(suffix))) return length;
  }
  return 0;
}

/**
 * Streaming fail-closed filter for one CodeBuddy text or reasoning channel (#4596).
 *
 * The CLI is intentionally launched without tools, so DSML cannot be a usable tool call here.
 * Reconstructing it would turn assistant text into execution authority. A marker can be split
 * across deltas, therefore the possible prefix tail is withheld until the next delta or terminal.
 */
export class CodeBuddyScaffoldFilter {
  private pending = "";
  private failed = false;

  push(chunk: string): CodeBuddyScaffoldFilterResult {
    if (this.failed || !chunk) return { text: "", fail: null };
    const buffer = this.pending + chunk;
    this.pending = "";
    const lowered = buffer.toLowerCase();

    let earliest = -1;
    let marker = "";
    for (const candidate of MARKERS) {
      const at = lowered.indexOf(candidate);
      if (at >= 0 && (earliest < 0 || at < earliest)) {
        earliest = at;
        marker = candidate;
      }
    }

    if (earliest >= 0) {
      this.failed = true;
      // With an opener, text before the tag is a completed answer prefix. With only a closer,
      // that prefix may be the body of a tag whose opening arrived through another channel/frame.
      const text = marker === DSML_OPEN ? buffer.slice(0, earliest) : "";
      return { text, fail: "vendor DSML tool-call markup" };
    }

    const held = heldSuffixLength(buffer);
    if (held === 0) return { text: buffer, fail: null };
    this.pending = buffer.slice(buffer.length - held);
    return { text: buffer.slice(0, buffer.length - held), fail: null };
  }

  /** Release a suffix proven harmless by the terminal boundary. */
  flush(): CodeBuddyScaffoldFilterResult {
    if (this.failed) return { text: "", fail: null };
    const text = this.pending;
    this.pending = "";
    return { text, fail: null };
  }
}

function codeBuddyScaffoldErrorMessage(): string {
  return "CodeBuddy CLI emitted vendor tool-call markup in an assistant output channel. This route"
    + " runs the CLI with its own tools and MCP servers disabled and Codex owns tool control, so"
    + " the turn was refused rather than forwarding or executing vendor agent scaffolding.";
}

/** Guard both streamed channels without changing the shared coding-agent protocol parser. */
export function guardCodeBuddyScaffolding(emit: (event: AdapterEvent) => void): (event: AdapterEvent) => void {
  const textFilter = new CodeBuddyScaffoldFilter();
  const thinkingFilter = new CodeBuddyScaffoldFilter();
  let closed = false;

  const refuse = (): void => {
    if (closed) return;
    closed = true;
    emit({
      type: "error",
      message: codeBuddyScaffoldErrorMessage(),
      status: 502,
      errorType: "upstream_error",
      code: CODEBUDDY_SCAFFOLD_ERROR_CODE,
      retryable: false,
    });
  };

  return (event: AdapterEvent): void => {
    if (closed) return;
    if (event.type === "text_delta" || event.type === "thinking_delta") {
      const filter = event.type === "text_delta" ? textFilter : thinkingFilter;
      const cleaned = filter.push(event.type === "text_delta" ? event.text : event.thinking);
      if (cleaned.text) {
        emit(event.type === "text_delta"
          ? { ...event, text: cleaned.text }
          : { ...event, thinking: cleaned.text });
      }
      if (cleaned.fail) refuse();
      return;
    }
    if (event.type === "done" || event.type === "error" || event.type === "incomplete") {
      const textTail = textFilter.flush();
      const thinkingTail = thinkingFilter.flush();
      if (textTail.text) emit({ type: "text_delta", text: textTail.text });
      if (thinkingTail.text) emit({ type: "thinking_delta", thinking: thinkingTail.text });
      closed = true;
      emit(event);
      return;
    }
    emit(event);
  };
}
