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
      <text>© 2026 老年伴侣 版权所有</text>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { loginApi } from '@/api/user';  // 导入真实登录接口

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

// 登录核心函数（改为真实 API 调用）
const login = async () => {
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

  isLoading.value = true;
  try {
    // 2. 调用真实登录 API
    const res = await loginApi({
      phone: phoneNumber.value,
      password: password.value
    });

    // 3. 处理登录响应
    if (res.success) {
      // 登录成功，保存 token、用户信息和登录状态
      uni.setStorageSync('token', res.data.token);
      uni.setStorageSync('userInfo', res.data);
      uni.setStorageSync('isLogin', true);

      // 4. 根据记住密码状态处理本地存储
      if (rememberPwd.value) {
        uni.setStorageSync('savedPhone', phoneNumber.value);
        uni.setStorageSync('savedPwd', password.value);
      } else {
        uni.removeStorageSync('savedPhone');
        uni.removeStorageSync('savedPwd');
      }

      // 5. 登录成功提示
      uni.showToast({ title: '登录成功', icon: 'success' });

      // 6. 跳转到首页（根据项目实际首页路径调整）
      uni.switchTab({
        url: '/pages/device/device',
        fail: (err) => {
          uni.reLaunch({ url: '/pages/device/device' });
          console.log('跳转失败', err);
        }
      });
    } else {
      // 登录失败，显示错误信息
      uni.showToast({ title: res.errorMsg || '登录失败', icon: 'none' });
      throw new Error(res.errorMsg || '登录失败');
    }
  } catch (error) {
    console.error('登录失败', error);
    // 显示后端返回的错误信息或默认提示
    uni.showToast({ title: error.message || '登录失败', icon: 'none' });
  } finally {
    isLoading.value = false;
  }
};

// 页面加载时自动填充记住的密码（原有逻辑保持不变）
onMounted(() => {
  const savedPhone = uni.getStorageSync('savedPhone');
  if (savedPhone) phoneNumber.value = savedPhone;
  
  const savedPwd = uni.getStorageSync('savedPwd');
  if (savedPwd) {
    password.value = savedPwd;
    rememberPwd.value = true;
  }
});
</script>

<style scoped>
/* 样式完全不变，与之前一致 */
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

.status-bar {
  height: var(--status-bar-height);
  width: 100%;
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
}

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
  border-radius: 70rpx;
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

.form-container {
  flex: 1;
  padding: 60rpx 40rpx 40rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

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
  z-index: 999;
  pointer-events: auto;
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
  outline: none;
  pointer-events: auto;
}

.form-input::placeholder {
  color: #94a3b8;
  font-size: 26rpx;
}

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
  transform: scale(1.4);
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

.copyright {
  text-align: center;
  padding-bottom: 60rpx;
  font-size: 22rpx;
  color: #94a3b8;
  letter-spacing: 1rpx;
}

::-webkit-scrollbar {
  display: none;
}
</style>