<script setup>
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app';

// App启动时执行（仅一次）
onLaunch(() => {
  console.log('App Launch');
  
  // 登录状态校验（避免重复跳转，解决路由冲突）
  checkLoginStatus();
});

// App显示时执行（切前台/首次启动）
onShow(() => {
  console.log('App Show');
});

// App隐藏时执行（切后台）
onHide(() => {
  console.log('App Hide');
  
  // 切后台时清理不必要的定时器/监听
  clearGlobalTimers();
});

// 登录状态校验（核心优化：避免重复跳转）
const checkLoginStatus = () => {
  try {
    // 获取本地登录状态
    const hasLogin = uni.getStorageSync('hasLogin');
    const currentPages = getCurrentPages();
    
    // 仅在「无页面栈」或「页面栈只有1个且不是登录页」时，才判断跳转
    if (currentPages.length === 0) {
      if (hasLogin) {
        // 已登录 → 跳转到tabBar首页
        uni.switchTab({
          url: '/pages/device/device',
          fail: (err) => {
            console.warn('跳转到首页失败', err);
          }
        });
      } else {
        // 未登录 → 跳转到登录页
        uni.redirectTo({
          url: '/pages/auth/auth'
        });
      }
    }
  } catch (e) {
    console.error('登录状态校验失败', e);
    // 异常时默认跳登录页
    uni.redirectTo({
      url: '/pages/auth/auth'
    });
  }
};

// 清理全局定时器/监听（避免内存泄漏）
const clearGlobalTimers = () => {
  // 可在这里清理全局定时器、WebSocket连接等
  if (globalThis.globalTimer) {
    clearInterval(globalThis.globalTimer);
    globalThis.globalTimer = null;
  }
};
</script>

<style lang="scss">
/* 全局样式重置（解决不同端样式兼容问题） */
page {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  font-size: 28rpx;
  line-height: 1.5;
  color: #333;
  background-color: #f5f5f5;
}

/* 统一按钮样式（避免各页面样式混乱） */
button {
  border: none;
  outline: none;
  border-radius: 0;
  background-color: transparent;
}

/* 统一滚动容器样式 */
scroll-view {
  box-sizing: border-box;
}

/* 隐藏所有端的滚动条（统一体验） */
::-webkit-scrollbar {
  display: none;
}
</style>