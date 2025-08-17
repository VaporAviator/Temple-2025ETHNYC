#!/usr/bin/env python3
"""
小六壬占卜服务启动脚本
"""

import os
import sys
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()

def check_environment():
    """检查环境配置"""
    print("🔍 检查环境配置...")
    
    # 检查 Python 版本
    if sys.version_info < (3, 8):
        print("❌ Python 版本过低，请使用 Python 3.8+")
        return False
    
    print(f"✅ Python 版本: {sys.version}")
    
    # 检查必要的模块
    required_modules = [
        ('fastapi', 'fastapi'),
        ('uvicorn', 'uvicorn'), 
        ('google-genai', 'google.genai'),
        ('pydantic', 'pydantic'),
        ('python-dotenv', 'dotenv'),
        ('requests', 'requests')
    ]
    missing_modules = []
    
    for package_name, import_name in required_modules:
        try:
            __import__(import_name)
            print(f"✅ 模块 {package_name}: 已安装")
        except ImportError:
            missing_modules.append(package_name)
            print(f"❌ 模块 {package_name}: 未安装")
    
    if missing_modules:
        print(f"\n⚠️  缺少以下模块: {', '.join(missing_modules)}")
        print("💡 请运行: pip install -r requirements.txt")
        return False
    
    # 检查 API 密钥
    api_key = os.getenv('GEMINI_API_KEY')
    if not api_key:
        print("⚠️  Gemini API 密钥未设置")
        print("💡 请在 .env 文件中设置 GEMINI_API_KEY")
        print("📝 可以复制 .env.example 为 .env 并填入您的密钥")
    else:
        print(f"✅ API 密钥: 已配置 ({api_key[:10]}...)")
    
    return True

def main():
    """主函数"""
    print("🔮 小六壬占卜服务")
    print("=" * 50)
    
    if not check_environment():
        print("\n❌ 环境检查失败，请解决上述问题后重试")
        return
    
    print("\n🚀 启动服务...")
    
    try:
        import uvicorn
        from main import app
        
        host = os.getenv('SERVER_HOST', '127.0.0.1')
        port = int(os.getenv('SERVER_PORT', 8000))
        debug = os.getenv('DEBUG', 'False').lower() == 'true'
        
        print(f"📍 服务地址: http://{host}:{port}")
        print(f"📚 API 文档: http://{host}:{port}/docs")
        print(f"🔧 调试模式: {'开启' if debug else '关闭'}")
        print(f"🎯 测试客户端: python test_client.py")
        print("=" * 50)
        print("💡 按 Ctrl+C 停止服务")
        print()
        
        uvicorn.run(
            "main:app",
            host=host,
            port=port,
            reload=debug,
            access_log=debug
        )
        
    except KeyboardInterrupt:
        print("\n👋 服务已停止")
    except Exception as e:
        print(f"❌ 启动失败: {e}")

if __name__ == "__main__":
    main()