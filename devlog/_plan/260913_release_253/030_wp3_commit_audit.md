# wp3 — 364-commit regression audit (devin/swe-2 parallel subagents)

## Design

364 commits (origin/main..origin/dev, chronological via
`git rev-list --reverse origin/main..origin/dev`) split into 14 slices of 26
plus one security-boundary lane = 15 subagents, model devin/swe-2, effort high.
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
| lane01 | 1-26 | 01a09a14-60cf-7d43-b1c4-4aa281f121b0 | Pasteur | pending |
| lane02 | 27-52 | 01a09a14-618d-76d2-8865-a84a731edf1f | Faraday | ERROR: SWE-2 rate limit (resets ~31min) — re-dispatch scheduled |
| lane03 | 53-78 | 01a09a14-623f-7f33-b651-d47331526fd2 | Newton | 3 FINDINGS (highest P2) — P2: vision describer eligibility ignores operator modelCapabilities for native models (eligibility.ts:159); maintainer disposition at synthesis |
| lane04 | 79-104 | 01a09a14-63f0-7a72-822e-0a18a1454ca6 | Hume | ERROR: SWE-2 rate limit — re-dispatch scheduled |
| lane05 | 105-130 | 01a09a14-6318-72a2-befe-231e982666d6 | Rawls | CLEAN |
| lane06 | 131-156 | 01a09a14-64cd-73f0-89ef-207d9f7448b8 | Lorentz | 4 FINDINGS (highest P3) — effectively clean |
| lane07 | 157-182 | 01a09a14-65d9-7b62-aa13-49c27a2bf50b | Darwin | 2 FINDINGS (highest P3) — effectively clean |
| lane08 | 183-208 | 01a09a14-66c1-7983-8659-0cce941244d6 | Curie | CLEAN (1 P3 note: audio-upstream 401 folding, fail-closed, convention-consistent) |
| lane09 | 209-234 | 01a09a14-67ae-7b82-81e6-e248da5e1582 | Godel | pending |
| lane10 | 235-260 | 01a09a14-6894-7e80-958e-40b38c3d6fff | Bacon | 3 FINDINGS (highest P1) — P1 CONFIRMED by maintainer: pre-opened sideband never clears the 10s liveConnectTimer (index.ts:744 armed, :813 clear unreachable on preOpened path); regression introduced by 321b9b1cd1 (not on main); no test coverage. Two P3 notes. |
| lane11 | 261-286 | 01a09a14-6961-73f2-993a-d462f23de459 | Feynman | 1 FINDING (P3 only: stale OPENCODEX_DEVIN_TTFB_MS env name) — effectively clean |
| lane12 | 287-312 | 01a09a14-6a38-75d3-9a18-aa786f4c4b60 | Poincare | ERROR: SWE-2 rate limit — re-dispatch scheduled |
| lane13 | 313-338 | 01a09a14-6bef-7e51-805d-d6fdf478f8e0 | Boole | ERROR: SWE-2 rate limit — re-dispatch scheduled |
| lane14 | 339-364 | 01a09a14-6b02-7311-a647-1aa7bb0992e6 | Hooke | CLEAN |
| security | boundary diff | 01a09a14-6cd8-7231-991a-7902a46c6dab | Fermat | 3 FINDINGS (highest P3) — .github/, release scripts, consent surfaces have ZERO diff main..dev; no secret/body logging; boundary effectively clean |

Roadmap reviewer (wp1 A-gate): 01a09a17-18f0-7422-82a6-c3e55c5827e4 (Descartes)
— near-pass, findings folded into 040/050.

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
