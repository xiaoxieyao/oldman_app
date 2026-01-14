<template>
  <view class="page-notifications">
    <!-- 状态栏占位（适配手机顶部状态栏） -->
    <view class="status-bar-placeholder"></view>
    
    <!-- 页面内容区 -->
    <scroll-view 
      class="content-scroll" 
      scroll-y 
      @scroll="onScroll"
      scroll-with-animation
    >
      <!-- 未读告警统计 -->
      <view class="unread-badge" v-if="unreadCount > 0">
        <text class="badge-text">您有 {{ unreadCount }} 条未处理告警</text>
      </view>

      <!-- 告警列表 -->
      <view class="notification-list">
        <!-- 跌倒警报（最高优先级） -->
        <view 
          class="notification-item" 
          :class="['level-critical', { 'unread': !item.isRead }]"
          v-for="(item, index) in notifications" 
          :key="index"
          @click="handleNotificationClick(item)"
        >
          <!-- 告警图标 -->
          <view class="item-icon" :class="item.type">
            <text class="icon-text">{{ getIconByType(item.type) }}</text>
          </view>
          
          <!-- 告警内容 -->
          <view class="item-content">
            <view class="content-header">
              <text class="content-title">{{ item.title }}</text>
              <text class="content-time">{{ formatTime(item.time) }}</text>
              <view class="read-dot" v-if="!item.isRead"></view>
            </view>
            
            <text class="content-desc">{{ item.desc }}</text>
            <text class="content-detail">{{ item.detail }}</text>
            
            <!-- 告警操作按钮 -->
            <view class="content-actions" :class="item.type === 'fall' ? 'fall-actions' : 'single-action'">
              <button 
                class="action-btn primary" 
                :class="item.type"
                @click.stop="handlePrimaryAction(item)"
              >
                {{ getPrimaryBtnText(item.type) }}
              </button>
              
              <button 
                class="action-btn secondary" 
                v-if="item.type === 'fall'"
                @click.stop="callEmergencyContact(item)"
              >
                紧急呼叫
              </button>
            </view>
          </view>
        </view>
        
        <!-- 空数据提示 -->
        <view class="empty-state" v-if="notifications.length === 0">
          <text class="empty-icon">📢</text>
          <text class="empty-title">暂无告警记录</text>
          <text class="empty-desc">所有告警已处理或暂无异常情况</text>
        </view>
      </view>

      <!-- 操作按钮区 -->
      <view class="action-buttons">
        <button 
          class="btn clear-btn" 
          @click="clearAllNotifications"
          v-if="notifications.length > 0"
        >
          清空所有报警记录
        </button>
        <button 
          class="btn mark-all-btn" 
          @click="markAllAsRead"
          v-if="unreadCount > 0"
        >
          标记全部为已读
        </button>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, onLoad, onShow, computed } from 'vue';

// 1. 响应式数据（核心状态管理）
const notifications = ref([
  {
    id: 1,
    type: 'fall',          // 告警类型：fall(跌倒)/heart(心率)/temperature(体温)
    title: '跌倒警报',
    desc: '检测到王奶奶可能发生跌倒',
    detail: '位置：客厅 · 14:25 · 置信度：98%',
    time: new Date(Date.now() - 5 * 60 * 1000).getTime(), // 5分钟前
    isRead: false,
    level: 'critical'      // 紧急级别：critical(紧急)/warning(警告)/info(提示)
  },
  {
    id: 2,
    type: 'heart',
    title: '心率异常',
    desc: '心率达到 105 bpm，高于正常范围',
    detail: '建议关注并提醒休息 · 测量时间：13:30',
    time: new Date(Date.now() - 60 * 60 * 1000).getTime(), // 1小时前
    isRead: false,
    level: 'warning'
  },
  {
    id: 3,
    type: 'temperature',
    title: '体温异常',
    desc: '体温 38.2°C，高于正常范围',
    detail: '建议测量体温并关注身体状况 · 测量时间：昨天 20:15',
    time: new Date(Date.now() - 24 * 60 * 60 * 1000).getTime(), // 昨天
    isRead: true,
    level: 'warning'
  }
]);

// 计算未读告警数量
const unreadCount = computed(() => {
  return notifications.value.filter(item => !item.isRead).length;
});

// 2. 页面生命周期
onLoad(() => {
  console.log('通知页面加载完成');
  // 模拟从后端获取最新告警数据
  fetchLatestNotifications();
});

onShow(() => {
  // 每次页面显示时更新告警状态
  updateNotificationStatus();
});

// 3. 核心方法
// 获取最新告警数据
const fetchLatestNotifications = () => {
  // 模拟接口请求
  setTimeout(() => {
    // 可在此处对接真实后端接口更新notifications数据
    console.log('告警数据更新完成');
  }, 800);
};

