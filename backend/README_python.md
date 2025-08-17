# 小六壬占卜服务 (Python + FastAPI)

基于 DeepSeek API 的传统小六壬占卜服务，使用 Python 和 FastAPI 框架开发。

## 功能特性

- 🔮 **小六壬占卜**: 传统三宫五行占算法
- 📅 **每日运势**: 基于农历的运势分析
- 🌐 **REST API**: 完整的 Web API 接口
- 🖥️ **终端客户端**: 友好的命令行交互界面
- 📚 **自动文档**: Swagger/OpenAPI 自动生成文档

## 安装与配置

### 1. 环境要求

- Python 3.8+
- Conda 环境 (推荐使用 py310)

### 2. 激活 Conda 环境

```bash
conda activate py310
```

### 3. 安装依赖

```bash
pip install -r requirements.txt
```

### 4. 配置环境变量

复制环境变量示例文件：

```bash
cp .env.example .env
```

编辑 `.env` 文件，设置您的 DeepSeek API 密钥：

```env
DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SERVER_HOST=127.0.0.1
SERVER_PORT=8000
DEBUG=True
```

## 使用方法

### 方式一：使用启动脚本 (推荐)

```bash
python start_server.py
```

### 方式二：直接启动

```bash
python main.py
```

### 方式三：使用 uvicorn

```bash
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

## 测试客户端

启动服务后，在另一个终端窗口运行测试客户端：

```bash
python test_client.py
```

### 测试客户端功能

1. **小六壬占卜**

   - 输入您的愿望
   - 提供三个 1-99 之间的数字
   - 获得详细的占卜分析

2. **查看每日运势**

   - 查看今日运势
   - 查看指定日期的运势

3. **健康检查**
   - 检查服务状态
   - 验证 API 配置

## API 接口

服务启动后，可以通过以下方式访问：

- **服务地址**: http://127.0.0.1:8000
- **API 文档**: http://127.0.0.1:8000/docs
- **交互式文档**: http://127.0.0.1:8000/redoc

### 主要接口

#### 1. 占卜接口

```http
POST /api/divination
Content-Type: application/json

{
    "wish": "希望今年事业顺利",
    "numbers": [18, 36, 88]
}
```

#### 2. 每日运势接口

```http
GET /api/daily-fortune?date=2024-01-01
```

#### 3. 健康检查接口

```http
GET /api/health
```

## 测试示例

### 使用 curl 测试占卜接口

```bash
curl -X POST "http://127.0.0.1:8000/api/divination" \
     -H "Content-Type: application/json" \
     -d '{
       "wish": "希望新的一年工作顺利",
       "numbers": [8, 18, 28]
     }'
```

### 使用 curl 测试运势接口

```bash
curl "http://127.0.0.1:8000/api/daily-fortune"
```

## 项目结构

```
backend/
├── main.py                 # FastAPI 主应用
├── deepseek_service.py     # DeepSeek 服务封装
├── test_client.py          # 终端测试客户端
├── start_server.py         # 启动脚本
├── requirements.txt        # Python 依赖
├── .env.example           # 环境变量示例
├── .env                   # 环境变量配置 (需要创建)
└── README_python.md       # 使用说明
```

## 核心功能说明

### 小六壬占算法

本服务实现了传统的小六壬"三宫五行占算法"：

1. **三宫体系**：

   - 人宫：用户本人
   - 事宫：所占之事
   - 应宫：最终结果

2. **六神配置**：

   - 大安 (木)：稳定安康
   - 留连 (土)：迟滞阻碍
   - 速喜 (火)：迅速喜讯
   - 赤口 (金)：官非口舌
   - 小吉 (水)：吉利合作
   - 空亡 (土)：落空徒劳

3. **五行生克**：
   - 相生：木→火→土→金→水→木
   - 相克：木克土、土克水、水克火、火克金、金克木

### 农历支持

使用 `lunardate` 库提供农历日期支持，为每日运势提供准确的农历信息。

## 故障排除

### 常见问题

1. **API 密钥错误**

   - 检查 `.env` 文件中的 `DEEPSEEK_API_KEY` 是否正确
   - 确保 API 密钥有足够的额度

2. **模块导入错误**

   ```bash
   pip install -r requirements.txt
   ```

3. **端口占用**

   - 修改 `.env` 文件中的 `SERVER_PORT`
   - 或者杀死占用端口的进程

4. **网络连接问题**
   - 检查网络连接
   - 确认 DeepSeek API 服务可访问

### 日志调试

启用调试模式查看详细日志：

```env
DEBUG=True
```

## 开发说明

### 扩展功能

1. **添加新的占卜方法**：

   - 在 `deepseek_service.py` 中添加新方法
   - 在 `main.py` 中添加对应的 API 端点

2. **自定义提示词**：

   - 修改 `build_divination_prompt` 方法
   - 调整提示词模板以适应不同需求

3. **结果缓存**：
   - 可以添加 Redis 或内存缓存
   - 缓存每日运势等相对固定的内容

## 许可证

本项目仅供学习和娱乐使用，请勿用于商业用途。
