<template>
  <view class="page-medicine">
    <!-- 状态栏占位（和首页保持一致） -->
    <view class="status-bar-placeholder"></view>
    
    <!-- 顶部导航栏（适配首页导航栏样式） -->
    <view class="page-header">
      <button class="header-back-btn" @click="closeMedicine">
        <text class="back-icon">←</text>
      </button>
      <text class="header-title">用药管理</text>
      <button class="header-add-btn" @click="addMedicine">
        <text class="add-icon">+</text>
      </button>
    </view>

    <!-- 主内容区（复用首页滚动容器样式） -->
    <scroll-view 
      class="content-scroll" 
      scroll-y 
      scroll-with-animation
      :style="{ height: scrollViewHeight + 'px' }"
    >
      <!-- 用药列表区域 -->
      <view class="medicine-list">
        <!-- 降压药卡片 -->
        <view class="medicine-card">
          <view class="medicine-card-header">
            <view class="medicine-icon-box green-bg">💊</view>
            <view class="medicine-info">
              <text class="medicine-name">降压药</text>
              <text class="medicine-desc">硝苯地平缓释片</text>
            </view>
            <text class="medicine-status">进行中</text>
          </view>
          
          <view class="medicine-detail">
            <view class="detail-row">
              <text class="detail-label">服用时间</text>
              <text class="detail-value">每日 08:00</text>
            </view>
            <view class="detail-row">
              <text class="detail-label">剂量</text>
              <text class="detail-value">1片/次</text>
            </view>
            <view class="detail-row">
              <text class="detail-label">剩余数量</text>
              <text class="detail-value orange-text">15片</text>
            </view>
          </view>
          
          <button class="take-btn" @click="markTaken('降压药')">标记已服用</button>
        </view>

        <!-- 降糖药卡片 -->
        <view class="medicine-card">
          <view class="medicine-card-header">
            <view class="medicine-icon-box purple-bg">💊</view>
            <view class="medicine-info">
              <text class="medicine-name">降糖药</text>
              <text class="medicine-desc">二甲双胍片</text>
            </view>
            <text class="medicine-status">进行中</text>
          </view>
          
          <view class="medicine-detail">
            <view class="detail-row">
              <text class="detail-label">服用时间</text>
              <text class="detail-value">每日 08:00, 18:00</text>
            </view>
            <view class="detail-row">
              <text class="detail-label">剂量</text>
              <text class="detail-value">1片/次</text>
            </view>
            <view class="detail-row">
              <text class="detail-label">剩余数量</text>
              <text class="detail-value green-text">42片</text>
            </view>
          </view>
          
          <button class="take-btn purple-btn" @click="markTaken('降糖药')">标记已服用</button>
        </view>
      </view>
    </scroll-view>

    <!-- 自定义 tabBar 组件（和首页保持一致） -->
    <custom-tabbar />
  </view>
</template>

<script setup>
// 导入自定义tabBar组件（和首页一致）
import customTabbar from '@/components/custom-tabbar/custom-tabbar.vue';

// 导入Vue核心API
import { ref, onMounted, onUnmounted } from 'vue';

// 响应式数据（复用首页的动态高度计算逻辑）
const scrollViewHeight = ref(0);
const isClick = ref(false);

// 页面加载：初始化高度计算（和首页逻辑一致）
onMounted(() => {
  // 计算scroll-view高度（适配自定义tabBar）
  try {
    const systemInfo = uni.getSystemInfoSync();
    const screenHeight = systemInfo.windowHeight;
    const statusBarH = systemInfo.statusBarHeight || 0;
    const navBarH = 88 / 2; // 导航栏88rpx转px
    const tabBarH = 100 / 2; // tabBar高度转px
    scrollViewHeight.value = screenHeight - statusBarH - navBarH - tabBarH;
  } catch (e) {
    scrollViewHeight.value = 500; // 异常降级
  }

  // 校验登录状态（和首页一致的登录校验）
  const isLogin = uni.getStorageSync('isLogin');
  if (!isLogin) {
    uni.redirectTo({ url: '/pages/auth/auth' });
    uni.showToast({ title: '请先登录', icon: 'none' });
    return;
  }
});

// 返回上一页
const closeMedicine = () => {
  uni.navigateBack({
    delta: 1
  });
};

// 添加新用药提醒
const addMedicine = () => {
  console.log('执行添加用药记录页跳转，路径：/pages/medicine/add-medicine');
  uni.navigateTo({
    url: '/pages/medicine/add-medicine',
    fail: (err) => {
      console.error('添加用药记录页跳转失败：', err);
      // 降级处理：如果添加页面不存在，跳转到用药记录主页面
      if (err.errMsg.includes('page not found')) {
        uni.navigateTo({
          url: '/pages/medicine/medicine',
          fail: (err2) => {
            console.error('用药记录主页面跳转失败：', err2);
            uni.showToast({
              title: '用药记录页面暂未开发',
              icon: 'none',
              duration: 2000
            });
          }
        });
      } else {
        uni.showToast({
          title: `跳转失败：${err.errMsg || '页面不存在'}`,
          icon: 'none',
          duration: 3000
        });
      }
    }
  });
};

