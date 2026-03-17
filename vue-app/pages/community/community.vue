<template>
  <view class="page-community">
    <!-- 状态栏占位（项目统一样式，渐变背景） -->
    <view class="status-bar-placeholder"></view>
    
    <!-- 顶部导航栏（复用项目统一的渐变导航 + 滚动变化） -->
    <view class="page-header" :class="{ 'header-scroll': isScroll }">
      <text class="header-title">社区活动</text>
      <view class="header-placeholder"></view>
    </view>

    <!-- 内容滚动容器（项目统一的动态高度 + 滚动监听） -->
    <scroll-view 
      class="content-scroll" 
      scroll-y 
      @scroll="onScroll"
      scroll-with-animation
      :style="{ height: scrollViewHeight + 'px' }"
    >
      <!-- 活动搜索栏（贴合老年用户，简约搜索） -->
      <view class="search-bar">
        <view class="search-input" @click="gotoSearch">
          <text class="search-icon">🔍</text>
          <text class="search-placeholder">搜索社区活动/主题</text>
        </view>
      </view>

      <!-- 活动分类标签（可点击切换，默认选中全部） -->
      <view class="category-tab">
        <scroll-view scroll-x class="tab-scroll" show-scrollbar="false">
          <view class="tab-list">
            <view 
              class="tab-item" 
              :class="{ 'tab-active': activeCate === index }"
              v-for="(item, index) in cateList" 
              :key="index"
              @click="switchCate(index)"
            >
              <text class="tab-text">{{ item }}</text>
            </view>
          </view>
        </scroll-view>
      </view>

      <!-- 活动列表（核心模块，图文布局，贴合老年视觉） -->
      <view class="activity-list">
        <view 
          class="activity-item" 
          v-for="(item, index) in activityList" 
          :key="index"
          @click="gotoActivityDetail(item.id)"
          :class="{ 'item-active': isClick }"
        >
          <!-- 活动封面图 -->
          <view class="activity-img-box">
            <image 
              class="activity-img" 
              :src="item.cover" 
              mode="aspectFill"
            ></image>
            <!-- 活动标签（热门/新上线） -->
            <view class="activity-tag" v-if="item.tag">{{ item.tag }}</view>
          </view>
          <!-- 活动信息 -->
          <view class="activity-info">
            <text class="activity-title">{{ item.title }}</text>
            <view class="activity-meta">
              <view class="meta-item">
                <text class="meta-icon">📅</text>
                <text class="meta-text">{{ item.time }}</text>
              </view>
              <view class="meta-item">
                <text class="meta-icon">📍</text>
                <text class="meta-text">{{ item.address }}</text>
              </view>
            </view>
            <view class="activity-extra">
              <view class="join-info">
                <text class="join-icon">👥</text>
                <text class="join-text">{{ item.joinNum }}人已报名</text>
              </view>
              <button class="join-btn" @click.stop="handleJoinActivity(item.id)">立即报名</button>
            </view>
          </view>
        </view>
      </view>

      <!-- 空数据占位（无活动时显示） -->
      <view class="empty-box" v-if="activityList.length === 0">
        <text class="empty-icon">📃</text>
        <text class="empty-text">暂无相关社区活动，敬请期待</text>
      </view>
    </scroll-view>

    <!-- 自定义tabBar（项目统一，取消注释即可使用） -->
    <!-- <custom-tabbar /> -->
  </view>
</template>

<script setup>
// 导入项目统一的Vue API
import { ref, onMounted, onUnmounted } from 'vue';

// 响应式数据（遵循项目命名规范，和首页/设置页一致）
const isScroll = ref(false);    // 导航栏滚动状态
const isClick = ref(false);     // 通用点击激活状态
const scrollViewHeight = ref(0);// 滚动容器动态高度
const activeCate = ref(0);     // 选中的活动分类索引
const joinClick = ref(false);   // 报名按钮点击状态

// 活动分类列表（贴合老年社区，精选常用分类）
const cateList = ref([
  '全部活动', '养生讲座', '文体活动', '手工课堂', '健康义诊', '公益帮扶'
]);

