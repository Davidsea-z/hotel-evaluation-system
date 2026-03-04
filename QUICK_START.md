# 🚀 快速开始指南

## 📱 立即使用（推荐）

### 在线访问
**系统地址**：https://3000-ifooox6v4gt5cuuudgofz-2e77fc33.sandbox.novita.ai

无需安装，打开即用！

---

## 🎯 三种使用方式

### 方式1：JSON格式输入 ⭐（最推荐）

**适合场景**：有大量数据、需要批量处理、追求准确性

**步骤**：
1. 准备原始数据
2. 使用AI转换为JSON（复制[AI_PROMPT_FOR_JSON.md](./AI_PROMPT_FOR_JSON.md)中的提示词）
3. 打开系统 → 切换到"JSON格式"标签
4. 粘贴JSON → 点击"解析JSON数据"
5. 提交评估

**JSON模板示例**：
```json
{
  "geographic_location": "位于未来科技城核心区，毗邻阿里巴巴西溪园区...",
  "core_customer_flow": {
    "企业年轻员工": "阿里巴巴及周边大厂年轻员工，收入水平高，游戏需求明确...",
    "高校学生": "杭师大学生3万人，电竞重度用户，社交需求旺盛...",
    "商旅与参会客群": "西湖国际博览中心，商务出差频繁..."
  },
  "competitive_pattern": {
    "直接竞品": "3km范围内无电竞酒店",
    "潜在竞品": "2家传统网咖",
    "替代娱乐": "电影院2家，KTV 3家"
  },
  "esports_venue_distribution": {
    "1km以内": 6,
    "1-2km": 9,
    "2-3km": 8,
    "备注": "市场需求旺盛"
  },
  "esports_hotel_distribution": [
    {"name": "XX电竞酒店", "distance": 1.2, "rooms": 50}
  ],
  "business_hotel_distribution": [
    {"name": "如家酒店", "distance": 0.8, "rooms": 80}
  ]
}
```

**详细说明**：[JSON_USAGE_GUIDE.md](./JSON_USAGE_GUIDE.md)

---

### 方式2：文本格式解析

**适合场景**：快速录入、临时评估

**步骤**：
1. 准备文本数据（参考[TEST_PARSE_EXAMPLE.txt](./TEST_PARSE_EXAMPLE.txt)）
2. 打开系统 → "文本格式"标签
3. 粘贴文本 → 点击"一键解析并填充表单"
4. 提交评估

**文本格式示例**：
```
地理位置：位于未来科技城核心区，毗邻阿里巴巴西溪园区
企业员工：周边阿里巴巴、网易等大厂，年轻员工5万+
高校学生：杭师大距离2公里，学生3万人
商旅客群：西湖会展中心1公里，商务出差频繁
直接竞品：3km范围内无电竞酒店
潜在竞品：2家传统网咖
替代娱乐：电影院2家，KTV 3家
1km以内电竞馆：6家
1-2km电竞馆：9家
2-3km电竞馆：8家
电竞馆备注：市场需求旺盛
电竞酒店1：XX电竞酒店,1.2公里,50间房
商务酒店1：如家酒店,0.8公里,80间房
```

**详细说明**：[SMART_PARSE_GUIDE.md](./SMART_PARSE_GUIDE.md)

---

### 方式3：手动填写表单

**适合场景**：初次使用、了解系统、数据量少

**步骤**：
1. 打开系统 → 直接在表单中填写各字段
2. 支持草稿自动保存
3. 动态添加电竞酒店/商务酒店（点击"+"按钮）
4. 提交评估

---

## 📊 评估结果说明

### 综合得分
- **8.5-10分**：高投资价值（绿色 🟢）
- **7.0-8.4分**：较高投资价值（蓝色 🔵）
- **5.5-6.9分**：中等投资价值（黄色 🟡）
- **<5.5分**：低投资价值（红色 🔴）

