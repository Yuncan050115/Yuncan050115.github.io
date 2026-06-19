# Tasks

- [x] Task 1: 重构诗集时间轴为归档时间块样式
  - [x] SubTask 1.1: 修改 poems.astro 时间轴视图 HTML 结构，改用 .poem-archive-row + .poem-archive-year + .poem-archive-list 布局
  - [x] SubTask 1.2: 将所有诗按年份分组（提取年份数字）
  - [x] SubTask 1.3: site.css 中新增 .poem-archive-year-group、.poem-archive-year、.poem-archive-list、.poem-archive-item 样式
  - [x] SubTask 1.4: 删除旧的 .poem-line 相关 CSS（保留 .poem-card 目录视图样式）
  - [x] SubTask 1.5: 验证构建和显示效果

- [x] Task 2: 修复文章配图（AI 生成）
  - [x] SubTask 2.1: 遍历 content/posts/*.md，提取所有图片 URL
  - [x] SubTask 2.2: 对每个 URL 发送请求测试可用性（3秒超时），记录失效 URL
  - [x] SubTask 2.3: 对每个失效图片：提取上下文、构造 prompt、调用 API 生成图片、保存到 content/assets/
  - [x] SubTask 2.4: 更新 MD 文件中的图片 URL，注释改为 [原图遗失，AI生成]
  - [x] SubTask 2.5: 输出检查清单供用户确认

- [x] Task 3: 实现歌词底部栏
  - [x] SubTask 3.1: BaseLayout.astro 中添加歌词栏 HTML（transition:persist）
  - [x] SubTask 3.2: site.css 中添加 .lyric-bar 样式（底部固定、半透明、高度 36px）
  - [x] SubTask 3.3: app.ts 中添加歌词栏交互逻辑（显示/关闭/sessionStorage）
  - [x] SubTask 3.4: 歌词更新时显示歌词栏，关闭时写入 sessionStorage
  - [x] SubTask 3.5: 验证页面切换时歌词栏保持、刷新后状态正确

- [x] Task 4: 构建验证
  - [x] SubTask 4.1: npm run build 无错误
  - [x] SubTask 4.2: 所有页面正常生成（48 页）
