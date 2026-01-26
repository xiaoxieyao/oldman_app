<template>
  <view class="app">
    <router-view></router-view>
  </view>
</template>

<script setup>
// 只保留最基础的生命周期，无任何业务逻辑
import { onLaunch } from 'vue';

onLaunch(() => {
  console.log('App 启动'); // 仅打印日志，验证是否执行
});
</script>

<style>
/* 全局样式清空，避免覆盖页面样式 */
page {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>