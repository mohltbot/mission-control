#!/bin/bash
# git-autopush.sh (scoped) — commits and pushes scoped workspace changes.
# only ever stage these paths — protects personal dirs from leaking.
export PATH="/opt/homebrew/bin:/usr/local/bin:/opt/homebrew/sbin:/usr/bin:/bin:/usr/sbin:/sbin"
set -uo pipefail
WS="/Users/main/openclaw archive/workspace"
LOG="$WS/logs/git-autopush.log"
mkdir -p "$(dirname "$LOG")"
cd "$WS" || exit 1
{
  echo ""
  echo "=== $(date '+%Y-%m-%d %H:%M:%S') ==="
  SCOPED=(business bensbites-implementations mission-control.md scripts/git-autopush.sh .gitignore arch-firm-dashboard)
  for p in "${SCOPED[@]}"; do
    [ -e "$p" ] && git add "$p" 2>/dev/null
  done
  # belt-and-suspenders: unstage protected paths
  for p in lenny-data lenny-second-brain USER.md config tools prompt-guard .git-credentials .npm-cache discord-report-2026-04-08.txt; do
    git reset HEAD -- "$p" 2>/dev/null
    git rm -rf --cached "$p" 2>/dev/null
  done
  if git diff --cached --quiet; then
    echo "(no changes)"
  else
    git commit -m "chore(auto): sync workspace changes [$(date '+%Y-%m-%d %H:%M:%S')]" 2>&1
    branch=$(git branch --show-current)
    if [ "$branch" = "main" ]; then
      git push origin main 2>&1 || echo "(push failed, retry next tick)"
    else
      echo "(not on main — skipping push; on: $branch)"
    fi
  fi
} >> "$LOG" 2>&1
