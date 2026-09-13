# wp3fix + wp6 record (executed under direct user authorization, evidence complete)

Both fixes were implemented and merged ahead of their goalplan cycles because
they blocked the release; this record closes the bookkeeping.

## wp3fix — live sideband connect watchdog (lane10 P1)

- User decision (async question, 2026-09-13 ~18:40 KST): fix PR to dev, merge,
  promote the fixed tree.
- PR #4496 (branch codex/260913-live-sideband-connect-timer, commit
  4b0a62b215): fix + regression test; all required checks green; maintainer
  integration record on the PR; MERGED 248670e9f0. Post-merge dev CI success
  (34750539996). Independent post-merge review Aquinas: pass.

## wp6 — Aside/Pi screenshot blindness (user-reported)

- Root-caused by live probes against the running proxy: chat inbound
  (src/chat/inbound.ts) silently dropped {type:"image", data, mimeType} tool
  parts (Pi read_file screenshots); standard shapes verified working.
- PR #4497 (branch codex/260913-chat-tool-image-parts, commit 9b9675b202):
  normalize Pi/MCP + Anthropic source image parts; 5 regression cases; all
  required checks green; maintainer integration record; MERGED eb81eaaf8d.
  Post-merge dev CI success (34750934849). Aquinas: pass.
- Live re-verification after user-authorized dogfood pull + service restart
  (pid 44175): the exact previously-blind probe shape is now described
  correctly by claude-opus-5 (prompt_tokens 128 -> 181).
