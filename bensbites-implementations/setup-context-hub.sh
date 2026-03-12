#!/bin/bash
# Context Hub Automated Setup Script
# Clones, configures, and sets up Context Hub CLI for up-to-date API documentation
# Source: Ben's Bites March 11, 2026 - Context Hub by Andrew Ng

set -e

WORKSPACE="/Users/mohlt/.openclaw/workspace"
CONTEXT_HUB_DIR="$WORKSPACE/context-hub"

echo "🚀 Setting up Context Hub..."

# Step 1: Clone the repository if not exists
if [ -d "$CONTEXT_HUB_DIR" ]; then
    echo "📁 Context Hub already exists at $CONTEXT_HUB_DIR"
    echo "   Pulling latest changes..."
    cd "$CONTEXT_HUB_DIR"
    git pull origin main || git pull origin master || echo "   (Could not pull, using local version)"
else
    echo "📥 Cloning Context Hub repository..."
    git clone https://github.com/andrewyng/context-hub.git "$CONTEXT_HUB_DIR"
    cd "$CONTEXT_HUB_DIR"
fi

# Step 2: Install dependencies (including CLI workspace)
echo "📦 Installing dependencies..."
npm install
cd cli && npm install && cd ..

# Step 3: Create .context/ directory for custom documentation
echo "📂 Setting up .context/ directory..."
mkdir -p "$CONTEXT_HUB_DIR/.context"

# Step 4: Create a config.json for API sources (for future custom scraper)
echo "⚙️  Creating configuration..."
cat > "$CONTEXT_HUB_DIR/config.json" << 'EOF'
{
  "apis": [
    {
      "name": "openai",
      "url": "https://platform.openai.com/docs/api-reference",
      "refresh": "daily"
    },
    {
      "name": "anthropic",
      "url": "https://docs.anthropic.com/en/api/getting-started",
      "refresh": "daily"
    },
    {
      "name": "n8n",
      "url": "https://docs.n8n.io/api",
      "refresh": "weekly"
    }
  ],
  "output": ".context/"
}
EOF

# Step 5: Create a README in .context explaining the files
cat > "$CONTEXT_HUB_DIR/.context/README.md" << 'EOF'
# Context Hub Output Directory

This directory contains up-to-date API documentation.

## Files

- `openai.json` - OpenAI API documentation
- `anthropic.json` - Anthropic API documentation  
- `n8n.json` - n8n API documentation

## Usage with OpenClaw

Add to your agent config:
```yaml
context:
  sources:
    - "./context-hub/.context/openai.json"
    - "./context-hub/.context/anthropic.json"
    - "./context-hub/.context/n8n.json"
```

## Context Hub CLI Commands

```bash
# Search for documentation
./cli/bin/chub search <query>

# List available skills
./cli/bin/chub skills

# Get specific API docs
./cli/bin/chub get <api-name>
```
EOF

# Step 6: Create wrapper script for easy access
cat > "$CONTEXT_HUB_DIR/chub" << 'EOF'
#!/bin/bash
# Wrapper script for Context Hub CLI
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
"$SCRIPT_DIR/cli/bin/chub" "$@"
EOF
chmod +x "$CONTEXT_HUB_DIR/chub"

echo ""
echo "✅ Context Hub setup complete!"
echo ""
echo "📍 Location: $CONTEXT_HUB_DIR"
echo ""
echo "Quick start:"
echo "   cd $CONTEXT_HUB_DIR"
echo "   ./chub --help           # Show CLI help"
echo "   ./chub search openai    # Search OpenAI docs"
echo "   ./chub skills           # List available skills"
echo ""
echo "Configuration: $CONTEXT_HUB_DIR/config.json"
echo "Output directory: $CONTEXT_HUB_DIR/.context/"
