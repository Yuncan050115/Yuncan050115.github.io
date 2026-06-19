# 构建产物、诗集时间轴、设置面板修复、导航重构、文章发布流程优化 Spec

## Why
用户反馈 5 个问题：GitHub Pages 部署需要 `.nojekyll` 和 `.github` 目录；诗集时间轴字号太小无法阅读；设置面板因事件重复绑定无法打开；导航需重构（项目移入个人、新增学术和作曲编曲页面）；文章发布流程繁琐需要简化。

## What Changes
- 构建产物：每次 `astro build` 后在 `dist/` 中自动创建 `.nojekyll` 空文件和 `.github/` 目录（含现有 workflows）
- 诗集时间轴：放大字号、增加间距、模仿归档页面 `.archive-row` 布局风格但做诗集专属适配
- 设置面板：修复 `boot()` 双重调用导致 `initSettings()` 重复绑定 click 事件的 bug
- 导航重构：将"项目"移入"个人"子菜单；在"个人"下新增"学术"（Google Scholar）和"作曲编曲"（网易云音乐）外部链接
- 文章发布流程：提供 `npm run new` 脚本交互式创建文章，自动生成 frontmatter

## Impact
- Affected code:
  - `package.json`（build 脚本添加 postbuild，新增 new 脚本）
  - `scripts/postbuild.mjs`（新建，复制 .nojekyll 和 .github 到 dist）
  - `scripts/new-post.mjs`（新建，交互式创建文章）
  - `src/styles/site.css`（诗集时间轴样式放大）
  - `src/scripts/app.ts`（修复 initSettings 重复绑定）
  - `src/config/yuncan.config.ts`（导航重构）

## ADDED Requirements

### Requirement: 构建产物自动包含 .nojekyll 和 .github
每次 `npm run build` 后，`dist/` 目录 SHALL 自动包含：
- `.nojekyll` 空文件（禁止 Jekyll 处理）
- `.github/` 目录（内容与项目根目录的 `.github/` 相同）

#### Scenario: 构建后检查 dist
- **WHEN** 运行 `npm run build`
- **THEN** `dist/.nojekyll` 存在且为空
- **AND** `dist/.github/` 目录存在且内容与根目录 `.github/` 一致

### Requirement: 文章发布辅助脚本
系统 SHALL 提供 `npm run new` 命令，交互式创建新文章：
- 提示输入标题（必填）
- 提示输入分类（可选，逗号分隔）
- 提示输入标签（可选，逗号分隔）
- 提示输入描述（可选，留空则取正文前 88 字）
- 自动生成文件名（`YYYY-MM-DD-标题.md`）
- 自动生成 frontmatter（title、date、tags、categories、description、abbrlink）
- 文件创建在 `content/posts/` 目录

#### Scenario: 创建新文章
- **WHEN** 运行 `npm run new`，输入标题"测试文章"、标签"a,b"
- **THEN** `content/posts/2026-06-19-测试文章.md` 被创建
- **AND** frontmatter 包含 title、date（当前时间）、tags、categories、description、abbrlink

## MODIFIED Requirements

### Requirement: 诗集时间轴显示
诗集时间轴 SHALL 放大显示，参考归档页面布局但做诗集专属适配：
- 年份字号从 2rem 增大到 3rem
- 诗标题字号从默认增大到 1.1rem
- 诗文预览字号从 0.85rem 增大到 0.95rem
- 条目内边距从 14px 18px 增大到 20px 24px
- 条目间距增大
- 年份组间距从 28px 增大到 40px

### Requirement: 设置面板事件绑定
设置面板 SHALL 修复重复绑定 bug：
- `initSettings()` 中使用命名函数 + `removeEventListener` 防重复绑定（与 lyricBar 相同模式）
- 或使用全局标记 `settingsInitialized` 确保只绑定一次

### Requirement: 导航栏结构
导航栏 SHALL 重构"个人"菜单：
- "项目"从顶级导航移入"个人"子菜单
- "个人"子菜单新增"学术"（外部链接 `https://scholar.google.com/citations?hl=en&user=6wnxnLgAAAAJ`）
- "个人"子菜单新增"作曲编曲"（外部链接 `https://music.163.com/#/artist?id=52634647`）
- 子菜单顺序：旧时光、恋爱小屋、关于、项目、学术、作曲编曲

## REMOVED Requirements
无
