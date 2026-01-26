<template>
  <view class="page-mine">
    <!-- 状态栏占位 -->
    <view class="status-bar-placeholder"></view>
    
    <!-- 页面头部 -->
    <view class="page-header" :class="{ 'header-scroll': isScroll }">
      <text class="header-title">我的</text>
      <button class="header-btn" @click="showSettings">
        <text class="setting-icon">⚙️</text>
      </button>
    </view>
    
    <!-- 页面内容区 -->
    <scroll-view 
      class="content-scroll" 
      scroll-y 
      @scroll="onScroll"
      scroll-with-animation
      :style="{ height: scrollViewHeight + 'px' }"
    >
      <!-- 个人信息卡片 -->
      <view class="section-spacing">
        <view class="user-card card-hover" @click="editProfile">
          <view class="user-info-wrap">
            <view class="avatar-box">
              <!-- 修复：添加空值保护 -->
              <text class="avatar-text">{{ userName && userName.charAt(0) || '李' }}</text>
            </view>
            <view class="user-detail">
              <text class="user-name">{{ userName || '李先生' }} ({{ relation || '长子' }})</text>
              <text class="bind-info">当前绑定：{{ bindUser || '王奶奶' }} ({{ bindRelation || '母亲' }})</text>
              <view class="online-status">
                <view class="status-dot"></view>
                <text class="status-text">在线监护中</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <!-- 设备管理模块 -->
      <view class="section-spacing">
        <view class="module-card card-hover">
          <view class="module-header">
            <text class="module-title">设备管理</text>
          </view>
          <view class="module-content divide-y">
            <!-- 智能手环 -->
            <button class="device-item" @click="showDeviceDetail">
              <view class="device-left">
                <view class="device-icon orange">
                  <text class="device-icon-text">⌚</text>
                </view>
                <view class="device-info">
                  <text class="device-name">智能手环</text>
                  <text class="device-status">心率: {{ heartRate }}bpm · 电量: {{ battery }}%</text>
                </view>
              </view>
              <text class="arrow-icon">→</text>
            </button>
            <!-- 监控摄像头 -->
            <button class="device-item" @click="showCamera">
              <view class="device-left">
                <view class="device-icon blue">
                  <text class="device-icon-text">📹</text>
                </view>
                <view class="device-info">
                  <text class="device-name">监控摄像头</text>
                  <text class="device-status">客厅 · 在线</text>
                </view>
              </view>
              <text class="arrow-icon">→</text>
            </button>
          </view>
        </view>
      </view>

      <!-- 安全与提醒模块 -->
      <view class="section-spacing">
        <view class="module-card card-hover">
          <view class="module-header">
            <text class="module-title">安全与提醒</text>
          </view>
          <view class="module-content divide-y">
            <!-- 报警记录 -->
            <button class="safety-item" @click="showNotifications">
              <view class="safety-left">
                <view class="safety-icon red">
                  <text class="safety-icon-text">🔔</text>
                </view>
                <text class="safety-text">报警记录</text>
              </view>
              <view class="safety-right">
                <view class="badge">{{ alarmCount }}</view>
                <text class="arrow-icon">→</text>
              </view>
            </button>
            <!-- 跌倒检测 -->
            <view class="safety-item">
              <view class="safety-left">
                <view class="safety-icon orange">
                  <text class="safety-icon-text">⚠️</text>
                </view>
                <view class="fall-info">
                  <text class="safety-text">跌倒检测</text>
                  <text class="fall-status">运行中</text>
                </view>
              </view>
              <view class="switch-wrap">
                <switch 
                  :checked="fallDetection" 
                  color="#22c55e"
                  @change="onFallDetectionChange"
                ></switch>
              </view>
            </view>
            <!-- 其他安全设置 -->
            <button class="safety-item" @click="showOtherSafety">
              <view class="safety-left">
                <view class="safety-icon blue">
                  <text class="safety-icon-text">🛡️</text>
                </view>
                <text class="safety-text">其他安全设置</text>
              </view>
              <text class="arrow-icon">→</text>
            </button>
          </view>
        </view>
      </view>

      <!-- 家庭管理模块 -->
      <view class="section-spacing">
        <view class="module-card card-hover">
          <view class="module-header">
            <text class="module-title">家庭管理</text>
          </view>
          <view class="module-content divide-y">
            <!-- 家庭成员管理 -->
            <button class="family-item" @click="showFamily">
              <view class="family-left">
                <view class="family-icon indigo">
                  <text class="family-icon-text">👨‍👩‍👧</text>
                </view>
                <text class="family-text">家庭成员管理</text>
              </view>
              <text class="arrow-icon">→</text>
            </button>
            <!-- 紧急联系人设置 -->
            <button class="family-item" @click="showEmergency">
              <view class="family-left">
                <view class="family-icon orange">
                  <text class="family-icon-text">📞</text>
                </view>
                <text class="family-text">紧急联系人设置</text>
              </view>
              <text class="arrow-icon">→</text>
            </button>
          </view>
        </view>
      </view>

      <!-- 退出登录 -->
      <view class="section-spacing">
        <button class="logout-btn" @click="logout">
          <text class="logout-icon">🚪</text>
          <text class="logout-text">退出登录</text>
        </button>
      </view>

      <!-- 底部留白 -->
      <view class="bottom-space"></view>
    </scroll-view>

    <!-- 自定义tabBar -->
    <custom-tabbar />
  </view>
