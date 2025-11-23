/**
 * 项目状态管理
 */
import { defineStore } from 'pinia'
import { getMyProjectsAPI } from '@/api/project'

export const useProjectStore = defineStore('project', {
  state: () => ({
    projects: [], // 项目列表
    currentProject: null, // 当前查看的项目
    filters: {
      status: '',
      field: '',
      keyword: ''
    }
  }),

  getters: {
    // 进行中的项目
    activeProjects: (state) => {
      return state.projects.filter(p => 
        p.status === 'in_progress' || p.status === 'open'
      )
    },

    // 已完成的项目
    completedProjects: (state) => {
      return state.projects.filter(p => p.status === 'completed')
    },

    // 根据状态筛选项目
    projectsByStatus: (state) => (status) => {
      return state.projects.filter(p => p.status === status)
    }
  },

  actions: {
    /**
     * 获取项目列表
     */
    async fetchProjects() {
      try {
        this.projects = await getMyProjectsAPI()
      } catch (error) {
        console.error('获取项目列表失败:', error)
        throw error
      }
    },

    /**
     * 设置当前项目
     * @param {object} project 项目对象
     */
    setCurrentProject(project) {
      this.currentProject = project
    },

    /**
     * 更新项目
     * @param {string} projectId 项目ID
     * @param {object} updates 更新数据
     */
    updateProject(projectId, updates) {
      const index = this.projects.findIndex(p => p.id === projectId)
      if (index !== -1) {
        this.projects[index] = { ...this.projects[index], ...updates }
      }
    },

    /**
     * 设置筛选条件
     * @param {object} filters 筛选条件
     */
    setFilters(filters) {
      this.filters = { ...this.filters, ...filters }
    },

    /**
     * 重置筛选条件
     */
    resetFilters() {
      this.filters = {
        status: '',
        field: '',
        keyword: ''
      }
    }
  }
})

