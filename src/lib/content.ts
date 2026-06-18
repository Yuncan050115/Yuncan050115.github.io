import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';
import YAML from 'yaml';
import { site } from '../data/site';

const root = process.cwd();
const oldSource = path.join(root, 'content');
const oldGenerated = path.join(root, 'content', 'fallback');
const postsDir = path.join(oldSource, 'posts');

export type TocItem = {
  depth: number;
  text: string;
  id: string;
};

export type Post = {
  title: string;
  slug: string;
  date: string;
  updated?: string;
  description: string;
  tags: string[];
  categories: string[];
  html: string;
  excerpt: string;
  cover: string;
  hasCover: boolean;
  readingMinutes: number;
  toc: TocItem[];
  sticky: number;
  pinned: boolean;
};

export type MediaItem = {
  title: string;
  type?: string;
  area?: string;
  cover?: string;
  totalCount?: string | number;
  score?: string | number;
  des?: string;
  view?: string | number;
  follow?: string | number;
  url?: string;
  badge?: string;
};

export type MediaGroup = {
  key: string;
  title: string;
  items: MediaItem[];
};

export type SteamGame = {
  appId: string;
  title: string;
  cover: string;
  storeUrl: string;
  playtimeForever?: number;
  playtimeHours?: string;
  forumUrl?: string;
  communityUrl?: string;
  officialUrl?: string;
  newsUrl?: string;
  steamdbUrl?: string;
};

marked.setOptions({
  gfm: true,
  breaks: false
});

const toArray = (value: unknown) => {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === 'string' && value.trim()) return [value];
  return [];
};

const formatDate = (value: unknown) => {
  const date = value instanceof Date ? value : new Date(String(value || ''));
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
};

const stripHtml = (value: string) =>
  value
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const decodeHtml = (value: string) =>
  value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[\\/:*?"<>|#%{}^~[\]`]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

const convertHexoTags = (content: string) =>
  content
    .replace(/\{% note\s+(\w+)?[^%]*%\}([\s\S]*?)\{% endnote %\}/g, (_, type = 'info', body) => {
      return `<div class="note note-${type}">${body.trim()}</div>`;
    })
    .replace(/\{% timeline\s+([^%]+)%\}/g, '<div class="timeline"><h2>$1</h2>')
    .replace(/\{% endtimeline %\}/g, '</div>')
    .replace(/<!-- timeline\s+([^>]+)-->/g, '<div class="timeline-item"><time>$1</time><div>')
    .replace(/<!-- endtimeline -->/g, '</div></div>')
    .replace(/\{% tabs\s+[^%]+%\}/g, '<div class="tabs-lite">')
    .replace(/\{% endtabs %\}/g, '</div>')
    .replace(/<!-- tab\s+([^>]+)-->/g, '<section class="tab-lite"><h3>$1</h3>')
    .replace(/<!-- endtab -->/g, '</section>')
    .replace(/\{%[^%]+%\}/g, '');

const injectHeadingIds = (html: string) => {
  const toc: TocItem[] = [];
  const nextHtml = html.replace(/<h([2-3])([^>]*)>([\s\S]*?)<\/h\1>/g, (full, level, attrs, inner) => {
    if (/\sid=/.test(attrs)) return full;
    const text = stripHtml(inner);
    if (!text) return full;
    const base = slugify(text) || `heading-${toc.length + 1}`;
    let id = base;
    let index = 2;
    while (toc.some((item) => item.id === id)) {
      id = `${base}-${index}`;
      index += 1;
    }
    toc.push({ depth: Number(level), text, id });
    return `<h${level}${attrs} id="${id}">${inner}</h${level}>`;
  });

  return { html: nextHtml, toc };
};

const protectArticleImages = (html: string) =>
  html.replace(/<img\s/gi, `<img loading="lazy" decoding="async" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src='${site.assets.defaultPostCover}'" `);

const addCodeFrames = (html: string) =>
  html.replace(/<pre><code(?: class="language-([^"]+)")?>([\s\S]*?)<\/code><\/pre>/g, (_, lang = 'text', code) => {
    const label = String(lang || 'text').toUpperCase();
    return `<figure class="code-frame" data-lang="${escapeHtml(label)}"><figcaption><span></span><strong>${escapeHtml(label)}</strong><button type="button" data-copy-code>复制</button></figcaption><pre><code class="language-${escapeHtml(String(lang || 'text'))}">${code}</code></pre></figure>`;
  });

const renderMarkdown = (content: string) => {
  const rawHtml = marked.parse(convertHexoTags(content), { async: false }) as string;
  const withImages = protectArticleImages(rawHtml);
  const withCode = addCodeFrames(withImages);
  return injectHeadingIds(withCode);
};

