<template>
  <view class="page-health flex flex-col h-full bg-slate-50">
    <!-- 页面内容区 -->
    <scroll-view class="flex-1 overflow-y-auto hide-scrollbar px-5 pt-4 pb-20" scroll-y>
      <!-- 健康概览卡片 -->
      <view class="bg-gradient-to-br from-green-600 to-emerald-700 rounded-3xl p-5 text-white shadow-lg shadow-green-200 mb-4">
        <view class="flex justify-between items-start mb-4">
          <view>
            <text class="text-green-100 text-sm">今日健康评分</text>
            <text class="text-3xl font-bold">92</text>
          </view>
          <text class="bg-white/20 px-3 py-1 rounded-full text-xs font-medium">较昨日 +3</text>
        </view>
        <view class="grid grid-cols-3 gap-3">
          <view class="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20">
            <text class="text-xs text-green-100">心率</text>
            <text class="text-xl font-bold">78 次/分</text>
          </view>
          <view class="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20">
            <text class="text-xs text-green-100">血压</text>
            <text class="text-xl font-bold">128/82 mmHg</text>
          </view>
          <view class="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20">
            <text class="text-xs text-green-100">步数</text>
            <text class="text-xl font-bold">4580 步</text>
          </view>
        </view>
      </view>

      <!-- 健康趋势图表 -->
      <view class="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 mb-4">
        <view class="flex items-center justify-between mb-3">
          <text class="text-sm font-semibold text-slate-700">健康趋势（7天）</text>
          <view class="flex gap-2">
            <button class="px-2 py-1 bg-green-50 text-green-600 text-xs rounded-full font-medium active">心率</button>
            <button class="px-2 py-1 bg-slate-50 text-slate-600 text-xs rounded-full font-medium" @click="switchChart('blood')">血压</button>
            <button class="px-2 py-1 bg-slate-50 text-slate-600 text-xs rounded-full font-medium" @click="switchChart('step')">步数</button>
          </view>
        </view>
        <!-- 简易图表占位（实际项目可集成uni-app-echarts） -->
        <view class="w-full h-48 bg-slate-50 rounded-xl flex items-center justify-center">
          <text class="text-slate-400 text-sm">心率趋势图表</text>
        </view>
      </view>

      <!-- 健康提醒 -->
      <view class="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 mb-4">
        <text class="text-sm font-semibold text-slate-700 mb-3">健康提醒</text>
        <view class="space-y-2">
          <view class="flex items-center gap-3 p-3 bg-amber-50 rounded-xl">
            <view class="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center shrink-0">
              <text class="iconify w-4 h-4 text-white" data-icon="lucide:alert-triangle"></text>
            </view>
            <view class="flex-1">
              <text class="text-sm font-semibold text-slate-800">血压略高</text>
              <text class="text-xs text-slate-500">建议减少盐分摄入，适当休息</text>
            </view>
          </view>
          <view class="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
            <view class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center shrink-0">
              <text class="iconify w-4 h-4 text-white" data-icon="lucide:droplet"></text>
            </view>
            <view class="flex-1">
              <text class="text-sm font-semibold text-slate-800">饮水量不足</text>
              <text class="text-xs text-slate-500">今日仅饮用400ml，建议达到1500ml</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 用药记录 -->
      <view class="bg-white rounded-3xl p-4 shadow-sm border border-slate-100">
        <view class="flex items-center justify-between mb-3">
          <text class="text-sm font-semibold text-slate-700">用药记录</text>
          <button class="text-xs text-blue-600 font-medium" @click="gotoMedicine">查看全部</button>
        </view>
        <view class="space-y-2">
          <view class="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
            <view class="flex items-center gap-3">
              <view class="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center shrink-0">
                <text class="iconify w-4 h-4 text-white" data-icon="lucide:pill"></text>
              </view>
              <view>
                <text class="text-sm font-semibold text-slate-800">降压药</text>
                <text class="text-xs text-slate-500">每日 08:00 · 1片</text>
              </view>
            </view>
            <text class="text-xs text-green-600 font-medium">已服用</text>
          </view>
          <view class="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
            <view class="flex items-center gap-3">
              <view class="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center shrink-0">
                <text class="iconify w-4 h-4 text-white" data-icon="lucide:pill"></text>
              </view>
              <view>
                <text class="text-sm font-semibold text-slate-800">降糖药</text>
                <text class="text-xs text-slate-500">每日 18:00 · 1片</text>
              </view>
            </view>
            <text class="text-xs text-amber-600 font-medium">未服用</text>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
// 切换图表类型
const switchChart = (type) => {
  uni.showToast({
    title: `切换到${type === 'blood' ? '血压' : '步数'}图表`,
    icon: 'none'
  });
};

// 跳转到用药管理页
const gotoMedicine = () => {
  uni.navigateTo({
    url: '/pages/medicine/medicine'
  });
};
</script>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {display: none;}
.hide-scrollbar {-ms-overflow-style: none;scrollbar-width: none;}
.grid-cols-3 {display: grid;grid-template-columns: repeat(3, 1fr);}
.gap-3 {gap: 0.75rem;}
.space-y-2 > * {margin-bottom: 0.5rem;}
.space-y-3 > * {margin-bottom: 0.75rem;}
.mb-4 {margin-bottom: 1rem;}
.active {background-color: #10b981 !important;color: white !important;}
</style>