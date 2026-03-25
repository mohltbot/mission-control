# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Examples

```markdown
### Cameras

- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH

- home-server → 192.168.1.100, user: admin

### TTS

- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

## Browserbase CLI

**Source:** Ben's Bites March 24, 2026 - "Agents should interview you"
**Status:** ✅ Script Created, ⚠️ Needs API Key Configuration

### What It Is
Serverless browser automation platform with CLI for web scraping, screenshots, and automation. Ben highlighted this as a tool where you can just tell your agent: "Read browserbase.com/SKILL.md and set up Browserbase"

### Installation & Setup
```bash
# Run the setup script
./scripts/setup-browserbase-cli.sh all

# Or manually:
npm install -g @browserbasehq/cli
export BROWSERBASE_API_KEY=your_api_key_here
```

### Common Commands
```bash
# Scrape a webpage
browserbase scrape https://example.com

# Take a screenshot
browserbase screenshot https://example.com --output screenshot.png

# List active sessions
browserbase sessions list

# Run automation script
browserbase run automation.js
```

### Wrapper Scripts
Located in `scripts/browserbase-wrappers/` (created by setup script):
- `scrape.sh` - Simple URL scraping
- `screenshot.sh` - Screenshot capture
- `automate.sh` - Run automation scripts

### API Key Setup
1. Get API key from: https://www.browserbase.com/settings
2. Set environment variable: `export BROWSERBASE_API_KEY=xxx`
3. Run: `./scripts/setup-browserbase-cli.sh configure`

---

Add whatever helps you do your job. This is your cheat sheet.
