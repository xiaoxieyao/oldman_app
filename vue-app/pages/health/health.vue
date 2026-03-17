<template>
  <view class="page-health">
    <!-- 状态栏占位（适配手机顶部状态栏） -->
    <view class="status-bar-placeholder"></view>
    
    <!-- 顶部导航栏 -->
    <view class="page-header" :class="{ 'header-scroll': isScroll }">
      <text class="header-title">健康数据中心</text>
      <button class="header-btn" @click="gotoSetting">
        <text class="setting-icon">⚙️</text>
      </button>
    </view>

    <!-- 内容滚动容器（动态高度适配自定义tabBar） -->
    <scroll-view 
      class="content-scroll" 
      scroll-y 
      @scroll="onScroll"
      scroll-with-animation
      :style="{ height: scrollViewHeight + 'px' }"
    >
      <!-- 健康状态总览卡片 -->
      <view class="health-card">
        <view class="health-card-header">
          <text class="health-card-subtitle">今日健康状态</text>
          <text class="health-card-status">正常</text>
        </view>
        <view class="health-card-grid">
          <view class="health-card-item">
            <text class="health-item-label">心率</text>
            <text class="health-item-value">{{ heartRate }} 次/分</text>
            <text class="health-item-tip">正常范围：60-100</text>
          </view>
          <view class="health-card-item">
            <text class="health-item-label">血压</text>
            <text class="health-item-value">{{ bloodPressure }}</text>
            <text class="health-item-tip">正常范围：<140/90</text>
          </view>
          <view class="health-card-item">
            <text class="health-item-label">血糖</text>
            <text class="health-item-value">{{ bloodSugar }} mmol/L</text>
            <text class="health-item-tip">空腹正常：3.9-6.1</text>
          </view>
          <view class="health-card-item">
            <text class="health-item-label">步数</text>
            <text class="health-item-value">{{ steps }} 步</text>
            <text class="health-item-tip">今日目标：8000</text>
          </view>
        </view>
      </view>

      <!-- 用药记录卡片 -->
      <view class="medicine-card">
        <view class="medicine-card-header">
          <text class="medicine-card-title">今日用药记录</text>
          <button class="add-medicine-btn" @click="addMedicine">+ 添加</button>
        </view>
        <view class="medicine-list">
          <view class="medicine-item" v-for="(item, index) in medicineList" :key="index">
            <view class="medicine-icon">💊</view>
            <view class="medicine-info">
              <text class="medicine-name">{{ item.name }}</text>
              <text class="medicine-time">{{ item.time }} · {{ item.dosage }}</text>
            </view>
            <view class="medicine-status" :class="{ 'status-done': item.done }">
              <text v-if="item.done">已服用</text>
              <text v-else>未服用</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 健康趋势图表 -->
      <view class="chart-card">
        <view class="chart-card-header">
          <text class="chart-card-title">心率趋势（7天）</text>
          <button class="chart-type-btn" @click="switchChartType">切换指标</button>
        </view>
        <view class="chart-container">
          <image 
            class="chart-placeholder" 
            src="/static/images/chart-placeholder.png" 
            mode="aspectFill"
          ></image>
        </view>
      </view>

      <!-- 健康建议 -->
      <view class="advice-card mb-20">
        <view class="advice-card-header">
          <text class="advice-card-title">健康建议</text>
        </view>
        <view class="advice-list">
          <view class="advice-item">
            <text class="advice-icon">💡</text>
            <text class="advice-content">今日步数未达标，建议晚饭后散步30分钟</text>
          </view>
          <view class="advice-item">
            <text class="advice-icon">💧</text>
            <text class="advice-content">每日饮水量建议不少于1500ml</text>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 自定义tabBar组件 -->
    <custom-tabbar />
  </view>
</template>

<script setup>
// 1. 导入自定义tabBar组件
import customTabbar from '@/components/custom-tabbar/custom-tabbar.vue';

// 2. 只从vue导入Vue核心API（生命周期/响应式）
import { ref, onMounted, onUnmounted } from 'vue';

// 响应式数据
const heartRate = ref(78);
const bloodPressure = ref('128/82');
const bloodSugar = ref(5.6);
const steps = ref(6542);
const isScroll = ref(false);
const scrollViewHeight = ref(0); // 动态计算scroll-view高度
const medicineList = ref([
  { name: '降压药', time: '08:00', dosage: '1片', done: true },
  { name: '降糖药', time: '18:00', dosage: '1片', done: false }
]);
let dataTimer = null;

