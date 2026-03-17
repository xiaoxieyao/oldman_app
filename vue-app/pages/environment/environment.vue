<template>
  <view class="page-environment">
    <!-- 状态栏占位（和首页完全一致：渐变背景+适配顶部） -->
    <view class="status-bar-placeholder"></view>
    
    <!-- 顶部导航栏（复用首页导航样式+滚动阴影，仅修改标题/按钮） -->
    <view class="page-header" :class="{ 'header-scroll': isScroll }">
      <!-- 返回按钮（复用首页按钮样式） -->
      <button class="header-btn back-btn" @click="closeEnvironment">
        <text class="back-icon">←</text>
      </button>
      <!-- 导航标题（和首页字体/大小一致） -->
      <text class="header-title">环境监测</text>
      <!-- 刷新按钮（复用首页设置按钮样式，替换图标） -->
      <button class="header-btn refresh-btn" @click="refreshEnvData">
        <text class="refresh-icon">🔄</text>
      </button>
    </view>

    <!-- 内容滚动容器（完全复用首页scroll-view配置：动态高度+滚动监听+样式） -->
    <scroll-view 
      class="content-scroll" 
      scroll-y 
      @scroll="onScroll"
      scroll-with-animation
      :style="{ height: scrollViewHeight + 'px' }"
    >
      <!-- 实时环境卡片（复用首页环境卡片样式结构，仅调整内部布局） -->
      <view class="env-card">
        <view class="env-card-header">
          <view class="env-card-title">
            <text class="env-card-subtitle">当前环境</text>
            <text class="env-card-main-title">客厅 · {{ envStatusText }}</text>
          </view>
          <text class="env-card-status" :class="{ 'status-warning': envStatusText !== '舒适' }">
            {{ envStatusText !== '舒适' ? '⚠️ ' : '' }}实时监测中
          </text>
        </view>
        <view class="env-card-grid">
          <view class="env-card-item">
            <text class="env-item-label">室内温度</text>
            <text class="env-item-value">{{ temperature }}°C</text>
            <text class="env-item-tip" v-if="temperature > 28">偏高</text>
            <text class="env-item-tip" v-else-if="temperature < 18">偏低</text>
            <text class="env-item-tip" v-else style="display: none;"></text>
          </view>
          <view class="env-card-item">
            <text class="env-item-label">室内湿度</text>
            <text class="env-item-value">{{ humidity }}%</text>
            <text class="env-item-tip" v-if="humidity > 60">偏湿</text>
            <text class="env-item-tip" v-else-if="humidity < 30">偏干</text>
            <text class="env-item-tip" v-else style="display: none;"></text>
          </view>
        </view>
      </view>

      <!-- 24小时趋势卡片（复用首页通用卡片样式：圆角/阴影/内边距） -->
      <view class="trend-card common-card">
        <text class="card-title">24小时趋势</text>
        <view class="trend-list">
          <!-- 温度趋势（复用首页进度条样式） -->
          <view class="trend-item">
            <view class="trend-item-header">
              <text class="trend-label">温度</text>
              <text class="trend-range">{{ tempMin }}°C - {{ tempMax }}°C</text>
            </view>
            <view class="progress-bg">
              <view class="progress-bar temp-progress" :style="{ width: tempProgress + '%' }"></view>
            </view>
          </view>
          <!-- 湿度趋势 -->
          <view class="trend-item">
            <view class="trend-item-header">
              <text class="trend-label">湿度</text>
              <text class="trend-range">{{ humiMin }}% - {{ humiMax }}%</text>
            </view>
            <view class="progress-bg">
              <view class="progress-bar humi-progress" :style="{ width: humiProgress + '%' }"></view>
            </view>
          </view>
        </view>
      </view>

      <!-- 环境建议卡片（复用首页通用卡片样式） -->
      <view class="suggest-card common-card">
        <text class="card-title">环境建议</text>
        <view class="suggest-list">
          <view class="suggest-item" v-for="(item, index) in suggestList" :key="index">
            <text class="suggest-icon" :class="item.iconClass">{{ item.icon }}</text>
            <text class="suggest-text">{{ item.text }}</text>
          </view>
        </view>
      </view>

      <!-- 其他房间卡片（复用首页通用卡片样式+mb-20底部间距） -->
      <view class="other-room-card common-card mb-20">
        <text class="card-title">其他房间</text>
        <view class="room-list">
          <view class="room-item" v-for="(room, index) in roomList" :key="index">
            <view class="room-left">
              <text class="room-icon" :class="room.iconClass">{{ room.icon }}</text>
              <text class="room-name">{{ room.name }}</text>
            </view>
            <view class="room-right">
              <text class="room-data">{{ room.temp }}°C · {{ room.humi }}%</text>
              <text class="room-status" :class="room.statusClass">{{ room.status }}</text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 保留和首页一致的tabBar注释 -->
    <!-- <custom-tabbar /> -->
  </view>
