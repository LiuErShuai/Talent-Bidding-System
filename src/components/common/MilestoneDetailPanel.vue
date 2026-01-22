<template>
  <div class="milestone-detail-panel">
    <!-- 面板头部 -->
    <div class="panel-header">
      <div class="header-left">
        <h3 class="milestone-title">{{ milestone?.title || '里程碑详情' }}</h3>
        <span class="deadline-info">截止：{{ formatDate(milestone?.endDate) }}</span>
        <el-tag :type="statusTagType" size="small">{{ statusText }}</el-tag>
      </div>
      <div class="header-right">
        <el-button
          v-if="showPrevButton"
          size="small"
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
      <!-- 任务描述板块 -->
      <div class="section task-description-section">
        <div class="description-content">
          <p class="task-description">{{ milestone?.description || '暂无描述' }}</p>

          <!-- 交付物要求 - 默认展开 -->
          <div v-if="milestone?.deliverables?.length" class="deliverables-list">
            <div class="deliverables-header">
              <h4 class="deliverables-title">交付物要求</h4>
            </div>
            <ul class="deliverables-items">
              <li v-for="deliverable in milestone.deliverables" :key="deliverable.id" class="deliverable-item">
                <div class="deliverable-info">
                  <span class="deliverable-name">{{ deliverable.name }}</span>
                  <el-tag size="small" type="info">
                    {{ Array.isArray(deliverable.format) ? deliverable.format.join(' / ') : deliverable.format }}
                  </el-tag>
                </div>
                <p class="deliverable-requirement">{{ deliverable.requirement }}</p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 任务文件栏 - 默认折叠 -->
      <div class="section task-files-section">
        <div class="section-header">
          <h4 class="section-title">任务文件</h4>
          <el-button
            link
            size="small"
            class="toggle-btn"
            @click="taskFilesExpanded = !taskFilesExpanded"
          >
            <el-icon class="arrow-icon" :class="{ 'expanded': taskFilesExpanded }">
              <ArrowRight />
            </el-icon>
            <span class="toggle-text">{{ taskFilesExpanded ? '收起' : '展开' }}</span>
          </el-button>
        </div>

        <ul v-show="taskFilesExpanded" v-if="milestone?.taskFiles?.length" class="task-files-list">
          <li v-for="file in milestone.taskFiles" :key="file.id" class="task-file-item">
            <div class="file-info">
              <el-icon class="file-icon"><Document /></el-icon>
              <span class="file-name">{{ file.name }}</span>
              <span class="file-size">{{ file.size }}</span>
            </div>
            <el-button link type="primary" @click="handleDownloadTaskFile(file)">
              <el-icon><Download /></el-icon>
            </el-button>
          </li>
        </ul>
        <el-empty v-show="taskFilesExpanded" v-if="!milestone?.taskFiles?.length" description="暂无任务文件" :image-size="40" />
      </div>

      <!-- 我的提交记录区 -->
      <div class="section submissions-section">
        <div class="section-header">
          <h4 class="section-title">我的提交记录</h4>
          <div class="header-actions">
            <el-button
              v-if="milestone?.status === 'in-progress'"
              type="primary"
              size="small"
              @click="handleUpload"
            >
              <el-icon><Upload /></el-icon>
              上传交付物
            </el-button>
            <el-button
              v-if="historySubmissions.length > 0"
              type="primary"
              plain
              size="small"
              @click="handleViewHistory"
            >
              查看历史提交
            </el-button>
          </div>
        </div>

        <div v-if="latestSubmission" class="latest-submission">
          <submission-item
            :submission="latestSubmission"
            @download="handleDownload"
            @view="handleViewSubmission"
          />
        </div>

        <el-empty v-if="!latestSubmission" description="暂未提交文件" :image-size="40" />
      </div>

      <!-- 意见反馈区 -->
      <div class="section feedback-section">
        <div class="section-header">
          <h4 class="section-title">意见反馈</h4>
        </div>

        <!-- 历史反馈列表 -->
        <div v-if="milestone?.feedbacks?.length" class="feedbacks-list">
          <div
            v-for="feedback in sortedFeedbacks"
            :key="feedback.id"
            class="feedback-item"
          >
            <!-- 缩略状态 -->
            <div v-if="!expandedFeedbacks[feedback.id]" class="feedback-collapsed">
              <span class="feedback-label">反馈内容：</span>
              <span class="feedback-text-collapsed">{{ feedback.content }}</span>
              <span class="feedback-time">{{ feedback.time }}</span>
              <el-button
                link
                type="primary"
                size="small"
                @click="toggleFeedback(feedback.id)"
                class="expand-btn"
              >
                展开
              </el-button>
            </div>

            <!-- 展开状态 -->
            <div v-else class="feedback-expanded">
              <!-- 第一行：标签 + 时间 + 收起按钮 -->
              <div class="feedback-expanded-header">
                <span class="feedback-label">反馈内容：</span>
                <span class="feedback-time">{{ feedback.time }}</span>
                <el-button
                  link
                  type="primary"
                  size="small"
                  @click="toggleFeedback(feedback.id)"
                  class="collapse-btn"
                >
                  收起
                </el-button>
              </div>
              <!-- 反馈内容文本 -->
              <div class="feedback-text-full">{{ feedback.content }}</div>
            </div>
          </div>
        </div>

        <el-empty v-else description="暂无反馈意见" :image-size="40" />
      </div>
    </div>

    <!-- 历史提交记录对话框 -->
    <el-dialog
      v-model="historyDialogVisible"
      title="历史提交记录"
      width="700px"
    >
      <div class="history-submissions-dialog">
        <submission-item
          v-for="sub in historySubmissions"
          :key="sub.id"
          :submission="sub"
          @download="handleDownload"
          @view="handleViewSubmission"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import {
  ArrowRight,
  Document,
  Upload,
  Check,
  Clock,
  Download
} from '@element-plus/icons-vue'
import SubmissionItem from '@/components/student/SubmissionItem.vue'

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

