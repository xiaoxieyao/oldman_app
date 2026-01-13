<template>
  <view class="page-mine flex flex-col h-full bg-slate-50">
    <!-- 页面内容区 -->
    <scroll-view class="flex-1 overflow-y-auto hide-scrollbar px-5 pt-4 pb-20" scroll-y>
      <!-- 个人信息 -->
      <view class="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-5 text-white shadow-lg shadow-indigo-200 mb-4">
        <view class="flex items-center gap-4 mb-4">
          <view class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center shrink-0">
            <text class="iconify w-8 h-8 text-white" data-icon="lucide:user"></text>
          </view>
          <view>
            <text class="text-xl font-bold">王大爷</text>
            <text class="text-indigo-100 text-sm">ID: LA889900</text>
          </view>
        </view>
        <view class="grid grid-cols-3 gap-3">
          <view class="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20 text-center">
            <text class="text-lg font-bold">32</text>
            <text class="text-xs text-indigo-100 block mt-1">健康记录</text>
          </view>
          <view class="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20 text-center">
            <text class="text-lg font-bold">18</text>
            <text class="text-xs text-indigo-100 block mt-1">互动次数</text>
          </view>
          <view class="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20 text-center">
            <text class="text-lg font-bold">5</text>
            <text class="text-xs text-indigo-100 block mt-1">紧急联系人</text>
          </view>
        </view>
      </view>

      <!-- 功能菜单 -->
      <view class="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 mb-4">
        <view class="space-y-1">
          <button class="flex items-center justify-between w-full p-3 rounded-xl hover:bg-slate-50 transition-colors" @click="gotoProfile">
            <view class="flex items-center gap-3">
              <view class="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                <text class="iconify w-4 h-4 text-blue-600" data-icon="lucide:user-circle"></text>
              </view>
              <text class="text-sm font-medium text-slate-800">个人资料</text>
            </view>
            <text class="iconify w-4 h-4 text-slate-400" data-icon="lucide:chevron-right"></text>
          </button>
          <button class="flex items-center justify-between w-full p-3 rounded-xl hover:bg-slate-50 transition-colors" @click="gotoContact">
            <view class="flex items-center gap-3">
              <view class="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center shrink-0">
                <text class="iconify w-4 h-4 text-green-600" data-icon="lucide:users"></text>
              </view>
              <text class="text-sm font-medium text-slate-800">紧急联系人</text>
            </view>
            <text class="iconify w-4 h-4 text-slate-400" data-icon="lucide:chevron-right"></text>
          </button>
          <button class="flex items-center justify-between w-full p-3 rounded-xl hover:bg-slate-50 transition-colors" @click="gotoSetting">
            <view class="flex items-center gap-3">
              <view class="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center shrink-0">
                <text class="iconify w-4 h-4 text-purple-600" data-icon="lucide:settings"></text>
              </view>
              <text class="text-sm font-medium text-slate-800">系统设置</text>
            </view>
            <text class="iconify w-4 h-4 text-slate-400" data-icon="lucide:chevron-right"></text>
          </button>
        </view>
      </view>

      <!-- 服务中心 -->
      <view class="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 mb-4">
        <text class="text-sm font-semibold text-slate-700 mb-3 block">服务中心</text>
        <view class="space-y-1">
          <button class="flex items-center justify-between w-full p-3 rounded-xl hover:bg-slate-50 transition-colors" @click="showHelp">
            <view class="flex items-center gap-3">
              <view class="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center shrink-0">
                <text class="iconify w-4 h-4 text-amber-600" data-icon="lucide:help-circle"></text>
              </view>
              <text class="text-sm font-medium text-slate-800">使用帮助</text>
            </view>
            <text class="iconify w-4 h-4 text-slate-400" data-icon="lucide:chevron-right"></text>
          </button>
          <button class="flex items-center justify-between w-full p-3 rounded-xl hover:bg-slate-50 transition-colors" @click="showFeedback">
            <view class="flex items-center gap-3">
              <view class="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center shrink-0">
                <text class="iconify w-4 h-4 text-red-600" data-icon="lucide:message-square"></text>
              </view>
              <text class="text-sm font-medium text-slate-800">意见反馈</text>
            </view>
            <text class="iconify w-4 h-4 text-slate-400" data-icon="lucide:chevron-right"></text>
          </button>
          <button class="flex items-center justify-between w-full p-3 rounded-xl hover:bg-slate-50 transition-colors" @click="showAbout">
            <view class="flex items-center gap-3">
              <view class="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center shrink-0">
                <text class="iconify w-4 h-4 text-indigo-600" data-icon="lucide:info"></text>
              </view>
              <text class="text-sm font-medium text-slate-800">关于我们</text>
            </view>
            <text class="iconify w-4 h-4 text-slate-400" data-icon="lucide:chevron-right"></text>
          </button>
        </view>
      </view>

      <!-- 退出登录 -->
      <button class="w-full bg-red-50 text-red-600 font-medium py-3 rounded-3xl shadow-sm border border-red-100" @click="logout">
        退出登录
      </button>
    </scroll-view>
  </view>
</template>

<script setup>
// 跳转到个人资料
const gotoProfile = () => {
  uni.showToast({
    title: '个人资料页开发中',
    icon: 'none'
  });
};

// 跳转到紧急联系人
const gotoContact = () => {
  uni.showToast({
    title: '紧急联系人页开发中',
    icon: 'none'
  });
};

// 跳转到设置
const gotoSetting = () => {
  uni.showToast({
    title: '设置页开发中',
    icon: 'none'
  });
};

// 显示帮助
const showHelp = () => {
  uni.showToast({
    title: '使用帮助加载中',
    icon: 'none'
  });
};

// 显示反馈
const showFeedback = () => {
  uni.showToast({
    title: '意见反馈页开发中',
    icon: 'none'
  });
};

// 显示关于
const showAbout = () => {
  uni.showModal({
    title: '关于老年伴侣',
    content: '版本号：v1.0.0\n© 2025 老年伴侣 版权所有',
    showCancel: false
  });
};

// 退出登录
const logout = () => {
  uni.showModal({
    title: '退出登录',
    content: '确定要退出当前账号吗？',
    confirmText: '退出',
    cancelText: '取消',
    success: (res) => {
      if (res.confirm) {
        uni.removeStorageSync('hasLogin');
        uni.switchTab({
          url: '/pages/auth/auth'
        });
        uni.showToast({
          title: '退出成功',
          icon: 'success'
        });
      }
    }
  });
};
</script>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {display: none;}
.hide-scrollbar {-ms-overflow-style: none;scrollbar-width: none;}
.grid-cols-3 {display: grid;grid-template-columns: repeat(3, 1fr);}
.gap-3 {gap: 0.75rem;}
.gap-4 {gap: 1rem;}
.space-y-1 > * {margin-bottom: 0.25rem;}
.mb-4 {margin-bottom: 1rem;}
</style>