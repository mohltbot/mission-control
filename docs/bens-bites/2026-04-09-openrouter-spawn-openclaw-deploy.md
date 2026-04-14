# OpenRouter Spawn for OpenClaw cloud deployment

**Source:** Ben's Bites — "Anthropic built a model too risky to release" (2026-04-09)
**Status:** Draft proposal — not wired in yet.

## Summary of upstream item
OpenRouter announced **Spawn**: "Deploy OpenClaw and other agents to the cloud of your choice. Works with all models on OpenRouter."

This is a direct call-out to OpenClaw and removes a chunk of deployment plumbing we'd otherwise need to build for OpenClaw Debugger.

## Why this is relevant
OpenClaw Debugger (our Fiverr / Reddit fraud-detection agent stack) currently runs from Mohammed's laptop. Moving scheduled agents to a cloud runtime would:

1. Eliminate laptop-uptime as a SPOF for scheduled triage runs.
2. Let us fan out multiple parallel triage workers per ticket backlog without contention on the local sandbox.
3. Decouple model choice from the runtime — useful if we want Claude Opus for reasoning but a cheaper provider for bulk enrichment.

ArchTrack deployment/monitoring is a closer-fit use case too, if Spawn exposes lifecycle hooks we can plug into our desktop-app distribution flow.

## Evaluation checklist
- [ ] Confirm Spawn supports BYO container / Dockerfile (vs. hosted-only). OpenClaw Debugger has native deps.
- [ ] Secrets story: can we inject our Reddit API / Fiverr scraper creds at runtime without committing them?
- [ ] Scheduling: does Spawn expose cron-style triggers, or just on-demand? We need both.
- [ ] Egress / IP story for Reddit scraping — rotating residential or static?
- [ ] Pricing per hour vs. per token. Compare against just renting a small VPS.

## Downstream work needed
- [ ] Minimal Spawn deployment of one OpenClaw Debugger skill (candidate: `reddit-fraud-triage`).
- [ ] Benchmark latency + cost vs. current local run.
- [ ] Decide whether to migrate all scheduled tasks or only long-running ones.

## Gotchas
- This doc is a research stub — no code wired in. Marked draft so it doesn't auto-merge.
