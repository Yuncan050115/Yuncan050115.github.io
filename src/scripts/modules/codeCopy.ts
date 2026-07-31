/**
 * 代码块一键复制
 */

export const initCodeCopy = () => {
  document.querySelectorAll<HTMLButtonElement>('[data-copy-code]').forEach((button) => {
    if (button.dataset.ready === 'true') return;
    button.dataset.ready = 'true';
    button.addEventListener('click', async () => {
      const code = button.closest('.code-frame')?.querySelector('code')?.textContent || '';
      await navigator.clipboard?.writeText(code).catch(() => undefined);
      const old = button.textContent;
      button.textContent = '已复制';
      window.setTimeout(() => {
        button.textContent = old || '复制';
      }, 1200);
    });
  });
};
