# Cloudflare Pages 部署指南

## 📋 项目信息

- **项目名称**: gamehotelmodel
- **项目类型**: 纯静态网站（HTML/CSS/JavaScript）
- **GitHub仓库**: https://github.com/Davidsea-z/copyofhotelproject
- **分支**: feature/internal-investment-filter

---

## 🚀 部署方式

### 方式一：通过Cloudflare Pages控制台部署（推荐）

这是最稳定可靠的部署方式：

#### 步骤1：登录Cloudflare
1. 访问 https://dash.cloudflare.com/
2. 使用您的Cloudflare账号登录

#### 步骤2：创建Pages项目
1. 在左侧菜单选择 **Workers & Pages**
2. 点击 **Create application** 按钮
3. 选择 **Pages** 标签
4. 点击 **Connect to Git**

#### 步骤3：连接GitHub仓库
1. 选择 **GitHub** 作为Git提供商
2. 授权Cloudflare访问您的GitHub账号
3. 选择仓库：**Davidsea-z/copyofhotelproject**
4. 选择分支：**feature/internal-investment-filter**

#### 步骤4：配置构建设置
```
项目名称：gamehotelmodel
生产分支：feature/internal-investment-filter（或main）
构建命令：留空（纯静态项目无需构建）
构建输出目录：/（项目根目录）
根目录：/（项目根目录）
```

#### 步骤5：环境变量
无需配置（纯静态项目）

#### 步骤6：部署
1. 点击 **Save and Deploy**
2. 等待部署完成（通常1-3分钟）
3. 部署成功后会显示访问URL

---

### 方式二：通过Wrangler CLI部署

如果您已经配置好Cloudflare API Token：

```bash
# 1. 进入项目目录
cd /home/user/webapp

# 2. 创建Cloudflare Pages项目（首次）
npx wrangler pages project create gamehotelmodel \
  --production-branch feature/internal-investment-filter

# 3. 部署项目
npx wrangler pages deploy . \
  --project-name=gamehotelmodel \
  --branch=main

# 4. 查看部署状态
npx wrangler pages deployment list --project-name=gamehotelmodel
```

---

### 方式三：通过GitHub Actions自动部署

创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches:
      - feature/internal-investment-filter
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      deployments: write
    
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: gamehotelmodel
          directory: .
          gitHubToken: ${{ secrets.GITHUB_TOKEN }}
```

配置GitHub Secrets：
- `CLOUDFLARE_API_TOKEN`: 您的Cloudflare API Token
- `CLOUDFLARE_ACCOUNT_ID`: 您的Cloudflare Account ID

---

## 📁 部署文件清单

项目包含以下文件，全部需要部署：

### 核心文件（必需）
- ✅ `index.html` - 主页面文件（40KB）
- ✅ `css/style.css` - 样式文件（3,220行）
- ✅ `js/main.js` - JavaScript逻辑（1,654行）

### 配置文件
- ✅ `wrangler.jsonc` - Cloudflare配置
- ✅ `.gitignore` - Git忽略规则

### 其他文件（可选，不影响运行）
- 📝 各种Markdown文档（*.md）
- 📝 项目说明文件

---

## 🔧 Cloudflare Pages 配置

### wrangler.jsonc 内容
```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "gamehotelmodel",
  "compatibility_date": "2026-02-09",
  "pages_build_output_dir": "."
}
```

### 项目设置
- **项目名称**: gamehotelmodel
- **框架预设**: None（纯静态）
- **构建命令**: 无需构建
- **输出目录**: `.`（项目根目录）
- **环境变量**: 无

---

## 🌐 部署后访问地址

部署成功后，您的项目将可通过以下URL访问：

### 生产环境
- **主域名**: https://gamehotelmodel.pages.dev
- **自定义域名**: 可在Cloudflare控制台配置

### 分支预览
- **分支URL**: https://[commit-hash].gamehotelmodel.pages.dev

---

## ✅ 部署验证

部署完成后，请验证以下功能：

### 页面加载
- ✅ 访问首页能正常打开
- ✅ CSS样式正确加载
- ✅ JavaScript功能正常

### 核心功能
- ✅ 首页欢迎区动画正常
- ✅ 投资模型计算器能正常计算
- ✅ 项目评估系统能提交表单并显示结果

### 导航功能
- ✅ 导航栏链接跳转正常
- ✅ 锚点定位正确
- ✅ 回到顶部按钮有效

### 响应式设计
- ✅ 桌面端布局正常（>1200px）
- ✅ 平板端布局正常（768-1200px）
- ✅ 移动端布局正常（<768px）

---

## 🐛 常见问题

### 1. 部署失败：找不到文件
**原因**: 构建输出目录配置错误  
**解决**: 确保 `pages_build_output_dir` 设置为 `.`

### 2. 页面404错误
**原因**: 路由配置问题  
**解决**: 确保所有链接使用相对路径，不使用绝对路径

### 3. CSS/JS不加载
**原因**: MIME类型问题  
**解决**: Cloudflare Pages会自动处理，无需手动配置

### 4. 部署超时
**原因**: 网络问题或项目文件过大  
**解决**: 使用Cloudflare控制台部署（更稳定）

---

## 📊 部署统计

### 项目规模
- **HTML**: 1个文件（40KB）
- **CSS**: 1个文件（3,220行）
- **JavaScript**: 1个文件（1,654行）
- **总大小**: 约100KB（压缩前）

### 部署性能
- **首次部署时间**: 约1-3分钟
- **后续更新时间**: 约30秒-1分钟
- **全球CDN节点**: 275+
- **HTTPS**: 自动配置

---

## 🔄 更新部署

### 自动部署（推荐）
如果使用GitHub集成：
1. 推送代码到GitHub分支
2. Cloudflare自动检测并部署
3. 约1-3分钟后生效

### 手动部署
```bash
cd /home/user/webapp
git pull origin feature/internal-investment-filter
npx wrangler pages deploy . --project-name=gamehotelmodel
```

---

## 📞 支持

### Cloudflare文档
- Pages文档: https://developers.cloudflare.com/pages/
- Wrangler CLI: https://developers.cloudflare.com/workers/wrangler/

### 项目仓库
- GitHub: https://github.com/Davidsea-z/copyofhotelproject
- 分支: feature/internal-investment-filter

---

## 🎯 推荐方案

**强烈推荐使用"方式一：通过Cloudflare Pages控制台部署"**

优势：
- ✅ 可视化操作，简单直观
- ✅ 自动GitHub集成
- ✅ 部署稳定可靠
- ✅ 实时日志查看
- ✅ 一键回滚
- ✅ 自动SSL证书

---

**部署指南创建时间**: 2026-02-27  
**项目版本**: v3.1  
**当前分支**: feature/internal-investment-filter
