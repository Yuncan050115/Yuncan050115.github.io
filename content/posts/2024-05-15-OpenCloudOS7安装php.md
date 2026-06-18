---
title: OpenCloudOS7安装php
tags:
  - PHP8.2
  - OpenCloudOS
categories:
  - 疑难解惑
mathjax: true
sticky: 2
swiper_index: 2
cover: https://papi.yuncan.xyz/notephoto/263660915_1_20230404122411395.webp
description: "⚒️解决OpenCloudOS无法安装php的问题。"
abbrlink: ophp
date: 2024-05-15 10:41:28
---

今天想把api站转进宝塔面板内，结果遭遇php8.2无法安装的问题

![image-20240515102502597](https://papi.yuncan.xyz/notephoto/image-20240515102502597.png)

出于腾讯的优化机制，这里其实是缺少了centos的与Memcached服务器交互的C库，安装它需要先开启系统的实验模式工具，即PowerTools。
因此解决方法很简单，先执行：

```cmd
dnf config-manager --set-enabled PowerTools
```

然后再执行

```cmd
yum install -y libmemcached-devel
```

![image-20240515103155310](https://papi.yuncan.xyz/notephoto/image-20240515103155310.png)

重新安装php，发现成功安装。

![image-20240515102252946](https://papi.yuncan.xyz/notephoto/image-20240515102252946.png)