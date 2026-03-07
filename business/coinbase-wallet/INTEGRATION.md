# CDP Integration with OpenClaw

> **⚠️ PAYMENTS & AUTOMATION ONLY** — This integration is for automating legitimate business payments, NOT for trading.

## Overview

This guide explains how to integrate Coinbase Developer Platform (CDP) with OpenClaw to enable automated crypto payment workflows.

---

## API Endpoints

### Base URLs

| Environment | Base URL |
|-------------|----------|
| Production | `https://api.cdp.coinbase.com` |
| Sandbox | Use `base-sepolia` network for testing |

### Key Endpoints

#### Wallet Management
```
POST   /platform/v2/evm/accounts                    # Create wallet
GET    /platform/v2/evm/accounts/{account_id}       # Get wallet details
GET    /platform/v2/evm/accounts/{account_id}/balance  # Get balances
```

#### Transactions
```
POST   /platform/v2/evm/accounts/{account_id}/sign/transaction  # Sign & send tx
GET    /platform/v2/evm/accounts/{account_id}/transactions      # List transactions
```

#### Webhooks
```
POST   /platform/v2/data/webhooks/subscriptions     # Create webhook
GET    /platform/v2/data/webhooks/subscriptions     # List webhooks
DELETE /platform/v2/data/webhooks/subscriptions/{id} # Delete webhook
```

#### Token Balances
```
GET    /platform/v2/evm/token-balances/{network}/{address}
```

---

## Authentication

### Required Headers

All server-to-server requests require:

```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

Wallet operations additionally require:

```
X-Wallet-Auth: <WALLET_JWT_TOKEN>
```

### Generating JWT Tokens

**Using CDP SDK (Recommended)**:
```python
from cdp import Cdp

# SDK handles JWT generation automatically
Cdp.configure(api_key_name, api_key_secret)
```

**Manual JWT Generation** (if not using SDK):
```python
import jwt
import time
from cryptography.hazmat.primitives import serialization

# Generate Bearer Token for API authentication
def generate_bearer_token(key_id, key_secret, method, path, host):
    now = int(time.time())
    
    payload = {
        "sub": key_id,
        "iss": "cdp",
        "aud": ["cdp_service"],
        "nbf": now,
        "exp": now + 120,  # 2 minute expiry
        "uri": f"{method.upper()} {host}{path}"
    }
    
    # Sign with Ed25519
    token = jwt.encode(payload, key_secret, algorithm="EdDSA")
    return token
```

---

## Sample Code

### 1. Basic Setup

```python
import os
from cdp import Cdp, Wallet
from cdp.client.models.webhook import WebhookEventType

# Configure CDP
Cdp.configure(
    api_key_name=os.getenv("CDP_API_KEY_NAME"),
    api_key_private_key=os.getenv("CDP_API_KEY_SECRET")
)

# Enable server signer for production (recommended)
Cdp.use_server_signer = True
```

### 2. Create and Fund Wallet

```python
# Create wallet on Base mainnet
wallet = Wallet.create(network_id="base-mainnet")
print(f"Wallet Address: {wallet.default_address.address_id}")

