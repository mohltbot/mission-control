# Deep Research CLI (Browserbase)

> From Ben's Bites (March 26, 2026): Proof of concept research agent using Browserbase Search, Fetch, and OpenAI

## What is it?

A CLI research agent by Aaron Francis that discovers broad web coverage with Browserbase Search, retrieves pages with Browserbase Fetch, and synthesizes structured research briefs.

**Key Features:**
- **Search API** - Discovery via Browserbase Search (`bb.search.web`) across multiple query angles
- **Fetch API** - Retrieval via Browserbase Fetch with concurrency, retries, redirect handling
- **No browser sessions** - API-first, no Playwright/Puppeteer dependency in default flow
- **Citation-grounded** - Produces research briefs with source citations

## Architecture

1. **Discover** - Runs multiple diversified Browserbase Search queries, canonicalizes + dedupes URLs
2. **Select** - Picks diverse candidate set (prevents one domain from dominating)
3. **Fetch** - Fetches candidates concurrently with retries, status/content-type checks
4. **Synthesize** - Summarizes in chunks, produces final citation-grounded brief
5. **Diagnostics** - Appends retrieval metrics to the report

## Prerequisites

- [Browserbase](https://browserbase.com) account (free tier: 1,000 searches)
- [OpenAI](https://platform.openai.com) API key
- Node.js

## Installation

```bash
cd tools/deep-research
npm install
cp .env.example .env
# Edit .env with your API keys
```

## Usage

```bash
# Default topic
npm run research

# Custom topic
npm run research -- "latest developments in local-first software"
npm run research -- "state of WebAssembly in 2026"
```

## Environment Variables

```bash
BROWSERBASE_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here
```

## Why This Fits Our Stack

- Already have Browserbase credits (free tier active)
- Uses Tavily/Brave search approach but via Browserbase APIs
- CLI-first research tool perfect for agent workflows
- No browser session overhead = faster, cheaper research
- Can integrate into OpenClaw debugging and content pipeline

## Links

- GitHub: https://github.com/aarondfrancis/deep-research
- Video tutorial: https://youtu.be/2NcLtWazHFU
- Source: https://www.bensbites.com/p/a-peek-inside-cli-tools
