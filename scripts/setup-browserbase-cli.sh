#!/bin/bash
# Browserbase CLI Setup and Integration Script
# Source: Ben's Bites March 24, 2026 - "Agents should interview you"
# Reference: https://www.browserbase.com/SKILL.md
#
# This script sets up the Browserbase CLI for serverless browser automation
# Usage: ./scripts/setup-browserbase-cli.sh [install|configure|test]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKSPACE_DIR="$(dirname "$SCRIPT_DIR")"
BROWSERBASE_CONFIG_DIR="$HOME/.browserbase"
BROWSERBASE_CONFIG_FILE="$BROWSERBASE_CONFIG_DIR/config.json"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
check_node() {
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi
    
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        log_warn "Node.js version is < 18. Browserbase CLI may not work properly."
    fi
    
    log_success "Node.js version: $(node --version)"
}

# Install Browserbase CLI globally
install_cli() {
    log_info "Installing Browserbase CLI..."
    
    if command -v browserbase &> /dev/null; then
        log_warn "Browserbase CLI is already installed"
        browserbase --version
        return 0
    fi
    
    npm install -g @browserbasehq/cli
    
    if command -v browserbase &> /dev/null; then
        log_success "Browserbase CLI installed successfully"
        browserbase --version
    else
        log_error "Failed to install Browserbase CLI"
        exit 1
    fi
}

# Configure Browserbase with API key
configure_cli() {
    log_info "Configuring Browserbase CLI..."
    
    # Create config directory
    mkdir -p "$BROWSERBASE_CONFIG_DIR"
    
    # Check for API key in environment
    if [ -z "$BROWSERBASE_API_KEY" ]; then
        log_warn "BROWSERBASE_API_KEY environment variable not set"
        
        # Check if already configured
        if [ -f "$BROWSERBASE_CONFIG_FILE" ]; then
            log_info "Found existing config at $BROWSERBASE_CONFIG_FILE"
            cat "$BROWSERBASE_CONFIG_FILE"
            return 0
        fi
        
        log_error "Please set BROWSERBASE_API_KEY environment variable or configure manually"
        log_info "To get your API key: https://www.browserbase.com/settings"
        log_info "Then run: export BROWSERBASE_API_KEY=your_api_key_here"
        return 1
    fi
    
    # Create config file
    cat > "$BROWSERBASE_CONFIG_FILE" << EOF
{
  "apiKey": "$BROWSERBASE_API_KEY",
  "projectId": "${BROWSERBASE_PROJECT_ID:-default}",
  "region": "${BROWSERBASE_REGION:-us-west-2}"
}
EOF
    
    chmod 600 "$BROWSERBASE_CONFIG_FILE"
    log_success "Browserbase CLI configured at $BROWSERBASE_CONFIG_FILE"
}

# Test Browserbase CLI
test_cli() {
    log_info "Testing Browserbase CLI..."
    
    if ! command -v browserbase &> /dev/null; then
        log_error "Browserbase CLI is not installed. Run: $0 install"
        return 1
    fi
    
    # Test basic command
    log_info "Testing 'browserbase --version'..."
    browserbase --version || {
        log_error "Browserbase CLI test failed"
        return 1
    }
    
    # Test list sessions (requires auth)
    log_info "Testing 'browserbase sessions list'..."
    browserbase sessions list 2>/dev/null || {
        log_warn "Could not list sessions. API key may not be configured."
        log_info "Run: $0 configure"
    }
    
    log_success "Browserbase CLI tests completed"
}

