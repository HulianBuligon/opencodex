# wp4 — preview promotion and preview publish

## Preconditions

- wp2 deployable verdict, wp3 zero unresolved P0/P1, green exact-head hosted CI
  on 981b53e7d0 (or the then-current dev head if dev moved; re-verify SHA).

## Procedure (exact commands, run from a scratch worktree, NOT this session's)

1. `git fetch origin`; record dev SHA as DEV_SHA.
2. `git worktree add /tmp/ocx-rel-2530-preview origin/preview --detach`
3. In scratch: `git switch -c codex/release-2530-preview-20260913`
4. `git merge --no-commit --no-ff -X theirs origin/dev || true`
5. `git restore --source=origin/dev --staged --worktree -- .` (tree := dev)
6. Set package.json version to 2.53.0-preview.20260913 (matching the preview
   channel pattern 2.52.0-preview.20260912).
7. Commit: "release: promote verified 2.53.0-preview.20260913 product tree to
   preview" with body naming DEV_SHA, the audit evidence, and NOT RUN local
   suite disclosure.
8. `git push --no-verify origin codex/release-2530-preview-20260913`
9. Open PR to preview (full template: Summary/Verification/Checklist; note
   local suite NOT RUN, hosted exact-head CI evidence).
10. Wait hosted CI on the PR head; merge (owner admin, PR-only ruleset).
11. Dispatch release.yml on branch preview: version 2.53.0-preview.20260913,
    tag preview, expected-sha=<preview merge commit>, dry-run=false.
12. Verify: `npm view @bitkyc08/opencodex dist-tags` shows preview
    2.53.0-preview.20260913.

## Acceptance

- Preview PR merged with exact-head hosted CI green; npm preview dist-tag
  updated; evidence recorded.
