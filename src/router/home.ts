import type { RouteRecordRaw } from 'vue-router';

export default [
    {
        path: '',
        meta: {
            title: '首页',
            menu: true,
            icon: 'el-icon-warning',
            activeIcon: 'el-icon-warning',
        },
        children: [
            {
                path: '',
                name: 'home', // 只有子路由具有name属性
                meta: {
                    title: '概览',
                    permission: '',
                    menu: true,
                    icon: 'el-icon-s-home',
                    activeIcon: 'el-icon-s-home',
                    keepAlive: true,
                },
                component: () => import('@/views/Dashboard.vue')
            },
        ]
    },
] as RouteRecordRaw[]