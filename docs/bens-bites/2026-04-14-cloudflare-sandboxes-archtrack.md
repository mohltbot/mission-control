# Cloudflare Sandboxes as ArchTrack preview/staging runtime

**Source:** Ben's Bites — "Big lab leaks" (2026-04-14)
**Status:** Draft proposal — not wired in yet.

## Summary of upstream item
Cloudflare Sandboxes hit general availability. Features called out in the newsletter:

- Bundled terminal, code interpreter, live preview URLs, and secure credential storage.
- Sleep-when-idle with on-demand wake.

## Why this is relevant to ArchTrack
ArchTrack's desktop app distribution pipeline currently lacks an ephemeral preview environment for reviewing new builds before handing them to testers. Cloudflare Sandboxes could plausibly serve as:

1. **Preview URL per build** — live share a running instance without provisioning a full VM.
2. **Monitoring harness** — stand up a fresh sandbox per inbound alert, run a diagnostic script, tear down.
3. **Secure credential vault for builds** — Cloudflare's credential model is simpler than rolling Vault.

The "sleeps when idle" behaviour matches our usage: most preview URLs go unused after a day.

## Evaluation checklist
- [ ] Confirm sandbox boot time (target: < 10s for live preview links to feel instant).
- [ ] Check outbound network policy — ArchTrack's monitoring scripts talk to Sentry and a private metrics endpoint.
- [ ] Storage limits per sandbox (we may ship large binaries in preview).
- [ ] Pricing vs. current ad-hoc Fly.io machines.

## Downstream work
- [ ] Write a spike script that provisions a sandbox, uploads a build artifact, and returns a preview URL.
- [ ] Compare vs. current preview flow (none, really — this is greenfield).
- [ ] Decide whether to fold into the ArchTrack deploy pipeline or keep as a reviewer tool.

## Gotchas
- Cloudflare Workers billing can surprise; sandbox pricing may differ. Verify before enabling at scale.
- The Ben's Bites link was the announcement page; no code samples copied into this doc.
