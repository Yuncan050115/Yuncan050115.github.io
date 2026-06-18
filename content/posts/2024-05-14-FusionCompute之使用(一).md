---
title: FusionCompute之使用(一)
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
abbrlink: fc1
date: 2024-05-14 12:21:30
---


## 一、用户创建

### 1.登录管理员账号

![image-20240513155254738](https://papi.yuncan.xyz/notephoto/image-20240513155254738.png)

### 2.创建个人账号

![image-20240513160810257](https://papi.yuncan.xyz/notephoto/image-20240513160810257.png)

### 3.登录个人账号

![image-20240513160853331](https://papi.yuncan.xyz/notephoto/image-20240513160853331.png)

## 二、安装虚拟机

### 1.创建虚拟机

选择上方

![image-20240513155521325](https://papi.yuncan.xyz/notephoto/image-20240513155521325.png)

### 2.选择虚拟机配置

![image-20240513155623694](https://papi.yuncan.xyz/notephoto/image-20240513155623694.png)

### 3.挂载光驱

![image-20240513155705930](https://papi.yuncan.xyz/notephoto/image-20240513155705930.png)

### 4.安装系统

选择个人虚拟机，进入VNC远程连接。

![image-20240513155842465](https://papi.yuncan.xyz/notephoto/image-20240513155842465.png)

进入后，选择左侧边栏第一按钮(Ctrl+Alt+Del)进行重新启动。

在弹出的安装程序中选择立即安装，同意条款。

选择自定义安装-加载驱动程序-浏览-选择A盘-选择amd文件夹，进入安装页面后点击下一步。

![image-20240513160245366](https://papi.yuncan.xyz/notephoto/image-20240513160245366.png)

等待安装完成。

![image-20240513160349023](https://papi.yuncan.xyz/notephoto/image-20240513160349023.png)

## 三、挂载Tools

### 1.进行挂载Tools任务

安装后右键虚拟机点击挂载Tools任务

![image-20240513171246086](https://papi.yuncan.xyz/notephoto/image-20240513171246086.png)

### 2.安装Tools

通过VNC连接，进入虚拟机，安装Tools

![image-20240513180156588](https://papi.yuncan.xyz/notephoto/image-20240513180156588.png)

### 3.连通网络

Tools安装完成后，点击restart重新启动虚拟机

![image-20240513180506174](https://papi.yuncan.xyz/notephoto/image-20240513180506174.png)

打开网络适配器设置可看到网络正常连通

![image-20240513181440961](https://papi.yuncan.xyz/notephoto/image-20240513181440961.png)