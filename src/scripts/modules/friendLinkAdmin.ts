/**
 * 友链管理面板：站长审批访客提交的友链申请
 *
 * 流程：
 * 1. 从 GitHub Issues 拉取带 friend-link-apply 标签的申请
 * 2. 展示申请卡片，站长可一键审批或拒绝
 * 3. 审批时：用户提供了 siteshot 则直接用，否则自动截图 → canvas 转 webp → 提交到仓库
 * 4. 将新友链追加到 link.yml 并提交，关闭 Issue
 *
 * 复用 PostEditor 注入的 window.__peToken / window.__peConfig
 */

const REPO = (window as any).__peConfig?.githubRepo || '';
const BRANCH = (window as any).__peConfig?.githubBranch || 'master';
const TOKEN = (window as any).__peToken || '';

// ===== 工具函数 =====

const showToast = (msg: string) => {
  const toast = document.getElementById('pe-toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.style.display = 'block';
  setTimeout(() => { toast.style.display = 'none'; }, 3500);
};

/** base64 解码为 UTF-8 字符串 */
const decodeBase64 = (b64: string) => decodeURIComponent(escape(atob(b64.replace(/\n/g, ''))));

/** UTF-8 字符串编码为 base64 */
const encodeBase64 = (str: string) => btoa(unescape(encodeURIComponent(str)));

/** 从站点 URL 生成 slug（用于截图文件名） */
const slugify = (s: string) =>
  s
    .replace(/^https?:\/\//, '')
    .replace(/[\/\?#:].*/g, '')
    .replace(/[^\w\u4e00-\u9fff-]/g, '')
    .slice(0, 40) || 'site';

/** 从 Issue body 中解析 YAML 代码块 */
const parseIssueBody = (body: string): Record<string, string> | null => {
  const m = body.match(/```yaml\n([\s\S]*?)```/);
  if (!m) return null;
  const data: Record<string, string> = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (kv) data[kv[1]] = kv[2].trim();
  }
  return data;
};

// ===== 截图捕获 + webp 转换 =====

/**
 * 自动截取站点截图并转为 webp
 * 1. 用 microlink.io 获取站点截图（免费 50/天，加 waitFor 等待 Cloudflare 验证）
 * 2. canvas 绘制后 toBlob('image/webp') 压缩为 webp，提交到仓库
 * 3. CORS 失败时回退为 microlink 直链（浏览器直接加载，部署后显示）
 *
 * 注：原 thum.io 已需付费账号（返回 "Image not authorized"），故弃用。
 *     mShots 因浏览器 CORS 拦截无法在 canvas 中使用，仅作直链回退参考。
 */
const buildMicrolinkUrl = (url: string, wait: number) =>
  `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url&waitFor=${wait}`;

/** 尝试从给定 URL 加载图片并 canvas 转 webp 提交到仓库 */
const tryConvertToWebp = async (imageUrl: string, slug: string): Promise<string> => {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.src = imageUrl;

  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error('screenshot load failed'));
    setTimeout(() => reject(new Error('timeout')), 35000);
  });

  // canvas 绘制并转 webp（居中裁剪适配 16:9）
  const canvas = document.createElement('canvas');
  canvas.width = 1280;
  canvas.height = 720;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('canvas context failed');
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  if (iw < 2 || ih < 2) throw new Error('image too small (likely placeholder)');
  const scale = Math.max(1280 / iw, 720 / ih);
  const dw = iw * scale;
  const dh = ih * scale;
  ctx.drawImage(img, (1280 - dw) / 2, (720 - dh) / 2, dw, dh);

  const webpBlob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/webp', 0.82));
  if (!webpBlob) throw new Error('webp conversion failed');

  // Blob → base64
  const reader = new FileReader();
  const base64 = await new Promise<string>((resolve) => {
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.readAsDataURL(webpBlob);
  });

  // 提交到仓库 public/siteshots/{slug}.webp
  const filePath = `public/siteshots/${slug}.webp`;
  const resp = await fetch(`https://api.github.com/repos/${REPO}/contents/${filePath}`, {
    method: 'PUT',
    headers: {
      Authorization: `token ${TOKEN}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: `chore: auto-capture siteshot for ${slug}`,
      content: base64,
      branch: BRANCH,
    }),
  });

  if (!resp.ok) throw new Error('commit screenshot failed');
  return `/siteshots/${slug}.webp`;
};

const captureScreenshot = async (siteUrl: string): Promise<{ path: string; isLocal: boolean }> => {
  const slug = slugify(siteUrl);

  // 依次尝试不同的 waitFor 时长（部分站点有 Cloudflare 验证，需要更长等待）
  const waitOptions = [3000, 6000, 10000];
  for (const wait of waitOptions) {
    const imageUrl = buildMicrolinkUrl(siteUrl, wait);
    try {
      const localPath = await tryConvertToWebp(imageUrl, slug);
      return { path: localPath, isLocal: true };
    } catch (err) {
      console.log(`[friendLinkAdmin] microlink waitFor=${wait} 失败，尝试更长等待:`, err);
    }
  }

  // canvas 转换全部失败：回退为 microlink 直链（部署后浏览器直接加载显示）
  const fallbackUrl = buildMicrolinkUrl(siteUrl, 3000);
  console.log('[friendLinkAdmin] 所有截图尝试失败，使用 microlink 直链回退');
  return { path: fallbackUrl, isLocal: false };
};

// ===== link.yml 更新 =====

const updateLinkYml = async (entry: Record<string, string>): Promise<boolean> => {
  // 1. 读取当前 link.yml
  const resp = await fetch(`https://api.github.com/repos/${REPO}/contents/content/data/link.yml?ref=${BRANCH}`, {
    headers: { Authorization: `token ${TOKEN}`, Accept: 'application/vnd.github.v3+json' },
  });
  if (!resp.ok) throw new Error('读取 link.yml 失败');
  const data = await resp.json();
  const content = decodeBase64(data.content);
  const sha = data.sha;

  // 2. 构建新条目 YAML（4 空格缩进，追加到文件末尾即最后一个分组的 link_list）
  const lines = [
    `    - name: ${entry.name}`,
    `      link: ${entry.link}`,
    `      avatar: ${entry.avatar}`,
    `      descr: ${entry.descr}`,
  ];
  if (entry.siteshot) {
    lines.push(`      siteshot: ${entry.siteshot}`);
  }
  const entryYaml = lines.join('\n');

  // 3. 追加到文件末尾
  const newContent = content.replace(/\s+$/, '\n') + entryYaml + '\n';

  // 4. 提交
  const updateResp = await fetch(`https://api.github.com/repos/${REPO}/contents/content/data/link.yml`, {
    method: 'PUT',
    headers: {
      Authorization: `token ${TOKEN}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: `feat(friend): approve friend link - ${entry.name}`,
      content: encodeBase64(newContent),
      sha,
      branch: BRANCH,
    }),
  });

  return updateResp.ok;
};

// ===== Issue 操作 =====

const closeIssue = async (issueNumber: number, comment: string) => {
  // 添加评论
  await fetch(`https://api.github.com/repos/${REPO}/issues/${issueNumber}/comments`, {
    method: 'POST',
    headers: {
      Authorization: `token ${TOKEN}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ body: comment }),
  }).catch(() => {});

  // 关闭 Issue
  await fetch(`https://api.github.com/repos/${REPO}/issues/${issueNumber}`, {
    method: 'PATCH',
    headers: {
      Authorization: `token ${TOKEN}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ state: 'closed' }),
  });
};

// ===== 渲染 =====

const renderApplicationCard = (issue: any, data: Record<string, string>): string => {
  const num = issue.number;
  const time = new Date(issue.created_at).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
  const hasSiteshot = !!data.siteshot;
  return `
    <div class="pe-friend-card" data-issue-num="${num}">
      <div class="pe-friend-card-preview">
        <img src="${data.siteshot || data.avatar || ''}" alt="" loading="lazy"
             onerror="this.style.display='none'" />
      </div>
      <div class="pe-friend-card-info">
        <div class="pe-friend-card-header">
          <strong>${data.name || '未知站点'}</strong>
          <span class="pe-friend-card-num">#${num}</span>
        </div>
        <a href="${data.link || '#'}" target="_blank" rel="noreferrer" class="pe-friend-card-link">${data.link || ''}</a>
        <p>${data.descr || ''}</p>
        <div class="pe-friend-card-meta">
          <span>头像: ${data.avatar ? '已提供' : '未提供'}</span>
          <span>截图: ${hasSiteshot ? '已提供' : '将自动截取'}</span>
          <span>${time}</span>
        </div>
      </div>
      <div class="pe-friend-card-actions">
        <button class="pe-btn pe-btn-primary pe-friend-approve" data-num="${num}">审批通过</button>
        <button class="pe-btn pe-btn-danger pe-friend-reject" data-num="${num}">拒绝</button>
      </div>
    </div>
  `;
};

// ===== 主逻辑 =====

export const loadFriendLinkApplications = async () => {
  const listEl = document.getElementById('pe-friend-list');
  const statusEl = document.getElementById('pe-friend-status');
  if (!listEl || !statusEl) return;

  if (!TOKEN || !REPO) {
    statusEl.textContent = '未配置 GitHub Token，无法加载';
    listEl.innerHTML = '';
    return;
  }

  statusEl.textContent = '加载中...';
  listEl.innerHTML = '<p class="pe-loading">加载中...</p>';

  try {
    // 先尝试带 label 查询，失败则搜标题
    let resp = await fetch(`https://api.github.com/repos/${REPO}/issues?labels=friend-link-apply&state=open&per_page=50`, {
      headers: { Authorization: `token ${TOKEN}`, Accept: 'application/vnd.github.v3+json' },
    });

    let issues: any[] = [];
    if (resp.ok) {
      issues = await resp.json();
    }

    // label 查询无结果时，用标题搜索兜底
    if (issues.length === 0) {
      resp = await fetch(`https://api.github.com/search/issues?q=repo:${REPO}+is:issue+is:open+友链申请+in:title&per_page=50`, {
        headers: { Authorization: `token ${TOKEN}`, Accept: 'application/vnd.github.v3+json' },
      });
      if (resp.ok) {
        const searchResult = await resp.json();
        issues = searchResult.items || [];
      }
    }

    const applications = issues
      .map((issue) => ({ issue, data: parseIssueBody(issue.body || '') }))
      .filter((item) => item.data !== null);

    if (applications.length === 0) {
      statusEl.textContent = '暂无待审核的友链申请';
      listEl.innerHTML = '<p class="pe-empty">暂无待审核申请</p>';
      return;
    }

    statusEl.textContent = `共 ${applications.length} 条待审核申请`;
    listEl.innerHTML = applications.map((item) => renderApplicationCard(item.issue, item.data!)).join('');

    // 绑定审批/拒绝按钮
    listEl.querySelectorAll('.pe-friend-approve').forEach((btn) => {
      btn.addEventListener('click', () => handleApprove(parseInt(btn.getAttribute('data-num') || '0')));
    });
    listEl.querySelectorAll('.pe-friend-reject').forEach((btn) => {
      btn.addEventListener('click', () => handleReject(parseInt(btn.getAttribute('data-num') || '0')));
    });
  } catch (err) {
    statusEl.textContent = '加载失败';
    listEl.innerHTML = '<p class="pe-empty">加载失败，请检查网络和 Token 配置</p>';
  }
};

const handleApprove = async (issueNum: number) => {
  const card = document.querySelector(`.pe-friend-card[data-issue-num="${issueNum}"]`);
  if (!card) return;

  const approveBtn = card.querySelector('.pe-friend-approve') as HTMLButtonElement;
  const rejectBtn = card.querySelector('.pe-friend-reject') as HTMLButtonElement;
  if (approveBtn) { approveBtn.disabled = true; approveBtn.textContent = '处理中...'; }
  if (rejectBtn) rejectBtn.disabled = true;

  try {
    // 1. 获取 Issue 数据
    const resp = await fetch(`https://api.github.com/repos/${REPO}/issues/${issueNum}`, {
      headers: { Authorization: `token ${TOKEN}`, Accept: 'application/vnd.github.v3+json' },
    });
    if (!resp.ok) throw new Error('获取申请详情失败');
    const issue = await resp.json();
    const data = parseIssueBody(issue.body || '');
    if (!data || !data.name || !data.link) throw new Error('申请数据不完整');

    // 2. 处理截图
    let siteshot = data.siteshot || '';
    if (!siteshot) {
      if (approveBtn) approveBtn.textContent = '截取截图中...';
      const result = await captureScreenshot(data.link);
      siteshot = result.path;
    }

    // 3. 更新 link.yml
    if (approveBtn) approveBtn.textContent = '更新友链...';
    const entry = { ...data, siteshot };
    const success = await updateLinkYml(entry);
    if (!success) throw new Error('更新 link.yml 失败');

    // 4. 关闭 Issue
    if (approveBtn) approveBtn.textContent = '关闭申请...';
    await closeIssue(issueNum, `友链已审批通过并添加到友链页！${siteshot ? '' : '（截图已自动截取并转为 webp）'}\n站点将在下次构建后展示。`);

    // 5. 移除卡片
    card.remove();
    showToast(`已通过「${data.name}」的友链申请，等待自动部署`);

    // 更新状态
    const remaining = document.querySelectorAll('.pe-friend-card').length;
    const statusEl = document.getElementById('pe-friend-status');
    if (statusEl) {
      statusEl.textContent = remaining > 0 ? `剩余 ${remaining} 条待审核` : '全部审核完毕';
    }
  } catch (err) {
    showToast(`审批失败: ${err instanceof Error ? err.message : '未知错误'}`);
    if (approveBtn) { approveBtn.disabled = false; approveBtn.textContent = '审批通过'; }
    if (rejectBtn) rejectBtn.disabled = false;
  }
};

const handleReject = async (issueNum: number) => {
  const card = document.querySelector(`.pe-friend-card[data-issue-num="${issueNum}"]`);
  if (!card) return;

  const reason = prompt('拒绝原因（可选，将作为评论）:') || '';
  const approveBtn = card.querySelector('.pe-friend-approve') as HTMLButtonElement;
  const rejectBtn = card.querySelector('.pe-friend-reject') as HTMLButtonElement;
  if (approveBtn) approveBtn.disabled = true;
  if (rejectBtn) { rejectBtn.disabled = true; rejectBtn.textContent = '处理中...'; }

  try {
    await closeIssue(issueNum, `友链申请未通过。${reason}`);
    card.remove();
    showToast('已拒绝该申请');

    const remaining = document.querySelectorAll('.pe-friend-card').length;
    const statusEl = document.getElementById('pe-friend-status');
    if (statusEl) {
      statusEl.textContent = remaining > 0 ? `剩余 ${remaining} 条待审核` : '全部审核完毕';
    }
  } catch {
    showToast('操作失败，请重试');
    if (approveBtn) approveBtn.disabled = false;
    if (rejectBtn) { rejectBtn.disabled = false; rejectBtn.textContent = '拒绝'; }
  }
};

// ===== 现有友链管理（查看 / 删除 / 排序） =====

interface LinkEntry {
  name: string;
  link: string;
  avatar: string;
  descr: string;
  siteshot?: string;
  lineStart: number;
  lineEnd: number;
}

interface LinkGroup {
  className: string;
  classDesc: string;
  entries: LinkEntry[];
}

interface ParsedLinkYml {
  groups: LinkGroup[];
  rawLines: string[];
  sha: string;
}

/** 行级解析 link.yml：保留原始格式，仅追踪每条友链的行范围 */
const parseLinkYml = (content: string, sha: string): ParsedLinkYml => {
  const rawLines = content.split('\n');
  const groups: LinkGroup[] = [];
  let i = 0;

  while (i < rawLines.length) {
    const line = rawLines[i];
    if (line.trim() === '') { i++; continue; }

    if (/^- class_name:/.test(line)) {
      const className = line.replace(/^- class_name:\s*/, '').trim();
      let classDesc = '';
      i++;
      while (i < rawLines.length) {
        const hl = rawLines[i];
        if (/^\s+class_desc:/.test(hl)) {
          classDesc = hl.replace(/^\s+class_desc:\s*/, '').trim();
          i++;
        } else if (/^\s+link_list:/.test(hl)) {
          i++;
          break;
        } else {
          break;
        }
      }

      const entries: LinkEntry[] = [];
      while (i < rawLines.length) {
        const el = rawLines[i];
        if (/^- class_name:/.test(el)) break;
        if (el.trim() === '') { i++; continue; }

        if (/^\s+- name:/.test(el)) {
          const entryStart = i;
          i++;
          while (i < rawLines.length) {
            const fl = rawLines[i];
            if (/^\s+- name:/.test(fl) || /^- class_name:/.test(fl)) break;
            if (fl.trim() === '') break;
            if (!/^\s{4,}\w+/.test(fl)) break;
            i++;
          }
          const entryEnd = i;
          entries.push(parseEntryLines(rawLines.slice(entryStart, entryEnd), entryStart, entryEnd));
        } else {
          i++;
        }
      }
      groups.push({ className, classDesc, entries });
    } else {
      i++;
    }
  }
  return { groups, rawLines, sha };
};

const parseEntryLines = (lines: string[], lineStart: number, lineEnd: number): LinkEntry => {
  const entry: LinkEntry = { name: '', link: '', avatar: '', descr: '', lineStart, lineEnd };
  for (const line of lines) {
    const nm = line.match(/^\s+- name:\s*(.*)$/);
    if (nm) { entry.name = nm[1].trim(); continue; }
    const fm = line.match(/^\s+(link|avatar|avater|descr|siteshot|screenshot|rss):\s*(.*)$/);
    if (fm) {
      const key = fm[1];
      const v = fm[2].trim();
      if (key === 'link') entry.link = v;
      else if (key === 'avatar' || key === 'avater') entry.avatar = v;
      else if (key === 'descr') entry.descr = v;
      else if (key === 'siteshot' || key === 'screenshot') entry.siteshot = v;
    }
  }
  return entry;
};

/** 提交完整 link.yml 内容 */
const commitLinkYml = async (newContent: string, sha: string, message: string): Promise<boolean> => {
  const resp = await fetch(`https://api.github.com/repos/${REPO}/contents/content/data/link.yml`, {
    method: 'PUT',
    headers: {
      Authorization: `token ${TOKEN}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      content: encodeBase64(newContent),
      sha,
      branch: BRANCH,
    }),
  });
  return resp.ok;
};

const renderExistingLinkCard = (entry: LinkEntry, groupIdx: number, entryIdx: number, total: number): string => {
  const shot = entry.siteshot || entry.avatar || '';
  return `
    <div class="pe-friend-card pe-friend-existing" data-group="${groupIdx}" data-entry="${entryIdx}">
      <div class="pe-friend-card-preview">
        ${shot ? `<img src="${shot}" alt="" loading="lazy" onerror="this.style.display='none'" />` : ''}
      </div>
      <div class="pe-friend-card-info">
        <div class="pe-friend-card-header">
          <strong>${entry.name}</strong>
          <span class="pe-friend-card-num">#${entryIdx + 1}</span>
        </div>
        <a href="${entry.link}" target="_blank" rel="noreferrer" class="pe-friend-card-link">${entry.link}</a>
        <p>${entry.descr}</p>
      </div>
      <div class="pe-friend-card-actions pe-friend-existing-actions">
        <button class="pe-btn pe-friend-move-up" data-group="${groupIdx}" data-entry="${entryIdx}"${entryIdx === 0 ? ' disabled' : ''}>↑</button>
        <button class="pe-btn pe-friend-move-down" data-group="${groupIdx}" data-entry="${entryIdx}"${entryIdx >= total - 1 ? ' disabled' : ''}>↓</button>
        <button class="pe-btn pe-friend-edit" data-group="${groupIdx}" data-entry="${entryIdx}">编辑</button>
        <button class="pe-btn pe-btn-danger pe-friend-delete" data-group="${groupIdx}" data-entry="${entryIdx}">删除</button>
      </div>
    </div>
  `;
};

/** 编辑表单 HTML（替换卡片正文） */
const renderEditForm = (entry: LinkEntry, groupIdx: number, entryIdx: number): string => `
  <div class="pe-friend-edit-form" data-group="${groupIdx}" data-entry="${entryIdx}">
    <div class="pe-friend-edit-row">
      <label>站点名称</label>
      <input type="text" class="pe-edit-name" value="${entry.name.replace(/"/g, '&quot;')}" />
    </div>
    <div class="pe-friend-edit-row">
      <label>站点链接</label>
      <input type="url" class="pe-edit-link" value="${entry.link.replace(/"/g, '&quot;')}" />
    </div>
    <div class="pe-friend-edit-row">
      <label>站点头像</label>
      <input type="url" class="pe-edit-avatar" value="${entry.avatar.replace(/"/g, '&quot;')}" />
    </div>
    <div class="pe-friend-edit-row">
      <label>站点描述</label>
      <input type="text" class="pe-edit-descr" value="${entry.descr.replace(/"/g, '&quot;')}" />
    </div>
    <div class="pe-friend-edit-row">
      <label>站点首图</label>
      <input type="url" class="pe-edit-siteshot" value="${(entry.siteshot || '').replace(/"/g, '&quot;')}" placeholder="留空将自动截取" />
    </div>
    <div class="pe-friend-edit-actions">
      <button class="pe-btn pe-btn-primary pe-edit-save" data-group="${groupIdx}" data-entry="${entryIdx}">保存</button>
      <button class="pe-btn pe-edit-cancel" data-group="${groupIdx}" data-entry="${entryIdx}">取消</button>
    </div>
  </div>
