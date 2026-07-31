// scripts/fetch-external-data.mjs
// 构建前预取外部数据（Steam 游戏库、朋友圈动态），写入静态 JSON 文件。
// 客户端不再 fetch 外部 API，直接 import 本地 JSON，解决"时好时坏"问题。
// 获取失败时保留旧文件不变，确保站点始终有数据可展示。
import { writeFileSync, existsSync, readFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import YAML from 'yaml';

const root = process.cwd();
const DATA_DIR = join(root, 'content', 'data');
const STEAM_FILE = join(DATA_DIR, 'steam-games.json');
const CIRCLE_FILE = join(DATA_DIR, 'circle-feed.json');
const BANGUMI_FILE = join(DATA_DIR, 'bangumi-data.json');
const PROJECTS_FILE = join(DATA_DIR, 'projects.json');

// 读取 .env 文件（本地开发用），CI 环境变量已直接注入 process.env
function loadEnv() {
  const envFile = join(root, '.env');
  const env = {};
  if (existsSync(envFile)) {
    const content = readFileSync(envFile, 'utf8');
    const re = /^([A-Z_][A-Z0-9_]*)="([^"]*)"$/gm;
    let m;
    while ((m = re.exec(content)) !== null) {
      env[m[1]] = m[2];
    }
  }
  return env;
}

const fileEnv = loadEnv();
const getEnv = (key) => process.env[key] || fileEnv[key] || '';

async function fetchWithTimeout(url, ms = 10000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), ms);
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    clearTimeout(timeout);
    throw err;
  }
}

// 与 src/lib/content.ts 中 minutesToHours 保持一致
function minutesToHours(minutes = 0) {
  if (!minutes) return '0 小时';
  const hours = minutes / 60;
  return hours >= 10 ? `${Math.round(hours)} 小时` : `${hours.toFixed(1)} 小时`;
}

async function fetchSteamGames() {
  const apiKey = getEnv('PUBLIC_STEAM_API_KEY');
  // steamId 与 src/config/yuncan.config.ts 中硬编码值保持一致
  const steamId = getEnv('PUBLIC_STEAM_ID') || '76561199167590911';

  if (!apiKey) {
    console.log('[fetch-external-data] Steam: API Key 未配置，跳过');
    return null;
  }

  const url = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${apiKey}&steamid=${steamId}&include_appinfo=true&include_played_free_games=true&format=json`;
  const data = await fetchWithTimeout(url);
  const rawGames = Array.isArray(data?.response?.games) ? data.response.games : [];

  const games = rawGames
    .map((g) => {
      const appId = String(g.appid || '');
      const playtime = Number(g.playtime_forever || 0);
      return {
        appId,
        title: String(g.name || 'Steam Game'),
        cover: appId
          ? `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/header.jpg`
          : '/assets/logo-yuncan.png',
        storeUrl: appId
          ? `https://store.steampowered.com/app/${appId}/`
          : 'https://steamcommunity.com/profiles/76561199167590911/',
        communityUrl: appId ? `https://steamcommunity.com/app/${appId}` : undefined,
        newsUrl: appId ? `https://store.steampowered.com/news/app/${appId}` : undefined,
        steamdbUrl: appId ? `https://steamdb.info/app/${appId}/` : undefined,
        playtimeForever: playtime,
        playtimeHours: minutesToHours(playtime)
      };
    })
    .sort((a, b) => (b.playtimeForever || 0) - (a.playtimeForever || 0));

  return games;
}

// ===== 朋友圈 RSS 独立抓取（绕过 fcircle，避免 Cloudflare 拦截 GitHub Actions IP）=====
// 友链列表直接读本地 link.yml，RSS 在博客构建环境（Vercel/本地）抓取，IP 不受限。
const RSS_SUFFIXES = ['atom.xml', 'rss.xml', 'index.xml', 'feed.xml', 'feed', 'rss2.xml'];

/** 提取 XML 标签内容（处理 CDATA） */
function extractXml(block, tag) {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i');
  const m = block.match(re);
  if (!m) return '';
  let v = m[1];
  const cdata = v.match(/^<!\[CDATA\[([\s\S]*?)\]\]>$/);
  if (cdata) v = cdata[1];
  return v.trim();
}

