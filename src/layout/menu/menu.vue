<template>
  <div class="sidebar-wrap">
    <div class="sidebar-logo">
      <img src="../../assets/images/logo.svg" alt="" />
    </div>
    <el-menu class="el-menu-vertical-demo" text-color="#606266" :default-active="defaultActive">
      <menu-item :routeItems="myRoutes" />
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import Cookies from 'js-cookie';
import { routes } from '@/router/index';
import useUserStore from '@/store/modules/user';
import MenuItem from './menuItem.vue';

const userStore = useUserStore();
const roleId = String(userStore.roleId || Cookies.get('c_roleId'));
const $route = useRoute();
const defaultActive = ref<string>('');

watchEffect(() => {
  // 如果是只显示一级，name取对应一级name
  if ($route.meta.onlyShowParent) {
    defaultActive.value = `${$route.matched[0].name}`;
    return;
  }
  defaultActive.value = `${$route.name}`;
});

// 校验权限
const checkRole = (route: any) => {
  if (route.meta.hidden !== undefined) return route.meta.hidden;
  if (!route.meta.code) return false;
  if (route.meta.code.split(',').includes(roleId)) return false;
  return true;
};

// 递归校验路由
const handleCheckRoutes = (routesList) => {
  const resultRoutes = routesList;
  resultRoutes.forEach((item) => {
    if (item?.meta) {
      item.meta.hidden = checkRole(item);
    }
    if (item.children && item.children.length) {
      handleCheckRoutes(item.children);
    }
  });
  return resultRoutes;
};

// 递归过滤路由
const handleFilterRoutes = (routesList) => {
  let resultRoutes = routesList;
  resultRoutes = resultRoutes.filter((item) => {
    if (item.children && item.children.length) {
      item.children = handleFilterRoutes(item.children);
    }
    return !item.meta?.hidden;
  });
  return resultRoutes;
};

const myRoutes = handleFilterRoutes(handleCheckRoutes(routes));
</script>

<style lang="scss" scoped>
.sidebar-wrap {
  width: 100%;
  min-height: 100%;
  background-color: #ffffff;
  box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);

  .sidebar-logo {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 60px;
    background-color: var(--el-color-primary);

    img {
      width: 80px;
      height: auto;
      filter: brightness(1000%);
    }
  }

  .el-menu-vertical-demo {
    border-right: 0;
  }
  :deep .el-menu-item * {
    vertical-align: top;
  }
  :deep .el-menu-item.is-active {
    background-color: var(--el-menu-hover-bg-color);
  }
}
</style>
