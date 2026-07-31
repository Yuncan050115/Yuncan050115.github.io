/**
 * 设置面板：主题模式 / 背景 / 特效开关
 */

export const initSettings = () => {
  const panel = document.getElementById('settings-popup');
  const toggle = document.querySelector<HTMLElement>('[data-settings-toggle]');
  if (!panel || !toggle) return;

  // 每次重置弹窗状态
  panel.style.display = 'none';

  // 设置项映射
  // 字号：站点以 px 为主，改根 font-size 几乎无效（v1 死设置）。
  // 改用 zoom 缩放内容区（#main），导航/播放器等 chrome 不受影响。
  const fontSizeMap: Record<string, string> = {
    small: '0.92',
    medium: '1',
    large: '1.08',
    xlarge: '1.18'
  };
  const fontFamilyMap: Record<string, string> = {
    default: '',
    JinghuaLaosong: "'JinghuaLaosong', serif",
    LXGWWenKai: "'LXGWWenKai', serif",
    SourceHanSansOLD: "'SourceHanSansOLD', sans-serif",
    FZYanSong: "'FZYanSong', serif"
  };
  const envBgApi = import.meta.env.PUBLIC_BG_IMAGE_API || '';
  const bgImageMap: Record<string, string> = {
    default: '',
    none: 'none',
    bing: 'https://bing.ee123.net/img/rand',
    random: 'https://wp.upx8.com/api.php',
    custom: envBgApi
  };

  const getDefault = (key: string): string => {
    const defaults: Record<string, string> = {
      fontSize: 'medium', fontFamily: 'default', bgImage: 'default'
    };
    return defaults[key] || '';
  };

  // 应用设置到 DOM
  const applySettings = () => {
    const fontSize = localStorage.getItem('setting-fontSize') || 'medium';
    const fontFamily = localStorage.getItem('setting-fontFamily') || 'default';
    const bgImage = localStorage.getItem('setting-bgImage') || 'default';

    // 字体大小：zoom 缩放内容区（chrome 元素不受影响）
    const main = document.getElementById('main');
    if (main) {
      (main.style as CSSStyleDeclaration & { zoom?: string }).zoom = fontSizeMap[fontSize] || '1';
    }

    // 字体族
    if (fontFamily !== 'default') {
      document.body.style.fontFamily = fontFamilyMap[fontFamily] || '';
    } else {
      document.body.style.fontFamily = '';
    }

    // 背景图片
    const bgEl = document.querySelector('.global-bg') as HTMLElement;
    if (bgEl) {
      if (bgImage === 'none') {
        bgEl.style.backgroundImage = 'none';
      } else if (bgImage === 'bing' || bgImage === 'random') {
        bgEl.style.backgroundImage = `url("${bgImageMap[bgImage]}")`;
        bgEl.style.backgroundSize = 'cover';
        bgEl.style.backgroundPosition = 'center';
        bgEl.style.backgroundAttachment = 'fixed';
      } else {
        bgEl.style.backgroundImage = '';
        bgEl.style.backgroundSize = '';
        bgEl.style.backgroundPosition = '';
        bgEl.style.backgroundAttachment = '';
      }
    }

    // 更新按钮 active 状态
    document.querySelectorAll('[data-setting]').forEach((group) => {
      const setting = group.getAttribute('data-setting');
      if (!setting) return;
      const value = localStorage.getItem(`setting-${setting}`) || getDefault(setting);
      group.querySelectorAll('.setting-opt').forEach((btn) => {
        btn.classList.toggle('active', btn.getAttribute('data-value') === value);
      });
    });
  };

  // 每次都应用设置（从 localStorage 恢复）
  applySettings();

  // 防重复绑定（参照 initTheme 模式）
  if (toggle.dataset.ready === 'true') return;
  toggle.dataset.ready = 'true';

  // 以下是事件绑定（只执行一次）
  const close = document.querySelector('[data-settings-close]');
  const reset = document.querySelector('[data-settings-reset]');

  const togglePanel = () => {
    const isShown = panel.style.display !== 'none';
    panel.style.display = isShown ? 'none' : 'block';
  };

  toggle.addEventListener('click', (e) => { e.stopPropagation(); togglePanel(); });

  if (close) {
    close.addEventListener('click', () => { panel.style.display = 'none'; });
  }

  // document 点击外部关闭
  document.addEventListener('click', (e) => {
    if (panel.style.display !== 'none' && !panel.contains(e.target as Node) && !toggle.contains(e.target as Node)) {
      panel.style.display = 'none';
    }
  });

  // setting-opt 按钮
  document.querySelectorAll('.setting-opt').forEach((btn) => {
    btn.addEventListener('click', function(this: Element) {
      const group = this.closest('[data-setting]');
      if (!group) return;
      const setting = group.getAttribute('data-setting');
      if (!setting) return;
      const value = this.getAttribute('data-value');
      if (value) {
        localStorage.setItem(`setting-${setting}`, value);
        applySettings();
      }
    });
  });

  // 恢复默认
  if (reset) {
    reset.addEventListener('click', () => {
      ['fontSize', 'fontFamily', 'bgImage'].forEach(key => {
        localStorage.removeItem(`setting-${key}`);
      });
      applySettings();
    });
  }
};
