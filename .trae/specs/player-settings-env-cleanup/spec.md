# 播放器歌单、设置修复、轻量管理页、环境变量、文件清理 Spec

## Why
用户反馈 5 个问题：播放器缺少歌单列表；默认字体应为京华老宋且设置面板频繁失效；希望支持网页端文章管理（增删改查）；.env 应完善管理所有站点配置和 API 且不泄露到 GitHub；清理未使用文件。

## What Changes
- 播放器：在 music-dock 中添加歌单列表容器（`data-music-list`），激活已有的 `renderQueue` 死代码
- **BREAKING** 默认字体：`--font-sans` 默认值改为京华老宋
- 设置面板修复：每次 `initSettings` 重置 `panel.style.display = 'none'`；修复 persist 后事件丢失
- **BREAKING** 超轻量管理页：FPS 按钮隐藏入口（连续点击 5 次），密码验证后进入管理页，支持文章列表、编辑（更新 updated 日期）、删除、新增
- **BREAKING** .env 完善：管理站点信息、API 链接、敏感凭证，构建时注入，.env 不提交 GitHub
- 文件清理：删除未使用文件

## Impact
- Affected code:
  - `src/layouts/BaseLayout.astro`（音乐播放器 HTML、字体、管理页入口）
  - `src/styles/site.css`（默认字体、歌单样式、管理页样式）
  - `src/scripts/app.ts`（设置面板修复、FPS 隐藏入口、管理页逻辑）
  - `src/config/yuncan.config.ts`（从 .env 读取所有配置）
  - `src/components/Twikoo.astro`（从 .env 读取 API）
  - `src/components/PostEditor.astro`（新建，轻量管理页）
  - `src/data/site.ts`（从 .env 读取站点信息）
  - `.env` / `.env.example`（新建/完善）
  - `.github/workflows/pages.yml`（添加构建步骤）
  - 删除多个未使用文件

## ADDED Requirements

### Requirement: 播放器歌单列表
音乐播放器 SHALL 显示歌单列表：
- 在 music-dock 中添加 `data-music-list` 容器
- 显示当前播放列表中的曲目（标题 + 艺术家）
- 当前播放曲目高亮
- 点击曲目切换播放
- 列表高度限制（最多 5 行），超出可滚动
- 样式与现有 music-dock 风格一致

### Requirement: 超轻量文章管理页
系统 SHALL 提供隐藏的文章管理入口：
- **入口触发**：连续点击 FPS 显示区域 5 次
- **密码验证**：密码从 .env 的 `POST_PASSWORD` 注入（构建时嵌入）；未设置密码或密码错误时无法进入
- **管理页功能**：
  - 文章列表：显示所有文章（标题、日期、分类），支持搜索
  - 编辑文章：加载文章 frontmatter 和正文，编辑后提交；**更新 `updated` 日期，`date`（创建日期）保持不变**
  - 删除文章：确认后删除
  - 新增文章：填写标题、分类、标签、描述、正文，自动生成 frontmatter
- **GitHub API 集成**：
  - 通过 GitHub API 的 Contents API 实现文件创建/更新/删除
  - TOKEN 从 .env 的 `GITHUB_TOKEN` 注入（构建时嵌入）
  - 仓库从 .env 的 `GITHUB_REPO` 读取
  - 分支从 .env 的 `GITHUB_BRANCH` 读取（默认 master）
  - 提交后触发 GitHub Actions 自动构建部署
- **安全降级**：
  - `GITHUB_TOKEN` 未配置时，管理页降级为"生成 markdown 供手动复制"模式
  - 所有 API 调用通过前端 fetch 直接调用 GitHub API（使用 fine-grained token，仅授权特定仓库的 contents:write）

#### Scenario: 隐藏入口触发
- **WHEN** 用户连续点击 FPS 区域 5 次
- **THEN** 显示密码输入框
- **WHEN** 输入正确密码
- **THEN** 进入管理页，显示文章列表
- **WHEN** 输入错误密码或未设置密码
- **THEN** 提示错误，无法进入

#### Scenario: 编辑文章
- **WHEN** 用户在管理页选择一篇文章并编辑
- **THEN** 加载文章 frontmatter 和正文到编辑器
- **WHEN** 用户修改内容并提交
- **THEN** 通过 GitHub API 更新文件，`updated` 字段更新为当前时间，`date` 字段保持不变
- **AND** 触发 GitHub Actions 重新构建部署

#### Scenario: 删除文章
- **WHEN** 用户点击删除并确认
- **THEN** 通过 GitHub API 删除文件
- **AND** 触发重新部署

