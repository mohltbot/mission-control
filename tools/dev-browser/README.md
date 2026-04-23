# dev-browser Integration

> From Ben's Bites (March 26, 2026): CLI tool that lets AI agents control browsers with sandboxed JavaScript scripts.

## What is dev-browser?

A browser automation tool by Sawyer Hood that allows AI agents to write and execute JavaScript to control browsers. It provides a sandboxed execution environment using QuickJS WASM.

**Key Features:**
- Sandboxed execution (QuickJS WASM - no host access)
- Persistent pages - navigate once, interact across multiple scripts
- Auto-connect to running Chrome or launch fresh Chromium
- Full Playwright API (goto, click, fill, locators, screenshots)

## Installation

```bash
npm install -g dev-browser
dev-browser install  # installs Playwright + Chromium
```

## Usage Examples

### Basic Headless Usage
```bash
dev-browser --headless <<'EOF'
const page = await browser.getPage("main");
await page.goto("https://example.com");
console.log(await page.title());
EOF
```

### Connect to Running Chrome
```bash
# Enable remote debugging in Chrome: chrome://inspect/#remote-debugging
dev-browser --connect <<'EOF'
const tabs = await browser.listPages();
console.log(JSON.stringify(tabs, null, 2));
EOF
```

## Claude Code Integration

Add to `.claude/settings.json` in your project root to pre-approve:

```json
{
  "permissions": {
    "allow": [
      "Bash(dev-browser *)"
    ]
  }
}
```

Or globally in `~/.claude/settings.json`.

## Why This Fits Our Stack

- Already using Browserbase and Puppeteer for browser automation
- dev-browser provides a lighter, CLI-first approach for quick agent tasks
- Sandboxed execution is safer for automated agent workflows
- Complements existing Firecrawl skills

## Links

- GitHub: https://github.com/sawyerhood/dev-browser
- By: Sawyer Hood / Do Browser (https://dobrowser.io)
