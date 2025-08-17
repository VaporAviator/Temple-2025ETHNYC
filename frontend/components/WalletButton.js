import { usePrivy, useWallets } from '@privy-io/react-auth'
import { useState } from 'react'

export default function WalletButton() {
  const { ready, authenticated, user, login, logout } = usePrivy()
  const { wallets } = useWallets()
  const [showDropdown, setShowDropdown] = useState(false)
  
  // Get the first connected wallet
  const wallet = wallets[0]
  const address = wallet?.address

  const formatAddress = (addr) => {
    if (!addr) return ''
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  // Don't render until Privy is ready
  if (!ready) {
    return (
      <button className="header-btn" disabled>
        Loading...
      </button>
    )
  }

  if (authenticated && address) {
    return (
      <div style={{ position: 'relative' }}>
        <button 
          className="header-btn"
          onClick={() => setShowDropdown(!showDropdown)}
          style={{ backgroundColor: '#28a745', color: 'white' }}
        >
          {formatAddress(address)}
        </button>
        {showDropdown && (
          <div style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            backgroundColor: 'white',
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '10px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            zIndex: 1000,
            minWidth: '180px'
          }}>
            <div style={{ 
              fontSize: '12px', 
              color: '#666', 
              marginBottom: '8px',
              wordBreak: 'break-all'
            }}>
              {address}
            </div>
            {user?.email && (
              <div style={{ 
                fontSize: '12px', 
                color: '#666', 
                marginBottom: '10px'
              }}>
                {user.email.address}
              </div>
            )}
            <button
              onClick={() => {
                logout()
                setShowDropdown(false)
              }}
              style={{
                width: '100%',
                padding: '8px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              断开连接
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <button 
      className="header-btn"
      onClick={login}
      style={{
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        padding: '8px 16px',
        cursor: 'pointer',
        fontSize: '14px'
      }}
    >
      连接钱包
    </button>
  )
}