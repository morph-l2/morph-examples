# Smart Contracts for Morph Holesky Starter Kit

This directory contains the smart contract development environment for the Morph Holesky Starter Kit. It includes both Hardhat and Foundry setups for comprehensive testing and deployment options.

## Structure

- `/hardhat`: Hardhat project for Solidity development and testing
- `/foundry`: Foundry project for additional testing and deployment options

## Getting Started with Hardhat

1. Navigate to the Hardhat directory:
   ```
   cd hardhat
   ```
2. Install dependencies:
   ```
   yarn install
   ```
3. Compile contracts:
   ```
   yarn hardhat compile
   ```
4. Run tests:
   ```
   yarn hardhat test
   ```
5. Deploy to Morph Holesky:
   ```
   yarn hardhat run scripts/deploy.ts --network morphHolesky
   ```

## Getting Started with Foundry

1. Navigate to the Foundry directory:
   ```
   cd foundry
   ```
2. Install dependencies:
   ```
   forge install
   ```
3. Build the project:
   ```
   forge build
   ```
4. Run tests:
   ```
   forge test
   ```
5. Deploy to Morph Holesky:
   ```
   forge script script/DeployGreeter.s.sol:DeployGreeter --rpc-url $MORPH_HOLESKY_RPC_URL --broadcast
   ```

## Environment Variables

Create a `.env` file in both the Hardhat and Foundry directories with the following variables:

```
PRIVATE_KEY=your_private_key_here
MORPH_HOLESKY_RPC_URL=https://rpc-testnet.morphl2.io
```

Ensure you never commit your `.env` file to version control.
