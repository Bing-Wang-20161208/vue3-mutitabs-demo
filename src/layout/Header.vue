<script setup lang="ts">
import { useMenuStore } from '@/stores/menu'
import { getFirstRealRoute } from '@/utils/router'
import { Bell, ChatLineRound } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const menu = useMenuStore()
const menus = computed(() => menu.menus)
const activeFirstPath = computed(() => menu.activeMenus[1].path)
const handleSelect = (key: string) => {
  if (key === '') {
    router.push('/')
  } else if (key) {
    // 处理外链菜单的情况
    const route = getFirstRealRoute(menus.value, key)
    if (route?.meta?.httpLink) {
      window.open(route?.meta?.httpLink, '_blank')
    } else {
      router.push(route?.path || '/')
    }
  }
}
</script>
<template>
  <section class="header">
    <div class="logo">logo</div>
    <div class="menu">
      <el-menu :default-active="activeFirstPath" mode="horizontal" @select="handleSelect">
        <el-menu-item v-for="menu in menus" :key="menu.path" :index="menu.path">
          <!-- <el-icon>
            <location />
          </el-icon> -->
          {{ menu.meta?.title }}
        </el-menu-item>
      </el-menu>
    </div>
    <div class="user">
      <el-space :size="[40, 0]">
        <el-badge :value="12">
          <el-icon :size="20" style="cursor: pointer">
            <Bell />
          </el-icon>
        </el-badge>
        <el-badge :value="12">
          <el-icon :size="20" style="cursor: pointer">
            <ChatLineRound />
          </el-icon>
        </el-badge>
        <el-dropdown>
          <span class="el-dropdown-link">
            <el-avatar
              style="cursor: pointer"
              src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
            />
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>个人信息</el-dropdown-item>
              <el-dropdown-item>退出登录</el-dropdown-item>
              <el-dropdown-item disabled>Action 4</el-dropdown-item>
              <el-dropdown-item divided>Action 5</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-space>
    </div>
  </section>
</template>
<style scoped lang="scss">
.header {
  display: flex;

  .logo {
    width: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.3s;
  }

  .menu {
    flex: 1;

    .el-menu {
      background-color: var(--el-color-primary-light-7);
    }
  }

  .user {
    width: 200px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-right: 10px;
  }
}

@media screen and (max-width: 1230px) {
  .header {
    .logo {
      width: 64px;
    }
  }
}
</style>
