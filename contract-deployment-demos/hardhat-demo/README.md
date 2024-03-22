# Morph Contract Deployment Demo

This project demonstrates how to use hardhat to deploy a contract on the Morph Sepolia Testnet. This project contains a simple contract that will lock a certain amount of Ether in the deployed contract for a specified amount of time.

## Prerequisites

- Network setup: https://docs.morphl2.io/docs/build-on-morph/build-on-morph/development-setup

## Deploy with Hardhat

1. If you haven't already, install [nodejs](https://nodejs.org/en/download/) and [yarn](https://classic.yarnpkg.com/lang/en/docs/install).
2. Run `yarn install` to install dependencies.
3. Create a `.env` file following the example `.env.example` in the root directory. Change `PRIVATE_KEY` to your own account private key in the `.env`.
4. Run `yarn compile` to compile the contract.
5. Run `yarn deploy:morphTestnet` to deploy the contract on the Morph Sepolia Testnet.
6. Run `yarn test` for hardhat tests.

## Support

Thank you for participating in and developing on the Morph Sepolia Testnet! If you encounter any issues, join our [Discord](https://discord.com/invite/5SmG4yhzVZ) and find us at #dev-help channel.