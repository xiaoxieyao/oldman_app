import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp({
    onShow(options) {},
    onLaunch() {
      // 初始化逻辑，如检查登录状态
      const hasLogin = uni.getStorageSync('hasLogin');
      if (hasLogin) {
        uni.switchTab({url: '/pages/device/device'});
      }
    }
  })
  return { app }
}