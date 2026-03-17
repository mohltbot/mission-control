#!/bin/bash
# OpenClaw Debugger - Consolidated 2-Shift Schedule
# Shift 1: 9 AM - Research + Content + Lead Gen
# Shift 2: 6 PM - Nurture + Follow-ups + Reporting

export PATH="/usr/local/bin:$PATH"
export HOME="/Users/mohlt"

LOG_DIR="/Users/mohlt/.openclaw/workspace/logs"
mkdir -p "$LOG_DIR"

TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
SHIFT_NUM=$1

echo "[$TIMESTAMP] Starting OpenClaw Debugger Shift $SHIFT_NUM (Consolidated)" >> "$LOG_DIR/debugger-cron.log"

# Trigger OpenClaw Gateway to spawn the appropriate session
# This requires Gateway API integration
case $SHIFT_NUM in
  1)
    echo "[$TIMESTAMP] Shift 1: Morning Research + Content + Lead Gen" >> "$LOG_DIR/debugger-cron.log"
    # TODO: Trigger via Gateway API
    ;;
  2)
    echo "[$TIMESTAMP] Shift 2: Evening Nurture + Follow-ups + Reporting" >> "$LOG_DIR/debugger-cron.log"
    # TODO: Trigger via Gateway API
    ;;
  *)
    echo "[$TIMESTAMP] Unknown shift: $SHIFT_NUM" >> "$LOG_DIR/debugger-cron.log"
    ;;
esac

echo "[$TIMESTAMP] Completed Shift $SHIFT_NUM" >> "$LOG_DIR/debugger-cron.log"
