# Tasks

- [x] Task 1: 构建产物自动生成 .nojekyll 和 .github
  - [x] SubTask 1.1: 创建 `scripts/postbuild.mjs`
  - [x] SubTask 1.2: 修改 `package.json` build 脚本
  - [x] SubTask 1.3: 验证 dist/.nojekyll（0 bytes）和 dist/.github/workflows/pages.yml 存在

- [x] Task 2: 诗集时间轴放大适配
  - [x] SubTask 2.1: `.poem-archive-year` font-size 2rem→3rem, flex 80px→100px
  - [x] SubTask 2.2: `.poem-archive-item` padding 14px18px→20px24px, gap 20px→24px
  - [x] SubTask 2.3: `.poem-archive-year-group` margin-bottom 28px→40px, gap 24px→32px
  - [x] SubTask 2.4: `.poem-content h3` font-size→1.1rem
  - [x] SubTask 2.5: `.poem-excerpt-multi p` font-size .85rem→.95rem, line-height 1.6→1.75
  - [x] SubTask 2.6: 移动端 680px 断点同步调整

- [x] Task 3: 修复设置面板无法打开
  - [x] SubTask 3.1: toggle click 事件改用命名函数 + removeEventListener
  - [x] SubTask 3.2: close、reset、setting-opt、checkbox、document click 全部防重复绑定
  - [x] SubTask 3.3: 类型检查通过

- [x] Task 4: 导航栏重构
  - [x] SubTask 4.1: 删除顶级"项目"，移入"个人"children
  - [x] SubTask 4.2: 新增"学术"（Google Scholar）和"作曲编曲"（网易云音乐）
  - [x] SubTask 4.3: 子菜单顺序：旧时光、恋爱小屋、关于、项目、学术、作曲编曲
  - [x] SubTask 4.4: 外部链接自动 target="_blank"

- [x] Task 5: 文章发布辅助脚本
  - [x] SubTask 5.1: 创建 `scripts/new-post.mjs`
  - [x] SubTask 5.2: 自动生成文件名和 frontmatter
  - [x] SubTask 5.3: package.json 新增 `"new"` 脚本
  - [x] SubTask 5.4: 语法校验通过

- [x] Task 6: 构建验证
  - [x] SubTask 6.1: `npm run build` 无错误（exit code 0）
  - [x] SubTask 6.2: 48 个页面正常生成
  - [x] SubTask 6.3: postbuild 正确执行（.nojekyll + .github 已复制到 dist）
