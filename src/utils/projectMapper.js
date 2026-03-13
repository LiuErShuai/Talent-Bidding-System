/**
 * 项目管理页面数据映射工具
 * 用于将后端API数据格式转换为前端页面所需格式
 */

import dayjs from 'dayjs'

// 项目状态映射
export function mapProjectStatus(apiStatus) {
  const map = {
    'draft': 'pending',
    'pending_review': 'pending',
    'rejected': 'cancelled',
    'published': 'bidding',
    'in_progress': 'in-progress',
    'completed': 'completed',
    'closed': 'cancelled'
  }
  return map[apiStatus] || 'pending'
}

// 项目状态文本
export function getProjectStatusText(apiStatus) {
  const map = {
    'draft': '草稿',
    'pending_review': '待审核',
    'rejected': '已拒绝',
    'published': '揭榜中',
    'in_progress': '进行中',
    'completed': '已完成',
    'closed': '已关闭'
  }
  return map[apiStatus] || '未知'
}

// 里程碑状态映射
export function mapMilestoneStatus(apiStatus) {
  const map = {
    'planned': 'pending',
    'in_progress': 'in-progress',
    'delivered': 'in-progress',
    'under_review': 'in-progress',
    'completed': 'completed',
    'rejected': 'skipped',
    'expired': 'skipped',
    'skipped': 'skipped'
  }
  return map[apiStatus] || 'pending'
}

// 里程碑状态文本
export function getMilestoneStatusText(apiStatus) {
  const map = {
    'planned': '待开始',
    'in_progress': '进行中',
    'delivered': '已交付',
    'under_review': '评审中',
    'completed': '已完成',
    'rejected': '已拒绝',
    'expired': '已过期',
    'skipped': '已跳过'
  }
  return map[apiStatus] || '待开始'
}

// 时间格式化
export function formatDate(isoString) {
  if (!isoString) return ''
  return dayjs(isoString).format('YYYY-MM-DD')
}

export function formatDateTime(isoString) {
  if (!isoString) return ''
  return dayjs(isoString).format('YYYY-MM-DD HH:mm')
}

// 计算延期天数
export function calculateDelayDays(plannedEndTime, actualEndTime) {
  if (!plannedEndTime) return 0
  const planned = new Date(plannedEndTime)
  const actual = actualEndTime ? new Date(actualEndTime) : new Date()
  const diff = actual - planned
  return diff > 0 ? Math.ceil(diff / (1000 * 60 * 60 * 24)) : 0
}

// 项目数据映射
export function mapProjectData(apiData) {
  return {
    id: apiData.projectId,
    name: apiData.title,
    status: mapProjectStatus(apiData.status),
    statusText: getProjectStatusText(apiData.status),
    progress: apiData.progress || 0,
    reward: apiData.budgetAmount,
    startDate: formatDate(apiData.expectedStartDate),
    endDate: formatDate(apiData.expectedEndDate),
    category: apiData.categoryId,
    publisher: apiData.publisherName,
    description: apiData.description || '',
    brief: apiData.description?.substring(0, 100) || '',
    requirements: apiData.requirements || '',
    acceptedTeamName: apiData.acceptedTeamName || '' // 揭榜团队名称
  }
}

// 解析JSON字符串文件列表
function parseFileList(jsonString) {
  if (!jsonString) return []
  try {
    const files = JSON.parse(jsonString)
    return Array.isArray(files) ? files : []
  } catch (error) {
    console.error('解析文件列表失败:', error)
    return []
  }
}

// 里程碑数据映射
export function mapMilestoneData(apiData) {
  return {
    id: apiData.milestoneId,
    code: apiData.milestoneCode,
    title: apiData.name,
    description: apiData.description || '',
    status: mapMilestoneStatus(apiData.status),
    statusText: getMilestoneStatusText(apiData.status),
    startDate: formatDate(apiData.plannedStartTime),
    endDate: formatDate(apiData.plannedEndTime),
    plannedDate: formatDate(apiData.plannedEndTime),
    actualDate: apiData.actualEndTime ? formatDate(apiData.actualEndTime) : null,
    delayDays: calculateDelayDays(apiData.plannedEndTime, apiData.actualEndTime),

    // 解析学生提交的交付物文件列表
    submissions: parseFileList(apiData.deliverableFiles),

    // 解析企业提供的参考文件列表
    taskFiles: parseFileList(apiData.referenceFiles)
  }
}
