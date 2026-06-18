# GitHub 上传教程

本教程说明如何将博客项目上传到 GitHub 仓库 `Yuncan050115/Yuncan050115.github.io`，并通过 GitHub Pages 部署静态网站。

## 策略说明

采用双分支策略：
- **master 分支**：存放项目源码（Astro 源文件）
- **main 分支**：存放构建产物（dist/ 目录内容），用于 GitHub Pages 访问

GitHub Pages 默认从 main 分支读取静态文件，因此访问 `https://yuncan050115.github.io` 会显示 main 分支的网站。

## 前置准备

1. 安装 [Git](https://git-scm.com/)
2. 注册 GitHub 账号
3. 在 GitHub 创建仓库 `Yuncan050115/Yuncan050115.github.io`（如果已存在则跳过）
4. 配置 Git 身份信息（仅需一次）：
   ```bash
   git config --global user.name "你的名字"
   git config --global user.email "你的邮箱"
   ```

## 首次上传

### 第一步：初始化本地仓库

在项目根目录 `d:\cxdownload\blog` 打开终端：

```bash
# 初始化 Git 仓库
git init -b master

# 添加 .gitignore（项目已有，确保包含 dist/、node_modules/、.astro/、.netlify/ 等）
# 查看当前 .gitignore 确认配置正确

# 添加所有源码文件
git add .

# 提交源码到 master 分支
git commit -m "初始化博客项目源码"

# 关联远程仓库
git remote add origin https://github.com/Yuncan050115/Yuncan050115.github.io.git

# 推送源码到 master 分支
git push -u origin master
```

### 第二步：构建静态网站

```bash
# 安装依赖（如果尚未安装）
pnpm install

# 构建静态网站
pnpm build
```

构建产物在 `dist/` 目录。

### 第三步：推送静态网站到 main 分支

```bash
# 进入 dist 目录
cd dist

# 初始化一个新的 Git 仓库
git init -b main

# 添加所有文件
git add .

# 提交
git commit -m "部署静态网站"

# 关联同一个远程仓库
git remote add origin https://github.com/Yuncan050115/Yuncan050115.github.io.git

# 推送到 main 分支（强制，因为 main 可能已有内容）
git push -f origin main

# 回到项目根目录
cd ..
```

### 第四步：配置 GitHub Pages

1. 打开 GitHub 仓库页面 `https://github.com/Yuncan050115/Yuncan050115.github.io`
2. 点击 **Settings** → **Pages**
3. 在 **Source** 下选择 **Deploy from a branch**
4. 在 **Branch** 下选择 **main**，文件夹选择 **/(root)**
5. 点击 **Save**

等待 1-2 分钟，访问 `https://yuncan050115.github.io` 即可看到网站。

## 日常更新

### 更新源码（master 分支）

修改代码后，在项目根目录：

```bash
git add .
git commit -m "描述你的修改"
git push origin master
```

### 更新网站（main 分支）

重新构建并部署：

```bash
# 构建最新静态网站
pnpm build

# 进入 dist 推送
cd dist
git add .
git commit -m "更新网站内容"
git push -f origin main
cd ..
```

## 使用脚本简化部署（可选）

可以在项目根目录创建 `deploy.sh`（Windows 用 Git Bash 运行）：

```bash
#!/bin/bash
# 部署脚本：构建并推送静态网站到 main 分支

set -e

echo "构建静态网站..."
pnpm build

echo "推送源码到 master..."
git add .
git commit -m "更新源码" || echo "没有源码变更"
git push origin master

echo "推送静态网站到 main..."
cd dist
git add .
git commit -m "部署网站 $(date '+%Y-%m-%d %H:%M')"
git push -f origin main
cd ..

echo "部署完成！"
```

赋予执行权限后运行：
```bash
chmod +x deploy.sh
./deploy.sh
```

## 常见问题

### Q: 推送时提示权限拒绝？
A: 确认你有该仓库的写入权限。如果是 HTTPS 方式，需要配置 Personal Access Token；推荐改用 SSH 方式：
```bash
git remote set-url origin git@github.com:Yuncan050115/Yuncan050115.github.io.git
```

### Q: GitHub Pages 显示空白或 404？
A: 检查 main 分支是否有 index.html，以及 GitHub Pages 设置是否指向 main 分支。

### Q: 网站样式丢失？
A: 确认构建时没有报错，dist/ 目录包含 assets/ 等资源文件夹。

### Q: 如何同时推送源码和网站？
A: 使用上面的 deploy.sh 脚本，它会先推送源码到 master，再推送网站到 main。

## 注意事项

- `dist/` 目录在 `.gitignore` 中被忽略，不会推送到 master 分支
- main 分支只包含 dist/ 目录的内容，不包含源码
- 每次更新网站前都要重新 `pnpm build`
- 如果修改了 `src/config/yuncan.config.ts` 中的站点地址，GitHub Pages 的访问地址也会相应变化
