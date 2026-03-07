# ⚠️ WARNING: What NOT To Do

> **CRITICAL**: This CDP integration is for **PAYMENTS & AUTOMATION ONLY**. Read this entire document before using.

---

## 1. NO Speculative Trading

### ❌ DO NOT Use For:

- **Day Trading**: Buying and selling crypto for short-term price movements
- **Swing Trading**: Holding positions for days/weeks to profit from volatility
- **Arbitrage**: Exploiting price differences between exchanges
- **Market Making**: Providing liquidity for trading profits
- **Leverage Trading**: Borrowing funds to amplify positions
- **Options/Futures**: Derivatives trading of any kind

### ✅ DO Use For:

- Paying invoices in USDC
- Contractor payroll
- Business expense payments
- Cross-border supplier payments
- Treasury management (holding stablecoins)

### Why This Matters

Trading crypto assets involves:
- **Regulatory Risk**: Trading may require broker-dealer licenses
- **Tax Complexity**: Each trade is a taxable event
- **Financial Risk**: Cryptocurrency is highly volatile
- **Operational Risk**: Trading algorithms can malfunction and lose significant funds

---

## 2. Regulatory Compliance

### U.S. Regulations

**Bank Secrecy Act (BSA)**:
- Crypto payments over $10,000 may require reporting
- Maintain records of all transactions
- Implement AML/KYC for large payments

**IRS Requirements**:
- Crypto payments to contractors require 1099-NEC (if $600+)
- Crypto received as payment is taxable income
- Fair market value must be recorded at time of transaction
- New Form 1099-DA requirements starting 2025

**State Regulations**:
- Some states require money transmitter licenses for crypto payments
- Check your specific state requirements
- New York has additional BitLicense requirements

### International Regulations

- **EU**: MiCA regulations apply to crypto asset services
- **UK**: FCA registration may be required
- **Other Jurisdictions**: Varies significantly — consult local counsel

### Compliance Checklist

- [ ] Register with FinCEN if required (MSB registration)
- [ ] Implement KYC for payments over thresholds
- [ ] Maintain transaction records for 5+ years
- [ ] Report large transactions as required
- [ ] File 1099 forms for contractor payments
- [ ] Screen addresses against sanctions lists (OFAC)

---

## 3. Tax Implications

### For Payments Made (Your Business)

**Deductible Expenses**:
- Crypto payments to contractors are deductible business expenses
- Deduct at fair market value at time of payment
- Must issue 1099-NEC for US contractors ($600+ threshold)

**Example**:
```
You pay a contractor 1,000 USDC when USDC = $1.00
→ Deduct $1,000 as business expense
→ Issue 1099-NEC for $1,000
```

### For Payments Received (Your Business)

**Taxable Income**:
- Crypto received as payment is ordinary income
- Value = fair market value at time of receipt
- Report on your business tax return

**Example**:
```
You receive 5,000 USDC for services when USDC = $1.00
→ Report $5,000 as income
→ Cost basis = $5,000
```

### For Treasury Holdings

**Stablecoins (USDC)**:
- Holding USDC is generally not a taxable event
- Converting USD to USDC is not taxable
- Spending USDC is not taxable (if held at $1.00)

**Non-Stablecoin Crypto**:
- Converting crypto to fiat = capital gain/loss
- Using crypto to pay for goods/services = disposition (taxable)
- Staking rewards = taxable income when received

### Record Keeping Requirements

