<template>
  <div class="app-wrap">
    <div class="app-menu">
      <LayoutMenu></LayoutMenu>
    </div>
    <div class="app-main">
      <LayoutNav></LayoutNav>
      <LayoutMain></LayoutMain>
    </div>
  </div>
</template>

<script setup lang="ts">
import LayoutMain from './main/main.vue';
import LayoutMenu from './menu/menu.vue';
import LayoutNav from './nav/nav.vue';
</script>

<style lang="scss" scoped>
.app-wrap {
  width: 100%;
  min-height: 100%;

  .app-menu {
    position: fixed;
    top: 0;
    left: 0;
    width: 200px;
    height: 100%;
    z-index: 9;
  }

  .app-main {
    position: relative;
    width: 100%;
    min-height: 100%;
    padding-left: 200px;
  }
}
</style>
