#!/bin/bash
#
# Model Call Monitor - Proves which model OpenClaw actually uses
#

MLX_LOG="/tmp/mlx-server.log"

echo "🔍 MODEL CALL MONITOR"
echo "====================="
echo ""

# Clear old logs
> "$MLX_LOG"

# Start monitoring MLX server logs in background
echo "📡 Monitoring MLX server (port 8787)..."
(
  while true; do
    lsof -i :8787 -n -P 2>/dev/null | grep -q LISTEN && echo "[$(date '+%H:%M:%S')] MLX Server: ACTIVE" >> "$MLX_LOG"
    sleep 2
  done
) &
MONITOR_PID=$!

# Function to check last call
check_last_call() {
  echo ""
  echo "=== LAST 30 SECONDS ==="
  
  # Check if MLX received any calls
  if grep -q "Processing request" /Users/mohlt/.openclaw/workspace/mission-control/mlx-server.log 2>/dev/null; then
    echo "✅ MLX Server WAS CALLED"
    tail -5 /Users/mohlt/.openclaw/workspace/mission-control/mlx-server.log 2>/dev/null | grep -E "Processing|Completed"
  else
    echo "❌ MLX Server NOT CALLED (check if fallback to cloud)"
  fi
}

# Cleanup on exit
cleanup() {
  kill $MONITOR_PID 2>/dev/null
}
trap cleanup EXIT

echo "💡 To test: Ask me a question in the chat"
echo "   Then run: ./monitor-model.sh check"
echo ""
echo "Commands:"
echo "  ./monitor-model.sh check  - Show recent calls"
echo "  ./monitor-model.sh test   - Direct test of MLX"
echo "  Ctrl+C                    - Stop monitoring"

# If called with 'check', show status
if [ "$1" = "check" ]; then
  check_last_call
  exit 0
fi

# If called with 'test', direct MLX test
if [ "$1" = "test" ]; then
  echo ""
  echo "🧪 DIRECT MLX TEST:"
  curl -s http://localhost:8787/v1/chat/completions \
    -H "Content-Type: application/json" \
    -d '{
      "model": "mlx-local/smollm2-360m",
      "messages": [{"role": "user", "content": "Say test success"}],
      "max_tokens": 10
    }' | jq -r '.choices[0].message.content' 2>/dev/null || echo "MLX test failed"
  exit 0
fi

# Keep running
while true; do
  sleep 5
  echo -n "."
done
