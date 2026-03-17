<template>
  <view class="page-location">
    <!-- 状态栏占位（和首页完全一致的渐变背景） -->
    <view class="status-bar-placeholder"></view>
    
    <!-- 顶部导航栏（复用首页渐变样式+滚动阴影，保留返回/导航双按钮） -->
    <view class="page-header" :class="{ 'header-scroll': isScroll }">
      <!-- 返回按钮（首页同款按钮样式+点击动画） -->
      <button class="header-btn back-btn" @click="closeLocation">
        <text class="back-icon">←</text>
      </button>
      <!-- 导航标题（和首页字体/大小一致） -->
      <text class="header-title">位置详情</text>
      <!-- 地图导航按钮（首页同款圆形按钮） -->
      <button class="header-btn nav-btn" @click="gotoNav">
        <text class="nav-icon">🗺️</text>
      </button>
    </view>

    <!-- 内容滚动容器（和首页完全相同的动态高度+滚动监听+内边距） -->
    <scroll-view 
      class="content-scroll" 
      scroll-y 
      @scroll="onScroll"
      scroll-with-animation
      :style="{ height: scrollViewHeight + 'px' }"
    >
      <!-- 地图卡片（首页同款白色卡片样式：圆角32rpx/阴影/边框） -->
      <view class="map-card" :class="{ 'item-active': isClick }" @click="gotoMapFull">
        <view class="map-card-header">
          <text class="card-title">实时定位地图</text>
          <text class="map-status" :class="{ 'status-normal': isLocationNormal }">
            {{ isLocationNormal ? '定位正常' : '定位异常' }}
          </text>
        </view>
        <!-- 地图容器（和首页视频卡片占位比一致16:9） -->
        <view class="map-container">
          <image 
            class="map-placeholder" 
            src="/static/images/map-placeholder.png" 
            mode="aspectFill"
          ></image>
          <view class="map-loading" v-if="isMapLoading">
            <text class="loading-text">地图加载中...</text>
          </view>
        </view>
      </view>

      <!-- 当前位置信息卡片（首页同款白色卡片样式） -->
      <view class="location-info-card">
        <view class="card-header">
          <text class="card-title">当前位置</text>
          <text class="safe-tag">安全</text>
        </view>
        <!-- 位置信息项（复用首页环境卡片/健康提醒的信息项布局） -->
        <view class="info-list">
          <view class="info-item">
            <text class="info-label">位置</text>
            <text class="info-value">在家中 · 客厅</text>
          </view>
          <view class="info-item">
            <text class="info-label">详细地址</text>
            <text class="info-value">XX市XX区XX街道XX号XX小区3栋2单元501</text>
          </view>
          <view class="info-item">
            <text class="info-label">更新时间</text>
            <text class="info-value">2分钟前</text>
          </view>
          <view class="info-item">
            <text class="info-label">定位精度</text>
            <text class="info-value precision-high">高 (±5米)</text>
          </view>
        </view>
      </view>

      <!-- 位置历史卡片（首页同款白色卡片样式，复用历史列表布局） -->
      <view class="location-history-card mb-20">
        <view class="card-header">
          <text class="card-title">位置历史</text>
          <text class="history-count">2条</text>
        </view>
        <!-- 历史列表（复用首页快捷操作/健康提醒的项布局） -->
        <view class="history-list">
          <view class="history-item" v-for="(item, index) in historyList" :key="index">
            <view class="history-icon-box" :class="item.iconBg">
              <text class="history-icon">{{ item.icon }}</text>
            </view>
            <view class="history-content">
              <text class="history-place">{{ item.place }}</text>
              <text class="history-time">{{ item.time }}</text>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 自定义tabBar（和首页保持一致，注释保留） -->
    <!-- <custom-tabbar /> -->
  </view>
</template>

<script setup>
// 导入和首页一致的Vue API，遵循代码规范
import { ref, onMounted, onUnmounted } from 'vue';

// 响应式数据（和首页命名/类型一致，新增地图相关状态）
const isScroll = ref(false);    // 导航栏滚动状态（首页同款逻辑）
const isClick = ref(false);     // 通用点击动画（首页同款）
const scrollViewHeight = ref(0);// 滚动容器动态高度（和首页计算公式完全一致）
const isLocationNormal = ref(true); // 定位状态
const isMapLoading = ref(true); // 地图加载状态
const historyList = ref([      // 位置历史数据（结构清晰，适配样式）
  {
    icon: '📍',
    iconBg: 'purple-bg',
    place: '在家中',
    time: '今天 06:30 - 至今'
  },
  {
    icon: '🌳',
    iconBg: 'green-bg',
    place: '公园散步',
    time: '今天 05:00 - 06:20'
  }
]);

