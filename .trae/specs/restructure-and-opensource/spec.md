# 项目结构重构与开源 Spec

## Why
项目根目录残留旧 Hexo 项目文件夹（`旧项目Hexo启动器/`）、旧备份（`backups/`）、旧 node_modules（`content-data/`）、调试脚本等冗余文件，文件结构混乱不利于开源。部分数据已迁移到 `content/` 但 `content.ts` 仍指向旧路径，且 `诗集.md`、`personal/love/index.md`、`site/time/index.md` 等数据尚未迁移。用户要求彻底删除旧项目文件夹、将所需数据做进项目内部、重写 README、优化整体结构，并提供 GitHub 上传教程（源码发 master、静态站发 main）。

## What Changes
- **BREAKING** 删除 `旧项目Hexo启动器/` 整个文件夹，将所需数据完整迁移到 `content/` 目录
- **BREAKING** 删除 `content-data/`（旧 Hexo node_modules）、`backups/`（4 个备份文件夹）、`check_sort.js`、`pnpm-workspace.yaml` 等冗余文件
- 将 `content-fallback/steamgames/index.html` 合并到 `content/fallback/steamgames/index.html`，删除 `content-fallback/`
- 补全 `content/` 中缺失的数据：`pages/personal/love/index.md`、`pages/site/time/index.md`、`poems.md`、`assets/pusheencode.webp`
- 更新 `src/lib/content.ts`：所有路径从 `旧项目Hexo启动器/source/` 改为 `content/`，`旧项目Hexo生成的前端页面/` 改为 `content/fallback/`
- 更新 `src/config/yuncan.config.ts`：`bangumiData` 和 `cinemaData` 路径改为 `content/data/...`
- 更新 `src/pages/poems.astro`：`诗集.md` 路径改为 `content/poems.md`
- 重写 `README.md`：反映新目录结构，移除旧项目引用
- 新增 `docs/github-upload-guide.md`：GitHub 上传教程（源码 master、静态站 main）

## Impact
- Affected specs: refine-and-opensource（文件整理部分需更新）
- Affected code:
  - `src/lib/content.ts`（路径迁移）
  - `src/config/yuncan.config.ts`（数据路径）
  - `src/pages/poems.astro`（诗集路径）
  - `README.md`（重写）
  - 新增 `docs/github-upload-guide.md`
  - 删除：`旧项目Hexo启动器/`、`content-data/`、`backups/`、`content-fallback/`、`check_sort.js`、`pnpm-workspace.yaml`
  - 新增/迁移：`content/pages/personal/love/index.md`、`content/pages/site/time/index.md`、`content/poems.md`、`content/assets/pusheencode.webp`、`content/fallback/steamgames/index.html`

## ADDED Requirements

### Requirement: 数据完整迁移至 content 目录
系统 SHALL 将所有博客数据（文章、页面、追番、追剧、友链、诗集、Steam 回退）统一收纳在项目内部的 `content/` 目录：
- `content/posts/*.md` — 文章 Markdown
- `content/pages/personal/about/index.md` — 关于页
- `content/pages/personal/love/index.md` — 恋爱小屋页
- `content/pages/site/time/index.md` — 旧时光页
- `content/data/bangumis.json` — 追番数据
- `content/data/cinemas.json` — 追剧数据
- `content/data/link.yml` — 友链数据
- `content/poems.md` — 诗集数据
- `content/assets/pusheencode.webp` — 文章用图
- `content/fallback/steamgames/index.html` — Steam 游戏回退数据

#### Scenario: 数据读取
- **WHEN** 构建时 content.ts 读取文章、页面、数据
- **THEN** 所有路径指向 `content/` 目录，不再引用 `旧项目Hexo启动器/`

### Requirement: 删除旧项目与冗余文件
系统 SHALL 删除以下不再需要的文件和目录：
- `旧项目Hexo启动器/`（整个文件夹，数据已迁移）
- `content-data/`（旧 Hexo node_modules）
- `backups/`（4 个历史备份文件夹）
- `content-fallback/`（合并到 content/fallback/ 后删除）
- `check_sort.js`（调试脚本）
- `pnpm-workspace.yaml`（占位文件）

#### Scenario: 项目根目录整洁
- **WHEN** 查看项目根目录
- **THEN** 无旧项目文件夹、无备份、无调试脚本、无占位文件

### Requirement: 重写 README
系统 SHALL 重写 README.md 反映新的项目结构：
- 移除所有 `旧项目Hexo启动器/` 和 `旧项目Hexo生成的前端页面/` 的引用
- 目录结构更新为 `content/` 目录
- 数据源说明更新
- 添加 GitHub 上传教程链接

#### Scenario: README 准确性
- **WHEN** 开发者阅读 README
- **THEN** 目录结构与实际一致，数据源说明准确

### Requirement: GitHub 上传教程
系统 SHALL 提供 GitHub 上传教程文档 `docs/github-upload-guide.md`：
- 源码推送到 master 分支
- 静态网站（dist/）推送到 main 分支（GitHub Pages）
- 包含初始化、首次推送、日常更新的完整步骤

#### Scenario: 用户上传到 GitHub
- **WHEN** 用户按照教程操作
- **THEN** 源码在 master 分支，静态站在 main 分支可访问

## MODIFIED Requirements

### Requirement: content.ts 数据路径
- `oldSource` 从 `旧项目Hexo启动器/source` 改为 `content`
- `oldGenerated` 从 `旧项目Hexo生成的前端页面` 改为 `content/fallback`
- `postsDir` 从 `oldSource/_posts` 改为 `content/posts`
- `getPageMarkdown` 路径前缀改为 `content/pages`
- `getLinks` 路径改为 `content/data/link.yml`
- `getMedia` 路径改为 `content/data/${kind}.json`
- `getSteamGamesFromGenerated` 路径改为 `content/fallback/steamgames/index.html`

### Requirement: yuncan.config.ts 数据路径
- `bangumiData` 从 `旧项目Hexo启动器/source/_data/bangumis.json` 改为 `content/data/bangumis.json`
- `cinemaData` 从 `旧项目Hexo启动器/source/_data/cinemas.json` 改为 `content/data/cinemas.json`

### Requirement: poems.astro 诗集路径
- `诗集.md` 从项目根目录改为 `content/poems.md`

## REMOVED Requirements

### Requirement: 旧项目Hexo启动器
**Reason**: 数据已迁移至 content/，旧项目文件夹不再需要
**Migration**: 所有被引用的数据文件已迁移到 content/ 对应位置
