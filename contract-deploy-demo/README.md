<img src="../assets/banner.png" alt="create2-banner"/>

# Morph Contract Deployment Demo

This project demonstrates how to use hardhat or foundry to deploy a contract in Morph's rollup network. This project contains a simple contract that will lock a certain amount of Ether in the deployed contract for a specified amount of time.

## Prerequisites

- Network setup: https://docs.morphl2.io/docs/build-on-morph/build-on-morph/development-setup

## Deploy with Hardhat

1. If you haven't already, install [nodejs](https://nodejs.org/en/download/) and [yarn](https://classic.yarnpkg.com/lang/en/docs/install).
2. Run `yarn install` to install dependencies.
3. Create a `.env` file following the example `.env.example` in the root directory. Change `PRIVATE_KEY` to your own account private key in the `.env`.
4. Run `yarn compile` to compile the contract.
5. Run `yarn deploy:morphTestnet` to deploy the contract on the Morph Sepolia Testnet.
6. Run `yarn test` for hardhat tests.

## Deploy with Foundry

1. Install Foundry.
   ```shell
   curl -L https://foundry.paradigm.xyz | bash
   foundryup
   ```
2. Build the project.
   ```
   forge build
   ```
3. Deploy the contract.
   ```
   forge create --rpc-url https://rpc-testnet.morphl2.io/ \
     --value <lock_amount> \
     --constructor-args <unlock_time> \
     --private-key <your_private_key> \
     --legacy \
     contracts/Lock.sol:Lock
   ```

- `<lock_amount>` is the amount of `ETH` to be locked in the contract. Try setting this to some small amount, like `0.0000001ether`.
- `<unlock_time>` is the Unix timestamp after which the funds locked in the contract will become available for withdrawal. Try setting this to some Unix timestamp in the future, like `1696118400` (this Unix timestamp corresponds to October 1, 2023).

For example:

```
forge create --rpc-url https://rpc-testnet.morphl2.io --value 0.00000000002ether --constructor-args 1696118400 --private-key 0xabc123abc123abc123abc123abc123abc123abc123abc123abc123abc123abc1 --legacy contracts/Lock.sol:Lock
```

## Support

Join our Discord: https://morphl2.io/