// 页面挂载初始化（和首页完全相同的高度计算+适配逻辑）
onMounted(() => {
  // 动态计算scroll-view高度 - 复制首页原代码，保证无偏差
  try {
    const systemInfo = uni.getSystemInfoSync();
    const screenHeight = systemInfo.windowHeight;
    const statusBarH = systemInfo.statusBarHeight || 0;
    const navBarH = 88 / 2;  // 首页统一导航栏高度（88rpx转px）
    const tabBarH = 100 / 2; // 首页统一tabBar高度（100rpx转px）
    scrollViewHeight.value = screenHeight - statusBarH - navBarH - tabBarH;
  } catch (e) {
    scrollViewHeight.value = 500; // 异常降级，和首页一致
  }

  // 模拟地图加载完成（2秒后隐藏加载提示）
  setTimeout(() => {
    isMapLoading.value = false;
    console.log('地图加载完成');
  }, 2000);
});

// 页面卸载清理
onUnmounted(() => {});

// 滚动事件处理 - 和首页完全一致：scrollTop>20触发导航栏阴影
const onScroll = (e) => {
  isScroll.value = e.detail.scrollTop > 20;
};

// 通用点击动画函数 - 直接复制首页原代码，保证交互一致
const handleFunctionClick = (callback) => {
  isClick.value = true;
  setTimeout(() => {
    isClick.value = false;
    callback();
  }, 100);
};

// 关闭位置详情页（返回上一页，首页同款跳转逻辑）
const closeLocation = () => {
  handleFunctionClick(() => {
    uni.navigateBack({ delta: 1 });
  });
};

// 地图全屏查看（预留跳转，首页同款跳转规范）
const gotoMapFull = () => {
  if (isMapLoading.value) {
    uni.showToast({ title: '地图加载中，请稍候', icon: 'none' });
    return;
  }
  handleFunctionClick(() => {
    uni.showToast({ title: '地图全屏功能开发中', icon: 'none', duration: 2000 });
    // 后续开发替换为实际跳转
    // uni.navigateTo({ url: '/pages/location/map-full/map-full' });
  });
};

// 地图导航功能（首页同款提示+错误处理规范）
const gotoNav = () => {
  handleFunctionClick(() => {
    uni.showModal({
      title: '地图导航',
      content: '是否打开原生地图进行导航？',
      confirmText: '确认',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          // 调用uni-app原生地图导航
          uni.openLocation({
            latitude: 39.9042, // 示例纬度，后续替换为实际定位纬度
            longitude: 116.4074, // 示例经度，后续替换为实际定位经度
            address: 'XX市XX区XX街道XX号XX小区3栋2单元501',
            name: '当前位置',
            fail: (err) => {
              console.error('导航失败：', err);
              uni.showToast({ title: '导航功能暂不支持', icon: 'none' });
            }
          });
        }
      }
    });
  });
};
</script>

<style scoped>
/* 基础样式 - 复制首页page-device，仅修改类名，保证布局一致 */
.page-location {
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

/* 状态栏占位 - 直接复制首页原样式，渐变背景完全一致 */
.status-bar-placeholder {
  height: var(--status-bar-height);
  width: 100%;
  background: linear-gradient(135deg, #3b82f6 0%, #4f46e5 100%);
  flex-shrink: 0;
}

/* 顶部导航栏 - 完全复制首页page-header样式，仅调整按钮布局 */
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
/* 导航栏滚动阴影 - 和首页完全一致 */
.header-scroll {
  padding: 16rpx 24rpx;
  box-shadow: 0 2rpx 10rpx rgba(59, 130, 246, 0.2);
}
/* 导航按钮 - 复制首页header-btn样式，圆形半透背景 */
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
/* 按钮图标 - 和首页字体大小/颜色一致 */
.back-icon, .nav-icon {
  font-size: 28rpx;
  color: #fff;
}
/* 导航标题 - 复制首页header-title样式，字体/大小/间距一致 */
.header-title {
  font-size: 32rpx;
  font-weight: 700;
  letter-spacing: 2rpx;
}

/* 内容滚动区 - 直接复制首页content-scroll原样式，无任何修改 */
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

/* 地图卡片 - 首页同款白色卡片样式：圆角32rpx/阴影/边框/间距 */
.map-card {
  background: #fff;
  border-radius: 32rpx;
  padding: 28rpx 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
  margin-bottom: 28rpx;
  width: 100%;
  box-sizing: border-box;
  transition: all 0.2s ease;
}
/* 点击动画 - 和首页env-card/function-item一致 */
.map-card.item-active {
  transform: scale(0.98);
}
/* 卡片头部 - 复用首页视频/环境卡片头部布局 */
.map-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}
/* 卡片标题 - 统一复用首页card-title样式，字体/颜色/大小一致 */
.card-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #334155;
}
/* 地图状态标签 - 复用首页安全标签样式规范 */
.map-status {
  font-size: 22rpx;
  color: #22c55e;
  font-weight: 500;
}
.status-normal {
  color: #3b82f6;
}
/* 地图容器 - 复用首页video-container样式，16:9占位比+圆角24rpx */
.map-container {
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  background-color: #e2e8f0;
  border-radius: 24rpx;
  overflow: hidden;
}
.map-placeholder {
  width: 100%;
  height: 100%;
  opacity: 0.8;
}
/* 地图加载提示 - 居中布局，和首页加载提示样式一致 */
.map-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
}
.loading-text {
  font-size: 24rpx;
  color: #94a3b8;
}

