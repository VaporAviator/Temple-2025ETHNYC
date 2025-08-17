export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { walletAddress, amount, asset = 'ETH' } = req.body

    if (!walletAddress || !amount) {
      return res.status(400).json({ 
        success: false,
        message: 'Wallet address and amount are required' 
      })
    }

    console.log('Creating Coinbase One-Click-Buy URL:', {
      walletAddress,
      amount,
      asset,
      cdpConfigured: !!(process.env.CDP_API_KEY_ID && process.env.CDP_API_KEY_SECRET)
    })

    // Create One-Click-Buy URL using Coinbase's required parameters
    // Format addresses as comma-separated string with network suffix
    const addressesParam = `${walletAddress}:ethereum`
    
    const onrampParams = new URLSearchParams({
      // Required: App ID (Project ID) from CDP
      appId: 'ae900d6b-6ec8-4b24-9a66-7fdbedbfae31',
      
      // Required: Destination addresses - format as address:network
      addresses: addressesParam,
      
      // Asset to purchase
      defaultAsset: asset,
      
      // Fiat amount preset
      presetFiatAmount: amount,
      fiatCurrency: 'USD',
      
      // Additional parameters for better UX
      defaultPaymentMethod: 'card',
      defaultNetwork: 'ethereum-mainnet',
    })

    // Generate the One-Click-Buy URL
    const onrampUrl = `https://pay.coinbase.com/buy?${onrampParams.toString()}`

    // Create response with the direct URL
    const responseData = {
      session_id: `onramp_${Date.now()}`,
      url: onrampUrl,
      quote: {
        purchase_currency: asset,
        payment_currency: 'USD',
        payment_amount: amount,
        destination_address: walletAddress,
        estimated_fees: (parseFloat(amount) * 0.025).toFixed(2), // ~2.5% typical Coinbase fee
        total_fiat_amount: (parseFloat(amount) * 1.025).toFixed(2)
      }
    }

    console.log('Generated Coinbase URL:', onrampUrl)

    res.status(200).json({
      success: true,
      session_id: responseData.session_id,
      url: responseData.url,
      quote: responseData.quote,
    })

  } catch (error) {
    console.error('Onramp URL generation error:', error)
    
    res.status(500).json({ 
      success: false, 
      message: 'Failed to generate onramp URL',
      error: error.message 
    })
  }
}