# Checklist

## 内容清理
- [x] `content/assets/` 下所有 `ai-*.jpg` 文件已删除
- [x] 11 篇文章中的 AI 图片引用行已清理，无残留 `![原图遗失，AI生成]` 文本

## 代码高亮与数学公式
- [x] 文章中的代码块（shell/python/c/nginx/cmd 等）有语法着色
- [x] 代码高亮在浅色和深色模式下均有良好可读性
- [x] `code-frame` 外壳（语言标签 + 复制按钮）保留且功能正常
- [x] 行内公式 `$...$` 正确渲染为 KaTeX
- [x] 块级公式 `$$...$$` 正确渲染为 KaTeX 居中显示

## 追番追剧
- [x] `astro-bangumi` 已安装并在 `astro.config.mjs` 中配置
- [x] 追番页从 B 站 API 动态获取数据（非静态 JSON）
- [x] 追剧页从 B 站 API 动态获取数据
- [x] `.env` 中 `PUBLIC_BILIBILI_UID` 可配置不同用户
- [x] 深色模式下追番组件样式正确（darkSelector 适配）

## UI/UX
- [x] 朋友圈卡片在浅色模式下有设计感
- [x] 朋友圈卡片在深色模式下文字清晰可读
- [x] 朋友圈 CSS 变量名与全局变量一致（`--line`/`--text`/`--muted`/`--accent`）
- [x] 归档页置顶文章显示"置顶"徽章
- [x] 首页置顶文章显示"置顶"徽章
- [x] steamgames 页面加载时显示"加载中..."占位
- [x] steamgames 页面加载失败显示错误提示
- [x] 光标 dot 即时跟随无延迟
- [x] 光标 ring 缓动跟手无卡顿感
- [x] 设置面板中有主题色选择器
- [x] 切换主题色后全站强调色实时更新
- [x] 主题色选择持久化（刷新后保持）

## 废弃页面清理
- [x] `src/pages/life/games.astro` 用户选择保留
- [x] `src/pages/life/movies.astro` 用户选择保留
- [x] `netlify.toml` 中 `/life/movies/` 重定向规则已清理

## 右键菜单
- [x] 右键菜单正常显示（修复了 position/z-index 被覆盖的问题）
- [x] 右键菜单各功能项（后退/前进/刷新/回顶/复制/评论/主题/打印）可用

## 移动端导航
- [x] 移动端汉堡菜单点击后导航栏正常展开（修复了 .open/.is-open 类名不一致）
- [x] 导航栏展开后可正常点击各菜单项
- [x] 二级菜单在移动端可正常展开/收起
- [x] 导航栏不需要手动滑动即可显示全部菜单项

## 文档
- [x] `README.md` 内容为云灿博客项目的正确说明
- [x] README 不再包含"之江影集"/PicImpact 相关内容

## 构建
- [x] `npx astro check` 通过（0 errors）
- [x] `npm run build` 成功（49 页构建完成）
