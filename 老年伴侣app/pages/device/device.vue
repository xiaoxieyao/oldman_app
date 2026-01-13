<template>
  <view class="page-device flex flex-col h-full bg-slate-50">
    <!-- 首页内容 -->
    <scroll-view class="flex-1 overflow-y-auto hide-scrollbar pb-24 px-5 pt-4 space-y-4" scroll-y>
      <!-- 环境卡片 -->
      <view class="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-5 text-white shadow-lg shadow-blue-200" @click="showEnvironment">
        <view class="flex justify-between items-start mb-4">
          <view>
            <text class="text-blue-100 text-sm">当前环境</text>
            <text class="text-2xl font-bold">客厅 · 安全</text>
          </view>
          <text class="bg-green-400/30 px-3 py-1 rounded-full text-xs font-medium">实时运行中</text>
        </view>
        <view class="grid grid-cols-2 gap-4">
          <view class="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20">
            <text class="text-xs text-blue-100">室内温度</text>
            <text class="text-xl font-bold">24.5°C</text>
          </view>
          <view class="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20">
            <text class="text-xs text-blue-100">室内湿度</text>
            <text class="text-xl font-bold">48%</text>
          </view>
        </view>
      </view>

      <!-- 实时画面 -->
      <view class="bg-white rounded-3xl p-4 shadow-sm border border-slate-100">
        <view class="flex items-center justify-between mb-3">
          <view class="flex items-center gap-2">
            <view class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></view>
            <text class="text-sm font-semibold text-slate-700">实时画面</text>
          </view>
          <text class="text-xs text-slate-400">14:30</text>
        </view>
        <view class="relative w-full aspect-video bg-slate-200 rounded-2xl overflow-hidden" @click="showVideoDetail">
          <view class="absolute inset-0 flex items-center justify-center bg-black/20">
            <text class="iconify w-12 h-12 text-white" data-icon="lucide:play-circle"></text>
          </view>
        </view>
      </view>

      <!-- 快捷操作 -->
      <view class="bg-white rounded-3xl p-4 shadow-sm border border-slate-100">
        <text class="text-sm font-semibold text-slate-700 mb-4">快捷操作</text>
        <view class="grid grid-cols-3 gap-3">
          <button class="flex flex-col items-center p-3 bg-red-50 rounded-xl hover:bg-red-100 transition-colors" @click="emergencyCall">
            <text class="iconify w-6 h-6 text-red-600 mb-2" data-icon="lucide:phone-call"></text>
            <text class="text-xs font-medium text-red-700">紧急呼叫</text>
          </button>
          <button class="flex flex-col items-center p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors" @click="videoCall">
            <text class="iconify w-6 h-6 text-blue-600 mb-2" data-icon="lucide:video"></text>
            <text class="text-xs font-medium text-blue-700">视频通话</text>
          </button>
          <button class="flex flex-col items-center p-3 bg-green-50 rounded-xl hover:bg-green-100 transition-colors" @click="showHealthReport">
            <text class="iconify w-6 h-6 text-green-600 mb-2" data-icon="lucide:heart-pulse"></text>
            <text class="text-xs font-medium text-green-700">健康报告</text>
          </button>
        </view>
      </view>

      <!-- 今日提醒 -->
      <view class="bg-white rounded-3xl p-4 shadow-sm border border-slate-100">
        <view class="flex items-center justify-between mb-3">
          <text class="text-sm font-semibold text-slate-700">今日提醒</text>
          <text class="text-xs text-blue-600 font-medium">3条</text>
        </view>
        <view class="space-y-2">
          <view class="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
            <view class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center shrink-0">
              <text class="iconify w-4 h-4 text-white" data-icon="lucide:pill"></text>
            </view>
            <view class="flex-1">
              <text class="text-sm font-semibold text-slate-800">降压药</text>
              <text class="text-xs text-slate-500">每日 08:00 · 1片</text>
            </view>
            <button class="px-3 py-1 bg-blue-600 text-white text-xs rounded-full font-medium">已服用</button>
          </view>
          <view class="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
            <view class="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center shrink-0">
              <text class="iconify w-4 h-4 text-white" data-icon="lucide:droplet"></text>
            </view>
            <view class="flex-1">
              <text class="text-sm font-semibold text-slate-800">喝水提醒</text>
              <text class="text-xs text-slate-500">进行中 · 5/8杯</text>
            </view>
            <view class="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
              <view class="h-full bg-green-500" style="width: 62.5%"></view>
            </view>
          </view>
          <view class="flex items-center gap-3 p-3 bg-purple-50 rounded-xl">
            <view class="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center shrink-0">
              <text class="iconify w-4 h-4 text-white" data-icon="lucide:music"></text>
            </view>
            <view class="flex-1">
              <text class="text-sm font-semibold text-slate-800">社区合唱团</text>
              <text class="text-xs text-slate-500">明天下午 2:00</text>
            </view>
            <text class="iconify text-slate-400" data-icon="lucide:chevron-right"></text>
          </view>
        </view>
      </view>

      <!-- 位置与安全 -->
      <view class="bg-white rounded-3xl p-4 shadow-sm border border-slate-100">
        <view class="flex items-center justify-between mb-3">
          <text class="text-sm font-semibold text-slate-700">位置与安全</text>
          <button class="text-xs text-blue-600 font-medium" @click="showLocation">详情</button>
        </view>
        <view class="bg-purple-50 rounded-xl p-3">
          <view class="flex items-center justify-between mb-2">
            <view class="flex items-center gap-2">
              <text class="iconify w-4 h-4 text-purple-600" data-icon="lucide:map-pin"></text>
              <text class="text-sm font-semibold text-slate-800">当前位置</text>
            </view>
            <text class="bg-green-100 text-green-600 px-2 py-0.5 rounded-full text-xs font-medium">安全</text>
          </view>
          <text class="text-xs text-slate-600">在家中 · 客厅</text>
          <text class="text-xs text-slate-400 mt-1">更新于 2分钟前</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
