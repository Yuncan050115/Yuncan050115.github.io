---
title: 接入 Claude Code指北
tags:
  - Claude Code
categories:
  - 教程
cover: https://api.yuncan.xyz/blog/260625_145945.webp
updated: 2026-06-25 15:19:29
date: 2026-06-25 15:19:29
abbrlink: 1782371969718
---

## 接入 Claude Code指北

### 本体下载

给老师汇报，claudecode 本质上是一个nodejs架构的工具，有三种办法可以下载软件本体：

1. 目前主流的GUI一键配置下载方法是CC Switch([官方文档](https://ccswitch.io/zh/docs?section=getting-started) [下载地址](https://disk.yuncan.xyz/d/CC-Switch-v3.16.3-Windows.msi?sign=7bh9WfPncGtbyhRIgVdKeXHiVrVNlHHOfvvwOD9iifg=:0))
2. 也可以下载[nodejs](https://nodejs.org/en/download) ，通过命令安装：`npm install -g @anthropic-ai/claude-code`
3. 还可以通过[官网下载](https://claude.com/product/claude-code)(不推荐)

![image-20260625145945485](https://api.yuncan.xyz/blog/260625_145945.webp)

​	注：如果遇到登录校验，找到用户目录下的**C:\Users\你的用户名\.claude.json**进行配置

```json
{
  "hasCompletedOnboarding": true
}
```

### 前置条件

1. 注册 DeepSeek 账号并生成 API Key：[platform.deepseek.com](https://platform.deepseek.com/)
2. 给账户充一点余额（10 元人民币够跑很久)

![image-20260625145830146](https://api.yuncan.xyz/blog/260625_145837.webp)

### 配置环境变量

Claude Code 通过以下环境变量与 DeepSeek API 进行对接，各变量含义如下：

| 环境变量                         | 说明                                        |
| :------------------------------- | :------------------------------------------ |
| `ANTHROPIC_BASE_URL`             | 指向 DeepSeek 兼容 Anthropic 协议的接口地址 |
| `ANTHROPIC_AUTH_TOKEN`           | 你的 DeepSeek API Key                       |
| `ANTHROPIC_MODEL`                | 默认使用的模型                              |
| `ANTHROPIC_DEFAULT_OPUS_MODEL`   | 映射 Opus 层级（复杂推理任务）所用模型      |
| `ANTHROPIC_DEFAULT_SONNET_MODEL` | 映射 Sonnet 层级（日常编程任务）所用模型    |
| `ANTHROPIC_DEFAULT_HAIKU_MODEL`  | 映射 Haiku 层级（快速轻量任务）所用模型     |
| `CLAUDE_CODE_SUBAGENT_MODEL`     | 子任务 Agent 使用的模型（建议用较快的模型） |
| `CLAUDE_CODE_EFFORT_LEVEL`       | 思考深度，可选 `low` / `medium` / `max`     |

可以通过以下命令一键配置

powershell：

```powershell
$env:ANTHROPIC_BASE_URL="https://api.deepseek.com/anthropic"
$env:ANTHROPIC_AUTH_TOKEN="<你的 DeepSeek API Key>"
$env:ANTHROPIC_MODEL="deepseek-v4-pro[1m]"
$env:ANTHROPIC_DEFAULT_OPUS_MODEL="deepseek-v4-pro[1m]"
$env:ANTHROPIC_DEFAULT_SONNET_MODEL="deepseek-v4-pro[1m]"
$env:ANTHROPIC_DEFAULT_HAIKU_MODEL="deepseek-v4-flash"
$env:CLAUDE_CODE_SUBAGENT_MODEL="deepseek-v4-flash"
$env:CLAUDE_CODE_EFFORT_LEVEL="max"
```

### 验证是否生效

配置完成后，启动 Claude Code 并执行 **/status** 命令验证：

![image-20260625150347409](https://api.yuncan.xyz/blog/260625_150347.webp)

看到这些信息即表示配置成功，Claude Code 现在已经在使用 DeepSeek V4 进行推理了。

> 如果显示的不是上述信息，请逐项检查：环境变量是否设置正确、API Key 是否有效、变量名是否有拼写错误。

### 开始使用

进入你的项目目录，执行 `claude` 命令即可启动 Claude Code：

```
cd 需要进行操作的目录
claude
```

### 使用技巧

使用快捷键shift+tab可以切换对话模式，有对话模式，计划模式，以及全自动模式（建议），开启全自动模式以后就可以解放双手完成任务了

![image-20260625150701146](https://api.yuncan.xyz/blog/260625_150701.webp)

除了上述cc+ds的方式，还可以下载国产IDE：[TRAE](https://www.trae.ai/) ，本质上它们的使用方式是相同的，对话时应该分条列点，尽量避免以前与AI对话的习惯，这样才能使AI缓存命中率提高。

![image-20260625150820007](https://api.yuncan.xyz/blog/260625_150820.webp)

每次完成任务可以让ai先生成一个万字以上的AI知识库再进行作业。

![image-20260625151556452](https://api.yuncan.xyz/blog/260625_151556.webp)

### 什么是缓存命中率？

在deepseek官方定价表中，我们看到，缓存命中和未命中的区别很大。

![image-20260625150958821](https://api.yuncan.xyz/blog/260625_150958.webp)

顾名思义，缓存命中就是请求的数据在缓存中存在，系统直接返回，未命中就是从头遍历或者从零开始生成，耗时耗算力。这就要求我们的prompt尽量避免宽泛、口语化，并且善用现成的skills，可以省钱省时间。

### 推荐的skills

PPT推荐OpenAI旗下的slides，可以通过nodejs命令安装：`npx skills add https://github.com/openai/skills --skill slides`

DOC文档推荐Anthropic旗下的doc-coauthoring，下载地址为`https://github.com/anthropics/skills/tree/main/skills/doc-coauthoring`

skills的使用方法非常简单，直接与AI对话即可，如图所示

![image-20260625151501387](https://api.yuncan.xyz/blog/260625_151501.webp)

另附自动作业时自动截图的prompt：

~~~powershell
# 捕获前台窗口截图（Win32 API）
Add-Type -AssemblyName System.Drawing
$sig = @"
using System;
using System.Runtime.InteropServices;
public class Win32Cap {
    [DllImport("user32.dll")]
    public static extern IntPtr GetForegroundWindow();
    [DllImport("user32.dll")]
    public static extern bool GetWindowRect(IntPtr hWnd, out RECT rect);
    public struct RECT { public int Left; public int Top; public int Right; public int Bottom; }
}
"@
Add-Type $sig
$handle = [Win32Cap]::GetForegroundWindow()
$rect = New-Object Win32Cap+RECT
[Win32Cap]::GetWindowRect($handle, [ref]$rect) | Out-Null
$bounds = New-Object System.Drawing.Rectangle($rect.Left, $rect.Top, ($rect.Right-$rect.Left), ($rect.Bottom-$rect.Top))
$bitmap = New-Object System.Drawing.Bitmap($bounds.Width, $bounds.Height)
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.CopyFromScreen($bounds.Location, [System.Drawing.Point]::Empty, $bounds.Size)
$bitmap.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
```

#### 控制台截图（解决中文乱码）

```powershell
# 关键：chcp 65001 + UTF-8 编码
chcp 65001 | Out-Null
$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# Java 程序加 -Dfile.encoding=UTF-8
java -Dfile.encoding=UTF-8 -cp $cp 类名
```

#### Web 控制台截图（需登录）

```powershell
# 使用 URL 内嵌凭据方式（最可靠）
Start-Process $edge -ArgumentList "--new-window", "

截图注意事项

. **必须真实运行**：所有截图必须来自真实程序运行，禁止使用静态文本伪造
. **中文乱码预防**：PowerShell 脚本开头必须加 `chcp 65001` 和 UTF-8 编码设置
. **Web 控制台登录**：使用 URL 内嵌凭据（`
http://user:pass@host/path

`），比 SendKeys 更可靠
. **Topic 时序**：非持久订阅者必须先于发布者启动，否则消息丢失
. **窗口焦点**：截图前确保目标窗口是前台窗口
~~~

