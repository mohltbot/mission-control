# Lossless Claw Memory Plugin

OpenClaw memory plugin built on top of Shopify CEO's QMD (Query-Model-Data) tool. Provides persistent memory capabilities for OpenClaw agents.

## Overview

Lossless Claw adds long-term memory to OpenClaw agents, allowing them to remember context across sessions, learn from past interactions, and provide more personalized assistance over time.

## Why It Fits Mohammed's Stack

- **Memory Gap**: Mohammed noted he "still hasn't got memory right" - this directly addresses that
- **Cross-Session Context**: Maintains continuity between Ghost Shifts and work sessions
- **Project Context**: Remembers details about ArchTrack, Siegfried work, VC portfolio
- **Personal Context**: Retains information about preferences, goals, and ongoing tasks

## Installation

```bash
# Clone the repository
git clone https://github.com/martian-engineering/lossless-claw.git
cd lossless-claw

# Install dependencies
npm install

# Build the plugin
npm run build

# Install to OpenClaw
npm run install:openclaw
```

## Configuration

```json
{
  "memory": {
    "provider": "lossless-claw",
    "config": {
      "storagePath": "~/.openclaw/memory/lossless",
      "maxTokens": 100000,
      "retentionDays": 365,
      "compressionEnabled": true,
      "encryptionEnabled": true
    }
  }
}
```

## Features

1. **Semantic Memory Search**
   - Query past interactions by meaning, not just keywords
   - Automatic relevance scoring
   - Context-aware retrieval

2. **Hierarchical Memory**
   - Short-term (session) memory
   - Medium-term (daily) memory  
   - Long-term (persistent) memory
   - Project-specific memory banks

3. **Smart Forgetting**
   - Automatic pruning of irrelevant data
   - Importance scoring
   - Configurable retention policies

4. **Cross-Project Learning**
   - Pattern recognition across different projects
   - Solution reuse suggestions
   - Anti-pattern warnings

## Usage

### Store Memory
```javascript
// Agent stores important context
memory.store({
  type: "project_decision",
  project: "ArchTrack",
  content: "Decided to use DigitalOcean for deployment due to cost",
  importance: "high",
  tags: ["deployment", "infrastructure", "archtrack"]
});
```

### Retrieve Memory
```javascript
// Agent recalls relevant context
const memories = await memory.recall({
  query: "What deployment platform did we choose for ArchTrack?",
  limit: 5,
  minRelevance: 0.7
});
```

### Search Memory
```bash
# CLI search
lossless-claw search "deployment decisions" --project ArchTrack --limit 10
```

## Integration with Mohammed's Workflow

### Ghost Shift Continuity
```javascript
// At start of Ghost Shift
const yesterdayContext = await memory.recall({
  query: "What was I working on yesterday",
  timeRange: "1d"
});
```

### Project Context
```javascript
// When switching to ArchTrack
const archtrackContext = await memory.recall({
  query: "current status and blockers",
  project: "ArchTrack",
  limit: 10
});
```

### Learning from Past Mistakes
```javascript
// Automatic anti-pattern detection
memory.on("pattern-match", (pattern) => {
  if (pattern.type === "previous_failure") {
    console.warn("This approach failed before:", pattern.context);
  }
});
```

## Memory Schema

```typescript
interface Memory {
  id: string;
  timestamp: Date;
  type: "decision" | "action" | "observation" | "error" | "insight";
  project?: string;
  content: string;
  importance: "low" | "medium" | "high" | "critical";
  tags: string[];
  embedding?: number[];
  ttl?: number; // Time to live in seconds
}
```

## OpenClaw Integration

Add to `~/.openclaw/config.json`:

```json
{
  "plugins": [
    {
      "name": "lossless-claw",
      "enabled": true,
      "config": {
        "storagePath": "~/.openclaw/memory",
        "embeddingModel": "text-embedding-3-small",
        "vectorStore": "chroma"
      }
    }
  ]
}
```

## Commands

| Command | Description |
|---------|-------------|
| `lossless-claw store <content>` | Store a memory |
| `lossless-claw recall <query>` | Recall memories by query |
| `lossless-claw search <query>` | Semantic search |
| `lossless-claw prune` | Remove old/low-importance memories |
| `lossless-claw export` | Export memories to JSON |
| `lossless-claw stats` | Show memory statistics |

## Relevance to Active Projects

1. **Mission Control**: Maintains state between 4-hour syncs and Ghost Shifts
2. **ArchTrack**: Remembers deployment decisions, employee configurations
3. **Siegfried AI Advisory**: Retains client context, project requirements
4. **OpenClaw Debugger**: Learns from debugging patterns, solution reuse

## Resources

- **GitHub**: https://github.com/martian-engineering/lossless-claw
- **Shopify QMD**: Based on Shopify CEO's Query-Model-Data architecture
- **Ben's Bites Reference**: March 17, 2026 Newsletter

## Status

- **Implementation**: Skill definition and setup script created
- **Integration**: Pending OpenClaw plugin installation
- **Testing**: Requires local vector store setup (Chroma/Milvus)
