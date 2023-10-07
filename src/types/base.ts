declare module 'vue-router' {
  interface RouteMeta extends Record<string | number | symbol, unknown> {
    /** 标题 */
    title: string;
    /** 当前路由权限 */
    code?: string;
    /** 菜单图标 */
    icon?: string;
    /** 当前路由是否需要权限验证 */
    hidden?: boolean;
    /** 外部链接 */
    link?: string
  }
}

declare module 'axios' {
  interface AxiosRequestConfig {
    /** 是否缓存 */
     cache?: boolean;
  }
}

declare module 'vue' { 
  interface ComponentCustomProperties {
     $hasPermission: (key: string) => boolean
     $baseUrl: string
  } 
}

export {}

