/**
 * 文章页操作：分享 / 赞赏弹窗
 */

export const initPostActions = () => {
  document.querySelectorAll<HTMLButtonElement>('[data-share-current]').forEach((button) => {
    if (button.dataset.ready === 'true') return;
    button.dataset.ready = 'true';
    button.addEventListener('click', async () => {
      await navigator.clipboard?.writeText(location.href).catch(() => undefined);
      button.classList.add('is-copied');
      const old = button.innerHTML;
      button.textContent = '已复制';
      window.setTimeout(() => {
        button.classList.remove('is-copied');
        button.innerHTML = old;
      }, 1300);
    });
  });

  const dialog = document.querySelector<HTMLElement>('[data-reward-dialog]');
  const openButtons = document.querySelectorAll<HTMLButtonElement>('[data-reward-toggle]');
  const closeButtons = document.querySelectorAll<HTMLButtonElement>('[data-reward-close]');
  if (!dialog) return;
  const open = () => {
    dialog.classList.add('is-open');
    dialog.setAttribute('aria-hidden', 'false');
    document.body.classList.add('reward-lock');
  };
  const close = () => {
    dialog.classList.remove('is-open');
    dialog.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('reward-lock');
  };
  openButtons.forEach((button) => {
    if (button.dataset.ready === 'true') return;
    button.dataset.ready = 'true';
    button.addEventListener('click', open);
  });
  closeButtons.forEach((button) => {
    if (button.dataset.ready === 'true') return;
    button.dataset.ready = 'true';
    button.addEventListener('click', close);
  });
};
