/**
 * 枚举值定义
 */

// 用户角色
export const USER_ROLES = {
  STUDENT: 'student',
  ENTERPRISE: 'enterprise',
  TEACHER: 'teacher',
  ADMIN: 'admin'
}

// 项目状态
export const PROJECT_STATUS = {
  DRAFT: 'draft', // 草稿
  PENDING_REVIEW: 'pending_review', // 待审核
  REJECTED: 'rejected', // 已驳回
  OPEN: 'open', // 揭榜中(成果征集中)
  REVIEWING: 'reviewing', // 评审中(成果评选中)
  ANNOUNCING: 'announcing', // 公示中
  AGREEMENT_PENDING: 'agreement_pending', // 协议签订中
  IN_PROGRESS: 'in_progress', // 执行中
  COMPLETED: 'completed', // 已完成
  CLOSED: 'closed' // 已关闭
}

// 项目状态显示文本
export const PROJECT_STATUS_TEXT = {
  [PROJECT_STATUS.DRAFT]: '草稿',
  [PROJECT_STATUS.PENDING_REVIEW]: '待审核',
  [PROJECT_STATUS.REJECTED]: '已驳回',
  [PROJECT_STATUS.OPEN]: '揭榜中',
  [PROJECT_STATUS.REVIEWING]: '评审中',
  [PROJECT_STATUS.ANNOUNCING]: '公示中',
  [PROJECT_STATUS.AGREEMENT_PENDING]: '协议签订中',
  [PROJECT_STATUS.IN_PROGRESS]: '执行中',
  [PROJECT_STATUS.COMPLETED]: '已完成',
  [PROJECT_STATUS.CLOSED]: '已关闭'
}

// 项目状态颜色
export const PROJECT_STATUS_COLOR = {
  [PROJECT_STATUS.DRAFT]: '#8C8C8C',
  [PROJECT_STATUS.PENDING_REVIEW]: '#FAAD14',
  [PROJECT_STATUS.REJECTED]: '#F5222D',
  [PROJECT_STATUS.OPEN]: '#1890FF',
  [PROJECT_STATUS.REVIEWING]: '#722ED1',
  [PROJECT_STATUS.ANNOUNCING]: '#FA8C16',
  [PROJECT_STATUS.AGREEMENT_PENDING]: '#13C2C2',
  [PROJECT_STATUS.IN_PROGRESS]: '#52C41A',
  [PROJECT_STATUS.COMPLETED]: '#52C41A',
  [PROJECT_STATUS.CLOSED]: '#8C8C8C'
}

// 审核状态
export const REVIEW_STATUS = {
  PENDING: 'pending', // 待审核
  APPROVED: 'approved', // 已通过
  REJECTED: 'rejected', // 已驳回
  NEED_MODIFY: 'need_modify' // 需修改
}

// 支付状态
export const PAYMENT_STATUS = {
  PENDING: 'pending', // 待支付
  PROCESSING: 'processing', // 处理中
  COMPLETED: 'completed', // 已支付
  FAILED: 'failed' // 支付失败
}

// 段位等级
export const RANK_LEVELS = {
  BRONZE: 'bronze', // 青铜
  SILVER: 'silver', // 白银
  GOLD: 'gold', // 黄金
  PLATINUM: 'platinum', // 铂金
  DIAMOND: 'diamond' // 王者
}

// 段位积分范围
export const RANK_POINTS = {
  [RANK_LEVELS.BRONZE]: { min: 0, max: 499 },
  [RANK_LEVELS.SILVER]: { min: 500, max: 1499 },
  [RANK_LEVELS.GOLD]: { min: 1500, max: 2999 },
  [RANK_LEVELS.PLATINUM]: { min: 3000, max: 4999 },
  [RANK_LEVELS.DIAMOND]: { min: 5000, max: Infinity }
}

// 技能等级
export const SKILL_LEVEL = {
  BEGINNER: 'beginner', // 了解
  INTERMEDIATE: 'intermediate', // 熟悉
  ADVANCED: 'advanced' // 精通
}

// 技能等级显示文本
export const SKILL_LEVEL_TEXT = {
  [SKILL_LEVEL.BEGINNER]: '了解',
  [SKILL_LEVEL.INTERMEDIATE]: '熟悉',
  [SKILL_LEVEL.ADVANCED]: '精通'
}

// 项目领域
export const PROJECT_FIELDS = {
  SOFTWARE: 'software', // 软件工程
  AI: 'ai', // 人工智能
  BIG_DATA: 'big_data', // 大数据
  WEB: 'web', // Web开发
  MOBILE: 'mobile', // 移动开发
  DESIGN: 'design', // 设计
  OTHER: 'other' // 其他
}

