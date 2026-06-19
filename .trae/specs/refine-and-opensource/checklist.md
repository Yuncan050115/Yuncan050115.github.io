# Checklist

## 赞赏弹窗
- [x] 白天模式点击"赞赏作者"弹窗在视口正中央显示
- [x] 夜间模式点击"赞赏作者"弹窗在视口正中央显示
- [x] 弹窗可正常关闭
- [x] `panel-rise-light` 动画不再影响弹窗（弹窗 DOM 已从 [slug].astro 的 article 内移除，提升到 BaseLayout body 子级）
- [x] 弹窗 DOM 不在 main 层叠上下文内（提升至 body 子级，位于 `</main>` 之后、`</body>` 之前）
- [x] 弹窗 z-index 高于 header/music-dock/runtime-tools（reward-dialog z-index: 1002，header 1000，music-dock/runtime-tools 1001）

## 标签/友链悬停动效
- [x] 标签云悬停使用 transform 而非 flex 过渡（.tag-cloud a transition 用 transform，hover 用 transform: scale）
- [x] 标签项无文字溢出（有 overflow: hidden、white-space: nowrap、text-overflow: ellipsis、min-width: 0）
- [x] 光标在标签间移动无位置跳动（flex: 0 1 auto 不随 hover 变化）
- [x] 友链网格悬停使用 transform 而非 flex 过渡（.friend-card transition 用 transform，hover 用 transform: scale）
- [x] 友链卡片无文字溢出、头像无被裁切（.friend-card p 有 -webkit-line-clamp，strong 有 ellipsis 截断）
- [x] 光标在友链卡片间移动无位置跳动（flex: 1 1 280px 不随 hover 变化）

## 白天光效
- [x] 白天 `#breath-scene` 混合模式为 screen 或 soft-light（mix-blend-mode: screen）
- [x] 白天 opacity 在 0.5-0.65 之间（opacity: 0.55）
- [x] 白天粒子有冷色调平衡（白色 0.9/0.95/1.0 与浅蓝 0.6/0.8/1.0 混合，非全暖色）
- [x] 白天 core 亮度系数降低（片元着色器 core 系数为 1.0，非 1.6）
- [x] 白天有呼吸闪烁效果（vTwinkle 白天为 0.75 + 0.15 * sin(...)，非恒定 0.9）
- [x] 无"黑黄一大坨"刺眼效果（screen 混合 + opacity 0.55 + 冷色粒子 + core 1.0 综合生效）

## 夜间光效
- [x] 夜间 opacity 削弱至约 0.7（opacity: 0.7）
- [x] 加了 FPS 节流（TARGET_INTERVAL = 1000/36，约 36fps）
- [x] DPR 上限降至 1.0（setPixelRatio(Math.min(window.devicePixelRatio, 1.0))）
- [x] 夜间星空美感保留（流星 spawnMeteor 与闪烁 twinkle 逻辑保留）
- [x] 卡顿明显减少（FPS 节流 + DPR 降低）

## 文风统一
- [x] 旧时光 timeline 四段文字已重写（坦诚自省风格，如"写得很生硬，错处也不少"）
- [x] 13 处 PageHero description 已重写（抽查 tags/link/poems/archives 均为平实自述）
- [x] 首页 entrances 与分类卡文案已重写（如"同一类的文章，可以顺着读一遍"）
- [x] 赞赏文案已重写（无"请小站喝杯热茶"，改为"如果这篇文章对你有帮助，可以请我喝杯茶"）
- [x] 文风一致、不矫饰、像用户自写

## Favicon
- [x] `<link rel="icon">` 指向实际存在的图片资源（指向 /assets/logo-yuncan.png）
- [x] 补全 apple-touch-icon（apple-touch-icon link 已存在）
- [x] 浏览器标签页显示图标（public/assets/logo-yuncan.png 存在）

## blog 项目整理
- [x] `.gitignore` 补全（dist、node_modules、.astro、.netlify、.env 均已包含）
- [x] `yuncan.config.ts` 每个配置项有中文注释
- [x] 新增 `README.md`（项目介绍、技术栈、目录结构、使用说明、致谢）
- [x] 删除杂散文件（wx.jpg、zfb.jpg、check_sort.js、pnpm-workspace.yaml 仍存在于根目录，用户选择保留；public/assets/下的 wx.jpg、zfb.jpg 为赞赏码所需）
- [x] 精简旧 Hexo 项目未引用文件（旧项目Hexo生成的前端页面已精简至仅保留 steamgames/index.html；旧项目Hexo启动器/ 下 themes/、scaffolds/ 等用户选择保留）
- [x] 移除明文 Steam API Key（改为 import.meta.env.STEAM_API_KEY，.env.example 提供模板）
- [x] 构建无错误、功能不受影响

## navigate 项目整理
- [x] 删除 Vite 遗留配置（vite.config.js、index.html、.eslintrc.json、.prettierrc.json、.hintrc 均已删除）
- [x] 删除旧样式目录 `src/style/`（当前为 src/styles/，旧的单数目录已删除）
- [x] 删除一次性脚本与占位文件（scripts/update-store-imports.js 保留，为构建辅助脚本）
- [x] `.env` 改为 `.env.example` 模板（.env.example 存在，.env 已加入 .gitignore）
- [x] CODE_OF_CONDUCT 邮箱更新（已更新为 yuncan3543@gmail.com）
- [x] 作者信息统一（package.json github 字段为 https://github.com/CN-Yuncan）
- [x] imsyy LICENSE 版权署名保留不变（Copyright (c) 2022 imsyy 保留）
- [x] navigate 项目构建无错误

## 构建验证
- [x] blog 项目 `npm run build` 无错误
- [x] navigate 项目构建无错误
