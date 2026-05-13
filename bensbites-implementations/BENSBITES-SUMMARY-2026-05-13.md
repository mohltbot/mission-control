# Ben's Bites Scan — 2026-05-13

## Issues scanned

| Date   | Title                                     | URL |
|--------|-------------------------------------------|-----|
| May 12 | Learn the system — are live models making a comeback? | https://www.bensbites.com/p/learn-the-system |
| May 9  | Ben's Builds #3 — an email app            | https://www.bensbites.com/p/bens-builds-3-an-email-app |

**Note:** May 9 was comprehensively scored on the 2026-05-09 run (42 items, 1 Tier 1, 2 Tier 2 PRs staged). It is included in this run only to honor the "latest 2 issues" spec. **All May 9 items refer back to that prior summary** — re-scoring would just create duplicate noise. New scoring below covers the May 12 issue only.

Total **new** items reviewed: **30** (May 12 issue: lead + sponsor + 6 headlines + 15 my-feed + 5 afters + tweet-content + Ben's framing).

---

## Per-item scoring — May 12 "Learn the system"

| # | Item | Tier | Reason |
|---|------|------|--------|
| 1 | "Agentic coding is a trap" video (Ben links it, takeaway: "learn the system, not the syntax") | REJECT | Philosophy. Captured as pattern-watch — informs OPINIONS.md only after that file is promoted from pending-prs-2026-05-09. |
| 2 | Ben's framing: "syntax vs system" + how 2018 no-code was a partial-system learning | REJECT | Personal narrative, no deliverable. |
| 3 | Ben's tweet: `@file` in AGENTS.md gets auto-read by the agent | REJECT (track) | Claude Code feature. Cowork's scheduled-task system uses explicit `Read MISSION.md` calls in each SKILL.md (already the pattern). No Cowork-side gain. Becomes relevant only if Cowork → Claude Code merge happens (May 9 pattern-watch #5). |
| 4 | Lightfield — AI-native CRM with Skills (sponsor) | REJECT | `relationship-ninja-crm` runs on markdown files. Migrating to Lightfield = paid subscription + stack churn for no incremental capability today. |
| 5 | Claude Code single-window multi-agent + `/bg` to move running session to agent view | REJECT (track) | Mohammed's 9 scheduled tasks run via Cowork, not interactive Claude Code. Becomes a UI win only if/when scheduled tasks port to Claude Code. Pattern-watch #5 from May 9 still live. |
| 6 | Codex now works in Chrome on macOS/Windows (background tab automation) | REJECT | OpenAI competitor to Cowork + Chrome MCP. Mohammed's stack is Claude/Cowork; switching costs > capability gain. |
| 7 | OpenAI Realtime 2 / Realtime Translate / Realtime-Whisper API | REJECT | Voice-to-voice. Mohammed's projects are text-and-doc heavy (accounting, leads, docs). No use case. |
| 8 | OpenAI Daybreak (cyber defence) | REJECT | Enterprise security product. Not relevant. |
| 9 | Thinking Machines "interaction models" (audio + video in, audio out) | REJECT | Closed beta. No try-link. Watch from afar. |
| 10 | **OpenAI launches deployment company; acquires Tomoro (150 ppl AI consultancy); $4B investment; partners with major consulting firms** | **Tier 1 — Siegfried AI Advisory (#3) + dad's firm context (#4)** ✅ | Same week Anthropic shipped 10 finance templates (May 7, scored last run), OpenAI commits $4B to the deployment-services lane. The exact lane Siegfried's AI Advisory pitch occupies is now being capitalized at billion-dollar scale. Materially changes how Mohammed should frame the pitch (lean harder into CPA-in-the-loop differentiation). **PR #A below.** |
| 11 | Artificial Analysis Coding Agent Index (Opus 4.7 + Cursor CLI #1; Opus 4.7 + Claude Code tied #2) | REJECT | Useful data point — Cowork's harness isn't ranked, but Cowork runs on Opus 4.7, same model as the leaders. No PR. Logged. |
| 12 | Ramp + Prime Intellect "Fast Ask" RL model — small model beats Opus by 4% on spreadsheet Q&A at Haiku latency | REJECT (track) | Highly relevant to Siegfried (spreadsheet-heavy month-end close work). But Ramp didn't open-source it. No reproduction path today. If the technique gets papered or open-weighted, this becomes a Tier 1 candidate fast — ClawRouter-style routing for spreadsheet tasks could cut API spend significantly. |
| 13 | Replit Parallel Agents (isolated copies + merge) | REJECT | Cowork's `Agent(isolation: "worktree")` already provides this. Pattern already present in stack. |
| 14 | Notion Skills — Brian Lovin two-way sync of Notion DB to Claude/Codex/local agents | REJECT (borderline Tier 2) | Mohammed has Notion in connector list (STACK.md). Two-way sync of skills could let him edit skills from his phone via Notion. But: (a) his skill management is local markdown files that autopush to GitHub, which he can already edit from anywhere via Working Copy iOS; (b) wiring the sync = real engineering with no marginal capability gain. Pattern-watch: if Mohammed picks Notion up as a daily driver, revisit. |
| 15 | React Doctor v2 — catches bad React code from agents | REJECT | Mission Control Next.js app isn't built yet. Bookmark for when it is. |
| 16 | Printing Press — generates agent-native CLIs for apps (Linear, ESPN, Kayak, etc.) | REJECT (borderline Tier 2) | Could speed up `event-scout` (currently uses Chrome MCP against Luma — no MCP exists for Luma). But: Chrome MCP works today; installing + hosting a generated Luma CLI is a separate ops task. Bookmark — promote to Tier 2 if event-scout starts timing out or breaking on Luma DOM changes. |
| 17 | Claude Platform on AWS GA | REJECT | Mohammed isn't on AWS; no auth/billing/commitment retirement to consolidate. |
| 18 | OpenAI Files SDK + OpenAI Developers plugin for Codex | REJECT | OpenAI ecosystem. Not relevant. |
| 19 | Parallel AI Monitor API GA (web push instead of polling) | REJECT | Scheduled tasks run on cadence — polling-by-cron is fine for our volume. Push would require a separate service + cost. |
| 20 | zero-native — build native desktop/mobile apps with web UI | REJECT | ArchTrack desktop tracker already shipped (Apr 12 installer pipeline). No use case for a second native-build framework. |
| 21 | A spec for how interfaces should present Markdown | REJECT | Reading material. |
| 22 | "7 Powers in the age of AI" framework | REJECT | Strategy reading. Worth Mohammed reading personally; no shippable deliverable. |
| 23 | Hackable software framework — apps ship with raw source for users to modify via agents | REJECT (borderline Tier 2) | Philosophically aligned with Mission Control (it WILL be locally hosted, modifiable). But no concrete patch today since Mission Control Next.js isn't built. Bookmark — bake the "ship source" pattern into the eventual Mission Control README. |
| 24 | Anthropic interpretability research — translate Claude internals to text + teach via fictional stories | REJECT | Academic. |
| 25 | Peekaboo 3.0 — Peter Steinberger macOS computer-use tool (action-first automation, unified screenshot + UI detection) | REJECT | Cowork's `mcp__computer-use__*` already covers macOS control. Adding a 2nd computer-use tool = churn. |
| 26 | Ben Leonard explorer.oxide.computer tweet | REJECT | Tweet linking a hardware explorer. Not relevant. |
| 27 | Coatue: "memory is the new bottleneck; 5x demand in 5 years" | REJECT | Investment-thesis tweet, not a tool. |
| 28 | Matt Pocock: "replace plans with prototypes, low-fi prototypes win" | REJECT (track for OPINIONS.md) | Adds well to OPINIONS.md once Mohammed promotes that file from pending-prs-2026-05-09 to workspace root. Adding it to a still-pending file would be churn. Capture for the next OPINIONS.md amendment cycle. |
| 29 | Gabriel/Alex on voice-prompting style | REJECT | Personal style observation. |
| 30 | David Boskovic: "what if AI made specs that weren't slop" — DesignSlop concept | REJECT | Concept tweet. No shippable artifact. |

---

## PRs opened

**1 deliverable staged** in `bensbites-implementations/pending-prs-2026-05-13/` (autopushed within 5 min via launchd `com.mohlt.git-autopush`). One Tier 1 customer-facing artifact for Siegfried AI Advisory. Following established pattern (Mar 30 → May 9): autopush carries the file → Mohammed reviews via `pending-prs-` folder → promotes by moving to its final destination.

### PR #A — Tier 1 — Siegfried AI Advisory May 2026 monthly brief (deployment-services landscape)

- **Source items:** May 12 — OpenAI deployment company + Tomoro acquisition + $4B (Headlines) **combined with** May 7 — Anthropic 10 finance agent templates (previously surfaced in PR #A of May 9 run, for dad's firm framing)
- **Project:** #3 Siegfried AI Advisory pitch (3rd arm of the firm) — also informs #4 Dad's Middle East accounting-automation firm positioning
- **Shape:** Customer-facing artifact — one-page leadership memo (TL;DR + what-happened table + 3 implications + 3 ranked recommendations + 3-sentence CFO pitch + follow-up wiring checklist)
- **File:** `bensbites-implementations/pending-prs-2026-05-13/arch-firm-dashboard/siegfried-ai-advisory-may-2026-deployment-services-landscape.md`
- **What changes when this merges:** Mohammed has a drop-in monthly brief for his next Siegfried leadership AI distribution — the exact deliverable PROJECTS.md lists as "What Claude advances" for project #3. Pitch language is reframed from "we are early to AI" to "we are the only deployment arm with CPA-in-the-loop and per-automation pricing tied to audit defensibility." That reframe is durable against both Anthropic-finance-templates and OpenAI-Tomoro entering the lane. Three concrete recommendations (R1 deck rewrite, R2 productize against Anthropic template list as 5h staff exercise, R3 ship case study before Big-4 + OpenAI announcement cycle in Q3) are pre-scoped and ready to assign.
- **Follow-up wiring:** Mohammed (1) verifies the exact Anthropic template names + Tomoro deal terms against the original press materials before circulating externally, (2) decides whether to send the brief through the existing Siegfried AI leadership distribution channel or land it directly with the partner who owns the AI Advisory pitch, (3) wires R1's reframed top-of-deck slide into the existing AI Advisory deck. R3's "land before Big-4 announcement cycle" trigger should be diaried for Q3 in the Sunday cadence.

---

## Pattern-watch (themes from items that did not individually qualify)

  1. **The big-AI labs are unifying around deployment-services as the durable revenue layer** — Anthropic (May 7 templates), OpenAI (May 12 Tomoro + $4B). The model layer is becoming commodity; integration + customization + audit defensibility is where the margin is parked. Mohammed's whole portfolio (Siegfried AI Advisory, dad's firm, VC SaaS agentification, accounting-automation Fiverr gig) is positioned in that lane. Tailwind.
  2. **OPINIONS.md is gathering candidate amendments before it's even promoted to workspace root** — the May 12 issue alone supplies "learn the system, not the syntax" (Ben), "prototypes > plans, low-fi wins" (Pocock), "yap-style voice prompts work" (Gabriel). When Mohammed promotes the staged `OPINIONS.md` to workspace root, the next OPINIONS.md amendment cycle should sweep these in. Tracked, not actioned this run.
  3. **Cowork ↔ Claude Code merge speculation continues** — May 12 headline #5 (Claude Code single-window multi-agent + `/bg`) reinforces the May 9 pattern-watch #5. Worth a one-time spike to inventory the 9 scheduled tasks' Cowork-specific dependencies (`mcp__cowork__*`, scheduled-task harness, plugin layout) so we can port quickly when forced. Not yet a PR.
  4. **Cheap small specialized RL models for narrow Siegfried tasks (e.g. Ramp's Fast Ask for spreadsheet Q&A) are the leading signal for a ClawRouter-style routing layer.** If Mohammed builds ClawRouter in the next quarter, spreadsheet Q&A is the first task to route to a non-Opus model. Pattern-watch — promote to Tier 1 once a reproducible technique or open-weight model lands.
  5. **The 7 Powers / hackable software / Boskovic spec-quality items collectively reinforce that Mission Control should ship its raw source** when it does get built. Not a PR until Mission Control build kicks off, but worth baking into its eventual README.

---

## Run metadata

- **Date:** 2026-05-13 (Wednesday)
- **Issues scanned:** 2 (May 12 = new scoring; May 9 = referenced back to 2026-05-09 summary)
- **New items scored:** 30 (May 12 only)
- **Tier 1:** 1
- **Tier 2:** 0
- **REJECT (incl. borderline / track):** 29
- **PRs staged:** 1 (in `pending-prs-2026-05-13/`)
- **PRs opened via Chrome web UI:** 0 (followed prior-run pattern: autopush carries `pending-prs-` folder to repo; Mohammed reviews-and-promotes manually)
- **Discord posted:** see Discord step below
