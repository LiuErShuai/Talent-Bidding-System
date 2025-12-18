/**
 * 认证相关组合式函数
 */
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/modules/auth'

export function useAuth() {
  const router = useRouter()
  const authStore = useAuthStore()

  const isLoggedIn = computed(() => authStore.isAuthenticated)
  const userRole = computed(() => authStore.role)
  const userInfo = computed(() => authStore.userInfo)
  const username = computed(() => authStore.username)
  const avatar = computed(() => authStore.avatar)

  /**
   * 登录
   * @param {object} credentials 登录凭证
   * @returns {Promise}
   */
  const login = async (credentials) => {
    // TODO: 调用登录API
    // const response = await loginAPI(credentials)
    // authStore.login(response.userData, response.token)
  }

  /**
   * 退出登录
   */
  const logout = () => {
    authStore.logout()
    router.push('/home')
  }

  /**
   * 检查权限
   * @param {string|string[]} requiredRoles 需要的角色
   * @returns {boolean}
   */
  const hasRole = (requiredRoles) => {
    if (!requiredRoles) return true
    if (Array.isArray(requiredRoles)) {
      return requiredRoles.includes(userRole.value)
    }
    return userRole.value === requiredRoles
  }

  /**
   * 需要登录才能访问
   */
  const requireAuth = () => {
    if (!isLoggedIn.value) {
      // 登录/注册已统一使用弹窗，通过事件触发即可
      window.dispatchEvent(
        new CustomEvent('open-auth-dialog', {
          detail: { mode: 'login', redirect: router.currentRoute.value.fullPath }
        })
      )
      return false
    }
    return true
  }

  return {
    isLoggedIn,
    userRole,
    userInfo,
    username,
    avatar,
    login,
    logout,
    hasRole,
    requireAuth
  }
}

