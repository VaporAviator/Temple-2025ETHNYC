// 调试版本的API工具函数
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export function getLanguage() {
  try {
    if (typeof window !== 'undefined') {
      // URL locale prefix
      const path = window.location.pathname
      if (path.startsWith('/en')) return 'en'
      if (path.startsWith('/zh')) return 'zh'

      // localStorage preference
      const stored = localStorage.getItem('language')
      if (stored && ['zh', 'en'].includes(stored)) return stored

      // html lang
      const htmlLang = document.documentElement.lang
      if (htmlLang && ['zh', 'en'].includes(htmlLang)) return htmlLang

      // browser
      const browser = navigator.language.toLowerCase()
      if (browser.startsWith('zh')) return 'zh'
      if (browser.startsWith('en')) return 'en'
    }
  } catch (e) {}
  return 'zh'
}

/**
 * 调用占卜API - 调试版本
 * @param {string} wish - 用户愿望
 * @param {number[]} numbers - 三个数字
 * @returns {Promise<Object>} 占卜结果
 */
export async function callDivinationAPI(wish, numbers) {
  const language = getLanguage()
  
  console.log('🔮 API调用开始')
  console.log('📍 API URL:', `${API_BASE_URL}/api/divination`)
  console.log('🌍 语言设置:', language)
  console.log('📝 请求参数:', { wish, numbers, language })
  
  try {
    console.log('📡 发送API请求...')
    
    const response = await fetch(`${API_BASE_URL}/api/divination`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': language,
      },
      body: JSON.stringify({
        wish: wish,
        numbers: numbers,
        language: language
      })
    })

    console.log('📊 响应状态:', response.status)
    console.log('📋 响应头:', Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      console.error('❌ HTTP错误:', response.status, response.statusText)
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log('✅ API调用成功')
    console.log('📊 响应数据 (前100字符):', JSON.stringify(data).substring(0, 100) + '...')
    
    // 检查是否是默认结果
    if (data.divination?.includes('根据您选择的数字')) {
      console.warn('⚠️  收到默认中文结果 - 可能API调用失败回退到默认')
    } else if (data.divination?.includes('Based on your numbers')) {
      console.warn('⚠️  收到默认英文结果 - 可能API调用失败回退到默认')
    } else {
      console.log('✨ 收到LLM生成的结果')
    }
    
    return data
  } catch (error) {
    console.error('❌ API调用失败:', error)
    console.log('🔄 回退到默认结果')
    
    // 返回默认结果
    const defaultResult = getDefaultDivinationResult(wish, numbers, language)
    console.log('📋 默认结果:', defaultResult)
    return defaultResult
  }
}

/**
 * 获取默认占卜结果（API失败时使用）
 * @param {string} wish - 用户愿望
 * @param {number[]} numbers - 三个数字
 * @param {string} language - 语言
 * @returns {Object} 默认占卜结果
 */
function getDefaultDivinationResult(wish, numbers, language = 'zh') {
  if (language === 'en') {
    return {
      success: true,
      divination: `Based on your numbers ${numbers.join(', ')}, the hexagram indicates 'Su Xi'. This hexagram suggests good fortune is coming.`,
      prediction: `Regarding your wish '${wish}', there is a high possibility of success, patience is needed for the right timing.`,
      advice: 'Pray sincerely, maintain good thoughts, your wish will come true. It is recommended to do good deeds and accumulate merit.',
      luck: 7,
      luck_text: 'xiao ji',
      palaces: [
        { name: '速喜', pinyin: 'su xi', element: '火', position: 'ren' },
        { name: '赤口', pinyin: 'chi kou', element: '金', position: 'shi' },
        { name: '小吉', pinyin: 'xiao ji', element: '水', position: 'ying' },
      ],
      full_text: `[Hexagram Analysis]\nBased on your numbers ${numbers.join(', ')}, the hexagram indicates 'Su Xi'.\n\n[Prediction]\nYour wish has a high possibility of success.\n\n[Divine Guidance]\nPray sincerely, maintain good thoughts, do good deeds.\n\n[Fortune Level]\nOverall score: 7/10`
    }
  } else {
    return {
      success: true,
      divination: `根据您选择的数字 ${numbers.join('、')}，推算得出「速喜」卦象。此卦象预示着好事将至，喜事临门。`,
      prediction: `您的愿望「${wish}」在当前时运下，实现的可能性较高，需要耐心等待合适的时机。`,
      advice: '诚心祈福，保持善念，您的愿望将会实现。建议多行善事，积累福德。',
      luck: 7,
      luck_text: '小吉',
      palaces: [
        { name: '速喜', pinyin: 'su xi', element: '火', position: 'ren' },
        { name: '赤口', pinyin: 'chi kou', element: '金', position: 'shi' },
        { name: '小吉', pinyin: 'xiao ji', element: '水', position: 'ying' },
      ],
      full_text: `【卦象解析】\n根据您选择的数字 ${numbers.join('、')}，推算得出「速喜」卦象。\n\n【运势预测】\n您的愿望在当前时运下，实现的可能性较高。\n\n【神明指引】\n诚心祈福，保持善念，多行善事。\n\n【吉凶判断】\n总体运势评分：7/10分`
    }
  }
}

