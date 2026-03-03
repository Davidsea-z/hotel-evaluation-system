#!/bin/bash

echo "======================================"
echo "推送到新GitHub仓库"
echo "仓库名称: hotel-evaluation-system"
echo "======================================"
echo ""

# 提示用户先创建GitHub仓库
echo "⚠️  重要提示："
echo "请先在GitHub上创建新仓库："
echo "1. 访问 https://github.com/new"
echo "2. 仓库名称: hotel-evaluation-system"
echo "3. 描述: 酒店电竞化改造项目评估系统 - 智能投资决策工具"
echo "4. 设置为Public（公开）"
echo "5. 不要勾选README、.gitignore、License"
echo "6. 点击 Create repository"
echo ""
read -p "已创建仓库？按Enter继续..." 

# 检查是否已有remote
echo ""
echo "📝 检查远程仓库配置..."
if git remote | grep -q origin; then
    echo "⚠️  已存在origin远程仓库"
    echo "当前origin: $(git remote get-url origin)"
    echo ""
    read -p "是否要更新为新仓库？(y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git remote remove origin
        echo "✅ 已移除旧的origin"
    else
        echo "❌ 取消操作"
        exit 1
    fi
fi

# 添加新的远程仓库
echo ""
echo "📝 添加远程仓库..."
git remote add origin https://github.com/Davidsea-z/hotel-evaluation-system.git

# 验证远程仓库
echo "✅ 远程仓库已添加："
git remote -v

# 显示即将推送的内容
echo ""
echo "📦 准备推送内容："
git log --oneline
echo ""
echo "文件列表："
git ls-files | head -20

# 确认推送
echo ""
read -p "确认推送到GitHub？(y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ 取消推送"
    exit 1
fi

# 推送代码
echo ""
echo "🚀 开始推送代码到main分支..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "======================================"
    echo "✅ 推送成功！"
    echo "======================================"
    echo ""
    echo "🌐 访问您的仓库："
    echo "https://github.com/Davidsea-z/hotel-evaluation-system"
    echo ""
    echo "📖 查看README："
    echo "https://github.com/Davidsea-z/hotel-evaluation-system/blob/main/README.md"
    echo ""
    echo "🚀 配置GitHub Pages（可选）："
    echo "1. 进入仓库Settings → Pages"
    echo "2. Source选择: Deploy from a branch"
    echo "3. 分支选择: main / root"
    echo "4. 保存并等待部署"
    echo ""
else
    echo ""
    echo "======================================"
    echo "❌ 推送失败"
    echo "======================================"
    echo ""
    echo "请检查："
    echo "1. GitHub仓库是否已创建"
    echo "2. 网络连接是否正常"
    echo "3. Git认证是否配置"
    echo ""
    echo "如需帮助，请查看 GITHUB_SETUP_GUIDE.md"
fi
