import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/store/modules/auth'
import router from '@/router'


const request = axios.create({
  baseURL: '/api/v1',
  timeout: 10000
})

request.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()

    // 优先使用 Pinia 中的 token，兜底读取 localStorage
    let token = authStore.token || ''
    if (!token) {
      const raw = localStorage.getItem('token')
      if (raw) {
        try {
          token = JSON.parse(raw)
        } catch {
          token = raw
        }
      }
    }

    // 过滤无效 token
    if (token === 'null' || token === 'undefined') {
      token = ''
    }

    if (token) {
      // 注意：后端不需要 "Bearer " 前缀，直接发送 token
      config.headers.Authorization = token
    } else {
      console.warn('[请求拦截器] 未找到 token')
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 是否正在处理登出（防止多个请求同时触发）
let isLoggingOut = false

request.interceptors.response.use(
  (response) => {
    const res = response.data

    // 调试日志：记录响应详情
    console.log('[响应拦截器] 请求 URL:', response.config.url)
    console.log('[响应拦截器] 请求方法:', response.config.method)
    console.log('[响应拦截器] 请求 headers:', response.config.headers)
    console.log('[响应拦截器] HTTP 状态码:', response.status)
    console.log('[响应拦截器] 业务响应码:', res.code)
    console.log('[响应拦截器] 响应数据:', res)

    // 兼容 code 为 200 或 "0000" 的成功响应
    if (res.code !== 200 && res.code !== '0000') {
      // 认证失败：清除凭证，跳转首页
      if (res.code === 'ERR_AUTH_003' || res.code === 'ERR_AUTH_001' || res.code === 401) {
        console.error('[响应拦截器] 认证失败，错误码:', res.code, '错误信息:', res.info)
        handleAuthFailure(res.info || '登录凭证无效，请重新登录')
      }
      return Promise.reject(res)
    }
    return res
  },
  (error) => {
    console.error('[响应拦截器] HTTP 错误:', error)
    console.error('[响应拦截器] 错误响应:', error.response)

    // HTTP 401 状态码处理
    if (error.response && error.response.status === 401) {
      handleAuthFailure('登录已过期，请重新登录')
    }
    return Promise.reject(error)
  }
)

// 认证失败统一处理：清除凭证 + 跳转首页 + 弹出登录弹窗
function handleAuthFailure(message) {
  if (isLoggingOut) return
  isLoggingOut = true

  // 通过 Pinia store 统一清除认证状态（包括 localStorage）
  const authStore = useAuthStore()
  authStore.logout()
  // 兼容清除旧 key
  localStorage.removeItem('userData')

  ElMessage.error(message)

  // 跳转到首页
  router.push('/home')

  // 弹出登录弹窗
  setTimeout(() => {
    window.dispatchEvent(
      new CustomEvent('open-auth-dialog', {
        detail: { mode: 'login', redirect: window.location.pathname }
      })
    )
  }, 300)

  // 防抖：2秒后允许再次触发
  setTimeout(() => {
    isLoggingOut = false
  }, 2000)
}

export default request
