# Coinbase CDP Setup Guide

> **⚠️ IMPORTANT**: This guide is for **PAYMENTS & AUTOMATION ONLY** — NOT for speculative trading or investment purposes.

## Overview

Coinbase Developer Platform (CDP) provides a secure, API-managed wallet infrastructure for automating crypto payments, payroll, and treasury operations without handling private keys directly.

---

## Step 1: Create a CDP Account

### 1.1 Sign Up
1. Navigate to [portal.cdp.coinbase.com](https://portal.cdp.coinbase.com)
2. Click **Sign Up** and complete the registration process
3. Verify your email address
4. Complete identity verification (KYC) if required

### 1.2 Create a Project
1. Log into the CDP Portal
2. Click **Create New Project**
3. Name your project (e.g., "Business Payments Automation")
4. Select your primary network (recommend starting with `base-sepolia` for testing)

---

## Step 2: Create API Keys

CDP uses three types of authentication keys:

### 2.1 Secret API Key (Server-Side)

**Purpose**: Authenticate server-to-server REST API requests

**Steps**:
1. Navigate to [API Keys Dashboard](https://portal.cdp.coinbase.com/projects/api-keys)
2. Select your project from the dropdown
3. Click the **Secret API Keys** tab
4. Click **Create API key**
5. Enter a nickname (e.g., "Production Server")
6. Configure optional settings:
   - **IP Allowlist**: Restrict to your server IPs only
   - **Permission Restrictions**: Limit to required operations only
   - **Signature Algorithm**: Select `Ed25519` (recommended)
7. Click **Create**
8. **SAVE IMMEDIATELY**: Copy the `API Key ID` and `API Key Secret`
   - Store in a secure password manager or secrets vault
   - **You cannot view the secret again after closing the modal**

**Environment Setup**:
```bash
export CDP_API_KEY_NAME="your-api-key-name"
export CDP_API_KEY_SECRET="your-api-key-secret"
```

### 2.2 Client API Key (Client-Side)

**Purpose**: For browser/mobile JSON-RPC requests (limited functionality)

**Steps**:
1. In the same [API Keys Dashboard](https://portal.cdp.coinbase.com/projects/api-keys)
2. Select the **Client API Key** tab
3. Copy the generated key
4. Use in your RPC endpoint URL:
   ```
   https://api.developer.coinbase.com/rpc/v1/base/<YOUR-CLIENT-API-KEY>
   ```

### 2.3 Wallet Secret (For Signing Transactions)

**Purpose**: Additional security layer for sensitive wallet operations

**Steps**:
1. Navigate to [Server Wallet Dashboard](https://portal.cdp.coinbase.com/products/server-wallets)
2. Ensure your project is selected
3. In the **Wallet Secret** section, click **Generate**
4. **SAVE IMMEDIATELY**: This is your wallet signing key
   - Never expose in client-side code
   - Treat like a password — secure in a secrets manager
   - You cannot view it again

**Environment Setup**:
```bash
export CDP_WALLET_SECRET="your-wallet-secret"
```

---

## Step 3: Create Wallets

### 3.1 Install CDP SDK

**Python**:
```bash
pip install cdp-sdk
```

**Node.js**:
```bash
npm install @coinbase/cdp-sdk
```

### 3.2 Configure the SDK

**Python**:
```python
from cdp import Cdp, Wallet

# Configure with API keys
Cdp.configure(
    api_key_name="your-api-key-name",
    api_key_private_key="your-api-key-secret"
)

# Or load from JSON file downloaded from portal
Cdp.configure_from_json("~/Downloads/cdp_api_key.json")
```

**Node.js**:
```javascript
import { CdpClient } from "@coinbase/cdp-sdk";

const cdp = new CdpClient({
    apiKeyId: process.env.CDP_API_KEY_NAME,
    apiKeySecret: process.env.CDP_API_KEY_SECRET,
});
```

### 3.3 Create a Wallet

**Python**:
```python
# Create a new wallet (default network: base-sepolia for testing)
wallet = Wallet.create()

# Get wallet details
print(f"Wallet ID: {wallet.id}")
print(f"Default Address: {wallet.default_address.address_id}")

# Export wallet data for secure storage
data = wallet.export_data()
store_securely(data.to_dict())  # Implement your secure storage
```

**Node.js**:
```javascript
const wallet = await cdp.evm.createAccount();
console.log(`Wallet address: ${wallet.address}`);
```

### 3.4 Fund Test Wallet (Testnet Only)

```python
# Request testnet ETH from faucet (once per 24 hours)
faucet_tx = wallet.faucet()
faucet_tx.wait()
print("Wallet funded with testnet ETH")
```

### 3.5 Persist Wallet Securely

**For Development (Insecure — DO NOT use in production)**:
```python
# Save encrypted seed to local file
wallet.save_seed("wallet_seed.json", encrypt=True)

# Load wallet later
wallet = Wallet.fetch(wallet_id)
wallet.load_seed("wallet_seed.json")
```

**For Production**:
- Store wallet export data in a secure secrets manager (AWS Secrets Manager, HashiCorp Vault, etc.)
- Never commit wallet data to version control
- Encrypt at rest and in transit

---

## Step 4: Security Best Practices

### 4.1 Key Management
- ✅ Use a secrets manager (AWS Secrets Manager, Azure Key Vault, HashiCorp Vault)
- ✅ Rotate API keys quarterly
- ✅ Use IP allowlists to restrict API access
- ❌ Never hardcode keys in source code
- ❌ Never commit keys to Git repositories
- ❌ Never expose keys in client-side code

### 4.2 Wallet Security
- ✅ Enable Server-Signer for production (Coinbase manages key shards)
- ✅ Use multi-sig wallets for large treasury operations
- ✅ Set up transaction policies and spending limits
- ✅ Monitor all wallet activity with webhooks
- ❌ Never store private keys in plaintext
- ❌ Never share wallet seeds

### 4.3 Network Security
- ✅ Use HTTPS for all API calls
- ✅ Implement webhook signature verification
- ✅ Use VPN or private networks for sensitive operations
- ✅ Enable 2FA on your CDP Portal account

### 4.4 Transaction Safety
- ✅ Implement approval workflows for large transactions
- ✅ Set daily/weekly transaction limits
- ✅ Use testnet for all development and testing
- ✅ Verify recipient addresses carefully (blockchain transactions are irreversible)

### 4.5 Compliance
- ✅ Maintain detailed transaction records
- ✅ Implement KYC/AML checks for large payments
- ✅ Report crypto payments to tax authorities as required
- ✅ Consult with a crypto-savvy accountant

---

## Quick Start Checklist

- [ ] Create CDP account at portal.cdp.coinbase.com
- [ ] Create a new project
- [ ] Generate Secret API Key (save securely)
- [ ] Generate Wallet Secret (save securely)
- [ ] Install CDP SDK
- [ ] Configure SDK with API credentials
- [ ] Create test wallet on base-sepolia
- [ ] Fund wallet with testnet ETH
- [ ] Test a small transfer
- [ ] Set up webhook for transaction monitoring
- [ ] Implement secure key storage
- [ ] Review WARNING.md for compliance

---

## Resources

- [CDP Documentation](https://docs.cdp.coinbase.com)
- [CDP Python SDK](https://github.com/coinbase/cdp-sdk-python)
- [CDP Node.js SDK](https://github.com/coinbase/cdp-sdk)
- [CDP Discord Support](https://discord.gg/cdp)

---

**Remember**: This infrastructure is for automating legitimate business payments — payroll, invoices, expenses, and treasury management. It is NOT for speculative trading or investment activities.
