import { h } from 'vue';
import { ElMessage } from 'element-plus';
import {
  SpaCandle,
  Fireworks,
  Moon,
  Cake,
  DragonZodiac,
  Flashlamp,
  Trophy,
  Crown,
} from '@icon-park/vue-next';

// 时钟
export const getCurrentTime = () => {
  try {
    let time = new Date();
    let year = time.getFullYear();
    let month = time.getMonth() + 1 < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1;
    let day = time.getDate() < 10 ? '0' + time.getDate() : time.getDate();
    let hour = time.getHours() < 10 ? '0' + time.getHours() : time.getHours();
    let minute = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes();
    let second = time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds();
    let weekday = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    let currentTime = {
      year,
      month,
      day,
      hour,
      minute,
      second,
      weekday: weekday[time.getDay()],
    };
    return currentTime;
  } catch (error) {
    console.error('获取当前时间失败:', error);
    return {
      year: '--',
      month: '--',
      day: '--',
      hour: '--',
      minute: '--',
      second: '--',
      weekday: '--',
    };
  }
};

// 时光胶囊
export const getTimeCapsule = () => {
  try {
    // 日进度
    const todayStartDate = new Date(new Date().toLocaleDateString()).getTime();
    const todayPassHours = (new Date() - todayStartDate) / 1000 / 60 / 60;
    const todayPassHoursPercent = (todayPassHours / 24) * 100;

    // 周进度
    const weeks = [7, 1, 2, 3, 4, 5, 6];
    const weekDay = weeks[new Date().getDay()];
    const weekDayPassPercent = (weekDay / 7) * 100;

    // 月进度
    const year = new Date().getFullYear();
    const date = new Date().getDate();
    const month = new Date().getMonth() + 1;
    const monthAll = new Date(year, month, 0).getDate();
    const monthPassPercent = (date / monthAll) * 100;

    // 年进度
    const yearStartDate = new Date(year, 0, 1).getTime();
    const yearEndDate = new Date(year + 1, 0, 1).getTime();
    const yearPassHours = (new Date() - yearStartDate) / 1000 / 60 / 60;
    const yearTotalHours = (yearEndDate - yearStartDate) / 1000 / 60 / 60;
    const yearPassPercent = (yearPassHours / yearTotalHours) * 100;

    return {
      day: {
        elapsed: Math.floor(todayPassHours),
        pass: Math.floor(todayPassHoursPercent),
      },
      week: {
        elapsed: weekDay,
        pass: Math.floor(weekDayPassPercent),
      },
      month: {
        elapsed: date,
        pass: Math.floor(monthPassPercent),
      },
      year: {
        elapsed: month - 1,
        pass: Math.floor(yearPassPercent),
      },
    };
  } catch (error) {
    console.error('计算时光胶囊数据失败:', error);
    return {
      day: { elapsed: 0, pass: 0 },
      week: { elapsed: 0, pass: 0 },
      month: { elapsed: 0, pass: 0 },
      year: { elapsed: 0, pass: 0 },
    };
  }
};

// 欢迎提示
export const helloInit = () => {
  const hour = new Date().getHours();
  let hello = '';
  if (hour < 6) {
    hello = '还不睡要登仙了';
  } else if (hour < 9) {
    hello = '早上好，祝你开心每一天';
  } else if (hour < 12) {
    hello = '上午好，喝杯水放松一下吧';
  } else if (hour < 14) {
    hello = '中午好，午饭时间到';
  } else if (hour < 17) {
    hello = '下午好，姬子阿姨提醒你来杯咖啡';
  } else if (hour < 19) {
    hello = '傍晚好，准备吃晚饭！';
  } else if (hour < 22) {
    hello = '晚上好，有没有去散步？';
  } else {
    hello = '半夜刷网站，你想当神仙啊！';
  }

  try {
    ElMessage({
      dangerouslyUseHTMLString: true,
      message: `<strong>${hello}</strong> 云灿个人站欢迎您`,
    });
  } catch (error) {
    console.error('显示欢迎消息失败:', error);
  }
};

