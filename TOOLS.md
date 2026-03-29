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
| **Browserbase** | ✅ Active | Free tier | Managed browser infrastructure |

### Browser Automation
| Tool | Status | Setup | Notes |
|------|--------|-------|-------|
| **Browserbase CLI** | ✅ Installed | `scripts/setup-browserbase-cli.sh` | Web scraping, screenshots |
| **Puppeteer** | ✅ Local | `npm install puppeteer` | Local browser automation |
| **n8n** | ⚠️ Limit hit | — | Monthly quota exceeded |
| **DigitalOcean** | ✅ Active | — | Droplet management |
| **Twilio** | ✅ Active | — | SMS/voice (8 calls in account) |
| **Google Workspace** | ✅ Active | — | Gmail, Calendar, Drive, Sheets |
| **GitHub** | ✅ Active | — | CLI + PAT configured |
| **Discord** | ✅ Active | — | Bot active (@Mohlt) |
| **BrowserUse** | ✅ Active | ~$10 | Browser automation API |

**Monthly Budget:** $200 max (currently ~$6 used)

### Web Scraping & Data Extraction
| Provider | Status | Credit | Notes |
|----------|--------|--------|-------|
| **Firecrawl** | ✅ Active | Free tier (500 credits) | Web scraping, crawling, search API |
| **dev-browser** | ✅ **LIVE** | — | CLI browser automation via sandboxed JS |
| **browse CLI** | ✅ **LIVE** | — | Local Chrome automation (Stagehand-based) |

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

## Ben's Bites Tools (Updated March 27, 2026)

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

### Tools with API Keys Configured

| Tool | CLI | Status | Setup |
|------|-----|--------|-------|
| **Firecrawl** | `firecrawl` | ✅ LIVE | Authenticated, 8 skills installed |

**Firecrawl:**
- CLI: `firecrawl` (globally installed)
- Skills: `~/.agents/skills/firecrawl*` (8 skills for OpenClaw)
- Auth: Personal team, authenticated via browser
- Commands: `firecrawl scrape`, `firecrawl crawl`, `firecrawl search`, `firecrawl map`

### Tools Needing API Keys

| Tool | Script | Needs | Status |
|------|--------|-------|--------|
| **BrowserBase Remote** | browse CLI | API key format fix | ⚠️ Local mode works, remote has key issue |
| **Cloudflare Crawl** | `scripts/cf-crawl.sh` | `CF_API_TOKEN`, `CF_ACCOUNT_ID` | ⚠️ Not configured |

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

### New Tools (March 28, 2026 - Ben's Bites) — ✅ COMPLETE

| Tool | Type | Status | How to Use |
|------|------|--------|------------|
| **dev-browser** | CLI | ✅ **LIVE** | `dev-browser --headless <<'EOF' ... EOF` |
| **browse CLI** | CLI | ✅ **LIVE** | `browse env local && browse open <url>` |
| **browserbase skills** | Skills | ✅ **SYNCED** | 6 skills in `~/.openclaw/skills/` |
| **deep-research** | CLI | 🔍 **NOT FOUND** | Still searching for this tool |
| **Expect** | Testing | 🔍 **RESEARCHING** | Aiden Bai's QA tool |
| **Feynman** | Research | 🔍 **RESEARCHING** | CLI paper research |

**dev-browser:**
- Status: ✅ Installed and tested
- Install: `npm install -g dev-browser && dev-browser install`
- Features: Sandboxed JS execution (QuickJS WASM), Playwright API, persistent pages
- Security: No host filesystem/network access
- Example:
  ```bash
  dev-browser --headless <<'EOF'
  const page = await browser.getPage("main");
  await page.goto("https://example.com");
  console.log(await page.title());
  EOF
  ```

**browse CLI:**
- Status: ✅ Built from Stagehand monorepo, local mode working
- Path: `/usr/local/bin/browse`
- Source: `/tmp/stagehand/packages/cli/`
- Local mode: ✅ Uses local Chrome (no API keys needed)
- Remote mode: ⚠️ Has API key format issue — local mode covers most use cases
- Commands:
  ```bash
  browse env local                    # Switch to local Chrome
  browse open https://example.com     # Navigate to URL
  browse snapshot                     # Get accessibility tree with element refs
  browse click @0-5                   # Click element by ref
  browse fill "input#search" "query"  # Fill form
  browse stop                         # Stop browser daemon
  ```

**browserbase OpenClaw Plugin:**
- Plugin: `@browserbasehq/openclaw-browserbase`
- API Key: `bb_live_wcf_hifEpOOIlJL2KfqQ4Y3hCGM`
- Project ID: `9ae2bf1c-45a4-4222-abb4-5b3074b55d39`
- Skills synced: `browser`, `functions`, `fetch`, `search`, `cookie-sync`, `browserbase-cli`
- Location: `~/.openclaw/skills/`

---

## Notes

- **Mobile-first requirement:** Everything must work on phone
- **Testing standard:** "Test repeatedly and thoroughly"
- **Risk tolerance:** Willing to try deposit model for client projects
- **Budget conscious:** $200/month AI budget, optimize for efficiency
- **Ben's Bites testing:** All implementations tested before adding to this file

---

_Last updated: March 28, 2026_
