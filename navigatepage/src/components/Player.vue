<template>
  <aplayer
    showLrc
    ref="player"
    v-if="playList[0]"
    :music="playList[playIndex]"
    :list="playList"
    :autoplay="autoplay"
    :theme="theme"
    :repeat="repeat"
    :shuffle="shuffle"
    :listMaxHeight="listMaxHeight"
    :listFolded="listFolded"
    :volume="volume"
    @play="onPlay"
    @pause="onPause"
    @timeupdate="onTimeUp"
    @onSelectSong="onSelectSong"
    @error="loadMusicError"
  />
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick, h } from 'vue';
import { MusicOne, PlayWrong } from '@icon-park/vue-next';
import { getPlayerList } from '@/api';
import { useMainStore } from '@/store/main';
import aplayer from 'vue3-aplayer';
import { ElMessage, ElLoading } from 'element-plus';

const store = useMainStore();

// 获取播放器 DOM
const player = ref(null);

// 歌曲播放列表
const playList = ref([]);

// 歌曲播放项
const playIndex = ref(0);
const playListCount = ref(0);

const skipTimeout = ref(null);

// 配置项
const props = defineProps({
  // 音频自动播放
  autoplay: {
    type: Boolean,
    default: false,
  },
  // 主题色
  theme: {
    type: String,
    default: '#2d8cf0',
  },
  // 音频循环播放
  repeat: {
    type: String,
    default: 'all', //'list' | 'music' | 'none'
  },
  // 随机播放
  shuffle: {
    type: Boolean,
    default: false,
  },
  // 默认音量
  volume: {
    type: Number,
    default: 0.7,
    validator: (value) => {
      return value >= 0 && value <= 1;
    },
  },
  // 歌曲服务器 ( netease-网易云, tencent-qq音乐 )
  songServer: {
    type: String,
    default: 'netease', //'netease' | 'tencent'
  },
  // 播放类型 ( song-歌曲, playlist-播放列表, album-专辑, search-搜索, artist-艺术家 )
  songType: {
    type: String,
    default: 'playlist',
  },
  // id
  songId: {
    type: String,
    default: '',
  },
  // 列表是否默认折叠
  listFolded: {
    type: Boolean,
    default: false,
  },
  // 列表最大高度
  listMaxHeight: {
    type: String,
    default: '420px',
  },
  // 音乐服务器 网易云:netease 酷我:kuwo QQ:qq
  server: {
    type: String,
    default: 'netease',
  },
  // 音乐类型 歌单:playlist 专辑:album 歌手:artist
  type: {
    type: String,
    default: 'playlist',
  },
  // 播放列表ID
  id: {
    type: String,
    default: '',
  },
  fixed: {
    type: Boolean,
    default: true,
  },
  mini: {
    type: Boolean,
    default: false,
  },
  showlrc: {
    type: Boolean,
    default: false,
  },
  mutex: {
    type: Boolean,
    default: true,
  },
});

// 初始化播放器
onMounted(async () => {
  console.log('====== 播放器初始化 ======');
  // console.log("歌曲API:", import.meta.env.VITE_SONG_API || "未设置");
  // console.log("接收的配置参数:", {
  //   server: props.server,
  //   type: props.type,
  //   id: props.id
  // });

  // 检查是否有备用API配置
  if (!import.meta.env.VITE_SONG_API && !sessionStorage.getItem('backup-song-api')) {
    // 设置一个默认的备用API
    sessionStorage.setItem('backup-song-api', 'https://api.wuenci.com/meting/api/');
    // console.log("已设置备用音乐API地址");
  }

  // 获取歌单ID，优先使用传入的ID
  let songId = props.id;

  // 如果没有传入ID，尝试从localStorage获取
  if (!songId) {
    songId = localStorage.getItem('playlistId');
    // console.log("从localStorage读取歌单ID:", songId);
  }

  // 如果仍然没有ID，使用默认值
  if (!songId) {
    songId = '7452421335'; // 默认值
    // console.log("使用默认歌单ID:", songId);
    // 保存到localStorage以便下次使用
    localStorage.setItem('playlistId', songId);
  }

  // 记录最终使用的音乐配置
  // console.log("使用音乐配置:", {
  //   server: props.server,
  //   type: props.type,
  //   id: songId
  // });

  // 使用loading动画
  const loading = ElLoading.service({
    lock: true,
    text: '歌单加载中...',
    background: 'rgba(0, 0, 0, 0.5)',
  });

  try {
    // 获取歌单列表，使用实际的ID而不是props.id
    const data = await getPlayerList(props.server, props.type, songId);

    if (data && data.length > 0) {
      // 将API返回的数据格式化为播放器需要的格式
      playList.value = data.map((v) => ({
        title: v.name || v.title,
        artist: v.artist || v.author,
        src: v.url,
        pic: v.pic,
        lrc: v.lrc,
      }));

      playListCount.value = playList.value.length;
      // console.log(`加载了${playListCount.value}首歌曲`);

      // 储存播放器信息
      store.playerTitle = playList.value[0].title;
      store.playerArtist = playList.value[0].artist;
      store.setPlayerData(playList.value[0].title, playList.value[0].artist);

      // 设置音乐播放器状态为就绪
      store.musicIsOk = true;

      // 激活歌词显示
      store.playerLrcShow = true;

      // 如果自动播放，启动播放
      if (props.autoplay) {
        nextTick(() => {
          if (player.value) {
            player.value.play();
          }
        });
      }

      ElMessage.success(`加载了${playListCount.value}首歌曲`);
    } else {
      ElMessage.error('歌单获取失败，请检查网络');
    }
  } catch (error) {
    console.error('歌单加载错误:', error);
    ElMessage.error('歌单加载错误: ' + (error.message || '未知错误'));
  } finally {
    loading.close();
  }
});

