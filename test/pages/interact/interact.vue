<template>
  <view class="page-interact">
    <!-- 状态栏占位（适配手机顶部状态栏） -->
    <view class="status-bar-placeholder"></view>
    
    <!-- 顶部导航栏 -->
    <view class="page-header" :class="{ 'header-scroll': isScroll }">
      <text class="header-title">亲情互动</text>
      <button class="header-btn" @click="showAddContact">
        <text class="setting-icon">➕</text>
      </button>
    </view>

    <!-- 内容容器（修复右侧溢出 + 适配自定义tabBar） -->
    <scroll-view 
      class="content-scroll" 
      scroll-y 
      @scroll="onScroll"
      scroll-with-animation
      :style="{ height: scrollViewHeight + 'px' }"
    >
      <!-- 快捷联系模块 -->
      <view class="contact-card" @click="noop">
        <view class="contact-header">
          <view class="contact-info">
            <text class="contact-subtitle">快捷联系</text>
            <text class="contact-name">王奶奶</text>
          </view>
          <view class="avatar">
            <text class="avatar-text">王</text>
          </view>
        </view>
        <view class="contact-btns">
          <button class="contact-btn" @click="makeVoiceCall">
            <text class="btn-icon">📞</text>
            <text class="btn-text">语音通话</text>
          </button>
          <button class="contact-btn" @click="makeVideoCall">
            <text class="btn-icon">📹</text>
            <text class="btn-text">视频通话</text>
          </button>
        </view>
      </view>

      <!-- 紧急通知栏（改为老人摔倒通知） -->
      <view class="emergency-bar" @click="viewEmergencyDetail">
        <view class="emergency-left">
          <text class="emergency-icon">🚨</text>
          <view class="emergency-info">
            <text class="emergency-title">紧急通知</text>
            <text class="emergency-desc">检测到老人摔倒 · 位置：客厅</text>
          </view>
        </view>
        <text class="emergency-time">1分钟前</text>
        <button class="confirm-btn" @click.stop="confirmEmergencyRead">已确认</button>
      </view>

      <!-- 家庭相册模块 -->
      <view class="album-card">
        <view class="album-header">
          <text class="album-title">家庭相册</text>
          <button class="album-upload" @click="showAlbumUpload">上传</button>
        </view>
        <view class="album-grid">
          <view class="album-item" @click="previewPhoto(1)">
            <view class="photo-placeholder">
              <text class="photo-icon">🖼️</text>
            </view>
          </view>
          <view class="album-item" @click="previewPhoto(2)">
            <view class="photo-placeholder">
              <text class="photo-icon">🖼️</text>
            </view>
          </view>
          <view class="album-add" @click="showAlbumUpload">
            <text class="add-icon">➕</text>
          </view>
        </view>
      </view>

      <!-- 今日任务模块 -->
      <view class="task-card">
        <view class="task-header">
          <text class="task-title">今日任务</text>
          <button class="task-publish" @click="publishTask">发布</button>
        </view>
        <view class="task-list">
          <view class="task-item" @click="viewTaskDetail(1)">
            <view class="task-left">
              <view class="task-icon completed">✓</view>
              <view class="task-info">
                <text class="task-name">晨间散步</text>
                <text class="task-status">已完成 · 获得10积分</text>
              </view>
            </view>
            <text class="task-reward">🎉</text>
          </view>
          <view class="task-item" @click="viewTaskDetail(2)">
            <view class="task-left">
              <view class="task-icon ongoing">💧</view>
              <view class="task-info">
                <text class="task-name">喝水8杯</text>
                <text class="task-status">进行中 · 5/8杯</text>
              </view>
            </view>
            <view class="progress-bar">
              <view class="progress-fill" style="width: 62.5%"></view>
            </view>
          </view>
          <view class="task-item" @click="viewTaskDetail(3)">
            <view class="task-left">
              <view class="task-icon pending">📖</view>
              <view class="task-info">
                <text class="task-name">阅读养生文章</text>
                <text class="task-status">未开始 · 预计15分钟</text>
              </view>
            </view>
            <view class="progress-bar">
              <view class="progress-fill" style="width: 0%"></view>
            </view>
          </view>
        </view>
      </view>

      <!-- 每日问候模块 -->
      <view class="greeting-card">
        <text class="greeting-title">每日问候</text>
        <view class="greeting-content">
          <text class="greeting-icon">☀️</text>
          <view class="greeting-text">
            <text class="greeting-main">早安，妈妈！</text>
            <text class="greeting-desc">今天天气晴朗，温度适宜，适合外出散步</text>
            <button class="send-btn" @click="sendGreeting">发送问候</button>
            <text class="send-status" v-show="greetingSent">✅ 问候已发送</text>
          </view>
        </view>
      </view>

      <!-- 亲情留言模块 -->
      <view class="message-card">
        <view class="message-header">
          <text class="message-title">亲情留言</text>
          <button class="message-leave" @click="showLeaveMessage">留言</button>
        </view>
        <view class="message-list">
          <view class="message-item from-daughter">
            <view class="msg-header">
              <text class="sender">女儿 - 昨天 19:30</text>
              <text class="read-status">已读</text>
            </view>
            <text class="message-content">妈妈，明天我带外孙来看您，记得别出门买菜啦～</text>
          </view>
          <view class="message-item from-grandma">
            <view class="msg-header">
              <text class="sender">王奶奶 - 昨天 20:05</text>
              <text class="read-status">已读</text>
            </view>
            <text class="message-content">好的好的，我准备点你们爱吃的饺子馅～</text>
          </view>
        </view>
      </view>

      <!-- 社区活动模块 -->
      <view class="activity-card mb-20">
        <view class="activity-header">
          <text class="activity-title">社区活动</text>
          <button class="activity-more" @click="showMoreActivity">更多</button>
        </view>
        <view class="activity-list">
          <view class="activity-item" @click="showActivityDetail">
            <view class="activity-icon">🎵</view>
            <view class="activity-info">
              <text class="activity-name">社区合唱团</text>
              <text class="activity-desc">每周三下午 2:00 | 社区活动中心2楼</text>
              <button class="join-btn">报名参加</button>
            </view>
          </view>
          <view class="activity-item" @click="showActivityDetail">
            <view class="activity-icon">♟️</view>
            <view class="activity-info">
              <text class="activity-name">棋牌友谊赛</text>
              <text class="activity-desc">本周六上午 9:00 | 社区老年活动室</text>
              <button class="join-btn">报名参加</button>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 自定义tabBar -->
    <custom-tabbar />
  </view>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import customTabbar from '@/components/custom-tabbar/custom-tabbar.vue';

