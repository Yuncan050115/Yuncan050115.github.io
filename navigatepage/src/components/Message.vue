<style>
.message {
  position: relative;
  top: auto; /* 调整此值以向上移动 */

  transform: scale(1); /* 调整此值以放大 */
}
p {
  font-size: 1.3em; /* 调整此值以放大字体大小 */
}

/* 强制使用相同字体 */
.logo .name .bg,
.logo .name .sm {
  font-family: 'Pacifico-Regular' !important;
}
</style>
<template>
  <!-- 基本信息 -->

  <div class="message">
    <!-- Logo -->
    <div class="logo">
      <img class="logo-img" :src="siteLogo" alt="logo" decoding="async" />
      <div :class="{ name: true, 'text-hidden': true, long: siteUrl[0].length >= 6 }">
        <span class="bg">{{ siteUrl[0] }}</span>
        <span class="sm">.{{ siteUrl[1] }}</span>
      </div>
    </div>
    <!-- 简介 -->
    <div class="description cards" @click="changeBox">
      <div class="content">
        <Icon size="16">
          <QuoteLeft />
        </Icon>
        <div class="text">
          <p>{{ descriptionText.hello }}</p>
          <p>{{ descriptionText.text }}</p>
          <p>{{ descriptionText.author }}</p>
        </div>
        <Icon size="16">
          <QuoteRight />
        </Icon>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, watch, h, onMounted } from 'vue';
import { Icon } from '@vicons/utils';
import { QuoteLeft, QuoteRight } from '@vicons/fa';
import { Error } from '@icon-park/vue-next';
import { useMainStore } from '@/store/main';
import { ElMessage } from 'element-plus';
const store = useMainStore();

// 主页站点logo
const siteLogo = computed(() => import.meta.env.VITE_SITE_MAIN_LOGO || '/images/icon/logo.png');

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

// 简介区域文字
const descriptionText = reactive({
  hello: import.meta.env.VITE_DESC_HELLO || 'Scarameow(*￣︶￣)—',
  text: import.meta.env.VITE_DESC_TEXT || '若有展翼从此去，当筵意气凌九霄。',
  author: import.meta.env.VITE_DESC_AUTHOR || '—— 《七律·再抒志》 - 云灿 - 壬寅年秋',
});

// 显示环境变量信息到控制台，帮助调试
onMounted(() => {
  // console.log('');
});

// 切换右侧功能区
const changeBox = () => {
  if (store.innerWidth >= 990) {
    store.boxOpenState = !store.boxOpenState;
  } else {
    ElMessage({
      message: '当前页面宽度不足以开启盒子',
      grouping: true,
      icon: h(Error, {
        theme: 'filled',
        fill: '#efefef',
      }),
    });
  }
};

// 监听状态变化
watch(
  () => store.boxOpenState,
  (value) => {
    if (value) {
      descriptionText.hello = import.meta.env.VITE_DESC_HELLO_OTHER || 'Oops !';
      descriptionText.text =
        import.meta.env.VITE_DESC_TEXT_OTHER || '哎呀，这都被你发现了（ 再点击可关闭 ）';
    } else {
      descriptionText.hello = import.meta.env.VITE_DESC_HELLO || 'Scarameow(*￣︶￣)—';
      descriptionText.text = import.meta.env.VITE_DESC_TEXT || '若有展翼从此去，当筵意气凌九霄。';
    }
  }
);
</script>

<style lang="scss" scoped>
.message {
  .logo {
    display: flex;
    flex-direction: row;
    align-items: center;
    animation: fade 0.5s cubic-bezier(.16, 1, .3, 1);
    max-width: 440px;
    .logo-img {
      border-radius: 50%;
      width: 120px;
      transition: transform 0.3s cubic-bezier(.16, 1, .3, 1);
      &:hover {
        transform: scale(1.05);
      }
    }
    .name {
      width: calc(440px - 120px);
      padding-left: 22px;
      transform: translateY(-8px) scale(0.9);
      font-family: 'Pacifico-Regular' !important; /* 改为与Scarameow相同的字体 */
      color: #ffffff; /* 确保在所有状态下显示为白色 */

      .bg {
        font-size: 4.5rem;
        color: #ffffff; /* 确保在所有状态下显示为白色 */
        font-family: 'Pacifico-Regular' !important; /* 改为与Scarameow相同的字体 */
        transition: text-shadow 0.3s cubic-bezier(.16, 1, .3, 1);
        &:hover {
          text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
        }
      }

      .sm {
        margin-left: 6px;
        font-size: 1.8rem;
        color: #ffffff; /* 确保在所有状态下显示为白色 */
        font-family: 'Pacifico-Regular' !important; /* 改为与Scarameow相同的字体 */
        transition: text-shadow 0.3s cubic-bezier(.16, 1, .3, 1);
        &:hover {
          text-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
        }
        @media (min-width: 720px) and (max-width: 789px) {
          display: none;
        }
      }
    }
    @media (max-width: 768px) {
      .logo-img {
        width: 100px;
      }
      .name {
        height: 60px;
        .bg {
          font-size: 4rem;
        }
      }
    }

    @media (max-width: 720px) {
      max-width: 100%;
    }
  }

  .description {
    padding: 1rem;
    margin-top: 3.5rem;
    max-width: 440px;
    animation: fade 0.5s cubic-bezier(.16, 1, .3, 1);
    background-color: rgba(0, 0, 0, 0.4); /* 深色背景确保白色文字可见 */
    transform: scale(0.95);
    transition:
      transform 0.3s cubic-bezier(.16, 1, .3, 1),
      background-color 0.3s cubic-bezier(.16, 1, .3, 1),
      box-shadow 0.3s cubic-bezier(.16, 1, .3, 1);
    height: 140px;

    &:hover {
      transform: scale(1);
      background-color: rgba(0, 0, 0, 0.5);
      box-shadow: 0 0 25px rgba(255, 255, 255, 0.1);
    }

    &:active {
      transform: scale(0.95);
    }

    .content {
      display: flex;
      justify-content: space-between;
      height: 100%;

      .text {
        line-height: 2.6rem;
        margin: auto auto auto auto;
        color: #ffffff; /* 确保文字颜色为白色 */

        p {
          color: #ffffff !important; /* 强制文字为白色 */
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5); /* 添加文字阴影提高可读性 */
          transition: text-shadow 0.3s cubic-bezier(.16, 1, .3, 1);

          &:nth-of-type(1) {
            font-family: 'Pacifico-Regular'; /* 确保Scarameow使用正确的字体 */
            font-size: auto;
          }
          &:nth-of-type(2) {
            font-family: 'LongCang-Regular';
            font-size: auto;
          }
          &:nth-of-type(3) {
            font-family: 'SimSun';
            font-size: 0.9rem;
          }
        }
      }

      .xicon:nth-of-type(2) {
        align-self: flex-end;
      }

      .xicon {
        color: #ffffff; /* 确保图标颜色为白色 */
        transition: transform 0.3s cubic-bezier(.16, 1, .3, 1);
      }
    }
    @media (max-width: 720px) {
      max-width: 100%;
      pointer-events: none;
    }
  }
  @media (max-width: 390px) {
    .logo {
      flex-direction: column;
      .logo-img {
        display: none;
      }
      .name {
        margin-left: 0;
        height: auto;
        transform: none;
        text-align: center;
        .bg {
          font-size: 3.5rem;
        }
        .sm {
          font-size: 1.4rem;
        }
      }
    }
    .description {
      margin-top: 2.5rem;
    }
  }
}
</style>
