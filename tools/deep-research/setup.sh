#!/bin/bash
# Setup script for deep-research CLI

set -e

echo "🔧 Setting up deep-research CLI..."

cd "$(dirname "$0")"

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please edit .env and add your API keys:"
    echo "   - BROWSERBASE_API_KEY"
    echo "   - OPENAI_API_KEY"
else
    echo "✅ .env file already exists"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Usage:"
echo "  npm run research                    # Default topic"
echo "  npm run research -- 'your topic'    # Custom topic"
