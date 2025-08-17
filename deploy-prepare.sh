#!/bin/bash

# Render.com 部署准备脚本
# 运行此脚本来检查部署准备情况

echo "🚀 Render.com 部署准备检查"
echo "================================"

# 检查必要文件
echo "📁 检查必要文件..."

files=(
  "render.yaml"
  "backend/requirements.txt" 
  "backend/main.py"
  "frontend/package.json"
  "DEPLOYMENT.md"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "✅ $file"
  else
    echo "❌ $file (缺失)"
  fi
done

# 检查环境变量配置
echo ""
echo "🔑 检查环境变量..."

if [ -f "backend/.env" ]; then
  if grep -q "DEEPSEEK_API_KEY=sk-" backend/.env; then
    echo "✅ DeepSeek API Key 已配置"
  else
    echo "⚠️  请在 backend/.env 中设置正确的 DEEPSEEK_API_KEY"
  fi
else
  echo "⚠️  backend/.env 文件不存在，请基于 .env.example 创建"
fi

# 检查依赖
echo ""
echo "📦 检查依赖..."

# 检查后端依赖
if [ -f "backend/requirements.txt" ]; then
  echo "✅ Python 依赖文件存在"
else
  echo "❌ backend/requirements.txt 缺失"
fi

# 检查前端依赖
if [ -f "frontend/package.json" ]; then
  echo "✅ Node.js 依赖文件存在"
else
  echo "❌ frontend/package.json 缺失"
fi

echo ""
echo "🎯 部署步骤提醒："
echo "1. 将代码推送到 GitHub"
echo "2. 在 Render.com 创建新的 Blueprint"
echo "3. 连接你的 GitHub 仓库"
echo "4. 设置环境变量 DEEPSEEK_API_KEY"
echo "5. 等待部署完成"
echo ""
echo "📖 详细说明请查看 DEPLOYMENT.md"
echo "🎉 准备就绪！"