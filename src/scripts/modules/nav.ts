/**
 * 顶部导航：滚动态、移动端抽屉、页面级监听器生命周期
 */

// Track page-scoped listeners so they can be removed on re-boot (View Transitions re-runs boot on every navigation)
let navScrollHandler: (() => void) | null = null;
// nav 事件是否已绑定到 document（toggle 是 persist 元素，只绑定一次）
let navGlobalReady = false;

export const initNav = () => {
  const header = document.querySelector<HTMLElement>('.site-header');
  if (!header) return;

  // 全局事件只绑定一次（toggle 是 persist 元素，不会随页面切换重建）
  if (!navGlobalReady) {
    navGlobalReady = true;
    // 汉堡按钮：用事件委托，每次点击时实时查询 mobileNav
    document.addEventListener('click', (event) => {
      const toggle = (event.target as HTMLElement).closest<HTMLElement>('[data-nav-toggle]');
      if (!toggle) return;
      event.stopPropagation();
      const mobileNav = document.querySelector<HTMLElement>('.site-nav--mobile');
      const scrim = document.querySelector<HTMLElement>('[data-nav-scrim]');
      if (!mobileNav) return;
      const willOpen = !mobileNav.classList.contains('is-open');
      mobileNav.classList.toggle('is-open', willOpen);
      scrim?.classList.toggle('is-open', willOpen);
    });

    // 遮罩点击关闭（事件委托）
    document.addEventListener('click', (event) => {
      const scrim = (event.target as HTMLElement).closest<HTMLElement>('[data-nav-scrim]');
      if (!scrim || !scrim.classList.contains('is-open')) return;
      const mobileNav = document.querySelector<HTMLElement>('.site-nav--mobile');
      mobileNav?.classList.remove('is-open');
      scrim.classList.remove('is-open');
    });

    // 移动端导航链接点击关闭（事件委托）
    document.addEventListener('click', (event) => {
      const link = (event.target as HTMLElement).closest<HTMLElement>('.site-nav--mobile a');
      if (!link) return;
      const mobileNav = document.querySelector<HTMLElement>('.site-nav--mobile');
      const scrim = document.querySelector<HTMLElement>('[data-nav-scrim]');
      mobileNav?.classList.remove('is-open');
      scrim?.classList.remove('is-open');
    });

    // ESC 键关闭
    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      const mobileNav = document.querySelector<HTMLElement>('.site-nav--mobile');
      if (!mobileNav?.classList.contains('is-open')) return;
      const scrim = document.querySelector<HTMLElement>('[data-nav-scrim]');
      mobileNav.classList.remove('is-open');
      scrim?.classList.remove('is-open');
    });
  }

  // 桌面端 header 滚动收缩
  if (navScrollHandler) {
    window.removeEventListener('scroll', navScrollHandler);
  }
  const update = () => {
    header.classList.toggle('is-docked', window.scrollY > 160);
  };
  update();
  window.addEventListener('scroll', update, { passive: true });
  navScrollHandler = update;
};

// 图片放大灯箱