// 跳转环境详情（示例）
const showEnvironment = () => {
  uni.showToast({
    title: '环境详情加载中',
    icon: 'loading'
  });
};

// 跳转视频详情页
const showVideoDetail = () => {
  uni.navigateTo({
    url: '/pages/videoDetail/videoDetail'
  });
};

// 紧急呼叫
const emergencyCall = () => {
  uni.showModal({
    title: '紧急呼叫',
    content: '是否拨打紧急联系人电话？',
    confirmText: '拨打',
    cancelText: '取消',
    success: (res) => {
      if (res.confirm) {
        // 调用App拨号API
        uni.makePhoneCall({
          phoneNumber: '10086' // 示例号码
        });
      }
    }
  });
};

// 视频通话
const videoCall = () => {
  uni.showToast({
    title: '正在发起视频通话...',
    icon: 'none'
  });
};

// 健康报告
const showHealthReport = () => {
  uni.navigateTo({
    url: '/pages/health/health'
  });
};

// 位置详情
const showLocation = () => {
  uni.navigateTo({
    url: '/pages/location/location'
  });
};
</script>

<style scoped>
/* 适配uni-app的样式 */
.hide-scrollbar::-webkit-scrollbar {display: none;}
.hide-scrollbar {-ms-overflow-style: none;scrollbar-width: none;}
.animate-pulse {animation: pulse 2s infinite;}
@keyframes pulse {
  0%,100% {opacity: 1;}
  50% {opacity: 0.5;}
}
.grid-cols-2 {display: grid;grid-template-columns: repeat(2, 1fr);}
.grid-cols-3 {display: grid;grid-template-columns: repeat(3, 1fr);}
.gap-4 {gap: 1rem;}
.gap-3 {gap: 0.75rem;}
.aspect-video {aspect-ratio: 16/9;}
.space-y-2 > * {margin-bottom: 0.5rem;}
.space-y-4 > * {margin-bottom: 1rem;}
</style>