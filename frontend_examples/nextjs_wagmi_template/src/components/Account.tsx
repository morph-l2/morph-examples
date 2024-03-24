import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi'
import Image from 'next/image'

export function Account() {
  const { address } = useAccount()
  const { disconnect } = useDisconnect()
  const { data: ensName } = useEnsName({ address })
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! })

  return (
    <div>
      {address && <p>{address}</p>}
      <button className='bg-blue-500 text-white font-bold py-2 px-4 rounded-full hover:bg-blue-700 mb-4' onClick={() => disconnect()}>Disconnect</button>
    </div>
  )
}