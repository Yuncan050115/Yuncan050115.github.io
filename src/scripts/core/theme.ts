/**
 * 主题系统：系统偏好（prefers-color-scheme）优先，时段兜底，手动切换持久化。
 * 未手动选择时跟随系统主题实时切换。
 */

export const getAutoTheme = () => {
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
  if (window.matchMedia('(prefers-color-scheme: light)').matches) return 'light';
  // 无法判读系统偏好时按时段兜底（6-19 点为白天）
  const hour = new Date().getHours();
  return hour >= 6 && hour < 19 ? 'light' : 'dark';
};

export const applyTheme = (value?: string | null) => {
  const root = document.documentElement;
  const saved = value ?? localStorage.getItem('yuncan-theme');
  if (saved === 'light' || saved === 'dark') {
    root.dataset.theme = saved;
  } else {
    root.dataset.theme = getAutoTheme();
  }
};

export const initTheme = () => {
  applyTheme();
  const button = document.querySelector<HTMLElement>('[data-theme-toggle]');
  if (button && button.dataset.ready !== 'true') {
    button.dataset.ready = 'true';
    button.addEventListener('click', () => {
      const root = document.documentElement;
      const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      localStorage.setItem('yuncan-theme', next);
    });
  }
  // 未手动指定主题时，跟随系统主题变化
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (!localStorage.getItem('yuncan-theme')) applyTheme();
  });
};
