<template>
  <view class="custom-tabbar">
    <view class="tabbar-wrap">
      <button class="tabbar-item" @click="handleSwitchTab('/pages/device/device')" :class="{ active: currentPath === '/pages/device/device' }">
        <text class="item-icon">🏠</text>
        <text class="item-text">首页</text>
      </button>
      <button class="tabbar-item" @click="handleSwitchTab('/pages/health/health')" :class="{ active: currentPath === '/pages/health/health' }">
        <text class="item-icon">📊</text>
        <text class="item-text">健康</text>
      </button>
      <button class="tabbar-item" @click="handleSwitchTab('/pages/interact/interact')" :class="{ active: currentPath === '/pages/interact/interact' }">
        <text class="item-icon">👪</text>
        <text class="item-text">亲情</text>
      </button>
      <button class="tabbar-item" @click="handleSwitchTab('/pages/mine/mine')" :class="{ active: currentPath === '/pages/mine/mine' }">
        <text class="item-icon">👤</text>
        <view class="badge" v-if="hasUnread">1</view>
        <text class="item-text">我的</text>
      </button>
    </view>
  </view>
</template>

<script setup>
// 核心修复：只导入vue的API，所有uni-app API都用全局uni.xxx调用awd
import { ref, onMounted } from 'vue';

// 响应式数据
const currentPath = ref('');
const hasUnread = ref(true); // 模拟未读消息（我的页面：如版本更新、通知等）

// 初始化当前页面路径
onMounted(() => {
  // 全局函数：直接调用 getCurrentPages()
  const pages = getCurrentPages();
  if (pages.length > 0) {
    const currentPage = pages[pages.length - 1];
    currentPath.value = `/${currentPage.route}`;
  }
});

// 切换tab（使用全局 uni.switchTab 调用，避免导入报错）
const handleSwitchTab = (url) => {
  // 已在当前页面，不跳转
  if (currentPath.value === url) return;
  
  // 全局 API：uni.switchTab（无需导入，直接调用）
  uni.switchTab({
    url,
    fail: (err) => {
      console.error('切换tab失败：', err);
      // 降级处理：使用 uni.redirectTo
      uni.redirectTo({ url });
    }
  });
};

// 如需使用 getStorageSync，同样用全局调用：
// const storageData = uni.getStorageSync('key');
</script>

<style scoped>
.custom-tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #f8fafc;
  padding: 8rpx 0 12rpx 0;
  z-index: 999;
  width: 100%;
  box-sizing: border-box;
}

.tabbar-wrap {
  width: 92%;
  max-width: 340px;
  margin: 0 auto;
  background-color: #fff;
  border-radius: 32rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
  border: 1px solid #f1f5f9;
  padding: 8rpx 16rpx;
  display: flex;
  justify-content: space-around;
  height: 80rpx;
  align-items: center;
}

.tabbar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: none;
  border: none;
  padding: 4rpx 8rpx;
  position: relative;
  height: 100%;
  justify-content: center;
}

.tabbar-item.active {
  color: #3b82f6;
}

.tabbar-item:not(.active) {
  color: #94a3b8;
}

.item-icon {
  font-size: 28rpx;
  margin-bottom: 4rpx;
}

.item-text {
  font-size: 18rpx;
  font-weight: 500;
}

.badge {
  position: absolute;
  top: 0;
  right: 6rpx;
  width: 20rpx;
  height: 20rpx;
  background-color: #ef4444;
  color: #fff;
  border-radius: 50%;
  font-size: 14rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

button {
  padding: 0;
  margin: 0;
  line-height: 1;
}
</style>