import request from '@/http/request';


// 登录
export async function login(data: any) {
  const res = await request({
    url: '/login',
    method: 'POST',
    data,
  });
  return res;
}

// 获取用户信息
export function getInfo() {
  return request({
    url: '/getInfo',
    method: 'GET',
  });
}

// 修改密码
export function updatePassword(data: any) {
  return request({
    url: '/system/user/profile/updatePwd',
    method: 'PUT',
    params: data,
  });
}

// 获取验证码
export function getCaptcha() {
  return request({
    url: '/captchaImage',
    method: 'GET',
  });
}
