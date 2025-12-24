<template>
  <header class="main-header">
    <div class="header-inner">
      <div class="brand">
        <router-link to="/home" class="brand-link">
          <img src="@/assets/images/logo/桂电透明背景logo.png" alt="创客平台" class="brand-logo" />
          <span class="brand-name">创客平台</span>
        </router-link>
      </div>
      <nav class="main-nav">
        <router-link to="/home" class="nav-link" active-class="active">首页</router-link>
        <router-link to="/projects" class="nav-link" active-class="active">项目大厅</router-link>
        <span class="nav-link" :class="{ active: isMyProjectsActive }" @click="goMyProjects">我的项目</span>
      </nav>
      <div class="auth-area">
        <template v-if="!isLoggedIn">
          <button class="auth-btn" @click="openAuthDialog('login')">登录</button>
          <button class="auth-btn solid" @click="openAuthDialog('register')">注册</button>
        </template>
        <template v-else>
          <UserPanel :user-info="userInfo" :user-role="userRole" :quick-actions="quickActions" />
          <div class="header-extra-links">
            <span class="header-link" @click="goUserProfile">个人中心</span>
            <span class="header-link" @click="goMessages">消息</span>
          </div>
        </template>
      </div>

      <AuthDialog
        v-model="authDialogVisible"
        :default-mode="authDialogMode"
        @login-success="handleLoginSuccess"
      />
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/store/modules/auth'
import { ElMessage } from 'element-plus'
import UserPanel from './UserPanel.vue'
import AuthDialog from '@/components/auth/AuthDialog.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// 登录状态：优先使用isAuthenticated，如果没有则检查token和localStorage
const isLoggedIn = computed(() => {
  // 检查authStore的登录状态
  if (authStore.isAuthenticated || authStore.isLoggedIn) {
    return true
  }
  // 如果authStore中没有，检查localStorage中的token（兼容旧的存储方式）
  const token = localStorage.getItem('token') || authStore.token
  const userInfo = localStorage.getItem('userInfo') || authStore.userInfo
  return !!(token && userInfo)
})
const userInfo = computed(() => authStore.userInfo || {})
const userRole = computed(() => authStore.userRole || 'student')

// 个人中心路径按角色区分
const userProfilePath = computed(() => {
  if (userRole.value === 'enterprise') return '/enterprise/profile'
  return '/user'
})

// 按角色映射“我的项目”路径，确保统一入口可跳转到对应页面
const myProjectsPath = computed(() => {
  if (userRole.value === 'enterprise') return '/enterprise/my-projects'
  if (userRole.value === 'teacher') return '/teacher/my-projects'
  if (userRole.value === 'admin') return '/admin/pre-review'
  return '/my-projects'
})

// 判断当前路由是否落在“我的项目”相关路径下，用于高亮
const isMyProjectsActive = computed(() => route.path.startsWith(myProjectsPath.value))

// 头像下拉菜单（按角色）统一收纳隐藏导航
const quickActions = computed(() => {
  const actions = [
    { label: '个人中心', path: userProfilePath.value },
    { label: '消息中心', path: '/messages' },
    { label: '帮助中心', path: '/help' }
  ]

  if (userRole.value === 'enterprise') {
    actions.push(
      { label: '我的项目', path: '/enterprise/my-projects' },
      { label: '项目审核', path: '/enterprise/my-projects?tab=review' },
      { label: '发布项目', path: '/enterprise/my-projects?action=create' },
      { label: '数据中心', path: '/enterprise/my-projects?tab=analytics' }
    )
  } else if (userRole.value === 'teacher') {
    actions.push(
      { label: '指导项目', path: '/teacher/my-projects' },
      { label: '成果评审', path: '/teacher/my-projects?tab=review' },
      { label: '推荐项目', path: '/teacher/my-projects?action=recommend' },
      { label: '数据中心', path: '/teacher/statistics' }
    )
  } else if (userRole.value === 'admin') {
    actions.push(
      { label: '项目初审', path: '/admin/pre-review' },
      { label: '项目终审', path: '/admin/final-review' },
      { label: '中期答辩', path: '/admin/midterm-defense' },
      { label: '成果评审', path: '/admin/final-review?stage=result' },
      { label: '协议处理', path: '/agreement-processing' },
      { label: '数据中心', path: '/statistics' }
    )
  } else {
    // 学生
    actions.push(
      { label: '我的项目', path: '/my-projects' },
      { label: '成长中心', path: '/growth-center' },
      { label: '排行榜', path: '/growth-center?tab=ranking' },
      { label: '勋章墙', path: '/growth-center?tab=badges' }
    )
  }

  actions.push({ label: '退出登录', type: 'danger' })
  return actions
})

const authDialogVisible = ref(false)
const authDialogMode = ref('login')
const pendingRedirect = ref('')
let authDialogListener = null
const PENDING_AUTH_DIALOG_KEY = 'pendingAuthDialog'

// 处理需要登录的功能
const handleRequireLogin = (redirectPath, feature) => {
  pendingRedirect.value = redirectPath || ''
  ElMessage.warning(`请先登录后再使用${feature}功能`)
  openAuthDialog('login')
}

const openAuthDialog = (mode = 'login') => {
  authDialogMode.value = mode
  authDialogVisible.value = true
}

