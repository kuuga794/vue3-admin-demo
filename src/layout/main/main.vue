<template>
  <div class="main-wrap">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <keep-alive :include="caches">
          <component :is="Component" :key="$route.name" />
        </keep-alive>
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import useRouteCache from '@/hooks/useRouteCache';

const { caches, addCache } = useRouteCache();

// 将列表页组件名称添加到需要缓存名单中
addCache([
  'BillList',
  'PayList',
  'PreviousList',
  'InvoiceUpload',
  'InvoiceMatch',
  'InvoiceNameList',
  'EntrustList',
  'NameList',
  'UserList',
  'ExpensesQuote',
  'StyleNumber',
]);
</script>

<style lang="scss" scoped>
.main-wrap {
  width: 100%;
  padding: 110px 12px 0 12px;
}
</style>
