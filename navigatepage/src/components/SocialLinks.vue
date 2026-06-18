<style>
.social {
  position: relative;
  top: auto; /* 调整此值以向上移动 */
  transform: scale(0.75); /* 缩小整体尺寸 */
}
</style>
<template>
  <!-- 社交链接 -->
  <div class="social">
    <div class="link">
      <a
        v-for="item in socialLinks"
        :key="item.name"
        :href="item.url"
        target="_blank"
        @mouseenter="socialTip = item.tip"
        @mouseleave="socialTip = '通过这里联系我吧'"
      >
        <img class="icon" :src="item.icon" height="32" loading="lazy" decoding="async" />
      </a>
    </div>
    <span class="tip">{{ socialTip }}</span>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import socialLinks from '@/assets/socialLinks.json';

// 社交链接提示
const socialTip = ref('通过这里联系我吧');
</script>

<style lang="scss" scoped>
.social {
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 440px;
  width: 100%;
  height: 40px;
  background-color: transparent;
  border-radius: 6px;
  backdrop-filter: blur(0);
  animation: fade 0.5s cubic-bezier(.16, 1, .3, 1);
  transition:
    background-color 0.3s cubic-bezier(.16, 1, .3, 1),
    backdrop-filter 0.3s cubic-bezier(.16, 1, .3, 1);
  transform: scale(0.85);
  color: #ffffff;

  @media (max-width: 840px) {
    max-width: 100%;
    justify-content: center;
    .link {
      justify-content: space-evenly !important;
      width: 90%;
    }
    .tip {
      display: none !important;
    }
  }

  .link {
    display: flex;
    align-items: center;
    justify-content: center;
    a {
      display: inherit;
      color: #ffffff;
      .icon {
        margin: 0 10px;
        transition: transform 0.3s cubic-bezier(.16, 1, .3, 1), filter 0.3s cubic-bezier(.16, 1, .3, 1);
        filter: brightness(1.2);
        &:hover {
          transform: scale(1.15);
          filter: brightness(1.4);
        }
        &:active {
          transform: scale(1);
        }
      }
    }
  }
  .tip {
    display: none;
    margin-right: 12px;
    animation: fade 0.5s cubic-bezier(.16, 1, .3, 1);
    color: #ffffff;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  }
  @media (min-width: 768px) {
    &:hover {
      background-color: #00000040;
      backdrop-filter: blur(5px);
      .tip {
        display: block;
      }
    }
  }
}
</style>
