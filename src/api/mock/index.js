/**
 * API模拟数据总入口
 * 开发环境自动启用，生产环境自动禁用
 */

import { mockGetUserInfo, mockUpdateUserInfo, mockUploadAvatar, mockGetUserProjects } from './user'

// 判断是否为开发环境
const isDevelopment = import.meta.env.DEV

/**
 * 模拟数据映射表
 * key: API路径（不含baseURL）
 * value: 模拟数据函数
 */
const mockMap = {
  '/user_management/get_user_info': mockGetUserInfo,
  '/user_management/update_user_info': mockUpdateUserInfo,
  '/user_management/upload_avatar': mockUploadAvatar,
  '/project/get_user_projects': mockGetUserProjects
}

/**
 * 检查是否应该使用模拟数据
 */
export const shouldUseMock = (url) => {
  if (!isDevelopment) {
    return false
  }

  // 检查URL是否在模拟映射表中
  return Object.keys(mockMap).some(key => url.includes(key))
}

/**
 * 获取模拟数据
 */
export const getMockData = async (url, method = 'get', data = null) => {
  if (!shouldUseMock(url)) {
    return null
  }

  // 找到对应的模拟函数
  const mockKey = Object.keys(mockMap).find(key => url.includes(key))
  if (!mockKey) {
    return null
  }

  const mockFunction = mockMap[mockKey]

  try {
    // 根据方法类型传递参数
    if (method.toLowerCase() === 'get') {
      // GET请求：从URL中提取参数
      const urlParams = new URLSearchParams(url.split('?')[1] || '')
      const userId = urlParams.get('userId') || urlParams.get('id')
      return await mockFunction(userId)
    } else {
      // POST/PUT请求：传递data
      return await mockFunction(data)
    }
  } catch (error) {
    console.error('Mock data error:', error)
    return null
  }
}

/**
 * 导出模拟数据函数（供直接调用）
 */
export {
  mockGetUserInfo,
  mockUpdateUserInfo,
  mockUploadAvatar,
  mockGetUserProjects
}

