// 更新告警状态
const updateNotificationStatus = () => {
  // 模拟实时检测新告警
  // 实际项目中可通过WebSocket实现实时推送
};

// 根据类型获取图标
const getIconByType = (type) => {
  switch(type) {
    case 'fall': return '⚠️';
    case 'heart': return '❤️';
    case 'temperature': return '🌡️';
    default: return '📢';
  }
};

// 根据类型获取主要操作按钮文本
const getPrimaryBtnText = (type) => {
  switch(type) {
    case 'fall': return '查看视频';
    case 'heart': return '查看心率';
    case 'temperature': return '查看体温';
    default: return '查看详情';
  }
};

// 格式化时间显示
const formatTime = (timestamp) => {
  const now = Date.now();
  const diff = now - timestamp;
  
  // 小于1分钟
  if (diff < 60 * 1000) {
    return '刚刚';
  }
  // 小于1小时
  else if (diff < 60 * 60 * 1000) {
    const minutes = Math.floor(diff / (60 * 1000));
    return `${minutes}分钟前`;
  }
  // 小于24小时
  else if (diff < 24 * 60 * 60 * 1000) {
    const hours = Math.floor(diff / (60 * 60 * 1000));
    return `${hours}小时前`;
  }
  // 昨天及更早
  else {
    const date = new Date(timestamp);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `昨天 ${hours}:${minutes}`;
  }
};

// 点击告警项
const handleNotificationClick = (item) => {
  // 标记为已读
  if (!item.isRead) {
    item.isRead = true;
  }
  
  // 根据类型跳转对应详情页
  switch(item.type) {
    case 'fall':
      gotoVideoDetail(item);
      break;
    case 'heart':
      showHealthDetail('心率异常', item);
      break;
    case 'temperature':
      showHealthDetail('体温异常', item);
      break;
    default:
      showDetail(item);
  }
};

// 主要操作按钮点击
const handlePrimaryAction = (item) => {
  if (item.type === 'fall') {
    gotoVideoDetail(item);
  } else {
    showHealthDetail(item.title, item);
  }
};

// 跳转到视频详情页
const gotoVideoDetail = (item) => {
  uni.navigateTo({
    url: `/pages/videoDetail/videoDetail?id=${item.id}`,
    fail: (err) => {
      uni.showToast({
        title: '视频详情页未配置',
        icon: 'none'
      });
    }
  });
};

// 紧急呼叫联系人
const callEmergencyContact = (item) => {
  // 模拟获取紧急联系人列表
  const contacts = [
    { name: '子女', phone: '13800138000' },
    { name: '社区医生', phone: '13900139000' },
    { name: '急救中心', phone: '120' }
  ];
  
  // 显示联系人选择
  uni.showActionSheet({
    itemList: contacts.map(c => `${c.name} (${c.phone})`),
    title: '选择紧急呼叫对象',
    success: (res) => {
      const selectedContact = contacts[res.tapIndex];
      
      uni.showModal({
        title: '紧急呼叫',
        content: `确定拨打 ${selectedContact.name} (${selectedContact.phone})？`,
        confirmText: '拨打',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            // 调用拨打电话API
            uni.makePhoneCall({
              phoneNumber: selectedContact.phone,
              success: () => {
                uni.showToast({
                  title: `正在拨打${selectedContact.name}...`,
                  icon: 'none'
                });
                
                // 记录告警处理状态
                item.handled = true;
              },
              fail: (err) => {
                uni.showToast({
                  title: '呼叫失败，请重试',
                  icon: 'none'
                });
              }
            });
          }
        }
      });
    }
  });
};

// 显示健康详情
const showHealthDetail = (type, item) => {
  uni.showModal({
    title: type,
    content: `${item.desc}\n\n${item.detail}\n\n检测时间：${formatTime(item.time)}`,
    confirmText: '查看历史数据',
    cancelText: '关闭',
    success: (res) => {
      if (res.confirm) {
        uni.navigateTo({
          url: `/pages/health/health?type=${item.type}`,
          fail: () => {
            uni.showToast({
              title: '健康数据页未配置',
              icon: 'none'
            });
          }
        });
      }
    }
  });
};

// 显示普通详情
const showDetail = (item) => {
  uni.showModal({
    title: item.title,
    content: `${item.desc}\n\n${item.detail}`,
    showCancel: false,
    confirmText: '知道了'
  });
};

// 标记全部为已读
const markAllAsRead = () => {
  uni.showModal({
    title: '标记已读',
    content: '确定要标记所有告警为已读吗？',
    confirmText: '确定',
    cancelText: '取消',
    success: (res) => {
      if (res.confirm) {
        notifications.value.forEach(item => {
          item.isRead = true;
        });
        
        uni.showToast({
          title: '已标记全部为已读',
          icon: 'success'
        });
      }
    }
  });
};

