#!/bin/bash
# Context7 and Context Hub Setup Script
# Ben's Bites Implementation - March 17, 2026

set -e

echo "📚 Setting up Context7 and Context Hub documentation tools..."

# Configuration
CONFIG_DIR="$HOME/.openclaw"
TOOLS_DIR="$HOME/.openclaw/tools"

# Create directories
mkdir -p "$TOOLS_DIR"
mkdir -p "$CONFIG_DIR/docs-cache"
mkdir -p "$CONFIG_DIR/logs"

echo "📦 Installing Context7..."
# Context7 via npm
npm install -g context7 2>/dev/null || echo "Context7 npm install failed, will use direct method"

echo "📦 Installing Context Hub..."
# Context Hub
if [ ! -d "$TOOLS_DIR/context-hub" ]; then
    git clone https://github.com/andrewyng/context-hub.git "$TOOLS_DIR/context-hub"
else
    cd "$TOOLS_DIR/context-hub" && git pull
fi
cd "$TOOLS_DIR/context-hub"
pip install -e . --quiet 2>/dev/null || echo "Context Hub pip install may require manual setup"

echo "📦 Installing Autocontext..."
# Autocontext
if [ ! -d "$TOOLS_DIR/autocontext" ]; then
    git clone https://github.com/greyhaven-ai/autocontext.git "$TOOLS_DIR/autocontext"
else
    cd "$TOOLS_DIR/autocontext" && git pull
fi
cd "$TOOLS_DIR/autocontext"
pip install -r requirements.txt --quiet 2>/dev/null || echo "Autocontext dependencies may require manual setup"

echo "⚙️  Creating configuration files..."

# Context7 sources configuration
cat > "$CONFIG_DIR/context7-sources.yaml" << 'EOF'
# Context7 Documentation Sources
# Auto-generated from Ben's Bites implementation

sources:
  - name: moonshot-api
    url: https://platform.moonshot.cn/docs
    updateFrequency: weekly
    priority: high
    category: llm

  - name: deepseek-api
    url: https://api-docs.deepseek.com/
    updateFrequency: weekly
    priority: high
    category: llm

  - name: qwen-api
    url: https://help.aliyun.com/zh/dashscope/
    updateFrequency: weekly
    priority: medium
    category: llm

  - name: minimax-api
    url: https://www.minimaxi.com/documentation
    updateFrequency: weekly
    priority: medium
    category: llm

  - name: tavily-api
    url: https://docs.tavily.com/
    updateFrequency: weekly
    priority: medium
    category: search

  - name: openai-api
    url: https://platform.openai.com/docs
    updateFrequency: daily
    priority: high
    category: llm

  - name: anthropic-api
    url: https://docs.anthropic.com/
    updateFrequency: daily
    priority: high
    category: llm

  - name: n8n-api
    url: https://docs.n8n.io/
    updateFrequency: weekly
    priority: medium
    category: automation

  - name: discord-api
    url: https://discord.com/developers/docs
    updateFrequency: monthly
    priority: low
    category: messaging

  - name: react-docs
    url: https://react.dev/
    updateFrequency: weekly
    priority: high
    category: frontend

  - name: nodejs-docs
    url: https://nodejs.org/docs/latest/api/
    updateFrequency: monthly
    priority: medium
    category: backend

  - name: postgresql-docs
    url: https://www.postgresql.org/docs/current/
    updateFrequency: monthly
    priority: medium
    category: database

settings:
  cachePath: ~/.openclaw/docs-cache
  updateInterval: daily
  maxCacheAge: 30d
  parallelFetches: 3
EOF

# Create wrapper scripts
echo "📝 Creating wrapper scripts..."

# Context7 wrapper
cat > "$CONFIG_DIR/scripts/context7-fetch.sh" << 'EOF'
#!/bin/bash
# Fetch documentation using Context7

SOURCE="$1"

if [ -z "$SOURCE" ]; then
    echo "Usage: context7-fetch.sh <source-name>"
    echo "Available sources:"
    cat ~/.openclaw/context7-sources.yaml | grep "name:" | sed 's/.*name: /  - /'
    exit 1
fi

echo "📚 Fetching documentation for: $SOURCE"
context7 fetch "$SOURCE" --config ~/.openclaw/context7-sources.yaml
EOF

# Context7 query wrapper
cat > "$CONFIG_DIR/scripts/context7-query.sh" << 'EOF'
#!/bin/bash
# Query documentation using Context7

QUERY="$1"
SOURCE="${2:-}"

if [ -z "$QUERY" ]; then
    echo "Usage: context7-query.sh <query> [source]"
    exit 1
fi

SOURCE_FLAG=""
if [ -n "$SOURCE" ]; then
    SOURCE_FLAG="--source $SOURCE"
fi

