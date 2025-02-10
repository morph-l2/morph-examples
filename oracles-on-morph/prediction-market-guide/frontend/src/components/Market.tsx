"use client";

import { EvmPriceServiceConnection } from "@pythnetwork/pyth-evm-js";
import { useState } from "react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { formatUnits, parseEther } from "viem";
import { marketAddress, marketAbi } from "../constants";

interface Props {
  market: {
    id: string;
    cryptoPair: string;
    strikePrice: string;
    endTime: string;
    pythPriceId: BigInt;
    resolutionTime: string;
    totalYesShares: string;
    totalNoShares: string;
    resolved: boolean;
    outcome: boolean;
  };
}

const Market = ({ market }: Props) => {
  const [amount, setAmount] = useState("");
  const [isYes, setIsYes] = useState(true);
  const { data: hash, writeContractAsync } = useWriteContract();

  const handleBuy = () => {
    try {
      const buyShareTx = writeContractAsync({
        address: marketAddress,
        abi: marketAbi,
        functionName: "buyShares",
        args: [market.id, isYes, amount],
      });
    } catch (err: any) {
      console.log("Transaction Failed: " + err.message);
    }
  };

  const handleResolveMarket = async () => {
    try {
      const connection = new EvmPriceServiceConnection(
        "https://hermes.pyth.network"
      );
      const priceFeedUpdateData = await connection.getPriceFeedsUpdateData([
        market.pythPriceId.toString(),
      ]);

      const resolveMarketTx = writeContractAsync({
        address: marketAddress,
        abi: marketAbi,
        functionName: "resolveMarket",
        args: [market.id, priceFeedUpdateData as any],
        value: parseEther("0.001"),
      });

      console.log("Transaction data", resolveMarketTx);
    } catch (err: any) {
      console.log("Transaction Failed: " + err.message);
    }
  };

  const handleClaimRewards = async () => {
    try {
      const claimRewardsTx = writeContractAsync({
        address: marketAddress,
        abi: marketAbi,
        functionName: "claimRewards",
        args: [market.id],
      });
    } catch (err: any) {
      console.log("Transaction Failed: " + err.message);
    }
  };

  const { isLoading: isBuyLoading, isSuccess: isBuySuccess } =
    useWaitForTransactionReceipt({
      hash: hash,
    });

  return (
    <div className="bg-white shadow-md rounded-lg p-6 text-black">
      <h3 className="text-xl font-semibold mb-2">{market.cryptoPair}</h3>
      <div className="">
        <div className="flex items-center justify-between">
          <p className="mb-2">
            Strike Price: {formatUnits(BigInt(market.strikePrice), 18)}
          </p>
          <p className="mb-4">
            End Time: {new Date(Number(market.endTime) * 1000).toLocaleString()}
          </p>
        </div>

        <div className="text-sm">
          <p>Total yes shares: {market.totalYesShares.toString()}</p>
          <p>Total No shares: {market.totalNoShares.toString()}</p>
          <button
            onClick={handleClaimRewards}
            className=" bg-red-500 hover:bg-red-600 text-white font-bold py-2 my-2 px-4 rounded disabled:bg-gray-400"
          >
            claim
          </button>
        </div>
      </div>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
        className="w-full p-2 mb-2 border rounded"
      />
      <select
        value={isYes ? "yes" : "no"}
        onChange={(e) => setIsYes(e.target.value === "yes")}
        className="w-full p-2 mb-4 border rounded"
      >
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </select>
      <button
        onClick={handleBuy}
        disabled={isBuyLoading}
        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400"
      >
        {isBuyLoading ? "Buying..." : "Buy Shares"}
      </button>

      {Date.now() > Number(market.endTime) * 1000 && (
        <button
          onClick={handleResolveMarket}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 my-2 px-4 rounded disabled:bg-gray-400"
        >
          Resolve Market
        </button>
      )}

      {isBuySuccess && <p className="mt-2 text-green-600">successful!</p>}
    </div>
  );
};

export default Market;
