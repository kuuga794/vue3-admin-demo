<template>
  <div class="nav-wrap">
    <div class="nav-title">瓜牛管好自己系统</div>
    <div class="nav-control">
      <el-dropdown>
        <span class="el-dropdown-link">
          {{ userInfo.mobile }}
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>修改密码</el-dropdown-item>
            <el-dropdown-item @click="handleLogOut">退出账号</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import useUserStore from '@/store/modules/user';
import { router } from '@/router/index';

const userStore = useUserStore();
const userInfo = reactive(userStore.userInfo);

// 退出账号
const handleLogOut = () => {
  userStore.LogOut().then(() => {
    router.replace({ name: 'Login' });
  });
};

</script>

<style lang="scss" scoped>
.nav-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 60px;
  padding: 0 20px;
  border-bottom: 1px solid #dcdfe6;
  box-shadow: 0 2px 6px 0 rgb(220 223 230 / 50%);

  .nav-title {
    font-size: 18px;
    color: #3f5362;
  }
}
</style>