// 响应式数据
const greetingSent = ref(false);
const isScroll = ref(false);
const scrollViewHeight = ref(0); // 动态计算scroll-view高度

// 页面加载初始化
onMounted(() => {
  // 计算scroll-view高度（修复溢出核心）
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

  // 登录校验（和device页面保持一致）
  const isLogin = uni.getStorageSync('isLogin');
  if (!isLogin) {
    uni.redirectTo({ url: '/pages/auth/auth' });
    uni.showToast({ title: '请先登录', icon: 'none' });
    return;
  }
});

// 滚动事件处理
const onScroll = (e) => {
  isScroll.value = e.detail.scrollTop > 20;
};

// 快捷联系
const showAddContact = () => {
  uni.showToast({ title: '新增联系人功能待开发', icon: 'none' });
};
const makeVoiceCall = () => {
  uni.showToast({ title: '正在拨打王奶奶的语音通话...', icon: 'none' });
};
const makeVideoCall = () => {
  uni.showToast({ title: '正在拨打王奶奶的视频通话...', icon: 'none' });
};

// 紧急通知（老人摔倒）
const viewEmergencyDetail = () => {
  uni.showModal({
    title: '紧急提醒',
    content: '⚠️ 检测到王奶奶于客厅摔倒，请立即确认情况并联系紧急联系人！',
    confirmText: '联系家人',
    cancelText: '查看监控',
    success: (res) => {
      if (res.confirm) {
        uni.showToast({ title: '正在联系紧急联系人...', icon: 'none' });
      } else {
        uni.showToast({ title: '正在打开客厅监控...', icon: 'none' });
      }
    }
  });
};
const confirmEmergencyRead = () => {
  uni.showToast({ title: '已确认摔倒通知，将持续关注老人状态', icon: 'success' });
};

