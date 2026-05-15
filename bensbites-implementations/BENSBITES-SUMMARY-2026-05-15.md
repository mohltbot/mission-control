# Ben's Bites — 2026-05-15 (Fri 6 AM run)

## Issues scanned

1. **"Agents feedback tip — all apps will become dev tools"** — Ben's Bites, May 14, 2026
   https://www.bensbites.com/p/agents-feedback-tip
2. **"Learn the system — are live models making a comeback?"** — Ben's Bites, May 12, 2026
   https://www.bensbites.com/p/learn-the-system

## Per-item scoring

### Issue 1 — "Agents feedback tip" (May 14)

| Item | Tier | Reason |
|---|---|---|
| **video-to-html skill** (Ben's main idea — screen-record + narrate → structured HTML doc with keyframes + GIFs) | **Tier 1 / Tier 2** (project: VC SaaS portfolio agentification + Dad's firm Looms + ArchTrack build logs) | Concrete, small skill. Direct fit for Loom-to-one-pager pipeline Mohammed needs for the 16-company VC SaaS push and dad's firm pitches. Also useful for ArchTrack documentation. Ships as a single SKILL.md. |
| Claude plan changing for 3rd-party tools (Conductor/Zed/OpenClaw/T3 Code) — separate credit pool June 15 | Tier 2 (pattern-watch) | Affects OpenClaw clients indirectly. Not Mohammed's own usage (Cowork is 1st-party). No concrete deliverable — note in `mission-control.md` next sync. |
| Hyperagent $10M inference credits offer (Airtable, sponsored) | Pattern-watch | Application closes May 31 — could be a leverage win if eligible. Worth a separate research run, not a Ben's Bites PR. |
| Gemini Intelligence on Android / Googlebooks | REJECT | Not Mohammed's stack. |
| Notion developer platform + markdown API + `ntn` CLI | REJECT | Notion not in his stack (per STACK.md). |
| Vercel AI Gateway production index (Anthropic 61% spend, Google 38% volume) | Tier 2 pattern-watch | Useful data for ClawRouter routing thesis. Info only, no deliverable. |
| Cursor cloud agents | REJECT | Doesn't change Cowork stack. |
| Orca (Claude Code agent view for Codex/OpenCode/Droid/Pi) | REJECT | Not on his stack. |
| Oboe (LLMs for learning) | REJECT | Consumer learning wrapper. |
| Interfaces.dev magazine | REJECT | Magazine, not a tool. |
| Anthropic CFO Krishna Rao interview | REJECT | Opinion piece, no integration. |
| AI IQ (frontier model IQ scoring) | REJECT | Info site only. |
| Intercom → Fin rebrand | REJECT | Vendor news. |
| Executor (MCPs/OpenAPIs → local code mode) | Tier 2 pattern-watch | Could reduce cloud spend on Mac mini constraint. Worth a tracker entry, not a PR. |
| OpenAI Windows sandbox | REJECT | Not his stack. |
| Anvisha PDF-beautifier tweet | REJECT | No concrete integration; could be a future tool for dad's-firm proposals if Mohammed wants to test. |
| Meta AI chief Alex Wang interview | REJECT | Opinion piece. |
| Theo "HTML is the new Markdown" video | REJECT | Opinion. |
| Granola CLI/Claude Code Skill (cross-meeting SQLite search) | REJECT | Granola not in his stack. |

### Issue 2 — "Learn the system" (May 12)

| Item | Tier | Reason |
|---|---|---|
| **AGENTS.md `@file` auto-read pattern** (Ben Tossell tweet — `@file` in AGENTS.md gets auto-read by the agent) | **Tier 2** (project: Mohlt Cowork stack itself) | Compounds across all 8 scheduled tasks. Currently bens-bites-implementation explicitly Reads three context files at start; replacing with a single `@AGENTS.md` saves three round-trips per task per run, and adds PROTOCOL.md (currently never loaded) to context. Concrete deliverable: AGENTS.md + scheduled-task-patches/bens-bites-implementation.md. |
| Claude Code single-window agent view + `/bg` to background | REJECT | Terminal-only feature; Cowork has its own scheduled-task viewer. |
| Codex in Chrome (macOS/Windows) | REJECT | OpenAI, not Anthropic stack. |
| OpenAI Realtime 2 / Realtime Translate / Realtime-Whisper | REJECT | Not on his stack. |
| OpenAI Daybreak (cyber defense) | REJECT | Not on his stack. |
| Thinking Machines interaction models | REJECT | No public access, speculative. |
| OpenAI consulting deployment company (Tomoro acquisition, $4B) | Pattern-watch | Validates Mohammed's Siegfried AI Advisory + dad's firm thesis. Worth noting in PROJECTS.md "Future" section as competitive landscape. Not a Ben's Bites PR. |
| Artificial Analysis Coding Agent Index (Opus 4.7 + Cursor CLI tops) | REJECT | Info only. |
| Ramp Fast Ask (RL spreadsheet model, beats Opus by 4% at Haiku latency) | REJECT | Ramp-internal. Pattern interesting for Siegfried month-end close but no public product. |
| Replit Parallel Agents | REJECT | Not his stack. |
| Notion Skills (Brian Lovin — database as app-store) | REJECT | Notion not in stack. |
| React Doctor v2 (catches bad React code from agents) | Tier 2 pattern-watch | Mission Control Next.js still pre-build; track for when scaffolding starts. |
| Printing Press (agent-native CLIs for Linear/ESPN/Kayak) | Pattern-watch | Generic CLI-generation pattern; not directly useful until a specific app target. |
| Claude Platform on AWS GA | REJECT | Mohammed already on direct Anthropic API. |
| OpenAI Files SDK + Codex plugin | REJECT | OpenAI ecosystem. |
| Parallel AI Monitor API (web push for background agents) | REJECT | Parallel-specific. |
| zero-native (native desktop/mobile from web UI) | Pattern-watch | ArchTrack desktop tracker relevant; track for v2 of the tracker. |
| Markdown rendering spec | REJECT | Spec, not a tool. |
| 7 Powers in age of AI | REJECT | Think piece. |
| Hackable software framework | REJECT | Speculative. |
| Anthropic Claude internals research | REJECT | Research paper. |
| Peekaboo 3.0 macOS computer-use | REJECT | Cowork's computer-use MCP already covers this surface. |
| Afters (Oxide explorer, Coatue memory thread, Pocock/Boskovic/Gabriel tweets) | REJECT | All opinion/discussion. |