// 模拟社区活动数据（可后续替换为接口请求数据）
const activityList = ref([
  {
    id: 1,
    title: '中老年高血压预防与调理养生讲座',
    cover: '/static/images/activity1.png',
    tag: '热门',
    time: '2026-05-20 09:30-11:30',
    address: '社区服务中心1楼会议室',
    joinNum: 86
  },
  {
    id: 2,
    title: '社区广场舞交流赛（中老年组）',
    cover: '/static/images/activity2.png',
    tag: '新上线',
    time: '2026-05-25 14:00-16:30',
    address: '社区文化广场',
    joinNum: 128
  },
  {
    id: 3,
    title: '中老年手工剪纸课堂（免费）',
    cover: '/static/images/activity3.png',
    time: '2026-05-22 10:00-12:00',
    address: '社区老年活动中心',
    joinNum: 52
  },
  {
    id: 4,
    title: '社区免费健康义诊（测血糖/血压）',
    cover: '/static/images/activity4.png',
    tag: '公益',
    time: '2026-05-28 08:30-11:30',
    address: '社区大门口广场',
    joinNum: 203
  }
]);

// 页面挂载初始化（项目统一的高度计算逻辑，适配自定义tabBar）
onMounted(() => {
  try {
    const systemInfo = uni.getSystemInfoSync();
    const screenHeight = systemInfo.windowHeight;
    const statusBarH = systemInfo.statusBarHeight || 0;
    const navBarH = 88 / 2;  // 项目统一导航栏高度（88rpx转px）
    const tabBarH = 100 / 2; // 项目统一tabBar高度（100rpx转px）
    scrollViewHeight.value = screenHeight - statusBarH - navBarH - tabBarH;
  } catch (e) {
    scrollViewHeight.value = 500; // 异常降级，项目统一规范
  }
});

// 页面卸载清理
onUnmounted(() => {});

// 滚动事件处理（项目统一逻辑：scrollTop>20触发导航栏变化）
const onScroll = (e) => {
  isScroll.value = e.detail.scrollTop > 20;
};

// 通用点击动画函数（完全复用项目统一的点击逻辑，和首页/设置页一致）
const handleFunctionClick = (callback) => {
  isClick.value = true;
  setTimeout(() => {
    isClick.value = false;
    callback();
  }, 100);
};

// 通用报名按钮点击动画（单独抽离，避免和列表点击冲突）
const handleJoinClick = (callback) => {
  joinClick.value = true;
  setTimeout(() => {
    joinClick.value = false;
    callback();
  }, 100);
};

// 切换活动分类
const switchCate = (index) => {
  handleFunctionClick(() => {
    activeCate.value = index;
    // 后续可添加分类筛选逻辑：根据cateList[index]筛选activityList
    // 示例：if (cateList[index] === '养生讲座') { activityList.value = 筛选后的养生讲座列表 }
    uni.showToast({
      title: `已切换为【${cateList[index]}】`,
      icon: 'success',
      duration: 1500
    });
  });
};

// 跳转到活动搜索页
const gotoSearch = () => {
  handleFunctionClick(() => {
    uni.showToast({
      title: '活动搜索页开发中',
      icon: 'none',
      duration: 2000
    });
    // 后续开发后替换为实际跳转
    // uni.navigateTo({ url: '/pages/community/search/search' });
  });
};

// 跳转到活动详情页（带活动ID参数，支持传参到详情页）
const gotoActivityDetail = (id) => {
  handleFunctionClick(() => {
    console.log('跳转到活动详情页，活动ID：', id);
    uni.navigateTo({
      url: `/pages/community/activity-detail/activity-detail?id=${id}`,
      fail: (err) => {
        console.error('活动详情页跳转失败：', err);
        uni.showToast({
          title: `跳转失败：${err.errMsg || '页面不存在'}`,
          icon: 'none',
          duration: 3000
        });
      }
    });
  });
};

// 活动报名功能（阻止事件冒泡，避免触发列表跳转）
const handleJoinActivity = (id) => {
  handleJoinClick(() => {
    console.log('报名活动，活动ID：', id);
    uni.showModal({
      title: '活动报名',
      content: '确认报名该社区活动吗？',
      confirmText: '确认报名',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          // 模拟报名成功，更新报名人数
          const activity = activityList.value.find(item => item.id === id);
          if (activity) activity.joinNum += 1;
          uni.showToast({
            title: '报名成功，敬请参与',
            icon: 'success',
            duration: 2000
          });
        }
      }
    });
  });
};
</script>

