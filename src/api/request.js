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
    // local.set 会 JSON.stringify，所以 localStorage 里存的是 '"token_value"'
    // 需要先 JSON.parse 还原，失败则当原始字符串用
    const raw = localStorage.getItem('token')
    let token = null
    if (raw) {
      try {
        token = JSON.parse(raw)
      } catch {
        token = raw
      }
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
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
    // 兼容 code 为 200 或 "0000" 的成功响应
    if (res.code !== 200 && res.code !== '0000') {
      // 认证失败：清除凭证，跳转首页
      if (res.code === 'ERR_AUTH_003' || res.code === 'ERR_AUTH_001' || res.code === 401) {
        handleAuthFailure(res.info || '登录凭证无效，请重新登录')
      }
      return Promise.reject(res)
    }
    return res
  },
  (error) => {
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
