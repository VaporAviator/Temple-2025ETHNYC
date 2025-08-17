import { useRouter } from 'next/router'
import { useState } from 'react'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import PaymentOptionsWidget from '../components/PaymentOptionsWidget'
import WalletButton from '../components/WalletButton'
import DebugWallet from '../components/DebugWallet'

export default function SuanGua5() {
  const { t } = useTranslation('common')
  const router = useRouter()
  const { question, numbers, divinationData } = router.query
  const [customAmount, setCustomAmount] = useState('')
  const [selectedCurrency, setSelectedCurrency] = useState('ETH')
  const [selectedAmount, setSelectedAmount] = useState(null)
  const [paymentError, setPaymentError] = useState('')
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  const handlePaymentSuccess = (paymentData) => {
    setPaymentSuccess(true)
    setPaymentError('')
    
    console.log('Payment successful:', paymentData)
    
    // Navigate to next page with payment confirmation
    router.push({
      pathname: '/suangua6',
      query: {
        question: question,
        numbers: numbers,
        paid: 'true',
        amount: paymentData.amount,
        currency: paymentData.currency,
        method: paymentData.method,
        txHash: paymentData.txHash || paymentData.sessionId,
        divinationData: divinationData
      }
    })
  }

  const handlePaymentError = (error) => {
    setPaymentError(error)
    setPaymentSuccess(false)
  }

  const handleBack = () => {
    router.back()
  }

  const presetAmounts = [0.001, 0.005, 0.01] // More realistic amounts for ETH

  const handlePresetSelect = (amount) => {
    setSelectedAmount(amount)
    setCustomAmount('')
  }

  const handleCustomAmountChange = (e) => {
    setCustomAmount(e.target.value)
    setSelectedAmount(null)
  }

  return (
    <div className="suangua5-container">
      <DebugWallet />
      {/* 顶部导航 */}
      <div className="top-header">
        <div className="back-arrow" onClick={handleBack}>←</div>
        <div className="page-title">{t('divination')}</div>
      </div>
      
      {/* 蓝色葫芦图 */}
      <div className="blue-gourd-section">
        <div className="blue-gourd-image"></div>
      </div>
      
      {/* 支付说明 */}
      <div className="payment-description">
        {t('chooseAnyCurrency')}
      </div>
      
      {/* 支付内容 */}
      <div className="payment-content">
        {/* 自定义金额输入 */}
        <div className="custom-amount-section">
          <input
            type="number"
            value={customAmount}
            onChange={handleCustomAmountChange}
            placeholder={t('enterAmount')}
            className="amount-input"
            step="0.01"
            min="0.01"
          />
          
          {/* 币种选择器 */}
          <div className="currency-selector">
            <select 
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="currency-dropdown"
            >
              <option value="ETH">ETH</option>
              <option value="SOL">SOL (Coming Soon)</option>
              <option value="APT">APT (Coming Soon)</option>
            </select>
            <div className="dropdown-arrow">▼</div>
          </div>
        </div>
        
        {/* 预设金额按钮 */}
        <div className="preset-amounts">
          {presetAmounts.map((amount) => (
            <button 
              key={amount}
              onClick={() => handlePresetSelect(amount)}
              className={`preset-button ${selectedAmount === amount ? 'selected' : ''}`}
            >
              {amount} {selectedCurrency}
            </button>
          ))}
        </div>
        
        {/* Wallet Connection */}
        <div className="wallet-connection">
          <WalletButton />
        </div>

        {/* Payment Error */}
        {paymentError && (
          <div className="payment-error">
            {paymentError}
          </div>
        )}

        {/* Payment Options */}
        <PaymentOptionsWidget
          amount={selectedAmount || parseFloat(customAmount)}
          currency={selectedCurrency}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
        />
      </div>
    </div>
  )
}

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  }
}