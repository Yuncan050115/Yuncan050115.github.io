<template>
  <ClientOnly>
    <div v-if="mounted" class="app-container">
      <!-- 自定义光标 -->
      <CustomCursor />
      <!-- 加载 -->
      <Loading />
      <!-- 等到store加载后再显示其他部分 -->
      <template v-if="isStoreReady">
        <!-- 壁纸 -->
        <Background @loadComplete="loadComplete" />
        <!-- 主界面 -->
        <Transition name="fade" mode="out-in">
          <main id="main" v-if="isImgLoaded">
            <div class="container" :class="{ 'background-visible': isBackgroundShown }">
              <section class="all" v-show="!isSetOpen">
                <MainLeft />
                <MainRight v-show="!isBoxOpen" />
                <Box v-show="isBoxOpen" />
              </section>
              <section class="more" v-show="isSetOpen" @click="toggleSetOpen(false)">
                <MoreSet />
              </section>
            </div>
            <!-- 移动端菜单按钮 -->
            <div
              class="menu"
              :class="{ 'background-visible': isBackgroundShown }"
              @click="toggleMobileOpen"
            >
              <span v-if="!isMobileOpen" class="i-icon i-icon-hamburger-button">
                <svg width="1em" height="1em" viewBox="0 0 48 48" fill="none">
                  <path
                    d="M7.94971 11.9497H39.9497"
                    stroke="currentColor"
                    stroke-width="4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                  <path
                    d="M7.94971 23.9497H39.9497"
                    stroke="currentColor"
                    stroke-width="4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                  <path
                    d="M7.94971 35.9497H39.9497"
                    stroke="currentColor"
                    stroke-width="4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                </svg>
              </span>
              <component v-else :is="'i-ep-close'" />
            </div>
            <!-- 页脚 -->
            <Transition name="fade" mode="out-in">
              <Footer
                v-show="!isSetOpen && !isBackgroundShown"
                icp="备案信息"
                icpUrl="https://beian.miit.gov.cn/"
                :githubUrl="config.github"
                :start="config.start"
              />
            </Transition>
          </main>
        </Transition>
      </template>
    </div>
  </ClientOnly>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick, onUnmounted } from 'vue';
import { helloInit, checkDays } from '@/utils/getTime';
import { useSecureStore } from '@/utils/useSecureStore';
import Loading from '@/components/Loading.vue';
import MainLeft from '@/views/Main/Left.vue';
import MainRight from '@/views/Main/Right.vue';
import Background from '@/components/Background.vue';
import Footer from '@/components/Footer.vue';
import Box from '@/views/Box/index.vue';
import MoreSet from '@/views/MoreSet/index.vue';
import CustomCursor from '@/components/CustomCursor.vue';
import config from '../../package.json';
import { ElMessage } from 'element-plus';
import ClientOnly from '@/components/ClientOnly.vue';

// 组件内部状态
const mounted = ref(false);
const { store, isReady: isStoreReady } = useSecureStore();

// 计算属性来简化访问
const isImgLoaded = computed(() => store.value?.imgLoadStatus || false);
const isBackgroundShown = computed(() => store.value?.backgroundShow || false);
const isBoxOpen = computed(() => store.value?.boxOpenState || false);
const isSetOpen = computed(() => store.value?.setOpenState || false);
const isMobileOpen = computed(() => store.value?.mobileOpenState || false);

// 监听背景显示状态，添加到body属性
watch(
  isBackgroundShown,
  (value) => {
    if (typeof document !== 'undefined') {
      document.body.setAttribute('data-bg-shown', value ? 'true' : 'false');
    }
  },
  { immediate: true }
);

// 切换设置面板
const toggleSetOpen = (value) => {
  if (store.value) {
    store.value.setOpenState = value;
  }
};

// 切换移动菜单
const toggleMobileOpen = () => {
  if (store.value) {
    store.value.mobileOpenState = !store.value.mobileOpenState;
  }
};

// 页面宽度
const getWidth = () => {
  if (typeof window !== 'undefined' && store.value) {
    store.value.setInnerWidth(window.innerWidth);
  }
};

// 加载完成事件
const loadComplete = () => {
  nextTick(() => {
    // 欢迎提示
    helloInit();
    // 默哀模式
    checkDays();
  });
};

