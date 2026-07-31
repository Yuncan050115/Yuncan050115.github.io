import {
  defineConfig,
  presetWind3,
  presetIcons,
  transformerDirectives,
  transformerVariantGroup
} from 'unocss';

/**
 * UnoCSS 设计令牌层（新轨）
 *
 * 策略：site.css 冻结为 legacy 轨道（只修 bug 不新增），
 * 一切新样式走 UnoCSS 原子类。颜色/字体全部桥接到现有 CSS 变量，
 * 因此 [data-theme] 深浅色切换对新轨同样生效，无需 dark: 变体。
 */
export default defineConfig({
  // Astro 静态构建下 Vite 转换管线覆盖不全，直接从磁盘扫描源码
  content: {
    filesystem: ['src/**/*.{astro,ts,tsx,js,jsx,html}']
  },
  presets: [
    presetWind3(),
    presetIcons({
      scale: 1.1,
      extraProperties: {
        display: 'inline-block',
        'vertical-align': '-0.15em'
      }
    })
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
  theme: {
    colors: {
      paper: 'var(--bg)',
      ink: 'var(--text)',
      muted: 'var(--muted)',
      line: 'var(--line)',
      accent: 'var(--accent)',
      'accent-2': 'var(--accent-2)',
      warm: 'var(--warm)',
      surface: 'var(--surface)'
    },
    fontFamily: {
      sans: 'var(--font-sans)'
    },
    easing: {
      site: 'cubic-bezier(.19, 1, .22, 1)'
    }
  },
  shortcuts: {
    // 通用容器：与 legacy 布局同宽
    'site-container': 'w-[min(1180px,calc(100%-32px))] mx-auto',
    // 文本交互色：悬停转主题色
    // 注意：shortcut 名禁用 hover/link/focus 等变体词做连字符段（会被解析成变体而失效）
    'soft-accent': 'transition-colors duration-300 hover:text-accent'
  }
});
