<template>
  <el-menu
    class="admin-sidebar"
    :default-active="active"
    router
    background-color="#f5f5f5"
    text-color="#333"
    active-text-color="#409EFF"
    :collapse="isCollapsed"
  >
    <el-menu-item index="/admin/pre-review">
      <el-icon><document-check /></el-icon>
      <span>预审管理</span>
    </el-menu-item>
    <el-menu-item index="/admin/project-audit">
      <el-icon><folder /></el-icon>
      <span>项目审核</span>
    </el-menu-item>
    <el-menu-item index="/admin/enterprise-audit">
      <el-icon><office-building /></el-icon>
      <span>企业资质</span>
    </el-menu-item>
    <!-- 其他后台入口可自行补充 -->
  </el-menu>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import {
  Document,
  Folder,
  OfficeBuilding,
} from '@element-plus/icons-vue';

const route = useRoute();
const active = ref(route.path);
watch(
  () => route.path,
  (newPath) => (active.value = newPath)
);

// 预留折叠功能，可后期开启
const isCollapsed = ref(false);
</script>

<style scoped>
.admin-sidebar {
  width: 200px;
  min-height: 100vh;
  border-right: 1px solid #e0e0e0;
  background-color: #fafafa;
}

.el-menu-item.is-active {
  font-weight: 600;
}
</style>
