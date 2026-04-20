/**
 * 项目管理页面数据映射工具
 * 用于将后端 API 数据格式转换为前端页面所需格式
 */

import dayjs from 'dayjs'
import {
  normalizeProjectStatus,
  normalizeMilestoneStatus,
  getProjectStatusText,
  getMilestoneStatusText
} from '@/utils/status'

export function mapProjectStatus(apiStatus) {
  return normalizeProjectStatus(apiStatus)
}

export { getProjectStatusText }

export function mapMilestoneStatus(apiStatus) {
  return normalizeMilestoneStatus(apiStatus)
}

export { getMilestoneStatusText }

export function formatDate(isoString) {
  if (!isoString) return ''
  return dayjs(isoString).format('YYYY-MM-DD')
}

export function formatDateTime(isoString) {
  if (!isoString) return ''
  return dayjs(isoString).format('YYYY-MM-DD HH:mm')
}

export function calculateDelayDays(plannedEndTime, actualEndTime) {
  if (!plannedEndTime) return 0
  const planned = new Date(plannedEndTime)
  const actual = actualEndTime ? new Date(actualEndTime) : new Date()
  const diff = actual - planned
  return diff > 0 ? Math.ceil(diff / (1000 * 60 * 60 * 24)) : 0
}

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
    publisherId: apiData.publisherId || '',
    description: apiData.description || '',
    brief: apiData.description?.substring(0, 100) || '',
    requirements: apiData.requirements || '',
    teamName: apiData.acceptedTeamName || '',
    acceptedTeamName: apiData.acceptedTeamName || ''
  }
}

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
    approvalStatus: apiData.approvalStatus || '',
    submissions: parseFileList(apiData.deliverableFiles),
    taskFiles: parseFileList(apiData.referenceFiles),
    deliverables: apiData.deliverables || []
  }
}
