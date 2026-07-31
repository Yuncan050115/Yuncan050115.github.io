/**
 * 首页 Hero 整屏吸附滚动（桌面滚轮 / 触摸手势）
 */

import { isMobile } from '../core/env';

let heroSnapCleanup: (() => void) | null = null;

export const initHeroSnap = () => {
  // Clean up previous page's hero listeners (hero element is page-scoped, not persisted)
  if (heroSnapCleanup) {
    heroSnapCleanup();
    heroSnapCleanup = null;
  }
  const hero = document.querySelector<HTMLElement>('.first-screen');
  if (!hero || hero.dataset.snapReady === 'true') return;
  hero.dataset.snapReady = 'true';
  let locked = false;
  let touchStart = 0;
  const jump = (top: number) => {
    locked = true;
    window.scrollTo({ top, behavior: 'smooth' });
    window.setTimeout(() => {
      locked = false;
    }, 720);
  };
  const onWheel = (event: WheelEvent) => {
    if (locked) return;
    const heroBottom = hero.offsetTop + hero.offsetHeight;
    if (event.deltaY > 20 && window.scrollY < hero.offsetHeight * 0.72) jump(heroBottom);
    if (event.deltaY < -20 && window.scrollY > 80 && window.scrollY < heroBottom + 180) jump(0);
  };
  const onTouchStart = (event: TouchEvent) => {
    touchStart = event.touches[0]?.clientY || 0;
  };
  const onTouchEnd = (event: TouchEvent) => {
    if (locked || !touchStart) return;
    const end = event.changedTouches[0]?.clientY || 0;
    const delta = touchStart - end;
    const heroBottom = hero.offsetTop + hero.offsetHeight;
    if (delta > 46 && window.scrollY < hero.offsetHeight * 0.72) jump(heroBottom);
    if (delta < -46 && window.scrollY > 80 && window.scrollY < heroBottom + 180) jump(0);
  };
  window.addEventListener('wheel', onWheel, { passive: true });
  // 移动端不绑定触摸事件，避免干扰原生滚动
  if (!isMobile()) {
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
  }
  heroSnapCleanup = () => {
    window.removeEventListener('wheel', onWheel);
    window.removeEventListener('touchstart', onTouchStart);
    window.removeEventListener('touchend', onTouchEnd);
  };
};
