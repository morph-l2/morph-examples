[Read in English](./README.md)
## Foundry

**Foundry est un outil ultra-rapide, portable et modulaire pour le développement d'applications Ethereum, écrit en Rust.**

Foundry se compose de :

-   **Forge**: Framework de test Ethereum (comme Truffle, Hardhat et DappTools).
-   **Cast**: Un outil multifonction pour interagir avec les contrats intelligents EVM, envoyer des transactions et obtenir des données de la blockchain.
-   **Anvil**:Un nœud Ethereum local, similaire à Ganache et Hardhat Network.
-   **Chisel**:  Un REPL (Read-Eval-Print Loop) pour Solidity rapide et pratique.

## Exemple de démarche

### Installer Foundry
```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

Ensuite, allez dans le bon dossier de notre exemple :

```bash
cd contract-deployment-demos/foundry-demo
```

### Compiler

```bash
forge build
```
### Deployer

Un script de déploiement et l'utilisation de variables d'environnement sont déjà configurés pour vous. Vous pouvez voir le script à script/Counter.s.sol.

Renommez le fichier .env.example en .env et remplissez votre clé privée. L'URL RPC ainsi que l'URL du vérificateur sont déjà préremplies.

Pour utiliser les variables dans votre fichier .env, exécutez la commande suivante :

```shell
source .env
```

Vous pouvez maintenant déployer sur Morph avec la commande suivante : 

```shell
forge script script/Counter.s.sol --rpc-url $RPC_URL --broadcast --private-key $DEPLOYER_PRIVATE_KEY --legacy
```

Ajustez selon les noms de vos propres scripts.

### Vérifier 

La vérification nécessite l'ajout de quelques options au script de vérification habituel. Vous pouvez vérifier en utilisant la commande suivante :

```bash
 forge verify-contract YourContractAddress Counter\
  --chain 2810 \
  --verifier-url $VERIFIER_URL \
  --verifier blockscout --watch
```

Une fois la vérification réussie, vous pouvez consulter votre contrat et la transaction de déploiement sur[Morph Holesky Explorer](https://explorer-holesky.morphl2.io)

### Cast

```shell
cast <subcommand>
```

### Help

```shell
forge --help
anvil --help
cast --help
```

## Documentation

https://book.getfoundry.sh/

## Usage

### Build

```shell
forge build
```

### Test

```shell
forge test
```

### Format

```shell
forge fmt
```

### Gas Snapshots

```shell
forge snapshot
```

### Anvil

```shell
anvil
```


