import { type RouteRecordRaw } from 'vue-router'

/**
 * 路由筛选，用于菜单
 * 筛选条件：1.权限 2.menu属性 3.当存在children时，需要根据权限和menu属性进行筛选之后，判断children是否为空数组，如果为空，就不能存在该路由
 * @param routes 路由列表
 * @param roles 角色列表
 * @param cb 自定义筛选条件
 */
export const filterRoutes = (routes: RouteRecordRaw[], permissions: string[], cb?: (route: RouteRecordRaw) => boolean): RouteRecordRaw[] => routes.filter(route => {
    if (!route.meta?.menu || (route.meta?.permission && !permissions.includes(route.meta.permission)) || (cb && !cb(route)) || (route.children && !route.children.length)) {
        return false
    } else if (route.children?.length) {
        route.children = filterRoutes(route.children, permissions)
        if (!route.children?.length) return false
    }
    return true
})

/**
 * 获取第一个有name属性的路由对象，表示可以直接通过name跳转的路由
 * @param routes 路由对象数组，这里的数组应该是经过filterRoutes处理过的路由对象数组
 * @param key 匹配的路由path
 */
export const getFirstRealRoute = (routes: RouteRecordRaw[], key = '/'): RouteRecordRaw | undefined => {
    let result: RouteRecordRaw | undefined = undefined;
    function find(routes: RouteRecordRaw[]) {
        for (let i = 0; i < routes.length; i++) {
            const route = routes[i];
            if (route.name) {
                result = route;
                break;
            } else if (route.children) {
                find(route.children);
            }
        }
    }
    find(routes?.filter(route => route.path === key))
    return result;
}

/**
 * path拆解
 * 举例： "/alert/network/detail/:id” 将这样的字符串转化为数组  ['/alert/network/detail/:id', '/alert/network/detail', '/alert/network', '/alert']
 * @param path 路径字符串
 */
export const splitPath = (path: string): string[] => {
    const parts = [];
    const paths = path.split('/')
    for (let i = 0; i < paths.length; i++) { // 从后向前遍历
        if (paths[i]) {
            parts.unshift(paths.slice(0, i + 1).join('/'));
        }
    }
    return parts;
}