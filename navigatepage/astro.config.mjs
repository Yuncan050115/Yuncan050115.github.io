import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';
import AstroPWA from '@vite-pwa/astro';
import compressHTML from 'astro-compress';

export default defineConfig({
  integrations: [
    vue(),
    AstroPWA({
      registerType: 'autoUpdate',
      workbox: {
        skipWaiting: true,
        clientsClaim: true,
        runtimeCaching: [
          {
            urlPattern: /(.*?)\.(js|css|woff2|woff|ttf)/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'js-css-cache',
            },
          },
          {
            urlPattern: /(.*?)\.(png|jpe?g|svg|gif|bmp|psd|tiff|tga|eps)/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'image-cache',
            },
          },
        ],
      },
      manifest: {
        name: import.meta.env.VITE_SITE_NAME,
        short_name: import.meta.env.VITE_SITE_NAME,
        description: import.meta.env.VITE_SITE_DES,
        display: 'standalone',
        start_url: '/',
        theme_color: '#424242',
        background_color: '#424242',
        icons: [
          {
            src: '/images/icon/48.png',
            sizes: '48x48',
            type: 'image/png',
          },
          {
            src: '/images/icon/72.png',
            sizes: '72x72',
            type: 'image/png',
          },
          {
            src: '/images/icon/96.png',
            sizes: '96x96',
            type: 'image/png',
          },
          {
            src: '/images/icon/128.png',
            sizes: '128x128',
            type: 'image/png',
          },
          {
            src: '/images/icon/144.png',
            sizes: '144x144',
            type: 'image/png',
          },
          {
            src: '/images/icon/192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/images/icon/512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
    compressHTML(),
  ],
  vite: {
    resolve: {
      alias: {
        '@': '/src',
      },
    },
    css: {
      devSourcemap: true,
      preprocessorOptions: {
        scss: {
          includePaths: ['./src/styles'],
        },
      },
    },
    build: {
      minify: 'terser',
      terserOptions: {
        compress: {
          pure_funcs: ['console.log'],
        },
      },
    },
  },
}); 