// 家庭相册
const previewPhoto = (id) => {
  uni.showToast({ title: `预览照片 ${id}`, icon: 'none' });
};
const showAlbumUpload = () => {
  uni.showToast({ title: '上传照片功能待开发', icon: 'none' });
};

// 今日任务
const publishTask = () => {
  uni.showToast({ title: '发布新任务功能待开发', icon: 'none' });
};
const viewTaskDetail = (id) => {
  const taskNames = ['晨间散步', '喝水8杯', '阅读养生文章'];
  uni.showToast({ title: `查看【${taskNames[id-1]}】任务详情`, icon: 'none' });
};

// 每日问候
const sendGreeting = () => {
  greetingSent.value = true;
  setTimeout(() => {
    greetingSent.value = false;
  }, 2000);
};

// 亲情留言
const showLeaveMessage = () => {
  uni.showToast({ title: '亲情留言功能待开发', icon: 'none' });
};

// 社区活动
const showMoreActivity = () => {
  uni.showToast({ title: '更多社区活动待开发', icon: 'none' });
};
const showActivityDetail = () => {
  uni.showToast({ title: '社区活动详情待开发', icon: 'none' });
};

// 空函数
const noop = () => {};
</script>

<style scoped>
/* 基础样式 - 核心修复右侧溢出 */
.page-interact {
  width: 100%;
  min-height: 100vh;
  background-color: #f8fafc;
  display: flex;
  flex-direction: column;
  box-sizing: border-box; /* 核心：防止溢出 */
  padding: 0;
  margin: 0;
  position: relative;
}

/* 状态栏占位 - 和device页面一致 */
.status-bar-placeholder {
  height: var(--status-bar-height);
  width: 100%;
  background: linear-gradient(135deg, #3b82f6 0%, #4f46e5 100%);
  flex-shrink: 0;
}

/* 顶部导航 - 统一device页面样式 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx 24rpx;
  background: linear-gradient(135deg, #3b82f6 0%, #4f46e5 100%);
  color: #fff;
  transition: all 0.3s ease;
  width: 100%;
  box-sizing: border-box; /* 核心：防止溢出 */
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

/* 内容滚动区 - 核心修复溢出 */
.content-scroll {
  overflow-y: auto;
  padding: 20rpx 16rpx 20rpx 16rpx;
  -webkit-overflow-scrolling: touch;
  width: 100%;
  box-sizing: border-box; /* 核心：防止溢出 */
  flex: none; /* 禁用flex，用动态高度 */
  background-color: #f8fafc;
}
.content-scroll::-webkit-scrollbar {
  display: none;
}

/* 快捷联系卡片 */
.contact-card {
  background: linear-gradient(135deg, #ec4899 0%, #be185d 100%);
  border-radius: 32rpx;
  padding: 28rpx 20rpx;
  color: #fff;
  margin-bottom: 28rpx;
  transition: all 0.2s ease;
  width: 100%;
  box-sizing: border-box; /* 核心：防止溢出 */
}
.contact-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24rpx;
}
.contact-subtitle {
  font-size: 24rpx;
  color: #fce7f3;
  display: block;
  margin-bottom: 4rpx;
}
.contact-name {
  font-size: 36rpx;
  font-weight: bold;
}
.avatar {
  width: 80rpx;
  height: 80rpx;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(255, 255, 255, 0.3);
}
.avatar-text {
  font-size: 32rpx;
  font-weight: bold;
}
.contact-btns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16rpx;
}
.contact-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 24rpx;
  padding: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
}
.btn-icon {
  font-size: 28rpx;
}
.btn-text {
  font-size: 24rpx;
  font-weight: 500;
}

