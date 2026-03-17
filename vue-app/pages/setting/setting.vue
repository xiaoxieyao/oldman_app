<template>
  <view class="page-setting">
    <!-- 状态栏占位（和首页完全一致，渐变背景） -->
    <view class="status-bar-placeholder"></view>
    
    <!-- 顶部导航栏（复用首页渐变样式 + 滚动变化效果） -->
    <view class="page-header" :class="{ 'header-scroll': isScroll }">
      <text class="header-title">设置</text>
      <view class="header-placeholder"></view>
    </view>

    <!-- 内容滚动容器（和首页一致的动态高度 + 滚动监听） -->
    <scroll-view 
      class="content-scroll" 
      scroll-y 
      @scroll="onScroll"
      scroll-with-animation
      :style="{ height: scrollViewHeight + 'px' }"
    >
      <!-- 通用设置卡片（首页同款卡片样式：圆角/阴影/内边距） -->
      <view class="setting-card">
        <view class="setting-card-header">
          <text class="setting-card-subtitle">通用设置</text>
        </view>
        <view class="setting-list divide-y">
          <button class="setting-item" @click="gotoNoticeSetting" :class="{ 'item-active': isClick }">
            <view class="setting-item-left">
              <text class="setting-icon">🔔</text>
              <text class="setting-item-text">通知设置</text>
            </view>
            <text class="setting-arrow">▶</text>
          </button>
          <button class="setting-item" @click="gotoPrivacySetting" :class="{ 'item-active': isClick }">
            <view class="setting-item-left">
              <text class="setting-icon">🔒</text>
              <text class="setting-item-text">隐私设置</text>
            </view>
            <text class="setting-arrow">▶</text>
          </button>
          <button class="setting-item" @click="gotoLanguageSetting" :class="{ 'item-active': isClick }">
            <view class="setting-item-left">
              <text class="setting-icon">🌐</text>
              <text class="setting-item-text">语言</text>
            </view>
            <view class="setting-item-right">
              <text class="language-text">简体中文</text>
              <text class="setting-arrow">▶</text>
            </view>
          </button>
        </view>
      </view>

      <!-- 账号与安全卡片（新增，贴合养老项目需求，首页同款样式） -->
      <view class="setting-card">
        <view class="setting-card-header">
          <text class="setting-card-subtitle">账号与安全</text>
        </view>
        <view class="setting-list divide-y">
          <button class="setting-item" @click="gotoChangePwd" :class="{ 'item-active': isClick }">
            <view class="setting-item-left">
              <text class="setting-icon">🔑</text>
              <text class="setting-item-text">修改密码</text>
            </view>
            <text class="setting-arrow">▶</text>
          </button>
          <button class="setting-item" @click="gotoBindPhone" :class="{ 'item-active': isClick }">
            <view class="setting-item-left">
              <text class="setting-icon">📱</text>
              <text class="setting-item-text">绑定手机号</text>
            </view>
            <text class="setting-arrow">▶</text>
          </button>
          <button class="setting-item" @click="gotoEmergencyContact" :class="{ 'item-active': isClick }">
            <view class="setting-item-left">
              <text class="setting-icon">❤️</text>
              <text class="setting-item-text">紧急联系人</text>
            </view>
            <text class="setting-arrow">▶</text>
          </button>
        </view>
      </view>

      <!-- 关于卡片（首页同款样式，版本号项无点击） -->
      <view class="setting-card mb-20">
        <view class="setting-card-header">
          <text class="setting-card-subtitle">关于</text>
        </view>
        <view class="setting-list divide-y">
          <button class="setting-item" @click="gotoAboutUs" :class="{ 'item-active': isClick }">
            <view class="setting-item-left">
              <text class="setting-icon">ℹ️</text>
              <text class="setting-item-text">关于我们</text>
            </view>
            <text class="setting-arrow">▶</text>
          </button>
          <button class="setting-item" @click="gotoUserAgreement" :class="{ 'item-active': isClick }">
            <view class="setting-item-left">
              <text class="setting-icon">📄</text>
              <text class="setting-item-text">用户协议</text>
            </view>
            <text class="setting-arrow">▶</text>
          </button>
          <button class="setting-item" @click="gotoPrivacyPolicy" :class="{ 'item-active': isClick }">
            <view class="setting-item-left">
              <text class="setting-icon">📜</text>
              <text class="setting-item-text">隐私政策</text>
            </view>
            <text class="setting-arrow">▶</text>
          </button>
          <view class="setting-item no-click">
            <view class="setting-item-left">
              <text class="setting-icon">📱</text>
              <text class="setting-item-text">版本号</text>
            </view>
            <text class="version-text">v1.0.0</text>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 自定义tabBar（和首页一致，取消注释即可使用） -->
    <!-- <custom-tabbar /> -->
  </view>
