<template>
  <!-- 音乐控制面板 -->
  <div
    class="music"
    @mouseenter="volumeShow = true"
    @mouseleave="volumeShow = false"
    v-show="store.musicOpenState"
  >
    <div class="btns">
      <span @click="openMusicList()">音乐列表</span>
      <span @click="store.musicOpenState = false">回到一言</span>
    </div>
    <div class="control">
      <go-start theme="filled" size="30" fill="#efefef" @click="changeMusicIndex(0)" />
      <div class="state" @click="changePlayState">
        <play-one theme="filled" size="50" fill="#efefef" v-show="!store.playerState" />
        <pause theme="filled" size="50" fill="#efefef" v-show="store.playerState" />
      </div>
      <go-end theme="filled" size="30" fill="#efefef" @click="changeMusicIndex(1)" />
    </div>
    <div class="menu">
      <div class="name" v-show="!volumeShow">
        <span>{{
          store.playerTitle ? store.playerTitle + ' - ' + store.playerArtist : '未播放音乐'
        }}</span>
      </div>
      <div class="volume" v-show="volumeShow">
        <div class="icon">
          <volume-mute theme="filled" size="24" fill="#efefef" v-if="volumeNum == 0" />
          <volume-small
            theme="filled"
            size="24"
            fill="#efefef"
            v-else-if="volumeNum > 0 && volumeNum < 0.7"
          />
          <volume-notice theme="filled" size="24" fill="#efefef" v-else />
        </div>
        <el-slider v-model="volumeNum" :show-tooltip="false" :min="0" :max="1" :step="0.01" />
      </div>
    </div>
  </div>
  <!-- 音乐列表弹窗 -->
  <Transition name="fade" mode="out-in">
    <div class="music-list" v-show="musicListShow" @click="musicListShow = false">
      <Transition name="zoom">
        <div class="list" v-show="musicListShow" @click.stop>
          <close-one
            class="close"
            theme="filled"
            size="28"
            fill="#ffffff"
            @click="musicListShow = false"
          />
          <Player
            :songServer="playerData.server"
            :songType="playerData.type"
            :songId="playerData.id"
            :volume="volumeNum"
            :shuffle="false"
            ref="playerRef"
          />
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup>
import { ref, reactive, onMounted, watch, h } from 'vue';
import {
  GoStart,
  PlayOne,
  Pause,
  GoEnd,
  CloseOne,
  VolumeMute,
  VolumeSmall,
  VolumeNotice,
  Error,
} from '@icon-park/vue-next';
import Player from '@/components/Player.vue';
import { useMainStore } from '@/store/main';
import { ElSlider, ElMessage } from 'element-plus';

const store = useMainStore();

// 音量条数据
const volumeShow = ref(false);
const volumeNum = ref(store.musicVolume ? store.musicVolume : 0.7);

// 播放列表数据
const musicListShow = ref(false);
const playerRef = ref(null);
const playerData = reactive({
  server: import.meta.env.VITE_SONG_SERVER,
  type: import.meta.env.VITE_SONG_TYPE,
  id: import.meta.env.VITE_SONG_ID,
});

// 检查并记录音乐配置
// console.log("===== 音乐播放器配置 =====");
// console.log("API地址:", import.meta.env.VITE_SONG_API);
// console.log("音乐服务:", playerData.server);
// console.log("类型:", playerData.type);
// console.log("歌单ID:", playerData.id);
// console.log("=======================");

// 开启播放列表
const openMusicList = () => {
  // console.log("尝试打开音乐列表");
  // console.log("playerData:", playerData);

  // 强制设置playerData的ID
  if (!playerData.id) {
    // console.log("歌单ID未配置，强制设置默认值");
    playerData.server = 'netease';
    playerData.type = 'playlist';
    playerData.id = '7712475417'; // 默认歌单ID
  }

  console.log('设置musicListShow为true');
  musicListShow.value = true;

  // 激活歌词显示
  store.playerLrcShow = true;

  // 延迟检查播放器实例
  setTimeout(() => {
    // console.log("playerRef:", playerRef.value);

    // 如果存在播放器实例并且播放器已初始化，确保歌词显示
    if (playerRef.value && playerRef.value.audio) {
      // 触发一次时间更新事件，以便更新歌词
      if (typeof playerRef.value.onTimeUp === 'function') {
        playerRef.value.onTimeUp();
      }
    }
  }, 500);
};

// 音乐播放暂停
const changePlayState = () => {
  if (!playerRef.value) {
    console.error('播放器未初始化');
    return;
  }
  playerRef.value.playToggle();
};

// 音乐上下曲
const changeMusicIndex = (type) => {
  if (!playerRef.value) {
    console.error('播放器未初始化');
    return;
  }
  playerRef.value.changeSong(type);
};

