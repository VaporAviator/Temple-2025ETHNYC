import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { callDivinationAPI, parseHexagramElements, getDisplayLuckLabel, getLanguage, getDisplayElementLabel } from '../utils/api'

export default function SuanGua4() {
  const { t } = useTranslation('common')
  const router = useRouter()
  const { question, numbers } = router.query
  const [divinationResult, setDivinationResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchDivination() {
      if (!question || !numbers) return
      
      try {
        setLoading(true)
        setError(null)
        
        // 解析数字字符串
        const numbersArray = numbers.split(',').map(n => parseInt(n))
        
        // 调用后端API
        const result = await callDivinationAPI(question, numbersArray)
        
        if (result.success) {
          // 解析卦象元素
          const elements = parseHexagramElements(result)
          
          setDivinationResult({
            fortune: getDisplayLuckLabel(result.luck_text, result.luck),
            elements: elements,
            apiResult: result
          })
        } else {
          setError(result.error || t('divinationFailed'))
        }
      } catch (err) {
        console.error('获取占卜结果失败:', err)
        setError(t('getDivinationFailed'))
      } finally {
        setLoading(false)
      }
    }

    fetchDivination()
  }, [question, numbers])

  const handleNext = () => {
    router.push({
      pathname: '/suangua5',
      query: {
        question: question,
        numbers: numbers,
        divinationData: divinationResult ? JSON.stringify(divinationResult.apiResult) : null
      }
    })
  }

  const handleBack = () => {
    router.back()
  }

  // 获取五行元素的背景渐变色
  const getElementGradient = (element) => {
    switch (element) {
      case '火':
        return 'linear-gradient(180deg, rgba(255, 153, 109, 0.3) 0%, rgba(255, 255, 255, 0.3) 100%)'
      case '金':
        return 'linear-gradient(180deg, rgba(165, 165, 165, 0.3) 0%, rgba(255, 255, 255, 0.3) 100%)'
      case '水':
        return 'linear-gradient(180deg, rgba(136, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.3) 100%)'
      case '木':
        return 'linear-gradient(180deg, rgba(144, 238, 144, 0.3) 0%, rgba(255, 255, 255, 0.3) 100%)'
      case '土':
        return 'linear-gradient(180deg, rgba(222, 184, 135, 0.3) 0%, rgba(255, 255, 255, 0.3) 100%)'
      default:
        return 'linear-gradient(180deg, rgba(165, 165, 165, 0.3) 0%, rgba(255, 255, 255, 0.3) 100%)'
    }
  }

  // 显示加载状态
  if (loading) {
    return (
      <div className="suangua4-container">
        <div className="top-header">
          <div className="back-arrow" onClick={handleBack}>←</div>
          <div className="page-title">{t('divination')}</div>
        </div>
        <div className="result-content">
          <div className="loading-message">{t('interpretingDivination')}</div>
        </div>
      </div>
    )
  }

  // 显示错误状态
  if (error) {
    return (
      <div className="suangua4-container">
        <div className="top-header">
          <div className="back-arrow" onClick={handleBack}>←</div>
          <div className="page-title">{t('divination')}</div>
        </div>
        <div className="result-content">
          <div className="error-message">{error}</div>
          <button onClick={() => window.location.reload()} className="retry-button">
            {t('retryDivination')}
          </button>
        </div>
      </div>
    )
  }

  // 没有结果时的占位符
  if (!divinationResult) {
    return (
      <div className="suangua4-container">
        <div className="top-header">
          <div className="back-arrow" onClick={handleBack}>←</div>
          <div className="page-title">{t('divination')}</div>
        </div>
        <div className="result-content">
          <div className="no-result-message">{t('noDivinationResult')}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="suangua4-container">
      {/* 顶部导航 */}
      <div className="top-header">
        <div className="back-arrow" onClick={handleBack}>←</div>
        <div className="page-title">{t('divination')}</div>
      </div>
      
      {/* 主要内容区域 */}
      <div className="result-content">
        <div className="result-wrapper">
          {/* 问题标题 */}
          <div className="question-title">
            {question || t('placeholder_career')}
          </div>
          
          {/* 结果卡片 */}
          <div className="result-card">
            {/* 结果详情 */}
            <div className="result-details">
              {/* 占卜结果标题 */}
              <div className="fortune-section">
                <div className="fortune-title">{divinationResult.fortune}</div>
                
                {/* 三个元素 */}
                <div className="elements-row">
                  {divinationResult.elements.map((item, index) => {
                    const lang = getLanguage()
                    const nameLabel = lang === 'en' ? (item.pinyin || item.name) : item.name
                    const elementLabel = getDisplayElementLabel(item.element)
                    return (
                    <div 
                      key={index} 
                      className="element-card"
                      style={{ 
                        background: getElementGradient(item.element),
                        border: '1px solid rgba(0, 0, 0, 0.15)',
                        backdropFilter: 'blur(15px)'
                      }}
                    >
                      <div 
                        className="element-text"
                        style={{ color: item.color }}
                      >
                        {nameLabel}（{elementLabel}）
                      </div>
                    </div>
                  )})}
                </div>
              </div>
              
              {/* 模糊的详细内容区域 - 显示简短的AI结果预览 */}
              <div className="detailed-content">
                <div className="blur-overlay">
                  <div className="blur-text">
                    {(
                      divinationResult.apiResult?.full_text ||
                      divinationResult.apiResult?.divination ||
                      ''
                    ).substring(0, 80) || t('noDivinationResult')}...
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 解锁按钮 */}
        <div className="unlock-section">
          <button onClick={handleNext} className="unlock-button">
            <span>{t('unlockCompleteHexagram')}</span>
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
