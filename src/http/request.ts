// index.ts
import Cookies from 'js-cookie';
import axios from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus';
import { router } from '@/router/index';
import { deletePropertyByValue } from '@/utils/index';
import { cacheAdapterEnhancer } from './cache';
import useUserStore from '@/store/modules/user';
import usePageStore from '@/store/modules/page';

import errorCode from './errorCode';

const CACHE_FIVE_MINUTES = 1000 * 60 * 5; // 接口缓存时间5min

/* 实例化请求配置 */
const service = axios.create({
  timeout: 1000 * 30,
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  withCredentials: true,
  adapter: cacheAdapterEnhancer(axios.defaults.adapter, {
    enabledByDefault: false, // 默认禁用缓存
    maxAge: CACHE_FIVE_MINUTES, // 缓存时间
  }),
});

/**
 * 请求拦截器
 * 每次请求前，如果存在token则在请求头中携带token
 */
service.interceptors.request.use(
  (config) => {
    // 让每个请求携带token
    if (config.headers) {
      config.headers.Authorization = `Bearer ${Cookies.get('c_token')}`;
    }
    // 兼容params和data
    // 清除值为null的参数
    config.params = deletePropertyByValue(config.params);
    config.data = deletePropertyByValue(config.data);

    return config;
  },
  (error) => Promise.reject(error),
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {

    // 下载文件（返回文件流） Blob
    const isFile = Object.prototype.toString.call(response.data) === '[object Blob]' || Object.prototype.toString.call(response.data) === '[object ArrayBuffer]'
    if (isFile) {
      return response.data;
    }

    const code = Number(response.data.code) || 200;
    const msg = response.data.msg || errorCode[code] || errorCode.default;

    if (code === 200) {
      return Promise.resolve(response.data);
    }

    if (code === 401) {
      // TODO 优化：若一个页面请求多个接口，会导致此处多次执行
      let isTips: boolean = false;
      if (!isTips) {
        isTips = true;
        ElMessageBox.confirm(
          `你已被登出，可以取消继续留在该页面，或者重新登录(${msg})`,
          '确定登出',
          {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning',
          },
        ).then(() => {
          isTips = false;
          const userStore = useUserStore();
          const userPage = usePageStore();
          userStore.Logout().then(() => {
            userPage.DeleteAllPage();
            router.replace('/login').then(() => {
              window.location.reload();
            });
          });
        });
      }
    } else {
      ElMessage({ message: msg, type: 'error', duration: 5 * 1000 });
    }

    return Promise.reject(new Error(msg || null));
  },
  (error) => {
    console.log('error', error);
    return Promise.reject(error);
  },
);

// 只需要考虑单一职责，这块只封装axios
export default service;
