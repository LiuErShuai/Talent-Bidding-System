<template>
  <div class="milestone-detail">
    <!-- 任务描述板块 -->
    <div class="section task-description-section">
      <div class="description-content">
        <h4 class="section-title">{{ milestone.title }}</h4>
        <p class="task-description">{{ milestone.description }}</p>

        <!-- 交付物要求 -->
        <div v-if="milestone.deliverables && milestone.deliverables.length" class="deliverables-list">
          <div class="deliverables-header">
            <h5 class="deliverables-title">交付物要求</h5>
            <div class="deliverables-actions">
              <el-button
                link
                size="small"
                class="edit-deliverables-btn"
                @click="handleEditDeliverables"
              >
                <el-icon><Edit /></el-icon>
                <span class="edit-text">编辑</span>
              </el-button>
              <el-button
                link
                size="small"
                class="toggle-btn"
                @click="deliverablesExpanded = !deliverablesExpanded"
              >
                <el-icon class="arrow-icon" :class="{ 'expanded': deliverablesExpanded }">
                  <ArrowRight />
                </el-icon>
                <span class="toggle-text">{{ deliverablesExpanded ? '收起' : '展开' }}</span>
              </el-button>
            </div>
          </div>
          <ul v-show="deliverablesExpanded" class="deliverables-items">
            <li v-for="deliverable in milestone.deliverables" :key="deliverable.id" class="deliverable-item">
              <div class="deliverable-info">
                <span class="deliverable-name">{{ deliverable.name }}</span>
                <el-tag size="small" type="info">
                  {{ deliverable.format.join(' / ') }}
                </el-tag>
              </div>
              <p class="deliverable-requirement">{{ deliverable.requirement }}</p>
            </li>
          </ul>
        </div>
      </div>
      <div class="status-badge">
        <el-tag
          :type="getStatusType(milestone.status)"
          size="large"
          effect="plain"
        >
          {{ milestone.statusText }}
        </el-tag>
      </div>
    </div>

    <!-- 任务文件栏 -->
    <div class="section task-files-section">
      <div class="section-header">
        <h4 class="section-title">
          任务文件
        </h4>
        <el-button
          type="primary"
          plain
          size="small"
          @click="handleEditTaskFiles"
        >
          编辑
        </el-button>
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
      <el-empty v-else description="暂无任务文件" :image-size="50" />
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

      <el-empty v-if="!latestSubmission" description="承接方暂未提交文件" :image-size="50" />
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

      <el-empty v-else description="暂无反馈意见" :image-size="50" />
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

    <!-- 编辑任务文件对话框 -->
    <el-dialog
      v-model="editTaskFilesVisible"
      title="编辑任务文件"
      width="800px"
      :close-on-click-modal="false"
    >
      <div class="edit-task-files-dialog">
        <!-- 文件列表 -->
        <div class="files-list">
          <div
            v-for="(file, index) in editTaskFilesForm.files"
            :key="index"
            class="file-item"
          >
            <div class="file-item-content">
              <el-icon class="file-icon"><Document /></el-icon>
              <div class="file-details">
                <el-input
                  v-model="file.name"
                  placeholder="文件名称"
                  class="file-name-input"
                />
                <el-input
                  v-model="file.description"
                  placeholder="文件描述（选填）"
                  class="file-desc-input"
                />
              </div>
            </div>
            <div class="file-item-actions">
              <el-button
                link
                type="danger"
                @click="handleRemoveFile(index)"
              >
                <el-icon><Delete /></el-icon>
                删除
              </el-button>
            </div>
          </div>
        </div>

        <!-- 添加文件按钮 -->
        <el-button
          type="primary"
          plain
          @click="handleAddFile"
          class="add-file-btn"
        >
          <el-icon><Plus /></el-icon>
          添加文件
        </el-button>

        <!-- 上传提示 -->
        <div class="upload-tips">
          <el-alert
            title="提示"
            type="info"
            :closable="false"
            show-icon
          >
            <template #default>
              <div>支持的文件格式：PDF、Word、Excel、PPT、图片、压缩包等</div>
              <div>单个文件大小不超过 500MB</div>
            </template>
          </el-alert>
        </div>
      </div>

      <template #footer>
        <el-button @click="editTaskFilesVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveTaskFiles">保存</el-button>
      </template>
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
  Download,
  Delete,
  Plus,
  Edit,
  ArrowRight
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

// 交付物要求展开/收起状态
const deliverablesExpanded = ref(false)

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

