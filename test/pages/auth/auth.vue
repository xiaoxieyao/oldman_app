<template>
  <view class="page-auth">
    <!-- 动态状态栏占位 -->
    <view class="status-bar"></view>
    
    <!-- 登录头部（优化渐变+圆角） -->
    <view class="login-header">
      <view class="avatar-box">
        <text class="avatar-icon">👴</text>
      </view>
      <text class="app-title">老年伴侣</text>
      <text class="app-subtitle">守护每一个温暖时光</text>
      <view class="tab-box">
        <button class="tab-btn active" @click="switchAuthTab('login')">登录</button>
      </view>
    </view>
    
    <!-- 登录表单（优化间距+层级） -->
    <view class="form-container">
      <view class="input-group">
        <!-- 手机号输入框（修复可输入+美化） -->
        <view class="input-wrapper">
          <text class="input-icon">📱</text>
          <input 
            type="text" 
            placeholder="请输入手机号" 
            class="form-input"
            v-model="phoneNumber"
            maxlength="11"
            focus="true"
            @click="focusInput"
          />
        </view>
        <!-- 密码输入框（修复可输入+美化） -->
        <view class="input-wrapper">
          <text class="input-icon">🔒</text>
          <input 
            type="password" 
            placeholder="请输入密码" 
            class="form-input"
            v-model="password"
            @click="focusInput"
          />
        </view>
      </view>
      
      <view class="form-footer">
        <label class="remember-box">
          <!-- 美化复选框 -->
          <checkbox 
            class="checkbox" 
            color="#2563eb" 
            :checked="rememberPwd"
            @change="handleCheckboxChange"
          />
          <text class="remember-text">记住密码</text>
        </label>
        <navigator url="/pages/forgetPwd/forgetPwd" class="forget-text">忘记密码？</navigator>
      </view>
      
      <!-- 登录按钮（美化+点击反馈） -->
      <button 
        class="login-btn"
        @click="login"
        :disabled="isLoading"
      >
        <text v-if="!isLoading">登录</text>
        <text v-else>登录中...</text>
      </button>
    </view>
    
    <!-- 版权信息（优化位置） -->
    <view class="copyright">
      <text>© 2025 老年伴侣 版权所有</text>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// 响应式数据
const phoneNumber = ref('');
const password = ref('');
const rememberPwd = ref(false);
const isLoading = ref(false);

// 修复输入框聚焦问题
const focusInput = () => {
  // 强制触发输入框聚焦
  uni.pageScrollTo({ scrollTop: 0 });
};

// 复选框事件处理
const handleCheckboxChange = (e) => {
  rememberPwd.value = e.detail.value;
};

// 切换标签（预留）
const switchAuthTab = (type) => {};

// 登录核心函数
const login = () => {
  // 1. 基础校验
  if (!phoneNumber.value) {
    uni.showToast({ title: '请输入手机号', icon: 'none' });
    return;
  }
  if (!/^1[3-9]\d{9}$/.test(phoneNumber.value)) {
    uni.showToast({ title: '手机号格式错误', icon: 'none' });
    return;
  }
  if (!password.value || password.value.length < 6) {
    uni.showToast({ title: '密码不能少于6位', icon: 'none' });
    return;
  }

  // 2. 模拟登录加载
  isLoading.value = true;
  
  // 3. 模拟接口请求（实际项目替换为真实接口）
  setTimeout(() => {
    isLoading.value = false;
    
    // 4. 登录成功：保存登录状态
    uni.setStorageSync('isLogin', true); // 标记已登录
    if (rememberPwd.value) {
      // 记住密码：保存账号密码
      uni.setStorageSync('savedPhone', phoneNumber.value);
      uni.setStorageSync('savedPwd', password.value);
    } else {
      // 不记住密码：清除缓存
      uni.removeStorageSync('savedPhone');
      uni.removeStorageSync('savedPwd');
    }

    // 5. 关键：跳转到tabBar首页（使用switchTab，适配tabBar页面）
    uni.switchTab({
      url: '/pages/device/device',
      fail: (err) => {
        // 兼容处理：如果switchTab失败，用reLaunch兜底
        uni.reLaunch({ url: '/pages/device/device' });
        console.log('跳转首页失败', err);
      }
    });

    // 登录成功提示
    uni.showToast({ title: '登录成功', icon: 'success' });
  }, 1500);
};

// 页面加载时自动填充记住的密码
uni.getStorage({
  key: 'savedPhone',
  success: (res) => {
    phoneNumber.value = res.data;
    rememberPwd.value = true;
    // 填充密码
    uni.getStorage({
      key: 'savedPwd',
      success: (res) => {
        password.value = res.data;
      }
    });
  }
});

// 页面挂载后读取存储
onMounted(() => {
  // 读取手机号
  const savedPhone = uni.getStorageSync('savedPhone');
  if (savedPhone) phoneNumber.value = savedPhone;
  
  // 读取密码
  const savedPwd = uni.getStorageSync('savedPwd');
  if (savedPwd) {
    password.value = savedPwd;
    rememberPwd.value = true;
  }
});
</script>

