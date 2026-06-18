<template>
  <div class="weather" v-if="weatherData.city && weatherData.weather">
    <span>{{ weatherData.city }}&nbsp;</span>
    <span>{{ weatherData.weather }}&nbsp;</span>
    <span>{{ weatherData.temperature }}</span>
    <span class="sm-hidden"> &nbsp;{{ weatherData.wind }}&nbsp; </span>
    <span class="sm-hidden" v-if="weatherData.windpower">{{ weatherData.windpower }}</span>
  </div>
  <div class="weather" v-else>
    <span>{{ loadingMessage }}</span>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, h } from 'vue';
import {
  getLocationByIp,
  getCityCode,
  getWeather,
  getWeatherForecast,
  getOtherWeather,
} from '@/api';
import { Error } from '@icon-park/vue-next';
import { ElMessage } from 'element-plus';

// 高德开发者 Key - 首先尝试从环境变量读取
let mainKey = import.meta.env.VITE_WEATHER_KEY;

// 输出环境变量检查，确认是否正确读取
// console.log("环境变量检查:", {
//   rawKey: import.meta.env.VITE_WEATHER_KEY,
//   keyLength: mainKey ? mainKey.length : 0,
//   keyValid: mainKey && mainKey !== "undefined" && mainKey.trim() !== ""
// });

// 如果环境变量无法读取，使用硬编码值作为备用
if (!mainKey || mainKey === 'undefined' || mainKey.trim() === '') {
  mainKey = '6e2f5563a0642d52dae5bd2de8d6ee94';
}

// 默认城市列表
const defaultCities = [
  { name: '北京', adcode: '110000' },
  { name: '上海', adcode: '310000' },
  { name: '广州', adcode: '440100' },
  { name: '深圳', adcode: '440300' },
  { name: '杭州', adcode: '330100' },
];

// 随机选择一个默认城市
const getRandomDefaultCity = () => {
  const randomIndex = Math.floor(Math.random() * defaultCities.length);
  return defaultCities[randomIndex];
};

// 天气数据
const weatherData = reactive({
  city: null, // 城市
  weather: null, // 天气现象
  temperature: null, // 实时气温
  wind: null, // 风向
  windpower: null, // 风力级别
  update_time: null, // 更新时间
});

// 加载消息
const loadingMessage = ref('获取天气信息中...');

// 尝试使用浏览器的地理位置API获取位置
const tryBrowserGeolocation = () => {
  return new Promise((resolve, reject) => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // 使用高德逆地理编码接口将经纬度转换为地址
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            console.log('浏览器地理位置:', lat, lng);

            const res = await fetch(
              `https://restapi.amap.com/v3/geocode/regeo?key=${mainKey}&location=${lng},${lat}&poitype=&radius=1000&extensions=base&batch=false&roadlevel=0`
            );
            const data = await res.json();

            if (data.status === '1' && data.regeocode && data.regeocode.addressComponent) {
              const cityCode = data.regeocode.addressComponent.adcode;
              const cityName =
                data.regeocode.addressComponent.city || data.regeocode.addressComponent.province;

              resolve({
                adcode: cityCode,
                city: cityName,
                success: true,
              });
            } else {
              reject(new Error('无法通过经纬度获取城市信息'));
            }
          } catch (error) {
            reject(error);
          }
        },
        (error) => {
          console.log('浏览器地理位置API错误:', error.message);
          reject(error);
        },
        {
          enableHighAccuracy: false,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      reject(new Error('浏览器不支持地理位置API'));
    }
  });
};

// 获取用户所在城市信息
const getCityInfo = async () => {
  try {
    // 首先尝试使用浏览器的地理位置API
    const geoLocation = await tryBrowserGeolocation();
    // console.log("浏览器地理位置API成功:", geoLocation);
    return geoLocation;
  } catch (error) {
    console.log('浏览器地理位置API失败，尝试IP定位:', error);

    try {
      // 尝试使用第三方IP定位
      const ipLocation = await getLocationByIp();

      if (ipLocation.success && ipLocation.city) {
        // 根据城市名称获取高德地图的城市编码
        const cityCode = await getCityCode(mainKey, ipLocation.city);
        if (cityCode.success) {
          return cityCode;
        }
      }

      throw new Error('IP定位获取城市信息失败');
    } catch (ipError) {
      console.log('IP定位失败，使用默认城市:', ipError);

      // 使用默认城市
      const defaultCity = getRandomDefaultCity();
      return {
        adcode: defaultCity.adcode,
        city: defaultCity.name,
        success: true,
      };
    }
  }
};

