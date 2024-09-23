import { defineStore } from 'pinia';

// 用户信息
export const useAccountStore = defineStore('account', () => {
    /** token */
    const token = ref<string>('')
    watchEffect(() => {
        // 存储到localStorage
        localStorage.setItem('token', token.value)
    })
    /** 登录 */
    const login = () => {
        // TODO 这里可能会包含用户输入的用户名密码的加密、验证、接口请求等操作
        token.value = ''
    }
    /** 登出 */
    const loginOut = () => {
        token.value = ''
    }
    return { token, login, loginOut }
});