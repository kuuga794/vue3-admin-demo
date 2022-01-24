// 格式化日期时间
export default function dateFormat(time: string | number | Date, cFormat: string) {
  if (arguments.length === 0) {
    return null;
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
  let date;
  if (typeof time === 'object') {
    date = time;
  } else {
    if ((`${time}`).length === 10) time = parseInt(time) * 1000;
    date = new Date(time);
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(), // 周
  };
  const timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key];
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value]; }
    if (result.length > 0 && value < 10) {
      value = `0${value}`;
    }
    return value || 0;
  });
  return timeStr;
}

// 下载 excel 文件
export const downloadExcel = (data, filename: string) => {
  const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  document.body.appendChild(a);
  a.setAttribute('style', 'display:none');
  a.setAttribute('href', objectUrl);
  a.setAttribute('download', filename);
  a.click();
  URL.revokeObjectURL(objectUrl);
};

export const utf8ByteToUnicodeStr = (utf8Bytes) => {
  let unicodeStr = '';
  for (let pos = 0; pos < utf8Bytes.length;) {
    const flag = utf8Bytes[pos];
    let unicode = 0;
    if ((flag >>> 7) === 0) {
      unicodeStr += String.fromCharCode(utf8Bytes[pos]);
      pos += 1;
    } else if ((flag & 0xFC) === 0xFC) {
      unicode = (utf8Bytes[pos] & 0x3) << 30;
      unicode |= (utf8Bytes[pos + 1] & 0x3F) << 24;
      unicode |= (utf8Bytes[pos + 2] & 0x3F) << 18;
      unicode |= (utf8Bytes[pos + 3] & 0x3F) << 12;
      unicode |= (utf8Bytes[pos + 4] & 0x3F) << 6;
      unicode |= (utf8Bytes[pos + 5] & 0x3F);
      unicodeStr += String.fromCharCode(unicode);
      pos += 6;
    } else if ((flag & 0xF8) === 0xF8) {
      unicode = (utf8Bytes[pos] & 0x7) << 24;
      unicode |= (utf8Bytes[pos + 1] & 0x3F) << 18;
      unicode |= (utf8Bytes[pos + 2] & 0x3F) << 12;
      unicode |= (utf8Bytes[pos + 3] & 0x3F) << 6;
      unicode |= (utf8Bytes[pos + 4] & 0x3F);
      unicodeStr += String.fromCharCode(unicode);
      pos += 5;
    } else if ((flag & 0xF0) === 0xF0) {
      unicode = (utf8Bytes[pos] & 0xF) << 18;
      unicode |= (utf8Bytes[pos + 1] & 0x3F) << 12;
      unicode |= (utf8Bytes[pos + 2] & 0x3F) << 6;
      unicode |= (utf8Bytes[pos + 3] & 0x3F);
      unicodeStr += String.fromCharCode(unicode);
      pos += 4;
    } else if ((flag & 0xE0) === 0xE0) {
      unicode = (utf8Bytes[pos] & 0x1F) << 12;

      unicode |= (utf8Bytes[pos + 1] & 0x3F) << 6;
      unicode |= (utf8Bytes[pos + 2] & 0x3F);
      unicodeStr += String.fromCharCode(unicode);
      pos += 3;
    } else if ((flag & 0xC0) === 0xC0) { // 110
      unicode = (utf8Bytes[pos] & 0x3F) << 6;
      unicode |= (utf8Bytes[pos + 1] & 0x3F);
      unicodeStr += String.fromCharCode(unicode);
      pos += 2;
    } else {
      unicodeStr += String.fromCharCode(utf8Bytes[pos]);
      pos += 1;
    }
  }
  return unicodeStr;
};
