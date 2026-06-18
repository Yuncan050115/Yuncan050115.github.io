# 精修与开源准备 Spec

## Why
上一轮修复后用户反馈：赞赏弹窗白天仍不可见、标签/友链页面悬停动效导致位置跳动与文字溢出、白天光效"黑黄一大坨"刺眼而夜间光效虽美但卡顿、全站文案文风虚假不像用户自写、浏览器无 favicon、两个项目需整理后开源。

## What Changes
- 修复赞赏弹窗：消除白天模式 `panel-rise-light` 动画 `transform: translateY(0)` 与 `filter: blur(0)` 创建包含块导致 `position: fixed` 失效的问题；将弹窗 DOM 提升至 body 直接子级以脱离 main 层叠上下文
- 优化标签/友链悬停动效：改用 `transform: scale` 替代 `flex` 过渡避免重排；补充 `overflow`/`min-width:0`/文本截断防止文字溢出；降低触发灵敏度
- 重做白天光效：改用 `screen` 或 `soft-light` 混合模式柔化、降低 opacity、引入冷色调平衡、降低 core 亮度系数、增加呼吸闪烁
- 优化夜间光效：轻微削弱亮度、加 FPS 节流（约 30-40fps）、降低 DPR 上限至 1.0 以减少卡顿
- 统一全站文风：参照诗集序言的坦诚自省文风，重写旧时光 timeline、13 处 PageHero 描述、首页 entrances、赞赏文案等"小站文学"腔文字
- 添加浏览器 favicon：将 `<link rel="icon">` 指向已有 `logo-yuncan.png` 并补全 apple-touch-icon
- **BREAKING** 整理 blog 项目：补全 `.gitignore`、为 `yuncan.config.ts` 添加注释、新增 `README.md`、删除杂散文件与调试脚本、精简旧 Hexo 项目未引用的主题/构建文件、移除明文 API Key
- **BREAKING** 整理 navigate 项目：删除 Vite 遗留配置（vite.config.js、index.html、重复 lint 配置、旧 style 目录）、处理敏感 .env、更新 CODE_OF_CONDUCT 邮箱、统一作者信息、保留 imsyy LICENSE 版权

## Impact
- Affected specs: fix-round-3（动效与播放器相关部分需复核）
- Affected code:
  - `src/pages/posts/[slug].astro`、`src/layouts/BaseLayout.astro`（赞赏弹窗 DOM 提升与 favicon）
  - `src/styles/site.css`（panel-rise-light 修复、tag-cloud/friend-grid 动效重做、#breath-scene 光效调整）
  - `src/scripts/app.ts`（Three.js 白天重做、夜间 FPS 节流）
  - `src/pages/site/time.astro`、`src/pages/tags/index.astro`、`src/pages/social/link.astro`、`src/pages/archives.astro`、`src/pages/poems.astro`、`src/pages/comments.astro`、`src/pages/categories/index.astro`、`src/pages/personal/about.astro`、`src/pages/personal/love.astro`、`src/pages/cinemas.astro`、`src/pages/bangumis.astro`、`src/pages/projects.astro`、`src/pages/steamgames.astro`、`src/pages/index.astro`、`src/pages/404.astro`（文风重写）
  - `src/config/yuncan.config.ts`（注释、赞赏文案、API Key 处理）
  - 根目录 `.gitignore`、`README.md`（新增）、杂散文件删除
  - `navigatepage/` 多文件清理与署名更新

## ADDED Requirements

### Requirement: 赞赏弹窗正常显示
系统 SHALL 确保赞赏弹窗在白天和夜间模式下都能相对于视口正确定位并完整可见：
- 消除祖先元素 `transform`/`filter` 非 none 值对 `position: fixed` 的破坏
- 弹窗 DOM 不被困在 main 的层叠上下文内，z-index 能覆盖 header/music-dock

#### Scenario: 白天模式打开赞赏
- **WHEN** 用户在白天模式下点击"赞赏作者"
- **THEN** 二维码面板在视口正中央显示，可正常关闭

### Requirement: 标签/友链悬停动效稳定
系统 SHALL 确保标签云和友链卡片的悬停动效不引起布局重排和文字溢出：
- 使用 `transform: scale` 替代 `flex` 过渡（transform 不触发回流）
- 子项内容有 `overflow`/`min-width:0`/文本截断保护
- 光标在项之间移动时无剧烈跳动

