<template>
  <view class="page-device">
    <!-- 状态栏占位（适配手机顶部状态栏） -->
    <view class="status-bar-placeholder"></view>
    
    <!-- 首页内容容器 -->
    <scroll-view 
      class="content-scroll" 
      scroll-y 
      @scroll="onScroll"
      :scroll-into-view="scrollIntoView"
      scroll-with-animation
    >
      <!-- 环境卡片 -->
      <view class="env-card" @click="showEnvironment">
        <view class="env-card-header">
          <view class="env-card-title">
            <text class="env-card-subtitle">当前环境</text>
            <text class="env-card-main-title">客厅 · {{ envStatusText }}</text>
          </view>
          <text class="env-card-status">实时运行中</text>
        </view>
        <view class="env-card-grid">
          <view class="env-card-item">
            <text class="env-item-label">室内温度</text>
            <text class="env-item-value">{{ temperature }}°C</text>
          </view>
          <view class="env-card-item">
            <text class="env-item-label">室内湿度</text>
            <text class="env-item-value">{{ humidity }}%</text>
          </view>
        </view>
      </view>

      <!-- 实时画面 -->
      <view class="video-card">
        <view class="video-card-header">
          <view class="video-card-title">
            <view class="status-dot" :class="{ pulse: isVideoOnline }"></view>
            <text class="title-text">实时画面</text>
          </view>
          <text class="video-time">{{ currentTime }}</text>
        </view>
        <view class="video-container" @click="showVideoDetail">
          <!-- 视频占位图（模拟摄像头画面） -->
          <image 
            class="video-placeholder" 
            src="/static/images/camera-placeholder.png" 
            mode="aspectFill"
          ></image>
          <!-- 播放按钮（仅在未播放时显示） -->
          <view class="video-play-btn" v-if="!isVideoPlaying">
            <text class="play-icon">▶</text>
          </view>
          <!-- 在线/离线状态提示 -->
          <view class="video-status-tip" v-if="!isVideoOnline">
            <text class="status-tip-text">摄像头离线</text>
          </view>
        </view>
      </view>

      <!-- 更多功能入口（扩展） -->
      <view class="function-grid" v-if="showFunctionGrid">
        <view class="function-item" @click="gotoLocation">
          <view class="function-icon">📍</view>
          <text class="function-text">位置查看</text>
        </view>
        <view class="function-item" @click="gotoMedicine">
          <view class="function-icon">💊</view>
          <text class="function-text">用药提醒</text>
        </view>
        <view class="function-item" @click="gotoNotifications">
          <view class="function-icon">⚠️</view>
          <text class="function-text">报警记录</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, onLoad, onShow } from 'vue';

// 1. 响应式数据（状态管理）
const temperature = ref(24.5); // 温度
const humidity = ref(48); // 湿度
const envStatusText = ref('安全'); // 环境状态
const isVideoOnline = ref(true); // 摄像头是否在线
const isVideoPlaying = ref(false); // 视频是否播放
const currentTime = ref(''); // 当前时间
const scrollIntoView = ref(''); // 滚动定位
const showFunctionGrid = ref(true); // 是否显示功能网格

// 2. 页面加载/显示时初始化
onLoad(() => {
  // 初始化当前时间
  updateCurrentTime();
  // 模拟环境数据刷新
  simulateEnvDataRefresh();
});

onShow(() => {
  // 每次页面显示时更新时间
  updateCurrentTime();
});

// 3. 工具函数
// 更新当前时间
const updateCurrentTime = () => {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  currentTime.value = `${hours}:${minutes}`;
};

// 模拟环境数据刷新（每5秒更新一次）
const simulateEnvDataRefresh = () => {
  setInterval(() => {
    // 温度小幅波动（±0.5°C）
    temperature.value = (temperature.value + (Math.random() - 0.5)).toFixed(1);
    // 湿度小幅波动（±1%）
    humidity.value = Math.round(humidity.value + (Math.random() - 0.5) * 2);
    
    // 模拟环境状态变化（随机）
    if (Math.random() > 0.95) {
      envStatusText.value = Math.random() > 0.5 ? '高温预警' : '安全';
    } else {
      envStatusText.value = '安全';
    }
  }, 5000);
};

// 4. 事件处理函数
// 环境卡片点击事件（跳转到环境详情页）
const showEnvironment = () => {
  uni.navigateTo({
    url: '/pages/environment/environment'
  });
};

