# Coinbase CDP Wallet Automation

> **For Payments & Automation Only — Not for Trading**

This directory contains documentation for setting up and using Coinbase Developer Platform (CDP) for automated crypto payment workflows.

## Quick Start

1. Read **[WARNING.md](./WARNING.md)** first — understand what NOT to do
2. Follow **[SETUP-GUIDE.md](./SETUP-GUIDE.md)** — create account, API keys, and wallets
3. Review **[USE-CASES.md](./USE-CASES.md)** — see what you can build
4. Implement using **[INTEGRATION.md](./INTEGRATION.md)** — code samples and API details

## What This Enables

✅ **Automated expense payments** — Pay vendors, subscriptions, utilities  
✅ **Invoice payments in crypto** — Send/receive B2B payments in USDC  
✅ **Contractor payroll** — Pay remote team members globally  
✅ **Cross-border payments** — Fast, low-cost international transfers  
✅ **Treasury management** — Hold and manage corporate crypto funds  

## What This Does NOT Enable

❌ **Day trading** or speculation  
❌ **Investment strategies**  
❌ **High-risk DeFi activities**  
❌ **Anonymous transactions**  

## Prerequisites

- Coinbase Developer Platform account
- API keys (Secret API Key + Wallet Secret)
- Python 3.10+ or Node.js
- `cdp-sdk` installed
- HTTPS webhook endpoint (for notifications)

## File Overview

| File | Purpose |
|------|---------|
| `SETUP-GUIDE.md` | Step-by-step account and wallet setup |
| `USE-CASES.md` | Business use cases and examples |
| `INTEGRATION.md` | Code samples, API reference, webhooks |
| `WARNING.md` | Compliance, tax, and risk warnings |
| `README.md` | This file |

## Security Reminders

- Store API keys in a secrets manager (never in code)
- Use IP allowlists to restrict API access
- Enable server-signer for production wallets
- Verify all recipient addresses carefully
- Test on Base Sepolia testnet first

## Support

- [CDP Documentation](https://docs.cdp.coinbase.com)
- [CDP Discord](https://discord.gg/cdp)
- [Coinbase Support](https://help.coinbase.com)

---

**Use responsibly. Document everything. Consult professionals for tax and legal advice.**
