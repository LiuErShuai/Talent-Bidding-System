<template>
  <el-card class="project-overview-card">
    <!-- 项目主要信息区 -->
    <div class="overview-main">
      <!-- 左侧信息区 -->
      <div class="overview-left">
        <!-- 标题行：仅标题 -->
        <div class="title-row">
          <h2 class="project-title">{{ project?.name || '项目名称' }}</h2>
        </div>

        <!-- 元信息行 -->
        <div class="meta-row">
          <span class="meta-item">发布方：{{ project?.publisher || '--' }}</span>
          <span class="meta-sep">|</span>
          <span class="meta-item">领域：{{ project?.category || '--' }}</span>
          <span class="meta-sep">|</span>
          <span class="meta-item">截止：{{ formatEndDate(project?.endDate) }}</span>
          <span class="meta-sep">|</span>
          <span class="meta-item reward-small">奖金：￥{{ project?.reward?.toLocaleString() || '--' }}</span>
        </div>

        <!-- 项目描述 -->
        <div class="project-description">
          <p class="brief">{{ project?.description || project?.brief }}</p>
        </div>
      </div>

      <!-- 右侧操作区 -->
      <div class="overview-right">
        <div v-if="canEdit" class="action-buttons">
          <el-button type="primary" size="small" @click="$emit('edit', project)">编辑项目</el-button>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script setup>
import { defineProps, computed } from 'vue'

const props = defineProps({
  project: { type: Object, default: () => ({}) },
  canEdit: { type: Boolean, default: false }
})

// 格式化截止日期
const formatEndDate = (endDate) => {
  if (!endDate) return '--'

  try {
    const date = new Date(endDate)
    const now = new Date()
    const diffTime = date - now
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      return '已截止'
    } else if (diffDays === 0) {
      return '今天截止'
    } else if (diffDays === 1) {
      return '明天截止'
    } else if (diffDays <= 7) {
      return `${diffDays}天后截止`
    } else {
      return `${date.getMonth() + 1}月${date.getDate()}日截止`
    }
  } catch {
    return endDate
  }
}
</script>

<style scoped>
.project-overview-card {
  padding: 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.project-overview-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

/* 主要内容区 */
.overview-main {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
}

/* 左侧信息区 */
.overview-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

/* 标题行 */
.title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.project-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  flex: 1;
  min-width: 0;
}

/* 元信息行 */
.meta-row {
  font-size: 13px;
  color: #7b859f;
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
}

.meta-item {
  white-space: nowrap;
}

.meta-sep {
  color: #d1d5db;
  margin: 0 4px;
}

.reward-small {
  font-weight: 600;
  color: #f59e0b;
}

/* 项目描述区域 */
.project-description {
  margin-top: 12px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
  border-left: 3px solid #e5e7eb;
}

.brief {
  margin: 0;
  color: #374151;
  line-height: 1.6;
  font-size: 14px;
  font-weight: 400;
}

/* 右侧操作区 */
.overview-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 16px;
}


/* 操作按钮 */
.action-buttons {
  display: flex;
  gap: 8px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .overview-main {
    flex-direction: column;
    gap: 16px;
  }

  .overview-right {
    width: 100%;
    align-items: flex-start;
  }

  .title-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .meta-row {
    flex-wrap: wrap;
    gap: 2px;
  }

  .progress-bar {
    width: 80px;
  }
}
</style>



