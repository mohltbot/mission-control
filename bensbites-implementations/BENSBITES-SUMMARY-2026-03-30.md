# 🍔 Ben's Bites Summary — March 30, 2026

**Run date:** 2026-03-30
**Fetched from:** bensbites.com (via web search — site blocked by sandbox egress)
**Most recent issues:** "What makes a good AGENTS.md?", "What's next for coding agents?", "Agents should interview you", "Agents that keep running"

---

## 📰 TL;DR

Ben's Bites this week is deep in the **coding agents maturity arc**: how to write better AGENTS.md files (less is more), a new pattern where agents interview users before starting tasks, background agents for long-running SDLC work, and what's actually next for coding agents. OpenClaw gets a shoutout as a "highly autonomous personal agent."

---

## 🛠️ IMPLEMENTED

### 1. CLAUDE.md Cross-Platform Symlink
**Source:** "What makes a good AGENTS.md?" (late March 2026)
**Fits stack because:** You use Claude Code/Cowork as your primary agent. AGENTS.md works across Codex, Droid, Pi — creating CLAUDE.md lets any agent find your instructions regardless of which tool they use.

**What was done:**
- Created `CLAUDE.md` in workspace root pointing to AGENTS.md as the source of truth
- Added **cross-platform note** and **less-is-more principles** section to AGENTS.md
- Key insight applied: Don't document tech stack in AGENTS.md — agents figure that out. Put only preferences and behavioral nudges.

**Files created/modified:**
- `CLAUDE.md` (new)
- `AGENTS.md` (added cross-platform section at bottom)

**Branch:** `auto-update/bens-bites-claude-md-crossplatform-2026-03-30`
**PR:** ⚠️ Git locked (concurrent process) + GitHub blocked from sandbox — commit manually:
```bash
git add CLAUDE.md AGENTS.md
git commit -m "feat: Add CLAUDE.md cross-platform symlink + less-is-more AGENTS.md principles (bens-bites 2026-03-30)"
git push origin main
```

---

### 2. Interview Mode Skill
**Source:** "Agents should interview you" (late March 2026)
**Fits stack because:** OpenClaw Debugger and Mission Control both handle complex, ambiguous tasks. Having agents interview first → better output, fewer revision cycles.

**What was done:**
- Created `skills/interview-mode/SKILL.md` with full pattern documentation
- Added `🎤 Interview Mode` section to AGENTS.md
- Covers: when to trigger, how to invoke, Mission Control integration, OpenClaw integration tips

**Files created/modified:**
- `skills/interview-mode/SKILL.md` (new)
- `AGENTS.md` (added interview-mode section before Build Loop)

**Branch:** `auto-update/bens-bites-interview-mode-2026-03-30`
**PR:** ⚠️ Same git/GitHub blocking — commit manually:
```bash
git add skills/interview-mode/SKILL.md AGENTS.md
git commit -m "feat: Add interview-mode skill from Ben's Bites March 2026 (agents should interview you)"
git push origin main
```

---

## ⏭️ SKIPPED / NOTABLE

**🔥 OpenClaw gets a Ben's Bites mention**
"What's next for coding agents?" names OpenClaw as "a highly autonomous personal agent that connects to your tools and a computer to do tasks." Mohammed — your product is being referenced in the leading AI newsletter! Worth adding to LEADS.md.

**🔄 Agents that keep running**
Cursor ran an agent autonomously for a week to build a browser from scratch. Key finding: GPT-5.2 is the best model for long, autonomous runs (>3 hours). Opus 4.6 for planning, GPT-5.2 for execution. Worth monitoring for Mission Control's background task runner.

**📋 What's next for coding agents?**
The article also covers parallel coding agents with tmux + Markdown specs. Pattern: run 4-8 agents in parallel, each working a separate spec file, coordinating via progress.md. Relevant to ArchTrack's multi-agent batch processing.

**🏗️ Mastra 1.0**
TypeScript framework for building agents with stable API. Potentially useful for ArchTrack's Next.js backend as an agent orchestration layer. Worth evaluating vs. current stack.

**📝 AGENTS.md best practices (less is more)**
Research showed including tech stacks in AGENTS.md hurt agent performance (+20% token cost, no benefit). Agents figure out codebases naturally. Key point: AGENTS.md should only contain preferences and nudges — not documentation.

---

## ⚠️ EXECUTION NOTES

- **Newsletter source:** bensbites.com blocked by sandbox egress proxy; used web search results + cached content
- **Git operations:** Blocked — concurrent git process on Mac held index.lock and HEAD.lock (likely OpenClaw itself)
- **GitHub API:** Blocked by sandbox network restrictions
- **Discord API:** Blocked by sandbox network restrictions
- **Files written:** CLAUDE.md, skills/interview-mode/SKILL.md, AGENTS.md (edited) — all written successfully to mounted workspace
- **PRs:** Could not create — manual commit commands provided above
- **Discord report:** See below — could not post, copy-paste manually

---

## 💬 DISCORD MESSAGE (COPY-PASTE MANUALLY)

```
🍔 Ben's Bites — March 30, 2026

📰 Theme: Coding agents are maturing fast — AGENTS.md best practices, long-running autonomous agents, and the "interview first" pattern are reshaping how devs build with AI. OpenClaw gets a shoutout!

🛠️ Implemented:
- CLAUDE.md cross-platform symlink → `workspace/CLAUDE.md` created; AGENTS.md updated with less-is-more principles (PR blocked — commit manually)
- Interview Mode skill → `skills/interview-mode/SKILL.md` for OpenClaw/Mission Control pre-task interviews (PR blocked — commit manually)

⏭️ Skipped/Notable:
- 🎉 OpenClaw named in Ben's Bites "What's next for coding agents?" — worth adding to pitch deck
- Agents that keep running: Cursor ran agent for 1 week autonomously; GPT-5.2 best for long runs
- Mastra 1.0: TypeScript agent framework — evaluate for ArchTrack
- Parallel agents with tmux + Markdown specs: pattern for scaling ArchTrack batch processing

⚠️ PRs blocked this run (git locks + GitHub unreachable from sandbox). Files written to workspace — commit when you're next in the repo.
```

---

*Generated by Mohlt — Ben's Bites Implementation Skill*
