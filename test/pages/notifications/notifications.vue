<template>
  <view class="page-notifications">
    <!-- 状态栏占位 -->
    <view class="status-bar-placeholder"></view>
    
    <!-- 顶部导航栏 -->
    <view class="page-header">
      <button class="back-btn" @click="goBack">
        <text class="back-icon">←</text>
      </button>
      <text class="header-title">报警记录</text>
      <view class="empty-btn"></view> <!-- 占位保持居中 -->
    </view>

    <!-- 筛选栏 -->
    <view class="filter-bar">
      <view 
        class="filter-item" 
        :class="{ active: currentFilter === 'all' }"
        @click="changeFilter('all')"
      >
        <text class="filter-text">全部</text>
      </view>
      <view 
        class="filter-item" 
        :class="{ active: currentFilter === 'unhandled' }"
        @click="changeFilter('unhandled')"
      >
        <text class="filter-text">未处理</text>
        <text class="badge" v-if="unhandledCount > 0">{{ unhandledCount }}</text>
      </view>
      <view 
        class="filter-item" 
        :class="{ active: currentFilter === 'handled' }"
        @click="changeFilter('handled')"
      >
        <text class="filter-text">已处理</text>
      </view>
    </view>

    <!-- 报警列表 -->
    <scroll-view 
      class="notifications-list" 
      scroll-y 
      :style="{ height: scrollViewHeight + 'px' }"
    >
      <!-- 空数据提示 -->
      <view class="empty-tip" v-if="filteredNotifications.length === 0">
        <text class="empty-icon">📭</text>
        <text class="empty-text">暂无{{ currentFilter === 'all' ? '' : (currentFilter === 'unhandled' ? '未处理' : '已处理') }}报警记录</text>
        <text class="empty-desc">所有报警信息都会在这里展示</text>
      </view>

      <!-- 报警记录项 -->
      <view 
        class="notification-item" 
        v-for="(item, index) in filteredNotifications" 
        :key="index"
        @click="viewDetail(item)"
      >
        <!-- 报警类型图标 -->
        <view class="notification-icon" :class="getIconClass(item.type)">
          <text class="icon-text">{{ getIconText(item.type) }}</text>
        </view>
        
        <!-- 报警内容 -->
        <view class="notification-content">
          <view class="content-header">
            <text class="notification-title">{{ item.title }}</text>
            <text class="notification-status" :class="item.status === 'unhandled' ? 'status-unhandled' : 'status-handled'">
              {{ item.status === 'unhandled' ? '未处理' : '已处理' }}
            </text>
          </view>
          <text class="notification-desc">{{ item.desc }}</text>
          <view class="content-footer">
            <text class="notification-time">{{ formatTime(item.time) }}</text>
            <text class="notification-location">{{ item.location }}</text>
          </view>
        </view>
        
        <!-- 操作按钮 -->
        <view class="notification-actions" v-if="item.status === 'unhandled'">
          <button class="handle-btn" @click.stop="handleNotification(index)">
            <text class="handle-text">处理</text>
          </button>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

// 响应式数据
const currentFilter = ref('all'); // all/unhandled/handled
const scrollViewHeight = ref(0);

// 模拟报警数据
const notifications = ref([
  {
    id: 1,
    type: 'fall', // 跌倒/烟雾/温度/湿度/紧急呼叫
    typeText: '老人跌倒',
    title: '老人跌倒预警',
    desc: '检测到老人在客厅区域发生跌倒，请注意查看并确认安全',
    time: 1735689600000, // 时间戳
    location: '家中 · 客厅',
    status: 'unhandled' // unhandled/handled
  },
  {
    id: 2,
    type: 'smoke',
    typeText: '烟雾报警',
    desc: '厨房区域检测到烟雾浓度超标，可能存在火灾风险',
    time: 1735675200000,
    location: '家中 · 厨房',
    status: 'handled',
    handleTime: 1735675800000
  },
  {
    id: 3,
    type: 'temperature',
    typeText: '高温预警',
    desc: '室内温度达到32°C，超过安全阈值，请及时采取降温措施',
    time: 1735660800000,
    location: '家中 · 卧室',
    status: 'handled',
    handleTime: 1735661400000
  },
  {
    id: 4,
    type: 'emergency',
    typeText: '紧急呼叫',
    desc: '老人触发了紧急呼叫按钮，需要立即联系确认情况',
    time: 1735646400000,
    location: '家中 · 卫生间',
    status: 'unhandled'
  },
  {
    id: 5,
    type: 'humidity',
    typeText: '高湿预警',
    desc: '室内湿度达到75%，容易滋生霉菌，建议开启除湿设备',
    time: 1735632000000,
    location: '家中 · 阳台',
    status: 'handled',
    handleTime: 1735632600000
  }
]);

