import { http, createConfig } from 'wagmi'
import { morphSepolia } from 'wagmi/chains'
import { injected, metaMask } from 'wagmi/connectors'

export const config = createConfig({
  chains: [morphSepolia],
  connectors: [
    metaMask(),
  ],
  transports: {
    [morphSepolia.id]: http(),
  },
})