import request from './request'

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
export function getUserInfoAPI() {
  return request({
    url: '/user_management/get_user_info',
    method: 'get'
  })
}