/** 提取标签属性（如 Atom 的 <link href="...">） */
function extractAttr(block, tag, attr) {
  const re = new RegExp(`<${tag}[^>]*?\\s${attr}=["']([^"']*)["']`, 'i');
  const m = block.match(re);
  return m ? m[1].trim() : '';
}

/** 解码常见 HTML 实体 */
function decodeEntities(s) {
  return s
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'").replace(/&apos;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n))
    .replace(/&amp;/g, '&');
}

/** 标准化日期为 YYYY-MM-DD */
function normalizeDate(s) {
  if (!s) return '';
  s = s.trim();
  const iso = s.match(/^(\d{4}-\d{2}-\d{2})/);
  if (iso) return iso[1];
  const d = new Date(s);
  if (!isNaN(d)) return d.toISOString().slice(0, 10);
  return '';
}

/** 解析 RSS 2.0 / Atom feed，提取文章列表 */
function parseRssFeed(xml, friend, base) {
  const blockRe = /<(?:item|entry)\b[\s\S]*?<\/(?:item|entry)>/gi;
  const blocks = xml.match(blockRe) || [];
  const items = [];
  for (const block of blocks.slice(0, 5)) { // 每站最多 5 篇（与 fcircle MAX_POSTS_NUM 一致）
    const title = decodeEntities(extractXml(block, 'title')) || '无标题';
    let link = extractAttr(block, 'link', 'href') || extractXml(block, 'link');
    if (link && !/^https?:/i.test(link)) {
      try { link = new URL(link, base + '/').href; } catch { link = base + link; }
    }
    const dateStr = extractXml(block, 'pubDate') || extractXml(block, 'published')
      || extractXml(block, 'updated') || extractXml(block, 'date') || extractXml(block, 'dc:date');
    const date = normalizeDate(dateStr);
    items.push({
      title: title.trim(), created: date, updated: date,
      link: link || friend.link, author: friend.name, avatar: friend.avatar || '', summary: '',
    });
  }
  return items;
}

/** 抓取单个友链站点的 RSS（依次尝试常见后缀） */
async function fetchRssForSite(friend) {
  const base = friend.link.replace(/\/$/, '');
  for (const suffix of RSS_SUFFIXES) {
    const url = `${base}/${suffix}`;
    try {
      const res = await fetch(url, {
        signal: AbortSignal.timeout(8000),
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; yuncan-blog-fetcher/1.0)' },
        redirect: 'follow',
      });
      if (!res.ok) continue;
      const ct = (res.headers.get('content-type') || '').toLowerCase();
      const text = await res.text();
      if (!ct.includes('xml') && !ct.includes('rss')
        && !text.includes('<?xml') && !text.includes('<rss') && !text.includes('<feed')) continue;
      const articles = parseRssFeed(text, friend, base);
      if (articles.length) return articles;
    } catch (e) { /* 超时或网络错误，尝试下一个后缀 */ }
  }
  return [];
}

/** 从友链 link.yml 独立抓取 RSS（主路径） */
async function fetchCircleFromRss() {
  const linkPath = join(root, 'content', 'data', 'link.yml');
  if (!existsSync(linkPath)) {
    console.log('[fetch-external-data] Circle RSS: link.yml 不存在，跳过');
    return [];
  }
  const linkData = YAML.parse(readFileSync(linkPath, 'utf8'));
  const friends = [];
  for (const group of (Array.isArray(linkData) ? linkData : [linkData])) {
    for (const item of (group.link_list || [])) {
      if (item && item.link) {
        friends.push({ name: item.name || '未知站点', link: item.link, avatar: item.avatar || '' });
      }
    }
  }
  console.log(`[fetch-external-data] Circle RSS: 开始抓取 ${friends.length} 个友链站点`);
  const results = await Promise.allSettled(friends.map((f) => fetchRssForSite(f)));
  const allArticles = [];
  let okCount = 0;
  for (let i = 0; i < results.length; i++) {
    const r = results[i];
    if (r.status === 'fulfilled' && r.value.length) {
      allArticles.push(...r.value);
      okCount++;
    }
  }
  allArticles.sort((a, b) => (b.created || '').localeCompare(a.created || ''));
  console.log(`[fetch-external-data] Circle RSS: ${okCount}/${friends.length} 站点成功，共 ${allArticles.length} 篇文章`);
  return allArticles.slice(0, 40);
}