// 清空报警记录
const clearAllNotifications = () => {
  uni.showModal({
    title: '清空记录',
    content: '确定要清空所有报警记录吗？此操作不可恢复！',
    confirmText: '清空',
    cancelText: '取消',
    success: (res) => {
      if (res.confirm) {
        notifications.value = [];
        
        uni.showToast({
          title: '已清空所有告警记录',
          icon: 'success'
        });
      }
    }
  });
};

// 滚动事件
const onScroll = (e) => {
  // 可添加滚动相关逻辑
};

// 页面返回
const goBack = () => {
  uni.navigateBack({ delta: 1 });
};
</script>

<style scoped>
/* 根容器：铺满屏幕 */
.page-notifications {
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

/* 未读告警提示 */
.unread-badge {
  background-color: #ef4444;
  color: #fff;
  border-radius: 20rpx;
  padding: 12rpx 16rpx;
  margin-bottom: 20rpx;
  text-align: center;
  box-shadow: 0 4rpx 12rpx rgba(239, 68, 68, 0.2);
}
.badge-text {
  font-size: 24rpx;
  font-weight: 500;
}

/* 告警列表 */
.notification-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  margin-bottom: 24rpx;
}

/* 告警项 */
.notification-item {
  background: #fff;
  border-radius: 20rpx;
  padding: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  border-left: 8rpx solid #ef4444;
  display: flex;
  gap: 16rpx;
  transition: all 0.2s ease;
}
.notification-item.unread {
  background-color: #fff5f5;
  box-shadow: 0 4rpx 12rpx rgba(239, 68, 68, 0.1);
}
/* 不同告警类型样式 */
.notification-item.level-critical {
  border-left-color: #ef4444; /* 紧急-红色 */
}
.notification-item.type-heart {
  border-left-color: #f97316; /* 心率-橙色 */
}
.notification-item.type-temperature {
  border-left-color: #eab308; /* 体温-黄色 */
}

/* 告警图标 */
.item-icon {
  width: 64rpx;
  height: 64rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.item-icon.fall {
  background-color: #fee2e2;
}
.item-icon.heart {
  background-color: #fff7ed;
}
.item-icon.temperature {
  background-color: #fffbeb;
}
.icon-text {
  font-size: 32rpx;
}

/* 告警内容 */
.item-content {
  flex: 1;
}
.content-header {
  display: flex;
  align-items: center;
  margin-bottom: 8rpx;
  position: relative;
}
.content-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #1e293b;
  flex: 1;
}
.content-time {
  font-size: 20rpx;
  color: #64748b;
  margin-left: 12rpx;
}
.read-dot {
  width: 12rpx;
  height: 12rpx;
  background-color: #ef4444;
  border-radius: 50%;
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}
.content-desc {
  font-size: 24rpx;
  color: #334155;
  display: block;
  margin-bottom: 8rpx;
  line-height: 1.4;
}
.content-detail {
  font-size: 20rpx;
  color: #64748b;
  display: block;
  margin-bottom: 16rpx;
  line-height: 1.3;
}

/* 操作按钮 */
.content-actions {
  display: flex;
  gap: 12rpx;
}
.fall-actions {
  /* 跌倒告警两个按钮 */
}
.single-action {
  /* 其他告警一个按钮 */
  justify-content: center;
}
.action-btn {
  flex: 1;
  padding: 12rpx 0;
  border-radius: 16rpx;
  font-size: 22rpx;
  font-weight: 500;
  border: none;
}
.action-btn.primary {
  color: #fff;
}
.action-btn.primary.fall {
  background-color: #ef4444;
}
.action-btn.primary.heart {
  background-color: #f97316;
}
.action-btn.primary.temperature {
  background-color: #eab308;
}
.action-btn.secondary {
  background-color: #f8fafc;
  color: #ef4444;
  border: 1px solid #fee2e2;
}
.action-btn:active {
  opacity: 0.9;
  transform: scale(0.98);
}

/* 空数据状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80rpx 0;
  text-align: center;
}
.empty-icon {
  font-size: 80rpx;
  margin-bottom: 24rpx;
  opacity: 0.5;
}
.empty-title {
  font-size: 28rpx;
  color: #334155;
  margin-bottom: 8rpx;
}
.empty-desc {
  font-size: 24rpx;
  color: #64748b;
}

/* 底部操作按钮 */
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.btn {
  width: 100%;
  padding: 20rpx 0;
  border-radius: 32rpx;
  font-size: 24rpx;
  font-weight: 500;
  border: none;
}
.clear-btn {
  background-color: #f1f5f9;
  color: #475569;
}
.mark-all-btn {
  background-color: #eff6ff;
  color: #2563eb;
}
.btn:active {
  opacity: 0.9;
}
</style>