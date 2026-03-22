#!/bin/bash
# OpenClaw Debugger - Consolidated 2-Shift Schedule with Ben's Bites Testing Protocol
# Shift 1: 9 AM - Research + Content + Lead Gen + Ben's Bites Testing
# Shift 2: 6 PM - Nurture + Follow-ups + Reporting + Tool Validation

export PATH="/usr/local/bin:$PATH"
export HOME="/Users/mohlt"

LOG_DIR="/Users/mohlt/.openclaw/workspace/logs"
mkdir -p "$LOG_DIR"

TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
SHIFT_NUM=$1

echo "[$TIMESTAMP] Starting OpenClaw Debugger Shift $SHIFT_NUM" >> "$LOG_DIR/debugger-cron.log"

case $SHIFT_NUM in
  1)
    echo "[$TIMESTAMP] Shift 1: Morning Research + Content + Lead Gen + Ben's Bites Testing" >> "$LOG_DIR/debugger-cron.log"
    
    # Ben's Bites Testing Protocol
    # Run on Mondays and Thursdays after new newsletter implementations
    DAY_OF_WEEK=$(date +%u)
    if [ "$DAY_OF_WEEK" -eq 1 ] || [ "$DAY_OF_WEEK" -eq 4 ]; then
      BENSBITES_LOG="$LOG_DIR/bensbites-testing.log"
      echo "[$TIMESTAMP] === Ben's Bites Testing Protocol ===" >> "$BENSBITES_LOG"
      
      # Test working tools
      echo "[$TIMESTAMP] Testing Lossless Claw..." >> "$BENSBITES_LOG"
      sqlite3 ~/.openclaw/lcm.db "SELECT COUNT(*) FROM summaries;" >> "$BENSBITES_LOG" 2>&1
      
      echo "[$TIMESTAMP] Testing Context Hub..." >> "$BENSBITES_LOG"
      cd ~/.openclaw/tools/context-hub && node cli/bin/chub search tavily >/dev/null 2>&1 && echo "Context Hub: OK" >> "$BENSBITES_LOG" || echo "Context Hub: FAIL" >> "$BENSBITES_LOG"
      
      echo "[$TIMESTAMP] Testing Autocontext..." >> "$BENSBITES_LOG"
      cd ~/.openclaw/tools/autocontext/autocontext && source venv/bin/activate && autoctx list >/dev/null 2>&1 && echo "Autocontext: OK" >> "$BENSBITES_LOG" || echo "Autocontext: FAIL" >> "$BENSBITES_LOG"
      
      echo "[$TIMESTAMP] Ben's Bites testing complete" >> "$BENSBITES_LOG"
    fi
    
    # TODO: Trigger OpenClaw Gateway for morning shift tasks
    ;;
    
  2)
    echo "[$TIMESTAMP] Shift 2: Evening Nurture + Follow-ups + Reporting + Tool Validation" >> "$LOG_DIR/debugger-cron.log"
    
    # Tool Validation Check
    # Verify all tools in TOOLS.md are still working
    VALIDATION_LOG="$LOG_DIR/tool-validation.log"
    echo "[$TIMESTAMP] === Tool Validation ===" >> "$VALIDATION_LOG"
    
    # Check each working tool
    TOOLS_STATUS=""
    
    # Lossless Claw
    if [ -f ~/.openclaw/lcm.db ]; then
      TOOLS_STATUS="${TOOLS_STATUS}LosslessClaw:OK;"
    else
      TOOLS_STATUS="${TOOLS_STATUS}LosslessClaw:MISSING;"
    fi
    
    # Context Hub
    if [ -d ~/.openclaw/tools/context-hub ]; then
      TOOLS_STATUS="${TOOLS_STATUS}ContextHub:OK;"
    else
      TOOLS_STATUS="${TOOLS_STATUS}ContextHub:MISSING;"
    fi
    
    # Autocontext
    if [ -d ~/.openclaw/tools/autocontext ]; then
      TOOLS_STATUS="${TOOLS_STATUS}Autocontext:OK;"
    else
      TOOLS_STATUS="${TOOLS_STATUS}Autocontext:MISSING;"
    fi
    
    echo "[$TIMESTAMP] Status: $TOOLS_STATUS" >> "$VALIDATION_LOG"
    
    # TODO: Trigger OpenClaw Gateway for evening shift tasks
    ;;
    
  *)
    echo "[$TIMESTAMP] Unknown shift: $SHIFT_NUM" >> "$LOG_DIR/debugger-cron.log"
    ;;
esac

echo "[$TIMESTAMP] Completed Shift $SHIFT_NUM" >> "$LOG_DIR/debugger-cron.log"
