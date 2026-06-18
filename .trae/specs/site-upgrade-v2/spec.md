# 全站体验升级与修复 Spec

## Why
用户反馈上一轮修改后多个功能仍然存在问题（音乐播放器被改坏、诗集解析吞字、动效完全消失、右键菜单失效、赞赏弹窗无内容、导航栏无过渡），同时需要新增功能（友链/朋友圈、配置完善、性能优化、主站联动重构）。

## What Changes
- 修复音乐播放器：恢复可用状态，主题适配（日间浅色/夜间深色），无右侧空白
- 重做诗集页面：修复解析器吞字问题，去掉强制置顶，完整渲染诗集.md 内容
- 重写 Three.js 动效：白天用气泡/光斑效果，夜间用星空效果，光标互动流畅
- 全局动效：将主页分类的 Flex 悬停展开丝滑动效思路扩展到归档、友链等页面
- 修复右键菜单：确保 contextmenu 事件正确阻止默认行为并显示自定义菜单
- 修复赞赏弹窗：确保收款码图片正常显示，弹窗内容可见
- 导航栏过渡：导航栏宽度变化时添加平滑过渡动画
- 友链系统：友人帐改为友链，下设友人帐和朋友圈两个子页面，集成 Fcircle
- 配置完善：将散落的硬编码配置项统一到 yuncan.config.ts
- 性能优化：优化全页面加载和渲染速度，不硬锁 FPS
- 主站重构：根据 blog 风格重构 navigatepage 项目，更新信息，两站联动

## Impact
- Affected code: `src/styles/site.css`, `src/scripts/app.ts`, `src/layouts/BaseLayout.astro`, `src/pages/poems.astro`, `src/pages/social/link.astro`, `src/pages/posts/[slug].astro`, `src/config/yuncan.config.ts`, `src/lib/content.ts`, `navigatepage/` 全项目

## ADDED Requirements

### Requirement: 音乐播放器修复
系统 SHALL 提供可用的音乐播放器：
- 紧凑圆形默认状态（74px），悬停展开显示歌单
- 日间模式：浅色半透明背景，深色文字
- 夜间模式：深色半透明背景，浅色文字
- 无右侧空白，歌单区域仅在悬停时展开
- 分时段自动切换日间/夜间模式（6:00-18:59 日间，其余夜间）

#### Scenario: 播放器正常显示
- **WHEN** 用户访问任意页面
- **THEN** 音乐播放器以紧凑圆形显示在右下角，无多余空白

### Requirement: Three.js 动效重做
系统 SHALL 提供明显的背景动效：
- 白天模式：气泡/光斑漂浮效果，金色/暖色调，肉眼明显可见
- 夜间模式：星空闪烁效果，蓝紫色调
- 光标互动：气泡/粒子跟随光标产生排斥效果，响应流畅
- 性能：不硬锁 FPS，使用 requestAnimationFrame 自适应调度

#### Scenario: 白天动效可见
- **WHEN** 用户处于日间模式
- **THEN** 背景有明显可见的气泡/光斑漂浮效果

#### Scenario: 光标互动
- **WHEN** 用户移动光标
- **THEN** 附近气泡/粒子产生排斥效果，响应流畅无卡顿

### Requirement: 友链系统
系统 SHALL 提供友链页面，下设两个子页面：
- 友人帐：保留现有友链卡片展示
- 朋友圈：集成 Fcircle 友圈功能，展示友站最新文章

#### Scenario: 友链导航
- **WHEN** 用户访问友链页面
- **THEN** 可在友人帐和朋友圈之间切换

### Requirement: 诗集页面重做
系统 SHALL 正确解析并完整渲染诗集.md：
- 不丢失任何诗文内容（修复吞字问题）
- 去掉强制置顶逻辑
- 提供目录视图和时间轴视图
- 防复制保护（禁止右键、Ctrl+C、F12）

#### Scenario: 内容完整
- **WHEN** 诗集页面渲染
- **THEN** 诗集.md 中所有诗文内容完整显示，无丢失

### Requirement: 主站重构与联动
系统 SHALL 根据 blog 项目风格重构 navigatepage：
- 更新标题（非 yuncan.xyz）、GitHub、邮箱等信息
- 强化加载速度和动效
- 废弃无用功能
- 两站联动：blog 有入口前往主站，主站播放器优点吸取到 blog

#### Scenario: 站点联动
- **WHEN** 用户在 blog 站点
- **THEN** 有明确入口可前往主站

## MODIFIED Requirements

### Requirement: 全局丝滑动效
系统 SHALL 将主页分类的 Flex 悬停展开动效思路扩展到全局：
- 归档页面：卡片悬停展开效果
- 友链页面：友链卡片悬停展开效果
- 使用 `cubic-bezier(.16, 1, .3, 1)` 缓动函数
- 不修改主页分类区域现有代码

### Requirement: 导航栏过渡
系统 SHALL 在导航栏宽度变化时提供平滑过渡：
- 滚动时导航栏从宽变窄有过渡动画
- 使用 `cubic-bezier(.16, 1, .3, 1)` 缓动

### Requirement: 右键菜单
系统 SHALL 提供自定义右键菜单：
- 阻止默认右键菜单
- 显示自定义菜单选项
- 页面切换后正常工作

### Requirement: 赞赏弹窗
系统 SHALL 正确显示赞赏弹窗内容：
- 收款码图片正常加载显示
- 弹窗内容（标题、文字、图片）完整可见

### Requirement: 配置完善
系统 SHALL 将所有可配置项统一到 yuncan.config.ts：
- 导航菜单、社交链接、友链数据等
- 减少硬编码

### Requirement: 性能优化
系统 SHALL 在不伤害功能和特效前提下优化全页面速度：
- 不硬锁 FPS 到 60
- 优化资源加载、渲染性能
