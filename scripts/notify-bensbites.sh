#!/bin/zsh
# Post Ben's Bites summary to Discord
# Runs after Ben's Bites scan

CHANNEL_ID="1476778520171643090"
LOG_FILE="/Users/mohlt/.openclaw/workspace/logs/bensbites.log"

if [ -f "$LOG_FILE" ]; then
  SUMMARY=$(tail -50 "$LOG_FILE" | grep -E "(Found|Implement|HIGH|Completed)" | tail -10)
  
  curl -X POST "https://discord.com/api/v10/channels/$CHANNEL_ID/messages" \
    -H "Authorization: Bot $DISCORD_TOKEN" \
    -H "Content-Type: application/json" \
    -d "{\"content\":\"📰 **Ben's Bites Scan Complete**\n\n$SUMMARY\"}"
fi
