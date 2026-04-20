import request from './request'

// 企业创建项目
export function createProjectAPI(data) {
  return request({
    url: '/project/create_project',
    method: 'post',
    data
  })
}

// 企业保存项目草稿
export function saveProjectDraftAPI(data) {
  return request({
    url: '/project/save_draft',
    method: 'post',
    data
  })
}

// 更新项目信息
export function updateProjectAPI(data) {
  return request({
    url: '/project/update_project',
    method: 'post',
    data
  })
}

// 查看项目详细信息
export function getProjectDetailAPI(projectId) {
  return request({
    url: `/project/detail/${projectId}`,
    method: 'get'
  })
}

// 企业查询旗下项目列表
export function getMyProjectsAPI(params = {}) {
  return request({
    url: '/project/my_projects',
    method: 'get',
    params
  })
}

// 企业查询项目竞榜列表
export function getProjectBidsAPI(projectId, params = {}) {
  return request({
    url: `/bid/project/${projectId}`,
    method: 'get',
    params
  })
}

// 入围竞榜
export function shortlistBidAPI(data) {
  return request({
    url: '/bid/shortlist',
    method: 'post',
    data
  })
}

// 确认中标
export function confirmBidAPI(data) {
  return request({
    url: '/bid/confirm',
    method: 'post',
    data
  })
}

// 拒绝竞榜
export function rejectBidAPI(data) {
  return request({
    url: '/bid/reject',
    method: 'post',
    data
  })
}

// 查询团队详情
export function getTeamDetailAPI(teamId) {
  return request({
    url: `/team/detail/${teamId}`,
    method: 'get'
  })
}

// ========== 里程碑相关 API ==========

// 查询全部里程碑模板
export function getAllMilestoneTemplatesAPI() {
  return request({
    url: '/milestone/template/all',
    method: 'get'
  })
}

// 查询可选里程碑模板
export function getOptionalMilestoneTemplatesAPI() {
  return request({
    url: '/milestone/template/optional',
    method: 'get'
  })
}

// 查询项目里程碑列表
export function getMilestonesByProjectAPI(projectId) {
  return request({
    url: `/milestone/project/${projectId}`,
    method: 'get'
  })
}

// 获取里程碑详情
export function getMilestoneDetailAPI(milestoneId) {
  return request({
    url: `/milestone/${milestoneId}`,
    method: 'get'
  })
}

// 添加可选里程碑
export function addOptionalMilestonesAPI(data) {
  return request({
    url: '/milestone/template/create',
    method: 'post',
    data
  })
}

// 更新里程碑信息
export function updateMilestoneAPI(data) {
  return request({
    url: '/milestone/update',
    method: 'post',
    data
  })
}

// 提交审核
export function submitReviewAPI(projectId) {
  return request({
    url: `/project/submit_review/${projectId}`,
    method: 'post'
  })
}

// 直接发布草稿（跳过审核）
export function publishDraftAPI(projectId) {
  return request({
    url: `/project/publish_draft/${projectId}`,
    method: 'post'
  })
}


// 搜索项目
export function searchProjectAPI(data) {
  return request({
    url: '/project/search_projects',
    method: 'post',
    data
  })
}

// 获取热门项目
export function getHotProjectsAPI(params = {}) {
  return request({
    url: '/project/popular',
    method: 'get',
    params
  })
}

// 获取最新项目
export function getLatestProjectsAPI(params = {}) {
  return request({
    url: '/project/latest',
    method: 'get',
    params
  })
}

// 查看待审核项目
export function getPendingProjectsAPI() {
  return request({
    url: '/project/pending_projects',
    method: 'get'
  })
}

// 审核项目
export function auditProjectAPI(projectId, data) {
  return request({
    url: `/project/audit_project/${projectId}`,
    method: 'get', // 如果后端是 POST，可改成 post
    data
  })
}

// 创建项目分类
export function createProjectCategoryAPI(data) {
  return request({
    url: '/project/create_category',
    method: 'post',
    data
  })
}

// ========== 项目详情页相关 API ==========

// 学生申请竞榜
export function applyBidAPI(data) {
  return request({
    url: '/bid/apply',
    method: 'post',
    data
  })
}

