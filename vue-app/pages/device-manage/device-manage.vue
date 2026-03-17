<template>
  <view class="page-device-manage">
    <!-- 状态栏占位 -->
    <view class="status-bar-placeholder"></view>
    
    <!-- 顶部导航栏 -->
    <view class="page-header">
      <button class="back-btn" @click="goBack">
        <text class="back-icon">←</text>
      </button>
      <text class="header-title">设备管理</text>
      <button class="add-btn" @click="addDevice">
        <text class="add-icon">+</text>
      </button>
    </view>

    <!-- 设备列表 -->
    <scroll-view class="device-list" scroll-y>
      <!-- 设备分组 -->
      <view class="device-group" v-for="(group, index) in deviceGroups" :key="index">
        <text class="group-title">{{ group.name }}</text>
        <view class="device-item" v-for="(device, idx) in group.devices" :key="idx">
          <view class="device-icon" :class="device.online ? 'online' : 'offline'">
            <text class="icon-text">{{ device.icon }}</text>
          </view>
          <view class="device-info">
            <text class="device-name">{{ device.name }}</text>
            <text class="device-desc">{{ device.desc }}</text>
            <text class="device-status" :class="device.online ? 'status-online' : 'status-offline'">
              {{ device.online ? '在线' : '离线' }}
            </text>
          </view>
          <view class="device-actions">
            <button class="control-btn" @click.stop="controlDevice(device)">
              <text class="control-text">{{ device.status ? '关闭' : '开启' }}</text>
            </button>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref } from 'vue';

// 模拟设备数据
const deviceGroups = ref([
  {
    name: '环境监测设备',
    devices: [
      {
        id: 1,
        name: '温湿度传感器',
        desc: '客厅 · 编号WH202401',
        icon: '🌡️',
        online: true,
        status: true
      },
      {
        id: 2,
        name: '烟雾传感器',
        desc: '厨房 · 编号SM202402',
        icon: '🔥',
        online: true,
        status: true
      },
      {
        id: 3,
        name: '跌倒检测器',
        desc: '卧室 · 编号FD202403',
        icon: '🚨',
        online: true,
        status: true
      }
    ]
  },
  {
    name: '智能控制设备',
    devices: [
      {
        id: 4,
        name: '智能摄像头',
        desc: '客厅 · 编号CAM202404',
        icon: '📹',
        online: true,
        status: true
      },
      {
        id: 5,
        name: '紧急呼叫按钮',
        desc: '卫生间 · 编号EC202405',
        icon: '🆘',
        online: true,
        status: true
      },
      {
        id: 6,
        name: '智能灯光',
        desc: '卧室 · 编号LT202406',
        icon: '💡',
        online: false,
        status: false
      }
    ]
  }
]);

// 返回上一页
const goBack = () => {
  uni.navigateBack({
    delta: 1
  });
};

// 添加设备
const addDevice = () => {
  uni.showToast({
    title: '添加设备功能开发中',
    icon: 'none',
    duration: 2000
  });
};

// 控制设备
const controlDevice = (device) => {
  device.status = !device.status;
  uni.showToast({
    title: `${device.name}已${device.status ? '开启' : '关闭'}`,
    icon: 'success',
    duration: 2000
  });
};
</script>

<style scoped>
.page-device-manage {
  width: 100%;
  min-height: 100vh;
  background-color: #f8fafc;
  display: flex;
  flex-direction: column;
}

.status-bar-placeholder {
  height: var(--status-bar-height);
  width: 100%;
  background: linear-gradient(135deg, #3b82f6 0%, #4f46e5 100%);
  flex-shrink: 0;
}

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

.back-btn, .add-btn {
  background: transparent;
  border: none;
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-icon, .add-icon {
  font-size: 32rpx;
  color: #fff;
  font-weight: bold;
}

.header-title {
  font-size: 32rpx;
  font-weight: 700;
  letter-spacing: 2rpx;
}

.device-list {
  flex: 1;
  padding: 20rpx 16rpx;
  -webkit-overflow-scrolling: touch;
}

.device-group {
  margin-bottom: 24rpx;
}

.group-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #334155;
  margin-bottom: 16rpx;
}

.device-item {
  display: flex;
  align-items: center;
  background-color: #fff;
  border-radius: 24rpx;
  padding: 20rpx;
  margin-bottom: 12rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.device-icon {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
  flex-shrink: 0;
}

.device-icon.online {
  background-color: #dcfce7;
  color: #22c55e;
}

.device-icon.offline {
  background-color: #e2e8f0;
  color: #94a3b8;
}

.icon-text {
  font-size: 36rpx;
}

.device-info {
  flex: 1;
}

.device-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #334155;
  display: block;
  margin-bottom: 4rpx;
}

.device-desc {
  font-size: 22rpx;
  color: #64748b;
  display: block;
  margin-bottom: 4rpx;
}

.device-status {
  font-size: 20rpx;
  padding: 2rpx 8rpx;
  border-radius: 8rpx;
  display: inline-block;
}

.status-online {
  background-color: #dcfce7;
  color: #22c55e;
}

.status-offline {
  background-color: #fee2e2;
  color: #dc2626;
}

.device-actions {
  flex-shrink: 0;
}

.control-btn {
  background-color: #3b82f6;
  color: #fff;
  border: none;
  border-radius: 20rpx;
  padding: 10rpx 20rpx;
  font-size: 22rpx;
}

button {
  padding: 0;
  margin: 0;
  line-height: 1;
}
</style>