// 实时画面点击事件（跳转到视频详情页）
const showVideoDetail = () => {
  if (!isVideoOnline.value) {
    uni.showToast({
      title: '摄像头离线，无法查看',
      icon: 'none'
    });
    return;
  }
  
  // 标记视频为播放状态
  isVideoPlaying.value = true;
  
  // 跳转到视频详情页
  uni.navigateTo({
    url: '/pages/videoDetail/videoDetail'
  });
};

// 滚动事件
const onScroll = (e) => {
  // 可添加滚动相关逻辑，如导航栏样式变化
  // console.log('滚动位置：', e.detail.scrollTop);
};

// 跳转到位置页面
const gotoLocation = () => {
  uni.navigateTo({
    url: '/pages/location/location'
  });
};

// 跳转到用药管理页面
const gotoMedicine = () => {
  uni.navigateTo({
    url: '/pages/medicine/medicine'
  });
};

// 跳转到报警记录页面
const gotoNotifications = () => {
  uni.navigateTo({
    url: '/pages/notifications/notifications'
  });
};
</script>

<style scoped>
/* 根容器：铺满屏幕 */
.page-device {
  width: 100%;
  height: 100vh;
  background-color: #f8fafc;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

/* 状态栏占位（适配不同手机状态栏高度） */
.status-bar-placeholder {
  height: var(--status-bar-height);
  width: 100%;
}

/* 滚动容器 */
.content-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 16rpx 20rpx 96rpx 20rpx;
  -webkit-overflow-scrolling: touch;
}
.content-scroll::-webkit-scrollbar {
  display: none;
}

/* 环境卡片 */
.env-card {
  background: linear-gradient(135deg, #3b82f6 0%, #4f46e5 100%);
  border-radius: 32rpx;
  padding: 24rpx 20rpx;
  color: #fff;
  box-shadow: 0 8rpx 24rpx rgba(59, 130, 246, 0.2);
  margin-bottom: 20rpx;
}

/* 环境卡片头部 */
.env-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20rpx;
}
.env-card-subtitle {
  font-size: 24rpx;
  color: #dbeafe;
  display: block;
  margin-bottom: 4rpx;
}
.env-card-main-title {
  font-size: 36rpx;
  font-weight: bold;
  display: block;
}
.env-card-status {
  background: rgba(74, 222, 128, 0.3);
  padding: 4rpx 12rpx;
  border-radius: 20rpx;
  font-size: 20rpx;
  font-weight: 500;
  margin-top: 8rpx;
}

/* 环境卡片网格 */
.env-card-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16rpx;
}
.env-card-item {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12rpx);
  border-radius: 24rpx;
  padding: 20rpx 16rpx;
  border: 1px solid rgba(255, 255, 255, 0.2);
  text-align: center;
}
.env-item-label {
  font-size: 20rpx;
  color: #dbeafe;
  display: block;
  margin-bottom: 8rpx;
}
.env-item-value {
  font-size: 32rpx;
  font-weight: bold;
  display: block;
}

/* 实时画面卡片 */
.video-card {
  background: #fff;
  border-radius: 32rpx;
  padding: 20rpx 16rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
  margin-bottom: 20rpx;
}
.video-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16rpx;
}
.video-card-title {
  display: flex;
  align-items: center;
  gap: 8rpx;
}
.status-dot {
  width: 8rpx;
  height: 8rpx;
  background-color: #22c55e;
  border-radius: 50%;
}
.status-dot.pulse {
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}
.title-text {
  font-size: 28rpx;
  font-weight: 600;
  color: #334155;
}
.video-time {
  font-size: 20rpx;
  color: #94a3b8;
}

/* 视频容器 */
.video-container {
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  background-color: #e2e8f0;
  border-radius: 24rpx;
  overflow: hidden;
}
.video-placeholder {
  width: 100%;
  height: 100%;
  opacity: 0.8;
}
.video-play-btn {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.2);
}
.play-icon {
  font-size: 48rpx;
  color: #fff;
  width: 80rpx;
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
}
.video-status-tip {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.6);
  padding: 12rpx 24rpx;
  border-radius: 20rpx;
}
.status-tip-text {
  font-size: 24rpx;
  color: #fff;
}

/* 功能网格 */
.function-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx;
  background: #fff;
  border-radius: 32rpx;
  padding: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
}
.function-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20rpx 0;
}
.function-icon {
  font-size: 40rpx;
  margin-bottom: 8rpx;
}
.function-text {
  font-size: 24rpx;
  color: #334155;
  font-weight: 500;
}
</style>