### 六维度评分
1. **地理位置**（权重：优势40%）
2. **核心客流**（权重：优势60%）- *本次重点测试维度*
3. **竞争格局**（权重：风险30%）
4. **电竞馆分布**（权重：风险20%）
5. **电竞酒店**（权重：风险40%）
6. **商务酒店**（权重：风险10%）

**公式**：
```
综合得分 = 优势得分 × 60% + 风险得分 × 40%

优势得分 = 地理位置 × 40% + 核心客流 × 60%
风险得分 = (竞争格局 × 30% + 电竞馆 × 20% + 电竞酒店 × 40% + 商务酒店 × 10%)
```

---

## 💡 核心客流填写技巧（重点）

### 获得高分的秘诀（8-10分）

#### 三要素：
1. **字符数**：50-100字符（最优区间，得9分基础分）
2. **正向关键词**：至少3-5个（每个+0.5分）
3. **具体数据**：包含规模和流量预估

#### 推荐格式：
```
[客群来源] + [规模数据] + [消费特征] + [需求描述] + [流量预估]
```

#### 高分示例（8.6分）：
```json
{
  "企业年轻员工": "阿里巴巴及周边互联网大厂年轻员工，收入水平高，游戏需求明确，消费能力强，追求品质体验和社交场景，预计日均潜在客户200-300人次"
}
```
- ✅ 字符数：88（获得9分基础分）
- ✅ 关键词：4个（"收入水平高"、"游戏需求明确"、"消费能力强"、"社交场景" → +2分）
- ✅ 数据：日均200-300人次

#### 避免低分：
- ❌ "有很多企业员工"（少于20字符 → 0分）
- ❌ "周边有大厂员工"（20-50字符 → 6分）
- ❌ 没有关键词（无加分）

**详细测试报告**：[CORE_CUSTOMER_FLOW_TEST_REPORT.md](./CORE_CUSTOMER_FLOW_TEST_REPORT.md)

---

## 📚 完整文档索引

### 核心文档（必读）
- **[README.md](./README.md)** - 项目总览
- **[SCORING_LOGIC_EXPLANATION.md](./SCORING_LOGIC_EXPLANATION.md)** - 评分逻辑详解
- **[CORE_CUSTOMER_FLOW_TEST_REPORT.md](./CORE_CUSTOMER_FLOW_TEST_REPORT.md)** - 核心客流测试报告

### 数据导入指南
- **[JSON_USAGE_GUIDE.md](./JSON_USAGE_GUIDE.md)** - JSON格式完整指南
- **[AI_PROMPT_FOR_JSON.md](./AI_PROMPT_FOR_JSON.md)** - AI转换提示词（可直接复制）
- **[JSON_TEMPLATE_FOR_AI.md](./JSON_TEMPLATE_FOR_AI.md)** - 字段说明
- **[SMART_PARSE_GUIDE.md](./SMART_PARSE_GUIDE.md)** - 文本解析指南

### 技术文档
- **[INVESTMENT_ASSESSMENT_API_DOCS.md](./INVESTMENT_ASSESSMENT_API_DOCS.md)** - API文档
- **[JSON_TEMPLATE.md](./JSON_TEMPLATE.md)** - JSON技术规范

### 测试与故障排查
- **[TEST_COMPLETION_SUMMARY.md](./TEST_COMPLETION_SUMMARY.md)** - 测试完成总结
- **[PARSE_TROUBLESHOOTING.md](./PARSE_TROUBLESHOOTING.md)** - 故障排查

### 示例数据
- **[TEST_PARSE_EXAMPLE.txt](./TEST_PARSE_EXAMPLE.txt)** - 文本格式示例
- **[TEST_DATA_CORE_CUSTOMER_FLOW.json](./TEST_DATA_CORE_CUSTOMER_FLOW.json)** - JSON格式示例

---

## 🎯 测试数据（可直接使用）

