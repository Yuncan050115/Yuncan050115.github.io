---
title: FusionCompute之使用(一)
tags:
  - 虚拟机
  - FusionCompute
  - 华为云
categories:
  - 虚拟机
mathjax: true
swiper_index: 2
description: "\U0001F387华为云虚拟机操作与使用。"
abbrlink: fc1
date: 2024-05-14 12:21:30
---


## 一、用户创建

### 1.登录管理员账号

![原图遗失，AI生成](content/assets/ai-2024-05-14-FusionCompute之使用-一--7.jpg)

### 2.创建个人账号

![原图遗失，AI生成](content/assets/ai-2024-05-14-FusionCompute之使用-一--8.jpg)

### 3.登录个人账号

![原图遗失，AI生成](content/assets/ai-2024-05-14-FusionCompute之使用-一--9.jpg)

## 二、安装虚拟机

### 1.创建虚拟机

选择上方

![原图遗失，AI生成](content/assets/ai-2024-05-14-FusionCompute之使用-一--10.jpg)

### 2.选择虚拟机配置

![原图遗失，AI生成](content/assets/ai-2024-05-14-FusionCompute之使用-一--11.jpg)

### 3.挂载光驱

![原图遗失，AI生成](content/assets/ai-2024-05-14-FusionCompute之使用-一--12.jpg)

### 4.安装系统

选择个人虚拟机，进入VNC远程连接。

![原图遗失，AI生成](content/assets/ai-2024-05-14-FusionCompute之使用-一--13.jpg)

进入后，选择左侧边栏第一按钮(Ctrl+Alt+Del)进行重新启动。

在弹出的安装程序中选择立即安装，同意条款。

选择自定义安装-加载驱动程序-浏览-选择A盘-选择amd文件夹，进入安装页面后点击下一步。

![原图遗失，AI生成](content/assets/ai-2024-05-14-FusionCompute之使用-一--14.jpg)

等待安装完成。

![原图遗失，AI生成](content/assets/ai-2024-05-14-FusionCompute之使用-一--15.jpg)

## 三、挂载Tools

### 1.进行挂载Tools任务

安装后右键虚拟机点击挂载Tools任务

![原图遗失，AI生成](content/assets/ai-2024-05-14-FusionCompute之使用-一--16.jpg)

### 2.安装Tools

通过VNC连接，进入虚拟机，安装Tools

![原图遗失，AI生成](content/assets/ai-2024-05-14-FusionCompute之使用-一--17.jpg)

### 3.连通网络

Tools安装完成后，点击restart重新启动虚拟机

![原图遗失，AI生成](content/assets/ai-2024-05-14-FusionCompute之使用-一--18.jpg)

打开网络适配器设置可看到网络正常连通

![原图遗失，AI生成](content/assets/ai-2024-05-14-FusionCompute之使用-一--19.jpg)