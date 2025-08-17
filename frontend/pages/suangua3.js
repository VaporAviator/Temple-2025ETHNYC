import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export default function SuanGua3() {
  const { t } = useTranslation('common')
  const router = useRouter()
  const { question, numbers } = router.query
  const [displayNumbers, setDisplayNumbers] = useState([])

  useEffect(() => {
    if (numbers) {
      const numberArray = numbers.split(',').map(n => parseInt(n))
      setDisplayNumbers(numberArray)
      
      // 5秒后自动跳转到suangua4页面
      const timer = setTimeout(() => {
        router.push({
          pathname: '/suangua4',
          query: { 
            question: question,
            numbers: numbers
          }
        })
      }, 5000)
      
      return () => clearTimeout(timer)
    }
  }, [numbers, question, router])

  const handleBack = () => {
    router.back()
  }

  return (
    <div className="suangua3-container">
      {/* 顶部导航 */}
      <div className="top-header">
        <div className="back-arrow" onClick={handleBack}>←</div>
        <div className="page-title">{t('divination')}</div>
      </div>
      
      {/* 主要内容区域 */}
      <div className="main-content">
        {/* 神算标题和数字 */}
        <div className="divination-header">
          <div className="calculating-title">{t('calculating')}</div>
          <div className="numbers-display">
            {displayNumbers.map((num, index) => (
              <span key={index} className="display-number">{num}</span>
            ))}
          </div>
        </div>
        
        {/* 卦象和问题 */}
        <div className="hexagram-container">
          {/* 中央问题文字 */}
          <div className="question-text">
            {question || t('placeholder_career')}
          </div>
          
          {/* 八卦卦象（按后天八卦方位：上-乾，右上-兑，右-离，右下-震，下-坤，左下-艮，左-坎，左上-巽） */}
          <div className="bagua-diagram">
            {/* 上方 */}
            <div className="hexagram top">
              <div className="line"></div>
              <div className="line"></div>
              <div className="line"></div>
            </div>
            
            {/* 右上 */}
            <div className="hexagram top-right">
              <div className="line broken"></div>
              <div className="line"></div>
              <div className="line"></div>
            </div>
            
            {/* 右 */}
            <div className="hexagram right">
              <div className="line"></div>
              <div className="line broken"></div>
              <div className="line"></div>
            </div>
            
            {/* 右下 */}
            <div className="hexagram bottom-right">
              <div className="line broken"></div>
              <div className="line broken"></div>
              <div className="line"></div>
            </div>
            
            {/* 下方 */}
            <div className="hexagram bottom">
              <div className="line broken"></div>
              <div className="line broken"></div>
              <div className="line broken"></div>
            </div>
            
            {/* 左下 */}
            <div className="hexagram bottom-left">
              <div className="line"></div>
              <div className="line broken"></div>
              <div className="line broken"></div>
            </div>
            
            {/* 左 */}
            <div className="hexagram left">
              <div className="line broken"></div>
              <div className="line"></div>
              <div className="line broken"></div>
            </div>
            
            {/* 左上 */}
            <div className="hexagram top-left">
              <div className="line"></div>
              <div className="line"></div>
              <div className="line broken"></div>
            </div>
          </div>
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
