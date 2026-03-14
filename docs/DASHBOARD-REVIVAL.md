# Mission Control Dashboard Revival Plan

The Mission Control Dashboard was removed during the March 12-13 repository cleanup. This document outlines what was lost, what's needed, and how to restore it.

## What Was Removed

The following components were deleted in commit `79c4fd0`:

### Core Dashboard (`mission-control/` directory)
- **Next.js 15** application with glassmorphism UI
- **Task Board** component with drag-and-drop
- **Budget Tracker** with real-time cost monitoring
- **Agent Monitor** for system health
- **Memory Browser** for conversation history
- **Model Optimizer** for routing decisions

### API Endpoints
- `/api/health` - System health check
- `/api/diagnostics` - Comprehensive diagnostics
- `/api/expenses` - Expense tracking
- `/api/memories` - Memory database queries
- `/api/tasks` - Task management
- `/api/models/*` - Model comparison and recommendations

### Data Storage
- `data/db.json` - Local JSON database
- Expense tracking history
- Task states and completions

## Current State

### What's Still Working
- ✅ Cloudflare tunnel is RUNNING
- ✅ GitHub repository is active
- ✅ All scripts in `scripts/` directory
- ✅ ArchTrack project is intact
- ✅ Documentation preserved

### What's Missing
- ❌ Dashboard UI (localhost:3000 not responding)
- ❌ API endpoints
- ❌ Real-time task board
- ❌ Budget visualization
- ❌ Memory browser interface

## Revival Options

### Option 1: Full Restoration (Recommended)
**Effort:** 2-3 hours  
**Pros:** Complete functionality restored  
**Cons:** Re-introduces technical debt

Steps:
1. Checkout the dashboard files from before cleanup:
   ```bash
   git checkout 444bbbf -- mission-control/
   ```
2. Review and clean up the restored code
3. Update dependencies
4. Test locally
5. Commit with cleanup improvements

### Option 2: Lightweight Revival
**Effort:** 1 hour  
**Pros:** Minimal code, faster startup  
**Cons:** Reduced functionality

Create a minimal dashboard with:
- Static HTML page reading from mission-control.md
- Simple health check endpoint
- No database required

### Option 3: GitHub-Powered Dashboard
**Effort:** 30 minutes  
**Pros:** No local server needed  
**Cons:** Read-only, no real-time updates

Use GitHub's interface as the dashboard:
- mission-control.md is the source of truth
- GitHub Issues for task tracking
- GitHub Projects for kanban board
- Actions for automation

## Recommended Approach: Hybrid

Combine Option 1 (selective restoration) with Option 3 (GitHub integration):

### Phase 1: Restore Core (This Ghost Shift)
1. ✅ Create blocked task notifier script
2. ✅ Create Discord setup documentation
3. ⬜ Restore minimal dashboard (health check only)

### Phase 2: Enhanced Dashboard (Future)
1. ⬜ Restore Task Board component
2. ⬜ Integrate with GitHub Issues API
3. ⬜ Add real-time updates via WebSocket

### Phase 3: Full Revival (If Needed)
1. ⬜ Restore all API endpoints
2. ⬜ Restore Memory Browser
3. ⬜ Restore Model Optimizer

## Immediate Actions

### Create Minimal Health Endpoint
Since the full dashboard is gone, create a simple health check:

```bash
# scripts/health-server.sh
#!/bin/bash
# Minimal health server for Mission Control

PORT="${PORT:-3000}"

echo "Starting minimal health server on port $PORT..."

while true; do
    echo -e "HTTP/1.1 200 OK\r\nContent-Type: application/json\r\n\r\n{\"status\":\"ok\",\"timestamp\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ)\",\"note\":\"Dashboard in revival mode - see docs/DASHBOARD-REVIVAL.md\"}" | nc -l $PORT
done
```

### Update Cloudflare Tunnel
The tunnel is running but has nothing to route to. Options:
1. Point to the minimal health server
2. Temporarily disable until dashboard is restored
3. Route to a static status page

## Decision Needed

**Question for you:** Do you want me to:

1. **Full restore** - Bring back the complete dashboard (2-3 hours)
2. **Minimal restore** - Just health check and basic status (30 min)
3. **GitHub-only** - Use GitHub interface, no local dashboard (0 min, just documentation)
4. **Wait** - Leave as-is until you decide

## Current Workaround

Until the dashboard is restored, use these alternatives:

| Feature | Alternative |
|---------|-------------|
| Task Board | View `mission-control.md` on GitHub |
| Budget Tracking | Check logs in `logs/` directory |
| Health Status | Run `./scripts/mc-health-check.sh` |
| Blocked Tasks | Run `./scripts/blocked-task-notifier.sh` |
| Memory Browser | Read `memory/` files directly |

## Files to Restore (If Full Revival)

From commit `444bbbf`:
```
mission-control/
├── app/
│   ├── api/
│   ├── dashboard/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── AgentStatus.tsx
│   ├── CostAlert.tsx
│   ├── ExpenseTracker.tsx
│   ├── MemoryBrowser.tsx
│   ├── ModelOptimizer.tsx
│   ├── SavingsStats.tsx
│   ├── StatsCard.tsx
│   ├── TaskBoard.tsx
│   └── diagnostics-widget.tsx
├── lib/
│   ├── api-tracker.ts
│   ├── auto-router.ts
│   ├── db.ts
│   ├── diagnostics/
│   ├── expense-tracker.ts
│   ├── model-router.ts
│   └── pricing.json
├── data/
│   └── db.json
├── next.config.js
├── package.json
└── tsconfig.json
```

## Success Criteria

Dashboard revival is complete when:
- [ ] http://localhost:3000 responds with status page
- [ ] `/api/health` returns system status
- [ ] Task board displays current mission-control.md state
- [ ] Budget tracking shows accurate spend data
- [ ] Cloudflare tunnel routes successfully to dashboard

## Next Steps

1. **Await your decision** on revival approach
2. **Meanwhile:** Use scripts for health checks and notifications
3. **Documentation:** Keep mission-control.md as source of truth
4. **Monitoring:** Blocked task notifier will alert on schedule

---

*Created during Ghost Shift: March 13, 2026 6:57 PM PST*  
*Related: `scripts/blocked-task-notifier.sh`, `docs/BENSBITES-DISCORD-SETUP.md`*
