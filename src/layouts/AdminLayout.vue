<template>
  <div class="admin-layout">
    <AppHeader />
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
import AppHeader from '@/components/layout/AppHeader/index.vue'
import AppFooter from '@/components/layout/AppFooter/index.vue'
import AppSidebar from '@/components/layout/AppSidebar/index.vue'
import Breadcrumb from '@/components/layout/Breadcrumb/index.vue'

const route = useRoute()

// 根据路由meta决定是否显示侧边栏和面包屑
const showSidebar = computed(() => route.meta.showSidebar !== false)
const showBreadcrumb = computed(() => route.meta.showBreadcrumb !== false)
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

