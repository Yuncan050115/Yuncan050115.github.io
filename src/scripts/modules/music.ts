/**
 * 音乐播放器 dock v2：歌单加载、歌词解析、播放进度（可拖拽点击）、
 * 列表面板（类名与样式系统对齐，修复 v1 死列表）。
 */

import { isMobile } from '../core/env';
import type { LrcLine, MusicConfig } from '../core/env';

const parseLrc = (lrc = '') =>
  lrc
    .split('\n')
    .map((line) => {
      const match = line.match(/\[(\d{2}):(\d{2})(?:\.(\d{2,3}))?\](.*)/);
      if (!match) return null;
      const fraction = match[3] ? Number(`0.${match[3]}`) : 0;
      return { time: Number(match[1]) * 60 + Number(match[2]) + fraction, text: match[4].trim() };
    })
    .filter(Boolean) as LrcLine[];

const buildMusicUrl = (config: MusicConfig) =>
  config.api
    .replace(':server', encodeURIComponent(config.server))
    .replace(':type', encodeURIComponent(config.type))
    .replace(':id', encodeURIComponent(config.id))
    .replace(':r', String(Math.random()));

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
};

export const initMusic = async () => {
  const dock = document.querySelector<HTMLElement>('.music-dock');
  if (!dock) return;
  const config = JSON.parse(dock.dataset.music || '{}') as MusicConfig;
  const audio = dock.querySelector<HTMLAudioElement>('[data-music-audio]');
  const playButtons = Array.from(dock.querySelectorAll<HTMLButtonElement>('[data-music-play]'));
  const title = dock.querySelector<HTMLElement>('[data-music-title]');
  const artist = dock.querySelector<HTMLElement>('[data-music-artist]');
  const lyric = dock.querySelector<HTMLElement>('[data-music-lyric]');
  const cover = dock.querySelector<HTMLImageElement>('.music-cover img');
  const prev = dock.querySelector<HTMLButtonElement>('[data-music-prev]');
  const next = dock.querySelector<HTMLButtonElement>('[data-music-next]');
  const queueBtn = dock.querySelector<HTMLButtonElement>('[data-music-queue]');
  const list = dock.querySelector<HTMLElement>('[data-music-list]');
  const bar = dock.querySelector<HTMLElement>('[data-music-bar]');
  const seek = dock.querySelector<HTMLElement>('[data-music-seek]');
  const currentEl = dock.querySelector<HTMLElement>('[data-music-current]');
  const durationEl = dock.querySelector<HTMLElement>('[data-music-duration]');
  if (!audio || !playButtons.length) return;

  const state = window.__yuncanMusicState || { tracks: [], currentIndex: 0, lrc: [] };
  window.__yuncanMusicState = state;

  const loadLrc = async (value = '') => {
    if (!value) return [];
    if (/^https?:\/\//.test(value)) {
      try {
        const res = await fetch(value);
        return parseLrc(await res.text());
      } catch {
        return [];
      }
    }
    return parseLrc(value);
  };

  const renderQueue = () => {
    if (!list) return;
    if (!state.tracks.length) {
      list.innerHTML = '<p class="music-empty">歌单正在路上</p>';
      return;
    }
    // 列表类名与样式系统对齐（.music-list-item*），v1 曾因类名错配整体失样式
    list.innerHTML = state.tracks
      .slice(0, 60)
      .map((track, index) => {
        const active = index === state.currentIndex ? ' is-active' : '';
        const artistName = escapeHtml(track.author || track.artist || 'Yuncan');
        const trackTitle = escapeHtml(track.title || 'Yuncan Music');
        return `<button type="button" class="music-list-item${active}" data-music-index="${index}">
          <span class="music-list-index">${String(index + 1).padStart(2, '0')}</span>
          <span class="music-list-title">${trackTitle}</span>
          <span class="music-list-artist">${artistName}</span>
          <span class="music-list-bars" aria-hidden="true"><i></i><i></i><i></i></span>
        </button>`;
      })
      .join('');
    // 激活项滚入可视区
    list.querySelector('.is-active')?.scrollIntoView({ block: 'nearest' });
  };

  const applyTrack = async (index: number, keepTime = false) => {
    const track = state.tracks[index];
    if (!track) return;
    state.currentIndex = index;
    if (audio.dataset.trackIndex !== String(index)) {
      audio.src = track.url;
      audio.dataset.trackIndex = String(index);
      if (keepTime && state.currentTime) audio.currentTime = state.currentTime;
    }
    if (title) title.textContent = track.title || 'Yuncan Music';
    if (artist) artist.textContent = track.author || track.artist || 'Yuncan';
    if (cover) cover.src = track.pic || track.cover || config.fallbackCover;
    if (lyric) lyric.textContent = '歌词同步中';
    state.lrc = await loadLrc(track.lrc || '');
    if (lyric && !state.lrc.length) lyric.textContent = '这首歌暂时没有歌词';
    renderQueue();
  };

  const playCurrent = async () => {
    if (!state.tracks.length) return;
    await applyTrack(state.currentIndex, true);
    await audio
      .play()
      .then(() => {
        dock.classList.add('playing');
        state.wasPlaying = true;
      })
      .catch(() => {
        dock.classList.remove('playing');
        state.wasPlaying = false;
        if (lyric) lyric.textContent = '浏览器拦截了自动播放，点封面继续';
      });
  };

  if (!state.tracks.length && !state.loading) {
    state.loading = (async () => {
      try {
        const res = await fetch(buildMusicUrl(config), { mode: 'cors' });
        const data = await res.json();
        state.tracks = Array.isArray(data) ? data.filter((item) => item.url) : [];
      } catch {
        state.tracks = [];
      }
    })();
  }

  renderQueue();
  if (state.loading) await state.loading;
  if (!state.tracks.length) {
    if (lyric) lyric.textContent = '歌单接口暂时没有返回可播放曲目';
    renderQueue();
    return;
  }

  await applyTrack(state.currentIndex, true);
  dock.classList.toggle('playing', !audio.paused);
  renderQueue();

  playButtons.forEach((play) => {
    if (play.dataset.ready === 'true') return;
    play.dataset.ready = 'true';
    play.addEventListener('click', async () => {
      if (!audio.src) await applyTrack(state.currentIndex, true);
      if (audio.paused) {
        await audio
          .play()
          .then(() => {
            dock.classList.add('playing');
            state.wasPlaying = true;
          })
          .catch(() => {
            if (lyric) lyric.textContent = '播放被浏览器拦截，再点一次试试';
          });
      } else {
        audio.pause();
        dock.classList.remove('playing');
        state.wasPlaying = false;
      }
    });
  });

  if (next && next.dataset.ready !== 'true') {
    next.dataset.ready = 'true';
    next.addEventListener('click', async () => {
      state.currentIndex = (state.currentIndex + 1) % state.tracks.length;
      state.currentTime = 0;
      await playCurrent();
    });
  }

  if (prev && prev.dataset.ready !== 'true') {
    prev.dataset.ready = 'true';
    prev.addEventListener('click', async () => {
      if (!state.tracks.length) return;
      state.currentIndex =
        (state.currentIndex - 1 + state.tracks.length) % state.tracks.length;
      state.currentTime = 0;
      await playCurrent();
    });
  }

  // 歌单列表开合：仅由按钮触发；光标离开或点击坞外即收回封面圆盘
  if (queueBtn && queueBtn.dataset.ready !== 'true') {
    queueBtn.dataset.ready = 'true';
    queueBtn.addEventListener('click', () => {
      dock.classList.toggle('queue-open');
      if (dock.classList.contains('queue-open')) {
        list?.querySelector('.is-active')?.scrollIntoView({ block: 'nearest' });
      }
    });
  }

  // 收回逻辑只绑一次（dock 为 persist 元素）
  if (dock.dataset.collapseReady !== 'true') {
    dock.dataset.collapseReady = 'true';
    const collapse = () => {
      if (!dock.classList.contains('queue-open')) return;
      dock.classList.remove('queue-open');
      // 焦点留在坞内会靠 :focus-within 撑开面板，一并释放
      const active = document.activeElement;
      if (active instanceof HTMLElement && dock.contains(active)) active.blur();
    };
    dock.addEventListener('mouseleave', collapse);
    document.addEventListener('pointerdown', (event) => {
      if (!dock.contains(event.target as Node)) collapse();
    });
  }

  if (list && list.dataset.ready !== 'true') {
    list.dataset.ready = 'true';
    list.addEventListener('click', async (event) => {
      const button = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-music-index]');
      if (!button) return;
      state.currentIndex = Number(button.dataset.musicIndex || 0);
      state.currentTime = 0;
      await playCurrent();
    });
  }

  // 进度条：点击/拖动跳转
  if (seek && seek.dataset.ready !== 'true') {
    seek.dataset.ready = 'true';
    const seekTo = (clientX: number) => {
      const rect = seek.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        audio.currentTime = ratio * audio.duration;
      }
    };
    let dragging = false;
    seek.addEventListener('pointerdown', (e) => {
      dragging = true;
      seek.setPointerCapture(e.pointerId);
      seekTo(e.clientX);
    });
    seek.addEventListener('pointermove', (e) => {
      if (dragging) seekTo(e.clientX);
    });
    seek.addEventListener('pointerup', () => { dragging = false; });
    seek.addEventListener('keydown', (e) => {
      if (!Number.isFinite(audio.duration)) return;
      if (e.key === 'ArrowRight') audio.currentTime = Math.min(audio.duration, audio.currentTime + 5);
      if (e.key === 'ArrowLeft') audio.currentTime = Math.max(0, audio.currentTime - 5);
    });
  }

  if (audio.dataset.ready !== 'true') {
    audio.dataset.ready = 'true';
    audio.addEventListener('ended', async () => {
      state.currentIndex = (state.currentIndex + 1) % state.tracks.length;
      state.currentTime = 0;
      await playCurrent();
    });
    audio.addEventListener('pause', () => {
      state.wasPlaying = false;
      dock.classList.remove('playing');
    });
    audio.addEventListener('play', () => {
      state.wasPlaying = true;
      dock.classList.add('playing');
    });
    audio.addEventListener('loadedmetadata', () => {
      if (durationEl) durationEl.textContent = formatTime(audio.duration);
    });
    audio.addEventListener('timeupdate', () => {
      state.currentTime = audio.currentTime;
      // 进度条与时间
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        const pct = (audio.currentTime / audio.duration) * 100;
        if (bar) bar.style.width = `${pct}%`;
        if (currentEl) currentEl.textContent = formatTime(audio.currentTime);
        seek?.setAttribute('aria-valuenow', String(Math.round(pct)));
      }
      // 歌词同步
      if (!lyric || !state.lrc.length) return;
      const line = [...state.lrc].reverse().find((item) => item.time <= audio.currentTime);
      const lyricText = line?.text || '';
      if (lyricText) lyric.textContent = lyricText;

      // 歌词栏更新（仅更新文本，不强制显示）
      const lyricBar = document.getElementById('lyric-bar');
      const lyricBarText = document.querySelector<HTMLElement>('[data-lyric-text]');
      if (lyricBar && lyricBarText) {
        lyricBarText.textContent = lyricText || '暂无歌词';
        if (sessionStorage.getItem('lyric-bar-closed') !== '1') {
          lyricBar.classList.add('is-active');
        }
      }
    });
  }

  if (config.autoplay && !state.triedAutoplay) {
    state.triedAutoplay = true;
    // 移动端不自动播放（浏览器限制 + 流量考虑），仅桌面端自动播放
    if (!isMobile()) {
      await playCurrent();
    }
  } else if (state.wasPlaying && audio.paused) {
    await playCurrent();
  }
};
