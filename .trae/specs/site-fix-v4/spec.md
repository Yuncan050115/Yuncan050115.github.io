# 站点体验修复 v4 Spec

## Why

站点存在多个严重影响使用的 bug：追番追剧页面分页失效且数据不准确、朋友圈和 Steam 页面 fetch 无超时导致无限加载、KaTeX 每帧输出大量警告拖慢全局、自定义光标卡顿且丑陋、缺少 RSS feed、友人帐无申请格式、白天背景动效多余。

## What Changes

1. **添加 RSS feed**：集成 `@astrojs/rss`，生成 `https://blog.yuncan.xyz/atom.xml`
2. **友人帐申请格式**：在友链页底部添加友链申请格式说明模板
3. **删除白天背景动效**：移除白天模式下的太阳/光波/云朵 CSS 动画和 Three.js 白天粒子效果（保留夜间星空+流星）
4. **修复追番追剧页面**：修复 astro-bangumi 分页 bug（MutationObserver 未监听 `data-theme`）、统一 UI 样式、确保数据准确
5. **优化全局速度**：修复 KaTeX 中文标点 math mode 警告、移除多余 rAF 循环、优化 MutationObserver
6. **重做光标**：移除三层光标（dot/ring/glow），改为简洁单层光标，移除与 Three.js 粒子的交互
7. **修复加载超时**：朋友圈和 Steam 页面 fetch 添加 AbortController 超时（8 秒），超时后显示错误提示和重试按钮

## Impact

- Affected code: `astro.config.mjs`、`package.json`、`src/pages/social/link.astro`、`src/pages/social/circle.astro`、`src/pages/steamgames.astro`、`src/pages/api/steamgames.json.ts`、`src/pages/bangumis.astro`、`src/pages/cinemas.astro`、`src/lib/content.ts`、`src/scripts/app.ts`、`src/styles/site.css`、`src/layouts/BaseLayout.astro`、`content/posts/`（5 篇算法文章）

## ADDED Requirements

### Requirement: RSS Feed
系统 SHALL 在 `/atom.xml` 提供 Atom 格式的 RSS feed，包含所有已发布文章的标题、链接、摘要和发布日期。

#### Scenario: 用户订阅 RSS
- **WHEN** 用户访问 `https://blog.yuncan.xyz/atom.xml`
- **THEN** 返回有效的 Atom XML feed，包含最新文章列表

### Requirement: 友链申请格式
友人帐页面 SHALL 在底部显示友链申请格式模板，包含站点名、链接、头像、描述等字段示例。

#### Scenario: 访客查看友链页
- **WHEN** 访客浏览友人帐页面
- **THEN** 页面底部显示友链申请格式说明，方便访客按格式申请交换友链

### Requirement: 加载超时保护
朋友圈和 Steam 页面的客户端 fetch SHALL 设置 8 秒超时，超时后显示错误提示和重试按钮。

#### Scenario: API 响应超时
- **WHEN** 朋友圈或 Steam API 超过 8 秒未响应
- **THEN** 页面显示"加载超时，请重试"提示和重试按钮，而非无限加载

## MODIFIED Requirements

### Requirement: 追番追剧页面
追番追剧页面 SHALL 正确显示番剧/影视数量、分页按钮可正常点击切换、UI 样式与全站统一。astro-bangumi 组件 SHALL 在主题切换时自动响应深色/浅色模式。

### Requirement: 自定义光标
光标 SHALL 为简洁单层设计（一个小圆点），流畅跟手无延迟，不与 Three.js 粒子系统交互。仅在 `pointer: fine` 设备启用。

### Requirement: 背景动效
背景动效 SHALL 仅在夜间模式显示（星空粒子+流星），白天模式为静态背景无动画。

### Requirement: 数学公式渲染
KaTeX 渲染 SHALL 静默处理中文标点警告，不在控制台输出 `unicodeTextInMathMode` 警告。

## REMOVED Requirements

### Requirement: 三层自定义光标
**Reason**: dot+ring+glow 三层光标导致卡顿，与粒子系统交互增加性能负担
**Migration**: 替换为简洁单层光标

### Requirement: 白天背景动效
**Reason**: 白天太阳/光波/云朵动画多余且消耗性能
**Migration**: 白天模式改为静态背景
