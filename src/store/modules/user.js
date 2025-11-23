/**
 * 用户信息管理（扩展用户相关状态）
 */
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    profile: null, // 用户详细资料
    skills: [], // 技能标签
    projects: [], // 用户参与的项目
    teams: [] // 用户所在的团队
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
    }
  }
})

