# 云灿博客（yuncan-blog）

基于 [Astro](https://astro.build/) 构建的个人博客，包含文章、诗集、追番、追剧、Steam 游戏库、友链、留言板等功能。

## 简介

本站是云灿的个人博客，从原 Hexo + Butterfly 主题迁移至 Astro 重构。使用 Astro + Three.js 重新实现了前端界面与交互，保留了原有的文章、追番、追剧、Steam 游戏库等数据。

## 技术栈

- [Astro](https://astro.build/) - 静态站点生成框架
- [Three.js](https://threejs.org/) - 3D 背景动效（白天气泡 / 夜间星空）
- [Twikoo](https://twikoo.js.org/) - 评论系统
- [TypeScript](https://www.typescriptlang.org/) - 类型安全
- [marked](https://marked.js.org/) - Markdown 渲染
- [gray-matter](https://github.com/jonschlinkert/gray-matter) - Frontmatter 解析

## 目录结构

```
blog/
├── content/                # 博客数据（文章、页面、媒体数据）
│   ├── posts/              # 文章 Markdown
│   ├── pages/              # 页面 Markdown（关于、恋爱小屋、旧时光）
│   ├── data/               # 追番、追剧、友链数据
│   ├── fallback/           # Steam 游戏回退数据
│   ├── assets/             # 文章用图片
│   └── poems.md            # 诗集数据
├── public/                 # 静态资源（直接拷贝到产物）
│   ├── assets/             # Logo、收款码等
│   └── legacy/             # 旧项目迁移的资源
├── src/
│   ├── components/         # Astro 组件
│   ├── config/             # 站点配置
│   │   └── yuncan.config.ts
│   ├── data/               # 站点数据聚合
│   ├── layouts/            # 布局组件
│   ├── lib/                # 工具库（内容读取等）
│   ├── pages/              # 页面路由
│   ├── scripts/            # 客户端脚本
│   └── styles/             # 样式
├── navigatepage/           # 导航站子项目（基于 imsyy/home 重构）
├── docs/                   # 文档
│   └── github-upload-guide.md  # GitHub 上传教程
├── astro.config.mjs
├── package.json
└── README.md
```

## 本地开发

```bash
pnpm install
pnpm dev
```

## 构建

```bash
pnpm build
```

构建产物输出到 `dist/` 目录。

## 配置说明

修改 `src/config/yuncan.config.ts` 可调整站点信息、社交链接、导航、媒体数据源、评论、音乐等配置。每个配置项均有中文注释。

环境变量参考 `.env.example`，在项目根目录创建 `.env` 文件并填入：

```
STEAM_API_KEY=你的 Steam Web API Key
TWIKOO_ENV_ID=你的 Twikoo 环境 ID
```

## 数据源说明

所有博客数据统一存放在 `content/` 目录：

- `content/posts/*.md` - 文章 Markdown
- `content/pages/personal/about/index.md` - 关于页面
- `content/pages/personal/love/index.md` - 恋爱小屋页面
- `content/pages/site/time/index.md` - 旧时光页面
- `content/data/bangumis.json` - 追番数据
- `content/data/cinemas.json` - 追剧数据
- `content/data/link.yml` - 友链数据
- `content/poems.md` - 诗集内容
- `content/fallback/steamgames/index.html` - Steam 游戏库回退数据

Steam 游戏数据优先通过 Steam Web API 获取，失败时回退到 `content/fallback/` 下的静态页面解析。

## 部署到 GitHub

参见 [GitHub 上传教程](docs/github-upload-guide.md)。

## 致谢

- [Astro](https://astro.build/)
- [Hexo Butterfly](https://butterfly.js.org/) - 原博客主题
- [Twikoo](https://twikoo.js.org/)
- [Three.js](https://threejs.org/)
- [imsyy/home](https://github.com/imsyy/home) - 导航站原项目

## 许可证

文章内容采用 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 协议授权。
代码部分采用 MIT 协议。
