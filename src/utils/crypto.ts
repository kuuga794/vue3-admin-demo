import CryptoJS from 'crypto-js';

/**
 * AES 加密
 * @word 要加密的内容
 * @key String  服务器随机返回的关键字
 *  */
export default function aesEncrypt(word: string, keyWord: string = 'XwKsGlMcdPMEhR1B'): string {
  const key = CryptoJS.enc.Latin1.parse(keyWord);
  const srcs = CryptoJS.enc.Latin1.parse(word);
  const encrypted = CryptoJS.AES.encrypt(srcs, key, {
    iv: key,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.ZeroPadding,
  });
  return encrypted.toString();
}
