<template>
  <view class="page-medicine flex flex-col h-full bg-slate-50">
    <scroll-view class="flex-1 overflow-y-auto hide-scrollbar px-5 pt-4 pb-20" scroll-y>
      <!-- 降压药卡片 -->
      <view class="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 mb-4">
        <view class="flex items-center justify-between mb-3">
          <view class="flex items-center gap-3">
            <view class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <text class="iconify w-6 h-6 text-blue-600" data-icon="lucide:pill"></text>
            </view>
            <view>
              <text class="text-sm font-semibold text-slate-800">降压药</text>
              <text class="text-xs text-slate-500 block">硝苯地平缓释片</text>
            </view>
          </view>
          <!-- 用响应式数据控制状态，不再操作 DOM -->
          <text class="rounded-full text-xs font-medium px-3 py-1" 
                :class="medicineList[0].status === '进行中' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'">
            {{ medicineList[0].status }}
          </text>
        </view>
        <view class="space-y-2 text-sm">
          <view class="flex justify-between">
            <text class="text-slate-500">服用时间</text>
            <text class="text-slate-800">每日 08:00</text>
          </view>
          <view class="flex justify-between">
            <text class="text-slate-500">剂量</text>
            <text class="text-slate-800">1片/次</text>
          </view>
          <view class="flex justify-between">
            <text class="text-slate-500">剩余数量</text>
            <text class="text-orange-600 font-medium">15片</text>
          </view>
        </view>
        <button class="w-full mt-3 bg-blue-600 text-white text-sm py-2 rounded-xl font-medium" 
                @click="markMedicine(0)">
          {{ medicineList[0].status === '进行中' ? '标记已服用' : '取消标记' }}
        </button>
      </view>

      <!-- 降糖药卡片 -->
      <view class="bg-white rounded-3xl p-4 shadow-sm border border-slate-100">
        <view class="flex items-center justify-between mb-3">
          <view class="flex items-center gap-3">
            <view class="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <text class="iconify w-6 h-6 text-purple-600" data-icon="lucide:pill"></text>
            </view>
            <view>
              <text class="text-sm font-semibold text-slate-800">降糖药</text>
              <text class="text-xs text-slate-500 block">二甲双胍片</text>
            </view>
          </view>
          <text class="rounded-full text-xs font-medium px-3 py-1" 
                :class="medicineList[1].status === '进行中' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'">
            {{ medicineList[1].status }}
          </text>
        </view>
        <view class="space-y-2 text-sm">
          <view class="flex justify-between">
            <text class="text-slate-500">服用时间</text>
            <text class="text-slate-800">每日 08:00, 18:00</text>
          </view>
          <view class="flex justify-between">
            <text class="text-slate-500">剂量</text>
            <text class="text-slate-800">1片/次</text>
          </view>
          <view class="flex justify-between">
            <text class="text-slate-500">剩余数量</text>
            <text class="text-green-600 font-medium">42片</text>
          </view>
        </view>
        <button class="w-full mt-3 bg-purple-600 text-white text-sm py-2 rounded-xl font-medium" 
                @click="markMedicine(1)">
          {{ medicineList[1].status === '进行中' ? '标记已服用' : '取消标记' }}
        </button>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref } from 'vue';

// 用响应式数据管理状态，完全移除 DOM 操作
const medicineList = ref([
  { name: '降压药', status: '进行中' },
  { name: '降糖药', status: '进行中' }
]);

// 标记用药状态
const markMedicine = (index) => {
  if (medicineList.value[index].status === '进行中') {
    medicineList.value[index].status = '已服用';
    uni.showToast({ title: '已标记为已服用', icon: 'success' });
  } else {
    medicineList.value[index].status = '进行中';
    uni.showToast({ title: '已取消标记', icon: 'success' });
  }
};

// 页面返回
const goBack = () => {
  uni.navigateBack({ delta: 1 });
};
</script>

<style scoped>
/* 仅保留必要样式，移除 H5 专属样式 */
.hide-scrollbar::-webkit-scrollbar {display: none;}
.hide-scrollbar {-ms-overflow-style: none;scrollbar-width: none;}
.space-y-2 > * {margin-bottom: 0.5rem;}
.mb-3 {margin-bottom: 0.75rem;}
.mb-4 {margin-bottom: 1rem;}
.mt-3 {margin-top: 0.75rem;}
.gap-3 {gap: 0.75rem;}
.flex {display: flex;}
.justify-between {justify-content: space-between;}
.items-center {align-items: center;}
.w-full {width: 100%;}
.py-2 {padding-top: 0.5rem;padding-bottom: 0.5rem;}
.px-3 {padding-left: 0.75rem;padding-right: 0.75rem;}
.flex-col {flex-direction: column;}
.h-full {height: 100%;}
</style>