// 节日和纪念日配置
// 传统节日、纪念日和角色生日
const anniversaries = {
  // 传统节日（固定日期的）
  1.1: { name: '元旦节', icon: Fireworks, effect: 'confetti' },
  1.15: { name: '本人的生日', icon: Cake, effect: 'fireworks' },
  2.14: { name: '情人节', icon: Cake },
  3.8: { name: '妇女节', icon: Fireworks },
  3.12: { name: '植树节', icon: Fireworks },
  4.1: { name: '愚人节', icon: Fireworks },
  4.4: { name: '清明节', icon: SpaCandle, effect: 'grayscale' },
  4.27: { name: 'zhx的生日', icon: Cake, effect: 'birthdayCake', music: 'happyBirthday' },
  5.1: { name: '劳动节', icon: Fireworks },
  5.4: { name: '青年节', icon: Fireworks },
  5.12: { name: '汶川大地震纪念日', icon: SpaCandle, effect: 'grayscale' },
  6.1: { name: '儿童节', icon: Fireworks, effect: 'confetti' },
  7.1: { name: '建党节', icon: Fireworks, effect: 'redBg' },
  7.7: { name: '中国人民抗日战争纪念日', icon: SpaCandle, effect: 'grayscale' },
  8.1: { name: '建军节', icon: Fireworks },
  '9.10': { name: '教师节', icon: Fireworks },
  9.18: { name: '九·一八事变纪念日', icon: SpaCandle, effect: 'grayscale' },
  10.1: { name: '国庆节', icon: Fireworks, effect: 'redBg' },
  12.13: { name: '南京大屠杀死难者国家公祭日', icon: SpaCandle, effect: 'grayscale' },
  12.24: { name: '平安夜', icon: Fireworks },
  12.25: { name: '圣诞节', icon: Fireworks, effect: 'snow' },

  // 原神角色生日
  1.9: { name: '神里绫人生日', icon: Cake, game: '原神' },
  1.18: { name: '迪奥娜生日', icon: Cake, game: '原神' },
  1.24: { name: '罗莎莉亚生日', icon: Cake, game: '原神' },
  2.22: { name: '刻晴生日', icon: Cake, game: '原神' },
  3.14: { name: '温迪生日', icon: Cake, game: '原神' },
  3.21: { name: '诺艾尔生日', icon: Cake, game: '原神' },
  4.17: { name: '重云生日', icon: Cake, game: '原神' },
  '4.30': { name: '迪卢克生日', icon: Cake, game: '原神' },
  5.18: { name: '雷电将军生日', icon: Cake, game: '原神' },
  5.21: { name: '优菈生日', icon: Cake, game: '原神' },
  5.27: { name: '珊瑚宫心海生日', icon: Cake, game: '原神' },
  6.9: { name: '丽莎生日', icon: Cake, game: '原神' },
  6.21: { name: '万叶生日', icon: Cake, game: '原神' },
  6.26: { name: '凝光生日', icon: Cake, game: '原神' },
  7.15: { name: '胡桃生日', icon: Cake, game: '原神' },
  '7.20': { name: '塔尔塔利亚生日', icon: Cake, game: '原神' },
  7.27: { name: '可莉生日', icon: Cake, game: '原神', effect: 'fireworks' },
  '8.10': { name: '柯莱生日', icon: Cake, game: '原神' },
  8.26: { name: '九条裟罗生日', icon: Cake, game: '原神' },
  8.31: { name: '琴生日', icon: Cake, game: '原神' },
  9.7: { name: '莫娜生日', icon: Cake, game: '原神' },
  9.9: { name: '雷泽生日', icon: Cake, game: '原神' },
  9.13: { name: '荒泷一斗生日', icon: Cake, game: '原神' },
  9.28: { name: '赛诺生日', icon: Cake, game: '原神' },
  10.16: { name: '辛焱生日', icon: Cake, game: '原神' },
  10.19: { name: '阿贝多生日', icon: Cake, game: '原神' },
  10.25: { name: '行秋生日', icon: Cake, game: '原神' },
  10.29: { name: '枫原万叶生日', icon: Cake, game: '原神' },
  11.2: { name: '香菱生日', icon: Cake, game: '原神' },
  '11.20': { name: '达达利亚生日', icon: Cake, game: '原神' },
  '11.30': { name: '凯亚生日', icon: Cake, game: '原神' },
  12.2: { name: '甘雨生日', icon: Cake, game: '原神' },
  12.21: { name: '宵宫生日', icon: Cake, game: '原神' },
  12.31: { name: '钟离生日', icon: Cake, game: '原神' },

  // 农历节日（近几年固定日期）
  2.16: { name: '除夕', icon: Flashlamp, effect: 'redBg' }, // 2026年
  2.17: { name: '春节', icon: Flashlamp, effect: 'redBg' }, // 2026年
  3.3: { name: '元宵节', icon: Flashlamp }, // 2026年
  4.5: { name: '清明节', icon: SpaCandle, effect: 'grayscale' }, // 2026年
  5.31: { name: '端午节', icon: DragonZodiac }, // 2025年
  10.6: { name: '中秋节', icon: Moon, effect: 'moonlight' }, // 2025年
};

