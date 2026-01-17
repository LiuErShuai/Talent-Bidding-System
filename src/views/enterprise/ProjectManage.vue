<template>
  <div class="enterprise-project-manage">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator=">" class="breadcrumb-nav">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/enterprise/my-projects' }">我的项目</el-breadcrumb-item>
      <el-breadcrumb-item>项目管理</el-breadcrumb-item>
    </el-breadcrumb>

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
import ProjectSidebar from '@/components/enterprise/ProjectSidebar.vue'
import BiddingBasicInfo from '@/components/enterprise/BiddingBasicInfo.vue'
import BiddingManagement from '@/components/enterprise/BiddingManagement.vue'
import MilestoneDetail from '@/components/enterprise/MilestoneDetail.vue'
import HistoryRecords from '@/components/enterprise/HistoryRecords.vue'

// Mock 数据导入
import { mockProjectManageData } from '@/mock/projectManage'

const route = useRoute()
const projectId = route.params.id

// 状态定义
const loading = ref(true)
const project = ref(null)
const milestones = ref([])
const activeSection = ref('basic') // 默认显示基本信息

// 当前选中的里程碑
const currentMilestone = computed(() => {
  if (!activeSection.value.startsWith('milestone-')) return null
  const milestoneId = activeSection.value.replace('milestone-', '')
  return milestones.value.find(m => m.id === milestoneId)
})

// 数据加载
async function fetchProjectData() {
  loading.value = true
  try {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 800))

    // 使用 Mock 数据
    const data = mockProjectManageData
    project.value = data.project
    milestones.value = data.milestones

    console.log('企业方项目数据加载成功：', {
      项目名称: project.value.name,
      里程碑数量: milestones.value.length
    })
  } catch (error) {
    ElMessage.error('加载项目数据失败')
    console.error(error)
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
  min-height: calc(100vh - 90px);
  background: #f5f7fb;
  padding: 24px;
  max-width: 1600px;
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
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* 响应式 */
@media (max-width: 1200px) {
  .main-container {
    flex-direction: column;
  }
}
</style>
