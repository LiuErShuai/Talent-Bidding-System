<template>
  <header class="main-header">
    <div class="header-inner">
      <div class="brand">
        <router-link to="/home" class="brand-logo-link">
          <img src="@/assets/images/logo/桂电透明背景logo.png" alt="创客平台" style="height: 45px; width: auto; max-width: 180px; object-fit: contain; border-radius: 8px;" />
        </router-link>
        <router-link to="/home" class="brand-name-link">
          <span class="brand-name">创客平台</span>
        </router-link>
      </div>
      <nav class="main-nav">
        <!-- 根据登录状态显示不同的导航栏 -->
        <router-link to="/home" class="nav-link" active-class="active">首页</router-link>
        <el-dropdown trigger="hover" class="nav-dropdown">
          <span class="nav-link dropdown-trigger">
            创客空间
            <el-icon class="dropdown-icon"><ArrowDown /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>
                <router-link to="/projects" class="dropdown-item-link">项目大厅</router-link>
              </el-dropdown-item>
              <el-dropdown-item>
                <router-link to="/projects?sort=hot" class="dropdown-item-link">热门项目</router-link>
              </el-dropdown-item>
              <el-dropdown-item>
                <router-link to="/projects" class="dropdown-item-link">项目详情</router-link>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <router-link to="/projects" class="nav-link" active-class="active">项目大厅</router-link>
        <template v-if="!isLoggedIn">
          <span class="nav-link" @click="handleRequireLogin('/growth-center', '成长中心')">成长中心</span>
          <span class="nav-link" @click="handleRequireLogin('/messages', '消息')">消息</span>
        </template>
        <template v-else>
          <router-link to="/growth-center" class="nav-link" active-class="active">成长中心</router-link>
          <router-link to="/messages" class="nav-link messages" active-class="active">
            <span>消息</span>
            <span v-if="unreadCount > 0" class="badge">{{ unreadCount }}</span>
          </router-link>
        </template>
      </nav>
      <div class="auth-area">
        <template v-if="!isLoggedIn">
          <router-link to="/login" class="auth-btn">登录</router-link>
          <router-link to="/register" class="auth-btn solid">注册</router-link>
        </template>
        <UserPanel v-else :user-info="userInfo" :user-role="userRole" />
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/modules/auth'
import { ArrowDown } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import UserPanel from './UserPanel.vue'

const router = useRouter()
const authStore = useAuthStore()

// 初始化认证状态
onMounted(() => {
  authStore.initAuth()
})

const isLoggedIn = computed(() => authStore.isLoggedIn)
const userInfo = computed(() => authStore.userInfo || {})
const userRole = computed(() => authStore.userRole || '')
const unreadCount = ref(2)

// 处理需要登录的功能
const handleRequireLogin = (redirectPath, feature) => {
  ElMessage.warning(`请先登录后再使用${feature}功能`)
  router.push(`/login?redirect=${encodeURIComponent(redirectPath)}`)
}
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
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: inherit;
  flex-shrink: 0;
}

.brand-name-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: inherit;
}

.brand-name {
  font-size: 18px;
  font-weight: 700;
  color: #0f2c85;
}

.main-nav {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
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
  gap: 12px;
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
}

.auth-btn.solid {
  background: linear-gradient(120deg, #0c5fe7, #2fb7ff);
  color: #fff;
  box-shadow: 0 12px 24px rgba(12, 95, 231, 0.25);
}

.auth-btn:hover {
  transform: translateY(-2px);
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
