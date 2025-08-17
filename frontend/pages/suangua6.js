import { useRouter } from 'next/router'
import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { callDivinationAPI, parseHexagramElements, getDisplayLuckLabel, getLanguage, getLuckLevel, getDisplayElementLabel } from '../utils/api'

export default function SuanGua6() {
  const { t } = useTranslation('common')
  const router = useRouter()
  const { question, numbers, paid, amount, currency, divinationData } = router.query
  const [divinationResult, setDivinationResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const scrollRef = useRef(null)

  useEffect(() => {
    async function loadDivinationResult() {
      try {
        setLoading(true)
        setError(null)

        // 首先尝试从路由参数中获取预存的数据
        if (divinationData) {
          const savedResult = JSON.parse(divinationData)
          const elements = parseHexagramElements(savedResult)
          
          setDivinationResult({
            fortune: getDisplayLuckLabel(savedResult.luck_text, savedResult.luck),
            elements: elements,
            detailedAnalysis: savedResult.full_text || `${savedResult.divination}\n\n${savedResult.prediction}\n\n${savedResult.advice}`,
            apiResult: savedResult
          })
        } 
        // 如果没有预存数据且用户已付费，重新调用API
        else if (question && numbers && paid === 'true') {
          const numbersArray = numbers.split(',').map(n => parseInt(n))
          const result = await callDivinationAPI(question, numbersArray)
          
          if (result.success) {
            const elements = parseHexagramElements(result)
            
            setDivinationResult({
              fortune: getDisplayLuckLabel(result.luck_text, result.luck),
              elements: elements,
              detailedAnalysis: result.full_text || `${result.divination}\n\n${result.prediction}\n\n${result.advice}`,
              apiResult: result
            })
            // 确保滚动容器回到顶部，避免初始显示到中间
            setTimeout(() => {
              if (scrollRef.current) scrollRef.current.scrollTop = 0
            }, 0)
          } else {
            setError(result.error || t('getDivinationFailed'))
          }
        } else {
          setError(t('missingDataOrNotPaid'))
        }
      } catch (err) {
        console.error('加载占卜结果失败:', err)
        setError(t('loadDivinationFailed'))
      } finally {
        setLoading(false)
      }
    }

    loadDivinationResult()
  }, [question, numbers, paid, amount, currency, divinationData])

  const handleBack = () => {
    router.back()
  }

  const handleShareToX = () => {
    const shareText = `我在Temple寺庙算卦得到"${divinationResult.fortune}"的卦象结果！快来试试你的运势吧！`
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`
    window.open(url, '_blank')
  }

  const handleShareToAddress = () => {
    alert(t('shareFunction'))
  }

  const handleMintNFT = () => {
    alert(t('mintNFTFunction'))
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
      <div className="suangua6-container">
        <div className="top-header-frame">
          <div className="back-arrow" onClick={handleBack}>←</div>
          <div className="page-title-text">{t('divination')}</div>
        </div>
        <div className="frame-2085662476">
          <div className="loading-message">{t('loadingDetailedAnalysis')}</div>
        </div>
      </div>
    )
  }

  // 显示错误状态
  if (error) {
    return (
      <div className="suangua6-container">
        <div className="top-header-frame">
          <div className="back-arrow" onClick={handleBack}>←</div>
          <div className="page-title-text">{t('divination')}</div>
        </div>
        <div className="frame-2085662476">
          <div className="error-message">{error}</div>
          <button onClick={() => router.back()} className="retry-button">
            {t('backToRetry')}
          </button>
        </div>
      </div>
    )
  }

  // 没有结果时的占位符
  if (!divinationResult) {
    return (
      <div className="suangua6-container">
        <div className="top-header-frame">
          <div className="back-arrow" onClick={handleBack}>←</div>
          <div className="page-title-text">{t('divination')}</div>
        </div>
        <div className="frame-2085662476">
          <div className="no-result-message">{t('noAnalysisResult')}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="suangua6-container">
      {/* 顶部框框 */}
      <div className="top-header-frame">
        <div className="back-arrow" onClick={handleBack}>←</div>
        <div className="page-title-text">{t('divination')}</div>
      </div>
      
      {/* Frame 2085662476 - 主要内容框架 */}
      <div className="frame-2085662476">
        {/* 问题标题 */}
        <div className="question-title-text">
          {question || t('placeholder_career')}
        </div>
        
        {/* Frame 2085662475 - 可滚动的内容卡片 */}
        <div className="frame-2085662475" ref={scrollRef}>
          {/* 文字 - 内容区域 */}
          <div className="text-content-area">
            {/* Frame 2085662474 - 结果标题和元素区域 */}
            <div className="frame-2085662474">
              {/* 大吉 - 占卜结果标题 */}
              <div className="fortune-result">{divinationResult.fortune}</div>
              
              {/* Frame 2085662473 - 三个元素卡片 */}
              <div className="frame-2085662473">
                {divinationResult.elements.map((item, index) => {
                  const frameClass = index === 0 ? 'frame-2085662434' : 
                                   index === 1 ? 'frame-2085662435' : 'frame-2085662436';
                  const lang = getLanguage()
                  const nameLabel = lang === 'en' ? (item.pinyin || item.name) : item.name
                  const elementLabel = getDisplayElementLabel(item.element)
                  return (
                    <div 
                      key={index} 
                      className={frameClass}
                      style={{ 
                        background: getElementGradient(item.element)
                      }}
                    >
                      <div 
                        className="element-text-content"
                        style={{ color: item.color }}
                      >
                        {nameLabel}（{elementLabel}）
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* 详细分析内容 - 显示真实的AI分析结果 */}
            <div className="detailed-analysis-content">
              {/* 结构化展示三段内容 */}
              <div className="analysis-section">
                <div className="analysis-section-title">{t('hexagramAnalysis')}</div>
                <div className="analysis-section-body">
                  {(divinationResult.apiResult?.divination || '').split(/\n+/).map((p, i) => (
                    <p key={i} className="analysis-paragraph">{p}</p>
                  ))}
                </div>
              </div>
              <div className="analysis-section">
                <div className="analysis-section-title">{t('predictionTitle')}</div>
                <div className="analysis-section-body">
                  {(divinationResult.apiResult?.prediction || '').split(/\n+/).map((p, i) => (
                    <p key={i} className="analysis-paragraph">{p}</p>
                  ))}
                </div>
              </div>
              <div className="analysis-section">
                <div className="analysis-section-title">{t('divineGuidanceTitle')}</div>
                <div className="analysis-section-body">
                  {(divinationResult.apiResult?.advice || '').split(/\n+/).map((p, i) => (
                    <p key={i} className="analysis-paragraph">{p}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Frame 2085662470 - 按钮区域 */}
        <div className="frame-2085662470">
          <button onClick={handleShareToX} className="share-button-1">
            <span>{t('shareToX')}</span>
          </button>
          
          <button onClick={handleShareToAddress} className="share-button-2">
            <span>{t('shareToXXXX')}</span>
          </button>
          
          <button onClick={handleMintNFT} className="mint-button">
            <span>{t('mintNFT')}</span>
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
