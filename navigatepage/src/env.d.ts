/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_NAME: string;
  readonly VITE_SITE_ANTHOR: string;
  readonly VITE_SITE_KEYWORDS: string;
  readonly VITE_SITE_DES: string;
  readonly VITE_SITE_URL: string;
  readonly VITE_SITE_LOGO: string;
  readonly VITE_SITE_MAIN_LOGO: string;
  readonly VITE_SITE_APPLE_LOGO: string;
  readonly VITE_DESC_HELLO: string;
  readonly VITE_DESC_TEXT: string;
  readonly VITE_DESC_AUTHOR: string;
  readonly VITE_DESC_HELLO_OTHER: string;
  readonly VITE_DESC_TEXT_OTHER: string;
  readonly VITE_WEATHER_KEY: string;
  readonly VITE_SITE_START: string;
  readonly VITE_SITE_ICP: string;
  readonly VITE_SONG_API: string;
  readonly VITE_SONG_SERVER: string;
  readonly VITE_SONG_TYPE: string;
  readonly VITE_SONG_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