</template>

<script setup>
// 1. 导入API（和首页完全一致：仅导入需要的，顺序统一）
import { ref, onMounted, onUnmounted } from 'vue';
// 2. 注释请求工具导入 - 解决文件找不到报错，后续对接后端时解开即可
// import request from '@/common/request.js';

// 3. 响应式数据定义（和首页命名规范统一：xxxText/xxxList，放最顶部）
// 核心环境数据（和首页环境数据联动）
const temperature = ref(24.5);
const humidity = ref(48);
const envStatusText = ref('舒适');
// 温湿度范围&进度
const tempMin = ref(22);
const tempMax = ref(26);
const tempProgress = ref(75);
const humiMin = ref(45);
const humiMax = ref(55);
const humiProgress = ref(60);
// 列表数据（数组+对象，和首页quick-actions/list规范一致）
const suggestList = ref([
  { icon: '✓', iconClass: 'suggest-icon-success', text: '当前温湿度适宜，环境舒适' },
  { icon: 'ℹ', iconClass: 'suggest-icon-info', text: '建议定时开窗通风，保持空气流通' }
]);
const roomList = ref([
  { 
    icon: '🛏️', iconClass: 'room-icon-purple', 
    name: '卧室', temp: 23, humi: 52, 
    status: '舒适', statusClass: 'room-status-green' 
  },
  { 
    icon: '🍳', iconClass: 'room-icon-orange', 
    name: '厨房', temp: 26, humi: 55, 
    status: '正常', statusClass: 'room-status-green' 
  }
]);
// 页面基础状态（和首页完全一致：isScroll/isClick/scrollViewHeight）
const isScroll = ref(false);
const isClick = ref(false);
const scrollViewHeight = ref(0);
// 定时器（和首页dataTimer命名规范一致）
let dataTimer = null;

// 4. 滚动事件处理（完全复制首页，无任何修改）
const onScroll = (e) => {
  isScroll.value = e.detail.scrollTop > 20;
};

// 5. 通用点击动画（完全复制首页核心交互，统一所有按钮点击效果）
const handleFunctionClick = (callback) => {
  isClick.value = true;
  setTimeout(() => {
    isClick.value = false;
    callback();
  }, 100);
};

// 6. 模拟环境数据刷新（和首页simulateEnvDataRefresh逻辑一致，小幅波动）
const simulateEnvDataRefresh = () => {
  dataTimer = setInterval(() => {
    // 温度小幅波动（限制在22-26℃）
    temperature.value = Number((temperature.value + (Math.random() - 0.5) * 0.8).toFixed(1));
    temperature.value = Math.max(tempMin.value, Math.min(tempMax.value, temperature.value));
    // 湿度小幅波动（限制在45-55%）
    humidity.value = Math.round(humidity.value + (Math.random() - 0.5) * 3);
    humidity.value = Math.max(humiMin.value, Math.min(humiMax.value, humidity.value));
    // 重新计算进度条
    tempProgress.value = ((temperature.value - tempMin.value) / (tempMax.value - tempMin.value)) * 100;
    humiProgress.value = ((humidity.value - humiMin.value) / (humiMax.value - humiMin.value)) * 100;
    // 更新环境状态
    if (temperature.value > 28) {
      envStatusText.value = '高温';
    } else if (temperature.value < 18) {
      envStatusText.value = '低温';
    } else if (humidity.value > 60) {
      envStatusText.value = '高湿';
    } else if (humidity.value < 30) {
      envStatusText.value = '低湿';
    } else {
      envStatusText.value = '舒适';
    }
    // 其他房间数据小幅波动
    roomList.value.forEach(room => {
      room.temp = Number((room.temp + (Math.random() - 0.5) * 0.5).toFixed(1));
      room.humi = Math.round(room.humi + (Math.random() - 0.5) * 2);
    });
  }, 5000);
};

// 7. 页面挂载（完全复制首页初始化逻辑：高度计算+数据初始化+定时器）
onMounted(() => {
  // 计算scroll-view动态高度（和首页计算公式、异常降级完全一致）
  try {
    const systemInfo = uni.getSystemInfoSync();
    const screenHeight = systemInfo.windowHeight;
    const statusBarH = systemInfo.statusBarHeight || 0;
    const navBarH = 88 / 2;
    const tabBarH = 100 / 2;
    scrollViewHeight.value = screenHeight - statusBarH - navBarH - tabBarH;
  } catch (e) {
    scrollViewHeight.value = 500;
  }

  // 初始化数据+启动模拟刷新（和首页规范一致）
  simulateEnvDataRefresh();
});