// 特殊效果函数
const applyEffect = (effect) => {
  if (!effect) return;

  switch (effect) {
    case 'confetti':
      createConfetti();
      break;
    case 'fireworks':
      createFireworks();
      break;
    case 'snow':
      createSnowEffect();
      break;
    case 'grayscale':
      document.documentElement.style.filter = 'grayscale(0.95)';
      setTimeout(() => {
        document.documentElement.style.filter = '';
      }, 14000);
      break;
    case 'redBg':
      document.documentElement.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
      setTimeout(() => {
        document.documentElement.style.backgroundColor = '';
      }, 14000);
      break;
    case 'moonlight':
      createMoonlightEffect();
      break;
    case 'birthdayCake':
      createAdvancedBirthdayCake();
      break;
    default:
      break;
  }
};

// 创建飘落的彩色纸屑效果
const createConfetti = () => {
  try {
    const confettiScript = document.createElement('script');
    confettiScript.src =
      'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js';
    confettiScript.onload = () => {
      const duration = 5 * 1000;
      const end = Date.now() + duration;

      const runConfetti = () => {
        const opts = {
          particleCount: 50,
          spread: 80,
          origin: { y: 0.6 },
        };
        // 使用window.confetti确保全局作用域访问
        window.confetti(opts);

        if (Date.now() < end) {
          requestAnimationFrame(runConfetti);
        }
      };
      runConfetti();
    };
    document.head.appendChild(confettiScript);
  } catch (error) {
    console.error('创建彩色纸屑效果失败:', error);
  }
};

// 创建烟花效果
const createFireworks = () => {
  try {
    const fireworksScript = document.createElement('script');
    fireworksScript.src =
      'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js';
    fireworksScript.onload = () => {
      const duration = 10 * 1000;
      const end = Date.now() + duration;

      const runFireworks = () => {
        const opts = {
          startVelocity: 30,
          spread: 360,
          ticks: 60,
          zIndex: 0,
          particleCount: 150,
          origin: {
            x: Math.random(),
            y: Math.random() - 0.2,
          },
        };
        // 使用window.confetti确保全局作用域访问
        window.confetti(opts);

        if (Date.now() < end) {
          setTimeout(runFireworks, 1200);
        }
      };
      runFireworks();
    };
    document.head.appendChild(fireworksScript);
  } catch (error) {
    console.error('创建烟花效果失败:', error);
  }
};

