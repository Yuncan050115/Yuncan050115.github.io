<template>
  <div class="cake-container" v-if="visible">
    <div class="cake-wrapper" @click="sliceCake">
      <div class="cake" :class="{ sliced }">
        <div class="cake-plate"></div>
        <div class="cake-bottom-layer"></div>
        <div class="cake-middle-layer"></div>
        <div class="cake-top-layer"></div>
        <div class="frosting"></div>

        <div class="candles">
          <div class="candle" v-for="i in 5" :key="i">
            <div class="candle-stick"></div>
            <div class="flame" :class="{ 'flame-off': sliced }">
              <div class="outer-flame"></div>
              <div class="inner-flame"></div>
            </div>
          </div>
        </div>

        <div class="decoration">
          <div class="cherry" v-for="i in 6" :key="i"></div>
          <div class="sprinkles" v-for="i in 20" :key="i"></div>
        </div>

        <div class="slice" v-if="sliced"></div>
        <div class="birthday-text" :class="{ hidden: sliced }">
          <div class="text">ZHX</div>
          <div class="text">生日快乐</div>
        </div>
      </div>
    </div>

    <div class="message" v-if="sliced">红色是樱桃，小点是糖粒，对着这么豪华的蛋糕许个愿吧（）</div>
    <div class="controls">
      <button class="close-btn" @click="closeAll">X</button>
      <button class="music-btn" @click="toggleMusic">
        <span v-if="!isMusicPaused">🔊</span>
        <span v-else>🔈</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { ElMessage } from 'element-plus';
import confetti from 'canvas-confetti';

const props = defineProps({
  birthdayPerson: {
    type: String,
    default: 'ZHX',
  },
});

const visible = ref(true);
const sliced = ref(false);
const isMusicPaused = ref(false);
let audio = null;
let confettiInterval = null;

onMounted(() => {
  initAudio();
  runSpecialEffects();
});

onUnmounted(() => {
  if (audio) {
    audio.pause();
    audio = null;
  }
  if (confettiInterval) {
    clearInterval(confettiInterval);
  }
});

const initAudio = () => {
  try {
    // 在birthday页面，使用页面中的audio元素而不是创建新的
    if (window.location.pathname === '/birthday') {
      // 检查页面上是否已有bgMusic元素
      const existingAudio = document.getElementById('bgMusic');
      if (existingAudio) {
        audio = existingAudio; // 使用页面已有的audio元素
        isMusicPaused.value = audio.paused;
        return;
      }
    }

    // 在其他页面或没有找到页面音频元素时，创建新的音频元素
    audio = new Audio('/assets/happy-birthday.mp3');
    audio.loop = true;
    audio.volume = 0.5;
    audio.play().catch((e) => {
      console.error('无法自动播放音乐:', e);
      isMusicPaused.value = true;
    });
  } catch (error) {
    console.error('初始化音乐失败:', error);
  }
};

const runSpecialEffects = () => {
  try {
    // 烟花和彩带效果
    confettiInterval = setInterval(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }, 2000);
  } catch (error) {
    console.error('特效初始化失败:', error);
  }
};

const sliceCake = () => {
  if (!sliced.value) {
    sliced.value = true;
    ElMessage({
      message: `祝${props.birthdayPerson}生日快乐！愿所有美好的祝福都成真！`,
      type: 'success',
      duration: 5000,
    });

    // 切蛋糕后更多的庆祝效果
    confetti({
      particleCount: 200,
      spread: 180,
      origin: { y: 0.7 },
    });

    // 如果是在主页切蛋糕，则跳转到生日页面
    if (window.location.pathname !== '/birthday') {
      // 延迟1.5秒后跳转，让用户先看到切蛋糕效果
      setTimeout(() => {
        window.location.href = '/birthday';
      }, 1500);
    }
  }
};

