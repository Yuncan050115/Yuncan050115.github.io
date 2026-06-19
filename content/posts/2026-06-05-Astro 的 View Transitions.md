---
title: Astro 的 View Transitions
tags:
  - 博客
  - View Transitions
categories:
  - 建站手记
cover: https://api.yuncan.xyz/blog/260620_014927.webp
description: "切到夜间模式后翻页会闪一下白，折腾了好几天。"
abbrlink: dark-flash
date: 2026-06-05 22:14:27
---

夜间模式有个很烦的 bug：切到夜间之后，点导航跳页面，会闪一下白。

![image-20260620014927538](https://api.yuncan.xyz/blog/260620_014927.webp)

## 原因

Astro 的 View Transitions 是这么工作的：点链接跳转的时候，它不刷新整个页面，而是用浏览器的 View Transitions API，把旧页面和新页面做一个过渡动画。新页面的 HTML 是提前 fetch 过来的，替换掉旧页面的 DOM。

问题出在"替换 DOM"这一步。新页面的 `<html>` 元素是从服务器 fetch 来的，上面没有 `data-theme="dark"` 属性。旧页面被替换的瞬间，主题属性没了，CSS 回退到默认的浅色，闪一下白。然后 `boot` 函数里的 `applyTheme` 跑起来，把 `data-theme` 设回去，又变回夜间。

中间那个"回退到浅色"的瞬间，就是闪白。

## 尝试

第一个尝试是在 `boot` 里尽早调 `applyTheme`。但 `boot` 是在 `astro:page-load` 事件里触发的，那时候 DOM 已经替换完了，白已经闪过了。

第二个尝试是监听 `astro:before-preparation` 事件，在 fetch 新页面之前就把主题设好。但这个事件操作的是旧页面的 DOM，对新页面没用。

第三个尝试是监听 `astro:after-swap` 事件，DOM 替换完之后立刻设主题。但还是太晚，替换的瞬间已经闪了。

## 解决

最后找到的是 `astro:before-swap` 事件。

这个事件在 DOM 替换之前触发，`event.newDocument` 就是即将替换进来的新文档。在这个事件里可以修改新文档，设好主题属性，这样替换的时候新文档已经是夜间模式了，不会闪。

```typescript
document.addEventListener('astro:before-swap', (event) => {
  const saved = localStorage.getItem('yuncan-theme');
  const hour = new Date().getHours();
  const theme = saved === 'light' || saved === 'dark'
    ? saved
    : (hour >= 6 && hour < 19 ? 'light' : 'dark');
  event.newDocument.documentElement.dataset.theme = theme;
});
```

逻辑和 `applyTheme` 一样：先读 `localStorage`，没有的话按时间判断。但这里操作的是 `event.newDocument`，是新文档的 `<html>`，在替换之前就把主题设好。

改完之后，夜间模式切页面再也不闪了。丝滑。

## 小结

这个 bug 折腾了好几天，View Transitions 的文档没怎么提这个坑，`astro:before-swap` 这个事件也是翻 issue 列表才找到的。

有些问题就是这样，解决起来一行代码，但找到怎么解决得花三天，有ai大人都这样，没ai我都不敢想（苦笑）。
