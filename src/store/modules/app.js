/**
 * 应用全局状态（主题、语言等）
 */
import { defineStore } from 'pinia'
import { local } from '@/utils/storage'
import { STORAGE_KEYS } from '@/utils/constants'

export const useAppStore = defineStore('app', {
  state: () => ({
    theme: local.get(STORAGE_KEYS.THEME) || 'light', // 主题：light/dark
    language: local.get(STORAGE_KEYS.LANGUAGE) || 'zh-CN', // 语言
    sidebarCollapsed: false, // 侧边栏是否折叠
    loading: false // 全局加载状态
  }),

  getters: {
    // 是否为暗色主题
    isDark: (state) => state.theme === 'dark'
  },

  actions: {
    /**
     * 切换主题
     */
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light'
      local.set(STORAGE_KEYS.THEME, this.theme)
    },

    /**
     * 设置主题
     * @param {string} theme 主题名称
     */
    setTheme(theme) {
      this.theme = theme
      local.set(STORAGE_KEYS.THEME, theme)
    },

    /**
     * 设置语言
     * @param {string} lang 语言代码
     */
    setLanguage(lang) {
      this.language = lang
      local.set(STORAGE_KEYS.LANGUAGE, lang)
    },

    /**
     * 切换侧边栏
     */
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed
    },

    /**
     * 设置加载状态
     * @param {boolean} loading 加载状态
     */
    setLoading(loading) {
      this.loading = loading
    }
  }
})