// 任务文件展开/收起状态 - 默认折叠
const taskFilesExpanded = ref(false)

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

// 最新提交
const latestSubmission = computed(() => {
  if (!props.milestone?.submissions || props.milestone.submissions.length === 0) {
    return null
  }
  return props.milestone.submissions[0]
})

// 历史提交
const historySubmissions = computed(() => {
  if (!props.milestone?.submissions || props.milestone.submissions.length <= 1) {
    return []
  }
  return props.milestone.submissions.slice(1)
})

// 排序后的反馈（新到旧）
const sortedFeedbacks = computed(() => {
  if (!props.milestone?.feedbacks) return []
  return [...props.milestone.feedbacks].sort((a, b) => {
    return new Date(b.time) - new Date(a.time)
  })
})

// 反馈展开/收起状态
const expandedFeedbacks = ref({})

function toggleFeedback(feedbackId) {
  expandedFeedbacks.value[feedbackId] = !expandedFeedbacks.value[feedbackId]
}

// 历史提交记录对话框
const historyDialogVisible = ref(false)

function handleViewHistory() {
  historyDialogVisible.value = true
}

// 事件处理
const handlePrev = () => emit('prev')
const handleNext = () => emit('next')
const handleUpload = () => emit('upload', props.milestone)
const handleViewSubmission = (submission) => emit('viewSubmission', submission)

// 下载文件
function handleDownload(submission) {
  ElMessage.success(`开始下载：${submission.fileName}`)
  console.log('下载文件：', submission)
}

// 下载任务文件
function handleDownloadTaskFile(file) {
  ElMessage.success(`开始下载：${file.name}`)
  console.log('下载任务文件：', file)
}
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

.deadline-info {
  font-size: 14px;
  color: #6b7280;
  padding: 4px 12px;
  background: #f9fafb;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

.header-right {
  display: flex;
  gap: 8px;
}

/* 面板内容 */
.panel-content {
  padding: 0 24px 24px 24px;
}

/* 区块样式 */
.section {
  margin-bottom: 12px;
  padding-top: 8px;
  padding-bottom: 0px;
  border-bottom: 1px solid #f0f0f0;
}

.section:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
}

/* 头部操作按钮组 */
.header-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

/* 任务描述板块 */
.task-description-section {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.description-content {
  flex: 1;
}

.task-description {
  margin: 0;
  font-size: 14px;
  color: #4b5563;
  line-height: 1.6;
}

/* 基本信息网格 */
.info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 16px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
}

.info-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
}

.info-label {
  font-size: 13px;
  color: #6b7280;
  white-space: nowrap;
}

.info-label::after {
  content: '：';
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

/* 交付物要求 */
.deliverables-list {
  margin-top: 16px;
}

.deliverables-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #e5e7eb;
}

.deliverables-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #374151;
}

.toggle-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
}

.arrow-icon {
  transition: transform 0.3s ease;
}

.arrow-icon.expanded {
  transform: rotate(90deg);
}

.deliverables-items {
  list-style: none;
  padding: 0;
  margin: 12px 0 0 0;
}

.deliverable-item {
  padding: 12px;
  margin-bottom: 8px;
  background: #f9fafb;
  border-radius: 6px;
  border-left: 3px solid #3b82f6;
}

.deliverable-item:last-child {
  margin-bottom: 0;
}

.deliverable-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.deliverable-name {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
}

.deliverable-requirement {
  margin: 0;
  font-size: 13px;
  color: #6b7280;
  line-height: 1.5;
}

/* 任务文件列表 */
.task-files-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.task-file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  margin-bottom: 8px;
  background: #f9fafb;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.task-file-item:hover {
  background: #f3f4f6;
}

.task-file-item:last-child {
  margin-bottom: 0;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.file-icon {
  font-size: 24px;
  color: #3b82f6;
  flex-shrink: 0;
}

.file-name {
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
  flex: 1;
}

.file-size {
  font-size: 12px;
  color: #9ca3af;
  margin-left: auto;
  padding-right: 12px;
}

/* 提交记录 */
.latest-submission {
  margin-bottom: 0;
}

/* 提交记录区和反馈区的空状态 */
.submissions-section .el-empty,
.feedback-section .el-empty {
  padding: 0;
}

/* 反馈列表 */
.feedbacks-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.feedback-item {
  padding: 12px;
  background: #f9fafb;
  border-radius: 6px;
  border-left: 3px solid #f59e0b;
}

.feedback-collapsed {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.feedback-label {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
}

.feedback-text-collapsed {
  flex: 1;
  font-size: 13px;
  color: #6b7280;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.feedback-time {
  font-size: 12px;
  color: #9ca3af;
}

.feedback-expanded-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.feedback-text-full {
  font-size: 13px;
  color: #4b5563;
  line-height: 1.6;
  white-space: pre-wrap;
}

/* 操作按钮区 */
.actions-section {
  display: flex;
  justify-content: center;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

/* 历史提交对话框 */
.history-submissions-dialog {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: 60vh;
  overflow-y: auto;
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

  .info-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .task-description-section {
    flex-direction: column;
  }

  .feedback-collapsed {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
