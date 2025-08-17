# 🚀 Render.com 部署指南

本指南将帮助你将小六壬占卜应用部署到 Render.com。

## 📋 准备工作

1. **注册 Render 账户**: 访问 [render.com](https://render.com) 并注册账户
2. **准备 GitHub 仓库**: 将代码推送到 GitHub 仓库
3. **获取 DeepSeek API Key**: 确保你有有效的 DeepSeek API 密钥

## 🛠️ 部署步骤

### 方法一：使用 render.yaml 自动部署（推荐）

1. **连接 GitHub 仓库**:

   - 登录 Render 控制台
   - 点击 "New +" > "Blueprint"
   - 连接你的 GitHub 仓库
   - 选择包含此项目的仓库

2. **配置环境变量**:

   - 等待后端服务部署完成，获取后端服务 URL
   - 在 Render 控制台中为**后端服务**添加环境变量：
     ```
     DEEPSEEK_API_KEY=sk-your-api-key-here
     ```
   - 为**前端服务**添加环境变量：
     ```
     NEXT_PUBLIC_API_URL=https://your-backend-service-name.onrender.com
     ```
     (将 `your-backend-service-name` 替换为实际的后端服务名称)

3. **部署**:
   - Render 会自动读取 `render.yaml` 文件
   - 自动创建前端和后端两个服务
   - 等待部署完成（通常需要 5-10 分钟）

### 方法二：手动创建服务

#### 1. 部署后端服务

1. **创建 Web Service**:

   - 点击 "New +" > "Web Service"
   - 连接 GitHub 仓库
   - 配置如下：
     ```
     Name: temple-backend
     Environment: Python 3
     Build Command: cd backend && pip install -r requirements.txt
     Start Command: cd backend && python main.py
     ```

2. **设置环境变量**:

   ```
   DEEPSEEK_API_KEY=sk-your-api-key-here
   SERVER_HOST=0.0.0.0
   SERVER_PORT=10000
   DEBUG=False
   ```

3. **配置健康检查**:
   - Health Check Path: `/api/health`

#### 2. 部署前端服务

1. **创建 Web Service**:

   - 点击 "New +" > "Web Service"
   - 连接同一个 GitHub 仓库
   - 配置如下：
     ```
     Name: temple-frontend
     Environment: Node
     Build Command: cd frontend && npm install && npm run build
     Start Command: cd frontend && npm start
     ```

2. **设置环境变量**:

   ```
   NEXT_PUBLIC_API_URL=https://your-backend-service-name.onrender.com
   NODE_ENV=production
   ```

   注意：将 `your-backend-service-name` 替换为实际的后端服务名称

## 🔗 获取部署 URL

部署完成后，你将获得两个 URL：

- **前端**: `https://temple-frontend.onrender.com` (用户访问地址)
- **后端**: `https://temple-backend.onrender.com` (API 地址)

## 📝 注意事项

### 免费计划限制

- **冷启动**: 免费服务在不活跃时会进入休眠状态
- **构建时间**: 首次部署可能需要较长时间
- **资源限制**: 内存和 CPU 有限制

### 性能优化建议

- 使用 Render 的付费计划避免冷启动
- 设置健康检查保持服务活跃
- 考虑使用 CDN 加速前端资源

## 🚨 故障排除

### 常见问题

1. **后端服务无法启动**:

   - 检查 `requirements.txt` 是否正确
   - 确认 `DEEPSEEK_API_KEY` 环境变量已设置
   - 查看 Render 控制台的构建日志

2. **前端无法连接后端**:

   - 确认 `NEXT_PUBLIC_API_URL` 环境变量正确设置
   - 检查后端服务是否正常运行
   - 查看浏览器控制台的网络请求

3. **API 调用失败**:
   - 验证 DeepSeek API 密钥是否有效
   - 检查 API 配额是否足够
   - 查看后端服务日志

### 调试方法

1. **查看服务日志**:

   - 在 Render 控制台点击服务名称
   - 切换到 "Logs" 标签查看实时日志

2. **健康检查**:

   - 访问 `https://your-backend-url.onrender.com/api/health`
   - 检查返回的健康状态

3. **API 文档**:
   - 访问 `https://your-backend-url.onrender.com/docs`
   - 测试 API 接口

## 🔄 更新部署

当你更新代码时：

1. **推送到 GitHub**: `git push origin main`
2. **自动部署**: Render 会自动检测变更并重新部署
3. **手动部署**: 也可以在 Render 控制台手动触发部署

## 📧 支持

如果遇到问题：

- 查看 [Render 官方文档](https://render.com/docs)
- 检查项目的 GitHub Issues
- 确保所有环境变量配置正确

祝你部署成功！🎉
