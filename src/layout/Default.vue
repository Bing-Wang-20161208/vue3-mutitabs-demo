<script setup lang="ts">
import { RouterView } from 'vue-router'
import LeftMenu from './LeftMenu.vue'
import VHeader from './Header.vue'
import VFooter from './Footer.vue'
import MultiTabs from './MultiTabs.vue'
import { useCacheRoutesStore } from '@/stores/cacheRoutes'

const cacheRoutes = useCacheRoutesStore()
</script>
<template>
  <el-container class="default-layout-container">
    <el-header>
      <v-header />
    </el-header>
    <el-container>
      <el-aside>
        <left-menu />
      </el-aside>
      <el-container>
        <el-main>
          <multi-tabs />
          <div class="content">
            <el-scrollbar>
              <router-view v-slot="{ Component, route }">
                <transition name="slide-fade" mode="out-in">
                  <keep-alive :include="cacheRoutes.cacheComponentNames">
                    <component :is="Component" :key="route.fullPath" />
                  </keep-alive>
                </transition>
              </router-view>
            </el-scrollbar>
          </div>
        </el-main>
        <el-footer><v-footer /></el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>
<style lang="scss" scoped>
.default-layout-container {
  height: 100vh;
  .el-header {
    position: relative;
    padding: 0;
    background-color: var(--el-color-primary-light-7);
    color: var(--el-text-color-primary);
  }
  .el-aside {
    width: auto;
    background-color: var(--el-bg-color);
  }
  .el-main {
    padding: 0;
    .content {
      height: calc(100vh - 180px);
      overflow: auto;
      padding: 20px;
      box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.1);
      .slide-fade-enter-active,
      .slide-fade-leave-active {
        transition: all 0.5s ease;
      }
      .slide-fade-enter-from {
        transform: translateX(-20px);
        opacity: 0;
      }
      .slide-fade-leave-to {
        transform: translateX(20px);
        opacity: 0;
      }
    }
  }
  .el-footer {
    --el-footer-height: 40px;
  }
}
</style>
