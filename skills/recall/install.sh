#!/bin/bash
# Recall Skill Installation Script
# Installs the recall skill for Claude Code memory persistence

set -e

echo "🔧 Installing Recall Skill for Claude Code..."

# Check if Claude Code is installed
if ! command -v claude &> /dev/null; then
    echo "❌ Claude Code not found. Please install first: https://code.claude.com"
    exit 1
fi

# Create skill directory
mkdir -p ~/.claude/skills/recall

# Download the skill from GitHub
echo "📥 Downloading recall skill..."
curl -fsSL https://raw.githubusercontent.com/arjunkmrm/recall/main/recall.js -o ~/.claude/skills/recall/recall.js || {
    echo "⚠️  Could not download from GitHub, using local implementation..."
    cat > ~/.claude/skills/recall/recall.js << 'SKILLEOF'
// Recall Skill - Local Implementation
// Enables conversation history search for Claude Code

const fs = require('fs');
const path = require('path');

class RecallSkill {
  constructor() {
    this.conversationsDir = path.join(process.env.HOME, '.claude', 'conversations');
    this.indexPath = path.join(process.env.HOME, '.claude', 'recall-index.json');
  }

  async search(query, options = {}) {
    const { limit = 5, sessionOnly = false } = options;
    
    // Load conversation index
    const index = await this.loadIndex();
    
    // Simple keyword search (can be enhanced with embeddings)
    const results = index
      .filter(conv => this.matchesQuery(conv, query))
      .slice(0, limit);
    
    return results;
  }

  matchesQuery(conversation, query) {
    const searchTerms = query.toLowerCase().split(' ');
    const content = (conversation.summary + ' ' + conversation.content).toLowerCase();
    return searchTerms.some(term => content.includes(term));
  }

  async loadIndex() {
    if (!fs.existsSync(this.indexPath)) {
      return [];
    }
    return JSON.parse(fs.readFileSync(this.indexPath, 'utf8'));
  }

  async indexConversation(sessionId, messages) {
    const index = await this.loadIndex();
    
    const summary = this.generateSummary(messages);
    const entry = {
      sessionId,
      timestamp: new Date().toISOString(),
      summary,
      content: messages.map(m => m.content).join('\n').slice(0, 5000)
    };
    
    // Update or add entry
    const existingIdx = index.findIndex(e => e.sessionId === sessionId);
    if (existingIdx >= 0) {
      index[existingIdx] = entry;
    } else {
      index.push(entry);
    }
    
    fs.writeFileSync(this.indexPath, JSON.stringify(index, null, 2));
  }

  generateSummary(messages) {
    // Extract key topics from first user message
    const firstUserMsg = messages.find(m => m.role === 'user');
    if (firstUserMsg) {
      return firstUserMsg.content.slice(0, 100) + '...';
    }
    return 'No summary available';
  }
}

module.exports = RecallSkill;
SKILLEOF
}

# Create skill manifest
cat > ~/.claude/skills/recall/manifest.json << 'MANIFESTEOF'
{
  "name": "recall",
  "version": "1.0.0",
  "description": "Search over past Claude Code conversations",
  "author": "arjunkmrm (adapted for Ghost Shift)",
  "entry": "recall.js",
  "permissions": ["read_conversations", "write_index"]
}
MANIFESTEOF

echo "✅ Recall skill installed successfully!"
echo ""
echo "📝 To enable in Claude Code, add to your config:"
echo "   claude config set skills.recall.enabled true"
echo ""
echo "🔍 Usage: Claude will automatically search past sessions when needed"
