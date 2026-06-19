# Tasks

## 阶段一：内容清理

- [x] Task 1: 删除 AI 图片并清理文章引用
  - [x] SubTask 1.1: 删除 `content/assets/` 下所有 `ai-*.jpg` 文件（57 张）
  - [x] SubTask 1.2: 清理 11 篇文章中对 AI 图片的引用行（`![原图遗失，AI生成](content/assets/ai-...jpg)`）

## 阶段二：代码高亮与数学公式

- [x] Task 2: 集成 Shiki 代码语法高亮
  - [x] SubTask 2.1: 在 `src/lib/content.ts` 的 `renderMarkdown` 中集成 Shiki 高亮器，替换 `addCodeFrames` 中的纯文本渲染
  - [x] SubTask 2.2: 配置浅色和深色两套主题（`github-light` / `github-dark`），根据 `data-theme` 切换
  - [x] SubTask 2.3: 保留现有的 `code-frame` 外壳（figcaption + 复制按钮），内部 `<code>` 添加 Shiki 生成的 token span
  - [x] SubTask 2.4: 在 `site.css` 中适配 Shiki 输出的内联样式，确保深色模式下可读

- [x] Task 3: 集成 KaTeX 数学公式渲染
  - [x] SubTask 3.1: 安装 `marked-katex-extension` 并在 `renderMarkdown` 中注册扩展
  - [x] SubTask 3.2: 在 `BaseLayout.astro` 中加载 KaTeX CSS（CDN）
  - [x] SubTask 3.3: 验证数学公式在文章中正确渲染

## 阶段三：追番追剧系统重构

- [x] Task 4: 安装并配置 astro-bangumi
  - [x] SubTask 4.1: `npm install astro-bangumi`
  - [x] SubTask 4.2: 在 `astro.config.mjs` 中添加 bangumi 集成配置，vmid 从 env 读取
  - [x] SubTask 4.3: 在 `.env` 和 `.env.example` 中添加 `PUBLIC_BILIBILI_UID`
  - [x] SubTask 4.4: 重写 `src/pages/bangumis.astro` 使用 `astro-bangumi/Bangumi` 组件
  - [x] SubTask 4.5: 重写 `src/pages/cinemas.astro` 使用 `astro-bangumi/Bangumi` 组件（category=2 影视）
  - [x] SubTask 4.6: 配置 `darkSelector` 适配本站 `:root[data-theme="dark"]` 主题切换
  - [x] SubTask 4.7: 保留旧的 `content/data/bangumis.json` 和 `content/data/cinemas.json` 作为备用

## 阶段四：UI/UX 优化

- [x] Task 5: 朋友圈样式重做
  - [x] SubTask 5.1: 修复 `site.css` 朋友圈区块的 CSS 变量名（`--border`→`--line`、`--text-1`→`--text`、`--text-2`→`--muted`、`--text-3`→`--muted`）
  - [x] SubTask 5.2: 重做 `.circle-card` 卡片设计（毛玻璃背景、左侧彩色竖条、hover 效果）
  - [x] SubTask 5.3: 确保深色模式下卡片背景、文字、链接均有良好对比度

- [x] Task 6: 置顶文章标识 + 玩页面加载态
  - [x] SubTask 6.1: 在 `src/pages/archives.astro` 归档列表中为置顶文章添加 `.pin-badge` 徽章
  - [x] SubTask 6.2: 在 `src/pages/index.astro` 首页文章卡片中为置顶文章添加徽章
  - [x] SubTask 6.3: 将 `src/pages/steamgames.astro` 改为客户端加载模式（初始显示 loading 占位，fetch 完成后渲染）
  - [x] SubTask 6.4: 创建 `src/pages/api/steamgames.json.ts` API 端点

- [x] Task 7: 光标流畅 + 全局主题色
  - [x] SubTask 7.1: 在 `src/scripts/app.ts` 的 `initCursor` 中将 ring 缓动系数从 0.45 降至 0.2
  - [x] SubTask 7.2: 为 cursor-dot 和 cursor-ring 添加 `will-change: transform` 优化 GPU 合成
  - [x] SubTask 7.3: 在 `src/components/SettingsPanel.astro` 中新增主题色选择器（6 种预设颜色）
  - [x] SubTask 7.4: 在 `src/scripts/app.ts` 中实现主题色应用逻辑（设置 `--accent` 变量，持久化到 localStorage）

- [x] Task 8: 清理废弃页面 + 优化加载
  - [x] SubTask 8.1: `src/pages/life/games.astro` 和 `life/movies.astro` 用户选择保留
  - [x] SubTask 8.2: 清理 `netlify.toml` 中 `/life/movies/` 重定向规则
  - [x] SubTask 8.3: 检查 `content/fallback/` 无废弃内容需清理

- [x] Task 9: 右键菜单修复
  - [x] SubTask 9.1: 修复 `.context-menu` 的 `position: fixed; z-index: 120` 被其他 CSS 规则覆盖为 `position: relative; z-index: 2` 的问题
  - [x] SubTask 9.2: 确认右键菜单在所有页面（除 poems 防复制页）正常显示

- [x] Task 10: 移动端导航修复
  - [x] SubTask 10.1: 统一汉堡菜单类名 — `app.ts` 中 `'open'` → `'is-open'`，CSS 980px 断点 `.site-nav.open` → `.site-nav.is-open`
  - [x] SubTask 10.2: 确认 680px 和 980px 两个断点导航样式一致

## 阶段五：文档

- [x] Task 11: 重写 README
  - [x] SubTask 11.1: 将 `README.md` 内容替换为云灿博客项目的正确说明

## Task Dependencies

- Task 2 和 Task 3 可并行（代码高亮和数学公式独立）
- Task 4 依赖 package.json 更新（需先安装依赖）
- Task 5-10 互相独立，可并行
- Task 11 独立，可随时进行
