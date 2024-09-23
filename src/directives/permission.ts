import { usePermissionsStore } from "@/stores/permissions"

/** 权限控制指令 */
export default {
  /**
   * 当元素挂载时，根据用户资源验证元素的可见性
   * 如果用户资源不符合绑定的资源值，将移除该元素
   *
   * @param {HTMLElement} el - 被挂载的元素
   * @param {Record<string, any>} binding - 绑定的数据，包含access属性，该属性存储了资源信息
   */
  mounted(el: HTMLElement, binding: Record<string, any>) {
    // 提取绑定对象中的value值，即资源信息
    const { value } = binding
    // 如果资源信息存在
    if (value) {
      // 从App.vue通过pinia传递的资源列表中获取用户资源
      const permissions = usePermissionsStore()
      // 检查用户资源是否包含当前资源信息
      if (!permissions.permissions?.includes(value)) {
        // 如果不包含，则从DOM中移除该元素
        el.parentNode && el.parentNode.removeChild(el)
      }
    }
  }
}
