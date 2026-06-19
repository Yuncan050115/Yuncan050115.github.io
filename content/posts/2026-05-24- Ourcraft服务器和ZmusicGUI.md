---
title: Ourcraft服务器和ZmusicGUI
tags:
  - Minecraft
  - Kotlin
  - Ourcraft
categories:
  - Ourcraft
  - 此间话闲
cover: https://api.yuncan.xyz/blog/260620_014554.webp
description: "服务器。"
abbrlink: zmusic-gui
date: 2026-05-24 23:30:51
---

我的 Minecraft 服务器 Ourcraft 最近升到了26.1.2，用的 Purpur 内核。服务器开了六年了，从高中到现在，断断续续维护。

升级之后找了个音乐插件zmusic，但是没有界面，故做。

![image-20260620014553306](https://api.yuncan.xyz/blog/260620_014554.webp)

> 服务器IP:mcyc.top，客户端disk.yuncan.xyz    无奖竞猜，背景图片是谁

## Kotlin

Kotlin 的语法糖比 Java 舒服太多，尤其是协程，处理异步任务（比如等音乐下载完再播放）比 Java 的 `CompletableFuture` 优雅一截。

## GUI

我的插件叫 ZmusicGUI

玩家输入 `/zmg` 调用`Inventory` API打开箱子界面，歌曲列表、播放控制。

/点歌 也行

有兴趣的可以看我的github仓库，懒得写了