const estimateReading = (content: string) => {
  const clean = content.replace(/```[\s\S]*?```/g, '').replace(/\s/g, '');
  return Math.max(1, Math.ceil(clean.length / 500));
};

const firstMarkdownImage = (content: string) => content.match(/!\[[^\]]*\]\(([^)]+)\)/)?.[1];

const normalizeCover = (value?: string) => {
  const cover = String(value || '').trim();
  if (!cover || cover === 'false') return '';
  return cover;
};

const stickyValue = (data: Record<string, unknown>) => {
  if (data.pin === true || data.top === true) return 1;
  const raw = Number(data.sticky || data.pin || data.top || 0);
  return Number.isFinite(raw) ? raw : 0;
};

export function getPosts(): Post[] {
  if (!fs.existsSync(postsDir)) return [];

  return fs
    .readdirSync(postsDir)
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
      const raw = fs.readFileSync(path.join(postsDir, file), 'utf8');
      const parsed = matter(raw);
      const data = parsed.data;
      const title = String(data.title || file.replace(/\.md$/, ''));
      const slug = String(data.abbrlink || slugify(title));
      const rendered = renderMarkdown(parsed.content);
      const text = stripHtml(rendered.html);
      const cover = normalizeCover(data.cover || data.top_img || firstMarkdownImage(parsed.content));
      const sticky = stickyValue(data);

      return {
        title,
        slug,
        date: formatDate(data.date),
        updated: formatDate(data.updated || data.update),
        description: String(data.description || text.slice(0, 88)),
        tags: toArray(data.tags),
        categories: toArray(data.categories),
        html: rendered.html,
        excerpt: text.slice(0, 118),
        cover: cover || site.assets.defaultPostCover,
        hasCover: Boolean(cover),
        readingMinutes: estimateReading(parsed.content),
        toc: rendered.toc,
        sticky,
        pinned: sticky > 0
      };
    })
    .sort((a, b) => b.sticky - a.sticky || +new Date(b.date) - +new Date(a.date));
}

export function getPost(slug: string) {
  return getPosts().find((post) => post.slug === slug);
}

export function getTaxonomy(type: 'tags' | 'categories') {
  const map = new Map<string, Post[]>();
  getPosts().forEach((post) => {
    post[type].forEach((name) => {
      const posts = map.get(name) || [];
      posts.push(post);
      map.set(name, posts);
    });
  });
  return Array.from(map.entries())
    .map(([name, posts]) => ({ name, slug: slugify(name), posts }))
    .sort((a, b) => b.posts.length - a.posts.length || a.name.localeCompare(b.name, 'zh-CN'));
}

export function getPageMarkdown(relativePath: string) {
  const file = path.join(oldSource, relativePath);
  if (!fs.existsSync(file)) return { title: '', html: '', data: {} };
  const parsed = matter(fs.readFileSync(file, 'utf8'));
  return {
    title: String(parsed.data.title || ''),
    html: renderMarkdown(parsed.content).html,
    data: parsed.data
  };
}

export function getLinks() {
  const file = path.join(oldSource, 'data', 'link.yml');
  if (!fs.existsSync(file)) return [];
  const doc = YAML.parse(fs.readFileSync(file, 'utf8')) as Array<{
    class_name: string;
    class_desc?: string;
    link_list: Array<{ name: string; link: string; avatar?: string; avater?: string; descr?: string; siteshot?: string; screenshot?: string }>;
  }>;

  return doc.map((group) => ({
    ...group,
    link_list: group.link_list.map((item) => ({
      ...item,
      avatar: item.avatar || item.avater || site.assets.friendFallback,
      siteshot: item.siteshot || item.screenshot || ''
    }))
  }));
}

const normalizeBiliItem = (item: any): MediaItem => ({
  title: item.title || item.season_title || '未命名条目',
  type: item.season_type_name || item.type,
  area: Array.isArray(item.areas) ? item.areas.map((area: any) => area.name).join(' / ') : item.area,
  cover: item.cover || item.square_cover || site.assets.defaultPostCover,
  totalCount: item.new_ep?.index_show || item.total_count || item.totalCount,
  score: item.rating?.score || item.score,
  des: item.evaluate || item.summary || item.des || item.subtitle || '',
  view: item.stat?.view || item.view,
  follow: item.stat?.follow || item.follow,
  url: item.url || (item.id ? `https://www.bilibili.com/bangumi/play/ss${item.id}` : ''),
  badge: item.badge || item.renewal_time || ''
});