/* 当前位置信息卡片 - 首页同款白色卡片样式，间距28rpx */
.location-info-card {
  background: #fff;
  border-radius: 32rpx;
  padding: 28rpx 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
  margin-bottom: 28rpx;
  width: 100%;
  box-sizing: border-box;
}
/* 卡片头部 - 左右布局，和地图卡片一致 */
.location-info-card .card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}
/* 安全标签 - 直接复制首页safe-tag原样式，无修改 */
.safe-tag {
  background-color: #dcfce7;
  color: #22c55e;
  padding: 4rpx 12rpx;
  border-radius: 12rpx;
  font-size: 20rpx;
}
/* 信息列表 - 纵向布局，复用首页环境卡片信息项间距 */
.info-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  padding: 0 8rpx;
}
/* 信息项 - 左右两端对齐，复用首页健康提醒/环境卡片布局 */
.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16rpx;
  border-bottom: 1px solid #f1f5f9;
}
.info-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}
/* 信息标签 - 复制首页env-item-label/info-label样式，颜色/大小一致 */
.info-label {
  font-size: 26rpx;
  color: #94a3b8;
  min-width: 120rpx;
}
/* 信息值 - 复制首页info-value样式，对齐方式优化 */
.info-value {
  font-size: 26rpx;
  color: #334155;
  text-align: right;
  flex: 1;
}
/* 高精度文字 - 绿色强调，和首页环境卡片提示色一致 */
.precision-high {
  color: #22c55e;
  font-weight: 500;
}

/* 位置历史卡片 - 首页同款白色卡片，底部间距和首页一致 */
.location-history-card {
  background: #fff;
  border-radius: 32rpx;
  padding: 28rpx 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
  width: 100%;
  box-sizing: border-box;
}
/* 历史卡片头部 - 复用首页health-tip-header布局 */
.location-history-card .card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}
/* 历史数量 - 复制首页tip-count样式，颜色/大小一致 */
.history-count {
  font-size: 22rpx;
  color: #3b82f6;
  font-weight: 600;
}
/* 历史列表 - 纵向布局，复用首页function-grid/history-list间距 */
.history-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  padding: 0 8rpx;
}
/* 历史项 - 复用首页tip-item布局，图标+内容 */
.history-item {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 20rpx;
  background-color: #faf5ff;
  border-radius: 24rpx;
  border: 1px solid #f3e8ff;
  transition: all 0.2s ease;
}
.history-item:active {
  transform: scale(0.98);
}
/* 历史图标盒子 - 复用首页function-icon-box样式，圆形80rpx */
.history-icon-box {
  font-size: 32rpx;
  width: 80rpx;
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  border-radius: 50%;
  flex-shrink: 0;
}
/* 历史内容 - 纵向布局，复用首页tip-content样式 */
.history-content {
  flex: 1;
}
.history-place {
  font-size: 26rpx;
  font-weight: 600;
  color: #334155;
  display: block;
  margin-bottom: 6rpx;
}
.history-time {
  font-size: 22rpx;
  color: #94a3b8;
  display: block;
}

/* 间距类 - 直接复制首页mb-20原样式 */
.mb-20 {
  margin-bottom: 20rpx;
}

/* 颜色背景类 - 直接复制首页所有icon-bg样式，保证图标配色一致 */
.blue-bg { background-color: #eff6ff; color: #3b82f6; }
.green-bg { background-color: #f0fdf4; color: #22c55e; }
.amber-bg { background-color: #fffbeb; color: #f59e0b; }
.red-bg { background-color: #fee2e2; color: #dc2626; }
.purple-bg { background-color: #faf5ff; color: #8b5cf6; }
.teal-bg { background-color: #ccfbf1; color: #14b8a6; }
.pink-bg { background-color: #fdf2f8; color: #ec4899; }

/* 全局按钮重置 - 直接复制首页原样式，清除uni-app默认按钮样式 */
button {
  padding: 0;
  margin: 0;
  line-height: 1;
}
button::after {
  border: none !important;
}
</style>