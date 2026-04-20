<template>
  <div class="project-manage-root">
    <!-- ========== 自定义导航栏 ========== -->
    <project-manage-header
      :breadcrumb-items="breadcrumbItems"
      :unread-count="0"
    />

    <!-- ========== 加载状态 ========== -->
    <div v-if="loading" class="loading-container">
      <el-icon class="is-loading"><Loading /></el-icon>
      <span>加载中...</span>
    </div>

    <!-- ========== 单栏布局：项目概览 + 里程碑进度 ========== -->
    <div v-else-if="project" class="main-layout">
      <!-- 主内容区 -->
      <div class="main-content">
        <!-- 项目概览卡片 -->
        <project-overview
          :project="project"
          :canEdit="false"
          class="overview-card"
        />

        <!-- 里程碑进度条 -->
        <div class="milestone-progress-section">
          <milestone-progress-bar
            :milestones="milestones"
            @nodeClick="handleNodeClick"
          />
        </div>

        <!-- 里程碑详情面板 -->
        <milestone-detail-panel
          v-if="selectedMilestone"
          :milestone="selectedMilestone"
          :currentIndex="selectedMilestoneIndex"
          :totalCount="milestones.length"
          @prev="handlePrevMilestone"
          @next="handleNextMilestone"
          @upload="handleUpload"
          @viewSubmission="handleViewSubmission"
        />

        <!-- 项目详细信息 -->
        <div v-if="project" class="detail-content">
          <!-- 项目描述 -->
          <div class="section">
            <h3>■ 项目描述</h3>
            <div class="description-text" style="white-space: pre-wrap;">{{ project.description || '暂无项目描述' }}</div>
          </div>

          <!-- 揭榜要求 -->
          <div class="section">
            <h3>■ 揭榜要求</h3>
            <div class="description-text" style="white-space: pre-wrap;">{{ project.requirements || '暂无揭榜要求' }}</div>
          </div>
        </div>

        <!-- 里程碑时间线（保留原有组件作为备用） -->
        <milestone-timeline
          v-if="false"
          :milestones="milestones"
          @upload="handleUpload"
          @viewSubmission="handleViewSubmission"
          @downloadSubmission="handleDownloadSubmission"
          @guideAction="handleGuideAction"
        />

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
import ProjectManageHeader from '@/components/layout/ProjectManageHeader.vue'
import ProjectOverview from '@/components/common/ProjectOverview.vue'
import MilestoneProgressBar from '@/components/common/MilestoneProgressBar.vue'
import MilestoneDetailPanel from '@/components/common/MilestoneDetailPanel.vue'

// Mock 数据导入（降级使用）
import { mockProjectManageData, formatFileSize } from '@/mock/projectManage'

// API 导入
import { getProjectDetailAPI, getMilestonesByProjectAPI, getMilestoneDetailAPI } from '@/api/project'
import { useMilestoneUploadStore } from '@/store/modules/milestoneUpload'

// 数据映射工具导入
import { mapProjectData, mapMilestoneData } from '@/utils/projectMapper'
import { findCurrentMilestone } from '@/utils/status'

const route = useRoute()
const projectId = route.params.id

// ========== 状态定义 ==========
const loading = ref(true)
const project = ref(null)
const milestones = ref([])
const timelineEvents = ref([])
const reviewHistory = ref([])

// 面包屑导航数据
const breadcrumbItems = computed(() => [
  { title: '首页', path: '/campus-home' },
  { title: '我的项目', path: '/my-projects' },
  { title: '项目管理', path: null }
])


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

// 选中的里程碑
const selectedMilestone = ref(null)
const selectedMilestoneIndex = ref(0)

// ========== 计算属性 ==========
const currentMilestone = computed(() => {
  if (!currentMilestoneId.value) return null
  return milestones.value.find(m => m.id === currentMilestoneId.value)
})

