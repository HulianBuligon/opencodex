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

## Acceptance

- Evaluation note appended to this unit (or final report) answering
  "deployable? yes/no/with-conditions" with the evidence pointers above.
