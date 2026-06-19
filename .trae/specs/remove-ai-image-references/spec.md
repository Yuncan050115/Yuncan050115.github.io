# 清理文章中 AI 图片引用 Spec

## Why
项目中 11 篇文章原本引用了已遗失的 AI 生成图片，这些图片引用以 `![原图遗失，AI生成](content/assets/ai-...jpg)` 形式存在。这些引用指向不存在的资源，且 alt 文本表明图片已遗失，影响文章可读性与站点质量，需要统一清理。

## What Changes
- 删除 11 篇文章中所有形如 `![原图遗失，AI生成](...)` 的图片引用整行
- 删除引用行后若产生超过 2 个的连续空行，清理为单个空行
- 保留所有非 AI 图片的引用（即 alt 文本不包含 "原图遗失，AI生成" 的图片引用）
- 保留文章其余内容（front matter、正文、其他图片、代码块等）不变

## Impact
- Affected specs: 无（本任务为内容清理，不涉及功能 spec）
- Affected code: `content/posts/` 目录下 11 篇 Markdown 文章
  - 2023-06-24-线性结构-数据结构与算法（一）.md（已完成）
  - 2023-06-29-树形结构-数据结构与算法（二）.md（已完成）
  - 2023-07-02-散列表-数据结构与算法（三）.md（已完成）
  - 2023-07-06-图结构-数据结构与算法（四）.md（已完成）
  - 2023-07-09-排序算法-数据结构与算法（五）.md（2 处）
  - 2024-05-14-FusionCompute之使用(一).md（13 处）
  - 2024-05-15-OpenCloudOS7安装php.md（3 处）
  - 2024-05-16-博客建站之插件使用范例.md（8 处，含 1 处带 `> ` 引用块前缀）
  - 2024-05-17-FusionCompute之快照管理(一).md（7 处）
  - 2024-05-27-FusionCompute之使用(二).md（13 处）
  - 2024-06-17-FusionCompute之快照管理(二).md（7 处）

## ADDED Requirements
### Requirement: 移除 AI 图片引用
系统（文章内容）SHALL 不再包含任何 alt 文本为 "原图遗失，AI生成" 的图片引用行。

#### Scenario: 文章中存在 AI 图片引用
- **WHEN** 文章中存在形如 `![原图遗失，AI生成](content/assets/ai-...jpg)` 的行（可能带 `> ` 前缀）
- **THEN** 该整行应被删除

#### Scenario: 删除后产生多余空行
- **WHEN** 删除 AI 图片引用行后产生超过 2 个连续空行
- **THEN** 应将连续空行清理为单个空行

#### Scenario: 非 AI 图片引用保留
- **WHEN** 文章中存在 alt 文本不包含 "原图遗失，AI生成" 的图片引用
- **THEN** 该引用应被保留，不做修改

## MODIFIED Requirements
无

## REMOVED Requirements
无
