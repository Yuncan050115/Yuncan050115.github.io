/**
 * 文章图片灯箱：缩放 / 拖动 / 滚轮 / 快捷键
 */

// 图片放大灯箱
export const initImageLightbox = () => {
  const lightbox = document.querySelector<HTMLElement>('[data-image-lightbox]');
  const lightboxImg = document.querySelector<HTMLImageElement>('[data-image-lightbox-img]');
  const closeBtn = document.querySelector<HTMLElement>('[data-image-lightbox-close]');
  if (!lightbox || !lightboxImg) return;

  // 缩放状态
  let scale = 1;
  let translateX = 0;
  let translateY = 0;
  let isDragging = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let pinchStartDist = 0;
  let pinchStartScale = 1;

  const applyTransform = () => {
    lightboxImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
  };

  const resetTransform = () => {
    scale = 1;
    translateX = 0;
    translateY = 0;
    lightboxImg.style.transform = '';
  };

  const close = () => {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    resetTransform();
  };

  const open = (src: string, alt: string) => {
    lightboxImg.src = src;
    lightboxImg.alt = alt;
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    resetTransform();
  };

  // 点击文章内的图片打开灯箱
  document.querySelectorAll<HTMLImageElement>('article img, .post-body img, .prose img').forEach((img) => {
    if (img.dataset.lightboxReady === 'true') return;
    img.dataset.lightboxReady = 'true';
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => {
      open(img.src, img.alt || '');
    });
  });

  // 关闭按钮
  if (closeBtn && closeBtn.dataset.ready !== 'true') {
    closeBtn.dataset.ready = 'true';
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      close();
    });
  }

  // 灯箱事件只绑定一次
  if (lightbox.dataset.ready === 'true') return;
  lightbox.dataset.ready = 'true';

  // 点击背景关闭（仅当未缩放或点击的是背景而非图片时）
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });

  // ESC 关闭
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
  });

  // 滚轮缩放（桌面）
  lightbox.addEventListener('wheel', (e) => {
    if (!lightbox.classList.contains('is-open')) return;
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.15 : 0.15;
    scale = Math.max(0.5, Math.min(5, scale + delta));
    applyTransform();
  }, { passive: false });

  // 双击缩放
  lightboxImg.addEventListener('dblclick', (e) => {
    e.stopPropagation();
    if (scale > 1) {
      resetTransform();
    } else {
      scale = 2.5;
      applyTransform();
    }
  });

  // 鼠标拖动（桌面）
  lightboxImg.addEventListener('mousedown', (e) => {
    if (scale <= 1) return;
    e.preventDefault();
    isDragging = true;
    dragStartX = e.clientX - translateX;
    dragStartY = e.clientY - translateY;
    lightboxImg.classList.add('is-dragging');
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging || !lightbox.classList.contains('is-open')) return;
    translateX = e.clientX - dragStartX;
    translateY = e.clientY - dragStartY;
    applyTransform();
  });

  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      lightboxImg.classList.remove('is-dragging');
    }
  });

  // 触摸事件（移动端）
  let touchStartX = 0;
  let touchStartY = 0;
  let lastTapTime = 0;

  lightboxImg.addEventListener('touchstart', (e) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.touches.length === 1) {
      // 单指：拖动或双击检测
      const now = Date.now();
      if (now - lastTapTime < 300) {
        // 双击
        if (scale > 1) {
          resetTransform();
        } else {
          scale = 2.5;
          applyTransform();
        }
        lastTapTime = 0;
      } else {
        lastTapTime = now;
      }
      if (scale > 1) {
        isDragging = true;
        touchStartX = e.touches[0].clientX - translateX;
        touchStartY = e.touches[0].clientY - translateY;
      }
    } else if (e.touches.length === 2) {
      // 双指：缩放
      isDragging = false;
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      pinchStartDist = Math.sqrt(dx * dx + dy * dy);
      pinchStartScale = scale;
    }
  }, { passive: true });

  lightboxImg.addEventListener('touchmove', (e) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.touches.length === 1 && isDragging && scale > 1) {
      e.preventDefault();
      translateX = e.touches[0].clientX - touchStartX;
      translateY = e.touches[0].clientY - touchStartY;
      applyTransform();
    } else if (e.touches.length === 2) {
      e.preventDefault();
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (pinchStartDist > 0) {
        scale = Math.max(0.5, Math.min(5, pinchStartScale * (dist / pinchStartDist)));
        applyTransform();
      }
    }
  }, { passive: false });

  lightboxImg.addEventListener('touchend', () => {
    isDragging = false;
  });
};