/* 紧急通知栏（老人摔倒） */
.emergency-bar {
  background: linear-gradient(90deg, #ef4444 0%, #f97316 100%);
  border-radius: 32rpx;
  padding: 28rpx 24rpx;
  color: #fff;
  margin-bottom: 28rpx;
  width: 100%;
  box-sizing: border-box; /* 核心：防止溢出 */
  position: relative; /* 修复时间标签定位 */
}
.emergency-left {
  display: flex;
  align-items: center;
  gap: 16rpx;
  margin-bottom: 16rpx;
}
.emergency-icon {
  font-size: 36rpx;
}
.emergency-title {
  font-size: 28rpx;
  font-weight: 600;
  display: block;
}
.emergency-desc {
  font-size: 24rpx;
  opacity: 0.9;
  display: block;
}
.emergency-time {
  font-size: 20rpx;
  background: rgba(255, 255, 255, 0.2);
  padding: 4rpx 12rpx;
  border-radius: 12rpx;
  position: absolute;
  right: 24rpx;
  top: 28rpx;
}
.confirm-btn {
  align-self: flex-end;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 20rpx;
  padding: 8rpx 20rpx;
  color: #fff;
  font-size: 22rpx;
  margin-top: 8rpx;
}

/* 相册模块 */
.album-card {
  background: #fff;
  border-radius: 32rpx;
  padding: 28rpx 20rpx;
  margin-bottom: 28rpx;
  border: 1px solid #f1f5f9;
  width: 100%;
  box-sizing: border-box; /* 核心：防止溢出 */
}
.album-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}
.album-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #334155;
}
.album-upload {
  background: none;
  border: none;
  font-size: 22rpx;
  color: #3b82f6;
  font-weight: 500;
}
.album-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx;
}
.album-item {
  aspect-ratio: 1/1;
  border-radius: 20rpx;
  overflow: hidden;
  background-color: #f1f5f9;
}
.photo-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #bfdbfe 0%, #93c5fd 100%);
}
.photo-icon {
  font-size: 48rpx;
  color: #fff;
}
.album-add {
  aspect-ratio: 1/1;
  border-radius: 20rpx;
  background-color: #eff6ff;
  display: flex;
  align-items: center;
  justify-content: center;
}
.add-icon {
  font-size: 48rpx;
  color: #3b82f6;
}

/* 任务模块 */
.task-card {
  background: #fff;
  border-radius: 32rpx;
  padding: 28rpx 20rpx;
  margin-bottom: 28rpx;
  border: 1px solid #f1f5f9;
  width: 100%;
  box-sizing: border-box; /* 核心：防止溢出 */
}
.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}
.task-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #334155;
}
.task-publish {
  background: none;
  border: none;
  font-size: 22rpx;
  color: #3b82f6;
  font-weight: 500;
}
.task-list {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}
.task-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx;
  border-radius: 20rpx;
}
.task-item:nth-child(1) {
  background-color: #f0fdf4;
}
.task-item:nth-child(2) {
  background-color: #eff6ff;
}
.task-item:nth-child(3) {
  background-color: #faf5ff;
}
.task-left {
  display: flex;
  align-items: center;
  gap: 16rpx;
}
.task-icon {
  width: 56rpx;
  height: 56rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  color: #fff;
}
.task-icon.completed {
  background-color: #22c55e;
}
.task-icon.ongoing {
  background-color: #93c5fd;
  color: #3b82f6;
}
.task-icon.pending {
  background-color: #ddd6fe;
  color: #8b5cf6;
}
.task-info {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}
.task-name {
  font-size: 26rpx;
  font-weight: 600;
  color: #334155;
}
.task-status {
  font-size: 20rpx;
  color: #64748b;
}
.task-reward {
  font-size: 32rpx;
}
.progress-bar {
  width: 120rpx;
  height: 16rpx;
  background-color: #e2e8f0;
  border-radius: 8rpx;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background-color: #3b82f6;
  transition: width 0.5s ease;
}

