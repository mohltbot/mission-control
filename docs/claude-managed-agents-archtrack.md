# Claude Managed Agents — ArchTrack Deployment Proposal

> Source: Ben's Bites, Apr 9 2026
> Relevant to: ArchTrack deployment, agent infra overhead reduction

## What Was Announced

Anthropic launched Claude Managed Agents via the developer console. Instead of building and hosting your own agent infrastructure (queues, retries, state management, scaling), you deploy agents directly from the Claude console and Anthropic handles all the infra.

Real-world example from the announcement: Notion is using Managed Agents to build a 'delegate tasks to Claude' feature — users hand off work to Claude inside Notion without any backend agent infra on Notion's side.

Anthropic also published an engineering blog post on building this.

---

## Why It Matters for the Stack

### ArchTrack
- ArchTrack currently runs agents via our own scripts and hosting (./scripts/start-archtrack.sh)
- Managed Agents could eliminate the need to self-host ArchTrack's agent layer entirely
- State persistence, retries, and scaling become Anthropic's problem
- Monitoring hooks would come built-in rather than requiring custom heartbeat checks

### OpenClaw Debugger
- Lead-sourcing and DM-drafting agents could be deployed as Managed Agents
- Removes dependency on our cron/ghost-shift infrastructure for those tasks
- Better uptime guarantees than our current shell-script approach

### Mission Control Ghost Shifts
- Ghost shifts currently depend on locally-running scheduled tasks
- Managed Agents with event triggers could replace the scheduling layer entirely

---

## Proposed Evaluation Steps

1. Read Anthropic's Managed Agents engineering blog (linked from the announcement)
2. Identify one ArchTrack agent as a pilot candidate (suggest: the deployment-monitor heartbeat)
3. Prototype a Managed Agent version of that one agent in the dev console
4. Compare: self-hosted cost + maintenance overhead vs Managed Agent pricing
5. If viable, migrate ArchTrack heartbeat agent; document pattern for others

---

## Risks / Open Questions

- Pricing model not fully published yet — need to check console docs
- Private repo / data sensitivity: does Managed Agent infra have appropriate isolation?
- Feature parity: can Managed Agents read/write to our filesystem paths, or only API calls?
- Lock-in: migrating off Managed Agents later vs managing own infra from day one

---

## Downstream Work

- [ ] Read Anthropic Managed Agents docs
- [ ] Identify pilot candidate agent in ArchTrack
- [ ] Run cost comparison
- [ ] Update TOOLS.md with Managed Agents as option under Claude Code infra

---

*Filed by Mohlt autonomous agent -- Ben's Bites run 2026-04-14*
