<template>
  <div class="milestone-detail">
    <!-- 任务文件栏 -->
    <div class="section task-files-section">
      <div class="section-header">
        <h4 class="section-title">
          任务文件
        </h4>
      </div>

      <ul v-if="milestone.taskFiles && milestone.taskFiles.length" class="task-files-list">
        <li v-for="file in milestone.taskFiles" :key="file.id" class="task-file-item">
          <div class="file-info">
            <el-icon class="file-icon"><Document /></el-icon>
            <span class="file-name">{{ file.name }}</span>
            <span class="file-size">{{ file.size }}</span>
          </div>
          <el-button link type="primary" @click="handleDownloadTaskFile(file)">
            <el-icon><Download /></el-icon>
            下载
          </el-button>
        </li>
      </ul>
      <el-empty v-else description="暂无任务文件" :image-size="60" />
    </div>

    <!-- 承接方提交记录区 -->
    <div class="section submissions-section">
      <div class="section-header">
        <h4 class="section-title">
          承接方提交记录
        </h4>
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

      <div v-if="latestSubmission" class="latest-submission">
        <submission-item
          :submission="latestSubmission"
          @download="handleDownload"
        />
      </div>

      <el-empty v-if="!latestSubmission" description="承接方暂未提交文件" :image-size="60" />
    </div>

    <!-- 意见反馈区 -->
    <div class="section feedback-section">
      <div class="section-header">
        <h4 class="section-title">
          意见反馈
        </h4>
      </div>

      <!-- 历史反馈列表 -->
      <div v-if="milestone.feedbacks && milestone.feedbacks.length" class="feedbacks-list">
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

      <el-empty v-else description="暂无反馈意见" :image-size="60" />
    </div>

    <!-- 操作按钮区 -->
    <div v-if="canEdit" class="actions-section">
      <el-button
        type="success"
        size="large"
        @click="handleApprove"
      >
        <el-icon><Check /></el-icon>
        通过节点
      </el-button>
      <el-button
        type="warning"
        size="large"
        @click="handleFeedback"
      >
        <el-icon><ChatDotRound /></el-icon>
        反馈意见
      </el-button>
    </div>

    <!-- 反馈意见对话框 -->
    <el-dialog
      v-model="feedbackVisible"
      title="反馈意见"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form :model="feedbackForm">
        <el-form-item required>
          <template #label>
            <div style="margin-bottom: 8px;">反馈及修改意见</div>
          </template>
          <el-input
            v-model="feedbackForm.content"
            type="textarea"
            :rows="8"
            placeholder="请输入反馈及修改意见..."
            maxlength="1000"
            show-word-limit
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="feedbackVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitFeedback">提交反馈</el-button>
      </template>
    </el-dialog>

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
        />
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Document,
  Files,
  ChatDotRound,
  Check,
  FolderOpened,
  Download
} from '@element-plus/icons-vue'
import SubmissionItem from './SubmissionItem.vue'

const props = defineProps({
  milestone: {
    type: Object,
    required: true
  },
  project: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['refresh'])

// 是否可以编辑（已完成的不可编辑）
const canEdit = computed(() => {
  return props.milestone.status !== 'completed'
})

// 最新提交
const latestSubmission = computed(() => {
  if (!props.milestone.submissions || props.milestone.submissions.length === 0) {
    return null
  }
  return props.milestone.submissions[0]
})

// 历史提交
const historySubmissions = computed(() => {
  if (!props.milestone.submissions || props.milestone.submissions.length <= 1) {
    return []
  }
  return props.milestone.submissions.slice(1)
})

// 排序后的反馈（新到旧）
const sortedFeedbacks = computed(() => {
  if (!props.milestone.feedbacks) return []
  return [...props.milestone.feedbacks].sort((a, b) => {
    return new Date(b.time) - new Date(a.time)
  })
})

// 反馈展开/收起状态
const expandedFeedbacks = ref({})

function toggleFeedback(feedbackId) {
  expandedFeedbacks.value[feedbackId] = !expandedFeedbacks.value[feedbackId]
}

// 反馈意见对话框
const feedbackVisible = ref(false)
const feedbackForm = reactive({
  content: ''
})

function handleFeedback() {
  feedbackForm.content = ''
  feedbackVisible.value = true
}

function handleSubmitFeedback() {
  if (!feedbackForm.content) {
    ElMessage.warning('请输入反馈内容')
    return
  }

  ElMessage.success('反馈已提交')
  feedbackVisible.value = false
  emit('refresh')
}

// 历史提交记录对话框
function handleApprove() {
  ElMessageBox.confirm(
    '确认通过该里程碑节点吗？通过后将自动开启下一个里程碑。',
    '确认通过',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'success'
    }
  ).then(() => {
    ElMessage.success('里程碑已通过')
    emit('refresh')
  }).catch(() => {})
}

