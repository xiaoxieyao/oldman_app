<template>
  <view class="page-device">
    <!-- 状态栏占位（适配手机顶部状态栏） --> 
    <view class="status-bar-placeholder"></view>
    
    <!-- 顶部导航栏 -->
    <view class="page-header" :class="{ 'header-scroll': isScroll }">
      <text class="header-title">老年守护中心</text>
      <button class="header-btn" @click="gotoSetting">
        <text class="setting-icon">⚙️</text>
      </button>
    </view>

    <!-- 首页内容容器（修复偏右问题 + 适配自定义tabBar高度） -->
    <scroll-view 
      class="content-scroll" 
      scroll-y 
      @scroll="onScroll"
      scroll-with-animation
      :style="{ height: scrollViewHeight + 'px' }"
    >
      <!-- 环境状态卡片 -->
      <view class="env-card" @click="showEnvironment">
        <view class="env-card-header">
          <view class="env-card-title">
            <text class="env-card-subtitle">当前环境</text>
            <text class="env-card-main-title">客厅 · {{ envStatusText }}</text>
          </view>
          <text class="env-card-status" :class="{ 'status-warning': envStatusText !== '安全' }">
            {{ envStatusText !== '安全' ? '⚠️ ' : '' }}{{ envStatusText }}
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

      <!-- 实时画面卡片 - 点击跳转video-detail页面 -->
      <view class="video-card">
        <view class="video-card-header">
          <view class="video-card-title">
            <view class="status-dot" :class="{ pulse: isVideoOnline, 'dot-offline': !isVideoOnline }"></view>
            <text class="title-text">实时画面</text>
          </view>
          <text class="video-time">{{ currentTime }}</text>
        </view>
        <view class="video-container" @click="showVideoDetail">
          <image 
            class="video-placeholder" 
            src="/static/客厅.jpg" 
            mode="aspectFill"
          ></image>
          <view class="video-overlay" v-if="!isVideoPlaying && isVideoOnline"></view>
          <view class="video-play-btn" v-if="!isVideoPlaying && isVideoOnline">
            <text class="play-icon">▶</text>
          </view>
          <view class="video-status-tip" v-if="!isVideoOnline">
            <text class="status-tip-icon">📴</text>
            <text class="status-tip-text">摄像头离线</text>
          </view>
        </view>
      </view>

      <!-- 快捷操作区 - 用药提醒按钮绑定跳转 -->
      <view class="quick-actions">
        <text class="action-title">快捷操作</text>
        <view class="function-grid">
          <view class="function-item" @click="gotoLocation" :class="{ 'item-active': isClick }">
            <view class="function-icon-box blue-bg">📍</view>
            <text class="function-text">位置查看</text>
          </view>
          <view class="function-item" @click="gotoMedicine" :class="{ 'item-active': isClick }">
            <view class="function-icon-box green-bg">💊</view>
            <text class="function-text">用药提醒</text>
          </view>
          <view class="function-item" @click="gotoNotifications" :class="{ 'item-active': isClick }">
            <view class="function-icon-box amber-bg">⚠️</view>
            <text class="function-text">报警记录</text>
          </view>
          <view class="function-item" @click="emergencyCall" :class="{ 'item-active': isClick }">
            <view class="function-icon-box red-bg">🆘</view>
            <text class="function-text emergency-text">紧急呼叫</text>
          </view>
          <view class="function-item" @click="gotoHealth" :class="{ 'item-active': isClick }">
            <view class="function-icon-box purple-bg">📊</view>
            <text class="function-text">健康数据</text>
          </view>
          <!-- 新增：亲情互动按钮 -->
          <view class="function-item" @click="gotoInteract" :class="{ 'item-active': isClick }">
            <view class="function-icon-box pink-bg">❤️</view>
            <text class="function-text">亲情互动</text>
          </view>
          <!-- 恢复：设备管理按钮 -->
          <view class="function-item" @click="gotoDeviceManage" :class="{ 'item-active': isClick }">
            <view class="function-icon-box teal-bg">🔧</view>
            <text class="function-text">设备管理</text>
          </view>
        </view>
      </view>

      <!-- 今日提醒 - 已服用按钮保留标记功能 -->
      <view class="health-tip-card">
        <view class="health-tip-header">
          <text class="health-tip-title">今日健康提醒</text>
          <text class="tip-count">1条</text>
        </view>
        
        <view class="tip-item">
          <view class="tip-icon-box">💊</view>
          <view class="tip-content">
            <text class="tip-name">降压药</text>
            <text class="tip-desc">今日 18:00 · 1片</text>
          </view>
          <button class="take-btn" @click="handleTakeMedicine">已服用</button>
        </view>
      </view>

      <!-- 位置与安全 -->
      <view class="location-card mb-20">
        <view class="location-header">
          <text class="location-title">位置与安全</text>
          <button class="location-detail" @click="gotoLocation">详情</button>
        </view>
        
        <view class="location-info">
          <view class="location-row">
            <text class="location-icon">📍</text>
            <text class="location-name">当前位置</text>
            <text class="safe-tag">安全</text>
          </view>
          <text class="location-desc">在家中 · 客厅</text>
          <text class="update-time">更新于 2分钟前</text>
        </view>
      </view>
    </scroll-view>

    <!-- 临时注释自定义tabBar，避免组件未找到错误 -->
     <custom-tabbar /> 
  </view>
