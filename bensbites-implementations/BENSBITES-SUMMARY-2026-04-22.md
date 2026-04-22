# Ben's Bites Scan — 2026-04-22

## Issues Scanned

1. **"That's my designer - Claude"** — Apr 21, 2026 (Opus 4.7 release + Design tab)
2. **"My cheatsheet for a clean context"** — Apr 16, 2026 (clean context management)

> Note: Apr 16 was also partially covered in the 2026-04-17 run, so items already
> rejected there are re-confirmed rather than re-litigated.

---

## Per-Item Scoring Table

### Issue 1: "That's my designer - Claude" (Apr 21)

| # | Item | Verdict | Project | Reason |
|---|------|---------|---------|--------|
| 1 | Claude Opus 4.7 release (new xhigh reasoning tier) | Tier 2 | Mohlt Cowork stack | New reasoning tier could help deep-reasoning scheduled tasks; change is config-only (pick model), no concrete patch needed — Mohammed's tasks already run on whatever the default is. Awareness. |
| 2 | Claude Design tab (canvas with 5-10 question intake → wireframes/prototypes) | Tier 2 | Dad's firm deck + VC SaaS Looms + Mission Control UI | Could accelerate customer-facing wireframes and Next.js prototypes — but it's a Claude.ai web UI feature with no MCP hook, so nothing to patch in this repo. Flagged for Mohammed to try manually on dad's-firm deck. |
| 3 | Codex Computer Use (Mac app control, background) | REJECT | — | Mohammed uses Claude, not Codex |
| 4 | Codex Chronicle (screen-context memory) | REJECT | — | Codex-specific |
| 5 | Codex plugins incl. image gen | REJECT | — | Codex-specific |
| 6 | Factory AI $1.5B valuation / Droid desktop app | REJECT | — | Competitor news; Mohammed is on Claude stack |
| 7 | Backstory (sponsor, revenue data) | REJECT | — | Paid SaaS, no project fit |
| 8 | Google AI Pro/Ultra ↔ AI Studio | REJECT | — | Google stack |
| 9 | Julius (slide decks with charts as .pptx) | REJECT | — | Mohammed has pptx skill already |
| 10 | Galaxy Brain OS (local-files OS, Ben invested) | REJECT | — | Consumer OS |
| 11 | Kimi 2.6 Code (terminal built for Kimi K2.6) | REJECT | — | Mohammed has Kimi on his API roster (~$20) but uses Claude Code/Cowork as harness; Kimi Code terminal doesn't fit |
| 12 | Moondream Lens (fine-tune vision model on 20 images) | REJECT | — | No vision project |
| 13 | **Zapier AutomationBench** ("no model cracks 10%" on real-work chains) | Tier 1 | VC SaaS Portfolio (#5) | Direct pitch angle for agentification work — but writing a generic pitch one-pager without knowing Mohammed's 16 specific portfolio companies risks being slop. Kept as Pattern-Watch talking point for next Sunday-run conversation, not shipped as PR. |
| 14 | "How AI made me a builder w/o losing taste as designer" | REJECT | — | Think-piece |
| 15 | Quiver Arrow 1.1 / 1.1 Max (vector generation) | REJECT | — | No vector-gen project |
| 16 | **acceptmarkdown.com** (check if site returns Markdown for agents) | **Tier 1 → PR** | ArchTrack + Fiverr gigs (#6, #7, #10) | Concrete deliverable possible: a Node script that runs acceptmarkdown-style checks against archtrack.live + Fiverr gig URLs + the mission-control repo. Script is self-contained, runnable on merge. **Shipped as PR #44.** |
| 17 | "5 stages of AI grief" | REJECT | — | Meme post |
| 18 | HeyGen HyperFrames (open-source HTML → MP4) | Tier 2 | Golf content + VC SaaS Looms | Potentially useful for converting iPaaS walkthrough HTML into MP4 demos. But HyperFrames' API/CLI is unknown to me — shipping a wrapper would be speculative. Flagged to evaluate manually. |
| 19 | Vercel breach via third-party AI product | REJECT | — | News; no direct remediation action for Mohammed's stack |
| 20 | OpenAI departures (Weil, Peebles, Narayanan) | REJECT | — | News |
| 21 | Skill drops: skill-creator / make-interfaces-feel-better / gpt-taste | Tier 2 | Mohlt Cowork stack / Mission Control UI | Mohammed already has `skill-creator` mounted. `make-interfaces-feel-better` sounds directly relevant for the Next.js Mission Control build — but porting requires the actual skill source which isn't reachable from the sandbox. Flagged for Mohammed to clone manually. |

### Issue 2: "My cheatsheet for a clean context" (Apr 16) — re-scan

Most items were already scored in the 2026-04-17 run. Confirming those verdicts
and highlighting anything worth reconsidering in light of new context:

| # | Item | Verdict | Project | Reason |
|---|------|---------|---------|--------|
| 1 | Claude Code desktop redesign (split windows) | Tier 2 (unchanged) | Mohlt Cowork stack | No concrete patch |
| 2 | Gemini native Mac app | REJECT | — | Same as before |
| 3 | GPT-5.4-Cyber | REJECT | — | Niche |
| 4 | Gemini 3.1 Flash TTS | REJECT | — | No voice project |
| 5 | **Claude Code Routines** (scheduled prompts on Anthropic infra) | Tier 2 (unchanged) | Mohlt Cowork stack | Apr 21 issue reinforces this: Ben explicitly notes "Cowork scheduled tasks stop when you shut the lid, Routines do not." Still no public MCP-parity confirmation, so writing a migration patch today would be a guess. **Revisit once Routines is GA with MCP support** — that's the trigger to migrate scheduled tasks off the Mac mini. |
| 6 | OpenAI Agents SDK update | REJECT | — | Not stack |
| 7 | Skills in Chrome | Tier 2 (unchanged) | — | No concrete patch |
| 8 | Cursor canvases / Resend BYOA / Sparkle v4 | REJECT | — | Not stack |
| 9 | Daniel's home-building email agent ($500) | REJECT | — | Blows API cap |
| 10 | Impeccable v2 (design skill + CLI scanner) | Tier 2 (unchanged) | Mission Control / ArchTrack | Still needs hands-on eval before wiring |
| 11 | "Using Claude Code" (session mgmt, compaction, 1M context) | Tier 2 | Mohlt Cowork stack | Awareness; Mohammed's tasks are isolated so compaction doesn't apply much |
| 12 | Lindy AI → GLM 5.1 default | REJECT | — | Competitor; GLM 5.1 not in Mohammed's API roster |
| 13 | OpenRouter video gen | REJECT | — | Would add API spend; golf content is shorts-editing not gen |
| 14 | Copilot in Word / Windsurf 2.0 / Gradient Bang | REJECT | — | Not stack |
| 15 | Attio CRM (sponsor) | REJECT | — | Mohammed has relationship-ninja-crm |

---

## PR Decision

**1 PR opened this week.**

### PR #44 — acceptmarkdown-check script
- **URL:** https://github.com/mohltbot/mission-control/pull/44
- **Branch:** `bensbites/2026-04-22-acceptmarkdown-check`
- **Status:** Draft
- **Deliverable shape:** Working script in `/scripts/acceptmarkdown-check.mjs`
- **Tier / Project:** Tier 1 — ArchTrack (#10), OpenClaw Debugger Fiverr (#6), Accounting Fiverr (#7)
- **Source item:** "acceptmarkdown.com" in Ben's Bites 2026-04-21
- **What changes when this merges:** Mohammed can run `node scripts/acceptmarkdown-check.mjs` and get a per-target markdown report in ~30 seconds covering:
  - HTTP reachability
  - Semantic HTML presence (article / main / h1)
  - application/ld+json structured data
  - Companion `/llms.txt` / `/.md` files
  - robots.txt posture for ClaudeBot / GPTBot / anthropic-ai / ccbot
- **Follow-up wiring:**
  1. Run manually first (no dependencies beyond Node 20+).
  2. If results are actionable, add it to a monthly scheduled task or a CI cron.
  3. First fix to ship per results will likely be adding `/llms.txt` at archtrack.live root.
- **In-browser paste notes:** ClipboardEvent paste into GitHub's CodeMirror 6 editor worked cleanly on second attempt (first attempt had stale session state — reload fixed it). Raw file fetched from the branch matches the locally-staged content byte-for-byte (8448 bytes, 242 lines). No escaping issues detected.

---

## Not Shipped — Why

- **Zapier AutomationBench pitch one-pager** (Tier 1 for VC SaaS): Writing generic pitch copy without knowing which of the 16 portfolio companies Mohammed is currently pursuing would produce slop that clogs the repo. Better delivered as a verbal talking point next time Mohammed and Claude are in chat.
- **Claude Code Routines migration patch** (Tier 2 for Cowork stack): Same blocker as 2026-04-17 — no public confirmation of full MCP parity on Anthropic's infra. Writing a migration runbook today would be speculation. **Trigger to ship:** when Routines GA announcement confirms connector parity.
- **HeyGen HyperFrames wrapper** (Tier 2): API surface is unknown to me; a speculative wrapper would be `/docs/<topic>.md`-shaped.
- **make-interfaces-feel-better skill port** (Tier 2 for Mission Control): Source content not fetchable from sandbox; porting blind would fabricate behavior.

---

## Pattern-Watch: Trending Themes

1. **"Lid-close problem" is now acknowledged publicly.** Ben explicitly contrasted Cowork (dies on lid-close) vs Routines (survives). Every time Mohammed's Mac sleeps overnight, his debugger shifts and bens-bites-implementation miss their windows. **Action once Routines GA lands with MCP parity: migrate bens-bites-implementation, event-scout, and mission-control-update first — these don't need deep MCP integration beyond Gmail + a webhook.**

2. **"Agent-readability as SEO"** — acceptmarkdown.com, llms.txt convention, Ben's complaint that average users can't discover Claude Cowork capabilities. This is a real retail-level problem: ArchTrack.live and Mohammed's Fiverr gigs need to be discoverable by the agents shopping on Mohammed's competitors' behalf. PR #44 is the first concrete step; next step is adding `/llms.txt` files wherever the script flags gaps.

3. **Design-aware agents continuing to mature** (Claude Design tab + Impeccable v2 + make-interfaces-feel-better). These all converge on "AI builds UI that feels hand-crafted." Most directly relevant when Mission Control Next.js app gets built — Mohammed should probably spend one Saturday session trying the Claude Design tab on a Mission Control wireframe.

4. **Sponsor signal — Attio keeps showing up.** Two issues in a row mentioned Attio. Mohammed's `relationship-ninja-crm` task is markdown-based. If he wants to scale The 12 beyond what markdown handles, Attio's free tier + MCP is worth an experiment — but only if the markdown version starts showing cracks. Current signal: none yet.

---

## Cost

$0 — no paid tools introduced. Node 20+ already on Mohammed's Mac mini.
