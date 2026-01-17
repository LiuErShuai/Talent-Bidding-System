<template>
  <div class="default-layout" :class="{ 'has-fixed-header': shouldFixHeader, 'hide-header': shouldHideHeader }">
    <!-- 根据路由 meta 决定是否显示 AppHeader -->
    <AppHeader
      v-if="!shouldHideHeader"
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
    <!-- 根据路由 meta 决定是否显示 AppFooter -->
    <AppFooter v-if="!$route.meta.hideFooter" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/store/modules/auth'
import { getNavByRole } from '@/utils/navConfig'
import AppHeader from '@/components/layout/AppHeader/index.vue'
import AppFooter from '@/components/layout/AppFooter/index.vue'

const route = useRoute()

// 判断是否需要固定导航栏
const shouldFixHeader = computed(() => {
  return route.path === '/my-projects' || route.path.match(/^\/projects\/\d+\/manage$/)
})

// 判断是否需要隐藏默认导航栏（项目管理页面使用自定义导航栏）
const shouldHideHeader = computed(() => {
  return route.meta.hideHeader === true
})

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
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  height: auto;
}

/* 当导航栏固定时，为内容区域添加顶部间距 */
.default-layout.has-fixed-header .layout-main {
  padding-top: 90px; /* 导航栏高度 + 额外间距 */
}

/* 当隐藏默认导航栏时，不添加顶部间距 */
.default-layout.hide-header .layout-main {
  padding-top: 0;
}

.layout-main {
  flex: 1 1 auto;
  width: 100%;
  /* 确保不创建滚动，让子组件自己处理滚动 */
  min-height: 0;
  overflow: visible;
  height: 100%;
}
</style>
