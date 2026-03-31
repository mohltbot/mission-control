#!/bin/bash
# git-autopush.sh — Auto-commit and push workspace changes to GitHub
# Runs every 5 minutes via launchd on the Mac Mini

WORKSPACE="/Users/main/openclaw archive/workspace"
LOG="/Users/main/openclaw archive/workspace/logs/git-autopush.log"
DATE=$(date '+%Y-%m-%d %H:%M:%S')

cd "$WORKSPACE" || exit 1

# Check if there are any changes to commit
if git diff --quiet && git diff --cached --quiet && [ -z "$(git ls-files --others --exclude-standard)" ]; then
    exit 0
fi

# Configure identity (needed for commits)
git config user.email "mohltbot10@gmail.com"
git config user.name "Mohammed Wasif"

# Pull latest first to avoid conflicts
git pull origin main --rebase --quiet 2>>"$LOG"

# Stage all changes
git add -A

# Commit with timestamp
git commit -m "chore(auto): sync workspace changes [$DATE]" 2>>"$LOG"

# Push
if git push origin main 2>>"$LOG"; then
    echo "[$DATE] ✅ Pushed successfully" >>"$LOG"
else
    echo "[$DATE] ❌ Push failed" >>"$LOG"
fi
