import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://blog.yuncan.xyz',
  output: 'static',
  integrations: [sitemap()],
  image: {
    domains: ['apir.yuncan.xyz', 'papi.yuncan.xyz', 'i0.hdslb.com']
  }
});