</template>

<script setup>
// 修复1：正确导入uniapp的生命周期函数（不是vue）
import { ref, onMounted } from 'vue';
import { onLoad, onShow } from '@dcloudio/uni-app'; 
import customTabbar from '@/components/custom-tabbar/custom-tabbar.vue';

// 1. 响应式数据
const userName = ref('李先生');        // 用户名
const relation = ref('长子');          // 身份关系
const bindUser = ref('王奶奶');        // 绑定用户
const bindRelation = ref('母亲');      // 绑定关系
const heartRate = ref(78);             // 手环心率
const battery = ref(85);               // 手环电量
const alarmCount = ref(5);             // 报警记录数
const fallDetection = ref(true);       // 跌倒检测开关
const scrollViewHeight = ref(0);       // 滚动区高度
const isScroll = ref(false);           // 滚动状态

// 2. 页面生命周期（修复：使用正确导入的onLoad/onShow）
onLoad(() => {
  console.log('我的页面已加载');
  initUserData();
});

onShow(() => {
  updateDeviceStatus();
});

onMounted(() => {
  // 修复：完全对齐正确代码的高度计算逻辑
  try {
    const systemInfo = uni.getSystemInfoSync();
    const screenHeight = systemInfo.windowHeight;
    const statusBarH = systemInfo.statusBarHeight || 0;
    const navBarH = 88 / 2; // 导航栏88rpx转px
    const tabBarH = 100 / 2; // tabBar高度转px
    scrollViewHeight.value = screenHeight - statusBarH - navBarH - tabBarH;
    
    // 兜底：确保高度为正数
    if (scrollViewHeight.value <= 0) {
      scrollViewHeight.value = 500;
    }
  } catch (e) {
    console.error('计算滚动高度失败:', e);
    scrollViewHeight.value = 500;
  }

  // 登录校验逻辑
  const isLogin = uni.getStorageSync('isLogin');
  if (!isLogin) {
    uni.redirectTo({ url: '/pages/auth/auth' });
    uni.showToast({ title: '请先登录', icon: 'none' });
    return;
  }
});

// 3. 核心方法
// 初始化用户数据（修复2：修复赋值bug + 空值保护）
const initUserData = () => {
  // 从缓存获取用户信息
  const userInfo = uni.getStorageSync('userInfo');
  if (userInfo) {
    userName.value = userInfo.name || userName.value;
    relation.value = userInfo.relation || relation.value;
    bindUser.value = userInfo.bindUser || bindUser.value;
    // 修复：之前错误地写为 bindUser.value
    bindRelation.value = userInfo.bindRelation || bindRelation.value;
  }
  
  // 模拟设备数据更新
  setTimeout(() => {
    heartRate.value = Math.floor(Math.random() * 20) + 60;
    battery.value = Math.floor(Math.random() * 50) + 50;
  }, 500);
};

// 更新设备状态
const updateDeviceStatus = () => {
  // 模拟实时更新设备状态
  setTimeout(() => {
    heartRate.value = Math.floor(Math.random() * 10) + 70;
  }, 1000);
};

// 编辑个人资料
const editProfile = () => {
  uni.navigateTo({
    url: '/pages/profile/profile',
    fail: () => {
      uni.showToast({
        title: '个人资料页开发中',
        icon: 'none',
        duration: 1500
      });
    }
  });
};

// 显示设置页面
const showSettings = () => {
  uni.navigateTo({
    url: '/pages/setting/setting',
    fail: () => {
      uni.showToast({
        title: '设置页开发中',
        icon: 'none'
      });
    }
  });
};

