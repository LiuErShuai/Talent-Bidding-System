import { ElMessage } from 'element-plus'
import router from '@/router'
import { getProjectStatusText } from '@/utils/status'

export function handleApiError(error) {
  console.error('API错误:', error)

  if (error.code === 'ERR_AUTH_002' || error.code === 'ERR_AUTH_003') {
    ElMessage.error('登录已过期，请重新登录')
    router.push('/login')
    return
  }

  const message = error.message || error.info || '操作失败'
  ElMessage.error(message)
}

export const STATUS_TEXT_MAP = {
  draft: getProjectStatusText('draft'),
  pending_review: getProjectStatusText('pending_review'),
  rejected: getProjectStatusText('rejected'),
  published: getProjectStatusText('published'),
  in_progress: getProjectStatusText('in_progress'),
  ongoing: getProjectStatusText('in_progress'),
  awarded: '已中标',
  review: '评审中',
  completed: getProjectStatusText('completed'),
  closed: getProjectStatusText('closed')
}

export const STAGE_TEXT_MAP = {
  ongoing: '开发中',
  testing: '测试中',
  review: '评审中',
  completed: '已完成'
}
