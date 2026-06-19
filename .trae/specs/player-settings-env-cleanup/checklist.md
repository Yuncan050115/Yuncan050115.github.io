# Checklist

## 播放器歌单列表
- [x] music-dock 中有 data-music-list 容器
- [x] 歌单列表样式已添加（最多 5 行、滚动、高亮）
- [x] 样式与 music-dock 风格一致

## 默认字体 + 设置面板修复
- [x] 网站默认字体为京华老宋（--font-sans 首选）
- [x] 设置面板每次页面加载重置 display 为 none
- [x] 设置面板事件防重复绑定（removeEventListener 模式）

## .env 环境变量
- [x] .env 文件存在且包含所有配置项
- [x] .env.example 文件存在（不含真实值，含详细注释）
- [x] .env 在 .gitignore 中（git status 确认未跟踪）
- [x] PUBLIC_TWIKOO_API 从 .env 读取
- [x] PUBLIC_METING_API 从 .env 读取
- [x] PUBLIC_SONG_ID 从 .env 读取
- [x] PUBLIC_BG_IMAGE_API 从 .env 读取
- [x] PUBLIC_SITE_NAME/AUTHOR/DESC/URL/START/ICP 从 .env 读取
- [x] METING_API 未配置时不显示音乐播放器（hasMusic 条件渲染）
- [x] TWIKOO_API 未配置时不渲染评论（条件渲染）
- [x] 敏感变量（POST_PASSWORD/GITHUB_TOKEN/GITHUB_REPO）不带 PUBLIC_ 前缀

## 超轻量文章管理页
- [x] FPS 区域连续点击 5 次触发入口
- [x] 密码验证（从 .env POST_PASSWORD 注入）
- [x] 密码错误或未设置时无法进入（组件不渲染）
- [x] 文章列表显示所有文章
- [x] 编辑文章（更新 updated 日期，date 保持不变）
- [x] 删除文章（确认后通过 GitHub API 删除）
- [x] 新增文章（自动生成 frontmatter）
- [x] GitHub API CRUD（配置 TOKEN 时）
- [x] 降级为生成 markdown（未配置 TOKEN 时）
- [x] pages.yml 有构建步骤（push master → build → deploy main）

## 文件清理
- [x] scripts/regenerate-images.mjs 已删除
- [x] scripts/generate-real-images.mjs 已删除
- [x] build-log.txt 已删除
- [x] pnpm-workspace.yaml 已删除

## 构建验证
- [x] npm run build 无错误（exit code 0）
- [x] 所有页面正常生成（48 页）
- [x] .env 不在 git 跟踪中
