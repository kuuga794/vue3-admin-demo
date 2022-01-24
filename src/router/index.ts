import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import Cookies from 'js-cookie';
import Layout from '../layout/index.vue';
import useUserStore from '@/store/modules/user';

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Layout',
    redirect: '/dashboard',
    component: Layout,
    meta: { title: '首页', icon: 'odometer', onlyShowParent: true },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../views/dashboard/dashboard.vue'),
        meta: { title: '首页', icon: 'odometer' },
      },
    ],
  },
  {
    path: '/report',
    name: 'Report',
    redirect: '/report/store-operations',
    component: Layout,
    meta: { title: '统计报表', icon: 'data-analysis', code: 'BB1001' },
    children: [
      {
        path: 'store-operations',
        name: 'StoreOperations',
        component: () => import('../views/report/storeOperations.vue'),
        meta: { title: '门店运营', code: 'BB1002' },
      },
      {
        path: 'use-analysis',
        name: 'UseAnalysis',
        component: () => import('../views/report/useAnalysis.vue'),
        meta: { title: '使用分析', code: 'BB1003' },
      },
      {
        path: 'goods-sales',
        name: 'GoodsSales',
        component: () => import('../views/report/goodsSales.vue'),
        meta: { title: '商品销售', code: 'BB1004' },
      },
      {
        path: 'activity-data',
        name: 'ActivityData',
        component: () => import('../views/report/activityData.vue'),
        meta: { title: '活动数据', code: 'BB1005' },
      },
      {
        path: 'conversion-analysis',
        name: 'ConversionAnalysis',
        component: () => import('../views/report/conversionAnalysis.vue'),
        meta: { title: '转化分析', code: 'BB1006' },
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
    path: '/404',
    name: '404',
    component: () => import('../views/error/404.vue'),
    meta: { title: '404', hidden: true },
  },
];

export const router = createRouter({
  // process.env.BASE_URL
  history: createWebHashHistory(''),
  routes,
});

const whiteList: string[] = ['/login', '/updating']; // 不重定向白名单

router.beforeEach(async (to, from, next) => {
  // 白名单不需要token
  if (whiteList.indexOf(to.path) !== -1) {
    next();
    return;
  }

  const token = Cookies.get('token');
  const userStore = useUserStore();
  const permCodes = userStore.getPermCodes;

  // 无token跳转到登录页
  if (!token) {
    next(`/login?redirect=${to.path}`);
    return;
  }

  // 有token有权限直接next
  if (permCodes.length) {
    next();
    return;
  }

  // 有token无权限请求权限
  const userInfo:any = await userStore.GetUserInfo();
  if (!to.meta.code || userInfo.permCodes.includes(to.meta.code)) {
    next();
  } else {
    userStore.LogOut();
    next('/login');
  }
});
