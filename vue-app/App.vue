<template>
  <!-- 只需一个根容器，无需 router-view -->
  <view class="app"></view>
</template>

<script setup>
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'  // ✅ 正确导入

onLaunch(() => {
  console.log('App Launch')
})

onShow(() => {
  console.log('App Show')
})

onHide(() => {
  console.log('App Hide')
})
</script>

<style>
page {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>