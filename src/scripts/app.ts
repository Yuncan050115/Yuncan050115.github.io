/**
 * 云灿博客 · 前端交互编排入口
 *
 * 架构：core（基础设施）+ modules（功能模块）。
 * 重型功能按需在空闲时动态导入：Three.js 呼吸场景、音乐播放器，
 * 不挤占首屏主线程与主 bundle 体积。
 *
 * 生命周期：借助 Astro View Transitions 的 astro:page-load 事件，
 * 每次导航后重跑 boot；各模块内部以 dataset.ready / window 标志保证
 * persist 元素不重复绑定，页面级监听器先清后挂。
 */
import { isMobile } from './core/env';
import { applyTheme, initTheme } from './core/theme';
import { initNav } from './modules/nav';
import { initImageLightbox } from './modules/lightbox';
import { initBackTop } from './modules/backTop';
import { initProgress } from './modules/progress';
import { initHeroSnap } from './modules/heroSnap';
import { initFps } from './modules/fps';
import { initPostEditor } from './modules/postEditor';
import { initRuntimeDays } from './modules/runtimeDays';
import { initCursor } from './modules/cursor';
import { initCodeCopy } from './modules/codeCopy';
import { initContextMenu } from './modules/contextMenu';
import { initPostActions } from './modules/postActions';
import { initSettings } from './modules/settings';
import { initImageCursorEffect } from './modules/imageCursor';
import { initFriendLinkApply } from './modules/friendLinkApply';

let firstBoot = true;

const boot = () => {
  // 重新应用主题（View Transitions 导航后 <html> 被替换，需要恢复主题）
  applyTheme();

  // 立即应用当前主题到 header，避免闪白
  const header = document.querySelector('.site-header');
  if (header) {
    header.classList.add('theme-ready');
  }

  if (firstBoot) {
    // 控制台输出 ASCII 画 + 版本信息
    const asciiArt = [
      '   __    __  ___  ___  ___  ___  ___',
      '  / /_  / / / _ |/ _ |/ _ |/ _ |/ _ |',
      ' / __/ / /_/ __ / __ / __ / __ / __ /',
      '/_/   /___/_/ /_/ /_/ /_/ /_/ /_/ /_/',
      ''
    ].join('\n');
    console.log(
      `%c${asciiArt}`,
      'color: #32b9a8; font-family: monospace; font-weight: bold; line-height: 1.1;'
    );
    console.log(
      '%c yuncan-blog %c v1.0.9 %c Powered by Astro ',
      'background:#32b9a8;color:#fff;padding:3px 10px;border-radius:4px 0 0 4px;font-weight:bold;font-size:13px;',
      'background:#1a1a1a;color:#32b9a8;padding:3px 10px;font-weight:bold;font-size:13px;',
      'color:#888;padding:3px 0;font-size:12px;'
    );

    // 仅首次加载时运行的初始化（这些函数有单例守卫或绑定的 DOM 元素使用 transition:persist）
    initTheme();
    initSettings();
    // 自定义光标仅在桌面端启用（移动端无鼠标，光标会停在原点）
    if (!isMobile()) {
      initCursor();
    }
    // 右键菜单仅在桌面端启用（移动端长按会触发系统菜单，拦截影响体验）
    if (!isMobile()) {
      initContextMenu();
    }
    initPostEditor();
    // FPS 检测仅在桌面端运行（移动端不显示，也省 rAF 开销）
    if (!isMobile()) {
      initFps();
    }
    // Three.js 延迟加载，不阻塞首次渲染（移动端粒子数已降低，夜间流星雨也保留）
    // 模块本体也走动态 import，进一步瘦身主 bundle
    (window.requestIdleCallback || window.setTimeout)(() => {
      import('./modules/three').then((m) => m.initThree());
    });
    // 音乐延迟加载（移动端隐藏播放器，跳过初始化节省流量）
    if (!isMobile()) {
      (window.requestIdleCallback || window.setTimeout)(() => {
        import('./modules/music').then((m) => m.initMusic());
      });
    }
    firstBoot = false;
  }

  // 每次页面加载都需要重新绑定（页面内容在 View Transitions 后被替换）
  initNav();
  initBackTop();
  initProgress();
  initHeroSnap();
  initPostActions();
  initCodeCopy();
  initRuntimeDays();
  initImageLightbox();
  // 友链申请表单（仅在友链页生效，内部有 DOM 存在性守卫）
  initFriendLinkApply();
  // 图片光标交互仅在桌面端启用
  if (!isMobile()) {
    initImageCursorEffect();
  }

  // 歌词栏逻辑
  const lyricBar = document.getElementById('lyric-bar');
  if (lyricBar) {
    // 读取 sessionStorage 决定初始状态
    if (sessionStorage.getItem('lyric-bar-closed') === '1') {
      lyricBar.classList.remove('is-active');
    }
    // 点击关闭（先移除旧的事件监听器避免重复绑定）
    const closeHandler = () => {
      lyricBar.classList.remove('is-active');
      sessionStorage.setItem('lyric-bar-closed', '1');
    };
    lyricBar.removeEventListener('click', closeHandler);
    lyricBar.addEventListener('click', closeHandler);
  }

  window.__yuncanApp = true;
};

// View Transitions: 在 DOM 替换前恢复主题，避免夜间模式导航栏闪白
document.addEventListener('astro:before-swap', (event) => {
  const saved = localStorage.getItem('yuncan-theme');
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  const hour = new Date().getHours();
  const fallback = mq.matches ? 'dark' : (hour >= 6 && hour < 19 ? 'light' : 'dark');
  const theme = saved === 'light' || saved === 'dark' ? saved : fallback;
  event.newDocument.documentElement.dataset.theme = theme;
});

document.addEventListener('astro:page-load', boot);
