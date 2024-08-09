# morph-examples
This is the repo of a series of code examples that helps developers onboard onto the Morph Ecosystem

<!-- 
[![Twitter Follow]()](https://twitter.com/Morphl2)
[![Discord](https://img.shields.io/discord/984015101017346058?color=%235865F2&label=Discord&logo=discord&logoColor=%23fff)](https://discord.gg/)
-->

# Morph Examples

The code examples in this repository will range from deploying simple contracts on Morph to building full stack dApps that leverage Morph as its L2. 
More examples will be added to this repository and we are open for suggestions on code examples you may want to see in the future.

## Getting Started

### [contract-deploy-demo](https://github.com/morph-l2/morph-examples/tree/main/contract-deployment-demos)
* [foundry-deploy](https://github.com/varun-doshi/morph-examples/tree/main/contract-deployment-demos/foundry-demo)
* [hardhat-deploy](https://github.com/varun-doshi/morph-examples/tree/main/contract-deployment-demos/hardhat-demo)

This directory includes projects that demonstrate how to use **Hardhat** or **Foundry** to deploy a contract in Morph's rollup network. 

This project contains a simple contract that will lock a certain amount of Ether in the deployed contract for a specified amount of time.


### [frontend-demo](https://github.com/varun-doshi/morph-examples/tree/main/frontend_examples/nextjs_wagmi_template)
This directory consists of a simple Frontend setup allowing you to connect to your smart contract and interact with them from the UI.

<!--

## Miscellaneous

### [create2-demo](https://github.com/morphl2/morph-examples/tree/main/contract-deploy-demo)

This project demonstrates how to use the `create2` opcode and tests it across various networks.

### [gas-estimation-demo](https://github.com/morphl2/morph-examples/tree/main/contract-deploy-demo)

This project demonstrates how to use estimate gas on Morph

-->

## Chain Configuration

```
network:morphTestnet
chainId:2810
apiURL: 'https://explorer-api-holesky.morphl2.io/api?'
browserURL: 'https://explorer-holesky.morphl2.io/'
rpcURL: 'https://rpc-quicknode-holesky.morphl2.io'
currencySymbol: ETH
```
