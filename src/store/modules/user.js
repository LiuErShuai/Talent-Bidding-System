/**
 * 用户信息管理（扩展用户相关状态）
 */
import { defineStore } from 'pinia'
import { getUserInfoAPI, getUserProjectsAPI } from '@/api/user'
import { ElMessage } from 'element-plus'

export const useUserStore = defineStore('user', {
  state: () => ({
    profile: null, // 用户详细资料
    skills: [], // 技能标签
    projects: [], // 用户参与的项目
    teams: [], // 用户所在的团队
    loading: false // 加载状态
  }),

  getters: {
    // 用户完整信息
    fullUserInfo: (state) => state.profile,
    
    // 技能数量
    skillCount: (state) => state.skills.length,
    
    // 项目数量
    projectCount: (state) => state.projects.length
  },

  actions: {
    /**
     * 设置用户资料
     * @param {object} profile 用户资料
     */
    setProfile(profile) {
      this.profile = profile
      // 同步更新技能标签
      if (profile?.skills) {
        this.skills = profile.skills
      }
    },

    /**
     * 设置技能标签
     * @param {array} skills 技能标签数组
     */
    setSkills(skills) {
      this.skills = skills
    },

    /**
     * 设置项目列表
     * @param {array} projects 项目数组
     */
    setProjects(projects) {
      this.projects = projects
    },

    /**
     * 设置团队列表
     * @param {array} teams 团队数组
     */
    setTeams(teams) {
      this.teams = teams
    },

    /**
     * 获取用户详细信息
     */
    async fetchUserProfile() {
      try {
        this.loading = true
        const result = await getUserInfoAPI()
        
        if (result.code === 200 && result.data) {
          this.setProfile(result.data)
          // 如果有项目经历，也设置到projects中
          if (result.data.projectExperiences) {
            this.setProjects(result.data.projectExperiences)
          }
          return result.data
        } else {
          ElMessage.error(result.message || '获取用户信息失败')
          return null
        }
      } catch (error) {
        console.error('Fetch user profile error:', error)
        ElMessage.error('获取用户信息失败')
        return null
      } finally {
        this.loading = false
      }
    },

    /**
     * 获取用户项目经历
     * @param {string} userId 用户ID
     */
    async fetchUserProjects(userId) {
      try {
        const result = await getUserProjectsAPI(userId)
        
        if (result.code === 200 && result.data) {
          this.setProjects(result.data.projects || [])
          return result.data.projects || []
        } else {
          ElMessage.error(result.message || '获取项目经历失败')
          return []
        }
      } catch (error) {
        console.error('Fetch user projects error:', error)
        ElMessage.error('获取项目经历失败')
        return []
      }
    }
  }
})

