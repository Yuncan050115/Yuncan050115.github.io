/**
 * 共享类型、Window 全局声明与设备判断
 */

export type Track = {
  title: string;
  author?: string;
  artist?: string;
  url: string;
  pic?: string;
  cover?: string;
  lrc?: string;
};

export type MusicConfig = {
  api: string;
  server: string;
  type: string;
  id: string;
  autoplay?: boolean;
  lyricMode?: string;
  fallbackCover: string;
};

export type LrcLine = { time: number; text: string };

export type MusicState = {
  tracks: Track[];
  currentIndex: number;
  lrc: LrcLine[];
  loading?: Promise<void>;
  triedAutoplay?: boolean;
  currentTime?: number;
  wasPlaying?: boolean;
};

declare global {
  interface Window {
    __yuncanApp?: boolean;
    __yuncanThree?: boolean;
    __yuncanContextMenu?: boolean;
    __yuncanMusicState?: MusicState;
    __yuncanParticles?: { mouseX: number; mouseY: number };
    twikoo?: { init: (options: { envId?: string; el: string }) => void };
  }
}

// 移动端判断：触屏设备或窄屏
export const isMobile = () =>
  window.matchMedia('(max-width: 768px)').matches ||
  window.matchMedia('(pointer: coarse)').matches;