</template>

<script setup>
// 1. 修正Vue API导入 - 只导入需要的，移除未使用的onShow
import { ref, onMounted, onUnmounted } from 'vue';

// 2. 先定义工具函数，再在生命周期中调用（解决顺序错误）
// 工具函数：更新当前时间
const updateCurrentTime = () => {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  currentTime.value = `${hours}:${minutes}`;
};

// 3. 响应式数据定义
const temperature = ref(24.5);
const humidity = ref(48);
const envStatusText = ref('安全');
const isVideoOnline = ref(true); 
const isVideoPlaying = ref(false);
const currentTime = ref('');
const isScroll = ref(false);
const isClick = ref(false);
const scrollViewHeight = ref(0); 
let dataTimer = null;

// 4. 模拟环境数据刷新函数
const simulateEnvDataRefresh = () => {
  dataTimer = setInterval(() => {
    temperature.value = Number((temperature.value + (Math.random() - 0.5)).toFixed(1));
    humidity.value = Math.round(humidity.value + (Math.random() - 0.5) * 2);
    
    if (temperature.value > 28) {
      envStatusText.value = '高温预警';
    } else if (temperature.value < 18) {
      envStatusText.value = '低温预警';
    } else if (humidity.value > 60) {
      envStatusText.value = '高湿预警';
    } else if (humidity.value < 30) {
      envStatusText.value = '低湿预警';
    } else {
      envStatusText.value = '安全';
    }
  }, 5000);
};

// 5. 滚动事件处理
const onScroll = (e) => {
  isScroll.value = e.detail.scrollTop > 20;
};

// 6. 页面加载：初始化+登录校验
onMounted(() => {
  // 计算scroll-view高度
  try {
    const systemInfo = uni.getSystemInfoSync();
    const screenHeight = systemInfo.windowHeight;
    const statusBarH = systemInfo.statusBarHeight || 0;
    const navBarH = 88 / 2; 
    // 导航栏使用固定定位，不需要从高度中减去
    // 考虑底部安全区域高度
    const safeAreaBottom = systemInfo.safeArea?.bottom || 0;
    const screenBottom = systemInfo.screenHeight || 0;
    const safeAreaHeight = Math.max(0, screenBottom - safeAreaBottom);
    scrollViewHeight.value = screenHeight - statusBarH - navBarH - (safeAreaHeight / 2);
  } catch (e) {
    scrollViewHeight.value = 500; 
  }

  // 跳过登录校验，方便测试
  console.log('跳过登录校验，方便测试');

  // 初始化数据（此时updateCurrentTime已定义）
  updateCurrentTime();
  simulateEnvDataRefresh();
  
  // 模拟onShow效果：页面显示时更新时间
  setInterval(() => {
    updateCurrentTime();
    isVideoPlaying.value = false;
  }, 60000); // 每分钟更新一次时间
});

// 7. 页面卸载清理定时器
onUnmounted(() => {
  if (dataTimer) clearInterval(dataTimer);
});

// 8. 跳转函数定义
// 环境详情跳转
const showEnvironment = () => {
  handleFunctionClick(() => {
    console.log('执行环境详情页跳转，路径：/pages/environment/environment');
    uni.navigateTo({
      url: '/pages/environment/environment',
      fail: (err) => {
        console.error('环境详情页跳转失败：', err);
        uni.showToast({
          title: `跳转失败：${err.errMsg || '页面不存在'}`,
          icon: 'none',
          duration: 3000
        });
      }
    });
  });
};

// 视频详情跳转（跳转到video-detail页面）
const showVideoDetail = () => {
  if (!isVideoOnline.value) {
    uni.showToast({ title: '摄像头离线，无法查看', icon: 'none', duration: 2000 });
    return;
  }
  isVideoPlaying.value = true;
  
  handleFunctionClick(() => {
    console.log('执行实时画面页跳转，路径：/pages/video-detail/video-detail');
    uni.navigateTo({
      url: '/pages/video-detail/video-detail',
      fail: (err) => {
        console.error('实时画面页跳转失败：', err);
        uni.showToast({
          title: `跳转失败：${err.errMsg || '页面不存在'}`,
          icon: 'none',
          duration: 3000
        });
      }
    });
  });
};

