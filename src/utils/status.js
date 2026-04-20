export const PROJECT_STATUS_TEXT = {
  draft: '草稿',
  pending_review: '待审核',
  rejected: '已拒绝',
  published: '已发布',
  in_progress: '进行中',
  completed: '已完成',
  closed: '已关闭'
}

export const MILESTONE_STATUS_TEXT = {
  planned: '计划中',
  in_progress: '进行中',
  delivered: '已交付',
  under_review: '评审中',
  completed: '已完成',
  rejected: '已拒绝',
  expired: '已过期',
  skipped: '已跳过'
}

export const APPROVAL_STATUS_TEXT = {
  pending: '待审批',
  partial: '部分审批',
  approved: '已审批',
  rejected: '已拒绝'
}

const PROJECT_STATUS_ALIASES = {
  pending: 'pending_review',
  open: 'published',
  bidding: 'published',
  ongoing: 'in_progress',
  'in-progress': 'in_progress',
  awarded: 'in_progress',
  cancelled: 'closed'
}

const MILESTONE_STATUS_ALIASES = {
  pending: 'planned',
  'in-progress': 'in_progress',
  overdue: 'expired'
}

export function normalizeProjectStatus(status) {
  if (!status) return ''
  return PROJECT_STATUS_ALIASES[status] || status
}

export function normalizeMilestoneStatus(status) {
  if (!status) return ''
  return MILESTONE_STATUS_ALIASES[status] || status
}

export function getProjectStatusText(status) {
  const normalized = normalizeProjectStatus(status)
  return PROJECT_STATUS_TEXT[normalized] || normalized || '未知状态'
}

export function getMilestoneStatusText(status) {
  const normalized = normalizeMilestoneStatus(status)
  return MILESTONE_STATUS_TEXT[normalized] || normalized || '未知状态'
}

export function getApprovalStatusText(status) {
  return APPROVAL_STATUS_TEXT[status] || status || '未知状态'
}

export function getProjectStatusTagType(status) {
  const normalized = normalizeProjectStatus(status)
  const map = {
    draft: 'info',
    pending_review: 'warning',
    rejected: 'danger',
    published: 'primary',
    in_progress: 'success',
    completed: 'success',
    closed: 'info'
  }
  return map[normalized] || 'info'
}

export function getMilestoneStatusTagType(status) {
  const normalized = normalizeMilestoneStatus(status)
  const map = {
    planned: 'info',
    in_progress: 'primary',
    delivered: 'warning',
    under_review: 'warning',
    completed: 'success',
    rejected: 'danger',
    expired: 'danger',
    skipped: 'info'
  }
  return map[normalized] || 'info'
}

export function isProjectActionable(status) {
  return normalizeProjectStatus(status) === 'in_progress'
}

export function isMilestoneCompleted(status) {
  return normalizeMilestoneStatus(status) === 'completed'
}

export function isMilestoneCurrent(status) {
  const normalized = normalizeMilestoneStatus(status)
  return ['in_progress', 'delivered', 'under_review'].includes(normalized)
}

export function isMilestonePending(status) {
  return normalizeMilestoneStatus(status) === 'planned'
}

export function findCurrentMilestone(milestones = []) {
  if (!Array.isArray(milestones) || milestones.length === 0) return null

  return (
    milestones.find(item => normalizeMilestoneStatus(item.status) === 'in_progress') ||
    milestones.find(item => normalizeMilestoneStatus(item.status) === 'delivered') ||
    milestones.find(item => normalizeMilestoneStatus(item.status) === 'under_review') ||
    milestones.find(item => normalizeMilestoneStatus(item.status) === 'planned') ||
    milestones[0]
  )
}
