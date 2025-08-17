import { useState } from 'react'
import { useTranslation } from 'next-i18next'
import PrivyPaymentHandler from './PrivyPaymentHandler'

export default function PaymentOptionsWidget({ 
  amount, 
  currency, 
  onSuccess, 
  onError 
}) {
  const { t } = useTranslation('common')
  const [paymentMethod, setPaymentMethod] = useState('crypto') // 'crypto' or 'fiat'
  const [isProcessing, setIsProcessing] = useState(false)

  const handleCryptoSuccess = (paymentData) => {
    setIsProcessing(false)
    onSuccess({
      ...paymentData,
      method: 'crypto'
    })
  }

  const handleError = (error) => {
    setIsProcessing(false)
    onError(error)
  }

  return (
    <div className="payment-options-widget">
      {/* Payment Method Selector */}
      <div className="payment-method-selector">
        <h3 className="payment-title">Choose Payment Method</h3>
        
        <div className="method-buttons">
          <button
            className={`method-button ${paymentMethod === 'crypto' ? 'active' : ''}`}
            onClick={() => setPaymentMethod('crypto')}
          >
            <div className="method-icon">💰</div>
            <div className="method-info">
              <div className="method-name">Pay with Crypto</div>
              <div className="method-desc">Use existing ETH balance</div>
            </div>
          </button>
        </div>
      </div>

      {/* Payment Interface */}
      <div className="payment-interface">
        {paymentMethod === 'crypto' && (
          <PrivyPaymentHandler
            amount={amount}
            currency={currency}
            onSuccess={handleCryptoSuccess}
            onError={handleError}
          >
            {({ handlePayment, isProcessing: cryptoProcessing, isConnected }) => (
              <div className="crypto-payment">
                <div className="payment-info">
                  <p>Pay {amount} {currency} from your wallet</p>
                </div>
                <button 
                  onClick={handlePayment}
                  disabled={cryptoProcessing || !isConnected || !amount}
                  className="payment-button crypto-button"
                >
                  {!isConnected 
                    ? 'Connect Wallet First'
                    : cryptoProcessing 
                      ? 'Processing...' 
                      : `Pay ${amount} ${currency}`
                  }
                </button>
              </div>
            )}
          </PrivyPaymentHandler>
        )}
      </div>
    </div>
  )
} 