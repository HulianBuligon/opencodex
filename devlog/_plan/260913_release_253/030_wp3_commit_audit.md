# wp3 — 364-commit regression audit (devin/swe-2 parallel subagents)

## Design

364 commits (origin/main..981b53e7d0110591f4fbdf4751fade1801645860,
chronological via `git rev-list --reverse origin/main..981b53e7d0`) split
into 14 slices of 26 plus one security-boundary lane = 15 subagents (first
wave devin/swe-2; 6 rate-limited lanes retried on xai/grok-4.6 after the user
added it to the parallel pool). The two audit-spawned fixes #4496/#4497
(commits 4b0a62b215/248670e9f0, 9b9675b202/eb81eaaf8d) are a NAMED POST-WINDOW
DELTA: covered by their own PR CI, CodeRabbit, and the Aquinas post-merge
review — not claimed as covered by the 364-commit lane audit.
Subagents share the parent worktree read-only: prompts forbid edits, commits,
branch-level git ops, fetches, and any local suite/build/typecheck run.

## Lane map (sed ranges over the rev-list)

- lane01 1-26, lane02 27-52, lane03 53-78, lane04 79-104, lane05 105-130,
  lane06 131-156, lane07 157-182, lane08 183-208, lane09 209-234,
  lane10 235-260, lane11 261-286, lane12 287-312, lane13 313-338,
  lane14 339-364.
- security: .github/, release/version-line scripts, consent/token surfaces,
  secret-logging scan over the whole main..dev diff.

## Dispatched agents (2026-09-13, model devin/swe-2, effort high)

| Lane | Range | Agent id | Nickname | Verdict |
|------|-------|----------|----------|---------|
| lane01 | 1-26 | retry 01a09a34-dbdc-7eb2-b137-1711b3cb70c6 | Galileo (grok-4.6) | 3 FINDINGS (highest P2) — P2: 533d578286 raw reasoning no longer rewritten to reasoning_summary (intentional revert per structure notes; desktop thinking-band placeholder vs 2.52.0 for statelessResponses CoT; disposition at synthesis) |
| lane02 | 27-52 | retry 01a09a35-b97c-70d2-b2ff-70065fbe7f15 | Mencius (grok-4.6) | CLEAN |
| lane03 | 53-78 | 01a09a14-623f-7f33-b651-d47331526fd2 | Newton | 3 FINDINGS (highest P2) — P2: vision describer eligibility ignores operator modelCapabilities for native models (eligibility.ts:159); maintainer disposition at synthesis |
| lane04 | 79-104 | retry 01a09a34-ddc3-7d11-9024-ff1fc6d3df85 | Helmholtz (grok-4.6) | CLEAN |
| lane05 | 105-130 | 01a09a14-6318-72a2-befe-231e982666d6 | Rawls | CLEAN |
| lane06 | 131-156 | 01a09a14-64cd-73f0-89ef-207d9f7448b8 | Lorentz | 4 FINDINGS (highest P3) — effectively clean |
| lane07 | 157-182 | 01a09a14-65d9-7b62-aa13-49c27a2bf50b | Darwin | 2 FINDINGS (highest P3) — effectively clean |
| lane08 | 183-208 | 01a09a14-66c1-7983-8659-0cce941244d6 | Curie | CLEAN (1 P3 note: audio-upstream 401 folding, fail-closed, convention-consistent) |
| lane09 | 209-234 | retry 01a09a35-ba54-7953-8384-99ec3c8d853d | Heisenberg (grok-4.6) | running |
| lane10 | 235-260 | 01a09a14-6894-7e80-958e-40b38c3d6fff | Bacon | 3 FINDINGS (highest P1) — P1 CONFIRMED by maintainer: pre-opened sideband never clears the 10s liveConnectTimer (index.ts:744 armed, :813 clear unreachable on preOpened path); regression introduced by 321b9b1cd1 (not on main); no test coverage. Two P3 notes. |
| lane11 | 261-286 | 01a09a14-6961-73f2-993a-d462f23de459 | Feynman | 1 FINDING (P3 only: stale OPENCODEX_DEVIN_TTFB_MS env name) — effectively clean |
| lane12 | 287-312 | retry 01a09a34-e07e-75a0-8385-923b13902120 | Copernicus (grok-4.6) | CLEAN |
| lane13 | 313-338 | retry 01a09a35-bb3a-7fd0-9edd-a22780cf3c4f | Goodall (grok-4.6) | running |
| lane14 | 339-364 | 01a09a14-6b02-7311-a647-1aa7bb0992e6 | Hooke | CLEAN |
| security | boundary diff | 01a09a14-6cd8-7231-991a-7902a46c6dab | Fermat | 3 FINDINGS (highest P3) — .github/, release scripts, consent surfaces have ZERO diff main..dev; no secret/body logging; boundary effectively clean |

Roadmap reviewer (wp1 A-gate): 01a09a17-18f0-7422-82a6-c3e55c5827e4 (Descartes)
— near-pass, findings folded into 040/050.

## Fix lanes spawned from audit findings

- wp3fix (lane10 P1): PR #4496 fix(live) sideband connect watchdog — MERGED to
  dev as 248670e9f0 (maintainer integration, all required checks green on
  4b0a62b215). Promoted-tree SHA updates to the post-#4497 dev head.
- wp6 (user-reported, Aside/Pi screenshots): root-caused via live probes —
  chat inbound dropped Pi-style {type:"image", data, mimeType} tool parts.
  PR #4497 fix(chat) image part shapes — open, CI pending. Note: lane03's P2
  (vision describer eligibility asymmetry) is a SEPARATE issue, dispositioned
  at synthesis; it is not the cause of the user report.

## Synthesis rule

- Collect every lane verdict. P0/P1 findings are release blockers: maintainer
  re-verifies each against origin/dev source (file:line), then either fixes
  (new work-phase amendment, user-informed) or reports to the user before any
  promotion. P2 findings are re-verified by the maintainer and dispositioned
  accept/fix. P3 are notes.
- REVIEW-SYNTHESIS-01: accept/rebut each finding with evidence; no silent
  drops.

## Acceptance

- 15/15 verdicts collected; synthesis written with dispositions; zero
  unresolved P0/P1 before wp4.
