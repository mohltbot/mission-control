---
name: ui-wireframe-then-implement
description: Two-step UI workflow — wireframe in Claude Design first, then implement with the make-interfaces-feel-better skill. Use when building or modifying pages under mission-control-app/, arch-firm-dashboard/, or the ArchTrack admin UI. Trigger on phrases like "build a dashboard page", "scaffold a Next.js page", "design a widget for mission-control-app".
---

# ui-wireframe-then-implement

## Why this exists

Ben's Bites Apr 21 2026 ("That's my designer - Claude") announced two things that, combined, change how UI-heavy work should run for Mohammed:

1. **Claude Design** — a canvas + chat interface at https://claude.ai/design. Asks 5-10 discovery questions, then generates a wireframe or high-fidelity prototype. Image → design workflow works well in prototype mode.
2. **`make-interfaces-feel-better`** — a newly-dropped Claude skill (see same issue, "Skill drops") that polishes generated UI toward good-taste defaults (spacing, hierarchy, focus/hover states, empty-state copy).

Before these existed, Claude would write Next.js code cold and Mohammed ended up with functional-but-ugly dashboards. With both in the toolchain, the baseline shifts: wireframe first, then polish.

## When to trigger

Invoke this workflow whenever a scheduled task or manual request involves creating or modifying:

- A page, widget, or layout inside `mission-control-app/` (the Next.js dashboard that does not yet exist)
- A page inside `arch-firm-dashboard/` (dad's Middle East accounting firm scaffolding)
- An admin/dashboard UI change in ArchTrack (`maximizeGPT/Archtrack`)
- Any customer-facing visual artifact where aesthetic quality matters: dad's-firm deck sections rendered as HTML, VC SaaS portfolio Loom storyboards, Siegfried AI advisory brief layouts

Do NOT invoke for: CLI scripts, backend-only routes, internal markdown docs, one-off data cleaning.

## The workflow

### Step 1 — Wireframe in Claude Design

1. Open https://claude.ai/design in a Chrome MCP tab.
2. Describe the target page: what it shows, which workspace files it pulls from (name real paths: `PROJECTS.md`, `mission-control.md`, `business/openclaw-debugger/LEADS.md`, the autopush log), the primary user action.
3. Answer the 5-10 discovery questions. Keep answers aligned with Mohammed's aesthetic: dense, data-forward, low-chrome — the ArchTrack admin UI at https://archtrack.live is the visual anchor.
4. If a reference screenshot field is offered, attach a screenshot of the closest existing page (ArchTrack admin, or a prior mission-control-app export).
5. Iterate until the wireframe covers every widget the task requires. Claude Design gives markedly better concept-level output than raw models (per Ben's Bites testing: Claude Design > Magicpath AI > Gemini 3.1 Pro / Opus 4.6 web apps for concept fidelity).
6. Export as React + Tailwind. Save the raw export to `mission-control-app/.wireframes/<page-name>-<YYYY-MM-DD>.tsx` so the lineage is auditable.

**Quota discipline:** Claude Design has research-preview weekly limits (~2-3 big generations on the $20 plan per Ben's Bites). Don't burn a generation on a throwaway page — batch related pages into one session. If the quota is exhausted, stub the wireframe as a markdown sketch in `.wireframes/<page>-<YYYY-MM-DD>.md` and queue the real wireframe for the next run.

### Step 2 — Implement on top of the wireframe

1. Start from the exported `.wireframes/*.tsx` file. Do not start from a blank file — this is the whole point.
2. Wire up the real data sources. For mission-control-app, that means reading from local files in `/Users/main/openclaw archive/workspace/` via the MCP server at `mission-control/tools/mcp-server/`. For arch-firm-dashboard, wire to the firm's existing data layer.
3. Keep the visual scaffold as-is while adding data — resist the urge to refactor away the wireframe's structure during the first pass.
4. When the functional version compiles and runs, invoke the `make-interfaces-feel-better` skill. Pass it the current file plus the original wireframe as context so it can see the intended visual direction.
5. Review the polish diff line-by-line. Accept selectively — the skill sometimes over-indexes on animation/motion that doesn't fit a dense data dashboard.

### Step 3 — Ship

1. Commit both the `.wireframes/*.tsx` source AND the implemented page in the same PR. Future changes re-run the polish pass against the wireframe, so it must stay in the repo.
2. In the PR body, note which step of this workflow was used and any friction hit. This is how we learn whether the two-step flow actually saves time.

## Why a skill, not just a runbook

Multiple scheduled tasks touch UI (`mission-control-update`, future `mission-control-scaffolder`, `archtrack-journey-documenter` when it patches admin views). Putting the pattern in a skill means when Claude Design or `make-interfaces-feel-better` change behavior, the workflow updates in one place rather than across every task prompt.

## Related

- `scheduled-task-patches/mission-control-update.md` — patch that references this skill when scaffold work is detected during the 48-hr sync.
- `PROJECTS.md` #9 Mission Control — the project this most directly advances.
- Ben's Bites Apr 21 2026 — source issue for Claude Design + skill drops.
- Ben's Bites Apr 23 2026 — follow-up issue noting Claude Design > Magicpath > raw models for concept fidelity.
