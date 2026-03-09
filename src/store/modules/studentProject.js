import { defineStore } from 'pinia'
import { getMyProjectsAPI, getMyAcceptedProjectsAPI, getProjectDetailAPI } from '@/api/project'
import { getMyTeamListAPI, getTeamDetailAPI } from '@/api/team'
import { getMilestonesByProjectAPI } from '@/api/project'
import { handleApiError, STATUS_TEXT_MAP, STAGE_TEXT_MAP } from '@/utils/errorHandler'

export const useStudentProjectStore = defineStore('studentProject', {
  state: () => ({
    projects: [],
    teams: [],
    loading: false,
    error: null
  }),

  getters: {
    // 按状态分组的项目
    projectsByStatus: (state) => {
      const groups = {}
      state.projects.forEach(project => {
        const status = project.status || 'unknown'
        if (!groups[status]) groups[status] = []
        groups[status].push(project)
      })
      return groups
    },

    // 我负责的团队
    ownedTeams: (state) => {
      return state.teams.filter(team => team.isOwner)
    },

    // 我参与的团队
    joinedTeams: (state) => {
      return state.teams.filter(team => !team.isOwner)
    }
  },

  actions: {
    // 获取我的项目列表
    async fetchMyProjects(params = {}) {
      this.loading = true
      this.error = null
      try {
        // 优先使用新API获取学生承接的项目
        let response = await getMyAcceptedProjectsAPI(params)
        if (response.code === '0000') {
          this.projects = response.data.list.map(this.formatAcceptedProjectData)
          return
        }
      } catch (error) {
        console.warn('新API调用失败，使用旧API降级:', error.message)
      }

      try {
        // 降级使用旧API
        const response = await getMyProjectsAPI(params)
        if (response.code === '0000') {
          this.projects = response.data.map(this.formatProjectData)
        }
      } catch (error) {
        this.error = error.message
        handleApiError(error)
      } finally {
        this.loading = false
      }
    },

    // 获取我的团队列表
    async fetchMyTeams() {
      try {
        const response = await getMyTeamListAPI()
        if (response.code === '0000') {
          this.teams = response.data.map(this.formatTeamData)
        }
      } catch (error) {
        this.error = error.message
        handleApiError(error)
      }
    },

    // 格式化承接项目数据（新API）
    formatAcceptedProjectData(project) {
      return {
        id: project.projectId,
        name: project.title,
        status: project.status,
        statusText: this.getStatusText(project.status),
        stage: project.stage || 'ongoing',
        stageText: this.getStageText(project.stage),
        progress: project.progress || 0,
        remainDays: this.calculateRemainDays(project.applicationDeadline),
        reward: project.budgetAmount || 0,
        publisher: project.publisherName || '未知',
        brief: project.description || '',
        canUpload: ['executing', 'in_progress'].includes(project.status),
        uploadLabel: '上传成果',
        canCollaborate: project.status === 'executing'
      }
    },

    // 格式化项目数据（旧API兼容）
    formatProjectData(project) {
      return {
        id: project.projectId,
        name: project.title,
        status: project.status,
        statusText: this.getStatusText(project.status),
        stage: project.stage || 'ongoing',
        stageText: this.getStageText(project.stage),
        progress: project.progress || 0,
        remainDays: this.calculateRemainDays(project.expectedEndDate),
        reward: project.budgetAmount || 0,
        publisher: project.publisherName || '未知',
        brief: project.description || '',
        canUpload: ['in_progress', 'ongoing'].includes(project.status),
        uploadLabel: '上传成果',
        canCollaborate: project.status === 'in_progress'
      }
    },

    // 格式化团队数据
    formatTeamData(team) {
      return {
        id: team.teamId,
        name: team.teamName,
        isOwner: team.isOwner || false,
        description: team.description || '',
        project: {
          id: team.projectId,
          name: team.projectName || '未关联项目',
          stage: team.projectStage || '未知',
          statusText: this.getStatusText(team.projectStatus),
          progress: team.projectProgress || 0,
          deadline: team.projectDeadline,
          brief: team.projectBrief || ''
        },
        members: team.members || []
      }
    },

    // 获取状态文本
    getStatusText(status) {
      return STATUS_TEXT_MAP[status] || '未知状态'
    },

    // 获取阶段文本
    getStageText(stage) {
      return STAGE_TEXT_MAP[stage] || '进行中'
    },

    // 计算剩余天数
    calculateRemainDays(endDate) {
      if (!endDate) return 0
      const end = new Date(endDate)
      const now = new Date()
      const diffTime = end - now
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      return Math.max(0, diffDays)
    }
  }
})