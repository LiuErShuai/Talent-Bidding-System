<template>
  <div class="project-manage-root">
    <!-- ========== 面包屑导航 ========== -->
    <el-breadcrumb separator=">" class="breadcrumb-nav">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/my-projects' }">我的项目</el-breadcrumb-item>
      <el-breadcrumb-item>我承接的</el-breadcrumb-item>
      <el-breadcrumb-item>项目管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- ========== 加载状态 ========== -->
    <div v-if="loading" class="loading-container">
      <el-icon class="is-loading"><Loading /></el-icon>
      <span>加载中...</span>
    </div>

    <!-- ========== 双栏布局：快捷面板 + (概览+时间线) ========== -->
    <div v-else-if="project" class="main-layout">
      <!-- 左侧：快捷操作面板 -->
      <quick-action-panel
        :milestones="milestones"
        @upload="handleQuickUpload"
        @viewRequirements="handleViewRequirements"
        @jump="handleQuickJump"
        @alertClick="handleAlertClick"
      />

      <!-- 右侧：项目概览 + 里程碑时间线 -->
      <div class="right-content">
        <!-- 项目概览卡片 -->
        <project-overview
          :project="project"
          :canEdit="false"
          class="overview-in-right"
        />

        <!-- 里程碑时间线 -->
        <milestone-timeline
          :milestones="milestones"
          @upload="handleUpload"
          @viewSubmission="handleViewSubmission"
          @downloadSubmission="handleDownloadSubmission"
          @guideAction="handleGuideAction"
        />

        <!-- 团队信息（可折叠） -->
        <div class="collapse-section">
          <el-collapse v-model="activeCollapse" class="bottom-sections">
            <el-collapse-item title="👥 团队信息" name="team">
              <team-panel :members="project.members || []" :canEdit="false" />
            </el-collapse-item>
          </el-collapse>
        </div>

        <!-- 审核历史与项目动态（可折叠） -->
        <div class="collapse-section">
          <el-collapse v-model="activeCollapse" class="bottom-sections">
            <el-collapse-item title="📜 审核历史与项目动态" name="timeline">
              <timeline-panel :events="timelineEvents" :reviewHistory="reviewHistory" />
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
    </div>

    <!-- ========== 上传交付物对话框 ========== -->
    <el-dialog
      v-model="uploadDialogVisible"
      :title="`上传交付物 - ${currentMilestone?.title || ''}`"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form :model="uploadForm" label-width="80px">
        <el-form-item label="选择文件" required>
          <el-upload
            class="upload-demo"
            drag
            :auto-upload="false"
            :on-change="handleFileChange"
            :limit="1"
            :file-list="fileList"
          >
            <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                支持上传 PDF、Word、Excel、压缩包等文件，单个文件不超过 500MB
              </div>
            </template>
          </el-upload>
        </el-form-item>

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

        <!-- 显示交付物要求 -->
        <el-alert
          v-if="currentMilestone"
          type="info"
          :closable="false"
          class="deliverables-hint"
        >
          <template #title>
            <div class="hint-title">本里程碑要求提交以下交付物：</div>
            <ul class="hint-list">
              <li v-for="d in currentMilestone.deliverables" :key="d.id">
                ✓ {{ d.name }} - {{ d.requirement }}
              </li>
            </ul>
          </template>
        </el-alert>
      </el-form>

      <template #footer>
        <el-button @click="uploadDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmUpload">确认上传</el-button>
      </template>
    </el-dialog>

    <!-- ========== 查看提交详情对话框 ========== -->
    <el-dialog
      v-model="viewDialogVisible"
      :title="`${currentSubmission?.fileName || '提交详情'}`"
      width="600px"
    >
      <div v-if="currentSubmission" class="submission-detail">
        <div class="detail-section">
          <h4>📄 文件信息</h4>
          <div class="detail-grid">
            <div class="detail-item">
              <span class="label">文件名：</span>
              <span class="value">{{ currentSubmission.fileName }}</span>
            </div>
            <div class="detail-item">
              <span class="label">文件大小：</span>
              <span class="value">{{ currentSubmission.fileSize }}</span>
            </div>
            <div class="detail-item">
              <span class="label">版本号：</span>
              <span class="value">v{{ currentSubmission.version }}</span>
            </div>
            <div class="detail-item">
              <span class="label">上传时间：</span>
              <span class="value">{{ currentSubmission.uploadTime }}</span>
            </div>
            <div class="detail-item">
              <span class="label">上传人：</span>
              <span class="value">{{ currentSubmission.uploader }}</span>
            </div>
          </div>
        </div>

        <div v-if="currentSubmission.versionNote" class="detail-section">
          <h4>📝 版本说明</h4>
          <p class="version-note">{{ currentSubmission.versionNote }}</p>
        </div>

        <div v-if="currentSubmission.reviewResult" class="detail-section">
          <h4>
            {{ currentSubmission.status === 'approved' ? '✅' : '❌' }}
            审核结果：{{ currentSubmission.status === 'approved' ? '已通过' : '被驳回' }}
          </h4>
          <div class="review-info">
            <div class="review-meta">
              <span>审核人：{{ currentSubmission.reviewResult.reviewer }}</span>
              <span>审核时间：{{ currentSubmission.reviewResult.reviewTime }}</span>
            </div>
            <el-alert
              :type="currentSubmission.status === 'approved' ? 'success' : 'warning'"
              :closable="false"
            >
              <template #title>💬 审核反馈</template>
              <p>{{ currentSubmission.reviewResult.comment }}</p>
              <div v-if="currentSubmission.reviewResult.rating" class="rating">
                <span>评分：</span>
                <el-rate v-model="currentSubmission.reviewResult.rating" disabled />
              </div>
            </el-alert>
          </div>
        </div>

        <div v-else class="detail-section">
          <el-alert type="info" :closable="false">
            <template #title>⏳ 待审核</template>
            <p>交付物已提交，等待企业审核...</p>
          </el-alert>
        </div>
      </div>

      <template #footer>
        <el-button @click="viewDialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="handleDownload(currentSubmission)">
          <el-icon><Download /></el-icon>
          下载文件
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Loading, UploadFilled, Download } from '@element-plus/icons-vue'

