<template>
  <div class="breadcrumb" :class="{ shadow: isShaDow }">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item
        v-for="item in breadcrumbList"
        :key="item.path"
        :to="{ path: item?.path }"
      >
        {{ item.meta?.title }}
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script setup lang="ts" name="Breadcrumb">
import { ref, reactive, watchEffect } from 'vue';
import { useRoute } from 'vue-router';

const $route = useRoute(); // 当前路由
const breadcrumbList: any = reactive([]); // 面包屑列表
const isShaDow = ref<boolean>(false); // 是否滚动

watchEffect(() => {
  breadcrumbList.splice(0, breadcrumbList.length);
  if ($route.name !== 'Dashboard') breadcrumbList.push(...$route.matched);
});
</script>

<style lang="scss" scoped>
.breadcrumb {
  padding: 20px;
  background-color: #f5f7fc;
}
</style>
