import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { callIncenseAPI } from '../utils/api'

export default function ShangXiang3() {
  const { t } = useTranslation('common')
  const router = useRouter()
  const { wish, token, amount } = router.query
  const [animationStarted, setAnimationStarted] = useState(false)

  useEffect(() => {
    // 页面加载后立即开始动画
    setAnimationStarted(true)
    // 触发后端上香接口（并行于动画），结果存入 sessionStorage
    const doIncense = async () => {
      try {
        const amt = Number(amount) || 1
        const res = await callIncenseAPI(String(wish || ''), String(token || 'USDC'), amt)
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('latestBlessing', JSON.stringify(res))
        }
      } catch (e) {
        // 忽略错误，前端会展示保底文案
      }
    }
    doIncense()
    
    // 3秒后自动跳转到shangxiang4页面
    const timer = setTimeout(() => {
      router.push({
        pathname: '/shangxiang4',
        query: { 
          wish: wish,
          token: token,
          amount: amount,
          completed: 'true'
        }
      })
    }, 3000)

    return () => clearTimeout(timer)
  }, [wish, token, amount, router])

  const handleBack = () => {
    router.back()
  }

  return (
    <div className="shangxiang3-container">
      {/* 上香顶部 */}
      <div className="shangxiang3-top-header">
        <div className="shangxiang3-back-arrow" onClick={handleBack}>←</div>
        <div className="shangxiang3-page-title">{t('blessing')}</div>
      </div>
      
      {/* 香炉和烟雾动画容器 */}
      <div className="incense-animation-container">
        {/* 香炉 */}
        <div className="incense-burner">
          <div className="burner-base"></div>
          <div className="burner-body"></div>
          <div className="burner-rim"></div>
          
          {/* 香炷 */}
          <div className="incense-stick"></div>
          
          {/* 烟雾效果 */}
          {animationStarted && (
            <div className="smoke-container">
              <div className="smoke smoke-1"></div>
              <div className="smoke smoke-2"></div>
              <div className="smoke smoke-3"></div>
              <div className="smoke smoke-4"></div>
              <div className="smoke smoke-5"></div>
            </div>
          )}
        </div>
      </div>
      
      {/* 动画文字 */}
      <div className="animation-text">
        {t('offeringInProgress')}
      </div>
      
      {/* 愿望提醒 */}
      <div className="wish-reminder">
        {wish && `${t('wishLabel')}${wish}`}
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
