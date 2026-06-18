<template>
  <component :is="isMounted ? 'div' : 'template'">
    <slot v-if="isMounted" />
  </component>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const isMounted = ref(false);

onMounted(() => {
  isMounted.value = true;
});
</script>
