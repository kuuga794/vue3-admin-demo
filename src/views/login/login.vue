<template>
  <div class="app-wrap">
    <div class="login-header">瓜牛管好自己系统</div>
    <div class="login-main">
      <div class="form-wrap login">
        <el-form ref="ruleFormRef" :model="state.loginForm" status-icon :rules="state.rules">
          <el-form-item prop="username">
            <el-input placeholder="请输入手机号" v-model="state.loginForm.username" autocomplete="off" />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              placeholder="请输入密码"
              v-model="state.loginForm.password"
              type="password"
              show-password
            />
          </el-form-item>
          <el-form-item prop="imageCode">
            <el-input placeholder="请输入验证码" v-model="state.loginForm.imageCode" />
            <img :src="state.imageCodeUrl" @click="changeImageCodeUrl" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submit()">Submit</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
</script>

<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { router } from '@/router/index';
import useUserStore from '@/store/modules/user';

const userStore = useUserStore();

const state = reactive({
  loading: false, // 登录CD
  imageCodeUrl: '', // 验证码图片
  rules: {
    username: [{ required: true, trigger: 'blur', message: '请输入手机号' }],
    password: [{ required: true, trigger: 'blur', message: '请输入密码' }],
    imageCode: [{ required: true, trigger: 'blur', message: '请输入验证码' }],
  },
  loginForm: {
    uuid: '', // uuid
    type: 0, // 0个人管理员 1企业登录
    username: '', // 用户名
    password: '', // 密码
    imageCode: '', // 验证码
  },
});

// 获取Guid
const getGuid: () => string = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
  const r = (Math.random() * 16) | 0;
  return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
});

// 更新验证码图片
const changeImageCodeUrl = () => {
  state.imageCodeUrl = `${state.imageCodeUrl}&time=${new Date().getTime()}`;
};

// 登录
const submit = () => {
  state.loading = true;
  userStore.Login(state.loginForm).then(() => {
    router.replace('/');
  }).finally(() => {
    state.loading = false;
    changeImageCodeUrl();
  });
};

// onMounted
onMounted(() => {
  state.loginForm.uuid = getGuid();
  state.imageCodeUrl = `https://dev.ir.zlf.cn/manager/sysuser/imagecode?uuid=${state.loginForm.uuid}`;
});
</script>

<style lang="scss" scoped>
.app-wrap {
  position: relative;
  width: 100%;
  height: 100%;

  .login-header {
    width: 100%;
    height: 100px;
    line-height: 100px;
    padding-left: 80px;
    font-size: 26px;
    font-weight: bold;
    color: #606266;
  }

  .login-main {
    position: relative;
    width: 100%;
    height: calc(100% - 100px);

    .form-wrap {
      position: absolute;
      left: 50%;
      top: 20%;
      margin-left: -240px;
      width: 480px;
      height: 300px;
      padding: 60px;
      box-shadow: 0 6px 24px 0 rgb(144 147 153 / 20%);
    }
  }
}
</style>
