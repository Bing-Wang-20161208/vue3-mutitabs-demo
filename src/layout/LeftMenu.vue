<script setup lang="ts">
import { useMenuStore } from '@/stores/menu'
import { getFirstRealRoute, splitPath } from '@/utils/router'
import { Expand } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const menu = useMenuStore()
const menus = computed(() => menu.childrenMenus)
/**
 * 高亮有两种情况: 1. 当前路由就是菜单；2. 当前路由是详情类的动态路由
 * ['', '/alert', '/alert/network/detail/:id']
 */
const activeFirstPath = computed(() => {
  const lastPath = menu.activeMenus[menu.activeMenus.length - 1].path
  if (lastPath === '') return ''
  const paths = splitPath(lastPath)
  const platformRoutes = router.getRoutes()
  return paths.find((p) => platformRoutes.find((r) => r.path === p)?.meta.menu)
})

const handleSelect = (key: string) => {
  if (key === '') {
    router.push('/')
  } else if (key) {
    // 处理外链菜单的情况
    const route = getFirstRealRoute(menus.value, key)
    if (route?.meta?.httpLink) {
      window.open(route?.meta?.httpLink, '_blank')
    } else {
      router.push(key)
    }
  }
}

// 监听浏览器窗口变化
const windowWidth = ref(window.innerWidth)
// 折叠菜单
const isCollapse = ref(false)
const handleCollapse = () => {
  if (windowWidth.value <= 1230) return
  isCollapse.value = !isCollapse.value
}
onMounted(() => {
  setCollapse()
  window.addEventListener('resize', () => {
    windowWidth.value = window.innerWidth
    setCollapse()
  })
})
// 设置isCollapse
const setCollapse = () => {
  if (windowWidth.value <= 1230) {
    isCollapse.value = true
  } else {
    isCollapse.value = false
  }
}
</script>
<template>
  <div :class="['leftMenu', { collapse: isCollapse }]">
    <el-scrollbar>
      <el-menu :default-active="activeFirstPath" :collapse="isCollapse" @select="handleSelect">
        <template v-for="item in menus" :key="item.path">
          <el-menu-item v-if="item.name" :index="item.path">{{ item.meta?.title }}</el-menu-item>
          <el-sub-menu v-else-if="item.children && item.children.length > 0" :index="item.path">
            <template #title>
              <!-- <el-icon>
                <location />
              </el-icon>
              <el-tooltip content="Bottom center" placement="bottom" effect="dark">
                <el-text truncated>{{ item.meta?.title }}</el-text>
              </el-tooltip> -->
              {{ item.meta?.title }}
            </template>
            <template v-for="child in item.children" :key="child.path">
              <el-menu-item v-if="child.name" :index="child.path">{{
                child.meta?.title
              }}</el-menu-item>
              <el-sub-menu
                v-else-if="child.children && child.children.length > 0"
                :index="child.path"
              >
                <template #title>
                  {{ child.meta?.title }}
                </template>
              </el-sub-menu>
            </template>
          </el-sub-menu>
        </template>
      </el-menu>
    </el-scrollbar>
    <el-divider />
    <div class="collapseBtn">
      <el-icon :class="{ notCollapse: !isCollapse }" @click="handleCollapse" :size="20">
        <Expand />
      </el-icon>
    </div>
  </div>
</template>
<style scoped lang="scss">
.leftMenu {
  width: 300px;
  height: calc(100vh - 60px);
  position: relative;
  border-right: solid 1px var(--el-menu-border-color);
  transition: all 0.3s;

  &.collapse {
    width: 64px;
  }

  .collapseBtn {
    position: absolute;
    bottom: 8px;
    left: 50%;
    transform: translateX(-50%);
    color: var(--el-color-black);
    cursor: pointer;

    .notCollapse {
      transform: rotateY(180deg);
    }
  }

  .el-scrollbar {
    height: calc(100vh - 126px);

    .el-menu {
      border: none;

      .el-menu-item.is-active {
        background-color: var(--el-menu-hover-bg-color);
      }
    }
  }
}
</style>
