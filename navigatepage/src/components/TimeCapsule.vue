<template>
  <div class="time-capsule">
    <div class="title">
      <hourglass-full theme="two-tone" size="24" :fill="['#efefef', '#00000020']" />
      <span>时光胶囊</span>
    </div>
    <span class="text">今日已经度过&nbsp;{{ timeData.day.elapsed }}&nbsp;小时</span>
    <el-progress
      :text-inside="true"
      :stroke-width="20"
      :percentage="timeData.day.pass"
      class="capsule-progress"
    />
    <span class="text">本周已经度过&nbsp;{{ timeData.week.elapsed }}&nbsp;天</span>
    <el-progress
      :text-inside="true"
      :stroke-width="20"
      :percentage="timeData.week.pass"
      class="capsule-progress"
    />
    <span class="text">本月已经度过&nbsp;{{ timeData.month.elapsed }}&nbsp;天</span>
    <el-progress
      :text-inside="true"
      :stroke-width="20"
      :percentage="timeData.month.pass"
      class="capsule-progress"
    />
    <span class="text">今年已经度过&nbsp;{{ timeData.year.elapsed }}&nbsp;个月</span>
    <el-progress
      :text-inside="true"
      :stroke-width="20"
      :percentage="timeData.year.pass"
      class="capsule-progress"
    />
    <div v-if="startDate?.length >= 4 && store.siteStartShow">
      <span class="text" v-html="startDateText" />
      <el-progress
        :show-text="false"
        :indeterminate="true"
        :stroke-width="6"
        :percentage="80"
        :duration="2"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { HourglassFull } from '@icon-park/vue-next';
import { getTimeCapsule, siteDateStatistics } from '@/utils/getTime.js';
import { useMainStore } from '@/store/main';
import { ElProgress } from 'element-plus';

const store = useMainStore();

// 进度条数据
const timeData = ref(getTimeCapsule());
const startDate = ref(import.meta.env.VITE_SITE_START);
const startDateText = ref(null);
const timeInterval = ref(null);

onMounted(() => {
  timeInterval.value = setInterval(() => {
    timeData.value = getTimeCapsule();
    if (startDate.value) startDateText.value = siteDateStatistics(new Date(startDate.value));
  }, 1000);
});

onBeforeUnmount(() => {
  clearInterval(timeInterval.value);
});
</script>

<style lang="scss">
.time-capsule {
  width: 100%;
  font-family: 'JinghuaLaosong', sans-serif !important;

  .title {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 0.2rem 0 1.5rem;
    font-size: 1.1rem;
    font-family: 'JinghuaLaosong', sans-serif !important;

    .i-icon {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 6px;
    }

    span {
      font-family: 'JinghuaLaosong', sans-serif !important;
    }
  }

  .text {
    display: block;
    margin: 1rem 0rem 0.5rem 0rem;
    font-size: 0.95rem;
    font-family: 'JinghuaLaosong', sans-serif !important;
  }

  .capsule-progress {
    .el-progress-bar {
      .el-progress-bar__outer {
        border-radius: 6px;
        background-color: #00000020;
        .el-progress-bar__inner {
          background-color: #efefef;
          border-radius: 6px;
          text-align: center;
          font-family: 'JinghuaLaosong', sans-serif !important;
          span {
            color: #564d59;
            font-size: 0.9rem;
            font-family: 'JinghuaLaosong', sans-serif !important;
          }
        }
      }
    }
  }
}
</style>