async function fetchCircleFeed() {
  // 主路径：直接抓取友链站点 RSS（绕过 fcircle）。
  // fcircle 的 GitHub Actions 因 blog.yuncan.xyz 走 Cloudflare，IP 被拦截导致友链页解析失败，
  // friends 表为空、爬不到新文章。博客构建环境（Vercel/本地）IP 不受限，可直连友链 RSS。
  try {
    const articles = await fetchCircleFromRss();
    if (articles.length) return articles;
    console.log('[fetch-external-data] Circle: RSS 抓取无数据，尝试 data.db 兜底');
  } catch (e) {
    console.log(`[fetch-external-data] Circle RSS 抓取失败: ${e.message}，尝试 data.db 兜底`);
  }

  // 兜底1：fcircle 的 data.db（含历史数据，最新 2026-06-27）
  const dbUrl = getEnv('PUBLIC_CIRCLE_DB_URL')
    || 'https://raw.githubusercontent.com/Yuncan050115/yuncan-blog-circle-of-friends/main/data.db';
  try {
    const articles = await fetchCircleFromDb(dbUrl);
    if (articles.length) return articles;
    console.log('[fetch-external-data] Circle: data.db 无数据，尝试 API 兜底');
  } catch (e) {
    console.log(`[fetch-external-data] Circle data.db 失败: ${e.message}，尝试 API 兜底`);
  }

  // 兜底2：旧 Vercel API（已 404）
  const circleApi = getEnv('PUBLIC_CIRCLE_API');
  if (!circleApi) {
    console.log('[fetch-external-data] Circle: API 未配置，跳过');
    return null;
  }
  const data = await fetchWithTimeout(circleApi);
  return Array.isArray(data?.article_data) ? data.article_data : [];
}