</template>

<script setup>
// 导入Vue核心API（和首页一致的导入规范）
import { ref, onMounted, onUnmounted } from 'vue';

// 响应式数据（复用首页的滚动、点击、高度变量，命名一致）
const isScroll = ref(false);
const isClick = ref(false);
const scrollViewHeight = ref(0);

// 页面挂载时初始化（和首页一致的高度计算逻辑，适配自定义tabBar）
onMounted(() => {
  // 动态计算scroll-view高度（和首页完全相同的计算公式）
  try {
    const systemInfo = uni.getSystemInfoSync();
    const screenHeight = systemInfo.windowHeight;
    const statusBarH = systemInfo.statusBarHeight || 0;
    const navBarH = 88 / 2; // 导航栏88rpx转px，和首页一致
    const tabBarH = 100 / 2; // tabBar高度100rpx转px，和首页一致
    scrollViewHeight.value = screenHeight - statusBarH - navBarH - tabBarH;
  } catch (e) {
    scrollViewHeight.value = 500; // 异常降级，和首页一致
  }
});

// 页面卸载清理（和首页一致的生命周期规范）
onUnmounted(() => {});

// 滚动事件处理（和首页完全相同的滚动判断逻辑）
const onScroll = (e) => {
  isScroll.value = e.detail.scrollTop > 20;
};

// 通用点击动画函数（直接复用首页的点击动画，逻辑完全一致）
const handleFunctionClick = (callback) => {
  isClick.value = true;
  setTimeout(() => {
    isClick.value = false;
    callback();
  }, 100);
};

// 跳转函数（和首页一致的跳转规范：handleFunctionClick包裹 + uni.navigateTo + 失败降级提示）
// 通知设置
const gotoNoticeSetting = () => {
  handleFunctionClick(() => {
    uni.navigateTo({
      url: '/pages/setting/notice/notice',
      fail: (err) => {
        console.error('通知设置页跳转失败：', err);
        uni.showToast({
          title: `跳转失败：${err.errMsg || '页面不存在'}`,
          icon: 'none',
          duration: 3000
        });
      }
    });
  });
};

// 隐私设置
const gotoPrivacySetting = () => {
  handleFunctionClick(() => {
    uni.navigateTo({
      url: '/pages/setting/privacy/privacy',
      fail: (err) => {
        console.error('隐私设置页跳转失败：', err);
        uni.showToast({
          title: `跳转失败：${err.errMsg || '页面不存在'}`,
          icon: 'none',
          duration: 3000
        });
      }
    });
  });
};

// 语言设置
const gotoLanguageSetting = () => {
  handleFunctionClick(() => {
    uni.showToast({
      title: '语言设置页开发中',
      icon: 'none',
      duration: 2000
    });
  });
};

// 修改密码
const gotoChangePwd = () => {
  handleFunctionClick(() => {
    uni.showToast({
      title: '修改密码页开发中',
      icon: 'none',
      duration: 2000
    });
  });
};

// 绑定手机号
const gotoBindPhone = () => {
  handleFunctionClick(() => {
    uni.showToast({
      title: '绑定手机号页开发中',
      icon: 'none',
      duration: 2000
    });
  });
};

// 紧急联系人
const gotoEmergencyContact = () => {
  handleFunctionClick(() => {
    uni.showToast({
      title: '紧急联系人页开发中',
      icon: 'none',
      duration: 2000
    });
  });
};

// 关于我们
const gotoAboutUs = () => {
  handleFunctionClick(() => {
    uni.showToast({
      title: '关于我们页开发中',
      icon: 'none',
      duration: 2000
    });
  });
};

