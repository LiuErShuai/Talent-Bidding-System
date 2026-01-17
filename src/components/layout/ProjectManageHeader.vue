<template>
  <header class="project-manage-header">
    <div class="header-inner">
      <!-- 左侧：缩略按钮 + 面包屑导航 -->
      <div class="header-left">
        <!-- 缩略按钮（三条横线） -->
        <el-button
          class="menu-toggle-btn"
          text
          @click="toggleDrawer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="24" height="24">
            <path fill="currentColor" d="M160 256h704c17.7 0 32 14.3 32 32s-14.3 32-32 32H160c-17.7 0-32-14.3-32-32s14.3-32 32-32zm0 224h704c17.7 0 32 14.3 32 32s-14.3 32-32 32H160c-17.7 0-32-14.3-32-32s14.3-32 32-32zm0 224h704c17.7 0 32 14.3 32 32s-14.3 32-32 32H160c-17.7 0-32-14.3-32-32s14.3-32 32-32z"/>
          </svg>
        </el-button>

        <!-- 面包屑导航 -->
        <el-breadcrumb separator=">" class="breadcrumb-nav">
          <el-breadcrumb-item
            v-for="(item, index) in breadcrumbItems"
            :key="index"
            :to="item.path ? { path: item.path } : undefined"
          >
            {{ item.title }}
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <!-- 右侧：头像、个人中心、消息 -->
      <div class="header-right">
        <!-- 头像下拉菜单 -->
        <UserPanel
          :user-info="userInfo"
          :user-role="userRole"
          :quick-actions="userPanelActions"
        />

        <!-- 个人中心链接 -->
        <span class="header-link" @click="goToProfile">
          <el-icon><User /></el-icon>
          个人中心
        </span>

        <!-- 消息链接 -->
        <el-badge :value="unreadCount" :hidden="unreadCount === 0" class="message-badge">
          <span class="header-link" @click="goToMessages">
            <el-icon><Bell /></el-icon>
            消息
          </span>
        </el-badge>
      </div>
    </div>

    <!-- 左侧抽屉导航 -->
    <el-drawer
      v-model="drawerVisible"
      :size="280"
      direction="ltr"
      :show-close="false"
      class="project-nav-drawer"
    >
      <template #header>
        <div class="drawer-header">
          <img src="@/assets/images/logo/桂电透明背景logo.png" alt="创客平台" class="drawer-logo" />
          <span class="drawer-title">创客平台</span>
        </div>
      </template>

      <div class="drawer-content">
        <!-- 主导航 -->
        <el-menu
          :default-active="currentRoute"
          class="drawer-menu"
          @select="handleMenuSelect"
        >
          <el-menu-item index="/home">
            <el-icon><HomeFilled /></el-icon>
            <span>首页</span>
          </el-menu-item>
          <el-menu-item index="/projects">
            <el-icon><Grid /></el-icon>
            <span>项目大厅</span>
          </el-menu-item>
          <el-menu-item :index="myProjectsPath">
            <el-icon><FolderOpened /></el-icon>
            <span>我的项目</span>
          </el-menu-item>
        </el-menu>

        <!-- 分割线 -->
        <el-divider />

        <!-- 快捷操作（根据角色显示） -->
        <div v-if="quickActions.length > 0" class="quick-actions">
          <div class="quick-actions-title">快捷操作</div>
          <el-menu class="drawer-menu">
            <el-menu-item
              v-for="(action, index) in quickActions"
              :key="index"
              :index="action.path || `action-${index}`"
              @click="handleActionClick(action)"
            >
              <el-icon v-if="action.icon"><component :is="action.icon" /></el-icon>
              <span>{{ action.label }}</span>
            </el-menu-item>
          </el-menu>
        </div>
      </div>
    </el-drawer>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/store/modules/auth'
import { ElMessage } from 'element-plus'
import {
  User,
  Bell,
  HomeFilled,
  Grid,
  FolderOpened,
  Document,
  Star,
  Setting
} from '@element-plus/icons-vue'
import UserPanel from './AppHeader/UserPanel.vue'

// Props
const props = defineProps({
  breadcrumbItems: {
    type: Array,
    default: () => []
  },
  unreadCount: {
    type: Number,
    default: 0
  }
})

// Emit
const emit = defineEmits(['toggle-drawer'])

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// 状态
const drawerVisible = ref(false)

// 计算属性
const userInfo = computed(() => authStore.userInfo || {})
const userRole = computed(() => authStore.userRole || 'student')
const currentRoute = computed(() => route.path)

// 个人中心路径
const userProfilePath = computed(() => {
  if (userRole.value === 'enterprise') return '/enterprise/profile'
  if (userRole.value === 'teacher') return '/teacher/profile'
  if (userRole.value === 'admin') return '/admin/profile'
  return '/user'
})

// 我的项目路径
const myProjectsPath = computed(() => {
  if (userRole.value === 'enterprise') return '/enterprise/my-projects'
  if (userRole.value === 'teacher') return '/teacher/my-projects'
  if (userRole.value === 'admin') return '/admin/pre-review'
  return '/my-projects'
})

