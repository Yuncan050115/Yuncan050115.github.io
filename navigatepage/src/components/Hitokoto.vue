<template>
  <div
    class="hitokoto cards"
    v-show="!store.musicOpenState"
    @mouseenter="openMusicShow = true"
    @mouseleave="openMusicShow = false"
    @click.stop
  >
    <!-- 打开音乐面板 -->
    <Transition name="el-fade-in-linear">
      <div class="open-music" v-show="openMusicShow && store.musicIsOk" @click="openMusicPlayer">
        <music-menu theme="filled" size="18" fill="#efefef" />
        <span>打开音乐播放器</span>
      </div>
    </Transition>
    <!-- 一言内容 -->
    <Transition name="el-fade-in-linear" mode="out-in">
      <div :key="hitokotoData.text" class="content" @click="openMusicPlayer">
        <p style="text-align: center; font-size: 0.5rem; color: #00e3e3">⚡Music⚡</p>
        <span class="text">{{ hitokotoData.text }}</span>
        <span class="from">-「&nbsp;{{ hitokotoData.from }}&nbsp;」</span>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, h } from 'vue';
import { MusicMenu, Error } from '@icon-park/vue-next';
import { getHitokoto } from '@/api/index';
import { useMainStore } from '@/store/main';
import debounce from '@/utils/debounce.js';
import { ElMessage } from 'element-plus';

const store = useMainStore();

// 开启音乐面板按钮显隐
const openMusicShow = ref(false);

// 一言数据
const hitokotoData = reactive({
  text: '这里本应显示别人的一句话',
  from: '云灿',
});

// 打开音乐播放器
const openMusicPlayer = () => {
  if (store.musicIsOk) {
    store.musicOpenState = true;
  } else {
    ElMessage({
      message: '音乐播放器未就绪，请检查API设置',
      grouping: true,
      icon: h(Error, {
        theme: 'filled',
        fill: '#efefef',
      }),
    });
  }
};

// 获取一言数据
const getHitokotoData = () => {
  getHitokoto()
    .then((res) => {
      hitokotoData.text = res.hitokoto;
      hitokotoData.from = res.from;
    })
    .catch(() => {
      ElMessage({
        message: '一言获取失败',
        icon: h(Error, {
          theme: 'filled',
          fill: '#efefef',
        }),
      });
      hitokotoData.text = '单击此处打开音乐播放器';
      hitokotoData.from = '云灿';
    });
};

// 更新一言数据
const updateHitokoto = () => {
  // 防抖
  debounce(() => {
    getHitokotoData();
  }, 500);
};

onMounted(() => {
  getHitokotoData();

  // 强制设置音乐播放器状态为就绪
  store.musicIsOk = true;
});
</script>

<style lang="scss" scoped>
.hitokoto {
  width: 94%;
  height: 140px;
  padding: 15px;
  animation: fade 0.5s;
  transform: scale(0.95);
  color: #ffffff !important;
  transition:
    transform 0.3s cubic-bezier(.16, 1, .3, 1),
    background-color 0.3s cubic-bezier(.16, 1, .3, 1),
    box-shadow 0.3s cubic-bezier(.16, 1, .3, 1);
  margin: 0 auto;
  font-family: 'JinghuaLaosong', sans-serif;

  &:hover {
    transform: scale(0.98);
    background-color: rgba(0, 0, 0, 0.4);
    box-shadow: 0 0 25px rgba(255, 255, 255, 0.1);
  }

  &:active {
    transform: scale(0.95);
  }

  .open-music {
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #00000026;
    padding: 4px 0;
    border-radius: 8px 8px 0 0;
    .i-icon {
      width: 18px;
      height: 18px;
      display: block;
      margin-right: 8px;
      color: #ffffff !important;
      fill: #ffffff !important;
    }
    span {
      font-size: 0.95rem;
      color: #ffffff !important;
    }
  }
  .content {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    color: #ffffff !important;

    p {
      color: #ffffff !important;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
      font-size: 0.45rem;
      margin-bottom: 2px;
      font-family: 'JinghuaLaosong', sans-serif;
    }

    .text {
      font-size: 1rem;
      word-break: break-all;
      text-overflow: ellipsis;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      color: #ffffff !important;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
      margin-bottom: 4px;
      font-family: 'JinghuaLaosong', sans-serif;
    }
    .from {
      margin-top: 5px;
      font-weight: bold;
      align-self: flex-end;
      font-size: 1rem;
      color: #ffffff !important;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
      font-family: 'JinghuaLaosong', sans-serif;
    }
  }
}
</style>
