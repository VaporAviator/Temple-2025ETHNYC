import { useState } from 'react'
import { usePrivy, useWallets } from '@privy-io/react-auth'

export default function PrivyPaymentHandler({ amount, currency, onSuccess, onError, children }) {
  const { authenticated } = usePrivy()
  const { wallets } = useWallets()
  const [isProcessing, setIsProcessing] = useState(false)
  
  // Get the first connected wallet
  const wallet = wallets[0]
  const address = wallet?.address
  const isConnected = authenticated && !!address

  // Wallet addresses for receiving payments
  const PAYMENT_ADDRESSES = {
    ETH: process.env.NEXT_PUBLIC_PAYMENT_ETH_ADDRESS || '0x29E8e6d80446A1b59309c9099cc5515f721a9049',
    SOL: process.env.NEXT_PUBLIC_PAYMENT_SOL_ADDRESS || '9pSuRtzVWbSHzCwAMdmT12BZGLK6pFv9hURxDrgACEXr',
    APT: process.env.NEXT_PUBLIC_PAYMENT_APT_ADDRESS || '0x1',
  }

  const handlePayment = async () => {
    if (!isConnected) {
      onError('Please connect your wallet first')
      return
    }

    if (!wallet) {
      onError('No wallet found')
      return
    }

    if (!amount || amount <= 0) {
      onError('Invalid amount')
      return
    }

    setIsProcessing(true)

    try {
      const toAddress = PAYMENT_ADDRESSES[currency]

      if (!toAddress) {
        throw new Error(`Unsupported currency: ${currency}`)
      }

      if (currency !== 'ETH') {
        throw new Error('Only ETH payments are supported for now')
      }

      console.log('Wallet info:', {
        address: wallet.address,
        type: wallet.walletClientType,
        connectorType: wallet.connectorType
      })

      // Convert amount to wei (ETH base unit)
      const ethAmount = parseFloat(amount)
      const weiAmount = Math.floor(ethAmount * 1e18).toString()
      const hexAmount = '0x' + parseInt(weiAmount).toString(16)

      // Create transaction object
      const transaction = {
        to: toAddress,
        value: hexAmount,
        from: address,
      }

      console.log('Sending transaction:', transaction)

      // Get provider and send transaction
      let txHash

      try {
        // Get the Ethereum provider from the wallet
        const provider = await wallet.getEthereumProvider()
        console.log('Provider obtained:', !!provider)

        // Send transaction
        txHash = await provider.request({
          method: 'eth_sendTransaction',
          params: [transaction]
        })
      } catch (providerError) {
        console.error('Provider method failed:', providerError)
        
        // Fallback: try direct methods if available
        if (typeof wallet.sendTransaction === 'function') {
          console.log('Trying wallet.sendTransaction fallback')
          txHash = await wallet.sendTransaction(transaction)
        } else if (typeof wallet.request === 'function') {
          console.log('Trying wallet.request fallback')
          txHash = await wallet.request({
            method: 'eth_sendTransaction',
            params: [transaction]
          })
        } else {
          throw new Error('No valid transaction method found on wallet')
        }
      }

      console.log('Transaction sent:', txHash)

      // Simple success callback - let the UI handle further processing
      setIsProcessing(false)
      onSuccess({
        txHash,
        amount,
        currency,
        address
      })
      
    } catch (error) {
      console.error('Payment failed:', error)
      setIsProcessing(false)
      onError(error.message || 'Payment failed')
    }
  }

  return (
    <div>
      {children({
        handlePayment,
        isProcessing,
        isConnected,
        address,
      })}
    </div>
  )
} 