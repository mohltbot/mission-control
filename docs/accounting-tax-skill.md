# Accounting-Tax Skill

A comprehensive financial analysis skill for OpenClaw that provides bank reconciliation, tax calculations, depreciation schedules, and financial health analysis.

## Features

### 1. Bank Reconciliation
- Match transactions between bank statements and internal records
- Identify discrepancies and missing entries
- Calculate reconciliation differences

### 2. Tax Calculations
- Calculate income tax based on IRS tax brackets (2024)
- Support for filing statuses: Single, Married Filing Jointly, Head of Household
- Include standard deduction in calculations
- Estimated quarterly tax payments

### 3. Depreciation Schedules
- Straight-line depreciation
- MACRS depreciation (Modified Accelerated Cost Recovery System)
- Support for multiple asset classes and property types

### 4. Financial Analysis
- Calculate key financial ratios (current ratio, debt-to-equity, ROA)
- Analyze balance sheet health
- Generate financial health reports

## Installation

```bash
# Via OpenClaw CLI
openclaw skill install accounting-tax

# Or manually clone to your skills directory
git clone https://github.com/mohltbot/accounting-tax-skill.git ~/.openclaw/skills/accounting-tax
```

## Usage

### Bank Reconciliation

```bash
# Reconcile bank statement with internal records
openclaw run accounting-tax reconcile \
  --bank-statement bank.csv \
  --internal-records internal.csv \
  --output reconciliation-report.json
```

### Tax Calculation

```bash
# Calculate income tax
openclaw run accounting-tax tax-calc \
  --income 85000 \
  --filing-status single \
  --deductions 13850

# Calculate quarterly estimated taxes
openclaw run accounting-tax quarterly-estimate \
  --projected-income 120000 \
  --filing-status married-joint
```

### Depreciation

```bash
# Straight-line depreciation
openclaw run accounting-tax depreciate \
  --method straight-line \
  --cost 50000 \
  --salvage-value 5000 \
  --useful-life 7

# MACRS depreciation
openclaw run accounting-tax depreciate \
  --method macrs \
  --cost 50000 \
  --property-type 5-year \
  --convention half-year
```

### Financial Analysis

```bash
# Analyze financial health
openclaw run accounting-tax analyze \
  --balance-sheet balance.json \
  --income-statement income.json \
  --output analysis-report.md
```

## API Reference

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `TAX_YEAR` | Tax year for calculations (default: 2024) | No |
| `IRS_API_KEY` | For real-time tax bracket updates | No |

### Input Formats

**Bank Statement CSV:**
```csv
Date,Description,Amount,Reference
2024-01-15,Vendor Payment,-500.00,INV-001
2024-01-16,Customer Deposit,1200.00,PAY-123
```

**Balance Sheet JSON:**
```json
{
  "assets": {
    "current": 50000,
    "fixed": 150000,
    "total": 200000
  },
  "liabilities": {
    "current": 20000,
    "long_term": 50000,
    "total": 70000
  },
  "equity": 130000
}
```

## Examples

### Monthly Close Process

```bash
#!/bin/bash
# monthly-close.sh

echo "Running monthly close process..."

# Step 1: Reconcile bank accounts
openclaw run accounting-tax reconcile \
  --bank-statement "bank-$(date +%Y-%m).csv" \
  --internal-records "ledger-$(date +%Y-%m).csv" \
  --output "reconciliation-$(date +%Y-%m).json"

# Step 2: Calculate depreciation
openclaw run accounting-tax depreciate \
  --method macrs \
  --asset-list assets.json \
  --output "depreciation-$(date +%Y-%m).json"

# Step 3: Generate financial report
openclaw run accounting-tax analyze \
  --balance-sheet "balance-$(date +%Y-%m).json" \
  --income-statement "income-$(date +%Y-%m).json" \
  --output "financial-report-$(date +%Y-%m).md"

echo "Monthly close complete!"
```

## Tax Brackets (2024)

| Filing Status | Brackets |
|---------------|----------|
| Single | 10%: $0-$11,600; 12%: $11,601-$47,150; 22%: $47,151-$100,525; 24%: $100,526-$191,950; 32%: $191,951-$243,725; 35%: $243,726-$609,350; 37%: $609,351+ |
| Married Filing Jointly | 10%: $0-$23,200; 12%: $23,201-$94,300; 22%: $94,301-$201,050; 24%: $201,051-$383,900; 32%: $383,901-$487,450; 35%: $487,451-$731,200; 37%: $731,201+ |
| Head of Household | 10%: $0-$16,550; 12%: $16,551-$63,100; 22%: $63,101-$100,500; 24%: $100,501-$191,950; 32%: $191,951-$243,700; 35%: $243,701-$609,350; 37%: $609,351+ |

## Contributing

This skill is part of the OpenClaw ecosystem. Submit issues and PRs to:
https://github.com/mohltbot/accounting-tax-skill

## License

MIT License - See LICENSE file for details.

---

*Submitted to ClawHub on February 27, 2026*
