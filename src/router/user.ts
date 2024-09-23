import type { RouteRecordRaw } from 'vue-router';

export default [
    {
        path: '/user',
        meta: {
            title: '用户',
            menu: true,
            icon: 'el-icon-warning',
            activeIcon: 'el-icon-warning',
        },
        children: [
            {
                path: '/user/name',
                name: '名称',
                meta: {
                    menu: false,
                    permission: ''
                },
                component: () => import('@/views/Dashboard.vue')
            },
        ]
    },
] as RouteRecordRaw[]