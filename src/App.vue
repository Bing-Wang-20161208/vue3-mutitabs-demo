<script setup lang="ts">
import { RouterView } from 'vue-router'
import { ElConfigProvider } from 'element-plus'
import en from 'element-plus/es/locale/lang/en'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import plusZhCn from 'plus-pro-components/es/locale/lang/zh-cn'
import plusEn from 'plus-pro-components/es/locale/lang/en'

// 合并预言：elementplus 和 plus-pro-components 的语言包合并
const zhCnLocales = {
  ...zhCn,
  ...plusZhCn
}
const enLocales = {
  ...en,
  ...plusEn
}

const language = ref('zh-cn')
// 语言包
const locale = computed(() => (language.value === 'zh-cn' ? zhCnLocales : enLocales))

// 切换语言
const toggleLanguage = () => {
  language.value = language.value === 'zh-cn' ? 'en' : 'zh-cn'
}
</script>

<template>
  <el-config-provider :locale="locale">
    <router-view />
  </el-config-provider>
</template>

<style scoped lang="scss"></style>