// 初始化应用功能
onMounted(() => {
  mounted.value = true;

  // 等待store初始化
  watch(
    isStoreReady,
    (ready) => {
      if (ready && store.value) {
        // 初始化功能
        initFeatures();

        // 监听窗口宽度
        watch(
          () => store.value.innerWidth,
          (value) => {
            if (value < 990) {
              store.value.boxOpenState = false;
            }
          }
        );

        // 初始设置body的背景状态属性
        if (typeof document !== 'undefined') {
          document.body.setAttribute(
            'data-bg-shown',
            store.value.backgroundShow ? 'true' : 'false'
          );
        }
      }
    },
    { immediate: true }
  );
});

// 初始化功能
const initFeatures = () => {
  if (typeof window === 'undefined' || !store.value) return;

  // 强制初始化音乐API和设置
  store.value.musicIsOk = true;

  // 确保sessionStorage中有API地址
  if (typeof sessionStorage !== 'undefined') {
    sessionStorage.setItem('backup-song-api', 'https://music.yuncan.xyz/api');
  }

  // 屏蔽右键
  document.oncontextmenu = () => {
    ElMessage({
      message: '富强民主文明和谐自由平等公正法治爱国敬业诚信友善',
      grouping: true,
      duration: 2000,
    });
    return false;
  };

  // 鼠标中键事件
  window.addEventListener('mousedown', (event) => {
    if (event.button == 1 && store.value) {
      store.value.backgroundShow = !store.value.backgroundShow;
      // 更新body属性
      document.body.setAttribute('data-bg-shown', store.value.backgroundShow ? 'true' : 'false');
      ElMessage({
        message: `已${store.value.backgroundShow ? '开启' : '退出'}壁纸展示状态`,
        grouping: true,
      });
    }
  });

  // 监听当前页面宽度
  getWidth();
  window.addEventListener('resize', getWidth);

  // 简洁的控制台输出
  const styleTitle = 'font-size: 18px;font-weight: 600;color: rgb(244,167,89);';
  const styleVersion = 'color: rgb(30,152,255);';
  console.info(`%c云灿个人站 v${config.version}`, styleTitle, styleVersion);
};

// 组件卸载时清理
onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', getWidth);
  }
});
</script>

<style lang="scss" scoped>
.app-container {
  width: 100%;
  height: 100%;
}

#main {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: scale(1.2);
  transition: transform 0.3s cubic-bezier(.16, 1, .3, 1);
  animation: fade-blur-main-in 0.65s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  animation-delay: 0.5s;
  .container {
    width: 100%;
    height: 100vh;
    margin: 0 auto;
    &.background-visible {
      color: #ffffff;
      z-index: 2;
      position: relative;

      // 在背景显示模式下增强卡片可见性
      :deep(.cards),
      :deep(.el-card) {
        background-color: rgba(255, 255, 255, 0.15) !important;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(255, 255, 255, 0.2) !important;
      }

      // 确保所有文字在背景模式下都是白色
      :deep(*) {
        color: #ffffff !important;
      }

      // 确保卡片内的元素可见
      :deep(.item),
      :deep(.text) {
        color: #ffffff !important;
        text-shadow: 0 0 3px rgba(0, 0, 0, 0.5);
      }

      // 按钮和交互元素增强可见性
      :deep(button),
      :deep(.el-button) {
        background-color: rgba(255, 255, 255, 0.2) !important;
        border-color: rgba(255, 255, 255, 0.3) !important;
        color: #ffffff !important;
        &:hover {
          background-color: rgba(255, 255, 255, 0.3) !important;
        }
      }
    }
    .all {
      width: 100%;
      height: 100%;
      padding: 0 0.75rem;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
    }
    .more {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: #00000080;
      backdrop-filter: blur(20px);
      z-index: 2;
      animation: fade 0.5s;
    }
    @media (max-width: 1200px) {
      padding: 0 2vw;
    }
  }
  .menu {
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 84%;
    left: calc(50% - 28px);
    width: 56px;
    height: 34px;
    background: rgb(0 0 0 / 20%);
    backdrop-filter: blur(10px);
    border-radius: 6px;
    transition: transform 0.3s cubic-bezier(.16, 1, .3, 1), background-color 0.3s cubic-bezier(.16, 1, .3, 1);
    animation: fade 0.5s;
    color: #ffffff;
    &.background-visible {
      color: #ffffff;
      background: rgb(255 255 255 / 30%); // 增强对比度
      z-index: 2;
    }
    &:active {
      transform: scale(0.95);
    }
    @media (min-width: 721px) {
      display: none;
    }
  }
}
</style>
