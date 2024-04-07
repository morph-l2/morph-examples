# Morph Contract Deployment Demo

This project demonstrates how to use hardhat to deploy a contract on the Morph Sepolia Testnet. This project contains a simple contract that will lock a certain amount of Ether in the deployed contract for a specified amount of time.

## Prerequisites

- Network setup: https://docs.morphl2.io/docs/build-on-morph/build-on-morph/development-setup

## Deploy with Hardhat

1. If you haven't already, install [nodejs](https://nodejs.org/en/download/) and [yarn](https://classic.yarnpkg.com/lang/en/docs/install).
2. Run `cd contract-deployment-demos/hardhat-demo` to go the right folder.
3. Run `yarn install` to install dependencies.
4. Create a `.env` file following the example `.env.example` in the root directory. Change `PRIVATE_KEY` to your own account private key in the `.env`.
5. Change the network settings in the hardhat.config.ts file with the following information:
   ```
    morphTestnet: {
      url: process.env.MORPH_TESTNET_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    }
    ```
6. Run `yarn compile` or `npx hardhat compile` to compile the contract.
7. Run `yarn deploy:morphTestnet` or `npx hardhat depoly:morphTestnet` to deploy the contract on the Morph Sepolia Testnet. This will run the deployment script that set the initialing parameters, you can edit the script in scripts/deploy.ts
8. Once succeed, you can check your contract and the deployment transaction on [Morph Sepolia Explorer](https://explorer-testnet.morphl2.io)
9. Run `yarn test` for hardhat tests.
## Prerequisites

- Network setup: https://docs.morphl2.io/docs/build-on-morph/build-on-morph/development-setup

## Deploy with foundry

1. Install foundry by: `curl -L https://foundry.paradigm.xyz | bash` and then `foundryup` in bash
2. Run `cd contract-deployment-demos/foundry-demo` to go the right folder.
3. Run `forge build` to compile the contract.
4. Run `forge test` to test the contract.
   

## Support

Thank you for participating in and developing on the Morph Sepolia Testnet! If you encounter any issues, join our [Discord](https://discord.com/invite/5SmG4yhzVZ) and find us at #dev-help channel.