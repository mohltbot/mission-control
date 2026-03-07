# CDP Wallet Use Cases

> **⚠️ PAYMENTS & AUTOMATION ONLY** — This documentation covers legitimate business use cases. NOT for trading or speculation.

## Overview

Coinbase Developer Platform (CDP) enables businesses to automate crypto payment workflows without managing private keys. Below are the primary use cases for non-trading wallet automation.

---

## 1. Automated Expense Payments

### Use Case
Automatically pay business expenses, subscriptions, and vendor invoices using USDC or other stablecoins.

### Benefits
- **Instant Settlement**: Payments clear in seconds vs. days for bank transfers
- **Lower Fees**: Especially for international vendors
- **24/7 Operation**: No banking hours restrictions
- **Programmable**: Integrate with accounting systems

### Example Workflows

**Monthly SaaS Subscriptions**:
```python
# Automated monthly payment to vendor
subscription = {
    "vendor_address": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    "amount": 500.00,  # USDC
    "description": "AWS Services - March 2025"
}

transfer = wallet.transfer(
    amount=subscription["amount"],
    asset="usdc",
    destination=subscription["vendor_address"],
    gasless=True  # Pay gas in USDC, no ETH needed
).wait()
```

**Recurring Utility Payments**:
- Electricity, internet, phone bills
- Pay international contractors
- Automated reconciliation with accounting software

---

## 2. Invoice Payments in Crypto

### Use Case
Pay or receive invoices denominated in cryptocurrency, with automatic conversion and settlement.

### Benefits
- **Borderless**: No international wire transfer delays
- **Transparent**: All transactions on-chain for audit trails
- **Reduced FX Risk**: Use USDC for USD-stable payments

### Example Workflow

**Paying a Crypto Invoice**:
```python
# Invoice received: 2,500 USDC for consulting services
invoice = {
    "invoice_id": "INV-2025-0034",
    "vendor": "Acme Consulting",
    "amount": 2500.00,
    "currency": "usdc",
    "payment_address": "0x71d4d7d5e9ce0f41e6a68bd3a9b43aa597dc0eb0",
    "due_date": "2025-03-15"
}

# Verify invoice in your system, then pay
transfer = wallet.transfer(
    amount=invoice["amount"],
    asset=invoice["currency"],
    destination=invoice["payment_address"],
    gasless=True
).wait()

# Record transaction hash for accounting
record_payment(invoice["invoice_id"], transfer.transaction_hash)
```

**Receiving Crypto Payments**:
- Generate unique payment addresses per invoice
- Webhook notifications on payment receipt
- Auto-convert to fiat if desired (via Coinbase Exchange)

---

## 3. Payroll for Contractors

### Use Case
Pay domestic and international contractors in cryptocurrency — ideal for remote teams and global talent.

### Benefits
- **Fast**: Same-day settlement worldwide
- **Cost-Effective**: Lower fees than international wire transfers
- **Flexible**: Workers can hold crypto or convert to local currency
- **Transparent**: Clear audit trail for compliance

### Example Workflow

**Monthly Contractor Payroll**:
```python
contractors = [
    {"name": "Alice Dev", "address": "0x...", "amount": 5000, "currency": "usdc"},
    {"name": "Bob Design", "address": "0x...", "amount": 3500, "currency": "usdc"},
    {"name": "Carol PM", "address": "0x...", "amount": 6000, "currency": "usdc"}
]

for contractor in contractors:
    try:
        transfer = wallet.transfer(
            amount=contractor["amount"],
            asset=contractor["currency"],
            destination=contractor["address"],
            gasless=True
        ).wait()
        
        log_payroll(
            employee=contractor["name"],
            amount=contractor["amount"],
            tx_hash=transfer.transaction_hash,
            status="completed"
        )
    except Exception as e:
        alert_payroll_failure(contractor["name"], str(e))
```

**Compliance Considerations**:
- Issue 1099-NEC for US contractors paid $600+ (crypto payments are taxable income)
- Collect W-8BEN forms for international contractors
- Maintain records of fair market value at time of payment

