# 酒店电竞化改造项目评估系统

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Cloudflare Pages](https://img.shields.io/badge/Deployed%20on-Cloudflare%20Pages-orange)](https://pages.cloudflare.com/)

> 智能化投资决策辅助工具 - 通过15个核心字段评估酒店电竞化改造项目投资价值

---

## 🎯 项目简介

本项目是一个专业的**酒店电竞化改造项目评估系统**，帮助投资人、酒店业主和加盟商快速评估项目的投资价值和可行性。

### 核心功能

- 📝 **智能评估表单** - 15个核心字段，覆盖基础信息、改造前数据、改造计划
- 🏆 **100分制评分** - 4大维度（财务收益30分+市场潜力25分+回本速度25分+风险控制20分）
- 🎯 **智能评级系统** - 优秀/良好/中等/需改进，一目了然
- 💡 **AI投资建议** - 自动生成综合评价、优势分析、风险提示、优化建议
- 📊 **详细指标分析** - 预计营收、利润、ROI、回本周期等12项关键指标
- 📚 **对标案例展示** - 4个真实改造案例智能匹配

---

## ✨ 功能特性

### 1. 投资模型计算器
- 房间配置（单人间、双人间、四人间）
- 电脑配置（高端、中端、低端）
- 入住率和房价设置
- IRR内部收益率计算（MIRR改进算法）
- 灵活分账周期（日/周/月/季度）
- 实时分账金额显示

### 2. 项目评估系统
- **基础信息**（5个字段）：项目名称、位置、类型、房间数
- **改造前数据**（3个字段）：房价、入住率、月营收
- **改造计划**（5个字段）：预算、设备占比、目标房价、入住率、方案定位

### 3. 智能评分算法
| 维度 | 权重 | 评分标准 |
|------|------|----------|
| 财务收益 | 30分 | 基于预计年ROI |
| 市场潜力 | 25分 | 基于区域位置 |
| 回本速度 | 25分 | 基于回本周期 |
| 风险控制 | 20分 | 基于方案定位+预算+设备占比 |

### 4. 评级体系
- **85-100分**：优秀项目 🟢 强烈推荐投资
- **70-84分**：良好项目 🔵 推荐投资
- **55-69分**：中等项目 🟡 谨慎投资
- **0-54分**：需改进 🔴 不建议投资

---

## 🚀 在线演示

- **GitHub Pages**: [即将上线]
- **Cloudflare Pages**: `https://gamehotelmodel.pages.dev`

---

## 📦 技术栈

### 前端技术
- **HTML5** - 语义化标签 + ARIA无障碍
- **Tailwind CSS** - 原子化CSS（CDN）
- **Vanilla JavaScript** - ES6+ 原生JS
- **Chart.js 4.x** - 数据可视化

### 部署平台
- **Cloudflare Pages** - 全球边缘网络
- **Wrangler CLI** - Cloudflare开发工具
- **GitHub Pages** - 静态网站托管

### 开发工具
- **Git** - 版本控制
- **PM2** - 进程管理（本地开发）

---

## 📂 项目结构

```
hotel-evaluation-system/
├── index.html                          # 主页面（749行）
├── css/
│   └── style.css                      # 样式文件（3,220行）
├── js/
│   └── main.js                        # JavaScript逻辑（1,654行）
├── wrangler.jsonc                     # Cloudflare配置
├── deploy.sh                          # 部署脚本
├── .gitignore                         # Git忽略规则
├── README.md                          # 项目说明
├── PROJECT_EVALUATION_GUIDE.md        # 使用指南
├── EVALUATION_SYSTEM_REPORT.md        # 开发报告
└── CLOUDFLARE_DEPLOYMENT_GUIDE.md     # 部署指南
```

---

## 🛠️ 本地开发

### 前置要求
- Node.js 18+（如需使用Wrangler）
- Git

### 快速开始

```bash
# 1. 克隆仓库
git clone https://github.com/Davidsea-z/hotel-evaluation-system.git
cd hotel-evaluation-system

# 2. 本地预览（方式一：简单HTTP服务器）
npx http-server . -p 3000

# 3. 本地预览（方式二：Wrangler）
npx wrangler pages dev . --port 3000

# 4. 访问
# 打开浏览器访问 http://localhost:3000
```

---

## 🚀 部署指南

### 方式一：Cloudflare Pages（推荐）

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 点击 **Workers & Pages** → **Create application**
3. 选择 **Pages** → **Connect to Git**
4. 选择此仓库并配置：
   ```
   项目名称：hotel-evaluation-system
   构建命令：留空
   构建输出目录：/
   ```
5. 点击 **Save and Deploy**

### 方式二：GitHub Pages

1. 进入仓库 **Settings** → **Pages**
2. Source选择 **Deploy from a branch**
3. 分支选择 **main** / **root**
4. 保存并等待部署完成

### 方式三：Wrangler CLI

```bash
# 安装Wrangler
npm install -g wrangler

# 登录Cloudflare
wrangler login

# 部署
wrangler pages deploy . --project-name=hotel-evaluation-system
```

详细部署说明请参考：[CLOUDFLARE_DEPLOYMENT_GUIDE.md](./CLOUDFLARE_DEPLOYMENT_GUIDE.md)

---

## 📖 使用指南

### 投资模型计算器

1. 在"投资模型"部分输入酒店参数
2. 设置房间配置、电脑配置、入住率、房价
3. 选择IRR分账频率（日/周/月/季度）
4. 系统实时计算投资回报数据

### 项目评估系统

1. 在"项目评估"部分填写15个核心字段
2. 点击"开始评估项目"按钮
3. 查看综合评分、详细指标、投资建议
4. 参考对标案例进行决策

详细使用说明请参考：[PROJECT_EVALUATION_GUIDE.md](./PROJECT_EVALUATION_GUIDE.md)

---

## 📊 代码统计

| 文件 | 行数 | 说明 |
|------|------|------|
| index.html | 749行 | 主页面结构 |
| css/style.css | 3,220行 | 完整样式系统 |
| js/main.js | 1,654行 | 核心业务逻辑 |
| **总计** | **5,623行** | 纯前端代码 |

---

## 🎯 适用场景

### 目标用户
- 💼 电竞酒店投资人
- 🏢 酒店业主和加盟商
- 📊 投资顾问和分析师
- 🎮 电竞行业从业者

### 典型用例
- **项目筛选** - 快速评估多个项目，筛选优质标的
- **方案对比** - 输入不同改造方案，对比评分
- **融资路演** - 生成专业评估报告
- **风险预警** - 识别薄弱环节，及时优化

---

## 📈 版本历史

### v3.1（当前版本）- 2026-02-27
- ✨ 新增项目评估系统
- 📝 15个核心字段评估表单
- 🏆 100分制智能评分算法
- 💡 AI投资建议生成
- 📊 对标案例展示
- 🐛 修复字段默认值显示问题
- ♻️ 重构"显卡配置"为"方案定位"

### v3.0 - 2026-02-26
- 🎨 精简版发布
- ✅ 保留首页欢迎区
- ✅ 保留投资模型计算器
- 🗑️ 移除冗余模块

---

## 🤝 贡献指南

欢迎提交Issue和Pull Request！

### 开发流程
1. Fork本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启Pull Request

---

## 📄 许可证

本项目采用 MIT License - 详见 [LICENSE](LICENSE) 文件

---

## 📞 联系方式

- **GitHub**: [@Davidsea-z](https://github.com/Davidsea-z)
- **项目主页**: https://github.com/Davidsea-z/hotel-evaluation-system
- **问题反馈**: [提交Issue](https://github.com/Davidsea-z/hotel-evaluation-system/issues)

---

## 🙏 致谢

- [Tailwind CSS](https://tailwindcss.com/) - CSS框架
- [Chart.js](https://www.chartjs.org/) - 图表库
- [Cloudflare Pages](https://pages.cloudflare.com/) - 部署平台

---

## ⭐ Star历史

如果这个项目对您有帮助，请给个Star支持一下！

[![Star History Chart](https://api.star-history.com/svg?repos=Davidsea-z/hotel-evaluation-system&type=Date)](https://star-history.com/#Davidsea-z/hotel-evaluation-system&Date)

---

**Made with ❤️ by Davidsea-z**
