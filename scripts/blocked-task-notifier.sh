#!/bin/bash
# Blocked Task Notifier
# Sends Discord notifications for blocked tasks that need user attention
# Run this via cron: 0 9,17 * * * /Users/mohlt/.openclaw/workspace/scripts/blocked-task-notifier.sh

set -e

# Config
DISCORD_WEBHOOK_URL="${DISCORD_WEBHOOK_URL:-}"
MISSION_CONTROL_URL="https://github.com/mohltbot/mission-control/blob/main/mission-control.md"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"

# Colors for terminal output
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo "🔔 Blocked Task Notifier"
echo "========================"
echo ""

# Check if Discord webhook is configured
if [ -z "$DISCORD_WEBHOOK_URL" ]; then
    echo -e "${YELLOW}⚠️  DISCORD_WEBHOOK_URL not set${NC}"
    echo "   Set it with: export DISCORD_WEBHOOK_URL='your-webhook-url'"
    echo ""
fi

# Current blocked tasks (from mission-control.md)
# These are manually synced - update this section when blockers change
BLOCKED_TASKS=(
    "Ben's Bites Discord - DISCORD_TOKEN not set in environment"
    "Mission Control Dashboard - Server removed in cleanup, needs revival decision"
    "ArchTrack Deployment - Needs server credentials or cloud provider selection"
)

# Format message for Discord
format_discord_message() {
    local timestamp=$(date '+%Y-%m-%d %H:%M %Z')
    local message="🚨 **Blocked Task Reminder** - $timestamp

The following tasks need your attention:

"
    
    for i in "${!BLOCKED_TASKS[@]}"; do
        local num=$((i + 1))
        message+="${num}. **${BLOCKED_TASKS[$i]}**
"
    done
    
    message+="
📋 **[View Mission Control Board]($MISSION_CONTROL_URL)**

💡 **Quick Actions:**
• For Discord token: Run \`./scripts/fix-bensbites-discord.sh\` to diagnose
• For ArchTrack: Decide on local server vs cloud VPS
• For Dashboard: Review revival plan in docs/"
    
    echo "$message"
}

# Send to Discord
send_discord_notification() {
    if [ -z "$DISCORD_WEBHOOK_URL" ]; then
        echo -e "${RED}❌ Cannot send Discord notification - webhook URL not configured${NC}"
        return 1
    fi
    
    local message=$(format_discord_message)
    
    curl -s -X POST "$DISCORD_WEBHOOK_URL" \
        -H "Content-Type: application/json" \
        -d "{\"content\": $(echo "$message" | jq -Rs .)}" > /dev/null
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Discord notification sent${NC}"
        return 0
    else
        echo -e "${RED}❌ Failed to send Discord notification${NC}"
        return 1
    fi
}

# Terminal output
echo "Current Blocked Tasks:"
echo "----------------------"
for i in "${!BLOCKED_TASKS[@]}"; do
    local num=$((i + 1))
    echo -e "${RED}${num}. ${BLOCKED_TASKS[$i]}${NC}"
done

echo ""
echo "Total: ${#BLOCKED_TASKS[@]} blocked tasks"
echo ""

# Send notification if webhook is configured
if [ -n "$DISCORD_WEBHOOK_URL" ]; then
    send_discord_notification
else
    echo -e "${YELLOW}ℹ️  Discord webhook not configured - notification not sent${NC}"
    echo "   To enable notifications, set DISCORD_WEBHOOK_URL environment variable"
    echo ""
    echo "Formatted message that would be sent:"
    echo "-------------------------------------"
    format_discord_message
fi

echo ""
echo "✨ Done! Run with DISCORD_WEBHOOK_URL set to enable notifications."
