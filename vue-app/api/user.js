import { request } from './request'

// 登录接口
export const loginApi = (data) => {
  return request({
    url: '/api/login',   // 假设后端登录接口
    method: 'POST',
    data
  })
}

// 获取用户列表
export const getUsersApi = () => {
  return request({
    url: '/api/users',
    method: 'GET'
  })
}

// 添加用户
export const addUserApi = (data) => {
  return request({
    url: '/api/users',
    method: 'POST',
    data
  })
}

// 删除用户
export const deleteUserApi = (id) => {
  return request({
    url: `/api/users/${id}`,
    method: 'DELETE'
  })
}