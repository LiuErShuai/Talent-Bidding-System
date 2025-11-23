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
      const token = local.get(STORAGE_KEYS.TOKEN)
      const userInfo = local.get(STORAGE_KEYS.USER_INFO)
      const userRole = local.get(STORAGE_KEYS.USER_ROLE)
      
      if (token && userInfo) {
        this.token = token
        this.userInfo = userInfo
        this.userRole = userRole
        this.isLoggedIn = true
      }
    }
  }
})

