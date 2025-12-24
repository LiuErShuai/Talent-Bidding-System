/**
 * Vue Router 配置
 * 采用模块化路由设计，按功能模块拆分路由配置
 */

import { createRouter, createWebHistory } from 'vue-router'
import { setupGuards } from './guards'

// 导入各模块路由
import commonRoutes from './modules/common'
import studentRoutes from './modules/student'
import enterpriseRoutes from './modules/enterprise'
import teacherRoutes from './modules/teacher'
import adminRoutes from './modules/admin'

/**
 * 合并所有路由配置
 * 路由加载顺序：
 * 1. 公共模块（首页、项目大厅等）
 * 2. 学生模块
 * 3. 企业模块
 * 4. 教师模块
 * 5. 管理员模块
 */
const routes = [
  ...commonRoutes,
  ...studentRoutes,
  ...enterpriseRoutes,
  ...teacherRoutes,
  ...adminRoutes,

  // 404页面（放在最后，匹配所有未定义的路由）
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/info/Help/index.vue'), // 暂时使用帮助页面，后续可以创建专门的404页面
    meta: {
      title: '页面未找到',
      transition: 'fade',
      requiresAuth: false
    }
  }
]

/**
 * 创建路由实例
 */
const router = createRouter({
  // 使用HTML5的history模式
  history: createWebHistory(),

  // 路由配置
  routes,

  // 滚动行为
  scrollBehavior(to, from, savedPosition) {
    // 如果有保存的位置（例如浏览器后退），恢复到该位置
    if (savedPosition) {
      return savedPosition
    }

    // 如果有锚点，滚动到锚点位置
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      }
    }

    // 默认滚动到页面顶部
    return { top: 0 }
  }
})

// 配置路由守卫
setupGuards(router)

// 导出路由实例
export default router
