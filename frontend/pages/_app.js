import '../styles/globals.css'
import WalletProvider from '../components/WalletProvider'
import { appWithTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

function App({ Component, pageProps }) {
  const router = useRouter()

  useEffect(() => {
    // Set html lang attribute based on current locale
    if (typeof document !== 'undefined') {
      document.documentElement.lang = router.locale || 'zh'
    }
  }, [router.locale])

  return (
    <WalletProvider>
      <Component {...pageProps} />
    </WalletProvider>
  )
}

export default appWithTranslation(App)