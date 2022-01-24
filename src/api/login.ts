import request from '@/utils/request';

// 登录
export async function login(data: any) {
  const res = await request({
    url: '/sysuser/login',
    method: 'post',
    data: {
      tenantId: 1,
      mobile: data.username,
      password: data.password,
      code: data.imageCode,
      uuid: data.uuid,
      brandType: 1,
      type: 0,
    },
  });
  return res;
}

// 退出登录
export function logout() {
  return request({
    url: '/user/logout',
    method: 'post',
  });
}

// 通过token获取用户信息
export async function getUserInfo(params = {}) {
  const res = await request({
    url: '/sysuser/getsysuser',
    params,
  });
  return res;
}
