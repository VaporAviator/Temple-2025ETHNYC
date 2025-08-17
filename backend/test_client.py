#!/usr/bin/env python3
"""
小六壬占卜服务 - 终端测试客户端
使用方法：python test_client.py
"""

import os
import sys
import asyncio
import requests
from datetime import datetime
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()

class DivinationClient:
    def __init__(self, base_url="http://127.0.0.1:8000"):
        self.base_url = base_url
        self.session = requests.Session()
        
    def print_header(self):
        """打印程序头部"""
        print("=" * 60)
        print("🔮 小六壬占卜服务 - 终端测试客户端")
        print("=" * 60)
        print("✨ 欢迎使用传统小六壬占卜服务")
        print("📱 服务地址:", self.base_url)
        print("=" * 60)
        print()

    def print_menu(self):
        """打印主菜单"""
        print("📋 功能菜单:")
        print("1️⃣  小六壬占卜")
        print("2️⃣  查看每日运势")
        print("3️⃣  健康检查")
        print("0️⃣  退出程序")
        print("-" * 30)

    def get_user_input(self, prompt, validator=None):
        """获取用户输入并验证"""
        while True:
            try:
                value = input(prompt).strip()
                if validator:
                    return validator(value)
                return value
            except ValueError as e:
                print(f"❌ 输入错误: {e}")
                continue
            except KeyboardInterrupt:
                print("\n👋 用户取消操作")
                return None

    def validate_numbers(self, value):
        """验证数字输入"""
        if not value:
            raise ValueError("不能为空")
        
        try:
            numbers = [int(x.strip()) for x in value.split(',') if x.strip()]
        except ValueError:
            raise ValueError("请输入数字，用逗号分隔")
        
        if len(numbers) != 3:
            raise ValueError("必须输入恰好3个数字")
        
        for num in numbers:
            if num < 1 or num > 99:
                raise ValueError("数字必须在1-99之间")
        
        return numbers

    def validate_wish(self, value):
        """验证愿望输入"""
        if not value:
            raise ValueError("愿望不能为空")
        if len(value) < 2:
            raise ValueError("愿望至少需要2个字符")
        if len(value) > 200:
            raise ValueError("愿望不能超过200个字符")
        return value

    def validate_date(self, value):
        """验证日期输入"""
        if not value:
            return None
        try:
            datetime.strptime(value, '%Y-%m-%d')
            return value
        except ValueError:
            raise ValueError("日期格式错误，请使用 YYYY-MM-DD 格式")

    def perform_divination(self):
        """执行占卜"""
        print("\n🔮 小六壬占卜")
        print("=" * 40)
        
        # 获取愿望
        wish = self.get_user_input(
            "💭 请输入您的愿望或要占卜的事情: ",
            self.validate_wish
        )
        if wish is None:
            return
        
        # 获取三个数字
        print("🎲 请输入三个1-99之间的数字（用逗号分隔）")
        print("   例如: 18,36,88")
        numbers = self.get_user_input("🔢 输入数字: ", self.validate_numbers)
        if numbers is None:
            return
        
        # 发送占卜请求
        print("\n⏳ 正在为您占卜，请稍候...")
        try:
            response = self.session.post(
                f"{self.base_url}/api/divination",
                json={"wish": wish, "numbers": numbers},
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                if result['success']:
                    self.display_divination_result(result, wish, numbers)
                else:
                    print(f"❌ 占卜失败: {result.get('error', '未知错误')}")
            else:
                print(f"❌ 请求失败: {response.status_code} - {response.text}")
                
        except requests.exceptions.RequestException as e:
            print(f"❌ 网络错误: {e}")
            print("💡 请确保服务器正在运行: python main.py")

    def display_divination_result(self, result, wish, numbers):
        """显示占卜结果"""
        print("\n" + "=" * 50)
        print("🎊 占卜结果")
        print("=" * 50)
        print(f"💭 您的愿望: {wish}")
        print(f"🎲 选择的数字: {', '.join(map(str, numbers))}")
        print(f"🍀 运势评分: {result.get('luck', 'N/A')}/10 分")
        print("-" * 50)
        
        # 显示完整结果
        if result.get('full_text'):
            print(result['full_text'])
        else:
            # 分段显示结果
            if result.get('divination'):
                print("📊 卦象解析:")
                print(result['divination'])
                print()
            
            if result.get('prediction'):
                print("🔮 运势预测:")
                print(result['prediction'])
                print()
            
            if result.get('advice'):
                print("🙏 神明指引:")
                print(result['advice'])
                print()
        
        print("=" * 50)

    def get_daily_fortune(self):
        """获取每日运势"""
        print("\n📅 每日运势")
        print("=" * 40)
        
        # 询问是否查看特定日期
        print("📆 请选择查看日期:")
        print("1. 今天")
        print("2. 指定日期")
        
        choice = self.get_user_input("请选择 (1-2): ")
        if choice is None:
            return
        
        date_param = None
        if choice == "2":
            date_param = self.get_user_input(
                "📅 请输入日期 (YYYY-MM-DD): ",
                self.validate_date
            )
            if date_param is None:
                return
        
        # 发送运势请求
        print("\n⏳ 正在获取运势信息，请稍候...")
        try:
            params = {"date": date_param} if date_param else {}
            response = self.session.get(
                f"{self.base_url}/api/daily-fortune",
                params=params,
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                if result['success']:
                    self.display_fortune_result(result)
                else:
                    print(f"❌ 获取运势失败: {result.get('error', '未知错误')}")
            else:
                print(f"❌ 请求失败: {response.status_code} - {response.text}")
                
        except requests.exceptions.RequestException as e:
            print(f"❌ 网络错误: {e}")
            print("💡 请确保服务器正在运行: python main.py")

    def display_fortune_result(self, result):
        """显示运势结果"""
        print("\n" + "=" * 50)
        print("🌟 每日运势")
        print("=" * 50)
        print(f"📅 日期: {result.get('date', 'N/A')}")
        print(f"🌙 农历: {result.get('lunar_date', 'N/A')}")
        print("-" * 50)
        
        if result.get('fortune'):
            print(result['fortune'])
        
        print("=" * 50)

    def health_check(self):
        """健康检查"""
        print("\n🔍 服务健康检查")
        print("=" * 40)
        
        try:
            response = self.session.get(f"{self.base_url}/api/health", timeout=10)
            
            if response.status_code == 200:
                result = response.json()
                print("✅ 服务状态: 正常")
                print(f"🕐 检查时间: {result.get('timestamp', 'N/A')}")
                print(f"🔑 API密钥: {'已配置' if result.get('api_key_configured') else '未配置'}")
                
                if not result.get('api_key_configured'):
                    print("⚠️  警告: DeepSeek API 密钥未配置，部分功能可能无法正常使用")
                    print("💡 请在 .env 文件中设置 GEMINI_API_KEY")
            else:
                print(f"❌ 服务异常: {response.status_code}")
                
        except requests.exceptions.RequestException as e:
            print(f"❌ 无法连接到服务器: {e}")
            print("💡 请确保服务器正在运行: python main.py")

    def run(self):
        """运行客户端"""
        self.print_header()
        
        # 检查环境变量
        if not os.getenv('GEMINI_API_KEY'):
            print("⚠️  警告: GEMINI_API_KEY 环境变量未设置")
            print("💡 请复制 .env.example 为 .env 并设置您的 API 密钥")
            print()
        
        while True:
            try:
                self.print_menu()
                choice = input("🎯 请选择功能 (0-3): ").strip()
                
                if choice == "1":
                    self.perform_divination()
                elif choice == "2":
                    self.get_daily_fortune()
                elif choice == "3":
                    self.health_check()
                elif choice == "0":
                    print("👋 感谢使用小六壬占卜服务，祝您好运！")
                    break
                else:
                    print("❌ 无效选择，请重新输入")
                
                print("\n" + "="*60 + "\n")
                
            except KeyboardInterrupt:
                print("\n👋 感谢使用小六壬占卜服务！")
                break
            except Exception as e:
                print(f"❌ 程序错误: {e}")
                continue


def main():
    """主函数"""
    if len(sys.argv) > 1:
        base_url = sys.argv[1]
    else:
        base_url = "http://127.0.0.1:8000"
    
    client = DivinationClient(base_url)
    client.run()


if __name__ == "__main__":
    main()