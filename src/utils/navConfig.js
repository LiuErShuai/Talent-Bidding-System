/**
 * 导航配置文件
 * 用于集中管理不同角色的导航栏配置
 *
 * @description 支持配置驱动的导航栏，根据用户角色动态显示不同的导航项
 * @author 开发团队
 * @date 2025-11-25
 */

// ========================================
// 角色枚举定义
// ========================================

/**
 * 用户角色枚举
 * @readonly
 * @enum {string}
 */
export const USER_ROLES = {
  VISITOR: 'visitor',       // 访客（未登录）
  STUDENT: 'student',       // 学生
  ENTERPRISE: 'enterprise', // 企业
  TEACHER: 'teacher',       // 教师
  ADMIN: 'admin'            // 管理员
}

// ========================================
// 导航配置主函数
// ========================================

/**
 * 获取指定角色的导航配置
 * @param {string} role - 用户角色（来自 USER_ROLES 枚举）
 * @param {boolean} isLoggedIn - 是否已登录
 * @returns {object} 导航配置对象，包含 navItems、quickActions、variant
 *
 * @example
 * const config = getNavByRole('student', true)
 * // 返回：{ navItems: [...], quickActions: [...], variant: 'default' }
 */
export function getNavByRole(role, isLoggedIn) {
  // 未登录统一返回访客配置
  if (!isLoggedIn) {
    return navConfigs[USER_ROLES.VISITOR]
  }

  // 返回对应角色配置，未找到则返回访客配置（兜底）
  return navConfigs[role] || navConfigs[USER_ROLES.VISITOR]
}

// ========================================
// 导航配置映射表
// ========================================

/**
 * 各角色的导航配置
 * @type {Object.<string, NavigationConfig>}
 *
 * @typedef {Object} NavigationConfig
 * @property {NavigationItem[]} navItems - 导航项数组
 * @property {QuickAction[]} quickActions - 快捷操作数组
 * @property {string} variant - 样式变体（'default' | 'transparent'）
 *
 * @typedef {Object} NavigationItem
 * @property {string} label - 导航项文本
 * @property {string} [path] - 路由路径
 * @property {string} type - 类型：'link' 普通链接 | 'dropdown' 下拉菜单
 * @property {NavigationItem[]} [children] - 子菜单项（仅 dropdown 类型）
 * @property {boolean} [requireLogin] - 是否需要登录
 * @property {string} [badgeKey] - 徽章键名（如 'messages'）
 * @property {Function} [matchRoute] - 自定义路由匹配函数
 *
 * @typedef {Object} QuickAction
 * @property {string} label - 操作文本
 * @property {string} [path] - 路由路径
 * @property {string} type - 样式类型：'normal' | 'danger'
 */
const navConfigs = {
  // ========================================
  // 访客配置（未登录用户）
  // ========================================
  [USER_ROLES.VISITOR]: {
    navItems: [
      {
        label: '首页',
        path: '/home',
        type: 'link'
      },
      {
        label: '项目大厅',
        path: '/projects',
        type: 'link',
        // 项目详情页（/projects/:id）也高亮项目大厅
        matchRoute: (route) => route.path.startsWith('/projects')
      },
      {
        label: '成长中心',
        path: '/growth-center',
        type: 'link',
        requireLogin: true // 点击时提示需要登录
      },
      {
        label: '消息',
        path: '/messages',
        type: 'link',
        requireLogin: true
      }
    ],
    quickActions: [], // 未登录无快捷操作
    variant: 'default'
  },

  // ========================================
  // 学生配置
  // ========================================
  [USER_ROLES.STUDENT]: {
    navItems: [
      {
        label: '首页',
        path: '/home',
        type: 'link'
      },
      {
        label: '创客空间',
        type: 'dropdown',
        children: [
          { label: '项目大厅', path: '/projects' },
          { label: '热门项目', path: '/projects?sort=hot' },
          { label: '项目详情', path: '/projects' }
        ]
      },
      {
        label: '项目大厅',
        path: '/projects',
        type: 'link',
        // 项目详情页也高亮项目大厅
        matchRoute: (route) => route.path.startsWith('/projects')
      },
      {
        label: '成长中心',
        path: '/growth-center',
        type: 'link'
      },
      {
        label: '消息',
        path: '/messages',
        type: 'link',
        badgeKey: 'messages' // 显示未读消息徽章
      }
    ],
    quickActions: [
      { label: '个人中心', path: '/user', type: 'normal' },
      { label: '设置', path: '/user?tab=settings', type: 'normal' },
      { label: '退出登录', type: 'danger' } // 特殊处理，不需要 path
    ],
    variant: 'default'
  },

  // ========================================
  // 企业配置
  // ========================================
  [USER_ROLES.ENTERPRISE]: {
    navItems: [
      {
        label: '首页',
        path: '/home',
        type: 'link'
      },
      {
        label: '项目管理',
        type: 'dropdown',
        children: [
          { label: '我的项目', path: '/enterprise/my-projects' },
          { label: '发布项目', path: '/enterprise/publish' }
        ]
      },
      {
        label: '成果中心',
        path: '/results-center',
        type: 'link'
      },
      {
        label: '消息',
        path: '/messages',
        type: 'link',
        badgeKey: 'messages'
      }
    ],
    quickActions: [
      { label: '个人中心', path: '/user', type: 'normal' },
      { label: '设置', path: '/user?tab=settings', type: 'normal' },
      { label: '退出登录', type: 'danger' }
    ],
    variant: 'default'
  },

  // ========================================
  // 教师配置
  // ========================================
  [USER_ROLES.TEACHER]: {
    navItems: [
      {
        label: '首页',
        path: '/home',
        type: 'link'
      },
      {
        label: '项目大厅',
        path: '/projects',
        type: 'link',
        matchRoute: (route) => route.path.startsWith('/projects')
      },
      {
        label: '学生管理',
        type: 'dropdown',
        children: [
          { label: '学生列表', path: '/teacher/students' },
          { label: '成绩管理', path: '/teacher/grades' }
        ]
      },
      {
        label: '消息',
        path: '/messages',
        type: 'link',
        badgeKey: 'messages'
      }
    ],
    quickActions: [
      { label: '个人中心', path: '/user', type: 'normal' },
      { label: '设置', path: '/user?tab=settings', type: 'normal' },
      { label: '退出登录', type: 'danger' }
    ],
    variant: 'default'
  },

  // ========================================
  // 管理员配置
  // ========================================
  [USER_ROLES.ADMIN]: {
    navItems: [
      {
        label: '首页',
        path: '/home',
        type: 'link'
      },
      {
        label: '项目审核',
        type: 'dropdown',
        children: [
          { label: '项目初审', path: '/pre-review' },
          { label: '项目终审', path: '/final-review' },
          { label: '中期答辩', path: '/midterm-defense' }
        ]
      },
      {
        label: '数据中心',
        path: '/statistics',
        type: 'link'
      },
      {
        label: '消息',
        path: '/messages',
        type: 'link',
        badgeKey: 'messages'
      }
    ],
    quickActions: [
      { label: '个人中心', path: '/user', type: 'normal' },
      { label: '设置', path: '/user?tab=settings', type: 'normal' },
      { label: '退出登录', type: 'danger' }
    ],
    variant: 'default'
  }
}

// ========================================
// 默认导出
// ========================================

/**
 * 默认导出配置对象
 * @default
 */
export default {
  getNavByRole,
  USER_ROLES,
  navConfigs
}