// 播放
const onPlay = () => {
  // console.log("播放");
  if (!player.value || !player.value.audio) {
    console.error('播放器还未初始化');
    return;
  }

  // 确保能够获取到当前音乐信息
  if (player.value.currentMusic) {
    // 播放状态
    store.musicClick = !player.value.audio.paused;
    store.playerState = true; // 确保播放状态正确

    // 存储播放器信息
    const songTitle = player.value.currentMusic.title || '未知歌曲';
    const songArtist = player.value.currentMusic.artist || '未知艺术家';

    // 直接设置store中的值
    store.playerTitle = songTitle;
    store.playerArtist = songArtist;

    // 通过方法设置
    store.setPlayerData(songTitle, songArtist);

    // 确保开启歌词显示
    store.playerLrcShow = true;

    ElMessage({
      message: songTitle + ' - ' + songArtist,
      grouping: true,
      icon: h(MusicOne, {
        theme: 'filled',
        fill: '#efefef',
      }),
    });
  } else if (playList.value && playList.value.length > 0 && playIndex.value >= 0) {
    // 如果无法获取currentMusic，但有播放列表，使用列表中的当前歌曲信息
    const currentSong = playList.value[playIndex.value];
    if (currentSong) {
      store.musicClick = true;
      store.playerState = true; // 确保播放状态正确

      store.playerTitle = currentSong.title || '未知歌曲';
      store.playerArtist = currentSong.artist || '未知艺术家';

      store.setPlayerData(currentSong.title, currentSong.artist);

      // 确保开启歌词显示
      store.playerLrcShow = true;

      ElMessage({
        message: currentSong.title + ' - ' + currentSong.artist,
        grouping: true,
        icon: h(MusicOne, {
          theme: 'filled',
          fill: '#efefef',
        }),
      });
    }
  } else {
    console.error('无法获取当前播放歌曲信息');
  }
};

// 暂停
const onPause = () => {
  if (!player.value || !player.value.audio) {
    console.error('播放器还未初始化');
    return;
  }
  store.musicClick = !player.value.audio.paused;
  store.playerState = false; // 确保暂停状态正确
};

// 音频时间更新事件
const onTimeUp = () => {
  if (!player.value) {
    console.error('播放器未初始化');
    return;
  }

  try {
    let playerRef = player.value.$.vnode.el;
    if (playerRef) {
      // 尝试获取当前歌词元素
      const currentLrcElement = playerRef.querySelector('.aplayer-lrc-current');

      // 如果找不到当前歌词元素，尝试其他元素
      if (!currentLrcElement) {
        const lrcLines = playerRef.querySelectorAll('.aplayer-lrc p');
        if (lrcLines && lrcLines.length > 0) {
          // 查找哪一行包含active类
          for (let i = 0; i < lrcLines.length; i++) {
            if (
              lrcLines[i].classList.contains('active') ||
              lrcLines[i].classList.contains('current')
            ) {
              // 设置歌词
              const lrcText = lrcLines[i].innerHTML || '暂无歌词';
              store.setPlayerLrc(lrcText);

              // 确保playerLrcShow为true
              store.playerLrcShow = true;
              return;
            }
          }
        }
      }

      // 常规查找方式
      const previousLrcElement = currentLrcElement?.previousElementSibling;
      const lrcContent =
        currentLrcElement?.innerHTML || previousLrcElement?.innerHTML || '暂无歌词';

      store.setPlayerLrc(lrcContent);

      // 确保playerLrcShow为true，这样歌词就会在footer中显示
      store.playerLrcShow = true;
    }
  } catch (error) {
    console.error('获取歌词时出错:', error);
  }
};

