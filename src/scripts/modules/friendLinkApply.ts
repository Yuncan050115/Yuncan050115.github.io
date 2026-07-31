/**
 * 友链申请表单：访客填写后由 Netlify Function 服务端创建 GitHub Issue
 * 浏览器不接触任何 GitHub 凭证，token 始终留在服务端
 * 站长在管理面板（FPS 区域连续点击 → 密码验证 → 友链管理 Tab）中审批
 */

export const initFriendLinkApply = () => {
  const form = document.getElementById('friend-apply-form') as HTMLFormElement | null;
  if (!form || form.dataset.ready === 'true') return;
  form.dataset.ready = 'true';

  const hint = document.getElementById('fa-hint');

  const showHint = (msg: string, isError = false) => {
    if (!hint) return;
    hint.textContent = msg;
    hint.style.color = isError ? '#e53e3e' : 'var(--accent, #32b9a8)';
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = {
      name: String(formData.get('name') || '').trim(),
      link: String(formData.get('link') || '').trim(),
      avatar: String(formData.get('avatar') || '').trim(),
      descr: String(formData.get('descr') || '').trim(),
      rss: String(formData.get('rss') || '').trim(),
      siteshot: String(formData.get('siteshot') || '').trim(),
    };

    if (!data.name || !data.link || !data.avatar || !data.descr) {
      showHint('请填写所有必填字段', true);
      return;
    }

    const btn = form.querySelector('.fa-submit-btn') as HTMLButtonElement | null;
    if (btn) {
      btn.disabled = true;
      btn.classList.add('is-loading');
    }

    try {
      // 服务端持 token 创建 Issue，浏览器不接触凭证
      const resp = await fetch('/.netlify/functions/friend-apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (resp.ok) {
        showHint('申请已提交！站长审核后将在友链页展示，请耐心等待。');
        form.reset();
      } else {
        const err = await resp.json().catch(() => ({}));
        showHint(`提交失败: ${err.error || resp.statusText || '未知错误'}`, true);
      }
    } catch {
      showHint('网络错误，提交失败，请稍后重试', true);
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.classList.remove('is-loading');
      }
    }
  });
};
