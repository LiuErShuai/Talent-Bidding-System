<template>
  <div class="bidding-basic-info">
    <!-- 项目基本信息卡片 -->
    <div class="project-info-section">
      <div class="project-header">
        <div class="project-header-left">
          <el-tag class="status-tag" :type="getStatusType(project.status)">
            {{ project.statusText }}
          </el-tag>
          <h1 class="project-title">{{ project.name }}</h1>
        </div>
      </div>

      <div class="publisher-info">
        <span class="publisher">发布方：{{ project.publisher }}</span>
      </div>

      <!-- 项目基本信息卡片 -->
      <div class="basic-info-card">
        <div class="info-row">
          <div class="info-item">
            <span class="label">悬赏金额</span>
            <span class="value price">¥{{ project.reward?.toLocaleString() }}</span>
          </div>
          <div class="info-item">
            <span class="label">项目领域</span>
            <span class="value">{{ project.category }}</span>
          </div>
        </div>

        <div class="info-row">
          <div class="info-item">
            <span class="label">项目周期</span>
            <span class="value">{{ calculateDuration() }}天</span>
          </div>
          <div class="info-item">
            <span class="label">发布时间</span>
            <span class="value">{{ project.startDate }}</span>
          </div>
        </div>

        <div class="info-row">
          <div class="info-item">
            <span class="label">截止时间</span>
            <span class="value">{{ project.endDate }}</span>
          </div>
          <div class="info-item">
            <span class="label">揭榜状态</span>
            <span class="value">{{ getBiddingStatusText() }}</span>
          </div>
        </div>

        <div class="info-row">
          <div class="info-item full-width">
            <span class="label">项目描述</span>
            <span class="value">{{ project.description }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 揭榜征集信息 -->
    <div class="bidding-status-section">
      <div class="section-header">
        <h2 class="section-title">揭榜征集状态</h2>
        <el-tag :type="getBiddingStatusType()" size="small">
          {{ getBiddingStatusText() }}
        </el-tag>
      </div>

      <div class="status-card">
        <div class="status-item">
          <div class="status-icon">
            <el-icon><User /></el-icon>
          </div>
          <div class="status-details">
            <div class="status-label">申请团队数</div>
            <div class="status-value">{{ project.biddingStats?.totalApplications || 0 }} 个</div>
          </div>
        </div>

        <div class="status-item">
          <div class="status-icon">
            <el-icon><Check /></el-icon>
          </div>
          <div class="status-details">
            <div class="status-label">审核通过</div>
            <div class="status-value">{{ project.biddingStats?.approvedApplications || 0 }} 个</div>
          </div>
        </div>

        <div class="status-item">
          <div class="status-icon">
            <el-icon><Clock /></el-icon>
          </div>
          <div class="status-details">
            <div class="status-label">待审核</div>
            <div class="status-value">{{ project.biddingStats?.pendingApplications || 0 }} 个</div>
          </div>
        </div>

        <div class="status-item">
          <div class="status-icon">
            <el-icon><Trophy /></el-icon>
          </div>
          <div class="status-details">
            <div class="status-label">中标团队</div>
            <div class="status-value">{{ project.biddingStats?.selectedTeam || '未选定' }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 里程碑状态 -->
    <div v-if="project.biddingStats?.selectedTeam" class="milestone-status-section">
      <div class="section-header">
        <h2 class="section-title">里程碑状态</h2>
        <el-tag :type="getMilestoneStatusType()" size="small">
          {{ getMilestoneStatusText() }}
        </el-tag>
      </div>

      <div v-if="currentMilestone" class="milestone-card">
        <div class="milestone-header">
          <div class="milestone-info">
            <h3 class="milestone-title">{{ currentMilestone.title }}</h3>
            <el-tag :type="getStatusTagType(currentMilestone.status)" size="small">
              {{ currentMilestone.statusText }}
            </el-tag>
          </div>
          <el-button type="primary" @click="handleViewMilestone">
            查看详情
          </el-button>
        </div>
        <p class="milestone-description">{{ currentMilestone.description }}</p>
        <div class="milestone-meta">
          <span class="meta-item">
            <el-icon><Calendar /></el-icon>
            计划完成：{{ currentMilestone.plannedDate }}
          </span>
          <span class="meta-item">
            <el-icon><Document /></el-icon>
            交付物：{{ currentMilestone.deliverables?.length || 0 }} 项
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue'
import { User, Check, Clock, Trophy, Calendar, Document } from '@element-plus/icons-vue'

const props = defineProps({
  project: {
    type: Object,
    required: true
  },
  milestones: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['viewMilestone'])

// 当前里程碑（进行中或待开始的第一个）
const currentMilestone = computed(() => {
  if (!props.milestones || props.milestones.length === 0) return null
  // 优先返回进行中的里程碑
  const inProgress = props.milestones.find(m => m.status === 'in-progress')
  if (inProgress) return inProgress
  // 否则返回第一个待开始的里程碑
  const pending = props.milestones.find(m => m.status === 'pending')
  return pending || props.milestones[0]
})

// 计算项目周期
function calculateDuration() {
  if (!props.project.startDate || !props.project.endDate) return 0
  const start = new Date(props.project.startDate)
  const end = new Date(props.project.endDate)
  const diff = end - start
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

// 项目状态类型
function getStatusType(status) {
  const map = {
    'bidding': 'warning',
    'ongoing': 'primary',
    'completed': 'success',
    'pending': 'info',
    'cancelled': 'danger'
  }
  return map[status] || 'info'
}

// 揭榜状态类型
function getBiddingStatusType() {
  if (props.project.biddingStats?.selectedTeam) {
    return 'success'
  }
  if (props.project.biddingStats?.totalApplications > 0) {
    return 'primary'
  }
  return 'info'
}

// 揭榜状态文本
function getBiddingStatusText() {
  if (props.project.biddingStats?.selectedTeam) {
    return '已完成'
  }
  if (props.project.biddingStats?.totalApplications > 0) {
    return '进行中'
  }
  return '未开始'
}

// 里程碑状态类型
function getMilestoneStatusType() {
  const hasInProgress = props.milestones?.some(m => m.status === 'in-progress')
  if (hasInProgress) return 'primary'
  const allCompleted = props.milestones?.every(m => m.status === 'completed')
  if (allCompleted && props.milestones?.length > 0) return 'success'
  return 'info'
}

// 里程碑状态文本
function getMilestoneStatusText() {
  const hasInProgress = props.milestones?.some(m => m.status === 'in-progress')
  if (hasInProgress) return '进行中'
  const allCompleted = props.milestones?.every(m => m.status === 'completed')
  if (allCompleted && props.milestones?.length > 0) return '已完成'
  return '未开始'
}

// 里程碑状态标签类型
function getStatusTagType(status) {
  const map = {
    'completed': 'success',
    'in-progress': 'primary',
    'pending': 'info',
    'skipped': 'warning'
  }
  return map[status] || 'info'
}

// 查看里程碑详情
function handleViewMilestone() {
  if (currentMilestone.value) {
    emit('viewMilestone', currentMilestone.value.id)
  }
}
</script>

<style scoped>
.bidding-basic-info {
  max-width: 1200px;
}

/* 项目信息区 */
.project-info-section {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.project-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.status-tag {
  flex-shrink: 0;
}

.project-title {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #303133;
}

.publisher-info {
  margin-bottom: 20px;
  color: #606266;
  font-size: 14px;
}

.publisher {
  font-weight: 500;
}

/* 基本信息卡片 */
.basic-info-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  background: #f5f7fb;
  border-radius: 8px;
}

.info-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.info-item.full-width {
  grid-column: 1 / -1;
}

.label {
  font-size: 13px;
  color: #909399;
  font-weight: 500;
}

.value {
  font-size: 15px;
  color: #303133;
  font-weight: 500;
}

.value.price {
  font-size: 20px;
  color: #f56c6c;
  font-weight: 600;
}

/* 揭榜状态区 */
.bidding-status-section {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.status-card {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f5f7fb;
  border-radius: 8px;
}

.status-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #409eff;
  border-radius: 50%;
  color: #fff;
  font-size: 24px;
}

.status-details {
  flex: 1;
}

.status-label {
  font-size: 13px;
  color: #909399;
  margin-bottom: 4px;
}

.status-value {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

/* 里程碑状态区 */
.milestone-status-section {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.milestone-card {
  padding: 20px;
  background: #f5f7fb;
  border-radius: 8px;
}

.milestone-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.milestone-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.milestone-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.milestone-description {
  margin: 0 0 16px 0;
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
}

.milestone-meta {
  display: flex;
  gap: 24px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #606266;
}

/* 响应式 */
@media (max-width: 768px) {
  .info-row {
    grid-template-columns: 1fr;
  }

  .status-card {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .status-card {
    grid-template-columns: 1fr;
  }
}
</style>
