<template>
  <div class="project-sidebar">
    <!-- 导航菜单 -->
    <el-menu
      :default-active="activeSection"
      :default-openeds="['milestones']"
      class="sidebar-menu"
      @select="handleSelect"
    >
      <!-- 基本信息（一级菜单） -->
      <el-menu-item index="basic">
        <span>基本信息</span>
      </el-menu-item>

      <!-- 分割线 -->
      <div class="menu-divider"></div>

      <!-- 揭榜管理（一级菜单） -->
      <el-menu-item index="bidding-management">
        <div class="menu-title-with-status">
          <span>揭榜管理</span>
          <el-tag :type="getBiddingStatusType()" size="small">
            {{ getBiddingStatusText() }}
          </el-tag>
        </div>
      </el-menu-item>

      <!-- 分割线 -->
      <div class="menu-divider"></div>

      <!-- 里程碑计划（可展开） -->
      <el-sub-menu index="milestones">
        <template #title>
          <div class="menu-title-with-status">
            <span>里程碑计划</span>
            <el-tag :type="getMilestonesStatusType()" size="small">
              {{ getMilestonesStatusText() }}
            </el-tag>
          </div>
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

      <!-- 分割线 -->
      <div class="menu-divider"></div>

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

// 揭榜管理状态类型
function getBiddingStatusType() {
  // 如果有中标团队，则揭榜阶段已完成
  if (props.project?.biddingStats?.selectedTeam) {
    return 'success'
  }
  // 如果有申请团队，则揭榜阶段进行中
  if (props.project?.biddingStats?.totalApplications > 0) {
    return 'primary'
  }
  // 否则未开始
  return 'info'
}

// 揭榜管理状态文本
function getBiddingStatusText() {
  if (props.project?.biddingStats?.selectedTeam) {
    return '已完成'
  }
  if (props.project?.biddingStats?.totalApplications > 0) {
    return '进行中'
  }
  return '未开始'
}

// 里程碑计划状态类型
function getMilestonesStatusType() {
  // 如果揭榜阶段未完成（没有中标团队），则里程碑计划未开始
  if (!props.project?.biddingStats?.selectedTeam) {
    return 'info'
  }
  // 检查是否有进行中的里程碑
  const hasInProgress = props.milestones?.some(m => m.status === 'in-progress')
  if (hasInProgress) {
    return 'primary'
  }
  // 检查是否所有里程碑都已完成
  const allCompleted = props.milestones?.every(m => m.status === 'completed')
  if (allCompleted && props.milestones?.length > 0) {
    return 'success'
  }
  return 'info'
}

// 里程碑计划状态文本
function getMilestonesStatusText() {
  if (!props.project?.biddingStats?.selectedTeam) {
    return '未开始'
  }
  const hasInProgress = props.milestones?.some(m => m.status === 'in-progress')
  if (hasInProgress) {
    return '进行中'
  }
  const allCompleted = props.milestones?.every(m => m.status === 'completed')
  if (allCompleted && props.milestones?.length > 0) {
    return '已完成'
  }
  return '未开始'
}
</script>

<style scoped>
.project-sidebar {
  width: 260px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  flex-shrink: 0;
}

/* 菜单分割线 */
.menu-divider {
  height: 1px;
  background: #e4e7ed;
  margin: 0 auto;
  width: 80%;
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

/* 一级导航标题带状态 */
.menu-title-with-status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 8px;
}

.menu-title-with-status span:first-child {
  flex: 1;
}

.menu-title-with-status .el-tag {
  flex-shrink: 0;
}

/* 响应式 */
@media (max-width: 1200px) {
  .project-sidebar {
    width: 100%;
  }
}
</style>
