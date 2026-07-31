/**
 * 文章图片光标粒子交互（仅桌面端）
 */

export const initImageCursorEffect = () => {
  const images = document.querySelectorAll<HTMLImageElement>('article img, .post-body img');
  images.forEach((img) => {
    if (img.dataset.cursorReady === 'true') return;
    img.dataset.cursorReady = 'true';

    img.addEventListener('pointermove', (e) => {
      const rect = img.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;  // -0.5 to 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const maxTilt = 6; // 最大倾斜角度
      const maxShift = 8; // 最大位移 px
      img.style.transform = `scale(1.03) translate(${x * maxShift}px, ${y * maxShift}px) rotateX(${-y * maxTilt}deg) rotateY(${x * maxTilt}deg)`;
    });

    img.addEventListener('pointerenter', () => {
      img.classList.add('img-cursor-active');
    });

    img.addEventListener('pointerleave', () => {
      img.classList.remove('img-cursor-active');
      img.style.transform = '';
    });
  });
};
