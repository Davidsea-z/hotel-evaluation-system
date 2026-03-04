# 项目投资评估系统 - API文档

## 📋 目录
- [概述](#概述)
- [技术栈](#技术栈)
- [快速开始](#快速开始)
- [API接口文档](#api接口文档)
- [评分规则说明](#评分规则说明)
- [部署指南](#部署指南)
- [常见问题](#常见问题)

---

## 概述

项目投资评估系统是一个基于Flask的RESTful API服务，为酒店电竞化改造项目提供智能化投资价值评估。系统通过分析6大核心维度（地理位置、核心客流、竞争格局、电竞馆分布、电竞酒店分布、商务酒店分布），综合评估项目的投资潜力和风险。

### 核心功能
- ✅ 6大维度智能评分算法
- ✅ 优势与风险双维度评估模型（优势60% + 风险40%）
- ✅ 实时数据校验和错误提示
- ✅ RESTful API设计，支持前后端分离
- ✅ 完整的评估结论生成（优势、风险、建议）

---

## 技术栈

### 后端
- **Python 3.8+** - 编程语言
- **Flask 3.0.0** - Web框架
- **Flask-CORS 4.0.0** - 跨域支持
- **Pandas 2.1.4** - 数据处理（可选）

### 前端
- **HTML5 + CSS3** - 页面结构和样式
- **JavaScript (ES6+)** - 交互逻辑
- **Chart.js 4.x** - 数据可视化（雷达图）
- **Tailwind CSS** - UI样式框架

---

## 快速开始

### 1. 环境准备

```bash
# 克隆项目
git clone <repository-url>
cd hotel-evaluation-system

# 创建Python虚拟环境（推荐）
python3 -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate  # Windows

# 安装后端依赖
cd backend
pip install -r requirements.txt
```

### 2. 启动服务

#### 方式一：单独启动（开发环境）
```bash
# 启动后端API（端口5000）
cd backend
python3 app.py

# 启动前端服务（端口3000）
cd ..
npx wrangler pages dev . --port 3000
```

#### 方式二：PM2启动（生产环境）
```bash
# 使用PM2启动前后端服务
pm2 start ecosystem.config.cjs

# 查看服务状态
pm2 list

# 查看日志
pm2 logs
```

### 3. 访问服务

- **前端页面**: http://localhost:3000
- **后端API**: http://localhost:5000
- **健康检查**: http://localhost:5000/api/health

---

## API接口文档

### 基础信息
- **Base URL**: `http://localhost:5000/api`
- **Content-Type**: `application/json`
- **字符编码**: UTF-8

---

### 1. 健康检查

检查API服务是否正常运行。

**请求**
```http
GET /api/health
```

**响应示例**
```json
{
  "status": "ok",
  "message": "项目投资评估系统运行正常"
}
```

---

### 2. 项目评估计算

提交项目评估数据，返回综合评分和详细分析结果。

**请求**
```http
POST /api/calculate_score
Content-Type: application/json
```

**请求参数**

| 字段名称 | 类型 | 必填 | 说明 |
|---------|------|------|------|
| geographic_location | string | ✅ | 地理位置描述（至少10字符） |
| core_customer_flow | object | ✅ | 核心客流对象（至少填写一项） |
| ├─ 企业年轻员工 | string | ❌ | 企业员工客群描述 |
| ├─ 高校学生 | string | ❌ | 高校学生客群描述 |
| └─ 商旅与参会客群 | string | ❌ | 商旅客群描述 |
| competitive_pattern | object | ❌ | 竞争格局对象 |
| ├─ 直接竞品 | string | ❌ | 直接竞品描述 |
| ├─ 潜在竞品 | string | ❌ | 潜在竞品描述 |
| └─ 替代娱乐 | string | ❌ | 替代娱乐描述 |
| esports_venue_distribution | object | ✅ | 电竞馆分布对象 |
| ├─ 1km以内 | number | ✅ | 1km内电竞馆数量 |
| ├─ 1-2km | number | ✅ | 1-2km内电竞馆数量 |
| ├─ 2-3km | number | ✅ | 2-3km内电竞馆数量 |
| └─ remarks | string | ❌ | 备注说明 |
| esports_hotel_distribution | array | ❌ | 电竞酒店列表 |
| business_hotel_distribution | array | ❌ | 商务酒店列表 |
| business_area_remarks | string | ❌ | 商务酒店区域备注 |

**酒店对象结构**（esports_hotel / business_hotel）
```json
{
  "name": "酒店名称",           // 必填
  "distance": 1.5,             // 必填，距离（km）
  "rooms": 30,                 // 选填，房间数
  "price_range": "200-500",    // 选填，价格区间
  "grade": "三星级"            // 选填，等级
}
```

**请求示例**
```json
{
  "geographic_location": "位于杭州未来科技城核心区，毗邻阿里巴巴西溪园区、杭师大等，产业与高校资源密集...",
  "core_customer_flow": {
    "企业年轻员工": "周边集聚阿里巴巴、网易等互联网大厂，年轻员工密集...",
    "高校学生": "杭师大、浙大城市学院等多所高校在附近...",
    "商旅与参会客群": "未来科技城会展中心常举办行业会议..."
  },
  "competitive_pattern": {
    "直接竞品": "3km内仅有1-2家小型电竞酒店，竞争不激烈。",
    "潜在竞品": "周边有5-6家中高端网咖...",
    "替代娱乐": "商圈内有影院、KTV等..."
  },
  "esports_venue_distribution": {
    "1km以内": 6,
    "1-2km": 9,
    "2-3km": 8,
    "remarks": "电竞馆分布合理..."
  },
  "esports_hotel_distribution": [
    {
      "name": "某电竞酒店",
      "distance": 2.5,
      "rooms": 25,
      "price_range": "180-350",
      "grade": "三星"
    }
  ],
  "business_hotel_distribution": [
    {
      "name": "如家商务酒店",
      "distance": 0.8,
      "rooms": 80,
      "price_range": "250-400",
      "grade": "三星"
    }
  ],
  "business_area_remarks": "商务酒店分布适中..."
}
```

**响应格式**

成功响应（HTTP 200）：
```json
{
  "code": 200,
  "msg": "评估成功",
  "data": {
    "comprehensive_score": 7.44,          // 综合得分（0-10）
    "advantage_score": 4.77,              // 优势维度得分
    "risk_score": 2.67,                   // 风险维度得分
    "value_level": "较高投资价值",         // 价值等级
    "recommendation": "推荐投资",          // 投资建议
    "color": "#3b82f6",                   // 等级颜色代码
    "dimension_scores": {                 // 各维度得分详情
      "geographic_location": 10.0,
      "core_customer_flow": 6.6,
      "competitive_pattern": 8.0,
      "esports_venue": 6.0,
      "esports_hotel": 10.0,
      "business_hotel": 9.0
    },
    "conclusion": {                        // 评估结论
      "strengths": [                       // 项目优势列表
        "地理位置优越（10分），处于核心商圈...",
        "电竞酒店市场空白（10.0分）..."
      ],
      "risks": [                           // 风险提示列表
        "整体风险可控"
      ],
      "suggestions": [                     // 优化建议列表
        "建议深入调研目标客群需求..."
      ]
    }
  }
}
```

错误响应（HTTP 400）：
```json
{
  "code": 400,
  "msg": "数据验证失败",
  "errors": [
    "地理位置描述至少需要10个字符",
    "核心客流至少需要填写一项"
  ],
  "data": null
}
```

服务器错误（HTTP 500）：
```json
{
  "code": 500,
  "msg": "服务器错误: 具体错误信息",
  "data": null
}
```

---

### 3. 保存评估记录（可选）

保存评估记录到数据库（当前版本暂未实现数据库存储）。

**请求**
```http
POST /api/save_evaluation
Content-Type: application/json
```

**请求体**：与 `/calculate_score` 相同

**响应示例**
```json
{
  "code": 200,
  "msg": "保存成功",
  "data": {
    "id": "temp_id_12345"
  }
}
```

---

## 评分规则说明

### 综合评分模型

**公式**：综合得分 = 优势维度得分（60%） + 风险维度得分（40%）

#### 1. 优势维度（60%权重）

**计算公式**：优势得分 = (地理位置得分 × 40% + 核心客流得分 × 60%) × 60%

##### 1.1 地理位置评分（0-10分）

**评分规则**：
- 基础分：5分
- 高价值关键词（每个+1.5分）：
  - 阿里巴巴、杭师大、未来科技城、核心区、商圈、CBD、高新区
- 中等价值关键词（每个+1分）：
  - 产业园、大学城、地铁站、商业区、交通枢纽
- 低价值关键词（每个-2分）：
  - 郊区、偏远

**示例**：
- "位于未来科技城核心区，毗邻阿里巴巴" → 5 + 1.5 + 1.5 + 1.5 = 9.5分

##### 1.2 核心客流评分（0-10分）

**评分规则**：
- 企业年轻员工（40%权重）
- 高校学生（35%权重）
- 商旅与参会客群（25%权重）

每个客群根据描述长度和关键词评分：
- 描述 < 20字符：0分
- 描述 20-50字符：6分
- 描述 50-100字符：8分
- 描述 > 100字符：9分
- 包含正面关键词（密集/活跃/需求旺盛等）：+0.5分/个

#### 2. 风险维度（40%权重）

**计算公式**：风险得分 = (竞争格局得分 × 30% + 竞品分布得分 × 70%) × 40%

其中，竞品分布得分 = 电竞馆得分 × 20% + 电竞酒店得分 × 40% + 商务酒店得分 × 10%

##### 2.1 竞争格局评分（0-10分）

**评分规则**：
- 基础分：10分（假设无竞争）
- 直接竞品：
  - "无"或"较少" → -0分
  - "较多"或"密集" → -4分
  - 其他 → -2分
- 潜在竞品：
  - "较多" → -2分
  - "一般" → -1分
- 替代娱乐：
  - "丰富"或"较多" → -1.5分

##### 2.2 电竞馆分布评分（0-10分）

**评分规则**（基于3km内总数）：
- ≤15家：9.5分（竞争适中）
- 15-20家：7.5分
- 20-25家：6.0分
- 25-30家：4.0分
- >30家：2.0分（竞争过度）

**计算公式**：3KM总数 = 1km以内 + 1-2km + 2-3km

##### 2.3 电竞酒店分布评分（0-10分）

**评分规则**：
- 无竞争：10.0分
- 竞争强度 = Σ(房间数 × 距离权重)
  - 距离 ≤ 1km：权重 0.8
  - 距离 1-2km：权重 0.5
  - 距离 > 2km：权重 0.3

**得分映射**：
- 竞争强度 ≤ 30：10.0分
- 竞争强度 30-60：8.0分
- 竞争强度 60-100：6.0分
- 竞争强度 > 100：4.0分

##### 2.4 商务酒店分布评分（0-10分）

**评分规则**（基于3km内总房间数）：
- 0间：6.0分（缺少客流支撑）
- 1-100间：7.0分
- 100-300间：9.0分（最佳）
- 300-500间：8.0分
- >500间：6.0分（竞争激烈）

### 价值等级判定

根据综合得分划分为4个等级：

| 得分区间 | 价值等级 | 推荐意见 | 颜色代码 |
|---------|---------|---------|---------|
| 8.5-10.0 | 高投资价值 | 强烈推荐投资 | #10b981（绿色） |
| 7.0-8.4 | 较高投资价值 | 推荐投资 | #3b82f6（蓝色） |
| 5.5-6.9 | 中等投资价值 | 谨慎投资，建议优化方案 | #f59e0b（黄色） |
| 0-5.4 | 投资价值偏低 | 不建议投资，风险较高 | #ef4444（红色） |

---

## 部署指南

### 开发环境部署

1. **安装依赖**
```bash
cd backend
pip install -r requirements.txt
```

2. **启动服务**
```bash
# 后端（Flask开发服务器）
python3 app.py

# 前端（Wrangler）
npx wrangler pages dev . --port 3000
```

### 生产环境部署

#### 使用PM2部署

1. **安装PM2**
```bash
npm install -g pm2
```

2. **配置ecosystem.config.cjs**
```javascript
module.exports = {
  apps: [
    {
      name: 'hotel-evaluation-frontend',
      script: 'npx',
      args: 'wrangler pages dev . --ip 0.0.0.0 --port 3000',
      cwd: '/path/to/project',
      env: { NODE_ENV: 'development' }
    },
    {
      name: 'hotel-evaluation-backend',
      script: 'python3',
      args: 'app.py',
      cwd: '/path/to/project/backend',
      env: { FLASK_ENV: 'production' }
    }
  ]
}
```

3. **启动服务**
```bash
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

#### 使用Gunicorn部署（生产推荐）

1. **安装Gunicorn**
```bash
pip install gunicorn
```

2. **启动后端**
```bash
cd backend
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

3. **配置Nginx反向代理**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 前端
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # 后端API
    location /api/ {
        proxy_pass http://localhost:5000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Docker部署（可选）

1. **创建Dockerfile（后端）**
```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .

EXPOSE 5000

CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]
```

2. **构建和运行**
```bash
docker build -t hotel-evaluation-backend .
docker run -d -p 5000:5000 hotel-evaluation-backend
```

---

## 常见问题

### 1. CORS跨域问题

**问题**：前端调用API时报跨域错误

**解决方案**：
- 确保后端已安装并启用 `flask-cors`
- 检查 `app.py` 中是否有 `CORS(app)`

### 2. API调用超时

**问题**：API响应时间过长或超时

**解决方案**：
- 检查后端日志排查慢查询
- 优化评分计算逻辑
- 增加Gunicorn worker数量

### 3. 前端无法加载Chart.js

**问题**：雷达图无法显示

**解决方案**：
- 确保CDN链接正常：`https://cdn.jsdelivr.net/npm/chart.js`
- 检查浏览器控制台错误日志
- 本地部署Chart.js

### 4. 草稿数据丢失

**问题**：刷新页面后草稿消失

**解决方案**：
- 检查浏览器是否禁用localStorage
- 清理浏览器缓存后重试
- 使用隐私模式测试

### 5. Python版本兼容性

**问题**：部分依赖无法安装

**解决方案**：
- 确保Python版本 ≥ 3.8
- 更新pip：`pip install --upgrade pip`
- 使用虚拟环境隔离依赖

---

## 技术支持

如有问题，请通过以下方式联系：

- 📧 Email: support@example.com
- 🐛 Issue: https://github.com/your-repo/issues
- 📖 Wiki: https://github.com/your-repo/wiki

---

**最后更新**: 2026-03-04  
**版本**: v1.0.0  
**作者**: MICROCONNECT AI
