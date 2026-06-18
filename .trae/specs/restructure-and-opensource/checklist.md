# Checklist

## 数据迁移
- [x] `content/pages/personal/love/index.md` 已存在
- [x] `content/pages/site/time/index.md` 已存在
- [x] `content/poems.md` 已存在（诗集数据，从 dist 逆向恢复）
- [x] `content/assets/pusheencode.webp` 已存在
- [x] `content/fallback/steamgames/index.html` 已存在

## 代码路径更新
- [x] `content.ts` 中 `oldSource` 指向 `content`
- [x] `content.ts` 中 `oldGenerated` 指向 `content/fallback`
- [x] `content.ts` 中 `postsDir` 指向 `content/posts`
- [x] `content.ts` 中 `getPageMarkdown` 读取 `content/pages/`（about.astro 调用已更新）
- [x] `content.ts` 中 `getLinks` 读取 `content/data/link.yml`
- [x] `content.ts` 中 `getMedia` 读取 `content/data/`
- [x] `content.ts` 中 `getSteamGamesFromGenerated` 读取 `content/fallback/steamgames/index.html`
- [x] `yuncan.config.ts` 中 `bangumiData` 指向 `content/data/bangumis.json`
- [x] `yuncan.config.ts` 中 `cinemaData` 指向 `content/data/cinemas.json`
- [x] `poems.astro` 中诗集路径指向 `content/poems.md`

## 旧项目与冗余删除
- [x] `旧项目Hexo启动器/` 已删除
- [x] `content-data/` 已删除
- [x] `backups/` 已删除
- [x] `content-fallback/` 已删除
- [x] `check_sort.js` 已删除
- [x] `pnpm-workspace.yaml` 已删除

## README 重写
- [x] README 目录结构反映 content/ 布局
- [x] README 无旧项目Hexo启动器引用
- [x] README 数据源说明准确
- [x] README 含 GitHub 上传教程链接

## GitHub 上传教程
- [x] `docs/github-upload-guide.md` 已创建
- [x] 教程含源码推 master 分支步骤
- [x] 教程含静态站推 main 分支步骤
- [x] 教程含首次推送与日常更新说明

## 构建验证
- [x] `npm run build` 无错误
- [x] 所有页面正常生成（48 页）
- [x] 无任何 `旧项目Hexo启动器` 引用残留
