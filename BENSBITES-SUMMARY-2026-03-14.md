📰 **Ben's Bites Summary - March 13, 2026**

**TL;DR:** This week's newsletter is a "builder's log" where Ben Tossell shares his personal AI development stack, featuring interactive cookbooks for learning, new visualization skills from Claude, and a comprehensive breakdown of CLI tools, agent apps, and skills he's using.

---

## 🔥 IMPLEMENTATIONS

### 1. **Visualize Skill + Build Loop Pattern** → Mission Control
**Why it fits:** Your dashboard needs better data visualization for tasks, expenses, and sub-agent monitoring.
**What was implemented:**
- Added Ben's build loop pattern to AGENTS.md (spec folders, progress.md, dogfood testing)
- Documented visualize skill for interactive charts/diagrams
- Documented json-render skill for workflow canvases
- Created comprehensive integration guide
**Files modified:** `AGENTS.md`, `docs/VISUALIZATION-INTEGRATION.md`
**PR:** https://github.com/mohltbot/mission-control/pull/25

### 2. **Interactive Cookbook Pattern** → ArchTrack
**Why it fits:** Architecture firms have employee turnover - you need better onboarding than informal training.
**What was implemented:**
- Created interactive employee onboarding cookbook (learn-by-building pattern)
- Employees build their own dashboard while learning the system
- Covers everything from productivity scoring to custom dashboard creation
- ~90 minutes of structured learning vs. days of informal training
**Files modified:** `AGENTS.md`, `arch-firm-dashboard/EMPLOYEE-ONBOARDING-COOKBOOK.md`
**PR:** https://github.com/mohltbot/archtrack/pull/1

---

## 📝 SKIPPED/NOTEWORTHY

**Major News:**
• **Claude Desktop Visualization** - Now creates interactive charts/diagrams in beta (all plans). This is what Ben reverse-engineered into the visualize skill.
• **Ben's Hardware Upgrade** - Codex crapped out during workshop, needed new MacBook. Hardware matters for serious agent work.
• **Ben's Investment** - Invested in here.now (instant static hosting) this week.

**Tools to Monitor:**
• **Cmux** - Terminal with sidebar for organizing agent chats, draggable panels, built-in browser. Ben uses this daily instead of Ghostty now.
• **Zed** - High-performance editor paired with Cmux for file management.
• **Pi CLI** - Fast, lightweight alternative to Droid where your instructions guide it more.

**Worth Knowing:**
• Ben is waiting for **ui.sh** from the Tailwind team instead of using Anthropic's frontend-design skill
• The "dogfood" tag on agent-browser catches errors before you share URLs - critical for quality
• Gists.sh makes GitHub gists beautiful for agent consumption - better than raw gists

---

## 💰 BUDGET IMPACT

All implementations use FREE tools:
• visualize skill: MIT License
• json-render: Vercel free tier
• react-doctor: MIT License
• gists.sh: Free public gists

**Total Cost: $0** (Well under your $200/mo target ✅)

---

*Both PRs are opened as Draft with `ai-generated` label - review before merging*

---

## PLAIN TEXT SUMMARY FOR DISCORD

Ben's Bites March 13, 2026 - Builder's Log Theme

TL;DR: Ben shares his AI development stack including interactive cookbooks, visualization skills, and comprehensive tool breakdown.

IMPLEMENTATIONS:

1. Visualize Skill → Mission Control (PR #25)
   - Added build loop pattern to AGENTS.md
   - Documented visualize, json-render, react-doctor skills
   - Created visualization integration guide
   - Why: Better dashboard charts for tasks/expenses/agents
   - Cost: FREE

2. Interactive Cookbook → ArchTrack (PR #1)
   - Created employee onboarding cookbook
   - Learn-by-building pattern (90 min vs days of informal training)
   - Covers productivity scoring, time entry, custom dashboards
   - Why: Architecture firms need structured onboarding
   - Cost: FREE

SKIPPED/NOTEWORTHY:
- Claude Desktop now has visualization (beta, all plans)
- Ben needed new MacBook (Codex crashed during workshop)
- Ben invested in here.now (static hosting)
- Tools to watch: Cmux (terminal), Zed (editor), Pi CLI (lightweight agent)

BUDGET: $0 - All free tools, well under $200/mo target
