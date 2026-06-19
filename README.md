<h1 align="center">
<img width="28" src="./public/assets/logo-yuncan.png">
云灿博客
</h1>

<p align="center">
  <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square" alt="License"></a>
  <img src="https://img.shields.io/badge/Astro-static-orange?style=flat-square" alt="Astro">
</p>

------

## 项目简介

**云灿博客**（yuncan-blog-astro）是一个基于 Astro 构建的个人博客与个人主页站点。

站点以静态站点形式输出，涵盖博客文章、诗集、追番追剧、Steam 游戏库、友链朋友圈、Twikoo 评论、音乐播放器等内容模块，并内置自定义光标、深色模式、全局主题色设置等交互特性。

------

## 功能特性

- **博客文章**：基于 Markdown 编写，支持分类、标签、归档、目录与代码高亮（Shiki）、数学公式（KaTeX）。
- **诗集**：独立诗集页面，支持时间线与歌词式排版。
- **追番追剧**：基于 `astro-bangumi` 集成 Bilibili 追番列表，另提供电影/追剧页面。
- **Steam 游戏库**：展示个人 Steam 游戏库，支持 fallback 数据兜底。
- **友链朋友圈**：聚合友链站点最新文章（基于 hexo-circle-of-friends）。
- **Twikoo 评论**：基于 Twikoo 的评论区。
- **音乐播放器**：基于 MetingJS 的音乐播放器，支持网易云歌单。
- **自定义光标**：站点级自定义光标与点击动效。
- **深色模式**：支持深色 / 浅色模式切换。
- **全局主题色**：支持运行时全局主题色设置。
- **文章管理**：内置隐藏管理入口，支持通过 GitHub Token 在线编辑文章。
- **响应式设计**：适配桌面端与移动端。

------

## 技术栈

- **框架**：[Astro](https://astro.build/)（`output: 'static'`）
- **语言**：[TypeScript](https://www.typescriptlang.org/)
- **样式**：自定义 CSS（无 Tailwind）
- **内容**：Markdown + [gray-matter](https://github.com/jonschlinkert/gray-matter) + [marked](https://marked.js.org/)
- **代码高亮**：[Shiki](https://shiki.style/)
- **数学公式**：[KaTeX](https://katex.org/) + marked-katex-extension
- **3D 效果**：[three.js](https://threejs.org/)
- **追番集成**：[astro-bangumi](https://github.com/Yuncan050115/astro-bangumi)
- **站点地图**：[@astrojs/sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/)
- **数据格式**：[yaml](https://github.com/eemeli/yaml)

------

## 本地开发

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

默认访问地址：

```txt
http://localhost:4321
```

### 新建文章

```bash
npm run new
```

### 类型检查

```bash
npm run check
```

------

## 构建部署

### 构建

```bash
npm run build
```

构建产物输出到 `dist/` 目录，构建完成后会自动执行 `scripts/postbuild.mjs` 进行后处理。

### 预览构建产物

```bash
npm run preview
```

### 部署

本项目为纯静态站点（`output: 'static'`），可将 `dist/` 目录部署到任意静态托管平台：

- **Netlify**：项目已包含 `netlify.toml` 配置，直接连接仓库即可部署。
- **Vercel**：将构建命令设为 `npm run build`，输出目录设为 `dist`。
- **GitHub Pages**：项目已包含 `.github/workflows/pages.yml` 工作流，可自动部署到 GitHub Pages。

------

## 环境变量参考

复制 `.env.example` 为 `.env` 并按需填写。以 `PUBLIC_` 开头的变量会在构建时注入前端，其余为敏感凭证，不会暴露到前端。

### 站点信息

| 变量名 | 说明 |
| --- | --- |
| `PUBLIC_SITE_NAME` | 站点名称 |
| `PUBLIC_SITE_AUTHOR` | 作者 |
| `PUBLIC_SITE_KEYWORDS` | SEO 关键词（逗号分隔） |
| `PUBLIC_SITE_DESC` | 站点简介 |
| `PUBLIC_SITE_URL` | 站点地址 |
| `PUBLIC_SITE_LOGO` | 站点主图标路径 |
| `PUBLIC_SITE_APPLE_LOGO` | Apple 端图标路径 |
| `PUBLIC_SITE_START` | 建站日期（YYYY-MM-DD 格式） |
| `PUBLIC_SITE_ICP` | ICP 备案号（可为空） |

### API 配置

| 变量名 | 说明 |
| --- | --- |
| `PUBLIC_TWIKOO_API` | Twikoo 云函数 API 链接，未配置则不显示评论区 |
| `PUBLIC_METING_API` | MetingJS 音乐 API 链接，未配置则不显示音乐播放器 |
| `PUBLIC_SONG_ID` | 播放歌单 ID（网易云音乐歌单 ID），未配置则不显示音乐播放器 |
| `PUBLIC_BG_IMAGE_API` | 默认背景图片 API，未配置则使用默认背景 |
| `PUBLIC_STEAM_API_KEY` | Steam API Key，从 https://steamcommunity.com/dev/apikey 获取 |
| `PUBLIC_CIRCLE_API` | 友链朋友圈 API 链接，未配置则不显示朋友圈页面内容 |
| `PUBLIC_BILIBILI_UID` | Bilibili UID，用于追番列表数据源 |

### 敏感凭证

| 变量名 | 说明 |
| --- | --- |
| `POST_PASSWORD` | 文章管理页密码，设置后通过连续点击 FPS 区域 5 次触发隐藏入口 |
| `GITHUB_TOKEN` | GitHub fine-grained token，用于在线文章管理（仅授权目标仓库 Contents 读写权限） |
| `GITHUB_REPO` | GitHub 仓库地址（格式：用户名/仓库名） |
| `GITHUB_BRANCH` | 源码分支（默认 master） |

------

## 目录结构

```txt
.
├── content/                # 站点内容
│   ├── assets/             # 文章图片资源
│   ├── data/               # 数据文件（bangumis.json、cinemas.json、link.yml）
│   ├── fallback/           # 兜底数据（steamgames 等）
│   ├── pages/              # 单独页面 Markdown（about、love、time）
│   ├── poems.md            # 诗集内容
│   └── posts/              # 博客文章 Markdown
├── public/                 # 静态资源
│   └── assets/             # 图标、字体、图片等
├── scripts/                # 构建辅助脚本
│   ├── new-post.mjs        # 新建文章脚本
│   └── postbuild.mjs       # 构建后处理脚本
├── src/
│   ├── components/         # Astro 组件
│   ├── config/             # 站点配置（yuncan.config.ts）
│   ├── data/               # 站点数据（site.ts）
│   ├── layouts/            # 布局（BaseLayout.astro）
│   ├── lib/                # 工具库（content.ts）
│   ├── pages/              # 页面路由
│   │   ├── categories/     # 分类页
│   │   ├── personal/       # 个人页（about、love）
│   │   ├── posts/          # 文章详情页
│   │   ├── site/           # 站点页（time）
│   │   ├── social/         # 社交页（circle、link）
│   │   ├── tags/           # 标签页
│   │   └── ...             # 首页、诗集、追番、电影、Steam 游戏等
│   ├── scripts/            # 前端脚本（app.ts）
│   └── styles/             # 全局样式（site.css）
├── astro.config.mjs        # Astro 配置
├── netlify.toml            # Netlify 部署配置
├── package.json
└── tsconfig.json
```

------

## License

本项目基于 MIT License 开源。