`;

let cachedParsed: ParsedLinkYml | null = null;

const loadExistingLinks = async () => {
  const listEl = document.getElementById('pe-friend-existing-list');
  const statusEl = document.getElementById('pe-friend-existing-status');
  if (!listEl || !statusEl) return;

  if (!TOKEN || !REPO) {
    statusEl.textContent = '未配置 GitHub Token';
    return;
  }

  statusEl.textContent = '加载中...';
  listEl.innerHTML = '<p class="pe-loading">加载中...</p>';

  try {
    const resp = await fetch(`https://api.github.com/repos/${REPO}/contents/content/data/link.yml?ref=${BRANCH}`, {
      headers: { Authorization: `token ${TOKEN}`, Accept: 'application/vnd.github.v3+json' },
    });
    if (!resp.ok) throw new Error('读取 link.yml 失败');
    const data = await resp.json();
    const content = decodeBase64(data.content);
    const sha = data.sha;

    cachedParsed = parseLinkYml(content, sha);

    const totalLinks = cachedParsed.groups.reduce((s, g) => s + g.entries.length, 0);
    statusEl.textContent = `共 ${cachedParsed.groups.length} 个分组 / ${totalLinks} 条友链`;

    if (totalLinks === 0) {
      listEl.innerHTML = '<p class="pe-empty">暂无友链</p>';
      return;
    }

    listEl.innerHTML = cachedParsed.groups.map((group, gi) => `
      <div class="pe-friend-group-block">
        <div class="pe-friend-group-title">${group.className}${group.classDesc ? ' · ' + group.classDesc : ''}</div>
        ${group.entries.map((entry, ei) => renderExistingLinkCard(entry, gi, ei, group.entries.length)).join('')}
      </div>
    `).join('');

    bindExistingLinkActions();
  } catch {
    statusEl.textContent = '加载失败';
    listEl.innerHTML = '<p class="pe-empty">加载失败，请检查网络和 Token 配置</p>';
  }
};

