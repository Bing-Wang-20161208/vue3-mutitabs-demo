import { defineStore } from 'pinia';
import { usePermissionsStore } from './permissions';
import { filterRoutes } from '@/utils/router'
import { useRoute, useRouter, type RouteRecordRaw } from 'vue-router'

// 菜单，包含当前选中的菜单列表、当前选中的菜单对应的子菜单
export const useMenuStore = defineStore('menu', () => {
    const permissions = usePermissionsStore();
    const route = useRoute()
    const router = useRouter()
    const routes = router.getRoutes()
    const menus = computed(() => filterRoutes(routes[1].children || [], permissions.permissions || []))
    // 当前选中的菜单路径列表[gpp, gp, ..., self]
    const activeMenus = computed(() => route.matched)
    const childrenMenus = computed(() => { // 当前选中的一级菜单的子孙菜单
        if (activeMenus.value?.length) {
            return menus.value.find(route => route.path === activeMenus.value?.[1].path)?.children
        }
        return []
    })
    return { menus: menus as unknown as RouteRecordRaw[], childrenMenus: childrenMenus as unknown as RouteRecordRaw[], activeMenus }
});
