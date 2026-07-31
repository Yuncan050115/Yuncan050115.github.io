/**
 * 回到顶部按钮
 */

export const initBackTop = () => {
  document.querySelectorAll<HTMLElement>('[data-back-top]').forEach((button) => {
    if (button.dataset.ready === 'true') return;
    button.dataset.ready = 'true';
    button.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  });
};
