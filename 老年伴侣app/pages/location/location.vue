<template>
  <view class="page-location">
    <!-- 状态栏占位（适配手机顶部状态栏） -->
    <view class="status-bar-placeholder"></view>
    
    <!-- 页面内容区 -->
    <scroll-view 
      class="content-scroll" 
      scroll-y 
      @scroll="onScroll"
      scroll-with-animation
    >
      <!-- 位置卡片 -->
      <view class="location-card">
        <!-- 地图容器 -->
        <view class="map-container" :class="{ 'map-loaded': isMapLoaded }" @click="showMapDetail">
          <view class="map-loading" v-if="!isMapLoaded">
            <text class="loading-text">地图加载中...</text>
            <!-- 加载动画 -->
            <view class="loading-spinner"></view>
          </view>
          <view class="map-content" v-else>
            <text class="map-icon">🗺️</text>
            <text class="map-address">{{ currentAddress }}</text>
            <text class="map-status">定位成功 · 精度{{ accuracy }}米</text>
          </view>
        </view>
        
        <!-- 位置信息 -->
        <view class="location-info">
          <view class="info-header">
            <text class="info-title">当前位置</text>
            <text class="status-tag" :class="locationStatus === '安全' ? 'safe' : 'warning'">
              {{ locationStatus }}
            </text>
          </view>
          <view class="info-list">
            <view class="info-item">
              <text class="item-label">位置</text>
              <text class="item-value">{{ locationDesc }}</text>
            </view>
            <view class="info-item">
              <text class="item-label">详细地址</text>
              <text class="item-value">{{ currentAddress }}</text>
            </view>
            <view class="info-item">
              <text class="item-label">更新时间</text>
              <text class="item-value">{{ updateTime }}</text>
            </view>
            <view class="info-item">
              <text class="item-label">定位精度</text>
              <text class="item-value" :class="accuracy < 10 ? 'text-green' : 'text-amber'">
                {{ accuracy < 10 ? '高' : '中' }} (±{{ accuracy }}米)
              </text>
            </view>
          </view>
        </view>
      </view>

      <!-- 位置历史 -->
      <view class="history-card">
        <text class="history-title">位置历史</text>
        <view class="history-list">
          <view class="history-item" v-for="(item, index) in locationHistory" :key="index" @click="showHistoryDetail(item)">
            <view class="item-icon" :class="item.type">
              <text class="icon-text">📍</text>
            </view>
            <view class="item-content">
              <text class="content-title">{{ item.title }}</text>
              <text class="content-time">{{ item.timeRange }}</text>
              <text class="content-desc" v-if="item.desc">{{ item.desc }}</text>
            </view>
            <view class="item-arrow">
              <text class="arrow-text">›</text>
            </view>
          </view>
        </view>
        <button class="load-more-btn" @click="loadMoreHistory" v-if="hasMoreHistory">
          <text class="load-more-text">加载更多</text>
        </button>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, onLoad, onReady, onShow } from 'vue';

// 1. 响应式数据（核心状态管理）
const isMapLoaded = ref(false); // 地图是否加载完成
const currentAddress = ref('XX市XX区XX街道XX号'); // 当前详细地址
const locationDesc = ref('在家中 · 客厅'); // 位置描述
const locationStatus = ref('安全'); // 位置状态：安全/预警
const accuracy = ref(5); // 定位精度（米）
const updateTime = ref('2分钟前'); // 位置更新时间
const hasMoreHistory = ref(true); // 是否有更多历史记录

// 位置历史列表
const locationHistory = ref([
  {
    title: '在家中',
    timeRange: '今天 06:30 - 至今',
    type: 'blue',
    desc: '停留时长：5小时30分钟',
    address: 'XX市XX区XX街道XX号'
  },
  {
    title: '公园散步',
    timeRange: '今天 05:00 - 06:20',
    type: 'green',
    desc: '停留时长：1小时20分钟 · 步行约1000米',
    address: 'XX市XX区XX公园'
  }
]);

