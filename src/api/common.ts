import request from '@/http/request';
import { downloadFileFromStream, downloadFileFromStream } from '@/utils/index';

// ----------- 文件管理 -----------

// 上传图片
export async function uploadFile(data: any) {
  const res = await request({
    url: '/business/product/quotate/upload',
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundaryh0T1ZikyvfmmdYkB',
    },
    data,
  });
  return res;
}

// 下载图片
export async function downloadImage(data: any) {
  const res = await request({
    url: '/file/download',
    method: 'GET',
    params: data,
  });
  return res;
}

// ----------- 全局通用 -----------

// 下载供应商对账系统操作指引
export async function downloadManual(filename: string) {
  const res = await request({
    url: '/system/file/userManual/download',
    method: 'GET',
    responseType: 'blob',
  }).then((data) => {
    downloadFileFromStream(data, filename, 'application/pdf');
  });
  return res;
}

// 获取角色类型列表
export async function getRoleList(params: any) {
  const res = await request({
    url: '/system/role/optionselect',
    method: 'GET',
    params,
  });
  return res;
}


// 下载公告
export async function downloadNotice(filename: string) {
  const res = await request({
    url: '/system/file/notice/download',
    method: 'GET',
  })
  return res;
}


// 预览公告
export async function previewNotice() {
  const res = await request({
    url: '/system/file/notice/url',
    method: 'GET',
  })
  return res;
}


