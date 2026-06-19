---
title: FusionCompute之快照管理(二)
tags:
  - 虚拟机
  - FusionCompute
  - 华为云
categories:
  - 虚拟机
mathjax: true
swiper_index: 2
description: "\U0001F387华为云虚拟机操作与使用。"
abbrlink: fc4
date: 2024-06-17 17:41:56
---


进入虚拟机VNC界面，新建文本文件test

```cmd
touch test
```


进入文件写入随机内容

```cmd
vi test

:wq
```


在平台创建虚拟机快照，选择内存快照


快照创建成功后将先前创建的文本删除

```cmd
rm test
```


此时在快照页点击恢复虚拟机


此时回到VNC界面，发现删除的文本又出现了


测试结束后，删除该快照，以免占用空间