**You MUST Track**:
- Date of each transaction
- Fair market value in USD at time of transaction
- Purpose (invoice #, contractor name, expense category)
- Transaction hash (blockchain record)
- Counterparty information

**Recommended Tools**:
- CoinTracker
- Koinly
- TokenTax
- Or manual spreadsheet with hash links

### Tax Penalties

Failure to properly report crypto transactions can result in:
- Accuracy-related penalties (20% of underpayment)
- Fraud penalties (75% of underpayment)
- Criminal prosecution in severe cases

---

## 4. Risk Management

### Financial Risks

**Volatility Risk**:
- Even "stable" coins can depeg (USDC briefly hit $0.87 in 2023)
- Minimize exposure: Convert to fiat quickly if not needed
- Consider holding in fiat and converting only when paying

**Smart Contract Risk**:
- Bugs in token contracts can lead to loss of funds
- Use only established tokens (USDC, USDT, ETH)
- Avoid new/unaudited tokens

**Operational Risk**:
- Wrong address = irreversible loss
- Test all addresses with small amounts first
- Implement address verification workflows

### Security Risks

**Key Compromise**:
- If API keys are stolen, attacker can drain wallets
- Use IP allowlists
- Rotate keys regularly
- Monitor for unauthorized access

**Social Engineering**:
- Verify all payment requests through secondary channel
- Implement approval workflows for large amounts
- Train staff on crypto payment security

### Mitigation Strategies

**Wallet Structure**:
```
Operating Wallet: Small amount for daily expenses
Payroll Wallet: Dedicated for employee payments
Reserve Wallet: Larger amounts, multi-sig if possible
```

**Transaction Limits**:
```python
DAILY_LIMIT = 50000  # USD equivalent
SINGLE_TX_LIMIT = 10000  # Require approval above this
```

**Approval Workflows**:
- Single signer: Up to $1,000
- Dual approval: $1,000 - $10,000
- Executive approval: Above $10,000

---

## 5. Prohibited Activities

### Strictly Forbidden

1. **Money Laundering**: Using crypto to obscure fund sources
2. **Sanctions Evasion**: Paying sanctioned individuals/entities
3. **Unlicensed Money Transmission**: Acting as a payment processor for others
4. **Securities Violations**: Using crypto for unregistered securities transactions
5. **Tax Evasion**: Willfully underreporting crypto transactions

### Red Flags to Avoid

- Requests for anonymity from counterparties
- Unusually large payments without clear business purpose
- Payments to high-risk jurisdictions
- Rapid movement of funds without explanation
- Structuring payments to avoid reporting thresholds

---

## 6. Best Practices Summary

### DO:

✅ Use for legitimate business payments only  
✅ Keep detailed records of all transactions  
✅ Report all crypto activity on taxes  
✅ Implement strong security controls  
✅ Use testnet for development  
✅ Start with small amounts  
✅ Verify addresses carefully  
✅ Consult with crypto-savvy professionals  
✅ Stay updated on regulations  

### DON'T:

❌ Use for trading or speculation  
❌ Ignore tax reporting requirements  
❌ Skip KYC/AML for large payments  
❌ Store keys in unsecured locations  
❌ Send to unverified addresses  
❌ Exceed your risk tolerance  
❌ Assume privacy (blockchain is public)  
❌ Forget to backup wallet data  

---

## 7. When to Seek Professional Help

**Consult a Lawyer If**:
- You're unsure about licensing requirements
- You're making international payments
- You're processing payments for third parties
- You're in a heavily regulated industry

**Consult an Accountant If**:
- You're unsure how to report crypto transactions
- You have complex treasury operations
- You're staking or earning yield
- You've had significant gains/losses

**Consult a Security Expert If**:
- You're holding significant amounts
- You're implementing multi-sig
- You're setting up institutional custody

---

## 8. Emergency Procedures

### If You Suspect Unauthorized Access

1. **Immediately** revoke API keys in CDP Portal
2. **Transfer** remaining funds to a new secure wallet
3. **Review** all recent transactions
4. **Document** the incident
5. **Report** to Coinbase Support
6. **Consult** legal counsel if funds were stolen

### If You Send to Wrong Address

1. **Check** if the address is valid (not burn address)
2. **Contact** the recipient if known
3. **Accept** that recovery is likely impossible
4. **Document** the loss for tax purposes
5. **Implement** additional safeguards to prevent recurrence

---

## Final Warning

**Cryptocurrency is a high-risk technology. You can lose money.**

- Blockchain transactions are **irreversible**
- Mistakes can result in **permanent loss of funds**
- Regulations are **evolving rapidly**
- Tax mistakes can result in **significant penalties**

**Start small. Test thoroughly. Document everything. When in doubt, consult a professional.**

---

## Resources

- [IRS Digital Assets Guide](https://www.irs.gov/filing/digital-assets)
- [FinCEN Virtual Currency Guidance](https://www.fincen.gov/resources/statutes-regulations/guidance)
- [Coinbase Tax Center](https://www.coinbase.com/learn/crypto-taxes)
- [OFAC Sanctions List](https://sanctionssearch.ofac.treas.gov/)

---

**By using CDP for payments automation, you acknowledge that you understand these risks and will use the technology responsibly for legitimate business purposes only.**
