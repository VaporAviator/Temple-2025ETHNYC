import { useState } from 'react'
import { useTranslation } from 'next-i18next'
import PrivyPaymentHandler from './PrivyPaymentHandler'
import OnrampWidget from './OnrampWidget'

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

  const handleOnrampSuccess = (rampData) => {
    setIsProcessing(false)
    onSuccess({
      ...rampData,
      method: 'fiat',
      message: 'Crypto purchased successfully! Please wait for confirmation.'
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

          <button
            className={`method-button ${paymentMethod === 'fiat' ? 'active' : ''}`}
            onClick={() => setPaymentMethod('fiat')}
          >
            <div className="method-icon">💳</div>
            <div className="method-info">
              <div className="method-name">Buy with Fiat</div>
              <div className="method-desc">Credit card, bank transfer</div>
            </div>
          </button>
        </div>
      </div>

      {/* Payment Interface */}
      <div className="payment-interface">
        {paymentMethod === 'crypto' ? (
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
        ) : (
          <OnrampWidget
            onSuccess={handleOnrampSuccess}
            onError={handleError}
          >
            {({ startOnramp, isLoading: onrampLoading, isConnected }) => (
              <div className="fiat-payment">
                <div className="payment-info">
                  <p>Buy {amount} {currency} with fiat currency</p>
                  <p className="fiat-note">Funds will be added to your wallet</p>
                </div>
                <button 
                  onClick={() => startOnramp(amount, currency)}
                  disabled={onrampLoading || !isConnected || !amount}
                  className="payment-button fiat-button"
                >
                  {!isConnected 
                    ? 'Connect Wallet First'
                    : onrampLoading 
                      ? 'Opening Coinbase...' 
                      : `Buy ${amount} ${currency}`
                  }
                </button>
              </div>
            )}
          </OnrampWidget>
        )}
      </div>
    </div>
  )
}