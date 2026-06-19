# 诗集时间轴重构、配图修复、歌词栏 Spec

## Why
用户要求：诗集时间轴做成与归档页面相同的时间块样式；文章配图大量失效需根据上下文生成 AI 图片替换（保存到本地）；音乐歌词显示在页面底部小栏中（点击关闭，刷新恢复）。

## What Changes
- 诗集时间轴视图：改用归档页面的 `.archive-row` 布局（左侧大年份、右侧诗列表），替换当前的 `.poem-line` 列表样式
- 文章配图修复：检测失效图片，根据文章上下文（标题、前后文）生成 AI 图片，保存到 `content/assets/`，替换 Markdown 中的 URL
- 歌词底部栏：在 BaseLayout 添加歌词栏（`transition:persist` 跨页面保持），半透明，点击关闭（sessionStorage 记录关闭状态），刷新后恢复

## Impact
- Affected code:
  - `src/pages/poems.astro`（时间轴 HTML 重构）
  - `src/styles/site.css`（新增 `.poem-archive-row` 样式）
  - `content/posts/*.md`（配图 URL 替换）
  - `content/assets/`（生成的 AI 图片）
  - `src/layouts/BaseLayout.astro`（歌词栏 HTML）
  - `src/scripts/app.ts`（歌词栏交互逻辑）

## ADDED Requirements

### Requirement: 诗集时间轴使用归档时间块样式
诗集页面的"时间轴视图" SHALL 使用与归档页面相同的布局：
- 左侧年份（大字号，固定宽度，与归档一致）
- 右侧诗列表（竖排，每条含日期、标题、作者、诗文预览）
- 不再使用当前的 `poem-line` 列表样式

#### Scenario: 查看诗集时间轴
- **WHEN** 用户点击"时间轴"按钮
- **THEN** 显示与归档页面布局相同的时间块：左侧年份大字，右侧诗列表

### Requirement: 文章配图 AI 生成修复
content/posts 目录下所有 Markdown 文章中失效的图片 SHALL 由 AI 根据上下文生成实际图片替换：
1. 遍历 `content/posts/*.md`，提取所有 `![alt](url)` 图片 URL
2. 对每个 URL 发送请求测试可用性（3秒超时），将失效 URL 记录
3. 对每个失效图片：
   - 读取所属 MD 文件，提取文章标题
   - 提取图片前后各约 100 字的文字作为上下文描述
   - 根据上下文构造图片生成 prompt（描述性、现实风格）
   - 调用图片生成 API 生成图片
   - 将生成的图片保存到 `content/assets/` 目录，文件名为 `ai-{文章slug}-{序号}.png`
   - 更新 MD 中的图片 URL 指向本地生成的图片，注释改为 `[原图遗失，AI生成](ai-{slug}-{n}.png)`
4. **完成后暂停项目，输出检查清单**：列出所有修改的 MD 文件、生成的图片路径和对应的生成 prompt，让用户确认图片是否符合上下文

#### Scenario: 文章配图失效
- **WHEN** 检测到文章中某配图 URL 请求失败
- **THEN** 根据上下文生成 AI 图片保存到本地，替换 URL，暂停后输出清单供用户检查

### Requirement: 歌词底部栏
系统 SHALL 在页面底部显示歌词栏：
- 歌词栏使用 `transition:persist` 在页面间保持，不重复创建
- 初始状态：隐藏（`opacity: 0; transform: translateY(100%)`）
- 当播放器播放有歌词的歌曲时：歌词栏淡入显示（`opacity: 1; transform: translateY(0)`），显示当前歌词
- 歌词栏半透明（`opacity: 0.7`）、高度约 36px、固定在页面底部
- 点击歌词栏任意位置：关闭歌词栏（淡出隐藏），使用 `sessionStorage.setItem('lyric-bar-closed', '1')` 记录状态
- 刷新网页后：检查 `sessionStorage.getItem('lyric-bar-closed')`，若为 '1' 则保持隐藏，否则显示
- 关闭后当前歌词内容保留在 DOM 中（不销毁），下次刷新可恢复

#### Scenario: 歌词栏显示与关闭
- **WHEN** 播放器播放有歌词的歌曲
- **THEN** 底部歌词栏淡入显示当前歌词

- **WHEN** 用户点击歌词栏
- **THEN** 歌词栏淡出隐藏，`sessionStorage` 记录关闭状态

- **WHEN** 用户刷新页面
- **THEN** 歌词栏根据 sessionStorage 状态决定显示或隐藏（已关闭则保持隐藏）

## MODIFIED Requirements

### Requirement: 诗集时间轴视图
诗集页面时间轴视图 SHALL 使用 `.poem-archive-row` + `.poem-archive-year` + `.poem-archive-list` 结构，样式与 `.archive-row` 一致。

## REMOVED Requirements

### Requirement: 旧 poem-line 列表样式
**Reason**: 被归档风格的时间块取代
**Migration**: 删除 `.poem-line` 相关 CSS
