# morph-examples
[Read in English](README.md)
Ceci est le repo d'une série d'exemples de code qui aide les développeurs à s'intégrer à l'écosystème Morph.

<!-- 
[![Twitter Follow]()](https://twitter.com/Morphl2)
[![Discord](https://img.shields.io/discord/984015101017346058?color=%235865F2&label=Discord&logo=discord&logoColor=%23fff)](https://discord.gg/)
-->

# Morph Examples

Les exemples de code dans ce Repo vont de la mise en ligne de contrats simples sur Morph à la création d'applications décentralisées (dApps) complètes utilisant Morph comme solution de couche 2 (L2).
D'autres exemples seront ajoutés à ce dépôt, et nous sommes ouverts aux suggestions d'exemples de code que vous aimeriez voir à l'avenir.

## Getting Started

### [contract-deploy-demo](https://github.com/morph-l2/morph-examples/tree/main/contract-deployment-demos)
* [foundry-deploy](https://github.com/varun-doshi/morph-examples/tree/main/contract-deployment-demos/foundry-demo)
* [hardhat-deploy](https://github.com/varun-doshi/morph-examples/tree/main/contract-deployment-demos/hardhat-demo)

Ce répertoire contient des projets qui démontrent comment utiliser **Hardhat** ou **Foundry** pour déployer un contrat sur le réseau rollup de Morph.

Ce projet contient un contrat simple qui verrouillera une certaine quantité d'Ether dans le contrat déployé pendant une durée déterminée.


### [frontend-demo](https://github.com/varun-doshi/morph-examples/tree/main/frontend_examples/nextjs_wagmi_template)
Ce répertoire contient une configuration Frontend simple vous permettant de connecter et d'interagir avec vos contrats intelligents directement depuis l'interface utilisateur.
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
