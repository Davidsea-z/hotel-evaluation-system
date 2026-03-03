#!/bin/bash

echo "======================================"
echo "Cloudflare Pages 部署脚本"
echo "项目：gamehotelmodel"
echo "======================================"
echo ""

# 设置项目名称
PROJECT_NAME="gamehotelmodel"
BRANCH="main"

# 检查Cloudflare认证
echo "1. 检查Cloudflare认证..."
if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
    echo "❌ 错误：未找到CLOUDFLARE_API_TOKEN环境变量"
    echo "请先运行：export CLOUDFLARE_API_TOKEN='your-token'"
    exit 1
fi
echo "✅ Cloudflare API Token已配置"
echo ""

# 准备部署文件
echo "2. 准备部署文件..."
if [ ! -f "index.html" ]; then
    echo "❌ 错误：未找到index.html文件"
    exit 1
fi
echo "✅ 核心文件检查完成"
echo ""

# 执行部署
echo "3. 开始部署到Cloudflare Pages..."
echo "   项目名称：$PROJECT_NAME"
echo "   分支：$BRANCH"
echo ""

npx wrangler pages deploy . \
  --project-name="$PROJECT_NAME" \
  --branch="$BRANCH" \
  --commit-dirty=true

if [ $? -eq 0 ]; then
    echo ""
    echo "======================================"
    echo "✅ 部署成功！"
    echo "======================================"
    echo ""
    echo "访问地址："
    echo "生产环境：https://$PROJECT_NAME.pages.dev"
    echo ""
else
    echo ""
    echo "======================================"
    echo "❌ 部署失败"
    echo "======================================"
    echo ""
    echo "请检查："
    echo "1. Cloudflare API Token是否有效"
    echo "2. 网络连接是否正常"
    echo "3. 项目名称是否已存在"
    echo ""
    exit 1
fi
