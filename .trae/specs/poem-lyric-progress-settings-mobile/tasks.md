# Tasks

- [x] Task 1: 诗集默认展示时间轴 + 修复显示 + 改文案
  - [x] SubTask 1.1: 时间轴视图默认显示，目录视图默认隐藏
  - [x] SubTask 1.2: 修复时间轴诗显示不全（作者、多行预览、配图）
  - [x] SubTask 1.3: PageHero description 改为"诗与远方"
  - [x] SubTask 1.4: 验证构建

- [x] Task 2: 歌词栏恶性 bug 修复
  - [x] SubTask 2.1: opacity 从 1 改为 0.55，昼夜主题适配
  - [x] SubTask 2.2: timeupdate 中不再清除 closed 标记
  - [x] SubTask 2.3: boot() 中歌词栏逻辑修复
  - [x] SubTask 2.4: 验证

- [x] Task 3: 文章进度条 100% 修复
  - [x] SubTask 3.1: 基于文章正文区域计算进度
  - [x] SubTask 3.2: 文章底边进入视口时 100%
  - [x] SubTask 3.3: 验证

- [x] Task 4: 夜间模式导航栏闪白修复
  - [x] SubTask 4.1: header 背景色过渡 + 明确昼夜背景
  - [x] SubTask 4.2: boot() 中立即应用主题
  - [x] SubTask 4.3: 验证

- [x] Task 5: 设置面板（新增组件）
  - [x] SubTask 5.1: 字体文件移到 public/assets/fonts/
  - [x] SubTask 5.2: 创建 SettingsPanel.astro 组件
  - [x] SubTask 5.3: 设置面板包含所有功能
  - [x] SubTask 5.4: BaseLayout 中引入 SettingsPanel
  - [x] SubTask 5.5: app.ts 中添加 initSettings 逻辑
  - [x] SubTask 5.6: site.css 中添加设置面板样式
  - [x] SubTask 5.7: 验证

- [x] Task 6: 移动端适配优化
  - [x] SubTask 6.1: 680px 断点全面适配
  - [x] SubTask 6.2: 诗集时间轴上下布局
  - [x] SubTask 6.3: 音乐播放器迷你模式
  - [x] SubTask 6.4: 设置面板全屏
  - [x] SubTask 6.5: 480px 进一步优化
  - [x] SubTask 6.6: 验证

- [x] Task 7: 构建验证
  - [x] SubTask 7.1: npm run build 无错误
  - [x] SubTask 7.2: 所有页面正常生成（48 页）
