<template>
  <div class="setting">
    <el-collapse class="collapse" v-model="activeName" accordion>
      <el-collapse-item title="个性壁纸" name="1">
        <div class="bg-set">
          <el-radio-group v-model="wallpaperType" text-color="#ffffff" @change="radioChange">
            <el-radio :value="0" size="large" border>默认壁纸</el-radio>
            <el-radio :value="1" size="large" border>每日一图</el-radio>
            <el-radio :value="2" size="large" border>随机风景</el-radio>
            <el-radio :value="3" size="large" border>随机动漫</el-radio>
          </el-radio-group>
        </div>
      </el-collapse-item>
      <el-collapse-item title="个性化调整" name="2">
        <div class="item">
          <span class="text">建站日期显示</span>
          <el-switch
            v-model="siteStartShow"
            inline-prompt
            :active-icon="CheckSmall"
            :inactive-icon="CloseSmall"
          />
        </div>
        <div class="item">
          <span class="text">音乐点击是否打开面板</span>
          <el-switch
            v-model="musicClick"
            inline-prompt
            :active-icon="CheckSmall"
            :inactive-icon="CloseSmall"
          />
        </div>
        <div class="item">
          <span class="text">底栏歌词显示</span>
          <el-switch
            v-model="playerLrcShow"
            inline-prompt
            :active-icon="CheckSmall"
            :inactive-icon="CloseSmall"
          />
        </div>
        <div class="item">
          <span class="text">底栏背景模糊</span>
          <el-switch
            v-model="footerBlur"
            inline-prompt
            :active-icon="CheckSmall"
            :inactive-icon="CloseSmall"
          />
        </div>
      </el-collapse-item>
      <el-collapse-item title="播放器配置" name="3">
        <div>微信：Yuncan6683催更</div>
      </el-collapse-item>
      <el-collapse-item title="其他设置" name="4">
        <div>微信：Yuncan6683催更</div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup>
import { ref, h, computed } from 'vue';
import { CheckSmall, CloseSmall, SuccessPicture } from '@icon-park/vue-next';
import {
  ElMessage,
  ElCollapse,
  ElCollapseItem,
  ElSwitch,
  ElRadioGroup,
  ElRadio,
} from 'element-plus';
import { useSecureStore } from '../utils/useSecureStore';

const { store, isReady } = useSecureStore();

// 默认选中项
const activeName = ref('1');

// 安全地访问store状态的计算属性
const wallpaperType = computed({
  get: () => (isReady.value && store.value ? Number(store.value.wallpaperType) : 0),
  set: (val) => {
    if (isReady.value && store.value) {
      store.value.wallpaperType = String(val);
    }
  },
});

const siteStartShow = computed({
  get: () => (isReady.value && store.value ? store.value.siteStartShow : false),
  set: (val) => {
    if (isReady.value && store.value) {
      store.value.siteStartShow = val;
    }
  },
});

const musicClick = computed({
  get: () => (isReady.value && store.value ? store.value.musicClick : false),
  set: (val) => {
    if (isReady.value && store.value) {
      store.value.musicClick = val;
    }
  },
});

const playerLrcShow = computed({
  get: () => (isReady.value && store.value ? store.value.playerLrcShow : false),
  set: (val) => {
    if (isReady.value && store.value) {
      store.value.playerLrcShow = val;

      // 当启用歌词显示时，立即显示一条消息
      if (val) {
        ElMessage.success('已启用底栏歌词显示');
      }
    }
  },
});

const footerBlur = computed({
  get: () => (isReady.value && store.value ? store.value.footerBlur : false),
  set: (val) => {
    if (isReady.value && store.value) {
      store.value.footerBlur = val;
    }
  },
});

// 壁纸切换
const radioChange = () => {
  if (isReady.value && store.value) {
    ElMessage({
      message: h('div', { style: 'display: flex; align-items: center;' }, [
        h(SuccessPicture, { theme: 'outline', fill: '#67c23a', size: '16' }),
        h('span', { style: 'margin-left: 8px' }, '壁纸设置已保存'),
      ]),
      type: 'success',
      offset: 80,
    });
  }
};
</script>

<style scoped>
.setting {
  width: 100%;
  background-color: rgba(30, 30, 30, 0.85);
  border-radius: 8px;
  padding: 10px;
}

.collapse {
  --el-collapse-header-bg-color: transparent;
  --el-collapse-header-text-color: #ffffff;
  --el-collapse-content-bg-color: rgba(30, 30, 30, 0.7);
  --el-collapse-content-text-color: #ffffff;
  border: none;
}

.bg-set {
  display: flex;
  justify-content: center;
  margin: 10px 0;
}

.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  color: #ffffff;
}

.text {
  font-size: 14px;
}

:deep(.el-radio) {
  margin-right: 10px;
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.5);
}

:deep(.el-radio__label) {
  color: #ffffff;
}

:deep(.el-radio.is-bordered.is-checked) {
  border-color: var(--el-color-primary);
}

:deep(.el-collapse-item__header) {
  color: #ffffff;
  font-weight: bold;
}

:deep(.el-collapse-item__wrap) {
  background-color: transparent;
}

:deep(.el-collapse-item__content) {
  color: #ffffff;
  padding: 10px;
}
</style>
