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

    <!-- 导航栏 -->
    <div class="nav-tabs">
      <div class="nav-tabs-container">
        <button
          v-for="tab in navTabs"
          :key="tab.key"
          :class="['nav-tab', { active: activeTab === tab.key }]"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- 面板内容 -->
    <div class="panel-content">
      <!-- 基本信息标签页 -->
      <div v-if="activeTab === 'basic'" class="tab-content">
        <!-- 任务描述板块 -->
        <div class="section task-description-section">
          <div class="description-content">
            <p class="task-description">{{ milestone?.description || '暂无描述' }}</p>

            <!-- ==================== V2.0 功能：交付物要求 ==================== -->
            <!--
              功能说明：显示企业设定的交付物要求（名称、格式、详细要求）
              延后原因：后端 API 暂未提供交付物要求数据结构
              恢复方法：
                1. 等待后端提供 API：GET /api/v1/milestone/{milestoneId}/deliverables
                2. 取消下方 HTML 注释（删除 注释标记）
                3. 在数据加载函数中填充 milestone.deliverables 字段
              数据结构：
                deliverables: [
                  {
                    id: Number,
                    name: String,        // 交付物名称，如"技术方案文档"
                    type: String,        // 类型（document/code/design）
                    format: Array,       // 格式要求，如['PDF', 'Word']
                    requirement: String  // 详细要求说明
                  }
                ]
              恢复位置：本文件第52-86行
            -->
            <!--
            <div v-if="milestone?.deliverables?.length" class="deliverables-list">
              <div class="deliverables-header">
                <h4 class="deliverables-title">交付物要求</h4>
              </div>
              <div class="deliverables-items">
                <div v-for="deliverable in milestone.deliverables" :key="deliverable.id" class="deliverable-item">
                  <div class="deliverable-info">
                    <el-icon class="file-icon"><Document /></el-icon>
                    <span class="deliverable-name">{{ deliverable.name }}</span>
                    <el-tag size="small" type="info">
                      {{ Array.isArray(deliverable.format) ? deliverable.format.join(' / ') : deliverable.format }}
                    </el-tag>
                  </div>
                  <p class="deliverable-requirement">{{ deliverable.requirement }}</p>
                </div>
              </div>
            </div>
            -->
            <!-- ==================== V2.0 功能结束 ==================== -->
          </div>
        </div>

        <!-- ==================== V2.0 功能：意见反馈 ==================== -->
        <!--
          功能说明：显示企业对里程碑提交的反馈意见（支持展开/收起）
          延后原因：后端 API 暂未提供反馈意见数据结构
          恢复方法：
            1. 等待后端提供 API：GET /api/v1/milestone/{milestoneId}/feedbacks
            2. 取消下方 HTML 注释（删除注释标记）
            3. 在数据加载函数中填充 milestone.feedbacks 字段
            4. 确保 expandedFeedbacks 和 toggleFeedback 函数可用（已存在，无需修改）
          数据结构：
            feedbacks: [
              {
                id: Number,
                time: String,        // 反馈时间，如"2025-11-18 16:00"
                content: String,     // 反馈内容
                publisher: String,   // 发布方名称
                suggestions: Array   // 建议列表（可选）
              }
            ]
          相关函数：
            - expandedFeedbacks: ref({}) - 控制展开/收起状态
            - toggleFeedback(feedbackId) - 切换展开/收起
            - sortedFeedbacks - 计算属性，按时间倒序排列
          恢复位置：本文件第90-142行
        -->
        <!--
        <div class="section feedback-section">
          <div class="section-header">
            <h4 class="section-title">意见反馈</h4>
          </div>

          <div v-if="milestone?.feedbacks?.length" class="feedbacks-list">
            <div
              v-for="feedback in sortedFeedbacks"
              :key="feedback.id"
              class="feedback-item"
            >
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

              <div v-else class="feedback-expanded">
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
                <div class="feedback-text-full">{{ feedback.content }}</div>
              </div>
            </div>
          </div>

          <el-empty v-else description="暂无反馈意见" :image-size="40" />
        </div>
        -->
        <!-- ==================== V2.0 功能结束 ==================== -->
      </div>

      <!-- 任务文件标签页 -->
      <div v-if="activeTab === 'files'" class="tab-content">
        <div class="section task-files-section">
          <div class="section-header">
            <h4 class="section-title">任务文件</h4>
          </div>

          <ul v-if="milestone?.taskFiles?.length" class="task-files-list">
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
          <el-empty v-if="!milestone?.taskFiles?.length" description="暂无任务文件" :image-size="40" />
        </div>
      </div>

      <!-- 提交文件标签页 -->
      <div v-if="activeTab === 'submissions'" class="tab-content">
        <div class="section submissions-section">
          <div class="section-header">
            <h4 class="section-title">我的提交</h4>
            <div class="header-actions">
              <el-button
                v-if="milestone?.status === 'pending' || milestone?.status === 'in-progress'"
                type="primary"
                size="small"
                @click="openUploadDialog(milestone)"
              >
                <el-icon><Upload /></el-icon>
                上传交付物
              </el-button>
            </div>
          </div>

          <!-- 所有提交（按时间倒序） -->
          <div v-if="allSubmissions.length > 0" class="all-submissions">
            <submission-item
              v-for="sub in allSubmissions"
              :key="sub.id"
              :submission="sub"
              @download="handleDownload"
              @view="handleViewSubmission"
            />
          </div>

          <el-empty v-else description="暂未提交文件" :image-size="40" />
        </div>
      </div>
    </div>

  </div>
