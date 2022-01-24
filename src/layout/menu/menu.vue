<template>
  <div class="sidebar-wrap">
    <el-menu
      active-text-color="#ffffff"
      background-color="#1c2b36"
      class="el-menu-vertical-demo"
      text-color="rgb(165, 170, 174)"
      :default-active="defaultActive"
      router
    >
      <template v-for="(pMenu, pIndex) in myRoutes" :key="pMenu.name">
        <!-- 一级 -->
        <el-menu-item
          v-if="!pMenu.meta?.hidden && pMenu.meta?.onlyShowParent"
          :index="pMenu.path === '/' ? '/dashboard' : pMenu.path"
        >
          <template #title>
            <el-icon>
              <component :is="pMenu.meta.icon" />
            </el-icon>
            <span>{{ pMenu.meta.title }}</span>
          </template>
        </el-menu-item>
        <!-- 二级 -->
        <el-sub-menu
          v-if="!pMenu.meta?.hidden && !pMenu.meta?.onlyShowParent && pMenu.children?.length"
          :index="'pMenu' + pIndex"
        >
          <template #title>
            <el-icon>
              <component :is="pMenu.meta?.icon" />
            </el-icon>
            <span>{{ pMenu.meta?.title }}</span>
          </template>
          <template v-for="(cMenu, cIndex) in pMenu.children" :key="`${ pIndex }-${ cIndex }`">
            <el-menu-item
              v-if="!cMenu.meta?.hidden"
              :index="`${pMenu.path}/${cMenu.path}`"
            >{{ cMenu.meta?.title }}</el-menu-item>
          </template>
        </el-sub-menu>
      </template>
    </el-menu>
  </div>
</template>

<script setup lang="ts">

import { ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { routes } from '@/router/index';
import useUserStore from '@/store/modules/user';

const route = useRoute();
const userStore = useUserStore();
const permCodes = userStore.getPermCodes;
const defaultActive = ref('/dashboard');

watchEffect(() => {
  defaultActive.value = route.path;
});

// 没有权限
const checkNoPermission = (i: any): Boolean => {
  if (!permCodes.length) return true;
  if (!i.meta || !i.meta.code) return false;
  return i.meta && i.meta.code && !permCodes.includes(i.meta.code);
};

// 菜单权限控制
const myRoutes = ref(routes.map((item) => {
  // 父级无权限
  if (item.meta && checkNoPermission(item)) {
    item.meta.hidden = true;
  }

  // 有权限的子菜单数量
  let childrenPermissionCount = 0;

  if (item.children && item.children.length) {
    item.children.forEach((child) => {
      if (child.meta && checkNoPermission(child)) {
        child.meta.hidden = true;
      } else {
        childrenPermissionCount += 1;
      }
    });
  }

  // 子级皆无权限，隐藏父级
  if (item.meta && !childrenPermissionCount && item.children) {
    item.meta.hidden = true;
  }

  return item;
}));

</script>

<style lang="scss" scoped>
.sidebar-wrap {
  width: 100%;
  min-height: 100%;
  background-color: #1c2b36;
}
</style>
