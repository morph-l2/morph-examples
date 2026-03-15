/**
 * EIP-7702 Gas Sponsorship Demo on Morph
 *
 * Flow:
 *   1. EOA signs an EIP-7702 authorization (delegate code to SimpleDelegation)
 *   2. EOA signs the operation (what they want to do)
 *   3. Sponsor submits a Type 4 transaction with both signatures, paying gas
 *
 * Result: EOA's operation is executed, gas is paid by the sponsor.
 *         The EOA doesn't need ETH for gas at all.
 */

import {
  encodeFunctionData,
  parseEther,
  formatEther,
  keccak256,
  encodeAbiParameters,
  parseAbiParameters,
} from "viem";
import { createClients, SimpleDelegationABI } from "./utils.ts";

/// SimpleDelegation contract address (set after deployment)
const SIMPLE_DELEGATION_ADDRESS =
  (process.env.SIMPLE_DELEGATION_ADDRESS as `0x${string}`) ||
  "0x0000000000000000000000000000000000000000";

/// Recipient address (sponsor address as default — sends 0 ETH just to demonstrate a call)
const RECIPIENT = (process.env.RECIPIENT_ADDRESS as `0x${string}`) ||
  "0x000000000000000000000000000000000000dEaD";

async function main() {
  if (
    SIMPLE_DELEGATION_ADDRESS === "0x0000000000000000000000000000000000000000"
  ) {
    throw new Error("Please set SIMPLE_DELEGATION_ADDRESS in .env");
  }

  const { publicClient, eoaWalletClient, sponsorWalletClient, eoa, sponsor, chain } =
    createClients();

  console.log("=== EIP-7702 Gas Sponsorship Demo on Morph ===\n");
  console.log("SimpleDelegation:", SIMPLE_DELEGATION_ADDRESS);
  console.log("EOA address:     ", eoa.address, "(no ETH needed for gas)");
  console.log("Sponsor address: ", sponsor.address, "(pays gas)");
  console.log("Recipient:       ", RECIPIENT);

  // Check balances before
  const eoaBalanceBefore = await publicClient.getBalance({ address: eoa.address });
  const sponsorBalanceBefore = await publicClient.getBalance({ address: sponsor.address });
  console.log("\n--- Balances Before ---");
  console.log("EOA balance:     ", formatEther(eoaBalanceBefore), "ETH");
  console.log("Sponsor balance: ", formatEther(sponsorBalanceBefore), "ETH");

  // ============================================================
  // Step 1: EOA signs EIP-7702 authorization
  //   - This allows the EOA's address to execute SimpleDelegation code
  //   - Anyone (sponsor) can include this in a Type 4 transaction
  // ============================================================
  console.log("\nStep 1: EOA signing EIP-7702 authorization...");
  const authorization = await eoaWalletClient.signAuthorization({
    contractAddress: SIMPLE_DELEGATION_ADDRESS,
  });
  console.log("  Authorization signed ✓");
  console.log("  Chain ID:", authorization.chainId);
  console.log("  Contract:", authorization.address);

  // ============================================================
  // Step 2: EOA signs the operation intent
  //   - This proves the EOA authorized the specific action
  //   - The contract will verify this signature
  // ============================================================
  console.log("\nStep 2: EOA signing the operation...");

  // Build the call: send 0 ETH to recipient (works even with 0 EOA balance)
  const calls = [
    {
      to: RECIPIENT,
      value: parseEther("0"),
      data: "0x" as `0x${string}`,
    },
  ];

  // Read current nonce from EOA's storage
  let currentNonce: bigint;
  try {
    currentNonce = (await publicClient.readContract({
      address: eoa.address,
      abi: SimpleDelegationABI,
      functionName: "nonce",
    })) as bigint;
  } catch {
    currentNonce = 0n;
  }
  console.log("  Current nonce:", currentNonce.toString());

  // Compute the digest the contract expects (must match getDigest())
  const dataHash = keccak256(
    encodeAbiParameters(
      parseAbiParameters(
        "(address to, uint256 value, bytes data)[], uint256, uint256, address"
      ),
      [calls, currentNonce, BigInt(chain.id), eoa.address]
    )
  );

  const opSignature = await eoa.signMessage({ message: { raw: dataHash } });
  console.log("  Operation signed ✓");

  // ============================================================
  // Step 3: Sponsor submits Type 4 transaction
  //   - authorizationList: EOA's delegation to SimpleDelegation
  //   - to: EOA address (now has SimpleDelegation code via EIP-7702)
  //   - data: call execute() with EOA's operation signature
  //   - Sponsor pays all gas fees
  // ============================================================
  console.log("\nStep 3: Sponsor submitting Type 4 (EIP-7702) transaction...");

  // Check sponsor's nonce status before sending
  const confirmedNonce = await publicClient.getTransactionCount({ address: sponsor.address });
  const pendingNonce = await publicClient.getTransactionCount({ address: sponsor.address, blockTag: "pending" });

  console.log(`  Sponsor nonce — confirmed: ${confirmedNonce}, pending: ${pendingNonce}`);
  if (pendingNonce > confirmedNonce) {
    console.log(`  ⚠ Warning: ${pendingNonce - confirmedNonce} pending tx(s) detected, using nonce ${pendingNonce} to avoid conflict`);
  }

  console.log("  Sponsor is paying gas for EOA's operation");

  // EIP-7702 Type 4 txs may need higher gas than RPC node estimates,
  // especially on mainnet where some nodes underestimate Type 4 gas requirements
  const isMainnet = chain.id === 2818;

  const txHash = await sponsorWalletClient.sendTransaction({
    authorizationList: [authorization],
    to: eoa.address,
    gas: 500000n,
    nonce: pendingNonce,
    ...(isMainnet && {
      maxFeePerGas: 1000000000n,       // 1 gwei
      maxPriorityFeePerGas: 500000000n, // 0.5 gwei
    }),
    data: encodeFunctionData({
      abi: SimpleDelegationABI,
      functionName: "execute",
      args: [calls, currentNonce, opSignature],
    }),
  });

  console.log("  Tx hash:", txHash);
  console.log("  Waiting for confirmation...");

  const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
  console.log("  ✓ Confirmed in block:", receipt.blockNumber.toString());
  console.log("  Gas used:", receipt.gasUsed.toString());

  // ============================================================
  // Results
  // ============================================================
  const eoaBalanceAfter = await publicClient.getBalance({ address: eoa.address });
  const sponsorBalanceAfter = await publicClient.getBalance({ address: sponsor.address });

  console.log("\n--- Balances After ---");
  console.log("EOA balance:     ", formatEther(eoaBalanceAfter), "ETH");
  console.log("Sponsor balance: ", formatEther(sponsorBalanceAfter), "ETH");

  console.log("\n--- Summary ---");
  console.log("EOA gas paid:      ", formatEther(eoaBalanceBefore - eoaBalanceAfter), "ETH  ← should be 0");
  console.log("Sponsor gas paid:  ", formatEther(sponsorBalanceBefore - sponsorBalanceAfter), "ETH");
  console.log("\n✓ Gas was fully paid by the sponsor. EOA needed zero ETH for gas!");
  const explorerUrl = chain.blockExplorers?.default?.url || "https://explorer-hoodi.morphl2.io";
  console.log(`  View tx: ${explorerUrl}/tx/${txHash}`);
}

main().catch((err) => {
  console.error("Error:", err.message ?? err);
  process.exit(1);
});