<el-dialog
  v-model="uploadDialogVisible"
  :title="`上传交付物 - ${props.milestone?.title || ''}`"
  width="600px"
  :close-on-click-modal="false"
>
  <el-form :model="uploadForm" label-width="80px">
    <!-- 选择文件 -->
    <el-form-item label="选择文件" required>
      <el-upload
        class="upload-demo"
        drag
        :auto-upload="false"
        :on-change="handleFileChange"
        :on-remove="handleFileRemove"
        :file-list="fileList"
        multiple
      >
        <i class="el-icon el-icon--upload"><Upload /></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <template #tip>
          <div class="el-upload__tip">支持上传 PDF、Word、Excel、压缩包等文件，单个文件不超过 500 MB</div>
        </template>
      </el-upload>
    </el-form-item>
    <!-- 版本说明 -->
    <!--
    <el-form-item label="版本说明" required>
      <el-input
        v-model="uploadForm.versionNote"
        type="textarea"
        :rows="3"
        placeholder="请说明本次提交的主要修改内容或特点..."
        maxlength="500"
        show-word-limit
      />
    </el-form-item>
    -->
  </el-form>
  <template #footer>
    <el-button @click="uploadDialogVisible = false">取消</el-button>
    <el-button type="primary" @click="handleConfirmUpload">确认上传</el-button>
  </template>
</el-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useMilestoneUploadStore } from '@/store/modules/milestoneUpload'
import {
  ArrowRight,
  Document,
  Upload,
  Check,
  Clock,
  Download
} from '@element-plus/icons-vue'
import SubmissionItem from '@/components/student/SubmissionItem.vue'
import { uploadMilestoneDeliverableFileAPI, submitMilestoneDeliverableAPI } from '@/api/project'

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

const emit = defineEmits(['prev', 'next', 'upload', 'viewSubmission', 'refresh'])

// 任务文件展开/收起状态 - 默认折叠
const taskFilesExpanded = ref(false)

// 导航栏状态
const activeTab = ref('basic')

// 导航栏配置
const navTabs = [
  { key: 'basic', label: '基本信息' },
  { key: 'files', label: '任务文件' },
  { key: 'submissions', label: '提交文件' }
]

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

// 所有提交（去重并按时间倒序）
const allSubmissions = computed(() => {
  if (!props.milestone?.submissions || props.milestone.submissions.length === 0) {
    return []
  }

  // 去重：使用 Map 以文件名+上传时间为key
  const uniqueMap = new Map()
  props.milestone.submissions.forEach(sub => {
    const key = `${sub.fileName}_${sub.uploadTime}`
    if (!uniqueMap.has(key)) {
      uniqueMap.set(key, sub)
    }
  })

  // 转为数组并按时间倒序排列
  return Array.from(uniqueMap.values()).sort((a, b) => {
    return new Date(b.uploadTime) - new Date(a.uploadTime)
  })
})

// 最新提交（已废弃，保留兼容性）
const latestSubmission = computed(() => {
  return allSubmissions.value[0] || null
})

