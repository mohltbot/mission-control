# Patch — `debugger-shift-1` (OpenClaw Debugger morning shift)

> **Source:** Ben's Bites 2026-04-28 "Builders" — *Exa for Claude*.
> **Project advanced:** OpenClaw Debugger (PROJECTS.md #6).
> **Pre-condition:** Exa MCP is connected (`mcp.exa.ai/mcp`) and `exa-probe.md` passed. If Exa is not connected, the new step degrades gracefully — agent falls through to existing Chrome-MCP scraping.

## What changes when this is pasted into the task editor

A new **Exa-first lead-gen** step is inserted at the top of the existing research/lead-gen block. It replaces the slowest part of the current shift — the round-robin tab-loads of GitHub Issues, Reddit's r/MacOS / r/ClaudeAI, and Twitter searches — with a single `web_search_exa` call that returns ranked, dated, snippet-rich results in one shot.

Estimated time saved per shift: **3–5 minutes** of Chrome-MCP scraping. At 30 shifts/month, that's ~2 hrs/month of agent-runtime that goes back into nurture / drafting instead of scraping.

## Paste-block (insert after the existing context-loading step, before the LEADS.md update step)

```
### Step: Exa-first lead-gen pass

Before falling through to GitHub Issues / Reddit / Twitter scraping, run a single Exa search:

1. Call `web_search_exa` with a query that captures fresh OpenClaw / Claude desktop / agent-debugging help requests:

   "OpenClaw OR 'Claude desktop' OR 'Claude Code' bug OR error OR 'help' OR 'crash' OR 'not working' posted within last 5 days site:reddit.com OR site:github.com OR site:twitter.com"

   Then a second call narrowed for paid-debug intent:

   "'fiverr OpenClaw' OR 'hire to debug' OR 'paid help' OpenClaw OR Claude desktop posted within last 7 days"

2. From each result, pull:
   - URL
   - Posting date (skip anything older than 5 days for query 1, 7 days for query 2)
   - One-sentence pain summary
   - Contact handle (Reddit username, GitHub login, Twitter @handle)
   - Lead temperature (HOT = explicit ask for paid help / DM open / urgency, WARM = active complaint, COLD = passing mention)

3. **Dedupe against `business/openclaw-debugger/LEADS.md`** — if a handle already appears in LEADS.md within the last 30 days, skip it.

4. Append new leads to LEADS.md using the existing format. Mark each as `source: exa-search` so we can later A/B Exa vs Chrome-MCP scraping.

5. **Fallback:** If `web_search_exa` errors, returns 0 results, or returns only stale results (>10 days old), log the failure mode in `business/openclaw-debugger/memory/YYYY-MM-DD-shift1.md` and proceed with the existing Chrome-MCP scraping flow unchanged. Do NOT block the rest of the shift on Exa availability.
```

## Why this is safe to merge as-is

- **Additive only.** The existing Chrome-MCP scraping flow is preserved as fallback; no existing step is removed.
- **Quality measurable.** The `source: exa-search` tag on new LEADS.md rows lets Mohammed compare lead quality between Exa and the legacy scraper after one week.
- **Cost-bounded.** Two Exa calls/shift × 30 shifts = 60 calls/month. Under any plausible free-tier ceiling.
- **No prompt-bloat.** The patch fits in ~25 lines; the rest of the shift prompt is unchanged.

## Follow-up wiring (after one week of running)

1. Compare HOT/WARM lead conversion rate from `source: exa-search` vs the legacy sources.
2. If Exa wins → expand to query 3 (LinkedIn-public posts) and possibly drop the slowest Chrome scrapes.
3. If Exa ties or loses → leave both running and revisit when Exa releases the people/companies endpoints Ben's editorial mentioned (the current MCP only exposes web search + code docs).
