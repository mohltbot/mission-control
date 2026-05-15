# Patch: bens-bites-implementation — use @AGENTS.md auto-load

**Source:** Ben's Bites — "Learn the system" (2026-05-12). Ben Tossell tweet: `@file` in an AGENTS.md is auto-read by the agent.

**Tier:** 2 (Claude / Anthropic ecosystem improvement to ops layer)

**Project advanced:** Mohlt Cowork stack itself — improves every scheduled task that consumes mission context. Pattern lands here first, then propagates to the other 7 tasks.

## What changes when this patch lands

The bens-bites-implementation task's "CONTEXT FIRST" step currently issues three explicit `Read` tool calls for MISSION.md / PROJECTS.md / STACK.md. After patching:

- Step replaces the three Reads with a single `@/Users/main/openclaw archive/workspace/AGENTS.md` reference at the top of the task prompt.
- AGENTS.md (added in companion PR — see /AGENTS.md at repo root) `@`-includes all four canonical docs (MISSION, PROJECTS, STACK, PROTOCOL — that last one is currently not read at all by this task).
- Net change: -3 Read tool calls per run, +1 doc loaded (PROTOCOL.md, the working agreements). Saves ~3 round-trips, reduces missed-context bugs.

## How to apply

1. Land the companion AGENTS.md (in this same PR).
2. In Cowork's scheduled-task editor for `bens-bites-implementation`, replace the "CONTEXT FIRST" block as below.
3. Wait for next Wed/Fri 6 AM run; verify the @-include resolved by checking whether MISSION.md content appears in the run's context. If yes — pattern works in Cowork. If no — Cowork doesn't honour Claude Code's @-include convention yet, and the fallback Read instructions in the patched block keep behaviour unchanged.

### BEFORE (current task prompt — "CONTEXT FIRST" section)

```
## CONTEXT FIRST

Before scoring anything, Read these files:
- /Users/main/openclaw archive/workspace/MISSION.md — the through-line
- /Users/main/openclaw archive/workspace/PROJECTS.md — full project portfolio
- /Users/main/openclaw archive/workspace/STACK.md — current technical stack

If those files don't exist yet, fall back to the inline scope below.
```

### AFTER (proposed)

```
## CONTEXT FIRST

@/Users/main/openclaw archive/workspace/AGENTS.md

That AGENTS.md @-includes MISSION.md, PROJECTS.md, STACK.md, PROTOCOL.md.

VALIDATION: confirm MISSION.md's opening line ("To build an autonomous organization of AI agents...") is in your context. If it is NOT, the @-include didn't resolve in this Cowork run — fall back to explicit Reads:
- Read /Users/main/openclaw archive/workspace/MISSION.md
- Read /Users/main/openclaw archive/workspace/PROJECTS.md
- Read /Users/main/openclaw archive/workspace/STACK.md
- Read /Users/main/openclaw archive/workspace/PROTOCOL.md
```

## Follow-up wiring

- If the @-include pattern works in Cowork: the same swap applies to debugger-shift-1, debugger-shift-2, inbox-monitor, relationship-ninja-crm, event-scout, mission-control-update, archtrack-journey-documenter. One pattern, applied 7 places — compounds.
- If @-include does NOT resolve in Cowork (only in Claude Code), this patch still adds PROTOCOL.md to the task's context (currently never loaded). Marginal win, no behaviour regression.
- Long-term: AGENTS.md becomes the single source of truth for shared agent context; per-task deltas stay in the task's own SKILL.md.

## Verification checklist for Mohammed before pasting

- [ ] AGENTS.md exists at /Users/main/openclaw archive/workspace/AGENTS.md on the Mac mini (the companion PR adds it to the repo; Mohammed needs to either git-pull or autopush won't pick it up since it's not in autopush scope).
- [ ] AGENTS.md's @-references resolve to existing files (MISSION.md, PROJECTS.md, STACK.md, PROTOCOL.md). Three of those four exist today; PROTOCOL.md may need to be created — if missing, AGENTS.md will silently skip it.
- [ ] After Mohammed pastes the new prompt into the task editor, the next run should print whether the validation line appeared. If validation fails, this patch is no-worse-than-baseline (fallback Reads fire).
