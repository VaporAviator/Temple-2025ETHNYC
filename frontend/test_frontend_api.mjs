// 测试前端API调用 - 直接使用fetch模拟
import fetch from 'node-fetch';

const API_BASE_URL = 'http://localhost:8000';

function getLanguage() {
  return 'en';
}

async function callDivinationAPI(wish, numbers) {
  try {
    console.log(`Making request to: ${API_BASE_URL}/api/divination`);
    console.log('Payload:', { wish, numbers, language: getLanguage() });
    
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
    });

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('调用占卜API失败:', error);
    // 返回默认结果 (模拟前端fallback)
    return {
      success: true,
      divination: `根据您选择的数字 ${numbers.join('、')}，推算得出「速喜」卦象。此卦象预示着好事将至，喜事临门。`,
      prediction: `您的愿望「${wish}」在当前时运下，实现的可能性较高，需要耐心等待合适的时机。`,
      advice: '诚心祈福，保持善念，您的愿望将会实现。建议多行善事，积累福德。',
      luck: 7,
      full_text: `【卦象解析】\n根据您选择的数字 ${numbers.join('、')}，推算得出「速喜」卦象。\n\n【运势预测】\n您的愿望在当前时运下，实现的可能性较高。\n\n【神明指引】\n诚心祈福，保持善念，多行善事。\n\n【吉凶判断】\n总体运势评分：7/10分`
    };
  }
}

async function testFrontendAPI() {
  console.log('Testing frontend API integration...');
  
  try {
    const result = await callDivinationAPI('How will my career luck be next month?', [8, 26, 67]);
    
    console.log('✅ Frontend API call completed!');
    console.log('Result success:', result.success);
    console.log('Divination text:', result.divination?.substring(0, 100) + '...');
    
    // 检查是否是默认结果
    if (result.divination?.includes('根据您选择的数字')) {
      console.log('⚠️  Frontend is receiving default Chinese result (fallback triggered)!');
    } else if (result.divination?.includes('Based on your numbers')) {
      console.log('⚠️  Frontend is receiving default English result (fallback triggered)!');  
    } else {
      console.log('✅ Frontend is receiving LLM-generated result!');
    }
    
  } catch (error) {
    console.error('❌ Frontend API test failed:', error);
  }
}

testFrontendAPI();