// 计算属性：筛选后的报警列表
const filteredNotifications = computed(() => {
  if (currentFilter.value === 'all') {
    return notifications.value;
  } else if (currentFilter.value === 'unhandled') {
    return notifications.value.filter(item => item.status === 'unhandled');
  } else {
    return notifications.value.filter(item => item.status === 'handled');
  }
});

// 计算属性：未处理报警数量
const unhandledCount = computed(() => {
  return notifications.value.filter(item => item.status === 'unhandled').length;
});

// 页面加载初始化
onMounted(() => {
  // 计算scroll-view高度
  try {
    const systemInfo = uni.getSystemInfoSync();
    const screenHeight = systemInfo.windowHeight;
    const statusBarH = systemInfo.statusBarHeight || 0;
    const navBarH = 88 / 2;
    const filterBarH = 80 / 2;
    scrollViewHeight.value = screenHeight - statusBarH - navBarH - filterBarH;
  } catch (e) {
    scrollViewHeight.value = 500;
  }
});

// 切换筛选条件
const changeFilter = (filterType) => {
  currentFilter.value = filterType;
};

// 返回上一页
const goBack = () => {
  uni.navigateBack({
    delta: 1
  });
};

// 获取图标样式类
const getIconClass = (type) => {
  switch (type) {
    case 'fall': return 'icon-fall';
    case 'smoke': return 'icon-smoke';
    case 'temperature': return 'icon-temperature';
    case 'humidity': return 'icon-humidity';
    case 'emergency': return 'icon-emergency';
    default: return 'icon-default';
  }
};

// 获取图标文字
const getIconText = (type) => {
  switch (type) {
    case 'fall': return '🚨';
    case 'smoke': return '🔥';
    case 'temperature': return '🌡️';
    case 'humidity': return '💧';
    case 'emergency': return '🆘';
    default: return '⚠️';
  }
};

// 格式化时间
const formatTime = (timestamp, showDate = false) => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  if (showDate) {
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  } else {
    // 计算相对时间
    const now = new Date().getTime();
    const diff = Math.floor((now - timestamp) / 1000);
    
    if (diff < 60) {
      return '刚刚';
    } else if (diff < 3600) {
      return `${Math.floor(diff / 60)}分钟前`;
    } else if (diff < 86400) {
      return `${Math.floor(diff / 3600)}小时前`;
    } else {
      return `${month}-${day} ${hours}:${minutes}`;
    }
  }
};

// 查看详情
const viewDetail = (item) => {
  // 拼接详情文本
  const detailText = `
报警类型：${item.typeText}
报警时间：${formatTime(item.time, true)}
报警位置：${item.location}
报警描述：${item.desc}
报警状态：${item.status === 'unhandled' ? '未处理' : '已处理'}${item.handleTime ? '\n处理时间：' + formatTime(item.handleTime, true) : ''}
  `;
  
  // 使用原生模态框展示详情
  uni.showModal({
    title: '报警详情',
    content: detailText.trim(),
    showCancel: item.status === 'unhandled',
    cancelText: '取消',
    confirmText: item.status === 'unhandled' ? '确认处理' : '知道了',
    success: (res) => {
      if (res.confirm && item.status === 'unhandled') {
        // 确认处理
        const index = notifications.value.findIndex(i => i.id === item.id);
        if (index !== -1) {
          notifications.value[index].status = 'handled';
          notifications.value[index].handleTime = new Date().getTime();
          uni.showToast({
            title: '已标记为处理',
            icon: 'success',
            duration: 2000
          });
        }
      }
    }
  });
};

// 快速处理报警
const handleNotification = (index) => {
  uni.showModal({
    title: '确认处理',
    content: '是否确认已处理该报警？',
    confirmText: '确认',
    cancelText: '取消',
    success: (res) => {
      if (res.confirm) {
        notifications.value[index].status = 'handled';
        notifications.value[index].handleTime = new Date().getTime();
        uni.showToast({
          title: '已标记为处理',
          icon: 'success',
          duration: 2000
        });
      }
    }
  });
};
</script>