// 标记已服用
const markTaken = (medicineName) => {
  handleFunctionClick(() => {
    uni.showToast({
      title: `${medicineName}已标记为服用`,
      icon: 'success',
      duration: 1500
    });
    
    // 预留接口调用逻辑（和首页风格一致）
    // uni.request({
    //   url: '/api/medicine/mark',
    //   method: 'POST',
    //   data: { name: medicineName },
    //   success: (res) => {
    //     // 标记成功后的逻辑
    //   }
    // });
  });
};

// 通用点击动画函数（复用首页的点击反馈逻辑）
const handleFunctionClick = (callback) => {
  isClick.value = true;
  setTimeout(() => {
    isClick.value = false;
    callback();
  }, 100);
};
</script>

<style scoped>
/* 基础布局（完全复用首页的基础样式） */
.page-medicine {
  width: 100%;
  min-height: 100vh;
  background-color: #f8fafc;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  position: relative;
  padding: 0;
  margin: 0;
}

/* 状态栏占位（和首页完全一致） */
.status-bar-placeholder {
  height: var(--status-bar-height);
  width: 100%;
  background: linear-gradient(135deg, #3b82f6 0%, #4f46e5 100%);
  flex-shrink: 0;
}

/* 顶部导航栏（适配首页导航栏样式） */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 24rpx;
  background: linear-gradient(135deg, #3b82f6 0%, #4f46e5 100%);
  color: #fff;
  width: 100%;
  box-sizing: border-box;
  height: 88rpx;
  flex-shrink: 0;
}

.header-back-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-icon {
  font-size: 28rpx;
  color: #fff;
  font-weight: bold;
}

.header-title {
  font-size: 32rpx;
  font-weight: 700;
  letter-spacing: 2rpx;
}

.header-add-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-icon {
  font-size: 28rpx;
  color: #fff;
  font-weight: bold;
}

/* 内容滚动区（完全复用首页的滚动容器样式） */
.content-scroll {
  overflow-y: auto;
  padding: 20rpx 16rpx 20rpx 16rpx;
  -webkit-overflow-scrolling: touch;
  width: 100%;
  box-sizing: border-box;
  flex: none;
  background-color: #f8fafc;
}

.content-scroll::-webkit-scrollbar {
  display: none;
}

/* 用药列表容器 */
.medicine-list {
  display: flex;
  flex-direction: column;
  gap: 28rpx;
}

/* 用药卡片（复用首页卡片样式规范） */
.medicine-card {
  background: #fff;
  border-radius: 32rpx;
  padding: 28rpx 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
  width: 100%;
  box-sizing: border-box;
}

/* 用药卡片头部 */
.medicine-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24rpx;
}

.medicine-icon-box {
  font-size: 44rpx;
  margin-right: 16rpx;
  width: 80rpx;
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  border-radius: 50%;
  flex-shrink: 0;
}

/* 复用首页的颜色类 */
.green-bg { background-color: #f0fdf4; color: #22c55e; }
.purple-bg { background-color: #faf5ff; color: #8b5cf6; }

.medicine-info {
  flex: 1;
}

.medicine-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #334155;
  display: block;
  margin-bottom: 6rpx;
}

.medicine-desc {
  font-size: 22rpx;
  color: #64748b;
}

.medicine-status {
  background-color: #dcfce7;
  color: #22c55e;
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
  font-size: 22rpx;
  font-weight: 500;
}

/* 用药详情信息 */
.medicine-detail {
  margin-bottom: 24rpx;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12rpx 0;
  border-bottom: 1px solid #f1f5f9;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 24rpx;
  color: #64748b;
}

.detail-value {
  font-size: 24rpx;
  color: #334155;
  font-weight: 500;
}

.orange-text {
  color: #f59e0b;
  font-weight: 600;
}

.green-text {
  color: #22c55e;
  font-weight: 600;
}

/* 标记已服用按钮（复用首页按钮样式） */
.take-btn {
  background-color: #3b82f6;
  color: #fff;
  border: none;
  border-radius: 20rpx;
  padding: 16rpx 0;
  font-size: 24rpx;
  width: 100%;
  font-weight: 500;
}

.purple-btn {
  background-color: #8b5cf6;
}

/* 全局按钮重置（和首页一致） */
button {
  padding: 0;
  margin: 0;
  line-height: 1;
}
</style>