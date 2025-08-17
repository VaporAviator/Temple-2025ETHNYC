import { useRouter } from 'next/router'
import { useState } from 'react'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export default function ShangXiang1() {
  const { t } = useTranslation('common')
  const router = useRouter()
  const [wish, setWish] = useState('')

  const handleBack = () => {
    router.back()
  }

  const handleNext = () => {
    if (wish.trim()) {
      // 跳转到下一个上香页面，传递愿望内容
      router.push({
        pathname: '/shangxiang2',
        query: { wish: wish.trim() }
      })
    }
  }

  return (
    <div className="shangxiang1-container">
      {/* 上香顶部 */}
      <div className="shangxiang-top-header">
        <div className="shangxiang-back-arrow" onClick={handleBack}>←</div>
        <div className="shangxiang-page-title">{t('blessing')}</div>
      </div>
      
      {/* Frame 2085662505 - 主要内容框架 */}
      <div className="frame-2085662505">
        {/* Frame 2085662504 */}
        <div className="frame-2085662504">
          {/* 紫色花篮 */}
          <div className="purple-flower-basket"></div>
          
          {/* Frame 2085662495 */}
          <div className="frame-2085662495">
            {/* 你的愿望？ */}
            <div className="wish-question-title">{t('yourWish')}</div>
            
            {/* Frame 5 - 输入框 */}
            <div className="wish-input-frame">
              <textarea 
                className="wish-input-text"
                placeholder={t('placeholder_wish')}
                value={wish}
                onChange={(e) => setWish(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        {/* 普通状态 - 下一步按钮 */}
        <button 
          className="shangxiang-next-button" 
          onClick={handleNext}
          disabled={!wish.trim()}
        >
          <span>{t('proceedWithIntention')}</span>
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
