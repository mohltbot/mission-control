#!/bin/bash
# Browserbase CLI Setup Script
# Source: Ben's Bites March 24, 2026 - "Agents should interview you"

set -e

echo "Setting up Browserbase CLI..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is required but not installed."
    echo "Install from: https://nodejs.org/"
    exit 1
fi

# Install Browserbase CLI globally
if ! command -v browserbase &> /dev/null; then
    echo "Installing Browserbase CLI..."
    npm install -g @browserbasehq/cli
else
    echo "Browserbase CLI already installed"
fi

# Check for API key
if [ -z "$BROWSERBASE_API_KEY" ]; then
    echo ""
    echo "⚠️  BROWSERBASE_API_KEY not set"
    echo "Get your API key from: https://browserbase.com/settings"
    echo "Then run: export BROWSERBASE_API_KEY=your_key_here"
    echo ""
    echo "Add to your ~/.zshrc or ~/.bashrc to make permanent"
else
    echo "✓ BROWSERBASE_API_KEY is set"
fi

echo ""
echo "Browserbase CLI Setup Complete!"
echo ""
echo "Quick start:"
echo "  browserbase --help"
echo "  browserbase scrape https://example.com"
echo "  browserbase screenshot https://example.com"
echo ""
echo "Documentation: https://docs.browserbase.com/"
