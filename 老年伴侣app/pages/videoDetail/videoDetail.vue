<template>
  <view class="page-videoDetail">
    <!-- 状态栏占位（适配手机顶部状态栏） -->
    <view class="status-bar-placeholder"></view>
    
    <!-- 页面内容区 -->
    <scroll-view 
      class="content-scroll" 
      scroll-y 
      @scroll="onScroll"
      scroll-with-animation
    >
      <!-- 视频播放容器 -->
      <view class="video-container" @click="togglePlayPause">
        <!-- 视频封面/播放区域 -->
        <view class="video-player" :class="{ 'playing': isPlaying }">
          <!-- 直播状态标签 -->
          <view class="live-tag">
            <view class="pulse-dot"></view>
            <text class="live-text">直播中</text>
          </view>
          
          <!-- 播放按钮 -->
          <view class="play-button" v-if="!isPlaying" @click.stop="togglePlayPause">
            <text class="play-icon">▶️</text>
          </view>
          
          <!-- 视频控制栏（播放时显示） -->
          <view class="video-controls" v-if="isPlaying">
            <view class="control-left">
              <text class="time-text">{{ currentTime }} / {{ totalTime }}</text>
            </view>
            <view class="control-right">
              <button class="control-btn" @click.stop="videoAction('screenshot')">
                <text class="btn-icon">📷</text>
              </button>
              <button class="control-btn" @click.stop="videoAction('record')">
                <text class="btn-icon" :class="{ 'recording': isRecording }">
                  {{ isRecording ? '⏹️' : '🎥' }}
                </text>
              </button>
            </view>
          </view>
          
          <!-- 视频进度条 -->
          <view class="progress-bar" v-if="isPlaying">
            <view class="progress-track">
              <view class="progress-fill" :style="{ width: progress + '%' }"></view>
              <view class="progress-handle" :style="{ left: progress + '%' }"></view>
            </view>
          </view>
        </view>
      </view>

      <!-- 摄像头信息 -->
      <view class="camera-info-card">
        <text class="card-title">摄像头信息</text>
        <view class="info-list">
          <view class="info-item">
            <text class="item-label">安装位置</text>
            <text class="item-value">{{ cameraInfo.location }}</text>
          </view>
          <view class="info-item">
            <text class="item-label">设备状态</text>
            <text class="item-value status-online">{{ cameraInfo.status }}</text>
          </view>
          <view class="info-item">
            <text class="item-label">视频画质</text>
            <text class="item-value">{{ cameraInfo.quality }}</text>
          </view>
          <view class="info-item">
            <text class="item-label">信号强度</text>
            <view class="signal-bar">
              <view class="signal-item" :class="{ active: cameraInfo.signal >= 1 }"></view>
              <view class="signal-item" :class="{ active: cameraInfo.signal >= 2 }"></view>
              <view class="signal-item" :class="{ active: cameraInfo.signal >= 3 }"></view>
              <view class="signal-item" :class="{ active: cameraInfo.signal >= 4 }"></view>
            </view>
          </view>
          <view class="info-item">
            <text class="item-label">最后更新</text>
            <text class="item-value">{{ cameraInfo.updateTime }}</text>
          </view>
        </view>
      </view>

      <!-- 视频操作按钮区 -->
      <view class="action-buttons">
        <button class="action-btn" @click="videoAction('screenshot')">
          <text class="btn-icon">📷</text>
          <text class="btn-text">截图</text>
        </button>
        <button class="action-btn" @click="videoAction('record')" :class="{ 'recording': isRecording }">
          <text class="btn-icon">{{ isRecording ? '⏹️' : '🎥' }}</text>
          <text class="btn-text">{{ isRecording ? '停止录制' : '开始录制' }}</text>
        </button>
        <button class="action-btn" @click="videoAction('intercom')">
          <text class="btn-icon">🎤</text>
          <text class="btn-text">双向对讲</text>
        </button>
        <button class="action-btn" @click="videoAction('fullscreen')">
          <text class="btn-icon">⛶</text>
          <text class="btn-text">全屏播放</text>
        </button>
      </view>

      <!-- 紧急操作区 -->
      <view class="emergency-actions">
        <button class="emergency-btn call-btn" @click="callEmergencyContact">
          <text class="btn-icon">📞</text>
          <text class="btn-text">紧急呼叫</text>
        </button>
        <button class="emergency-btn share-btn" @click="shareVideo">
          <text class="btn-icon">🔗</text>
          <text class="btn-text">分享视频</text>
        </button>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, onLoad, onUnload, onReady } from 'vue';

// 1. 响应式数据（核心状态管理）
const isPlaying = ref(false);       // 播放状态
const isRecording = ref(false);     // 录制状态
const isIntercom = ref(false);      // 对讲状态
const progress = ref(0);            // 播放进度
const currentTime = ref('00:15');   // 当前播放时间
const totalTime = ref('01:30');     // 视频总时长
const recordingTimer = ref(null);   // 录制计时器

// 摄像头信息
const cameraInfo = ref({
  location: '客厅 (主摄像头)',
  status: '在线',
  quality: '高清 1080P',
  signal: 4,          // 信号强度 1-4
  updateTime: '刚刚'
});