<style scoped>
/* 基础样式 - 遵循项目统一规范，仅修改类名 */
.page-community {
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

/* 状态栏占位 - 项目完全统一的渐变背景 */
.status-bar-placeholder {
  height: var(--status-bar-height);
  width: 100%;
  background: linear-gradient(135deg, #3b82f6 0%, #4f46e5 100%);
  flex-shrink: 0;
}

/* 顶部导航栏 - 项目完全统一的样式，渐变+滚动变化 */
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
  width: 60rpx; /* 占位保持对称，项目统一 */
}

/* 内容滚动区 - 项目完全统一的样式，无差异 */
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

/* 搜索栏 - 简约设计，贴合老年用户操作习惯 */
.search-bar {
  width: 100%;
  margin-bottom: 24rpx;
}
.search-input {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 24rpx 30rpx;
  background: #fff;
  border-radius: 32rpx;
  border: 1rpx solid #f1f5f9;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}
.search-icon {
  font-size: 28rpx;
  color: #94a3b8;
}
.search-placeholder {
  font-size: 26rpx;
  color: #94a3b8;
  flex: 1;
}

/* 活动分类标签 - 横向滚动，选中高亮 */
.category-tab {
  width: 100%;
  margin-bottom: 24rpx;
}
.tab-scroll {
  width: 100%;
  white-space: nowrap;
}
.tab-list {
  display: flex;
  gap: 20rpx;
  padding: 0 8rpx;
}
.tab-item {
  padding: 16rpx 28rpx;
  background: #fff;
  border-radius: 24rpx;
  border: 1rpx solid #f1f5f9;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);
  transition: all 0.2s ease;
}
.tab-active {
  background: linear-gradient(135deg, #3b82f6 0%, #4f46e5 100%);
  border: none;
}
.tab-text {
  font-size: 26rpx;
  font-weight: 500;
  color: #334155;
}
.tab-active .tab-text {
  color: #fff;
}

/* 活动列表 - 项目统一的卡片间距（28rpx） */
.activity-list {
  display: flex;
  flex-direction: column;
  gap: 28rpx;
  margin-bottom: 20rpx;
}
/* 活动项 - 卡片式设计，项目统一的圆角/阴影/边框 */
.activity-item {
  background: #fff;
  border-radius: 32rpx;
  border: 1rpx solid #f1f5f9;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: all 0.2s ease;
}
.activity-item.item-active {
  transform: scale(0.98);
}
/* 活动封面图容器 */
.activity-img-box {
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  overflow: hidden;
}
.activity-img {
  width: 100%;
  height: 100%;
}
/* 活动标签 */
.activity-tag {
  position: absolute;
  top: 20rpx;
  left: 20rpx;
  padding: 6rpx 16rpx;
  background: #f59e0b;
  color: #fff;
  font-size: 20rpx;
  font-weight: 600;
  border-radius: 12rpx;
}
.activity-tag[text="公益"] {
  background: #14b8a6;
}
.activity-tag[text="新上线"] {
  background: #ec4899;
}
/* 活动信息区 */
.activity-info {
  padding: 28rpx 30rpx;
}
/* 活动标题 */
.activity-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #334155;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
  margin-bottom: 20rpx;
}
/* 活动元信息（时间+地址） */
.activity-meta {
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  margin-bottom: 24rpx;
}
.meta-item {
  display: flex;
  align-items: center;
  gap: 12rpx;
}
.meta-icon {
  font-size: 24rpx;
  color: #3b82f6;
  width: 24rpx;
  text-align: center;
}
.meta-text {
  font-size: 24rpx;
  color: #64748b;
}
/* 活动额外信息（报名人数+报名按钮） */
.activity-extra {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.join-info {
  display: flex;
  align-items: center;
  gap: 8rpx;
}
.join-icon {
  font-size: 24rpx;
  color: #8b5cf6;
}
.join-text {
  font-size: 22rpx;
  color: #94a3b8;
}
/* 报名按钮 - 项目统一主色，圆角规范 */
.join-btn {
  padding: 12rpx 24rpx;
  background: linear-gradient(135deg, #3b82f6 0%, #4f46e5 100%);
  color: #fff;
  border: none;
  border-radius: 20rpx;
  font-size: 24rpx;
  font-weight: 500;
}
.join-btn::after {
  border: none !important;
}

/* 空数据占位 - 友好提示，贴合项目风格 */
.empty-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;
  gap: 20rpx;
}
.empty-icon {
  font-size: 80rpx;
  color: #e2e8f0;
}
.empty-text {
  font-size: 28rpx;
  color: #94a3b8;
}

/* 全局按钮重置 - 项目完全统一的样式，清除uni-app默认样式 */
button {
  padding: 0;
  margin: 0;
  line-height: 1;
}
button::after {
  border: none !important;
}
</style>