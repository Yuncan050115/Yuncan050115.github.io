<template>
  <!-- 自定义光标 -->
  <CustomCursor />
  <!-- 加载 -->
  <Loading />
  <!-- 壁纸 -->
  <Background @loadComplete="loadComplete" />
  <!-- 主界面 -->
  <Transition name="fade" mode="out-in">
    <main id="main" v-if="store.imgLoadStatus">
      <div class="container" v-show="!store.backgroundShow">
        <section class="all" v-show="!store.setOpenState">
          <MainLeft />
          <MainRight v-show="!store.boxOpenState" />
          <Box v-show="store.boxOpenState" />
        </section>
        <section class="more" v-show="store.setOpenState" @click="store.setOpenState = false">
          <MoreSet />
        </section>
      </div>
      <!-- 移动端菜单按钮 -->
      <Icon
        class="menu"
        size="24"
        v-show="!store.backgroundShow"
        @click="store.mobileOpenState = !store.mobileOpenState"
      >
        <component :is="store.mobileOpenState ? CloseSmall : HamburgerButton" />
      </Icon>
      <!-- 页脚 -->
      <Transition name="fade" mode="out-in">
        <Footer v-show="!store.backgroundShow && !store.setOpenState" />
      </Transition>
    </main>
  </Transition>
</template>
<script setup>
import { nextTick, onMounted, onBeforeUnmount, watch } from 'vue';
import { helloInit, checkDays } from '@/utils/getTime.js';
import { HamburgerButton, CloseSmall } from '@icon-park/vue-next';
import { useMainStore } from '@/store/main';
import { Icon } from '@vicons/utils';
import { ElMessage } from 'element-plus';
import Loading from '@/components/Loading.vue';
import MainLeft from '@/views/Main/Left.vue';
import MainRight from '@/views/Main/Right.vue';
import Background from '@/components/Background.vue';
import Footer from '@/components/Footer.vue';
import Box from '@/views/Box/index.vue';
import MoreSet from '@/views/MoreSet/index.vue';
import CustomCursor from '@/components/CustomCursor.vue';
import config from '@/../package.json';

const store = useMainStore();

// 页面宽度
const getWidth = () => {
  store.setInnerWidth(window.innerWidth);
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

// 监听宽度变化
watch(
  () => store.innerWidth,
  (value) => {
    if (value < 990) {
      store.boxOpenState = false;
    }
  }
);

onMounted(() => {
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
    if (event.button == 1) {
      store.backgroundShow = !store.backgroundShow;
      ElMessage({
        message: `已${store.backgroundShow ? '开启' : '退出'}壁纸展示状态`,
        grouping: true,
      });
    }
  });

  // 监听当前页面宽度
  getWidth();
  window.addEventListener('resize', getWidth);

  // 控制台输出
  const styleTitle1 = 'font-size: 20px;font-weight: 600;color: rgb(50,185,168);';
  const styleTitle2 = 'font-size:12px;color: rgb(85,119,255);';
  const styleContent = 'color: rgb(240,111,95);';
  const title1 = '云灿个人主页';
  const title2 = `Yuncan v${config.version}`;
  const content = `\n\n主页: ${config.home}\nGithub: ${config.github}`;
  console.info(`%c${title1} %c${title2} %c${content}`, styleTitle1, styleTitle2, styleContent);

  // 音乐播放器就绪后，等待用户交互再播放（遵循浏览器自动播放策略）
  // 不再使用模拟键盘事件的 hack
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', getWidth);
});
</script>

<style lang="scss" scoped>
#main {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: scale(1.2);
  transition: transform 0.3s cubic-bezier(.16, 1, .3, 1);
  animation: fade-blur-main-in 0.65s cubic-bezier(.16, 1, .3, 1) forwards;
  animation-delay: 0.5s;
  .container {
    width: 100%;
    height: 100vh;
    margin: 0 auto;
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
      animation: fade 0.5s cubic-bezier(.16, 1, .3, 1);
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
    animation: fade 0.5s cubic-bezier(.16, 1, .3, 1);
    &:hover {
      transform: scale(1.05);
      background: rgb(0 0 0 / 30%);
    }
    &:active {
      transform: scale(0.95);
    }
    .i-icon {
      transform: translateY(2px);
    }
    @media (min-width: 721px) {
      display: none;
    }
  }
}
</style>
