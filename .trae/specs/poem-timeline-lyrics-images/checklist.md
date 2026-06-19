# Checklist

## 诗集时间轴
- [x] 时间轴视图使用 .poem-archive-row + .poem-archive-year + .poem-archive-list 结构
- [x] 左侧年份大字号固定，右侧诗列表
- [x] 样式与归档页面的 .archive-row 一致
- [x] 旧的 .poem-line 相关 CSS 已删除或替换
- [x] 所有诗按年份正确分组

## 文章配图
- [x] 所有文章图片 URL 已测试
- [x] 失效图片已生成 AI 替代图（57 个）
- [x] Markdown 中图片 URL 已更新
- [x] 替代图标注"（原图遗失，AI生成）"
- [x] 构建后配图正常显示

## 歌词底部栏
- [x] 歌词栏 HTML 在 BaseLayout 中（使用 transition:persist）
- [x] 歌词栏样式正确（底部固定、半透明、高度约 36px）
- [x] 播放器播放有歌词歌曲时歌词栏显示
- [x] 点击歌词栏可关闭
- [x] 关闭状态记录到 sessionStorage
- [x] 刷新后根据 sessionStorage 决定显示/隐藏
- [x] 页面切换时歌词栏保持（不闪烁、不重复）

## 构建验证
- [x] npm run build 无错误
- [x] 所有页面正常生成（48 页）
