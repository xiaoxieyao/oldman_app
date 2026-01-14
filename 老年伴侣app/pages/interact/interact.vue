<template>
  <view class="page-interact">
    <!-- 状态栏占位（适配手机顶部状态栏） -->
    <view class="status-bar-placeholder"></view>
    
    <!-- 页面内容区 -->
    <scroll-view 
      class="content-scroll" 
      scroll-y 
      @scroll="onScroll"
      scroll-with-animation
    >
      <!-- 快捷互动 -->
      <view class="interact-card">
        <text class="card-subtitle">亲情互动</text>
        <text class="card-tips">最近通话：{{ lastCallTime }}</text>
        <view class="interact-grid">
          <button class="interact-btn" @click="videoCall" :disabled="isCalling">
            <text class="btn-icon">📹</text>
            <text class="btn-text">视频通话</text>
            <text class="btn-status" v-if="isCalling">通话中...</text>
          </button>
          <button class="interact-btn" @click="voiceCall" :disabled="isCalling">
            <text class="btn-icon">📞</text>
            <text class="btn-text">语音通话</text>
            <text class="btn-status" v-if="isCalling">通话中...</text>
          </button>
        </view>
      </view>

      <!-- 语音留言 -->
      <view class="voice-card">
        <view class="card-header">
          <text class="card-title">语音留言</text>
          <button class="card-more" @click="recordVoice">录制新留言</button>
        </view>
        <view class="voice-list">
          <view class="voice-item" v-for="(item, index) in voiceList" :key="index">
            <view class="item-icon" :class="item.type">
              <text class="icon-text">{{ item.isPlaying ? '⏸' : '▶' }}</text>
            </view>
            <view class="item-content">
              <text class="content-title">{{ item.title }}</text>
              <text class="content-desc">{{ item.time }} · 时长: {{ item.duration }}</text>
              <view class="voice-progress" v-if="item.isPlaying">
                <view class="progress-bar" :style="{ width: item.progress + '%' }"></view>
              </view>
            </view>
            <button class="play-btn" @click="playVoice(index)">
              <text class="play-icon">{{ item.isPlaying ? '⏸' : '▶' }}</text>
            </button>
          </view>
        </view>
      </view>

      <!-- 家庭相册 -->
      <view class="album-card">
        <view class="card-header">
          <text class="card-title">家庭相册</text>
          <button class="card-more" @click="gotoAlbum">查看全部</button>
        </view>
        <scroll-view class="album-scroll" scroll-x show-scrollbar="false">
          <view class="album-list">
            <view class="album-item" v-for="(item, index) in albumList" :key="index" @click="previewImage(index)">
              <image :src="item.url" mode="aspectFill" class="album-img"></image>
              <view class="album-badge" v-if="item.isNew">新</view>
            </view>
            <!-- 添加上传按钮 -->
            <view class="album-item upload-btn" @click="chooseImage">
              <text class="upload-icon">+</text>
            </view>
          </view>
        </scroll-view>
      </view>

      <!-- 互动记录 -->
      <view class="record-card">
        <text class="card-title">互动记录</text>
        <view class="record-list">
          <view class="record-item" v-for="(item, index) in recordList" :key="index">
            <view class="item-left">
              <view class="item-icon" :class="item.type">
                <text class="icon-text">{{ item.icon }}</text>
              </view>
              <view class="item-info">
                <text class="info-title">{{ item.title }}</text>
                <text class="info-desc">{{ item.time }} · {{ item.desc }}</text>
              </view>
            </view>
            <text class="item-status" :class="item.statusType">{{ item.status }}</text>
          </view>
        </view>
        <button class="load-more-btn" @click="loadMoreRecords" v-if="hasMoreRecords">
          <text class="load-more-text">加载更多</text>
        </button>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, onLoad, onShow } from 'vue';