// 提交里程碑成果（URL方式）
export function submitMilestoneDeliverableAPI(data) {
  return request({
    url: '/milestone/deliverable',
    method: 'post',
    data
  })
}

// 审批里程碑
export function approveMilestoneAPI(data) {
  return request({
    url: '/milestone/approve',
    method: 'post',
    data
  })
}

// 更新里程碑状态
export function updateMilestoneStatusAPI(data) {
  return request({
    url: '/milestone/status',
    method: 'post',
    data
  })
}

// 跳过里程碑
export function skipMilestoneAPI(data) {
  return request({
    url: '/milestone/skip',
    method: 'post',
    data
  })
}

// 上传里程碑交付物文件
export function uploadMilestoneDeliverableFileAPI(formData) {
  return request({
    url: '/milestone/deliverable/files/upload',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 切换项目关注状态
export function toggleFavoriteProjectAPI(projectId) {
  return request({
    url: `/project/favorite/${projectId}`,
    method: 'post'
  })
}

// ========== 学生端专用 API ==========

// 获取已发布项目列表
export function getPublishedProjectsAPI(params = {}) {
  return request({
    url: '/project/published',
    method: 'get',
    params
  })
}

// 取消竞榜申请
export function cancelBidAPI(bidId) {
  return request({
    url: `/bid/cancel/${bidId}`,
    method: 'post'
  })
}

// 学生查询承接的项目列表
export function getMyAcceptedProjectsAPI(params = {}) {
  return request({
    url: '/project/my_accepted_projects',
    method: 'get',
    params
  })
}

// 公开查询项目揭榜名单
export function getPublicProjectBidsAPI(projectId) {
  return request({
    url: `/bid/public/project/${projectId}`,
    method: 'get'
  })
}

// 学生查询我的揭榜记录
export function getMyBidsAPI() {
  return request({
    url: '/bid/student/my-bids',
    method: 'get'
  })
}

// 查询揭榜详情
export function getBidDetailAPI(bidId) {
  return request({
    url: `/bid/detail/${bidId}`,
    method: 'get'
  })
}

// ========== 管理员审核相关 API ==========

// 管理员获取待审核项目列表
export function getAdminPendingProjectsAPI(params = {}) {
  return request({
    url: '/project/admin/pending_review',
    method: 'get',
    params
  })
}

// 管理员审核通过项目
export function approveProjectAPI(projectId) {
  return request({
    url: `/project/admin/approve/${projectId}`,
    method: 'post'
  })
}

// 管理员拒绝项目
export function rejectProjectAPI(data) {
  return request({
    url: '/project/admin/reject',
    method: 'post',
    data
  })
}

// 管理员查看项目详情
export function getAdminProjectDetailAPI(projectId) {
  return request({
    url: `/project/admin/detail/${projectId}`,
    method: 'get'
  })
}

// 管理员获取待审核企业列表
export function getAdminPendingEnterprisesAPI(params = {}) {
  return request({
    url: '/user_management/admin/company/pending_review',
    method: 'get',
    params
  })
}

// 管理员审核通过企业
export function approveEnterpriseAPI(userId) {
  return request({
    url: `/user_management/admin/company/approve/${userId}`,
    method: 'post'
  })
}

// 管理员拒绝企业
export function rejectEnterpriseAPI(userId, reason) {
  return request({
    url: `/user_management/admin/company/reject/${userId}`,
    method: 'post',
    data: { reason }
  })
}

// ========== 项目分类管理 API ==========

// 获取所有项目分类
export function getAllCategoriesAPI() {
  return request({
    url: '/project/category/all',
    method: 'get'
  })
}

// 获取分类详情
export function getCategoryDetailAPI(categoryId) {
  return request({
    url: `/project/category/${categoryId}`,
    method: 'get'
  })
}

// 创建项目分类
export function createCategoryAPI(data) {
  return request({
    url: '/project/admin/category/create',
    method: 'post',
    data
  })
}

// 更新项目分类
export function updateCategoryAPI(data) {
  return request({
    url: '/project/admin/category/update',
    method: 'post',
    data
  })
}

// 删除项目分类
export function deleteCategoryAPI(categoryId) {
  return request({
    url: `/project/admin/category/${categoryId}`,
    method: 'delete'
  })
}
