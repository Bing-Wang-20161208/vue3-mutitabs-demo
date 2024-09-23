<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
onMounted(() => {
  console.log('V4')
})
onActivated(() => {
  console.log('onActivated V4')
})
</script>
<template>
  <div>
    network
    <el-button type="primary" @click="router.push('/alert/network/detail/1')">detail1</el-button>
    <el-button type="primary" @click="router.push('/alert/network/detail/2')">detail2</el-button>
    <el-button type="primary" @click="router.push('/alert/network/detail/3')">detail1</el-button>
    <el-button type="primary" @click="router.push('/alert/network/detail/4')">detail2</el-button>
    <el-button type="primary" @click="router.push('/alert/network/detail/5')">detail1</el-button>
    <el-button type="primary" @click="router.push('/alert/network/detail/6')">detail2</el-button>
    <el-button type="primary" @click="router.push('/alert/network/detail/7')">detail1</el-button>
    <el-button type="primary" @click="router.push('/alert/network/detail/8')">detail2</el-button>
    <el-button type="primary" @click="router.push('/alert/network/detail/9')">detail1</el-button>
    <el-button type="primary" @click="router.push('/alert/network/detail/10')">detail2</el-button>
    <el-button type="primary" @click="router.push('/alert/network/detail/11')">detail1</el-button>
    <el-button type="primary" @click="router.push('/alert/network/detail/22')">detail2</el-button>
    <el-button type="primary" @click="router.push('/alert/network/detail/13')">detail1</el-button>
    <el-button type="primary" @click="router.push('/alert/network/detail/24')">detail2</el-button>
    <el-button type="primary" @click="router.push('/alert/network/detail/15')">detail1</el-button>
    <el-button type="primary" @click="router.push('/alert/network/detail/26')">detail2</el-button>
    <el-button type="primary" @click="router.push('/alert/network/detail/17')">detail1</el-button>
    <el-button type="primary" @click="router.push('/alert/network/detail/28')">detail2</el-button>
    <el-button type="primary" @click="router.push('/alert/network/detail/19')">detail1</el-button>
    <el-button type="primary" @click="router.push('/alert/network/detail/20')">detail2</el-button>
    <el-button type="primary" @click="router.push('/alert/network/detail/111')">detail1</el-button>
    <el-button type="primary" @click="router.push('/alert/network/detail/211')">detail2</el-button>
    <el-button type="primary" @click="router.push('/alert/network/detail/122')">detail1</el-button>
    <el-button type="primary" @click="router.push('/alert/network/detail/222')">detail2</el-button>
    <el-button type="primary" @click="router.push('/alert/network/detail/133')">detail1</el-button>
    <el-button type="primary" @click="router.push('/alert/network/detail/233')">detail2</el-button>
  </div>
</template>
