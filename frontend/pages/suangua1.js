import { useState } from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export default function SuanGua1() {
  const { t } = useTranslation('common')
  const router = useRouter()
  const [question, setQuestion] = useState('')

  const handleNext = () => {
    if (question.trim()) {
      router.push({
        pathname: '/suangua2',
        query: { question: question }
      })
    }
  }

  const handleBack = () => {
    router.push('/')
  }

  return (
    <div className="suangua1-container">
      {/* 隐藏的图片 */}
      <div className="hidden-image" />
      
      {/* 顶部导航 */}
      <div className="top-header">
        <div className="back-arrow" onClick={handleBack}>←</div>
        <div className="page-title">{t('divination')}</div>
      </div>
      
      {/* 主要内容区域 */}
      <div className="main-content">
        {/* 蓝色葫芦 */}
        <div className="blue-gourd-image"></div>
        
        {/* 你想算什么？ */}
        <div className="question-title">{t('whatToAsk')}</div>
        
        {/* 输入和按钮区域 */}
        <div className="input-section">
          {/* 输入框 */}
          <div className="input-container">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={t('placeholder_career')}
              className="question-input"
            />
          </div>
          
          {/* 下一步按钮 */}
          <button onClick={handleNext} className="next-button">
            <span>{t('next')}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  }
}