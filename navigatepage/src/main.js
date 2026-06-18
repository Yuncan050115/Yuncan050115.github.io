// Astro Vue集成主文件
import { createApp, markRaw } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import '@/styles/style.scss';

// 创建全局可访问的Pinia实例
const pinia = createPinia();

// 增强Pinia的router功能
pinia.use(({ store }) => {
  store.$onAction(() => {
    // 可以在此添加全局动作处理
  });
});

// 添加持久化插件
if (typeof window !== 'undefined') {
  pinia.use(piniaPluginPersistedstate);
}

// 将pinia设置为全局可访问
if (typeof window !== 'undefined') {
  window.__pinia = pinia;
}

// 创建用于在Astro页面中使用的Vue插件
export const createVueApp = (component) => {
  const app = createApp(component);

  // 首先安装Pinia
  app.use(pinia);

  // 使用其他插件
  app.use(ElementPlus);

  return app;
};

// 暴露pinia实例供外部直接使用
export { pinia };
