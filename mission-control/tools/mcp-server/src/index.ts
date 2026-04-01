#!/usr/bin/env node
/**
 * OpenClaw Mission Control — MCP Server
 *
 * Exposes Mission Control capabilities via Model Context Protocol so that
 * any MCP-compatible client (Claude Code, Codex, etc.) can:
 *   - List and read missions, tasks, and agent configs
 *   - Trigger deep-research runs
 *   - Query cost-optimization data
 *   - Manage deployment workflows
 *
 * Inspired by Ben's Bites Mar 31 2026: "OpenClaw will soon be an MCP"
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { readFileSync, existsSync, readdirSync } from "fs";
import { join, resolve } from "path";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const WORKSPACE_ROOT = process.env.OPENCLAW_WORKSPACE || resolve(process.cwd(), "../..");

// ---------------------------------------------------------------------------
// Server
// ---------------------------------------------------------------------------
const server = new McpServer({
  name: "openclaw-mission-control",
  version: "0.1.0",
});

// ---------------------------------------------------------------------------
// Resources — expose workspace artefacts as MCP resources
// ---------------------------------------------------------------------------

// List available mission logs / research outputs
server.resource(
  "missions",
  "missions://list",
  async (uri) => {
    const researchDir = join(WORKSPACE_ROOT, "tools", "deep-research");
    const files = existsSync(researchDir)
      ? readdirSync(researchDir).filter((f) => f.endsWith(".md"))
      : [];

    return {
      contents: [
        {
          uri: uri.href,
          mimeType: "application/json",
          text: JSON.stringify(
            {
              missions: files.map((f) => ({
                id: f.replace(".md", ""),
                file: f,
                path: join(researchDir, f),
              })),
            },
            null,
            2
          ),
        },
      ],
    };
  }
);

// ---------------------------------------------------------------------------
// Tools
// ---------------------------------------------------------------------------

// 1. List missions / research outputs
server.tool(
  "list_missions",
  "List all deep-research missions and their statuses",
  {},
  async () => {
    const researchDir = join(WORKSPACE_ROOT, "tools", "deep-research");
    const files = existsSync(researchDir)
      ? readdirSync(researchDir).filter((f) => f.endsWith(".md"))
      : [];

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            files.map((f) => ({ name: f, path: join(researchDir, f) })),
            null,
            2
          ),
        },
      ],
    };
  }
);

// 2. Read a specific research output
server.tool(
  "read_research",
  "Read the contents of a deep-research output by filename",
  { filename: z.string().describe("Research file name, e.g. research-2026-03-29T06-15-24-969Z.md") },
  async ({ filename }) => {
    const filepath = join(WORKSPACE_ROOT, "tools", "deep-research", filename);
    if (!existsSync(filepath)) {
      return { content: [{ type: "text", text: `File not found: ${filename}` }], isError: true };
    }
    const text = readFileSync(filepath, "utf-8");
    return { content: [{ type: "text", text }] };
  }
);

// 3. Check deployment status
server.tool(
  "deployment_status",
  "Check ArchTrack deployment status and server health",
  {},
  async () => {
    const adminDir = join(WORKSPACE_ROOT, "admin");
    const hasDistServer = existsSync(join(adminDir, "dist", "server", "index.js"));
    const logsDir = join(WORKSPACE_ROOT, "logs");
    const recentLogs = existsSync(logsDir)
      ? readdirSync(logsDir)
          .filter((f) => f.endsWith(".log"))
          .sort()
          .slice(-3)
      : [];

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              built: hasDistServer,
              recentLogs,
              workspace: WORKSPACE_ROOT,
            },
            null,
            2
          ),
        },
      ],
    };
  }
);

// 4. Dependency security audit
server.tool(
  "security_audit",
  "Check workspace dependencies for known compromised packages (e.g. axios supply-chain attack)",
  {},
  async () => {
    const compromised = ["axios@1.7.8", "axios@1.7.9"]; // Known bad versions from Mar 2026 breach
    const findings: string[] = [];

    // Walk workspace for package-lock.json files
    const checkDir = (dir: string) => {
      const lockPath = join(dir, "package-lock.json");
      if (existsSync(lockPath)) {
        const lock = readFileSync(lockPath, "utf-8");
        for (const pkg of compromised) {
          if (lock.includes(pkg)) {
            findings.push(`⚠️  Found ${pkg} in ${lockPath}`);
          }
        }
      }
    };

    checkDir(WORKSPACE_ROOT);
    checkDir(join(WORKSPACE_ROOT, "admin"));
    checkDir(join(WORKSPACE_ROOT, "desktop"));

    return {
      content: [
        {
          type: "text",
          text:
            findings.length > 0
              ? `SECURITY ISSUES:\n${findings.join("\n")}`
              : "✅ No known compromised packages found in workspace dependencies.",
        },
      ],
    };
  }
);

// 5. List Ben's Bites implementation history
server.tool(
  "bens_bites_history",
  "List all Ben's Bites implementation summaries",
  {},
  async () => {
    const bbDir = join(WORKSPACE_ROOT, "bensbites-implementations");
    const files = existsSync(bbDir)
      ? readdirSync(bbDir).filter((f) => f.startsWith("BENSBITES-SUMMARY"))
      : [];

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(files, null, 2),
        },
      ],
    };
  }
);

// ---------------------------------------------------------------------------
// Prompts
// ---------------------------------------------------------------------------

server.prompt(
  "mission_briefing",
  "Get a structured briefing on current Mission Control state",
  {},
  async () => {
    return {
      messages: [
        {
          role: "user" as const,
          content: {
            type: "text" as const,
            text: `You are an AI agent operating within OpenClaw Mission Control.

Workspace: ${WORKSPACE_ROOT}
Components: ArchTrack (Next.js admin + Electron desktop), deep-research tool, prompt-guard

Your job is to:
1. Check deployment_status for server health
2. Run security_audit to verify no compromised deps
3. List missions for recent research outputs
4. Summarize the current state concisely

Begin.`,
          },
        },
      ],
    };
  }
);

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("OpenClaw MCP Server running on stdio");
}

main().catch(console.error);
