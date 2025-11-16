import { defineStore } from 'pinia'
import { getMyProjectsAPI } from '../api/project'

export const useProjectStore = defineStore('project', {
  state: () => ({
    projects: []
  }),
  actions: {
    async fetchProjects() {
      this.projects = await getMyProjectsAPI()
    }
  }
})
