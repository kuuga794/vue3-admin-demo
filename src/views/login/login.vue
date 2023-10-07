<template>
  <div class="app-wrap">
    <h1 class="login-header">供应商对账系统</h1>

    <!-- S 登录框 -->
    <div class="login-main">
      <div class="welcom-wrap"></div>
      <div class="form-wrap login">
        <div class="logo"></div>
        <div class="welcome">欢迎来到供应商对账系统</div>
        <el-form
          ref="formRef"
          :model="state.loginForm"
          status-icon
          @keydown.enter.native="submit()"
        >
          <el-form-item prop="username">
            <el-input
              class="login-input reset-element-input"
              v-model="state.loginForm.username"
              clearable
              placeholder="用户名"
              size="large"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              class="login-input reset-element-input"
              v-model="state.loginForm.password"
              placeholder="密码"
              size="large"
              type="password"
              show-password
              clearable
            />
          </el-form-item>
          <el-form-item prop="captcha" style="margin-bottom: 24px">
            <el-input
              class="login-input reset-element-input"
              v-model="state.loginForm.code"
              placeholder="验证码"
              size="large"
              clearable
            >
              <template #append>
                <el-image class="captcha-image" :src="state.captchaImage" @click="getCaptcha()" />
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button style="width: 100%" size="large" type="primary" @click="submit()"
              >登录</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!-- E 登录框 -->

    <!-- S 备案信息 -->
    <div class="copyright-text">
      <div class="copyright-item">
        <el-link :underline="false" href="https://www.xiaoyudi.cn/" target="_blank">
          技术支持：深圳市小雨滴信息技术有限公司
        </el-link>
      </div>
      <div class="copyright-item">
        <p>COPYRIGHT © 2014 ZLF 周六福珠宝股份有限公司 ALL RIGHTS RESERVED.</p>
        <el-link :underline="false" href="https://beian.miit.gov.cn/" target="_blank">
          粤ICP备13087551号
        </el-link>
      </div>
      <div class="copyright-item">
        <img src="https://www.zlf.cn/_nuxt/footer_icon_badge.a20583c8.png" />
        <el-link
          :underline="false"
          href="https://www.beian.gov.cn/portal/registerSystemInfo?recordcode=44030302001449"
          target="_blank"
        >
          粤公网安备 44030302001449号
        </el-link>
      </div>
    </div>
    <!-- E 备案信息 -->
  </div>
</template>

<script setup lang="ts" name="Login">
import { onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import aesEncrypt from '@/utils/crypto';
import useUserStore from '@/store/modules/user';
import usePageStore from '@/store/modules/page';
import * as ApiLogin from '@/api/login';

const $router = useRouter(); // Router
const userStore = useUserStore(); // 用户仓库
const pageStore = usePageStore(); // 用户仓库

const state = reactive({
  loading: false, // 登录CD
  captchaImage: '',
  loginForm: {
    username: '', // 用户名
    password: '', // 密码
    code: '', // 验证码
    uuid: '', // uuid
  },
});

/**
 * 获取验证码
 */
const getCaptcha = () => {
  ApiLogin.getCaptcha().then((res: TypeResponse) => {
    state.captchaImage = `data:image/jpg;base64,${res.img}`;
    state.loginForm.uuid = res.uuid;
    state.loginForm.code = '';
    pageStore.DeleteAllPage();
  });
};

/**
 * 登录
 */
const submit = () => {
  if (!state.loginForm.username || !state.loginForm.password || !state.loginForm.code) {
    ElMessage.warning('请输入用户名，密码和验证码');
    return;
  }
  state.loading = true;

  const emitData = {
    username: state.loginForm.username,
    password: aesEncrypt(state.loginForm.password, 'pigxpigxpigxpigx'),
    code: state.loginForm.code,
    uuid: state.loginForm.uuid,
  };

  userStore
    .Login(emitData)
    .then(() => {
      $router.replace('/');
    })
    .catch(() => {
      getCaptcha();
    })
    .finally(() => {
      state.loading = false;
    });
};

/**
 * onMounted
 */
onMounted(() => {
  getCaptcha();
});
</script>

<style lang="scss" scoped>
.app-wrap {
  position: relative;
  width: 100%;
  height: 100%;

  .login-header {
    font-size: 0;
  }

  .login-main {
    display: flex;
    justify-content: center;
    position: absolute;
    top: 50%;
    left: -24px;
    transform: translateY(-70%);
    width: 100%;

    .welcom-wrap {
      width: 894px;
      height: 476px;
      margin-right: 140px;
      background: url('@/assets/images/login-img.png') no-repeat 100% / cover;
    }

    .form-wrap {
      width: 400px;
      height: 456px;
      padding: 44px;

      .login-input {
        border-radius: 4px;
        background-color: #f8f8f8;
      }

      .logo {
        width: 200px;
        height: 88px;
        margin: 0 auto;
        background: url('@/assets/images/login-logo.jpg') no-repeat 100% / cover;
      }

      .welcome {
        text-align: center;
        font-size: 20px;
        margin: 12px 0 40px;
      }
    }
  }

  .copyright-text {
    display: flex;
    flex-direction: column;
    position: absolute;
    left: 0;
    bottom: 32px;
    width: 100%;

    .copyright-item {
      display: flex;
      justify-content: center;
      align-items: center;
      line-height: 32px;

      a {
        font-size: 14px;
        color: #606266;
      }

      p {
        margin-right: 5px;
        font-size: 14px;
        color: #606266;
      }

      img {
        margin-right: 5px;
      }
    }
  }
}

.captcha-image {
  width: 100px;
  height: 40px;
  cursor: pointer;
}

.error-tips {
  opacity: 0;
  pointer-events: none;
  text-indent: 8px;

  &.show {
    opacity: 1;
    pointer-events: initial;
  }
}
</style>
