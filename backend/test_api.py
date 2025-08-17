#!/usr/bin/env python3
"""
测试API连接
"""

import requests
import json

API_BASE = "http://127.0.0.1:8000"

def test_health():
    """测试健康检查"""
    try:
        response = requests.get(f"{API_BASE}/api/health")
        print(f"健康检查 - 状态码: {response.status_code}")
        print(f"响应: {response.json()}")
        return True
    except Exception as e:
        print(f"健康检查失败: {e}")
        return False

def test_divination():
    """测试占卜API"""
    try:
        data = {
            "wish": "我想要事业成功",
            "numbers": [8, 18, 28]
        }
        response = requests.post(f"{API_BASE}/api/divination", json=data)
        print(f"\n占卜API - 状态码: {response.status_code}")
        print(f"响应: {json.dumps(response.json(), ensure_ascii=False, indent=2)}")
        return True
    except Exception as e:
        print(f"占卜API测试失败: {e}")
        return False

def test_incense():
    """测试上香API"""
    try:
        data = {
            "wish": "祈求平安健康",
            "incense_type": "basic"
        }
        response = requests.post(f"{API_BASE}/api/incense", json=data)
        print(f"\n上香API - 状态码: {response.status_code}")
        print(f"响应: {json.dumps(response.json(), ensure_ascii=False, indent=2)}")
        return True
    except Exception as e:
        print(f"上香API测试失败: {e}")
        return False

def test_shop():
    """测试商城API"""
    try:
        response = requests.get(f"{API_BASE}/api/shop")
        print(f"\n商城API - 状态码: {response.status_code}")
        print(f"响应: {json.dumps(response.json(), ensure_ascii=False, indent=2)}")
        return True
    except Exception as e:
        print(f"商城API测试失败: {e}")
        return False

def test_user_status():
    """测试用户状态API"""
    try:
        response = requests.get(f"{API_BASE}/api/user/status")
        print(f"\n用户状态API - 状态码: {response.status_code}")
        print(f"响应: {json.dumps(response.json(), ensure_ascii=False, indent=2)}")
        return True
    except Exception as e:
        print(f"用户状态API测试失败: {e}")
        return False

if __name__ == "__main__":
    print("开始测试后端API...")
    
    tests = [
        ("健康检查", test_health),
        ("占卜API", test_divination),
        ("上香API", test_incense),
        ("商城API", test_shop),
        ("用户状态API", test_user_status),
    ]
    
    passed = 0
    total = len(tests)
    
    for name, test_func in tests:
        print(f"\n{'='*50}")
        print(f"测试: {name}")
        print(f"{'='*50}")
        if test_func():
            passed += 1
        else:
            print(f"❌ {name} 测试失败")
    
    print(f"\n{'='*50}")
    print(f"测试结果: {passed}/{total} 通过")
    print(f"{'='*50}")