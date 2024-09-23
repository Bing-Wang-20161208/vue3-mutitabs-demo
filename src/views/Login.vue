<script setup lang="ts">
const form = ref({ username: '', password: '' })
</script>

<template>
  <el-form :model="form" label-width="auto" style="width: 600px">
    <el-form-item label="用户名"> <el-input v-model="form.username" /></el-form-item>
    <el-form-item label="密码"> <el-input v-model="form.password" /></el-form-item>
    <el-space>
      <el-button type="primary">登录</el-button>
      <el-button>重置</el-button>
    </el-space>
  </el-form>
</template>

<style scoped lang="scss"></style>
