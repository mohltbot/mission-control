# Ben's Bites Discord Integration Setup Guide

Complete guide to fix the Discord notification issues for the Ben's Bites scanner.

## Problem Summary

The Ben's Bites scanner is failing to send Discord notifications because:
1. `DISCORD_TOKEN` environment variable is not set
2. Discord webhook URL may not be configured
3. Bot permissions may be incorrect

## Quick Fix (5 minutes)

### Step 1: Get Your Discord Bot Token

1. Go to https://discord.com/developers/applications
2. Click **"New Application"** → Name it "Ben's Bites Scanner"
3. Go to **Bot** section → Click **"Add Bot"**
4. Click **"Reset Token"** → Copy the token (starts with `MTAx`...)
5. **Keep this token secret!** Never commit it to git.

### Step 2: Set Environment Variable

**Option A: Temporary (current session only)**
```bash
export DISCORD_TOKEN='your-bot-token-here'
```

**Option B: Permanent (add to shell profile)**
```bash
# Add to ~/.zshrc or ~/.bash_profile
echo 'export DISCORD_TOKEN="your-bot-token-here"' >> ~/.zshrc
source ~/.zshrc
```

**Option C: Use a .env file (recommended for projects)**
```bash
# Create .env file in project root
echo "DISCORD_TOKEN=your-bot-token-here" > /Users/mohlt/.openclaw/workspace/.env
# Add .env to .gitignore!
echo ".env" >> /Users/mohlt/.openclaw/workspace/.gitignore
```

### Step 3: Invite Bot to Your Server

1. In Discord Developer Portal → **OAuth2** → **URL Generator**
2. Select scopes: **bot**
3. Select bot permissions:
   - Send Messages
   - Embed Links
   - Attach Files
   - Read Message History
4. Copy the generated URL and open it in browser
5. Select your server and authorize

### Step 4: Get Channel ID

1. In Discord, go to **Settings** → **Advanced** → Enable **Developer Mode**
2. Right-click your target channel → **Copy Channel ID**
3. Save this for the scanner configuration

### Step 5: Test the Integration

```bash
# Run the diagnostic script
./scripts/fix-bensbites-discord.sh

# Or test manually with curl
curl -H "Authorization: Bot $DISCORD_TOKEN" \
  https://discord.com/api/v10/channels/YOUR_CHANNEL_ID/messages \
  -d '{"content": "🧪 Test message from Ben'\''s Bites scanner"}' \
  -H "Content-Type: application/json"
```

## Alternative: Webhook Integration (Simpler)

If you don't need a full bot, use webhooks:

### Create Webhook
1. In Discord channel → **Settings** → **Integrations** → **Webhooks**
2. Click **"New Webhook"** → Name it "Ben's Bites"
3. Copy the webhook URL

### Configure Scanner
```bash
export DISCORD_WEBHOOK_URL="https://discord.com/api/webhooks/..."
```

### Test Webhook
```bash
curl -X POST "$DISCORD_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{"content": "🧪 Webhook test from Ben'\''s Bites"}'
```

## Troubleshooting

### "401 Unauthorized" Error
- Token is invalid or expired
- Solution: Regenerate token in Discord Developer Portal

### "403 Forbidden" Error
- Bot doesn't have permission to send messages
- Solution: Re-invite bot with correct permissions

### "404 Not Found" Error
- Channel ID is incorrect
- Solution: Re-copy channel ID with Developer Mode enabled

### Messages Not Sending
1. Check bot is online in Discord (should show as online/green)
2. Verify bot has access to the channel
3. Check channel permissions aren't blocking the bot
4. Look for rate limiting (Discord allows 5 messages/5 seconds)

## Security Best Practices

1. **Never commit tokens to git**
   ```bash
   # Add to .gitignore
   .env
   *.token
   config/secrets.json
   ```

2. **Use environment variables in production**
   ```bash
   # In your script
   DISCORD_TOKEN="${DISCORD_TOKEN:?Error: DISCORD_TOKEN not set}"
   ```

3. **Rotate tokens periodically**
   - Go to Discord Developer Portal
   - Reset token every 90 days
   - Update environment variable

4. **Limit bot permissions**
   - Only request permissions you actually need
   - Don't give Administrator unless absolutely necessary

## Automated Setup Script

Save this as `setup-discord.sh`:

```bash
#!/bin/bash
set -e

echo "🔧 Ben's Bites Discord Setup"
echo "============================="
echo ""

# Check if already configured
if [ -n "$DISCORD_TOKEN" ]; then
    echo "✅ DISCORD_TOKEN is already set"
    echo "   Testing connection..."
    
    if curl -s -H "Authorization: Bot $DISCORD_TOKEN" \
        https://discord.com/api/v10/users/@me > /dev/null; then
        echo "   ✅ Token is valid!"
        exit 0
    else
        echo "   ❌ Token appears invalid"
        echo ""
    fi
fi

echo "To set up Discord integration, you need:"
echo "1. A Discord bot token (from https://discord.com/developers/applications)"
echo "2. A channel ID where notifications will be sent"
echo ""

read -p "Enter your Discord bot token: " token
read -p "Enter your Discord channel ID: " channel

echo ""
echo "Testing configuration..."

# Test token
if curl -s -H "Authorization: Bot $token" \
    https://discord.com/api/v10/users/@me > /dev/null; then
    echo "✅ Token is valid"
else
    echo "❌ Token is invalid"
    exit 1
fi

# Test channel access
if curl -s -H "Authorization: Bot $token" \
    "https://discord.com/api/v10/channels/$channel" > /dev/null; then
    echo "✅ Channel access confirmed"
else
    echo "❌ Cannot access channel (check permissions)"
    exit 1
fi

# Save to .env
echo "DISCORD_TOKEN=$token" > .env
echo "DISCORD_CHANNEL_ID=$channel" >> .env
echo "" >> .env
echo "# Ben's Bites Discord Configuration" >> .env
echo "# Created: $(date)" >> .env

echo ""
echo "✅ Configuration saved to .env"
echo "   Add .env to your .gitignore!"
echo ""
echo "To use: source .env"
```

## Integration with Ben's Bites Scanner

The scanner script should read from environment:

```python
import os
import discord

DISCORD_TOKEN = os.getenv('DISCORD_TOKEN')
CHANNEL_ID = int(os.getenv('DISCORD_CHANNEL_ID', '0'))

if not DISCORD_TOKEN:
    print("❌ DISCORD_TOKEN not set. Run: export DISCORD_TOKEN='your-token'")
    exit(1)

# Initialize bot
client = discord.Client()

@client.event
async def on_ready():
    channel = client.get_channel(CHANNEL_ID)
    await channel.send("🚀 Ben's Bites scanner is online!")
    await client.close()

client.run(DISCORD_TOKEN)
```

## Next Steps

1. ✅ Set `DISCORD_TOKEN` environment variable
2. ✅ Invite bot to your server
3. ✅ Get channel ID
4. ✅ Run `./scripts/fix-bensbites-discord.sh` to verify
5. ✅ Update `mission-control.md` to mark Discord task as complete

## Resources

- [Discord Developer Portal](https://discord.com/developers/applications)
- [Discord Bot Documentation](https://discord.com/developers/docs/intro)
- [Discord.py Documentation](https://discordpy.readthedocs.io/)
- [Mission Control Board](https://github.com/mohltbot/mission-control/blob/main/mission-control.md)

---

*Last updated: March 13, 2026*
