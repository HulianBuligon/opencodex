# wp3 — audit synthesis (15/15 verdicts, REVIEW-SYNTHESIS-01)

Every finding from every lane, with maintainer disposition. Independent
synthesis reviewer: Erdos (grok-4.6, 01a09a41-0593-7a90-8e5a-83bb19301b52),
VERDICT near-pass — its P1 (lanes 09/13 outstanding) resolved by their
arrival; its P2 process findings folded here (SHA pinning, post-window delta
naming, full P3 enumeration).

## Release blockers

None open. The two confirmed blockers were fixed and merged:

- lane10 P1 (pre-opened sideband 10s forced close): FIXED by #4496
  (4b0a62b215, merged 248670e9f0). Maintainer-verified at source, Erdos
  confirmed the claim/fix match, Aquinas post-merge pass. Post-merge dev CI
  success (run 34750539996).
- user-reported Aside/Pi screenshot blindness: root-caused by live probes to
  chat inbound dropping {type:"image", data, mimeType} tool parts; FIXED by
  #4497 (9b9675b202, merged eb81eaaf8d). Post-merge dev CI success (run
  34750934849, exact head eb81eaaf8d).

## P2 findings — dispositions

- lane01 533d578286 (raw reasoning no longer rewritten to reasoning_summary;
  desktop thinking-band placeholder for statelessResponses CoT vs 2.52.0):
  ACCEPT-INTENTIONAL — structure/providers/chat-compat.md documents the #45
  revert (260911) and the placeholder contract; Erdos verified. Release note
  candidate.
- lane03 d5d03f805c (vision describer eligibility ignores operator
  modelCapabilities on native rows, eligibility.ts:159): FOLLOW-UP ISSUE —
  real incomplete wiring of the new CLI overlay; not a 2.53 blocker (2.52 had
  no modelCapabilities overlay; noVisionModels still disqualifies;
  structure/config.md documents native legacy policy). Erdos concurs.
- lane09 4a49d7f344 (external live POSTs now routed via handleExternalLive,
  Location rewritten to rtc_ocx_*; clients reusing the upstream call id get
  404): ACCEPT-INTENTIONAL — documented remote voice contract; release note
  candidate.
- lane09 81f58a4cbd + 4a49d7f344 (audio-transcriptions.ts:120 and
  audio-live.ts:103 pre-set outcome=502 before body validation; malformed
  200 bodies record 502 and can cooldown a healthy ChatGPT account;
  handleLive records the real status): FOLLOW-UP ISSUE — telemetry/accounting
  defect with account-cooldown blast radius; narrow path, not promotion
  blocking.
- lane13 f7d9dbad (devin provider merge: detached rekey window + collision
  orphaning claim): DOWNGRADED to FOLLOW-UP ISSUE after maintainer
  verification — the request-time token path (resolveDevinToken:
  provider.apiKey -> forwarded Authorization -> env) never reads the OAuth
  slot, so the claimed "401s for the rest of the process" does not occur on
  the chat path. Residual real impact: resolveDevinApiServer host selection
  reads getCredential("devin"), so an EU/FedStart tenant between the
  synchronous config save and the detached rekey (or after a failed rekey,
  until next boot) falls back to the default US host; GUI login status is
  similarly stale in the same window. Self-healing, logged, retried on boot;
  collision path refuses by design. Not promotion blocking.

## P3 findings — accepted as notes (no action)

- lane06: muse alias wire-name-only restore narrowing; muse quota probe
  shared-signal abort backoff; device-grant Retry-After 60s clamp; mcp_call
  alias coverage. Bounded edges, fail-safe.
- lane07: dead signature_type surface; pre-deviceCode poll terminal-status
  delay. Cosmetic.
- lane08: audio-upstream ForwardAdmissionCredentialError folded to generic
  401. Fail-closed, convention-consistent.
- lane09: loopback live-route 401 tightening. Fail-closed hardening, tested.
- lane10: connect-pairing failure-mode coverage gap; cli-status retry mask
  risk. Test notes.
- lane11: stale OPENCODEX_DEVIN_TTFB_MS env name. Cosmetic.
- security lane: pairing-grant failure->429 mapping; api-access baseUrl
  assumption (codebase-wide convention); showCodexSparkQuota retirement
  contract drift (intentional, tested).
- lane01: google-antigravity showThinkingSummary seeding; cursor remint cap.
  Intentional.
- Aquinas: direct role:"tool" envelope fixture for the Pi image shape would
  tighten #4497 coverage (current coverage by composition). Folded into the
  follow-up test issue.

## Process notes

- lane02 was CLEAN while containing the P1 introducer 321b9b1cd1 — slice
  audits catch cross-file regressions only when a later lane rereads the
  file; the lane10 overlap is what caught it. Recorded as method limitation.
- 6 first-wave lanes (01/02/04/09/12/13) hit the SWE-2 rate limit; all were
  re-dispatched and completed on grok-4.6 after the user added it to the
  parallel pool. No slice is unaudited.

## Verdict

15/15 lanes closed, zero unresolved P0/P1. The dev tree at eb81eaaf8d (audit
tree + two reviewed fix merges, exact-head CI green) is cleared for wp4
promotion.

## Follow-up issues filed

- #4501 — vision describer eligibility ignores operator modelCapabilities on
  native rows (lane03 P2).
- #4502 — audio transcription/live-call outcome accounting pre-sets 502
  before body validation (lane09 P2 pair).
- #4503 — devin provider merge detached rekey host-selection window (lane13,
  downgraded) + direct tool-envelope fixture note for #4497 (Aquinas P3).