echo "🔍 Querying documentation: $QUERY"
context7 query "$QUERY" $SOURCE_FLAG
EOF

# Context Hub fetch wrapper
cat > "$CONFIG_DIR/scripts/context-hub-fetch.sh" << 'EOF'
#!/bin/bash
# Fetch curated documentation using Context Hub

TOPIC="${1:-AI APIs}"

echo "📚 Fetching curated docs for topic: $TOPIC"
cd "$HOME/.openclaw/tools/context-hub"
python -m context_hub fetch --topic "$TOPIC" --format markdown
EOF

# Context Hub annotate wrapper
cat > "$CONFIG_DIR/scripts/context-hub-annotate.sh" << 'EOF'
#!/bin/bash
# Annotate documentation using Context Hub

DOC_ID="$1"
RATING="$2"
COMMENT="$3"

if [ -z "$DOC_ID" ] || [ -z "$RATING" ]; then
    echo "Usage: context-hub-annotate.sh <doc-id> <up|down> [comment]"
    exit 1
fi

echo "📝 Annotating documentation: $DOC_ID ($RATING)"
cd "$HOME/.openclaw/tools/context-hub"
python -m context_hub annotate --doc-id "$DOC_ID" --rating "$RATING" --comment "$COMMENT"
EOF

# Autocontext wrapper
cat > "$CONFIG_DIR/scripts/autocontext-run.sh" << 'EOF'
#!/bin/bash
# Run self-improving task using Autocontext

TASK="$1"
ITERATIONS="${2:-5}"

if [ -z "$TASK" ]; then
    echo "Usage: autocontext-run.sh <task-description> [iterations]"
    exit 1
fi

echo "🔄 Running autocontext with $ITERATIONS iterations..."
cd "$HOME/.openclaw/tools/autocontext"
python autocontext.py run --task "$TASK" --iterations "$ITERATIONS"
EOF

# Make scripts executable
chmod +x "$CONFIG_DIR/scripts/context7-fetch.sh"
chmod +x "$CONFIG_DIR/scripts/context7-query.sh"
chmod +x "$CONFIG_DIR/scripts/context-hub-fetch.sh"
chmod +x "$CONFIG_DIR/scripts/context-hub-annotate.sh"
chmod +x "$CONFIG_DIR/scripts/autocontext-run.sh"

# Create daily doc update cron
echo "⏰ Setting up daily documentation update..."
(crontab -l 2>/dev/null | grep -v "context7-update" || true) | crontab -
(crontab -l 2>/dev/null; echo "0 3 * * * cd $HOME/.openclaw && ./scripts/context7-update.sh >> $CONFIG_DIR/logs/context7-update.log 2>&1") | crontab -

# Create update script
cat > "$CONFIG_DIR/scripts/context7-update.sh" << 'EOF'
#!/bin/bash
# Daily documentation update

echo "📚 Updating documentation cache..."

# Update high priority sources
context7 update --source moonshot-api --source deepseek-api --source openai-api --source anthropic-api

echo "✅ Documentation update complete: $(date)"
EOF

chmod +x "$CONFIG_DIR/scripts/context7-update.sh"

# Create OpenClaw skill config
cat > "$CONFIG_DIR/context7-skill-config.json" << 'EOF'
{
  "skills": [
    {
      "name": "context7",
      "enabled": true,
      "config": {
        "sourcesPath": "~/.openclaw/context7-sources.yaml",
        "cachePath": "~/.openclaw/docs-cache",
        "autoFetch": true
      }
    },
    {
      "name": "context-hub",
      "enabled": true,
      "config": {
        "feedbackEnabled": true,
        "toolPath": "~/.openclaw/tools/context-hub"
      }
    }
  ],
  "prompts": {
    "beforeApiCall": [
      "Use context7 to verify API endpoint and parameters",
      "Check for recent API changes or deprecations"
    ],
    "beforeCoding": [
      "Query context-hub for best practices",
      "Check context7 for library documentation"
    ]
  }
}
EOF

echo ""
echo "✅ Context7 and Context Hub setup complete!"
echo ""
echo "Next steps:"
echo "1. Review sources: $CONFIG_DIR/context7-sources.yaml"
echo "2. Add to OpenClaw: $CONFIG_DIR/context7-skill-config.json"
echo "3. Test: context7-fetch.sh moonshot-api"
echo ""
echo "Wrapper scripts:"
echo "  - context7-fetch.sh <source-name>"
echo "  - context7-query.sh <query> [source]"
echo "  - context-hub-fetch.sh [topic]"
echo "  - context-hub-annotate.sh <doc-id> <up|down> [comment]"
echo "  - autocontext-run.sh <task> [iterations]"
echo ""
echo "Daily updates scheduled for 3 AM"
echo "Documentation: skills/context7-context-hub/SKILL.md"
