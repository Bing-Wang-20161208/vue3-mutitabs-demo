import { defineStore } from 'pinia';

// 权限store
export const usePermissionsStore = defineStore('permissions', () => {
    /** 权限数组 */
    const permissions = ref<string[]>()
    /** 加载权限，涉及到接口请求 */
    const loadPermissions = () => {
        permissions.value = [''];
    }
    return { permissions, loadPermissions }
});