# For testing on Sepolia testnet:
# wallet = Wallet.create(network_id="base-sepolia")
# faucet_tx = wallet.faucet()
# faucet_tx.wait()
```

### 3. Send Payment

```python
def send_payment(wallet, amount, asset, destination, memo=None):
    """
    Send a payment to a recipient address.
    
    Args:
        wallet: CDP Wallet instance
        amount: Amount to send
        asset: Asset symbol (e.g., 'usdc', 'eth')
        destination: Recipient address (0x...)
        memo: Optional memo/notes
    """
    try:
        # Use gasless transfers for USDC (no ETH needed for gas)
        gasless = (asset.lower() == "usdc")
        
        transfer = wallet.transfer(
            amount=amount,
            asset=asset.lower(),
            destination=destination,
            gasless=gasless
        ).wait()
        
        return {
            "success": True,
            "transaction_hash": transfer.transaction_hash,
            "status": transfer.status,
            "network": transfer.network_id,
            "timestamp": transfer.updated_at
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

# Example usage
result = send_payment(
    wallet=wallet,
    amount=1000.00,
    asset="usdc",
    destination="0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    memo="Invoice #1234"
)

if result["success"]:
    print(f"Payment sent! TX: {result['transaction_hash']}")
else:
    print(f"Payment failed: {result['error']}")
```

### 4. Batch Payroll Payment

```python
def process_payroll(wallet, payroll_list):
    """
    Process multiple contractor payments.
    
    Args:
        wallet: CDP Wallet instance
        payroll_list: List of dicts with 'name', 'address', 'amount'
    
    Returns:
        List of payment results
    """
    results = []
    
    for employee in payroll_list:
        try:
            result = send_payment(
                wallet=wallet,
                amount=employee["amount"],
                asset="usdc",
                destination=employee["address"]
            )
            
            results.append({
                "employee": employee["name"],
                **result
            })
            
            # Log for accounting
            log_payroll_record(employee, result)
            
        except Exception as e:
            results.append({
                "employee": employee["name"],
                "success": False,
                "error": str(e)
            })
    
    return results

# Example payroll
payroll = [
    {"name": "Alice", "address": "0x...", "amount": 5000},
    {"name": "Bob", "address": "0x...", "amount": 3500},
]

results = process_payroll(wallet, payroll)
```

### 5. Check Balance

```python
def get_wallet_summary(wallet):
    """Get wallet balances and info."""
    address = wallet.default_address
    
    # Get all balances
    balances = list(address.balances())
    
    # Get transfers
    transfers = list(address.transfers())
    
    return {
        "wallet_id": wallet.id,
        "address": address.address_id,
        "network": wallet.network_id,
        "balances": balances,
        "recent_transfers": transfers[:10]
    }
```

---

## Webhook Setup

### 1. Create Webhook for Payment Notifications

```python
def create_payment_webhook(notification_url, wallet_address):
    """
    Create webhook to monitor incoming/outgoing payments.
    
    Args:
        notification_url: Your HTTPS endpoint
        wallet_address: Address to monitor
    """
    from cdp import Webhook
    from cdp.client.models.webhook import WebhookEventType, WebhookEventFilter
    
    webhook = Webhook.create(
        notification_uri=notification_url,
        event_type=WebhookEventType.ERC20_TRANSFER,
        event_filters=[
            WebhookEventFilter(
                from_address=wallet_address,
                to_address=wallet_address
            )
        ],
        network_id="base-mainnet"
    )
    
    return webhook

# Example
webhook = create_payment_webhook(
    notification_url="https://your-app.com/webhooks/coinbase",
    wallet_address=wallet.default_address.address_id
)

print(f"Webhook ID: {webhook.id}")
print(f"Webhook Secret: {webhook.metadata['secret']}")  # Save for verification
```

### 2. Webhook Handler (Flask Example)

```python
from flask import Flask, request, jsonify
import hmac
import hashlib

app = Flask(__name__)

# Store this securely (from webhook creation)
WEBHOOK_SECRET = "your-webhook-secret"

def verify_webhook_signature(payload, signature, secret):
    """Verify webhook is from Coinbase."""
    expected = hmac.new(
        secret.encode(),
        payload,
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(f"sha256={expected}", signature)

@app.route('/webhooks/coinbase', methods=['POST'])
def handle_coinbase_webhook():
    # Verify signature
    signature = request.headers.get('X-Webhook-Signature')
    if not verify_webhook_signature(request.data, signature, WEBHOOK_SECRET):
        return jsonify({"error": "Invalid signature"}), 401
    
    event = request.json
    
    # Handle different event types
    if event['event_type'] == 'erc20_transfer':
        handle_transfer_event(event)
    
    return jsonify({"status": "ok"}), 200

def handle_transfer_event(event):
    """Process transfer notification."""
    data = event['data']
    
    transfer_info = {
        "from": data['from_address'],
        "to": data['to_address'],
        "amount": data['amount'],
        "asset": data['asset'],
        "tx_hash": data['transaction_hash'],
        "block_number": data['block_number']
    }
    
    # Update your database
    record_transaction(transfer_info)
    
    # Send notification
    if transfer_info['to'] == MY_WALLET_ADDRESS:
        notify_payment_received(transfer_info)
    else:
        notify_payment_sent(transfer_info)

if __name__ == '__main__':
    app.run(port=5000)
```

### 3. Webhook Event Types

| Event Type | Description |
|------------|-------------|
| `erc20_transfer` | ERC-20 token transfers (USDC, etc.) |
| `eth_transfer` | Native ETH transfers |
| `contract_execution` | Smart contract interactions |

---

## Error Handling

### Common Errors

```python
from cdp.errors import (
    ApiException,
    InsufficientFundsError,
    InvalidAddressError,
    TransactionFailedError
)

def safe_transfer(wallet, amount, asset, destination):
    """Transfer with comprehensive error handling."""
    try:
        transfer = wallet.transfer(amount, asset, destination).wait()
        return {"success": True, "tx_hash": transfer.transaction_hash}
        
    except InsufficientFundsError:
        return {
            "success": False,
            "error": "INSUFFICIENT_FUNDS",
            "message": f"Not enough {asset} for this transaction"
        }
        
    except InvalidAddressError:
        return {
            "success": False,
            "error": "INVALID_ADDRESS",
            "message": "The destination address is invalid"
        }
        
    except TransactionFailedError as e:
        return {
            "success": False,
            "error": "TRANSACTION_FAILED",
            "message": str(e),
            "code": e.code if hasattr(e, 'code') else None
        }
        
    except ApiException as e:
        return {
            "success": False,
            "error": "API_ERROR",
            "message": str(e),
            "status_code": e.status if hasattr(e, 'status') else None
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": "UNKNOWN_ERROR",
            "message": str(e)
        }
```

### Retry Logic

```python
import time
from functools import wraps

def retry_on_failure(max_retries=3, delay=1):
    """Decorator for retry logic."""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(max_retries):
                result = func(*args, **kwargs)
                if result.get("success"):
                    return result
                
                if attempt < max_retries - 1:
                    time.sleep(delay * (2 ** attempt))  # Exponential backoff
            
            return result
        return wrapper
    return decorator

@retry_on_failure(max_retries=3)
def send_payment_with_retry(wallet, amount, asset, destination):
    return safe_transfer(wallet, amount, asset, destination)
```

---

## OpenClaw Integration Pattern

### Example: Payment Command

```python
# OpenClaw skill for crypto payments
def pay_invoice(invoice_id: str, crypto_address: str, amount: float):
    """
    OpenClaw-compatible function for invoice payment.
    
    Usage in OpenClaw:
    /pay_invoice INV-123 0x742d... 1500.00
    """
    # Load wallet
    wallet = load_treasury_wallet()
    
    # Verify invoice in your system
    invoice = verify_invoice(invoice_id, amount)
    if not invoice:
        return {"error": "Invoice not found or amount mismatch"}
    
    # Send payment
    result = safe_transfer(wallet, amount, "usdc", crypto_address)
    
    if result["success"]:
        mark_invoice_paid(invoice_id, result["tx_hash"])
        return {
            "status": "paid",
            "invoice": invoice_id,
            "amount": amount,
            "transaction": result["tx_hash"],
            "explorer_url": f"https://basescan.org/tx/{result['tx_hash']}"
        }
    else:
        return {
            "status": "failed",
            "invoice": invoice_id,
            "error": result["message"]
        }
```

---

## Testing

### Testnet Workflow

```python
# Always test on Base Sepolia first
Cdp.configure(api_key_name, api_key_secret)

# Create test wallet
wallet = Wallet.create(network_id="base-sepolia")

# Fund with test ETH
wallet.faucet().wait()

# Test transfer
test_result = send_payment(
    wallet=wallet,
    amount=0.001,
    asset="eth",
    destination="0x..."  # Another test address
)
```

---

## Security Checklist

- [ ] Store API keys in environment variables or secrets manager
- [ ] Use IP allowlists in CDP Portal
- [ ] Verify webhook signatures
- [ ] Implement transaction limits and approvals
- [ ] Log all transactions for audit
- [ ] Use testnet for all development
- [ ] Enable server-signer for production
- [ ] Set up monitoring and alerts

---

## Resources

- [CDP API Reference](https://docs.cdp.coinbase.com/api-reference/v2/rest-api/)
- [CDP Python SDK](https://coinbase.github.io/cdp-sdk-python/)
- [BaseScan Explorer](https://basescan.org/) (Mainnet)
- [Base Sepolia Explorer](https://sepolia.basescan.org/) (Testnet)
