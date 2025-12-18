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
    isLoggedIn: false
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
      this.token = token
      this.userInfo = userData
      this.userRole = userData.role || ''
      this.isLoggedIn = true
      
      // 保存到本地存储
      local.set(STORAGE_KEYS.TOKEN, token)
      local.set(STORAGE_KEYS.USER_INFO, userData)
      local.set(STORAGE_KEYS.USER_ROLE, this.userRole)
    },

    /**
     * 退出登录
     */
    logout() {
      this.token = ''
      this.userInfo = {}
      this.userRole = ''
      this.isLoggedIn = false
      
      // 清除本地存储
      local.remove(STORAGE_KEYS.TOKEN)
      local.remove(STORAGE_KEYS.USER_INFO)
      local.remove(STORAGE_KEYS.USER_ROLE)
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
      
      if (token && userInfo) {
        this.token = token
        this.userInfo = userInfo
        this.userRole = userRole
        this.isLoggedIn = true
      } else {
        // 如果没有token或userInfo，确保状态为未登录
        this.isLoggedIn = false
      }
    }
  }
})