// 历史提交（已废弃，保留兼容性）
const historySubmissions = computed(() => {
  return []
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


// 事件处理
const handlePrev = () => emit('prev')
const handleNext = () => emit('next')
const handleUpload = () => emit('upload', props.milestone)
const handleViewSubmission = (submission) => emit('viewSubmission', submission)

// 下载文件
function handleDownload(submission) {
  const fileUrl = submission.fileUrl || submission.deliverableUrl
  if (!fileUrl) {
    ElMessage.error('文件地址不存在')
    return
  }

  const fullUrl = `http://localhost:8091${fileUrl}`
  const link = document.createElement('a')
  link.href = fullUrl
  link.download = submission.fileName
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  ElMessage.success(`开始下载：${submission.fileName}`)
}

// 下载任务文件
function handleDownloadTaskFile(file) {
  ElMessage.success(`开始下载：${file.name}`)
  console.log('下载任务文件：', file)
}

// ---------- 上传交付物相关 ----------
const uploadDialogVisible = ref(false)
const currentMilestoneId = ref(null)
const uploadForm = ref({ file: null, versionNote: '' })
const fileList = ref([])
const isUploading = ref(false)

function openUploadDialog(milestone) {
  currentMilestoneId.value = milestone.id
  uploadForm.value = { file: null, versionNote: '' }
  fileList.value = []
  uploadDialogVisible.value = true
}

function handleFileChange(file, uploadFiles) {
  const maxSize = 500 * 1024 * 1024
  if (file.size > maxSize) {
    ElMessage.warning(`文件 ${file.name} 超过 500 MB 限制`)
    return false
  }
  fileList.value = uploadFiles
}

function handleFileRemove(file) {
  const index = fileList.value.findIndex(f => f.uid === file.uid)
  if (index > -1) {
    fileList.value.splice(index, 1)
  }
}

const uploadStore = useMilestoneUploadStore()

async function handleConfirmUpload() {
  if (isUploading.value) {
    return
  }

  if (!fileList.value || fileList.value.length === 0) {
    ElMessage.warning('请选择要上传的文件')
    return
  }
  // if (!uploadForm.value.versionNote) {
  //   ElMessage.warning('请填写版本说明')
  //   return
  // }

  isUploading.value = true
  const loading = ElMessage.info({ message: '正在上传文件...', duration: 0 })

  try {
    // 循环上传所有文件并提交
    for (const file of fileList.value) {
      // 1. 上传文件获取 URL
      const formData = new FormData()
      formData.append('milestoneId', currentMilestoneId.value)
      formData.append('file', file.raw)

      const uploadResp = await uploadMilestoneDeliverableFileAPI(formData)
      if (uploadResp.code !== '0000') throw new Error(uploadResp.info || `文件 ${file.name} 上传失败`)

      // 2. 提交交付物（传递完整文件信息）
      const submitResp = await submitMilestoneDeliverableAPI({
        milestoneId: currentMilestoneId.value,
        fileName: file.name,
        deliverableUrl: uploadResp.data,
        fileSize: file.size,
        remark: uploadForm.value.versionNote
      })

      if (submitResp.code !== '0000') throw new Error(submitResp.info || `文件 ${file.name} 提交失败`)
    }

    // 3. 更新本地状态
    const milestone = props.milestone
    milestone.status = 'delivered'

    loading.close()
    ElMessage.success(`成功提交 ${fileList.value.length} 个文件`)
    uploadDialogVisible.value = false

    // 刷新页面数据
    emit('refresh')
  } catch (e) {
    loading.close()
    console.error('提交里程碑交付物失败', e)
    ElMessage.error(e.message || '提交失败，请稍后重试')
  } finally {
    isUploading.value = false
  }
}
</script>

<style scoped>
/* ==================== V2.0 功能样式（已注释功能，保留样式便于恢复） ==================== */

/* 交付物要求样式 */
.deliverables-list {
  margin-top: 16px;
}

.deliverables-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
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
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 12px 0 0 0;
}

.deliverable-item {
  padding: 12px 16px;
  background: #ffffff;
  border: 1px solid #edf1fb;
  border-radius: 8px;
}

.deliverable-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.deliverable-info .file-icon {
  font-size: 16px;
  color: #6b7280;
  flex-shrink: 0;
}

.deliverable-name {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  flex: 1;
}

.deliverable-requirement {
  margin: 0;
  font-size: 13px;
  color: #6b7280;
  line-height: 1.5;
  padding-left: 24px;
}

/* 反馈意见样式 */
.feedback-section {
  /* 保留原有样式 */
}

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

/* ==================== V2.0 功能样式结束 ==================== */

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

/* 导航栏 */
.nav-tabs {
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
}

.nav-tabs-container {
  display: flex;
  padding: 0 24px;
}

.nav-tab {
  padding: 12px 24px;
  border: none;
  background: transparent;
  color: #6b7280;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease;
}

.nav-tab:hover {
  color: #2563eb;
}

.nav-tab.active {
  color: #2563eb;
  border-bottom-color: #2563eb;
}

/* 面板内容 */
.panel-content {
  padding: 0 24px 24px 24px;
}

.tab-content {
  padding: 24px 0 0 0;
}

/* 区块样式 */
.section {
  margin-bottom: 12px;
  padding-top: 8px;
  padding-bottom: 0px;
  border-bottom: 2px solid #d1d5db;
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
  margin-bottom: 12px;
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
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 12px 0 0 0;
}

.deliverable-item {
  padding: 12px 16px;
  background: #ffffff;
  border: 1px solid #edf1fb;
  border-radius: 8px;
}

.deliverable-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.deliverable-info .file-icon {
  font-size: 16px;
  color: #6b7280;
  flex-shrink: 0;
}

.deliverable-name {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  flex: 1;
}

.deliverable-requirement {
  margin: 0;
  font-size: 13px;
  color: #6b7280;
  line-height: 1.5;
  padding-left: 24px;
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

/* 历史提交区域 */
.history-submissions {
  margin-top: 24px;
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
