import type { RouteRecordRaw } from 'vue-router';

export default [
    {
        path: '/alert',
        meta: {
            title: '告警',
            menu: true,
            icon: 'el-icon-warning',
            activeIcon: 'el-icon-warning',
        },
        children: [
            {
                path: '/alert/network',
                name: 'network',
                meta: {
                    title: '网络告警',
                    permission: '',
                    menu: true,
                    icon: 'el-icon-s-home',
                    activeIcon: 'el-icon-s-home',
                    keepAlive: true,
                },
                component: () => import('@/views/Alert/Network.vue')
            },
            {
                path: '/alert/network/detail/:id',
                name: 'networkDetail',
                meta: {
                    title: (val: string) => `网络告警详情-${val}`,
                    permission: '',
                    menu: false,
                    icon: 'el-icon-s-home',
                    activeIcon: 'el-icon-s-home',
                    keepAlive: true,
                },
                component: () => import('@/views/Alert/Network.vue')
            },
            {
                path: '/alert/ip',
                meta: {
                    title: 'ip',
                    menu: true,
                    icon: 'el-icon-s-home',
                    activeIcon: 'el-icon-s-home',
                },
                children: [
                    {
                        path: '/alert/ip/v4',
                        name: 'ipv4',
                        meta: {
                            title: 'IPV4',
                            permission: '',
                            menu: true,
                            icon: 'el-icon-s-home',
                            activeIcon: 'el-icon-s-home',
                            keepAlive: true,
                        },
                        component: () => import('@/views/Alert/IP/V4.vue')
                    },
                    {
                        path: '/alert/ip/v6',
                        name: 'ipv6',
                        meta: {
                            title: 'IPV6',
                            permission: '',
                            menu: true,
                            icon: 'el-icon-s-home',
                            activeIcon: 'el-icon-s-home',
                            keepAlive: true,
                        },
                        component: () => import('@/views/Alert/IP/V6.vue')
                    }
                ]
            },
            {
                path: '/alert/baidu',
                name: 'baidu',
                meta: {
                    title: '百度',
                    permission: '',
                    menu: true,
                    icon: 'el-icon-s-home',
                    httpLink: 'https://www.baidu.com',
                },
                component: () => import('@/views/Blank.vue') // 占位
            },
        ]
    },

] as RouteRecordRaw[]