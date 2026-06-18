# Tasks

- [x] Task 1: 修复音乐播放器
  - [x] SubTask 1.1: 检查当前 .music-dock 样式问题，恢复紧凑可用状态
  - [x] SubTask 1.2: 添加主题适配 CSS 变量（日间浅色/夜间深色）
  - [x] SubTask 1.3: 确保歌单区域仅悬停时展开，默认无右侧空白
  - [x] SubTask 1.4: 验证分时段自动切换功能正常

- [x] Task 2: 重做诗集页面（修复吞字问题）
  - [x] SubTask 2.1: 重写诗集.md 解析器，确保所有诗文内容完整不丢失
  - [x] SubTask 2.2: 去掉强制置顶白云山逻辑
  - [x] SubTask 2.3: 保留目录视图和时间轴视图双模式
  - [x] SubTask 2.4: 保留防复制保护
  - [x] SubTask 2.5: 验证诗集.md 所有内容完整渲染

- [x] Task 3: 重写 Three.js 动效
  - [x] SubTask 3.1: 白天模式：气泡/光斑漂浮效果，金色暖色调，明显可见
  - [x] SubTask 3.2: 夜间模式：星空闪烁效果，蓝紫色调
  - [x] SubTask 3.3: 光标互动：气泡/粒子跟随光标排斥，响应流畅
  - [x] SubTask 3.4: 性能优化：不硬锁 FPS，自适应调度
  - [x] SubTask 3.5: 确保 canvas 样式（opacity/mix-blend-mode）正确

- [x] Task 4: 全局丝滑动效扩展
  - [x] SubTask 4.1: 研究主页分类 Flex 悬停展开动效原理（不修改该代码）
  - [x] SubTask 4.2: 将动效思路应用到归档页面卡片
  - [x] SubTask 4.3: 将动效思路应用到友链页面卡片
  - [x] SubTask 4.4: 使用 cubic-bezier(.16, 1, .3, 1) 缓动函数

- [x] Task 5: 修复右键菜单
  - [x] SubTask 5.1: 检查 initContextMenu() 是否在页面切换后正确重新绑定
  - [x] SubTask 5.2: 确保 contextmenu 事件阻止默认行为
  - [x] SubTask 5.3: 确保 #context-menu 元素在页面切换后仍存在（transition:persist）
  - [x] SubTask 5.4: 验证所有菜单按钮功能正常

- [x] Task 6: 修复赞赏弹窗
  - [x] SubTask 6.1: 检查赞赏弹窗 HTML 结构和 CSS 样式
  - [x] SubTask 6.2: 确保收款码图片路径正确且可加载
  - [x] SubTask 6.3: 检查 onerror 是否错误隐藏了图片
  - [x] SubTask 6.4: 验证弹窗内容完整可见

- [x] Task 7: 导航栏过渡动画
  - [x] SubTask 7.1: 为导航栏宽度变化添加 transition 过渡
  - [x] SubTask 7.2: 使用 cubic-bezier(.16, 1, .3, 1) 缓动
  - [x] SubTask 7.3: 确保滚动时导航栏变化平滑

- [x] Task 8: 友链系统（友人帐 + 朋友圈）
  - [x] SubTask 8.1: 将友人帐改为友链导航
  - [x] SubTask 8.2: 保留友人帐子页面（现有友链卡片）
  - [x] SubTask 8.3: 新增朋友圈子页面，集成 Fcircle
  - [x] SubTask 8.4: 添加子页面切换功能

- [x] Task 9: 配置文件完善
  - [x] SubTask 9.1: 检查所有硬编码配置项
  - [x] SubTask 9.2: 将可配置项统一到 yuncan.config.ts
  - [x] SubTask 9.3: 更新 GitHub 用户名、邮箱等信息

- [x] Task 10: 性能优化
  - [x] SubTask 10.1: 移除硬锁 FPS 到 60 的逻辑
  - [x] SubTask 10.2: 优化资源加载（懒加载、预加载）
  - [x] SubTask 10.3: 优化渲染性能（减少重排重绘）
  - [x] SubTask 10.4: 不伤害现有功能和特效

- [x] Task 11: 主站 navigatepage 重构
  - [x] SubTask 11.1: 根据 blog 风格重构 navigatepage 标题和信息
  - [x] SubTask 11.2: 更新 GitHub、邮箱等信息
  - [x] SubTask 11.3: 强化加载速度和动效
  - [x] SubTask 11.4: 废弃无用功能
  - [x] SubTask 11.5: 两站联动：blog 添加前往主站入口
  - [x] SubTask 11.6: 吸取主站播放器优点到 blog

- [x] Task 12: 构建验证
  - [x] SubTask 12.1: 运行 npm run build 确保无错误
  - [x] SubTask 12.2: 验证所有页面正常生成

# Task Dependencies
- Task 3 依赖 Task 1（主题切换逻辑）- 已完成
- Task 4 依赖主页分类 UI 研究（已完成）
- Task 8 可独立进行 - 已完成
- Task 11 可独立进行 - 已完成
- Task 12 依赖所有其他任务完成 - 已完成