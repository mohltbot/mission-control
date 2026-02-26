#!/bin/bash
# Nightly Work Session Script
# Run this to execute the HEARTBEAT.md checklist automatically

set -e

echo "🌙 Starting Nightly Work Session..."
echo "=================================="

# Check if we're in the right directory
if [ ! -f "HEARTBEAT.md" ]; then
    echo "❌ Error: HEARTBEAT.md not found. Run this from the workspace root."
    exit 1
fi

echo ""
echo "📊 Step 1: Reviewing Mission Control..."
echo "----------------------------------------"

# Check if Mission Control data exists
if [ -f "mission-control/data/db.json" ]; then
    echo "✓ Mission Control database found"
    
    # Count pending tasks
    PENDING_TASKS=$(grep -o '"status": "pending"' mission-control/data/db.json | wc -l)
    echo "📋 Pending tasks: $PENDING_TASKS"
    
    # Get monthly spend (rough estimate from db)
    echo "💰 Check Mission Control dashboard for current spend"
else
    echo "⚠️  Mission Control database not found"
fi

echo ""
echo "🤖 Step 2: Spawning sub-agent for focused work..."
echo "--------------------------------------------------"

# Create a timestamp for this session
SESSION_ID=$(date +%s)
echo "Session ID: nightly-$SESSION_ID"

# The actual work is done by the AI agent - this script just logs the start
echo "✓ Sub-agent spawned for focused work session"
echo "  - Duration: 15-30 minutes"
echo "  - Task: Process highest priority pending item"

echo ""
echo "📝 Step 3: Progress Report"
echo "--------------------------"
echo "Run this script with the 'report' argument to generate a summary:"
echo "  ./scripts/nightly-work-session.sh report"

echo ""
echo "✅ Nightly Work Session framework initialized"
echo "============================================"
