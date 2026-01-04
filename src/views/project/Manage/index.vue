<template>
  <div class="project-manage-root">
    <!-- ========== 面包屑导航 ========== -->
    <div class="breadcrumb-section">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/my-projects' }">我的项目</el-breadcrumb-item>
        <el-breadcrumb-item>项目管理（承接方）</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="page-hint">
        <el-icon><InfoFilled /></el-icon>
        <span>承接方管理视图：可查看项目信息、上传成果、查看进度</span>
      </div>
    </div>

    <!-- ========== 项目概览卡片 ========== -->
    <project-overview
      v-if="project"
      :project="project"
      :canEdit="canEditProject"
      @edit="onProjectEdit"
    />

    <!-- ========== 加载状态 ========== -->
    <div v-if="loading" class="loading-container">
      <el-icon class="is-loading"><Loading /></el-icon>
      <span>加载中...</span>
    </div>

    <!-- ========== Tab 切换区域 ========== -->
    <el-tabs v-else-if="project" v-model="activeTab" class="manage-tabs" @tab-change="onTabChange">
      <!-- 概览 Tab -->
      <el-tab-pane label="概览" name="overview">
        <overview-panel
          :project="project"
          :statistics="projectStatistics"
        />
      </el-tab-pane>

      <!-- 里程碑 Tab（核心） -->
      <el-tab-pane label="里程碑" name="milestones">
        <milestone-manage-list
          :milestones="milestones"
          :canEdit="canEditMilestone"
          :canReview="canReview"
          @edit="openMilestoneEdit"
          @delete="deleteMilestone"
          @review="handleMilestoneReview"
        />
      </el-tab-pane>

      <!-- 成果 Tab -->
      <el-tab-pane label="成果" name="outcomes">
        <outcome-panel
          :projectId="projectId"
          :outcomes="outcomes"
          :canUpload="canUploadOutcome"
          @upload="handleOutcomeUpload"
        />
      </el-tab-pane>

      <!-- 团队 Tab -->
      <el-tab-pane label="团队" name="team">
        <team-panel
          :members="project?.members || []"
          :canEdit="canManageTeam"
        />
      </el-tab-pane>

      <!-- 日志 Tab -->
      <el-tab-pane label="日志" name="timeline">
        <timeline-panel
          :events="timelineEvents"
          :reviewHistory="reviewHistory"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Loading, InfoFilled } from '@element-plus/icons-vue'

// 组件导入
import ProjectOverview from '@/components/ProjectOverview.vue'
import MilestoneManageList from '@/components/MilestoneManageList.vue'
import TeamPanel from '@/components/TeamPanel.vue'
import OverviewPanel from '@/components/OverviewPanel.vue'
import OutcomePanel from '@/components/OutcomePanel.vue'
import TimelinePanel from '@/components/TimelinePanel.vue'

const route = useRoute()
const projectId = route.params.id

// ========== 状态定义 ==========
const activeTab = ref('overview') // 默认打开概览 Tab
const loading = ref(true)
const project = ref(null)
const milestones = ref([])
const outcomes = ref([])
const timelineEvents = ref([])
const reviewHistory = ref([])

// 承接方（学生）权限设置
const canEditProject = ref(false) // 不能编辑项目基本信息
const canEditMilestone = ref(false) // 不能编辑/删除里程碑
const canUploadOutcome = ref(true) // 可以上传成果/交付物
const canReview = ref(false) // 不能审核里程碑
const canManageTeam = ref(false) // 不能管理团队

// ========== Mock 数据 ==========
const mockProjectData = {
  id: projectId,
  name: 'AI智能客服系统开发',
  status: 'ongoing',
  statusText: '进行中',
  progress: 60,
  reward: 15000,
  description: '为平台构建基于NLP的智能客服系统，提高客户服务效率和满意度。',
  startDate: '2025-11-01',
  endDate: '2025-12-31',
  category: '人工智能',
  publisher: 'XX科技有限公司',
  members: [
    { id: 1, name: '张三', avatar: 'https://picsum.photos/seed/user1/40/40', role: '项目负责人', skills: ['Python', 'NLP'] },
    { id: 2, name: '李四', avatar: 'https://picsum.photos/seed/user2/40/40', role: '前端开发', skills: ['Vue', 'React'] },
    { id: 3, name: '王五', avatar: 'https://picsum.photos/seed/user3/40/40', role: '后端开发', skills: ['Java', 'Spring'] }
  ]
}

