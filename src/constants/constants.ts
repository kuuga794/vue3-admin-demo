import { listToObject } from '@/utils/index';

// 业务类型
export const CONST_BUS_TYPE = [
  { label: '成品采购', value: 1 },
  { label: '委托加工', value: 2 },
];
export const CONST_BUS_TYPE_OBJ = listToObject(CONST_BUS_TYPE)

// 账单类型
export const CONST_BILL_TYPE = [
  { label: '成品采购对账单', value: 1 },
  { label: '委托加工对账单', value: 2 },
];
export const CONST_BILL_TYPE_OBJ = listToObject(CONST_BILL_TYPE)

// 业务实体
export const CONST_BUS_ENTITY = [
  { label: '周六福珠宝股份有限公司', value: '0001' },
  { label: '周六福电子商务有限公司', value: '0007' },
  { label: '深圳市周六福零售电商有限公司', value: '0057' },
];
export const CONST_BUS_ENTITY_OBJ = listToObject(CONST_BUS_ENTITY)


// 事务类型
export const CONST_TRANSAC_TYPE_RETURN = [
  { label: '退票', value: 1 },
  { label: '入库', value: 2 },
  { label: '拆货', value: 3 },
];
export const CONST_TRANSAC_TYPE_RETURN_OBJ = listToObject(CONST_TRANSAC_TYPE_RETURN)

// 账单状态
export const CONST_BILL_STATUS = [
  { label: '待签发', value: 1 },
  { label: '待确认', value: 2 },
  { label: '待上传发票', value: 3, hidden: true },
  { label: '待匹配', value: 4 },
  { label: '待核销', value: 5 },
  { label: '待付款', value: 6 },
  { label: '付款中', value: 7 },
  { label: '已完成', value: 8 },
  { label: '已删除', value: 9 },
];
export const CONST_BILL_STATUS_OBJ = listToObject(CONST_BILL_STATUS)

// 销方 === 供应商
// 购方 === 下面三个
// 票信息与银行信息
export const CONST_BUS_ENTITY_INFO_OBJ = {
  '0007': {
    value: '0007',
    label: '周六福电子商务有限公司',
    buyerName: '周六福电子商务有限公司',
    bankAccount: '44250100017000001526',
    taxRegistraNo: '91440300MA5EJDRY8K',
    openBranch: '中国建设银行股份有限公司深圳水贝珠宝支行',
    addressPhone: '深圳市前海深港合作区南山街道临海大道59号海运中心口岸楼3楼N323 0755-22724322',
    openBranchAccount: '中国建设银行股份有限公司深圳水贝珠宝支行 44250100017000001526',
  },
  '0057': {
    value: '0057',
    label: '深圳市周六福零售电商有限公司',
    buyerName: '深圳市周六福零售电商有限公司',
    bankAccount: '755960471410805',
    taxRegistraNo: '91440300MA5HC0GK2X',
    openBranch: '招商银行股份有限公司深圳向西支行',
    addressPhone:
      '深圳市前海深港合作区前湾一路1号A栋201室（入驻深圳市前海商务秘书有限公司）0755-22724322',
    openBranchAccount: '招商银行股份有限公司深圳向西支行 755960471410805',
  },
  '0001': {
    value: '0001',
    label: '周六福珠宝股份有限公司',
    buyerName: '周六福珠宝股份有限公司',
    bankAccount: '44201511400052504602',
    taxRegistraNo: '91440300761957253T',
    openBranch: '中国建设银行股份有限公司深圳水贝珠宝支行',
    addressPhone: '深圳市罗湖区翠竹北路水贝石化工业区一栋 1-3西边、4层整层0755-25633202',
    openBranchAccount: '中国建设银行股份有限公司深圳水贝珠宝支行 44201511400052504602',
  },
};

// 账单发票匹配状态
export const CONST_MATCH_STATUS = [
  { label: '待核销', value: 1 },
  { label: '待付款', value: 2 },
  { label: '付款中', value: 3 },
  { label: '已完成', value: 4 },
  { label: '已取消', value: 5 },
  { label: '已删除', value: 6 },
];
export const CONST_MATCH_STATUS_OBJ = listToObject(CONST_MATCH_STATUS)

// 购货方信息
export const CONST_BUYER_DATA = {
  accounName: '', // 收票人姓名 & 财务联系人姓名
  takerAddress: '深圳市罗湖区莲塘鹏基工业区702栋6楼东周六福电商', // 收票人地址
  takerPhone: '0755-22740790-808', // 收票人电话
  financePhone: '0755-22740790-808', // 财务联系人电话
  financeEmail: 'zlfdsdz@zlf.cn', // 财务联系人邮箱
};

// 名称维护可选类型
export const CONST_MAINTENANCE_NAME = [
  { label: '饰品大类', value: '饰品大类' },
  { label: '金石名称', value: '金石名称' },
  { label: '开票名称', value: '开票名称' },
  { label: '成色名称', value: '成色名称' },
  { label: '原料名称', value: '原料名称' },
];

// 加盟商入网选项
export const CONST_FRANCHISEE_NET = [
  {
    value: '是',
    label: '是',
  },
  {
    value: '否',
    label: '否',
  },
];

// 报价类型
export const CONST_QUOTE_TYPE = [
  { label: '素金工费', value: 1 },
  { label: '镶嵌工费', value: 2 },
];
export const CONST_QUOTE_TYPE_OBJ = listToObject(CONST_QUOTE_TYPE)

// 产品报价状态
export const CONST_QUOTE_STATUS = [
  { label: '草稿', value: 1 },
  { label: '待审核', value: 2 },
  { label: '待审批', value: 3 },
  { label: '审批通过', value: 4 },
  { label: '审核不通过', value: 5 },
  { label: '审批不通过', value: 6 },
];
export const CONST_QUOTE_STATUS_OBJ = listToObject(CONST_QUOTE_STATUS)

// 入网类型
export const CONST_RW_TYPE = [
  { label: '结价入库', value: 1 },
  { label: '结料入库', value: 2 },
];
export const CONST_RW_TYPE_OBJ = listToObject(CONST_RW_TYPE)

// 款号管理状态
export const CONST_STYLE_STATUS = [
  { label: '已启用', value: 1 },
  { label: '已停用', value: 2 },
  { label: '已作废', value: 3 },
];
export const CONST_STYLE_STATUS_OBJ = listToObject(CONST_STYLE_STATUS)
