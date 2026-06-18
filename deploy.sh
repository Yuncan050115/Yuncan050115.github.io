#!/bin/bash
# 部署脚本：构建并推送静态网站到 GitHub Pages main 分支
# 使用方法：在项目根目录运行 bash deploy.sh
# 前置条件：已安装 pnpm，已配置 GitHub 远程仓库

set -e

# 配置
REPO_URL="https://github.com/Yuncan050115/Yuncan050115.github.io.git"
DIST_DIR="dist"

echo "========================================="
echo "  云灿博客部署脚本"
echo "========================================="
echo ""

# 第一步：构建静态网站
echo "[1/4] 构建静态网站..."
pnpm build
echo "构建完成。"
echo ""

# 第二步：清理 dist 目录中可能残留的 .git
echo "[2/4] 清理 dist 目录..."
if [ -d "$DIST_DIR/.git" ]; then
  rm -rf "$DIST_DIR/.git"
  echo "已清理旧的 .git 目录。"
fi
echo ""

# 第三步：在 dist 目录初始化 git 并推送到 main 分支
echo "[3/4] 推送静态网站到 main 分支..."
cd "$DIST_DIR"

git init -b main
git add -A
git commit -m "部署网站 $(date '+%Y-%m-%d %H:%M:%S')"

# 检查远程仓库是否已配置
if git remote get-url origin >/dev/null 2>&1; then
  git remote set-url origin "$REPO_URL"
else
  git remote add origin "$REPO_URL"
fi

git push -f origin main
cd ..
echo "静态网站已推送到 main 分支。"
echo ""

# 第四步：提示
echo "[4/4] 部署完成！"
echo ""
echo "========================================="
echo "  部署成功"
echo "========================================="
echo ""
echo "GitHub Pages 地址：https://yuncan050115.github.io/"
echo "（部署后需等待 1-2 分钟生效）"
echo ""
echo "如需同时推送源码到 master 分支，请运行："
echo "  git add ."
echo "  git commit -m \"更新源码\""
echo "  git push origin master"
