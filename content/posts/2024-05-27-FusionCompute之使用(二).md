---
title: FusionCompute之使用(二)
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
abbrlink: fc3
date: 2024-05-27 11:11:35
---


在FusionCompute平台创建虚拟机，选择linux的CentOS7.0系统

![img](https://papi.yuncan.xyz/notephoto/clip_image002.png)

硬盘配置模式选择精简模式

![img](https://papi.yuncan.xyz/notephoto/clip_image004.png)

此时已经创建完成，进入配置页面，选中硬件-光驱，选择以文件方式挂载光驱，选择CentOS7.0系统的镜像文件

![image-20240617085433886](https://papi.yuncan.xyz/notephoto/image-20240617085433886.png)

此时进入VNC界面，在左侧边栏第一项选按Ctrl+Alt+Delete组合键以进入系统，此时按Enter键开始安装

![img](https://papi.yuncan.xyz/notephoto/clip_image008.png)

进入安装程序，此时下滑到底部，选择中文

![img](https://papi.yuncan.xyz/notephoto/clip_image010.png)

选择安装位置，在Base Environment中选择Server with GUI

![img](https://papi.yuncan.xyz/notephoto/clip_image012.png)

时区选择上海

![img](https://papi.yuncan.xyz/notephoto/clip_image014.png)

设置ROOT密码后点击开始安装

![img](https://papi.yuncan.xyz/notephoto/clip_image016.png)

安装成功后登录账号和密码，进入系统

![img](https://papi.yuncan.xyz/notephoto/clip_image017.png)

在平台选择挂载Tools

![img](https://papi.yuncan.xyz/notephoto/clip_image018.png)

在终端输入以下命令，查看是否存在“qemu-guest-agent”服务

```cmd
ps -eaf | grep qemu-ga
```

若存在，则输入以下命令卸载该服务

```cmd
rpm -e qemu-guest-agent

reboot
```

卸载服务或者如下图一样发现不存在该服务后，则继续输入以下命令，挂载虚拟机光驱

```cmd
mkdir xvdd

mount /dev/sr0 xvdd
```

![img](https://papi.yuncan.xyz/notephoto/clip_image020.png)

安装vmtools后输入reboot重启

![img](https://papi.yuncan.xyz/notephoto/clip_image022.png)

此时面板显示Tools状态为运行中，说明安装成功

![img](https://papi.yuncan.xyz/notephoto/clip_image024.png)

 