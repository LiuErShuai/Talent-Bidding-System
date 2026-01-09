<template>
  <div class="project-sidebar">
    <!-- 项目标题 -->
    <div class="sidebar-header">
      <h3 class="project-name">{{ project?.name }}</h3>
      <el-tag :type="getStatusType(project?.status)" size="small">
        {{ project?.statusText }}
      </el-tag>
    </div>

    <!-- 导航菜单 -->
    <el-menu
      :default-active="activeSection"
      class="sidebar-menu"
      @select="handleSelect"
    >
      <!-- 基本信息 -->
      <el-menu-item index="basic">
        <span>基本信息</span>
      </el-menu-item>

      <!-- 里程碑计划（可展开） -->
      <el-sub-menu index="milestones">
        <template #title>
          <span>里程碑计划</span>
        </template>
        <el-menu-item
          v-for="milestone in milestones"
          :key="milestone.id"
          :index="`milestone-${milestone.id}`"
        >
          <div class="milestone-menu-item">
            <span class="milestone-name">{{ milestone.title }}</span>
            <el-tag
              :type="getMilestoneTagType(milestone.status)"
              size="small"
              class="milestone-tag"
            >
              {{ getMilestoneStatusText(milestone.status) }}
            </el-tag>
          </div>
        </el-menu-item>
      </el-sub-menu>

      <!-- 历史记录 -->
      <el-menu-item index="history">
        <span>历史记录</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  project: {
    type: Object,
    default: null
  },
  milestones: {
    type: Array,
    default: () => []
  },
  activeSection: {
    type: String,
    default: 'basic'
  }
})

const emit = defineEmits(['select'])

// 处理菜单选择
function handleSelect(index) {
  emit('select', index)
}

// 项目状态类型
function getStatusType(status) {
  const map = {
    'ongoing': 'primary',
    'completed': 'success',
    'pending': 'info',
    'cancelled': 'danger'
  }
  return map[status] || 'info'
}

// 里程碑状态文本
function getMilestoneStatusText(status) {
  const map = {
    'completed': '已完成',
    'in-progress': '进行中',
    'pending': '待开始',
    'skipped': '已跳过'
  }
  return map[status] || status
}

// 里程碑标签类型
function getMilestoneTagType(status) {
  const map = {
    'completed': 'success',
    'in-progress': 'primary',
    'pending': 'info',
    'skipped': 'warning'
  }
  return map[status] || 'info'
}
</script>

<style scoped>
.project-sidebar {
  width: 260px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  flex-shrink: 0;
}

/* 侧边栏头部 */
.sidebar-header {
  padding: 20px 16px;
  border-bottom: 1px solid #f0f0f0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.project-name {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  line-height: 1.4;
  word-break: break-word;
}

.sidebar-header .el-tag {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: #fff;
}

/* 菜单样式 */
.sidebar-menu {
  border-right: none;
}

.sidebar-menu :deep(.el-menu-item),
.sidebar-menu :deep(.el-sub-menu__title) {
  height: 48px;
  line-height: 48px;
  font-size: 14px;
  color: #303133;
}

.sidebar-menu :deep(.el-menu-item:hover),
.sidebar-menu :deep(.el-sub-menu__title:hover) {
  background-color: #f5f7fb;
}

.sidebar-menu :deep(.el-menu-item.is-active) {
  background-color: #ecf5ff;
  color: #409eff;
  font-weight: 500;
}

/* 里程碑菜单项 */
.milestone-menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 8px;
}

.milestone-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.milestone-tag {
  flex-shrink: 0;
}

/* 子菜单样式 */
.sidebar-menu :deep(.el-sub-menu .el-menu-item) {
  padding-left: 48px !important;
  min-width: 0;
}

.sidebar-menu :deep(.el-sub-menu__title) {
  font-weight: 500;
}

/* 响应式 */
@media (max-width: 1200px) {
  .project-sidebar {
    width: 100%;
  }
}
</style>