// 位置查看跳转（可正常跳转）
const gotoLocation = () => {
  handleFunctionClick(() => {
    console.log('执行位置查看页跳转，路径：/pages/location/location');
    uni.navigateTo({
      url: '/pages/location/location',
      fail: (err) => {
        console.error('位置查看页跳转失败：', err);
        uni.showToast({
          title: `跳转失败：${err.errMsg || '页面不存在'}`,
          icon: 'none',
          duration: 3000
        });
      }
    });
  });
};

// 用药提醒跳转（修改为跳转到medicine页面）
const gotoMedicine = () => {
  handleFunctionClick(() => {
    console.log('执行用药提醒页跳转，路径：/pages/medicine/medicine');
    uni.navigateTo({
      url: '/pages/medicine/medicine',
      fail: (err) => {
        console.error('用药提醒页跳转失败：', err);
        uni.showToast({
          title: `跳转失败：${err.errMsg || '页面不存在'}`,
          icon: 'none',
          duration: 3000
        });
      }
    });
  });
};

// 报警记录/消息通知跳转 - 重点修复：改为实际跳转而非提示
const gotoNotifications = () => {
  handleFunctionClick(() => {
    console.log('执行报警记录页跳转，路径：/pages/notifications/notifications');
    uni.navigateTo({
      url: '/pages/notifications/notifications',
      fail: (err) => {
        console.error('报警记录页跳转失败：', err);
        uni.showToast({
          title: `跳转失败：${err.errMsg || '页面不存在'}`,
          icon: 'none',
          duration: 3000
        });
      }
    });
  });
};


// 健康数据跳转 - tabBar页面专用：switchTab
const gotoHealth = () => {
  handleFunctionClick(() => {
    console.log('切换到健康数据tabBar页，路径：/pages/health/health');
    uni.switchTab({
      url: '/pages/health/health',
      fail: (err) => {
        console.error('健康数据页切换失败：', err);
        uni.showToast({
          title: `切换失败：${err.errMsg || '页面未配置为tabBar'}`,
          icon: 'none',
          duration: 3000
        });
      }
    });
  });
};

// 亲情互动跳转 - tabBar页面专用：switchTab
const gotoInteract = () => {
  handleFunctionClick(() => {
    console.log('切换到亲情互动tabBar页，路径：/pages/interact/interact');
    uni.switchTab({
      url: '/pages/interact/interact',
      fail: (err) => {
        console.error('亲情互动页切换失败：', err);
        uni.showToast({
          title: `切换失败：${err.errMsg || '页面未配置为tabBar'}`,
          icon: 'none',
          duration: 3000
        });
      }
    });
  });
};

// 设置页面跳转 - 改为实际跳转（匹配pages.json路径：pages/setting/setting）
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

// 紧急呼叫功能
const emergencyCall = () => {
  handleFunctionClick(() => {
    uni.showModal({
      title: '紧急呼叫',
      content: '是否立即联系紧急联系人？',
      confirmText: '呼叫',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          uni.showToast({ title: '正在呼叫紧急联系人...', icon: 'none', duration: 3000 });
        }
      }
    });
  });
};

// 标记服药功能（保留原有逻辑）
const handleTakeMedicine = () => {
  handleFunctionClick(() => {
    uni.showToast({ title: '已标记为服用', icon: 'success' });
  });
};

// 通用点击动画函数
const handleFunctionClick = (callback) => {
  isClick.value = true;
  setTimeout(() => {
    isClick.value = false;
    callback();
  }, 100);
};
</script>

<style scoped>
/* 基础样式 - 核心修复内容偏右 + 适配自定义tabBar */
.page-device {
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
.setting-icon {
  font-size: 28rpx;
  color: #fff;
}

/* 内容滚动区 - 核心优化：移除flex:1，使用动态高度 */
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

/* 环境卡片 */
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

/* 视频卡片 */
.video-card {
  background: #fff;
  border-radius: 32rpx;
  padding: 28rpx 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
  margin-bottom: 28rpx;
  width: 100%;
  box-sizing: border-box;
}
.video-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24rpx;
}
.video-card-title {
  display: flex;
  align-items: center;
  gap: 12rpx;
}
.status-dot {
  width: 12rpx;
  height: 12rpx;
  background-color: #22c55e;
  border-radius: 50%;
}
.dot-offline {
  background-color: #ef4444;
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
  font-size: 30rpx;
  font-weight: 600;
  color: #334155;
}
.video-time {
  font-size: 22rpx;
  color: #94a3b8;
}
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
  opacity: 0.9;
}
.video-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.5), transparent);
  opacity: 0;
  transition: opacity 0.3s;
}
.video-container:hover .video-overlay {
  opacity: 1;
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
  font-size: 60rpx;
  color: #fff;
  width: 100rpx;
  height: 100rpx;
  line-height: 100rpx;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  transition: transform 0.3s;
}
.video-container:hover .play-icon {
  transform: scale(1.1);
}
.video-status-tip {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 0, 0, 0.7);
  padding: 16rpx 28rpx;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  gap: 12rpx;
}
.status-tip-icon {
  font-size: 32rpx;
  color: #fff;
}
.status-tip-text {
  font-size: 28rpx;
  color: #fff;
  font-weight: 500;
}

