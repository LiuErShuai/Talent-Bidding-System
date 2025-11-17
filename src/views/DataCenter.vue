<template>
  <div class="data-container">
    <div class="page-header">
      <h1 class="page-title">数据中心</h1>
      <p class="page-subtitle">系统数据统计与分析</p>
    </div>
    
    <div class="stats-grid">
      <el-card class="stat-card">
        <template #header>
          <div class="card-header">
            <span>项目统计</span>
          </div>
        </template>
        <div class="stat-content">
          <div class="stat-item">
            <div class="stat-value">156</div>
            <div class="stat-label">进行中</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">89</div>
            <div class="stat-label">已完成</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">23</div>
            <div class="stat-label">待审核</div>
          </div>
        </div>
      </el-card>
      
      <el-card class="stat-card">
        <template #header>
          <div class="card-header">
            <span>用户统计</span>
          </div>
        </template>
        <div class="stat-content">
          <div class="stat-item">
            <div class="stat-value">1,234</div>
            <div class="stat-label">总用户数</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">567</div>
            <div class="stat-label">活跃用户</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">89</div>
            <div class="stat-label">企业用户</div>
          </div>
        </div>
      </el-card>
    </div>
    
    <div class="charts-section">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>项目类型分布</span>
          </div>
        </template>
        <div class="chart-placeholder">
          <p>图表区域 - 项目类型分布图</p>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 统计数据
const stats = ref({
  projects: 245,
  users: 1234,
  activeUsers: 567,
  companies: 89
})
</script>

<style scoped>
.data-container {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;
}

.page-header {
  text-align: center;
  margin-bottom: 30px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  text-align: center;
}

.card-header {
  font-weight: 600;
  color: #333;
}

.stat-content {
  display: flex;
  justify-content: space-around;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #1890ff;
  margin-bottom: 8px;
}

.stat-label {
  color: #666;
  font-size: 14px;
}

.charts-section {
  margin-bottom: 30px;
}

.chart-placeholder {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border-radius: 4px;
  color: #999;
}
</style>