// 组件导入
import ProjectOverview from '@/components/ProjectOverview.vue'
import QuickActionPanel from '@/components/QuickActionPanel.vue'
import MilestoneTimeline from '@/components/MilestoneTimeline.vue'
import TeamPanel from '@/components/TeamPanel.vue'
import TimelinePanel from '@/components/TimelinePanel.vue'

// Mock 数据导入
import { mockProjectManageData, formatFileSize } from '@/mock/projectManage'

const route = useRoute()
const projectId = route.params.id

// ========== 状态定义 ==========
const loading = ref(true)
const project = ref(null)
const milestones = ref([])
const timelineEvents = ref([])
const reviewHistory = ref([])

// 折叠面板状态
const activeCollapse = ref(['team', 'timeline'])

// 上传对话框
const uploadDialogVisible = ref(false)
const currentMilestoneId = ref(null)
const uploadForm = reactive({
  file: null,
  versionNote: ''
})
const fileList = ref([])

// 查看详情对话框
const viewDialogVisible = ref(false)
const currentSubmission = ref(null)

// ========== 计算属性 ==========
const currentMilestone = computed(() => {
  if (!currentMilestoneId.value) return null
  return milestones.value.find(m => m.id === currentMilestoneId.value)
})

// ========== 数据加载 ==========
async function fetchManageData() {
  loading.value = true
  try {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 800))

    // 使用 Mock 数据
    const data = mockProjectManageData
    project.value = data.project
    milestones.value = data.milestones
    timelineEvents.value = data.timelineEvents
    reviewHistory.value = data.reviewHistory

    console.log('项目数据加载成功：', {
      项目名称: project.value.name,
      里程碑数量: milestones.value.length,
      当前里程碑: milestones.value.find(m => m.status === 'in-progress')?.title
    })
  } catch (error) {
    ElMessage.error('加载项目数据失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchManageData)

// ========== 快捷面板事件处理 ==========
function handleQuickUpload() {
  // 找到当前进行中的里程碑
  const current = milestones.value.find(m => m.status === 'in-progress')
  if (current) {
    handleUpload(current.id)
    // 滚动到当前里程碑
    setTimeout(() => {
      const element = document.querySelector('.timeline-item-current')
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 100)
  } else {
    ElMessage.warning('当前没有进行中的里程碑')
  }
}

function handleViewRequirements() {
  // 滚动到当前里程碑并展开
  const current = milestones.value.find(m => m.status === 'in-progress')
  if (current) {
    setTimeout(() => {
      const element = document.querySelector('.timeline-item-current')
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 100)
  }
}

function handleQuickJump(target) {
  if (target === 'history') {
    // 跳转到第一个已完成的里程碑
    const firstCompleted = document.querySelector('.timeline-item-completed')
    firstCompleted?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  } else if (target === 'future') {
    // 跳转到第一个待开始的里程碑
    const firstPending = document.querySelector('.timeline-item-pending')
    firstPending?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  } else if (target === 'reviews') {
    // 展开审核历史区域
    if (!activeCollapse.value.includes('timeline')) {
      activeCollapse.value.push('timeline')
    }
    setTimeout(() => {
      const element = document.querySelector('.bottom-sections')
      element?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 300)
  }
}

function handleAlertClick(alert) {
  // 跳转到对应的里程碑
  const index = milestones.value.findIndex(m => m.id === alert.milestoneId)
  if (index >= 0) {
    const element = document.querySelector(`.timeline-item:nth-child(${index + 1})`)
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

// ========== 上传交付物 ==========
function handleUpload(milestoneId) {
  currentMilestoneId.value = milestoneId
  uploadForm.file = null
  uploadForm.versionNote = ''
  fileList.value = []
  uploadDialogVisible.value = true
}

function handleFileChange(file) {
  uploadForm.file = file.raw
  fileList.value = [file]
}

function handleConfirmUpload() {
  if (!uploadForm.file) {
    ElMessage.warning('请选择要上传的文件')
    return
  }
  if (!uploadForm.versionNote) {
    ElMessage.warning('请填写版本说明')
    return
  }

  const milestone = milestones.value.find(m => m.id === currentMilestoneId.value)
  if (!milestone) return

  // 计算新版本号
  const maxVersion = Math.max(...(milestone.submissions || []).map(s => s.version), 0)
  const newVersion = maxVersion + 1

  // 创建新提交记录
  const newSubmission = {
    id: Date.now(),
    version: newVersion,
    deliverableId: milestone.deliverables[0]?.id || 1,
    fileName: uploadForm.file.name,
    fileSize: formatFileSize(uploadForm.file.size),
    uploadTime: new Date().toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }),
    uploader: '张三',
    versionNote: uploadForm.versionNote,
    status: 'pending',
    reviewResult: null
  }

  // 添加到里程碑的提交记录中
  if (!milestone.submissions) {
    milestone.submissions = []
  }
  milestone.submissions.push(newSubmission)

  // 更新进度
  milestone.progressDetail.percentage = Math.round(
    (milestone.submissions.filter(s => s.status === 'approved').length / milestone.deliverables.length) * 100
  )

  // 添加时间线事件
  timelineEvents.value.unshift({
    id: `event-${Date.now()}`,
    time: newSubmission.uploadTime,
    type: 'upload',
    title: `提交交付物：${milestone.title} v${newVersion}`,
    description: `提交了"${newSubmission.fileName}"`,
    user: newSubmission.uploader,
    icon: 'info'
  })

  ElMessage.success(`成功提交 v${newVersion}，等待审核`)
  uploadDialogVisible.value = false

  console.log('新提交记录：', newSubmission)
}

// ========== 查看提交详情 ==========
function handleViewSubmission(submission) {
  currentSubmission.value = submission
  viewDialogVisible.value = true
}

// ========== 下载提交文件 ==========
function handleDownloadSubmission(submission) {
  handleDownload(submission)
}

function handleDownload(submission) {
  if (!submission) return
  ElMessage.success(`开始下载：${submission.fileName}`)
  console.log('下载文件：', submission)
  // 实际项目中应该调用后端API获取下载链接
}

// ========== 下一步引导操作 ==========
function handleGuideAction({ milestone, action }) {
  if (action === 'upload') {
    handleUpload(milestone.id)
  } else if (action === 'view-feedback') {
    // 查看被驳回的提交反馈
    const rejected = milestone.submissions?.find(s => s.status === 'rejected')
    if (rejected) {
      handleViewSubmission(rejected)
    }
  } else if (action === 'next') {
    // 跳转到下一个里程碑
    const currentIndex = milestones.value.findIndex(m => m.id === milestone.id)
    if (currentIndex < milestones.value.length - 1) {
      const nextElement = document.querySelector(`.timeline-item:nth-child(${currentIndex + 2})`)
      nextElement?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }
}
</script>

<style scoped>
.project-manage-root {
  min-height: calc(100vh - 90px); /* 减去导航栏高度 */
  background: #f5f7fb;
  padding: 24px 24px 24px 24px; /* 保持左右和底部padding，顶部不需要额外padding */
  max-width: 1400px;
  margin: 0 auto;
}

/* 面包屑导航 */
.breadcrumb-nav {
  margin-bottom: 20px;
}

.breadcrumb-nav :deep(.el-breadcrumb__inner) {
  color: #1890ff;
  font-weight: 400;
}

.breadcrumb-nav :deep(.el-breadcrumb__inner:hover) {
  color: #40a9ff;
}

/* 加载状态 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  color: #909399;
}

.loading-container .el-icon {
  font-size: 32px;
  margin-bottom: 12px;
}

/* 双栏布局 */
.main-layout {
  display: flex;
  gap: 24px;
  margin-top: 20px;
  align-items: flex-start;
}

/* 右侧内容容器 */
.right-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

/* 右侧的项目概览卡片 */
.overview-in-right {
  margin-bottom: 24px;
}

/* 折叠面板整体容器 */
.collapse-section {
  margin-top: 16px;
  margin-bottom: 16px;
}

/* 底部折叠区域 */
.bottom-sections {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.bottom-sections :deep(.el-collapse-item__header) {
  font-size: 15px;
  font-weight: 600;
  padding: 0 20px;
  height: 50px;
  margin: 0;  /* 移除默认边距，确保边界对齐 */
  box-sizing: border-box;  /* 统一盒模型，确保宽度计算一致 */
}

.bottom-sections :deep(.el-collapse-item__content) {
  padding: 20px;
  margin: 0;  /* 移除默认边距，确保边界对齐 */
  box-sizing: border-box;  /* 统一盒模型，确保宽度计算一致 */
}

/* 移除内部 el-card 的额外边距和装饰，确保内容与标题对齐 */
.bottom-sections :deep(.el-collapse-item__content) .team-panel,
.bottom-sections :deep(.el-collapse-item__content) .el-card {
  margin: -20px;           /* 抵消 content 的 padding */
  border-radius: 0;        /* 移除 card 的圆角，使用外层圆角 */
  box-shadow: none;        /* 移除 card 的阴影，使用外层阴影 */
}

/* 上传对话框 */
.upload-demo {
  width: 100%;
}

.deliverables-hint {
  margin-top: 16px;
}

.hint-title {
  font-weight: 600;
  margin-bottom: 8px;
}

.hint-list {
  margin: 0;
  padding-left: 20px;
  list-style: none;
}

.hint-list li {
  margin: 4px 0;
  line-height: 1.6;
}

/* 查看详情对话框 */
.submission-detail {
  max-height: 60vh;
  overflow-y: auto;
}

.detail-section {
  margin-bottom: 24px;
}

.detail-section:last-child {
  margin-bottom: 0;
}

.detail-section h4 {
  margin: 0 0 12px 0;
  font-size: 15px;
  font-weight: 600;
  color: #1f274b;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-item .label {
  font-size: 12px;
  color: #909399;
}

.detail-item .value {
  font-size: 14px;
  color: #303133;
  font-weight: 500;
}

.version-note {
  margin: 0;
  padding: 12px;
  background: #f5f7fb;
  border-radius: 8px;
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
}

.review-info {
  margin-top: 12px;
}

.review-meta {
  display: flex;
  gap: 20px;
  margin-bottom: 12px;
  font-size: 13px;
  color: #606266;
}

.rating {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
}

/* 响应式 */
@media (max-width: 1200px) {
  .project-manage-root {
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  .main-layout {
    flex-direction: column;
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }
}
</style>