// 播放器加载失败
const loadMusicError = (e) => {
  console.error('音乐加载错误:', e);

  ElMessage({
    message: '音乐加载失败，正在尝试下一首',
    grouping: true,
    icon: h(PlayWrong, {
      theme: 'filled',
      fill: '#efefef',
    }),
  });

  // 自动切换到下一首
  setTimeout(() => {
    try {
      // console.log("自动切换到下一首");
      changeSong(1); // 调用切换下一首的函数
    } catch (error) {
      console.error('切换下一首失败:', error);
    }
  }, 1000);
};

// 切换播放暂停事件
const playToggle = () => {
  if (!player.value) {
    console.error('播放器还未初始化');
    ElMessage({
      message: '播放器未就绪，请稍后再试',
      grouping: true,
      icon: h(PlayWrong, {
        theme: 'filled',
        fill: '#efefef',
      }),
    });
    return;
  }
  player.value.toggle();
};

// 切换音量事件
const changeVolume = (value) => {
  if (!player.value || !player.value.audio) {
    console.error('播放器还未初始化');
    return;
  }
  player.value.audio.volume = value;
};

const onSelectSong = (val) => {
  // console.log("选择歌曲:", val);
};

// 切换上下曲
const changeSong = (type) => {
  if (!player.value) {
    console.error('播放器未初始化');
    return;
  }

  playIndex.value = player.value.playIndex;
  playIndex.value += type ? 1 : -1;
  // 判断是否处于最后/第一首
  if (playIndex.value < 0) {
    playIndex.value = playListCount.value - 1;
  } else if (playIndex.value > playListCount.value - 1) {
    playIndex.value = 0;
  }

  // 使用正确的方法切换歌曲
  if (player.value.audio) {
    try {
      // 尝试使用不同的方法切换歌曲
      if (typeof player.value.select === 'function') {
        player.value.select(playIndex.value);
      } else if (typeof player.value.switchMusic === 'function') {
        player.value.switchMusic(playIndex.value);
      } else {
        // 如果没有直接切换方法，手动加载对应索引的歌曲
        const nextSong = playList.value[playIndex.value];
        if (nextSong) {
          // 停止当前歌曲
          player.value.audio.pause();
          // 设置新歌曲信息
          store.setPlayerData(nextSong.title, nextSong.artist);
          // 延迟后重新加载并播放
          setTimeout(() => {
            if (player.value && player.value.audio) {
              player.value.audio.src = nextSong.src;
              player.value.audio.load();
              player.value.audio.play();
            }
          }, 100);
        }
      }
    } catch (error) {
      console.error('切换歌曲时发生错误:', error);
    }
  }
};

// 组件卸载前清理
onBeforeUnmount(() => {
  clearTimeout(skipTimeout.value);
});

// 向父组件暴露方法
defineExpose({
  playToggle,
  changeVolume,
  changeSong,
});
</script>

<style lang="scss" scoped>
.aplayer {
  width: 80%;
  background: transparent;
  border-radius: 6px;
  font-family: 'HarmonyOS_Regular', sans-serif !important;
  :deep(.aplayer-body) {
    .aplayer-pic {
      display: none;
    }
    .aplayer-info {
      margin-left: 0;
      background-color: rgba(0, 0, 0, 0.4);
      border-color: transparent !important;
      .aplayer-music {
        flex-grow: initial;
        margin-bottom: 2px;
        overflow: initial;
        .aplayer-title {
          font-size: 16px;
          margin-right: 6px;
        }
        .aplayer-author {
          color: #efefef;
        }
      }
      .aplayer-lrc {
        text-align: left;
        margin: 4px 0 6px 6px;
        height: 100%;
        mask: linear-gradient(
          #fff 15%,
          #fff 85%,
          hsla(0deg, 0%, 100%, 0.6) 90%,
          hsla(0deg, 0%, 100%, 0)
        );
        -webkit-mask: linear-gradient(
          #fff 15%,
          #fff 85%,
          hsla(0deg, 0%, 100%, 0.6) 90%,
          hsla(0deg, 0%, 100%, 0)
        );
        &::before,
        &::after {
          display: none;
        }
        p {
          color: #efefef;
        }
        .aplayer-lrc-current {
          font-size: 0.95rem;
          margin-bottom: 4px !important;
        }
      }
      .aplayer-controller {
        display: none;
      }
    }
  }
  :deep(.aplayer-list) {
    margin-top: 6px;
    ol {
      &::-webkit-scrollbar-track {
        background-color: transparent;
      }
      li {
        border-color: transparent;
        &.aplayer-list-light {
          background: rgba(255, 255, 255, 0.15);
          border-radius: 6px;
        }
        &:hover {
          background: rgba(255, 255, 255, 0.1) !important;
          border-radius: 6px !important;
        }
        .aplayer-list-index,
        .aplayer-list-author {
          color: #efefef;
        }
      }
    }
  }
}
</style>
