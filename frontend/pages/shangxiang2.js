import { useRouter } from 'next/router'
import { useState } from 'react'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export default function ShangXiang2() {
  const { t } = useTranslation('common')
  const router = useRouter()
  const { wish } = router.query
  const [selectedToken, setSelectedToken] = useState('USDC')
  const [selectedAmount, setSelectedAmount] = useState(1)

  const handleBack = () => {
    router.back()
  }

  const handleNext = () => {
    router.push({
      pathname: '/shangxiang3',
      query: { 
        wish: wish,
        token: selectedToken,
        amount: String(selectedAmount)
      }
    })
  }

  return (
    <div className="shangxiang2-container">
      {/* 上香顶部 */}
      <div className="shangxiang2-top-header">
        <div className="shangxiang2-back-arrow" onClick={handleBack}>←</div>
        <div className="shangxiang2-page-title">{t('blessing')}</div>
      </div>
      
      {/* Frame 2085662510 - 主要内容框架 */}
      <div className="frame-2085662510">
        {/* Frame 2085662509 */}
        <div className="frame-2085662509">
          {/* Frame 2085662508 */}
          <div className="frame-2085662508">
            {/* Frame 45 - 愿望显示区域 */}
            <div className="frame-45">
              {/* 我的提问 - 隐藏 */}
              <div className="my-question-title" style={{display: 'none'}}>我的提问</div>
              
              {/* 我想接下来的一个月好运不断! - 用户愿望 */}
              <div className="user-wish-display">
                {wish || '我想接下来的一个月好运不断!'}
              </div>
            </div>
            
            {/* 紫色花篮 */}
            <div className="shangxiang2-purple-flower-basket"></div>
          </div>
          
          {/* 支付 */}
          <div className="payment-section">
            {/* 选择神圣代币与供奉数量 */}
            <div className="payment-instruction">{t('chooseOffering')}</div>
            
            {/* Frame 37 - 支付选项容器 */}
            <div className="frame-37">
              {/* 币种选择下拉框 */}
              <div className="currency-selector-frame">
                <select
                  className="currency-select"
                  value={selectedToken}
                  onChange={(e) => setSelectedToken(e.target.value)}
                  aria-label={t('selectTokenType')}
                >
                  <option value="USDC">USDC</option>
                </select>
              </div>
              
              {/* Amount buttons row */}
              <div className="amount-buttons-row">
                {/* 1U */}
                <button 
                  className={`amount-option ${selectedAmount === 1 ? 'selected' : ''}`}
                  onClick={() => setSelectedAmount(1)}
                >
                  <span>1U</span>
                </button>
                
                {/* 5U */}
                <button 
                  className={`amount-option ${selectedAmount === 5 ? 'selected' : ''}`}
                  onClick={() => setSelectedAmount(5)}
                >
                  <span>5U</span>
                </button>
                
                {/* 10U */}
                <button 
                  className={`amount-option ${selectedAmount === 10 ? 'selected' : ''}`}
                  onClick={() => setSelectedAmount(10)}
                >
                  <span>10U</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* 按钮 */}
        <div className="shangxiang2-button-section">
          {/* 普通状态 - 下一步按钮 */}
          <button className="shangxiang2-next-button" onClick={handleNext}>
            <span>{t('makeOffering')}</span>
          </button>
        </div>
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
