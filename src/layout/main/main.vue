<template>
  <div class="main-wrap">
    <Breadcrumb />

    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" :key="route.meta.title" />
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import Breadcrumb from '@/components/Breadcrumb.vue';

const route = useRoute();

</script>

<style lang="scss" scoped>
.main-wrap {
  width: 100%;
  padding: 20px;
}
</style>
