# Checklist

## 导航子菜单外部链接
- [x] 子菜单中的外部链接（学术、作曲编曲）在新窗口打开
- [x] 子菜单中的内部链接在当前窗口打开

## 诗集时间轴
- [x] 时间轴显示所有诗文行（无截断）
- [x] 诗文字号增大到 1.05rem
- [x] 诗标题字号增大到 1.25rem
- [x] 诗文行间距增大到 1.9
- [x] 年份列宽度减少到 80px
- [x] 条目内边距调整为 18px 20px
- [x] 配图尺寸增大到 100px
- [x] 右侧空白减少

## 设置面板
- [x] 语言切换设置项已移除
- [x] 光标特效设置项已移除
- [x] 背景动效开关已添加
- [x] 设置面板能正常打开（panel.style.display 重置 + removeEventListener 保护）
- [x] 设置面板切换页面后不消失（transition:persist + applySettings 每次调用）
- [x] 设置值从 localStorage 恢复
- [x] persist 后事件正确绑定

## 管理页
- [x] FPS 点击 2 次即可打开管理页
- [x] 管理页背景固定不滚动（body.overflow=hidden + overlay position:fixed）
- [x] 置顶字段已添加
- [x] 封面字段已添加
- [x] 编辑文章时解析 sticky 和 cover
- [x] 保存时写入 sticky 和 cover

## GitHub Actions
- [x] pages.yml 统一使用 npm（npm ci + cache npm）
- [x] 构建后验证 _astro/ 目录存在（Verify build output 步骤）
- [x] 环境变量从 Secrets 注入（含 PUBLIC_CIRCLE_API）
- [x] pnpm-lock.yaml 已删除
- [x] pnpm-workspace.yaml 已删除
- [x] package.json 中 packageManager 已移除
- [x] package-lock.json 已重新生成（npm install）

## 朋友圈
- [x] /social/circle/ 页面已创建
- [x] 友链改为二级菜单（友人帐 + 朋友圈）
- [x] PUBLIC_CIRCLE_API 已添加到 .env 和 .env.example
- [x] 未配置 API 时显示友好提示
- [x] UI 风格与其他页面统一（circle-card + breathe-card 样式）

## 构建验证
- [x] npm run build 无错误（exit code 0）
- [x] 所有页面正常生成（49 页，含新增 /social/circle/）
