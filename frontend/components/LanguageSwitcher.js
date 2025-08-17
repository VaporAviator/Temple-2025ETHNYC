import { useRouter } from 'next/router'
import { useState } from 'react'

export default function LanguageSwitcher() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const changeLanguage = (locale) => {
    // Store language preference in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', locale)
    }
    
    router.push(router.pathname, router.asPath, { locale })
    setIsOpen(false)
  }

  const getCurrentLanguageDisplay = () => {
    return router.locale === 'zh' ? '中' : 'EN'
  }

  return (
    <div className="language-switcher">
      <button 
        className="language-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        {getCurrentLanguageDisplay()}
      </button>
      
      {isOpen && (
        <div className="language-dropdown">
          <button 
            className={`language-option ${router.locale === 'zh' ? 'active' : ''}`}
            onClick={() => changeLanguage('zh')}
          >
            中文
          </button>
          <button 
            className={`language-option ${router.locale === 'en' ? 'active' : ''}`}
            onClick={() => changeLanguage('en')}
          >
            English
          </button>
        </div>
      )}
    </div>
  )
}