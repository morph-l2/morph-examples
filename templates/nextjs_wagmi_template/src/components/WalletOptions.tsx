import * as React from 'react'
import { Connector, useConnect } from 'wagmi'

export function WalletOptions() {
  const { connectors, connect, status } = useConnect()
  console.log(connectors)
  const connector = connectors[0]
  console.log({status})
  return (
    <button className='bg-blue-500 text-white font-bold py-2 px-4 rounded-full hover:bg-blue-700 mb-4' onClick={() => connect({ connector })}>
      Connect Wallet
    </button>
  )
}