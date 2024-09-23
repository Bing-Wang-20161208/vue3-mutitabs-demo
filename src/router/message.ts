import type { RouteRecordRaw } from 'vue-router';

export default [
    {
        path: '/message',
        name: 'message',
        component: () => import('@/views/Message.vue')
    },
] as RouteRecordRaw[]