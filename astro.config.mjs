import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import bangumi from 'astro-bangumi';
import UnoCSS from '@unocss/astro';

export default defineConfig({
  site: 'https://blog.yuncan.xyz',
  output: 'static',
  integrations: [
    // UnoCSS 新轨：按需原子类。不注入 reset（site.css 已含），避免样式冲突
    UnoCSS({ injectReset: false }),
    sitemap(),
    bangumi({
      source: 'bili',
      // import.meta.env 在非 Vite 上下文（如 UnoCSS 配置加载）可能为 undefined，做防御
      vmid: import.meta.env?.PUBLIC_BILIBILI_UID || '189708807',
      title: '追番列表',
      category: [1, 2],
      coverMirror: '',
      devMode: true,
      refreshEndpoint: '/api/bangumi/refresh',
    })
  ],
  image: {
    domains: ['apir.yuncan.xyz', 'papi.yuncan.xyz', 'i0.hdslb.com']
  }
});