// 8. 页面卸载（完全复制首页，清理定时器避免内存泄漏）
onUnmounted(() => {
  if (dataTimer) clearInterval(dataTimer);
});

// 9. 核心功能函数（跳转/刷新，和首页命名/写法/错误处理一致）
// 关闭环境详情页（返回上一页，复用首页navigateTo/fail错误处理）
const closeEnvironment = () => {
  handleFunctionClick(() => {
    console.log('执行环境详情页返回，上一页：首页');
    uni.navigateBack({
      delta: 1,
      fail: (err) => {
        console.error('环境详情页返回失败：', err);
        uni.showToast({
          title: `返回失败：${err.errMsg}`,
          icon: 'none',
          duration: 3000
        });
      }
    });
  });
};

// 刷新环境数据（复用首页加载提示+成功/失败反馈+click动画）
const refreshEnvData = () => {
  handleFunctionClick(async () => {
    uni.showLoading({ title: '刷新中...' });
    try {
      // 模拟刷新（无后端时用，和首页数据波动逻辑一致）
      simulateSingleRefresh();
      // 对接后端时解开下面两行，注释上面一行（和首页请求规范一致）
      // const res = await request('/environment/get', 'GET');
      // Object.assign(this, res);
      uni.showToast({ title: '刷新成功', icon: 'success', duration: 1500 });
    } catch (err) {
      console.error('环境数据刷新失败：', err);
      uni.showToast({
        title: '刷新失败，请重试',
        icon: 'none',
        duration: 3000
      });
    } finally {
      uni.hideLoading();
    }
  });
};

// 单次模拟刷新（区别于定时器，手动刷新时触发一次）
const simulateSingleRefresh = () => {
  temperature.value = Number((temperature.value + (Math.random() - 0.5) * 1.2).toFixed(1));
  temperature.value = Math.max(tempMin.value, Math.min(tempMax.value, temperature.value));
  humidity.value = Math.round(humidity.value + (Math.random() - 0.5) * 5);
  humidity.value = Math.max(humiMin.value, Math.min(humiMax.value, humidity.value));
  tempProgress.value = ((temperature.value - tempMin.value) / (tempMax.value - tempMin.value)) * 100;
  humiProgress.value = ((humidity.value - humiMin.value) / (humiMax.value - humiMin.value)) * 100;
  // 更新状态
  if (temperature.value > 28) {
    envStatusText.value = '高温';
  } else if (temperature.value < 18) {
    envStatusText.value = '低温';
  } else if (humidity.value > 60) {
    envStatusText.value = '高湿';
  } else if (humidity.value < 30) {
    envStatusText.value = '低湿';
  } else {
    envStatusText.value = '舒适';
  }
  // 其他房间刷新
  roomList.value.forEach(room => {
    room.temp = Number((room.temp + (Math.random() - 0.5) * 0.8).toFixed(1));
    room.humi = Math.round(room.humi + (Math.random() - 0.5) * 3);
  });
};

// 对接后端接口（预留方法，后续创建request.js后直接使用）
const getEnvDataFromBackend = async () => {
  try {
    const res = await request('/environment/get', 'GET');
    // 后端数据赋值（字段和响应式数据完全对应）
    temperature.value = res.temperature;
    humidity.value = res.humidity;
    envStatusText.value = res.envStatusText;
    tempProgress.value = res.tempProgress;
    humiProgress.value = res.humiProgress;
    roomList.value = res.roomList;
    suggestList.value = res.suggestList;
  } catch (err) {
    throw err;
  }
};
</script>

