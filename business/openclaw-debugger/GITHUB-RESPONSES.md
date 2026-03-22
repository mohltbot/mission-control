# GitHub Issue Responses — March 22, 2026

_Tracking responses to OpenClaw Debugger comments on GitHub issues._

---

## Responded Issues with New Activity

### #49873 — Custom skills not discovered
**Status:** Active discussion  
**New Comments:**
- **Ryce** (Mar 18): Config declares skills paths → discovery ignores them → system prompt disagrees with user intent
- **henry-the-frog** (Mar 18): Tried reproducing on 2026.2.26, workspace skills discovered correctly
- **Hollychou924** (Mar 18): Analysis — likely 2026.3.13 regression in pi-coding-agent dependency
- **Hollychou924** (Mar 18): Root cause — skills discovery has two separate lookup paths
- **lilith-the-dear** (Mar 19): Tried symlink workaround, didn't work. Asked for more help.

**Action:** Follow up with lilith-the-dear — she's engaged and needs help

---

### #49876 — Cron sessions hallucinating
**Status:** Analyzed  
**New Comments:**
- **Hollychou924** (Mar 18): Analysis — cron sessions hallucinate instead of failing cleanly

**Action:** Monitor for fix

---

### #49887 — Slack HTTP mode dropping messages
**Status:** Analyzed  
**New Comments:**
- **Ryce** (Mar 18): Silent message-loss bug with clear boundary state pattern

**Action:** Monitor

---

### #51012 — WhatsApp relink then 401 error
**Status:** Confirmed Windows repro  
**New Comments:**
- **Ryce** (Mar 20): WhatsApp session drop after relink analysis
- **easyvaru-hue** (Mar 20): Additional confirmation from Windows — not the bootstrap issue

**Action:** Windows-specific WhatsApp bug — high priority

---

### #51056 — OpenRouter 401 Missing Authentication
**Status:** Multiple responses  
**New Comments:**
- **teqian** (Mar 20): Thanks for open-sourcing, shared OpenClaw ecosystem toolkit
- **michaelbrinkworth** (Mar 21): Suggested npx ai-doctor for auth debugging

**Action:** teqian shared resource — potential networking opportunity

---

### #51111 — WhatsApp QR login disconnects immediately
**Status:** Referenced previous fix  
**New Comments:**
- **Artyomkun** (Mar 20): Same issue supposedly fixed last week — QR linking was working

**Action:** Regression confirmed

---

### #51097 — Gateway memory leak
**Status:** Being investigated  
**New Comments:**
- **sahilsatralkar** (Mar 20): Looking into this issue, will update with findings

**Action:** Wait for sahilsatralkar's findings

---

### #51062 — Subagent failed to execute
**Status:** Analyzed  
**New Comments:**
- **Artyomkun** (Mar 20): Clear subagent runtime failure — works manually, fails in spawn

**Action:** Known issue, no fix yet

---

### #50504 — CLI gateway handshake timeout
**Status:** Analyzed  
**New Comments:**
- **Ryce** (Mar 19): The 8-9 second cold-boot with plugins means challenge/response times out

**Action:** Core team aware

---

### #50474 — openclaw-cli token auth scope missing
**Status:** Workaround shared  
**New Comments:**
- **lishoulong** (Mar 21): Patched gateway distribution files manually

**Action:** Community workaround available

---

### #50496 — Trashed session messages re-delivered
**Status:** Root cause identified  
**New Comments:**
- **PeterHiroshi** (Mar 20): Root cause analysis — outbound message queue not cleared on trash

**Action:** Fix identified, wait for PR

---

### #50489 — WhatsApp "No active listener"
**Status:** Analyzed  
**New Comments:**
- **Ryce** (Mar 19): Classic self-reported vs actual state divergence

**Action:** Known pattern

---

### #51116 — Discord WebSocket disconnects
**Status:** Additional finding  
**New Comments:**
- **papiofficial** (Mar 20): Config.patch hot reload (SIGUSR1) causes gateway death under load

**Action:** Critical finding — hot reload bug

---

## Summary

**High Priority Follow-ups:**
1. **lilith-the-dear (#49873)** — Custom skills, tried workaround, needs help
2. **teqian (#51056)** — Shared ecosystem toolkit, networking opportunity
3. **papiofficial (#51116)** — Found hot reload bug

**New Leads:**
- **teqian** — Curated OpenClaw ecosystem toolkit, potential collaborator
- **sahilsatralkar** — Investigating memory leak, technical contributor
- **PeterHiroshi** — Root cause analysis on message queue bug

---

_Last updated: March 22, 2026_
