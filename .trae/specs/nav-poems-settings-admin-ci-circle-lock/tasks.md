# Tasks

- [x] Task 1: 导航子菜单外部链接新窗口
  - [x] SubTask 1.1: BaseLayout.astro 子菜单 `<a>` 添加 isExternal 判断和 target="_blank"

- [x] Task 2: 诗集时间轴完整显示 + 字号放大
  - [x] SubTask 2.1: poems.astro 移除 slice(0,4)，显示全部行
  - [x] SubTask 2.2: site.css 诗文字号→1.05rem，标题→1.25rem，行间距→1.9
  - [x] SubTask 2.3: site.css 年份列→80px，内边距→18px20px，配图→100px

- [x] Task 3: 设置面板重写
  - [x] SubTask 3.1: SettingsPanel.astro 移除语言切换和光标特效，新增背景动效开关
  - [x] SubTask 3.2: app.ts 移除 lang 和 cursorEffect 逻辑，新增 bgEffect 逻辑
  - [x] SubTask 3.3: persist 后事件正确绑定（removeEventListener + addEventListener）
  - [x] SubTask 3.4: applySettings() 每次调用，设置值从 localStorage 恢复

- [x] Task 4: 管理页增强
  - [x] SubTask 4.1: app.ts initFps() 点击次数 5→2
  - [x] SubTask 4.2: app.ts showPostEditor/closeOverlay 添加 body.overflow 控制
  - [x] SubTask 4.3: PostEditor.astro 新增置顶和封面字段
  - [x] SubTask 4.4: app.ts generateMarkdown 写入 sticky/cover，editPost 解析 sticky/cover

- [x] Task 5: GitHub Actions 重设计
  - [x] SubTask 5.1: pages.yml 重写（npm ci + build + 验证 _astro + deploy main）
  - [x] SubTask 5.2: 删除 pnpm-lock.yaml、pnpm-workspace.yaml
  - [x] SubTask 5.3: package.json 移除 packageManager 字段
  - [x] SubTask 5.4: npm install 重新生成 package-lock.json

- [x] Task 6: 朋友圈集成
  - [x] SubTask 6.1: 创建 src/pages/social/circle.astro
  - [x] SubTask 6.2: yuncan.config.ts 友链改为二级菜单（友人帐 + 朋友圈）
  - [x] SubTask 6.3: .env 和 .env.example 新增 PUBLIC_CIRCLE_API
  - [x] SubTask 6.4: site.css 添加朋友圈页面样式

- [x] Task 7: 构建验证
  - [x] SubTask 7.1: npm run build 无错误（exit code 0）
  - [x] SubTask 7.2: 49 个页面正常生成（含新增 /social/circle/）
