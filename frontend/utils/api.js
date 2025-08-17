// API 工具函数
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
 * 调用占卜API
 * @param {string} wish - 用户愿望
 * @param {number[]} numbers - 三个数字
 * @returns {Promise<Object>} 占卜结果
 */
export async function callDivinationAPI(wish, numbers) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/divination`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': getLanguage(),
      },
      body: JSON.stringify({
        wish: wish,
        numbers: numbers,
        language: getLanguage()
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('调用占卜API失败:', error)
    // 返回默认结果
    return getDefaultDivinationResult(wish, numbers)
  }
}

/**
 * 调用上香API（新版：根据愿望与当日运势返回中英祝福）
 * @param {string} wish - 用户愿望
 * @param {string} token - 代币类型（例如 USDC）
 * @param {number} amount - 供奉金额（1/5/10）
 * @returns {Promise<Object>} 上香结果
 */
export async function callIncenseAPI(wish, token = 'USDC', amount = 1) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/incense`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': getLanguage(),
      },
      body: JSON.stringify({
        wish,
        token,
        amount,
        language: getLanguage(),
      })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('调用上香API失败:', error)
    // 返回一个保底文案
    const lang = getLanguage()
    const zh = `愿你所求「${wish}」心诚则灵，行稳致远。敬香祈愿，福泽自来。`
    const en = `May your wish ‘${wish}’ be heard—sincere heart invites steady blessings.`
    return {
      success: true,
      blessing: lang === 'en' ? en : zh,
      blessing_zh: zh,
      blessing_en: en,
      fortune_trend: '吉',
      token,
      amount,
    }
  }
}

/**
 * 解析卦象元素（从AI返回的文本中提取）
 * @param {string} divinationText - AI返回的卦象解析文本
 * @returns {Array} 解析出的元素数组
 */
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

  const text = typeof source === 'string' ? source : ''
  // 从文本中提取卦象信息
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

  // 如果没有找到，返回默认元素
  if (elements.length === 0) {
    elements.push(
      { name: '速喜', element: '火', color: '#DC143C', pinyin: hexagramPinyin['速喜'] },
      { name: '赤口', element: '金', color: '#B8860B', pinyin: hexagramPinyin['赤口'] },
      { name: '小吉', element: '水', color: '#4169E1', pinyin: hexagramPinyin['小吉'] },
    )
  }

  return elements.slice(0, 3) // 最多返回3个元素
}

/**
 * 获取运势等级文本
 * @param {number} luck - 运势评分 (1-10)
 * @returns {string} 运势等级
 */
export function getLuckLevel(luck) {
  if (luck >= 9) return '大吉'
  if (luck >= 8) return '中吉'
  if (luck >= 7) return '小吉'
  if (luck >= 6) return '平吉'
  if (luck >= 4) return '小凶'
  return '大凶'
}

// 英文页面展示用：将 luck_text 或评分映射为拼音
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

// 五行拼音映射
const elementPinyinMap = {
  '金': 'jin',
  '木': 'mu',
  '水': 'shui',
  '火': 'huo',
  '土': 'tu',
}

export function getDisplayElementLabel(element) {
  const lang = getLanguage()
  if (lang === 'en') {
    return elementPinyinMap[element] || element
  }
  return element
}

/**
 * 获取默认占卜结果（API失败时使用）
 * @param {string} wish - 用户愿望
 * @param {number[]} numbers - 三个数字
 * @returns {Object} 默认占卜结果
 */
function getDefaultDivinationResult(wish, numbers) {
  return {
    success: true,
    divination: `根据您选择的数字 ${numbers.join('、')}，推算得出「速喜」卦象。此卦象预示着好事将至，喜事临门。`,
    prediction: `您的愿望「${wish}」在当前时运下，实现的可能性较高，需要耐心等待合适的时机。`,
    advice: '诚心祈福，保持善念，您的愿望将会实现。建议多行善事，积累福德。',
    luck: 7,
    full_text: `【卦象解析】\n根据您选择的数字 ${numbers.join('、')}，推算得出「速喜」卦象。\n\n【运势预测】\n您的愿望在当前时运下，实现的可能性较高。\n\n【神明指引】\n诚心祈福，保持善念，多行善事。\n\n【吉凶判断】\n总体运势评分：7/10分`
  }
}

/**
 * 格式化AI返回的文本，分离不同部分
 * @param {string} fullText - AI返回的完整文本
 * @returns {Object} 格式化后的结果
 */
export function formatAIResponse(fullText) {
  const sections = {
    divination: '',
    prediction: '', 
    advice: '',
    luck: 7
  }

  try {
    // 提取【卦象解析】部分
    const divinationMatch = fullText.match(/【卦象解析】([\s\S]*?)(?=【|$)/)
    if (divinationMatch) {
      sections.divination = divinationMatch[1].trim()
    }

    // 提取【运势预测】部分
    const predictionMatch = fullText.match(/【运势预测】([\s\S]*?)(?=【|$)/)
    if (predictionMatch) {
      sections.prediction = predictionMatch[1].trim()
    }

    // 提取【神明指引】部分
    const adviceMatch = fullText.match(/【神明指引】([\s\S]*?)(?=【|$)/)
    if (adviceMatch) {
      sections.advice = adviceMatch[1].trim()
    }

    // 提取运势评分
    const luckMatch = fullText.match(/(\d+)\/10分|(\d+)分/)
    if (luckMatch) {
      sections.luck = parseInt(luckMatch[1] || luckMatch[2]) || 7
    }

  } catch (error) {
    console.error('解析AI响应失败:', error)
  }

  return sections
}