// 2. 页面生命周期
onLoad(() => {
  console.log('位置详情页加载');
  // 初始化定位
  initLocation();
});

onReady(() => {
  // 模拟地图加载
  setTimeout(() => {
    isMapLoaded.value = true;
    // 模拟定位精度更新
    accuracy.value = Math.floor(Math.random() * 10) + 1;
  }, 1500);
});

onShow(() => {
  // 每次页面显示时更新位置信息
  updateLocationInfo();
});

// 3. 核心方法
// 初始化定位
const initLocation = () => {
  // 模拟调用uni-app定位API
  uni.getLocation({
    type: 'gcj02', // 国测局坐标系，兼容高德/腾讯地图
    altitude: true,
    success: (res) => {
      console.log('定位成功：', res);
      // 模拟更新定位精度
      accuracy.value = Math.floor(res.accuracy) || 5;
      
      // 根据定位位置判断状态（示例逻辑）
      if (res.longitude < 120 || res.latitude < 30) {
        locationStatus.value = '预警';
      }
    },
    fail: (err) => {
      console.error('定位失败：', err);
      uni.showToast({
        title: '定位失败，显示上次位置',
        icon: 'none'
      });
    }
  });
};

// 更新位置信息
const updateLocationInfo = () => {
  // 模拟实时更新时间
  const now = new Date();
  const minutes = now.getMinutes();
  updateTime.value = `${minutes % 10 + 1}分钟前`;
  
  // 随机模拟位置状态变化（仅作示例）
  if (Math.random() > 0.95) {
    locationStatus.value = Math.random() > 0.5 ? '安全' : '预警';
  }
};

// 查看地图详情
const showMapDetail = () => {
  uni.navigateTo({
    url: '/pages/mapDetail/mapDetail?address=' + encodeURIComponent(currentAddress.value),
    fail: (err) => {
      uni.showToast({
        title: '地图详情页未配置',
        icon: 'none'
      });
    }
  });
};

// 查看历史记录详情
const showHistoryDetail = (item) => {
  uni.showModal({
    title: item.title,
    content: `地址：${item.address}\n时间：${item.timeRange}\n${item.desc}`,
    confirmText: '查看地图',
    cancelText: '关闭',
    success: (res) => {
      if (res.confirm) {
        uni.navigateTo({
          url: `/pages/mapDetail/mapDetail?address=${encodeURIComponent(item.address)}&type=history`
        });
      }
    }
  });
};

// 加载更多历史记录
const loadMoreHistory = () => {
  uni.showToast({
    title: '加载中...',
    icon: 'none'
  });
  
  // 模拟加载更多数据
  setTimeout(() => {
    const newHistory = [
      {
        title: '菜市场采购',
        timeRange: '今天 04:00 - 04:50',
        type: 'amber',
        desc: '停留时长：50分钟 · 步行约800米',
        address: 'XX市XX区XX菜市场'
      },
      {
        title: '社区活动中心',
        timeRange: '昨天 14:00 - 16:30',
        type: 'purple',
        desc: '停留时长：2小时30分钟',
        address: 'XX市XX区XX社区活动中心'
      }
    ];
    
    locationHistory.value.push(...newHistory);
    hasMoreHistory.value = false; // 模拟只有两页数据
    
    uni.showToast({
      title: '加载完成',
      icon: 'success'
    });
  }, 1500);
};

// 滚动事件
const onScroll = (e) => {
  // 可添加滚动相关逻辑，如导航栏样式变化
  // console.log('滚动位置：', e.detail.scrollTop);
};

// 页面返回（可在页面导航栏按钮中调用）
const goBack = () => {
  uni.navigateBack({ delta: 1 });
};
</script>

