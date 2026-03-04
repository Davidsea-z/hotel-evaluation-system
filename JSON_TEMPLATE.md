# JSON格式输入模板

## 📋 完整JSON模板

直接复制以下JSON模板，修改为您的项目数据后粘贴到系统中：

```json
{
  "geographic_location": "位于未来科技城核心区，毗邻阿里巴巴西溪园区、杭师大仓前校区，西溪银泰城商圈、杭州西站交通枢纽环绕，地铁5号线直达",
  
  "core_customer_flow": {
    "企业年轻员工": "周边阿里巴巴、网易、字节跳动等大厂，互联网从业者约5万人，年龄25-35岁，消费能力强",
    "高校学生": "杭师大仓前校区距离2公里，学生总数约3万人，电竞社团活跃，周末娱乐需求大",
    "商旅与参会客群": "西湖国际博览中心1公里，商务出差、会展参会人员密集，日均流量超1000人次"
  },
  
  "competitive_pattern": {
    "直接竞品": "3km范围内无电竞酒店，市场完全空白",
    "潜在竞品": "2家传统网咖，装修陈旧，设备老化，客户体验差",
    "替代娱乐": "电影院2家，KTV 3家，但与电竞客群重叠度低"
  },
  
  "esports_venue_distribution": {
    "1km以内": 5,
    "1-2km": 8,
    "2-3km": 3,
    "备注": "周边电竞馆总数16家，市场需求旺盛但不饱和"
  },
  
  "esports_hotel_distribution": [
    {
      "name": "XX电竞酒店",
      "distance": 1.2,
      "rooms": 50
    },
    {
      "name": "YY电竞主题酒店",
      "distance": 2.8,
      "rooms": 30
    }
  ],
  
  "business_hotel_distribution": [
    {
      "name": "如家酒店",
      "distance": 0.8,
      "rooms": 80
    },
    {
      "name": "汉庭酒店",
      "distance": 1.5,
      "rooms": 100
    },
    {
      "name": "全季酒店",
      "distance": 2.0,
      "rooms": 120
    }
  ]
}
```

---

## 📖 字段说明

### 1. geographic_location（地理位置）
**类型**: 字符串（string）  
**说明**: 项目地理位置描述，包括关键地标、交通配套、产业集聚等

```json
"geographic_location": "您的项目位置描述"
```

### 2. core_customer_flow（核心客流）
**类型**: 对象（object）  
**必填字段**: 
- `企业年轻员工`: 企业客群描述
- `高校学生`: 学生客群描述
- `商旅与参会客群`: 商旅客群描述

```json
"core_customer_flow": {
  "企业年轻员工": "描述内容",
  "高校学生": "描述内容",
  "商旅与参会客群": "描述内容"
}
```

### 3. competitive_pattern（竞争格局）
**类型**: 对象（object）  
**必填字段**:
- `直接竞品`: 直接竞争对手描述
- `潜在竞品`: 潜在竞争对手描述
- `替代娱乐`: 替代性娱乐描述

```json
"competitive_pattern": {
  "直接竞品": "描述内容",
  "潜在竞品": "描述内容",
  "替代娱乐": "描述内容"
}
```

### 4. esports_venue_distribution（电竞馆分布）
**类型**: 对象（object）  
**字段说明**:
- `1km以内`: 数字（integer）
- `1-2km`: 数字（integer）
- `2-3km`: 数字（integer）
- `备注`: 字符串（string，可选）

```json
"esports_venue_distribution": {
  "1km以内": 5,
  "1-2km": 8,
  "2-3km": 3,
  "备注": "您的备注"
}
```

### 5. esports_hotel_distribution（电竞酒店分布）
**类型**: 数组（array）  
**元素格式**:
- `name`: 酒店名称（string）
- `distance`: 距离，单位公里（number）
- `rooms`: 房间数（integer）

```json
"esports_hotel_distribution": [
  {
    "name": "酒店名称",
    "distance": 1.2,
    "rooms": 50
  }
]
```

**注意**: 如果没有电竞酒店，使用空数组 `[]`

### 6. business_hotel_distribution（商务酒店分布）
**类型**: 数组（array）  
**元素格式**:
- `name`: 酒店名称（string）
- `distance`: 距离，单位公里（number）
- `rooms`: 房间数（integer）

```json
"business_hotel_distribution": [
  {
    "name": "酒店名称",
    "distance": 0.8,
    "rooms": 80
  }
]
```

---

## 🎯 使用步骤

### 方式1：网页端使用
1. 访问评估系统
2. 点击"JSON格式"标签
3. 点击"📄 获取JSON模板"按钮
4. 修改模板中的数据
5. 点击"解析JSON数据"按钮

### 方式2：本地编辑
1. 复制上面的JSON模板到文本编辑器
2. 修改为您的项目数据
3. 使用JSON验证工具检查格式（可选）
4. 粘贴到系统的JSON输入框
5. 点击"解析JSON数据"

---

## ✅ JSON格式验证

### 常见错误

| 错误 | 原因 | 解决方案 |
|------|------|---------|
| `Unexpected token` | 多余或缺少逗号 | 检查每行末尾的逗号 |
| `Unexpected end of JSON` | 括号不匹配 | 检查 `{` 和 `}` 是否配对 |
| `Invalid property name` | 属性名缺少引号 | 确保所有键都用双引号包裹 |

### 验证清单

- ✅ 所有字符串使用双引号 `""`（不是单引号）
- ✅ 数字不需要引号（如 `5` 不是 `"5"`）
- ✅ 对象和数组元素之间用逗号分隔
- ✅ 最后一个元素后面**不要**加逗号
- ✅ 中文字段名必须完全匹配（如 `"企业年轻员工"`）

---

## 🔧 最小JSON示例

如果只想测试核心功能，可以使用最小化版本：

```json
{
  "geographic_location": "阿里巴巴西溪园区旁",
  "core_customer_flow": {
    "企业年轻员工": "周边大厂员工5万+",
    "高校学生": "杭师大2公里",
    "商旅与参会客群": "会展中心1公里"
  },
  "competitive_pattern": {
    "直接竞品": "无电竞酒店",
    "潜在竞品": "2家网咖",
    "替代娱乐": "电影院2家"
  },
  "esports_venue_distribution": {
    "1km以内": 5,
    "1-2km": 8,
    "2-3km": 3,
    "备注": "市场健康"
  },
  "esports_hotel_distribution": [],
  "business_hotel_distribution": [
    {
      "name": "如家酒店",
      "distance": 0.8,
      "rooms": 80
    }
  ]
}
```

---

## 💡 优势对比

| 特性 | 文本格式 | JSON格式 |
|------|---------|---------|
| 易用性 | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| 准确性 | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 可编程性 | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| 错误提示 | 不明确 | 精确定位 |
| 批量处理 | 不支持 | 支持 |

**推荐**: 如果您熟悉JSON或需要批量处理数据，建议使用JSON格式。

---

## 📞 获取支持

- 在线验证工具: https://jsonlint.com/
- JSON格式教程: https://www.json.org/json-zh.html

---

**更新时间**: 2026-03-04  
**版本**: v2.0 - 新增JSON格式支持