onMounted(() => {
  // 设置播放器配置
  playerData.server = import.meta.env.VITE_SONG_SERVER || 'netease';
  playerData.type = import.meta.env.VITE_SONG_TYPE || 'playlist';
  playerData.id = import.meta.env.VITE_SONG_ID || '7712475417';

  // 在本地存储中缓存配置
  localStorage.setItem('music-config', JSON.stringify(playerData));
  localStorage.setItem('playlistId', playerData.id);

  // 确保状态正确
  store.musicIsOk = true;

  // 空格键事件 - 控制播放暂停
  window.addEventListener('keydown', (e) => {
    if (e.code == 'Space') {
      changePlayState();
    }
  });
  // 挂载方法至 window
  window.$openList = openMusicList;
});

// 监听音量变化
watch(
  () => volumeNum.value,
  (value) => {
    store.musicVolume = value;
    if (playerRef.value) {
      playerRef.value.changeVolume(store.musicVolume);
    }
  }
);
</script>

<style lang="scss" scoped>
.music {
  width: 94%;
  height: 140px;
  background: #00000040;
  backdrop-filter: blur(10px);
  border-radius: 6px;
  padding: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  animation: fade 0.5s;
  margin: 0 auto;
  transform: scale(0.95);
  transition:
    transform 0.3s cubic-bezier(.16, 1, .3, 1),
    background-color 0.3s cubic-bezier(.16, 1, .3, 1),
    box-shadow 0.3s cubic-bezier(.16, 1, .3, 1);

  &:hover {
    transform: scale(0.98);
    background-color: rgba(0, 0, 0, 0.4);
    box-shadow: 0 0 25px rgba(255, 255, 255, 0.1);
  }

  &:active {
    transform: scale(0.95);
  }
  .btns {
    display: flex;
    align-items: center;
    margin-bottom: 6px;
    span {
      background: #ffffff26;
      padding: 2px 8px;
      border-radius: 6px;
      margin: 0px 6px;
      text-overflow: ellipsis;
      overflow-x: hidden;
      white-space: nowrap;
      transition: background-color 0.3s cubic-bezier(.16, 1, .3, 1);
      &:hover {
        background: #ffffff4d;
      }
    }
  }
  .control {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
    width: 100%;
    .state {
      .i-icon {
        width: 50px;
        height: 50px;
        display: block;
      }
    }
    .i-icon {
      width: 36px;
      height: 36px;
      display: flex;
      border-radius: 6px;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      transform: scale(1);
      transition: transform 0.3s cubic-bezier(.16, 1, .3, 1), background-color 0.3s cubic-bezier(.16, 1, .3, 1);
      &:hover {
        background: #ffffff33;
      }
      &:active {
        transform: scale(0.95);
      }
    }
  }
  .menu {
    height: 26px;
    width: 100%;
    line-height: 26px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .name {
      width: 100%;
      text-align: center;
      text-overflow: ellipsis;
      overflow-x: hidden;
      white-space: nowrap;
      animation: fade 0.3s;
    }
    .volume {
      width: 100%;
      padding: 0 12px;
      display: flex;
      align-items: center;
      flex-direction: row;
      animation: fade 0.3s;
      .icon {
        margin-right: 12px;
        span {
          width: 24px;
          height: 24px;
          display: block;
        }
      }
      :deep(*) {
        transition: none;
      }
      :deep(.el-slider__button) {
        transition: transform 0.3s cubic-bezier(.16, 1, .3, 1);
      }
      .el-slider {
        margin-right: 12px;
        --el-slider-main-bg-color: #efefef;
        --el-slider-runway-bg-color: #ffffff40;
        --el-slider-button-size: 16px;
      }
    }
  }
}
.music-list {
  position: fixed;
  top: 0;
  left: 0;
  margin: auto;
  width: 100%;
  height: 100%;
  background-color: #00000080;
  backdrop-filter: blur(20px);
  z-index: 1;
  .list {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    top: calc(50% - 300px);
    left: calc(50% - 320px);
    width: 640px;
    height: 600px;
    background-color: rgba(30, 30, 30, 0.85);
    border-radius: 6px;
    z-index: 999;
    @media (max-width: 720px) {
      left: calc(50% - 45%);
      width: 90%;
    }
    .close {
      position: absolute;
      top: 12px;
      right: 12px;
      width: 28px;
      height: 28px;
      display: block;
      transition: transform 0.3s cubic-bezier(.16, 1, .3, 1);
      &:hover {
        transform: scale(1.2);
      }
      &:active {
        transform: scale(0.95);
      }
    }
  }
}

// 弹窗动画
.zoom-enter-active {
  animation: zoom 0.4s ease-in-out;
}
.zoom-leave-active {
  animation: zoom 0.3s ease-in-out reverse;
}
@keyframes zoom {
  0% {
    opacity: 0;
    transform: scale(0) translateY(-600px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>
