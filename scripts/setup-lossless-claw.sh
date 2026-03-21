#!/bin/bash
# Lossless Claw Memory Plugin Setup
# Ben's Bites Implementation - March 17, 2026

set -e

echo "🧠 Setting up Lossless Claw memory plugin for OpenClaw..."

# Configuration
LOSSLESS_DIR="$HOME/.lossless-claw"
CONFIG_DIR="$HOME/.openclaw"
REPO_URL="https://github.com/martian-engineering/lossless-claw.git"

# Create directories
mkdir -p "$LOSSLESS_DIR"
mkdir -p "$CONFIG_DIR/memory"
mkdir -p "$CONFIG_DIR/logs"

# Clone repository if not exists
if [ ! -d "$LOSSLESS_DIR/repo" ]; then
    echo "📥 Cloning Lossless Claw repository..."
    git clone "$REPO_URL" "$LOSSLESS_DIR/repo"
else
    echo "📥 Updating Lossless Claw repository..."
    cd "$LOSSLESS_DIR/repo" && git pull
fi

# Install dependencies
echo "📦 Installing dependencies..."
cd "$LOSSLESS_DIR/repo"
npm install --silent

# Build the plugin
echo "🔨 Building plugin..."
npm run build

# Create OpenClaw configuration
echo "⚙️  Creating OpenClaw configuration..."
cat > "$CONFIG_DIR/lossless-claw-config.json" << 'EOF'
{
  "plugins": [
    {
      "name": "lossless-claw",
      "enabled": true,
      "config": {
        "storagePath": "~/.openclaw/memory/lossless",
        "vectorStore": {
          "type": "chroma",
          "path": "~/.openclaw/memory/vectors"
        },
        "embedding": {
          "model": "text-embedding-3-small",
          "provider": "openai"
        },
        "memory": {
          "maxTokens": 100000,
          "retentionDays": 365,
          "compressionEnabled": true,
          "compressionThreshold": 0.7
        },
        "projects": [
          {
            "name": "ArchTrack",
            "priority": "high",
            "retentionMultiplier": 2.0
          },
          {
            "name": "Siegfried AI Advisory",
            "priority": "high",
            "retentionMultiplier": 1.5
          },
          {
            "name": "OpenClaw Debugger",
            "priority": "medium",
            "retentionMultiplier": 1.0
          },
          {
            "name": "VC Portfolio Agentification",
            "priority": "medium",
            "retentionMultiplier": 1.0
          }
        ]
      }
    }
  ]
}
EOF

# Create wrapper scripts
echo "📝 Creating wrapper scripts..."

# Store memory wrapper
cat > "$CONFIG_DIR/scripts/memory-store.sh" << 'EOF'
#!/bin/bash
# Store a memory in Lossless Claw

CONTENT="$1"
PROJECT="${2:-general}"
IMPORTANCE="${3:-medium}"

if [ -z "$CONTENT" ]; then
    echo "Usage: memory-store.sh <content> [project] [importance]"
    exit 1
fi

cd "$HOME/.lossless-claw/repo"
node dist/cli.js store "$CONTENT" --project "$PROJECT" --importance "$IMPORTANCE"
EOF

# Recall memory wrapper
cat > "$CONFIG_DIR/scripts/memory-recall.sh" << 'EOF'
#!/bin/bash
# Recall memories from Lossless Claw

QUERY="$1"
LIMIT="${2:-5}"

if [ -z "$QUERY" ]; then
    echo "Usage: memory-recall.sh <query> [limit]"
    exit 1
fi

cd "$HOME/.lossless-claw/repo"
node dist/cli.js recall "$QUERY" --limit "$LIMIT"
EOF

# Search memory wrapper
cat > "$CONFIG_DIR/scripts/memory-search.sh" << 'EOF'
#!/bin/bash
# Search memories in Lossless Claw

QUERY="$1"
PROJECT="${2:-}"

if [ -z "$QUERY" ]; then
    echo "Usage: memory-search.sh <query> [project]"
    exit 1
fi

PROJECT_FLAG=""
if [ -n "$PROJECT" ]; then
    PROJECT_FLAG="--project $PROJECT"
fi

cd "$HOME/.lossless-claw/repo"
node dist/cli.js search "$QUERY" $PROJECT_FLAG
EOF

# Make scripts executable
chmod +x "$CONFIG_DIR/scripts/memory-store.sh"
chmod +x "$CONFIG_DIR/scripts/memory-recall.sh"
chmod +x "$CONFIG_DIR/scripts/memory-search.sh"

# Create daily memory maintenance script
cat > "$CONFIG_DIR/scripts/memory-maintenance.sh" << 'EOF'
#!/bin/bash
# Daily memory maintenance for Lossless Claw

echo "🧠 Running memory maintenance..."

cd "$HOME/.lossless-claw/repo"

# Prune old memories
node dist/cli.js prune --older-than 365 --importance-below medium

# Export backup
BACKUP_DIR="$HOME/.openclaw/backups/memory"
mkdir -p "$BACKUP_DIR"
node dist/cli.js export > "$BACKUP_DIR/memory-$(date +%Y%m%d).json"

# Show stats
node dist/cli.js stats

echo "✅ Memory maintenance complete"
EOF

chmod +x "$CONFIG_DIR/scripts/memory-maintenance.sh"

# Create systemd/cron entry for maintenance
echo "⏰ Setting up daily maintenance cron job..."
(crontab -l 2>/dev/null | grep -v "memory-maintenance" || true) | crontab -
(crontab -l 2>/dev/null; echo "0 2 * * * $CONFIG_DIR/scripts/memory-maintenance.sh >> $CONFIG_DIR/logs/memory-maintenance.log 2>&1") | crontab -

echo ""
echo "✅ Lossless Claw setup complete!"
echo ""
echo "Next steps:"
echo "1. Add to OpenClaw config: $CONFIG_DIR/lossless-claw-config.json"
echo "2. Review memory settings and project priorities"
echo "3. Test: memory-store.sh 'Test memory' ArchTrack high"
echo ""
echo "Wrapper scripts:"
echo "  - memory-store.sh <content> [project] [importance]"
echo "  - memory-recall.sh <query> [limit]"
echo "  - memory-search.sh <query> [project]"
echo "  - memory-maintenance.sh (runs daily at 2 AM)"
echo ""
echo "Documentation: skills/lossless-claw/SKILL.md"
