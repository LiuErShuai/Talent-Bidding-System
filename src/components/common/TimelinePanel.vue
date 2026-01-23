<template>
  <div class="timeline-panel">
    <!-- 审核历史 -->
    <div v-if="reviewHistory && reviewHistory.length > 0" class="review-section">
      <div class="review-list">
        <div
          v-for="review in reviewHistory"
          :key="review.id"
          class="review-card"
        >
              <div class="review-header">
            <div class="review-info">
              <span class="review-target">{{ review.target }}</span>
            </div>
            <span class="review-time">{{ review.time }}</span>
          </div>
          <div class="review-content">
            <div class="reviewer">
              <el-icon><User /></el-icon>
              <span>{{ review.reviewer }}</span>
            </div>
            <p class="review-comment">{{ review.comment }}</p>
            <!-- 评分已移除，保留评分数据但不展示 -->
          </div>
        </div>
      </div>
    </div>

    <!-- 项目动态已移除 -->
  </div>
</template>

<script setup>
import { User } from '@element-plus/icons-vue'

// Props
defineProps({
  reviewHistory: {
    type: Array,
    default: () => []
  }
})

// 获取审核标签类型
function getReviewTagType(action) {
  const typeMap = {
    '通过': 'success',
    '驳回': 'danger',
    '待审核': 'warning'
  }
  return typeMap[action] || 'info'
}

/* 项目动态功能已移除，相关事件处理保留于后台数据中 */
</script>

<style scoped>
.timeline-panel {
  padding: 0;
}

/* 审核历史区域 */
.review-section {
  margin-bottom: 0px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f274b;
  margin-bottom: 16px;
}

.review-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.review-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  border-left: 4px solid #1890ff;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.review-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.review-target {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}

.review-time {
  font-size: 13px;
  color: #909399;
}

.review-content {
  padding-left: 12px;
}

.reviewer {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #606266;
  margin-bottom: 8px;
}

.reviewer .el-icon {
  font-size: 14px;
  color: #909399;
}

.review-comment {
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
  margin: 0 0 12px 0;
  padding: 12px;
  background: #f5f7fb;
  border-radius: 8px;
}

.review-rating {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #606266;
}

/* 时间线区域 */
.timeline-section {
  margin-top: 20px;
}

.timeline-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  margin-bottom: 12px;
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.timeline-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.timeline-description {
  font-size: 13px;
  color: #606266;
  line-height: 1.6;
  margin: 0 0 12px 0;
}

.timeline-footer {
  display: flex;
  align-items: center;
  gap: 16px;
}

.timeline-user {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #909399;
}

.timeline-user .el-icon {
  font-size: 14px;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #909399;
}

.empty-state p {
  margin-top: 16px;
  font-size: 14px;
}

/* Element Plus 时间线样式覆盖 */
:deep(.el-timeline-item__timestamp) {
  font-size: 12px;
  color: #909399;
}

:deep(.el-timeline-item__wrapper) {
  padding-left: 24px;
}

:deep(.el-timeline-item__node--large) {
  width: 16px;
  height: 16px;
  left: -4px;
}

:deep(.el-timeline-item__node--normal) {
  width: 12px;
  height: 12px;
  left: -2px;
}
</style>