const toggleMusic = () => {
  if (!audio) return;

  if (audio.paused) {
    audio.play();
    isMusicPaused.value = false;
  } else {
    audio.pause();
    isMusicPaused.value = true;
  }
};

const closeAll = () => {
  visible.value = false;
  if (confettiInterval) {
    clearInterval(confettiInterval);
  }
  if (audio) {
    audio.pause();
    audio = null;
  }
};
</script>

<style scoped>
/* 引入精华老宋字体 */
@font-face {
  font-family: 'JingHuaLaoSong';
  src: url('/assets/JingHuaLaoSong.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

.cake-container {
  position: fixed;
  bottom: 50px;
  right: 50px;
  z-index: 9999;
  perspective: 1000px;
  width: 300px;
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: 'JingHuaLaoSong', serif;
}

.cake-wrapper {
  position: relative;
  width: 250px;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  transform-style: preserve-3d;
  transform: rotateX(10deg);
  transition: transform 0.5s ease;
  cursor: pointer;
}

.cake-wrapper:hover {
  transform: rotateX(10deg) scale(1.05);
}

.cake {
  position: relative;
  width: 200px;
  height: 200px;
  transform-style: preserve-3d;
  animation: cakeRotate 20s infinite linear;
}

@keyframes cakeRotate {
  0% {
    transform: rotateY(0);
  }
  100% {
    transform: rotateY(360deg);
  }
}

.cake.sliced {
  animation-play-state: paused;
}

.cake-plate {
  position: absolute;
  bottom: -20px;
  width: 220px;
  height: 10px;
  background: #e0e0e0;
  border-radius: 50%;
  left: -10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.cake-bottom-layer,
.cake-middle-layer,
.cake-top-layer {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, #ffc6d9, #ff9eb5);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.cake-bottom-layer {
  bottom: 0;
  width: 200px;
  height: 40px;
}

.cake-middle-layer {
  bottom: 40px;
  width: 160px;
  height: 40px;
  left: 20px;
}

.cake-top-layer {
  bottom: 80px;
  width: 120px;
  height: 40px;
  left: 40px;
}

.frosting {
  position: absolute;
  width: 120px;
  height: 20px;
  bottom: 120px;
  left: 40px;
  background: #ffffff;
  border-radius: 50%;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.05);
  z-index: 1;
}

.candle {
  position: absolute;
  bottom: 140px;
  z-index: 2;
}

.candle:nth-child(1) {
  left: 70px;
  bottom: 140px;
}
.candle:nth-child(2) {
  left: 100px;
  bottom: 150px;
}
.candle:nth-child(3) {
  left: 130px;
  bottom: 140px;
}
.candle:nth-child(4) {
  left: 85px;
  bottom: 160px;
}
.candle:nth-child(5) {
  left: 115px;
  bottom: 160px;
}

.candle-stick {
  width: 8px;
  height: 25px;
  background: linear-gradient(to right, #f5f5b5, #ffffcc);
  position: relative;
  z-index: 1;
}

.flame {
  position: absolute;
  top: -30px;
  left: -3px;
  width: 14px;
  height: 30px;
  transform-origin: 50% 90%;
  animation: flicker 0.6s infinite alternate;
  z-index: 2;
}

.flame-off {
  opacity: 0;
  transition: opacity 0.3s;
}

.outer-flame {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, #ff9d00, #ffd500);
  border-radius: 50% 50% 20% 20%;
  box-shadow:
    0 0 10px #ff6a00,
    0 0 20px #ff8c00,
    0 0 30px #ffae00;
}

.inner-flame {
  position: absolute;
  width: 50%;
  height: 70%;
  left: 25%;
  top: 20%;
  background: #ffffff;
  border-radius: 50% 50% 20% 20%;
  opacity: 0.8;
}

@keyframes flicker {
  0% {
    transform: rotate(-1deg) scale(0.9);
  }
  25% {
    transform: rotate(1deg) scale(1.1);
  }
  50% {
    transform: rotate(-1deg) scale(1);
  }
  75% {
    transform: rotate(1deg) scale(1.1);
  }
  100% {
    transform: rotate(-1deg) scale(1);
  }
}

.decoration {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.cherry {
  position: absolute;
  width: 15px;
  height: 15px;
  background: #ff0033;
  border-radius: 50%;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  z-index: 3;
}

.cherry:nth-child(1) {
  top: 30px;
  left: 60px;
}
.cherry:nth-child(2) {
  top: 20px;
  left: 90px;
}
.cherry:nth-child(3) {
  top: 30px;
  right: 60px;
}
.cherry:nth-child(4) {
  top: 60px;
  left: 30px;
}
.cherry:nth-child(5) {
  top: 60px;
  right: 30px;
}
.cherry:nth-child(6) {
  top: 80px;
  left: 80px;
}

.sprinkles {
  position: absolute;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  z-index: 3;
}

.sprinkles:nth-child(7n + 1) {
  background-color: #ff9999;
}
.sprinkles:nth-child(7n + 2) {
  background-color: #99ff99;
}
.sprinkles:nth-child(7n + 3) {
  background-color: #9999ff;
}
.sprinkles:nth-child(7n + 4) {
  background-color: #ffff99;
}
.sprinkles:nth-child(7n + 5) {
  background-color: #ff99ff;
}
.sprinkles:nth-child(7n + 6) {
  background-color: #99ffff;
}
.sprinkles:nth-child(7n) {
  background-color: #ffcc99;
}

.sprinkles:nth-child(10n + 1) {
  top: 30px;
  left: 40px;
}
.sprinkles:nth-child(10n + 2) {
  top: 40px;
  left: 80px;
}
.sprinkles:nth-child(10n + 3) {
  top: 30px;
  left: 120px;
}
.sprinkles:nth-child(10n + 4) {
  top: 50px;
  left: 50px;
}
.sprinkles:nth-child(10n + 5) {
  top: 60px;
  left: 100px;
}
.sprinkles:nth-child(10n + 6) {
  top: 70px;
  left: 60px;
}
.sprinkles:nth-child(10n + 7) {
  top: 80px;
  left: 130px;
}
.sprinkles:nth-child(10n + 8) {
  top: 90px;
  left: 40px;
}
.sprinkles:nth-child(10n + 9) {
  top: 100px;
  left: 90px;
}
.sprinkles:nth-child(10n) {
  top: 110px;
  left: 120px;
}

.slice {
  position: absolute;
  width: 70px;
  height: 140px;
  background: linear-gradient(150deg, #ffc6d9, #ff9eb5, #ffeef3);
  border-radius: 0 0 35px 35px;
  bottom: 0;
  left: -90px;
  transform: rotate(15deg);
  box-shadow: 2px 4px 10px rgba(0, 0, 0, 0.1);
  z-index: 4;
  transform-origin: bottom right;
  animation: sliceMove 1s ease-out forwards;
}

@keyframes sliceMove {
  0% {
    transform: rotate(0deg) translateX(0);
  }
  100% {
    transform: rotate(15deg) translateX(-20px);
  }
}

.birthday-text {
  position: absolute;
  top: 20px;
  width: 100%;
  text-align: center;
  color: #ff6699;
  font-weight: bold;
  font-size: 18px;
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.8);
  z-index: 5;
  transition: opacity 0.5s;
  font-family: 'JingHuaLaoSong', serif;
}

.birthday-text.hidden {
  opacity: 0;
}

.message {
  margin-top: 20px;
  font-size: 18px;
  color: #ff6699;
  font-weight: bold;
  text-align: center;
  animation: fadeIn 1s ease-in;
  font-family: 'JingHuaLaoSong', serif;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.controls {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 10px;
}

.close-btn,
.music-btn {
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid #ff6699;
  color: #ff6699;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 16px;
}

.close-btn:hover,
.music-btn:hover {
  background: #ff6699;
  color: white;
}
</style>
