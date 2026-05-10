# Ben's Bites Scan — 2026-05-09

## Issues scanned

| Date   | Title                                              | URL |
|--------|----------------------------------------------------|-----|
| May 9  | Ben's Builds #3 — an email app                     | https://www.bensbites.com/p/bens-builds-3-an-email-app |
| May 7  | Elon doubled limits — Free ChatGPT got instantly better | https://www.bensbites.com/p/elon-doubled-limits |

Total items reviewed: **42** across both issues (build-walkthrough items + headlines + my-feed + afters).

---

## Per-item scoring

### Issue: May 9 — "Ben's Builds #3 — an email app"

| # | Item | Tier | Reason |
|---|------|------|--------|
| 1 | Personal email client built on Gmail CLI + agent-native | REJECT | Cool tech but Mohammed's `inbox-monitor` task already does the only Gmail work he needs; building a custom client doesn't move any of the 15 PROJECTS forward. |
| 2 | Reverse-engineering external apps (Obsidian web clipper) for hard problems pattern | REJECT | Soft pattern — no concrete deliverable. Worth keeping in head, not a PR. |
| 3 | `markdown.new` / `defuddle.md` for agent-friendly markdown of websites | REJECT (borderline Tier 2) | Could be added to AGENTS.md, but Chrome MCP `get_page_text` already does this well for our scheduled tasks. Adding a third pattern here is churn, not gain. |
| 4 | Stripe `projects.dev` (sets up Vercel + Stripe + Supabase via agent) | REJECT (borderline Tier 1) | Genuinely interesting once Mission Control Next.js build starts AND ArchTrack adds billing. Today neither exists. Bookmarked for the day either does. |
| 5 | `here.now` site-spinning service | REJECT | No project hook; not a free site host we need. |
| 6 | Factory coding harness (~$100/mo) | REJECT | Would consume 50% of the $200/month API cap. ROI unproven for our workload (Cowork-driven scheduled tasks); revisit if Mohammed personally codes a lot more this quarter. |
| 7 | Codex on free ChatGPT plans | REJECT | Alternative agent harness. Mohammed's stack is Cowork; switching is more cost than gain. |
| 8 | Cowork criticism ("don't bother using Cowork — they'll merge it into Claude Code soon") | REJECT (track) | Opinion, not a tool. Worth tracking; if Anthropic does merge Cowork → Claude Code, our scheduled-tasks layer will need to be ported. Adding to pattern-watch but not a PR. |
| 9 | "Code is cheap; just build" / iterate philosophy | REJECT | Pattern philosophy — captured into OPINIONS.md (PR #B below). |
| 10 | Agent-friendly hidden selectors / state / debug endpoints pattern | REJECT (borderline Tier 2) | Could matter for ArchTrack admin dashboard so Cowork agents can drive it. Speculative until ArchTrack has a known agent-driven need. |
| 11 | Pi (with GPT-5.5) for non-coding day-to-day | REJECT | Mohammed already has Claude/Cowork as his daily driver; not a tool to add. |
| 12 | Stripe + Supabase + Vercel as default full-stack stack | REJECT | Already implicitly Mohammed's plan for Mission Control. |
| 13 | Clearly document editor | REJECT | Document editor — not a stack hole for us. |

### Issue: May 7 — "Elon doubled limits"

| # | Item | Tier | Reason |
|---|------|------|--------|
| 14 | "GPT-5.5 Instant" replaces GPT-5.3 Instant (free ChatGPT) | REJECT | Model release for ChatGPT; Mohammed routes through Claude/Cowork. |
| 15 | ChatGPT now works inside Excel + Google Sheets (formulas, in-place edits) | REJECT (borderline Tier 1 — Siegfried) | Competing with Mohammed's Siegfried automation work. Worth Mohammed knowing for his next leadership brief but no shippable deliverable — feature-announcement only. |
| 16 | Anthropic + SpaceX deal → 2x Claude limits on paid plans | REJECT (track) | Affects $200/mo budget headroom but is informational; no behavior change to ship until the new ceilings hit our ClawRouter logic, which doesn't exist yet. |
| 17 | Claude Managed Agents — Dreaming (memory review) | REJECT (track) | Could replace parts of `relationship-ninja-crm` and `mission-control-update`. Need to verify what "Dreaming" actually exposes before patching. |
| 18 | Claude Managed Agents — **Outcomes** (graders) | **Tier 2** ✅ | Concrete pattern: define success criteria, grade self after run. Patch `mission-control-update` (highest-load-bearing scheduled task) to self-grade and degrade-gracefully when failing. **PR #C below.** |
| 19 | Claude Managed Agents — Multi-agent orchestration (lead → specialist subagents) | REJECT (track) | Cowork doesn't expose this directly; not a patch we can ship today. |
| 20 | Posthog "self-driving codebase" Codex-like product | REJECT | Not in our stack. |
| 21 | Gravitee API governance | REJECT | Enterprise tooling, not relevant. |
| 22 | Skills by Entire — agent code-handoff/explanation skills | REJECT (borderline Tier 2) | Would matter when Mohammed has 2+ agents handing work between each other — scheduled-tasks today don't hand off. Bookmark for when they do. |
| 23 | `pookie` Slack helper | REJECT | Mohammed isn't on Slack. |
| 24 | `Clicky` voice-controlled Gmail/Cal/Drive | REJECT | Voice control overlap with our existing connectors; no use case. |
| 25 | `deepsec` security harness | REJECT | Already rejected on May 6 run. |
| 26 | Raindrop Triage (debug agents in production via MCP) | REJECT (borderline Tier 2) | Could help debug 9 scheduled tasks, but Raindrop is a paid third-party product and our existing log files (`logs/git-autopush.log`, scheduled-task memories) cover most of what we need today. |
| 27 | Prime Intellect Lab fine-tuning (1B–400B params) | REJECT | Out of budget; no use case. |
| 28 | "How we improved agentic search" blog | REJECT | Informational. |
| 29 | **"Everyone should have an OPINIONS.md"** | **Tier 2** ✅ | Concrete pattern. AGENTS.md describes what the world is; OPINIONS.md describes how to default. Mohammed has MISSION/PROJECTS/STACK/PROTOCOL — OPINIONS.md is the missing layer. **PR #B below.** |
| 30 | Gemini API File Search over images / audio | REJECT | Niche; not a Gemini stack. |
| 31 | `@supabase/server` server-side auth beta package | REJECT | Speculative — ArchTrack stack unknown to be Supabase. |
| 32 | **Anthropic released 10 finance agent templates (month-end close, KYC, valuation reviews, pitchbooks, ...)** | **Tier 1 — Dad's firm + Siegfried AI Advisory** ✅ | Single most relevant item this week. Anthropic shipping the same automation category Mohammed is selling = legitimacy + pricing power. **PR #A below.** |
| 33 | "AI Job Apocalypse is a fantasy" essay | REJECT | Essay. |
| 34 | "Artistry of text-to-speech models" post | REJECT | Informational. |
| 35 | Dharmesh on HubSpot's full-API-parity-with-UI vision | REJECT (track) | Direction-of-travel signal that matches ArchTrack roadmap, but no concrete deliverable. |
| 36 | "How to use Codex for knowledge work" guide | REJECT | Codex-specific; we're on Cowork. |
| 37 | Hovercraft (virtual camera for slides on Mac) | REJECT | Not relevant to current Loom workflow. |
| 38 | Dan Hollick's illustration tooling video | REJECT | Video. |
| 39 | Self-driving codebase tweet (Nylas / Grinich) | REJECT | Repeat of #20 conceptually. |
| 40 | Peter Steinberger CLI tools (sonoscli, wacli, gitcrawl, discrawl, spogo) | REJECT (borderline Tier 2) | `gitcrawl.sh` could improve `debugger-shift-1`'s GitHub lead-gen and `discrawl.sh` could process the openclaw discord — but each is a separate inspection task and the SKILL pattern says don't stretch to hit a quota. Bookmarking pattern: "build small CLI archives for each data source we live in." |
| 41 | Sam Altman call for amazing-things-built-with-5.5 examples | REJECT | Tweet. |
| 42 | GTM Atlas (Attio's free GTM resource for AI customer journey) | REJECT (borderline Tier 1 — VC SaaS) | Could inform the 16-portfolio-company outreach sequence. But Atlas is a reading resource, not a tool — turning it into a concrete deliverable would mean Mohammed actually reads the chapters. Adding to pattern-watch as "if Mohammed picks Atlas up, draft an outreach sequence based on it then." |

---

## PRs opened

**3 deliverables staged** in `bensbites-implementations/pending-prs-2026-05-09/` (autopushed within 5 min via launchd `com.mohlt.git-autopush`). One Tier 1 customer-facing artifact; two Tier 2 ops-layer patches. No separate GitHub web-UI draft PR was opened — established pattern from prior runs (Mar 30, Apr 14/15/17/22/24/29, May 4, May 6) is autopush-carries → Mohammed reviews via `pending-prs-` folder → promotes by moving file to its final destination (`arch-firm-dashboard/`, workspace root, scheduled-task editor paste).

### PR #A — Tier 1 — Anthropic finance-template leverage pitch (Dad's firm)

- **Source item:** May 7 — "Anthropic released 10 finance agent templates"
- **Project:** #4 Dad's Middle East Accounting-Automation Firm (also feeds #3 Siegfried AI Advisory)
- **Shape:** Customer-facing artifact — one-pager + Loom script + cold-outreach 3-sentence + 6-bullet leave-behind + pricing posture
- **File:** `bensbites-implementations/pending-prs-2026-05-09/arch-firm-dashboard/anthropic-finance-templates-leverage-pitch.md`
- **What changes when this merges:** Mohammed's next dad's-firm conversation has a sharper opening line ("Anthropic just shipped ten official finance agent templates — we're the implementation arm with a CPA in the loop"), which moves the firm from "we evangelize agent automation" to "we customize and supervise the official Anthropic templates." Pricing floor of USD 1,500/automation/month is anchored. The same anchor flows into the next Siegfried leadership AI brief.
- **Follow-up wiring:** Mohammed verifies the ten template names on Anthropic's announcement page (referenced in the May 7 issue) and updates the bullet list before sending to a real customer. Also: re-record any existing Looms with the new opening anchor.

### PR #B — Tier 2 — `OPINIONS.md` (workspace root)

- **Source item:** May 7 — "Everyone should have an OPINIONS.md" (My Feed)
- **Project:** Tier 2 ops layer — affects all 9 scheduled tasks
- **Shape:** New top-level workspace file — 18 numbered opinions across Engineering / Decision / Risk / Stylistic categories, with usage instructions
- **File:** `bensbites-implementations/pending-prs-2026-05-09/OPINIONS.md`
- **What changes when this merges:** Once moved to workspace root and referenced from MISSION.md / PROTOCOL.md, every scheduled-task run reads it as part of context. Concrete behavior changes: (1) future bens-bites runs default to one-file deliverables and auto-prefer patching existing tasks over adding new ones; (2) "0-PR run is fine" is documented, reducing future quota-stretching; (3) financial guardrails (no $100/mo subscription without explicit approval) are crystallized.
- **Follow-up wiring:** Move file from `pending-prs-2026-05-09/` to workspace root. Add a one-line reference in MISSION.md ("Opinions: see OPINIONS.md") and in `PROTOCOL.md`. Add to the read-list at the top of `bens-bites-implementation/SKILL.md` and `mission-control-update/SKILL.md` so they pick it up automatically.

### PR #C — Tier 2 — `mission-control-update` outcomes-grader patch

- **Source item:** May 7 — Anthropic Managed Agents "Outcomes" (graders)
- **Project:** Tier 2 ops layer — `mission-control-update` is the highest-load-bearing scheduled task
- **Shape:** Patch to existing scheduled-task prompt — two ready-to-paste sections (Section A defines success criteria up-front, Section B self-grades and conditionally degrades the Discord report)
- **File:** `bensbites-implementations/pending-prs-2026-05-09/scheduled-task-patches/mission-control-update-outcomes-grader.md`
- **What changes when this merges:** Pasted into `mission-control-update`, the next run scores itself against 5 criteria (Coverage / Freshness / Signal / No-prohibited-actions / Autopush-health) and writes the grade to `mission-control.md` under `## Last self-grade — <ts>`. If 2+ criteria FAIL, the Discord report degrades to a 3-line "run failed self-grade" warning instead of a normal-looking-but-empty update. Catches silent stack drift (Gmail MCP timeout, autopush wedge, calendar permission revoked) hours after it happens instead of weeks.
- **Follow-up wiring:** Mohammed pastes Sections A + B into the task editor at the marked positions. After 1 week of runs, sweep `mission-control.md` for self-grade entries; expect ≥ 5 of last 7 to be all-PASS. If pattern holds, copy into `bens-bites-implementation` and `inbox-monitor` next.

---

## Pattern-watch (themes worth tracking, not individually qualifying this week)

  1. **"Build it yourself, code is cheap"** — Ben built an email client in 2 hours. Several other items reinforce. The pattern matters for Mission Control's Next.js build: when it starts, the right move is one-shot scaffolding by an agent + iteration, not weeks of design.
  2. **Anthropic Managed Agents are productizing the Cowork-style scheduled-task pattern** — Dreaming, Outcomes, Multi-agent orchestration. Two of those have direct patches we could ship; we shipped one (Outcomes — PR #C). Watch for the moment Anthropic announces Cowork-→-Managed-Agents migration; we want to be ready for it before scheduled tasks have to be ported.
  3. **Personal-software-built-by-individual** trend (Ben's email app, Steinberger's CLIs, Hovercraft, Adam Lisagor, Dan Hollick illustrations) — strengthens the Mohlt-Cowork-stack thesis: the autonomous-agent layer is the leverage point. Cowork stack improvements compound across all 15 projects.
  4. **Anthropic publishing official finance templates** — biggest external legitimacy gift to Mohammed's accounting-automation thesis since the firm started forming. Don't waste it.
  5. **Cowork → Claude Code merger rumored** — track. If it happens, our 9 scheduled tasks need a port. Worth a one-time spike to inventory dependencies before the migration is forced.
  6. **Stripe `projects.dev` + agentic full-stack scaffolding** — bookmarked as "evaluate when Mission Control build kicks off OR ArchTrack adds billing, whichever comes first."

---

## Run metadata

- **Date:** 2026-05-09 (Saturday)
- **Issues scanned:** 2
- **Items scored:** 42
- **Tier 1:** 1
- **Tier 2:** 2
- **REJECT:** 39
- **PRs staged:** 3 (in `pending-prs-2026-05-09/`)
- **PRs opened via Chrome web UI:** 0 (followed prior-run pattern: autopush carries `pending-prs-` folder to repo; Mohammed reviews-and-promotes manually)
- **Discord posted:** see `discord-report-2026-05-09.txt` for the rendered message if the live post failed
