# Tasks

- [x] Task 1: 修正音乐 API 配置
  - [x] SubTask 1.1: .env PUBLIC_METING_API 改为完整模板 `https://music.yuncan.xyz/api?server=:server&type=:type&id=:id&r=:r`
  - [x] SubTask 1.2: .env.example 同步注释说明需填完整模板

- [x] Task 2: 修复 GitHub API sha 缺失
  - [x] SubTask 2.1: app.ts editPost 的 if (post.url) 分支添加 `post.sha` 赋值到 #pe-file-sha

- [x] Task 3: 修复设置面板点不开 + 切换页面消失
  - [x] SubTask 3.1: app.ts initSettings 改用 dataset.ready 防重复（参照 initTheme 模式）
  - [x] SubTask 3.2: SettingsPanel.astro 移除根 div 的 transition:persist
  - [x] SubTask 3.3: app.ts 移除末尾直接 boot() 调用，只保留 astro:page-load 监听

- [x] Task 4: 修复 FPS/运行天数重复显示
  - [x] SubTask 4.1: BaseLayout.astro 移除 .runtime-tools 的 transition:name，只保留 transition:persist

- [x] Task 5: 朋友圈部署说明 + fc_settings 配置
  - [x] SubTask 5.1: circle.astro 未配置 API 时显示详细部署说明
  - [x] SubTask 5.2: fc_settings.yaml LINK 改为用户友链页，theme 改为 common1

- [x] Task 6: 构建验证
  - [x] SubTask 6.1: npm run build 无错误（exit code 0）
  - [x] SubTask 6.2: 49 个页面正常生成
