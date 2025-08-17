#!/usr/bin/env python3
"""
集成测试服务器 - 验证 Gemini API 集成
"""
import asyncio
import os
import sys
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()

def test_environment():
    """检查环境配置"""
    print("🔍 检查环境配置...")
    
    # 检查 API 密钥
    api_key = os.getenv('GEMINI_API_KEY')
    if not api_key:
        print("❌ GEMINI_API_KEY 环境变量未设置")
        return False
    
    print(f"✅ API Key: {api_key[:15]}...")
    
    # 检查必要的模块
    required_modules = [
        'fastapi',
        'uvicorn', 
        'google.genai',
        'pydantic',
        'dotenv',
        'requests',
        'lunardate'
    ]
    
    missing_modules = []
    for module_name in required_modules:
        try:
            if '.' in module_name:
                # 处理嵌套导入
                parts = module_name.split('.')
                parent = __import__(parts[0])
                for part in parts[1:]:
                    parent = getattr(parent, part)
            else:
                __import__(module_name)
            print(f"✅ 模块 {module_name}: 已安装")
        except (ImportError, AttributeError):
            missing_modules.append(module_name)
            print(f"❌ 模块 {module_name}: 未安装")
    
    if missing_modules:
        print(f"\n⚠️  缺少以下模块: {', '.join(missing_modules)}")
        return False
    
    return True

def test_llm_service_import():
    """测试 LLM 服务导入"""
    print("\n🤖 测试 LLM 服务导入...")
    
    try:
        from llm_service import llm_service
        print("✅ LLM 服务导入成功")
        print(f"✅ 客户端状态: {'已初始化' if llm_service.client else '未初始化'}")
        return llm_service
    except Exception as e:
        print(f"❌ LLM 服务导入失败: {e}")
        return None

async def test_divination_function(llm_service):
    """测试占卜功能"""
    print("\n🔮 测试占卜功能...")
    
    test_cases = [
        {
            "wish": "工作顺利",
            "numbers": [8, 18, 28],
            "description": "经典吉利数字组合"
        },
        {
            "wish": "学业进步",
            "numbers": [3, 7, 21],
            "description": "学业相关测试"
        },
        {
            "wish": "健康平安",
            "numbers": [6, 16, 26],
            "description": "健康相关测试"
        }
    ]
    
    results = []
    
    for i, test_case in enumerate(test_cases, 1):
        print(f"\n📋 测试案例 {i}: {test_case['description']}")
        print(f"💭 愿望: {test_case['wish']}")
        print(f"🎲 数字: {test_case['numbers']}")
        
        try:
            result = await llm_service.perform_divination(
                test_case['wish'], 
                test_case['numbers']
            )
            
            if result['success']:
                print("✅ 占卜成功")
                print(f"📊 运势评分: {result.get('luck', 'N/A')}/10")
                
                # 检查关键字段
                required_fields = ['divination', 'prediction', 'advice', 'luck']
                missing_fields = [field for field in required_fields if not result.get(field)]
                
                if missing_fields:
                    print(f"⚠️  缺少字段: {missing_fields}")
                else:
                    print("✅ 所有字段完整")
                
                # 显示部分内容
                if result.get('divination'):
                    preview = result['divination'][:100] + "..." if len(result['divination']) > 100 else result['divination']
                    print(f"📝 卦象预览: {preview}")
                
                results.append({"case": i, "success": True, "result": result})
            else:
                print(f"❌ 占卜失败: {result.get('error', '未知错误')}")
                results.append({"case": i, "success": False, "error": result.get('error')})
                
        except Exception as e:
            print(f"❌ 占卜异常: {e}")
            results.append({"case": i, "success": False, "error": str(e)})
    
    return results

async def test_daily_fortune_function(llm_service):
    """测试每日运势功能"""
    print("\n📅 测试每日运势功能...")
    
    try:
        result = await llm_service.get_daily_fortune()
        
        if result['success']:
            print("✅ 每日运势获取成功")
            print(f"📅 日期: {result.get('date', 'N/A')}")
            print(f"🌙 农历: {result.get('lunar_date', 'N/A')}")
            
            if result.get('fortune'):
                preview = result['fortune'][:200] + "..." if len(result['fortune']) > 200 else result['fortune']
                print(f"📝 运势预览: {preview}")
            
            return True
        else:
            print(f"❌ 每日运势获取失败: {result.get('error', '未知错误')}")
            return False
            
    except Exception as e:
        print(f"❌ 每日运势异常: {e}")
        return False

def test_main_app_import():
    """测试主应用导入"""
    print("\n🚀 测试主应用导入...")
    
    try:
        from main import app
        print("✅ 主应用导入成功")
        return True
    except Exception as e:
        print(f"❌ 主应用导入失败: {e}")
        return False

async def run_comprehensive_test():
    """运行综合测试"""
    print("🔮 Gemini 集成综合测试")
    print("=" * 60)
    
    # 环境检查
    env_ok = test_environment()
    if not env_ok:
        print("\n❌ 环境检查失败，请解决上述问题后重试")
        return
    
    # LLM 服务测试
    llm_service = test_llm_service_import()
    if not llm_service:
        print("\n❌ LLM 服务测试失败")
        return
    
    # 占卜功能测试
    divination_results = await test_divination_function(llm_service)
    
    # 每日运势测试
    fortune_ok = await test_daily_fortune_function(llm_service)
    
    # 主应用测试
    app_ok = test_main_app_import()
    
    # 测试结果汇总
    print("\n" + "=" * 60)
    print("📊 测试结果汇总")
    print("=" * 60)
    
    print(f"环境配置: {'✅' if env_ok else '❌'}")
    print(f"LLM 服务: {'✅' if llm_service else '❌'}")
    
    # 占卜测试结果
    successful_divinations = sum(1 for r in divination_results if r['success'])
    total_divinations = len(divination_results)
    print(f"占卜功能: {'✅' if successful_divinations == total_divinations else '⚠️ '} ({successful_divinations}/{total_divinations})")
    
    print(f"每日运势: {'✅' if fortune_ok else '❌'}")
    print(f"主应用: {'✅' if app_ok else '❌'}")
    
    # 总体评估
    all_passed = (env_ok and llm_service and 
                 successful_divinations == total_divinations and 
                 fortune_ok and app_ok)
    
    print("\n" + "=" * 60)
    if all_passed:
        print("🎉 所有测试通过！Gemini 集成成功！")
        print("💡 现在可以启动服务器: python start_server.py")
    else:
        print("❌ 部分测试失败，请检查上述错误信息")
        
        # 给出具体建议
        if not env_ok:
            print("💡 请检查环境变量和依赖包安装")
        if not llm_service:
            print("💡 请检查 LLM 服务配置和导入")
        if successful_divinations < total_divinations:
            print("💡 请检查 Gemini API 调用和占卜逻辑")
        if not fortune_ok:
            print("💡 请检查每日运势功能")
        if not app_ok:
            print("💡 请检查主应用配置")

def main():
    """主函数"""
    try:
        asyncio.run(run_comprehensive_test())
    except KeyboardInterrupt:
        print("\n👋 测试中断")
    except Exception as e:
        print(f"\n❌ 测试异常: {e}")

if __name__ == "__main__":
    main()