<style scoped>
/* 基础样式 */
.page-notifications {
  width: 100%;
  min-height: 100vh;
  background-color: #f8fafc;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

/* 状态栏占位 */
.status-bar-placeholder {
  height: var(--status-bar-height);
  width: 100%;
  background: linear-gradient(135deg, #3b82f6 0%, #4f46e5 100%);
  flex-shrink: 0;
}

/* 顶部导航 */
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
.back-btn {
  background: transparent;
  border: none;
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.back-icon {
  font-size: 32rpx;
  color: #fff;
  font-weight: bold;
}
.header-title {
  font-size: 32rpx;
  font-weight: 700;
  letter-spacing: 2rpx;
}
.empty-btn {
  width: 60rpx;
  height: 60rpx;
}

/* 筛选栏 */
.filter-bar {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 16rpx 0;
  background-color: #fff;
  border-bottom: 1px solid #f1f5f9;
  flex-shrink: 0;
}
.filter-item {
  display: flex;
  align-items: center;
  padding: 8rpx 24rpx;
  border-radius: 20rpx;
  position: relative;
}
.filter-item.active {
  background-color: #eff6ff;
}
.filter-text {
  font-size: 26rpx;
  color: #334155;
}
.filter-item.active .filter-text {
  color: #3b82f6;
  font-weight: 600;
}
.badge {
  background-color: #ef4444;
  color: #fff;
  font-size: 20rpx;
  padding: 2rpx 8rpx;
  border-radius: 10rpx;
  margin-left: 8rpx;
  min-width: 24rpx;
  text-align: center;
}

/* 报警列表 */
.notifications-list {
  overflow-y: auto;
  padding: 20rpx 16rpx;
  -webkit-overflow-scrolling: touch;
  width: 100%;
  box-sizing: border-box;
  flex: none;
  background-color: #f8fafc;
}
.notifications-list::-webkit-scrollbar {
  display: none;
}

/* 空数据提示 */
.empty-tip {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 20rpx;
  text-align: center;
}
.empty-icon {
  font-size: 80rpx;
  margin-bottom: 20rpx;
  opacity: 0.5;
}
.empty-text {
  font-size: 28rpx;
  color: #64748b;
  margin-bottom: 12rpx;
}
.empty-desc {
  font-size: 24rpx;
  color: #94a3b8;
}

/* 报警记录项 */
.notification-item {
  display: flex;
  align-items: flex-start;
  background-color: #fff;
  border-radius: 24rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
}
.notification-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
  flex-shrink: 0;
}
.icon-fall { background-color: #fee2e2; color: #dc2626; }
.icon-smoke { background-color: #fed7aa; color: #ea580c; }
.icon-temperature { background-color: #ffedd5; color: #f97316; }
.icon-humidity { background-color: #dbeafe; color: #3b82f6; }
.icon-emergency { background-color: #fecdd3; color: #db2777; }
.icon-default { background-color: #e2e8f0; color: #64748b; }
.icon-text {
  font-size: 40rpx;
}

/* 报警内容 */
.notification-content {
  flex: 1;
  min-width: 0;
}
.content-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8rpx;
}
.notification-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #334155;
  flex: 1;
  margin-right: 12rpx;
}
.notification-status {
  font-size: 22rpx;
  padding: 4rpx 12rpx;
  border-radius: 12rpx;
  white-space: nowrap;
}
.status-unhandled {
  background-color: #fee2e2;
  color: #dc2626;
}
.status-handled {
  background-color: #dcfce7;
  color: #22c55e;
}
.notification-desc {
  font-size: 24rpx;
  color: #64748b;
  line-height: 1.5;
  margin-bottom: 12rpx;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.content-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.notification-time {
  font-size: 22rpx;
  color: #94a3b8;
}
.notification-location {
  font-size: 22rpx;
  color: #64748b;
  display: flex;
  align-items: center;
}
.notification-location::before {
  content: '📍';
  margin-right: 4rpx;
  font-size: 20rpx;
}

/* 操作按钮 */
.notification-actions {
  flex-shrink: 0;
}
.handle-btn {
  background-color: #3b82f6;
  color: #fff;
  border: none;
  border-radius: 20rpx;
  padding: 12rpx 20rpx;
  font-size: 22rpx;
}

/* 全局按钮重置 */
button {
  padding: 0;
  margin: 0;
  line-height: 1;
}
</style>