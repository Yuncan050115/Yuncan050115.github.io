<template>
  <div :class="['cover', { show: isBackgroundShown }]">
    <img
      v-show="isImgLoaded"
      class="bg"
      alt="cover"
      :src="bgUrl"
      decoding="async"
      fetchpriority="high"
      @load="imgLoadComplete"
      @error.once="imgLoadError"
      @animationend="imgAnimationEnd"
    />
    <div :class="['gray', { hidden: isBackgroundShown }]" />
    <Transition name="fade" mode="out-in">
      <button
        v-if="isBackgroundShown && wallpaperType != '3'"
        class="down"
        @click="downloadWallpaper"
      >
        下载壁纸
      </button>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, h, computed } from 'vue';
import { useSecureStore } from '@/utils/useSecureStore';
import { Error, CheckOne } from '@icon-park/vue-next';
import { ElMessage } from 'element-plus';

const { store, isReady } = useSecureStore();
const bgUrl = ref(null);
const imgTimeout = ref(null);
const emit = defineEmits(['loadComplete']);

// 计算属性，安全访问store状态
const isBackgroundShown = computed(() =>
  isReady.value && store.value ? store.value.backgroundShow : false
);
const isImgLoaded = computed(() =>
  isReady.value && store.value ? store.value.imgLoadStatus : false
);
const wallpaperType = computed(() =>
  isReady.value && store.value ? store.value.wallpaperType : '0'
);

// 壁纸随机数
// 请依据文件夹内的图片个数修改 Math.random() 后面的第一个数字
const bgRandom = Math.floor(Math.random() * 12 + 1);

// 更换壁纸链接
const changeBg = (type) => {
  // 如果type为空或不是有效值，默认使用类型0
  const wallpaperType = type || '0';

  if (wallpaperType === '0' || wallpaperType === 0) {
    // 默认使用本地图片
    // bgUrl.value = `/images/background${bgRandom}.jpg`;
    // 也可以作为备选尝试远程API
    bgUrl.value = 'https://apir.yuncan.xyz/';
  } else if (wallpaperType === '1' || wallpaperType === 1) {
    bgUrl.value = 'https://api.dujin.org/bing/1920.php';
  } else if (wallpaperType === '2' || wallpaperType === 2) {
    bgUrl.value = 'https://api.vvhan.com/api/wallpaper/views';
  } else if (wallpaperType === '3' || wallpaperType === 3) {
    bgUrl.value = 'https://api.vvhan.com/api/wallpaper/acg';
  } else {
    // 兜底，使用本地图片
    bgUrl.value = `/images/background${bgRandom}.jpg`;
  }
};

// 图片加载完成
const imgLoadComplete = () => {
  // 直接设置图片加载状态为true
  if (isReady.value && store.value) {
    store.value.imgLoadStatus = true;
  }

  // 为了兼容性，保留原来的延时逻辑
  imgTimeout.value = setTimeout(
    () => {
      // 再次确认设置状态
      if (isReady.value && store.value) {
        store.value.imgLoadStatus = true;
      }
    },
    Math.floor(Math.random() * (600 - 300 + 1)) + 300
  );
};

// 图片动画完成
const imgAnimationEnd = () => {
  // console.log("壁纸加载且动画完成");
  // 加载完成事件
  emit('loadComplete');
};

// 图片显示失败
const imgLoadError = () => {
  console.error('壁纸加载失败：', bgUrl.value);
  ElMessage({
    message: '壁纸加载失败，已临时切换回默认',
    icon: h(Error, {
      theme: 'filled',
      fill: '#efefef',
    }),
  });
  // 使用本地图片作为备选
  bgUrl.value = `/images/background${bgRandom}.jpg`;
  // 设置一个超时确保图片能够被加载和处理
  setTimeout(() => {
    imgLoadComplete();
  }, 1000);
};

// 下载当前壁纸
const downloadWallpaper = () => {
  try {
    // 创建一个临时a标签用于下载
    const downloadLink = document.createElement('a');

    // 设置文件名，处理不同壁纸源的文件名
    let filename = 'wallpaper.jpg';
    if (wallpaperType.value === '1') {
      filename = 'bing-wallpaper.jpg';
    } else if (wallpaperType.value === '2') {
      filename = 'landscape-wallpaper.jpg';
    } else {
      filename = `wallpaper-${Date.now()}.jpg`;
    }

    downloadLink.href = bgUrl.value;
    downloadLink.download = filename;
    downloadLink.target = '_blank';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    // 显示成功消息
    ElMessage({
      message: '壁纸下载已开始',
      icon: h(CheckOne, {
        theme: 'filled',
        fill: '#efefef',
      }),
    });
  } catch (error) {
    console.error('壁纸下载失败:', error);
    ElMessage.error('壁纸下载失败，请尝试右键保存图片');

    // 如果下载失败，回退到原来的打开方式
    window.open(bgUrl.value, '_blank');
  }
};

onMounted(() => {
  // 加载壁纸
  changeBg(wallpaperType.value);

  // 防止图片加载超时，5秒后强制设置imgLoadStatus为true
  setTimeout(() => {
    if (!isImgLoaded.value && isReady.value && store.value) {
      // console.log("图片加载超时，强制设置imgLoadStatus为true");
      store.value.imgLoadStatus = true;
      imgLoadComplete();
    }
  }, 5000);
});

onBeforeUnmount(() => {
  clearTimeout(imgTimeout.value);
});
</script>

<style lang="scss" scoped>
.cover {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background-color: rgba(0, 0, 0, 0.6);
  transition: all 0.2s cubic-bezier(.16, 1, .3, 1);
  overflow: hidden;
  &.show {
    z-index: 9;
    background-color: rgba(0, 0, 0, 0.2);
  }
  .bg {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
    animation: blur-in 0.4s ease-in-out forwards;
  }
  .down {
    position: fixed;
    bottom: 24px;
    right: 24px;
    background-color: #00000080;
    backdrop-filter: blur(8px);
    color: #efefef;
    font-size: 14px;
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(.16, 1, .3, 1);
    border: none;
    outline: none;
    &:hover {
      background-color: #000000a0;
      transform: translateY(-2px);
    }
    &:active {
      transform: translateY(0);
    }
  }
  .gray {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.17);
    transition: opacity 0.5s cubic-bezier(.16, 1, .3, 1);
    &.hidden {
      opacity: 0;
    }
  }
}
@keyframes blur-in {
  0% {
    filter: blur(12px);
    transform: scale(1.05);
  }
  100% {
    filter: blur(0);
    transform: scale(1);
  }
}
</style>