// 1. 响应式数据（核心状态管理）
const isCalling = ref(false); // 是否正在通话
const lastCallTime = ref('今天 10:15'); // 最近通话时间
const voiceList = ref([
  {
    title: '子女留言',
    time: '今天 09:30',
    duration: '00:45',
    type: 'blue',
    isPlaying: false,
    progress: 0,
    audioUrl: '/static/voice/1.mp3' // 示例音频路径
  },
  {
    title: '老伴留言',
    time: '昨天 18:15',
    duration: '01:20',
    type: 'purple',
    isPlaying: false,
    progress: 0,
    audioUrl: '/static/voice/2.mp3'
  }
]);

// 相册列表（模拟数据）
const albumList = ref([
  { url: '/static/album/1.jpg', isNew: true },
  { url: '/static/album/2.jpg', isNew: false },
  { url: '/static/album/3.jpg', isNew: false },
  { url: '/static/album/4.jpg', isNew: true }
]);

// 互动记录列表
const recordList = ref([
  {
    icon: '📹',
    title: '视频通话',
    time: '今天 10:15',
    desc: '时长: 08:30',
    type: 'green',
    status: '已完成',
    statusType: 'green'
  },
  {
    icon: '💬',
    title: '文字消息',
    time: '昨天 16:40',
    desc: '3条',
    type: 'blue',
    status: '已读',
    statusType: 'blue'
  }
]);

const hasMoreRecords = ref(true); // 是否有更多记录
let currentPage = ref(1); // 当前页码

// 2. 页面生命周期
onLoad(() => {
  // 初始化数据
  updateCallStatus();
});

onShow(() => {
  // 每次页面显示时更新通话状态
  updateCallStatus();
});

// 3. 核心方法
// 更新通话状态
const updateCallStatus = () => {
  // 模拟通话状态检测
  isCalling.value = false;
};

// 视频通话
const videoCall = () => {
  if (isCalling.value) return;
  
  uni.showModal({
    title: '视频通话',
    content: '是否发起视频通话给子女？',
    confirmText: '发起',
    cancelText: '取消',
    success: (res) => {
      if (res.confirm) {
        isCalling.value = true;
        uni.showToast({
          title: '正在发起视频通话...',
          icon: 'none',
          duration: 2000
        });
        
        // 模拟5秒后通话接通
        setTimeout(() => {
          if (isCalling.value) {
            uni.showToast({
              title: '通话已接通',
              icon: 'success'
            });
            
            // 记录通话时间
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            lastCallTime.value = `${hours}:${minutes}`;
          }
        }, 5000);
      }
    }
  });
};

// 语音通话
const voiceCall = () => {
  if (isCalling.value) return;
  
  uni.showActionSheet({
    itemList: ['子女', '老伴', '社区服务'],
    title: '选择通话对象',
    success: (res) => {
      const contacts = ['13800138000', '13900139000', '12345'];
      const phoneNumber = contacts[res.tapIndex];
      
      uni.makePhoneCall({
        phoneNumber,
        success: () => {
          isCalling.value = true;
          lastCallTime.value = '正在通话';
        },
        fail: (err) => {
          uni.showToast({
            title: '通话发起失败',
            icon: 'none'
          });
        }
      });
    }
  });
};

// 播放/暂停语音
const playVoice = (index) => {
  const voiceItem = voiceList.value[index];
  
  // 停止其他正在播放的语音
  voiceList.value.forEach((item, i) => {
    if (i !== index && item.isPlaying) {
      item.isPlaying = false;
      item.progress = 0;
    }
  });
  
  // 切换当前语音播放状态
  voiceItem.isPlaying = !voiceItem.isPlaying;
  
  if (voiceItem.isPlaying) {
    uni.showToast({
      title: `正在播放${voiceItem.title}`,
      icon: 'none',
      duration: 1500
    });
    
    // 模拟进度条更新
    const duration = parseInt(voiceItem.duration.split(':')[1]) || 45;
    const interval = setInterval(() => {
      if (voiceItem.progress >= 100 || !voiceItem.isPlaying) {
        clearInterval(interval);
        if (voiceItem.progress >= 100) {
          voiceItem.isPlaying = false;
          voiceItem.progress = 0;
        }
        return;
      }
      voiceItem.progress += 1;
    }, duration * 10);
  } else {
    voiceItem.progress = 0;
    uni.showToast({
      title: '暂停播放',
      icon: 'none',
      duration: 1000
    });
  }
};

