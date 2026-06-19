# 导航修复、诗集时间轴重构、设置面板重写、管理页增强、CI重设计、朋友圈集成、Lock清理 Spec

## Why
用户反馈 7 个问题：外部链接未新窗口打开；诗集时间轴吞字且字号极小；设置面板仍打不开且切换页面消失；管理页背景跟随滚动且缺少置顶/封面字段；GitHub Actions 需重新设计确保不丢 CSS；需要集成朋友圈功能；lock 文件损坏需重新生成。

## What Changes
- 导航子菜单：外部链接添加 `target="_blank"`（修复 BaseLayout.astro 第 112 行）
- **BREAKING** 诗集时间轴：完整显示所有诗文内容（移除 `slice(0,4)` 截断），放大字号，减少右侧空白
- **BREAKING** 设置面板重写：移除语言切换（无 i18n 实现）、移除光标特效设置、新增背景动效开关；修复 persist 后事件丢失
- 管理页增强：点击 2 次打开（非 5 次）、背景固定不滚动、新增置顶和封面字段
- **BREAKING** GitHub Actions 重设计：统一用 npm、确保构建产物完整（含 _astro CSS/JS）
- 朋友圈集成：新建 `/social/circle/` 页面，友链改为二级菜单（友人帐 + 朋友圈）
- Lock 文件清理：删除 pnpm-lock.yaml 和 pnpm-workspace.yaml，用 npm 重新生成 package-lock.json

## Impact
- Affected code:
  - `src/layouts/BaseLayout.astro`（子菜单 target="_blank"）
  - `src/pages/poems.astro`（时间轴完整显示）
  - `src/styles/site.css`（诗集字号、右侧空白、设置面板样式）
  - `src/components/SettingsPanel.astro`（移除语言/光标，新增背景动效）
  - `src/scripts/app.ts`（设置面板修复、管理页 2 次点击、置顶/封面字段、背景动效）
  - `src/components/PostEditor.astro`（置顶/封面字段）
  - `.github/workflows/pages.yml`（重设计 CI）
  - `src/pages/social/circle.astro`（新建朋友圈页面）
  - `src/config/yuncan.config.ts`（友链二级菜单）
  - `.env` / `.env.example`（新增朋友圈 API 配置）
  - 删除 `pnpm-lock.yaml`、`pnpm-workspace.yaml`

## ADDED Requirements

### Requirement: 朋友圈页面
系统 SHALL 新建 `/social/circle/` 页面展示友链朋友圈：
- 通过 API 获取友链网站的最新文章聚合
- API 地址从 .env 的 `PUBLIC_CIRCLE_API` 读取
- 未配置 API 时显示友好提示
- UI 风格与其他页面统一（卡片式布局、breathe-card 样式）
- 友链导航改为二级菜单：友人帐（原友链 `/social/link/`）+ 朋友圈（`/social/circle/`）

#### Scenario: 查看朋友圈
- **WHEN** 用户访问 `/social/circle/`
- **THEN** 显示友链网站的最新文章列表
- **WHEN** PUBLIC_CIRCLE_API 未配置
- **THEN** 显示"朋友圈功能未配置"提示

### Requirement: 管理页置顶和封面字段
文章管理页 SHALL 新增置顶和封面设置：
- 置顶字段：数字输入（0=不置顶，1-10=置顶优先级）
- 封面字段：URL 输入
- 编辑文章时从 frontmatter 解析 sticky 和 cover
- 保存时写入 frontmatter

#### Scenario: 设置置顶
- **WHEN** 用户在管理页编辑文章，设置置顶为 2
- **THEN** frontmatter 中写入 `sticky: 2`
- **AND** 文章在列表中置顶显示

### Requirement: 背景动效开关
设置面板 SHALL 提供背景动效开关：
- 开启时显示页面背景动画效果（如粒子、渐变等）
- 关闭时背景为静态
- 设置存储在 localStorage，跨页面保留

### Requirement: GitHub Actions 完整构建
`.github/workflows/pages.yml` SHALL 确保构建产物完整：
- 统一使用 npm（`npm ci` + `npm run build`）
- 构建后验证 `_astro/` 目录存在（含 CSS/JS）
- 部署 `dist/` 到 `main` 分支
- 环境变量从 GitHub Secrets 注入

## MODIFIED Requirements

### Requirement: 导航子菜单外部链接
导航子菜单中的外部链接 SHALL 在新窗口打开：
- BaseLayout.astro 第 112 行子菜单 `<a>` 标签添加 `target="_blank"` 和 `rel="noopener"` 判断
- 与顶层导航项使用相同的 `isExternal` 判断逻辑

### Requirement: 诗集时间轴完整显示
诗集时间轴 SHALL 完整显示所有诗文内容：
- 移除 `poem.body.slice(0, 4)` 截断，显示全部行
- 诗文字号从 0.95rem 增大到 1.05rem
- 诗标题字号从 1.1rem 增大到 1.25rem
- 年份字号从 3rem 保持
- 减少右侧空白：年份列宽度从 100px 减少到 80px，内容区 `flex: 1`
- 条目内边距从 20px 24px 调整为 18px 20px
- 诗文行间距从 1.75 增大到 1.9
- 配图尺寸从 80px 增大到 100px

### Requirement: 设置面板修复
设置面板 SHALL 修复以下问题：
1. **移除语言切换**：删除 lang 设置项（无 i18n 实现）
2. **移除光标特效设置**：删除 cursorEffect 设置项
3. **新增背景动效开关**：添加 bgEffect checkbox
4. **修复 persist 后事件丢失**：使用 `dataset.ready` 标记确保事件只绑定一次，persist 后 DOM 保留但事件需重新绑定
5. **修复切换页面后消失**：确保 SettingsPanel 的 `transition:persist` 正确工作，设置值从 localStorage 恢复

### Requirement: 管理页交互优化
管理页 SHALL 优化交互：
- FPS 点击次数从 5 次改为 2 次
- 管理页背景固定不滚动（overlay `position: fixed`，modal 内容区独立滚动）
- 新增置顶字段（数字输入）
- 新增封面字段（URL 输入）

### Requirement: Lock 文件统一
项目 SHALL 统一使用 npm：
- 删除 `pnpm-lock.yaml`
- 删除 `pnpm-workspace.yaml`
- 删除 `package.json` 中的 `packageManager` 字段
- 运行 `npm install` 重新生成 `package-lock.json`

## REMOVED Requirements

### Requirement: 语言切换设置
**Reason**: 无 i18n 实现，切换后页面文字不变
**Migration**: 从 SettingsPanel.astro 和 app.ts 中移除 lang 设置项

### Requirement: 光标特效设置
**Reason**: 用户要求移除
**Migration**: 从 SettingsPanel.astro 和 app.ts 中移除 cursorEffect 设置项
