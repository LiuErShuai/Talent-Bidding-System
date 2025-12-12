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
      // 拦截跳转并触发登录弹窗
      window.dispatchEvent(
        new CustomEvent('open-auth-dialog', {
          detail: { mode: 'login', redirect: to.fullPath }
        })
      )
      next(false)
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

    // 4. 登录/注册路由改为弹窗，不再进入页面
    if (to.path === '/login' || to.path === '/register') {
      const mode = to.path === '/register' ? 'register' : 'login'
      window.dispatchEvent(
        new CustomEvent('open-auth-dialog', {
          detail: { mode }
        })
      )
      // 已登录则保持当前页；未登录也留在原页
      next(false)
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