// 导出其他必要的函数（从原始api.js复制）
export function parseHexagramElements(source) {
  const elements = []

  // 常见的六神和对应五行
  const hexagramMap = {
    '大安': { element: '木', color: '#228B22' },
    '留连': { element: '土', color: '#8B4513' },
    '速喜': { element: '火', color: '#DC143C' },
    '赤口': { element: '金', color: '#B8860B' },
    '小吉': { element: '水', color: '#4169E1' },
    '空亡': { element: '土', color: '#696969' },
  }

  // 六神拼音映射（与后端保持一致）
  const hexagramPinyin = {
    '大安': 'da an',
    '留连': 'liu lian',
    '速喜': 'su xi',
    '赤口': 'chi kou',
    '小吉': 'xiao ji',
    '空亡': 'kong wang',
  }

  try {
    // 优先使用后端结构化字段 palaces
    if (source && typeof source === 'object' && Array.isArray(source.palaces)) {
      source.palaces.slice(0, 3).forEach(p => {
        const map = hexagramMap[p.name]
        elements.push({
          name: p.name,
          element: p.element || (map ? map.element : ''),
          color: map ? map.color : '#B8860B',
          pinyin: p.pinyin || hexagramPinyin[p.name] || '',
          position: p.position,
        })
      })
      if (elements.length > 0) return elements
    }
  } catch (e) {}

  // 回退逻辑...
  const text = typeof source === 'string' ? source : ''
  Object.keys(hexagramMap).forEach(name => {
    if (text.includes(name)) {
      elements.push({
        name: name,
        element: hexagramMap[name].element,
        color: hexagramMap[name].color,
        pinyin: hexagramPinyin[name] || ''
      })
    }
  })

  if (elements.length === 0) {
    elements.push(
      { name: '速喜', element: '火', color: '#DC143C', pinyin: hexagramPinyin['速喜'] },
      { name: '赤口', element: '金', color: '#B8860B', pinyin: hexagramPinyin['赤口'] },
      { name: '小吉', element: '水', color: '#4169E1', pinyin: hexagramPinyin['小吉'] },
    )
  }

  return elements.slice(0, 3)
}

export function getLuckLevel(luck) {
  if (luck >= 9) return '大吉'
  if (luck >= 8) return '中吉'
  if (luck >= 7) return '小吉'
  if (luck >= 6) return '平吉'
  if (luck >= 4) return '小凶'
  return '大凶'
}

const luckPinyinMap = {
  '大吉': 'da ji',
  '中吉': 'zhong ji',
  '小吉': 'xiao ji',
  '平吉': 'ping ji',
  '小凶': 'xiao xiong',
  '大凶': 'da xiong',
}

export function getDisplayLuckLabel(luckText, luckScore) {
  const lang = getLanguage()
  const cn = (luckText && String(luckText).trim()) || getLuckLevel(luckScore)
  if (lang === 'en') {
    return luckPinyinMap[cn] || cn
  }
  return cn
}