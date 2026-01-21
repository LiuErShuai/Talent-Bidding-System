<template>
  <div class="milestone-detail-panel">
    <!-- 面板头部 -->
    <div class="panel-header">
      <div class="header-left">
        <h3 class="milestone-title">{{ milestone?.title || '里程碑详情' }}</h3>
        <el-tag :type="statusTagType" size="small">{{ statusText }}</el-tag>
      </div>
      <div class="header-right">
        <el-button
          v-if="showPrevButton"
          size="small"
          :icon="ArrowLeft"
          @click="handlePrev"
        >
          上一个
        </el-button>
        <el-button
          v-if="showNextButton"
          size="small"
          @click="handleNext"
        >
          下一个
          <el-icon class="el-icon--right"><ArrowRight /></el-icon>
        </el-button>
      </div>
    </div>

    <!-- 面板内容 -->
    <div class="panel-content">
      <!-- 基本信息 -->
      <div class="info-section">
        <div class="info-row">
          <div class="info-item">
            <span class="info-label">开始时间：</span>
            <span class="info-value">{{ formatDate(milestone?.startDate) }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">截止时间：</span>
            <span class="info-value" :class="{ 'text-danger': isOverdue }">
              {{ formatDate(milestone?.endDate) }}
            </span>
          </div>
          <div class="info-item">
            <span class="info-label">剩余时间：</span>
            <span class="info-value" :class="remainingTimeClass">
              {{ remainingTime }}
            </span>
          </div>
        </div>
      </div>

      <!-- 里程碑描述 -->
      <div v-if="milestone?.description" class="description-section">
        <h4 class="section-title">📋 里程碑说明</h4>
        <p class="description-text">{{ milestone.description }}</p>
      </div>

      <!-- 交付物要求 -->
      <div v-if="milestone?.deliverables?.length" class="deliverables-section">
        <h4 class="section-title">📦 交付物要求</h4>
        <div class="deliverables-list">
          <div
            v-for="deliverable in milestone.deliverables"
            :key="deliverable.id"
            class="deliverable-item"
          >
            <div class="deliverable-header">
              <el-icon class="deliverable-icon"><Document /></el-icon>
              <span class="deliverable-name">{{ deliverable.name }}</span>
              <el-tag
                v-if="getDeliverableStatus(deliverable.id)"
                :type="getDeliverableStatus(deliverable.id).type"
                size="small"
              >
                {{ getDeliverableStatus(deliverable.id).text }}
              </el-tag>
            </div>
            <p class="deliverable-requirement">{{ deliverable.requirement }}</p>
          </div>
        </div>
      </div>

      <!-- 提交记录 -->
      <div v-if="milestone?.submissions?.length" class="submissions-section">
        <h4 class="section-title">📤 提交记录</h4>
        <div class="submissions-list">
          <div
            v-for="submission in milestone.submissions"
            :key="submission.id"
            class="submission-item"
            @click="handleViewSubmission(submission)"
          >
            <div class="submission-header">
              <div class="submission-info">
                <span class="submission-version">v{{ submission.version }}</span>
                <span class="submission-filename">{{ submission.fileName }}</span>
              </div>
              <el-tag :type="getSubmissionTagType(submission.status)" size="small">
                {{ getSubmissionStatusText(submission.status) }}
              </el-tag>
            </div>
            <div class="submission-meta">
              <span>{{ submission.uploader }}</span>
              <span class="meta-sep">•</span>
              <span>{{ submission.uploadTime }}</span>
              <span class="meta-sep">•</span>
              <span>{{ submission.fileSize }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="action-section">
        <el-button
          v-if="milestone?.status === 'in-progress'"
          type="primary"
          size="large"
          @click="handleUpload"
        >
          <el-icon><Upload /></el-icon>
          上传交付物
        </el-button>
        <el-button
          v-if="milestone?.status === 'completed'"
          type="success"
          size="large"
          disabled
        >
          <el-icon><Check /></el-icon>
          已完成
        </el-button>
        <el-button
          v-if="milestone?.status === 'pending'"
          size="large"
          disabled
        >
          <el-icon><Clock /></el-icon>
          待开始
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  ArrowLeft,
  ArrowRight,
  Document,
  Upload,
  Check,
  Clock
} from '@element-plus/icons-vue'

const props = defineProps({
  milestone: {
    type: Object,
    required: true
  },
  currentIndex: {
    type: Number,
    required: true
  },
  totalCount: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['prev', 'next', 'upload', 'viewSubmission'])

// 状态文本映射
const statusText = computed(() => {
  const statusMap = {
    'pending': '待开始',
    'in-progress': '进行中',
    'completed': '已完成'
  }
  return statusMap[props.milestone?.status] || '未知'
})

// 状态标签类型
const statusTagType = computed(() => {
  const typeMap = {
    'pending': 'info',
    'in-progress': 'warning',
    'completed': 'success'
  }
  return typeMap[props.milestone?.status] || 'info'
})

// 是否显示上一个按钮
const showPrevButton = computed(() => props.currentIndex > 0)

// 是否显示下一个按钮
const showNextButton = computed(() => props.currentIndex < props.totalCount - 1)

// 格式化日期
const formatDate = (dateStr) => {
  if (!dateStr) return '--'

  try {
    const date = new Date(dateStr)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  } catch {
    return dateStr
  }
}

// 是否逾期
const isOverdue = computed(() => {
  if (!props.milestone?.endDate) return false
  const endDate = new Date(props.milestone.endDate)
  const now = new Date()
  return now > endDate && props.milestone.status !== 'completed'
})

// 剩余时间
const remainingTime = computed(() => {
  if (!props.milestone?.endDate) return '--'
  if (props.milestone.status === 'completed') return '已完成'

  try {
    const endDate = new Date(props.milestone.endDate)
    const now = new Date()
    const diffTime = endDate - now
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      return `已逾期 ${Math.abs(diffDays)} 天`
    } else if (diffDays === 0) {
      return '今天截止'
    } else if (diffDays === 1) {
      return '明天截止'
    } else {
      return `还剩 ${diffDays} 天`
    }
  } catch {
    return '--'
  }
})

// 剩余时间样式类
const remainingTimeClass = computed(() => {
  if (!props.milestone?.endDate) return ''
  if (props.milestone.status === 'completed') return 'text-success'

  try {
    const endDate = new Date(props.milestone.endDate)
    const now = new Date()
    const diffTime = endDate - now
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return 'text-danger'
    if (diffDays <= 3) return 'text-warning'
    return ''
  } catch {
    return ''
  }
})

// 获取交付物状态
const getDeliverableStatus = (deliverableId) => {
  if (!props.milestone?.submissions) return null

  const submission = props.milestone.submissions.find(
    s => s.deliverableId === deliverableId && s.status === 'approved'
  )

  if (submission) {
    return { type: 'success', text: '已提交' }
  }

  const pendingSubmission = props.milestone.submissions.find(
    s => s.deliverableId === deliverableId && s.status === 'pending'
  )

  if (pendingSubmission) {
    return { type: 'warning', text: '审核中' }
  }

  return { type: 'info', text: '未提交' }
}

// 获取提交状态标签类型
const getSubmissionTagType = (status) => {
  const typeMap = {
    'pending': 'warning',
    'approved': 'success',
    'rejected': 'danger'
  }
  return typeMap[status] || 'info'
}

// 获取提交状态文本
const getSubmissionStatusText = (status) => {
  const textMap = {
    'pending': '审核中',
    'approved': '已通过',
    'rejected': '已驳回'
  }
  return textMap[status] || '未知'
}

// 事件处理
const handlePrev = () => emit('prev')
const handleNext = () => emit('next')
const handleUpload = () => emit('upload', props.milestone)
const handleViewSubmission = (submission) => emit('viewSubmission', submission)
</script>

<style scoped>
.milestone-detail-panel {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

/* 面板头部 */
.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
  background: linear-gradient(135deg, #f8fafc 0%, #fff 100%);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.milestone-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
}

.header-right {
  display: flex;
  gap: 8px;
}

/* 面板内容 */
.panel-content {
  padding: 24px;
}

/* 信息区域 */
.info-section {
  margin-bottom: 24px;
}

.info-row {
  display: flex;
  gap: 32px;
  flex-wrap: wrap;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-label {
  font-size: 14px;
  color: #6b7280;
}

.info-value {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
}

.text-danger {
  color: #ef4444;
}

.text-warning {
  color: #f59e0b;
}

.text-success {
  color: #10b981;
}

/* 区块标题 */
.section-title {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

/* 描述区域 */
.description-section {
  margin-bottom: 24px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  border-left: 3px solid #3b82f6;
}

.description-text {
  margin: 0;
  font-size: 14px;
  color: #4b5563;
  line-height: 1.6;
}

/* 交付物列表 */
.deliverables-section {
  margin-bottom: 24px;
}

.deliverables-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.deliverable-item {
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
}

.deliverable-item:hover {
  border-color: #3b82f6;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
}

.deliverable-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.deliverable-icon {
  color: #3b82f6;
  font-size: 18px;
}

.deliverable-name {
  flex: 1;
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
}

.deliverable-requirement {
  margin: 0;
  font-size: 13px;
  color: #6b7280;
  line-height: 1.5;
  padding-left: 26px;
}

/* 提交记录列表 */
.submissions-section {
  margin-bottom: 24px;
}

.submissions-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.submission-item {
  padding: 16px;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submission-item:hover {
  border-color: #3b82f6;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
  transform: translateY(-2px);
}

.submission-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.submission-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.submission-version {
  display: inline-block;
  padding: 2px 8px;
  background: #eff6ff;
  color: #3b82f6;
  font-size: 12px;
  font-weight: 600;
  border-radius: 4px;
}

.submission-filename {
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
}

.submission-meta {
  font-size: 13px;
  color: #9ca3af;
  display: flex;
  align-items: center;
  gap: 8px;
}

.meta-sep {
  color: #d1d5db;
}

/* 操作区域 */
.action-section {
  display: flex;
  justify-content: center;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .panel-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .header-right {
    width: 100%;
    justify-content: flex-end;
  }

  .info-row {
    flex-direction: column;
    gap: 12px;
  }

  .deliverable-requirement {
    padding-left: 0;
  }
}
</style>
