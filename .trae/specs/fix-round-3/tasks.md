# Tasks

- [x] Task 1: 删除朋友圈功能
  - [x] SubTask 1.1: 移除 src/pages/social/link.astro 中的朋友圈标签页和 Fcircle 相关代码
  - [x] SubTask 1.2: 移除 yuncan.config.ts 中的 fcircle 配置
  - [x] SubTask 1.3: 移除 site.ts 中的 fcircle 引用
  - [x] SubTask 1.4: 移除 site.css 中的 fcircle 相关样式

- [x] Task 2: 修复诗集页面
  - [x] SubTask 2.1: 修复时间轴排序：正确解析中文数字日期，按真实日期排序
  - [x] SubTask 2.2: 解析并显示序言（# 序 到 # 说明 之间的内容）
  - [x] SubTask 2.3: 目录视图按钮改名为"诗集"
  - [x] SubTask 2.4: 在诗篇卡片中显示配图图片（非文字提示）
  - [x] SubTask 2.5: 增大字号，确保可读性
  - [x] SubTask 2.6: 保留防复制保护

- [x] Task 3: 重做播放器悬停内容
  - [x] SubTask 3.1: 移除丑陋的歌单列表布局
  - [x] SubTask 3.2: 参考导航站播放器风格重做悬停内容
  - [x] SubTask 3.3: 悬停显示：封面、歌曲名、艺术家、播放/暂停、上一首/下一首
  - [x] SubTask 3.4: 保持主题适配

- [x] Task 4: 恢复归档页面时间块样式
  - [x] SubTask 4.1: 恢复 archive-row + archive-item 布局（左年份右文章列表）
  - [x] SubTask 4.2: 保留丝滑悬停动效
  - [x] SubTask 4.3: 确保文章封面正常显示

- [x] Task 5: 标签页面丝滑动效
  - [x] SubTask 5.1: 为标签页面应用丝滑悬停动效
  - [x] SubTask 5.2: 标签悬停时展开/高亮

- [x] Task 6: 主页分类提前
  - [x] SubTask 6.1: 将分类区域移到最近文章前面
  - [x] SubTask 6.2: 不修改分类区域内部代码

- [x] Task 7: 修复 Three.js 动效不可见
  - [x] SubTask 7.1: 修复 site.css 中多处 #breath-scene 的 z-index/opacity 冲突
  - [x] SubTask 7.2: 确保 canvas 在背景层但可见
  - [x] SubTask 7.3: 验证白天和夜间动效都明显可见

- [x] Task 8: 修复导航站文字可读性
  - [x] SubTask 8.1: 修复 navigatepage 文字颜色对比度
  - [x] SubTask 8.2: 确保所有文字清晰可读

- [x] Task 9: 两站优点互补
  - [x] SubTask 9.1: blog 吸取导航站播放器优点
  - [x] SubTask 9.2: 导航站吸取 blog 动效和主题适配

- [x] Task 10: 构建验证
  - [x] SubTask 10.1: npm run build 无错误
  - [x] SubTask 10.2: 所有页面正常生成

# Task Dependencies
- Task 3 依赖 Task 7（动效修复后再调整播放器）- 已完成
- Task 9 依赖 Task 3 和 Task 8 - 已完成
- Task 10 依赖所有其他任务完成 - 已完成
