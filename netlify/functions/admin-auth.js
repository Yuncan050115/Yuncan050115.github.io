// 管理面板密码验证：验证通过后服务端返回 GitHub Token
// token 永不进入静态 HTML，仅在认证后经 HTTPS 返回到浏览器内存
export const handler = async (event) => {
  const headers = { 'Content-Type': 'application/json' };

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { password } = JSON.parse(event.body || '{}');
    const expected = process.env.POST_PASSWORD || '';

    if (!expected) {
      return { statusCode: 503, headers, body: JSON.stringify({ error: '管理功能未配置' }) };
    }
    if (!password || password !== expected) {
      return { statusCode: 401, headers, body: JSON.stringify({ error: '密码错误' }) };
    }

    const token = process.env.GITHUB_TOKEN || '';
    if (!token) {
      return { statusCode: 503, headers, body: JSON.stringify({ error: 'Token 未配置' }) };
    }

    return { statusCode: 200, headers, body: JSON.stringify({ token }) };
  } catch {
    return { statusCode: 500, headers, body: JSON.stringify({ error: '服务器错误' }) };
  }
};
