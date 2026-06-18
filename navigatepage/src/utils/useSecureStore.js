import { ref, onMounted, getCurrentInstance } from 'vue';
import { useMainStore } from '@/store/main';
import { pinia } from '@/main';

/**
 * 安全获取store的辅助函数
 * 用于组件中安全地获取并使用Pinia存储
 */
export function useSecureStore() {
  const store = ref(null);
  const isReady = ref(false);
  const isClient = typeof window !== 'undefined';
  const internalInstance = getCurrentInstance();

  onMounted(() => {
    if (isClient) {
      try {
        // 尝试多种方式获取Pinia
        if (window.__pinia) {
          // 使用全局Pinia
          store.value = useMainStore(window.__pinia);
          isReady.value = true;
        } else if (pinia) {
          // 使用导入的Pinia
          store.value = useMainStore(pinia);
          isReady.value = true;
        } else if (internalInstance) {
          // 使用组件实例
          const piniaInstance = internalInstance.appContext.app.config.globalProperties.$pinia;
          if (piniaInstance) {
            store.value = useMainStore(piniaInstance);
            isReady.value = true;
          } else {
            // 最后的尝试，无参数调用
            store.value = useMainStore();
            isReady.value = true;
          }
        } else {
          console.error('找不到有效的Pinia实例');
        }
      } catch (err) {
        console.error('初始化Store失败:', err);
      }
    }
  });

  return {
    store,
    isReady,
    isClient,
  };
}