const mockMilestones = [
  {
    id: 1,
    title: '需求分析与方案设计',
    description: '完成项目需求调研，输出详细的技术方案文档',
    status: 'completed',
    statusText: '已完成',
    plannedStartDate: '2025-11-01',
    plannedEndDate: '2025-11-10',
    actualEndDate: '2025-11-09',
    progress: 100,
    deliverableCount: 3
  },
  {
    id: 2,
    title: '原型开发与测试',
    description: '开发系统原型，完成基础功能验证',
    status: 'in-progress',
    statusText: '进行中',
    plannedStartDate: '2025-11-11',
    plannedEndDate: '2025-11-25',
    actualEndDate: null,
    progress: 60,
    deliverableCount: 1
  },
  {
    id: 3,
    title: '系统集成与部署',
    description: '完成系统集成，部署到生产环境',
    status: 'pending',
    statusText: '待开始',
    plannedStartDate: '2025-11-26',
    plannedEndDate: '2025-12-10',
    actualEndDate: null,
    progress: 0,
    deliverableCount: 0
  }
]

const mockOutcomes = [
  {
    id: 1,
    name: '需求分析文档 v1.0',
    type: 'document',
    version: 'v1.0',
    uploadTime: '2025-11-09 14:30',
    uploader: '张三',
    size: '2.3 MB',
    status: 'approved',
    statusText: '已通过'
  },
  {
    id: 2,
    name: '技术方案PPT',
    type: 'document',
    version: 'v1.0',
    uploadTime: '2025-11-09 16:20',
    uploader: '张三',
    size: '5.1 MB',
    status: 'approved',
    statusText: '已通过'
  }
]

const mockTimelineEvents = [
  {
    id: 1,
    time: '2025-11-09 14:30',
    type: 'milestone',
    title: '完成里程碑：需求分析与方案设计',
    description: '张三提交了里程碑成果',
    user: '张三',
    icon: 'success'
  },
  {
    id: 2,
    time: '2025-11-10 09:15',
    type: 'review',
    title: '里程碑审核通过',
    description: '企业方审核通过了"需求分析与方案设计"里程碑',
    user: '企业审核员',
    icon: 'success'
  },
  {
    id: 3,
    time: '2025-11-11 10:00',
    type: 'milestone',
    title: '开始里程碑：原型开发与测试',
    description: '张三开始执行新的里程碑任务',
    user: '张三',
    icon: 'info'
  }
]

const mockReviewHistory = [
  {
    id: 1,
    time: '2025-11-10 09:15',
    reviewer: '企业审核员',
    action: '通过',
    target: '需求分析与方案设计',
    comment: '方案详细，技术路线清晰，同意进入下一阶段。',
    rating: 5
  }
]

