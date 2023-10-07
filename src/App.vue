<template>
  <router-view />
</template>

<script setup lang="ts">
import { ElMessageBox } from 'element-plus';
import { useRoute, useRouter } from 'vue-router';
import Cookies from 'js-cookie';

const $route = useRoute(); // Route
const $router = useRouter(); // Router

// 处理浏览器tab切换
const handleVisiable = () => {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'hidden') {
      const CTOKEN = Cookies.get('c_token');
      const routeName = $route.name;

      if (routeName === 'Login' && CTOKEN) {
        $router.replace('/');
        return;
      }

      if (routeName !== 'Login' && !CTOKEN) {
        ElMessageBox.confirm(
          '你已被登出，可以取消继续留在该页面，或者重新登录',
          '确定登出',
          {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning',
          },
        ).then(() => {
          $router.replace('/login').then(() => {
            window.location.reload();
          });
        });
      }
    }
  });
};

handleVisiable();

</script>