<style scoped>
/* 基础页面样式（完全复制首页page-device，仅修改类名） */
.page-environment {
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

/* 状态栏占位（完全复制首页，渐变背景一致） */
.status-bar-placeholder {
  height: var(--status-bar-height);
  width: 100%;
  background: linear-gradient(135deg, #3b82f6 0%, #4f46e5 100%);
  flex-shrink: 0;
}

/* 顶部导航栏（完全复制首页page-header样式，仅调整按钮布局） */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 24rpx;
  background: linear-gradient(135deg, #3b82f6 0%, #4f46e5 100%);
  color: #fff;
  transition: all 0.3s ease;
  width: 100%;
  box-sizing: border-box;
  height: 88rpx;
  flex-shrink: 0;
}
.header-scroll {
  padding: 16rpx 24rpx;
  box-shadow: 0 2rpx 10rpx rgba(59, 130, 246, 0.2);
}
.header-title {
  font-size: 32rpx;
  font-weight: 700;
  letter-spacing: 2rpx;
}
.header-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50%;
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.back-icon, .refresh-icon {
  font-size: 28rpx;
  color: #fff;
}

/* 内容滚动区（完全复制首页content-scroll，无任何修改） */
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

/* 实时环境卡片（完全复制首页env-card样式，仅调整内部间距） */
.env-card {
  background: linear-gradient(135deg, #3b82f6 0%, #4f46e5 100%);
  border-radius: 32rpx;
  padding: 28rpx 20rpx;
  color: #fff;
  box-shadow: 0 8rpx 24rpx rgba(59, 130, 246, 0.2);
  margin-bottom: 28rpx;
  transition: all 0.2s ease;
  width: 100%;
  box-sizing: border-box;
}
.env-card:active {
  transform: scale(0.98);
}
.env-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 28rpx;
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
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
  font-size: 22rpx;
  font-weight: 500;
  margin-top: 8rpx;
}
.status-warning {
  background: rgba(251, 146, 60, 0.3);
}
.env-card-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20rpx;
}
.env-card-item {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12rpx);
  border-radius: 24rpx;
  padding: 24rpx 16rpx;
  border: 1px solid rgba(255, 255, 255, 0.2);
  text-align: center;
}
.env-item-label {
  font-size: 24rpx;
  color: #dbeafe;
  display: block;
  margin-bottom: 12rpx;
}
.env-item-value {
  font-size: 40rpx;
  font-weight: bold;
  display: block;
  margin-bottom: 8rpx;
}
.env-item-tip {
  font-size: 20rpx;
  color: #fef3c7;
  background: rgba(251, 146, 60, 0.2);
  padding: 2rpx 10rpx;
  border-radius: 10rpx;
}

/* 通用卡片样式（提取首页所有白色卡片共性，统一复用） */
.common-card {
  background: #fff;
  border-radius: 32rpx;
  padding: 28rpx 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
  margin-bottom: 28rpx;
  width: 100%;
  box-sizing: border-box;
}
/* 通用卡片标题（完全复制首页action-title/health-tip-title样式） */
.card-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #334155;
  margin-bottom: 24rpx;
  display: block;
}

/* 24小时趋势卡片 */
.trend-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}
.trend-item {
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}
.trend-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.trend-label {
  font-size: 20rpx;
  color: #94a3b8;
}
.trend-range {
  font-size: 20rpx;
  color: #334155;
}
/* 进度条（复用首页env-item-tip/安全标签的圆角样式） */
.progress-bg {
  width: 100%;
  height: 12rpx;
  background-color: #f1f5f9;
  border-radius: 20rpx;
  overflow: hidden;
}
.progress-bar {
  height: 100%;
  border-radius: 20rpx;
}
.temp-progress {
  background-color: #3b82f6;
}
.humi-progress {
  background-color: #22c55e;
}

/* 环境建议卡片 */
.suggest-list {
  display: flex;
  flex-direction: column;
  gap: 15rpx;
}
.suggest-item {
  display: flex;
  align-items: flex-start;
  gap: 10rpx;
}
.suggest-icon {
  font-size: 24rpx;
  margin-top: 2rpx;
}
.suggest-icon-success {
  color: #10b981;
}
.suggest-icon-info {
  color: #3b82f6;
}
.suggest-text {
  font-size: 24rpx;
  color: #334155;
  flex: 1;
}

/* 其他房间卡片 */
.room-list {
  display: flex;
  flex-direction: column;
  gap: 15rpx;
}
.room-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15rpx;
  background-color: #f8fafc;
  border-radius: 20rpx;
}
.room-left {
  display: flex;
  align-items: center;
  gap: 15rpx;
}
.room-icon {
  font-size: 24rpx;
}
/* 房间图标颜色（复用首页快捷操作的颜色规范） */
.room-icon-purple {
  color: #8b5cf6;
}
.room-icon-orange {
  color: #f97316;
}
.room-name {
  font-size: 24rpx;
  color: #334155;
}
.room-right {
  text-align: right;
}
.room-data {
  font-size: 24rpx;
  font-weight: 600;
  color: #1e293b;
  display: block;
}
.room-status {
  font-size: 20rpx;
  display: block;
}
.room-status-green {
  color: #10b981;
}

/* 底部间距（完全复制首页mb-20，统一间距规范） */
.mb-20 {
  margin-bottom: 20rpx;
}

/* 全局按钮重置（完全复制首页，统一按钮样式，清除默认边框） */
button {
  padding: 0;
  margin: 0;
  line-height: 1;
}
button::after {
  border: none !important;
}
</style>