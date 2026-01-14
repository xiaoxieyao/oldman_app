<template>
  <view class="page-mine">
    <!-- 状态栏占位（适配手机顶部状态栏） -->
    <view class="status-bar-placeholder"></view>
    
    <!-- 页面内容区 -->
    <scroll-view 
      class="content-scroll" 
      scroll-y 
      @scroll="onScroll"
      scroll-with-animation
    >
      <!-- 个人信息卡片 -->
      <view class="user-info-card" @click="editProfile">
        <view class="user-header">
          <view class="avatar-box">
            <text class="avatar-icon">👤</text>
            <view class="avatar-edit" @click.stop="changeAvatar">
              <text class="edit-icon">✏️</text>
            </view>
          </view>
          <view class="user-info">
            <text class="user-name">{{ userName }}</text>
            <text class="user-id">ID: {{ userId }}</text>
            <text class="user-status" :class="onlineStatus ? 'online' : 'offline'">
              {{ onlineStatus ? '在线' : '离线' }}
            </text>
          </view>
          <view class="arrow-icon">→</view>
        </view>
        <view class="user-stat-grid">
          <view class="stat-item" @click="gotoHealthRecords">
            <text class="stat-value">{{ healthRecordCount }}</text>
            <text class="stat-label">健康记录</text>
          </view>
          <view class="stat-item" @click="gotoInteractionRecords">
            <text class="stat-value">{{ interactionCount }}</text>
            <text class="stat-label">互动次数</text>
          </view>
          <view class="stat-item" @click="gotoContact">
            <text class="stat-value">{{ contactCount }}</text>
            <text class="stat-label">紧急联系人</text>
          </view>
        </view>
      </view>

      <!-- 功能菜单 -->
      <view class="menu-card">
        <view class="menu-list">
          <button class="menu-item" @click="gotoProfile">
            <view class="item-left">
              <view class="item-icon blue">
                <text class="icon-text">👤</text>
              </view>
              <text class="item-text">个人资料</text>
            </view>
            <text class="arrow-icon">→</text>
          </button>
          <button class="menu-item" @click="gotoContact">
            <view class="item-left">
              <view class="item-icon green">
                <text class="icon-text">👥</text>
              </view>
              <text class="item-text">紧急联系人</text>
              <text class="badge" v-if="contactCount < 3">+{{ 3 - contactCount }}</text>
            </view>
            <text class="arrow-icon">→</text>
          </button>
          <button class="menu-item" @click="gotoSetting">
            <view class="item-left">
              <view class="item-icon purple">
                <text class="icon-text">⚙️</text>
              </view>
              <text class="item-text">系统设置</text>
            </view>
            <text class="arrow-icon">→</text>
          </button>
        </view>
      </view>

      <!-- 服务中心 -->
      <view class="service-card">
        <text class="card-title">服务中心</text>
        <view class="service-list">
          <button class="menu-item" @click="showHelp">
            <view class="item-left">
              <view class="item-icon amber">
                <text class="icon-text">❓</text>
              </view>
              <text class="item-text">使用帮助</text>
            </view>
            <text class="arrow-icon">→</text>
          </button>
          <button class="menu-item" @click="showFeedback">
            <view class="item-left">
              <view class="item-icon red">
                <text class="icon-text">💬</text>
              </view>
              <text class="item-text">意见反馈</text>
            </view>
            <text class="arrow-icon">→</text>
          </button>
          <button class="menu-item" @click="showAbout">
            <view class="item-left">
              <view class="item-icon indigo">
                <text class="icon-text">ℹ️</text>
              </view>
              <text class="item-text">关于我们</text>
            </view>
            <text class="arrow-icon">→</text>
          </button>
        </view>
      </view>

      <!-- 版本更新提示 -->
      <view class="update-card" v-if="hasNewVersion" @click="checkUpdate">
        <view class="update-left">
          <text class="update-title">发现新版本</text>
          <text class="update-desc">v{{ newVersion }} · 优化体验，修复问题</text>
        </view>
        <button class="update-btn">立即更新</button>
      </view>

      <!-- 退出登录 -->
      <button class="logout-btn" @click="logout">
        退出登录
      </button>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, onLoad, onShow } from 'vue';

// 1. 响应式数据（核心状态管理）
const userName = ref('王大爷'); // 用户名
const userId = ref('LA889900'); // 用户ID
const onlineStatus = ref(true); // 在线状态
const healthRecordCount = ref(32); // 健康记录数
const interactionCount = ref(18); // 互动次数
const contactCount = ref(2); // 紧急联系人数量
const hasNewVersion = ref(true); // 是否有新版本
const newVersion = ref('1.0.1'); // 新版本号

// 2. 页面生命周期
onLoad(() => {
  console.log('我的页面已加载');
  // 检查用户信息和版本更新
  checkUserInfo();
  checkVersionUpdate();
});

onShow(() => {
  // 每次页面显示时更新用户状态
  updateUserStatus();
});