// 获取状态类型
function getStatusType(status) {
  const statusMap = {
    'pending': 'info',        // 待开始 - 灰色
    'in-progress': 'primary', // 进行中 - 蓝色
    'completed': 'success',   // 已完成 - 绿色
    'overdue': 'danger'       // 已逾期 - 红色
  }
  return statusMap[status] || 'info'
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

// 编辑任务文件
const editTaskFilesVisible = ref(false)
const editTaskFilesForm = reactive({
  files: []
})

function handleEditTaskFiles() {
  // 初始化表单数据，复制当前任务文件列表
  editTaskFilesForm.files = props.milestone.taskFiles?.map(file => ({
    id: file.id,
    name: file.name,
    description: file.description || '',
    size: file.size,
    type: file.type,
    uploadTime: file.uploadTime,
    uploader: file.uploader
  })) || []

  editTaskFilesVisible.value = true
}

// 添加文件
function handleAddFile() {
  editTaskFilesForm.files.push({
    id: `new-${Date.now()}`,
    name: '',
    description: '',
    size: '',
    type: 'PDF',
    uploadTime: new Date().toISOString().slice(0, 16).replace('T', ' '),
    uploader: 'XX科技有限公司'
  })
}

// 删除文件
function handleRemoveFile(index) {
  ElMessageBox.confirm(
    '确认删除该文件吗？',
    '确认删除',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    editTaskFilesForm.files.splice(index, 1)
    ElMessage.success('已删除')
  }).catch(() => {})
}

// 保存任务文件
function handleSaveTaskFiles() {
  // 验证文件名不能为空
  const emptyFiles = editTaskFilesForm.files.filter(file => !file.name.trim())
  if (emptyFiles.length > 0) {
    ElMessage.warning('请填写所有文件的名称')
    return
  }

  ElMessage.success('任务文件已保存')
  editTaskFilesVisible.value = false
  emit('refresh')
  console.log('保存任务文件：', editTaskFilesForm.files)
}

// 编辑交付物要求
function handleEditDeliverables() {
  ElMessage.info('编辑交付物要求功能开发中...')
  console.log('编辑交付物要求')
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

/* 任务描述板块 */
.task-description-section {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  padding: 16px 20px;
}

.description-content {
  flex: 1;
  min-width: 0;
}

.task-description-section .section-title {
  font-size: 20px;
  margin-bottom: 8px;
}

.task-description {
  margin: 0 0 16px 0;
  font-size: 14px;
  line-height: 1.6;
  color: #606266;
}

/* 交付物要求 */
.deliverables-list {
  margin-top: 16px;
}

.deliverables-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.deliverables-title {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  line-height: 1;
}

.deliverables-actions {
  display: flex;
  align-items: center;
  gap: 0;
}

.edit-deliverables-btn {
  color: #606266;
  padding: 0;
  height: auto;
  display: flex;
  align-items: center;
  gap: 4px;
  line-height: 1;
}

.edit-deliverables-btn:hover {
  color: #303133;
}

.edit-text {
  font-size: 13px;
}

.toggle-btn {
  color: #606266;
  padding: 0;
  height: auto;
  display: flex;
  align-items: center;
  gap: 4px;
  line-height: 1;
}

.toggle-btn:hover {
  color: #303133;
}

.toggle-text {
  font-size: 13px;
}

.arrow-icon {
  font-size: 15px;
  transition: transform 0.3s ease;
}

.arrow-icon.expanded {
  transform: rotate(90deg);
}

.deliverables-items {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.deliverable-item {
  background: #f5f7fb;
  border-radius: 6px;
  padding: 12px;
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
  color: #303133;
}

.deliverable-requirement {
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  color: #606266;
}

.status-badge {
  flex-shrink: 0;
  display: flex;
  align-items: center;
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
  font-size: 14px;
  color: #606266;
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
  padding: 12px 0;
  min-height: 80px;
}

.section :deep(.el-empty__description) {
  margin-top: 6px;
  font-size: 13px;
}

/* 编辑任务文件对话框 */
.edit-task-files-dialog {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.files-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 400px;
  overflow-y: auto;
  padding-right: 8px;
}

.file-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: #f5f7fb;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
  transition: all 0.3s ease;
}

.file-item:hover {
  border-color: #409eff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.1);
}

.file-item-content {
  flex: 1;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  min-width: 0;
}

.file-item .file-icon {
  font-size: 32px;
  color: #409eff;
  flex-shrink: 0;
  margin-top: 4px;
}

.file-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.file-name-input {
  width: 100%;
}

.file-desc-input {
  width: 100%;
}

.file-item-actions {
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

.add-file-btn {
  width: 100%;
}

.upload-tips {
  margin-top: 8px;
}

.upload-tips :deep(.el-alert__content) {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* 响应式 */
@media (max-width: 768px) {
  .actions-section {
    flex-direction: column;
  }

  .actions-section .el-button {
    width: 100%;
  }

  .file-item {
    flex-direction: column;
  }

  .file-item-actions {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>
