import request from '@/utils/request';
import { downloadExcel } from '@/utils';

// ----------- 使用分析表 -----------
// 区域分析列表
export async function regionAnalysisList(params: object) {
  const res = await request({
    url: '/shopOperationReport/scope',
    params,
  });
  return res;
}

// 门店分析列表
export async function storeAnalysisList(params: object) {
  const res = await request({
    url: '/shopOperationReport/shop',
    params,
  });
  return res;
}

// 导购分析列表
export async function employeeAnalysisList(params: object) {
  const res = await request({
    url: '/shopOperationReport/guider',
    params,
  });
  return res;
}

// 区域分析导出
export async function regionAnalysisExport(params: object, filename: string) {
  const data = await request({
    url: '/shopOperationReport/exportOfScope',
    headers: { 'Content-type': 'application/json' },
    responseType: 'arraybuffer',
    params,
  });
  return downloadExcel(data, filename);
}

// 门店分析导出
export async function storeAnalysisExport(params: object, filename: string) {
  const data = await request({
    url: '/shopOperationReport/exportOfShop',
    headers: { 'Content-type': 'application/json' },
    responseType: 'arraybuffer',
    params,
  });
  return downloadExcel(data, filename);
}

// 导购分析导出
export async function employeeAnalysisExport(params: object, filename: string) {
  const data = await request({
    url: '/shopOperationReport/exportOfGuider',
    headers: { 'Content-type': 'application/json' },
    responseType: 'arraybuffer',
    params,
  });
  return downloadExcel(data, filename);
}
