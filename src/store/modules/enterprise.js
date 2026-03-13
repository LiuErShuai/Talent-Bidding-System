import { defineStore } from 'pinia'
import { getEnterpriseProfile, updateEnterpriseProfile, uploadQualification, submitEnterpriseQualification } from '@/api/enterprise'
import { ElMessage } from 'element-plus'

export const useEnterpriseStore = defineStore('enterprise', {
  state: () => ({
    profile: null,
    loading: false
  }),
  getters: {
    // 直接返回 profile，若未加载返回空对象
    enterpriseInfo: (state) => state.profile || {}
  },
  actions: {
    /**
     * 拉取企业完整信息
     * @param {string} userId 企业用户 ID
     */
    async fetchEnterpriseProfile(userId) {
      try {
        this.loading = true
        const res = await getEnterpriseProfile(userId)
        // 接口统一返回 {code, info, data}
        if (res.code === '0000' || res.code === 200) {
          this.profile = res.data
          return res.data
        } else {
          ElMessage.error(res.info || '获取企业信息失败')
          return null
        }
      } catch (e) {
        console.error('fetchEnterpriseProfile error', e)
        ElMessage.error('获取企业信息异常')
        return null
      } finally {
        this.loading = false
      }
    },
    /**
     * 更新企业非核心信息
     * @param {object} data 更新字段对象
     */
    async updateProfile(data) {
      try {
        const res = await updateEnterpriseProfile(data)
        if (res.code === '0000' || res.code === 200) {
          ElMessage.success('企业信息已更新')
          // 重新拉取最新信息
          if (this.profile?.userId) {
            await this.fetchEnterpriseProfile(this.profile.userId)
          }
        } else {
          ElMessage.error(res.info || '更新企业信息失败')
        }
      } catch (e) {
        console.error('updateProfile error', e)
        ElMessage.error('更新企业信息异常')
      }
    },
    /**
     * 上传资质文件
     * @param {File} file 文件对象
     * @returns {string|null} 返回文件 URL 或 null
     */
    async uploadFile(file) {
      try {
        const res = await uploadQualification(file)
        if (res.code === '0000' || res.code === 200) {
          ElMessage.success('文件上传成功')
          return res.data
        }
        ElMessage.error(res.info || '文件上传失败')
        return null
      } catch (e) {
        console.error('uploadFile error', e)
        ElMessage.error('文件上传异常')
        return null
      }
    },
    /**
     * 提交企业认证（核心字段+资质文件）
     * @param {object} data 认证信息对象
     */
    async submitQualification(data) {
      try {
        const res = await submitEnterpriseQualification(data)
        if (res.code === '0000' || res.code === 200) {
          ElMessage.success('认证提交成功，待审核')
          // 刷新信息
          if (this.profile?.userId) {
            await this.fetchEnterpriseProfile(this.profile.userId)
          }
        } else {
          ElMessage.error(res.info || '认证提交失败')
        }
      } catch (e) {
        console.error('submitQualification error', e)
        ElMessage.error('认证提交异常')
      }
    }
  }
})