---

## 4. Cross-Border Payments

### Use Case
Send payments internationally without traditional banking delays and fees.

### Benefits
- **Speed**: Minutes vs. 3-5 business days
- **Cost**: Fraction of wire transfer fees
- **Accessibility**: Works anywhere with internet
- **No Intermediaries**: Direct wallet-to-wallet transfers

### Example Scenarios

**Paying Overseas Suppliers**:
```python
# Supplier in Vietnam needs payment
payment = {
    "supplier": "Hanoi Manufacturing Co.",
    "invoice_amount_usd": 15000,
    "recipient_address": "0x...",
    "purpose": "Component shipment Q1"
}

# Send USDC (stable, fast, low fees)
transfer = wallet.transfer(
    amount=payment["invoice_amount_usd"],
    asset="usdc",
    destination=payment["recipient_address"],
    gasless=True
).wait()
```

**Remittance for Remote Employees**:
- Pay team members in countries with limited banking
- Avoid currency conversion fees
- Immediate availability of funds

---

## 5. Treasury Management

### Use Case
Manage corporate crypto treasury — holding, distributing, and tracking digital assets.

### Benefits
- **Diversification**: Hold stablecoins as cash equivalent
- **Yield Opportunities**: Staking, lending (evaluate risks carefully)
- **Operational Efficiency**: Programmatic fund movements
- **Transparency**: On-chain audit trails

### Example Workflows

**Multi-Wallet Treasury Structure**:
```python
# Treasury wallets by purpose
wallets = {
    "operating": "operating_wallet_id",      # Day-to-day expenses
    "payroll": "payroll_wallet_id",          # Employee payments
    "reserve": "reserve_wallet_id",          # Emergency funds
    "investment": "investment_wallet_id"     # Long-term holdings
}

# Move funds between wallets as needed
def replenish_operating_wallet(amount):
    transfer = reserve_wallet.transfer(
        amount=amount,
        asset="usdc",
        destination=operating_wallet.default_address.address_id
    ).wait()
    return transfer
```

**Automated Rebalancing**:
- Monitor wallet balances via webhooks
- Auto-transfer from reserve when operating wallet is low
- Set up alerts for unusual activity

**Staking (Non-Trading Yield)**:
```python
# Stake ETH for yield (if part of treasury strategy)
# Note: This is NOT trading — it's earning yield on held assets
stake_tx = wallet.stake(
    amount=10,  # ETH
    asset="eth"
).wait()
```

**Treasury Reporting**:
```python
# Get all wallet balances for reporting
for wallet_id, wallet in treasury_wallets.items():
    balances = wallet.balances()
    log_treasury_position(
        wallet=wallet_id,
        balances=balances,
        timestamp=datetime.now()
    )
```

---

## Summary Table

| Use Case | Best For | Primary Asset | Complexity |
|----------|----------|---------------|------------|
| Expense Payments | SaaS, utilities, vendors | USDC | Low |
| Invoice Payments | B2B payments, billing | USDC/ETH | Low |
| Contractor Payroll | Remote teams, global talent | USDC | Medium |
| Cross-Border | International suppliers | USDC | Medium |
| Treasury Management | Corporate holdings, yield | USDC/ETH | High |

---

## What This Does NOT Cover

❌ **Day Trading**: Buying/selling crypto for short-term profit  
❌ **Speculation**: Holding volatile assets for price appreciation  
❌ **Margin Trading**: Borrowing to trade  
❌ **DeFi Yield Farming**: High-risk liquidity provision  
❌ **NFT Flipping**: Buying/selling NFTs for profit  

These activities involve significant regulatory, tax, and risk considerations that require specialized expertise.

---

## Getting Started

1. Review [SETUP-GUIDE.md](./SETUP-GUIDE.md) to configure CDP
2. Review [WARNING.md](./WARNING.md) for compliance requirements
3. Start with small test transactions on Base Sepolia testnet
4. Implement proper accounting and record-keeping from day one
5. Consult with a crypto-savvy accountant before going live
