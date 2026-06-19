# Checklist

## 音乐 API
- [x] .env 中 PUBLIC_METING_API 为完整模板 URL（含 /api 和占位符）
- [x] .env.example 同步更新注释

## GitHub sha
- [x] editPost 的 if (post.url) 分支设置 #pe-file-sha
- [x] 编辑已有文章保存成功（不再 409 冲突）

## 设置面板
- [x] initSettings 使用 dataset.ready 防重复
- [x] SettingsPanel.astro 根 div 移除 transition:persist
- [x] app.ts 移除末尾直接 boot() 调用
- [x] 设置面板能正常打开（dataset.ready 保证事件只绑定一次）
- [x] 设置面板切换页面后不消失（父级 header persist + applySettings 每次调用）
- [x] 设置按钮与日间夜间按钮行为一致（都用 dataset.ready 模式）

## FPS/运行天数
- [x] .runtime-tools 移除 transition:name
- [x] 切换页面后不再出现重复的 FPS/运行天数（只用 transition:persist）
- [x] FPS 和运行天数正常显示

## 朋友圈
- [x] circle.astro 未配置 API 时显示部署说明（5 步骤 + 文档链接）
- [x] fc_settings.yaml LINK 改为用户友链页

## 构建验证
- [x] npm run build 无错误（exit code 0）
- [x] 所有页面正常生成（49 页）
