<template>
  <view class="page-video-detail">
    <!-- 状态栏占位（适配手机顶部状态栏） -->
    <view class="status-bar-placeholder"></view>
    
    <!-- 顶部导航栏 -->
    <view class="page-header" :class="{ 'header-scroll': isScroll }">
      <button class="header-btn" @click="goBack">
        <text class="back-icon">←</text>
      </button>
      <text class="header-title">实时画面</text>
      <button class="header-btn" @click="gotoVideoSetting">
        <text class="setting-icon">⚙️</text>
      </button>
    </view>

    <!-- 内容容器（沿用首页的动态高度计算逻辑） -->
    <scroll-view 
      class="content-scroll" 
      scroll-y 
      @scroll="onScroll"
      scroll-with-animation
      :style="{ height: scrollViewHeight + 'px' }"
    >
      <!-- 视频播放主区域 -->
      <view class="video-player-card">
        <view class="video-container" @click="toggleVideoPlay">
          <!-- 视频占位图，实际开发替换为video组件 -->
          <image 
            class="video-placeholder" 
            src="/static/images/camera-placeholder.png" 
            mode="aspectFill"
            v-if="!isVideoPlaying"
          ></image>
          
          <!-- 直播状态标签 -->
          <view class="live-tag" v-if="isVideoOnline">
            <view class="status-dot pulse"></view>
            <text class="live-text">直播中</text>
          </view>
          
          <!-- 播放/暂停按钮 -->
          <view class="video-play-btn" v-if="!isVideoPlaying && isVideoOnline">
            <text class="play-icon">▶</text>
          </view>
          
          <!-- 暂停按钮 -->
          <view class="video-pause-btn" v-if="isVideoPlaying && isVideoOnline">
            <text class="pause-icon">❚❚</text>
          </view>
          
          <!-- 离线提示 -->
          <view class="video-status-tip" v-if="!isVideoOnline">
            <text class="status-tip-icon">📴</text>
            <text class="status-tip-text">摄像头离线</text>
          </view>
        </view>
        
        <!-- 视频控制栏 -->
        <view class="video-control-bar" v-if="isVideoOnline">
          <view class="control-item" @click="captureScreenshot" :class="{ 'item-active': isClick }">
            <text class="control-icon">📷</text>
            <text class="control-text">截图</text>
          </view>
          <view class="control-item" @click="startRecord" :class="{ 'item-active': isClick, 'recording': isRecording }">
            <text class="control-icon">🎥</text>
            <text class="control-text">{{ isRecording ? '停止录制' : '录制' }}</text>
          </view>
          <view class="control-item" @click="toggleVoiceTalk" :class="{ 'item-active': isClick, 'talking': isVoiceTalking }">
            <text class="control-icon">🎤</text>
            <text class="control-text">{{ isVoiceTalking ? '关闭对讲' : '语音对讲' }}</text>
          </view>
        </view>
      </view>

      <!-- 摄像头信息卡片 -->
      <view class="camera-info-card">
        <view class="info-header">
          <text class="info-title">摄像头信息</text>
          <button class="refresh-btn" @click="refreshCameraStatus">
            <text class="refresh-icon">🔄</text>
          </button>
        </view>
        <view class="info-grid">
          <view class="info-item">
            <text class="info-label">设备名称</text>
            <text class="info-value">{{ cameraName }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">位置</text>
            <text class="info-value">{{ cameraLocation }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">连接状态</text>
            <text class="info-value" :class="isVideoOnline ? 'online' : 'offline'">
              {{ isVideoOnline ? '在线' : '离线' }}
            </text>
          </view>
          <view class="info-item">
            <text class="info-label">画质</text>
            <text class="info-value">{{ videoQuality }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">信号强度</text>
            <text class="info-value">{{ signalStrength }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">最后更新</text>
            <text class="info-value">{{ updateTime }}</text>
          </view>
        </view>
      </view>

      <!-- 录像回放区域 -->
      <view class="record-playback-card">
        <view class="playback-header">
          <text class="playback-title">录像回放</text>
          <button class="playback-more" @click="showAllRecord">
            <text class="more-text">查看全部</text>
          </button>
        </view>
        <view class="playback-list">
          <view class="playback-item" v-for="(item, index) in recordList" :key="index" @click="playRecord(item)">
            <view class="playback-thumb">
              <image 
                class="thumb-img" 
                src="/static/images/record-placeholder.png" 
                mode="aspectFill"
              ></image>
              <text class="record-duration">{{ item.duration }}</text>
            </view>
            <view class="playback-info">
              <text class="record-time">{{ item.time }}</text>
              <text class="record-size">{{ item.size }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 画质设置 -->
      <view class="quality-setting-card">
        <view class="setting-header">
          <text class="setting-title">画质设置</text>
        </view>
        <view class="quality-options">
          <view 
            class="quality-option" 
            v-for="(quality, index) in qualityOptions" 
            :key="index"
            @click="changeQuality(quality)"
            :class="{ 'active': videoQuality === quality.name }"
          >
            <text class="quality-name">{{ quality.name }}</text>
            <text class="quality-desc">{{ quality.desc }}</text>
            <view class="check-icon" v-if="videoQuality === quality.name">✓</view>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 自定义 tabBar 组件 -->
    <custom-tabbar />
  </view>
</template>

<script setup>
// 1. 导入自定义 tabBar 组件
import customTabbar from '@/components/custom-tabbar/custom-tabbar.vue';

// 2. 导入Vue核心API
import { ref, onMounted, onUnmounted } from 'vue';

// 响应式数据
const isScroll = ref(false);
const scrollViewHeight = ref(0); // 动态计算scroll-view高度
const isVideoOnline = ref(true); // 摄像头在线状态
const isVideoPlaying = ref(false); // 视频播放状态
const isRecording = ref(false); // 录制状态
const isVoiceTalking = ref(false); // 对讲状态
const isClick = ref(false); // 点击动画状态
const cameraName = ref('客厅摄像头A102');
const cameraLocation = ref('客厅 · 南向');
const videoQuality = ref('高清 1080P');
const signalStrength = ref('强');
const updateTime = ref('刚刚');
let statusTimer = null;

// 录像列表数据
const recordList = ref([
  { time: '今天 08:00', duration: '00:15:20', size: '256MB' },
  { time: '今天 07:00', duration: '00:30:12', size: '512MB' },
  { time: '昨天 20:00', duration: '01:05:45', size: '1.2GB' }
]);

// 画质选项
const qualityOptions = ref([
  { name: '流畅 480P', desc: '省流量 · 低延迟' },
  { name: '标清 720P', desc: '平衡 · 常用' },
  { name: '高清 1080P', desc: '清晰 · 耗流量' }
]);

// 页面加载：初始化+登录校验+高度计算
onMounted(() => {
  // 计算scroll-view高度（和首页完全一致的逻辑）
  try {
    const systemInfo = uni.getSystemInfoSync();
    const screenHeight = systemInfo.windowHeight;
    const statusBarH = systemInfo.statusBarHeight || 0;
    const navBarH = 88 / 2; // 导航栏88rpx转px
    const tabBarH = 100 / 2; // tabBar高度转px
    scrollViewHeight.value = screenHeight - statusBarH - navBarH - tabBarH;
  } catch (e) {
    scrollViewHeight.value = 500; // 异常降级
  }

  // 校验登录状态，未登录跳登录页
  const isLogin = uni.getStorageSync('isLogin');
  if (!isLogin) {
    uni.redirectTo({ url: '/pages/auth/auth' });
    uni.showToast({ title: '请先登录', icon: 'none' });
    return;
  }

  // 模拟摄像头状态更新
  simulateCameraStatus();
});

// 页面卸载清理定时器
onUnmounted(() => {
  if (statusTimer) clearInterval(statusTimer);
  // 停止录制和对讲
  if (isRecording.value) stopRecord();
  if (isVoiceTalking.value) toggleVoiceTalk();
});

// 滚动事件处理（和首页一致）
const onScroll = (e) => {
  isScroll.value = e.detail.scrollTop > 20;
};

// 返回上一页
const goBack = () => {
  uni.navigateBack({ delta: 1 });
};

// 播放/暂停视频
const toggleVideoPlay = () => {
  if (!isVideoOnline.value) {
    uni.showToast({ title: '摄像头离线，无法播放', icon: 'none' });
    return;
  }
  
  isVideoPlaying.value = !isVideoPlaying.value;
  if (isVideoPlaying.value) {
    uni.showToast({ title: '视频已播放', icon: 'none' });
  } else {
    uni.showToast({ title: '视频已暂停', icon: 'none' });
  }
};

// 截图
const captureScreenshot = () => {
  handleFunctionClick(() => {
    if (!isVideoOnline.value) {
      uni.showToast({ title: '摄像头离线，无法截图', icon: 'none' });
      return;
    }
    
    uni.showToast({ title: '截图成功', icon: 'success' });
    // 实际开发中调用uni.canvasToTempFilePath或原生截图API
  });
};

// 开始录制
const startRecord = () => {
  handleFunctionClick(() => {
    if (!isVideoOnline.value) {
      uni.showToast({ title: '摄像头离线，无法录制', icon: 'none' });
      return;
    }
    
    isRecording.value = !isRecording.value;
    if (isRecording.value) {
      uni.showToast({ title: '开始录制', icon: 'none' });
    } else {
      stopRecord();
    }
  });
};

// 停止录制
const stopRecord = () => {
  isRecording.value = false;
  uni.showToast({ title: '录制已停止，视频已保存', icon: 'success' });
};

// 语音对讲
const toggleVoiceTalk = () => {
  handleFunctionClick(() => {
    if (!isVideoOnline.value) {
      uni.showToast({ title: '摄像头离线，无法对讲', icon: 'none' });
      return;
    }
    
    isVoiceTalking.value = !isVoiceTalking.value;
    if (isVoiceTalking.value) {
      uni.showToast({ title: '对讲已开启', icon: 'none' });
    } else {
      uni.showToast({ title: '对讲已关闭', icon: 'none' });
    }
  });
};

// 刷新摄像头状态
const refreshCameraStatus = () => {
  handleFunctionClick(() => {
    uni.showLoading({ title: '刷新中...' });
    setTimeout(() => {
      uni.hideLoading();
      updateTime.value = '刚刚';
      signalStrength.value = ['弱', '中', '强'][Math.floor(Math.random() * 3)];
      uni.showToast({ title: '状态已刷新', icon: 'success' });
    }, 1000);
  });
};

// 切换画质
const changeQuality = (quality) => {
  handleFunctionClick(() => {
    videoQuality.value = quality.name;
    uni.showToast({ title: `已切换至${quality.name}`, icon: 'success' });
  });
};

// 播放录像
const playRecord = (item) => {
  handleFunctionClick(() => {
    uni.showToast({ title: `播放${item.time}的录像`, icon: 'none' });
    // 实际开发中跳转到录像播放页面
  });
};

// 查看全部录像
const showAllRecord = () => {
  handleFunctionClick(() => {
    uni.showToast({ title: '录像列表页面暂未开发', icon: 'none' });
  });
};

// 前往视频设置
const gotoVideoSetting = () => {
  uni.showToast({ title: '视频设置页面暂未开发', icon: 'none' });
};

// 模拟摄像头状态更新
const simulateCameraStatus = () => {
  statusTimer = setInterval(() => {
    // 随机更新信号强度
    signalStrength.value = ['弱', '中', '强'][Math.floor(Math.random() * 3)];
    // 随机模拟短暂离线（概率1%）
    const randomOffline = Math.random() < 0.01;
    if (randomOffline) {
      isVideoOnline.value = false;
      isVideoPlaying.value = false;
      isRecording.value = false;
      isVoiceTalking.value = false;
      uni.showToast({ title: '摄像头已离线', icon: 'none' });
      
      // 5秒后自动恢复在线
      setTimeout(() => {
        isVideoOnline.value = true;
        updateTime.value = '刚刚';
        uni.showToast({ title: '摄像头已恢复在线', icon: 'success' });
      }, 5000);
    }
  }, 30000);
};

// 通用点击动画函数（复用首页逻辑）
const handleFunctionClick = (callback) => {
  isClick.value = true;
  setTimeout(() => {
    isClick.value = false;
    callback();
  }, 100);
};
</script>

<style scoped>
/* 基础样式 - 沿用首页规范 */
.page-video-detail {
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

/* 状态栏占位 - 和首页完全一致 */
.status-bar-placeholder {
  height: var(--status-bar-height);
  width: 100%;
  background: linear-gradient(135deg, #3b82f6 0%, #4f46e5 100%);
  flex-shrink: 0;
}

/* 顶部导航 - 沿用首页样式，调整按钮内容 */
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
.back-icon {
  font-size: 28rpx;
  color: #fff;
  font-weight: bold;
}
.setting-icon {
  font-size: 28rpx;
  color: #fff;
}

/* 内容滚动区 - 完全复用首页样式 */
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

/* 视频播放卡片 */
.video-player-card {
  background: #fff;
  border-radius: 32rpx;
  padding: 0 0 28rpx 0;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
  margin-bottom: 28rpx;
  width: 100%;
  box-sizing: border-box;
}
.video-container {
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  background-color: #000;
  border-radius: 32rpx 32rpx 0 0;
  overflow: hidden;
}
.video-placeholder {
  width: 100%;
  height: 100%;
  opacity: 0.7;
}
.live-tag {
  position: absolute;
  top: 20rpx;
  left: 20rpx;
  display: flex;
  align-items: center;
  gap: 8rpx;
  background-color: #ef4444;
  color: #fff;
  padding: 8rpx 16rpx;
  border-radius: 20rpx;
}
.live-text {
  font-size: 22rpx;
  font-weight: 500;
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
  background-color: rgba(0, 0, 0, 0.3);
}
.play-icon {
  font-size: 80rpx;
  color: #fff;
  width: 120rpx;
  height: 120rpx;
  line-height: 120rpx;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
}
.video-pause-btn {
  position: absolute;
  top: 20rpx;
  right: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
}
.pause-icon {
  font-size: 28rpx;
  color: #fff;
  font-weight: bold;
}
.video-status-tip {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  gap: 12rpx;
  background-color: rgba(0, 0, 0, 0.7);
  color: #fff;
  padding: 20rpx 32rpx;
  border-radius: 24rpx;
}
.status-tip-icon {
  font-size: 32rpx;
}
.status-tip-text {
  font-size: 28rpx;
  font-weight: 500;
}

/* 视频控制栏 */
.video-control-bar {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx;
  padding: 20rpx 24rpx;
}
.control-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16rpx;
  background-color: #f8fafc;
  border-radius: 24rpx;
  transition: all 0.2s ease;
}
.item-active {
  background-color: #eff6ff;
}
.recording {
  background-color: #fee2e2;
}
.talking {
  background-color: #f0fdf4;
}
.control-icon {
  font-size: 40rpx;
  margin-bottom: 8rpx;
}
.control-text {
  font-size: 22rpx;
  color: #334155;
  font-weight: 500;
}

/* 摄像头信息卡片 */
.camera-info-card {
  background: #fff;
  border-radius: 32rpx;
  padding: 28rpx 24rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
  margin-bottom: 28rpx;
  width: 100%;
  box-sizing: border-box;
}
.info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}
.info-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #334155;
}
.refresh-btn {
  background: #eff6ff;
  border: none;
  border-radius: 50%;
  width: 56rpx;
  height: 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.refresh-icon {
  font-size: 24rpx;
  color: #3b82f6;
}
.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}
.info-item {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}
.info-label {
  font-size: 22rpx;
  color: #64748b;
}
.info-value {
  font-size: 24rpx;
  color: #334155;
  font-weight: 500;
}
.online {
  color: #22c55e;
}
.offline {
  color: #ef4444;
}

/* 录像回放卡片 */
.record-playback-card {
  background: #fff;
  border-radius: 32rpx;
  padding: 28rpx 24rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
  margin-bottom: 28rpx;
  width: 100%;
  box-sizing: border-box;
}
.playback-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}
.playback-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #334155;
}
.playback-more {
  background: none;
  border: none;
}
.more-text {
  font-size: 22rpx;
  color: #3b82f6;
  font-weight: 600;
}
.playback-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.playback-item {
  display: flex;
  gap: 16rpx;
  padding: 16rpx;
  background-color: #f8fafc;
  border-radius: 20rpx;
  align-items: center;
}
.playback-thumb {
  width: 120rpx;
  height: 80rpx;
  position: relative;
  border-radius: 12rpx;
  overflow: hidden;
}
.thumb-img {
  width: 100%;
  height: 100%;
}
.record-duration {
  position: absolute;
  bottom: 4rpx;
  right: 4rpx;
  font-size: 16rpx;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 2rpx 6rpx;
  border-radius: 4rpx;
}
.playback-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}
.record-time {
  font-size: 24rpx;
  color: #334155;
  font-weight: 500;
}
.record-size {
  font-size: 20rpx;
  color: #64748b;
}

/* 画质设置卡片 */
.quality-setting-card {
  background: #fff;
  border-radius: 32rpx;
  padding: 28rpx 24rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
  width: 100%;
  box-sizing: border-box;
}
.setting-header {
  margin-bottom: 24rpx;
}
.setting-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #334155;
}
.quality-options {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.quality-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx;
  background-color: #f8fafc;
  border-radius: 20rpx;
  transition: all 0.2s ease;
}
.quality-option.active {
  background-color: #eff6ff;
  border: 1px solid #3b82f6;
}
.quality-name {
  font-size: 24rpx;
  color: #334155;
  font-weight: 500;
}
.quality-desc {
  font-size: 20rpx;
  color: #64748b;
  margin-top: 4rpx;
}
.check-icon {
  font-size: 24rpx;
  color: #3b82f6;
  font-weight: bold;
}

/* 全局按钮重置 - 复用首页样式 */
button {
  padding: 0;
  margin: 0;
  line-height: 1;
}

/* 脉冲动画（复用首页） */
.status-dot {
  width: 12rpx;
  height: 12rpx;
  background-color: #22c55e;
  border-radius: 50%;
}
.status-dot.pulse {
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}
</style>