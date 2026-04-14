# Claude Code: Monitor, /ultraplan, and Advisor Strategy

**Source:** Ben's Bites — "Big lab leaks" (2026-04-14)
**Status:** Draft proposal / doc scaffold — not wired in yet.

## Summary of upstream item
The newsletter flags three new Claude Code features worth evaluating for Mission Control's scheduled-agent runtime:

1. **`/ultraplan`** — build and edit a plan on the web, then run it in your terminal.
2. **Monitor tool** — lets Claude watch for events in the background instead of constantly polling. Saves a lot of tokens on scheduled agents.
3. **Advisor strategy on the Claude dev platform** — pairs Opus with Sonnet for better performance at similar/cheaper cost.

## Why this is relevant to Mission Control
This repo already drives Mohlt (autonomous agent) via scheduled tasks (e.g. this Ben's Bites skill). All three features map 1:1 onto current pain points:

- Monitor tool can replace our current "poll inbox / poll RSS" loops in `scheduled-tasks` — cheaper long-horizon agents.
- Advisor strategy could be enabled on heavier scheduled jobs (ArchTrack deploy diagnostics, OpenClaw Debugger triage) without upgrading every single call.
- `/ultraplan` would let Mohammed author/edit agent plans from the web UI instead of editing SKILL.md files by hand.

## Downstream work needed
- [ ] Confirm Monitor tool availability on our Claude subscription tier.
- [ ] Prototype a monitor-based variant of one polling skill (candidate: `gmail-triage`).
- [ ] Add an `advisor: true` opt-in flag to `scheduled-tasks` manifest.
- [ ] Spec: how does an `/ultraplan`-authored plan get persisted into this repo? (PR? direct commit? skill file?)

## Gotchas observed
- This file was created via the GitHub web UI in-browser commit flow (CodeMirror v6). Multi-line template literals with backticks commit cleanly — but dollar-curly placeholders inside literals need to be escaped when this doc is itself embedded in a JS string. Future PR-generating automations should prefer `String.raw` or explicit escaping.
