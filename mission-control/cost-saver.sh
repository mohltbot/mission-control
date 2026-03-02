#!/bin/bash
#
# OpenClaw Cost Saver Mode
# Toggles between Local MLX (free) and Cloud models
#
# Usage:
#   ./cost-saver.sh on     # Switch to local MLX primary (save $)
#   ./cost-saver.sh off    # Switch to cloud primary (full power)
#   ./cost-saver.sh status # Check current mode
#   ./cost-saver.sh test   # Test MLX server directly

CONFIG="$HOME/.openclaw/openclaw.json"
MLX_SERVER="/Users/mohlt/.openclaw/workspace/mission-control/mlx-server.mjs"
LOCAL_MODEL="local/mlx-local/llama-3.2-1b"

status() {
    local primary=$(grep -A1 '"primary"' "$CONFIG" | grep -v '^--' | head -1 | sed 's/.*: "\(.*\)".*/\1/')
    echo "Current primary model: $primary"
    
    if echo "$primary" | grep -q "local/mlx"; then
        echo "Mode: 💰 COST SAVER (Local MLX - FREE)"
        return 0
    else
        echo "Mode: ☁️  CLOUD (Full Power - Paid)"
        return 1
    fi
}

start_mlx_server() {
    if lsof -i :8787 >/dev/null 2>&1; then
        echo "✅ MLX server already running on port 8787"
    else
        echo "🚀 Starting MLX server..."
        cd "$(dirname "$MLX_SERVER")"
        node mlx-server.mjs > /tmp/mlx-server.log 2>&1 &
        sleep 3
        if lsof -i :8787 >/dev/null 2>&1; then
            echo "✅ MLX server started"
        else
            echo "❌ Failed to start MLX server"
            exit 1
        fi
    fi
}

stop_mlx_server() {
    if lsof -i :8787 >/dev/null 2>&1; then
        echo "🛑 Stopping MLX server..."
        kill $(lsof -t -i :8787) 2>/dev/null
        echo "✅ MLX server stopped"
    fi
}

enable_cost_saver() {
    echo "💰 Enabling Cost Saver Mode..."
    start_mlx_server
    
    # Update config to use local as primary
    sed -i.bak "s/\"primary\": \"moonshot\\/kimi-k2.5\"/\"primary\": \"$LOCAL_MODEL\"/" "$CONFIG"
    
    echo "✅ Cost Saver Mode ENABLED"
    echo "   Primary: Llama-3.2-1B Local (FREE, 128K context)"
    echo "   Fallbacks: Kimi, Minimax, DeepSeek"
    echo ""
    echo "⚠️  Note: Restart OpenClaw gateway to apply: openclaw gateway restart"
}

disable_cost_saver() {
    echo "☁️  Disabling Cost Saver Mode..."
    
    # Update config to use cloud as primary
    sed -i.bak "s/\"primary\": \"local\\/mlx-local\\/[^\"]*\"/\"primary\": \"moonshot\\/kimi-k2.5\"/" "$CONFIG"
    
    stop_mlx_server
    
    echo "✅ Cost Saver Mode DISABLED"
    echo "   Primary: Kimi K2.5 (Full Power)"
}

test_mlx() {
    echo "🧪 Testing MLX Server..."
    curl -s http://localhost:8787/v1/chat/completions \
        -H "Content-Type: application/json" \
        -d '{"model": "mlx-local/llama-3.2-1b", "messages": [{"role": "user", "content": "Say MLX is working"}], "max_tokens": 20}' \
        | jq -r '.choices[0].message.content' 2>/dev/null || echo "Test failed - check server"
}

case "$1" in
    on|enable)
        enable_cost_saver
        ;;
    off|disable)
        disable_cost_saver
        ;;
    status)
        status
        ;;
    test)
        test_mlx
        ;;
    *)
        echo "OpenClaw Cost Saver Mode"
        echo ""
        echo "Usage:"
        echo "  $0 on      - Enable cost saver (Local MLX primary)"
        echo "  $0 off     - Disable cost saver (Cloud primary)"
        echo "  $0 status  - Check current mode"
        echo "  $0 test    - Test MLX server"
        echo ""
        status
        ;;
esac
