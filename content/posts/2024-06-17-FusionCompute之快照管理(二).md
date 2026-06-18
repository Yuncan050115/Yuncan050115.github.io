---
title: FusionCompute之快照管理(二)
tags:
  - 虚拟机
  - FusionCompute
  - 华为云
categories:
  - 虚拟机
mathjax: true
sticky: 2
swiper_index: 2
description: "\U0001F387华为云虚拟机操作与使用。"
abbrlink: fc4
date: 2024-06-17 17:41:56
---


进入虚拟机VNC界面，新建文本文件test

```cmd
touch test
```

![img](https://papi.yuncan.xyz/notephoto/clip_image002.png)

进入文件写入随机内容

```cmd
vi test

:wq
```

![img](https://papi.yuncan.xyz/notephoto/clip_image004.png)

在平台创建虚拟机快照，选择内存快照

![img](https://papi.yuncan.xyz/notephoto/clip_image006.png)

快照创建成功后将先前创建的文本删除

```cmd
rm test
```

![img](https://papi.yuncan.xyz/notephoto/clip_image008.png)

此时在快照页点击恢复虚拟机

![img](https://papi.yuncan.xyz/notephoto/clip_image010.png)

此时回到VNC界面，发现删除的文本又出现了

![img](https://papi.yuncan.xyz/notephoto/clip_image012.png)

测试结束后，删除该快照，以免占用空间

![img](https://papi.yuncan.xyz/notephoto/clip_image014.png)