<template>
  <div class="tracker-container">
    <div class="page-header">
      <h1 class="page-title">项目跟踪</h1>
      <p class="page-subtitle">实时跟踪项目进度</p>
    </div>
    
    <div class="tracker-content">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>项目：{{ projectTitle }}</span>
            <el-tag type="primary">进行中</el-tag>
          </div>
        </template>
        
        <div class="progress-section">
          <div class="progress-info">
            <div class="progress-bar">
              <el-progress :percentage="projectProgress" :stroke-width="12" />
            </div>
            <div class="progress-text">
              当前进度：{{ projectProgress }}%
            </div>
          </div>
          
          <div class="timeline">
            <div class="timeline-item" v-for="milestone in milestones" :key="milestone.id">
              <div class="timeline-marker" :class="{ active: milestone.completed }"></div>
              <div class="timeline-content">
                <div class="timeline-title">{{ milestone.title }}</div>
                <div class="timeline-date">{{ milestone.date }}</div>
                <div class="timeline-status" :class="{ completed: milestone.completed }">
                  {{ milestone.completed ? '已完成' : '进行中' }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const projectTitle = ref('项目名称')
const projectProgress = ref(65)

const milestones = ref([
  { id: 1, title: '需求分析', date: '2024-09-01', completed: true },
  { id: 2, title: 'UI设计', date: '2024-09-15', completed: true },
  { id: 3, title: '前端开发', date: '2024-10-01', completed: true },
  { id: 4, title: '后端开发', date: '2024-10-15', completed: false },
  { id: 5, title: '测试验收', date: '2024-11-01', completed: false }
])

onMounted(() => {
  const projectId = route.params.projectId
  if (projectId) {
    projectTitle.value = `项目 ${projectId}`
  }
})
</script>

<style scoped>
.tracker-container {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;
}

.page-header {
  text-align: center;
  margin-bottom: 30px;
}

.tracker-content {
  max-width: 800px;
  margin: 0 auto;
}

.progress-section {
  padding: 20px 0;
}

.progress-info {
  margin-bottom: 40px;
}

.progress-bar {
  margin-bottom: 15px;
}

.progress-text {
  text-align: center;
  font-size: 16px;
  color: #666;
}

.timeline {
  position: relative;
  padding-left: 30px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 15px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #e4e7ed;
}

.timeline-item {
  position: relative;
  margin-bottom: 30px;
  display: flex;
  align-items: flex-start;
}

.timeline-marker {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #e4e7ed;
  position: absolute;
  left: -36px;
  top: 5px;
}

.timeline-marker.active {
  background: #409eff;
}

.timeline-content {
  flex: 1;
}

.timeline-title {
  font-weight: 600;
  margin-bottom: 5px;
}

.timeline-date {
  color: #999;
  font-size: 12px;
  margin-bottom: 5px;
}

.timeline-status {
  color: #f56c6c;
  font-size: 12px;
}

.timeline-status.completed {
  color: #67c23a;
}
</style>