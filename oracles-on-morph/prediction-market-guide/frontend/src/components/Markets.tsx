"use client";
import { useState, useEffect } from "react";
import {
  useAccount,
  useReadContract,
  useDisconnect,
  useWriteContract,
  useBalance,
} from "wagmi";
import Market from "./Market";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { marketAddress, marketAbi, tokenAbi, tokenAddress } from "../constants";
import { parseUnits } from "viem";

const Markets = () => {
  const { address, isConnected } = useAccount();
  const { open } = useWeb3Modal();
  const { disconnect } = useDisconnect();
  const [markets, setMarkets] = useState<Array<any>>([]);
  const [isCreatingMarket, setIsCreatingMarket] = useState(false);
  const [newMarket, setNewMarket] = useState({
    cryptoPair: "",
    strikePrice: "",
    endTime: "",
    resolutionTime: "",
    pythPriceId: "",
  });

  const { data: allMarkets, refetch: refetchMarkets } = useReadContract({
    address: marketAddress,
    abi: marketAbi,
    functionName: "getAllMarkets",
  });

  const { writeContractAsync } = useWriteContract();

  useEffect(() => {
    if (Array.isArray(allMarkets)) {
      const formattedMarkets = allMarkets.map((market: any, index: number) => ({
        id: index + 1,
        cryptoPair: market.cryptoPair,
        strikePrice: market.strikePrice,
        endTime: market.endTime,
        pythPriceId: market.pythPriceId,
        resolutionTime: market.resolutionTime,
        totalYesShares: market.totalYesShares,
        totalNoShares: market.totalNoShares,
        resolved: market.resolved,
        outcome: market.outcome,
      }));
      setMarkets(formattedMarkets);
      console.log("Fetched markets:", formattedMarkets);
    }
  }, [allMarkets]);

  const handleCreateMarket = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      console.log("Creating market with data:", newMarket);
      await writeContractAsync({
        address: marketAddress,
        abi: marketAbi,
        functionName: "createMarket",
        args: [
          newMarket.cryptoPair,
          parseUnits(newMarket.strikePrice, 18),
          BigInt(Math.floor(new Date(newMarket.endTime).getTime() / 1000)),
          BigInt(
            Math.floor(new Date(newMarket.resolutionTime).getTime() / 1000)
          ),
          newMarket.pythPriceId as `0x${string}`,
        ],
      });
      console.log("Market created successfully");
      setIsCreatingMarket(false);
      setNewMarket({
        cryptoPair: "",
        strikePrice: "",
        endTime: "",
        resolutionTime: "",
        pythPriceId: "",
      });
      refetchMarkets();
    } catch (error) {
      console.error("Error creating market:", error);
    }
  };

  // Get token balance
  const { data: tokenBalance } = useBalance({
    address,
    token: tokenAddress,
  });

  // Check token allowance
  const { data: tokenAllowance, refetch: refetchAllowance } = useReadContract({
    address: tokenAddress,
    abi: tokenAbi,
    functionName: "allowance",
    args: [address, marketAddress],
  }) as any;

  const handleApproveTokens = async () => {
    if (!isConnected) {
      open();
      return;
    }

    try {
      await writeContractAsync({
        address: tokenAddress,
        abi: tokenAbi,
        functionName: "approve",
        args: [marketAddress, parseUnits("1000000", 18)], // Approve a large amount
      });
      console.log("Token approval successful");
      refetchAllowance();
    } catch (error) {
      console.error("Error approving tokens:", error);
    }
  };

  const formatBalance = (balance: bigint, decimals: number) => {
    console.log("Raw balance:", balance.toString());
    console.log("Decimals:", decimals);

    return balance.toString();
  };

  console.log("Current markets state:", markets);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        {isConnected ? (
          <>
            <div>
              <p className="text-lg mb-2">
                Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
              </p>
              <p className="text-sm">
                Token Balance:{" "}
                {tokenBalance
                  ? formatBalance(tokenBalance.value, tokenBalance.decimals)
                  : "0"}{" "}
                {tokenBalance?.symbol}
              </p>
            </div>
            <div>
              {tokenAllowance !== undefined && Number(tokenAllowance) === 0 && (
                <button
                  onClick={handleApproveTokens}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded mr-4 transition duration-300"
                >
                  Approve Tokens
                </button>
              )}
              <button
                onClick={() => setIsCreatingMarket(true)}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mr-4 transition duration-300"
              >
                Create New Market
              </button>
              <button
                onClick={() => disconnect()}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300"
              >
                Disconnect
              </button>
            </div>
          </>
        ) : (
          <button
            onClick={() => open()}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
          >
            Connect Wallet
          </button>
        )}
      </div>

      <h2 className="text-3xl font-bold mb-6">Prediction Markets</h2>

      {markets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {markets.map((market) => (
            <Market key={market.id} market={market} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl mb-4">No active markets at the moment.</p>
          {isConnected && (
            <button
              onClick={() => setIsCreatingMarket(true)}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300"
            >
              Create a New Market
            </button>
          )}
        </div>
      )}

      {/* Modal for creating a new market */}
      {isCreatingMarket && (
        <div className="fixed inset-0 text-black bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4">Create New Market</h3>
            <form onSubmit={handleCreateMarket}>
              <input
                type="text"
                placeholder="Crypto Pair (e.g., BTC/USD)"
                value={newMarket.cryptoPair}
                onChange={(e) =>
                  setNewMarket({ ...newMarket, cryptoPair: e.target.value })
                }
                className="w-full p-2 mb-4 border rounded"
                required
              />
              <input
                type="number"
                placeholder="Strike Price"
                value={newMarket.strikePrice}
                onChange={(e) =>
                  setNewMarket({ ...newMarket, strikePrice: e.target.value })
                }
                className="w-full p-2 mb-4 border rounded"
                required
              />
              <input
                type="datetime-local"
                placeholder="End Time"
                value={newMarket.endTime}
                onChange={(e) =>
                  setNewMarket({ ...newMarket, endTime: e.target.value })
                }
                className="w-full p-2 mb-4 border rounded"
                required
              />
              <input
                type="datetime-local"
                placeholder="Resolution Time"
                value={newMarket.resolutionTime}
                onChange={(e) =>
                  setNewMarket({ ...newMarket, resolutionTime: e.target.value })
                }
                className="w-full p-2 mb-4 border rounded"
                required
              />
              <input
                type="text"
                placeholder="Pyth Price ID"
                value={newMarket.pythPriceId}
                onChange={(e) =>
                  setNewMarket({ ...newMarket, pythPriceId: e.target.value })
                }
                className="w-full p-2 mb-4 border rounded"
                required
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsCreatingMarket(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mr-2 transition duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300"
                >
                  Create Market
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Markets;
