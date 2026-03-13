#!/bin/zsh
# Mission Control Health Monitor
# Automated check for blocked items and system health
# Run this manually or via cron for proactive monitoring

WORKSPACE="/Users/mohlt/.openclaw/workspace"
REPORT_FILE="$WORKSPACE/logs/health-check-$(date +%Y%m%d-%H%M).log"
mkdir -p "$WORKSPACE/logs"

exec > >(tee -a "$REPORT_FILE")
exec 2>&1

echo "=== Mission Control Health Check ==="
echo "Timestamp: $(date)"
echo ""

# Check 1: Cloudflare Tunnel Status
echo "🔍 Checking Cloudflare Tunnel..."
if pgrep -f "cloudflared" > /dev/null; then
  echo "  ✅ Tunnel process running"
  TUNNEL_URL=$(curl -s http://localhost:4567/metrics 2>/dev/null | grep -o 'https://[^"]*' | head -1)
  if [ -n "$TUNNEL_URL" ]; then
    echo "  ✅ Tunnel accessible at: $TUNNEL_URL"
  else
    echo "  ⚠️  Tunnel running but metrics endpoint not responding"
  fi
else
  echo "  🔴 Tunnel DOWN - Needs: cloudflared tunnel login"
fi
echo ""

# Check 2: Mission Control Dashboard
echo "🔍 Checking Mission Control Dashboard..."
if curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
  echo "  ✅ Dashboard running on localhost:3000"
else
  echo "  🔴 Dashboard not responding on localhost:3000"
fi
echo ""

# Check 3: Git Status
echo "🔍 Checking Repository Status..."
cd "$WORKSPACE"
UNTRACKED=$(git status --porcelain | grep "^??" | wc -l | tr -d ' ')
MODIFIED=$(git status --porcelain | grep "^ M" | wc -l | tr -d ' ')
echo "  📁 Untracked files: $UNTRACKED"
echo "  📝 Modified files: $MODIFIED"
if [ "$UNTRACKED" -gt 10 ] || [ "$MODIFIED" -gt 5 ]; then
  echo "  ⚠️  Consider committing or cleaning up files"
fi
echo ""

# Check 4: Disk Space
echo "🔍 Checking Disk Space..."
df -h / | tail -1 | awk '{print "  💾 Used: "$5" ("$3"/"$2")"}'
echo ""

# Check 5: Recent Errors
echo "🔍 Checking Recent Errors..."
if [ -f "$WORKSPACE/mc-temp/logs/bensbites-fri-error.log" ]; then
  ERROR_COUNT=$(wc -l < "$WORKSPACE/mc-temp/logs/bensbites-fri-error.log" | tr -d ' ')
  echo "  📰 Ben's Bites errors: $ERROR_COUNT lines"
else
  echo "  ✅ No Ben's Bites error log found"
fi
echo ""

# Check 6: ArchTrack Status
echo "🔍 Checking ArchTrack..."
if [ -d "$WORKSPACE/arch-firm-dashboard/deployment" ]; then
  echo "  ✅ Deployment package exists"
else
  echo "  ⚠️  Deployment package missing"
fi
echo ""

# Summary
echo "=== Health Check Complete ==="
echo "Report saved to: $REPORT_FILE"
echo ""
echo "📋 Blocked Items Status:"
echo "  1. Cloudflare Tunnel: $(pgrep -f "cloudflared" > /dev/null && echo "RUNNING" || echo "DOWN 🔴")"
echo "  2. Ben's Bites Discord: Check $WORKSPACE/mc-temp/logs/ for errors"
echo "  3. ArchTrack Deploy: $(test -d "$WORKSPACE/arch-firm-dashboard/deployment" && echo "READY" || echo "MISSING")"
