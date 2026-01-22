<template>
  <div class="quick-action-panel">
    <!-- 项目统计 -->
    <div class="panel-section">
      <h4 class="section-title">
        <el-icon><DataAnalysis /></el-icon>
        项目统计
      </h4>
      <div class="stats-grid">
        <div class="stat-item">
          <span class="stat-label">总里程碑</span>
          <span class="stat-value">{{ statistics.total }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">已完成</span>
          <span class="stat-value success">{{ statistics.completed }}</span>
        </div>
      </div>
    </div>

    <!-- 当前里程碑 -->
    <div v-if="currentMilestone" class="panel-section current-milestone-section">
      <h4 class="section-title">
        <el-icon><Aim /></el-icon>
        当前里程碑
      </h4>
      <div class="current-milestone-card">
        <h5 class="milestone-title">{{ currentMilestone.title }}</h5>
        <div class="progress-wrapper">
          <span class="progress-note">{{ currentMilestone.progressDetail.note }}</span>
        </div>
        <div class="milestone-info">
          <div class="info-row">
            <el-icon><Calendar /></el-icon>
            <span>{{ currentMilestone.plannedDate }}</span>
          </div>
          <div class="info-row" :class="{ 'text-danger': remainingDays < 0 }">
            <el-icon><Clock /></el-icon>
            <span>{{ remainingDaysText }}</span>
          </div>
        </div>
      </div>

      <!-- 快捷操作按钮 -->
      <div class="quick-actions">
        <el-button type="primary" @click="$emit('upload')" class="action-btn">
          上传交付物
        </el-button>
        <el-button @click="$emit('viewRequirements')" class="action-btn">
          查看要求
        </el-button>
      </div>
    </div>

    <!-- 快速跳转 -->
    <div class="panel-section">
      <h4 class="section-title">
        <el-icon><Guide /></el-icon>
        快速跳转
      </h4>
      <div class="jump-links">
        <el-link type="primary" :underline="false" @click="$emit('jump', 'team')">
          <el-icon><User /></el-icon>
          团队成员
        </el-link>
        <el-link type="primary" :underline="false" @click="$emit('jump', 'reviews')">
          <el-icon><ChatLineSquare /></el-icon>
          审核历史与动态
        </el-link>
      </div>
    </div>

    <!-- 待办提醒 -->
    <div v-if="alerts.length > 0" class="panel-section">
      <h4 class="section-title">
        <el-icon><BellFilled /></el-icon>
        待办提醒
      </h4>
      <div class="alerts-list">
        <el-alert
          v-for="alert in alerts"
          :key="alert.id"
          :type="alert.type"
          :title="alert.title"
          :closable="false"
          show-icon
          @click="handleAlertClick(alert)"
          class="alert-item"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  DataAnalysis,
  Aim,
  Calendar,
  Guide,
  User,
  ChatLineSquare,
  BellFilled
} from '@element-plus/icons-vue'
import { calculateRemainingDays } from '@/mock/projectManage'

