/**
 * 阅读进度条与目录高亮联动
 */

let progressScrollHandler: (() => void) | null = null;

export const initProgress = () => {
  const reader = document.querySelector<HTMLElement>('[data-reader-progress]');
  const tocLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('.toc-panel a[href^="#"]'));
  const headings = tocLinks
    .map((link) => document.getElementById(decodeURIComponent(link.hash.slice(1))))
    .filter(Boolean) as HTMLElement[];
  // Remove previous scroll handler before binding a new one (prevents accumulation across navigations)
  if (progressScrollHandler) {
    window.removeEventListener('scroll', progressScrollHandler);
    progressScrollHandler = null;
  }
  const update = () => {
    // 优先基于文章正文区域计算进度
    const article = document.querySelector('article.post-body, article, .post-body, main#main');
    let progress: number;
    if (article) {
      const rect = article.getBoundingClientRect();
      const articleBottom = rect.bottom;
      // 文章底边进入视口时为 100%
      if (articleBottom <= window.innerHeight) {
        progress = 1;
      } else {
        const articleTop = rect.top + window.scrollY;
        const scrollable = articleTop + rect.height - window.innerHeight;
        progress = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
      }
    } else {
      // 回退到原逻辑
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress = max > 0 ? Math.min(1, window.scrollY / max) : 0;
    }
    if (reader) reader.style.width = `${Math.round(progress * 100)}%`;
    let activeId = '';
    for (const heading of headings) {
      if (heading.getBoundingClientRect().top <= 140) activeId = heading.id;
    }
    tocLinks.forEach((link) => link.classList.toggle('is-active', Boolean(activeId && link.hash === `#${activeId}`)));
  };
  update();
  window.addEventListener('scroll', update, { passive: true });
  progressScrollHandler = update;
};
