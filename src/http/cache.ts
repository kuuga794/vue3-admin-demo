// import Qs from 'qs';

const MemoryCache = {
  data: {},
  set(key: string, value: any, maxAge: number) {
    this.data[key] = {
      maxAge: maxAge || 0,
      value,
      now: Date.now(),
    };
  },
  get(key: string) {
    const cachedItem = this.data[key];
    if (!cachedItem) return null;
    const isExpired = Date.now() - cachedItem.now > cachedItem.maxAge;
    if (isExpired) this.delete(key);
    return isExpired ? null : cachedItem.value;
  },
  delete(key: string) {
    return delete this.data[key];
  },
  clear() {
    this.data = {};
  },
};

/**
 * 根据当前请求的信息生成请求key，将作为缓存项的key（请求方式+请求地址+请求参数GET->params；POST-> data）
 */
function generateReqKey(config: any) {
  const {
    headers, method, url, params, data,
  } = config;
  return [headers.Authorization, method, url, JSON.stringify(params), JSON.stringify(data)].join('&');
}

/**
 * 用户判断传入的cache参数是否实现定义的cacheAPI，可自定义cache对象
 */
function isCacheLike(cache: any) {
  return !!(
    cache.set
    && cache.get
    && cache.delete
    && cache.clear
    && typeof cache.get === 'function'
    && typeof cache.set === 'function'
    && typeof cache.delete === 'function'
    && typeof cache.clear === 'function'
  );
}

/**
 * 控制数据缓存
 * @param {*} adapter 预增强的Axios适配器对象
 * @param {*} options 缓存配置对象，支持4个属性
 *  maxAge： 全局设置缓存的最大时间
 *  enableByDefault： 是否启用缓存，默认false
 *  cacheFlag： 缓存标志，用于配置请求config对象上的缓存属性
 *  defaultCache： 用于设置使用的缓存对象
 * @returns
 */
// eslint-disable-next-line import/prefer-default-export
export function cacheAdapterEnhancer(adapter: any, options: any) {
  const {
    maxAge,
    enabledByDefault = false,
    cacheFlag = 'cache',
    defaultCache = MemoryCache,
  } = options;
  return (config: any) => {
    const { method, forceUpdate } = config;
    const useCache = config[cacheFlag] || enabledByDefault;
    if (method === 'get' && useCache) {
      const cache = isCacheLike(useCache) ? useCache : defaultCache;
      const requestKey = generateReqKey(config); // 生成请求key
      let responsePromise = cache.get(requestKey); // 从缓存中获取请求key对应的响应对象
      if (!responsePromise || forceUpdate) {
        // 缓存未命中/失效或强制更新时，则重新请求数据
        responsePromise = (async () => {
          try {
            return await adapter(config); // 使用默认的xhrAdapater发送请求
          } catch (reason) {
            cache.delete(requestKey);
            throw reason;
          }
        })();
        cache.set(requestKey, responsePromise, maxAge); // 保存请求返回的响应对象
        return responsePromise; // 返回已保存的响应对象
      }
      return responsePromise;
    }
    return adapter(config); // 使用默认的xhrAdapter发送请求
  };
}
