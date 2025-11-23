<template>
  <div class="default-layout">
    <AppHeader />
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
import AppHeader from '@/components/layout/AppHeader/index.vue'
import AppFooter from '@/components/layout/AppFooter/index.vue'
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

