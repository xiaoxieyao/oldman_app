import { createSSRApp } from 'vue'
import App from './App.vue'

// 全局变量挂载（避免重复声明）
if (!globalThis.__uniApp__) {
  globalThis.__uniApp__ = true;
}

export function createApp() {
  // 防御性创建：确保只创建一次App实例
  if (globalThis.__uniAppInstance__) {
    return { app: globalThis.__uniAppInstance__ };
  }
  
  const app = createSSRApp(App);
  
  // 1. 挂载全局配置（可选，便于页面调用）
  app.config.globalProperties.$uni = uni; // 挂载uni对象，页面可通过this.$uni调用
  app.config.errorHandler = (err, vm, info) => {
    // 全局错误捕获：避免单个页面报错导致整个App白屏
    console.error('Vue全局错误:', err, info);
    // 生产环境可上报错误日志
  };
  
  // 2. 缓存App实例到全局，避免重复创建
  globalThis.__uniAppInstance__ = app;
  
  return { app };
}