## PRs opened

**2 PRs opened this run.** (Cap was 3; 2 items qualified with concrete deliverables.)

### PR 1 — AGENTS.md `@`-auto-load + bens-bites-implementation task patch
- **Tier:** 2 (project advanced: **Mohlt Cowork stack itself**)
- **Source:** Ben's Bites 2026-05-12 — Ben Tossell tweet about `@file` in AGENTS.md being auto-read.
- **What changes when this merges:**
  - Adds `/AGENTS.md` at repo root with `@`-references to MISSION.md, PROJECTS.md, STACK.md, PROTOCOL.md — a single entry point for any Claude/Cowork agent operating in the workspace.
  - Adds `/scheduled-task-patches/bens-bites-implementation.md` proposing the swap of the task's "CONTEXT FIRST" three explicit `Read` calls for a single `@/Users/main/openclaw archive/workspace/AGENTS.md` reference.
  - Net effect on next Wed/Fri 6 AM run (after Mohammed pastes the patch into the task editor): -3 Read tool calls per run, +1 doc loaded (PROTOCOL.md, currently not in this task's context), reduced missed-context bugs.
- **Follow-up wiring:** If the @-include pattern works in Cowork, the same swap applies to the other 7 scheduled tasks (debugger-shift-1/2, inbox-monitor, relationship-ninja-crm, event-scout, mission-control-update, archtrack-journey-documenter). One pattern, applied 7 places — compounds.
- **PR link:** https://github.com/mohltbot/mission-control/pull/47 (DRAFT)

### PR 2 — skills/video-to-html
- **Tier:** 1 (project advanced: **VC SaaS Portfolio Agentification** + **Dad's Middle East Accounting-Automation Firm** + **ArchTrack build logs**)
- **Source:** Ben's Bites 2026-05-14 — Ben's "video-to-html" skill experiment.
- **What changes when this merges:**
  - Adds `/skills/video-to-html/SKILL.md` — a complete Cowork-style skill that takes a screen recording with voiceover and produces a self-contained HTML doc (transcript, keyframes anchored to timestamps, GIFs for dynamic moments, actions checklist).
  - When Mohammed records his next VC SaaS portfolio company Loom, instead of just sending the raw Loom link he can run this skill and produce an HTML one-pager to attach to the email — much higher response rate than a bare video.
  - Same applies to dad's firm pitch Looms and ArchTrack build-log demos.
- **Token budget:** <$0.10/video using Whisper + Haiku — well within $200/mo cap.
- **Follow-up wiring:** Mohammed should test on the next VC SaaS Loom (he's 1 of 16 done) and tell us whether the HTML version actually improves replies. If yes, this becomes the default deliverable shape for that project.
- **PR link:** https://github.com/mohltbot/mission-control/pull/48 (DRAFT)

## Pattern-watch (themes that didn't individually qualify but warrant a future tracking task)

1. **Markdown vs HTML as the agent-output medium.** Both issues + Theo's video + Boskovic's spec tweet circle around the same idea: agent output should be richer than markdown. Worth a future task: pick a single project (probably VC SaaS Loom deliverables) and test HTML one-pagers as the default attachment format for a month. Measure reply rate vs. baseline raw-Loom-link delivery.
2. **AGENTS.md / SKILL.md / @-reference conventions are consolidating.** Ben's tip + Brian Lovin's Notion-as-skill-database + the Granola+Hermes skill mention — there's a clear move toward "skills as files, loaded by reference, version-controlled in your repo." Mohlt's `/skills/` folder is now exactly this pattern. Next move: build a skill index page on Mission Control (Next.js) that lists every skill Mohammed has, what it triggers on, and last-run-cost.
3. **Frontier-model + harness combinations matter more than the model alone.** Artificial Analysis Coding Agent Index shows Opus 4.7 + Cursor CLI > GPT-5.5 + Codex > Opus 4.7 + Claude Code. For ClawRouter (future project), the routing decision should be per-(task, model, harness), not just per-(task, model).
4. **OpenAI is building Mohammed's exact play at scale.** Tomoro acquisition → AI deployment consulting. This is the dad's-firm thesis with a $4B head-start. Two implications: (a) the thesis is correct, (b) speed matters more than perfecting the offering — get to first dad's-firm customer ASAP before OpenAI's deployment company crosses Middle East.
5. **Hyperagent's $10M founder credits offer (Airtable) closes May 31.** Could be a leverage win against the $200/mo API cap. Worth a separate research run BEFORE May 31 to see if the offer applies to Mohammed's setup.

## Run metadata

- Wall-clock: ~few minutes (single-shot, no retries)
- API cost this run: Sonnet inference only — negligible (<$0.10 estimated)
- Scheduled task: bens-bites-implementation (Wed/Fri 6 AM cadence)
- Summary path: `/Users/main/openclaw archive/workspace/bensbites-implementations/BENSBITES-SUMMARY-2026-05-15.md`
