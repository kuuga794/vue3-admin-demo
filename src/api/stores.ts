import request from '@/utils/request';

// 区域列表 (3层)
export async function getRegionTree(params: object = {}) {
  const res = await request({
    url: '/regionalmanagement/listLargeAreaProvinceCity',
    params,
  });
  return res.data;
}

// 根据区域省级市级获取门店
export async function getStoreByRegion(params: object = {}) {
  const res = await request({
    url: '/regionalmanagement/storeListByRegion',
    params,
  });
  return res.data;
}
