# Patch — `debugger-shift-2` (OpenClaw Debugger evening shift)

> **Source:** Ben's Bites 2026-04-28 "Builders" — *Exa for Claude*.
> **Project advanced:** OpenClaw Debugger (PROJECTS.md #6).
> **Pre-condition:** Exa MCP is connected (`mcp.exa.ai/mcp`) and `exa-probe.md` passed. Apply this patch *after* `debugger-shift-1.md` is in place — the two share LEADS.md schema (the new `source: exa-search` tag).

## What changes when this is pasted into the task editor

The evening shift's nurture / follow-up step gets two upgrades:

1. **Stale-lead enrichment via Exa.** Before drafting Day-2/Day-7/Day-14 follow-ups for warm leads, call `web_search_exa` to check whether the lead has posted *anywhere* in the last 24 hrs about the same problem. If they have, the follow-up draft can reference their newest post — much higher reply rate than a generic "checking in" template.

2. **Top-blocker re-engagement.** The 14+ days silent block (e.g. vmkkumar from `LEADS.md`) gets a single Exa pass to surface any new public activity from the contact. If found, surface to Mohammed for a tailored follow-up; if nothing found, keep silent (don't send a templated nudge that just adds noise).

## Paste-block (insert after the existing nurture-loop start, before the draft-follow-ups step)

```
### Step: Exa-enriched follow-up drafting

Before drafting follow-ups for any WARM lead in `business/openclaw-debugger/LEADS.md`:

1. For each WARM lead with a Day-2/7/14 follow-up due today:
   - Extract the lead's primary handle (Reddit username, GitHub login, Twitter @handle).
   - Call `web_search_exa` with: `"<handle>" (OpenClaw OR Claude OR debugger OR error OR crash) posted within last 5 days`
   - If results found AND posted within last 24 hrs:
     - Draft the follow-up referencing the new post specifically (paste a 1-sentence quote, then bridge to: "Saw your post on <date> — last we left it I was about to look at <X>. If still helpful, I can have a fix scoped today for $75 / a complex one at $150.")
   - If no recent posts:
     - Use the existing generic Day-N template — no Exa-derived content.

2. **Top-blocker pass** — for any lead in LEADS.md with `silent_days >= 14` and `est_value >= $2K`:
   - Call `web_search_exa` with: `"<handle>" posted within last 30 days` (broad query, no topic filter)
   - If meaningful new public activity (not retweets / not bot output):
     - Surface to `business/openclaw-debugger/DRAFTS.md` under a new "Top-blocker re-engagement" heading with: handle, $est value, lifetime silent days, Exa snippet, suggested 1-line bridge. Do NOT auto-draft a full follow-up — Mohammed reviews before sending.
   - If no activity:
     - Note in `memory/YYYY-MM-DD-shift2.md` as "checked $handle: silent" and leave LEADS.md untouched.

3. **Fallback:** If `web_search_exa` errors or rate-limits, fall through to the existing nurture flow without Exa enrichment. Log the failure in `memory/YYYY-MM-DD-shift2.md` and continue.
```

## Why this is safe to merge as-is

- **Additive only.** The existing draft-follow-ups step is unchanged; the Exa step runs *before* it and either enriches the draft input or no-ops.
- **Top-blocker quality control.** The vmkkumar-class re-engagement is gated on real new activity — no risk of pinging silent leads with stale templates that erode trust.
- **DRAFTS.md, not direct send.** Top-blocker re-engagement goes through Mohammed's review gate per the existing PROTOCOL.md "ship on approval, never publish without explicit go-ahead" rule.
- **Cost-bounded.** ~10 WARM leads × 1 Exa call + ~5 silent top-blockers × 1 Exa call = **15 calls/shift × 30 shifts = 450 calls/month**. Combined with shift-1's 60, total Exa volume is ~510/month — still under any plausible free-tier ceiling, well inside the $200 cap if metered.

## Follow-up wiring (after two weeks)

1. Measure: Day-N follow-up reply rate **with Exa-quoted opener** vs the existing generic template.
2. If reply rate ≥ 1.5× baseline → expand the Exa query to also pull GitHub commit / Reddit-comment-on-other-thread activity.
3. If reply rate stays flat → revert Step 1 of the patch (keep only the top-blocker pass, which has lower volume but higher per-call value).
