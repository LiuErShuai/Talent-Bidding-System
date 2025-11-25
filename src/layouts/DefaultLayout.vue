<template>
  <div class="default-layout">
    <AppHeader
      :nav-items="navConfig.navItems"
      :quick-actions="navConfig.quickActions"
      :variant="navConfig.variant"
      :unread-count="unreadCount"
    />
    <main class="layout-main">
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
    <AppFooter />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/store/modules/auth'
import { getNavByRole } from '@/utils/navConfig'
import AppHeader from '@/components/layout/AppHeader/index.vue'
import AppFooter from '@/components/layout/AppFooter/index.vue'

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
.default-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.layout-main {
  flex: 1;
  width: 100%;
}
</style>
