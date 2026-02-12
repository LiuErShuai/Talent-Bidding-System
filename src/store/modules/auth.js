/**
 * 认证状态管理（原user.js重命名）
 */
import { defineStore } from 'pinia'
import { local } from '@/utils/storage'
import { STORAGE_KEYS } from '@/utils/constants'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: local.get(STORAGE_KEYS.TOKEN) || '',
    userInfo: local.get(STORAGE_KEYS.USER_INFO) || {},
    userRole: local.get(STORAGE_KEYS.USER_ROLE) || '',
    isLoggedIn: false,
    loginTime: local.get('loginTime') || null // 登录时间戳
  }),

  getters: {
    // 是否已登录
    isAuthenticated: (state) => !!state.token && state.isLoggedIn,
    
    // 用户角色
    role: (state) => state.userRole,
    
    // 用户名
    username: (state) => state.userInfo?.username || '',
    
    // 用户头像
    avatar: (state) => state.userInfo?.avatar || ''
  },

  actions: {
    /**
     * 登录
     * @param {object} userData 用户数据
     * @param {string} token 认证令牌
     */
    login(userData, token) {
      const now = Date.now()

      this.token = token
      this.userInfo = userData
      this.userRole = userData.role || userData.type?.toLowerCase() || ''
      this.isLoggedIn = true
      this.loginTime = now

      // 保存到本地存储
      local.set(STORAGE_KEYS.TOKEN, token)
      local.set(STORAGE_KEYS.USER_INFO, userData)
      local.set(STORAGE_KEYS.USER_ROLE, this.userRole)
      local.set('loginTime', now)
    },

    /**
     * 退出登录
     */
    logout() {
      this.token = ''
      this.userInfo = {}
      this.userRole = ''
      this.isLoggedIn = false
      this.loginTime = null

      // 清除本地存储
      local.remove(STORAGE_KEYS.TOKEN)
      local.remove(STORAGE_KEYS.USER_INFO)
      local.remove(STORAGE_KEYS.USER_ROLE)
      local.remove('loginTime')

      // 清除可能残留的旧 key
      localStorage.removeItem('userData')

      // 清除 sessionStorage 中的待处理弹窗请求
      try {
        sessionStorage.removeItem('pendingAuthDialog')
      } catch {
        // 忽略 sessionStorage 不可用的情况
      }
    },

    /**
     * 更新用户信息
     * @param {object} userData 用户数据
     */
    updateUserInfo(userData) {
      this.userInfo = { ...this.userInfo, ...userData }
      local.set(STORAGE_KEYS.USER_INFO, this.userInfo)
    },

    /**
     * 初始化认证状态（从本地存储恢复）
     */
    initAuth() {
      // 优先从local.get读取（使用JSON格式）
      let token = local.get(STORAGE_KEYS.TOKEN)
      let userInfo = local.get(STORAGE_KEYS.USER_INFO)
      let userRole = local.get(STORAGE_KEYS.USER_ROLE)
      let loginTime = local.get('loginTime')

      // 兼容旧的存储方式（直接使用localStorage.getItem，字符串格式）
      if (!token) {
        const rawToken = localStorage.getItem('token')
        if (rawToken) {
          try {
            // 尝试解析JSON，如果失败则当作字符串
            token = JSON.parse(rawToken)
          } catch {
            token = rawToken
          }
        }
      }

      if (!userInfo) {
        const rawUserInfo = localStorage.getItem('userInfo') || localStorage.getItem('userData')
        if (rawUserInfo) {
          try {
            userInfo = JSON.parse(rawUserInfo)
          } catch {
            userInfo = null
          }
        }
      }

      if (!userRole) {
        userRole = localStorage.getItem('userRole') || ''
      }

      if (!loginTime) {
        const rawLoginTime = localStorage.getItem('loginTime')
        if (rawLoginTime) {
          try {
            loginTime = JSON.parse(rawLoginTime)
          } catch {
            loginTime = null
          }
        }
      }

      // 检查 token 和 userInfo 是否存在
      if (token && userInfo) {
        // 检查 token 是否过期（24小时最大有效期）
        const MAX_TOKEN_AGE = 24 * 60 * 60 * 1000 // 24小时
        const now = Date.now()

        // 如果没有 loginTime，说明是旧数据（升级前的数据），清除并要求重新登录
        if (!loginTime) {
          console.warn('检测到旧版本登录数据，需要重新登录')
          this.logout()
          this.isLoggedIn = false
          return
        }

        // 检查 token 是否超过最大有效期
        if (now - loginTime > MAX_TOKEN_AGE) {
          console.warn('Token 已过期（超过24小时），需要重新登录')
          this.logout()
          this.isLoggedIn = false
        } else {
          // Token 有效，恢复登录状态
          this.token = token
          this.userInfo = userInfo
          this.userRole = userRole
          this.loginTime = loginTime
          this.isLoggedIn = true
        }
      } else {
        // 如果没有token或userInfo，确保状态为未登录
        this.isLoggedIn = false
      }
    }
  }
})