const props = defineProps({
  milestones: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['upload', 'viewRequirements', 'jump', 'alertClick'])

// 统计数据
const statistics = computed(() => {
  return {
    total: props.milestones.length,
    completed: props.milestones.filter(m => m.status === 'completed').length,
    inProgress: props.milestones.filter(m => m.status === 'in-progress').length,
    pending: props.milestones.filter(m => m.status === 'pending').length
  }
})

// 当前里程碑
const currentMilestone = computed(() => {
  return props.milestones.find(m => m.status === 'in-progress')
})

// 剩余天数
const remainingDays = computed(() => {
  if (!currentMilestone.value || !currentMilestone.value.plannedDate) {
    return null
  }
  return calculateRemainingDays(currentMilestone.value.plannedDate)
})

// 剩余天数文本
const remainingDaysText = computed(() => {
  if (remainingDays.value === null) return '-'
  if (remainingDays.value > 0) return `剩余 ${remainingDays.value} 天`
  if (remainingDays.value === 0) return '今天截止'
  return `逾期 ${-remainingDays.value} 天`
})

// 待办提醒
const alerts = computed(() => {
  const result = []

  props.milestones.forEach(m => {
    // 检查被驳回的提交
    m.submissions?.forEach(s => {
      if (s.status === 'rejected') {
        result.push({
          id: `rejected-${s.id}`,
          type: 'warning',
          title: `${m.title} - 需要修改重提`,
          milestoneId: m.id
        })
      }
    })

    // 检查逾期的里程碑
    if (m.status === 'in-progress' && m.plannedDate) {
      const days = calculateRemainingDays(m.plannedDate)
      if (days < 0) {
        result.push({
          id: `overdue-${m.id}`,
          type: 'warning',
          title: `${m.title} - 已逾期`,
          milestoneId: m.id
        })
      } else if (days <= 3) {
        result.push({
          id: `urgent-${m.id}`,
          type: 'warning',
          title: `${m.title} - 即将截止`,
          milestoneId: m.id
        })
      }
    }
  })

  return result
})

// 处理提醒点击
function handleAlertClick(alert) {
  emit('alertClick', alert)
}
</script>

<style scoped>
.quick-action-panel {
  width: 280px;
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  position: sticky;
  top: 100px;
  max-height: calc(100vh - 40px);
  overflow-y: auto;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

/* 滚动条样式 */
.quick-action-panel::-webkit-scrollbar {
  width: 6px;
}

.quick-action-panel::-webkit-scrollbar-thumb {
  background: #d9d9d9;
  border-radius: 3px;
}

.quick-action-panel::-webkit-scrollbar-thumb:hover {
  background: #bfbfbf;
}

.panel-section {
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.panel-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #1f274b;
}

.section-title .el-icon {
  font-size: 16px;
  color: #1890ff;
}

.alert-badge {
  margin-left: auto;
  padding: 2px 6px;
  background: #ff4d4f;
  color: #fff;
  font-size: 11px;
  border-radius: 8px;
  display: none; /* 已移除显示，保留样式以防其他地方使用 */
}

/* 统计网格 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px;
  background: #f5f7fb;
  border-radius: 8px;
  text-align: center;
}

.stat-label {
  font-size: 12px;
  color: #909399;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: #1f274b;
}

.stat-value.success {
  color: #52c41a;
}

.stat-value.primary {
  color: #1890ff;
}

/* 当前里程碑 */
.current-milestone-section {
  background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
  border-radius: 12px;
  padding: 16px;
  border-bottom: none;
}

.current-milestone-card {
  margin-bottom: 12px;
}

.milestone-title {
  margin: 0 0 12px 0;
  font-size: 15px;
  font-weight: 600;
  color: #1f274b;
}

.progress-wrapper {
  margin-bottom: 12px;
}

.progress-note {
  display: block;
  margin-top: 6px;
  font-size: 12px;
  color: #606266;
}

.milestone-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #606266;
}

.info-row .el-icon {
  font-size: 14px;
  color: #909399;
}

.info-row.text-danger {
  color: #ff4d4f;
  font-weight: 600;
}

.info-row.text-danger .el-icon {
  color: #ff4d4f;
}

/* 快捷操作 */
.quick-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  flex: 1;
  justify-content: center;
}

/* 快速跳转 */
.jump-links {
  display: flex;
  flex-direction: column;
  gap: 0px;
}

.jump-links .el-link {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  padding: 6px 8px;
  border-radius: 6px;
  transition: background 0.3s;
}

.jump-links .el-link:hover {
  background: #f0f0f0;
}

/* 待办提醒 */
.alerts-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.alert-item {
  cursor: pointer;
  transition: transform 0.3s;
}

.alert-item:hover {
  transform: translateX(2px);
}

.alert-item :deep(.el-alert__title) {
  font-size: 12px;
  line-height: 1.4;
}

/* 响应式 */
@media (max-width: 1200px) {
  .quick-action-panel {
    width: 240px;
  }
}

@media (max-width: 768px) {
  .quick-action-panel {
    width: 100%;
    position: static;
    max-height: none;
    margin-bottom: 20px;
  }

  .current-milestone-section {
    padding: 12px;
  }
}
</style>