/* 问候模块 */
.greeting-card {
  background: #fff;
  border-radius: 32rpx;
  padding: 28rpx 20rpx;
  margin-bottom: 28rpx;
  border: 1px solid #f1f5f9;
  width: 100%;
  box-sizing: border-box; /* 核心：防止溢出 */
}
.greeting-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #334155;
  display: block;
  margin-bottom: 24rpx;
}
.greeting-content {
  display: flex;
  align-items: flex-start;
  gap: 16rpx;
  padding: 20rpx;
  background-color: #fffbeb;
  border-radius: 20rpx;
  border: 1px solid #fef3c7;
}
.greeting-icon {
  font-size: 48rpx;
  margin-top: 4rpx;
}
.greeting-text {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}
.greeting-main {
  font-size: 26rpx;
  font-weight: 600;
  color: #334155;
}
.greeting-desc {
  font-size: 22rpx;
  color: #64748b;
}
.send-btn {
  background: none;
  border: none;
  font-size: 22rpx;
  color: #f97316;
  font-weight: 500;
  margin-top: 8rpx;
}
.send-status {
  font-size: 20rpx;
  color: #22c55e;
  margin-top: 4rpx;
}

/* 留言模块 */
.message-card {
  background: #fff;
  border-radius: 32rpx;
  padding: 28rpx 20rpx;
  margin-bottom: 28rpx;
  border: 1px solid #f1f5f9;
  width: 100%;
  box-sizing: border-box; /* 核心：防止溢出 */
}
.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}
.message-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #334155;
}
.message-leave {
  background: none;
  border: none;
  font-size: 22rpx;
  color: #3b82f6;
  font-weight: 500;
}
.message-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.message-item {
  padding: 20rpx;
  border-radius: 20rpx;
}
.message-item.from-daughter {
  background-color: #eff6ff;
}
.message-item.from-grandma {
  background-color: #f0fdf4;
}
.msg-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8rpx;
}
.sender {
  font-size: 22rpx;
  font-weight: 600;
  color: #334155;
}
.read-status {
  font-size: 20rpx;
  color: #94a3b8;
}
.message-content {
  font-size: 24rpx;
  color: #475569;
  line-height: 1.5;
}

/* 社区活动模块 */
.activity-card {
  background: #fff;
  border-radius: 32rpx;
  padding: 28rpx 20rpx;
  border: 1px solid #f1f5f9;
  width: 100%;
  box-sizing: border-box; /* 核心：防止溢出 */
}
.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}
.activity-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #334155;
}
.activity-more {
  background: none;
  border: none;
  font-size: 22rpx;
  color: #3b82f6;
  font-weight: 500;
}
.activity-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 16rpx;
  padding: 20rpx;
  background-color: #f8fafc;
  border-radius: 20rpx;
}
.activity-icon {
  width: 70rpx;
  height: 70rpx;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  flex-shrink: 0;
}
.activity-item:nth-child(1) .activity-icon {
  background-color: #f3e8ff;
  color: #8b5cf6;
}
.activity-item:nth-child(2) .activity-icon {
  background-color: #dcfce7;
  color: #22c55e;
}
.activity-info {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  flex: 1;
}
.activity-name {
  font-size: 26rpx;
  font-weight: 600;
  color: #334155;
}
.activity-desc {
  font-size: 22rpx;
  color: #64748b;
}
.join-btn {
  align-self: flex-start;
  background-color: #f3e8ff;
  color: #8b5cf6;
  border: none;
  border-radius: 20rpx;
  padding: 8rpx 20rpx;
  font-size: 22rpx;
  margin-top: 4rpx;
}
.activity-item:nth-child(2) .join-btn {
  background-color: #dcfce7;
  color: #22c55e;
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