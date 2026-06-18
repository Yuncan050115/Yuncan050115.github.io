// import axios from "axios";
import fetchJsonp from 'fetch-jsonp';

/**
 * 音乐播放器
 */

// 获取音乐播放列表
export async function getPlayerList(server, type, id) {
  // console.log("");

  // 先检查是否有缓存
  const cacheKey = `music-list-${server}-${type}-${id}`;
  const cachedData = localStorage.getItem(cacheKey);

  if (cachedData) {
    try {
      const parsedData = JSON.parse(cachedData);
      const cacheTime = parsedData.timestamp;
      const currentTime = new Date().getTime();

      // 缓存有效期为1天
      if (currentTime - cacheTime < 24 * 60 * 60 * 1000) {
        console.log('使用缓存的歌单数据，共', parsedData.data.length, '首歌曲');

        // 如果使用的是缓存数据，也标记音乐API为可用
        if (typeof window !== 'undefined' && window.useMainStore) {
          const store = window.useMainStore();
          if (store) {
            store.musicIsOk = true;
          }
        }

        return parsedData.data;
      }

      // 缓存过期，重新请求
      console.log('歌单缓存已过期，重新请求');
    } catch (e) {
      console.error('解析缓存数据失败:', e);
    }
  }

  try {
    // 强制设置API地址，避免任何环境变量问题
    const apiUrl = 'https://music.yuncan.xyz/api';
    // console.log("使用API地址:", apiUrl);

    // 尝试在sessionStorage中设置备用API，以便其他地方可能需要使用
    try {
      sessionStorage.setItem('backup-song-api', apiUrl);
    } catch (e) {
      console.error('存储API地址失败:', e);
    }

    // 构建完整的请求URL
    const requestUrl = `${apiUrl}?server=${server}&type=${type}&id=${id}`;
    // console.log("请求音乐API:", requestUrl);

    const response = await fetch(requestUrl);

    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('音乐API返回数据条数:', data.length);

    // 缓存数据
    try {
      const cacheData = {
        timestamp: new Date().getTime(),
        data: data,
      };
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
      console.log('歌单数据已缓存');
    } catch (e) {
      console.error('缓存歌单数据失败:', e);
    }

    // 标记音乐API为可用
    if (typeof window !== 'undefined' && window.useMainStore) {
      const store = window.useMainStore();
      if (store) {
        store.musicIsOk = true;
      }
    }

    return data;
  } catch (error) {
    console.error('获取音乐列表失败:', error);

    // 即使失败也返回一个空数组，避免整个应用崩溃
    return [];
  }
}

/**
 * 一言
 */

// 获取一言数据
export const getHitokoto = async () => {
  const res = await fetch('https://v1.hitokoto.cn/?c=k&c=c');
  return await res.json();
};

/**
 * 天气
 */

// 使用第三方API获取IP地理位置
export const getLocationByIp = async () => {
  try {
    // 使用免费的IP定位API
    const res = await fetch('https://ipapi.co/json/');
    const data = await res.json();

    console.log('IP定位结果(第三方):', data);

    if (data && data.city) {
      return {
        city: data.city,
        province: data.region,
        success: true,
        // 返回成功信息
        infocode: '10000',
        status: '1',
      };
    }

    // 如果没有获取到城市信息，返回失败
    return {
      infocode: '9999',
      status: '0',
      info: '获取位置失败',
      success: false,
    };
  } catch (error) {
    console.error('第三方IP定位服务调用失败:', error);
    return {
      infocode: '9999',
      status: '0',
      info: '请求失败',
      error: error.message || '网络错误',
      success: false,
    };
  }
};

// 城市名称转城市编码
export const getCityCode = async (key, cityName) => {
  try {
    // 使用高德地图API查询城市编码
    const res = await fetch(
      `https://restapi.amap.com/v3/geocode/geo?key=${key}&address=${encodeURIComponent(cityName)}&output=JSON`
    );
    const data = await res.json();

    console.log('城市编码查询结果:', data);

    if (data.status === '1' && data.geocodes && data.geocodes.length > 0) {
      // 返回城市编码（adcode）
      return {
        adcode: data.geocodes[0].adcode,
        city: cityName,
        success: true,
        infocode: '10000',
        status: '1',
      };
    }

    return {
      infocode: '9999',
      status: '0',
      info: '城市编码查询失败',
      success: false,
    };
  } catch (error) {
    console.error('城市编码查询失败:', error);
    return {
      infocode: '9999',
      status: '0',
      info: '请求失败',
      error: error.message || '网络错误',
      success: false,
    };
  }
};

// 获取高德地理位置信息
export const getAdcode = async (key) => {
  try {
    const res = await fetch(`https://restapi.amap.com/v3/ip?key=${key}`);
    return await res.json();
  } catch (error) {
    console.error('高德地理位置API调用失败:', error);
    // 返回一个带错误标识的对象，而不是抛出异常
    return {
      infocode: '9999',
      status: '0',
      info: '请求失败',
      error: error.message || '网络错误',
    };
  }
};

// 获取高德地理天气信息 - 实况天气
export const getWeather = async (key, city) => {
  try {
    // 增加extensions=all参数以获取更多数据
    const res = await fetch(
      `https://restapi.amap.com/v3/weather/weatherInfo?key=${key}&city=${city}&extensions=base`
    );
    return await res.json();
  } catch (error) {
    console.error('高德天气API调用失败:', error);
    // 返回一个带错误标识的对象，而不是抛出异常
    return {
      infocode: '9999',
      status: '0',
      info: '请求失败',
      error: error.message || '网络错误',
    };
  }
};

// 获取高德天气预报信息
export const getWeatherForecast = async (key, city) => {
  try {
    const res = await fetch(
      `https://restapi.amap.com/v3/weather/weatherInfo?key=${key}&city=${city}&extensions=all`
    );
    return await res.json();
  } catch (error) {
    console.error('高德天气预报API调用失败:', error);
    return {
      infocode: '9999',
      status: '0',
      info: '请求失败',
      error: error.message || '网络错误',
    };
  }
};

// 获取中国天气网天气API（使用JSONP方式解决跨域问题）
// https://query.asilu.com/weather/weather/
export const getOtherWeather = () => {
  return new Promise((resolve, reject) => {
    try {
      // 创建一个独特的回调函数名
      const callbackName = 'weatherJsonpCallback_' + Date.now();
      // 在全局对象上定义回调函数
      window[callbackName] = (data) => {
        // 清理全局对象上的回调函数
        delete window[callbackName];
        // 移除script标签
        document.body.removeChild(scriptEl);
        // 解析成功响应
        resolve(data);
      };

      // 创建script标签
      const scriptEl = document.createElement('script');
      scriptEl.src = `https://query.asilu.com/weather/weather/?callback=${callbackName}`;
      scriptEl.onerror = (err) => {
        // 清理全局对象上的回调函数
        delete window[callbackName];
        // 移除script标签
        document.body.removeChild(scriptEl);
        // 拒绝promise
        reject(new Error('天气API请求失败'));
      };
      // 添加到DOM中发起请求
      document.body.appendChild(scriptEl);
    } catch (error) {
      reject(error);
    }
  });
};
