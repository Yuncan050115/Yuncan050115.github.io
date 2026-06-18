# Tasks

- [x] Task 1: 回退并修复音乐播放器样式
  - [x] SubTask 1.1: 回退 `.music-dock` 样式到上一版本（紧凑圆形设计）
  - [x] SubTask 1.2: 添加主题适配：日间白色/浅色背景，夜间灰黑色背景
  - [x] SubTask 1.3: 确保歌单区域仅在悬停时展开，默认紧凑无空白
  - [x] SubTask 1.4: 验证分时段自动切换功能已存在（BaseLayout.astro 内联脚本）

- [x] Task 2: 重写 Three.js 动效，优化性能和白天可见度
  - [x] SubTask 2.1: 减少粒子数量（从 1500/1000 降至 600/400），优化性能
  - [x] SubTask 2.2: 重新设计白天模式动效：金色/橙色光晕，暖色粒子，提高透明度
  - [x] SubTask 2.3: 优化光标互动：使用更简单的排斥算法，减少计算量
  - [x] SubTask 2.4: 修复 shader 语法错误（line 643 有括号问题）
  - [x] SubTask 2.5: 确保 `#breath-scene` canvas 的 mix-blend-mode 和 opacity 设置正确

- [x] Task 3: 优化 Steam 游戏页面加载
  - [x] SubTask 3.1: 检查 `getSteamGames()` 函数是否正确使用配置中的 steamId
  - [x] SubTask 3.2: 添加加载状态提示，避免页面卡顿感
  - [x] SubTask 3.3: 减少 API 超时时间，失败时快速显示友好提示
  - [x] SubTask 3.4: 验证 Steam API Key 和 steamId 配置正确

- [x] Task 4: 修复右键菜单初始化
  - [x] SubTask 4.1: 检查 `initContextMenu()` 是否在 `astro:page-load` 时正确调用
  - [x] SubTask 4.2: 确保 `#context-menu` 元素存在且样式正确
  - [x] SubTask 4.3: 验证 `contextmenu` 事件监听器正确阻止默认行为

- [x] Task 5: 研究主页分类 UI 设计原理（不修改代码）
  - [x] SubTask 5.1: 分析 `.hydro-category-slices-lite` 和 `.hydro-category-slice-lite` CSS 实现
  - [x] SubTask 5.2: 记录 Flex 悬停展开效果的关键 CSS 属性
  - [x] SubTask 5.3: 记录缓动函数和过渡时间参数

- [x] Task 6: 重做诗集页面
  - [x] SubTask 6.1: 解析 `诗集.md` 文件，提取辑分组信息
  - [x] SubTask 6.2: 实现按目录视图：古生古色风格（古典边框、竖排文字风格）
  - [x] SubTask 6.3: 实现按时间轴视图：保持现有时间线设计
  - [x] SubTask 6.4: 置顶白云山诗篇（带配图）
  - [x] SubTask 6.5: 添加防复制保护：禁止右键、禁止 Ctrl+C、禁止 F12
  - [x] SubTask 6.6: 添加视图切换按钮

- [x] Task 7: 修复文章赞赏弹窗
  - [x] SubTask 7.1: 检查赞赏弹窗 CSS 样式是否正确
  - [x] SubTask 7.2: 检查 `data-reward-toggle` 和 `data-reward-close` 按钮事件绑定
  - [x] SubTask 7.3: 验证收款码图片路径正确（`/assets/zfb.jpg` 和 `/assets/wx.jpg`）

- [x] Task 8: 构建验证
  - [x] SubTask 8.1: 运行 `npm run build` 确保无错误
  - [x] SubTask 8.2: 验证所有页面正常生成

# Task Dependencies
- Task 2 依赖 Task 1（主题切换逻辑需要先确认）- Task 1 已完成
- Task 6 可独立进行 - 已完成
- Task 7 可独立进行 - 已完成
- Task 8 依赖所有其他任务完成