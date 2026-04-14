#!/bin/bash
# ArchTrack Enterprise Deploy Script
# Handles both fresh installs and updates

set -e

echo "🏢 ArchTrack Enterprise Deployment"
echo "=================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

REPO_URL="https://github.com/maximizeGPT/Archtrack.git"
INSTALL_DIR="/opt/archtrack/arch-firm-dashboard"

# ── Fresh install ──────────────────────────────────────────────────────────────
if [ ! -d "$INSTALL_DIR" ]; then
    echo "📦 Fresh install detected — setting up ArchTrack..."
    echo ""

    # Install Node.js if missing
    if ! command -v node &> /dev/null; then
        echo "⬇️  Installing Node.js..."
        curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
        apt-get install -y nodejs
    fi
    echo -e "${GREEN}✓${NC} Node.js $(node -v)"

    # Install pm2 if missing
    if ! command -v pm2 &> /dev/null; then
        echo "⬇️  Installing pm2..."
        npm install -g pm2
    fi
    echo -e "${GREEN}✓${NC} pm2 installed"

    # Clone the repo
    echo ""
    echo "⬇️  Cloning ArchTrack..."
    mkdir -p /opt/archtrack
    git clone "$REPO_URL" "$INSTALL_DIR"
    echo -e "${GREEN}✓${NC} Cloned to $INSTALL_DIR"

    # Set up .env
    echo ""
    echo "⚙️  Creating default .env..."
    cd "$INSTALL_DIR/admin"
    cp .env.example .env
    # Generate a random JWT secret
    JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
    sed -i "s/your_jwt_secret_here/$JWT_SECRET/" .env
    echo -e "${GREEN}✓${NC} .env created (add your MOONSHOT_API_KEY to $INSTALL_DIR/admin/.env to enable AI features)"

    APP_DIR="$INSTALL_DIR"

# ── Update existing install ────────────────────────────────────────────────────
elif [ -d "/opt/archtrack/arch-firm-dashboard" ]; then
    APP_DIR="/opt/archtrack/arch-firm-dashboard"
    echo -e "${GREEN}✓${NC} Existing install found at: $APP_DIR"

elif [ -d "/opt/archtrack" ]; then
    APP_DIR="/opt/archtrack"
    echo -e "${GREEN}✓${NC} Existing install found at: $APP_DIR"
fi

cd "$APP_DIR"

echo ""
echo "📥 Pulling latest code..."
git pull origin main

echo ""
echo "🔨 Building application..."
cd "$APP_DIR/admin"
npm install --silent
npm run build

echo ""
echo "🔄 Starting/restarting server..."
pm2 restart archtrack 2>/dev/null || pm2 start dist/server/index.js --name archtrack

echo ""
echo "⏳ Waiting for server to start..."
sleep 3

echo ""
echo "📊 Checking server status..."
pm2 show archtrack | grep -E "status|uptime" || true

echo ""
echo "🧪 Testing health endpoint..."
curl -s --max-time 5 http://localhost:3001/api/health || echo -e "${YELLOW}!${NC} Health check failed (server may still be starting)"

# Get public IP dynamically
SERVER_IP=$(curl -s --max-time 5 ifconfig.me 2>/dev/null || echo "YOUR_SERVER_IP")

echo ""
echo "📋 Recent logs:"
pm2 logs archtrack --lines 10 --nostream

echo ""
echo "=================================="
echo -e "${GREEN}✓ Deployment complete${NC}"
echo "Dashboard: http://$SERVER_IP:3001"
echo ""
echo "Next steps:"
echo "  1. Open http://$SERVER_IP:3001 in your browser"
echo "  2. Add your employees under the Employees tab"
echo "  3. Have each employee install the desktop tracker (see README Step 3)"
echo "=================================="
