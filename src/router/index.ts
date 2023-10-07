import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import Cookies from 'js-cookie';
import useUserStore from '@/store/modules/user';
import useCommonStore from '@/store/modules/common';
import usePageStore from '@/store/modules/page';
import Layout from '../layout/index.vue';
import CenterPage from '../layout/center-page.vue';

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Dashboard',
    component: Layout,
    redirect: '/dashboard',
    meta: {
      title: '首页',
      icon: 'Document',
      hidden: true,
    },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../views/dashboard/dashboard.vue'),
        meta: { title: '首页', hidden: true },
      },
    ],
  },

  {
    path: '/user',
    name: 'User',
    component: Layout,
    redirect: '/user/user-list',
    meta: {
      title: '账号管理',
      icon: 'User',
      onlyShowParent: false,
      code: '1,6,8',
    },
    children: [
      {
        path: 'user-list',
        name: 'UserList',
        component: () => import('../views/user/user-list.vue'),
        meta: { title: '账号管理', keepAlive: false },
      },
    ],
  },

  {
    path: '/system',
    name: 'System',
    component: Layout,
    redirect: '/system/file',
    meta: {
      title: '系统维护',
      icon: 'Operation',
      onlyShowParent: false,
      code: '1,6',
    },
    children: [
      {
        path: 'file',
        name: 'SystemFile',
        component: () => import('../views/system/file.vue'),
        meta: { title: '文件管理', keepAlive: false },
      },
    ],
  },

  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/login/login.vue'),
    meta: { title: '登录', hidden: true },
  },
  {
    path: '/403',
    name: '403',
    component: () => import('../views/error/403.vue'),
    meta: { title: '403', hidden: true },
  },
  {
    path: '/404',
    name: '404',
    component: () => import('../views/error/404.vue'),
    meta: { title: '404', hidden: true },
  },
  {
    path: '/:pathMath(.*)',
    redirect: '/404',
    meta: { title: '404', hidden: true },
  },
];

export const router = createRouter({
  // process.env.BASE_URL
  history: createWebHashHistory(''),
  routes,
});

const whiteList: string[] = ['/login', '/404', '/403']; // 不重定向白名单
router.beforeEach(async (to, from, next) => {
  // 无c_token等于没登录, 跳转到登录页
  const cookieToken = Cookies.get('c_token');
  const isWhite = whiteList.includes(to.path);
  const userStore = useUserStore();
  const commonStore = useCommonStore();
  const pageStore = usePageStore();

  // 全局拉取通用信息, 白名单不需要
  if (!isWhite && cookieToken) {
    await userStore.GetInfo(); // 获取用户信息
    await commonStore.GetRoleList(); // 获取角色列表
  }

  if (!isWhite && !cookieToken) {
    next('/login');
  }

  // CODE为不校验身份，直接通过
  const toCode = to.meta?.code;
  const { roleId } = userStore;
  // 有Code且 当前登录身份不在code内跳转到无权限页
  if (toCode && toCode.indexOf(roleId) < 0) {
    next('/403');
  }

  // 有token并登录页跳首页
  if (to.name === 'Login' && cookieToken) {
    next('/');
  }

  // 只记录非白名单内并不隐藏的
  if (!isWhite && !to.meta.hidden) {
    const toData = {
      name: to.name,
      title: to.meta.title,
      fullPath: to.fullPath,
    };
    pageStore.AddPage(toData);
  }

  next();
});

//解决三级菜单keep-alive缓存失效
router.beforeResolve((to, from, next) => {
  if (to.matched && to.matched.length > 2) {
    to.matched.splice(1, to.matched.length - 2);
  }
  next();
});
