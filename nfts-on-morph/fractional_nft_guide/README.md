<!-- TITLE -->
<p align="center"> 
  <img width="200px" src="https://morphl2brand.notion.site/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2Ffcab2c10-8da9-4414-aa63-4998ddf62e78%2F76b87f21-9863-4533-932c-91c593cc741c%2FLogo_Morph_white.jpg?table=block&id=00854626-61f3-4668-8ab1-cb8f3ec0dcb0&spaceId=fcab2c10-8da9-4414-aa63-4998ddf62e78&width=2000&userId=&cache=v2" align="center" alt="Morph" />
 <h2 align="center">Morph Starter Kit</h2>
</p>
</p>

<!-- TABLE OF CONTENTS -->

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->


## About The Project

The Morph starter kit helps developers quickly and efficiently, build dApps on the Morph blockchain. It is a comprehensive template for building fullstack dApps. This starter kit is an extension of the [ReactToWeb3 kit](https://github.com/Protocol-Explorer/ReactToWeb3)

<p align="right">(<a href="#top">back to top</a>)</p>


## Built With

Morph starter kit is built with a variety of frameworks and libraries.

- [Morph](https://www.morphl2.io/)
- [Solidity](https://docs.soliditylang.org/en/v0.8.19/)
- [Next.js](https://nextjs.org/)
- [Foundry](https://book.getfoundry.sh/)
- [walletConnect](https://cloud.walletconnect.com/sign-in)
- [wagmi](https://wagmi.sh/react/getting-started)
- [shadcn](https://ui.shadcn.com/docs/installation/next)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Prerequisites

- Node
- Git
- Foundry

```bash
cd contract
yarn
```


### Environment Configuration

#### Contract
In your terminal, run

```bash
cd contract
yarn
```

#### Frontend

Before you start, you need to set up your environment variables. Create a `.env.local` file in the root directory by running in a new terminal:

```bash
cp .env.example .env.local
```

In the file, update the `NEXT_PUBLIC_PROJECT_ID` variable with your WalletConnect project ID. You can obtain one by registering your project at [WalletConnect Cloud](https://cloud.walletconnect.com/).

### Install Dependencies 

```bash
npm install
# or
yarn 
# or
pnpm install
# or
bun install
```

### Running the Development Server

To run the development server, execute one of the following commands in your terminal:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your application in action. Begin by editing `app/page.tsx` to make changes and see them reflected in real time.

## 🧞 Features

- **TypeScript**: Utilize the strong typing of TypeScript to write more robust and error-free code.
- **Tailwind CSS**: Style your application efficiently using utility-first CSS.
- **WAGMI Hooks**: Manage blockchain wallet and network interactions with ease.
- **Viem**: Handle on-chain interactions directly within your frontend application.
- **Morph Sepolia Testnet**: Connect to the Morph testnet to develop and test your dApps.

## ✨ Learning Resources

- **Morph L2**: Learn more about Morph and its capabilities by visiting [Morph Layer 2 Official Site](https://www.morphl2.io/).
- **Morph Documentation**: For detailed information on how Morph works and how to integrate it into your applications, check out the [Morph Docs](https://docs.morphl2.io/docs/how-morph-works/intro/).

## 🚀 Deployment

Deploy your application with ease using platforms like [Vercel](https://vercel.com/), which provides out-of-the-box support for Next.js applications, or [Juno](https://juno.build), which gives you full control over your dApp by enabling its deployment on Web3. Refer to platform-specific guides for details on deploying Next.js applications.

















