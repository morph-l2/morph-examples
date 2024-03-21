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

## Deploy contracts with Foundry

1. Clone the repo:

   ```shell
   git clone https://github.com/morph-l2/morph-examples.git
   cd morph-examples
   cd contract-deploy-demo
   ```

2. Install Foundry:

   ```shell
   curl -L https://foundry.paradigm.xyz | bash
   foundryup
   ```

3. Run `forge build` to build the project.

4. Deploy your contract with Foundry:

   ```bash
   forge create --rpc-url https://rpc-testnet.morphl2.io/ \
     --value <lock_amount> \
     --constructor-args <unlock_time> \
     --private-key <private_key> \
     --legacy contracts/Lock.sol:Lock
   ```

   - `<lock_amount>` is the amount of test `ETH` to be locked in the contract. Try setting this to some small amount, like `0.0000001ether`;
   - `<unlock_time>` is the Unix timestamp after which the funds locked in the contract will become available for withdrawal. Try setting this to some Unix timestamp in the future, like `1714492800` (this Unix timestamp corresponds to May 1, 2024).

   For example:

   ```bash
   forge create --rpc-url https://rpc-testnet.morphl2.io/ \
     --value 0.0000001ether \
     --constructor-args 1714492800 \
     --private-key a123q123q233q231q231q2q1223q23q11q33q113qq31q31231 \
     --legacy contracts/Lock.sol:Lock
   ```

   Once succeed, you will see the following message:

   ```bash
   Deployer: <Your address>
   Deployed to: <Your contract address>
   Transaction hash: <The deploy transaction hash>
   ```

## Support

Thank you for participating in and developing on the Morph Sepolia Testnet! If you encounter any issues, join our [Discord](https://discord.com/invite/5SmG4yhzVZ) and find us at #dev-help channel.
