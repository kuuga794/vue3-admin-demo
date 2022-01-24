export {};

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
  }
}
