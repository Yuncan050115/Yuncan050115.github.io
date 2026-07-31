/**
 * 友链申请表单：访客填写后一键创建 GitHub Issue
 * 使用独立的 PUBLIC_FRIEND_LINK_TOKEN（仅 issues:write 权限，安全暴露给前端）
 * 站长在管理面板（FPS 区域双击 → 密码验证 → 友链管理 Tab）中审批
 */

export const initFriendLinkApply = () => {
  const form = document.getElementById('friend-apply-form') as HTMLFormElement | null;
  if (!form || form.dataset.ready === 'true') return;
  form.dataset.ready = 'true';

  const section = document.getElementById('friend-apply-section');
  const repo = section?.dataset.repo || (window as any).__peConfig?.githubRepo || '';
  // 复用 PostEditor 注入的 token（已在前端暴露，无需单独配置）
  const token = (window as any).__peToken || '';
  const hint = document.getElementById('fa-hint');

  if (!token || !repo) return;

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

    // 构建 Issue body：人类可读表格 + 机器解析 YAML 代码块
    const body = [
      '## 友链申请',
      '',
      '| 字段 | 值 |',
      '| --- | --- |',
      `| 站点名称 | ${data.name} |`,
      `| 站点链接 | ${data.link} |`,
      `| 站点头像 | ${data.avatar} |`,
      `| 站点描述 | ${data.descr} |`,
      `| RSS | ${data.rss || '未提供'} |`,
      `| 站点截图 | ${data.siteshot || '未提供（审批时自动截取）'} |`,
      '',
      '```yaml',
      `name: ${data.name}`,
      `link: ${data.link}`,
      `avatar: ${data.avatar}`,
      `descr: ${data.descr}`,
      `rss: ${data.rss}`,
      `siteshot: ${data.siteshot}`,
      '```',
    ].join('\n');

    try {
      // 尝试带 label 创建，label 不存在时回退到无 label
      let resp = await fetch(`https://api.github.com/repos/${repo}/issues`, {
        method: 'POST',
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: `友链申请: ${data.name}`,
          body,
          labels: ['friend-link-apply'],
        }),
      });

      // label 不存在导致 422，去掉 label 重试
      if (resp.status === 422) {
        resp = await fetch(`https://api.github.com/repos/${repo}/issues`, {
          method: 'POST',
          headers: {
            Authorization: `token ${token}`,
            Accept: 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: `友链申请: ${data.name}`,
            body,
          }),
        });
      }

      if (resp.ok) {
        showHint('申请已提交！站长审核后将在友链页展示，请耐心等待。');
        form.reset();
      } else {
        const err = await resp.json().catch(() => ({}));
        showHint(`提交失败: ${err.message || resp.statusText || '未知错误'}`, true);
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