// 快捷操作（根据角色）- 用于抽屉菜单
const quickActions = computed(() => {
  const actions = []

  if (userRole.value === 'enterprise') {
    actions.push(
      { label: '项目审核', path: '/enterprise/my-projects?tab=review', icon: Document },
      { label: '发布项目', path: '/enterprise/my-projects?action=create', icon: Star },
      { label: '数据中心', path: '/enterprise/my-projects?tab=analytics', icon: Setting }
    )
  } else if (userRole.value === 'teacher') {
    actions.push(
      { label: '指导项目', path: '/teacher/my-projects', icon: Document },
      { label: '成果评审', path: '/teacher/my-projects?tab=review', icon: Star },
      { label: '数据中心', path: '/teacher/statistics', icon: Setting }
    )
  } else if (userRole.value === 'student') {
    actions.push(
      { label: '成长中心', path: '/growth-center', icon: Star },
      { label: '排行榜', path: '/growth-center?tab=ranking', icon: Document },
      { label: '勋章墙', path: '/growth-center?tab=badges', icon: Setting }
    )
  }

  return actions
})

// 用户面板快捷操作 - 用于头像下拉菜单
const userPanelActions = computed(() => {
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

// 方法
function toggleDrawer() {
  drawerVisible.value = !drawerVisible.value
  emit('toggle-drawer', drawerVisible.value)
}

function goToProfile() {
  router.push(userProfilePath.value)
}

function goToMessages() {
  router.push('/messages')
}

function handleMenuSelect(index) {
  if (index && index.startsWith('/')) {
    router.push(index)
    drawerVisible.value = false
  }
}

function handleActionClick(action) {
  if (action.type === 'danger') {
    handleLogout()
  } else if (action.path) {
    router.push(action.path)
    drawerVisible.value = false
  }
}
</script>

<style scoped>
.project-manage-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 60px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  z-index: 1000;
}

.header-inner {
  height: 100%;
  padding-left: 20px;
  padding-right: 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 20px;
}

/* 左侧区域 */
.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 0;
}

.menu-toggle-btn {
  font-size: 24px;
  padding: 8px;
  color: #606266;
  flex-shrink: 0;
}

.menu-toggle-btn:hover {
  color: #409eff;
  background-color: #ecf5ff;
}

.breadcrumb-nav {
  flex: 1;
  min-width: 0;
}

.breadcrumb-nav :deep(.el-breadcrumb__inner) {
  color: #606266;
  font-weight: 500;
}

.breadcrumb-nav :deep(.el-breadcrumb__inner:hover) {
  color: #409eff;
}

.breadcrumb-nav :deep(.el-breadcrumb__item:last-child .el-breadcrumb__inner) {
  color: #303133;
  font-weight: 600;
}

/* 右侧区域 */
.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
  margin-left: auto;
  /* 动态计算右侧边距，使其和通用导航栏对齐 */
  /* 公式：(视口宽度 - 1200px) / 2 + 20px，最小值为 20px */
  margin-right: max(calc((100vw - 1200px) / 2 + 20px), 20px);
}

/* 覆盖 UserPanel 中的头像大小，保持原来的 36px */
.header-right :deep(.user-avatar) {
  width: 36px;
  height: 36px;
}

.header-link {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #606266;
  cursor: pointer;
  transition: color 0.2s;
  white-space: nowrap;
}

.header-link:hover {
  color: #409eff;
}

.message-badge :deep(.el-badge__content) {
  font-size: 12px;
}

/* 抽屉样式 */
.project-nav-drawer :deep(.el-drawer__header) {
  margin-bottom: 0;
  padding: 24px 16px 20px;
  border-bottom: 1px solid #ebeef5;
}

.drawer-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 100%;
}

.drawer-logo {
  height: 50px;
  max-width: 220px;
  width: auto;
  object-fit: contain;
}

.drawer-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  text-align: center;
  width: 100%;
  word-wrap: break-word;
}

.drawer-content {
  padding: 16px 0;
}

.drawer-menu {
  border: none;
}

.drawer-menu .el-menu-item {
  height: 48px;
  line-height: 48px;
  font-size: 14px;
  color: #606266;
}

.drawer-menu .el-menu-item:hover {
  background-color: #ecf5ff;
  color: #409eff;
}

.drawer-menu .el-menu-item.is-active {
  background-color: #ecf5ff;
  color: #409eff;
  font-weight: 600;
}

.quick-actions {
  margin-top: 16px;
}

.quick-actions-title {
  padding: 0 20px 8px;
  font-size: 12px;
  color: #909399;
  font-weight: 600;
  text-transform: uppercase;
}

/* 响应式 */
@media (max-width: 768px) {
  .header-right {
    gap: 16px;
  }

  .header-link span {
    display: none;
  }

  .header-link {
    font-size: 18px;
  }
}
</style>
