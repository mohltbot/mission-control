# Exa MCP probe — verify connection before wiring into scheduled tasks

> **Source:** Ben's Bites 2026-04-28 "Builders" — *Exa for Claude* (retroactively flagged 2026-05-04 after Mohammed's correction).
>
> **Why this matters:** OpenClaw lead-gen (debugger-shift-1/2) and VC SaaS Portfolio research (#5) currently scrape GitHub/Reddit/Twitter via Chrome MCP. Exa's `web_search_exa` is a first-class search layer that returns ranked URLs + snippets in one call instead of N tab-loads. If it works, it cuts each shift's research step from minutes to seconds — and the time savings stay even if Mohammed eventually pays for higher rate limits.

## Pre-conditions

1. Mohammed has clicked **Connect** on the Exa connector card (Cowork → Connectors → Exa). The MCP url is `https://mcp.exa.ai/mcp`.
2. The two tools `web_search_exa` and `get_code_context_exa` show up under the Exa server in chat.

## Probe — paste this into a fresh chat after connecting

> "Use `web_search_exa` to find 10 OpenClaw / Claude desktop / agent-debugging help requests posted in the last 7 days on Reddit, GitHub Issues, or Twitter. Return: URL, posting date, one-sentence summary, contact handle. Skip anything older than 2026-04-26."

What to verify in the response:
- Did Exa return ≥6 distinct URLs? (Anything fewer = either rate-limited free tier or Exa's coverage is too thin for our use case)
- Are the dates in the last 7 days? (Filtering quality)
- Is at least one result a real lead — i.e. someone actively asking for help, not a marketing post?
- Did the call cost anything visible? (Watch for "free tier exhausted" or paywall messaging)

## If the probe passes (≥6 results, ≥1 real lead, free tier still has headroom)

→ Apply the **scheduled-task-patches** in this PR (see `scheduled-task-patches/debugger-shift-1.md` and `scheduled-task-patches/debugger-shift-2.md`). Paste each patch into the corresponding task editor in Cowork's Scheduled Tasks panel.

## If the probe fails (rate-limited, sparse results, or paywalled)

→ Don't merge the patches. Reply to the PR with what you saw and we'll either:
1. Move to a metered Exa API key (paid, but still likely under $5/month at debugger-shift volume — well inside the $200 cap), or
2. Drop Exa and stay on Chrome MCP scraping (current state — no regression).

## Cost expectation

Exa hosted MCP is free for low volume; the per-call cost only matters if Mohammed exceeds the free tier. At 2 debugger shifts × 1 search/shift × 30 days = **60 searches/month**. That's well under any plausible free-tier ceiling. If it's not, we'll see a 429 in the probe and adjust.

## Rollback

Each patch in this PR is **additive** — it adds an Exa step at the top of the existing research block. If Exa starts misbehaving (returns junk, rate-limits, etc.) Mohammed deletes the Exa block in the task editor and the rest of the shift continues as before. Zero rewrite cost.
