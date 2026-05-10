# Anthropic Finance Agent Templates — Customer-Facing Leverage Pitch

> **Source:** Ben's Bites — May 7, 2026 ("Elon doubled limits"), Headlines section.
> **Item:** "Anthropic released 10 finance agent templates for pitchbooks, KYC screening, valuation reviews, **month-end close** and more. They run as Claude Cowork/Claude Code plugins or Managed Agents cookbooks."
> **Project advanced:** Dad's Middle East Accounting-Automation Firm (PROJECTS.md #4) — also helps Siegfried AI Advisory pitch (#3).
> **Why this is leverage:** Anthropic itself shipped the same category of automation we are selling. We are no longer the lone evangelist — we are the implementation arm of an Anthropic-shipped pattern.

---

## One-pager (drop into customer deck or send as Loom intro)

### Slide / Loom script

> "Last week Anthropic — the company that makes Claude — released ten official agent templates. One of them is **month-end close**. Another is **KYC screening**. Two more are **valuation reviews** and **pitchbook generation**. Anthropic publishing these means the world's leading AI lab now agrees: this is the work agents can actually do today, in production, for accounting and finance teams.
>
> What we offer is not a science project. It is the same pattern Anthropic just released — **deployed inside your firm, customized to your chart of accounts, integrated with your ERP, and supervised by a CPA** — me. The official template is the floor. Our customization is the value-add.
>
> Anthropic's templates are public. Hiring a generalist agency to glue them together is an option. The reason to work with us instead is that I am the CPA in the loop. I have been building the same automations inside Siegfried for [Siegfried's Fortune-500 clients] every day for the last [X] months. The templates are commodity — the chart-of-accounts mapping, the cutoff rules, the audit trail, and the intercompany elims are not. That is where we earn our fee."

### Three sentences for cold outreach

> Anthropic just shipped ten official agent templates for finance work — month-end close, KYC, valuation reviews, pitchbooks. We deploy and customize those templates for Middle East mid-market firms, with a US CPA in the loop. First two automations are free; if they save you a week per close, you keep them and we discuss expanding.

### Six-bullet "what's in the box" leave-behind

The official Anthropic templates we extend (subject to verifying each on Anthropic's docs page before sending to a real customer):

  1. **Month-end close orchestrator** — runs the close checklist, reconciles, flags exceptions.
  2. **KYC screening agent** — runs sanctions / PEP checks against named lists.
  3. **Valuation review agent** — pulls comps, builds DCF skeletons, flags assumption drift.
  4. **Pitchbook draft agent** — outputs first-draft pitch decks from a template + recent deal data.
  5. **(Plus six more — list in deck only after Mohammed has verified the full ten on Anthropic's announcement page.)**

### Pricing posture (carry into the deck)

- Per-automation pricing (mirroring Mohammed's Siegfried AI Advisory pitch): **a fixed dollar amount per deployed-and-running automation per month**, sized so the customer's payback on operator hours saved is < 90 days.
- Floor: USD 1,500 / automation / month for the official Anthropic templates with our customization layer.
- Custom automations (anything outside the ten templates) priced higher.
- Discount stacking when 4+ templates are deployed in the same firm.

---

## Why this beats a "generic deck"

The previous deck draft positioned us as "AI consultancy that builds month-end-close automations." This pitch positions us as **"the official-template implementation partner for Anthropic's finance cookbooks."** Two practical effects:

  1. The customer no longer has to take a leap of faith on whether month-end-close-by-agent is real. Anthropic published it. We are the localization + supervision layer.
  2. We can credibly charge Anthropic-template-floor pricing instead of bespoke-build pricing.

This also feeds the Siegfried AI Advisory pitch (#3): in the next monthly leadership AI brief, lead with "Anthropic released a month-end close template — we are already deploying ahead of it for [client]."

---

## What changes when this PR merges

- This file lands in `arch-firm-dashboard/` so it's the canonical leverage pitch for the firm.
- Mohammed's next dad's-firm conversation has a sharper opening line.
- Mohammed's next Siegfried leadership brief has a fresh anchoring item.

## Follow-up wiring needed (not blocking)

  1. Mohammed verifies the ten template names on Anthropic's announcement page (linked from the May 7 Bens Bites issue) and updates the bullet list above with the real names.
  2. Drop the three-sentence cold-outreach version into Dad's outreach list.
  3. Add a section in the next monthly Siegfried AI Advisory brief that lead-anchors on the announcement.
  4. Loom script: re-record any existing customer-facing Looms to open with the "Anthropic just shipped ten templates" anchor.
