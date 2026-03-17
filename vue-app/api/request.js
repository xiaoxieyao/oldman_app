// 请求基础配置，统一处理 token、错误提示等
const BASE_URL = 'http://127.0.0.1:8080' // 你的后端地址

// 封装 uni.request 为 Promise 形式
export const request = (options) => {
  return new Promise((resolve, reject) => {
    // 构建请求URL
    let requestUrl = BASE_URL + '/user';
    
    // 登录请求特殊处理，添加/login路径
    if (options.url === '/api/login') {
      requestUrl += '/login';
    }
    
    uni.request({
      url: requestUrl,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        'Referer': BASE_URL,
        // 登录请求不需要Authorization头
        'Authorization': options.url === '/api/login' ? '' : (uni.getStorageSync('token') || '')
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data)
        } else {
          uni.showToast({ title: '请求失败', icon: 'none' })
          reject(res)
        }
      },
      fail: (err) => {
        uni.showToast({ title: '网络错误', icon: 'none' })
        reject(err)
      }
    })
  })
}