// 获取天气数据
const getWeatherData = async () => {
  try {
    // 检查高德API Key是否有效
    if (!mainKey || mainKey === 'undefined' || mainKey.trim() === '') {
      console.log('高德API Key未配置或无效，使用中国天气网接口');

      try {
        const result = await getOtherWeather();
        console.log('中国天气网数据:', result);

        if (result && result.city) {
          weatherData.city = result.city;
          weatherData.update_time = result.update_time;

          if (result.list && result.list.length > 0) {
            const todayWeather = result.list[0];
            weatherData.weather = todayWeather.weather;
            weatherData.temperature = todayWeather.temp;
            weatherData.wind = todayWeather.wind;
            weatherData.windpower = todayWeather.w;
          } else {
            throw '天气数据不完整';
          }
        } else {
          throw '天气数据格式不正确';
        }
      } catch (error) {
        console.error('中国天气网API调用失败:', error);
        loadingMessage.value = '天气信息暂时不可用';
        throw error;
      }
    } else {
      console.log('使用高德天气API，KEY:', mainKey.substring(0, 4) + '***');

      try {
        // 获取用户所在城市信息
        const cityInfo = await getCityInfo();
        // console.log("获取到城市信息:", cityInfo);

        if (!cityInfo.success || !cityInfo.adcode) {
          throw new Error('无法获取有效的城市编码');
        }

        // 获取天气实况
        // console.log("请求天气数据, 城市编码:", cityInfo.adcode);
        const weatherResult = await getWeather(mainKey, cityInfo.adcode);

        // 如果实况天气获取失败，尝试获取天气预报
        if (
          weatherResult.infocode !== '10000' ||
          !weatherResult.lives ||
          weatherResult.lives.length === 0
        ) {
          console.log('天气实况数据获取失败，尝试获取天气预报');
          const forecastResult = await getWeatherForecast(mainKey, cityInfo.adcode);
          processWeatherResult(forecastResult, cityInfo.city);
        } else {
          processWeatherResult(weatherResult, cityInfo.city);
        }
      } catch (error) {
        console.error('高德API调用失败:', error);
        loadingMessage.value = '天气信息暂时不可用';

        // 作为最后尝试，使用中国天气网API
        try {
          console.log('尝试使用中国天气网API作为备用');
          const result = await getOtherWeather();
          if (result && result.city) {
            weatherData.city = result.city;
            weatherData.update_time = result.update_time;

            if (result.list && result.list.length > 0) {
              const todayWeather = result.list[0];
              weatherData.weather = todayWeather.weather;
              weatherData.temperature = todayWeather.temp;
              weatherData.wind = todayWeather.wind;
              weatherData.windpower = todayWeather.w;
            } else {
              throw '备用天气数据不完整';
            }
          } else {
            throw '备用天气数据格式不正确';
          }
        } catch (backupError) {
          console.error('备用天气API也失败:', backupError);
          throw error;
        }
      }
    }
  } catch (error) {
    console.error('天气信息获取失败:', error);
    onError('天气信息获取失败');
  }
};

// 处理高德天气结果
const processWeatherResult = (result, defaultCity) => {
  // console.log("处理天气数据:", result);

  if (result.infocode === '10000') {
    if (result.lives && result.lives.length > 0) {
      // 实况天气
      weatherData.city = result.lives[0].city || defaultCity;
      weatherData.weather = result.lives[0].weather;
      weatherData.temperature = result.lives[0].temperature + '℃';
      weatherData.wind = result.lives[0].winddirection?.endsWith('风')
        ? result.lives[0].winddirection
        : (result.lives[0].winddirection || '') + '风';
      weatherData.windpower = result.lives[0].windpower + ' 级';
    } else if (result.forecasts && result.forecasts.length > 0) {
      // 天气预报
      const forecast = result.forecasts[0];
      weatherData.city = forecast.city || defaultCity;

      if (forecast.casts && forecast.casts.length > 0) {
        const todayCast = forecast.casts[0];
        weatherData.weather = todayCast.dayweather;
        weatherData.temperature = todayCast.daytemp + '℃';
        weatherData.wind = todayCast.daywind + '风';
        weatherData.windpower = todayCast.daypower + ' 级';
      } else {
        throw '无法获取天气预报数据';
      }
    } else {
      throw '天气数据不完整';
    }
  } else {
    throw '天气查询失败: ' + (result.info || '未知错误');
  }
};

// 报错信息
const onError = (message) => {
  ElMessage({
    message,
    icon: h(Error, {
      theme: 'filled',
      fill: '#efefef',
    }),
  });
  console.error(message);
};

onMounted(() => {
  // 尝试获取天气数据，但不影响主界面加载
  getWeatherData().catch((err) => {
    console.error('天气组件加载失败，但不会阻止页面显示:', err);
    loadingMessage.value = '天气信息暂不可用';
  });
});
</script>

<style lang="scss" scoped>
.weather {
  width: 100%;
  text-overflow: ellipsis;
  overflow-x: hidden;
  white-space: nowrap;
  margin-top: 10px;
  font-family: 'JinghuaLaosong', sans-serif !important;

  span {
    font-family: 'JinghuaLaosong', sans-serif !important;
  }
}
</style>
