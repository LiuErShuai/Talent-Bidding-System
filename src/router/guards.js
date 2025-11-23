/**
 * 路由守卫配置
 * 用于权限控制、页面标题设置等全局路由处理
 */

import { useAuthStore } from '@/store/modules/auth'

/**
 * 配置路由守卫
 * @param {Router} router - Vue Router实例
 */
export function setupGuards(router) {
  // 全局前置守卫
  router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()

    // 1. 设置页面标题
    if (to.meta.title) {
      document.title = `${to.meta.title} - 揭榜挂帅平台`
    } else {
      document.title = '揭榜挂帅平台'
    }

    // 2. 权限验证：检查是否需要登录
    if (to.meta.requiresAuth && !authStore.isLoggedIn) {
      // 需要登录但未登录，跳转到登录页
      next({
        path: '/login',
        query: { redirect: to.fullPath } // 保存原始目标路径，登录后可以跳转回来
      })
      return
    }

    // 3. 角色权限验证
    if (to.meta.role) {
      const userRole = authStore.userRole || localStorage.getItem('userRole')

      // 检查用户角色是否匹配
      if (userRole !== to.meta.role) {
        console.warn(`权限不足: 需要${to.meta.role}角色，当前角色为${userRole}`)

        // 根据用户角色跳转到相应的首页
        switch (userRole) {
          case 'student':
            next('/my-projects')
            break
          case 'enterprise':
            next('/enterprise/my-projects')
            break
          case 'teacher':
            next('/projects')
            break
          case 'admin':
            next('/statistics')
            break
          default:
            next('/home')
        }
        return
      }
    }

    // 4. 如果已登录且访问登录/注册页，跳转到首页
    if ((to.path === '/login' || to.path === '/register') && authStore.isLoggedIn) {
      const userRole = authStore.userRole || localStorage.getItem('userRole')

      // 根据角色跳转到不同的首页
      switch (userRole) {
        case 'student':
          next('/my-projects')
          break
        case 'enterprise':
          next('/enterprise/my-projects')
          break
        case 'teacher':
          next('/projects')
          break
        case 'admin':
          next('/statistics')
          break
        default:
          next('/home')
      }
      return
    }

    // 5. 通过所有验证，允许导航
    next()
  })

  // 全局后置守卫
  router.afterEach((to, from) => {
    // 页面切换后，滚动到顶部
    window.scrollTo(0, 0)

    // 可以在这里添加页面访问统计等功能
    // console.log(`从 ${from.path} 导航到 ${to.path}`)
  })

  // 全局解析守卫（在导航被确认之前，同时在所有组件内守卫和异步路由组件被解析之后调用）
  router.beforeResolve((to, from, next) => {
    // 可以在这里添加一些需要在组件解析后才能执行的逻辑
    next()
  })
}

/**
 * 权限检查辅助函数
 * @param {string} requiredRole - 需要的角色
 * @returns {boolean} 是否有权限
 */
export function checkPermission(requiredRole) {
  const authStore = useAuthStore()
  const userRole = authStore.userRole || localStorage.getItem('userRole')

  return userRole === requiredRole
}

/**
 * 多角色权限检查
 * @param {string[]} requiredRoles - 需要的角色列表
 * @returns {boolean} 是否有权限（满足任一角色即可）
 */
export function checkPermissions(requiredRoles) {
  const authStore = useAuthStore()
  const userRole = authStore.userRole || localStorage.getItem('userRole')

  return requiredRoles.includes(userRole)
}
