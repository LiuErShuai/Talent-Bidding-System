// src/api/enterprise.js
// API 封装用于企业信息中心（/enterprise/profile）

import request from './request'

/**
 * 获取企业完整信息（包含扩展字段）
 * @param {string} userId - 企业用户 ID（从 authStore 获取）
 */
export function getEnterpriseProfile(userId) {
  return request({
    url: `/user_management/profile/${userId}`,
    method: 'get'
  })
}

/**
 * 更新企业非核心字段（简介、标签、官网、地区等）
 * @param {object} data - { companyIntro?, companyTags?, companyWebsite?, companyRegion? }
 */
export function updateEnterpriseProfile(data) {
  return request({
    url: '/user_management/company/update_profile',
    method: 'post',
    data
  })
}

/**
 * 上传资质文件（图片 / PDF）
 * @param {File} file - 需要上传的文件对象
 */
export function uploadQualification(file) {
  const form = new FormData()
  form.append('file', file)
  return request({
    url: '/user_management/company/upload_qualification',
    method: 'post',
    data: form,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

/**
 * 提交企业认证（核心字段 + 资质文件列表）
 * @param {object} data - 包含 core fields 与 fileUrls[]
 */
export function submitEnterpriseQualification(data) {
  return request({
    url: '/user_management/company/submit_qualification',
    method: 'post',
    data
  })
}