const bindExistingLinkActions = () => {
  document.querySelectorAll('.pe-friend-delete').forEach((btn) => {
    btn.addEventListener('click', () => {
      handleDeleteExisting(parseInt(btn.getAttribute('data-group') || '0'), parseInt(btn.getAttribute('data-entry') || '0'));
    });
  });
  document.querySelectorAll('.pe-friend-move-up').forEach((btn) => {
    btn.addEventListener('click', () => {
      handleMoveExisting(parseInt(btn.getAttribute('data-group') || '0'), parseInt(btn.getAttribute('data-entry') || '0'), 'up');
    });
  });
  document.querySelectorAll('.pe-friend-move-down').forEach((btn) => {
    btn.addEventListener('click', () => {
      handleMoveExisting(parseInt(btn.getAttribute('data-group') || '0'), parseInt(btn.getAttribute('data-entry') || '0'), 'down');
    });
  });
  document.querySelectorAll('.pe-friend-edit').forEach((btn) => {
    btn.addEventListener('click', () => {
      handleEditExisting(parseInt(btn.getAttribute('data-group') || '0'), parseInt(btn.getAttribute('data-entry') || '0'));
    });
  });
};

const handleEditExisting = (groupIdx: number, entryIdx: number) => {
  if (!cachedParsed) return;
  const entry = cachedParsed.groups[groupIdx]?.entries[entryIdx];
  if (!entry) return;
  const card = document.querySelector(`.pe-friend-existing[data-group="${groupIdx}"][data-entry="${entryIdx}"]`);
  if (!card) return;
  card.innerHTML = renderEditForm(entry, groupIdx, entryIdx);

  const form = card.querySelector('.pe-friend-edit-form');
  form?.querySelector('.pe-edit-save')?.addEventListener('click', () => handleSaveEdit(groupIdx, entryIdx, card as HTMLElement));
  form?.querySelector('.pe-edit-cancel')?.addEventListener('click', () => {
    // 恢复为展示卡片
    card.outerHTML = renderExistingLinkCard(entry, groupIdx, entryIdx, cachedParsed!.groups[groupIdx].entries.length);
    bindExistingLinkActions();
  });
};

