#!/bin/bash
# Ben's Bites Implementation Testing & Documentation Script
# Tests new implementations and adds working ones to TOOLS.md

export PATH="/usr/local/bin:$PATH"
export HOME="/Users/mohlt"

WORKSPACE="/Users/mohlt/.openclaw/workspace"
LOG_DIR="$WORKSPACE/logs"
TOOLS_MD="$WORKSPACE/TOOLS.md"
BENSBITES_DIR="$WORKSPACE/bensbites-implementations"
mkdir -p "$LOG_DIR"

TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
LOG_FILE="$LOG_DIR/bensbites-auto-test.log"

echo "[$TIMESTAMP] === Ben's Bites Auto-Test & Document ===" >> "$LOG_FILE"

# Function to test if a tool is working
test_tool() {
    local tool_name=$1
    local test_command=$2
    local success_pattern=$3
    
    echo "[$TIMESTAMP] Testing $tool_name..." >> "$LOG_FILE"
    
    if eval "$test_command" 2>&1 | grep -q "$success_pattern"; then
        echo "[$TIMESTAMP] ✓ $tool_name: WORKING" >> "$LOG_FILE"
        return 0
    else
        echo "[$TIMESTAMP] ✗ $tool_name: FAILED" >> "$LOG_FILE"
        return 1
    fi
}

# Function to check if tool is already in TOOLS.md
tool_in_tools_md() {
    local tool_name=$1
    grep -q "$tool_name" "$TOOLS_MD"
}

# Function to add tool to TOOLS.md
add_to_tools_md() {
    local tool_name=$1
    local cli_path=$2
    local status=$3
    local purpose=$4
    local location=$5
    
    echo "[$TIMESTAMP] Adding $tool_name to TOOLS.md..." >> "$LOG_FILE"
    
    # Create backup
    cp "$TOOLS_MD" "$TOOLS_MD.bak"
    
    # Find the line with "## Ben's Bites Tools" and add after the table header
    awk -v tool="$tool_name" -v cli="$cli_path" -v stat="$status" -v purp="$purpose" '
        /## Ben.s Bites Tools/ { in_section=1 }
        in_section && /\|.*\|.*\|.*\|/ && printed==0 {
            print "| **" tool "** | " cli " | " stat " | " purp " |"
            printed=1
        }
        { print }
    ' "$TOOLS_MD.bak" > "$TOOLS_MD"
    
    # Add detailed section if location provided
    if [ -n "$location" ]; then
        # Add after the Working Tools table
        awk -v tool="$tool_name" -v loc="$location" '
            /### Working Tools.*Active/ { in_working=1 }
            in_working && /^$/ && added==0 {
                print ""
                print "**" tool ":**"
                print "- Location: " loc
                print "- Status: Added via auto-test on " strftime("%Y-%m-%d")
                added=1
            }
            { print }
        ' "$TOOLS_MD" > "$TOOLS_MD.tmp" && mv "$TOOLS_MD.tmp" "$TOOLS_MD"
    fi
    
    rm "$TOOLS_MD.bak"
    echo "[$TIMESTAMP] ✓ Added $tool_name to TOOLS.md" >> "$LOG_FILE"
}

# Test each known Ben's Bites tool

# 1. Lossless Claw (check if plugin loaded)
if ! tool_in_tools_md "Lossless Claw"; then
    if test_tool "Lossless Claw" "openclaw plugins list 2>&1 | grep -i lossless" "loaded"; then
        add_to_tools_md "Lossless Claw" "OpenClaw Plugin" "✅ LIVE" "DAG-based conversation compaction" "~/.lossless-claw/repo/"
    fi
fi

# 2. Context Hub (check if chub works)
if ! tool_in_tools_md "Context Hub"; then
    if test_tool "Context Hub" "cd ~/.openclaw/tools/context-hub && node cli/bin/chub --version 2>&1" "[0-9]\+\.[0-9]\+"; then
        add_to_tools_md "Context Hub" "chub" "✅ LIVE" "Curated API documentation" "~/.openclaw/tools/context-hub/"
    fi
fi

# 3. Autocontext (check if autoctx works)
if ! tool_in_tools_md "Autocontext"; then
    if test_tool "Autocontext" "cd ~/.openclaw/tools/autocontext/autocontext && source venv/bin/activate && autoctx --version 2>&1" "[0-9]\+\.[0-9]\+"; then
        add_to_tools_md "Autocontext" "autoctx" "✅ LIVE" "Self-improving agent loops" "~/.openclaw/tools/autocontext/"
    fi
fi

# 4. Check for new implementations in bensbites-implementations/
if [ -d "$BENSBITES_DIR" ]; then
    for impl in "$BENSBITES_DIR"/*.md "$BENSBITES_DIR"/*.sh; do
        if [ -f "$impl" ]; then
            impl_name=$(basename "$impl" .md)
            impl_name=$(basename "$impl_name" .sh)
            
            # Skip if already in TOOLS.md
            if ! tool_in_tools_md "$impl_name"; then
                echo "[$TIMESTAMP] Found new implementation: $impl_name" >> "$LOG_FILE"
                
                # Check if there's an associated script
                script_path="$WORKSPACE/scripts/${impl_name}.sh"
                if [ -f "$script_path" ]; then
                    echo "[$TIMESTAMP] Found script for $impl_name, needs manual testing" >> "$LOG_FILE"
                    # Don't auto-add — requires manual verification
                fi
            fi
        fi
    done
fi

# Commit changes if TOOLS.md was modified
if git -C "$WORKSPACE" diff --quiet "$TOOLS_MD" 2>/dev/null; then
    echo "[$TIMESTAMP] No changes to TOOLS.md" >> "$LOG_FILE"
else
    echo "[$TIMESTAMP] Committing TOOLS.md updates..." >> "$LOG_FILE"
    cd "$WORKSPACE"
    git add TOOLS.md
    git commit -m "docs(tools): Auto-update TOOLS.md with verified Ben's Bites tools

Added via automated testing on $(date +%Y-%m-%d):
- Tools verified working and added to documentation

Auto-generated by bensbites-test-and-document.sh"
    git push origin main 2>&1 >> "$LOG_FILE"
fi

echo "[$TIMESTAMP] === Auto-test complete ===" >> "$LOG_FILE"