// 3. 核心方法
// 检查用户信息
const checkUserInfo = () => {
  // 从本地缓存获取用户信息
  const userInfo = uni.getStorageSync('userInfo');
  if (userInfo) {
    userName.value = userInfo.name || userName.value;
    userId.value = userInfo.id || userId.value;
  }
  
  // 模拟获取统计数据
  setTimeout(() => {
    healthRecordCount.value = Math.floor(Math.random() * 50) + 10;
    interactionCount.value = Math.floor(Math.random() * 30) + 5;
  }, 500);
};

// 更新用户状态
const updateUserStatus = () => {
  // 模拟在线状态检测
  onlineStatus.value = Math.random() > 0.1; // 90%概率在线
};

// 检查版本更新
const checkVersionUpdate = () => {
  // 模拟版本检查
  // 实际项目中可调用后端接口获取最新版本信息
  hasNewVersion.value = true;
};

// 编辑个人资料（点击头像区域）
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

// 更换头像
const changeAvatar = () => {
  uni.showActionSheet({
    itemList: ['从相册选择', '拍照'],
    title: '更换头像',
    success: (res) => {
      if (res.tapIndex === 0) {
        // 从相册选择
        uni.chooseImage({
          count: 1,
          sizeType: ['compressed'],
          sourceType: ['album'],
          success: () => {
            uni.showToast({
              title: '头像更换成功',
              icon: 'success'
            });
          }
        });
      } else if (res.tapIndex === 1) {
        // 拍照
        uni.chooseImage({
          count: 1,
          sizeType: ['compressed'],
          sourceType: ['camera'],
          success: () => {
            uni.showToast({
              title: '头像更换成功',
              icon: 'success'
            });
          }
        });
      }
    }
  });
};

// 跳转到个人资料
const gotoProfile = () => {
  editProfile();
};

// 跳转到紧急联系人
const gotoContact = () => {
  uni.navigateTo({
    url: '/pages/contact/contact',
    fail: () => {
      uni.showToast({
        title: '紧急联系人页开发中',
        icon: 'none',
        duration: 1500
      });
    }
  });
};

// 跳转到设置
const gotoSetting = () => {
  uni.navigateTo({
    url: '/pages/setting/setting',
    fail: () => {
      uni.showToast({
        title: '设置页开发中',
        icon: 'none',
        duration: 1500
      });
    }
  });
};

// 跳转到健康记录
const gotoHealthRecords = () => {
  uni.navigateTo({
    url: '/pages/health/health',
    fail: () => {
      uni.showToast({
        title: '健康记录页开发中',
        icon: 'none'
      });
    }
  });
};

// 跳转到互动记录
const gotoInteractionRecords = () => {
  uni.navigateTo({
    url: '/pages/interact/interact',
    fail: () => {
      uni.showToast({
        title: '互动记录页开发中',
        icon: 'none'
      });
    }
  });
};

// 显示帮助
const showHelp = () => {
  uni.navigateTo({
    url: '/pages/help/help',
    fail: () => {
      uni.showToast({
        title: '使用帮助加载中',
        icon: 'none',
        duration: 1500
      });
    }
  });
};

// 显示反馈
const showFeedback = () => {
  uni.navigateTo({
    url: '/pages/feedback/feedback',
    fail: () => {
      uni.showToast({
        title: '意见反馈页开发中',
        icon: 'none',
        duration: 1500
      });
    }
  });
};

// 显示关于
const showAbout = () => {
  uni.showModal({
    title: '关于老年伴侣',
    content: `版本号：v1.0.0\n© 2025 老年伴侣 版权所有\n\n当前登录用户：${userName.value}`,
    showCancel: false,
    confirmText: '确定'
  });
};

// 检查更新
const checkUpdate = () => {
  uni.showModal({
    title: '版本更新',
    content: `是否更新到 v${newVersion.value}？\n\n更新内容：\n1. 优化健康数据展示\n2. 修复已知问题\n3. 提升页面加载速度`,
    confirmText: '立即更新',
    cancelText: '稍后更新',
    success: (res) => {
      if (res.confirm) {
        uni.showToast({
          title: '正在下载更新包...',
          icon: 'none'
        });
        
        // 模拟更新进度
        setTimeout(() => {
          uni.showToast({
            title: '更新完成，重启应用生效',
            icon: 'success'
          });
        }, 3000);
      }
    }
  });
};

