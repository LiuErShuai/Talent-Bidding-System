<template>
  <div class="overview-panel">
    <!-- 统计卡片区 -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
          <el-icon><Checked /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ statistics.completedMilestones }}/{{ statistics.totalMilestones }}</div>
          <div class="stat-label">已完成里程碑</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
          <el-icon><Loading /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ statistics.inProgressMilestones }}</div>
          <div class="stat-label">进行中的里程碑</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
          <el-icon><Document /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ statistics.totalOutcomes }}</div>
          <div class="stat-label">提交成果数</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);">
          <el-icon><User /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ statistics.teamSize }}</div>
          <div class="stat-label">团队成员</div>
        </div>
      </div>
    </div>

    <!-- 项目进度 -->
    <div class="progress-section">
      <h3 class="section-title">项目整体进度</h3>
      <div class="progress-card">
        <div class="progress-header">
          <span class="progress-label">完成度</span>
          <span class="progress-percent">{{ statistics.progress }}%</span>
        </div>
        <el-progress
          :percentage="statistics.progress"
          :stroke-width="12"
          :show-text="false"
          :color="getProgressColor(statistics.progress)"
        />
        <div class="progress-info">
          <span>里程碑完成率：{{ statistics.completionRate }}%</span>
          <span>{{ statistics.completedMilestones }}/{{ statistics.totalMilestones }} 个里程碑已完成</span>
        </div>
      </div>
    </div>

    <!-- 项目详细信息 -->
    <div class="project-detail-section">
      <h3 class="section-title">项目详细信息</h3>
      <div class="detail-grid">
        <div class="detail-item">
          <span class="detail-label">项目名称</span>
          <span class="detail-value">{{ project.name }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">项目状态</span>
          <el-tag :type="getStatusType(project.status)">{{ project.statusText }}</el-tag>
        </div>
        <div class="detail-item">
          <span class="detail-label">项目分类</span>
          <span class="detail-value">{{ project.category }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">悬赏金额</span>
          <span class="detail-value reward">￥{{ project.reward?.toLocaleString() }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">开始时间</span>
          <span class="detail-value">{{ project.startDate }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">截止时间</span>
          <span class="detail-value">{{ project.endDate }}</span>
        </div>
        <div class="detail-item full-width">
          <span class="detail-label">项目描述</span>
          <span class="detail-value">{{ project.description }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Checked, Loading, Document, User } from '@element-plus/icons-vue'

// Props
defineProps({
  project: {
    type: Object,
    required: true
  },
  statistics: {
    type: Object,
    required: true
  }
})

// 获取进度条颜色
function getProgressColor(percentage) {
  if (percentage < 30) return '#f56c6c'
  if (percentage < 70) return '#e6a23c'
  return '#67c23a'
}

// 获取状态标签类型
function getStatusType(status) {
  const typeMap = {
    'ongoing': 'primary',
    'completed': 'success',
    'pending': 'info',
    'cancelled': 'danger'
  }
  return typeMap[status] || 'info'
}
</script>

<style scoped>
.overview-panel {
  padding: 20px 0;
}

/* 统计卡片网格 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s, box-shadow 0.3s;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 24px;
  flex-shrink: 0;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #1f274b;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 13px;
  color: #7b859f;
}

/* 进度区域 */
.progress-section {
  margin-bottom: 30px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f274b;
  margin-bottom: 16px;
}

.progress-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.progress-label {
  font-size: 14px;
  color: #606266;
}

.progress-percent {
  font-size: 20px;
  font-weight: 700;
  color: #1890ff;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
  font-size: 13px;
  color: #909399;
}

/* 详细信息区域 */
.project-detail-section {
  margin-bottom: 20px;
}

.detail-grid {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-item.full-width {
  grid-column: 1 / -1;
}

.detail-label {
  font-size: 13px;
  color: #909399;
}

.detail-value {
  font-size: 14px;
  color: #303133;
  font-weight: 500;
}

.detail-value.reward {
  font-size: 18px;
  color: #f56c6c;
  font-weight: 700;
}

/* 响应式 */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }
}
</style>
