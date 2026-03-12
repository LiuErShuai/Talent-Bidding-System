<template>
  <aside class="admin-sidebar">
    <!-- 顶部 Logo 区域 -->
    <div class="sidebar-header">
      <img src="@/assets/images/logo/桂电透明背景logo.png" alt="Logo" class="sidebar-logo" />
      <span class="sidebar-title">管理后台</span>
    </div>
    <!-- 导航菜单 -->
    <el-menu
      :default-active="activeMenu"
      router
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409eff"
      class="sidebar-menu"
    >
      <el-menu-item index="/admin/dashboard">
        <el-icon><Odometer /></el-icon>
        <span>仪表盘</span>
      </el-menu-item>
      <el-menu-item index="/admin/project-review">
        <el-icon><Document /></el-icon>
        <span>项目审核</span>
      </el-menu-item>
      <el-menu-item index="/admin/enterprise-review">
        <el-icon><OfficeBuilding /></el-icon>
        <span>企业资质审核</span>
      </el-menu-item>
      <el-menu-item index="/admin/category-management">
        <el-icon><Menu /></el-icon>
        <span>分类管理</span>
      </el-menu-item>
      <el-menu-item index="/admin/statistics">
        <el-icon><DataAnalysis /></el-icon>
        <span>数据中心</span>
      </el-menu-item>
    </el-menu>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Odometer, Document, OfficeBuilding, Menu, DataAnalysis } from '@element-plus/icons-vue'

const route = useRoute()

// 当前激活的菜单项
const activeMenu = computed(() => route.path)
</script>

<style scoped>
.admin-sidebar {
  width: 220px;
  background: #304156;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.sidebar-header {
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-logo {
  height: 32px;
  width: auto;
  object-fit: contain;
  filter: brightness(0) invert(1);
}

.sidebar-title {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  white-space: nowrap;
}

.sidebar-menu {
  border-right: none;
  flex: 1;
}

.sidebar-menu :deep(.el-menu-item) {
  height: 50px;
  line-height: 50px;
}

.sidebar-menu :deep(.el-menu-item.is-active) {
  background-color: rgba(64, 158, 255, 0.15) !important;
}

/* 禁用所有过渡动画 */
.sidebar-menu :deep(.el-menu-item),
.sidebar-menu :deep(.el-menu-item *) {
  transition: none !important;
}
</style>
