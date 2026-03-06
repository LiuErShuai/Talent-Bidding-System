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
export function getHotProjectsAPI() {
  return request({
    url: '/project/hot_projects',
    method: 'get'
  })
}

// 获取最新项目
export function getLatestProjectsAPI() {
  return request({
    url: '/project/latest_projects',
    method: 'get'
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
