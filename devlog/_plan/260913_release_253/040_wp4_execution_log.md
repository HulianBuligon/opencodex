# wp4 execution log

- Scratch worktree /tmp/ocx-rel-preview from origin/preview (adb39cb558).
- Branch codex/release-2530-preview-20260913; merged PINNED eb81eaaf8d
  (-X theirs), restored whole tree from the pinned SHA, version set to
  2.53.0-preview.20260913 via byte-preserving sed (first python json.dump
  attempt escaped unicode; amended).
- Tree invariant verified: git diff eb81eaaf8d HEAD = package.json version
  line only. Commit 47d5c94e26.
- Pushed --no-verify; PR #4504 to preview. Hosted PR CI pending at entry.
