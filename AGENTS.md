# AGENTS.md — Mohlt Workspace Entry Point

> Single entry point for any Claude / Cowork agent operating in `/Users/main/openclaw archive/workspace/`. The `@`-references below are auto-loaded by Claude Code / Cowork so individual task prompts don't have to manually `Read` them.
>
> Source: Ben's Bites 2026-05-12 — Ben Tossell tweet noting `@file` inside an AGENTS.md is auto-read by the agent.

## Auto-loaded context

@MISSION.md
@PROJECTS.md
@STACK.md
@PROTOCOL.md

## Operating rules for any agent in this workspace

1. The four files above define mission, project portfolio, stack, and protocol — treat them as already in your context once this AGENTS.md is loaded.
2. Do not re-Read them at task start unless you need a specific line range — the @-include handles loading.
3. Per-task context (the scheduled-task SKILL.md or a /scheduled-task-patches/<task-id>.md) layers on top of this baseline.
4. Filesystem access: use Read/Edit/Write for paths under /Users/main/openclaw archive/workspace/. Use sandboxed Bash via /sessions/.../mnt/... mounts when shell work is needed.
5. GitHub writes (commits, PRs): via Chrome MCP against the GitHub web UI — github.com is blocked from the Bash sandbox's egress proxy.
6. Discord posts: navigate Chrome MCP to https://example.com first, then fetch() the webhook from javascript_tool. about:blank and chrome://newtab/ block fetch.
7. $200 / month API cap is a hard ceiling. Route to the cheapest model that can do the task.
8. Sacred: marathon training (July 2026) and marriage reconciliation. Do not propose schedule changes that compromise either.

## Workspace layout (quick reference — full detail in STACK.md)

- business/openclaw-debugger/ — Fiverr pipeline (LEADS.md, DRAFTS.md, memory/)
- bensbites-implementations/ — weekly summaries from this very task
- arch-firm-dashboard/ — dad's Middle East accounting firm scaffolding
- mission-control.md — live state, updated every 2 days
- scripts/git-autopush.sh — launchd autopush job (scoped paths only)
- skills/ — workspace-level skills (e.g., video-to-html)
- scheduled-task-patches/ — proposed-but-not-yet-pasted task prompt updates

## Validation when this AGENTS.md is loaded

If you don't see MISSION.md's opening line ("To build an autonomous organization of AI agents...") in your context after loading this file, the @-include did NOT resolve — fall back to explicitly Reading the four files individually and report the discrepancy in your run output.
