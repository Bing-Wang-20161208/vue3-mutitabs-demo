import { usePermissionsStore } from '@/stores/permissions';
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import home from './home';
import alert from './alert';
import message from './message';
import user from './user';
import { useCacheRoutesStore } from '@/stores/cacheRoutes';

/**
 * 约定
 * 1. 详情页不会写到列表路由的children里面，但是需要路由包含，用于解析父级路由
 * 2. router.d.ts里面有meta信息说明
 * 3. 默认加载 layout/Default.vue
 * 4. name属性只能根节点（可直接跳转的节点）才可以设置，包含http链接
 * 5. http链接菜单其他属性可以保持和普通根节点一致，meta添加一个httpLink属性即可
 * 6. 动态路由需要params:{id}
 */

const routes: RouteRecordRaw[] = [
  // 默认layout   正常情况下，只有这里面的路由才会被渲染出菜单
  {
    path: '',
    component: () => import('@/layout/Default.vue'),
    children: [...home, ...alert, ...user]
  },
  // layout2
  {
    path: '/blank-layout',
    component: () => import('@/layout/Blank.vue'),
    children: [...message]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/unauthorized',
    name: 'unauthorized',
    component: () => import('@/views/Unauthorized.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    component: () => import('@/views/404.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

// TODO 需要确定首页是不是一定存在，同时涉及到权限问题，登录成功之后跳转的页面
// 进入每一个页面前都需要校验权限，如果没有对应页面的权限，则跳转到404页面
// 导航守卫  return undefined | true 表示继续  return {name:'login',params:{fromPath: from.fullpath}}
router.beforeEach(async (to, from) => {
  const permissions = usePermissionsStore();

  // TODO 这段逻辑还有问题
  // 检查用户是否需要加载了权限
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!permissions.permissions) {
      // 如果还没有加载权限，则加载权限
      await permissions.loadPermissions();
    }

    // 检查是否有权限访问当前路由
    const hasRole = to.matched.some(record =>
      record.meta.permission ? permissions.permissions?.includes(record.meta.permission) : false
    );
    if (!hasRole) {
      // 如果没有权限，则重定向到无权限页面
      return '/unauthorized';
    }
  }
});

router.beforeResolve(async (to) => {
  // 只有default layout下的路由需要缓存
  if (to.matched[0].path === '') {
    // 缓存路由，主要用于多页签和keep-alive
    const cacheRoutes = useCacheRoutesStore()
    cacheRoutes.setCacheRoutes(to)
  }
})

export default router
