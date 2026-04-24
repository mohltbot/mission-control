# Patch: `mission-control-update` task prompt

**Source:** Ben's Bites Apr 21 2026 — "That's my designer - Claude" (Claude Design + `make-interfaces-feel-better` skill drop)
**Target task:** `mission-control-update` (every 2 days, 7 AM — 48-hr sync)
**Status:** Draft. Paste the block below into the task prompt on the Cowork scheduled-tasks screen to activate.
**What changes when this patch is pasted in:** The next run of `mission-control-update` that hits UI scaffolding work routes through the two-step wireframe-then-polish workflow instead of writing Next.js code cold.

---

## Insertion point

Paste the block below into the `mission-control-update` task prompt. Suggested insertion point: **immediately after the 48-hr sync opening paragraph, before the first "STEPS" heading** — so it sets expectations for any UI work encountered during the sync.

---

## Block to paste

```
## UI WORK — always route through the wireframe-then-implement skill

If any step of this sync involves creating or modifying a page, widget, or component under `mission-control-app/`, `arch-firm-dashboard/`, or the ArchTrack admin UI, DO NOT write Next.js/React code directly. Instead:

1. Read the skill at `/Users/main/openclaw archive/workspace/skills/ui-wireframe-then-implement/SKILL.md` (or the repo mirror at `mohltbot/mission-control` → `skills/ui-wireframe-then-implement/SKILL.md`).
2. Follow the workflow in that skill: wireframe in Claude Design (https://claude.ai/design) → export to `mission-control-app/.wireframes/<page>-<YYYY-MM-DD>.tsx` → implement on top of the wireframe → invoke the `make-interfaces-feel-better` skill for polish.
3. In the Discord sync report, list which pages were touched and which step of the workflow ran. This is the feedback loop for iterating the skill.

Skip the skill only if:
- The change is <10 lines and purely functional (wiring an env var, fixing a typo, adjusting a data-fetch URL)
- Claude Design weekly quota is exhausted — in that case, stub the wireframe as a markdown sketch in `.wireframes/<page>-<YYYY-MM-DD>.md` and queue the real wireframe for the next run rather than falling back to cold Next.js code
```

---

## Rollback

If the skill reference blows up a run (Claude Design down, the skill file moved, `make-interfaces-feel-better` broken), delete the inserted block from the task prompt and revert to the prior behavior. The skill file itself is a read-only reference — removing this insertion is sufficient rollback.

## Why a patch file instead of editing the prompt directly

Scheduled task prompts live in Cowork's UI, not in the repo. This file is the canonical record of what to paste, why, and when. When Mohammed reviews the PR, he sees exactly what will change in his task editor. When the skill evolves, this patch file is updated in the same PR that evolves the skill.

## Related

- `skills/ui-wireframe-then-implement/SKILL.md` — the skill this patch activates.
- PROJECTS.md #9 Mission Control — the project this most directly advances.