# Create wrapper script for common operations
create_wrappers() {
    log_info "Creating wrapper scripts..."
    
    WRAPPER_DIR="$WORKSPACE_DIR/scripts/browserbase-wrappers"
    mkdir -p "$WRAPPER_DIR"
    
    # Wrapper for scraping a URL
    cat > "$WRAPPER_DIR/scrape.sh" << 'EOF'
#!/bin/bash
# Browserbase Scrape Wrapper
# Usage: ./scrape.sh <url> [output-file]

URL="$1"
OUTPUT="${2:-/dev/stdout}"

if [ -z "$URL" ]; then
    echo "Usage: $0 <url> [output-file]"
    exit 1
fi

browserbase scrape "$URL" > "$OUTPUT"
EOF
    chmod +x "$WRAPPER_DIR/scrape.sh"
    
    # Wrapper for taking screenshots
    cat > "$WRAPPER_DIR/screenshot.sh" << 'EOF'
#!/bin/bash
# Browserbase Screenshot Wrapper
# Usage: ./screenshot.sh <url> [output.png]

URL="$1"
OUTPUT="${2:-screenshot-$(date +%Y%m%d-%H%M%S).png}"

if [ -z "$URL" ]; then
    echo "Usage: $0 <url> [output.png]"
    exit 1
fi

browserbase screenshot "$URL" --output "$OUTPUT"
echo "Screenshot saved to: $OUTPUT"
EOF
    chmod +x "$WRAPPER_DIR/screenshot.sh"
    
    # Wrapper for running automation scripts
    cat > "$WRAPPER_DIR/automate.sh" << 'EOF'
#!/bin/bash
# Browserbase Automation Wrapper
# Usage: ./automate.sh <script-file>

SCRIPT="$1"

if [ -z "$SCRIPT" ] || [ ! -f "$SCRIPT" ]; then
    echo "Usage: $0 <automation-script.js>"
    exit 1
fi

browserbase run "$SCRIPT"
EOF
    chmod +x "$WRAPPER_DIR/automate.sh"
    
    log_success "Wrapper scripts created in $WRAPPER_DIR"
}

# Update TOOLS.md with Browserbase CLI info
update_docs() {
    log_info "Updating documentation..."
    
    TOOLS_MD="$WORKSPACE_DIR/TOOLS.md"
    
    # Check if Browserbase section already exists
    if grep -q "Browserbase CLI" "$TOOLS_MD" 2>/dev/null; then
        log_warn "Browserbase CLI section already exists in TOOLS.md"
        return 0
    fi
    
    cat >> "$TOOLS_MD" << 'EOF'

---

## Browserbase CLI

**Source:** Ben's Bites March 24, 2026
**Status:** ✅ Installed, ⚠️ Needs API Key

### What It Is
Serverless browser automation platform with CLI for:
- Web scraping and data extraction
- Automated browser sessions
- Screenshots and PDF generation
- Debugging and session replay

### Installation
```bash
npm install -g @browserbasehq/cli
```

### Configuration
```bash
export BROWSERBASE_API_KEY=your_api_key_here
./scripts/setup-browserbase-cli.sh configure
```

### Common Commands
```bash
# Scrape a webpage
browserbase scrape https://example.com

# Take a screenshot
browserbase screenshot https://example.com --output screenshot.png

# List active sessions
browserbase sessions list

# Run automation script
browserbase run automation.js
```

### Wrapper Scripts
Located in `scripts/browserbase-wrappers/`:
- `scrape.sh` - Simple URL scraping
- `screenshot.sh` - Screenshot capture
- `automate.sh` - Run automation scripts

### API Key Setup
1. Get API key from: https://www.browserbase.com/settings
2. Set environment variable: `export BROWSERBASE_API_KEY=xxx`
3. Or configure via: `./scripts/setup-browserbase-cli.sh configure`

### Integration with OpenClaw
Can be used as a skill for browser automation tasks.
EOF
    
    log_success "Updated TOOLS.md with Browserbase CLI documentation"
}

# Main function
main() {
    COMMAND="${1:-all}"
    
    case "$COMMAND" in
        install)
            check_node
            install_cli
            ;;
        configure)
            configure_cli
            ;;
        test)
            test_cli
            ;;
        wrappers)
            create_wrappers
            ;;
        docs)
            update_docs
            ;;
        all)
            check_node
            install_cli
            configure_cli
            test_cli
            create_wrappers
            update_docs
            log_success "Browserbase CLI setup complete!"
            ;;
        *)
            echo "Usage: $0 [install|configure|test|wrappers|docs|all]"
            echo ""
            echo "Commands:"
            echo "  install   - Install Browserbase CLI globally"
            echo "  configure - Configure API key"
            echo "  test      - Test CLI installation"
            echo "  wrappers  - Create wrapper scripts"
            echo "  docs      - Update TOOLS.md documentation"
            echo "  all       - Run all steps (default)"
            exit 1
            ;;
    esac
}

main "$@"
