// index.ts
import axios from 'axios';
import Cookies from 'js-cookie';
import { ElMessage, ElMessageBox } from 'element-plus';
import useUserStore from '@/store/modules/user';
import { router } from '@/router/index';
import { utf8ByteToUnicodeStr } from '@/utils/index';

/**
 * 请求失败后的错误统一处理
 * @param {Number} status 请求失败的状态码
 */
const errorHandle = (status: number) => {
  // 状态码判断
  switch (status) {
    case 302:
      console.log(`接口重定向了==>${status}`);
      break;
    case 400:
      console.log(`发出的请求有错误==>${status}`);
      break;
    case 401:
      console.log(`token:登录失效==>${status}`);
      break;
    case 403:
      console.log(`登录过期==>${status}`);
      break;
    case 404:
      console.log(`网络请求不存在==>${status}`);
      break;
    default:
      console.log(`其他错误错误==>${status}`);
  }
};

/* 实例化请求配置 */
const service = axios.create({
  timeout: 1000 * 30,
  baseURL: 'https://dev.ir.zlf.cn/manager/',
});

/**
 * 请求拦截器
 * 每次请求前，如果存在token则在请求头中携带token
 */
service.interceptors.request.use(
  (config) => {
    // 兼容params和data
    const token = Cookies.get('token');
    if (token && config.headers) {
      // 请求头token信息，请根据实际情况进行修改
      config.headers.token = token;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    // 下载文件（返回文件流）
    if (Object.prototype.toString.call(response.data) === '[object ArrayBuffer]') {
      try {
        const parsedRes = JSON.parse(utf8ByteToUnicodeStr(new Uint8Array(response.data)));
        ElMessage({
          message: decodeURIComponent(parsedRes.message),
          type: 'error',
          duration: 5 * 1000,
        });
        return Promise.reject(parsedRes);
      } catch (e) {
        return response.data;
      }
    }

    const { code, message, status } = response.data;
    if (code === 'SUCCESS') {
      return Promise.resolve(response.data);
    }

    if (status === 401) {
      // TODO 优化：若一个页面请求多个接口，会导致此处多次执行
      ElMessageBox.confirm(
        `你已被登出，可以取消继续留在该页面，或者重新登录(${message})`,
        '确定登出',
        {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning',
        },
      ).then(() => {
        const userStore = useUserStore();
        userStore.LogOut().then(() => {
          console.log('退出登录');
          router.replace({ name: 'Login' });
        });
      });
    } else if (status === 403) {
      // 没有权限
      ElMessage.error(message);
      router.replace({ name: 'Dashboard' });
    } else {
      ElMessage({ message, type: 'error', duration: 5 * 1000 });
    }

    return Promise.reject(new Error(message));
  },
  (error) => {
    errorHandle(error.status);
    return Promise.reject(error);
  },
);

// 只需要考虑单一职责，这块只封装axios
export default service;
