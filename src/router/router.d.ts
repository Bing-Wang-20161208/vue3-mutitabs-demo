// 这段可以直接添加到你的任何 `.ts` 文件中，例如 `router.ts`
// 也可以添加到一个 `.d.ts` 文件中。确保这个文件包含在
// 项目的 `tsconfig.json` 中的 "file" 字段内。
import 'vue-router'

// 为了确保这个文件被当作一个模块，添加至少一个 `export` 声明
export { }

declare module 'vue-router' {
    interface RouteMeta {
        /**
        * 是否需要登录
        */
        requireLogin?: boolean;
        /**
         * 是否需要缓存
         */
        keepAlive?: boolean;
        /**
         * http链接将会用a标签直接跳转
         */
        httpLink?: string;
        /**
         * 是否是layout
         */
        layout?: boolean;
        /**
         * 是否是菜单
         */
        menu?: boolean;
        /**
        * 菜单图标
        * @example el-icon-s-home
        */
        icon?: string;
        /**
         * 激活的菜单图标
         * @example el-icon-s-home
         */
        activeIcon?: string;
        /**
         * 菜单标题
         * 类型定义不能设置为函数，但是实际使用中可以自己传入函数
         */
        title?: any;
        /**
         * 权限
         */
        permission?: string;
    }
}