import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import LanguageSwitcher from '../components/LanguageSwitcher'

export default function MainPage() {
  const { t } = useTranslation('common')
  const router = useRouter()

  const navigateTo = (path) => {
    router.push(path)
  }

  return (
    <div className="homepage-container">
      <div className="temple-title">{t('title')}</div>
      
      <div className="top-nav">
        <div className="history-icon" onClick={() => navigateTo('/lishijilu')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="#3F4442" strokeWidth="1"/>
            <path d="M12 6V12L16 14" stroke="#3F4442" strokeWidth="1"/>
          </svg>
        </div>
        <LanguageSwitcher />
        <div className="profile-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="#3F4442" strokeWidth="1"/>
            <circle cx="12" cy="9" r="3" fill="#3F4442"/>
            <path d="M7 20c0-3 2-5 5-5s5 2 5 5" fill="#3F4442"/>
          </svg>
        </div>
      </div>
      
      <div className="feature-section" onClick={() => navigateTo('/suangua1')}>
        <div className="feature-card blue-card">
          <div className="feature-icon suangua-icon">{t('divination')}</div>
          <div className="feature-description">{t('divination_description')}</div>
        </div>
        <div className="blue-gourd"></div>
      </div>
      
      <div className="feature-section" onClick={() => navigateTo('/shangxiang1')}>
        <div className="feature-card incense-card">
          <div className="feature-icon shangxiang-icon">{t('blessing')}</div>
          <div className="feature-description">{t('blessing_description')}</div>
        </div>
        <div className="purple-pot"></div>
      </div>
      
      <div className="feature-section" onClick={() => navigateTo('/shangcheng1')}>
        <div className="feature-card shop-card">
          <div className="feature-icon shangcheng-icon">{t('marketplace')}</div>
          <div className="feature-description">{t('marketplace_description')}</div>
        </div>
        <div className="green-token"></div>
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