// 退出登录
const logout = () => {
  uni.showModal({
    title: '退出登录',
    content: '确定要退出当前账号吗？退出后将无法查看健康数据和互动信息。',
    confirmText: '退出',
    cancelText: '取消',
    success: (res) => {
      if (res.confirm) {
        // 清除登录状态和用户信息
        uni.removeStorageSync('hasLogin');
        uni.removeStorageSync('userInfo');
        
        // 跳转到登录页（兼容tabBar和普通页面）
        uni.switchTab({
          url: '/pages/auth/auth',
          fail: () => {
            uni.redirectTo({
              url: '/pages/auth/auth'
            });
          }
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
  // 可添加滚动相关逻辑，如导航栏样式变化
  // console.log('滚动位置：', e.detail.scrollTop);
};
</script>

<style scoped>
/* 根容器：铺满屏幕 */
.page-mine {
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

/* 个人信息卡片 */
.user-info-card {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  border-radius: 32rpx;
  padding: 24rpx 20rpx;
  color: #fff;
  box-shadow: 0 8rpx 24rpx rgba(79, 70, 229, 0.2);
  margin-bottom: 20rpx;
}
/* 用户头部信息 */
.user-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
}
.avatar-box {
  width: 80rpx;
  height: 80rpx;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
  margin-right: 16rpx;
}
.avatar-edit {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 24rpx;
  height: 24rpx;
  background-color: #3b82f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2rpx solid #fff;
}
.edit-icon {
  font-size: 12rpx;
  color: #fff;
}
.avatar-icon {
  font-size: 40rpx;
  color: #fff;
}
.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.user-name {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 4rpx;
}
.user-id {
  font-size: 20rpx;
  color: #e0e7ff;
  margin-bottom: 4rpx;
}
.user-status {
  font-size: 18rpx;
  padding: 2rpx 8rpx;
  border-radius: 8rpx;
}
.user-status.online {
  background-color: rgba(74, 222, 128, 0.3);
  color: #bbf7d0;
}
.user-status.offline {
  background-color: rgba(156, 163, 175, 0.3);
  color: #e5e7eb;
}
/* 用户统计网格 */
.user-stat-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx;
}
.stat-item {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12rpx);
  border-radius: 24rpx;
  padding: 16rpx 12rpx;
  border: 1px solid rgba(255, 255, 255, 0.2);
  text-align: center;
}
.stat-item:active {
  background: rgba(255, 255, 255, 0.15);
}
.stat-value {
  font-size: 32rpx;
  font-weight: bold;
  line-height: 1.2;
}
.stat-label {
  font-size: 20rpx;
  color: #e0e7ff;
  display: block;
  margin-top: 4rpx;
}

/* 功能菜单卡片 */
.menu-card {
  background: #fff;
  border-radius: 32rpx;
  padding: 20rpx 16rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
  margin-bottom: 20rpx;
}
.menu-list {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}
.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 16rpx 12rpx;
  border-radius: 20rpx;
  background: transparent;
  border: none;
  position: relative;
}
.menu-item:active {
  background-color: #f8fafc;
}
.item-left {
  display: flex;
  align-items: center;
  gap: 12rpx;
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
  background-color: #eff6ff;
}
.item-icon.green {
  background-color: #f0fdf4;
}
.item-icon.purple {
  background-color: #faf5ff;
}
.item-icon.amber {
  background-color: #fffbeb;
}
.item-icon.red {
  background-color: #fef2f2;
}
.item-icon.indigo {
  background-color: #eef2ff;
}
.icon-text {
  font-size: 24rpx;
}
.item-icon.blue .icon-text {
  color: #2563eb;
}
.item-icon.green .icon-text {
  color: #16a34a;
}
.item-icon.purple .icon-text {
  color: #9333ea;
}
.item-icon.amber .icon-text {
  color: #d97706;
}
.item-icon.red .icon-text {
  color: #dc2626;
}
.item-icon.indigo .icon-text {
  color: #4f46e5;
}
.item-text {
  font-size: 28rpx;
  font-weight: 500;
  color: #1e293b;
}
.badge {
  position: absolute;
  right: 60rpx;
  top: 50%;
  transform: translateY(-50%);
  background-color: #ef4444;
  color: #fff;
  font-size: 18rpx;
  padding: 2rpx 8rpx;
  border-radius: 10rpx;
}
.arrow-icon {
  font-size: 24rpx;
  color: #94a3b8;
}

/* 服务中心卡片 */
.service-card {
  background: #fff;
  border-radius: 32rpx;
  padding: 20rpx 16rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
  margin-bottom: 20rpx;
}
.card-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #334155;
  display: block;
  margin-bottom: 16rpx;
}

/* 版本更新卡片 */
.update-card {
  background: #fff;
  border-radius: 32rpx;
  padding: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
  margin-bottom: 20rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.update-left {
  flex: 1;
}
.update-title {
  font-size: 24rpx;
  font-weight: 600;
  color: #334155;
  display: block;
  margin-bottom: 4rpx;
}
.update-desc {
  font-size: 20rpx;
  color: #64748b;
}
.update-btn {
  background-color: #3b82f6;
  color: #fff;
  border-radius: 20rpx;
  padding: 8rpx 16rpx;
  border: none;
  font-size: 20rpx;
}

/* 退出登录按钮 */
.logout-btn {
  width: 100%;
  background-color: #fef2f2;
  color: #dc2626;
  font-weight: 500;
  padding: 24rpx 0;
  border-radius: 32rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
  border: 1px solid #fee2e2;
  font-size: 28rpx;
}
.logout-btn:active {
  background-color: #fee2e2;
}
</style>