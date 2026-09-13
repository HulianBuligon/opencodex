# wp5 — dev version pre-move, main promotion, npm 2.53.0 publish

## Preconditions

- wp4 complete (preview published), green exact-head CI on the dev head that
  includes the version pre-move merge.

## Procedure

1. Dev version line pre-move: dispatch dev-version-bump.yml from the default
   branch (main) with intended-version=2.53.0, mode=pre-move. Merge the PR it
   opens (expected: dev 2.53.0 -> 2.54.0). release.yml refuses publish until
   dev outranks 2.53.0, so this merge must land first.
2. Confirm dev head post-merge; green exact-head hosted CI on that head is
   required if the promoted tree differs from the audited tree. The bump PR
   touches package.json only; if it changes anything else, stop and
   re-evaluate.
3. Main promotion in a fresh scratch worktree (same recipe as wp4 INCLUDING
   the SHA pinning: merge and restore use
   eb81eaaf8d02210b9b0782d90ff6d6074b7bc892, never origin/dev; branch off
   origin/main, branch name codex/release-2530-main, package.json version
   2.53.0, tree = audited dev product tree):
   - The promoted product tree stays eb81eaaf8d (audited tree 981b53e7d0 plus
     the two reviewed fix merges). The version pre-move on dev does not enter
     the product tree; 2.52.0 used the same shape (dev was already 2.53.0 when
     2.52.0 shipped).
   - Commit "release: promote verified 2.53.0 product tree to main", push
     --no-verify, PR to main, wait hosted CI, merge.
4. Publish: wait for the push-event ci.yml AND service-lifecycle.yml successes
   on the main merge commit (reviewer P2, same gate as wp4), then dispatch
   release.yml on branch main with version=2.53.0, tag=latest,
   expected-sha=<FULL 40-char main merge commit SHA>, dry-run=false.
5. Post-release verification: npm dist-tags latest=2.53.0; Release run green;
   dev post-merge CI state recorded honestly (queued/in-progress is reported
   as such, not claimed green).
6. Close-out: final report with all evidence pointers; devlog unit -> _fin
   only after terminal outcome is recorded.

## Acceptance

- main merged with exact-head hosted CI green; npm latest=2.53.0; release run
  success; goalplan criteria met with captured evidence.
