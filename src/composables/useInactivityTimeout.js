/**
 * 无操作自动退出组合式函数
 * 监听用户活动，超过指定时间无操作则自动登出
 */
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/store/modules/auth'
import { useRouter } from 'vue-router'
import { ElMessageBox, ElNotification } from 'element-plus'

// 默认配置
const DEFAULT_TIMEOUT = 30 * 60 * 1000 // 30分钟
const WARNING_TIME = 1 * 60 * 1000 // 提前1分钟警告

export function useInactivityTimeout(options = {}) {
  const {
    timeout = DEFAULT_TIMEOUT,
    warningTime = WARNING_TIME,
    enabled = true
  } = options

  const authStore = useAuthStore()
  const router = useRouter()

  let inactivityTimer = null
  let warningTimer = null
  let warningShown = false

  /**
   * 重置计时器
   */
  const resetTimer = () => {
    // 只有在已登录状态下才启用计时器
    if (!enabled || !authStore.isLoggedIn) {
      return
    }

    // 清除现有计时器
    clearTimeout(inactivityTimer)
    clearTimeout(warningTimer)
    warningShown = false

    // 设置警告计时器（超时前1分钟）
    warningTimer = setTimeout(() => {
      if (!warningShown && authStore.isLoggedIn) {
        warningShown = true
        showWarning()
      }
    }, timeout - warningTime)

    // 设置自动登出计时器
    inactivityTimer = setTimeout(() => {
      if (authStore.isLoggedIn) {
        handleAutoLogout()
      }
    }, timeout)
  }

  /**
   * 显示警告提示
   */
  const showWarning = () => {
    ElNotification({
      title: '会话即将过期',
      message: '您已经1分钟没有操作了，系统将在1分钟后自动退出登录。移动鼠标或点击页面可继续使用。',
      type: 'warning',
      duration: 10000,
      position: 'top-right'
    })
  }

  /**
   * 处理自动登出
   */
  const handleAutoLogout = () => {
    ElMessageBox.alert(
      '由于长时间未操作，系统已自动退出登录，请重新登录。',
      '会话已过期',
      {
        confirmButtonText: '确定',
        type: 'warning',
        showClose: false,
        callback: () => {
          // 清除认证状态
          authStore.logout()
          // 跳转到首页
          router.push('/home')
          // 延迟触发登录弹窗
          setTimeout(() => {
            window.dispatchEvent(
              new CustomEvent('open-auth-dialog', {
                detail: { mode: 'login', redirect: '' }
              })
            )
          }, 300)
        }
      }
    )
  }

  /**
   * 清理计时器
   */
  const cleanup = () => {
    clearTimeout(inactivityTimer)
    clearTimeout(warningTimer)
    inactivityTimer = null
    warningTimer = null
    warningShown = false
  }

  /**
   * 启动监听
   */
  const startListening = () => {
    if (!enabled) return

    // 监听的事件类型
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart']

    // 为每个事件添加监听器
    events.forEach(event => {
      window.addEventListener(event, resetTimer, { passive: true })
    })

    // 初始化计时器
    resetTimer()
  }

  /**
   * 停止监听
   */
  const stopListening = () => {
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart']

    events.forEach(event => {
      window.removeEventListener(event, resetTimer)
    })

    cleanup()
  }

  // 组件挂载时启动监听
  onMounted(() => {
    startListening()
  })

  // 组件卸载时停止监听
  onUnmounted(() => {
    stopListening()
  })

  return {
    resetTimer,
    cleanup,
    startListening,
    stopListening
  }
}
