<template>
  <div class="auth-layout">
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
// 认证页面布局，不包含Header和Footer
</script>

<style scoped>
.auth-layout {
  min-height: 100vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
</style>

