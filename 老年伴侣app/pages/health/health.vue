<template>
  <view class="page-health">
    <!-- 状态栏占位（适配手机顶部状态栏） -->
    <view class="status-bar-placeholder"></view>
    
    <!-- 页面内容区 -->
    <scroll-view 
      class="content-scroll" 
      scroll-y 
      @scroll="onScroll"
      scroll-with-animation
    >
      <!-- 健康概览卡片 -->
      <view class="health-overview-card" @click="showHealthDetail">
        <view class="card-header">
          <view class="header-left">
            <text class="header-subtitle">今日健康评分</text>
            <text class="header-main-title">{{ healthScore }}</text>
            <text class="header-desc">综合评分 · {{ scoreUpdateTime }}</text>
          </view>
          <text class="header-tag" :class="{ 'score-up': scoreTrend === 'up', 'score-down': scoreTrend === 'down' }">
            {{ scoreTrend === 'up' ? '+' : scoreTrend === 'down' ? '-' : '' }}{{ scoreChange }}
          </text>
        </view>
        <view class="card-grid">
          <view class="grid-item" @click="showDetail('heart')">
            <text class="item-label">心率</text>
            <text class="item-value">{{ heartRate }} 次/分</text>
            <text class="item-tip" :class="heartRate > 80 ? 'text-amber' : 'text-green'">
              {{ heartRate > 80 ? '略高' : '正常' }}
            </text>
          </view>
          <view class="grid-item" @click="showDetail('blood')">
            <text class="item-label">血压</text>
            <text class="item-value">{{ bloodPressure }} mmHg</text>
            <text class="item-tip text-amber">略高</text>
          </view>
          <view class="grid-item" @click="showDetail('step')">
            <text class="item-label">步数</text>
            <text class="item-value">{{ stepCount }} 步</text>
            <text class="item-tip text-green">正常</text>
          </view>
        </view>
      </view>

      <!-- 健康趋势图表 -->
      <view class="chart-card">
        <view class="chart-header">
          <text class="chart-title">健康趋势（7天）</text>
          <view class="chart-tab-group">
            <button class="chart-tab" :class="{ active: currentChart === 'heart' }" @click="switchChart('heart')">心率</button>
            <button class="chart-tab" :class="{ active: currentChart === 'blood' }" @click="switchChart('blood')">血压</button>
            <button class="chart-tab" :class="{ active: currentChart === 'step' }" @click="switchChart('step')">步数</button>
          </view>
        </view>
        <!-- 简易图表占位（预留echarts集成） -->
        <view class="chart-placeholder">
          <text class="placeholder-text">{{ chartTitleMap[currentChart] }}</text>
          <!-- 模拟图表数据点 -->
          <view class="chart-dots" v-if="currentChart === 'heart'">
            <view class="dot" v-for="(item, index) in heartRateData" :key="index" :style="{ height: item + 'rpx', bottom: '20rpx' }"></view>
          </view>
          <view class="chart-dots" v-if="currentChart === 'blood'">
            <view class="dot" v-for="(item, index) in bloodPressureData" :key="index" :style="{ height: item + 'rpx', bottom: '20rpx' }"></view>
          </view>
          <view class="chart-dots" v-if="currentChart === 'step'">
            <view class="dot" v-for="(item, index) in stepCountData" :key="index" :style="{ height: item + 'rpx', bottom: '20rpx' }"></view>
          </view>
        </view>
      </view>

      <!-- 健康提醒 -->
      <view class="remind-card">
        <text class="remind-title">健康提醒</text>
        <view class="remind-list">
          <view class="remind-item amber" v-for="(item, index) in remindList" :key="index">
            <view class="item-icon" :class="item.type">
              <text class="icon-text">{{ item.icon }}</text>
            </view>
            <view class="item-content">
              <text class="content-title">{{ item.title }}</text>
              <text class="content-desc">{{ item.desc }}</text>
              <text class="content-time">{{ item.time }}</text>
            </view>
            <button class="item-action" @click="handleRemindAction(item.id)">
              <text class="action-text">知道了</text>
            </button>
          </view>
        </view>
      </view>

      <!-- 用药记录 -->
      <view class="medicine-card">
        <view class="medicine-header">
          <text class="medicine-title">用药记录</text>
          <button class="medicine-more" @click="gotoMedicine">查看全部</button>
        </view>
        <view class="medicine-list">
          <view class="medicine-item" v-for="(item, index) in medicineList" :key="index">
            <view class="item-left">
              <view class="item-icon purple">
                <text class="icon-text">💊</text>
              </view>
              <view class="item-info">
                <text class="info-title">{{ item.name }}</text>
                <text class="info-desc">{{ item.time }} · {{ item.dosage }}</text>
                <text class="info-date">{{ item.date }}</text>
              </view>
            </view>
            <view class="item-status" :class="item.status === '已服用' ? 'green' : 'amber'">
              <text class="status-text">{{ item.status }}</text>
              <button v-if="item.status === '未服用'" class="take-btn" @click="takeMedicine(item.id)">
                <text class="take-text">立即服用</text>
              </button>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, onLoad, onShow } from 'vue';