// ========== 数据加载 ==========
async function fetchManageData() {
  loading.value = true
  try {
    // 并发请求项目详情和里程碑列表
    const [projectResult, milestonesResult] = await Promise.allSettled([
      getProjectDetailAPI(projectId),
      getMilestonesByProjectAPI(projectId)
    ])

    // 处理项目详情
    if (projectResult.status === 'fulfilled') {
      project.value = mapProjectData(projectResult.value.data)
    } else {
      throw new Error('加载项目详情失败')
    }

    // 处理里程碑列表
    if (milestonesResult.status === 'fulfilled') {
      const milestonesData = milestonesResult.value.data.milestones || []
      milestones.value = milestonesData.map(mapMilestoneData)
    } else {
      milestones.value = []
    }

    // 自动选中当前进行中的里程碑，如果没有则选中第一个
    const currentMilestone = findCurrentMilestone(milestones.value)
    if (currentMilestone) {
      const index = milestones.value.findIndex(m => m.id === currentMilestone.id)
      selectedMilestoneIndex.value = index
      // 加载里程碑详情
      try {
        const detailRes = await getMilestoneDetailAPI(currentMilestone.id)
        selectedMilestone.value = mapMilestoneData(detailRes.data)
      } catch (error) {
        console.error('加载里程碑详情失败', error)
        selectedMilestone.value = currentMilestone
      }
    } else if (milestones.value.length > 0) {
      selectedMilestoneIndex.value = 0
      // 加载第一个里程碑详情
      try {
        const detailRes = await getMilestoneDetailAPI(milestones.value[0].id)
        selectedMilestone.value = mapMilestoneData(detailRes.data)
      } catch (error) {
        console.error('加载里程碑详情失败', error)
        selectedMilestone.value = milestones.value[0]
      }
    }

    console.log('项目数据加载成功：', {
      项目名称: project.value.name,
      里程碑数量: milestones.value.length,
      当前里程碑: currentMilestone?.title || '无'
    })
  } catch (error) {
    ElMessage.error('加载项目数据失败，已切换为默认数据')
    console.error(error)

    // 降级到Mock数据
    const data = mockProjectManageData
    project.value = data.project
    milestones.value = data.milestones
    timelineEvents.value = data.timelineEvents
    reviewHistory.value = data.reviewHistory

    // 自动选中当前进行中的里程碑
    const currentMilestone = findCurrentMilestone(milestones.value)
    if (currentMilestone) {
      const index = milestones.value.findIndex(m => m.id === currentMilestone.id)
      selectedMilestone.value = currentMilestone
      selectedMilestoneIndex.value = index
    } else if (milestones.value.length > 0) {
      selectedMilestone.value = milestones.value[0]
      selectedMilestoneIndex.value = 0
    }
  } finally {
    loading.value = false
  }
}

onMounted(fetchManageData)

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

// ========== 里程碑进度条交互 ==========
async function handleNodeClick(milestone) {
  const index = milestones.value.findIndex(m => m.id === milestone.id)
  selectedMilestoneIndex.value = index

  // 加载里程碑详情（获取文件列表）
  try {
    const res = await getMilestoneDetailAPI(milestone.id)
    selectedMilestone.value = mapMilestoneData(res.data)
  } catch (error) {
    console.error('加载里程碑详情失败', error)
    selectedMilestone.value = milestone
  }

  // 滚动到详情面板
  setTimeout(() => {
    const element = document.querySelector('.milestone-detail-panel')
    if (element) {
      const headerOffset = 100
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }, 100)
}

function handlePrevMilestone() {
  if (selectedMilestoneIndex.value > 0) {
    selectedMilestoneIndex.value--
    selectedMilestone.value = milestones.value[selectedMilestoneIndex.value]
  }
}

function handleNextMilestone() {
  if (selectedMilestoneIndex.value < milestones.value.length - 1) {
    selectedMilestoneIndex.value++
    selectedMilestone.value = milestones.value[selectedMilestoneIndex.value]
  }
}
</script>

<style scoped>
.project-manage-root {
  min-height: 100vh;
  background: #f5f7fb;
  padding: 84px 24px 24px; /* 顶部留出固定 Header 的空间（60px + 24px） */
  max-width: 100%;
  margin: 0 auto;
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

/* 单栏布局 */
.main-layout {
  margin-top: 20px;
}

/* 主内容容器 */
.main-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}

/* 项目概览卡片 */
.overview-card {
  margin-bottom: 16px;
}

/* 里程碑进度条区域 */
.milestone-progress-section {
  margin-bottom: 24px;
  padding: 0 24px 16px 24px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
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

/* 项目详细信息 */
.detail-content {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  margin-top: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.detail-content .section {
  margin-bottom: 32px;
}

.detail-content .section:last-child {
  margin-bottom: 0;
}

.detail-content .section h3 {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 16px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid #e4e7ed;
}

.detail-content .description-text {
  font-size: 14px;
  line-height: 1.8;
  color: #606266;
  text-align: justify;
}

/* 响应式 */
@media (max-width: 1200px) {
  .project-manage-root {
    max-width: 100%;
  }

  .main-content {
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }
}
</style>
