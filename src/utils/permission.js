/**
 * 权限判断工具
 */

import { USER_ROLES } from './enums.js'

/**
 * 检查用户是否有指定角色
 * @param {string} userRole 用户角色
 * @param {string|string[]} requiredRoles 需要的角色（单个或数组）
 * @returns {boolean}
 */
export function hasRole(userRole, requiredRoles) {
  if (!userRole || !requiredRoles) return false
  
  if (Array.isArray(requiredRoles)) {
    return requiredRoles.includes(userRole)
  }
  
  return userRole === requiredRoles
}

/**
 * 检查用户是否是学生
 * @param {string} userRole 用户角色
 * @returns {boolean}
 */
export function isStudent(userRole) {
  return userRole === USER_ROLES.STUDENT
}

/**
 * 检查用户是否是企业
 * @param {string} userRole 用户角色
 * @returns {boolean}
 */
export function isEnterprise(userRole) {
  return userRole === USER_ROLES.ENTERPRISE
}

/**
 * 检查用户是否是教师
 * @param {string} userRole 用户角色
 * @returns {boolean}
 */
export function isTeacher(userRole) {
  return userRole === USER_ROLES.TEACHER
}

/**
 * 检查用户是否是管理员
 * @param {string} userRole 用户角色
 * @returns {boolean}
 */
export function isAdmin(userRole) {
  return userRole === USER_ROLES.ADMIN
}

/**
 * 检查用户是否有权限访问指定路由
 * @param {string} userRole 用户角色
 * @param {object} routeMeta 路由meta信息
 * @returns {boolean}
 */
export function canAccessRoute(userRole, routeMeta) {
  // 如果路由不需要认证，直接允许访问
  if (!routeMeta?.requiresAuth) return true

  // 如果路由需要特定角色
  if (routeMeta?.role) {
    return hasRole(userRole, routeMeta.role)
  }

  // 如果需要认证但没有角色限制，只要已登录即可
  return !!userRole
}

