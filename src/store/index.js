/**
 * Store统一导出
 */
export { useAuthStore } from './modules/auth'
export { useUserStore } from './modules/user'
export { useProjectStore } from './modules/project'
export { useAppStore } from './modules/app'

// 为了向后兼容，保留原有的useUserStore导出（指向auth store）
export { useAuthStore as useUserStore } from './modules/auth'

