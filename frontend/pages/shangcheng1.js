import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export default function ShangCheng1() {
  const { t } = useTranslation('common')
  const router = useRouter()

  const handleBack = () => {
    router.push('/')
  }

  return (
    <div className="shangcheng1-container">
      {/* 顶部返回和标题 */}
      <div className="shangcheng1-back-arrow" onClick={handleBack}>←</div>
      <div className="shangcheng1-title">{t('marketplace')}</div>

      {/* 敬请期待区域 */}
      <div className="marketplace-placeholder">
        <div className="placeholder-content">
          <div className="placeholder-icon">🏪</div>
          <div className="placeholder-title">{t('awaitUnveiling')}</div>
          <div className="placeholder-subtitle">{t('marketplaceComingSoon')}</div>
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
