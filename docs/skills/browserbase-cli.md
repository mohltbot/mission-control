---
name: browserbase-cli
emoji: 🌐
description: Browserbase CLI integration for serverless browser automation
---

# Browserbase CLI Skill

Serverless browser automation using the Browserbase CLI.

## Prerequisites

- Node.js 18+
- Browserbase account and API key
- `@browserbasehq/cli` installed globally

## Setup

```bash
# Install the CLI
npm install -g @browserbasehq/cli

# Configure API key
export BROWSERBASE_API_KEY=your_api_key_here
```

Or use the setup script:
```bash
./scripts/setup-browserbase-cli.sh all
```

## Usage Examples

### Scrape a Webpage
```bash
browserbase scrape https://example.com
```

### Take a Screenshot
```bash
browserbase screenshot https://example.com --output screenshot.png
```

### List Sessions
```bash
browserbase sessions list
```

### Run Automation Script
```bash
browserbase run path/to/script.js
```

## Wrapper Scripts

Use the convenience wrappers in `scripts/browserbase-wrappers/`:

```bash
# Scrape to file
./scripts/browserbase-wrappers/scrape.sh https://example.com output.html

# Take screenshot
./scripts/browserbase-wrappers/screenshot.sh https://example.com page.png

# Run automation
./scripts/browserbase-wrappers/automate.sh script.js
```

## Resources

- Browserbase SKILL.md: https://www.browserbase.com/SKILL.md
- CLI Documentation: https://docs.browserbase.com/
- Source: Ben's Bites March 24, 2026
