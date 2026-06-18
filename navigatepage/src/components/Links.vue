<style>
.links {
  position: relative;
  left: -15px; /* 向左整体移动 */
  margin-right: 15px; /* 右侧增加间距 */
}
</style>
<template>
  <div v-if="siteLinks[0]" class="links">
    <div class="line">
      <Icon size="20">
        <Link />
      </Icon>
      <span class="title">网站列表</span>
    </div>
    <!-- 网站列表 -->
    <Swiper
      v-if="siteLinks[0]"
      :modules="swiperModules"
      :slides-per-view="1"
      :space-between="40"
      :pagination="{
        el: '.swiper-pagination',
        clickable: true,
        bulletElement: 'div',
      }"
      :mousewheel="true"
      class="swiper-container"
    >
      <SwiperSlide v-for="site in siteLinksList" :key="site">
        <el-row class="link-all" :gutter="40">
          <el-col v-for="(item, index) in site" :span="8" :key="item">
            <div
              class="item cards"
              :style="index < 3 ? 'margin-bottom: 20px' : null"
              @click="jumpLink(item)"
            >
              <Icon size="26">
                <component :is="siteIcon[item.icon]" />
              </Icon>
              <span class="name text-hidden">{{ item.name }}</span>
            </div>
          </el-col>
        </el-row>
      </SwiperSlide>
      <div class="swiper-pagination" />
    </Swiper>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { Icon } from '@vicons/utils';
// 可前往 https://www.xicons.org 自行挑选并在此处引入
import { Link, Blog, CompactDisc, Cloud, Compass, Book, Fire, LaptopCode } from '@vicons/fa'; // 注意使用正确的类别
import { useMainStore } from '@/store/main';
import { Swiper, SwiperSlide } from 'swiper/vue';
// 导入Swiper模块（新的方式）
import { Pagination, Mousewheel } from 'swiper/modules';
import siteLinks from '@/assets/siteLinks.json';
// 导入Swiper样式
import 'swiper/css';
import 'swiper/css/pagination';
import { ElRow, ElCol } from 'element-plus';

const store = useMainStore();
const swiperModules = [Pagination, Mousewheel];

// 计算网站链接
const siteLinksList = computed(() => {
  const result = [];
  for (let i = 0; i < siteLinks.length; i += 6) {
    const subArr = siteLinks.slice(i, i + 6);
    result.push(subArr);
  }
  return result;
});

// 网站链接图标
const siteIcon = {
  Blog,
  Cloud,
  CompactDisc,
  Compass,
  Book,
  Fire,
  LaptopCode,
};

// 链接跳转
const jumpLink = (data) => {
  if (data.name === '音乐' && store.musicClick) {
    if (typeof $openList === 'function') $openList();
  } else {
    window.open(data.link, '_blank');
  }
};

onMounted(() => {
  // console.log(siteLinks);
});
</script>

<style lang="scss" scoped>
.links {
  position: relative;
  left: -15px;
  margin-right: 15px;

  .line {
    margin: 2rem 0.25rem 1rem;
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    animation: fade 0.5s cubic-bezier(.16, 1, .3, 1);
    color: #ffffff;
    margin-left: 3%;

    .title {
      margin-left: 8px;
      font-size: 1.15rem;
      text-shadow: 0 0 5px #00000050;
      color: #ffffff;
      transition: text-shadow 0.3s cubic-bezier(.16, 1, .3, 1);
    }
  }

  .swiper-container {
    position: relative;
    left: calc(-40px * 1.2); /* 向左移动1.2倍行距(gutter) */
  }

  .swiper {
    left: -10px;
    width: calc(100% + 20px);
    padding: 5px 10px 0;
    z-index: 0;
    transform: scale(0.9);

    .swiper-slide {
      height: 100%;
    }
    .swiper-pagination {
      position: static;
      margin-top: 4px;
      :deep(.swiper-pagination-bullet) {
        background-color: #fff;
        width: 18px;
        height: 4px;
        border-radius: 4px;
        transition: opacity 0.3s cubic-bezier(.16, 1, .3, 1), width 0.3s cubic-bezier(.16, 1, .3, 1);
        &:hover {
          opacity: 1;
          width: 22px;
        }
      }
    }
  }
  .link-all {
    height: 244px;
    padding: 0 30px; /* 保持左右内边距 */

    @media (max-width: 720px) {
      height: 330px; /* 增加移动端的高度以显示所有链接 */
    }

    .item {
      height: 111px;
      width: 95%;
      margin: 0 auto;
      display: flex;
      align-items: center;
      flex-direction: row;
      justify-content: center;
      padding: 0 10px;
      animation: fade 0.5s cubic-bezier(.16, 1, .3, 1);
      transform: scale(1);
      color: #ffffff;
      transition:
        transform 0.3s cubic-bezier(.16, 1, .3, 1),
        background-color 0.3s cubic-bezier(.16, 1, .3, 1),
        box-shadow 0.3s cubic-bezier(.16, 1, .3, 1);

      &:hover {
        transform: scale(1.08);
        background: rgb(0 0 0 / 40%);
        box-shadow: 0 0 20px rgba(255, 255, 255, 0.15);
      }

      &:active {
        transform: scale(0.95);
      }

      .name {
        font-size: 1.1rem;
        margin-left: 8px;
        color: #ffffff;
        transition: opacity 0.3s cubic-bezier(.16, 1, .3, 1);
      }
      @media (min-width: 720px) and (max-width: 820px) {
        .name {
          display: none;
        }
      }
      @media (max-width: 720px) {
        height: 95px; /* 移动端减小每个链接的高度以适应所有链接 */
      }
      @media (max-width: 460px) {
        flex-direction: column;
        .name {
          font-size: 1rem;
          margin-left: 0;
          margin-top: 8px;
        }
      }
    }
  }
}
</style>