// 2. 页面生命周期
onLoad((options) => {
  console.log('视频详情页加载', options);
  // 获取告警ID，可用于请求对应视频
  const alarmId = options.id || '';
  if (alarmId) {
    console.log(`加载告警ID: ${alarmId} 的视频`);
  }
  
  // 模拟更新摄像头状态
  updateCameraStatus();
});

onReady(() => {
  // 页面渲染完成
});

onUnload(() => {
  // 页面卸载时清理资源
  if (isRecording.value) {
    stopRecording();
  }
  if (isPlaying.value) {
    isPlaying.value = false;
  }
  if (recordingTimer.value) {
    clearInterval(recordingTimer.value);
  }
});

// 3. 核心方法
// 更新摄像头状态
const updateCameraStatus = () => {
  // 模拟实时更新信号强度
  setInterval(() => {
    cameraInfo.value.signal = Math.floor(Math.random() * 4) + 1;
    cameraInfo.value.updateTime = '刚刚';
  }, 5000);
};

// 播放/暂停切换
const togglePlayPause = () => {
  isPlaying.value = !isPlaying.value;
  
  if (isPlaying.value) {
    // 开始播放
    uni.showToast({
      title: '视频播放中...',
      icon: 'none',
      duration: 1500
    });
    
    // 模拟播放进度更新
    startProgressUpdate();
  } else {
    // 暂停播放
    uni.showToast({
      title: '视频已暂停',
      icon: 'none',
      duration: 1500
    });
    
    // 停止进度更新
    stopProgressUpdate();
  }
};

