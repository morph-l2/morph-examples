# Démonstration de Déploiement de Contrat sur Morph
[Read in English](./README.md)
Ce projet montre comment utiliser Hardhat pour déployer un contrat sur le réseau de test Morph Holesky. Le projet contient un contrat simple qui verrouille une certaine quantité d'Ether pour un temps donné dans le contrat déployé.

## Prérequis

- Configuration réseau : https://docs.morphl2.io/docs/build-on-morph/build-on-morph/development-setup

## Déployer avec Hardhat

### Installer les dépendances

Si ce n'est pas déjà fait, installez [nodejs](https://nodejs.org/en/download/) et [yarn](https://classic.yarnpkg.com/lang/en/docs/install).

```bash
cd contract-deployment-demos/hardhat-demo
yarn install
```
Cela installera tout ce dont vous avez besoin, y compris Hardhat.


### CCompiler

Compilez votre contrat avec :

```bash
yarn compile
```

### Tester

Cela exécutera le script de test dans test/Lock.ts :

```bash
yarn test
```

### Déployer

 Créez un fichier `.env` en suivant l'exemple `.env.example` à la racine du projet. Remplacez `PRIVATE_KEY`par la clé privée de votre compte.

Modifiez les paramètres réseau dans le fichier hardhat.config.ts avec les informations suivantes :

   ```javascript
    morphTestnet: {
      url: process.env.MORPH_TESTNET_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    }
   ```
Ensuite, exécutez la commande suivante pour déployer le contrat sur le réseau de test Morph Holesky. Cela exécutera le script de déploiement qui définit les paramètres initiaux, vous pouvez éditer le script dans scripts/deploy.ts :
```bash
yarn deploy:morphTestnet
```

### Vérifier vos contrats sur Morph Explorer

Pour vérifier votre contrat via Hardhat, ajoutez les configurations Etherscan et Sourcify dans votre fichier hardhat.config.js :

```javascript
module.exports = {
  networks: {
    morphTestnet: { ... }
  },
  etherscan: {
    apiKey: {
      morphTestnet: 'anything',
    },
    customChains: [
      {
        network: 'morphTestnet',
        chainId: 2810,
        urls: {
          apiURL: 'https://explorer-api-holesky.morphl2.io/api? ',
          browserURL: 'https://explorer-holesky.morphl2.io/',
        },
      },
    ],
  },
};
```
Ensuite, exécutez la commande de vérification de Hardhat pour finaliser la vérification :

```bash
npx hardhat verify --network morphTestnet DEPLOYED_CONTRACT_ADDRESS <ConstructorParameter>
```

Par exemple :

```bash
npx hardhat verify --network morphTestnet 0x8025985e35f1bAFfd661717f66fC5a434417448E '0.00001'
```


Une fois réussie, vous pourrez consulter votre contrat et la transaction de déploiement sur [Morph Holesky Explorer](https://explorer-holesky.morphl2.io)
   

## Support

Merci de participer au développement sur le réseau de test Morph Holesky ! Si vous rencontrez des problèmes, rejoignez notre [Discord](https://discord.com/invite/5SmG4yhzVZ)et trouvez-nous dans le canal #dev-help.