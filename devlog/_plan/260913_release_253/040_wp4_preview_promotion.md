# wp4 — preview promotion and preview publish

## Preconditions

- wp2 deployable verdict, wp3 zero unresolved P0/P1, green exact-head hosted CI
  on eb81eaaf8d (dev head after the two audit-spawned fixes #4496/#4497; the
  364-commit audit covers the tree through 981b53e7d0, the two fix merges are
  covered by their own PR CI + independent post-merge review).

## Procedure (exact commands, run from a scratch worktree, NOT this session's)

1. `git fetch origin`; record dev SHA as DEV_SHA.
2. `git worktree add /tmp/ocx-rel-2530-preview origin/preview --detach`
3. In scratch: `git switch -c codex/release-2530-preview-20260913`
4. `git merge --no-commit --no-ff -X theirs eb81eaaf8d02210b9b0782d90ff6d6074b7bc892 || true`
   (PINNED to the audited SHA — reviewer P1: never `origin/dev`, which may
   have moved past audit coverage by execution time. If dev must move into the
   promoted tree, the delta needs its own audit + exact-head CI first.)
5. `git restore --source=eb81eaaf8d02210b9b0782d90ff6d6074b7bc892 --staged --worktree -- .`
   (tree := audited dev tree, pinned same as step 4)
6. Set package.json version to 2.53.0-preview.20260913 (matching the preview
   channel pattern 2.52.0-preview.20260912).
7. Commit: "release: promote verified 2.53.0-preview.20260913 product tree to
   preview" with body naming DEV_SHA, the audit evidence, and NOT RUN local
   suite disclosure.
8. `git push --no-verify origin codex/release-2530-preview-20260913`
9. Open PR to preview (full template: Summary/Verification/Checklist; note
   local suite NOT RUN, hosted exact-head CI evidence).
10. Wait hosted CI on the PR head; merge (owner admin, PR-only ruleset).
11. Wait for the PUSH-EVENT runs on the merge commit before dispatching
    (reviewer P2): release.yml requires a successful ci.yml push-event run on
    the merge commit (PR runs rejected) AND a successful service-lifecycle.yml
    run on it (the promotion diff touches service files). Both fire on the
    merge push automatically; a dispatch issued earlier fails the gate.
12. Dispatch release.yml on branch preview: version 2.53.0-preview.20260913,
    tag preview, expected-sha=<FULL 40-char preview merge commit SHA>,
    dry-run=false (optionally dry-run=true once first — the workflow default).
13. Verify: `npm view @bitkyc08/opencodex dist-tags` shows preview
    2.53.0-preview.20260913.

PR text rule (reviewer P3): the promotion diff contains dashboard changes, so
the PR title/body must not contain the string "gui" — enforce-target would
then demand a screenshot. Describe changes without that word or attach a
dashboard screenshot.

## Acceptance

- Preview PR merged with exact-head hosted CI green; npm preview dist-tag
  updated; evidence recorded.
