# 第三轮修复与优化 Spec

## Why
上一轮修改后用户反馈多项问题未解决或新产生：朋友圈功能无法使用、诗集时间轴顺序错乱且序丢失、播放器歌单列表丑陋、归档页面丢失了原有的时间块样式、动效完全不可见、导航站文字看不清等。

## What Changes
- 删除朋友圈功能（用户明确要求：做不到就删掉）
- 修复诗集：时间轴按真实日期排序、显示序言、目录改名"诗集"、显示配图、增大字号
- 重做播放器悬停内容：参考导航站播放器风格，移除丑陋的歌单列表
- 恢复归档页面原有的时间块样式（archive-row/archive-item）
- 标签页面应用丝滑悬停动效
- 主页分类区域提到最近文章前面
- 修复 Three.js 动效不可见问题（z-index/opacity 冲突）
- 修复导航站文字看不清问题
- 两站优点互补

## Impact
- Affected code: `src/pages/poems.astro`, `src/pages/social/link.astro`, `src/pages/archives.astro`, `src/pages/index.astro`, `src/pages/tags/index.astro`, `src/styles/site.css`, `src/scripts/app.ts`, `src/layouts/BaseLayout.astro`, `navigatepage/src/styles/style.scss`, `navigatepage/src/components/*.vue`

## ADDED Requirements

### Requirement: 删除朋友圈功能
系统 SHALL 移除朋友圈功能，友链页面仅保留友人帐：
- 删除朋友圈标签页
- 移除 Fcircle 相关代码和配置
- 友链页面恢复为单页面展示友链卡片

#### Scenario: 友链页面
- **WHEN** 用户访问友链页面
- **THEN** 仅显示友人帐友链卡片，无朋友圈标签

### Requirement: 诗集时间轴正确排序
系统 SHALL 按真实日期排序诗集时间轴：
- 正确解析中文数字日期（二〇一九年七月七日 → 20190707）
- 按日期从早到晚或从晚到早排序
- 日期无法解析的诗排在最后

#### Scenario: 时间轴排序
- **WHEN** 用户查看时间轴视图
- **THEN** 诗篇按日期顺序排列，不再出现 2021→2019→2025 的乱序

### Requirement: 诗集序言显示
系统 SHALL 显示诗集.md 中的序言内容：
- 解析 `# 序` 到 `# 说明` 之间的内容作为序言
- 在诗集页面顶部显示序言

#### Scenario: 序言显示
- **WHEN** 用户访问诗集页面
- **THEN** 页面顶部显示序言内容

### Requirement: 诗集配图显示
系统 SHALL 在诗篇卡片中显示配图：
- 不再仅显示"X 张配图"文字
- 实际渲染配图图片（使用 referrerpolicy="no-referrer" 避免防盗链）

#### Scenario: 配图显示
- **WHEN** 诗篇有配图
- **THEN** 卡片中显示配图图片缩略图

### Requirement: Three.js 动效可见
系统 SHALL 确保背景动效在白天和夜间都明显可见：
- 修复 CSS 中多处 #breath-scene 的 z-index/opacity 冲突
- 确保 canvas 在背景层但可见
- 白天：气泡效果明显可见
- 夜间：星空效果明显可见

#### Scenario: 动效可见
- **WHEN** 用户访问任意页面
- **THEN** 背景有明显可见的动效（白天气泡/夜间星空）

## MODIFIED Requirements

### Requirement: 诗集页面
- 目录视图按钮改名为"诗集"（而非"目录"）
- 增大字号，确保可读性
- 保留防复制保护

### Requirement: 音乐播放器悬停内容
- 移除丑陋的歌单列表布局
- 参考导航站播放器风格：简洁的播放控制 + 歌曲信息
- 悬停时显示：封面、歌曲名、艺术家、播放/暂停按钮、上一首/下一首
- 不显示完整歌单列表

### Requirement: 归档页面
- 恢复原有的时间块样式（archive-row + archive-item）
- 左侧年份标签，右侧文章列表
- 保留丝滑悬停动效

### Requirement: 标签页面
- 应用丝滑悬停动效（类似主页分类）
- 标签悬停时展开/高亮

### Requirement: 主页布局
- 分类区域提到最近文章前面
- 分类是用户最喜欢的设计，应该优先展示

### Requirement: 导航站可读性
- 修复导航站文字颜色对比度
- 确保所有文字清晰可读

### Requirement: 两站互补
- blog 吸取导航站播放器优点
- 导航站吸取 blog 的动效和主题适配
