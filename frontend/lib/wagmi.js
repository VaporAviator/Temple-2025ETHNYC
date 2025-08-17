import { http, createConfig } from 'wagmi'
import { mainnet, polygon, optimism, arbitrum, base } from 'wagmi/chains'
import { injected, metaMask } from 'wagmi/connectors'

export const config = createConfig({
  chains: [mainnet, polygon, optimism, arbitrum, base],
  connectors: [
    injected(),
    metaMask(),
  ],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [optimism.id]: http(),
    [arbitrum.id]: http(),
    [base.id]: http(),
  },
})