// 从 fcircle 仓库的 data.db（SQLite）读取聚合文章
async function fetchCircleFromDb(dbUrl) {
  const { DatabaseSync } = await import('node:sqlite');
  const { writeFileSync: writeTmp, readFileSync: readTmp, unlinkSync } = await import('fs');
  const { join } = await import('path');
  const { tmpdir } = await import('os');

  const res = await fetch(dbUrl, { signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (!buf.subarray(0, 16).toString('latin1').startsWith('SQLite format 3')) {
    throw new Error('下载内容不是 SQLite 数据库');
  }
  const tmpFile = join(tmpdir(), `yuncan-circle-${Date.now()}.db`);
  writeTmp(tmpFile, buf);
  try {
    const db = new DatabaseSync(tmpFile, { readOnly: true });
    const rows = db.prepare(`
      SELECT p.title, p.created, p.updated, p.link, p.author, p.avatar,
             (SELECT s.summary FROM article_summaries s WHERE s.link = p.link) AS summary
      FROM posts p
      ORDER BY p.created DESC, p.updated DESC
      LIMIT 40
    `).all();
    db.close();
    return rows.map((row, i) => ({
      floor: i + 1,
      title: String(row.title || '无标题'),
      created: String(row.created || ''),
      updated: String(row.updated || row.created || ''),
      link: String(row.link || '#'),
      author: String(row.author || '未知站点'),
      avatar: String(row.avatar || ''),
      summary: row.summary ? String(row.summary) : ''
    }));
  } finally {
    try { unlinkSync(tmpFile); } catch { /* 忽略清理失败 */ }
  }
}

async function fetchBilibiliBangumi() {
  const vmid = getEnv('PUBLIC_BILIBILI_UID') || '189708807';

  const results = { want: [], watching: [], watched: [] };
  // status: 1=想看, 2=在看, 3=看过
  // type: 1=番剧, 2=影视
  const statusMap = { 1: 'want', 2: 'watching', 3: 'watched' };

  for (const [status, key] of Object.entries(statusMap)) {
    for (const category of [1, 2]) {
      let page = 1;
      let hasMore = true;
      while (hasMore) {
        const url = `https://api.bilibili.com/x/space/bangumi/follow/list?vmid=${vmid}&type=${category}&follow_status=${status}&pn=${page}&ps=30`;
        try {
          const res = await fetch(url);
          const data = await res.json();
          if (data.code !== 0) throw new Error(data.message);
          const list = data.data?.list || [];
          const total = data.data?.total || 0;
          list.forEach(item => {
            results[key].push({
              id: String(item.season_id || item.media_id),
              title: item.title,
              cover: item.cover,
              url: item.url || `https://www.bilibili.com/bangumi/play/ss${item.season_id}`,
              status: Number(status),
              category,
              total: item.total_count,
              score: item.rating?.score,
              desc: item.evaluate,
              type: item.season_type_name,
              follow: item.stat?.follow,
              view: item.stat?.view,
            });
          });
          hasMore = list.length === 30 && results[key].length < total;
          page++;
          // 避免请求过快
          if (hasMore) await new Promise(r => setTimeout(r, 200));
        } catch (e) {
          console.log(`[fetch-external-data] Bilibili error (status=${status}, cat=${category}, page=${page}): ${e.message}`);
          hasMore = false;
        }
      }
    }
  }

  results.lastUpdate = new Date().toISOString();
  return results;
}

// GitHub 项目：按最近更新排序拉取非 fork 仓库，项目页"实时"数据源
async function fetchGithubProjects() {
  const user = getEnv('PUBLIC_GITHUB_USER') || 'Yuncan050115';
  const url = `https://api.github.com/users/${user}/repos?per_page=100&sort=updated&type=owner`;
  const res = await fetch(url, {
    headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'yuncan-blog-build' },
    signal: AbortSignal.timeout(10000)
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const repos = await res.json();
  if (!Array.isArray(repos)) return [];
  return repos
    .filter((repo) => !repo.fork && !repo.archived && repo.description)
    .sort((a, b) => (b.stargazers_count - a.stargazers_count) || (+new Date(b.pushed_at) - +new Date(a.pushed_at)))
    .slice(0, 8)
    .map((repo) => ({
      name: repo.name,
      href: repo.html_url,
      description: String(repo.description || ''),
      language: repo.language || '',
      stars: repo.stargazers_count || 0,
      updated: String(repo.pushed_at || '').slice(0, 10)
    }));
}

function ensureDataDir() {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
}

function writeIfValid(file, payload, label) {
  if (Array.isArray(payload) && payload.length) {
    writeFileSync(file, JSON.stringify(payload));
    console.log(`[fetch-external-data] ${label}: ${payload.length} 条数据已保存`);
    return true;
  }
  if (existsSync(file)) {
    console.log(`[fetch-external-data] ${label}: 获取失败或为空，保留旧数据`);
  } else {
    writeFileSync(file, '[]');
    console.log(`[fetch-external-data] ${label}: 获取失败且无旧数据，写入空数组`);
  }
  return false;
}

async function main() {
  ensureDataDir();

  try {
    const games = await fetchSteamGames();
    writeIfValid(STEAM_FILE, games, 'Steam');
  } catch (e) {
    console.log(`[fetch-external-data] Steam 错误: ${e.message}，保留旧数据`);
    if (!existsSync(STEAM_FILE)) writeFileSync(STEAM_FILE, '[]');
  }

  try {
    const articles = await fetchCircleFeed();
    writeIfValid(CIRCLE_FILE, articles, 'Circle');
  } catch (e) {
    console.log(`[fetch-external-data] Circle 错误: ${e.message}，保留旧数据`);
    if (!existsSync(CIRCLE_FILE)) writeFileSync(CIRCLE_FILE, '[]');
  }

  // GitHub 项目
  try {
    const projects = await fetchGithubProjects();
    writeIfValid(PROJECTS_FILE, projects, 'GitHub Projects');
  } catch (e) {
    console.log(`[fetch-external-data] GitHub Projects 错误: ${e.message}，保留旧数据`);
    if (!existsSync(PROJECTS_FILE)) writeFileSync(PROJECTS_FILE, '[]');
  }

  // Bangumi
  try {
    const bangumiData = await fetchBilibiliBangumi();
    if (bangumiData.want.length || bangumiData.watching.length || bangumiData.watched.length) {
      writeFileSync(BANGUMI_FILE, JSON.stringify(bangumiData));
      console.log(`[fetch-external-data] Bangumi: want=${bangumiData.want.length} watching=${bangumiData.watching.length} watched=${bangumiData.watched.length}`);
    } else if (existsSync(BANGUMI_FILE)) {
      console.log('[fetch-external-data] Bangumi: fetch returned empty, keeping old data');
    }
  } catch (e) {
    console.log(`[fetch-external-data] Bangumi error: ${e.message}, keeping old data`);
  }
}

main();
