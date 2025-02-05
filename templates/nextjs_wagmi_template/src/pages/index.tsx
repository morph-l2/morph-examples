import Image from "next/image";
import { Inter } from "next/font/google";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { Account } from "@/components/Account";
import { WalletOptions } from "@/components/WalletOptions";
import { useEffect, useState } from "react";
import abi from "@/abi.json"

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [ hasMounted, setHasMounted ] = useState(false)
  const [ count, setCount ] = useState("")
  const { isConnected } = useAccount()

  const { data: hash, writeContract } = useWriteContract();

  const { data: currentCount, refetch } = useReadContract({
    abi,
    address: "0x507ed41Fe033dc8f33DbA5A4D0BE2c75b97Fec58",
    functionName: "number",
  })

  const { isLoading, isSuccess } = 
    useWaitForTransactionReceipt({ 
      hash, 
    }) 

  async function increment () {
    writeContract({
      abi,
      address: "0x507ed41Fe033dc8f33DbA5A4D0BE2c75b97Fec58",
      functionName: "increment",
    })
  }

  useEffect(() => {
    setHasMounted(true);
  },[])


  useEffect(() => {
    if (isSuccess) refetch()
    console.log({ currentCount })
    setCount(String(currentCount))
  },[currentCount, isSuccess, refetch])
  

  if(!hasMounted) return null

  function ConnectWallet() {
    if (isConnected) return <Account />
    return <WalletOptions />
  }

  return (
    <main
      className={`flex min-h-screen flex-col items-center p-24 ${inter.className}`}
    >
      <ConnectWallet />
      <p>Current Count: {count} </p>
      {isLoading && <p>Updating Count...</p>}
      { isConnected && <button className='bg-blue-500 text-white font-bold py-2 px-4 rounded-full hover:bg-blue-700 mb-4' onClick={increment}>Increment</button> }
    </main>
  );
}
