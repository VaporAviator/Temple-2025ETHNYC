import { useState } from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export default function SuanGua2() {
  const { t } = useTranslation('common')
  const router = useRouter()
  const { question } = router.query
  const [numbers, setNumbers] = useState(['', '', ''])

  const handleNumberChange = (index, value) => {
    if (value === '' || (value >= 0 && value <= 99 && !isNaN(value))) {
      const newNumbers = [...numbers]
      newNumbers[index] = value
      setNumbers(newNumbers)
    }
  }

  const handleNext = () => {
    const validNumbers = numbers.filter(num => num !== '' && num >= 0 && num <= 99)
    if (validNumbers.length === 3) {
      router.push({
        pathname: '/suangua3',
        query: { 
          question: question,
          numbers: numbers.join(',')
        }
      })
    }
  }

  const handleBack = () => {
    router.back()
  }

  const handleModify = () => {
    router.back()
  }

  return (
    <div className="suangua2-container">
      {/* 顶部导航 */}
      <div className="top-header">
        <div className="back-arrow" onClick={handleBack}>←</div>
        <div className="page-title">{t('divination')}</div>
      </div>
      
      {/* 主要内容区域 */}
      <div className="main-content">
        {/* 蓝色葫芦 */}
        <div className="blue-gourd-image"></div>
        
        {/* 神算区域 */}
        <div className="divination-section">
          {/* 小六壬神算 */}
          <div className="divination-title">{t('liuren')}</div>
          
          {/* 输入区域 */}
          <div className="input-area">
            {/* 说明文字 */}
            <div className="instruction-text">{t('enterNumbers')}</div>
            
            {/* 三个输入框 */}
            <div className="number-inputs">
              <div className="number-input-wrapper">
                <input
                  type="number"
                  min="0"
                  max="99"
                  value={numbers[0]}
                  onChange={(e) => handleNumberChange(0, e.target.value)}
                  placeholder="0-99"
                  className="number-input"
                />
              </div>
              
              <div className="number-input-wrapper">
                <input
                  type="number"
                  min="0"
                  max="99"
                  value={numbers[1]}
                  onChange={(e) => handleNumberChange(1, e.target.value)}
                  placeholder="0-99"
                  className="number-input"
                />
              </div>
              
              <div className="number-input-wrapper">
                <input
                  type="number"
                  min="0"
                  max="99"
                  value={numbers[2]}
                  onChange={(e) => handleNumberChange(2, e.target.value)}
                  placeholder="0-99"
                  className="number-input"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* 按钮区域 */}
        <div className="button-section">
          {/* 下一步按钮 */}
          <button onClick={handleNext} className="next-button">
            <span>{t('next')}</span>
          </button>
          
          {/* 修改原题按钮 */}
          <button onClick={handleModify} className="modify-button">
            <span>{t('editWish')}</span>
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