// ========== 数据加载 ==========
async function fetchManageData() {
  loading.value = true
  try {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 800))

    // 使用 Mock 数据
    project.value = mockProjectData
    milestones.value = mockMilestones
    outcomes.value = mockOutcomes
    timelineEvents.value = mockTimelineEvents
    reviewHistory.value = mockReviewHistory

    // 承接方（学生）权限：只能查看和上传，不能编辑和审核
    // 注意：这是Mock数据，实际应从后端获取当前用户角色并判断权限
    canEditProject.value = false      // 不能编辑项目信息
    canEditMilestone.value = false    // 不能编辑/删除里程碑
    canUploadOutcome.value = true     // 可以上传成果
    canReview.value = false           // 不能审核
    canManageTeam.value = false       // 不能管理团队
  } catch (error) {
    ElMessage.error('加载项目数据失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchManageData)

// ========== 计算属性：项目统计 ==========
const projectStatistics = computed(() => {
  return {
    totalMilestones: milestones.value.length,
    completedMilestones: milestones.value.filter(m => m.status === 'completed').length,
    inProgressMilestones: milestones.value.filter(m => m.status === 'in-progress').length,
    totalOutcomes: outcomes.value.length,
    teamSize: project.value?.members?.length || 0,
    progress: project.value?.progress || 0,
    completionRate: milestones.value.length > 0
      ? Math.round((milestones.value.filter(m => m.status === 'completed').length / milestones.value.length) * 100)
      : 0
  }
})

// ========== 事件处理 ==========
function onTabChange(tabName) {
  console.log('切换到 Tab:', tabName)
}

function onProjectEdit(payload) {
  // 承接方不应该能编辑项目，这个函数理论上不会被调用
  console.log('编辑项目（承接方无权限）:', payload)
  ElMessage.error('承接方无权编辑项目信息')
}

// ========== 里程碑管理 ==========
function openMilestoneEdit(milestone) {
  // 承接方不能编辑里程碑，这个函数理论上不会被调用
  console.log('编辑里程碑（承接方无权限）:', milestone)
  ElMessage.error('承接方无权编辑里程碑')
}

function deleteMilestone(milestoneId) {
  // 承接方不能删除里程碑，这个函数理论上不会被调用
  console.log('删除里程碑（承接方无权限）:', milestoneId)
  ElMessage.error('承接方无权删除里程碑')
}

function handleMilestoneReview(payload) {
  // 承接方不能审核里程碑，这个函数理论上不会被调用
  console.log('审核里程碑（承接方无权限）:', payload)
  ElMessage.error('承接方无权审核里程碑')
}

// ========== 成果管理 ==========
function handleOutcomeUpload(payload) {
  console.log('上传成果:', payload)
  ElMessage.success('成果上传成功（Mock）')
  // 模拟添加新成果
  outcomes.value.push({
    id: outcomes.value.length + 1,
    name: payload.name || '新成果文件',
    type: 'document',
    version: `v${outcomes.value.length + 1}.0`,
    uploadTime: new Date().toLocaleString('zh-CN'),
    uploader: '张三',
    size: '1.5 MB',
    status: 'pending',
    statusText: '待审核'
  })
}
</script>

<style scoped>
.project-manage-root {
  min-height: calc(100vh - 80px);
  background: #f5f7fb;
  padding: 24px;
  max-width: 70%;
  margin: 0 auto;
}

/* 面包屑导航 */
.breadcrumb-section {
  margin-bottom: 20px;
  padding: 12px 16px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(15, 39, 106, 0.06);
}

.breadcrumb-section :deep(.el-breadcrumb__inner) {
  color: #606266;
  font-weight: 400;
}

.breadcrumb-section :deep(.el-breadcrumb__inner:hover) {
  color: #1890ff;
}

.page-hint {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  padding: 8px 12px;
  background: #e6f7ff;
  border-left: 3px solid #1890ff;
  border-radius: 4px;
  font-size: 13px;
  color: #0050b3;
}

.page-hint .el-icon {
  font-size: 16px;
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

/* Tab 切换样式 */
.manage-tabs {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(15, 39, 106, 0.06);
  padding: 20px;
  margin-top: 20px;
}

.manage-tabs :deep(.el-tabs__header) {
  margin-bottom: 20px;
}

.manage-tabs :deep(.el-tabs__item) {
  font-size: 15px;
  font-weight: 500;
  padding: 0 20px;
  height: 44px;
  line-height: 44px;
}

.manage-tabs :deep(.el-tabs__item.is-active) {
  color: #1890ff;
}

.manage-tabs :deep(.el-tabs__active-bar) {
  background-color: #1890ff;
}

.manage-tabs :deep(.el-tabs__content) {
  min-height: 400px;
}
</style>
