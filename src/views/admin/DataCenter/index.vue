<template>
  <div class="data-page">
    <main class="data-container">
      <div class="stats-grid" v-if="statistics && !loading">
    <!-- 项目状态统计 -->
    <el-card class="stat-card" v-for="(value, key) in statistics.projectStatistics.statusCount" :key="key">
      <template #header>
        <div class="card-header">
          <span>项目状态: {{ key }}</span>
        </div>
      </template>
      <div class="stat-content">
        <div class="stat-item">
          <div class="stat-value">{{ value }}</div>
          <div class="stat-label">数量</div>
        </div>
      </div>
    </el-card>

    <!-- 项目总计 -->
    <el-card class="stat-card">
      <template #header>
        <div class="card-header">
          <span>项目总计</span>
        </div>
      </template>
      <div class="stat-content">
        <div class="stat-item" v-for="(val, name) in statistics.projectStatistics" v-if="['todayCount','weekCount','monthCount','totalCount'].includes(name)" :key="name">
          <div class="stat-value">{{ val }}</div>
          <div class="stat-label">{{ name.replace('Count','') }}项目数</div>
        </div>
      </div>
    </el-card>

    <!-- 用户统计 -->
    <el-card class="stat-card">
      <template #header>
        <div class="card-header">
          <span>用户统计</span>
        </div>
      </template>
      <div class="stat-content">
        <div class="stat-item" v-for="(val, name) in statistics.userStatistics" :key="name">
          <div class="stat-value">{{ val }}</div>
          <div class="stat-label">{{ name.replace('Count','用户') }}</div>
        </div>
      </div>
    </el-card>
  </div>
  <div v-else-if="loading" class="loading">
    正在加载统计数据…
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
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getStatistics } from '@/api/admin'
import { ElMessage } from 'element-plus'

const statistics = ref(null)
const loading = ref(false)

// 获取统计数据
const fetchStatistics = async () => {
  loading.value = true
  try {
    const res = await getStatistics()
    statistics.value = res.data
  } catch (error) {
    ElMessage.error('获取统计数据失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchStatistics()
})
</script>

<style scoped>
.data-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f7fb;
  color: #1f274b;
}

.data-container {
  padding: 24px;
  background: #f5f7fa;
  min-height: calc(100vh - 80px);
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

@media (max-width: 1024px) {
  .header-inner {
    flex-direction: column;
  }

  .main-nav {
    flex-wrap: wrap;
  }
}
</style>