// Vue生命周期：页面挂载时初始化
onMounted(() => {
  // 1. 动态计算scroll-view高度（适配自定义tabBar）
  try {
    const systemInfo = uni.getSystemInfoSync();
    const screenHeight = systemInfo.windowHeight;
    const statusBarH = systemInfo.statusBarHeight || 0;
    const navBarH = 88 / 2; // 导航栏88rpx转px
    // 导航栏使用固定定位，不需要从高度中减去
    // 考虑底部安全区域高度
    const safeAreaBottom = systemInfo.safeArea?.bottom || 0;
    const screenBottom = systemInfo.screenHeight || 0;
    const safeAreaHeight = Math.max(0, screenBottom - safeAreaBottom);
    scrollViewHeight.value = screenHeight - statusBarH - navBarH - (safeAreaHeight / 2);
  } catch (e) {
    scrollViewHeight.value = 500; // 异常降级
  }

  // 2. 模拟健康数据刷新
  simulateHealthDataRefresh();

  // 3. 页面加载时的逻辑（替代onLoad）
  onLoadLogic();
});

// Vue生命周期：页面卸载时清理
onUnmounted(() => {
  if (dataTimer) clearInterval(dataTimer);
});

// uni-app页面生命周期：onLoad（直接定义，无需导入）
const onLoadLogic = () => {
  // 校验登录状态
  const isLogin = uni.getStorageSync('isLogin');
  if (!isLogin) {
    uni.redirectTo({ url: '/pages/auth/auth' });
    uni.showToast({ title: '请先登录', icon: 'none' });
    return;
  }
};

// uni-app页面生命周期：onShow（直接定义，无需导入）
const onShowLogic = () => {
  // 页面显示时刷新数据
  updateHealthData();
};

// 模拟健康数据定时刷新
const simulateHealthDataRefresh = () => {
  dataTimer = setInterval(() => {
    // 小幅波动模拟实时数据
    heartRate.value = Math.floor(70 + Math.random() * 10);
    steps.value = Math.floor(6500 + Math.random() * 100);
  }, 10000);
};

// 更新健康数据
const updateHealthData = () => {
  bloodPressure.value = `${Math.floor(120 + Math.random() * 10)}/${Math.floor(80 + Math.random() * 5)}`;
  bloodSugar.value = Number((5.0 + Math.random() * 1.0).toFixed(1));
};

// 滚动事件处理
const onScroll = (e) => {
  isScroll.value = e.detail.scrollTop > 20;
};

// 跳转设置页
const gotoSetting = () => {
  handleFunctionClick(() => {
    console.log('执行设置页跳转，路径：/pages/setting/setting');
    uni.navigateTo({
      url: '/pages/setting/setting',
      fail: (err) => {
        console.error('设置页跳转失败：', err);
        uni.showToast({
          title: `跳转失败：${err.errMsg || '页面不存在'}`,
          icon: 'none',
          duration: 3000
        });
      }
    });
  });
};

// 添加用药记录 - 重点修复：改为实际跳转到添加用药记录页面
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

// 切换图表类型
const switchChartType = () => {
  uni.showToast({ title: '图表切换功能暂未开发', icon: 'none', duration: 2000 });
};

// 返回上一页
const goBack = () => {
  uni.navigateBack({ delta: 1 });
};
</script>

