<template>
  <div class="empty-layout">
    <router-view v-slot="{ Component, route }">
      <transition 
        :name="route.meta.transition || 'fade'" 
        mode="out-in"
        appear
      >
        <component :is="Component" :key="route.path" />
      </transition>
    </router-view>
  </div>
</template>

<script setup>
// 空布局，仅显示内容，无Header和Footer
</script>

<style scoped>
.empty-layout {
  min-height: 100vh;
  width: 100%;
}
</style>

