import { usePrivy, useWallets } from '@privy-io/react-auth'

export default function DebugWallet() {
  const { authenticated, ready, user } = usePrivy()
  const { wallets } = useWallets()
  
  const wallet = wallets[0]

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'white', 
      border: '1px solid #ccc', 
      padding: '10px', 
      fontSize: '12px',
      maxWidth: '300px',
      zIndex: 9999
    }}>
      <h4>Debug Info:</h4>
      <div><strong>Privy Ready:</strong> {ready ? 'Yes' : 'No'}</div>
      <div><strong>Authenticated:</strong> {authenticated ? 'Yes' : 'No'}</div>
      <div><strong>User Email:</strong> {user?.email?.address || 'None'}</div>
      <div><strong>Wallets Count:</strong> {wallets.length}</div>
      <div><strong>Wallet Address:</strong> {wallet?.address || 'None'}</div>
      <div><strong>Wallet Type:</strong> {wallet?.walletClientType || 'None'}</div>
    </div>
  )
} 