### 复制此JSON进行测试：
```json
{
  "geographic_location": "位于未来科技城核心区，毗邻阿里巴巴西溪园区、杭州师范大学，周边有西溪印象城等商业配套，靠近杭州西站交通枢纽",
  "core_customer_flow": {
    "企业年轻员工": "阿里巴巴及周边互联网大厂年轻员工，收入水平高，游戏需求明确，消费能力强，追求品质体验和社交场景，预计日均潜在客户200-300人次",
    "高校学生": "杭州师范大学等高校学生群体，电竞重度用户，对价格敏感但社交需求旺盛，周末及假期消费集中，电竞社团活跃，预计周末日均客流100-150人次",
    "商旅与参会客群": "西湖国际博览中心等会展中心带来的年轻商旅客群，对展会、培训配套的主题住宿接受度高，商务出差频繁，预计月均客流500-800人次"
  },
  "competitive_pattern": {
    "直接竞品": "3km范围内有数家经济型电竞酒店（客单价<200元），中高端电竞酒店市场存在空白",
    "潜在竞品": "周边中档传统酒店如亚朵、全季等，但均未提供电竞服务",
    "替代娱乐": "高端网咖、家庭娱乐等对部分客群有一定分流作用"
  },
  "esports_venue_distribution": {
    "1km以内": 6,
    "1-2km": 9,
    "2-3km": 8,
    "备注": "周边网鱼网咖等连锁品牌密集，市场需求旺盛但未饱和"
  },
  "esports_hotel_distribution": [
    {"name": "梦之舟电竞主题公寓", "distance": 0.6, "rooms": 19},
    {"name": "企鹅电竞公寓", "distance": 0.7, "rooms": 22},
    {"name": "网鱼电竞酒店（EFC未来科技城店）", "distance": 1.9, "rooms": 38}
  ],
  "business_hotel_distribution": [
    {"name": "美豪酒店（阿里西溪园区店）", "distance": 0.2, "rooms": 90},
    {"name": "维也纳国际酒店（未来科技城店）", "distance": 0.4, "rooms": 281}
  ]
}
```

**预期结果**：
- 综合得分：7.61分
- 价值等级：较高投资价值（蓝色）
- 核心客流得分：8.6分（优秀）

---

## ⚡ 常见问题

### Q1: JSON解析失败怎么办？
**A**: 检查JSON格式是否正确：
- 使用双引号（不是单引号）
- 数字不加引号
- 没有尾随逗号
- 使用 https://jsonlint.com/ 验证

详见：[PARSE_TROUBLESHOOTING.md](./PARSE_TROUBLESHOOTING.md)

### Q2: 核心客流得分太低？
**A**: 确保：
- 每个子字段50-100字符
- 包含3-5个正向关键词
- 有具体数据和流量预估

详见：[CORE_CUSTOMER_FLOW_TEST_REPORT.md](./CORE_CUSTOMER_FLOW_TEST_REPORT.md)

### Q3: 如何使用AI转换数据？
**A**: 
1. 复制[AI_PROMPT_FOR_JSON.md](./AI_PROMPT_FOR_JSON.md)中的提示词
2. 在ChatGPT/Claude中粘贴提示词和原始数据
3. 获取JSON后复制到系统

详见：[JSON_USAGE_GUIDE.md](./JSON_USAGE_GUIDE.md)

---

## 🎊 立即开始

### 🌐 在线访问
**系统地址**：https://3000-ifooox6v4gt5cuuudgofz-2e77fc33.sandbox.novita.ai

### 📝 推荐流程
```
准备数据 → 使用AI转JSON → 粘贴到系统 → 解析 → 提交 → 查看报告
```

### ⏱️ 预计用时
- JSON方式：**2-5分钟**（包含AI转换）
- 文本解析：**3-8分钟**
- 手动填写：**10-20分钟**

---

**🚀 现在就开始您的项目评估吧！**

**测试完成状态**：✅ 所有功能验证通过  
**系统状态**：🟢 生产就绪  
**核心客流测试**：✅ 8.6/10（优秀）
