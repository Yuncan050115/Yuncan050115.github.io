/**
 * 页脚「运行 N 天」实时计算
 * 首屏进入视口时做数字滚动动画（取自个人主页的 micro-interaction），
 * 尊重 prefers-reduced-motion，动画仅一次。
 */

export const initRuntimeDays = () => {
  const el = document.querySelector<HTMLElement>('#runtime-days');
  if (!el) return;
  const start = new Date(el.dataset.siteStart || '2022-06-08T00:00:00+08:00').getTime();
  const days = Math.max(1, Math.floor((Date.now() - start) / 86400000) + 1);

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || el.dataset.counted === 'true') {
    el.textContent = `运行 ${days} 天`;
    return;
  }

  const render = (value: number) => {
    el.textContent = `运行 ${value} 天`;
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(el);
        el.dataset.counted = 'true';
        const duration = 1200;
        const t0 = performance.now();
        const step = (t: number) => {
          const p = Math.min((t - t0) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 4);
          render(Math.max(1, Math.round(days * eased)));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    },
    { threshold: 0.4 }
  );
  observer.observe(el);
};