// 1. 响应式数据（核心状态管理）
const healthScore = ref(92); // 健康评分
const scoreChange = ref(3); // 评分变化值
const scoreTrend = ref('up'); // 评分趋势：up/down/flat
const scoreUpdateTime = ref('14:30 更新'); // 评分更新时间
const heartRate = ref(78); // 心率
const bloodPressure = ref('128/82'); // 血压
const stepCount = ref(4580); // 步数
const currentChart = ref('heart'); // 当前选中的图表类型
const chartTitleMap = ref({
  heart: '心率趋势图表',
  blood: '血压趋势图表',
  step: '步数趋势图表'
});

// 模拟7天图表数据
const heartRateData = ref([68, 72, 75, 78, 80, 77, 78]);
const bloodPressureData = ref([120, 122, 125, 128, 130, 127, 128]);
const stepCountData = ref([3500, 4000, 4200, 4580, 4300, 4100, 4580]);

// 健康提醒列表
const remindList = ref([
  {
    id: 1,
    type: 'amber',
    icon: '⚠',
    title: '血压略高',
    desc: '建议减少盐分摄入，适当休息',
    time: '14:20',
    isRead: false
  },
  {
    id: 2,
    type: 'blue',
    icon: '💧',
    title: '饮水量不足',
    desc: '今日仅饮用400ml，建议达到1500ml',
    time: '13:10',
    isRead: false
  }
]);

// 用药记录列表
const medicineList = ref([
  {
    id: 1,
    name: '降压药',
    time: '每日 08:00',
    dosage: '1片',
    date: '2025-01-14',
    status: '已服用'
  },
  {
    id: 2,
    name: '降糖药',
    time: '每日 18:00',
    dosage: '1片',
    date: '2025-01-14',
    status: '未服用'
  }
]);

// 2. 页面生命周期
onLoad(() => {
  // 初始化数据
  updateHealthData();
});

onShow(() => {
  // 每次页面显示时更新数据
  updateHealthData();
});

// 3. 核心方法
// 更新健康数据（模拟实时刷新）
const updateHealthData = () => {
  // 模拟评分小幅波动
  const randomChange = Math.floor(Math.random() * 5);
  if (Math.random() > 0.5) {
    scoreTrend.value = 'up';
    scoreChange.value = randomChange;
    healthScore.value += randomChange;
  } else {
    scoreTrend.value = 'down';
    scoreChange.value = randomChange;
    healthScore.value -= randomChange;
  }
  
  // 限制评分范围 0-100
  if (healthScore.value > 100) healthScore.value = 100;
  if (healthScore.value < 0) healthScore.value = 0;
  
  // 更新时间
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  scoreUpdateTime.value = `${hours}:${minutes} 更新`;
  
  // 模拟心率波动
  heartRate.value = Math.floor(70 + Math.random() * 10);
};

// 切换图表类型
const switchChart = (type) => {
  currentChart.value = type;
  uni.showToast({
    title: `已切换到${chartTitleMap.value[type].replace('趋势图表', '')}`,
    icon: 'none',
    duration: 1500
  });
};

// 跳转到用药管理页
const gotoMedicine = () => {
  uni.navigateTo({
    url: '/pages/medicine/medicine'
  });
};

// 查看健康详情
const showHealthDetail = () => {
  uni.navigateTo({
    url: '/pages/healthDetail/healthDetail'
  });
};

// 查看单项健康数据详情
const showDetail = (type) => {
  const typeMap = {
    heart: '心率详情',
    blood: '血压详情',
    step: '步数详情'
  };
  uni.navigateTo({
    url: `/pages/healthDetail/healthDetail?type=${type}`
  });
};

// 处理提醒操作
const handleRemindAction = (id) => {
  const index = remindList.value.findIndex(item => item.id === id);
  if (index !== -1) {
    remindList.value[index].isRead = true;
    uni.showToast({
      title: '已标记为已读',
      icon: 'success',
      duration: 1000
    });
  }
};

// 标记服药
const takeMedicine = (id) => {
  const index = medicineList.value.findIndex(item => item.id === id);
  if (index !== -1) {
    medicineList.value[index].status = '已服用';
    uni.showToast({
      title: '已标记为已服用',
      icon: 'success',
      duration: 1000
    });
  }
};

// 滚动事件
const onScroll = (e) => {
  // 可添加滚动相关逻辑，如导航栏样式变化
  // console.log('滚动位置：', e.detail.scrollTop);
};
</script>

