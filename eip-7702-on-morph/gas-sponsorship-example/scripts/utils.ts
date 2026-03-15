import { createPublicClient, createWalletClient, http, defineChain, type Chain } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import * as dotenv from "dotenv";

dotenv.config();

/// Morph Hoodi Testnet chain definition
export const morphTestnet = defineChain({
  id: 2910,
  name: "Morph Hoodi Testnet",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: {
      http: [process.env.MORPH_TESTNET_URL || "https://rpc-hoodi.morph.network"],
    },
  },
  blockExplorers: {
    default: {
      name: "Morph Explorer",
      url: "https://explorer-hoodi.morphl2.io",
    },
  },
});

/// Morph Mainnet chain definition
export const morphMainnet = defineChain({
  id: 2818,
  name: "Morph Mainnet",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: {
      http: [process.env.MORPH_MAINNET_URL || "https://rpc-quicknode.morph.network"],
    },
  },
  blockExplorers: {
    default: {
      name: "Morph Explorer",
      url: "https://explorer.morphl2.io",
    },
  },
});

/// Determine which network to use based on CLI args
export function getNetwork(): { chain: Chain; name: string } {
  const isMainnet = process.argv.includes("--mainnet");
  return isMainnet
    ? { chain: morphMainnet, name: "Morph Mainnet" }
    : { chain: morphTestnet, name: "Morph Hoodi Testnet" };
}

/// SimpleDelegation contract ABI (only the functions we need)
export const SimpleDelegationABI = [
  {
    type: "function",
    name: "execute",
    inputs: [
      {
        name: "calls",
        type: "tuple[]",
        components: [
          { name: "to", type: "address" },
          { name: "value", type: "uint256" },
          { name: "data", type: "bytes" },
        ],
      },
      { name: "_nonce", type: "uint256" },
      { name: "signature", type: "bytes" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "nonce",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getDigest",
    inputs: [
      {
        name: "calls",
        type: "tuple[]",
        components: [
          { name: "to", type: "address" },
          { name: "value", type: "uint256" },
          { name: "data", type: "bytes" },
        ],
      },
      { name: "_nonce", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bytes32" }],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "Executed",
    inputs: [
      { name: "sender", type: "address", indexed: true },
      { name: "nonce", type: "uint256", indexed: false },
      { name: "callCount", type: "uint256", indexed: false },
    ],
  },
] as const;

/// Load accounts from environment
export function loadAccounts() {
  const eoaPk = process.env.EOA_PRIVATE_KEY;
  const sponsorPk = process.env.SPONSOR_PRIVATE_KEY;

  if (!eoaPk || !sponsorPk) {
    throw new Error(
      "Missing EOA_PRIVATE_KEY or SPONSOR_PRIVATE_KEY in .env file"
    );
  }

  return {
    eoa: privateKeyToAccount(eoaPk as `0x${string}`),
    sponsor: privateKeyToAccount(sponsorPk as `0x${string}`),
  };
}

/// Create viem clients for the selected network
export function createClients() {
  const { eoa, sponsor } = loadAccounts();
  const { chain, name } = getNetwork();

  console.log(`Network: ${name} (chainId: ${chain.id})\n`);

  const publicClient = createPublicClient({
    chain,
    transport: http(),
  });

  const eoaWalletClient = createWalletClient({
    account: eoa,
    chain,
    transport: http(),
  });

  const sponsorWalletClient = createWalletClient({
    account: sponsor,
    chain,
    transport: http(),
  });

  return { publicClient, eoaWalletClient, sponsorWalletClient, eoa, sponsor, chain };
}
