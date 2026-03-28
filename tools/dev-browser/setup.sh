#!/bin/bash
# Quick setup script for dev-browser

set -e

echo "🔧 Setting up dev-browser..."

# Check if already installed
if command -v dev-browser &> /dev/null; then
    echo "✅ dev-browser already installed"
    dev-browser --version
else
    echo "📦 Installing dev-browser globally..."
    npm install -g dev-browser
fi

# Install Playwright and Chromium
echo "🎭 Installing Playwright + Chromium..."
dev-browser install

echo ""
echo "✅ Setup complete!"
echo ""
echo "Quick test:"
echo "  dev-browser --help"
echo ""
echo "Example usage:"
echo "  dev-browser --headless <<'EOF'"
echo '  const page = await browser.getPage("main");'
echo '  await page.goto("https://example.com");'
echo '  console.log(await page.title());'
echo "  EOF"
