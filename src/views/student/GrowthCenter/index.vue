<template>
  <div class="growth-container">
    <div class="page-header">
      <h1 class="page-title">成长中心</h1>
      <p class="page-subtitle">技能提升与职业发展</p>
    </div>
    
    <div class="growth-content">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-card class="growth-card">
            <template #header>
              <div class="card-header">
                <span>技能树</span>
              </div>
            </template>
            <div class="skill-tree">
              <div class="skill-item" v-for="skill in skills" :key="skill.id">
                <div class="skill-name">{{ skill.name }}</div>
                <el-progress :percentage="skill.level" :stroke-width="8" />
              </div>
            </div>
          </el-card>
        </el-col>
        
        <el-col :span="16">
          <el-card class="growth-card">
            <template #header>
              <div class="card-header">
                <span>学习资源</span>
              </div>
            </template>
            <div class="learning-resources">
              <el-table :data="resources" style="width: 100%">
                <el-table-column prop="name" label="资源名称" />
                <el-table-column prop="type" label="类型" />
                <el-table-column prop="difficulty" label="难度" />
                <el-table-column label="操作">
                  <template #default>
                    <el-button type="text">开始学习</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const skills = ref([
  { id: 1, name: '前端开发', level: 75 },
  { id: 2, name: '后端开发', level: 60 },
  { id: 3, name: 'UI设计', level: 45 },
  { id: 4, name: '项目管理', level: 70 }
])

const resources = ref([
  { id: 1, name: 'Vue.js实战教程', type: '视频课程', difficulty: '中级' },
  { id: 2, name: 'Node.js最佳实践', type: '文档', difficulty: '高级' },
  { id: 3, name: 'UI设计规范', type: '图文', difficulty: '初级' }
])
</script>

<style scoped>
.growth-container {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;
}

.page-header {
  text-align: center;
  margin-bottom: 30px;
}

.growth-content {
  max-width: 1200px;
  margin: 0 auto;
}

.growth-card {
  margin-bottom: 20px;
}

.skill-item {
  margin-bottom: 20px;
}

.skill-name {
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}
</style>