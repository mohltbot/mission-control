# Patch: `mission-control-update` — add an Outcomes-grader section

> **Source:** Ben's Bites — May 7, 2026 ("Elon doubled limits"), Headlines section.
> **Item:** "Code with Claude... Outcomes — Describe what success looks like, and a grader will judge the agent's work." (from the Anthropic Managed Agents launch summary).
> **Project advanced:** Mission Control (PROJECTS.md #9) + Mohlt Cowork stack itself (Tier 2 ops layer).
> **Why patch this task:** `mission-control-update` runs every 48 hours and is the most "load-bearing" sync we have — it touches GitHub, Gmail, Calendar, the pipeline, ArchTrack, and autopush health. If it silently runs and produces a low-value report, we lose 48 hours of mission-control freshness. An Outcomes grader pattern lets the run **score itself before posting Discord**, and skip the Discord post if the run failed its own success criteria, replacing it with an honest "run failed self-grade — here's why" message.

---

## How to apply this patch

Open the `mission-control-update` scheduled task in Cowork → edit the prompt → paste **Section A** in directly after the existing automation-rules block, and **Section B** in directly before the Discord-report step.

---

## Section A — drop in after the automation-rules block

```
## OUTCOMES — define success before doing the work

Before scoring or sending anything, internally define this run's success criteria. The criteria are:

  1. **Coverage.** Did this run check all 9 scheduled tasks in STACK.md, the GitHub mohltbot/mission-control + maximizeGPT/Archtrack repos, the Gmail inbox for the last 48 hours, today's + tomorrow's Calendar, and the OpenClaw debugger pipeline (LEADS.md / DRAFTS.md)?
  2. **Freshness.** Did `mission-control.md` actually get updated, or is the last edit > 24 hours ago?
  3. **Signal.** Does the Discord report contain at least one item Mohammed didn't already know? (Heuristic: at least one new lead, one new commit since last run, one calendar item not on the last report, OR an explicit "nothing new this 48-hour window" with the corroborating zero-counts.)
  4. **No prohibited actions.** Did this run avoid sending any email, message, or Discord-non-report on Mohammed's behalf?
  5. **Autopush health.** Is `logs/git-autopush.log` showing a heartbeat within the last 10 minutes?

Hold these criteria in working state through the run. Do NOT post Discord yet.
```

## Section B — drop in immediately before the Discord-report step

```
## SELF-GRADE — judge this run against the OUTCOMES criteria

Before posting Discord, score this run honestly:

  - For each of the 5 criteria above, write one line: `[Coverage|Freshness|Signal|No-prohibited|Autopush] — PASS / FAIL — [one-line reason]`.
  - Put the per-criterion lines into a code block at the bottom of `mission-control.md` under a heading `## Last self-grade — <ISO timestamp>`.

Then decide which Discord message to post:

  - **All 5 PASS** → post the normal mission-control update.
  - **1 FAIL** → post the normal update PLUS an extra final line: `⚠️ self-grade fail: [criterion] — [one-line reason]`. Keep going.
  - **2+ FAIL** → do NOT post the normal update. Instead post a 3-line message:
        ```
        ⚠️ mission-control-update — run failed self-grade
        Failed: <list criteria>
        Why: <one paragraph>
        ```
    Then end the run. Mohammed reads the workspace files for full context.

Never inflate to PASS to look productive. A weekly FAIL log is the early-warning system that something in the stack drifted.
```

---

## What changes when this patch is applied

  - **Today:** the `mission-control-update` task posts the same Discord report it does today.
  - **First time something silently breaks** (Gmail MCP times out, autopush wedges, calendar permissions revoked): the next mission-control-update run catches it via FAIL grades and Mohammed sees "⚠️ run failed self-grade" within hours instead of "the report just looked thin and I didn't notice."
  - **Cumulative:** the `## Last self-grade — <ts>` blocks at the bottom of `mission-control.md` build a longitudinal log of stack health, which other scheduled tasks (or a future Mission Control Next.js dashboard) can read.

## Follow-up wiring needed (not blocking)

  1. After 1 week, sweep `mission-control.md` for self-grade entries and confirm at least 5 of the last 7 are all-PASS. If not, debug the failing criterion.
  2. Consider applying the same Outcomes pattern to `bens-bites-implementation` (this task) and `inbox-monitor` next.
  3. When the Mission Control Next.js dashboard ships, render the self-grade history as a sparkline on the dashboard.

## Pattern reusability

This same Section A / Section B template plugs into any of the 9 active scheduled tasks. The criteria differ per task; the structure is identical. After this patch lands and runs cleanly for ~10 cycles on `mission-control-update`, copy the pattern into the next-most-load-bearing task (`debugger-shift-1` is a strong candidate — its 4-criterion grader would be: Did I read LEADS.md, did I update DRAFTS.md, did I write today's shift1 memory file, did I post Discord without fabricating leads).
