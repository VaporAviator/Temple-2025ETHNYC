import { useState } from 'react'
import { usePrivy, useWallets } from '@privy-io/react-auth'

export default function OnrampWidget({ onSuccess, onError, children }) {
  const { authenticated } = usePrivy()
  const { wallets } = useWallets()
  const [isLoading, setIsLoading] = useState(false)
  const [rampWindow, setRampWindow] = useState(null)
  
  const wallet = wallets[0]
  const address = wallet?.address
  const isConnected = authenticated && !!address

  const startOnramp = async (amount, asset = 'ETH') => {
    if (!isConnected) {
      onError('Please connect your wallet first')
      return
    }

    setIsLoading(true)

    try {
      console.log('Starting onramp for:', { address, amount, asset })

      // Call our API to create onramp session
      const response = await fetch('/api/ramp/onramp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: address,
          amount: amount,
          asset: asset,
        }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message || 'Failed to create onramp session')
      }

      console.log('Onramp session created:', data)

      // Open Coinbase onramp in a popup
      const popup = window.open(
        data.url,
        'coinbase-onramp',
        'width=500,height=700,scrollbars=yes,resizable=yes'
      )

      setRampWindow(popup)

      // Listen for popup to close or completion
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed)
          setIsLoading(false)
          setRampWindow(null)
          
          // Assume success when popup closes
          // In production, you might want to verify the transaction
          onSuccess({
            sessionId: data.session_id,
            amount,
            asset,
            address,
          })
        }
      }, 1000)

      // Listen for messages from popup (if Coinbase supports it)
      const messageListener = (event) => {
        if (event.origin !== 'https://pay.coinbase.com') return
        
        if (event.data.type === 'onramp_success') {
          clearInterval(checkClosed)
          popup.close()
          setIsLoading(false)
          setRampWindow(null)
          window.removeEventListener('message', messageListener)
          
          onSuccess({
            sessionId: data.session_id,
            transaction: event.data.transaction,
            amount,
            asset,
            address,
          })
        } else if (event.data.type === 'onramp_error') {
          clearInterval(checkClosed)
          popup.close()
          setIsLoading(false)
          setRampWindow(null)
          window.removeEventListener('message', messageListener)
          
          onError(event.data.error || 'Onramp failed')
        }
      }

      window.addEventListener('message', messageListener)

    } catch (error) {
      console.error('Onramp error:', error)
      setIsLoading(false)
      onError(error.message || 'Failed to start onramp')
    }
  }

  const cancelOnramp = () => {
    if (rampWindow) {
      rampWindow.close()
      setRampWindow(null)
      setIsLoading(false)
    }
  }

  return (
    <div>
      {children({
        startOnramp,
        cancelOnramp,
        isLoading,
        isConnected,
        address,
      })}
    </div>
  )
}