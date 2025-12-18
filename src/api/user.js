import request from './request'
import { shouldUseMock, getMockData } from './mock'

// 用户注册
export function registerAPI(data) {
  return request({
    url: '/user_management/user_register',
    method: 'post',
    data
  })
}

// 用户登录
export function loginAPI(data) {
  return request({
    url: '/user_management/user_login',
    method: 'post',
    data
  })
}

// 管理员登录
export function adminLoginAPI(data) {
  return request({
    url: '/user_management/admin_login',
    method: 'post',
    data
  })
}

// 获取用户信息
export async function getUserInfoAPI() {
  const url = '/user_management/get_user_info'
  
  // 开发环境：检查是否使用模拟数据
  if (shouldUseMock(url)) {
    return await getMockData(url, 'get')
  }
  
  return request({
    url,
    method: 'get'
  })
}

// 更新用户信息
export async function updateUserInfoAPI(data) {
  const url = '/user_management/update_user_info'
  
  // 开发环境：检查是否使用模拟数据
  if (shouldUseMock(url)) {
    return await getMockData(url, 'put', data)
  }
  
  return request({
    url,
    method: 'put',
    data
  })
}

// 上传头像
export async function uploadAvatarAPI(file) {
  const url = '/user_management/upload_avatar'
  
  // 开发环境：检查是否使用模拟数据
  if (shouldUseMock(url)) {
    return await getMockData(url, 'post', file)
  }
  
  const formData = new FormData()
  formData.append('file', file)
  
  return request({
    url,
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 获取用户项目经历
export async function getUserProjectsAPI(userId) {
  const url = `/project/get_user_projects?userId=${userId}`
  
  // 开发环境：检查是否使用模拟数据
  if (shouldUseMock(url)) {
    return await getMockData(url, 'get', null)
  }
  
  return request({
    url,
    method: 'get'
  })
}
