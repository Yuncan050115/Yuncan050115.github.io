# Checklist

## 构建产物
- [x] npm run build 后 dist/.nojekyll 存在且为空（0 bytes）
- [x] npm run build 后 dist/.github/ 目录存在且内容正确（workflows/pages.yml）
- [x] package.json build 脚本包含 postbuild 步骤

## 诗集时间轴
- [x] 年份字号增大到 3rem
- [x] 诗标题字号增大到 1.1rem
- [x] 诗文预览字号增大到 0.95rem
- [x] 条目内边距增大到 20px 24px
- [x] 年份组间距增大到 40px
- [x] 移动端样式同步调整

## 设置面板修复
- [x] 设置按钮点击后面板能正常打开（6处事件防重复绑定）
- [x] 设置按钮点击后面板能正常关闭
- [x] 事件不会重复绑定（命名函数 + removeEventListener）
- [x] 类型检查通过

## 导航重构
- [x] "项目"已移入"个人"子菜单
- [x] "个人"子菜单包含"学术"链接（Google Scholar）
- [x] "个人"子菜单包含"作曲编曲"链接（网易云音乐）
- [x] 外部链接在新标签页打开（BaseLayout 自动识别 http）
- [x] 子菜单顺序正确（旧时光→恋爱小屋→关于→项目→学术→作曲编曲）

## 文章发布脚本
- [x] npm run new 能交互式提示输入
- [x] 自动生成正确的文件名（YYYY-MM-DD-标题.md）
- [x] 自动生成完整的 frontmatter
- [x] 文件创建在 content/posts/ 目录

## 构建验证
- [x] npm run build 无错误（exit code 0）
- [x] 所有页面正常生成（48 页）
- [x] postbuild 正确执行
