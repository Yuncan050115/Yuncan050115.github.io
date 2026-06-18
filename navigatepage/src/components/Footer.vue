<template>
  <footer id="footer" :class="store.footerBlur ? 'blur' : null">
    <Transition name="fade" mode="out-in">
      <div v-if="!shouldShowLyrics" class="power">
        <span>
          Copyright&nbsp;&copy;
          <span v-if="siteStartDate?.length >= 4" class="site-start">
            {{ siteStartDate.substring(0, 4) }}
            -
          </span>
          {{ fullYear }}
          <a :href="siteUrl">{{ siteAnthor }}</a>
        </span>
        <!-- 前往博客 -->
        <span class="blog-link">
          &nbsp;|&nbsp;
          <a href="https://blog.yuncan.xyz" target="_blank">前往博客</a>
        </span>
        <!-- 以下信息请不要修改哦 -->
        <span class="hidden">
          &amp;&nbsp;Refactor&nbsp;by
          <a :href="config.github" target="_blank">
            {{ config.author }}
          </a>
        </span>
        <!-- 站点备案 -->
        <a href="https://beian.miit.gov.cn" target="_blank"> &amp; 晋ICP备2024030642号-1 </a>
      </div>
      <div v-else class="lrc">
        <Transition name="fade" mode="out-in">
          <div class="lrc-all" :key="lyricsContent">
            <music-one theme="filled" size="18" fill="#efefef" />
            <span class="lrc-text text-hidden" v-html="lyricsContent" />
            <music-one theme="filled" size="18" fill="#efefef" />
          </div>
        </Transition>
      </div>
    </Transition>
  </footer>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { MusicOne } from '@icon-park/vue-next';
import { useMainStore } from '@/store/main';
import config from '@/../package.json';

const store = useMainStore();
const fullYear = new Date().getFullYear();

// 加载配置数据
const siteStartDate = ref(import.meta.env.VITE_SITE_START);
// 强制设置备案号
const siteIcp = ref('晋ICP备2024030642号-1');
const siteAnthor = ref(import.meta.env.VITE_SITE_ANTHOR);
const siteUrl = computed(() => {
  const url = import.meta.env.VITE_SITE_URL;
  if (!url) return 'https://www.yuncan.xyz';
  // 判断协议前缀
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return '//' + url;
  }
  return url;
});

// 计算属性简化判断逻辑
const shouldShowLyrics = computed(() => {
  // 只有在音乐正在播放且启用歌词显示时才显示歌词
  return store.playerState && store.playerLrcShow && store.playerLrc;
});

// 获取歌词内容
const lyricsContent = computed(() => {
  return store.playerLrc || '暂无歌词';
});

// 自动激活歌词显示
onMounted(() => {
  // 确保playerLrcShow为true
  if (!store.playerLrcShow) {
    store.playerLrcShow = true;
  }
});
</script>

<style lang="scss" scoped>
#footer {
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  height: 46px;
  line-height: 46px;
  text-align: center;
  z-index: 0;
  font-size: 14px;
  .power {
    animation: fade 0.3s;
  }
  .lrc {
    padding: 0 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    .lrc-all {
      width: 98%;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      .lrc-text {
        margin: 0 8px;
      }
      .i-icon {
        width: 18px;
        height: 18px;
        display: inherit;
      }
    }
  }
  &.blur {
    backdrop-filter: blur(10px);
    background: rgb(0 0 0 / 25%);
    font-size: 16px;
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s cubic-bezier(.16, 1, .3, 1);
  }
  @media (max-width: 720px) {
    font-size: 0.85rem;
    &.blur {
      font-size: 0.85rem;
    }
  }
  @media (max-width: 480px) {
    .hidden {
      display: none;
    }
  }
  .power,
  .lrc,
  span,
  a {
    font-family: 'JinghuaLaosong', sans-serif !important;
  }
}
</style>
