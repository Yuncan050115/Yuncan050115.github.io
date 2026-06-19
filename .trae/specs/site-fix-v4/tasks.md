# Tasks

- [x] Task 1: 添加 RSS Atom feed
  - [x] SubTask 1.1: `npm install @astrojs/rss`
  - [x] SubTask 1.2: 创建 `src/pages/atom.xml.ts` 端点，使用 `getPosts()` 生成 Atom feed
  - [x] SubTask 1.3: 在 `BaseLayout.astro` 的 `<head>` 中添加 RSS link 标签

- [x] Task 2: 友人帐添加申请格式
  - [x] SubTask 2.1: 在 `src/pages/social/link.astro` 添加友链申请格式说明区块

- [x] Task 3: 删除白天背景动效
  - [x] SubTask 3.1: 移除白天模式 CSS 动画（7 个 keyframes + 应用规则）
  - [x] SubTask 3.2: initThree 白天模式跳过渲染

- [x] Task 4: 修复追番追剧页面
  - [x] SubTask 4.1: 统一 UI 样式（CSS 变量映射 + 卡片样式覆盖）
  - [x] SubTask 4.2: 修复主题切换响应（MutationObserver 监听 data-theme）
  - [x] SubTask 4.3: 修复分页（cloneNode 重新绑定事件）

- [x] Task 5: 修复 KaTeX 警告
  - [x] SubTask 5.1: 添加 `strict: false` 配置静默警告
  - [x] SubTask 5.2: 修复 5 篇文章中 45 处中文标点紧邻 `$` 的问题

- [x] Task 6: 重做光标
  - [x] SubTask 6.1: 移除 cursor-glow 和 cursor-ring 元素
  - [x] SubTask 6.2: 重写 initCursor（无 rAF 循环，直接跟随）
  - [x] SubTask 6.3: 重写光标 CSS（8px 圆点 + 悬停放大）
  - [x] SubTask 6.4: 移除粒子交互逻辑

- [x] Task 7: 修复加载超时
  - [x] SubTask 7.1: 朋友圈 fetch 添加 8 秒超时 + 重试按钮
  - [x] SubTask 7.2: Steam fetch 添加 8 秒超时 + 重试按钮
  - [x] SubTask 7.3: 重试按钮样式

# Task Dependencies
- Task 3 和 Task 6 都修改 app.ts，已顺序完成
- Task 5 修改 content.ts，与其他任务独立
- Task 1、2、4、7 互相独立，已并行完成
