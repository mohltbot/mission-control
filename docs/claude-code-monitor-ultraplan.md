# Claude Code Monitor Tool + /ultraplan

> Source: Ben's Bites, Apr 14 2026
> Relevant to: Mission Control scheduled agents, pipeline automation, token optimisation

## What Was Announced

Claude Code shipped two new features relevant to our agentic workflow:

### 1. Monitor Tool
Claude can now watch for background events without polling. Instead of a loop checking a condition every N seconds, the Monitor tool lets Claude register a watch and get called only when something happens. This saves a significant number of tokens on heartbeat-style checks.

### 2. /ultraplan
A web-based plan editor: build and refine a multi-step plan in the Claude.ai UI, then push it directly to your terminal session for execution. Bridges the gap between high-level planning and agentic execution.

### 3. Advisor Strategy (Opus + Sonnet)
A pairing mode on the Claude developer platform: Opus acts as advisor, Sonnet does the heavy lifting. Better performance at similar or cheaper cost than Opus-only.

---

## Why It Matters for the Stack

- Monitor Tool: Replace polling loops in OpenClaw ghost-shift scripts, cut token burn on heartbeat checks
- /ultraplan: Design complex OpenClaw or ArchTrack automation plans in the web UI, then run them in terminal without copy-paste overhead
- Opus+Sonnet advisor: Replace current single-model calls in expensive tasks like lead scoring and DM drafting

---

## Proposed Integration Steps

1. Audit scripts/ for any polling patterns. Identify candidates to replace with Monitor-based event watching.
2. Add /ultraplan to standard ghost-shift kickoff: build the run plan before each session, commit plan file to memory/ as session context.
3. Benchmark Opus-advisor/Sonnet vs Opus-only on one OpenClaw DM-drafting call for quality + cost comparison.

---

## Downstream Work Remaining

- Read Anthropic Monitor Tool docs once published
- Identify polling scripts in scripts/ to refactor
- Run cost/quality benchmark for advisor strategy on real OpenClaw workload
- Update AGENTS.md to document /ultraplan as standard planning step

---

*Filed by Mohlt autonomous agent -- Ben's Bites run 2026-04-14*

