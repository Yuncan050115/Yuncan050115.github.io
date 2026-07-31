/**
 * 站内文章管理页：密码验证、front-matter 编辑与预览
 * 兼容友链管理 Tab 切换
 */
import { initFriendLinkAdmin, loadFriendLinkApplications } from './friendLinkAdmin';

// ========== 文章管理页 ==========
export const showPostEditor = () => {
  const overlay = document.getElementById('post-editor-overlay');
  if (!overlay) return; // POST_PASSWORD 未配置时组件不渲染
  overlay.style.display = 'flex';
  document.body.style.overflow = 'hidden'; // 防止背景滚动
  // 重置到密码验证界面
  const auth = document.getElementById('pe-auth');
  const panel = document.getElementById('pe-panel');
  if (auth) auth.style.display = '';
  if (panel) panel.style.display = 'none';
  const pwdInput = document.getElementById('pe-password') as HTMLInputElement;
  if (pwdInput) pwdInput.value = '';
  const err = document.getElementById('pe-error');
  if (err) err.textContent = '';
};

export const initPostEditor = () => {
  const overlay = document.getElementById('post-editor-overlay');
  if (!overlay) return; // 未配置 POST_PASSWORD，组件不渲染
  if ((overlay as any).dataset.ready) return;
  (overlay as any).dataset.ready = 'true';

  const auth = document.getElementById('pe-auth');
  const panel = document.getElementById('pe-panel');
  const authBtn = document.getElementById('pe-auth-btn');
  const pwdInput = document.getElementById('pe-password') as HTMLInputElement;
  const errEl = document.getElementById('pe-error');
  const closeAuth = document.getElementById('pe-close-auth');
  const closePanel = document.getElementById('pe-close-panel');
  const newBtn = document.getElementById('pe-new');
  const listView = document.getElementById('pe-list-view');
  const editorView = document.getElementById('pe-editor-view');
  const backBtn = document.getElementById('pe-back');
  const saveBtn = document.getElementById('pe-save');
  const deleteBtn = document.getElementById('pe-delete');
  const copyBtn = document.getElementById('pe-copy');
  const searchInput = document.getElementById('pe-search') as HTMLInputElement;
  const listEl = document.getElementById('pe-list');
  const toastEl = document.getElementById('pe-toast');

  const config = (window as any).__peConfig || {};
  const hasToken = config.hasToken;
  const repo = config.githubRepo;
  const branch = config.githubBranch || 'master';

  // Toast 提示
  const showToast = (msg: string) => {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.style.display = 'block';
    setTimeout(() => { toastEl.style.display = 'none'; }, 3000);
  };

  // 关闭整个管理页
  const closeOverlay = () => {
    overlay.style.display = 'none';
    document.body.style.overflow = ''; // 恢复滚动
  };
  if (closeAuth) closeAuth.addEventListener('click', closeOverlay);
  if (closePanel) closePanel.addEventListener('click', closeOverlay);

  // 加载文章列表
  let allPosts: any[] = [];
  const loadPostList = async () => {
    if (!listEl) return;
    listEl.innerHTML = '<p class="pe-loading">加载中...</p>';
    try {
      // 通过 GitHub API 获取 content/posts/ 目录
      if (hasToken && repo) {
        const resp = await fetch(`https://api.github.com/repos/${repo}/contents/content/posts?ref=${branch}`, {
          headers: { 'Authorization': `token ${(window as any).__peToken}`, 'Accept': 'application/vnd.github.v3+json' }
        });
        if (resp.ok) {
          const files = await resp.json();
          allPosts = files.filter((f: any) => f.name.endsWith('.md')).map((f: any) => ({
            name: f.name,
            path: f.path,
            sha: f.sha,
            url: f.download_url
          }));
          renderList(allPosts);
        } else {
          listEl.innerHTML = '<p class="pe-empty">加载失败，请检查网络或 Token 配置</p>';
        }
      } else {
        // 降级模式：从网站已有的文章列表获取
        const resp = await fetch('/archives/index.html');
        const html = await resp.text();
        // 解析文章列表（从已渲染的归档页面提取）
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const items = doc.querySelectorAll('.archive-item');
        allPosts = Array.from(items).map(item => ({
          title: item.querySelector('strong')?.textContent || '',
          date: item.querySelector('time')?.textContent || '',
          href: item.getAttribute('href') || '',
        }));
        renderList(allPosts);
      }
    } catch (err) {
      listEl.innerHTML = '<p class="pe-empty">加载失败</p>';
    }
  };

  const renderList = (posts: any[]) => {
    if (!listEl) return;
    if (posts.length === 0) {
      listEl.innerHTML = '<p class="pe-empty">暂无文章</p>';
      return;
    }
    listEl.innerHTML = posts.map((p, i) => `
      <div class="pe-list-item" data-index="${i}">
        <span class="pe-list-item-title">${p.title || p.name || '未命名'}</span>
        ${p.date ? `<span class="pe-list-item-date">${p.date}</span>` : ''}
      </div>
    `).join('');
    // 点击编辑
    listEl.querySelectorAll('.pe-list-item').forEach(item => {
      item.addEventListener('click', () => {
        const idx = parseInt(item.getAttribute('data-index') || '0');
        editPost(allPosts[idx]);
      });
    });
  };

  // 密码验证（服务端校验，token 经认证后返回，不进入静态 HTML）
  if (authBtn) {
    authBtn.addEventListener('click', async () => {
      const pwd = pwdInput?.value || '';
      if (!pwd) {
        if (errEl) errEl.textContent = '请输入密码';
        return;
      }
      authBtn.disabled = true;
      authBtn.textContent = '验证中...';
      try {
        const resp = await fetch('/.netlify/functions/admin-auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: pwd }),
        });
        const data = await resp.json().catch(() => ({}));
        if (resp.ok && data.token) {
          (window as any).__peToken = data.token;
          if (auth) auth.style.display = 'none';
          if (panel) panel.style.display = 'flex';
          loadPostList();
        } else {
          if (errEl) errEl.textContent = data.error || '密码错误';
        }
      } catch {
        if (errEl) errEl.textContent = '网络错误，验证失败';
      } finally {
        authBtn.disabled = false;
        authBtn.textContent = '验证';
      }
    });
  }

  // 回车验证
  if (pwdInput) {
    pwdInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') authBtn?.click();
    });
  }

  // ========== Tab 切换（文章管理 / 友链管理） ==========
  const tabs = overlay.querySelectorAll('.pe-tab');
  const panes = overlay.querySelectorAll('.pe-tab-pane');
  const panelTitle = document.getElementById('pe-panel-title');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-pe-tab');
      tabs.forEach((t) => t.classList.remove('is-active'));
      panes.forEach((p) => p.classList.remove('is-active'));
      tab.classList.add('is-active');
      const targetPane = overlay.querySelector(`.pe-tab-pane[data-pe-pane="${target}"]`);
      if (targetPane) targetPane.classList.add('is-active');

      if (target === 'friends') {
        if (newBtn) newBtn.style.display = 'none';
        if (panelTitle) panelTitle.textContent = '友链管理';
        initFriendLinkAdmin();
        loadFriendLinkApplications();
      } else {
        if (newBtn) newBtn.style.display = '';
        if (panelTitle) panelTitle.textContent = '管理面板';
        // 回到文章列表视图
        const editorView = document.getElementById('pe-editor-view');
        const listView = document.getElementById('pe-list-view');
        if (editorView) editorView.style.display = 'none';
        if (listView) listView.style.display = '';
      }
    });
  });

  // 搜索
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.toLowerCase();
      const filtered = allPosts.filter(p =>
        (p.title || p.name || '').toLowerCase().includes(q)
      );
      renderList(filtered);
    });
  }

  // 编辑文章
  const editPost = async (post: any) => {
    if (!editorView || !listView) return;
    listView.style.display = 'none';
    editorView.style.display = '';
    if (deleteBtn) deleteBtn.style.display = '';

    const modeLabel = document.getElementById('pe-mode-label');
    if (modeLabel) modeLabel.textContent = '编辑文章';

    // 加载文章内容
    try {
      let content = '';
      if (post.url) {
        const resp = await fetch(post.url);
        content = await resp.text();
        (document.getElementById('pe-file-sha') as HTMLInputElement).value = post.sha || '';
      } else if (post.path && hasToken) {
        const resp = await fetch(`https://api.github.com/repos/${repo}/contents/${post.path}?ref=${branch}`, {
          headers: { 'Authorization': `token ${(window as any).__peToken}`, 'Accept': 'application/vnd.github.v3+json' }
        });
        const data = await resp.json();
        content = atob(data.content.replace(/\n/g, ''));
        (document.getElementById('pe-file-sha') as HTMLInputElement).value = data.sha;
      }

      // 解析 frontmatter
      const fmMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
      if (fmMatch) {
        const fm = fmMatch[1];
        const body = fmMatch[2];
        const getFmValue = (key: string) => {
          const m = fm.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
          return m ? m[1].replace(/^["']|["']$/g, '') : '';
        };
        const getFmArray = (key: string) => {
          const items: string[] = [];
          const regex = new RegExp(`^${key}:\\n((?:  - .+\\n?)*)`, 'm');
          const m = fm.match(regex);
          if (m) {
            const lines = m[1].match(/  - (.+)/g);
            if (lines) lines.forEach(l => items.push(l.replace('  - ', '')));
          }
          return items;
        };

        (document.getElementById('pe-title') as HTMLInputElement).value = getFmValue('title');
        (document.getElementById('pe-categories') as HTMLInputElement).value = getFmArray('categories').join(', ');
        (document.getElementById('pe-tags') as HTMLInputElement).value = getFmArray('tags').join(', ');
        (document.getElementById('pe-description') as HTMLInputElement).value = getFmValue('description');
        (document.getElementById('pe-body') as HTMLTextAreaElement).value = body;
        (document.getElementById('pe-original-date') as HTMLInputElement).value = getFmValue('date');
        (document.getElementById('pe-file-path') as HTMLInputElement).value = post.path || `content/posts/${post.name}`;

        const sticky = getFmValue('sticky');
        const cover = getFmValue('cover') || getFmValue('top_img');
        (document.getElementById('pe-sticky') as HTMLInputElement).value = sticky || '0';
        (document.getElementById('pe-cover') as HTMLInputElement).value = cover;
      }
    } catch (err) {
      showToast('加载文章失败');
    }
  };

  // 新建文章
  if (newBtn) {
    newBtn.addEventListener('click', () => {
      if (!editorView || !listView) return;
      listView.style.display = 'none';
      editorView.style.display = '';
      if (deleteBtn) deleteBtn.style.display = 'none';

      const modeLabel = document.getElementById('pe-mode-label');
      if (modeLabel) modeLabel.textContent = '新建文章';

      // 清空表单
      (document.getElementById('pe-title') as HTMLInputElement).value = '';
      (document.getElementById('pe-categories') as HTMLInputElement).value = '';
      (document.getElementById('pe-tags') as HTMLInputElement).value = '';
      (document.getElementById('pe-description') as HTMLInputElement).value = '';
      (document.getElementById('pe-body') as HTMLTextAreaElement).value = '';
      (document.getElementById('pe-file-path') as HTMLInputElement).value = '';
      (document.getElementById('pe-file-sha') as HTMLInputElement).value = '';
      (document.getElementById('pe-original-date') as HTMLInputElement).value = '';
    });
  }

  // 返回列表
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      if (!editorView || !listView) return;
      editorView.style.display = 'none';
      listView.style.display = '';
    });
  }

  // 生成 markdown
  const generateMarkdown = () => {
    const title = (document.getElementById('pe-title') as HTMLInputElement).value;
    const categories = (document.getElementById('pe-categories') as HTMLInputElement).value.split(/[,，]/).map(s => s.trim()).filter(Boolean);
    const tags = (document.getElementById('pe-tags') as HTMLInputElement).value.split(/[,，]/).map(s => s.trim()).filter(Boolean);
    const description = (document.getElementById('pe-description') as HTMLInputElement).value;
    const body = (document.getElementById('pe-body') as HTMLTextAreaElement).value;
    const originalDate = (document.getElementById('pe-original-date') as HTMLInputElement).value;
    const sticky = (document.getElementById('pe-sticky') as HTMLInputElement).value;
    const cover = (document.getElementById('pe-cover') as HTMLInputElement).value;

    const now = new Date();
    const fmtDate = (d: Date) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}:${String(d.getSeconds()).padStart(2,'0')}`;

    let fm = '---\n';
    fm += `title: ${title}\n`;
    if (tags.length) { fm += 'tags:\n'; tags.forEach(t => fm += `  - ${t}\n`); }
    if (categories.length) { fm += 'categories:\n'; categories.forEach(c => fm += `  - ${c}\n`); }
    if (description) fm += `description: "${description}"\n`;
    if (cover) fm += `cover: ${cover}\n`;
    if (sticky && sticky !== '0') fm += `sticky: ${sticky}\n`;
    if (originalDate) fm += `date: ${originalDate}\n`;
    fm += `updated: ${fmtDate(now)}\n`;
    if (!originalDate) fm += `date: ${fmtDate(now)}\n`;
    fm += `abbrlink: ${Date.now()}\n`;
    fm += '---\n\n';
    fm += body;
    return { content: fm, title };
  };

  // 保存到 GitHub
  if (saveBtn) {
    saveBtn.addEventListener('click', async () => {
      const { content, title } = generateMarkdown();
      const filePath = (document.getElementById('pe-file-path') as HTMLInputElement).value;
      const sha = (document.getElementById('pe-file-sha') as HTMLInputElement).value;

      // 生成文件名
      const now = new Date();
      const dateStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
      const fileName = filePath || `content/posts/${dateStr}-${title}.md`;

      if (hasToken && repo) {
        saveBtn.textContent = '保存中...';
        saveBtn.setAttribute('disabled', 'true');
        try {
          const resp = await fetch(`https://api.github.com/repos/${repo}/contents/${fileName}`, {
            method: 'PUT',
            headers: {
              'Authorization': `token ${(window as any).__peToken}`,
              'Accept': 'application/vnd.github.v3+json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              message: `${sha ? '更新' : '新建'}文章: ${title}`,
              content: btoa(unescape(encodeURIComponent(content))),
              sha: sha || undefined,
              branch: branch
            })
          });
          if (resp.ok) {
            showToast('保存成功！等待自动部署...');
            saveBtn.textContent = '保存到 GitHub';
            saveBtn.removeAttribute('disabled');
            // 刷新列表
            setTimeout(() => loadPostList(), 2000);
          } else {
            const err = await resp.json();
            showToast(`保存失败: ${err.message || '未知错误'}`);
            saveBtn.textContent = '保存到 GitHub';
            saveBtn.removeAttribute('disabled');
          }
        } catch (err) {
          showToast('网络错误，保存失败');
          saveBtn.textContent = '保存到 GitHub';
          saveBtn.removeAttribute('disabled');
        }
      } else {
        // 降级：复制 markdown
        navigator.clipboard.writeText(content).then(() => {
          showToast('Markdown 已复制到剪贴板');
        }).catch(() => {
          showToast('复制失败，请手动复制');
        });
      }
    });
  }

  // 删除文章
  if (deleteBtn) {
    deleteBtn.addEventListener('click', async () => {
      const filePath = (document.getElementById('pe-file-path') as HTMLInputElement).value;
      const sha = (document.getElementById('pe-file-sha') as HTMLInputElement).value;
      if (!filePath || !sha) { showToast('无法删除：缺少文件信息'); return; }
      if (!confirm('确定删除这篇文章吗？此操作不可撤销。')) return;

      if (hasToken && repo) {
        try {
          const resp = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `token ${(window as any).__peToken}`,
              'Accept': 'application/vnd.github.v3+json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              message: `删除文章: ${filePath}`,
              sha: sha,
              branch: branch
            })
          });
          if (resp.ok) {
            showToast('删除成功！等待自动部署...');
            setTimeout(() => {
              if (editorView) editorView.style.display = 'none';
              if (listView) listView.style.display = '';
              loadPostList();
            }, 2000);
          } else {
            showToast('删除失败');
          }
        } catch (err) {
          showToast('网络错误');
        }
      } else {
        showToast('未配置 GitHub Token，无法删除');
      }
    });
  }

  // 复制 markdown
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const { content } = generateMarkdown();
      navigator.clipboard.writeText(content).then(() => {
        showToast('Markdown 已复制到剪贴板');
      }).catch(() => {
        showToast('复制失败');
      });
    });
  }
};
