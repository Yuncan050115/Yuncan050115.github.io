# 站点全面优化 v3 Spec

## Why

博客存在多项体验和功能缺陷：AI 占位图影响内容质量、代码块无语法高亮、追番系统是静态 JSON 无法更新、移动端导航栏无法正常使用、右键菜单不显示、光标卡顿、夜间模式朋友圈看不清等。需要一次性解决这 10 项问题，提升全站体验。

## What Changes

1. **删除 AI 图片**：删除 `content/assets/` 下 57 张 `ai-*` 图片，清理 11 篇文章中对这些图片的引用
2. **朋友圈样式重做**：修复 CSS 变量名不匹配（`--border`→`--line`、`--text-1`→`--text` 等），重做卡片设计，适配夜间模式
3. **代码高亮 + 数学公式**：集成 Shiki 实现代码语法高亮（shell/xml/python/c/c++/go/html 等），集成 KaTeX 实现数学公式渲染
4. **追番追剧改用 astro-bangumi**：安装 `astro-bangumi` 包，替换静态 JSON 方案为 B 站 API 动态获取，通过 env 配置 B 站 UID
5. **置顶提示 + 玩页面加载态**：归档页和首页文章列表添加置顶徽章；steamgames 页面改为客户端加载 + loading 占位
6. **光标流畅 + 全局主题色**：优化光标插值系数和过渡，设置面板新增全局主题色选择器
7. **清理废弃页面 + 优化加载**：删除 `life/games.astro`、`life/movies.astro` 废弃重定向页，优化全站加载逻辑
8. **右键菜单修复**：修复右键菜单不显示的问题（类名冲突 / 事件绑定时序）
9. **移动端导航修复**：修复汉堡菜单类名不一致（`app.ts` 用 `.open`，CSS 用 `.is-open`），优化导航栏响应式
10. **重写 README**：将"之江影集"的 README 替换为云灿博客项目的正确 README

## Impact

- Affected code: `content/assets/`、11 篇文章 Markdown、`src/pages/social/circle.astro`、`src/styles/site.css`、`astro.config.mjs`、`src/lib/content.ts`、`src/pages/bangumis.astro`、`src/pages/cinemas.astro`、`src/pages/archives.astro`、`src/pages/index.astro`、`src/pages/steamgames.astro`、`src/scripts/app.ts`、`src/layouts/BaseLayout.astro`、`src/components/SettingsPanel.astro`、`src/pages/life/`、`README.md`、`.env`、`package.json`

## ADDED Requirements

### Requirement: 代码语法高亮
系统 SHALL 在文章代码块中渲染语法高亮，支持 shell、xml、python、c、c++、go、html、javascript、typescript、nginx、cmd 等常见语言，浅色和深色模式均有对应配色。

#### Scenario: 文章包含代码块
- **WHEN** 文章 Markdown 中包含 ```python 代码块
- **THEN** 渲染后的代码块中关键字、字符串、注释等有不同颜色高亮

### Requirement: 数学公式渲染
系统 SHALL 支持 KaTeX 数学公式渲染，行内公式用 `$...$`，块级公式用 `$$...$$`。

#### Scenario: 文章包含数学公式
- **WHEN** 文章 Markdown 中包含 `$E=mc^2$`
- **THEN** 渲染为行内数学公式

### Requirement: 追番追剧动态获取
系统 SHALL 通过 astro-bangumi 集成从 B 站 API 动态获取追番追剧数据，UID 通过环境变量 `PUBLIC_BILIBILI_UID` 配置。

#### Scenario: 配置了 B 站 UID
- **WHEN** `.env` 中设置了 `PUBLIC_BILIBILI_UID`
- **THEN** 追番页和追剧页从 B 站 API 获取最新数据并渲染

### Requirement: 全局主题色设置
系统 SHALL 在设置面板中提供全局主题色选择器，用户选择后全站 `--accent` 变量实时更新并持久化。

#### Scenario: 用户切换主题色
- **WHEN** 用户在设置面板选择新的主题色
- **THEN** 全站强调色（链接、按钮、徽章等）立即更新

### Requirement: 玩页面加载状态
系统 SHALL 在 steamgames 页面显示加载中占位，数据加载完成后渲染内容，加载失败显示错误提示。

#### Scenario: Steam API 响应慢
- **WHEN** Steam API 响应超过 3 秒
- **THEN** 页面显示"加载中..."占位而非白屏等待

## MODIFIED Requirements

### Requirement: 朋友圈页面样式
朋友圈卡片 SHALL 使用正确的 CSS 变量（`--line`、`--text`、`--muted`、`--accent`），在浅色和深色模式下均有良好的可读性和设计感。

### Requirement: 置顶文章标识
文章列表（首页、归档页）中的置顶文章 SHALL 显示"置顶"徽章标识。

### Requirement: 自定义光标
光标 SHALL 流畅跟手，dot 即时跟随无延迟，ring 缓动系数优化至 0.18-0.25 减少拖尾延迟感。

### Requirement: 移动端导航
移动端导航栏 SHALL 通过汉堡菜单正常展开/收起，修复类名不一致问题，导航项全屏抽屉式展示。

### Requirement: 右键菜单
右键菜单 SHALL 正常显示，或完全移除自定义右键菜单恢复浏览器默认行为。

## REMOVED Requirements

### Requirement: AI 占位图片
**Reason**: 57 张 AI 生成图片作为"原图遗失"占位，影响内容质量
**Migration**: 删除图片文件，文章中对应的图片引用行一并删除

### Requirement: 静态 JSON 追番数据
**Reason**: 静态 JSON 无法自动更新，新增追番需手动维护
**Migration**: 改用 astro-bangumi 从 B 站 API 动态获取

### Requirement: 废弃重定向页面
**Reason**: `life/games.astro` 和 `life/movies.astro` 是无用重定向占位
**Migration**: 直接删除，导航中无对应链接
