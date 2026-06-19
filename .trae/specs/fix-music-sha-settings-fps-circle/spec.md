# 5 个 Bug 修复 Spec

## Why
5 个 bug：音乐 API 配置格式错误导致播放器不可用；编辑文章时 sha 缺失导致保存失败；设置面板因 boot() 双重执行和缺少 dataset.ready 防重复导致点不开且切换页面消失；FPS/运行天数因 transition:name 与 transition:persist 冲突导致重复显示；朋友圈需要部署说明。

## What Changes
- 音乐 API：修正 .env 中 PUBLIC_METING_API 为完整模板 URL（含 `/api` 路径和 `:server` 等占位符）
- GitHub sha：editPost 的 `if (post.url)` 分支补上 `post.sha` 赋值到 `#pe-file-sha`
- **BREAKING** 设置面板：initSettings 改用 dataset.ready 防重复（参照 initTheme 模式）；移除 SettingsPanel.astro 根 div 多余的 transition:persist（父级 header 已 persist）；移除 boot() 末尾直接调用，只保留 astro:page-load 监听
- FPS 重复：移除 .runtime-tools 上的 transition:name，只保留 transition:persist
- 朋友圈：在 circle.astro 中添加部署说明，修改 fc_settings.yaml 的 LINK 为用户友链页

## Impact
- Affected code:
  - `.env`（PUBLIC_METING_API 修正为完整模板）
  - `src/scripts/app.ts`（editPost sha 修复、initSettings dataset.ready、boot() 移除直接调用）
  - `src/components/SettingsPanel.astro`（移除根 div transition:persist）
  - `src/layouts/BaseLayout.astro`（移除 .runtime-tools 的 transition:name）
  - `src/pages/social/circle.astro`（添加部署说明）
  - `hexo-circle-of-friends-main/fc_settings.yaml`（LINK 改为用户友链页）

## MODIFIED Requirements

### Requirement: 音乐 API 配置
PUBLIC_METING_API 必须填完整模板 URL：`https://music.yuncan.xyz/api?server=:server&type=:type&id=:id&r=:r`
- buildMusicUrl 通过 .replace() 替换占位符拼接最终 URL
- 裸域名缺少 /api 路径和占位符，导致 .replace() 无效

### Requirement: GitHub API 编辑文章 sha
editPost 函数的 `if (post.url)` 分支必须设置 `#pe-file-sha`：
- `loadPostList` 已从 GitHub API 获取并保存 `post.sha`
- `editPost` 中无论走哪个分支获取内容，都必须把 `post.sha` 写入 `#pe-file-sha` 隐藏域
- 保存时从 `#pe-file-sha` 读取 sha，传给 GitHub API

### Requirement: 设置面板事件绑定
initSettings 必须使用 dataset.ready 防重复绑定（与 initTheme 一致）：
- 首次执行时设置 `toggle.dataset.ready = 'true'` 并绑定事件
- 后续执行时检测到 `dataset.ready === 'true'` 则跳过事件绑定，只调用 applySettings()
- 移除 SettingsPanel.astro 根 div 的 transition:persist（父级 header 已 persist，嵌套 persist 干扰 DOM 匹配）
- 移除 app.ts 末尾的直接 boot() 调用，只保留 `document.addEventListener('astro:page-load', boot)`

### Requirement: FPS 和运行天数不重复
.runtime-tools 移除 transition:name，只保留 transition:persist：
- transition:name 和 transition:persist 语义冲突，导致旧 DOM 保留 + 新 DOM 插入
- 只用 transition:persist 即可保留 DOM 跨页面

### Requirement: 朋友圈部署说明
circle.astro 未配置 API 时显示部署说明：
- 提示用户需部署 fircle 到 Vercel
- 提示修改 fc_settings.yaml 的 LINK
- 提示将 API 地址填入 .env
