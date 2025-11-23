import request from './request'

// 企业创建项目
export function createProjectAPI(data) {
  return request({
    url: '/project_management/create_project',
    method: 'post',
    data
  })
}

// 企业保存项目草稿
export function saveProjectDraftAPI(data) {
  return request({
    url: '/project_management/save_project_draft',
    method: 'post',
    data
  })
}

// 更新项目信息
export function updateProjectAPI(data) {
  return request({
    url: '/project_management/update_project',
    method: 'post',
    data
  })
}

// 查看项目详细信息
export function getProjectDetailAPI(projectId) {
  return request({
    url: `/project_management/project/${projectId}`,
    method: 'get'
  })
}

// 企业查询旗下项目列表
export function getMyProjectsAPI() {
  return request({
    url: '/project_management/my_projects',
    method: 'get'
  })
}

// 浏览已发布项目列表
export function getPublishedProjectsAPI() {
  return request({
    url: '/project_management/published_projects',
    method: 'get'
  })
}

// 搜索项目
export function searchProjectAPI(data) {
  return request({
    url: '/project_management/search_projects',
    method: 'post',
    data
  })
}

// 获取热门项目
export function getHotProjectsAPI() {
  return request({
    url: '/project_management/hot_projects',
    method: 'get'
  })
}

// 获取最新项目
export function getLatestProjectsAPI() {
  return request({
    url: '/project_management/latest_projects',
    method: 'get'
  })
}

// 查看待审核项目
export function getPendingProjectsAPI() {
  return request({
    url: '/project_management/pending_projects',
    method: 'get'
  })
}

// 审核项目
export function auditProjectAPI(projectId, data) {
  return request({
    url: `/project_management/audit_project/${projectId}`,
    method: 'get', // 如果后端是 POST，可改成 post
    data
  })
}

// 创建项目分类
export function createProjectCategoryAPI(data) {
  return request({
    url: '/project_management/create_category',
    method: 'post',
    data
  })
}
