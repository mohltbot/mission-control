# Ben's Bites Implementation — March 14, 2026

## Newsletter 1: Make any media searchable
**Source:** https://www.bensbites.com/p/make-any-media-searchable

### Key Takeaways
- **Gemini Embedding 2** released — multimodal embeddings (text, audio, images, video, PDFs) in one model
- **Replit Agent 4** — multiple parallel agents, live collaboration, design canvas
- **Perplexity Personal Computer** teased — always-on Mac mini with file/app access (like OpenClaw)
- **Async Voice API** — human-like TTS for agents, $0.50/hour
- **Karpathy's autoresearch prompt** breakdown available
- **Claude Cowork** now has scheduled tasks (but only runs when computer is awake)

### Implementation Ideas

#### 1. Gemini Embedding 2 Integration
**Use case:** Search across all your media files
**Implementation:**
- Use Gemini Embedding 2 to index videos, audio, PDFs
- Build semantic search across media library
- Cheap for video/audio at low fps

```bash
# Pseudo-implementation
gemini-embed video.mp4 --fps 1 --output embeddings.json
gemini-embed audio.wav --output embeddings.json
gemini-search "find the part where we discussed pricing"
```

#### 2. Async Voice API for OpenClaw
**Use case:** Voice responses during your runs
**Implementation:**
- Integrate Async Voice API (Twilio alternative)
- $0.50/hour vs Twilio's $0.013/minute (~$0.78/hour)
- 15 languages, streaming-ready

#### 3. Perplexity Personal Computer Alternative
**Use case:** Always-on agent with file access
**Implementation:**
- You already have this with OpenClaw
- Perplexity's version is Mac mini only
- Your setup: Mac mini + OpenClaw + scheduled tasks

#### 4. Scheduled Tasks in Cowork
**Use case:** Ben's Bites auto-scan
**Implementation:**
- Claude Cowork has `/schedule` now
- BUT: Only runs when computer is awake
- Your OpenClaw cron is better (runs 24/7)

---

## Newsletter 2: How (and what) I'm building this week
**Source:** https://www.bensbites.com/p/how-and-what-im-building-this-week

### Key Takeaways
- **Interactive cookbook** — agent teaches while you build
- **Visualise skill** — 200+ stars, makes Codex/Claude output better diagrams
- **Ben's model mix:** GPT 5.4 XHigh for code, Opus 4.6 for planning/design
- **Tools:** Droid (Factory), Pi (fast, lightweight), Cmux (terminal with sidebar)
- **Skills:** frontend-design, json-render, agent-browser, react-doctor
- **AGENTS.md** — build loop with /spec/ folder, progress.md, dogfood testing

### Implementation Ideas

#### 1. Interactive Cookbook for ArchTrack
**Use case:** Teach your uncle to use ArchTrack
**Implementation:**
- Create interactive guide at `gists.sh`
- Uncle copies URL into Claude/Codex
- Agent walks him through setup while he builds

#### 2. Visualise Skill for Documentation
**Use case:** Better diagrams in ArchTrack docs
**Implementation:**
- Install: https://github.com/bentossell/visualise
- Use for architecture diagrams, flow charts
- Makes Claude output interactive visualizations

#### 3. AGENTS.md Build Loop
**Use case:** Standardize your development process
**Implementation:**
Create `AGENTS.md` in workspace root:

```markdown
# Build Loop

1. Create /spec/ folder with numbered specs (00_spec1.md, 01_spec2.md)
2. Create progress.md for session continuity
3. Use agent-browser with dogfood before testing
4. Write tests with good coverage
5. Reference docs with Context7 CLI
6. First message: "feel the rhythm, feel the rhyme, get on up, its bobsled time"
```

#### 4. json-render Skill for Dashboard
**Use case:** Quick UI prototypes for ArchTrack
**Implementation:**
- Install skill from Vercel
- Generate admin dashboard UI fast
- Use for automation visualizations

#### 5. Model Mixing Strategy
**Use case:** Optimize costs/quality
**Implementation:**
- GPT 5.4 XHigh: New features, complex code
- Opus 4.6: Planning, research, design
- Sonnet 4.5: Daily tasks, quick fixes

---

## Priority Actions

1. **This weekend:** Try Ben's interactive cookbook approach for ArchTrack docs
2. **Next week:** Install visualise skill, test with ArchTrack architecture diagrams
3. **Ongoing:** Implement AGENTS.md build loop in your workspace
4. **Consider:** Async Voice API vs Twilio for phone calls

## Files to Create
- `/workspace/AGENTS.md` — build loop instructions
- `/workspace/bensbites-implementations/gemini-embedding-setup.md`
- `/workspace/bensbites-implementations/async-voice-integration.md`