// 录制语音
const recordVoice = () => {
  // 检查录音权限
  uni.getSetting({
    success: (res) => {
      if (!res.authSetting['scope.record']) {
        uni.authorize({
          scope: 'scope.record',
          success: () => {
            startRecord();
          },
          fail: () => {
            uni.showToast({
              title: '需要录音权限才能录制',
              icon: 'none'
            });
          }
        });
      } else {
        startRecord();
      }
    }
  });
};

// 开始录音
const startRecord = () => {
  uni.showModal({
    title: '录制语音',
    content: '点击确定开始录制，最长录制60秒',
    confirmText: '开始',
    cancelText: '取消',
    success: (res) => {
      if (res.confirm) {
        uni.showToast({
          title: '正在录制...',
          icon: 'none'
        });
        
        // 模拟录音6秒后完成
        setTimeout(() => {
          uni.showToast({
            title: '录音完成',
            icon: 'success'
          });
          
          // 添加新留言到列表顶部
          voiceList.value.unshift({
            title: '我的留言',
            time: '刚刚',
            duration: '00:06',
            type: 'green',
            isPlaying: false,
            progress: 0,
            audioUrl: '/static/voice/my.mp3'
          });
        }, 6000);
      }
    }
  });
};

// 跳转到相册页
const gotoAlbum = () => {
  uni.navigateTo({
    url: '/pages/album/album',
    fail: (err) => {
      uni.showToast({
        title: '相册页面未配置',
        icon: 'none'
      });
    }
  });
};

// 预览图片
const previewImage = (index) => {
  const urls = albumList.value.map(item => item.url);
  uni.previewImage({
    current: urls[index],
    urls,
    indicator: 'number',
    loop: true
  });
};

// 选择图片上传
const chooseImage = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['original', 'compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      // 模拟上传成功
      albumList.value.unshift({
        url: res.tempFilePaths[0],
        isNew: true
      });
      
      uni.showToast({
        title: '图片添加成功',
        icon: 'success'
      });
    }
  });
};

// 加载更多互动记录
const loadMoreRecords = () => {
  uni.showToast({
    title: '加载中...',
    icon: 'none'
  });
  
  // 模拟加载更多数据
  setTimeout(() => {
    const newRecords = [
      {
        icon: '🎙',
        title: '语音留言',
        time: '前天 09:20',
        desc: '时长: 01:10',
        type: 'purple',
        status: '已收听',
        statusType: 'purple'
      },
      {
        icon: '🖼',
        title: '相册更新',
        time: '前天 14:30',
        desc: '新增3张照片',
        type: 'amber',
        status: '已查看',
        statusType: 'amber'
      }
    ];
    
    recordList.value.push(...newRecords);
    currentPage.value += 1;
    
    // 模拟只有2页数据
    if (currentPage.value >= 2) {
      hasMoreRecords.value = false;
    }
    
    uni.showToast({
      title: '加载完成',
      icon: 'success'
    });
  }, 1500);
};

// 滚动事件
const onScroll = (e) => {
  // 可添加滚动相关逻辑，如导航栏样式变化
  // console.log('滚动位置：', e.detail.scrollTop);
};
</script>

