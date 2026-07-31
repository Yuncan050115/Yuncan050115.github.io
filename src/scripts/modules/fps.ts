/**
 * 轻量 FPS 采样；#fps 元素兼作管理页隐藏入口（双击）
 */

import { showPostEditor } from './postEditor';

// 轻量级 FPS 检测：每 5 秒采样一次，采样窗口内用 rAF 计数帧数，1 秒后计算 FPS。
// 白天和夜间都运行（不持续运行 rAF 循环，仅在采样窗口内计数）。
// #fps 元素同时作为隐藏入口：连续点击 2 次打开文章管理页。
export const initFps = () => {
  const fpsEl = document.querySelector<HTMLElement>('#fps');
  if (!fpsEl || fpsEl.dataset.ready === 'true') return;
  fpsEl.dataset.ready = 'true';

  let frameCount = 0;
  let lastTime = performance.now();
  let rafId: number | null = null;

  const sampleFps = () => {
    frameCount = 0;
    lastTime = performance.now();
    const countFrame = () => {
      frameCount++;
      rafId = requestAnimationFrame(countFrame);
    };
    countFrame();
    window.setTimeout(() => {
      if (rafId) cancelAnimationFrame(rafId);
      const elapsed = (performance.now() - lastTime) / 1000;
      const fps = elapsed > 0 ? Math.round(frameCount / elapsed) : 0;
      fpsEl.textContent = `FPS ${fps}`;
    }, 1000);
  };

  sampleFps();
  window.setInterval(sampleFps, 5000);

  // 保留双击打开文章管理页的隐藏入口
  let clickCount = 0;
  let clickTimer: number | undefined;
  fpsEl.addEventListener('click', () => {
    clickCount++;
    if (clickTimer) clearTimeout(clickTimer);
    clickTimer = window.setTimeout(() => { clickCount = 0; }, 2000);
    if (clickCount >= 2) {
      clickCount = 0;
      showPostEditor();
    }
  });
};