// 设备详情
const showDeviceDetail = () => {
  uni.navigateTo({
    url: '/pages/device/detail',
    fail: () => {
      uni.showToast({
        title: '设备详情页开发中',
        icon: 'none'
      });
    }
  });
};

// 摄像头查看
const showCamera = () => {
  uni.navigateTo({
    url: '/pages/device/camera',
    fail: () => {
      uni.showToast({
        title: '摄像头页面开发中',
        icon: 'none'
      });
    }
  });
};

// 报警记录
const showNotifications = () => {
  uni.navigateTo({
    url: '/pages/notification/record',
    fail: () => {
      uni.showToast({
        title: '报警记录页开发中',
        icon: 'none'
      });
    }
  });
};

// 跌倒检测开关变更事件
const onFallDetectionChange = (e) => {
  fallDetection.value = e.detail.value;
  uni.showToast({
    title: fallDetection.value ? '跌倒检测已开启' : '跌倒检测已关闭',
    icon: 'none'
  });
  
  // 保存设置到本地
  uni.setStorageSync('fallDetection', fallDetection.value);
};

// 其他安全设置
const showOtherSafety = () => {
  uni.navigateTo({
    url: '/pages/safety/other',
    fail: () => {
      uni.showToast({
        title: '安全设置页开发中',
        icon: 'none'
      });
    }
  });
};

// 家庭成员管理
const showFamily = () => {
  uni.navigateTo({
    url: '/pages/family/manage',
    fail: () => {
      uni.showToast({
        title: '家庭成员页开发中',
        icon: 'none'
      });
    }
  });
};

// 紧急联系人设置
const showEmergency = () => {
  uni.navigateTo({
    url: '/pages/contact/emergency',
    fail: () => {
      uni.showToast({
        title: '紧急联系人页开发中',
        icon: 'none'
      });
    }
  });
};

// 退出登录
const logout = () => {
  uni.showModal({
    title: '退出登录',
    content: '确定要退出当前账号吗？退出后将无法查看监护信息和设备数据。',
    confirmText: '退出',
    cancelText: '取消',
    success: (res) => {
      if (res.confirm) {
        // 清除登录状态和用户信息
        uni.removeStorageSync('isLogin');
        uni.removeStorageSync('userInfo');
        
        // 跳转到登录页
        uni.redirectTo({
          url: '/pages/auth/auth'
        });
        
        uni.showToast({
          title: '退出成功',
          icon: 'success',
          duration: 1500
        });
      }
    }
  });
};

// 滚动事件
const onScroll = (e) => {
  isScroll.value = e.detail.scrollTop > 20;
};
</script>

<style scoped>
/* 根容器 - 完全对齐正确代码的基础样式 */
.page-mine {
  width: 100%;
  min-height: 100vh;
  background-color: #f8fafc; /* slate-50 */
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  position: relative;
}

/* 状态栏占位 - 对齐正确代码 */
.status-bar-placeholder {
  height: var(--status-bar-height);
  min-height: 0;
  width: 100%;
  background: linear-gradient(135deg, #3b82f6 0%, #4f46e5 100%);
  flex-shrink: 0;
}

/* 页面头部 - 完全对齐正确代码 */
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
  color: #fff;
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

/* 滚动容器 - 完全对齐正确代码 */
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

/* 间距统一 */
.section-spacing {
  margin-bottom: 28rpx;
  width: 100%;
  box-sizing: border-box;
}

/* 卡片通用样式 */
.card-hover {
  transition: all 0.2s ease;
}
.card-hover:active {
  transform: translateY(-2rpx);
  box-shadow: 0 8rpx 16rpx rgba(0, 0, 0, 0.08);
}

/* 个人信息卡片 */
.user-card {
  background: #fff;
  border-radius: 32rpx;
  padding: 28rpx 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
  width: 100%;
  box-sizing: border-box;
}
.user-info-wrap {
  display: flex;
  align-items: center;
  gap: 16rpx;
}
.avatar-box {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background-color: #eff6ff;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(59, 130, 246, 0.2);
}
.avatar-text {
  font-size: 32rpx;
  font-weight: bold;
  color: #2563eb;
}
.user-detail {
  flex: 1;
}
.user-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #334155;
  display: block;
}
.bind-info {
  font-size: 22rpx;
  color: #64748b;
  display: block;
  margin-top: 8rpx;
}
.online-status {
  display: flex;
  align-items: center;
  gap: 8rpx;
  margin-top: 8rpx;
}
.status-dot {
  width: 12rpx;
  height: 12rpx;
  background-color: #22c55e;
  border-radius: 50%;
}
.status-text {
  font-size: 20rpx;
  color: #16a34a;
  font-weight: 500;
}

