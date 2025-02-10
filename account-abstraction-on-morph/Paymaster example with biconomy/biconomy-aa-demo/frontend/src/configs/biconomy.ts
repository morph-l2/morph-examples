import { createSmartAccountClient } from "@biconomy/account";
import { ChainId } from "@biconomy/core-types";
import { ethers } from "ethers";

export const BICONOMY_CHAIN_ID = ChainId.SEPOLIA;

export const createSmartAccount = async (
  provider: ethers.providers.Web3Provider
) => {
  try {
    // Get signer from the provider
    const signer = provider.getSigner();

    // Ensure we have a valid signer address
    const signerAddress = await signer.getAddress();
    console.log("Signer address:", signerAddress);

    const config = {
      chainId: 2810, // MorphHolesky chain ID
      biconomyPaymasterApiKey:
        process.env.NEXT_PUBLIC_BICONOMY_PAYMASTER_API_KEY!,
      bundlerUrl: process.env.NEXT_PUBLIC_BICONOMY_BUNDLER_URL as string,
      rpcUrl: process.env.NEXT_PUBLIC_RPC_URL as string,
      signer: signer,
    };

    const smartAccount = await createSmartAccountClient(config);
    return smartAccount;
  } catch (error) {
    console.error("Error creating smart account:", error);
    throw error;
  }
};
