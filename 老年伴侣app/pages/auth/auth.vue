<template>
  <view class="page-auth h-full bg-slate-50">
    <!-- 状态栏占位 -->
    <view class="h-11"></view>
    <!-- 登录头部 -->
    <view class="login-container px-8 pt-6 pb-8 rounded-b-[3rem]">
      <view class="text-center mb-6">
        <view class="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
          <text class="text-2xl">👴</text>
        </view>
        <text class="text-xl font-bold text-white mb-1">老年伴侣</text>
        <text class="text-blue-100 text-xs">守护每一个温暖时光</text>
      </view>
      <view class="flex bg-white/20 rounded-xl p-1 backdrop-blur-md border border-white/20">
        <button class="tab-button flex-1 py-2.5 text-center text-sm font-medium text-white rounded-lg active" @click="switchAuthTab('login')">登录</button>
      </view>
    </view>
    <!-- 登录表单 -->
    <view class="px-8 pt-6 pb-4">
      <view class="auth-form" id="login-form">
        <view class="space-y-3 mb-5">
          <input type="text" placeholder="请输入手机号" class="form-input w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 text-sm" />
          <input type="password" placeholder="请输入密码" class="form-input w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 text-sm" />
        </view>
        <view class="flex items-center justify-between mb-5 text-xs">
          <label class="flex items-center text-slate-600">
            <checkbox class="mr-2 rounded" />
            <text>记住密码</text>
          </label>
          <navigator url="#" class="text-blue-600">忘记密码？</navigator>
        </view>
        <button class="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-colors mb-5 shadow-lg text-sm" @click="login">登录</button>
      </view>
    </view>
    <view class="text-center pb-4 text-slate-400 text-xs mt-auto">
      <text>© 2025 老年伴侣</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';

// 切换登录/注册标签（注册暂隐藏）
const switchAuthTab = (type) => {
  // 暂仅实现登录逻辑
};

// 登录逻辑
const login = () => {
  // 模拟登录成功
  uni.setStorageSync('hasLogin', true);
  uni.switchTab({
    url: '/pages/device/device'
  });
  uni.showToast({
    title: '登录成功',
    icon: 'success'
  });
};
</script>

<style scoped>
/* 复用原有样式，适配uni-app的view/text标签 */
.hide-scrollbar::-webkit-scrollbar {display: none;}
.hide-scrollbar {-ms-overflow-style: none;scrollbar-width: none;}
.login-container {background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);}
.form-input {transition: all 0.2s ease-in-out;}
.form-input:focus {transform: translateY(-1px);box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);}
.tab-button.active {background: white;color: #3b82f6;font-weight: 600;}
.tab-button {transition: all 0.2s ease-in-out;}
.space-y-3 > * {margin-bottom: 0.75rem;}
.mb-5 {margin-bottom: 1.25rem;}
.px-8 {padding-left: 2rem;padding-right: 2rem;}
.py-3 {padding-top: 0.75rem;padding-bottom: 0.75rem;}
</style>