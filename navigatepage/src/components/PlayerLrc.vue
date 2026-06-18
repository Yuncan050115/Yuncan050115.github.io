<template>
  <div class="player-lrc">
    <div class="lrc-content" v-html="lrcContent"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useSecureStore } from '@/hooks/useSecureStore';

const { store } = useSecureStore();

// 获取歌词内容
const lrcContent = computed(() => store.value?.getPlayerLrc?.() || '');
</script>

<style lang="scss" scoped>
.player-lrc {
  padding: 8px 12px;
  border-radius: 6px;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);

  .lrc-content {
    font-size: 14px;
    color: #ffffff;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
