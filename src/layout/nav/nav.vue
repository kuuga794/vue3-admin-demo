<template>
  <header class="nav-wrap" :class="{ shadow: isShaDow }">
    <div class="nav-module">
      <div class="nav-title">admin demo</div>
      <div class="nav-control">
        <el-dropdown popper-class="reset-element-popper">
          <span class="el-dropdown-link">
            {{ nickName || userName }}
            <el-icon class="el-icon--right" color="#ffffff">
              <arrow-down />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="handlePassword">修改密码</el-dropdown-item>
              <el-dropdown-item @click="handleLogout">退出系统</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>

        <div class="btn-group">
          <div class="btn-item" @click="downloadManual">
            <el-icon size="20px" color="#ffffff"><Collection /></el-icon>
            <p style="color: #ffffff">操作手册</p>
          </div>

          <div class="btn-item">
            <el-icon size="20px" color="#ffffff"><Bell /></el-icon>
            <p style="color: #ffffff">系统公告</p>

            <el-image
              style="
                position: absolute;
                bottom: 10px;
                right: 10px;
                width: 48px;
                height: 24px;
                opacity: 0;
              "
              :src="$baseUrl + '/profile/notice/notice.png'"
              :preview-teleported="true"
              :preview-src-list="[$baseUrl + '/profile/notice/notice.png']"
              fit="cover"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- <div class="breadcrumb-module">
      <Breadcrumb />
    </div> -->

    <div class="tab-module">
      <Tab />
    </div>
  </header>

  <dialog-password-editor ref="dialogPasswordEditorRef" />
</template>

<script setup lang="ts" name="Nav">
import Cookies from 'js-cookie';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import useUserStore from '@/store/modules/user';
import Tab from './components/Tab.vue';
// import Breadcrumb from './components/Breadcrumb.vue';
import DialogPasswordEditor from '@/components/DialogPasswordEditor.vue';
import * as ApiCommon from '@/api/common';

const $router = useRouter(); // Router
const userStore = useUserStore(); // 用户仓库
const userName = ref(userStore.userName || Cookies.get('c_userName')); // 用户名
const nickName = ref(userStore.nickName || Cookies.get('c_nickName')); // 用户名称
const dialogPasswordEditorRef = ref<any>(null); // 修改密码

const isShaDow = ref<boolean>(false); // 是否滚动

const handleScrollShadow = () => {
  window.addEventListener('scroll', () => {
    const { scrollTop } = document.documentElement;
    isShaDow.value = !!scrollTop;
  });
};

handleScrollShadow();

/**
 * 退出账号
 */
const handleLogout = () => {
  userStore.Logout().then(() => {
    $router.replace({ name: 'Login' });
  });
};

/**
 * 处理密码
 */
const handlePassword = () => {
  dialogPasswordEditorRef.value.showEditor();
};

/**
 * 下载供应商对账系统操作指引
 */
const downloadManual = () => {
  ApiCommon.downloadManual('供应商对账系统操作指引.pdf');
};
</script>

<style lang="scss" scoped>
.nav-wrap {
  position: fixed;
  top: 0;
  left: 200px;
  width: calc(100% - 200px);
  z-index: 99;

  &.shadow {
    box-shadow: 2px 8px 12px rgba(0, 0, 0, 0.12);
  }
}

.nav-module {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 60px;
  padding: 0 20px;
  color: #ffffff;
  background-color: var(--el-color-primary);

  .nav-title {
    font-size: 18px;
    color: #3f5362;
    color: #ffffff;
  }

  .nav-control {
    display: flex;
    align-items: center;

    .el-dropdown-link {
      color: #ffffff;
    }
  }

  .btn-group {
    display: flex;
    margin-left: 20px;
  }

  .btn-item {
    position: relative;
    display: flex;
    align-items: center;
    flex-direction: column;
    cursor: pointer;
    margin-left: 10px;
  }
}
</style>