/* 模块卡片通用样式 - 对齐正确代码 */
.module-card {
  background-color: #fff;
  border-radius: 32rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;
}
.module-header {
  padding: 0 20rpx;
  background-color: #f8fafc;
  border-bottom: 1px solid #f1f5f9;
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.module-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #334155;
}
.module-content {
  width: 100%;
}
.divide-y {
  border-top: 1px solid #f1f5f9;
}

/* 设备管理项 */
.device-item {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx;
  background: transparent;
  border: none;
  transition: background-color 0.2s ease;
}
.device-item:active {
  background-color: #f8fafc;
}
.device-left {
  display: flex;
  align-items: center;
  gap: 16rpx;
}
.device-icon {
  width: 56rpx;
  height: 56rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.device-icon.orange {
  background-color: #fff7ed;
}
.device-icon-text {
  font-size: 24rpx;
}
.device-icon.orange .device-icon-text {
  color: #ea580c;
}
.device-icon.blue {
  background-color: #eff6ff;
}
.device-icon.blue .device-icon-text {
  color: #2563eb;
}
.device-info {
  text-align: left;
  flex: 1;
}
.device-name {
  font-size: 26rpx;
  font-weight: 600;
  color: #334155;
  display: block;
}
.device-status {
  font-size: 22rpx;
  color: #64748b;
  display: block;
  margin-top: 4rpx;
}
.arrow-icon {
  font-size: 24rpx;
  color: #94a3b8;
  flex-shrink: 0;
}

/* 安全与提醒项 */
.safety-item {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx;
  background: transparent;
  border: none;
  transition: background-color 0.2s ease;
}
.safety-item:active {
  background-color: #f8fafc;
}
.safety-left {
  display: flex;
  align-items: center;
  gap: 16rpx;
}
.safety-icon {
  width: 56rpx;
  height: 56rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.safety-icon.red {
  background-color: #fee2e2;
}
.safety-icon-text {
  font-size: 24rpx;
}
.safety-icon.red .safety-icon-text {
  color: #dc2626;
}
.safety-icon.orange {
  background-color: #fff7ed;
}
.safety-icon.orange .safety-icon-text {
  color: #ea580c;
}
.safety-icon.blue {
  background-color: #eff6ff;
}
.safety-icon.blue .safety-icon-text {
  color: #2563eb;
}
.safety-text {
  font-size: 26rpx;
  font-weight: 600;
  color: #334155;
}
.safety-right {
  display: flex;
  align-items: center;
  gap: 8rpx;
}
.badge {
  background-color: #ef4444;
  color: #ffffff;
  padding: 4rpx 12rpx;
  border-radius: 20rpx;
  font-size: 20rpx;
  font-weight: bold;
}
.fall-info {
  text-align: left;
  flex: 1;
}
.fall-status {
  font-size: 22rpx;
  color: #16a34a;
  display: block;
  margin-top: 4rpx;
}
.switch-wrap {
  transform: scale(0.8);
  transform-origin: right center;
  flex-shrink: 0;
}

/* 家庭管理项 */
.family-item {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx;
  background: transparent;
  border: none;
  transition: background-color 0.2s ease;
}
.family-item:active {
  background-color: #f8fafc;
}
.family-left {
  display: flex;
  align-items: center;
  gap: 16rpx;
}
.family-icon {
  width: 56rpx;
  height: 56rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.family-icon.indigo {
  background-color: #e0e7ff;
}
.family-icon-text {
  font-size: 24rpx;
}
.family-icon.indigo .family-icon-text {
  color: #4f46e5;
}
.family-icon.orange {
  background-color: #fff7ed;
}
.family-icon.orange .family-icon-text {
  color: #ea580c;
}
.family-text {
  font-size: 26rpx;
  font-weight: 600;
  color: #334155;
}

/* 退出登录按钮 */
.logout-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  padding: 20rpx 0;
  color: #ef4444;
  font-weight: 600;
  background-color: #fff;
  border-radius: 32rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  border: 1px solid #fee2e2;
  font-size: 26rpx;
  transition: all 0.2s ease;
}
.logout-btn:active {
  background-color: #fef2f2;
  transform: translateY(-2rpx);
}
.logout-icon {
  font-size: 24rpx;
}
.logout-text {
  font-size: 26rpx;
}

/* 底部留白 */
.bottom-space {
  height: 20rpx;
  width: 100%;
}

/* 通用样式 */
button {
  padding: 0;
  margin: 0;
  line-height: 1;
}
</style> 