// 创建雪花效果
const createSnowEffect = () => {
  try {
    const snowStyles = document.createElement('style');
    snowStyles.innerHTML = `
      .snowflake {
        position: fixed;
        top: -10px;
        color: white;
        font-size: 1em;
        text-shadow: 0 0 5px rgba(0,0,0,0.3);
        user-select: none;
        z-index: 1000;
        animation: snowfall linear infinite;
      }
      @keyframes snowfall {
        0% {
          transform: translateY(0) rotate(0deg);
        }
        100% {
          transform: translateY(100vh) rotate(360deg);
        }
      }
    `;
    document.head.appendChild(snowStyles);

    const createSnowflake = () => {
      const snowflake = document.createElement('div');
      snowflake.classList.add('snowflake');
      snowflake.innerHTML = '❄';
      snowflake.style.left = Math.random() * 100 + 'vw';
      snowflake.style.opacity = Math.random();
      snowflake.style.fontSize = Math.random() * 10 + 10 + 'px';
      snowflake.style.animationDuration = Math.random() * 5 + 5 + 's';

      document.body.appendChild(snowflake);

      setTimeout(() => {
        snowflake.remove();
      }, 10000);
    };

    const snowInterval = setInterval(createSnowflake, 200);
    setTimeout(() => clearInterval(snowInterval), 30000);
  } catch (error) {
    console.error('创建雪花效果失败:', error);
  }
};

// 创建高级生日蛋糕效果
const createAdvancedBirthdayCake = () => {
  try {
    // 如果已经存在蛋糕组件，不再重复添加
    if (document.querySelector('#birthday-cake-container')) {
      return;
    }

    // 动态导入并挂载Vue组件
    import('../components/BirthdayCake.vue')
      .then((module) => {
        const { createApp } = require('vue');
        const BirthdayCake = module.default;

        // 创建容器元素
        const container = document.createElement('div');
        container.id = 'birthday-cake-container';
        document.body.appendChild(container);

        // 创建Vue应用并挂载
        const app = createApp(BirthdayCake, {
          birthdayPerson: 'ZHX',
        });

        // 确保导入所需的依赖
        import('canvas-confetti')
          .then((confettiModule) => {
            window.confetti = confettiModule.default;
            // 挂载组件
            app.mount('#birthday-cake-container');
          })
          .catch((err) => {
            console.error('无法加载confetti库:', err);

            // 即使没有confetti库，也挂载组件
            app.mount('#birthday-cake-container');
          });
      })
      .catch((error) => {
        console.error('无法加载生日蛋糕组件:', error);
        // 回退到简单蛋糕效果
        createBirthdayCake();
        playBirthdayMusic();
        createConfetti();
        createFireworks();
      });
  } catch (error) {
    console.error('创建高级生日蛋糕效果失败:', error);
    // 回退到简单蛋糕效果
    createBirthdayCake();
    playBirthdayMusic();
    createConfetti();
    createFireworks();
  }
};