// 历史提交记录对话框
const historyDialogVisible = ref(false)

function handleViewHistory() {
  historyDialogVisible.value = true
}

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
.milestone-detail {
  max-width: 1200px;
}

/* 区块 */
.section {
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 16px 20px;
  margin-bottom: 16px;
}

.section:last-child {
  margin-bottom: 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #303133;
}

.section-title .el-icon {
  font-size: 18px;
  color: #409eff;
}

/* 任务文件栏 */
.task-files-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.task-file-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  background: #f5f7fb;
  border-radius: 6px;
  margin-bottom: 8px;
  transition: all 0.3s ease;
}

.task-file-item:last-child {
  margin-bottom: 0;
}

.task-file-item:hover {
  background: #ecf5ff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.1);
}

.file-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.file-icon {
  font-size: 24px;
  color: #409eff;
  flex-shrink: 0;
}

.file-name {
  flex: 1;
  font-size: 13px;
  font-weight: 400;
  color: #303133;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-size {
  font-size: 12px;
  color: #909399;
  flex-shrink: 0;
}

/* 提交记录 */
.latest-submission {
  margin-bottom: 0;
}

.submissions-section .latest-submission {
  margin-top: 0;
}

.history-submissions-dialog {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 500px;
  overflow-y: auto;
}

/* 反馈列表 */
.feedbacks-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 0;
}

.feedback-item {
  background: #f5f7fb;
  border-radius: 6px;
  padding: 16px;
}

/* 缩略状态 */
.feedback-collapsed {
  display: flex;
  align-items: center;
  gap: 8px;
}

.feedback-label {
  font-weight: 600;
  color: #303133;
  font-size: 14px;
  flex-shrink: 0;
}

.feedback-text-collapsed {
  flex: 1;
  font-size: 13px;
  color: #606266;
  line-height: 1.6;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.feedback-time {
  font-size: 12px;
  color: #909399;
  flex-shrink: 0;
  margin-left: 8px;
}

.expand-btn {
  flex-shrink: 0;
  padding: 0;
  height: auto;
  font-size: 12px;
  margin-left: 4px;
}

/* 展开状态 */
.feedback-expanded {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.feedback-expanded-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.feedback-expanded-header .feedback-label {
  flex-shrink: 0;
}

.feedback-expanded-header .feedback-time {
  flex: 1;
  text-align: right;
  margin-left: auto;
}

.feedback-expanded-header .collapse-btn {
  flex-shrink: 0;
  margin-left: 4px;
}

.feedback-text-full {
  font-size: 13px;
  color: #606266;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
  padding-left: 0;
}

/* 操作按钮区 */
.actions-section {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px;
  background: #f5f7fb;
  border-radius: 8px;
}

/* 空状态样式优化 */
.section :deep(.el-empty) {
  padding: 20px 0;
}

.section :deep(.el-empty__description) {
  margin-top: 8px;
}

/* 响应式 */
@media (max-width: 768px) {
  .actions-section {
    flex-direction: column;
  }

  .actions-section .el-button {
    width: 100%;
  }
}
</style>
