<template>
  <div class="project-details-container">
    <div class="page-header">
      <h1 class="page-title">{{ project.name }}</h1>
      <p class="page-subtitle">项目详细信息</p>
    </div>
    
    <div class="project-content">
      <el-row :gutter="20">
        <el-col :span="16">
          <el-card>
            <template #header>
              <div class="card-header">
                <span>项目详情</span>
                <el-tag :type="getStatusType(project.status)">{{ project.status }}</el-tag>
              </div>
            </template>
            
            <div class="project-info">
              <div class="info-item">
                <label>项目描述：</label>
                <span>{{ project.description }}</span>
              </div>
              
              <div class="info-item">
                <label>预算：</label>
                <span class="price">¥{{ project.budget }}</span>
              </div>
              
              <div class="info-item">
                <label>截止时间：</label>
                <span>{{ project.deadline }}</span>
              </div>
              
              <div class="info-item">
                <label>技术要求：</label>
                <div class="tech-tags">
                  <el-tag v-for="tech in project.technologies" :key="tech" type="info">{{ tech }}</el-tag>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
        
        <el-col :span="8">
          <el-card>
            <template #header>
              <div class="card-header">
                <span>操作</span>
              </div>
            </template>
            
            <div class="action-buttons">
              <el-button type="primary" size="large" style="width: 100%; margin-bottom: 15px;">
                申请参与
              </el-button>
              <el-button size="large" style="width: 100%;">
                收藏项目
              </el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const project = ref({
  name: '项目名称',
  description: '项目详细描述信息...',
  budget: 10000,
  deadline: '2024-12-31',
  status: '招募中',
  technologies: ['Vue.js', 'Node.js', 'MySQL']
})

const getStatusType = (status) => {
  const types = {
    '招募中': 'success',
    '进行中': 'primary',
    '已完成': 'info'
  }
  return types[status] || 'info'
}

onMounted(() => {
  const projectId = route.params.id
  if (projectId) {
    project.value.name = `项目 ${projectId}`
  }
})
</script>

<style scoped>
.project-details-container {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;
}

.page-header {
  text-align: center;
  margin-bottom: 30px;
}

.project-content {
  max-width: 1200px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.project-info {
  line-height: 2;
}

.info-item {
  margin-bottom: 20px;
  display: flex;
  align-items: flex-start;
}

.info-item label {
  font-weight: 500;
  color: #333;
  min-width: 100px;
}

.price {
  color: #f56c6c;
  font-weight: bold;
  font-size: 18px;
}

.tech-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.action-buttons {
  text-align: center;
}
</style>