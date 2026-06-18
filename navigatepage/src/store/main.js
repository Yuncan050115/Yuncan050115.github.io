import { defineStore } from 'pinia';
import { ref } from 'vue';

// 浏览器环境检测辅助函数
const isBrowser = typeof window !== 'undefined';

// 默认初始宽度
const DEFAULT_WIDTH = 1024;

/**
 * 主存储
 * @param {object} pinia - 可选的pinia实例
 * @returns {object} store实例
 */
export const useMainStore = defineStore(
  'main',
  () => {
    // 状态
    const innerWidth = ref(isBrowser ? window.innerWidth : DEFAULT_WIDTH);
    const imgLoadStatus = ref(false);
    const backgroundShow = ref(false);
    const boxOpenState = ref(false);
    const setOpenState = ref(false);
    const mobileOpenState = ref(false);
    const wallpaperType = ref('');
    const musicIsOk = ref(false);
    const musicOpenState = ref(false);
    const playerState = ref(false);
    const playerTitle = ref('');
    const playerArtist = ref('');
    const playerCover = ref('');
    const playerLrc = ref('');
    const playerColor = ref('');
    const lrcShow = ref(false);
    const playerLrcShow = ref(false);
    const musicClick = ref(false);
    const footerBlur = ref(true);

    // 设置宽度
    function setInnerWidth(width) {
      innerWidth.value = width;
    }

    // 设置壁纸类型
    function setWallpaperType(type) {
      wallpaperType.value = type;
    }

    // 重置状态
    function resetPlayerInfo() {
      playerTitle.value = '';
      playerArtist.value = '';
      playerCover.value = '';
      playerLrc.value = '';
      playerColor.value = '';
    }

    // 获取歌词
    function getPlayerLrc() {
      return playerLrc.value;
    }

    // 获取歌曲信息
    function getPlayerData() {
      return {
        name: playerTitle.value,
        artist: playerArtist.value,
      };
    }

    // 更改播放状态
    function setPlayerState(value) {
      if (value) {
        playerState.value = false;
      } else {
        playerState.value = true;
      }
    }

    // 更改歌词
    function setPlayerLrc(value) {
      playerLrc.value = value;
    }

    // 更改歌曲数据
    function setPlayerData(title, artist) {
      playerTitle.value = title;
      playerArtist.value = artist;
    }

    // 更改壁纸加载状态
    function setImgLoadStatus(value) {
      imgLoadStatus.value = value;
    }

    return {
      innerWidth,
      imgLoadStatus,
      backgroundShow,
      boxOpenState,
      setOpenState,
      mobileOpenState,
      wallpaperType,
      musicIsOk,
      musicOpenState,
      playerState,
      playerTitle,
      playerArtist,
      playerCover,
      playerLrc,
      playerColor,
      lrcShow,
      playerLrcShow,
      musicClick,
      footerBlur,
      setInnerWidth,
      setWallpaperType,
      resetPlayerInfo,
      getPlayerLrc,
      getPlayerData,
      setPlayerState,
      setPlayerLrc,
      setPlayerData,
      setImgLoadStatus,
    };
  },
  {
    persist: {
      enabled: true,
      strategies: [
        {
          key: 'yuncan-settings',
          storage: isBrowser ? localStorage : null,
          paths: ['wallpaperType', 'musicClick', 'footerBlur', 'lrcShow', 'playerLrcShow'],
        },
      ],
    },
  }
);
