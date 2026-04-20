<template>
  <div class="enterprise-project-manage">
    <!-- 自定义导航栏 -->
    <project-manage-header
      :breadcrumb-items="breadcrumbItems"
      :unread-count="0"
    />

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <el-icon class="is-loading"><Loading /></el-icon>
      <span>加载中...</span>
    </div>

    <!-- 主内容区：左右布局 -->
    <div v-else class="main-container">
      <!-- 左侧导航栏 -->
      <project-sidebar
        :project="project"
        :milestones="milestones"
        :active-section="activeSection"
        @select="handleSectionSelect"
      />

      <!-- 右侧内容区 -->
      <div class="content-area">
        <!-- 基本信息 -->
        <bidding-basic-info
          v-if="activeSection === 'basic'"
          :project="project"
          :milestones="milestones"
          @viewMilestone="handleViewMilestone"
        />

        <!-- 揭榜管理 -->
        <bidding-management
          v-else-if="activeSection === 'bidding-management'"
          :project-id="projectId"
          @refresh="fetchProjectData"
        />

        <!-- 里程碑详情 -->
        <milestone-detail
          v-else-if="activeSection.startsWith('milestone-')"
          :milestone="currentMilestone"
          :project="project"
          @refresh="fetchProjectData"
        />

        <!-- 历史记录 -->
        <history-records
          v-else-if="activeSection === 'history'"
          :project-id="projectId"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Loading } from '@element-plus/icons-vue'

// 组件导入
import ProjectManageHeader from '@/components/layout/ProjectManageHeader.vue'
import ProjectSidebar from '@/components/enterprise/ProjectSidebar.vue'
import BiddingBasicInfo from '@/components/enterprise/BiddingBasicInfo.vue'
import BiddingManagement from '@/components/enterprise/BiddingManagement.vue'
import MilestoneDetail from '@/components/enterprise/MilestoneDetail.vue'
import HistoryRecords from '@/components/enterprise/HistoryRecords.vue'

// API 导入
import {
  getProjectDetailAPI,
  getMyProjectsAPI,
  getMilestonesByProjectAPI,
  getProjectBidsAPI
} from '@/api/project'

// Mock 数据导入（接口失败兜底）
import { mockProjectManageData } from '@/mock/projectManage'

const route = useRoute()
const projectId = route.params.id

// 状态定义
const loading = ref(true)
const project = ref(null)
const milestones = ref([])
const activeSection = ref('basic') // 默认显示基本信息

// 面包屑导航数据
const breadcrumbItems = computed(() => [
  { title: '首页', path: '/home' },
  { title: '我的项目', path: '/enterprise/my-projects' },
  { title: '项目管理', path: null }
])

// 当前选中的里程碑
const currentMilestone = computed(() => {
  if (!activeSection.value.startsWith('milestone-')) return null
  const milestoneId = activeSection.value.replace('milestone-', '')
  return milestones.value.find(m => String(m.id) === milestoneId)
})

// 项目状态文案映射
function mapProjectStatusText(status) {
  const map = {
    draft: '草稿',
    pending_review: '待审核',
    rejected: '已拒绝',
    published: '已发布',
    in_progress: '进行中',
    completed: '已完成',
    closed: '已关闭'
  }
  return map[status] || status || '未知状态'
}

// 项目状态映射到页面组件使用值
function mapProjectStatus(status) {
  const map = {
    pending_review: 'pending',
    published: 'bidding',
    in_progress: 'ongoing',
    completed: 'completed',
    closed: 'cancelled',
    rejected: 'cancelled',
    draft: 'pending'
  }
  return map[status] || 'pending'
}

// 里程碑状态映射
function mapMilestoneStatus(status) {
  const map = {
    planned: 'pending',
    in_progress: 'in-progress',
    delivered: 'in-progress',
    under_review: 'in-progress',
    completed: 'completed',
    rejected: 'skipped',
    expired: 'skipped',
    skipped: 'skipped'
  }
  return map[status] || 'pending'
}

// 里程碑状态文案
function mapMilestoneStatusText(status) {
  const map = {
    planned: '待开始',
    in_progress: '进行中',
    delivered: '已交付',
    under_review: '评审中',
    completed: '已完成',
    rejected: '已拒绝',
    expired: '已过期',
    skipped: '已跳过'
  }
  return map[status] || status || '待开始'
}

// 统一获取响应 data
function extractData(response) {
  if (!response) return null
  if (Array.isArray(response)) return response
  return response.data ?? response
}

