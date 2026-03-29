# Memory: March 28, 2026 - ArchTrack Major Fixes

## Context
Tonight we fixed critical data quality issues in ArchTrack that were making the system unusable. The employee tracking dashboard was showing garbage data - system processes like `loginwindow` were being tracked as 45 hours of work, productivity was 3%, and there were 16,191 false suspicious activity alerts.

## What We Fixed

### 1. Tracker Logic (desktop/src/)
- Filter system processes before recording (loginwindow, screensaver, etc.)
- Increase idle threshold from 2min to 5min
- Never mark system processes as suspicious
- Relaxed suspicious thresholds (15min idle, 60min same window)

### 2. AI Analytics SQL (admin/server/routes/ai-routes.ts)
- All queries now use COLLATE NOCASE for case-insensitive matching
- Added category != 'break_idle' AND is_idle = 0 filters
- Productivity rankings exclude system idle time
- Suspicious counts exclude system processes

### 3. Server Configuration (admin/server/index.ts)
- Fixed static file path (was dist/dist/client, now dist/client)
- Added 50MB body parser limit for large activity batches
- Simplified path logic

### 4. Pattern Detection (admin/server/ai-analytics.ts)
- Expanded IGNORED_APPS list

## Deployment Issues Encountered

1. **Nested directory structure** - Server runs from /opt/archtrack/arch-firm-dashboard/ but git repo is at /opt/archtrack/. Had to deploy to nested directory separately.

2. **Empty database file** - /opt/archtrack/admin/data/admin.db is 0 bytes, real database is at /opt/archtrack/arch-firm-dashboard/data/admin.db

3. **Static path bug** - Server was looking for admin/dist/dist/client due to NODE_ENV check, fixed by simplifying path logic.

## Verification

After all fixes, Genesis AI now shows:
- Top app: Google Chrome: 1h (was loginwindow: 45h)
- No system apps in top 10
- Realistic app tracking

## Outstanding Items for Next Session

1. Clean up empty database and .bak files
2. Consider consolidating directory structure
3. Install desktop tracker on first employee computer
4. Test end-to-end with real employee data
5. Verify productivity scores are realistic

## Files to Review Tomorrow

- /arch-firm-dashboard/AUDIT-2026-03-28.md (full audit)
- /arch-firm-dashboard/TRACKER_FIXES.md (technical details)
- Git commits: 5263681f, acff1ff0, 504b0226

## Quick Deploy Command for Future

```bash
ssh root@165.227.78.107
cd /opt/archtrack/arch-firm-dashboard
git pull origin main
npm run build:admin
pm2 restart archtrack
```

## System Status

- URL: http://165.227.78.107/
- Status: OPERATIONAL
- Database: /opt/archtrack/arch-firm-dashboard/data/admin.db
- PM2: archtrack process running
- Last deploy: March 28, 2026 23:58 PST
