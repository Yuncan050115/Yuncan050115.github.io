# Tasks

- [x] Task 1: 播放器歌单列表
  - [x] SubTask 1.1: BaseLayout.astro 添加 data-music-list 容器
  - [x] SubTask 1.2: site.css 添加歌单列表样式
  - [x] SubTask 1.3: renderQueue 函数已有，容器已激活

- [x] Task 2: 默认字体改为京华老宋 + 设置面板修复
  - [x] SubTask 2.1: site.css --font-sans 首选改为 JinghuaLaosong
  - [x] SubTask 2.2: app.ts initSettings() 开头重置 panel.style.display = 'none'
  - [x] SubTask 2.3: 设置面板修复完成

- [x] Task 3: .env 环境变量管理
  - [x] SubTask 3.1: 创建 .env 文件（站点信息+API+敏感凭证）
  - [x] SubTask 3.2: 创建 .env.example 模板
  - [x] SubTask 3.3: yuncan.config.ts 从 import.meta.env 读取所有配置
  - [x] SubTask 3.4: site.ts 添加 icp 和 siteStart 映射
  - [x] SubTask 3.5: Twikoo.astro 条件渲染（未配置时不渲染）
  - [x] SubTask 3.6: BaseLayout.astro METING_API 未配置时不渲染播放器
  - [x] SubTask 3.7: app.ts initSettings() 背景图片从 .env 读取

- [x] Task 4: 超轻量文章管理页
  - [x] SubTask 4.1: 创建 PostEditor.astro（密码验证+管理界面）
  - [x] SubTask 4.2: app.ts FPS 隐藏入口（连续点击 5 次）+ 密码验证
  - [x] SubTask 4.3: GitHub API CRUD 逻辑 + 降级为生成 markdown
  - [x] SubTask 4.4: BaseLayout.astro 引入 PostEditor 组件
  - [x] SubTask 4.5: site.css 添加管理页样式
  - [x] SubTask 4.6: pages.yml 添加构建步骤（push master → build → deploy main）

- [x] Task 5: 文件清理
  - [x] SubTask 5.1: 删除 regenerate-images.mjs
  - [x] SubTask 5.2: 删除 generate-real-images.mjs
  - [x] SubTask 5.3: 删除 build-log.txt
  - [x] SubTask 5.4: 删除 pnpm-workspace.yaml

- [x] Task 6: 构建验证
  - [x] SubTask 6.1: npm run build 无错误（exit code 0）
  - [x] SubTask 6.2: 48 个页面正常生成
  - [x] SubTask 6.3: .env 不在 git 跟踪中
