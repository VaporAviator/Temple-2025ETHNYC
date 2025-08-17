import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { getLanguage, callIncenseAPI } from '../utils/api'

export default function ShangXiang4() {
  const { t } = useTranslation('common')
  const router = useRouter()
  const { wish, token, amount, completed } = router.query
  const [blessing, setBlessing] = useState('')

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const raw = sessionStorage.getItem('latestBlessing')
        if (raw) {
          const data = JSON.parse(raw)
          const lang = getLanguage()
          const text = lang === 'en' ? (data.blessing_en || data.blessing) : (data.blessing_zh || data.blessing)
          setBlessing(text || '')
        }
      }
    } catch (e) {}
    // 如果未读取到存储内容，回退请求后端重新获取一次
    const fallback = async () => {
      try {
        if (!blessing && wish) {
          const amt = Number(amount) || 1
          const res = await callIncenseAPI(String(wish), String(token || 'USDC'), amt)
          const lang = getLanguage()
          const text = lang === 'en' ? (res.blessing_en || res.blessing) : (res.blessing_zh || res.blessing)
          setBlessing(text || '')
        }
      } catch (e) {}
    }
    fallback()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wish, token, amount])

  const handleBack = () => {
    router.back()
  }

  const handleShareX = () => {
    alert(t('shareFunction'))
  }

  const handleShareOthers = () => {
    alert(t('shareFunction'))
  }

  const handleMint = () => {
    alert(t('mintNFTFunction'))
  }

  // 生成祝福文案
  const getBlessingText = () => blessing || t('shareBlessingsContent')

  return (
    <div className="shangxiang4-container">
      {/* 上香顶部 */}
      <div className="shangxiang4-top-header">
        <div className="shangxiang4-back-arrow" onClick={handleBack}>←</div>
        <div className="shangxiang4-page-title">{t('blessing')}</div>
      </div>
      
      {/* Frame 2085662481 - 主要内容框架 */}
      <div className="frame-2085662481">
        {/* 分享内容 */}
        <div className="share-content-card">
          {/* Frame 9 - 内部框架 */}
          <div className="inner-frame">
            {/* Group 1000006281 - 传统纸张背景 */}
            <div className="paper-background">
              {/* 传统书法纸的垂直线条 */}
              <div className="writing-lines">
                <div className="vertical-line line-1"></div>
                <div className="vertical-line line-2"></div>
                <div className="vertical-line line-3"></div>
                <div className="vertical-line line-4"></div>
                <div className="vertical-line line-5"></div>
                <div className="vertical-line line-6"></div>
                <div className="vertical-line line-7"></div>
                <div className="vertical-line line-8"></div>
                <div className="vertical-line line-9"></div>
                <div className="vertical-line line-10"></div>
              </div>
              
              {/* Frame 2085662453 */}
              <div className="wish-section">
                {/* Frame 45 */}
                <div className="wish-frame">
                  {/* 我的提问 - 隐藏 */}
                  <div className="my-question-hidden" style={{display: 'none'}}>我的提问</div>
                </div>
                
                {/* 我想接下来的一个月好运不断! - 用户愿望 */}
                <div className="user-wish-text">
                  {wish || '我想接下来的一个月好运不断!'}
                </div>
              </div>
              
              {/* 祝福分享文案 */}
              <div className="blessing-content">
                {getBlessingText()}
              </div>
            </div>
          </div>
        </div>
        
        {/* Frame 2085662470 - 按钮区域 */}
        <div className="shangxiang4-button-section">
          {/* Mint NFT */}
          <button className="action-button button-1" onClick={handleMint}>
            <span>{t('mintNFT')}</span>
          </button>

          {/* Share to X */}
          <button className="action-button button-2" onClick={handleShareX}>
            <span>{t('shareToX')}</span>
          </button>

          {/* Share to Others */}
          <button className="action-button button-3" onClick={handleShareOthers}>
            <span>{t('shareToOthers')}</span>
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
