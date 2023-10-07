import { ElMessage } from 'element-plus';


// 移除指定值属性，只适用于基础数据类型
export const deletePropertyByValue = (obj: any, val = null) => {
  const target = {};
  // eslint-disable-next-line no-restricted-syntax
  for (const key in obj) {
    if (obj[key] !== val && obj[key] !== undefined) {
      target[key] = obj[key];
    }
  }
  return target;
};

// 没符号时间拼接
export const formatTime = () => {
  const time = new Date()
  const y = time.getFullYear() // 可返回一个表示年份的 4 位数字
  const m = time.getMonth() + 1 < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1  // 可返回表示月份的数字。返回值是 0（一月） 到 11（十二月） 之间的一个整数 // 注意： 一月为 0, 二月为 1, 以此类推。
  const d = time.getDate() < 10 ? '0' + time.getDate() : time.getDate()
  const h = time.getHours() < 10 ? '0' + time.getHours() : time.getHours()
  const min = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()
  const seconds = time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds()
  return y.toString() + m.toString() + d.toString()
};

// 时间格式化
export const formatDate = (date: Date, fmt: string = 'YYYY-mm-dd HH:MM:SS') => {
  let ret;
  const opt = {
    'Y+': date.getFullYear().toString(), // 年
    'm+': (date.getMonth() + 1).toString(), // 月
    'd+': date.getDate().toString(), // 日
    'H+': date.getHours().toString(), // 时
    'M+': date.getMinutes().toString(), // 分
    'S+': date.getSeconds().toString(), // 秒
  };
  for (const k in opt) {
    ret = new RegExp(`(${k})`).exec(fmt);
    if (ret) {
      fmt = fmt.replace(
        ret[1],
        ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, '0'),
      );
    }
  }
  return fmt;
};

// 数组去重
export const uniqueFunc = (arr: any, uniId: string) => {
  const res = new Map();
  return arr.filter((item: any) => !res.has(item[uniId]) && res.set(item[uniId], 1));
};

export const uniqueFuncSaveLast = (arr: any, uniId: string) => {
  const hash = {};
  return arr.reduce((acc, cru, index) => {
    if (!hash[cru[uniId]]) {
      hash[cru[uniId]] = { index: acc.length }; // 就改了这一行代码，把保存的索引变成了当前acc的数组长度，很好的解决了问题
      acc.push(cru);
    } else {
      acc.splice(hash[cru[uniId]].index, 1, cru);
    }
    return acc;
  }, []);
};

// 金额格式化 --- 千分位，保留两位小数
export const formatMoney = (num: number, digit: number = 2) => {
  const targetNum = Number(num);
  let result = '0';
  if (targetNum) {
    result = targetNum.toLocaleString('zh', { minimumFractionDigits: digit });
  }
  return result;
};

// 数字转换中文大写
export const formatMoneyToChinese = (n: any) => {
  let prefix = '';
  if (n < 0) {
    prefix = '负';
  }
  if (n === 0 || !n) { return '零'; }
  n = Math.abs(n);
  if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n)) { return ''; }
  let unit = '仟佰拾亿仟佰拾万仟佰拾元角分'; let
    str = '';
  n += '00';
  const p = n.indexOf('.');
  if (p >= 0) { n = n.substring(0, p) + n.substr(p + 1, 2); }
  unit = unit.substr(unit.length - n.length);
  for (let i = 0; i < n.length; i++) { str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i); }
  const result = str.replace(/零(仟|佰|拾|角)/g, '零').replace(/(零)+/g, '零').replace(/零(万|亿|元)/g, '$1').replace(/(亿)万/g, '$1$2')
    .replace(/^元零?|零分/g, '')
    .replace(/元$/g, '元整');

  return prefix + result;
};

/**
 * bytesToSize
 * @param { * } sizes 文件大小
 */
export const bytesToSize = (bytes: any) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / k ** i).toFixed(2)} ${sizes[i]}`;
};

/**
 * 复制到剪切板
 * @param { String } val 复制文案
 */
export const copyText = (val: string) => {
  const text = val;
  const input = document.createElement('input');
  input.value = text;
  document.body.appendChild(input);
  input.select();
  document.execCommand('copy');
  document.body.removeChild(input);
  ElMessage.success('已复制到剪切板');
};

/**
 * 获取DOM里页面顶部距离
 * @param element 
 * @returns 
 */
export const getDistanceFromTop = (element) => {
  let distance = element.offsetTop
  let parent = element.offsetParent
  while (parent !== null) {
    distance += parent.offsetTop
    parent = parent.offsetParent
  }
  return distance
};

/**
 * list To Object
 * @param list 转换List
 * @param keyProp keyProp
 * @param valueProp valueProp
 * @returns
 */
 export const listToObject = (list: any[], keyProp: string = 'value', valueProp: string = 'label') => {
  return list.reduce((result, item) => {
    result[item[keyProp]] = item[valueProp];
    return result;
  }, {});
}

/**
 * 下载文件
 * @param stream 文件流
 * @param filename 文件名 --- 需带文件类型
 */
export const downloadFileFromStream = (stream: any, filename: string) => {
  const blob = new Blob([stream], { type: 'application/octet-stream' });
  if (navigator.msSaveBlob) { // 兼容IE和Edge浏览器
    navigator.msSaveBlob(blob, filename);
  } else {
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
