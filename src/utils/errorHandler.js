import { ElMessage } from 'element-plus'
import router from '@/router'

// 统一错误处理
export function handleApiError(error) {
  console.error('API错误:', error)

  if (error.code === 'ERR_AUTH_002' || error.code === 'ERR_AUTH_003') {
    // 登录过期，跳转登录页
    ElMessage.error('登录已过期，请重新登录')
    router.push('/login')
    return
  }

  // 显示错误提示
  const message = error.message || error.info || '操作失败'
  ElMessage.error(message)
}

// 状态文本映射
export const STATUS_TEXT_MAP = {
  'draft': '草稿',
  'pending_review': '待审核',
  'published': '已发布',
  'in_progress': '进行中',
  'ongoing': '进行中',
  'awarded': '已揭榜',
  'review': '待评审',
  'completed': '已完成',
  'closed': '已关闭'
}

// 阶段文本映射
export const STAGE_TEXT_MAP = {
  'ongoing': '开发中',
  'testing': '测试中',
  'review': '评审中',
  'completed': '已完成'
}