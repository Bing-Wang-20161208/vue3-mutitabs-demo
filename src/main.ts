import './assets/css/reset.scss'
import './assets/css/global.scss'

import { createPinia } from 'pinia'

import uploader from 'vue-simple-uploader'
import 'vue-simple-uploader/dist/style.css'

import App from './App.vue'
import router from './router'
import auth from './directives/permission'
import { usePermissionsStore } from './stores/permissions'

const app = createApp(App)

// vue-simple-uploader
app.use(uploader)
// 路由
app.use(router)
// pinia
app.use(createPinia())
// 按钮权限
app.directive('auth', auth)

// 初始化权限
const permissions = usePermissionsStore();

// 检查登录状态
const isLoggedIn = localStorage.getItem('accessToken') !== null; // 假设 accessToken 是登录后的 token

if (isLoggedIn) {
    // 用户已登录，加载权限
    permissions.loadPermissions();
}

app.mount('#app')
