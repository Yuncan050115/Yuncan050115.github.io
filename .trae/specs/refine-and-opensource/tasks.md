# Tasks

- [x] Task 1: 修复赞赏弹窗显示
  - [x] SubTask 1.1: 修复 `panel-rise-light` 动画 `to` 状态为 `transform: none; filter: none`（消除包含块破坏 fixed）— 由 SubTask 1.2 DOM 提升解决，弹窗不再在 .article-shell 内，无需改 CSS
  - [x] SubTask 1.2: 将赞赏弹窗 DOM 从 `posts/[slug].astro` 的 article 内提升至 BaseLayout 的 body 直接子级（脱离 main 层叠上下文），通过事件委托绑定开关
  - [x] SubTask 1.3: 确保弹窗 z-index 高于 header/music-dock/runtime-tools（z-index: 1002 !important）
  - [x] SubTask 1.4: 验证白天和夜间模式都能正常显示与关闭

- [x] Task 2: 优化标签/友链悬停动效
  - [x] SubTask 2.1: 标签云 `.tag-cloud` 改用 `transform: scale` 替代 `flex` 过渡，避免重排
  - [x] SubTask 2.2: 标签项补充 `overflow: hidden`、`min-width: 0`、`white-space: nowrap`、`text-overflow: ellipsis` 防止文字溢出
  - [x] SubTask 2.3: 友链网格 `.friend-grid` 同样改用 `transform: scale` 替代 `flex` 过渡
  - [x] SubTask 2.4: 友链卡片补充文本截断与头像 overflow 保护
  - [x] SubTask 2.5: 验证光标移动时无位置跳动、无文字溢出

- [x] Task 3: 重做白天光效
  - [x] SubTask 3.1: 白天 `#breath-scene` 混合模式改为 `screen`，opacity 降至 0.55
  - [x] SubTask 3.2: 白天粒子引入冷色调（白/浅蓝）平衡全暖色，调整颜色比例
  - [x] SubTask 3.3: 降低片元着色器 core 亮度系数（1.6 → 1.0），增加白天呼吸闪烁
  - [x] SubTask 3.4: 验证白天光效柔和美观，无"黑黄一大坨"

- [x] Task 4: 优化夜间光效性能
  - [x] SubTask 4.1: 夜间 `#breath-scene` opacity 轻微削弱（0.85 → 0.7）
  - [x] SubTask 4.2: 加 FPS 节流（约 36fps，使用 delta time 累积）
  - [x] SubTask 4.3: DPR 上限降至 1.0
  - [x] SubTask 4.4: 验证夜间星空保留美感且卡顿减少

- [x] Task 5: 统一全站文风
  - [x] SubTask 5.1: 重写 `src/pages/site/time.astro` 旧时光 timeline 四段文字（参照诗集序言坦诚自省文风）
  - [x] SubTask 5.2: 重写 13 处 PageHero description（tags、link、poems、archives、love、comments、time、categories、about、cinemas、bangumis、projects、steamgames）
  - [x] SubTask 5.3: 重写首页 `index.astro` entrances 描述与分类卡文案
  - [x] SubTask 5.4: 重写 `yuncan.config.ts` 赞赏文案（去掉"请小站喝杯热茶"）— 由 Task 7 一并完成
  - [x] SubTask 5.5: 视情况调整 404 页面文案
  - [x] SubTask 5.6: 验证文风一致、不矫饰、像用户自写

- [x] Task 6: 添加浏览器 favicon
  - [x] SubTask 6.1: `BaseLayout.astro` 的 `<link rel="icon">` 指向 `/assets/logo-yuncan.png`，补 `type="image/png"`
  - [x] SubTask 6.2: 补全 apple-touch-icon link
  - [x] SubTask 6.3: 验证浏览器标签页显示图标

- [x] Task 7: 整理 blog 项目文件
  - [x] SubTask 7.1: 补全 `.gitignore`（dist、node_modules、.astro、.netlify、.DS_Store 等）
  - [x] SubTask 7.2: 为 `src/config/yuncan.config.ts` 每个配置项添加中文注释
  - [x] SubTask 7.3: 新增 `README.md`（项目介绍、技术栈、目录结构、使用说明、致谢）
  - [x] SubTask 7.4: 删除杂散文件（根目录 wx.jpg、zfb.jpg、check_sort.js、pnpm-workspace.yaml）— 用户选择保留
  - [x] SubTask 7.5: 精简旧 Hexo 项目未引用文件 — 旧项目Hexo生成的前端页面已精简（仅保留 steamgames/index.html）；旧项目Hexo启动器用户选择保留
  - [x] SubTask 7.6: 移除 `yuncan.config.ts` 中明文 Steam API Key，改为环境变量
  - [x] SubTask 7.7: 验证构建无错误、功能不受影响

- [x] Task 8: 整理 navigate 项目文件
  - [x] SubTask 8.1: 删除 Vite 遗留配置（vite.config.js、index.html、.eslintrc.json、.prettierrc.json、.hintrc）
  - [x] SubTask 8.2: 删除旧样式目录 `src/style/`（单数，未被引用）
  - [x] SubTask 8.3: 删除一次性脚本 `scripts/update-store-imports.js`、占位文件（.htaccess、pnpm-workspace.yaml）— 用户选择保留部分文件
  - [x] SubTask 8.4: `.env` 改为 `.env.example` 模板（移除真实 Key），删除 `.env.local` — .env.example 已创建，.env/.env.local 已加入 .gitignore
  - [x] SubTask 8.5: 更新 CODE_OF_CONDUCT.md 邮箱为云灿邮箱
  - [x] SubTask 8.6: 统一作者信息（README 与 package.json 的 github 链接一致）
  - [x] SubTask 8.7: 保留 imsyy LICENSE 版权署名不变
  - [x] SubTask 8.8: 验证 navigate 项目构建无错误

- [x] Task 9: 构建验证
  - [x] SubTask 9.1: blog 项目 `npm run build` 无错误，48 个页面全部生成
  - [x] SubTask 9.2: navigate 项目构建无错误（exit code 0，2 个页面生成）

# Task Dependencies
- Task 3 和 Task 4 可并行（光效昼夜调整互不依赖）
- Task 5 和 Task 6 可并行（文风与 favicon 互不依赖）
- Task 7 和 Task 8 可并行（两个项目互不依赖）
- Task 9 依赖所有其他任务完成
