// 里程碑文件上传缓存 Store（思路一实现）
// 用于在前端记录已成功上传的交付物信息，便于后续提交审核时统一检查
// 仅存储轻量级元数据（文件名、URL、大小、上传时间），不缓存实际 File 对象

import { defineStore } from 'pinia'

export const useMilestoneUploadStore = defineStore('milestoneUpload', {
  state: () => ({
    // { [milestoneId]: [{ fileName, fileUrl, fileSize, uploadTime }] }
    uploadedFiles: {}
  }),
  getters: {
    getFiles: (state) => (milestoneId) => {
      return state.uploadedFiles[milestoneId] || []
    }
  },
  actions: {
    /**
     * 将一次成功的上传记录保存到缓存
     * @param {string} milestoneId
     * @param {{fileName:string, fileUrl:string, fileSize:number, uploadTime:string}} fileInfo
     */
    addUploadedFile(milestoneId, fileInfo) {
      if (!milestoneId) return
      if (!this.uploadedFiles[milestoneId]) {
        this.uploadedFiles[milestoneId] = []
      }
      this.uploadedFiles[milestoneId].push(fileInfo)
    },
    /**
     * 清除某里程碑的缓存（提交审核成功后调用）
     */
    clearUploadedFiles(milestoneId) {
      if (this.uploadedFiles[milestoneId]) {
        delete this.uploadedFiles[milestoneId]
      }
    }
  }
})
