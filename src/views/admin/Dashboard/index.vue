<template>
  <div class="dashboard">
    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stat-row">
      <el-col :span="6" v-for="item in statCards" :key="item.label">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-card__icon" :style="{ background: item.color }">
            <el-icon :size="28"><component :is="item.icon" /></el-icon>
          </div>
          <div class="stat-card__info">
            <div class="stat-card__value">{{ item.value }}</div>
            <div class="stat-card__label">{{ item.label }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 快捷入口 -->
    <el-card class="quick-entry" shadow="never">
      <template #header>
        <span class="card-title">快捷入口</span>
      </template>
      <el-row :gutter="16">
        <el-col :span="6" v-for="entry in quickEntries" :key="entry.path">
          <div class="entry-item" @click="$router.push(entry.path)">
            <el-icon :size="24" :color="entry.color"><component :is="entry.icon" /></el-icon>
            <span>{{ entry.label }}</span>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Document, OfficeBuilding, Promotion, Grid } from '@element-plus/icons-vue'
import { getAdminPendingProjectsAPI, getAdminPendingEnterprisesAPI } from '@/api/project'
import { getAllCategoriesAPI } from '@/api/project'

// 统计数据
const pendingProjects = ref(0)
const pendingEnterprises = ref(0)
const publishedProjects = ref(0)
const categoryCount = ref(0)

// 统计卡片配置
const statCards = ref([
  { label: '待审核项目', value: 0, icon: 'Document', color: '#409eff' },
  { label: '待审核企业', value: 0, icon: 'OfficeBuilding', color: '#e6a23c' },
  { label: '已发布项目', value: 0, icon: 'Promotion', color: '#67c23a' },
  { label: '项目分类数', value: 0, icon: 'Grid', color: '#909399' }
])

// 快捷入口
const quickEntries = [
  { label: '项目审核', path: '/admin/project-review', icon: 'Document', color: '#409eff' },
  { label: '企业审核', path: '/admin/enterprise-review', icon: 'OfficeBuilding', color: '#e6a23c' },
  { label: '分类管理', path: '/admin/category-management', icon: 'Grid', color: '#67c23a' },
  { label: '数据中心', path: '/admin/statistics', icon: 'DataAnalysis', color: '#909399' }
]

// 加载统计数据
const loadStats = async () => {
  try {
    const [projRes, entRes, catRes] = await Promise.allSettled([
      getAdminPendingProjectsAPI({ page: 1, pageSize: 1 }),
      getAdminPendingEnterprisesAPI({ page: 1, pageSize: 1 }),
      getAllCategoriesAPI()
    ])

    if (projRes.status === 'fulfilled' && projRes.value?.data) {
      const d = projRes.value.data
      statCards.value[0].value = d.total || d.data?.length || 0
    }
    if (entRes.status === 'fulfilled' && entRes.value?.data) {
      const d = entRes.value.data
      statCards.value[1].value = d.total || d.data?.length || 0
    }
    if (catRes.status === 'fulfilled' && catRes.value?.data) {
      const d = catRes.value.data
      const list = Array.isArray(d) ? d : d.data || d.list || []
      statCards.value[3].value = list.length
    }
  } catch (e) {
    console.error('加载统计数据失败:', e)
  }
}

onMounted(loadStats)
</script>

<style scoped>
.dashboard {
  max-width: 1200px;
}

.stat-row {
  margin-bottom: 20px;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 0;
}

.stat-card :deep(.el-card__body) {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  width: 100%;
}

.stat-card__icon {
  width: 56px;
  height: 56px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
}

.stat-card__value {
  font-size: 28px;
  font-weight: 700;
  color: #303133;
  line-height: 1.2;
}

.stat-card__label {
  font-size: 13px;
  color: #909399;
  margin-top: 4px;
}

.card-title {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}

.entry-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
  font-size: 14px;
  color: #606266;
}

.entry-item:hover {
  background: #f5f7fa;
}
</style>
