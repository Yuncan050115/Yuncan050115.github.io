/**
 * 自定义右键菜单（仅桌面端，事件委托一次绑定）
 */

export const initContextMenu = () => {
  // 使用 window 标志确保 document/window 级监听只绑定一次，页面切换后依然生效。
  // 菜单点击通过事件委托在 document 上处理，避免菜单元素被替换后监听器丢失。
  if (window.__yuncanContextMenu) return;
  window.__yuncanContextMenu = true;

  const getMenu = () => document.querySelector<HTMLElement>('#context-menu');
  const hide = () => {
    const menu = getMenu();
    if (!menu) return;
    menu.classList.remove('show');
    menu.setAttribute('aria-hidden', 'true');
  };

  document.addEventListener('contextmenu', (event) => {
    event.preventDefault();
    const menu = getMenu();
    if (!menu) return;
    const width = menu.offsetWidth || 240;
    const height = menu.offsetHeight || 180;
    const x = Math.min(event.clientX, window.innerWidth - width - 12);
    const y = Math.min(event.clientY, window.innerHeight - height - 12);
    menu.style.left = `${Math.max(12, x)}px`;
    menu.style.top = `${Math.max(12, y)}px`;
    menu.classList.add('show');
    menu.setAttribute('aria-hidden', 'false');
  });

  document.addEventListener('click', async (event) => {
    const menu = getMenu();
    if (!menu) return;
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>('button[data-context-action]');
    // 点击菜单项：执行操作并隐藏
    if (button && menu.contains(button)) {
      const action = button.dataset.contextAction;
      if (action === 'back') history.back();
      else if (action === 'forward') history.forward();
      else if (action === 'reload') location.reload();
      else if (action === 'top') window.scrollTo({ top: 0, behavior: 'smooth' });
      else if (action === 'comment') document.querySelector('#post-comment, #twikoo-wrap')?.scrollIntoView({ behavior: 'smooth' });
      else if (action === 'theme') {
        const root = document.documentElement;
        const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
        root.dataset.theme = next;
        localStorage.setItem('yuncan-theme', next);
      }
      else if (action === 'print') window.print();
      else if (action === 'copy-url') await navigator.clipboard?.writeText(location.href).catch(() => undefined);
      hide();
      return;
    }
    // 点击菜单外部：隐藏
    hide();
  }, { passive: true });

  window.addEventListener('scroll', hide, { passive: true });
};
