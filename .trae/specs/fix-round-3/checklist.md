# Checklist

## 朋友圈删除
- [x] 朋友圈标签页已移除
- [x] Fcircle 相关代码和配置已移除
- [x] 友链页面仅显示友人帐

## 诗集页面
- [x] 时间轴按真实日期排序（不再乱序）
- [x] 序言内容显示在页面顶部
- [x] 目录视图按钮改名为"诗集"
- [x] 配图图片实际显示（非文字提示）
- [x] 字号增大，可读性好
- [x] 防复制保护保留

## 播放器
- [x] 歌单列表布局已移除
- [x] 悬停内容简洁美观（参考导航站）
- [x] 显示封面、歌曲名、艺术家、播放控制
- [x] 主题适配正常

## 归档页面
- [x] 恢复时间块样式（左年份右文章列表）
- [x] 丝滑悬停动效保留
- [x] 文章封面正常显示

## 标签页面
- [x] 丝滑悬停动效已应用
- [x] 标签悬停时展开/高亮

## 主页布局
- [x] 分类区域在最近文章前面
- [x] 分类区域内部代码未修改

## Three.js 动效
- [x] CSS 中 #breath-scene 的 z-index/opacity 冲突已修复
- [x] 白天动效明显可见
- [x] 夜间动效明显可见

## 导航站
- [x] 文字颜色对比度已修复
- [x] 所有文字清晰可读

## 两站互补
- [x] blog 吸取导航站播放器优点
- [x] 导航站吸取 blog 动效和主题适配

## 构建验证
- [x] npm run build 无错误
- [x] 所有页面正常生成

## 验证发现的问题

本次验证所有检查项均已通过，未发现阻断性问题。以下为验证过程中观察到的若干次要事项，供后续清理参考（不影响功能，不构成未通过项）：

1. **导航站存在遗留的旧样式文件（未使用）**：`navigatepage/src/style/style.scss`（单数形式）仍保留旧代码，其中 `.el-popper.is-dark` 背景为 `#ffffff60`（浅色半透明白），与修复后的 `navigatepage/src/styles/style.scss`（复数形式，背景为 `rgba(30, 30, 30, 0.95)` 深色）冲突。经核查 `navigatepage/src/main.js` 第 7 行实际导入的是复数形式的 `@/styles/style.scss`，单数形式文件未被任何模块引用，不影响实际渲染。建议删除该遗留文件以免混淆。

2. **构建产物中仍存在 fcircle 相关 URL**：`npm run build` 输出包含 `/posts/fcircle/index.html` 与 `/tags/fcircle/index.html`。这是历史博客文章内容（文章 slug 与标签名为 fcircle），并非朋友圈功能代码。代码层面（`src/config/yuncan.config.ts`、`src/data/site.ts`、`src/pages/social/link.astro`）已确认无 fcircle 引用，符合"朋友圈删除"检查项要求。如需彻底清理可考虑重命名或删除该篇历史文章。

3. **构建警告（非错误）**：构建过程中 Vite 提示部分 chunk 体积超过 500 kB（来自 Three.js 等依赖），属性能优化建议，不影响构建成功与页面生成。

### 验证依据摘要

- **朋友圈删除**：`src/pages/social/link.astro` 为纯友链展示页；全局搜索 `src/` 目录无 `fcircle`/`朋友圈` 匹配。
- **诗集页面**：`src/pages/poems.astro` 中文日期正则使用 `{3}`（第 55、118 行），序言解析 `# 序` 到 `# 说明`（第 30-45 行）并顶部渲染（第 323-338 行），按钮文本为"诗集"（第 347 行），配图 `<img>` 使用 `referrerpolicy="no-referrer"`（第 385、421 行），正文字号 15-16px（site.css 第 4130、4189、479 行），防复制监听 contextmenu/keydown/selectstart 齐全（第 277-320 行）。
- **播放器**：`src/layouts/BaseLayout.astro` 无 `.music-queue`，结构含封面/歌名/艺术家/控制按钮；`src/styles/site.css` 使用 `--music-bg`/`--music-text` 等 CSS 变量并区分明暗主题。
- **归档页面**：`src/pages/archives.astro` 使用 `.archive-row`/`.archive-year`/`.archive-list`/`.archive-item` 结构，CSS `grid-template-columns: 180px 1fr`（左年份右列表），transition 使用 `cubic-bezier(.16,1,.3,1)`，封面 `.archive-item-cover` 正常渲染。
- **标签页面**：`.tag-cloud` flex 布局，hover 时 `flex: .58`/`flex: 2` 展开高亮，transition `.7s cubic-bezier(.16,1,.3,1)`。
- **主页布局**：`src/pages/index.astro` section 顺序为 分类 → 最近文章 → 标签 → 入口。
- **Three.js 动效**：`src/styles/site.css` 中 `#breath-scene` 共 4 处定义（base z-index:0、light opacity:0.9/normal、dark opacity:0.85/screen、transition），无冲突；`src/scripts/app.ts` 第 596-662 行实现 WebGL 粒子动效。
- **导航站**：`navigatepage/src/styles/style.scss` 第 168 行 `.el-popper.is-dark` 背景为 `rgba(30, 30, 30, 0.95)`；`Music.vue`/`Player.vue` 图标 fill 均为 `#efefef`/`#ffffff`，无 `#ffffff60`。
- **两站互补**：blog 播放器具备简洁 prev/play/next 控制按钮；导航站 `styles/style.scss` 第 12-16 行引入 `--accent`/`--accent-2`/`--ease-silk` 变量。
- **构建验证**：`npm run build` 退出码 0，48 个页面全部生成，无错误。