export function getMedia(kind: 'bangumis' | 'cinemas'): MediaGroup[] {
  const file = path.join(oldSource, 'data', `${kind}.json`);
  if (!fs.existsSync(file)) return [];
  const json = JSON.parse(fs.readFileSync(file, 'utf8')) as Record<string, MediaItem[]>;
  return [
    { key: 'watching', title: '正在看', items: (json.watching || []).map(normalizeBiliItem) },
    { key: 'wantWatch', title: '想看', items: (json.wantWatch || []).map(normalizeBiliItem) },
    { key: 'watched', title: '看过', items: (json.watched || []).map(normalizeBiliItem) }
  ].filter((group) => group.items.length);
}

export async function getBiliMedia(kind: 'bangumis' | 'cinemas'): Promise<MediaGroup[]> {
  return getMedia(kind);
}

const minutesToHours = (minutes = 0) => {
  if (!minutes) return '0 小时';
  const hours = minutes / 60;
  return hours >= 10 ? `${Math.round(hours)} 小时` : `${hours.toFixed(1)} 小时`;
};

const steamApiUrl = () =>
  site.media.steamOwnedGamesApi
    .replace(':key', encodeURIComponent(site.media.steamApiKey || ''))
    .replace(':steamId', encodeURIComponent(site.media.steamId));

async function getSteamGamesFromApi(): Promise<SteamGame[]> {
  if (!site.media.steamApiKey || !site.media.steamId) return [];
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(steamApiUrl(), { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) return [];
    const data = await res.json();
    const games = Array.isArray(data?.response?.games) ? data.response.games : [];
    return games
      .map((game: any) => {
        const appId = String(game.appid || '');
        const playtime = Number(game.playtime_forever || 0);
        return {
          appId,
          title: String(game.name || 'Steam Game'),
          cover: appId ? `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/header.jpg` : site.assets.defaultPostCover,
          storeUrl: appId ? `https://store.steampowered.com/app/${appId}/` : site.media.steamProfile,
          communityUrl: appId ? `https://steamcommunity.com/app/${appId}` : undefined,
          newsUrl: appId ? `https://store.steampowered.com/news/app/${appId}` : undefined,
          steamdbUrl: appId ? `https://steamdb.info/app/${appId}/` : undefined,
          playtimeForever: playtime,
          playtimeHours: minutesToHours(playtime)
        };
      })
      .sort((a: SteamGame, b: SteamGame) => (b.playtimeForever || 0) - (a.playtimeForever || 0));
  } catch {
    return [];
  }
}

function getSteamGamesFromGenerated(): SteamGame[] {
  const file = path.join(oldGenerated, 'steamgames', 'index.html');
  if (!fs.existsSync(file)) return [];
  const html = fs.readFileSync(file, 'utf8');
  const blocks = html.match(/<div class="steam-game-item"[\s\S]*?(?=<div class="steam-game-item"|<div class="steam-pagination"|<\/main>)/g) || [];

  return blocks.map((block) => {
    const appId = block.match(/store\.steampowered\.com\/app\/(\d+)/)?.[1] || '';
    const title = decodeHtml(stripHtml(block.match(/<div class="steam-game-title">([\s\S]*?)<\/div>/)?.[1] || 'Steam Game'));
    const cover =
      decodeHtml(block.match(/data-src="([^"]+)"/)?.[1] || block.match(/src="([^"]+steam[^"]+)"/)?.[1] || (appId ? `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/header.jpg` : site.assets.defaultPostCover));
    const links = Array.from(block.matchAll(/<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)).map((match) => ({
      href: decodeHtml(match[1]),
      text: stripHtml(match[2])
    }));
    const find = (keyword: string) => links.find((link) => link.text.includes(keyword))?.href;

    return {
      appId,
      title,
      cover,
      storeUrl: find('商店') || (appId ? `https://store.steampowered.com/app/${appId}/` : site.media.steamProfile),
      forumUrl: find('论坛'),
      communityUrl: find('社区'),
      officialUrl: find('官网'),
      newsUrl: find('新闻'),
      steamdbUrl: find('SteamDB')
    };
  });
}

export type SteamGamesResult = {
  games: SteamGame[];
  error?: string;
  source: 'api' | 'fallback' | 'none';
};

export async function getSteamGames(): Promise<SteamGamesResult> {
  const apiGames = await getSteamGamesFromApi();
  if (apiGames.length) {
    return { games: apiGames, source: 'api' };
  }
  const fallbackGames = getSteamGamesFromGenerated();
  if (fallbackGames.length) {
    return { games: fallbackGames, source: 'fallback' };
  }
  return { games: [], source: 'none', error: '无法获取游戏数据，请稍后再试或检查 Steam API 配置。' };
}