<style scoped>
/* 核心：页面容器 */
.page-auth {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f8fafc;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

/* 动态状态栏 */
.status-bar {
  height: var(--status-bar-height);
  width: 100%;
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
}

/* 登录头部（优化渐变+圆角） */
.login-header {
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  padding: 60rpx 40rpx 80rpx;
  border-bottom-left-radius: 80rpx;
  border-bottom-right-radius: 80rpx;
  text-align: center;
  box-shadow: 0 10rpx 40rpx rgba(30, 64, 175, 0.15);
}

.avatar-box {
  width: 140rpx;
  height: 140rpx;
  background-color: #ffffff;
  border-radius: 70rpx; /* 圆形头像 */
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 30rpx;
  box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.1);
}

.avatar-icon {
  font-size: 80rpx;
}

.app-title {
  font-size: 36rpx;
  font-weight: 700;
  color: #ffffff;
  display: block;
  margin-bottom: 10rpx;
  letter-spacing: 2rpx;
}

.app-subtitle {
  font-size: 22rpx;
  color: #dbeafe;
  display: block;
  margin-bottom: 50rpx;
  opacity: 0.9;
}

/* 登录标签 */
.tab-box {
  display: flex;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 60rpx;
  padding: 6rpx;
  backdrop-filter: blur(10rpx);
  border: 1px solid rgba(255, 255, 255, 0.2);
  width: 60%;
  margin: 0 auto;
}

.tab-btn {
  flex: 1;
  padding: 20rpx 0;
  text-align: center;
  font-size: 28rpx;
  font-weight: 600;
  color: #ffffff;
  border-radius: 50rpx;
  background: transparent;
  border: none;
}

.tab-btn.active {
  background-color: #ffffff;
  color: #2563eb;
  box-shadow: 0 4rpx 20rpx rgba(37, 99, 235, 0.2);
}

/* 表单容器（优化间距） */
.form-container {
  flex: 1;
  padding: 60rpx 40rpx 40rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* 输入框容器（美化+修复层级） */
.input-group {
  display: flex;
  flex-direction: column;
  gap: 25rpx;
  margin-bottom: 40rpx;
}

.input-wrapper {
  display: flex;
  align-items: center;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 60rpx;
  padding: 0 30rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  z-index: 999; /* 确保输入框在最上层 */
  pointer-events: auto; /* 修复无法点击 */
}

.input-wrapper:focus-within {
  border-color: #2563eb;
  box-shadow: 0 6rpx 30rpx rgba(37, 99, 235, 0.15);
  transform: translateY(-2rpx);
}

.input-icon {
  font-size: 32rpx;
  margin-right: 20rpx;
  color: #94a3b8;
}

/* 输入框样式（修复可输入） */
.form-input {
  flex: 1;
  height: 90rpx;
  background-color: transparent;
  border: none;
  font-size: 28rpx;
  color: #1e293b;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  outline: none; /* 去除默认聚焦边框 */
  pointer-events: auto; /* 强制允许点击 */
}

.form-input::placeholder {
  color: #94a3b8;
  font-size: 26rpx;
}

/* 表单底部（优化间距） */
.form-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 50rpx;
  font-size: 24rpx;
  padding: 0 10rpx;
}

.remember-box {
  display: flex;
  align-items: center;
  color: #475569;
}

.checkbox {
  margin-right: 10rpx;
  transform: scale(1.4); /* 放大复选框，便于老年用户点击 */
}

.remember-text {
  font-size: 24rpx;
}

.forget-text {
  color: #2563eb;
  font-size: 24rpx;
  text-decoration: none;
}

.forget-text:active {
  color: #1e40af;
}

/* 登录按钮（美化+点击反馈） */
.login-btn {
  width: 100%;
  height: 100rpx;
  line-height: 100rpx;
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  color: #ffffff;
  font-size: 32rpx;
  font-weight: 600;
  border-radius: 60rpx;
  border: none;
  box-shadow: 0 8rpx 30rpx rgba(37, 99, 235, 0.25);
  transition: all 0.3s ease;
  letter-spacing: 2rpx;
}

.login-btn:disabled {
  background: linear-gradient(135deg, #93c5fd 0%, #60a5fa 100%);
  box-shadow: none;
  opacity: 0.8;
}

.login-btn:active:not(:disabled) {
  transform: scale(0.98);
  box-shadow: 0 4rpx 20rpx rgba(37, 99, 235, 0.2);
}

/* 版权信息（优化样式） */
.copyright {
  text-align: center;
  padding-bottom: 60rpx;
  font-size: 22rpx;
  color: #94a3b8;
  letter-spacing: 1rpx;
}

/* 隐藏滚动条 */
::-webkit-scrollbar {
  display: none;
}
</style>