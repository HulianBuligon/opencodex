# 2.53.0 release audit and promotion — roadmap

## Objective

Evaluate whether origin/dev (981b53e7d0110591f4fbdf4751fade1801645860, package
version 2.53.0) is deployable, verify all 364 commits in origin/main..origin/dev
for regressions with parallel devin/swe-2 subagents, then promote to preview and
main and publish 2.53.0 to npm.

## Constraints (user-stated, binding)

- Local product suite/build/typecheck is FORBIDDEN. Record as NOT RUN. All CI
  evidence is hosted exact-head only.
- Every push uses --no-verify.
- Regression verdict comes from devin/swe-2 parallel subagents plus maintainer
  synthesis; unresolved P0/P1 findings block promotion.
- Release procedure follows MAINTAINERS.md + release.yml: dev version line must
  outrank 2.53.0 before publish (dev-version-bump.yml pre-move), promotion is
  PR-only (rulesets block direct pushes to main/preview).

## Current state (verified 2026-09-13, KST)

- origin/dev = 981b53e7d0 (364 commits ahead of origin/main 4d37c35155).
- origin/main carries 26 release-only commits; origin/preview 57. Both lines
  converge by promotion PR whose tree = dev + package.json version override.
- npm: latest 2.52.0, preview 2.52.0-preview.20260912.
- dev exact-head CI (run 34748869199) was cancelled by concurrency; rerun
  dispatched 2026-09-13 on the same SHA. Green exact-head CI is a promotion
  precondition.

## Loop-spec resource bounds (HOTL)

- Tool scope: local git read ops, gh CLI (repo lidge-jun/opencodex, owner
  lidge-jun), multi_agent_v1 subagents (devin/swe-2), hosted CI/workflow
  dispatch. No local bun test/typecheck/build.
- Write scope: this devlog unit + release branches codex/release-2530-*
  (scratch git worktree under /tmp), PRs to preview/main, release.yml
  dispatches. No source code changes.
- Wall-clock: audits ~1h; CI cycles bounded by hosted queue. Failure to obtain
  green exact-head CI or audit completion = BLOCKED, not DONE.

## Work-phase map (dependency order)

- wp1 (this cycle, docs-only): roadmap. Done when this unit is committed.
- wp2: deployability evaluation (010 range facts refresh: npm state, version
  line, dev exact-head CI, security-boundary diff inventory).
- wp3: 364-commit regression audit by 15 devin/swe-2 subagent lanes
  (14 chronological slices of 26 + 1 security-boundary lane) + synthesis.
- wp4: preview promotion PR + exact-head CI + merge + preview publish.
- wp5: dev version-line pre-move, main promotion PR + merge, npm 2.53.0
  publish, post-release verification.

Decade docs: 010 wp1, 020 wp2, 030 wp3, 040 wp4, 050 wp5.