// 开始进度更新
const startProgressUpdate = () => {
  const timer = setInterval(() => {
    progress.value += 1;
    if (progress.value >= 100) {
      progress.value = 0;
    }
    
    // 模拟更新播放时间
    const minutes = Math.floor((progress.value * 90) / 6000);
    const seconds = Math.floor((progress.value * 90) / 100) % 60;
    currentTime.value = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, 1000);
  
  recordingTimer.value = timer;
};

// 停止进度更新
const stopProgressUpdate = () => {
  if (recordingTimer.value) {
    clearInterval(recordingTimer.value);
    recordingTimer.value = null;
  }
};

// 开始录制
const startRecording = () => {
  isRecording.value = true;
  uni.showToast({
    title: '开始录制视频...',
    icon: 'none'
  });
  
  // 录制时长计时
  let seconds = 0;
  recordingTimer.value = setInterval(() => {
    seconds++;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    uni.setNavigationBarTitle({
      title: `录制中 ${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    });
  }, 1000);
};

// 停止录制
const stopRecording = () => {
  isRecording.value = false;
  
  // 恢复导航栏标题
  uni.setNavigationBarTitle({
    title: '视频详情'
  });
  
  if (recordingTimer.value) {
    clearInterval(recordingTimer.value);
    recordingTimer.value = null;
  }
  
  uni.showToast({
    title: '录制完成，视频已保存至相册',
    icon: 'success'
  });
};

// 视频操作处理
const videoAction = (action) => {
  switch(action) {
    case 'screenshot':
      // 截图功能
      uni.showLoading({
        title: '正在截图...'
      });
      
      setTimeout(() => {
        uni.hideLoading();
        uni.showToast({
          title: '截图成功，已保存至相册',
          icon: 'success'
        });
        
        // 实际项目中可调用原生截图API
        // uni.saveImageToPhotosAlbum({...});
      }, 800);
      break;
      
    case 'record':
      // 录制功能
      if (isRecording.value) {
        stopRecording();
      } else {
        // 如果未播放，先开始播放
        if (!isPlaying.value) {
          togglePlayPause();
        }
        startRecording();
      }
      break;
      
    case 'intercom':
      // 双向对讲
      isIntercom.value = !isIntercom.value;
      
      if (isIntercom.value) {
        uni.showModal({
          title: '双向对讲',
          content: '已开启双向对讲功能，请对着麦克风说话',
          showCancel: false,
          confirmText: '知道了'
        });
      } else {
        uni.showToast({
          title: '已关闭双向对讲',
          icon: 'success'
        });
      }
      break;
      
    case 'fullscreen':
      // 全屏播放
      uni.showToast({
        title: '已切换至全屏模式',
        icon: 'none'
      });
      break;
  }
};

// 紧急呼叫
const callEmergencyContact = () => {
  // 模拟紧急联系人列表
  const contacts = [
    { name: '子女', phone: '13800138000' },
    { name: '社区医生', phone: '13900139000' },
    { name: '急救中心', phone: '120' }
  ];
  
  uni.showActionSheet({
    itemList: contacts.map(c => `${c.name} (${c.phone})`),
    title: '选择紧急呼叫对象',
    success: (res) => {
      const selected = contacts[res.tapIndex];
      uni.makePhoneCall({
        phoneNumber: selected.phone,
        success: () => {
          uni.showToast({
            title: `正在拨打${selected.name}...`,
            icon: 'none'
          });
        }
      });
    }
  });
};

// 分享视频
const shareVideo = () => {
  uni.showActionSheet({
    itemList: ['分享给家人', '分享给社区医生', '保存到本地'],
    title: '分享视频',
    success: (res) => {
      const actions = [
        '已分享给家人',
        '已分享给社区医生',
        '视频已保存到本地'
      ];
      
      uni.showToast({
        title: actions[res.tapIndex],
        icon: 'success'
      });
    }
  });
};

// 滚动事件
const onScroll = (e) => {
  // 滚动逻辑
};

// 页面返回
const goBack = () => {
  uni.navigateBack({ delta: 1 });
};
</script>

<style scoped>
/* 根容器：铺满屏幕 */
.page-videoDetail {
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

/* 视频播放容器 */
.video-container {
  width: 100%;
  border-radius: 24rpx;
  overflow: hidden;
  margin-bottom: 20rpx;
  background-color: #000;
  position: relative;
}
.video-player {
  width: 100%;
  aspect-ratio: 16/9;
  background-color: #111;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.video-player.playing {
  background: linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('https://via.placeholder.com/640x360/333333/FFFFFF?text=Video+Playing') center/cover no-repeat;
}

/* 直播标签 */
.live-tag {
  position: absolute;
  top: 16rpx;
  left: 16rpx;
  display: flex;
  align-items: center;
  background-color: #ef4444;
  color: #fff;
  padding: 6rpx 12rpx;
  border-radius: 16rpx;
  font-size: 20rpx;
}
.pulse-dot {
  width: 12rpx;
  height: 12rpx;
  background-color: #fff;
  border-radius: 50%;
  margin-right: 8rpx;
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}
.live-text {
  font-weight: 500;
}

/* 播放按钮 */
.play-button {
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
  background-color: rgba(255,255,255,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
}
.play-icon {
  font-size: 48rpx;
  margin-left: 8rpx;
}

/* 视频控制栏 */
.video-controls {
  position: absolute;
  bottom: 48rpx;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  padding: 0 16rpx;
  color: #fff;
}
.control-left {
  font-size: 20rpx;
}
.control-right {
  display: flex;
  gap: 16rpx;
}
.control-btn {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  background-color: rgba(0,0,0,0.5);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn-icon {
  font-size: 24rpx;
  color: #fff;
}
.btn-icon.recording {
  color: #ef4444;
  animation: blink 1s infinite;
}
@keyframes blink {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

/* 进度条 */
.progress-bar {
  position: absolute;
  bottom: 16rpx;
  left: 0;
  right: 0;
  padding: 0 16rpx;
}
.progress-track {
  height: 8rpx;
  background-color: rgba(255,255,255,0.3);
  border-radius: 4rpx;
  position: relative;
}
.progress-fill {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background-color: #ef4444;
  border-radius: 4rpx;
}
.progress-handle {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 20rpx;
  height: 20rpx;
  background-color: #fff;
  border-radius: 50%;
  box-shadow: 0 0 8rpx rgba(0,0,0,0.5);
}

/* 摄像头信息卡片 */
.camera-info-card {
  background-color: #fff;
  border-radius: 24rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.05);
  border: 1px solid #f1f5f9;
}
.card-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #334155;
  display: block;
  margin-bottom: 16rpx;
}
.info-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12rpx;
  border-bottom: 1px solid #f1f5f9;
}
.info-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}
.item-label {
  font-size: 24rpx;
  color: #64748b;
}
.item-value {
  font-size: 24rpx;
  color: #1e293b;
  font-weight: 500;
}
.status-online {
  color: #10b981;
}

/* 信号强度 */
.signal-bar {
  display: flex;
  gap: 4rpx;
  align-items: flex-end;
  height: 24rpx;
}
.signal-item {
  width: 8rpx;
  background-color: #e2e8f0;
  border-radius: 4rpx;
}
.signal-item.active {
  background-color: #10b981;
}
.signal-item:nth-child(1) { height: 8rpx; }
.signal-item:nth-child(2) { height: 14rpx; }
.signal-item:nth-child(3) { height: 20rpx; }
.signal-item:nth-child(4) { height: 24rpx; }

/* 操作按钮区 */
.action-buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16rpx;
  margin-bottom: 20rpx;
}
.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border-radius: 20rpx;
  padding: 24rpx 0;
  border: 1px solid #f1f5f9;
}
.action-btn.recording {
  background-color: #fff5f5;
  border-color: #fee2e2;
}
.action-btn .btn-icon {
  font-size: 32rpx;
  margin-bottom: 8rpx;
}
.action-btn.recording .btn-icon {
  color: #ef4444;
}
.action-btn .btn-text {
  font-size: 22rpx;
  color: #475569;
  font-weight: 500;
}

/* 紧急操作区 */
.emergency-actions {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.emergency-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12rpx;
  padding: 24rpx 0;
  border-radius: 24rpx;
  border: none;
  font-weight: 600;
}
.call-btn {
  background-color: #ef4444;
  color: #fff;
}
.share-btn {
  background-color: #3b82f6;
  color: #fff;
}
.emergency-btn .btn-icon {
  font-size: 28rpx;
}
.emergency-btn .btn-text {
  font-size: 28rpx;
}
</style>