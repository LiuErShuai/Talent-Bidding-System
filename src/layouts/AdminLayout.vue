<template>
  <div class="admin-layout">
    <AppHeader
      :nav-items="navConfig.navItems"
      :quick-actions="navConfig.quickActions"
      :variant="navConfig.variant"
      :unread-count="unreadCount"
    />
    <div class="admin-container">
      <AppSidebar v-if="showSidebar" />
      <main class="admin-main">
        <Breadcrumb v-if="showBreadcrumb" />
        <router-view v-slot="{ Component, route }">
          <transition
            :name="route.meta.transition || 'slide-fade'"
            mode="out-in"
            appear
          >
            <component :is="Component" :key="route.path" />
          </transition>
        </router-view>
      </main>
    </div>
    <AppFooter />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/store/modules/auth'
import { getNavByRole } from '@/utils/navConfig'
import AppHeader from '@/components/layout/AppHeader/index.vue'
import AppFooter from '@/components/layout/AppFooter/index.vue'
import AppSidebar from '@/components/layout/AppSidebar/index.vue'
import Breadcrumb from '@/components/layout/Breadcrumb/index.vue'

// ========================================
// 路由和侧边栏控制
// ========================================

const route = useRoute()

// 根据路由meta决定是否显示侧边栏和面包屑
const showSidebar = computed(() => route.meta.showSidebar !== false)
const showBreadcrumb = computed(() => route.meta.showBreadcrumb !== false)

// ========================================
// 获取认证状态和角色
// ========================================

const authStore = useAuthStore()

// 获取当前角色（默认为 visitor）
const role = computed(() => authStore.role || 'visitor')
const isLoggedIn = computed(() => authStore.isLoggedIn)

// ========================================
// 获取导航配置
// ========================================

/**
 * 根据用户角色获取导航配置
 * 包含 navItems（导航项）、quickActions（快捷操作）、variant（样式变体）
 */
const navConfig = computed(() => {
  return getNavByRole(role.value, isLoggedIn.value)
})

// ========================================
// 未读消息数（当前 mock，后续从 API 获取）
// ========================================

/**
 * 未读消息数量映射
 * TODO: 后续需要从 authStore 或 API 获取真实数据
 */
const unreadCount = computed(() => ({
  messages: 0 // 当前 mock 为 0，避免显示徽章
}))
</script>

<style scoped>
.admin-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.admin-container {
  flex: 1;
  display: flex;
  width: 100%;
}

.admin-main {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}
</style>
