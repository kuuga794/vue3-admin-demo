
const keyName = 'reconciliation-'

type TypeParams = {
  name: string,
  content?: any,
  type: 'session' | 'local'
}

/**
 * 存储Storage
 */
export const setStorage = (params: TypeParams) => {
  let { name, content, type } = params
  name = keyName + name
  const obj = {
    dataType: typeof content,
    content: content,
    type: type,
    datetime: new Date().getTime()
  }
  if (type === 'session') {
    window.sessionStorage.setItem(name, JSON.stringify(obj))
  } else {
    window.localStorage.setItem(name, JSON.stringify(obj))
  }
}

/**
 * 获取Storage
 */
export const getStorage = (params: TypeParams) => {
  let { name, type } = params
  name = keyName + name
  let obj: any = {}
  let content: any
  obj = type === 'session' ? window.sessionStorage.getItem(name) : window.localStorage.getItem(name)
  obj = JSON.parse(obj)
  if (!obj) return
  if (obj.dataType === 'string') {
    content = obj.content
  } else if (obj.dataType === 'number') {
    content = Number(obj.content)
  } else if (obj.dataType === 'boolean') {
    content = eval(obj.content)
  } else if (obj.dataType === 'object') {
    content = obj.content
  }
  return content
}

/**
 * 删除Storage
 */
export const removeStorage = (params: TypeParams) => {
  let { name, type } = params
  name = keyName + name
  if (type === 'session') {
    window.sessionStorage.removeItem(name)
  } else {
    window.localStorage.removeItem(name)
  }
}

/**
 * 清空全部Storage
 */
export const clearStorage = (params: TypeParams) => {
  const { type } = params
  if (type === 'session') {
    window.sessionStorage.clear()
  } else {
    window.localStorage.clear()
  }
}
