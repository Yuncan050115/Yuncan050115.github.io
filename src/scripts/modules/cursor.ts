/**
 * 自定义光标：墨点迟滞跟随 + 悬停放大（仅桌面端）
 */

export const initCursor = () => {
  const dot = document.querySelector<HTMLElement>('.cursor-dot');
  if (!dot || dot.dataset.ready === 'true') return;
  dot.dataset.ready = 'true';

  // 首屏背景光标联动：光标往左背景高光往右（反向视差），光标不动时恢复默认
  const heroVignette = document.querySelector<HTMLElement>('.hero-vignette');
  let heroTargetX = 52; // 目标百分比
  let heroTargetY = 68;
  let heroCurrentX = 52; // 当前百分比（用于平滑插值）
  let heroCurrentY = 68;
  let heroLastMoveTime = 0;
  let heroRafId = 0;
  const heroAnimate = () => {
    // 平滑插值：当前值向目标值靠近
    heroCurrentX += (heroTargetX - heroCurrentX) * 0.08;
    heroCurrentY += (heroTargetY - heroCurrentY) * 0.08;
    if (heroVignette) {
      heroVignette.style.setProperty('--cursor-px', `${heroCurrentX.toFixed(2)}%`);
      heroVignette.style.setProperty('--cursor-py', `${heroCurrentY.toFixed(2)}%`);
    }
    // 光标静止超过 1.2 秒，目标值缓慢回归默认
    if (Date.now() - heroLastMoveTime > 1200) {
      heroTargetX += (52 - heroTargetX) * 0.02;
      heroTargetY += (68 - heroTargetY) * 0.02;
    }
    heroRafId = requestAnimationFrame(heroAnimate);
  };

  // 使用 requestAnimationFrame 批量处理 transform 更新，避免同步布局
  let pendingX = 0, pendingY = 0, needsUpdate = false;
  window.addEventListener('pointermove', (event) => {
    pendingX = event.clientX;
    pendingY = event.clientY;
    if (!needsUpdate) {
      needsUpdate = true;
      requestAnimationFrame(() => {
        dot.style.transform = `translate3d(${pendingX}px, ${pendingY}px, 0)`;
        needsUpdate = false;
      });
    }
    // 只在 cursor-active 未设置时才设置，避免每帧都 toggle
    if (!document.body.classList.contains('cursor-active')) {
      document.body.classList.add('cursor-active');
    }
    // 夜间模式下与粒子交互
    const state = window.__yuncanParticles;
    if (state) {
      state.mouseX = (pendingX / window.innerWidth) * 2 - 1;
      state.mouseY = -(pendingY / window.innerHeight) * 2 + 1;
    }
    // 首屏背景光标联动：反向映射（光标往左→背景高光往右），幅度 ±18%
    if (heroVignette) {
      const nx = pendingX / window.innerWidth;  // 0~1
      const ny = pendingY / window.innerHeight; // 0~1
      heroTargetX = 52 + (0.5 - nx) * 36; // 反向：光标在左(nx小)→目标>52
      heroTargetY = 68 + (0.5 - ny) * 24; // 反向：光标在上(ny小)→目标>68
      heroLastMoveTime = Date.now();
      if (!heroRafId) heroRafId = requestAnimationFrame(heroAnimate);
    }
  }, { passive: true });
  window.addEventListener('mousedown', () => document.body.classList.add('cursor-down'), { passive: true });
  window.addEventListener('mouseup', () => document.body.classList.remove('cursor-down'), { passive: true });
  // 缓存上次检查的 target，避免重复 closest 调用
  let lastOver: HTMLElement | null = null;
  let lastLink = false;
  document.addEventListener('pointerover', (event) => {
    const target = event.target as HTMLElement;
    if (target === lastOver) return;
    lastOver = target;
    const isLink = Boolean(target.closest('a, button, input, textarea, select, [role="button"]'));
    if (isLink !== lastLink) {
      lastLink = isLink;
      document.body.classList.toggle('cursor-link', isLink);
    }
  }, { passive: true });
  // 页面隐藏时重置光标状态，避免切回窗口后首次点击卡住
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      document.body.classList.remove('cursor-active', 'cursor-down', 'cursor-link');
      lastOver = null;
      lastLink = false;
      needsUpdate = false;
    }
  });
};
