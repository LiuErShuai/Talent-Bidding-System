<template>
  <div class="milestone-detail">
    <!-- 任务文件栏 -->
    <div class="section task-files-section">
      <h4 class="section-title">
        <el-icon><FolderOpened /></el-icon>
        任务文件
      </h4>

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
      <el-empty v-else description="暂无任务文件" :image-size="80" />
    </div>

    <!-- 承接方提交记录区 -->
    <div class="section submissions-section">
      <h4 class="section-title">
        <el-icon><Files /></el-icon>
        承接方提交记录
      </h4>

      <div v-if="latestSubmission" class="latest-submission">
        <submission-item
          :submission="latestSubmission"
          @download="handleDownload"
        />
      </div>

      <!-- 历史版本（折叠） -->
      <el-collapse v-if="historySubmissions.length > 0" class="history-collapse">
        <el-collapse-item>
          <template #title>
            <span class="collapse-title">历史版本 ({{ historySubmissions.length }})</span>
          </template>
          <div class="history-submissions">
            <submission-item
              v-for="sub in historySubmissions"
              :key="sub.id"
              :submission="sub"
              @download="handleDownload"
            />
          </div>
        </el-collapse-item>
      </el-collapse>

      <el-empty v-if="!latestSubmission" description="承接方暂未提交文件" :image-size="80" />
    </div>

    <!-- 发布方反馈区 -->
    <div class="section feedback-section">
      <h4 class="section-title">
        <el-icon><ChatDotRound /></el-icon>
        发布方反馈
      </h4>

      <!-- 添加新反馈按钮 -->
      <el-button
        v-if="canEdit"
        type="primary"
        class="add-feedback-btn"
        @click="handleAddFeedback"
      >
        <el-icon><Plus /></el-icon>
        添加反馈
      </el-button>

      <!-- 历史反馈列表 -->
      <div v-if="milestone.feedbacks && milestone.feedbacks.length" class="feedbacks-list">
        <div
          v-for="feedback in sortedFeedbacks"
          :key="feedback.id"
          class="feedback-item"
        >
          <div class="feedback-header">
            <span class="feedback-publisher">{{ feedback.publisher }}</span>
            <span class="feedback-time">{{ feedback.time }}</span>
          </div>
          <div class="feedback-content">
            {{ feedback.content }}
            <div v-if="feedback.suggestions && feedback.suggestions.length > 0" class="suggestions-inline">
              <div class="suggestion-title">修改建议：</div>
              <ul class="suggestion-list">
                <li v-for="(suggestion, index) in feedback.suggestions" :key="index" class="suggestion-item">
                  {{ suggestion }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <el-empty v-else description="暂无反馈意见" :image-size="80" />
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
        type="danger"
        size="large"
        @click="handleReject"
      >
        <el-icon><Close /></el-icon>
        驳回
      </el-button>
    </div>

    <!-- 编辑交付物对话框 -->
    <el-dialog
      v-model="editDeliverablesVisible"
      title="编辑交付物要求"
      width="700px"
      :close-on-click-modal="false"
    >
      <el-form :model="deliverablesForm" label-width="100px">
        <div
          v-for="(item, index) in deliverablesForm.items"
          :key="index"
          class="deliverable-form-item"
        >
          <div class="form-item-header">
            <span class="item-number">交付物 {{ index + 1 }}</span>
            <el-button
              type="danger"
              size="small"
              text
              @click="removeDeliverable(index)"
            >
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
          </div>

          <el-form-item label="名称" required>
            <el-input v-model="item.name" placeholder="请输入交付物名称" />
          </el-form-item>

          <el-form-item label="格式" required>
            <el-input v-model="item.format" placeholder="例如：PDF / Word / Excel" />
          </el-form-item>

          <el-form-item label="要求说明" required>
            <el-input
              v-model="item.requirement"
              type="textarea"
              :rows="3"
              placeholder="请详细描述交付物的具体要求"
            />
          </el-form-item>
        </div>

        <el-button type="primary" text @click="addDeliverable">
          <el-icon><Plus /></el-icon>
          添加交付物
        </el-button>
      </el-form>

      <template #footer>
        <el-button @click="editDeliverablesVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSaveDeliverables">保存</el-button>
      </template>
    </el-dialog>

    <!-- 添加反馈对话框 -->
    <el-dialog
      v-model="addFeedbackVisible"
      title="添加反馈意见"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form :model="feedbackForm" label-width="100px">
        <el-form-item label="反馈内容" required>
          <el-input
            v-model="feedbackForm.content"
            type="textarea"
            :rows="4"
            placeholder="请输入反馈意见..."
            maxlength="500"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="修改建议">
          <el-checkbox v-model="feedbackForm.hasSuggestions">需要修改</el-checkbox>
        </el-form-item>

        <div v-if="feedbackForm.hasSuggestions" class="suggestions-input">
          <div
            v-for="(suggestion, index) in feedbackForm.suggestions"
            :key="index"
            class="suggestion-input-item"
          >
            <el-input
              v-model="feedbackForm.suggestions[index]"
              placeholder="请输入修改建议"
            >
              <template #append>
                <el-button
                  type="danger"
                  text
                  @click="removeSuggestion(index)"
                >
                  <el-icon><Delete /></el-icon>
                </el-button>
              </template>
            </el-input>
          </div>
          <el-button type="primary" text @click="addSuggestion">
            <el-icon><Plus /></el-icon>
            添加建议
          </el-button>
        </div>
      </el-form>

      <template #footer>
        <el-button @click="addFeedbackVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitFeedback">提交反馈</el-button>
      </template>
    </el-dialog>

    <!-- 驳回对话框 -->
    <el-dialog
      v-model="rejectVisible"
      title="驳回里程碑"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form :model="rejectForm" label-width="100px">
        <el-form-item label="驳回原因" required>
          <el-input
            v-model="rejectForm.reason"
            type="textarea"
            :rows="4"
            placeholder="请输入驳回原因..."
            maxlength="500"
            show-word-limit
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="rejectVisible = false">取消</el-button>
        <el-button type="danger" @click="handleConfirmReject">确认驳回</el-button>
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
  Plus,
  Check,
  Close,
  Delete,
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

// 编辑交付物对话框
const editDeliverablesVisible = ref(false)
const deliverablesForm = reactive({
  items: []
})

function handleEditDeliverables() {
  // 复制当前交付物数据
  deliverablesForm.items = props.milestone.deliverables.map(d => ({
    name: d.name,
    format: d.format.join(' / '),
    requirement: d.requirement
  }))
  editDeliverablesVisible.value = true
}

function addDeliverable() {
  deliverablesForm.items.push({
    name: '',
    format: '',
    requirement: ''
  })
}

function removeDeliverable(index) {
  deliverablesForm.items.splice(index, 1)
}

function handleSaveDeliverables() {
  // 验证
  for (const item of deliverablesForm.items) {
    if (!item.name || !item.format || !item.requirement) {
      ElMessage.warning('请填写完整的交付物信息')
      return
    }
  }

  ElMessage.success('交付物要求已更新')
  editDeliverablesVisible.value = false
  emit('refresh')
}

// 添加反馈对话框
const addFeedbackVisible = ref(false)
const feedbackForm = reactive({
  content: '',
  hasSuggestions: false,
  suggestions: []
})

function handleAddFeedback() {
  feedbackForm.content = ''
  feedbackForm.hasSuggestions = false
  feedbackForm.suggestions = []
  addFeedbackVisible.value = true
}

function addSuggestion() {
  feedbackForm.suggestions.push('')
}

function removeSuggestion(index) {
  feedbackForm.suggestions.splice(index, 1)
}

function handleSubmitFeedback() {
  if (!feedbackForm.content) {
    ElMessage.warning('请输入反馈内容')
    return
  }

  if (feedbackForm.hasSuggestions && feedbackForm.suggestions.length === 0) {
    ElMessage.warning('请至少添加一条修改建议')
    return
  }

  ElMessage.success('反馈已提交')
  addFeedbackVisible.value = false
  emit('refresh')
}

// 通过节点
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

// 驳回节点
const rejectVisible = ref(false)
const rejectForm = reactive({
  reason: ''
})

function handleReject() {
  rejectForm.reason = ''
  rejectVisible.value = true
}

function handleConfirmReject() {
  if (!rejectForm.reason) {
    ElMessage.warning('请输入驳回原因')
    return
  }

  ElMessage.success('已驳回，承接方需重新提交')
  rejectVisible.value = false
  emit('refresh')
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
  padding: 20px;
  margin-bottom: 20px;
}

.section:last-child {
  margin-bottom: 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 16px 0;
  font-size: 16px;
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
  font-size: 14px;
  font-weight: 600;
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
  margin-bottom: 16px;
}

.history-collapse {
  border: none;
  background: transparent;
}

.history-collapse :deep(.el-collapse-item__header) {
  background: #f5f7fb;
  padding: 12px 16px;
  border-radius: 6px;
  border: none;
  font-weight: 500;
}

.history-collapse :deep(.el-collapse-item__wrap) {
  border: none;
  background: transparent;
}

.history-collapse :deep(.el-collapse-item__content) {
  padding: 12px 0 0 0;
}

.collapse-title {
  font-size: 14px;
  color: #606266;
}

.history-submissions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 反馈列表 */
.add-feedback-btn {
  margin-bottom: 16px;
  width: 100%;
}

.feedbacks-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.feedback-item {
  background: #f5f7fb;
  border-radius: 6px;
  padding: 12px 16px;
}

.feedback-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.feedback-publisher {
  font-weight: 600;
  color: #303133;
  font-size: 14px;
}

.feedback-time {
  font-size: 12px;
  color: #909399;
}

.feedback-content {
  font-size: 13px;
  color: #606266;
  line-height: 1.6;
}

.suggestions-inline {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px dashed #dcdfe6;
}

.suggestion-title {
  font-weight: 600;
  color: #303133;
  margin-bottom: 6px;
  font-size: 13px;
}

.suggestion-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.suggestion-item {
  font-size: 13px;
  color: #606266;
  line-height: 1.5;
  position: relative;
  padding-left: 16px;
  margin-bottom: 4px;
}

.suggestion-item:before {
  content: '•';
  color: #909399;
  position: absolute;
  left: 0;
}

.suggestion-item:last-child {
  margin-bottom: 0;
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

/* 对话框内表单 */
.deliverable-form-item {
  padding: 16px;
  background: #f5f7fb;
  border-radius: 8px;
  margin-bottom: 16px;
}

.form-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.item-number {
  font-weight: 600;
  color: #303133;
}

.suggestions-input {
  margin-top: 12px;
}

.suggestion-input-item {
  margin-bottom: 12px;
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
