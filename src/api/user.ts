import request from '@/http/request';
import { downloadFileFromStream } from '@/utils/index';

// ----------- 用户 -----------

// 获取用户列表
export async function getList(data?: any) {
  const res = await request({
    url: '/system/user/list',
    method: 'GET',
    params: data,
  });
  return res;
}

// 添加用户
export async function createUser(data: any) {
  const res = await request({
    url: '/system/user',
    method: 'POST',
    data,
  });
  return res;
}

// 修改用户
export async function updateUser(data: any) {
  const res = await request({
    url: '/system/user',
    method: 'PUT',
    data,
  });
  return res;
}

// 删除用户
export async function deleteUser(data: any) {
  const res = await request({
    url: `/system/user/${data.userIds}`,
    method: 'DELETE',
    data,
  });
  return res;
}

// 启用/禁用用户
export async function switchUser(data: any) {
  const res = await request({
    url: '/system/user/changeStatus',
    method: 'PUT',
    data,
  });
  return res;
}

// 重置密码
export async function resetUser(data: any) {
  const res = await request({
    url: '/system/user/resetPwd',
    method: 'PUT',
    data,
  });
  return res;
}

// 根据供应商账号userName查询销货方的开票和银行信息
export async function getSupplierSellerInfo(data?: any) {
  const res = await request({
    url: `/system/user/getSupplierSellerInfo/${data.userName}`,
    method: 'GET',
  });
  return res;
}

// 修改保存销货方的开票和银行信息
export async function updateSupplierSellerInfo(data: any) {
  const res = await request({
    url: '/system/user/supplierSellerInfo',
    method: 'POST',
    data,
  });
  return res;
}

// ----------- 分配供应商 -----------

// 获取分配供应商列表
export async function getAllotSupplierList(data?: any) {
  const res = await request({
    url: '/system/user/supplierList',
    method: 'GET',
    params: data,
  });
  return res;
}

// 获取未分配的供应商
export async function getUnaSupplier(data?: any) {
  const res = await request({
    url: '/system/user/getUnaSupplier',
    method: 'GET',
    params: data,
  });
  return res;
}

// 为对账会计分配供应商
export async function Allot(data: any) {
  const res = await request({
    url: '/system/user/distSupplier',
    method: 'POST',
    data,
  });
  return res;
}

// 删除供应商
export async function unAllot(data: any) {
  const res = await request({
    url: '/system/user/removeDistSupplier',
    method: 'DELETE',
    data,
  });
  return res;
}

// ----------- 其他 -----------

// 获取所有供应商
export async function getSupplierAll(data?: any) {
  const res = await request({
    url: '/system/user/getSupplierAll',
    method: 'GET',
    params: data,
  });
  return res;
}

// 导出列表
export async function exportList(filename: string, data?: any) {
  const res = await request({
    url: '/system/user/export',
    method: 'POST',
    responseType: 'blob',
    data,
  }).then((data2) => downloadFileFromStream(data2, filename));
  return res;
}

// 批量修改报销人
export async function updateReimburser(data?: any) {
  const res = await request({
    url: '/system/user/updateReimburser',
    method: 'PUT',
    data
  });
  return res;
}