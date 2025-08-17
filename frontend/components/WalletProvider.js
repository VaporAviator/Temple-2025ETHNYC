import { PrivyProvider } from '@privy-io/react-auth'
import { privyConfig } from '../lib/privy'

export default function WalletProvider({ children }) {
  return (
    <PrivyProvider
      appId={privyConfig.appId}
      config={privyConfig.config}
    >
      {children}
    </PrivyProvider>
  )
}