#### Scenario: TOKEN 未配置降级
- **WHEN** GITHUB_TOKEN 未配置
- **THEN** 管理页显示"发布功能未配置"提示
- **AND** 新增/编辑文章时生成 markdown 内容供手动复制

### Requirement: 完善的环境变量管理
系统 SHALL 通过 .env 管理所有配置，分为三类：

**站点信息类（PUBLIC_ 前缀，构建时注入前端）：**
- `PUBLIC_SITE_NAME`：站点名称
- `PUBLIC_SITE_AUTHOR`：作者
- `PUBLIC_SITE_KEYWORDS`：SEO 关键词
- `PUBLIC_SITE_DESC`：站点简介
- `PUBLIC_SITE_URL`：站点地址
- `PUBLIC_SITE_LOGO`：站点主图标路径
- `PUBLIC_SITE_APPLE_LOGO`：Apple 端图标路径
- `PUBLIC_SITE_START`：建站日期（YYYY-MM-DD）
- `PUBLIC_SITE_ICP`：ICP 备案号（可为空）

**API 类（PUBLIC_ 前缀，前端需要使用）：**
- `PUBLIC_TWIKOO_API`：Twikoo 云函数 API 链接（未配置则不显示评论）
- `PUBLIC_METING_API`：MetingJS 音乐 API 链接（未配置则不显示播放器）
- `PUBLIC_SONG_ID`：播放歌单 ID（未配置则不显示播放器）
- `PUBLIC_BG_IMAGE_API`：默认背景图片 API（未配置则使用默认背景）
- `PUBLIC_STEAM_API_KEY`：Steam API Key

**敏感类（无 PUBLIC_ 前缀，仅构建时可用，不暴露到前端 JS）：**
- `POST_PASSWORD`：管理页密码
- `GITHUB_TOKEN`：GitHub fine-grained token（仅授权特定仓库 contents:write）
- `GITHUB_REPO`：仓库地址（如 `Yuncan050115/Yuncan050115.github.io`）
- `GITHUB_BRANCH`：源码分支（默认 master）

**安全措施：**
- `.env` 在 `.gitignore` 中，不提交到 GitHub
- `.env.example` 提供模板（不含真实值，含详细注释）
- 敏感变量不带 `PUBLIC_` 前缀，不会出现在前端 JS bundle 中
- `GITHUB_TOKEN` 使用 fine-grained token，仅授权特定仓库的 Contents 读写权限
- 管理页有密码作为第一道防线

#### Scenario: Meting API 未配置
- **WHEN** .env 中未设置 PUBLIC_METING_API 或 PUBLIC_SONG_ID
- **THEN** 音乐播放器不渲染

#### Scenario: Twikoo API 未配置
- **WHEN** .env 中未设置 PUBLIC_TWIKOO_API
- **THEN** 评论组件不渲染

### Requirement: GitHub Actions 自动构建部署
`.github/workflows/pages.yml` SHALL 在 master 分支推送时自动构建并部署到 main 分支：
- 触发条件：push 到 master 分支
- 步骤：checkout → install → build → 部署 dist/ 到 main 分支
- 环境变量从 GitHub Secrets 读取（与 .env 对应）

#### Scenario: 推送文章到 master
- **WHEN** 通过管理页创建/编辑/删除文章（推送到 master）
- **THEN** GitHub Actions 自动触发
- **AND** 构建最新内容并部署到 main 分支（GitHub Pages）

### Requirement: 文件清理
删除以下未使用文件：
- `scripts/regenerate-images.mjs`
- `scripts/generate-real-images.mjs`
- `build-log.txt`
- `pnpm-workspace.yaml`（如无 workspace 需求）

## MODIFIED Requirements

### Requirement: 默认字体
网站默认字体 SHALL 使用京华老宋：
- `--font-sans` 的首选字体改为 `'JinghuaLaosong'`
- 设置面板中"默认"选项对应京华老宋

### Requirement: 设置面板持久性
设置面板 SHALL 修复以下问题：
1. **每次页面加载重置弹窗状态**：`initSettings()` 开头将 `panel.style.display` 重置为 `'none'`
2. **persist 后事件重新绑定**：`initSettings()` 每次执行时重新绑定所有事件（已有 removeEventListener 保护）
3. **设置值不丢失**：设置值存储在 localStorage，不受页面切换影响

### Requirement: 站点配置从 .env 读取
`yuncan.config.ts` 和 `src/data/site.ts` SHALL 从 `import.meta.env` 读取所有站点配置：
- 站点名称、作者、关键词、简介、URL、Logo、建站日期、ICP 备案号
- Twikoo API、Meting API、歌单 ID、背景图 API、Steam API Key
- 所有配置有默认值回退，.env 未设置时使用默认值

## REMOVED Requirements
无
