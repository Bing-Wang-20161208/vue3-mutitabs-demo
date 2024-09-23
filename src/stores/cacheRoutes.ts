import { defineStore } from "pinia"
import { useRoute, useRouter, type RouteLocationNormalizedGeneric } from "vue-router"

export enum RemoveType {
    ALL = 'ALL',
    ONE = 'ONE',
    OTHERS = 'OTHERS',
    RIGHT = 'RIGHT',
    LEFT = 'LEFT'
}
/** 删除页签 */
export type RemoveProps = { type?: RemoveType, path?: string }

// TODO 动态路由，如果【/1，/2】需要同时出现在多页签上，就需要处理动态路由的情况，这个依据情况而定，暂时不考虑   影响【setCacheRoutes, deleteCacheRoute】
// TODO 需要确定首页或其他是不是一定存在  影响【router.beforeEach, deleteCacheRoute】
/** 缓存、标签页 */
export const useCacheRoutesStore = defineStore('cacheRoutes', () => {
    const router = useRouter()
    const route = useRoute()
    const cacheRoutes = ref<RouteLocationNormalizedGeneric[]>([])
    const cacheComponentNames = computed(() => { // 根据已缓存的路由及keepAlive属性，缓存组件名称
        if (!cacheRoutes?.value) return []
        const names: string[] = []
        cacheRoutes.value.forEach(route => {
            const targetRoute = route.matched[route.matched.length - 1]
            if (targetRoute.meta.keepAlive) {
                names.push((targetRoute.components?.default as any).__name as string)
            }
        })
        return names;
    })
    /**
     * 更新cacheRoutes
     * @param to 路由对象
     */
    const setCacheRoutes = (to: RouteLocationNormalizedGeneric) => {
        if (!cacheRoutes.value || !cacheRoutes.value.length || cacheRoutes.value.every(route => route.fullPath !== to.fullPath)) {
            cacheRoutes.value?.push(to)
        }
    }
    /**
     * 删除cacheRoute
     */
    const deleteCacheRoute = ({ type = RemoveType.ALL, path }: RemoveProps) => {
        if (type === RemoveType.ALL) {
            cacheRoutes.value = [cacheRoutes.value[0]]
            router.push(cacheRoutes.value[0].path)
        } else if (type === RemoveType.ONE) {
            const index = cacheRoutes.value?.findIndex(route => route.path === path) || 1
            cacheRoutes.value = cacheRoutes.value?.filter(route => route.path !== path)
            path === route.fullPath && cacheRoutes.value && router.push(cacheRoutes.value[index - 1].path)
        } else if (type === RemoveType.OTHERS) {
            cacheRoutes.value = cacheRoutes.value?.filter(route => route.path !== path)
            router.push(path!)
        } else if (type === RemoveType.RIGHT) {
            cacheRoutes.value = cacheRoutes.value?.slice(0, cacheRoutes.value.findIndex(route => route.path === path) + 1)
            router.push(path!)
        } else if (type === RemoveType.LEFT) {
            cacheRoutes.value = cacheRoutes.value?.slice(cacheRoutes.value.findIndex(route => route.path === path))
            router.push(path!)
        }
    }
    return { cacheRoutes: cacheRoutes as unknown as RouteLocationNormalizedGeneric[], cacheComponentNames, setCacheRoutes, deleteCacheRoute }
})