#### Scenario: 光标在标签间移动
- **WHEN** 光标在标签云内移动
- **THEN** 被悬停标签平滑放大，其他标签轻微淡化，无位置跳动，无文字溢出

### Requirement: 白天光效柔和美观
系统 SHALL 提供柔和美观的白天背景光效：
- 混合模式改为 `screen` 或 `soft-light` 柔化叠加
- opacity 降至 0.5-0.65
- 引入冷色调（白/浅蓝）平衡全暖色
- 降低 core 亮度系数，增加呼吸闪烁
- 不再出现"黑黄一大坨"刺眼效果

#### Scenario: 白天查看页面
- **WHEN** 用户在白天模式访问页面
- **THEN** 背景有柔和的光点漂浮，不刺眼，不形成大块亮斑

### Requirement: 夜间光效流畅
系统 SHALL 在保持夜间星空美感的同时减少卡顿：
- 轻微削弱亮度（opacity 0.85 → 0.7）
- 加 FPS 节流（约 30-40fps）
- DPR 上限降至 1.0
- 保留流星与闪烁效果

#### Scenario: 夜间查看页面
- **WHEN** 用户在夜间模式访问页面
- **THEN** 背景星空柔美流畅，无明显卡顿

### Requirement: 全站文风统一
系统 SHALL 将全站文案统一为用户诗集序言的坦诚自省文风：
- 旧时光 timeline 四段文字重写
- 13 处 PageHero 描述重写
- 首页 entrances 与分类卡文案重写
- 赞赏文案重写
- 不再使用"小站文学"腔的过度修饰

#### Scenario: 文风一致性
- **WHEN** 用户浏览各页面
- **THEN** 文案读起来像用户自己写的，坦诚、具体、不矫饰

### Requirement: 浏览器 favicon
系统 SHALL 为浏览器标签页提供 favicon：
- `<link rel="icon">` 指向实际存在的图片资源
- 补全 apple-touch-icon

#### Scenario: 浏览器标签
- **WHEN** 用户打开站点
- **THEN** 浏览器标签页显示站点 logo 图标

### Requirement: blog 项目开源准备
系统 SHALL 整理 blog 项目以便开源：
- `.gitignore` 补全（dist、node_modules、.astro、.netlify）
- `yuncan.config.ts` 添加配置注释
- 新增 `README.md`（项目介绍、技术栈、使用说明、致谢）
- 删除杂散文件（根目录 wx.jpg/zfb.jpg、check_sort.js、pnpm-workspace.yaml 占位）
- 精简旧 Hexo 项目未引用文件（themes、scaffolds、gulpfile.js 等）
- 移除明文 API Key（改为环境变量或占位符）

#### Scenario: 开源就绪
- **WHEN** 开发者 clone 项目
- **THEN** 有 README 指引，配置有注释，无敏感信息，无冗余文件

### Requirement: navigate 项目开源准备
系统 SHALL 整理 navigate 项目以便开源：
- 删除 Vite 遗留配置（vite.config.js、index.html、重复 eslint/prettier 配置、旧 style 目录）
- 删除一次性迁移脚本与占位文件
- `.env` 改为 `.env.example` 模板
- 更新 CODE_OF_CONDUCT 邮箱或删除
- 统一作者信息（README 与 package.json 一致）
- 保留 imsyy LICENSE 版权署名（MIT 协议要求）

#### Scenario: 开源就绪
- **WHEN** 开发者 clone 项目
- **THEN** 无重复配置，无敏感信息，原项目版权正确保留，作者信息一致

## MODIFIED Requirements

### Requirement: Three.js 背景动效
- 白天：柔和光点（screen 混合、冷色调平衡、呼吸闪烁）
- 夜间：柔美星空（轻微削弱、FPS 节流、DPR 降至 1.0）
- 不硬锁 FPS 到 60，但加合理节流减少卡顿

### Requirement: 标签页面与友链页面
- 悬停动效改用 transform 而非 flex
- 防止文字溢出与位置跳动

## REMOVED Requirements

### Requirement: 旧 Hexo 项目冗余文件
**Reason**: 开源精简，未被 content.ts 引用
**Migration**: 保留 content.ts 实际引用的 _posts/_data/页面.md，删除 themes/scaffolds/gulpfile.js 等构建文件
