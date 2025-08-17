import { useRouter } from 'next/router'
import { useState } from 'react'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export default function SuanGua5() {
  const { t } = useTranslation('common')
  const router = useRouter()
  const { question, numbers, divinationData } = router.query
  const [customAmount, setCustomAmount] = useState('')
  const [selectedCurrency, setSelectedCurrency] = useState('USDC')
  const [selectedAmount, setSelectedAmount] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePay = async () => {
    const amount = selectedAmount || parseFloat(customAmount)
    if (!amount || amount <= 0) {
      alert(t('invalidAmount'))
      return
    }

    setIsProcessing(true)
    
    // 模拟支付处理
    setTimeout(() => {
      setIsProcessing(false)
      router.push({
        pathname: '/suangua6',
        query: {
          question: question,
          numbers: numbers,
          paid: 'true',
          amount: amount,
          currency: selectedCurrency,
          divinationData: divinationData // 传递占卜数据到下一页
        }
      })
    }, 2000)
  }

  const handleBack = () => {
    router.back()
  }

  const presetAmounts = [1, 5, 10]

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
              <option value="USDC">USDC</option>
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
        
        {/* 继续解锁按钮 */}
        <button 
          onClick={handlePay}
          disabled={isProcessing}
          className="continue-button"
        >
          <span>{isProcessing ? t('processing') : t('continueToUnlock')}</span>
        </button>
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