// 用户协议
const gotoUserAgreement = () => {
  handleFunctionClick(() => {
    uni.showToast({
      title: '用户协议页开发中',
      icon: 'none',
      duration: 2000
    });
  });
};

// 隐私政策
const gotoPrivacyPolicy = () => {
  handleFunctionClick(() => {
    uni.showToast({
      title: '隐私政策页开发中',
      icon: 'none',
      duration: 2000
    });
  });
};
</script>

<style scoped>
/* 基础样式 - 完全复用首页page-device的样式规范，仅修改类名 */
.page-setting {
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

/* 状态栏占位 - 和首页完全一致的样式、渐变背景 */
.status-bar-placeholder {
  height: var(--status-bar-height);
  width: 100%;
  background: linear-gradient(135deg, #3b82f6 0%, #4f46e5 100%);
  flex-shrink: 0;
}

/* 顶部导航栏 - 完全复用首页的导航样式，渐变背景+滚动变化 */
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
/* 导航栏滚动变化样式 - 和首页完全一致 */
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
.header-placeholder {
  width: 60rpx; /* 占位保持导航对称，和首页一致 */
}

/* 内容滚动区 - 完全复用首页的滚动容器样式，无差异 */
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

/* 设置卡片 - 复用首页健康/视频/位置卡片的样式：圆角32rpx、阴影、内边距、间距 */
.setting-card {
  background: #fff;
  border-radius: 32rpx;
  padding: 28rpx 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
  margin-bottom: 28rpx;
  width: 100%;
  box-sizing: border-box;
}
/* 卡片头部 - 参考首页健康卡片的子标题样式 */
.setting-card-header {
  margin-bottom: 24rpx;
}
.setting-card-subtitle {
  font-size: 28rpx;
  font-weight: 600;
  color: #334155;
  display: block;
}

/* 设置列表 - 分割线样式和首页一致 */
.setting-list {
  width: 100%;
}
.divide-y > view, .divide-y > button {
  border-bottom: 1rpx solid #f1f5f9;
}
.divide-y > view:last-child, .divide-y > button:last-child {
  border-bottom: none;
}

/* 设置项 - 复用首页快捷操作项的点击样式，布局和首页保持一致 */
.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx 0;
  width: 100%;
  box-sizing: border-box;
  background: transparent;
  border: none;
}
/* 禁止点击的项（版本号） */
.setting-item.no-click {
  pointer-events: none;
}
/* 点击激活样式 - 复用首页快捷操作的item-active，视觉一致 */
.setting-item.item-active {
  background-color: #eff6ff;
  border-radius: 16rpx;
}

/* 设置项左侧（图标+文字） - 布局和首页快捷操作项一致 */
.setting-item-left {
  display: flex;
  align-items: center;
  gap: 24rpx;
}
/* 设置图标 - 大小和颜色参考首页的图标规范 */
.setting-icon {
  font-size: 30rpx;
  color: #3b82f6;
  width: 30rpx;
  height: 30rpx;
  text-align: center;
}
/* 设置项文字 - 复用首页的文字大小、颜色规范 */
.setting-item-text {
  font-size: 28rpx;
  font-weight: 500;
  color: #334155;
}

/* 设置项右侧箭头 - 简约样式，和首页的箭头视觉统一 */
.setting-arrow {
  font-size: 24rpx;
  color: #94a3b8;
}
/* 语言项右侧 */
.setting-item-right {
  display: flex;
  align-items: center;
  gap: 12rpx;
}
.language-text {
  font-size: 26rpx;
  color: #94a3b8;
}
/* 版本号文字 - 颜色和大小和首页的辅助文字一致 */
.version-text {
  font-size: 26rpx;
  color: #94a3b8;
}

/* 通用样式 - 复用首页的mb-20，样式一致 */
.mb-20 {
  margin-bottom: 20rpx;
}

/* 全局按钮重置 - 完全复用首页的按钮重置样式，清除uni-app默认样式 */
button {
  padding: 0;
  margin: 0;
  line-height: 1;
}
button::after {
  border: none !important;
}
</style>