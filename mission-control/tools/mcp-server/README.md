# OpenClaw Mission Control — MCP Server

Expose Mission Control as an MCP (Model Context Protocol) server so any
compatible client — Claude Code, Codex, or any custom agent — can query
missions, research outputs, deployment status, and security audits.

## Why?

Ben's Bites (Mar 31 2026) announced **"OpenClaw will soon be an MCP"**.
This scaffold prepares Mission Control to be consumed as a first-class
MCP server, aligning with the broader ecosystem trend (Attio CRM → n8n,
Codex plugins, Projects.dev, etc.).

## Quick start

```bash
cd tools/mcp-server
npm install
npm run dev          # hot-reload via tsx
```

### Use with Claude Code

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "openclaw": {
      "command": "node",
      "args": ["tools/mcp-server/dist/index.js"],
      "env": {
        "OPENCLAW_WORKSPACE": "/path/to/workspace"
      }
    }
  }
}
```

## Available tools

| Tool | Description |
|------|-------------|
| `list_missions` | List deep-research mission outputs |
| `read_research` | Read a specific research markdown |
| `deployment_status` | Check ArchTrack build & server health |
| `security_audit` | Scan for compromised npm packages |
| `bens_bites_history` | List past Ben's Bites implementation summaries |

## Available resources

| Resource | URI |
|----------|-----|
| Missions list | `missions://list` |

## Available prompts

| Prompt | Description |
|--------|-------------|
| `mission_briefing` | Structured briefing on current MC state |
