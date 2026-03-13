#!/bin/zsh
# Fix Ben's Bites Discord webhook configuration
# Diagnoses and fixes Discord notification issues

WORKSPACE="/Users/mohlt/.openclaw/workspace"
LOGS_DIR="$WORKSPACE/mc-temp/logs"

echo "🔧 Ben's Bites Discord Diagnostics"
echo "=================================="
echo ""

# Check 1: Verify Discord token is set
echo "1️⃣ Checking Discord Token..."
if [ -z "$DISCORD_TOKEN" ]; then
  # Try to load from common locations
  if [ -f "$WORKSPACE/.env" ]; then
    export $(grep -v '^#' "$WORKSPACE/.env" | xargs) 2>/dev/null
  fi
  if [ -f "$WORKSPACE/config/.env" ]; then
    export $(grep -v '^#' "$WORKSPACE/config/.env" | xargs) 2>/dev/null
  fi
fi

if [ -n "$DISCORD_TOKEN" ]; then
  echo "   ✅ DISCORD_TOKEN is set"
  TOKEN_PREVIEW="${DISCORD_TOKEN:0:10}...${DISCORD_TOKEN: -5}"
  echo "   📝 Token preview: $TOKEN_PREVIEW"
else
  echo "   🔴 DISCORD_TOKEN is NOT set"
  echo "   💡 Fix: Add DISCORD_TOKEN to your .env file or environment"
fi
echo ""

# Check 2: Verify channel ID
echo "2️⃣ Checking Channel Configuration..."
CHANNEL_ID="1476778520171643090"
echo "   📝 Channel ID: $CHANNEL_ID"
echo "   💡 This should be the #work-session-briefs channel"
echo ""

# Check 3: Test Discord API connection
echo "3️⃣ Testing Discord API..."
if [ -n "$DISCORD_TOKEN" ]; then
  RESPONSE=$(curl -s -w "\n%{http_code}" -H "Authorization: Bot $DISCORD_TOKEN" \
    "https://discord.com/api/v10/users/@me" 2>/dev/null)
  HTTP_CODE=$(echo "$RESPONSE" | tail -1)
  
  if [ "$HTTP_CODE" = "200" ]; then
    BOT_NAME=$(echo "$RESPONSE" | head -1 | grep -o '"username":"[^"]*"' | cut -d'"' -f4)
    echo "   ✅ API connection successful (Bot: $BOT_NAME)"
  else
    echo "   🔴 API connection failed (HTTP $HTTP_CODE)"
    echo "   💡 Check if token is valid and bot is not rate-limited"
  fi
else
  echo "   ⚠️  Skipping API test (no token)"
fi
echo ""

# Check 4: Check error logs
echo "4️⃣ Checking Error Logs..."
if [ -f "$LOGS_DIR/bensbites-fri-error.log" ]; then
  echo "   📄 Found bensbites-fri-error.log:"
  tail -5 "$LOGS_DIR/bensbites-fri-error.log" | sed 's/^/      /'
else
  echo "   ✅ No error log found"
fi
echo ""

# Check 5: Verify script permissions
echo "5️⃣ Checking Script Permissions..."
NOTIFY_SCRIPT="$WORKSPACE/mc-temp/scripts/notify-bensbites.sh"
if [ -f "$NOTIFY_SCRIPT" ]; then
  if [ -x "$NOTIFY_SCRIPT" ]; then
    echo "   ✅ notify-bensbites.sh is executable"
  else
    echo "   ⚠️  notify-bensbites.sh is not executable"
    echo "   💡 Fix: chmod +x $NOTIFY_SCRIPT"
  fi
else
  echo "   🔴 notify-bensbites.sh not found"
fi
echo ""

# Summary and recommendations
echo "=================================="
echo "📋 Summary & Recommendations:"
echo ""

if [ -z "$DISCORD_TOKEN" ]; then
  echo "🔴 CRITICAL: DISCORD_TOKEN not configured"
  echo "   → Add to ~/.zshrc or ~/.bash_profile:"
  echo "     export DISCORD_TOKEN='your-bot-token-here'"
  echo ""
fi

echo "✅ To test Discord notifications manually:"
echo "   DISCORD_TOKEN='your-token' ./mc-temp/scripts/notify-bensbites.sh"
echo ""
echo "✅ To fix the Ben's Bites scanner:"
echo "   1. Ensure DISCORD_TOKEN is exported in the environment"
echo "   2. Verify the bot has permission to post in channel $CHANNEL_ID"
echo "   3. Run the scanner manually to test: ./mc-temp/scripts/bensbites-scanner.sh"
echo ""