// 构建页面需要的项目数据结构
function buildProjectModel(detailData, myProjectItem, bids) {
  const totalApplications = myProjectItem?.applicationCount ?? bids.length
  const approvedApplications = bids.filter(item => ['shortlisted', 'confirmed'].includes(item.status)).length
  const pendingApplications = bids.filter(item => item.status === 'applied').length
  const confirmedBid = bids.find(item => item.status === 'confirmed')
  const selectedTeam = myProjectItem?.acceptedTeamName || confirmedBid?.teamName || (myProjectItem?.acceptedTeamId ? '已选定团队' : '')

  return {
    id: detailData?.projectId || detailData?.id || projectId,
    name: detailData?.title || myProjectItem?.title || '未命名项目',
    status: mapProjectStatus(detailData?.status),
    statusText: mapProjectStatusText(detailData?.status),
    startDate: detailData?.expectedStartDate || detailData?.startDate || '',
    endDate: detailData?.expectedEndDate || detailData?.endDate || '',
    applicationDeadline: detailData?.applicationDeadline || '',
    description: detailData?.description || '',
    requirements: detailData?.requirements || '',
    publisher: detailData?.publisherName || detailData?.enterpriseName || '--',
    publisherId: detailData?.publisherId || '',
    currentMilestone: myProjectItem?.currentMilestone || '',
    biddingStats: {
      totalApplications,
      approvedApplications,
      pendingApplications,
      selectedTeam
    }
  }
}

// 构建页面需要的里程碑数据结构
function buildMilestoneModel(milestoneData) {
  const list = Array.isArray(milestoneData?.milestones)
    ? milestoneData.milestones
    : Array.isArray(milestoneData)
      ? milestoneData
      : []

  return list.map((item, index) => ({
    id: item.milestoneId || item.id || `${item.milestoneCode || 'milestone'}-${index}`,
    title: item.name || item.title || '未命名里程碑',
    description: item.description || '',
    status: mapMilestoneStatus(item.status),
    statusText: mapMilestoneStatusText(item.status),
    plannedDate: item.plannedEndTime || item.planEndTime || '',
    deliverables: item.deliverables || []
  }))
}

// 数据加载
async function fetchProjectData() {
  loading.value = true
  try {
    const [detailResult, milestonesResult, myProjectsResult, bidsResult] = await Promise.allSettled([
      getProjectDetailAPI(projectId),
      getMilestonesByProjectAPI(projectId),
      getMyProjectsAPI({ pageNum: 1, pageSize: 200 }),
      getProjectBidsAPI(projectId, { pageNum: 1, pageSize: 200 })
    ])

    if (detailResult.status !== 'fulfilled') {
      throw detailResult.reason
    }

    const detailData = extractData(detailResult.value)
    const milestoneData = milestonesResult.status === 'fulfilled' ? extractData(milestonesResult.value) : null
    const myProjectsData = myProjectsResult.status === 'fulfilled' ? extractData(myProjectsResult.value) : null
    const bidsData = bidsResult.status === 'fulfilled' ? extractData(bidsResult.value) : null

    const myProjects = Array.isArray(myProjectsData?.records)
      ? myProjectsData.records
      : Array.isArray(myProjectsData?.projects)
        ? myProjectsData.projects
        : Array.isArray(myProjectsData)
          ? myProjectsData
          : []

    const currentProject = myProjects.find(item => String(item.projectId || item.id) === String(projectId))

    const bids = Array.isArray(bidsData?.records)
      ? bidsData.records
      : Array.isArray(bidsData?.bids)
        ? bidsData.bids
        : Array.isArray(bidsData)
          ? bidsData
          : []

    project.value = buildProjectModel(detailData, currentProject, bids)
    milestones.value = buildMilestoneModel(milestoneData)

    console.log('企业方项目数据加载成功：', {
      项目名称: project.value.name,
      里程碑数量: milestones.value.length
    })
  } catch (error) {
    ElMessage.error('加载项目数据失败，已切换为默认数据')
    console.error(error)

    // 接口异常时回退 Mock
    const data = mockProjectManageData
    project.value = data.project
    milestones.value = data.milestones
  } finally {
    loading.value = false
  }
}

// 导航选择处理
function handleSectionSelect(section) {
  activeSection.value = section
  console.log('切换到：', section)
}

// 查看里程碑详情
function handleViewMilestone(milestoneId) {
  activeSection.value = `milestone-${milestoneId}`
  console.log('查看里程碑：', milestoneId)
}

onMounted(() => {
  fetchProjectData()

  // 如果URL中有里程碑ID，自动跳转
  const milestoneId = route.query.milestone
  if (milestoneId) {
    activeSection.value = `milestone-${milestoneId}`
  }
})
</script>

<style scoped>
.enterprise-project-manage {
  min-height: auto;
  background: #f5f7fb;
  padding: 84px 24px 24px 24px; /* 顶部留出固定 Header 的空间（60px + 24px） */
  max-width: 1600px;
  margin: 0 auto;
}

/* 加载状态 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 16px;
  color: #909399;
}

.loading-container .el-icon {
  font-size: 48px;
}

/* 主容器：左右布局 */
.main-container {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

/* 右侧内容区 */
.content-area {
  flex: 1;
  min-width: 0; /* 防止内容溢出 */
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* 响应式 */
@media (max-width: 1200px) {
  .main-container {
    flex-direction: column;
  }
}
</style>
