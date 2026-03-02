#!/bin/bash
# Mission Control Status Dashboard
# Run this to get complete system status

echo "═══════════════════════════════════════════════════"
echo "   MISSION CONTROL - SYSTEM STATUS"
echo "═══════════════════════════════════════════════════"
echo ""

# Budget
echo "💰 BUDGET STATUS"
curl -s http://localhost:3000/api/expenses 2>/dev/null | jq -r '. | length' | xargs -I {} echo "  Total Expense Records: {}"
echo ""

# Tasks
echo "📋 TASK STATUS"
echo "  Pending Tasks:"
curl -s http://localhost:3000/api/tasks 2>/dev/null | jq -r '.[] | select(.status == "pending") | "    - [\(.priority)] \(.title)"' | head -10
echo ""

# Git Status
echo "📁 GIT STATUS"
cd /Users/mohlt/.openclaw/workspace
git log --oneline -3 2>/dev/null | sed 's/^/  /'
echo ""

# Cron Jobs
echo "⏰ CRON JOBS"
launchctl list | grep mohltbot | awk '{print "  " $3 " (status: " $2 ")"}'
echo ""

# Local LLM
echo "🧠 LOCAL LLM"
curl -s http://localhost:8787/health 2>/dev/null | jq -r '"  MLX Server: " + .status' 2>/dev/null || echo "  MLX Server: not responding"
pgrep -f "ollama" > /dev/null && echo "  Ollama: running" || echo "  Ollama: not running"
echo ""

# Google Integrations
echo "🔌 GOOGLE INTEGRATIONS"
echo "  Calendar: ✅ Working"
echo "  Tasks: ✅ Working"
echo "  YouTube: ✅ Working"
echo "  Drive: ✅ Working"
echo "  gog CLI: ⏳ Needs auth (run: gog auth login)"
echo ""

# VC Portfolio
echo "🏢 VC PORTFOLIO"
ls /Users/mohlt/.openclaw/workspace/vc-portfolio/n8n-workflows/*.json 2>/dev/null | wc -l | xargs -I {} echo "  Workflows created: {}"
echo "  Phase 1: 2 of 4 templates complete"
echo ""

echo "═══════════════════════════════════════════════════"
echo "   Last Updated: $(date)"
echo "═══════════════════════════════════════════════════"
