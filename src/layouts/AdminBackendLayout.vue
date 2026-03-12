<template>
  <div class="admin-backend">
    <!-- 左侧侧边栏 -->
    <AdminBackendSidebar />
    <!-- 右侧内容区 -->
    <div class="admin-backend__main">
      <!-- 顶部栏 -->
      <header class="admin-backend__topbar">
        <span class="topbar-title">{{ currentTitle }}</span>
        <div class="topbar-right">
          <span class="topbar-user">{{ username }}</span>
          <el-button text type="danger" @click="handleLogout">退出登录</el-button>
        </div>
      </header>
      <!-- 页面内容 -->
      <div class="admin-backend__content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/store/modules/auth'
import { ElMessageBox } from 'element-plus'
import AdminBackendSidebar from '@/components/layout/AdminBackendSidebar.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// 当前页面标题
const currentTitle = computed(() => route.meta?.title || '管理后台')

// 用户名
const username = computed(() => authStore.userInfo?.nickname || authStore.userInfo?.username || '管理员')

// 退出登录
const handleLogout = async () => {
  try {
    await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    authStore.logout()
    router.push('/home')
  } catch {
    // 用户取消
  }
}
</script>

<style scoped>
.admin-backend {
  display: flex;
  min-height: 100vh;
}

.admin-backend__main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #f0f2f5;
  min-width: 0;
}

.admin-backend__topbar {
  height: 50px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  flex-shrink: 0;
}

.topbar-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.topbar-user {
  font-size: 14px;
  color: #606266;
}

.admin-backend__content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}
</style>
