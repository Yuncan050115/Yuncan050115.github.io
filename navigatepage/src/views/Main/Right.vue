<style>
@keyframes colorAnimation {
  0% {
    color: rgba(2, 250, 210, 0.9);
  }
  25% {
    color: #3dfad9;
  }
  50% {
    color: rgba(109, 250, 224, 0.8);
  }
  75% {
    color: rgba(154, 250, 228, 0.9);
  }
  100% {
    color: #b2faea;
  }
}

/* 在非背景展示模式下才应用动画 */
body:not([data-bg-shown='true']) .bg {
  animation: colorAnimation 2s infinite;
}
body:not([data-bg-shown='true']) .sm {
  animation: colorAnimation 1.9s infinite alternate;
}
</style>
<template>
  <div :class="store.mobileOpenState ? 'right' : 'right hidden'">
    <!-- 移动端 Logo -->
    <div class="logo text-hidden" @click="store.mobileFuncState = !store.mobileFuncState">
      <span class="bg">{{ siteUrl[0] }}</span>
      <span class="sm">.{{ siteUrl[1] }}</span>
      <span class="sm" style="font-size: 1rem"><br />⚡Open Music⚡</span>
    </div>
    <!-- 功能区 -->
    <Func />
    <!-- 网站链接 -->
    <Link />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useMainStore } from '@/store/main';
import Func from '@/views/Func/index.vue';
import Link from '@/components/Links.vue';
const store = useMainStore();

// 站点链接
const siteUrl = computed(() => {
  const url = import.meta.env.VITE_SITE_URL || 'yuncan.xyz';
  if (!url) return 'yuncan.xyz'.split('.');
  // 判断协议前缀
  if (url.startsWith('http://') || url.startsWith('https://')) {
    const urlFormat = url.replace(/^(https?:\/\/)/, '');
    return urlFormat.split('.');
  }
  return url.split('.');
});
</script>

<style lang="scss" scoped>
.right {
  // flex: 1 0 0%;
  width: 50%;
  margin-left: 0.75rem;
  .logo {
    width: 100%;
    font-family: 'LongCang-Regular';
    font-size: 1.65rem;
    position: fixed;
    top: calc(6% - 5px);
    left: 0;
    text-align: center;
    transition: transform 0.3s cubic-bezier(.16, 1, .3, 1);
    animation: fade 0.5s;
    color: #ffffff;
    transform: scale(0.9);

    .bg,
    .sm {
      font-family: 'LongCang-Regular';
      color: #ffffff;
    }

    &:active {
      transform: scale(0.3);
    }
    @media (min-width: 720px) {
      display: none;
    }
  }
  @media (max-width: 720px) {
    margin-left: 0;
    width: 100%;
    &.hidden {
      display: none;
    }
  }
}
</style>
