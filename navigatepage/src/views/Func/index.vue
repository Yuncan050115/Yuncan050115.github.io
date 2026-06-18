<style>
.function {
  position: relative;
  //top: -40px; /* 调整此值以向上移动 */
  //left: 150px;
  //transform: scale(1.1); /* 调整此值以放大 */
}

/* 确保正确应用时间字体 */
.time .text,
.time .date span {
  font-family: 'UnidreamLED', monospace !important;
}
</style>
<template>
  <!-- 功能区域 -->
  <div :class="store.mobileFuncState ? 'function mobile' : 'function'">
    <el-row :gutter="20">
      <el-col :span="12">
        <div class="left">
          <Hitokoto />
          <Music />
        </div>
      </el-col>
      <el-col :span="12">
        <div class="right cards">
          <div class="time">
            <div class="date">
              <span>{{ currentTime.year }}&nbsp;年&nbsp;</span>
              <span>{{ currentTime.month }}&nbsp;月&nbsp;</span>
              <span>{{ currentTime.day }}&nbsp;日&nbsp;</span>
              <span class="sm-hidden">{{ currentTime.weekday }}</span>
            </div>
            <div class="text">
              <span> {{ currentTime.hour }}:{{ currentTime.minute }}:{{ currentTime.second }}</span>
            </div>
          </div>
          <Weather />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { getCurrentTime } from '@/utils/getTime';
import { useMainStore } from '@/store/main';
import Music from '@/components/Music.vue';
import Hitokoto from '@/components/Hitokoto.vue';
import Weather from '@/components/Weather.vue';
import { ElRow, ElCol } from 'element-plus';

const store = useMainStore();

// 当前时间
const currentTime = ref({});
const timeInterval = ref(null);

// 播放器 id
const playerHasId = true; // 硬编码为true，确保始终有效

// 更新时间
const updateTimeData = () => {
  currentTime.value = getCurrentTime();
};

onMounted(() => {
  updateTimeData();
  timeInterval.value = setInterval(updateTimeData, 1000);
});

onBeforeUnmount(() => {
  clearInterval(timeInterval.value);
});
</script>

<style lang="scss" scoped>
.function {
  height: 165px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  &.mobile {
    .el-row {
      .el-col {
        &:nth-of-type(1) {
          display: contents;
        }
        &:nth-of-type(2) {
          display: none;
        }
      }
    }
  }
  .el-row {
    height: 100%;
    width: 100%;
    margin: 0 !important;
    .el-col {
      &:nth-of-type(1) {
        padding-left: 0 !important;
      }
      &:nth-of-type(2) {
        padding-right: 0 !important;
      }
      @media (max-width: 910px) {
        &:nth-of-type(1) {
          display: none;
        }
        &:nth-of-type(2) {
          padding: 0 !important;
          flex: none;
          max-width: none;
          width: 100%;
        }
      }
    }
    .left,
    .right {
      width: 100%;
      height: 100%;
    }
    .right {
      padding: 15px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      animation: fade 0.5s;
      color: #ffffff;
      transform: scale(0.95);
      transition:
        transform 0.3s cubic-bezier(.16, 1, .3, 1),
        background-color 0.3s cubic-bezier(.16, 1, .3, 1),
        box-shadow 0.3s cubic-bezier(.16, 1, .3, 1);
      height: 140px;
      max-width: 95%;
      margin: 0 auto;

      &:hover {
        transform: scale(0.98);
        background-color: rgba(0, 0, 0, 0.4);
        box-shadow: 0 0 25px rgba(255, 255, 255, 0.1);
      }

      &:active {
        transform: scale(0.95);
      }

      .time {
        font-size: 1rem;
        text-align: center;
        color: #ffffff;
        .date {
          text-overflow: ellipsis;
          overflow-x: hidden;
          white-space: nowrap;
          color: #ffffff;
          span {
            color: #ffffff;
            font-family: 'UnidreamLED' !important;
          }
        }
        .text {
          margin-top: 15px;
          font-size: 3.5rem;
          letter-spacing: 2px;
          font-family: 'UnidreamLED' !important;
          color: #ffffff;
          span {
            font-family: 'UnidreamLED' !important;
            color: #ffffff;
          }
        }
      }
      .weather {
        text-align: center;
        width: 100%;
        text-overflow: ellipsis;
        overflow-x: hidden;
        white-space: nowrap;
        color: #ffffff;
      }
    }
  }
}
</style>