// 创建简单生日蛋糕特效 (作为备用方案)
const createBirthdayCake = () => {
  try {
    // 创建生日蛋糕容器
    const cakeContainer = document.createElement('div');
    cakeContainer.id = 'birthday-cake-container';
    cakeContainer.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 300px;
      height: 300px;
      z-index: 9999;
      cursor: pointer;
      pointer-events: all;
    `;

    // 创建生日蛋糕HTML
    cakeContainer.innerHTML = `
      <div class="cake-wrapper">
        <div class="cake">
          <div class="cake-top">
            <div class="candle">
              <div class="flame"></div>
            </div>
          </div>
          <div class="cake-middle"></div>
          <div class="cake-bottom"></div>
          <div class="message">点击切蛋糕</div>
        </div>
      </div>
    `;

    // 创建样式
    const cakeStyles = document.createElement('style');
    cakeStyles.textContent = `
      .cake-wrapper {
        position: relative;
        width: 250px;
        height: 250px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .cake {
        position: relative;
        width: 150px;
        height: 150px;
        transition: all 0.3s;
      }
      .cake:hover {
        transform: scale(1.05);
      }
      .cake-top {
        position: absolute;
        top: 0;
        width: 100%;
        height: 30px;
        background: #f299c1;
        border-radius: 50% 50% 0 0;
        display: flex;
        justify-content: center;
      }
      .cake-middle {
        position: absolute;
        top: 30px;
        width: 100%;
        height: 50px;
        background: #fde0c5;
      }
      .cake-bottom {
        position: absolute;
        top: 80px;
        width: 100%;
        height: 60px;
        background: #f9c5d5;
        border-radius: 0 0 15px 15px;
      }
      .candle {
        position: relative;
        width: 10px;
        height: 30px;
        background: #fffccc;
        top: -15px;
      }
      .flame {
        position: absolute;
        width: 10px;
        height: 15px;
        background: #ff9800;
        border-radius: 50% 50% 20% 20%;
        top: -15px;
        left: 0;
        animation: flicker 0.5s infinite alternate;
      }
      .message {
        position: absolute;
        top: 150px;
        width: 100%;
        text-align: center;
        color: #ff6699;
        font-weight: bold;
        font-size: 16px;
      }
      @keyframes flicker {
        0% { transform: scale(1); opacity: 1; }
        100% { transform: scale(1.1); opacity: 0.8; }
      }
      .sliced .cake-top, .sliced .cake-middle, .sliced .cake-bottom {
        transform: translateX(20px);
      }
      .sliced:before {
        content: '';
        position: absolute;
        width: 40px;
        height: 140px;
        background: #fde0c5;
        border-radius: 15px;
        top: 0;
        left: 0;
        transform: translateX(-60px) rotate(10deg);
        z-index: -1;
      }
    `;

    document.head.appendChild(cakeStyles);
    document.body.appendChild(cakeContainer);

    // 点击切蛋糕
    cakeContainer.addEventListener('click', () => {
      const cake = cakeContainer.querySelector('.cake');
      cake.classList.add('sliced');

      ElMessage({
        message: '生日快乐！即将跳转到专属生日页面...',
        duration: 3000,
        type: 'success',
      });

      // 延迟1.5秒后跳转到生日页面
      setTimeout(() => {
        window.location.href = '/birthday';
      }, 1500);

      // 如果跳转失败，30秒后移除蛋糕
      setTimeout(() => {
        if (document.getElementById('birthday-cake-container')) {
          cakeContainer.remove();
          cakeStyles.remove();
        }
      }, 5000);
    });
  } catch (error) {
    console.error('创建生日蛋糕特效失败:', error);
  }
};

// 播放生日快乐歌
const playBirthdayMusic = () => {
  try {
    const audio = new Audio();
    audio.src = '/assets/happy-birthday.mp3'; // 确保在public/assets目录下有此文件
    audio.loop = true;
    audio.volume = 0.5;

    // 添加音乐控制按钮
    const musicControl = document.createElement('div');
    musicControl.id = 'birthday-music-control';
    musicControl.innerHTML = `
      <div class="music-button">
        <div class="music-icon playing">🎵</div>
      </div>
    `;

    musicControl.style.cssText = `
      position: fixed;
      top: 70px;
      right: 20px;
      width: 40px;
      height: 40px;
      background: rgba(255, 102, 153, 0.7);
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      z-index: 9999;
    `;

    const musicStyles = document.createElement('style');
    musicStyles.textContent = `
      .music-button {
        width: 30px;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .music-icon {
        font-size: 20px;
        animation: rotate 3s linear infinite;
      }
      .music-icon.paused {
        animation-play-state: paused;
        opacity: 0.5;
      }
      @keyframes rotate {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;

    document.head.appendChild(musicStyles);
    document.body.appendChild(musicControl);

    // 播放音乐
    audio.play().catch((e) => console.error('自动播放音乐失败:', e));

    // 点击控制播放/暂停
    musicControl.addEventListener('click', () => {
      const musicIcon = musicControl.querySelector('.music-icon');
      if (audio.paused) {
        audio.play();
        musicIcon.classList.remove('paused');
        musicIcon.classList.add('playing');
      } else {
        audio.pause();
        musicIcon.classList.remove('playing');
        musicIcon.classList.add('paused');
      }
    });

    // 30秒后移除控制按钮和停止音乐
    setTimeout(() => {
      audio.pause();
      audio.src = '';
      musicControl.remove();
      musicStyles.remove();
    }, 60000);
  } catch (error) {
    console.error('播放生日音乐失败:', error);
  }
};

// 创建月光效果
const createMoonlightEffect = () => {
  try {
    const moonlightStyle = document.createElement('style');
    moonlightStyle.textContent = `
      body {
        background-color: rgba(64, 115, 255, 0.07);
      }
    `;
    document.head.appendChild(moonlightStyle);

    // 创建月亮
    const moon = document.createElement('div');
    moon.id = 'moonlight-effect';
    moon.style.cssText = `
      position: fixed;
      top: 50px;
      right: 50px;
      width: 80px;
      height: 80px;
      background-color: #f5f3ce;
      border-radius: 50%;
      box-shadow: 0 0 20px 5px rgba(245, 243, 206, 0.8);
      z-index: 9998;
      pointer-events: none;
    `;

    document.body.appendChild(moon);

    // 15秒后移除月光效果
    setTimeout(() => {
      moonlightStyle.remove();
      moon.remove();
    }, 15000);
  } catch (error) {
    console.error('创建月光效果失败:', error);
  }
};

// 检查特殊日期并应用效果
export const checkDays = () => {
  try {
    const myDate = new Date();
    const mon = myDate.getMonth() + 1;
    const date = myDate.getDate();
    const key = `${mon}.${date}`;

    if (Object.prototype.hasOwnProperty.call(anniversaries, key)) {
      const event = anniversaries[key];
      console.log(`今天是${event.name}`);

      try {
        // 应用指定的视觉效果
        if (event.effect) {
          applyEffect(event.effect);
        }

        // 显示提示消息
        const duration = event.effect === 'grayscale' ? 14000 : 8000;
        const gamePrefix = event.game ? `【${event.game}】` : '';

        ElMessage({
          message: `今天是${gamePrefix}${event.name}`,
          duration,
          icon: h(event.icon || SpaCandle, { theme: 'filled', fill: '#efefef' }),
        });
      } catch (innerError) {
        console.error('应用节日效果或显示消息失败:', innerError);
      }
    }
  } catch (error) {
    console.error('检查节日日期失败:', error);
  }
};

// 建站日期统计
export const siteDateStatistics = (startDate) => {
  try {
    if (!startDate || !(startDate instanceof Date) || isNaN(startDate.getTime())) {
      throw new Error('无效的开始日期');
    }

    const currentDate = new Date();
    const differenceInTime = currentDate.getTime() - startDate.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    const differenceInMonths = differenceInDays / 30;
    const differenceInYears = differenceInMonths / 12;

    if (differenceInYears >= 1) {
      return `本站出生 ${Math.floor(differenceInYears)} 年 ${Math.floor(
        differenceInMonths % 12
      )} 月 ${Math.round(differenceInDays % 30)} 天`;
    } else if (differenceInMonths >= 1) {
      return `本站出生 ${Math.floor(differenceInMonths)} 月 ${Math.round(
        differenceInDays % 30
      )} 天`;
    } else {
      return `本站出生 ${Math.round(differenceInDays)} 天`;
    }
  } catch (error) {
    console.error('计算建站日期统计失败:', error);
    return '本站出生时间未知';
  }
};
