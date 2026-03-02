#!/bin/bash
# Git Quick Push - Commit and push with timestamp
# Usage: ./git-push.sh "commit message"

MSG="${1:-Auto commit $(date '+%Y-%m-%d %H:%M')}"

cd /Users/mohlt/.openclaw/workspace

git add -A
git commit -m "$MSG"
git push origin main

echo "✅ Pushed to GitHub: $(git log --oneline -1 | cut -d' ' -f1)"
