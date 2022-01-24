import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import zhCn from 'element-plus/lib/locale/lang/zh-cn';
import * as ElIconModules from '@element-plus/icons-vue';

import App from './App.vue';
import store from './store/index';
import { router } from './router/index';
import 'element-plus/dist/index.css';
import './style/index.scss';

const app = createApp(App);

app
  .use(store)
  .use(router)
  .use(ElementPlus, { locale: zhCn })
  .mount('#app');

// 统一注册Icon图标
for (const iconName in ElIconModules) {
  if (Reflect.has(ElIconModules, iconName)) {
    const item = ElIconModules[iconName];
    app.component(iconName, item);
  }
}
