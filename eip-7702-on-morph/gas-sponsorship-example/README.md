# EIP-7702 Gas Sponsorship Example on Morph

This example demonstrates how to use **EIP-7702** to implement gas sponsorship on the Morph network. A sponsor pays transaction gas fees on behalf of an EOA, allowing the EOA to execute operations without holding ETH for gas.

## How It Works

```
┌──────────────────────────────────────────────────────────────┐
│                        EIP-7702 Flow                         │
│                                                              │
│  EOA (Alice)                        Sponsor (Bob)            │
│  ┌──────────────┐                   ┌──────────────┐         │
│  │ 1. Sign 7702 │                   │              │         │
│  │  authorization│──── auth ────────>│ 3. Build     │         │
│  │              │                   │   Type 4 tx  │         │
│  │ 2. Sign      │                   │   (pay gas)  │         │
│  │  operation   │──── signature ───>│              │         │
│  └──────────────┘                   └──────┬───────┘         │
│                                            │                 │
│                                            ▼                 │
│                                     ┌──────────────┐         │
│                                     │  Morph L2    │         │
│                                     │              │         │
│                                     │ • Set EOA's  │         │
│                                     │   code       │         │
│                                     │ • Execute    │         │
│                                     │   operation  │         │
│                                     │ • Gas paid   │         │
│                                     │   by sponsor │         │
│                                     └──────────────┘         │
└──────────────────────────────────────────────────────────────┘
```

### Key Concepts

- **EIP-7702 Authorization**: EOA signs a delegation, allowing its address to execute smart contract code (via `delegatecall`)
- **Gas Sponsorship**: The sponsor submits the Type 4 transaction and pays the gas fee, the EOA pays nothing
- **Signature Verification**: The `SimpleDelegation` contract verifies the EOA's signature on the operation to prevent unauthorized actions
- **Nonce Protection**: Replay attacks are prevented by an incrementing nonce stored in the EOA's storage

## Project Structure

```
gas-sponsorship-example/
├── src/
│   └── SimpleDelegation.sol    # Delegation contract (execute + signature verify)
├── script/
│   └── Deploy.s.sol            # Foundry deploy script
├── test/
│   └── SimpleDelegation.t.sol  # Foundry tests (vm.etch simulates EIP-7702)
├── scripts/
│   ├── sponsor.ts              # Gas sponsorship demo (Viem + EIP-7702)
│   └── utils.ts                # Shared utilities
├── foundry.toml
├── package.json
└── .env.example
```

## Prerequisites

- [Foundry](https://book.getfoundry.sh/getting-started/installation)
- [Node.js](https://nodejs.org/) >= 18
- Two accounts with ETH on Morph Holesky Testnet:
  - **EOA**: needs some ETH to transfer (not for gas)
  - **Sponsor**: needs ETH for gas fees

## Quick Start

### 1. Install Dependencies

```bash
# Install Foundry dependencies
forge install

# Install Node.js dependencies
npm install
```

### 2. Setup Environment

```bash
cp .env.example .env
# Edit .env with your private keys and configuration
```

### 3. Run Tests

```bash
forge test -v
```

### 4. Deploy Contract

```bash
forge script script/Deploy.s.sol \
  --rpc-url $MORPH_TESTNET_URL \
  --broadcast \
  --private-key $DEPLOYER_PRIVATE_KEY
```

Update `SIMPLE_DELEGATION_ADDRESS` in `.env` with the deployed address.

### 5. Run Gas Sponsorship Demo

```bash
# Testnet (default)
node --experimental-strip-types scripts/sponsor.ts

# Mainnet
node --experimental-strip-types scripts/sponsor.ts --mainnet
```

Expected output:

```
Network: Morph Hoodi Testnet (chainId: 2910)

=== EIP-7702 Gas Sponsorship Demo on Morph ===

SimpleDelegation: 0x6Dbe92bC5251e205B05151bB72e2977dDd78C1E5
EOA address:      0x... (no ETH needed for gas)
Sponsor address:  0x... (pays gas)

--- Balances Before ---
EOA balance:      0 ETH
Sponsor balance:  0.01 ETH

Step 1: EOA signing EIP-7702 authorization...
Step 2: EOA signing the operation...
Step 3: Sponsor submitting Type 4 (EIP-7702) transaction...

--- Balances After ---
EOA balance:      0 ETH
Sponsor balance:  0.0099 ETH

--- Summary ---
EOA gas paid:       0 ETH  ← should be 0
Sponsor gas paid:   0.0001 ETH

✓ Gas was fully paid by the sponsor. EOA needed zero ETH for gas!
```

## Chain Configuration

| | Testnet (Hoodi) | Mainnet |
|---|---|---|
| Chain ID | 2910 | 2818 |
| RPC URL | https://rpc-hoodi.morph.network | https://rpc-quicknode.morph.network |
| Explorer | https://explorer-hoodi.morph.network | https://explorer.morphl2.io |
| Explorer API | https://explorer-api-hoodi.morph.network/api? | https://explorer-api.morphl2.io/api? |

### Deployed SimpleDelegation Contract

Address (same on both networks): `0x6Dbe92bC5251e205B05151bB72e2977dDd78C1E5`

## SimpleDelegation Contract

The `SimpleDelegation` contract is a minimal delegation target:

- `execute(calls, nonce, signature)`: Execute a batch of calls after verifying the EOA's signature
- `getDigest(calls, nonce)`: Compute the EIP-191 message digest for signing
- `nonce()`: Current nonce for replay protection

The signature ensures only the EOA can authorize operations, while anyone (the sponsor) can submit the transaction.

## Support

If you encounter any issues, join our [Discord](https://discord.com/invite/5SmG4yhzVZ) and find us at #dev-help channel.
