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

Agent ids are recorded in the session store (audit_agents) and in the D
summary of this cycle.

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
