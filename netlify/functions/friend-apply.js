// 友链申请：公开接口，服务端持 token 创建 GitHub Issue
// 浏览器不接触任何 GitHub 凭证，token 始终留在服务端
export const handler = async (event) => {
  const headers = { 'Content-Type': 'application/json' };

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const data = JSON.parse(event.body || '{}');
    const token = process.env.GITHUB_TOKEN || '';
    const repo = process.env.GITHUB_REPO || '';

    if (!token || !repo) {
      return { statusCode: 503, headers, body: JSON.stringify({ error: '友链申请功能未配置' }) };
    }

    const { name, link, avatar, descr, rss, siteshot } = data;
    if (!name || !link || !avatar || !descr) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: '请填写所有必填字段' }) };
    }

    // 构建 Issue body：人类可读表格 + 机器解析 YAML 代码块
    const body = [
      '## 友链申请',
      '',
      '| 字段 | 值 |',
      '| --- | --- |',
      `| 站点名称 | ${name} |`,
      `| 站点链接 | ${link} |`,
      `| 站点头像 | ${avatar} |`,
      `| 站点描述 | ${descr} |`,
      `| RSS | ${rss || '未提供'} |`,
      `| 站点截图 | ${siteshot || '未提供（审批时自动截取）'} |`,
      '',
      '```yaml',
      `name: ${name}`,
      `link: ${link}`,
      `avatar: ${avatar}`,
      `descr: ${descr}`,
      `rss: ${rss || ''}`,
      `siteshot: ${siteshot || ''}`,
      '```',
    ].join('\n');

    const ghHeaders = {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    };

    // 尝试带 label 创建，label 不存在时回退到无 label
    let resp = await fetch(`https://api.github.com/repos/${repo}/issues`, {
      method: 'POST',
      headers: ghHeaders,
      body: JSON.stringify({ title: `友链申请: ${name}`, body, labels: ['friend-link-apply'] }),
    });

    if (resp.status === 422) {
      resp = await fetch(`https://api.github.com/repos/${repo}/issues`, {
        method: 'POST',
        headers: ghHeaders,
        body: JSON.stringify({ title: `友链申请: ${name}`, body }),
      });
    }

    if (resp.ok) {
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    } else {
      const err = await resp.json().catch(() => ({}));
      return {
        statusCode: resp.status,
        headers,
        body: JSON.stringify({ error: err.message || resp.statusText || '提交失败' }),
      };
    }
  } catch {
    return { statusCode: 500, headers, body: JSON.stringify({ error: '服务器错误' }) };
  }
};
