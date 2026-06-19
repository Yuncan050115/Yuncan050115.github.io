# Checklist

## RSS Feed
- [x] `https://blog.yuncan.xyz/atom.xml` 返回有效的 Atom XML
- [x] feed 包含文章标题、链接、摘要、发布日期
- [x] BaseLayout 的 `<head>` 中有 RSS `<link>` 标签

## 友人帐申请格式
- [x] 友链页底部显示友链申请格式模板
- [x] 格式包含站点名、链接、头像、描述字段

## 白天背景动效
- [x] 白天模式下无太阳/光波/云朵 CSS 动画
- [x] 白天模式下 Three.js 粒子不渲染
- [x] 夜间模式星空+流星动效正常保留

## 追番追剧页面
- [x] 追番页番剧数量显示正确（2 想看/60 在看/13 看过）
- [x] 追剧页影视数量显示正确
- [x] 分页按钮点击可正常切换页面（cloneNode 重新绑定事件）
- [x] 深色/浅色模式切换时组件样式自动响应（MutationObserver 监听 data-theme）
- [x] UI 样式与全站统一（CSS 变量映射）

## KaTeX 警告
- [x] 构建时不再输出 `unicodeTextInMathMode` 警告
- [x] 数学公式仍正常渲染

## 光标
- [x] 光标为简洁单层圆点设计
- [x] 光标流畅跟手无卡顿（无 rAF 循环，直接跟随）
- [x] 悬停链接时光标有视觉反馈（放大为 24px 半透明圆）
- [x] 无多余的 rAF 循环
- [x] 不与 Three.js 粒子系统交互

## 加载超时
- [x] 朋友圈页面 fetch 有 8 秒超时
- [x] 朋友圈超时后显示错误提示和重试按钮
- [x] Steam 页面 fetch 有 8 秒超时
- [x] Steam 超时后显示错误提示和重试按钮
- [x] 重试按钮点击后重新加载数据

## 构建
- [x] `npx astro check` 通过（0 errors, 0 warnings）
- [x] `npm run build` 成功（49 页构建完成，atom.xml 已生成）