const handleLoginSuccess = () => {
  if (pendingRedirect.value) {
    router.push(pendingRedirect.value)
    pendingRedirect.value = ''
  } else if (route.path === '/login' || route.path === '/register') {
    router.push('/home')
  }
}

// 登录校验封装：未登录弹窗，已登录直接跳转
const requireLoginAndGo = (path, feature) => {
  // 使用computed的isLoggedIn，它已经包含了多种登录状态检查
  if (!isLoggedIn.value) {
    handleRequireLogin(path, feature)
    return
  }
  
  // 确保路由跳转
  router.push(path).catch(err => {
    // 忽略重复导航错误（Vue Router 4.x的特性）
    if (err.name !== 'NavigationDuplicated') {
      console.error('Navigation error:', err)
      ElMessage.error('页面跳转失败，请重试')
    }
  })
}

const goMyProjects = () => requireLoginAndGo(myProjectsPath.value, '我的项目')
const goUserProfile = () => requireLoginAndGo(userProfilePath.value, '个人中心')
const goMessages = () => requireLoginAndGo('/messages', '消息')

// 初始化认证状态与未读数
onMounted(() => {
  authStore.initAuth()

  // 兜底处理：如果路由守卫在组件挂载前触发了弹窗事件，这里从 sessionStorage 恢复一次
  try {
    const raw = sessionStorage.getItem(PENDING_AUTH_DIALOG_KEY)
    if (raw) {
      sessionStorage.removeItem(PENDING_AUTH_DIALOG_KEY)
      const payload = JSON.parse(raw) || {}
      const { mode = 'login', redirect = '' } = payload
      if (redirect) pendingRedirect.value = redirect
      openAuthDialog(mode)
    }
  } catch {
    // 忽略解析/存储异常
  }

  // 监听全局弹窗事件
  authDialogListener = (event) => {
    const { mode = 'login', redirect = '' } = event.detail || {}
    if (redirect) pendingRedirect.value = redirect
    openAuthDialog(mode)
  }
  window.addEventListener('open-auth-dialog', authDialogListener)
})

onUnmounted(() => {
  if (authDialogListener) {
    window.removeEventListener('open-auth-dialog', authDialogListener)
    authDialogListener = null
  }
})
</script>

<style scoped>
.main-header {
  position: relative;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 6px 30px rgba(15, 39, 106, 0.1);
  z-index: 10;
}

.header-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 20px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-link {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: inherit;
}

.brand-logo {
  height: 48px;
  max-width: 160px;
  width: auto;
  border-radius: 0;
  object-fit: contain;
  box-shadow: none;
}

.brand-name {
  font-size: 18px;
  font-weight: 700;
  color: #0f2c85;
}

.main-nav {
  flex: 1;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 24px;
  margin-left: 36px;
}

.nav-link {
  position: relative;
  text-decoration: none;
  color: #5a6486;
  font-weight: 600;
  transition: color 0.2s;
  cursor: pointer;
  white-space: nowrap;
}

.nav-link.active,
.nav-link:hover {
  color: #0c5fe7;
}

.nav-link.active::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -8px;
  width: 100%;
  height: 3px;
  border-radius: 999px;
  background: linear-gradient(120deg, #0c5fe7, #2fb7ff);
}

.nav-dropdown {
  cursor: pointer;
}

.dropdown-trigger {
  display: flex;
  align-items: center;
  gap: 4px;
}

.dropdown-icon {
  font-size: 12px;
  transition: transform 0.2s;
}

.nav-dropdown:hover .dropdown-icon {
  transform: rotate(180deg);
}

.dropdown-item-link {
  display: block;
  width: 100%;
  text-decoration: none;
  color: inherit;
}

.messages {
  display: flex;
  align-items: center;
  gap: 6px;
}

.badge {
  display: inline-flex;
  min-width: 18px;
  padding: 0 6px;
  height: 18px;
  border-radius: 999px;
  background: #ff4d4f;
  color: #fff;
  font-size: 12px;
  justify-content: center;
  align-items: center;
}

.auth-area {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-left: auto;
}

.auth-btn {
  padding: 8px 22px;
  border-radius: 999px;
  border: 1px solid transparent;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.2s;
  color: #5a6486;
  background: transparent;
  cursor: pointer;
}

.auth-btn.solid {
  background: linear-gradient(120deg, #0c5fe7, #2fb7ff);
  color: #fff;
  box-shadow: 0 12px 24px rgba(12, 95, 231, 0.25);
}

.auth-btn:hover {
  transform: translateY(-2px);
}

.header-extra-links {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-link {
  font-size: 14px;
  font-weight: 400;
  color: #5a6486;
  cursor: pointer;
  text-decoration: none;
  transition: color 0.2s;
  white-space: nowrap;
}

.header-link:hover {
  color: #0c5fe7;
}

/* Element Plus 下拉菜单样式覆盖 */
:deep(.el-dropdown-menu__item) {
  padding: 0;
}

:deep(.el-dropdown-menu__item a) {
  display: block;
  padding: 8px 20px;
  color: #606266;
  text-decoration: none;
}

:deep(.el-dropdown-menu__item:hover a) {
  color: #0c5fe7;
  background-color: #f5f7fb;
}

@media (max-width: 1024px) {
  .header-inner {
    flex-direction: column;
  }

  .main-nav {
    flex-wrap: wrap;
    gap: 16px;
  }
}
</style>