<style scoped>
/* 根容器：铺满屏幕 */
.page-health {
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

/* 健康概览卡片 */
.health-overview-card {
  background: linear-gradient(135deg, #16a34a 0%, #059669 100%);
  border-radius: 32rpx;
  padding: 24rpx 20rpx;
  color: #fff;
  box-shadow: 0 8rpx 24rpx rgba(16, 185, 129, 0.2);
  margin-bottom: 20rpx;
}
/* 卡片头部 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20rpx;
}
.header-subtitle {
  font-size: 24rpx;
  color: #d1fae5;
  display: block;
  margin-bottom: 4rpx;
}
.header-main-title {
  font-size: 48rpx;
  font-weight: bold;
  display: block;
  line-height: 1.2;
}
.header-desc {
  font-size: 20rpx;
  color: #d1fae5;
  display: block;
  margin-top: 4rpx;
}
.header-tag {
  background: rgba(255, 255, 255, 0.2);
  padding: 4rpx 12rpx;
  border-radius: 20rpx;
  font-size: 20rpx;
  font-weight: 500;
  margin-top: 8rpx;
}
.header-tag.score-up {
  color: #bbf7d0;
  background: rgba(74, 222, 128, 0.3);
}
.header-tag.score-down {
  color: #fecdd3;
  background: rgba(239, 68, 68, 0.3);
}
/* 卡片网格 */
.card-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx;
}
.grid-item {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12rpx);
  border-radius: 24rpx;
  padding: 20rpx 16rpx;
  border: 1px solid rgba(255, 255, 255, 0.2);
}
.item-label {
  font-size: 20rpx;
  color: #d1fae5;
  display: block;
  margin-bottom: 8rpx;
}
.item-value {
  font-size: 32rpx;
  font-weight: bold;
  display: block;
  line-height: 1.2;
}
.item-tip {
  font-size: 18rpx;
  display: block;
  margin-top: 8rpx;
}
.text-green {
  color: #bbf7d0;
}
.text-amber {
  color: #fef3c7;
}

/* 健康趋势图表卡片 */
.chart-card {
  background: #fff;
  border-radius: 32rpx;
  padding: 20rpx 16rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
  margin-bottom: 20rpx;
}
.chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16rpx;
}
.chart-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #334155;
}
.chart-tab-group {
  display: flex;
  gap: 8rpx;
}
.chart-tab {
  padding: 6rpx 12rpx;
  background-color: #f8fafc;
  color: #475569;
  font-size: 20rpx;
  border-radius: 20rpx;
  font-weight: 500;
  border: none;
  transition: all 0.2s ease;
}
.chart-tab.active {
  background-color: #10b981 !important;
  color: #fff !important;
}
/* 图表占位 */
.chart-placeholder {
  width: 100%;
  height: 240rpx;
  background-color: #f8fafc;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.placeholder-text {
  font-size: 24rpx;
  color: #94a3b8;
}
/* 模拟图表数据点 */
.chart-dots {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  padding: 0 20rpx;
}
.dot {
  width: 12rpx;
  background-color: #10b981;
  border-radius: 6rpx;
  transition: all 0.3s ease;
}

/* 健康提醒卡片 */
.remind-card {
  background: #fff;
  border-radius: 32rpx;
  padding: 20rpx 16rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
  margin-bottom: 20rpx;
}
.remind-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #334155;
  display: block;
  margin-bottom: 16rpx;
}
.remind-list {
  gap: 12rpx;
  display: flex;
  flex-direction: column;
}
.remind-item {
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 16rpx;
  border-radius: 20rpx;
  position: relative;
}
.remind-item.amber {
  background-color: #fffbeb;
}
.remind-item.blue {
  background-color: #eff6ff;
}
.item-icon {
  width: 48rpx;
  height: 48rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.item-icon.amber {
  background-color: #f59e0b;
}
.item-icon.blue {
  background-color: #3b82f6;
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
.content-desc {
  font-size: 20rpx;
  color: #64748b;
  display: block;
  margin-bottom: 4rpx;
}
.content-time {
  font-size: 18rpx;
  color: #94a3b8;
  display: block;
}
.item-action {
  background-color: #f8fafc;
  border-radius: 16rpx;
  padding: 6rpx 12rpx;
  border: none;
}
.action-text {
  font-size: 20rpx;
  color: #475569;
}

/* 用药记录卡片 */
.medicine-card {
  background: #fff;
  border-radius: 32rpx;
  padding: 20rpx 16rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
}
.medicine-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16rpx;
}
.medicine-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #334155;
}
.medicine-more {
  font-size: 20rpx;
  color: #2563eb;
  font-weight: 500;
  background: transparent;
  border: none;
  padding: 0;
}
.medicine-list {
  gap: 12rpx;
  display: flex;
  flex-direction: column;
}
.medicine-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx;
  background-color: #f8fafc;
  border-radius: 20rpx;
}
.item-left {
  display: flex;
  align-items: center;
  gap: 12rpx;
}
.item-icon.purple {
  background-color: #9333ea;
}
.item-info {
  display: flex;
  flex-direction: column;
}
.info-title {
  font-size: 24rpx;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4rpx;
}
.info-desc {
  font-size: 20rpx;
  color: #64748b;
  margin-bottom: 4rpx;
}
.info-date {
  font-size: 18rpx;
  color: #94a3b8;
}
.item-status {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8rpx;
}
.status-text {
  font-size: 20rpx;
  font-weight: 500;
}
.item-status.green .status-text {
  color: #10b981;
}
.item-status.amber .status-text {
  color: #f59e0b;
}
.take-btn {
  background-color: #3b82f6;
  color: #fff;
  border-radius: 16rpx;
  padding: 6rpx 12rpx;
  border: none;
}
.take-text {
  font-size: 18rpx;
}
</style>