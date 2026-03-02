#!/bin/bash
# Quick Expense Logger - Log API costs immediately
# Usage: ./log-expense.sh "Description" amount provider model tokens_in tokens_out

DESC="${1:-API Call}"
AMOUNT="${2:-0.01}"
PROVIDER="${3:-moonshot}"
MODEL="${4:-kimi-k2.5}"
TOKENS_IN="${5:-1000}"
TOKENS_OUT="${6:-500}"

curl -s http://localhost:3000/api/expenses \
  -X POST \
  -H "Content-Type: application/json" \
  -d "{
    \"description\": \"$DESC\",
    \"amount\": $AMOUNT,
    \"provider\": \"$PROVIDER\",
    \"model\": \"$MODEL\",
    \"tokens_in\": $TOKENS_IN,
    \"tokens_out\": $TOKENS_OUT,
    \"category\": \"api_call\"
  }" | jq '{id, description, amount}'

echo "✅ Expense logged"
