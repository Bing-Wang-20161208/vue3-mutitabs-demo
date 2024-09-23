<script setup lang="ts">
import { useCacheRoutesStore, RemoveType } from '@/stores/cacheRoutes'
import { useRoute, useRouter, type RouteLocationNormalizedGeneric } from 'vue-router'

const contextMenuRoute = ref<RouteLocationNormalizedGeneric>() // 右键tab的route
const buttonRef = ref<EventTarget | null>() // 触发下拉菜单的ref
const popoverRef = ref() // 下拉菜单的ref
const visible = ref(false) // 下拉菜单是否可见
const router = useRouter()
const route = useRoute()
const cacheRoutes = useCacheRoutesStore()
const menuBtns = ref<RemoveType[]>([
  RemoveType.ALL,
  RemoveType.LEFT,
  RemoveType.RIGHT,
  RemoveType.OTHERS,
  RemoveType.ONE
])
const activeTab = computed({
  get() {
    return route.fullPath
  },
  // 不需要el-tabs默认的更新activeTab
  set() {}
})
onMounted(() => {
  document.addEventListener('click', () => setContextMenuVisible(false))
})
onUnmounted(() => {
  document.removeEventListener('click', () => setContextMenuVisible(false))
})
const setContextMenuVisible = (vis: boolean) => {
  visible.value = vis
}
// 切换tab
const handleTabClick = (pane: any) => {
  router.push(pane.paneName)
}
// 右键tab
const handleContextMenu = (e: MouseEvent) => {
  const target = e.target as any
  // 检查目标元素是否为标签页
  if (target?.classList.contains('el-tabs__item')) {
    buttonRef.value = target
    const fillPath = target.id.split('-')[1]
    const index = cacheRoutes.cacheRoutes.findIndex((item) => item.fullPath === fillPath)
    contextMenuRoute.value = cacheRoutes.cacheRoutes[index]
    if (cacheRoutes.cacheRoutes.length > 1) {
      switch (index) {
        case 0:
          menuBtns.value = [RemoveType.RIGHT]
          break
        case cacheRoutes.cacheRoutes.length - 1:
          menuBtns.value = [RemoveType.ALL, RemoveType.LEFT, RemoveType.ONE]
          break
        default:
          break
      }
      setContextMenuVisible(true)
    }
  } else {
    setContextMenuVisible(false)
  }
}
</script>
<template>
  <div class="multiTabs">
    <el-tabs
      v-model="activeTab"
      type="border-card"
      @tab-click="handleTabClick"
      @tab-remove="
        (name) => cacheRoutes.deleteCacheRoute({ type: RemoveType.ONE, path: name as string })
      "
      @contextmenu.prevent="handleContextMenu"
    >
      <!-- TODO 一定存在的那一个tab -->
      <el-tab-pane
        v-for="(route, index) in cacheRoutes.cacheRoutes"
        :closable="index !== 0"
        :key="route.path"
        :name="route.fullPath"
        :label="
          typeof route.meta.title === 'function'
            ? route.meta.title(route.params.id)
            : route.meta.title
        "
      />
    </el-tabs>
    <el-popover
      popper-class="contextMenuPopover"
      placement="bottom"
      ref="popoverRef"
      :visible="visible"
      :popper-options="{
        modifiers: [
          {
            name: 'computeStyles',
            options: {
              adaptive: false,
              enabled: false
            }
          }
        ]
      }"
      :virtual-ref="buttonRef"
      virtual-triggering
    >
      <el-space direction="vertical">
        <el-button
          v-if="menuBtns.includes(RemoveType.ONE)"
          text
          @click="
            cacheRoutes.deleteCacheRoute({ type: RemoveType.ONE, path: contextMenuRoute?.fullPath })
          "
        >
          关闭
        </el-button>
        <el-button
          v-if="menuBtns.includes(RemoveType.LEFT)"
          text
          @click="
            cacheRoutes.deleteCacheRoute({
              type: RemoveType.LEFT,
              path: contextMenuRoute?.fullPath
            })
          "
        >
          关闭左边
        </el-button>
        <el-button
          v-if="menuBtns.includes(RemoveType.RIGHT)"
          text
          @click="
            cacheRoutes.deleteCacheRoute({
              type: RemoveType.RIGHT,
              path: contextMenuRoute?.fullPath
            })
          "
        >
          关闭右边
        </el-button>
        <el-button
          v-if="menuBtns.includes(RemoveType.OTHERS)"
          text
          @click="
            cacheRoutes.deleteCacheRoute({
              type: RemoveType.OTHERS,
              path: contextMenuRoute?.fullPath
            })
          "
        >
          关闭其他
        </el-button>
        <el-button
          v-if="menuBtns.includes(RemoveType.ALL)"
          text
          @click="
            cacheRoutes.deleteCacheRoute({ type: RemoveType.ALL, path: contextMenuRoute?.fullPath })
          "
        >
          关闭所有
        </el-button>
      </el-space>
    </el-popover>
  </div>
</template>
<style scoped lang="scss">
.multiTabs {
  .el-tabs--border-card {
    border: none;

    :deep(.el-tabs__content) {
      display: none !important;
    }

    :deep(.el-tabs__header) {
      background-color: var(--el-bg-color);

      .el-tabs__item.is-active {
        background-color: var(--global-background-color);
      }
    }
  }
}
.contextMenuPopover {
  .el-space,
  .el-button {
    width: 100%;
  }
  .el-space {
    :deep(.el-space__item) {
      width: 100%;
    }
  }
}
</style>
