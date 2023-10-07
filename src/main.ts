import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import * as ElIconModules from '@element-plus/icons-vue';
import VueVideoPlayer from '@videojs-player/vue';
import fixedHeaderDirective from './directive/fixed-header';

import App from './App.vue';
import store from './store/index';
import { router } from './router/index';
import 'element-plus/dist/index.css';
import './style/index.scss';
import 'video.js/dist/video-js.css';

const app = createApp(App);

app.use(store).use(router).use(ElementPlus, { locale: zhCn }).use(VueVideoPlayer);

app.directive('fixed-header', fixedHeaderDirective);

/**
 * 判断权限的全局函数，使用场景为按钮,是否显示
 * @param { string } roles 角色权限，多个用逗号拼接
 * @returns { boolean }
 */
const hasPermission = (roles: string) => {
  if (!roles) {
    throw new Error('权限写法有误，请检查');
  }
  const userRoleId = store.state.value.user.roleId;
  return roles.indexOf(userRoleId) > -1;
};
app.config.globalProperties.$hasPermission = hasPermission;

const baseUrl = import.meta.env.VITE_APP_BASE_URL;
app.config.globalProperties.$baseUrl = baseUrl;

app.mount('#app');

// 统一注册Icon图标
Object.keys(ElIconModules).forEach((key) => {
  app.component(key, ElIconModules[key]);
});
