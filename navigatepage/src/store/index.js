import { createPinia } from 'pinia';
import { useMainStore } from './main'; // 导入useMainStore

// 确保store只在客户端执行
const isClient = typeof window !== 'undefined';

// 创建Pinia实例
const pinia = createPinia();

// 给主组件使用的方式
export const getStore = () => {
  if (isClient) {
    return useMainStore(pinia);
  }
  return null;
};

// 为了兼容性导出mainStore
export const mainStore = useMainStore;

export default pinia;
