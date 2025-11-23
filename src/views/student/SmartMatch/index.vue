<template>
  <div class="smart-match-container">
    <div class="page-header">
      <h1 class="page-title">智能匹配</h1>
      <p class="page-subtitle">根据您的技能推荐合适的项目</p>
    </div>
    
    <div class="match-content">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-card>
            <template #header>
              <div class="card-header">
                <span>我的技能</span>
              </div>
            </template>
            
            <div class="skills-section">
              <div class="skill-item" v-for="skill in userSkills" :key="skill.id">
                <div class="skill-name">{{ skill.name }}</div>
                <el-progress :percentage="skill.level" :stroke-width="8" />
              </div>
            </div>
            
            <el-button type="primary" style="width: 100%; margin-top: 20px;">更新技能</el-button>
          </el-card>
        </el-col>
        
        <el-col :span="16">
          <el-card>
            <template #header>
              <div class="card-header">
                <span>推荐项目</span>
                <span class="match-rate">匹配度：85%</span>
              </div>
            </template>
            
            <el-table :data="matchedProjects" style="width: 100%">
              <el-table-column prop="name" label="项目名称" />
              <el-table-column prop="matchRate" label="匹配度" />
              <el-table-column prop="budget" label="预算" />
              <el-table-column label="操作">
                <template #default>
                  <el-button type="text">查看详情</el-button>
                  <el-button type="text">立即申请</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const userSkills = ref([
  { id: 1, name: 'Vue.js', level: 85 },
  { id: 2, name: 'Node.js', level: 70 },
  { id: 3, name: 'JavaScript', level: 90 },
  { id: 4, name: 'CSS', level: 80 }
])

const matchedProjects = ref([
  { id: 1, name: '前端开发项目', matchRate: '95%', budget: '¥15,000' },
  { id: 2, name: '全栈应用开发', matchRate: '85%', budget: '¥20,000' },
  { id: 3, name: '响应式网站开发', matchRate: '78%', budget: '¥12,000' }
])
</script>

<style scoped>
.smart-match-container {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;
}

.page-header {
  text-align: center;
  margin-bottom: 30px;
}

.match-content {
  max-width: 1200px;
  margin: 0 auto;
}

.skills-section {
  margin-bottom: 20px;
}

.skill-item {
  margin-bottom: 15px;
}

.skill-name {
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.match-rate {
  color: #67c23a;
  font-weight: bold;
}
</style>