const handleSaveEdit = async (groupIdx: number, entryIdx: number, card: HTMLElement) => {
  if (!cachedParsed) return;
  const entry = cachedParsed.groups[groupIdx]?.entries[entryIdx];
  if (!entry) return;

  const newName = (card.querySelector('.pe-edit-name') as HTMLInputElement)?.value.trim() || '';
  const newLink = (card.querySelector('.pe-edit-link') as HTMLInputElement)?.value.trim() || '';
  const newAvatar = (card.querySelector('.pe-edit-avatar') as HTMLInputElement)?.value.trim() || '';
  const newDescr = (card.querySelector('.pe-edit-descr') as HTMLInputElement)?.value.trim() || '';
  let newSiteshot = (card.querySelector('.pe-edit-siteshot') as HTMLInputElement)?.value.trim() || '';

  if (!newName || !newLink) {
    showToast('站点名称和链接不能为空');
    return;
  }

  // 若首图留空且链接有变，自动截取新首图
  if (!newSiteshot) {
    const saveBtn = card.querySelector('.pe-edit-save') as HTMLButtonElement;
    if (saveBtn) { saveBtn.disabled = true; saveBtn.textContent = '截取首图...'; }
    try {
      const result = await captureScreenshot(newLink);
      newSiteshot = result.path;
    } catch {
      newSiteshot = entry.siteshot || '';
    }
  }

  // 构建新的 YAML 行块（4 空格 - name，6 空格字段）
  const newEntryLines = [
    `    - name: ${newName}`,
    `      link: ${newLink}`,
    `      avatar: ${newAvatar}`,
    `      descr: ${newDescr}`,
  ];
  if (newSiteshot) newEntryLines.push(`      siteshot: ${newSiteshot}`);

  const newLines = [
    ...cachedParsed.rawLines.slice(0, entry.lineStart),
    ...newEntryLines,
    ...cachedParsed.rawLines.slice(entry.lineEnd),
  ];
  const newContent = newLines.join('\n');

  const saveBtn = card.querySelector('.pe-edit-save') as HTMLButtonElement;
  if (saveBtn) { saveBtn.disabled = true; saveBtn.textContent = '保存中...'; }

  try {
    const ok = await commitLinkYml(newContent, cachedParsed.sha, `chore(friend): edit ${newName}`);
    if (!ok) throw new Error('提交失败');
    showToast(`已更新「${newName}」`);
    await loadExistingLinks();
  } catch (err) {
    showToast(`保存失败: ${err instanceof Error ? err.message : '未知错误'}`);
    if (saveBtn) { saveBtn.disabled = false; saveBtn.textContent = '保存'; }
  }
};

