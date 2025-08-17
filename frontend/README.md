# Temple Frontend - 移动端神庙应用

这是一个基于Next.js开发的移动端神庙应用，包含算卦、上香、商城三大核心功能。

## 功能特性

### 主要功能
- **算卦系统**: 小六壬神算，支持问题输入、数字选择、结果展示
- **上香祈福**: 支持愿望许愿、加密货币支付
- **商城购买**: 神庙用品购买，支持多种支付方式
- **历史记录**: 查看之前的算卦和上香记录

### 技术特性
- **移动端优先**: 专为移动设备优化的响应式设计
- **钱包集成**: 支持MetaMask等钱包连接
- **多链支持**: 支持以太坊、Polygon等多条区块链
- **现代框架**: 使用Next.js + React开发

## 页面结构

```
/ (主页)
├── /suangua1-6 (算卦流程，6个页面)
├── /shangxiang1-4 (上香流程，4个页面)  
├── /shangcheng1-4 (商城流程，4个页面)
└── /lishijilu (历史记录)
```

## 技术栈

- **框架**: Next.js 14
- **UI库**: React 18
- **钱包集成**: Wagmi + Viem
- **连接器**: @farcaster/miniapp-wagmi-connector
- **状态管理**: @tanstack/react-query
- **样式**: CSS Modules

## 安装运行

1. 安装依赖
```bash
npm install
```

2. 启动开发服务器
```bash
npm run dev
```

3. 在浏览器中访问 http://localhost:3000

## 项目配置

### 钱包配置
在 `lib/wagmi.js` 中配置支持的区块链网络和连接器。

### 环境变量
创建 `.env.local` 文件配置必要的环境变量：
```
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

## 部署

### 构建生产版本
```bash
npm run build
npm start
```

### Vercel部署
项目已配置好可直接部署到Vercel平台。

## 页面说明

### 算卦流程
1. `suangua1.js` - 问题输入页面
2. `suangua2.js` - 小六壬数字选择
3. `suangua3.js` - 算卦结果展示
4. `suangua4.js` - 详细解析
5. `suangua5.js` - 神明建议
6. `suangua6.js` - 完成页面

### 上香流程
1. `shangxiang1.js` - 愿望输入
2. `shangxiang2.js` - 币种和数量选择
3. `shangxiang3.js` - 支付确认
4. `shangxiang4.js` - 上香完成

### 商城流程
1. `shangcheng1.js` - 商品列表
2. `shangcheng2.js` - 商品详情
3. `shangcheng3.js` - 订单确认
4. `shangcheng4.js` - 订单完成

## 开发注意事项

- 页面采用移动端优先设计，最大宽度375px
- 支持钱包连接和断开功能
- 历史记录本地存储（可扩展为后端存储）
- 所有支付功能为模拟实现（需要集成真实支付接口）

## 后续优化方向

1. 集成真实的区块链支付功能
2. 添加用户认证系统
3. 实现后端API和数据库存储
4. 添加推送通知功能
5. 优化用户体验和动画效果