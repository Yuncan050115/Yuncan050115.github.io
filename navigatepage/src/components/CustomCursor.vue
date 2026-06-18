<template>
  <div class="cursor-dot" :style="cursorStyle" :class="{ clicking: isClicking }"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';

// 状态
const cursorPosition = ref({ x: 0, y: 0 });
const isClicking = ref(false);

// 光标样式计算属性
const cursorStyle = computed(() => {
  return {
    left: `${cursorPosition.value.x}px`,
    top: `${cursorPosition.value.y}px`,
  };
});

// 鼠标移动事件处理
const handleMouseMove = (e) => {
  cursorPosition.value.x = e.clientX;
  cursorPosition.value.y = e.clientY;
};

// 鼠标按下事件处理
const handleMouseDown = () => {
  isClicking.value = true;
};

// 鼠标释放事件处理
const handleMouseUp = () => {
  isClicking.value = false;
};

// 组件挂载
onMounted(() => {
  // 启用自定义光标
  document.documentElement.classList.add('custom-cursor');

  // 添加事件监听
  window.addEventListener('mousemove', handleMouseMove, { passive: true });
  window.addEventListener('mousedown', handleMouseDown);
  window.addEventListener('mouseup', handleMouseUp);
});

// 组件卸载
onBeforeUnmount(() => {
  // 禁用自定义光标
  document.documentElement.classList.remove('custom-cursor');

  // 移除事件监听
  window.removeEventListener('mousemove', handleMouseMove);
  window.removeEventListener('mousedown', handleMouseDown);
  window.removeEventListener('mouseup', handleMouseUp);
});
</script>

<!-- 此组件不需要局部样式，使用global.scss中的全局样式 -->
