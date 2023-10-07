<template>
  <template v-for="(item, index) in routeItems">
    <!-- 情况一：有子集的情况 -->
    <el-sub-menu
      v-if="item?.children?.length > 0 && !item.meta.onlyShowParent"
      :key="item.name"
      :index="item.name"
    >
      <template #title>
        <el-icon v-if="item.meta.icon">
          <component :is="item.meta.icon" />
        </el-icon>
        <span>{{ item.meta.title }}</span>
      </template>
      <menu-item :routeItems="item.children" />
    </el-sub-menu>
    <!-- 情况二：没子集的情况 -->
    <el-menu-item v-else :key="item.name" :index="item.name" @click="onClickRoute(item)">
      <template #title>
        <el-icon v-if="item.meta.icon">
          <component :is="item.meta.icon" />
        </el-icon>
        <span
          >{{ item.meta.title
          }}<el-badge
            v-if="item.meta.badge && newMessageCut > 0"
            value="new"
            class="item"
          ></el-badge
        ></span>
      </template>
    </el-menu-item>
  </template>
</template>

<script setup lang="ts">
import { defineProps, watch, ref } from 'vue';
import { useRouter } from 'vue-router';
import useUserStore from '@/store/modules/user';
import Cookies from 'js-cookie';
const userStore = useUserStore();
const $router = useRouter(); // Router
const newMessageCut = ref<number>(
  Number(userStore.newMessageCut || Cookies.get('c_newMessageCut'))
); // 消息次数
const props = defineProps({
  // 默认选中 --- 选中数据
  routeItems: {
    type: Array,
    default: () => [],
  },
});

/**
 * 路由跳转
 */
const onClickRoute = (route) => {
  if (route.meta.link) {
    window.open(route.meta.link);
    return;
  }
  $router.push({ name: route.name });
};
/**
 * 监听
 */
watch(
  () => [String(userStore.newMessageCut || Cookies.get('c_newMessageCut'))],
  ([newMessageCutVal]) => {
    newMessageCut.value = Number(newMessageCutVal);
  },
  {
    immediate: true,
  }
);
</script>

<style lang="scss" scoped></style>