const handleDeleteExisting = async (groupIdx: number, entryIdx: number) => {
  if (!cachedParsed) return;
  const group = cachedParsed.groups[groupIdx];
  const entry = group?.entries[entryIdx];
  if (!entry) return;

  if (!confirm(`确认删除友链「${entry.name}」？此操作不可撤销。`)) return;

  const newLines = [
    ...cachedParsed.rawLines.slice(0, entry.lineStart),
    ...cachedParsed.rawLines.slice(entry.lineEnd),
  ];
  const newContent = newLines.join('\n');

  try {
    showToast('正在删除...');
    const ok = await commitLinkYml(newContent, cachedParsed.sha, `chore(friend): delete ${entry.name}`);
    if (!ok) throw new Error('提交失败');
    showToast(`已删除「${entry.name}」`);
    await loadExistingLinks();
  } catch (err) {
    showToast(`删除失败: ${err instanceof Error ? err.message : '未知错误'}`);
  }
};

const handleMoveExisting = async (groupIdx: number, entryIdx: number, direction: 'up' | 'down') => {
  if (!cachedParsed) return;
  const group = cachedParsed.groups[groupIdx];
  const entry = group?.entries[entryIdx];
  if (!entry) return;

  const neighborIdx = direction === 'up' ? entryIdx - 1 : entryIdx + 1;
  const neighbor = group?.entries[neighborIdx];
  if (!neighbor) return;

  const first = direction === 'up' ? neighbor : entry;
  const second = direction === 'up' ? entry : neighbor;
  const newLines = [
    ...cachedParsed.rawLines.slice(0, first.lineStart),
    ...cachedParsed.rawLines.slice(second.lineStart, second.lineEnd),
    ...cachedParsed.rawLines.slice(first.lineStart, first.lineEnd),
    ...cachedParsed.rawLines.slice(second.lineEnd),
  ];
  const newContent = newLines.join('\n');

  try {
    showToast('正在调整排序...');
    const ok = await commitLinkYml(newContent, cachedParsed.sha, `chore(friend): reorder ${entry.name} ${direction}`);
    if (!ok) throw new Error('提交失败');
    showToast('排序已更新');
    await loadExistingLinks();
  } catch (err) {
    showToast(`排序失败: ${err instanceof Error ? err.message : '未知错误'}`);
  }
};

export const initFriendLinkAdmin = () => {
  const refreshBtn = document.getElementById('pe-friend-refresh');
  if (refreshBtn && !refreshBtn.dataset.ready) {
    refreshBtn.dataset.ready = 'true';
    refreshBtn.addEventListener('click', () => loadFriendLinkApplications());
  }
  const loadExistingBtn = document.getElementById('pe-friend-load-existing');
  if (loadExistingBtn && !loadExistingBtn.dataset.ready) {
    loadExistingBtn.dataset.ready = 'true';
    loadExistingBtn.addEventListener('click', () => loadExistingLinks());
  }
};
