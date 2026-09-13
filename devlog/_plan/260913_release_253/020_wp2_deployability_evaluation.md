# wp2 — deployability evaluation

## Scope

IN: read-only verification commands. OUT: code changes, merges, dispatches
other than the already-authorized CI rerun on the exact dev head.

## Checks and evidence

1. npm channel state: `npm view @bitkyc08/opencodex dist-tags --json`
   (baseline: latest 2.52.0, preview 2.52.0-preview.20260912).
2. dev version line: package.json on origin/dev = 2.53.0. release.yml asserts
   `version-line.ts assert-ahead <dev_version> 2.53.0`, so publish requires
   dev > 2.53.0 — wp5 dispatches dev-version-bump.yml intended-version=2.53.0
   mode=pre-move and merges the resulting PR before main promotion.
3. dev exact-head hosted CI: rerun of run 34748869199 on 981b53e7d0 must end
   success. Cancelled/skipped runs are not evidence. Service lifecycle run
   34748834841 (6aaab49f6) is green but stale; only the exact head counts.
4. Security-boundary inventory: diff origin/main..origin/dev over .github/,
   scripts/release.ts, scripts/version-line.ts, src/cli/agent-driven.ts,
   src/cli/star-prompt.ts, src/server/management/ — covered by the security
   subagent lane in wp3; wp2 records the file list.
5. Open-PR collision check: `gh pr list --state open` for existing
   codex/release-2530-* branches or in-flight promotions.

## Evaluation result (2026-09-13 KST)

1. npm: latest 2.52.0, preview 2.52.0-preview.20260912 (npm view, 2026-09-13).
2. Version line: dev=2.53.0. Stable 2.53.0 publish requires dev-version-bump
   pre-move to 2.54.0 before main promotion; preview 2.53.0-preview.20260913
   needs no pre-move (dev 2.53.0 already outranks the prerelease) — confirmed
   against release.yml assert-ahead and the roadmap reviewer.
3. Exact-head hosted CI: run 34748869199 on 981b53e7d0 = SUCCESS (rerun of the
   concurrency-cancelled run; same SHA, push-event jobs green). Precondition
   met.
4. Security boundary: zero diff main..dev in .github/, scripts/release.ts,
   scripts/version-line.ts, src/cli/agent-driven.ts, src/cli/star-prompt.ts
   (security lane Fermat, verified). 12 management-route files changed; audit
   found 3 P3 notes only, no credential/body logging additions.
5. Promotion collision: no open codex/release-2530-* branch or PR; 40 open
   dev-targeted PRs do not interact with a promotion of a fixed dev head.

VERDICT: DEPLOYABLE WITH ONE CONDITION — the wp3-confirmed P1 regression
(live sideband 10s forced close on the pre-opened path, 321b9b1cd1) must be
fixed or explicitly accepted by the maintainer before promotion. User
decision requested 2026-09-13 (fix-and-proceed recommended).
