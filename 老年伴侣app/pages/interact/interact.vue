<template>
  <view class="page-interact flex flex-col h-full bg-slate-50">
    <!-- 页面内容区 -->
    <scroll-view class="flex-1 overflow-y-auto hide-scrollbar px-5 pt-4 pb-20" scroll-y>
      <!-- 快捷互动 -->
      <view class="bg-gradient-to-br from-pink-600 to-rose-700 rounded-3xl p-5 text-white shadow-lg shadow-pink-200 mb-4">
        <text class="text-pink-100 text-sm mb-4 block">亲情互动</text>
        <view class="grid grid-cols-2 gap-4">
          <button class="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex flex-col items-center justify-center" @click="videoCall">
            <text class="iconify w-8 h-8 text-white mb-2" data-icon="lucide:video"></text>
            <text class="text-sm font-medium">视频通话</text>
          </button>
          <button class="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex flex-col items-center justify-center" @click="voiceCall">
            <text class="iconify w-8 h-8 text-white mb-2" data-icon="lucide:phone-call"></text>
            <text class="text-sm font-medium">语音通话</text>
          </button>
        </view>
      </view>

      <!-- 语音留言 -->
      <view class="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 mb-4">
        <view class="flex items-center justify-between mb-3">
          <text class="text-sm font-semibold text-slate-700">语音留言</text>
          <button class="text-xs text-blue-600 font-medium" @click="recordVoice">录制新留言</button>
        </view>
        <view class="space-y-3">
          <view class="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
            <view class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center shrink-0">
              <text class="iconify w-5 h-5 text-white" data-icon="lucide:play"></text>
            </view>
            <view class="flex-1">
              <text class="text-sm font-semibold text-slate-800">子女留言</text>
              <text class="text-xs text-slate-500">今天 09:30 · 时长: 00:45</text>
            </view>
            <button class="text-xs text-slate-400" @click="playVoice">
              <text class="iconify w-4 h-4" data-icon="lucide:play"></text>
            </button>
          </view>
          <view class="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
            <view class="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center shrink-0">
              <text class="iconify w-5 h-5 text-white" data-icon="lucide:play"></text>
            </view>
            <view class="flex-1">
              <text class="text-sm font-semibold text-slate-800">老伴留言</text>
              <text class="text-xs text-slate-500">昨天 18:15 · 时长: 01:20</text>
            </view>
            <button class="text-xs text-slate-400" @click="playVoice">
              <text class="iconify w-4 h-4" data-icon="lucide:play"></text>
            </button>
          </view>
        </view>
      </view>

      <!-- 家庭相册 -->
      <view class="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 mb-4">
        <view class="flex items-center justify-between mb-3">
          <text class="text-sm font-semibold text-slate-700">家庭相册</text>
          <button class="text-xs text-blue-600 font-medium" @click="gotoAlbum">查看全部</button>
        </view>
        <scroll-view class="hide-scrollbar" scroll-x>
          <view class="flex gap-3 pb-2">
            <view class="w-24 h-24 bg-slate-200 rounded-xl overflow-hidden flex-shrink-0">
              <image src="/static/album/1.jpg" mode="aspectFill" class="w-full h-full"></image>
            </view>
            <view class="w-24 h-24 bg-slate-200 rounded-xl overflow-hidden flex-shrink-0">
              <image src="/static/album/2.jpg" mode="aspectFill" class="w-full h-full"></image>
            </view>
            <view class="w-24 h-24 bg-slate-200 rounded-xl overflow-hidden flex-shrink-0">
              <image src="/static/album/3.jpg" mode="aspectFill" class="w-full h-full"></image>
            </view>
            <view class="w-24 h-24 bg-slate-200 rounded-xl overflow-hidden flex-shrink-0">
              <image src="/static/album/4.jpg" mode="aspectFill" class="w-full h-full"></image>
            </view>
          </view>
        </scroll-view>
      </view>

      <!-- 互动记录 -->
      <view class="bg-white rounded-3xl p-4 shadow-sm border border-slate-100">
        <text class="text-sm font-semibold text-slate-700 mb-3">互动记录</text>
        <view class="space-y-2">
          <view class="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
            <view class="flex items-center gap-3">
              <view class="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center shrink-0">
                <text class="iconify w-4 h-4 text-white" data-icon="lucide:video"></text>
              </view>
              <view>
                <text class="text-sm font-semibold text-slate-800">视频通话</text>
                <text class="text-xs text-slate-500">今天 10:15 · 时长: 08:30</text>
              </view>
            </view>
            <text class="text-xs text-green-600 font-medium">已完成</text>
          </view>
          <view class="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
            <view class="flex items-center gap-3">
              <view class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center shrink-0">
                <text class="iconify w-4 h-4 text-white" data-icon="lucide:message-square"></text>
              </view>
              <view>
                <text class="text-sm font-semibold text-slate-800">文字消息</text>
                <text class="text-xs text-slate-500">昨天 16:40 · 3条</text>
              </view>
            </view>
            <text class="text-xs text-blue-600 font-medium">已读</text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
// 视频通话
const videoCall = () => {
  uni.showModal({
    title: '视频通话',
    content: '是否发起视频通话？',
    confirmText: '发起',
    cancelText: '取消',
    success: (res) => {
      if (res.confirm) {
        uni.showToast({
          title: '正在发起视频通话...',
          icon: 'none'
        });
      }
    }
  });
};

// 语音通话
const voiceCall = () => {
  uni.makePhoneCall({
    phoneNumber: '10086' // 示例号码
  });
};

// 播放语音
const playVoice = () => {
  uni.showToast({
    title: '正在播放语音...',
    icon: 'none'
  });
};

// 录制语音
const recordVoice = () => {
  uni.showToast({
    title: '录音功能开发中',
    icon: 'none'
  });
};

// 跳转到相册页
const gotoAlbum = () => {
  uni.navigateTo({
    url: '/pages/album/album'
  });
};
</script>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {display: none;}
.hide-scrollbar {-ms-overflow-style: none;scrollbar-width: none;}
.grid-cols-2 {display: grid;grid-template-columns: repeat(2, 1fr);}
.gap-3 {gap: 0.75rem;}
.gap-4 {gap: 1rem;}
.space-y-2 > * {margin-bottom: 0.5rem;}
.space-y-3 > * {margin-bottom: 0.75rem;}
.mb-4 {margin-bottom: 1rem;}
</style>