<style scoped>
/* 根容器：铺满屏幕 */
.page-location {
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
  padding: 16rpx 20rpx 80rpx 20rpx;
  -webkit-overflow-scrolling: touch;
}
/* 隐藏滚动条 */
.content-scroll::-webkit-scrollbar {
  display: none;
}
.content-scroll {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* 位置卡片 */
.location-card {
  background: #fff;
  border-radius: 32rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
  margin-bottom: 20rpx;
  overflow: hidden;
}

/* 地图容器 */
.map-container {
  width: 100%;
  height: 240rpx;
  background-color: #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.map-container.map-loaded {
  background-color: #eff6ff;
}
.map-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.loading-text {
  font-size: 24rpx;
  color: #94a3b8;
  margin-bottom: 16rpx;
}
/* 加载动画 */
.loading-spinner {
  width: 32rpx;
  height: 32rpx;
  border: 4rpx solid #e2e8f0;
  border-top: 4rpx solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
/* 地图内容 */
.map-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20rpx;
  box-sizing: border-box;
}
.map-icon {
  font-size: 48rpx;
  margin-bottom: 12rpx;
}
.map-address {
  font-size: 24rpx;
  color: #334155;
  text-align: center;
  margin-bottom: 8rpx;
  font-weight: 500;
}
.map-status {
  font-size: 20rpx;
  color: #64748b;
}

/* 位置信息 */
.location-info {
  padding: 20rpx;
}
.info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}
.info-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #334155;
}
.status-tag {
  padding: 4rpx 12rpx;
  border-radius: 20rpx;
  font-size: 20rpx;
  font-weight: 500;
}
.status-tag.safe {
  background-color: #dcfce7;
  color: #16a34a;
}
.status-tag.warning {
  background-color: #fffbeb;
  color: #f59e0b;
}
/* 信息列表 */
.info-list {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}
.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8rpx 0;
  border-bottom: 1px solid #f1f5f9;
}
.info-item:last-child {
  border-bottom: none;
}
.item-label {
  font-size: 24rpx;
  color: #64748b;
}
.item-value {
  font-size: 24rpx;
  color: #1e293b;
  text-align: right;
  flex: 1;
  margin-left: 20rpx;
}
.text-green {
  color: #10b981;
}
.text-amber {
  color: #f59e0b;
}

/* 历史记录卡片 */
.history-card {
  background: #fff;
  border-radius: 32rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
  padding: 20rpx;
}
.history-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #334155;
  display: block;
  margin-bottom: 16rpx;
}
/* 历史列表 */
.history-list {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  margin-bottom: 16rpx;
}
.history-item {
  display: flex;
  align-items: center;
  padding: 16rpx;
  background-color: #f8fafc;
  border-radius: 20rpx;
}
.item-icon {
  width: 48rpx;
  height: 48rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-right: 12rpx;
}
.item-icon.blue {
  background-color: #3b82f6;
}
.item-icon.green {
  background-color: #10b981;
}
.item-icon.amber {
  background-color: #f59e0b;
}
.item-icon.purple {
  background-color: #9333ea;
}
.icon-text {
  font-size: 24rpx;
  color: #fff;
}
.item-content {
  flex: 1;
}
.content-title {
  font-size: 24rpx;
  font-weight: 600;
  color: #1e293b;
  display: block;
  margin-bottom: 4rpx;
}
.content-time {
  font-size: 20rpx;
  color: #64748b;
  display: block;
  margin-bottom: 4rpx;
}
.content-desc {
  font-size: 18rpx;
  color: #94a3b8;
  display: block;
}
.item-arrow {
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.arrow-text {
  font-size: 24rpx;
  color: #cbd5e1;
}
/* 加载更多按钮 */
.load-more-btn {
  width: 100%;
  background-color: #f8fafc;
  color: #475569;
  border-radius: 20rpx;
  padding: 12rpx;
  border: 1px solid #e2e8f0;
}
.load-more-text {
  font-size: 24rpx;
}
</style>