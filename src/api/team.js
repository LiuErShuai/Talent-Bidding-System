import request from './request'

// 创建团队
export function createTeamAPI(data) {
  return request({
    url: '/team/create',
    method: 'post',
    data
  })
}

// 获取我的团队列表
export function getMyTeamListAPI(params = {}) {
  return request({
    url: '/team/my/list',
    method: 'get',
    params
  })
}

// 获取我的团队（单个）
export function getMyTeamAPI() {
  return request({
    url: '/team/my',
    method: 'get'
  })
}

// 获取团队详情
export function getTeamDetailAPI(teamId) {
  return request({
    url: `/team/detail/${teamId}`,
    method: 'get'
  })
}

// 更新团队信息
export function updateTeamAPI(data) {
  return request({
    url: '/team/update',
    method: 'post',
    data
  })
}

// 解散团队
export function disbandTeamAPI(teamId) {
  return request({
    url: `/team/disband/${teamId}`,
    method: 'post'
  })
}

// 邀请成员加入团队
export function inviteTeamMemberAPI(data) {
  return request({
    url: '/team/invite',
    method: 'post',
    data
  })
}

// 获取我的团队邀请
export function getMyTeamInvitesAPI(params = {}) {
  return request({
    url: '/team/invite/my',
    method: 'get',
    params
  })
}

// 处理团队邀请
export function handleTeamInviteAPI(data) {
  return request({
    url: '/team/invite/handle',
    method: 'post',
    data
  })
}
