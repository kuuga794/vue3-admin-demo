<template>
  <div class="breadcrumb">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item
        v-for="item in breadcrumbList"
        :key="item.path"
        :to="{ path: item?.path }"
      >{{ item.meta?.title }}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script setup lang="ts">
import { watchEffect, reactive } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute(); // 当前路由
const breadcrumbList: any = reactive([]); // 面包屑列表

watchEffect(() => {
  breadcrumbList.splice(0, 2);
  if (route.name !== 'Dashboard') breadcrumbList.push(...route.matched);
});

</script>

<style lang="scss" scoped>
.breadcrumb {
  margin-bottom: 20px;
}
</style>
