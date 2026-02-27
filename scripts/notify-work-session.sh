#!/bin/zsh
# Post work session summary to Discord
# Runs after nightly/afternoon work sessions

CHANNEL_ID="1476778734085476433"
WORKSPACE="/Users/mohlt/.openclaw/workspace"

# Get latest task updates
COMPLETED_TASKS=$(cd "$WORKSPACE" && git log --oneline --since="6 hours ago" --grep="completed\|merged" | wc -l)
CURRENT_BUDGET=$(curl -s http://localhost:3000/api/expenses 2>/dev/null | grep -o '"monthlySpend":[0-9.]*' | cut -d':' -f2 || echo "unknown")

curl -X POST "https://discord.com/api/v10/channels/$CHANNEL_ID/messages" \
  -H "Authorization: Bot $DISCORD_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"content\":\"🌙 **Work Session Complete**\n\n✅ Tasks Completed: $COMPLETED_TASKS\n💰 Budget Used Today: \$$CURRENT_BUDGET\n📝 PRs Created: Check GitHub\n\nNext session: 2:00 AM PST\"}"
