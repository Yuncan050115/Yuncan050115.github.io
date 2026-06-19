# Tasks

- [x] Task 1: 迁移缺失数据到 content 目录
  - [x] SubTask 1.1: 将 love/index.md 复制到 content/pages/personal/love/
  - [x] SubTask 1.2: 将 time/index.md 复制到 content/pages/site/time/
  - [x] SubTask 1.3: 诗集.md 从 dist/poems/index.html 逆向恢复到 content/poems.md
  - [x] SubTask 1.4: 将 pusheencode.webp 复制到 content/assets/
  - [x] SubTask 1.5: 将 steamgames/index.html 复制到 content/fallback/steamgames/

- [x] Task 2: 更新代码中的数据路径
  - [x] SubTask 2.1: content.ts 路径更新（oldSource→content, oldGenerated→content/fallback, postsDir→content/posts, _data→data, _posts→posts）
  - [x] SubTask 2.2: yuncan.config.ts 路径更新（bangumiData/cinemaData 指向 content/data/）
  - [x] SubTask 2.3: poems.astro 诗集路径改为 content/poems.md
  - [x] SubTask 2.4: about.astro getPageMarkdown 路径改为 pages/personal/about/index.md

- [x] Task 3: 删除旧项目与冗余文件
  - [x] SubTask 3.1: 删除 旧项目Hexo启动器/
  - [x] SubTask 3.2: 删除 content-data/
  - [x] SubTask 3.3: 删除 backups/
  - [x] SubTask 3.4: 删除 content-fallback/
  - [x] SubTask 3.5: 删除 check_sort.js
  - [x] SubTask 3.6: 删除 pnpm-workspace.yaml

- [x] Task 4: 重写 README.md
  - [x] SubTask 4.1: 目录结构反映 content/ 布局
  - [x] SubTask 4.2: 数据源说明更新
  - [x] SubTask 4.3: 添加 GitHub 上传教程链接

- [x] Task 5: 编写 GitHub 上传教程
  - [x] SubTask 5.1: 创建 docs/github-upload-guide.md
  - [x] SubTask 5.2: 含源码 master、静态站 main、首次推送、日常更新、deploy.sh 脚本

- [x] Task 6: 构建验证
  - [x] SubTask 6.1: npm run build 无错误，48 个页面全部生成
  - [x] SubTask 6.2: 无任何 旧项目Hexo启动器 引用残留

# Task Dependencies
- Task 1 必须先完成（数据迁移），才能执行 Task 3（删除旧项目）
- Task 2 依赖 Task 1（路径更新需基于新 content 结构）
- Task 3 依赖 Task 1 和 Task 2（确认数据迁移和路径更新后才能删除）
- Task 4 和 Task 5 可与 Task 1-3 并行
- Task 6 依赖所有其他任务完成
