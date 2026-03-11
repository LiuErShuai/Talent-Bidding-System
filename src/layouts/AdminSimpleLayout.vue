<template>
  <div class="admin-simple-layout">
    <AdminSidebar />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import AdminSidebar from '@/components/layout/AdminSidebar.vue';
</script>

<style scoped>
.admin-simple-layout {
  display: flex;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  padding: 24px;
  background-color: #fff;
}
</style>