<style scoped>
/* 根容器：铺满屏幕 */
.page-interact {
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
.content-scroll::-webkit-scrollbar,
.album-scroll::-webkit-scrollbar {
  display: none;
}
.content-scroll,
.album-scroll {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* 快捷互动卡片 */
.interact-card {
  background: linear-gradient(135deg, #ec4899 0%, #be185d 100%);
  border-radius: 32rpx;
  padding: 24rpx 20rpx;
  color: #fff;
  box-shadow: 0 8rpx 24rpx rgba(236, 72, 153, 0.2);
  margin-bottom: 20rpx;
}
.card-subtitle {
  font-size: 24rpx;
  color: #fce7f3;
  display: block;
  margin-bottom: 8rpx;
}
.card-tips {
  font-size: 20rpx;
  color: #f9d5e5;
  display: block;
  margin-bottom: 16rpx;
}
.interact-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16rpx;
}
.interact-btn {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12rpx);
  border-radius: 24rpx;
  padding: 20rpx 16rpx;
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
  position: relative;
}
.interact-btn:disabled {
  opacity: 0.7;
}
.btn-icon {
  font-size: 40rpx;
  margin-bottom: 8rpx;
}
.btn-text {
  font-size: 24rpx;
  font-weight: 500;
}
.btn-status {
  position: absolute;
  bottom: 12rpx;
  font-size: 18rpx;
  color: #fecdd3;
}

/* 语音留言卡片 */
.voice-card {
  background: #fff;
  border-radius: 32rpx;
  padding: 20rpx 16rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
  margin-bottom: 20rpx;
}
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16rpx;
}
.card-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #334155;
}
.card-more {
  font-size: 20rpx;
  color: #2563eb;
  font-weight: 500;
  background: transparent;
  border: none;
  padding: 0;
}
.voice-list {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}
.voice-item {
  display: flex;
  align-items: center;
  gap: 12rpx;
  padding: 16rpx;
  background-color: #f8fafc;
  border-radius: 20rpx;
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
.item-icon.blue {
  background-color: #3b82f6;
}
.item-icon.purple {
  background-color: #9333ea;
}
.item-icon.green {
  background-color: #10b981;
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
  margin-bottom: 8rpx;
}
.voice-progress {
  width: 100%;
  height: 6rpx;
  background-color: #e2e8f0;
  border-radius: 3rpx;
  overflow: hidden;
}
.progress-bar {
  height: 100%;
  background-color: #3b82f6;
  border-radius: 3rpx;
  transition: width 0.1s linear;
}
.play-btn {
  font-size: 20rpx;
  color: #94a3b8;
  background: transparent;
  border: none;
  padding: 0;
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.play-icon {
  font-size: 24rpx;
}

/* 家庭相册卡片 */
.album-card {
  background: #fff;
  border-radius: 32rpx;
  padding: 20rpx 16rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
  margin-bottom: 20rpx;
}
.album-scroll {
  overflow-x: auto;
  padding-bottom: 8rpx;
}
.album-list {
  display: flex;
  gap: 12rpx;
}
.album-item {
  width: 120rpx;
  height: 120rpx;
  background-color: #e2e8f0;
  border-radius: 20rpx;
  overflow: hidden;
  flex-shrink: 0;
  position: relative;
}
.album-img {
  width: 100%;
  height: 100%;
}
.album-badge {
  position: absolute;
  top: 4rpx;
  right: 4rpx;
  background-color: #ef4444;
  color: #fff;
  font-size: 16rpx;
  padding: 2rpx 8rpx;
  border-radius: 8rpx;
}
.upload-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8fafc;
  border: 1px dashed #cbd5e1;
}
.upload-icon {
  font-size: 32rpx;
  color: #94a3b8;
}

/* 互动记录卡片 */
.record-card {
  background: #fff;
  border-radius: 32rpx;
  padding: 20rpx 16rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
}
.record-list {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  margin-bottom: 16rpx;
}
.record-item {
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
.item-icon.green {
  width: 40rpx;
  height: 40rpx;
  background-color: #10b981;
}
.item-icon.blue {
  width: 40rpx;
  height: 40rpx;
  background-color: #3b82f6;
}
.item-icon.purple {
  width: 40rpx;
  height: 40rpx;
  background-color: #9333ea;
}
.item-icon.amber {
  width: 40rpx;
  height: 40rpx;
  background-color: #f59e0b;
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
}
.item-status {
  font-size: 20rpx;
  font-weight: 500;
}
.item-status.green {
  color: #10b981;
}
.item-status.blue {
  color: #2563eb;
}
.item-status.purple {
  color: #9333ea;
}
.item-status.amber {
  color: #f59e0b;
}
.load-more-btn {
  width: 100%;
  background-color: #f8fafc;
  color: #475569;
  border-radius: 20rpx;
  padding: 12rpx;
  border: 1px solid #e2e8f0;
}
.load-more-text {
  font-size: 24rpx;
}
</style>