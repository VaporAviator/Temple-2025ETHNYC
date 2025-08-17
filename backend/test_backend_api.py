#!/usr/bin/env python3
import requests
import json

def test_divination_api():
    """测试占卜API是否正常工作"""
    url = "http://127.0.0.1:8000/api/divination"
    
    # 测试英文请求
    payload = {
        "wish": "How will my career luck be next month?",
        "numbers": [8, 26, 67],
        "language": "en"
    }
    
    headers = {
        "Content-Type": "application/json",
        "Accept-Language": "en"
    }
    
    print("Testing divination API...")
    print(f"Request URL: {url}")
    print(f"Payload: {payload}")
    print(f"Headers: {headers}")
    
    try:
        response = requests.post(url, json=payload, headers=headers, timeout=30)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ API call successful!")
            print(f"Success: {result.get('success')}")
            print(f"Divination text: {result.get('divination', '')[:100]}...")
            print(f"Language detected: {result.get('language', 'unknown')}")
            
            # 检查是否是默认结果
            if "根据您选择的数字" in result.get('divination', ''):
                print("⚠️  Backend is returning default Chinese result!")
            elif "Based on your numbers" in result.get('divination', ''):
                print("⚠️  Backend is returning default English result!")
            else:
                print("✅ Backend is returning LLM-generated result!")
                
        else:
            print(f"❌ API call failed: {response.status_code}")
            print(f"Response: {response.text}")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Request failed: {e}")

def test_health_endpoint():
    """测试健康检查端点"""
    url = "http://127.0.0.1:8000/api/health"
    
    try:
        response = requests.get(url, timeout=10)
        print(f"Health check: {response.status_code}")
        if response.status_code == 200:
            print(f"Health response: {response.json()}")
        else:
            print(f"Health check failed: {response.text}")
    except requests.exceptions.RequestException as e:
        print(f"Health check request failed: {e}")

if __name__ == "__main__":
    print("=== Testing Backend API ===")
    test_health_endpoint()
    print()
    test_divination_api()