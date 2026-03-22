# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

---

## Avatar

**Concept:** Shield with Saudi green + Indian saffron, tech core center  
**Reference:** See `avatar/AVATAR.md` and `avatar/avatar-concept.png`  
**Status:** Concept saved, needs simplified + high-res versions  

---

## Infrastructure

### Primary Server
- **Mac mini 4** — 16GB RAM, 256GB SSD
- **Location:** San Francisco home
- **Status:** Runs 24/7 (required for ArchTrack)
- **OS:** macOS (Darwin)

### Deployed Services
- **ArchTrack** — http://165.227.78.107/ (DigitalOcean)
- **Mission Control** — File-based tracking (`mission-control.md`)

---

## API Accounts & Credits

### LLM Providers (All Working ✅)
| Provider | Status | Credit | Notes |
|----------|--------|--------|-------|
| **Moonshot** | ✅ Active | ~$20 | Primary LLM (kimi-k2.5) |
| **DeepSeek** | ✅ Active | ~$20 | Direct API — reasoning + chat |
| **Qwen** | ✅ Active | ~$20 | HuggingFace inference |
| **MiniMax** | ✅ Active | ~$20 | Chinese LLM provider |
| **HuggingFace** | ✅ Active | ~$20 | DeepSeek-R1, Llama, etc. |

### Search & Data
| Provider | Status | Credit | Notes |
|----------|--------|--------|-------|
| **Tavily** | ✅ Active | Free tier | Web search (replaces Brave) |
| **Brave** | ⚠️ Issues | — | Keys invalid — use Tavily |
| **Google Places** | ✅ Active | Free tier | Location/search data |

### Productivity & Cloud
| Provider | Status | Credit | Notes |
|----------|--------|--------|-------|
| **Notion** | ✅ Active | — | Workspace integration |
| **n8n** | ⚠️ Limit hit | — | Monthly quota exceeded |
| **DigitalOcean** | ✅ Active | — | Droplet management |
| **Twilio** | ✅ Active | — | SMS/voice (8 calls in account) |
| **Google Workspace** | ✅ Active | — | Gmail, Calendar, Drive, Sheets |
| **GitHub** | ✅ Active | — | CLI + PAT configured |
| **Discord** | ✅ Active | — | Bot active (@Mohlt) |
| **BrowserUse** | ✅ Active | ~$10 | Browser automation API |

**Monthly Budget:** $200 max (currently ~$6 used)

---

## Active Projects

### ArchTrack (Deployed)
- **URL:** http://165.227.78.107/
- **Employees:** Ahmed ($65/hr), Mohammed ($75/hr), Sarah ($85/hr)
- **Projects:** 3 active, $1.55M total portfolio
- **Status:** Production ready, Genesis AI enhanced

### OpenClaw Debugger (Active)
- **Pipeline:** 19 leads (5 hot, 9 warm, 5 cold)
- **Revenue Model:** $75 avg per lead
- **Target:** $1,800/month
- **Status:** Content pipeline active, 17 pieces ready

### VC Portfolio Agentification (Complete)
- **Deliverable:** 16 n8n workflows for 16 portfolio companies
- **Status:** Done — need to send loom to VC

---

## Subscriptions

- **n8n** — Workflow automation
- **Fiverr Kickstarter** — Gig promotion
- **DigitalOcean** — ArchTrack hosting (~$5-10/month)

---

## Development Tools

### GitHub
- **Personal:** mohltbot/mission-control (private, full dev)
- **Public:** maximizeGPT/Archtrack (open source)

### Local Ports
- **3000** — Previously Mission Control dashboard (removed)
- **3001** — ArchTrack local dev

---

## Ben's Bites Tools (Tested March 22, 2026)

### Working Tools (Active)

| Tool | CLI/Path | Status | Purpose |
|------|----------|--------|---------|
| **Lossless Claw** | OpenClaw Plugin | ✅ LIVE | DAG-based conversation compaction |
| **Context Hub** | `chub` | ✅ LIVE | Curated API documentation |
| **Autocontext** | `autoctx` | ✅ LIVE | Self-improving agent loops |

**Lossless Claw:**
- Location: `~/.lossless-claw/repo/`
- Database: `~/.openclaw/lcm.db`
- Tools: `lcm_grep`, `lcm_describe`, `lcm_expand`
- Status: Plugin loaded, auto-compacts conversations

**Context Hub:**
- Location: `~/.openclaw/tools/context-hub/`
- Usage: `cd ~/.openclaw/tools/context-hub && node cli/bin/chub search <topic>`
- Coverage: DeepSeek, Tavily, OpenAI, Python, React
- Gaps: Moonshot/Kimi not in registry

**Autocontext:**
- Location: `~/.openclaw/tools/autocontext/`
- Usage: `~/.openclaw/scripts/autocontext-run.sh <scenario> <gens>`
- Scenarios: grid_ctf, othello
- Provider: Deterministic (no API costs)

### Tools Needing API Keys

| Tool | Script | Needs | Status |
|------|--------|-------|--------|
| **BrowserBase Fetch** | `scripts/browserbase-fetch.sh` | `BROWSERBASE_API_KEY` | ⚠️ Not configured |
| **Cloudflare Crawl** | `scripts/cf-crawl.sh` | `CF_API_TOKEN`, `CF_ACCOUNT_ID` | ⚠️ Not configured |
| **Firecrawl CLI** | `scripts/firecrawl-agent.sh` | `FIRECRAWL_API_KEY` | ⚠️ Not configured |

### Broken/Down Tools

| Tool | Issue | Status |
|------|-------|--------|
| **Context7** | Service API returns 404 | ⚠️ Down |
| **Upstash Box** | Fake product (doesn't exist) | ❌ Broken |
| **NemoClaw** | Needs Docker/OpenShell | ⚠️ Parked |

### Documented Skills (Not Installed)

From Ben's Bites March 13 — documented in AGENTS.md:
- **Visualize** — Interactive charts/diagrams (https://github.com/bentossell/visualise)
- **JSON Render** — Generative UI (https://skills.sh/vercel-labs/json-render)
- **React Doctor** — React code quality (https://github.com/millionco/react-doctor)
- **Agent Browser** — Browser automation with dogfood tag
- **Gists.sh** — GitHub gist rendering (https://gists.sh/)

---

## Notes

- **Mobile-first requirement:** Everything must work on phone
- **Testing standard:** "Test repeatedly and thoroughly"
- **Risk tolerance:** Willing to try deposit model for client projects
- **Budget conscious:** $200/month AI budget, optimize for efficiency
- **Ben's Bites testing:** All implementations tested before adding to this file

---

_Last updated: March 22, 2026_
