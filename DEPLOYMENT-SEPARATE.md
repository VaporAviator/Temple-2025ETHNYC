# 🚀 独立开发者分离部署指南

适合独立开发者的前后端分离部署方案 - 一个仓库，两个服务。

## 📁 文件结构
```
项目根目录/
├── backend/              # 后端代码
├── frontend/             # 前端代码
├── render-backend.yaml   # 后端部署配置
├── render-frontend.yaml  # 前端部署配置
└── README.md
```

## 🚀 部署步骤

### 第一步：部署后端服务

1. **登录 Render.com**
2. **点击 "New +" → "Blueprint"**
3. **连接你的 GitHub 仓库**
4. **选择 `render-backend.yaml` 文件**
5. **设置环境变量**：
   ```
   DEEPSEEK_API_KEY=sk-your-api-key-here
   ```
6. **点击 "Create"** 等待部署完成
7. **记录后端 URL**：如 `https://temple-backend-abc123.onrender.com`

### 第二步：部署前端服务

1. **再次点击 "New +" → "Blueprint"**
2. **选择同一个 GitHub 仓库**
3. **选择 `render-frontend.yaml` 文件**
4. **设置环境变量**：
   ```
   NEXT_PUBLIC_API_URL=https://temple-backend-abc123.onrender.com
   ```
   (使用第一步记录的后端 URL)
5. **点击 "Create"** 等待部署完成

## 🎉 部署完成

你将获得：
- **前端地址**：`https://temple-frontend-xyz789.onrender.com` (用户访问)
- **后端地址**：`https://temple-backend-abc123.onrender.com` (API服务)

## 🔄 日常开发流程

### 更新代码
```bash
git add .
git commit -m "添加新功能"
git push origin main
```

### 自动部署
- **前端服务** 自动检测代码变更并重新部署
- **后端服务** 自动检测代码变更并重新部署
- **无需额外操作**

## 🎯 适合场景

✅ **适合你的情况**：
- 独立开发者
- 一个代码仓库
- 想要前后端独立部署控制
- 简单明了的配置

❌ **不适合的情况**：
- 大团队协作（建议分仓库）
- 极简部署需求（建议用单一 render.yaml）

## 💡 优势

1. **代码管理简单** - 所有代码在一个仓库
2. **部署控制精确** - 可以选择性部署前端或后端
3. **配置清晰** - 每个服务配置独立
4. **扩展性好** - 未来可以轻松添加更多服务

## 🔧 故障排除

### 后端部署失败
- 检查 `backend/requirements.txt` 
- 确认环境变量 `DEEPSEEK_API_KEY` 设置正确

### 前端部署失败  
- 检查 `frontend/package.json`
- 确认环境变量 `NEXT_PUBLIC_API_URL` 设置正确

### 前端无法连接后端
- 确认后端服务正常运行
- 检查前端环境变量中的后端 URL 是否正确

## 🎊 总结

这种方案完美适合独立开发者：既保持了代码的统一管理，又获得了部署的灵活性！