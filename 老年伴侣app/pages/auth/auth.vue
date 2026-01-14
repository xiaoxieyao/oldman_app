<template>
  <!-- 移除tailwind类名，改用自定义类名，避免冲突 -->
  <view class="page-auth">
    <!-- 动态状态栏占位（适配所有设备） -->
    <view class="status-bar-placeholder"></view>
    
    <!-- 登录头部 -->
    <view class="login-container">
      <view class="login-header">
        <view class="avatar-box">
          <text class="avatar-icon">👴</text>
        </view>
        <text class="app-title">老年伴侣</text>
        <text class="app-subtitle">守护每一个温暖时光</text>
      </view>
      <view class="tab-box">
        <button class="tab-btn active" @click="switchAuthTab('login')">登录</button>
      </view>
    </view>
    
    <!-- 登录表单 -->
    <view class="form-container">
      <view class="auth-form">
        <view class="input-group">
          <!-- 手机号输入框 -->
          <input 
            type="text" 
            placeholder="请输入手机号" 
            class="form-input"
            v-model="phoneNumber"
            maxlength="11"
          />
          <!-- 密码输入框 -->
          <input 
            type="password" 
            placeholder="请输入密码" 
            class="form-input"
            v-model="password"
          />
        </view>
        
        <view class="form-footer">
          <label class="remember-box">
            <checkbox class="checkbox" color="#3b82f6" v-model="rememberPwd" />
            <text class="remember-text">记住密码</text>
          </label>
          <navigator url="/pages/forgetPwd/forgetPwd" class="forget-text">忘记密码？</navigator>
        </view>
        
        <!-- 登录按钮 -->
        <button 
          class="login-btn"
          @click="login"
          :disabled="isLoading"
        >
          <text v-if="!isLoading">登录</text>
          <text v-else>登录中...</text>
        </button>
      </view>
    </view>
    
    <!-- 版权信息 -->
    <view class="copyright">
      <text>© 2025 老年伴侣</text>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// 1. 响应式数据
const phoneNumber = ref('');
const password = ref('');
const rememberPwd = ref(false);
const isLoading = ref(false);

// 2. 切换标签（预留）
const switchAuthTab = (type) => {};

// 3. 登录逻辑
const login = () => {
  // 表单校验
  if (!/^1[3-9]\d{9}$/.test(phoneNumber.value)) {
    uni.showToast({ title: '请输入正确的手机号', icon: 'none' });
    return;
  }
  if (password.value.length < 6) {
    uni.showToast({ title: '密码不能少于6位', icon: 'none' });
    return;
  }
  
  // 防重复点击
  if (isLoading.value) return;
  isLoading.value = true;
  
  // 模拟登录
  setTimeout(() => {
    // 记住密码
    if (rememberPwd.value) {
      uni.setStorageSync('savedPhone', phoneNumber.value);
      uni.setStorageSync('savedPwd', password.value);
    } else {
      uni.removeStorageSync('savedPhone');
      uni.removeStorageSync('savedPwd');
    }
    
    // 标记登录状态
    uni.setStorageSync('hasLogin', true);
    
    // 跳转首页（修复重复showToast问题）
    uni.showToast({ title: '登录成功', icon: 'success' });
    setTimeout(() => {
      uni.switchTab({ url: '/pages/device/device' });
    }, 1500);
    
    isLoading.value = false;
  }, 1000);
};

// 4. 页面挂载后读取存储（关键：避免渲染前修改数据）
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
/* 核心：页面容器适配所有设备，无溢出 */
.page-auth {
  width: 100%;
  height: 100vh; /* uni-app中page标签默认100vh，这里显式声明 */
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background-color: #f8fafc;
}

/* 动态状态栏占位（uni-app原生变量，适配所有设备） */
.status-bar-placeholder {
  height: var(--status-bar-height);
  width: 100%;
}

/* 登录头部渐变背景 */
.login-container {
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  padding: 60rpx 80rpx 80rpx;
  border-bottom-left-radius: 120rpx;
  border-bottom-right-radius: 120rpx;
}

.login-header {
  text-align: center;
  margin-bottom: 60rpx;
}

.avatar-box {
  width: 128rpx;
  height: 128rpx;
  background-color: #fff;
  border-radius: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 30rpx;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.1);
}

.avatar-icon {
  font-size: 80rpx;
}

.app-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #fff;
  display: block;
  margin-bottom: 10rpx;
}

.app-subtitle {
  font-size: 20rpx;
  color: #dbeafe;
}

/* 登录/注册标签 */
.tab-box {
  display: flex;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 20rpx;
  padding: 4rpx;
  backdrop-filter: blur(8rpx);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.tab-btn {
  flex: 1;
  padding: 25rpx 0;
  text-align: center;
  font-size: 28rpx;
  font-weight: 500;
  color: #fff;
  border-radius: 16rpx;
  background: transparent;
  border: none;
}

.tab-btn.active {
  background-color: #fff;
  color: #3b82f6;
  font-weight: 600;
}

/* 表单容器 */
.form-container {
  flex: 1; /* 占满剩余高度 */
  padding: 60rpx 80rpx 40rpx;
}

.auth-form {
  width: 100%;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 30rpx;
  margin-bottom: 50rpx;
}

.form-input {
  width: 100%;
  padding: 30rpx;
  background-color: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 20rpx;
  font-size: 28rpx;
  color: #1e293b;
  box-sizing: border-box;
  transition: all 0.2s ease;
}

.form-input::placeholder {
  color: #94a3b8;
}

.form-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 16rpx 48rpx rgba(59, 130, 246, 0.1);
  transform: translateY(-2rpx);
}

/* 表单底部（记住密码+忘记密码） */
.form-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 50rpx;
  font-size: 20rpx;
}

.remember-box {
  display: flex;
  align-items: center;
  color: #475569;
}

.checkbox {
  margin-right: 8rpx;
  transform: scale(1.2); /* 放大checkbox，便于点击 */
}

.remember-text {
  font-size: 20rpx;
}

.forget-text {
  color: #3b82f6;
}

/* 登录按钮 */
.login-btn {
  width: 100%;
  padding: 30rpx 0;
  background-color: #3b82f6;
  color: #fff;
  font-size: 28rpx;
  font-weight: 600;
  border-radius: 20rpx;
  border: none;
  box-shadow: 0 8rpx 24rpx rgba(59, 130, 246, 0.2);
  transition: all 0.2s ease;
}

.login-btn:disabled {
  background-color: #93c5fd;
  box-shadow: none;
}

/* 版权信息 */
.copyright {
  text-align: center;
  padding-bottom: 40rpx;
  font-size: 20rpx;
  color: #94a3b8;
}

/* 隐藏滚动条（全局） */
::-webkit-scrollbar {
  display: none;
}
</style>