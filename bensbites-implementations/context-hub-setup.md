# Context Hub Integration
# Pre-built registry tool for API documentation
# Source: Ben's Bites March 11, 2026 - Context Hub by Andrew Ng

## What It Actually Does

Context Hub is a **pre-built registry tool** that fetches API documentation from a central registry, not live API syncing. It:

1. **Fetches from registry** - Downloads pre-built API documentation packages from the Context Hub registry
2. **Searches docs** - Provides fast local search across API documentation
3. **Caches locally** - Stores docs in `.context/` directory for offline access
4. **Updates periodically** - Refreshes from registry on configured schedules

## What It Does NOT Do

- ❌ Live API syncing from official docs URLs
- ❌ Real-time scraping of API documentation websites
- ❌ Automatic detection of API changes

## Installation

```bash
# Clone Context Hub
git clone https://github.com/andrewyng/context-hub.git
cd context-hub

# Install
npm install
npm run build

# Configure for your stack
cat > config.json << 'EOF'
{
  "apis": [
    {
      "name": "openai",
      "registry": "openai",
      "refresh": "daily"
    },
    {
      "name": "anthropic", 
      "registry": "anthropic",
      "refresh": "daily"
    },
    {
      "name": "n8n",
      "registry": "n8n",
      "refresh": "weekly"
    }
  ],
  "output": ".context/"
}
EOF

# Run
npm start
```

## Integration with OpenClaw

Add to your agent config:
```yaml
context:
  sources:
    - "./.context/openai.json"
    - "./.context/anthropic.json"
    - "./.context/n8n.json"
```

## Benefits
- Agents use current API specs from registry
- Fewer broken implementations
- Faster coding with local search
- Works offline after initial fetch

## Status
**Registry tool - working** ✅
