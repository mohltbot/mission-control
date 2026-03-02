#!/bin/bash
# Quick Task Creator - Add tasks to Mission Control from CLI
# Usage: ./quick-task.sh "Task Title" "Description" high|medium|low category

TITLE="${1:-New Task}"
DESC="${2:-No description}"
PRIORITY="${3:-medium}"
CATEGORY="${4:-general}"

curl -s http://localhost:3000/api/tasks \
  -X POST \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"$TITLE\",
    \"description\": \"$DESC\",
    \"status\": \"pending\",
    \"priority\": \"$PRIORITY\",
    \"category\": \"$CATEGORY\"
  }" | jq '{id, title, status}'

echo "✅ Task added to Mission Control"
