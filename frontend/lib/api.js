const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://temple-backend.onrender.com'  // 生产环境默认后端地址，部署时请在环境变量中设置正确的后端 URL
    : 'http://127.0.0.1:8000')  // 开发环境地址

class ApiClient {
  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL
  }

  getLanguage() {
    // Get language from localStorage, URL, or browser preference
    if (typeof window !== 'undefined') {
      // First check Next.js router locale from URL
      const currentPath = window.location.pathname
      if (currentPath.startsWith('/en')) {
        return 'en'
      } else if (currentPath.startsWith('/zh')) {
        return 'zh'
      }
      
      // Check localStorage
      const storedLang = localStorage.getItem('language')
      if (storedLang && ['zh', 'en'].includes(storedLang)) {
        return storedLang
      }
      
      // Check document html lang attribute
      const htmlLang = document.documentElement.lang
      if (htmlLang && ['zh', 'en'].includes(htmlLang)) {
        return htmlLang
      }
      
      // Fallback to browser language
      const browserLang = navigator.language.toLowerCase()
      if (browserLang.startsWith('zh')) {
        return 'zh'
      }
    }
    
    return 'zh' // Default to Chinese
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': this.getLanguage(),
        ...options.headers,
      },
      ...options,
    }

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body)
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || `HTTP error! status: ${response.status}`)
      }

      return data
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // 算卦相关API
  async divination(wish, numbers) {
    return this.request('/api/divination', {
      method: 'POST',
      body: { 
        wish, 
        numbers,
        language: this.getLanguage()
      }
    })
  }

  async getDailyFortune(date = null) {
    const params = date ? `?date=${date}` : ''
    return this.request(`/api/daily-fortune${params}`)
  }

  // 上香相关API
  async offerIncense(wish, incenseType) {
    return this.request('/api/incense', {
      method: 'POST',
      body: { 
        wish, 
        incense_type: incenseType,
        language: this.getLanguage()
      }
    })
  }

  // 商城相关API
  async getShopItems(category = null) {
    const params = category ? `?category=${category}` : ''
    return this.request(`/api/shop${params}`)
  }

  async purchaseItem(itemId, quantity = 1) {
    return this.request('/api/purchase', {
      method: 'POST',
      body: { 
        item_id: itemId, 
        quantity 
      }
    })
  }

  // 用户状态API
  async getUserStatus() {
    return this.request('/api/user/status')
  }

  // 健康检查API
  async healthCheck() {
    return this.request('/api/health')
  }
}

export const apiClient = new ApiClient()
export default apiClient