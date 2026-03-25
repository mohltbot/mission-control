# Browserbase CLI Integration

**Source:** Ben's Bites March 24, 2026 - "Agents should interview you"  
**Tool:** Browserbase CLI (`@browserbasehq/cli`)

## What is Browserbase?

Browserbase provides managed browser infrastructure for AI agents. The CLI gives you command-line access to:
- Web scraping with JavaScript execution
- Screenshots and PDF generation
- Session management
- Stealth mode for bot protection

## Installation

```bash
# Run the setup script
./scripts/setup-browserbase-cli.sh

# Or install manually
npm install -g @browserbasehq/cli
```

## Configuration

Set your API key:
```bash
export BROWSERBASE_API_KEY=your_key_here
```

Get your key from: https://browserbase.com/settings

## Usage Examples

### Scrape a webpage
```bash
browserbase scrape https://example.com
```

### Take a screenshot
```bash
browserbase screenshot https://example.com --output screenshot.png
```

### Run JavaScript on a page
```bash
browserbase scrape https://example.com --evaluate "document.title"
```

### Use with OpenClaw
```bash
# In your OpenClaw agent
browserbase scrape "$URL" --format markdown > page-content.md
```

## Integration with OpenClaw

Add to your agent's tools:
```json
{
  "tools": {
    "browserbase": {
      "enabled": true,
      "apiKey": "${BROWSERBASE_API_KEY}"
    }
  }
}
```

## Use Cases

1. **Data extraction** — Scrape structured data from websites
2. **Monitoring** — Take periodic screenshots of dashboards
3. **Research** — Gather information from multiple sources
4. **Testing** — Validate web apps in real browsers

## Cost

- Free tier: 100 sessions/month
- Paid: $0.10 per session
- See: https://browserbase.com/pricing

## Documentation

- Full docs: https://docs.browserbase.com/
- CLI reference: `browserbase --help`
