<template>
  <div class="project-hall-container">
    <div class="page-header">
      <h1 class="page-title">项目大厅</h1>
      <p class="page-subtitle">发现适合您的项目机会</p>
    </div>
    
    <div class="filter-section">
      <el-input v-model="searchKeyword" placeholder="搜索项目..." style="width: 300px; margin-right: 15px;" />
      <el-select v-model="filterStatus" placeholder="项目状态" style="width: 150px; margin-right: 15px;">
        <el-option label="全部" value=""></el-option>
        <el-option label="招募中" value="recruiting"></el-option>
        <el-option label="进行中" value="in-progress"></el-option>
        <el-option label="已完成" value="completed"></el-option>
      </el-select>
      <el-button type="primary">搜索</el-button>
    </div>
    
    <div class="projects-grid">
      <el-card v-for="project in filteredProjects" :key="project.id" class="project-card">
        <template #header>
          <div class="card-header">
            <span class="project-name">{{ project.name }}</span>
            <el-tag :type="getStatusType(project.status)">{{ project.status }}</el-tag>
          </div>
        </template>
        
        <div class="project-info">
          <p class="project-description">{{ project.description }}</p>
          
          <div class="project-meta">
            <span class="budget">¥{{ project.budget }}</span>
            <span class="deadline">{{ project.deadline }}</span>
          </div>
          
          <div class="tech-tags">
            <el-tag v-for="tech in project.technologies" :key="tech" type="info" size="small">{{ tech }}</el-tag>
          </div>
        </div>
        
        <template #footer>
          <el-button type="primary" style="width: 100%;">查看详情</el-button>
        </template>
      </el-card>
    </div>
    
    <div class="pagination-section">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :total="totalProjects"
        layout="prev, pager, next"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const searchKeyword = ref('')
const filterStatus = ref('')
const currentPage = ref(1)
const pageSize = ref(12)

const projects = ref([
  { id: 1, name: '电商平台开发', description: '基于Vue.js和Node.js的电商平台开发', budget: 15000, deadline: '2024-12-31', status: 'recruiting', technologies: ['Vue.js', 'Node.js', 'MySQL'] },
  { id: 2, name: '数据分析系统', description: '大数据分析平台开发', budget: 20000, deadline: '2024-11-30', status: 'in-progress', technologies: ['Python', 'Spark', 'Hadoop'] },
  { id: 3, name: '移动应用开发', description: '跨平台移动应用开发', budget: 12000, deadline: '2024-10-15', status: 'completed', technologies: ['React Native', 'Node.js'] }
])

const filteredProjects = computed(() => {
  return projects.value.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchKeyword.value.toLowerCase())
    const matchesStatus = !filterStatus.value || project.status === filterStatus.value
    return matchesSearch && matchesStatus
  })
})

const totalProjects = computed(() => filteredProjects.value.length)

const getStatusType = (status) => {
  const types = {
    'recruiting': 'success',
    'in-progress': 'primary',
    'completed': 'info'
  }
  return types[status] || 'info'
}
</script>

<style scoped>
.project-hall-container {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;
}

.page-header {
  text-align: center;
  margin-bottom: 30px;
}

.filter-section {
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.project-card {
  transition: transform 0.3s ease;
}

.project-card:hover {
  transform: translateY(-5px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.project-name {
  font-weight: 600;
  font-size: 16px;
}

.project-description {
  color: #666;
  margin-bottom: 15px;
  line-height: 1.5;
}

.project-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.budget {
  color: #f56c6c;
  font-weight: bold;
  font-size: 16px;
}

.deadline {
  color: #999;
  font-size: 14px;
}

.tech-tags {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}

.pagination-section {
  display: flex;
  justify-content: center;
}
</style>