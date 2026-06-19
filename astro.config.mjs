import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import bangumi from 'astro-bangumi';

export default defineConfig({
  site: 'https://blog.yuncan.xyz',
  output: 'static',
  integrations: [
    sitemap(),
    bangumi({
      source: 'bili',
      vmid: import.meta.env.PUBLIC_BILIBILI_UID || '189708807',
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