<style scoped>
/* 基础样式 */
.page-health {
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

/* 状态栏占位 */
.status-bar-placeholder {
  height: var(--status-bar-height);
  width: 100%;
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  flex-shrink: 0;
}

/* 顶部导航 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 24rpx;
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: #fff;
  transition: all 0.3s ease;
  width: 100%;
  box-sizing: border-box;
  height: 88rpx;
  flex-shrink: 0;
}
.header-scroll {
  padding: 16rpx 24rpx;
  box-shadow: 0 2rpx 10rpx rgba(139, 92, 246, 0.2);
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
.setting-icon {
  font-size: 28rpx;
  color: #fff;
}

/* 内容滚动区 */
.content-scroll {
  overflow-y: auto;
  padding: 20rpx 16rpx 40rpx 16rpx;
  -webkit-overflow-scrolling: touch;
  width: 100%;
  box-sizing: border-box;
  flex: none;
  background-color: #f8fafc;
}
.content-scroll::-webkit-scrollbar {
  display: none;
}

/* 健康总览卡片 */
.health-card {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  border-radius: 32rpx;
  padding: 28rpx 20rpx;
  color: #fff;
  box-shadow: 0 8rpx 24rpx rgba(139, 92, 246, 0.2);
  margin-bottom: 28rpx;
  width: 100%;
  box-sizing: border-box;
}
.health-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28rpx;
}
.health-card-subtitle {
  font-size: 24rpx;
  color: #e9d5ff;
  display: block;
}
.health-card-status {
  background: rgba(74, 222, 128, 0.3);
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
  font-size: 22rpx;
  font-weight: 500;
}
.health-card-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20rpx;
}
.health-card-item {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12rpx);
  border-radius: 24rpx;
  padding: 24rpx 16rpx;
  border: 1px solid rgba(255, 255, 255, 0.2);
}
.health-item-label {
  font-size: 24rpx;
  color: #e9d5ff;
  display: block;
  margin-bottom: 12rpx;
}
.health-item-value {
  font-size: 36rpx;
  font-weight: bold;
  display: block;
  margin-bottom: 8rpx;
}
.health-item-tip {
  font-size: 20rpx;
  color: #f3e8ff;
}

/* 用药记录卡片 */
.medicine-card {
  background: #fff;
  border-radius: 32rpx;
  padding: 28rpx 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
  margin-bottom: 28rpx;
  width: 100%;
  box-sizing: border-box;
}
.medicine-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}
.medicine-card-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #334155;
}
.add-medicine-btn {
  background-color: #8b5cf6;
  color: #fff;
  border: none;
  border-radius: 20rpx;
  padding: 8rpx 16rpx;
  font-size: 22rpx;
}
.medicine-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.medicine-item {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 20rpx;
  background-color: #faf5ff;
  border-radius: 24rpx;
}
.medicine-icon {
  font-size: 32rpx;
  width: 48rpx;
  height: 48rpx;
  line-height: 48rpx;
  text-align: center;
  background-color: #e9d5ff;
  border-radius: 16rpx;
}
.medicine-info {
  flex: 1;
}
.medicine-name {
  font-size: 26rpx;
  font-weight: 600;
  color: #334155;
  display: block;
  margin-bottom: 6rpx;
}
.medicine-time {
  font-size: 22rpx;
  color: #64748b;
}
.medicine-status {
  font-size: 22rpx;
  padding: 4rpx 12rpx;
  border-radius: 12rpx;
  background-color: #fee2e2;
  color: #dc2626;
}
.status-done {
  background-color: #dcfce7;
  color: #22c55e;
}

/* 图表卡片 */
.chart-card {
  background: #fff;
  border-radius: 32rpx;
  padding: 28rpx 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
  margin-bottom: 28rpx;
  width: 100%;
  box-sizing: border-box;
}
.chart-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}
.chart-card-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #334155;
}
.chart-type-btn {
  background-color: #eff6ff;
  color: #3b82f6;
  border: none;
  border-radius: 20rpx;
  padding: 8rpx 16rpx;
  font-size: 22rpx;
}
.chart-container {
  width: 100%;
  aspect-ratio: 16/9;
  background-color: #f8fafc;
  border-radius: 24rpx;
  overflow: hidden;
}
.chart-placeholder {
  width: 100%;
  height: 100%;
  opacity: 0.9;
}

/* 健康建议卡片 */
.advice-card {
  background: #fff;
  border-radius: 32rpx;
  padding: 28rpx 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
  width: 100%;
  box-sizing: border-box;
}
.advice-card-header {
  margin-bottom: 24rpx;
}
.advice-card-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #334155;
}
.advice-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.advice-item {
  display: flex;
  align-items: flex-start;
  gap: 16rpx;
  padding: 20rpx;
  background-color: #fffbeb;
  border-radius: 24rpx;
}
.advice-icon {
  font-size: 28rpx;
  margin-top: 2rpx;
}
.advice-content {
  font-size: 24rpx;
  color: #475569;
  line-height: 1.5;
}

/* 通用样式 */
.mb-20 {
  margin-bottom: 20rpx;
}
button {
  padding: 0;
  margin: 0;
  line-height: 1;
}
</style>