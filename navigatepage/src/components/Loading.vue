<template>
  <div id="loader-wrapper" :class="showLoading ? null : 'loaded'">
    <div class="loader">
      <div class="loader-circle">
        <img class="custom-image" src="/images/icon/logo.png" alt="logo" />
      </div>
      <div class="loader-text">
        <span class="name">
          {{ siteName }}
        </span>
        <span class="tip"> 加载中 </span>
      </div>
    </div>
    <div class="loader-section section-left" />
    <div class="loader-section section-right" />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useSecureStore } from '@/utils/useSecureStore';

// 使用安全的store访问
const { store, isReady } = useSecureStore();

// 计算是否显示加载界面
const showLoading = computed(() => {
  // 如果store未准备好，显示加载界面
  if (!isReady.value || !store.value) return true;

  // 如果图片未加载完成，显示加载界面
  if (!store.value.imgLoadStatus) return true;

  // 其他情况不显示加载界面
  return false;
});

// 在组件加载后强制输出加载状态，帮助调试
setTimeout(() => {
  // console.log("Loading状态检查:", {
  //   isReady: isReady.value,
  //   storeExists: !!store.value,
  //   imgLoadStatus: store.value?.imgLoadStatus,
  //   showLoading: showLoading.value
  // });
}, 2000);

// 强制超时移除Loading界面
// 即使imgLoadStatus不会被设置为true，也能在5秒后移除Loading界面
setTimeout(() => {
  if (showLoading.value && store.value) {
    console.log('强制移除Loading界面');
    store.value.setImgLoadStatus(true);
  }
}, 5000);

// 配置
const siteName = import.meta.env.VITE_SITE_NAME;
</script>

<style lang="scss" scoped>
#loader-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
  overflow: hidden;
  .loader {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .loader-circle {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      position: relative;
      overflow: hidden;
      border: 3px solid transparent;
      border-top-color: #fff;
      animation: spin 1.8s linear infinite;
      z-index: 2;

      &:before {
        content: '';
        position: absolute;
        top: 5px;
        left: 5px;
        right: 5px;
        bottom: 5px;
        border-radius: 50%;
        border: 3px solid transparent;
        border-top-color: rgba(114, 172, 167, 0.51);
        animation: spin-reverse 0.6s linear infinite;
      }

      &:after {
        content: '';
        position: absolute;
        top: 15px;
        left: 15px;
        right: 15px;
        bottom: 15px;
        border-radius: 50%;
        border: 3px solid transparent;
        border-top-color: #bd7fa2;
        animation: spin 1s linear infinite;
      }
    }
    .loader-text {
      display: flex;
      flex-direction: column;
      align-items: center;
      color: #fff;
      z-index: 2;
      margin-top: 40px;
      font-size: 24px;
      .tip {
        margin-top: 6px;
        font-size: 18px;
        opacity: 0.75;
      }
    }
  }
  .loader-section {
    position: fixed;
    top: 0;
    width: 51%;
    height: 100%;
    background: #5f60ab;
    z-index: 1;
    &.section-left {
      left: 0;
    }
    &.section-right {
      right: 0;
    }
  }
  &.loaded {
    visibility: hidden;
    transform: translateY(-100%);
    transition:
      transform 0.3s 1s ease-out,
      visibility 0.3s 1s ease-out;
    .loader {
      .loader-circle,
      .loader-text {
        opacity: 0;
        transition: opacity 0.3s ease-out;
      }
    }
    .loader-section {
      &.section-left {
        transform: translateX(-100%);
        transition: transform 0.5s 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      }
      &.section-right {
        transform: translateX(100%);
        transition: transform 0.5s 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      }
    }
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes spin-reverse {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(-360deg);
  }
}
.custom-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.3;
  transform: scale(0.8);
  animation: opacityChange 3s linear infinite;
}

@keyframes opacityChange {
  0% {
    opacity: 0.1;
  }
  25% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
  75% {
    opacity: 0.5;
  }
  100% {
    opacity: 0.1;
  }
}
</style>
