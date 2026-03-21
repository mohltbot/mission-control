# Context7 & Context Hub Skills

Documentation tools for AI coding agents - fetch curated docs and annotate them for future use.

## Overview

Context7 (MCP-based) and Context Hub (Andrew Ng's project) provide up-to-date documentation access for AI agents. Essential for keeping agents informed about latest API changes and best practices.

## Why It Fits Mohammed's Stack

- **Multiple APIs**: Mohammed uses Moonshot, DeepSeek, Qwen, MiniMax, Tavily, etc.
- **Rapid Changes**: API documentation updates frequently, agents need current info
- **Coding Agents**: ACP harness (Codex, Claude Code) needs accurate API docs
- **Self-Improving**: Context Hub allows feedback to doc authors, improving docs for everyone

## Tools Included

### 1. Context7 CLI
MCP-based documentation fetcher with CLI interface.

### 2. Context Hub (Andrew Ng)
Fetch curated documentation with annotation and feedback capabilities.

### 3. Autocontext
Self-improving agent system that learns from task iterations.

## Installation

```bash
# Context7
npm install -g context7

# Context Hub
git clone https://github.com/andrewyng/context-hub.git
cd context-hub && pip install -e .

# Autocontext
git clone https://github.com/greyhaven-ai/autocontext.git
cd autocontext && pip install -r requirements.txt
```

## Configuration

```json
{
  "documentation": {
    "providers": [
      {
        "name": "context7",
        "enabled": true,
        "mcpServer": "context7-mcp"
      },
      {
        "name": "context-hub",
        "enabled": true,
        "feedbackEnabled": true
      }
    ],
    "autoUpdate": true,
    "updateInterval": "daily",
    "cachePath": "~/.openclaw/docs-cache"
  }
}
```

## Usage

### Context7
```bash
# Fetch documentation for a library
context7 fetch openai --version latest

# Query documentation
context7 query "How do I use function calling with GPT-4?"

# Update all cached docs
context7 update --all
```

### Context Hub
```bash
# Fetch curated docs
context-hub fetch --topic "AI APIs" --format markdown

# Annotate documentation
context-hub annotate --doc-id "openai-api" --rating up --comment "Great examples"

# Submit feedback to doc authors
context-hub feedback --doc-id "anthropic-api" --type improvement --message "Clarify rate limits"
```

### Autocontext
```bash
# Run self-improving task
autocontext run --task "Create a React component for data tables" --iterations 5

# Review improvements
autocontext review --session-id <id>
```

## Integration with Mohammed's APIs

### Pre-configured Documentation Sources
```yaml
# context7-sources.yaml
sources:
  - name: moonshot-api
    url: https://platform.moonshot.cn/docs
    updateFrequency: weekly
    priority: high

  - name: deepseek-api
    url: https://api-docs.deepseek.com/
    updateFrequency: weekly
    priority: high

  - name: qwen-api
    url: https://help.aliyun.com/zh/dashscope/
    updateFrequency: weekly
    priority: medium

  - name: tavily-api
    url: https://docs.tavily.com/
    updateFrequency: weekly
    priority: medium

  - name: openai-api
    url: https://platform.openai.com/docs
    updateFrequency: daily
    priority: high

  - name: anthropic-api
    url: https://docs.anthropic.com/
    updateFrequency: daily
    priority: high

  - name: n8n-api
    url: https://docs.n8n.io/
    updateFrequency: weekly
    priority: medium

  - name: discord-api
    url: https://discord.com/developers/docs
    updateFrequency: monthly
    priority: low
```

## OpenClaw Integration

Add to agent prompts:

```
Before writing code that uses external APIs:
1. Use context7 to fetch latest documentation
2. Verify API endpoints and parameters
3. Check for recent changes or deprecations
4. Use context-hub to find best practices
```

## Commands Reference

| Command | Description |
|---------|-------------|
| `context7 fetch <lib>` | Fetch docs for a library |
| `context7 query <q>` | Query fetched documentation |
| `context7 list` | List available sources |
| `context-hub fetch` | Fetch curated docs |
| `context-hub annotate` | Add annotation to docs |
| `context-hub feedback` | Send feedback to authors |
| `autocontext run` | Run self-improving task |
| `autocontext review` | Review improvement iterations |

## Relevance to Active Projects

1. **ArchTrack**: Keep up with React/Node.js/PostgreSQL best practices
2. **Siegfried AI Advisory**: Current API docs for client integrations
3. **VC Portfolio Agentification**: n8n workflow documentation
4. **OpenClaw Debugger**: Accurate troubleshooting info

## Resources

- **Context7**: MCP server for documentation
- **Context Hub**: https://github.com/andrewyng/context-hub
- **Autocontext**: https://github.com/greyhaven-ai/autocontext
- **Ben's Bites Reference**: March 17, 2026 Newsletter

## Status

- **Implementation**: Skill definition created
- **Integration**: Pending MCP server setup
- **Testing**: Requires API key configuration