/* 快捷操作区 */
.quick-actions {
  background: #fff;
  border-radius: 32rpx;
  padding: 28rpx 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
  margin-bottom: 28rpx;
  width: 100%;
  box-sizing: border-box;
}
.action-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #334155;
  margin-bottom: 24rpx;
  display: block;
}
.function-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx;
}
.function-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20rpx 0;
  border-radius: 24rpx;
  transition: all 0.2s ease;
}
.item-active {
  background-color: #eff6ff;
}
.function-icon-box {
  font-size: 44rpx;
  margin-bottom: 10rpx;
  width: 80rpx;
  height: 80rpx;
  line-height: 80rpx;
  text-align: center;
  border-radius: 50%;
}
.blue-bg { background-color: #eff6ff; color: #3b82f6; }
.green-bg { background-color: #f0fdf4; color: #22c55e; }
.amber-bg { background-color: #fffbeb; color: #f59e0b; }
.red-bg { background-color: #fee2e2; color: #dc2626; }
.purple-bg { background-color: #faf5ff; color: #8b5cf6; }
.teal-bg { background-color: #ccfbf1; color: #14b8a6; }
/* 新增：粉色背景（亲情互动） */
.pink-bg { background-color: #fdf2f8; color: #ec4899; }
.function-text {
  font-size: 24rpx;
  color: #334155;
  font-weight: 500;
}
.emergency-text {
  color: #dc2626;
}

/* 健康提醒卡片 */
.health-tip-card {
  background: #fff;
  border-radius: 32rpx;
  padding: 28rpx 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
  margin-bottom: 28rpx;
  width: 100%;
  box-sizing: border-box;
}
.health-tip-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}
.health-tip-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #334155;
}
.tip-count {
  font-size: 22rpx;
  color: #3b82f6;
  font-weight: 600;
}
.tip-item {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 20rpx;
  background-color: #fffbeb;
  border-radius: 24rpx;
}
.tip-icon-box {
  width: 48rpx;
  height: 48rpx;
  line-height: 48rpx;
  text-align: center;
  background-color: #f59e0b;
  color: #fff;
  border-radius: 16rpx;
  font-size: 26rpx;
}
.tip-content {
  flex: 1;
}
.tip-name {
  font-size: 26rpx;
  font-weight: 600;
  color: #334155;
  display: block;
  margin-bottom: 6rpx;
}
.tip-desc {
  font-size: 22rpx;
  color: #64748b;
}
.take-btn {
  background-color: #3b82f6;
  color: #fff;
  border: none;
  border-radius: 20rpx;
  padding: 12rpx 20rpx;
  font-size: 22rpx;
}

/* 位置卡片 */
.location-card {
  background: #fff;
  border-radius: 32rpx;
  padding: 28rpx 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
  width: 100%;
  box-sizing: border-box;
}
.location-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}
.location-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #334155;
}
.location-detail {
  font-size: 22rpx;
  color: #3b82f6;
  font-weight: 600;
  background: none;
  border: none;
}
.location-info {
  background-color: #faf5ff;
  border-radius: 20rpx;
  padding: 20rpx;
  border: 1px solid #f3e8ff;
}
.location-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
}
.location-icon {
  font-size: 26rpx;
  color: #8b5cf6;
  margin-right: 10rpx;
  
}
.location-name {
  font-size: 26rpx;
  font-weight: 600;
  color: #334155;
}
.safe-tag {
  background-color: #dcfce7;
  color: #22c55e;
  padding: 4rpx 12rpx;
  border-radius: 12rpx;
  font-size: 20rpx;
}
.location-desc {
  font-size: 24rpx;
  color: #475569;
  margin-bottom: 8rpx;
}
.update-time {
  font-size: 20rpx;
  color: #94a3b8;
}
.mb-20 {
  margin-bottom: 20rpx;
}

/* 全局按钮重置 */
button {
  padding: 0;
  margin: 0;
  line-height: 1;
}
</style>
