<template>
  <el-card class="project-overview-card">
    <!-- 项目主要信息区 -->
    <div class="overview-main">
      <!-- 左侧信息区 -->
      <div class="overview-left">
        <!-- 标题行：标题 + 状态标签 -->
        <div class="title-row">
          <h2 class="project-title">{{ project?.name || '项目名称' }}</h2>
          <div v-if="project?.status" class="status-indicator" :class="`status-${normalizedStatus}`">
            <span class="status-dot"></span>
            <span class="status-text">{{ statusText }}</span>
          </div>
        </div>

        <!-- 元信息行 -->
        <div class="meta-row">
          <span class="meta-item">
            发布方：
            <span class="publisher-link" @click="handlePublisherClick">
              {{ project?.publisher || '--' }}
            </span>
          </span>
          <span class="meta-sep">|</span>
          <span class="meta-item">领域：{{ project?.category || '--' }}</span>
          <span class="meta-sep">|</span>
          <span class="meta-item">截止：{{ formatEndDate(project?.endDate) }}</span>
          <span class="meta-sep">|</span>
          <span class="meta-item">项目团队：{{ formatTeamName(project?.teamName) }}</span>
        </div>

        <!-- 项目描述（后端当前版本未提供简要描述，暂时注释） -->
        <!--
        <div class="project-description">
          <p class="brief">{{ project?.description || project?.brief }}</p>
        </div>
        -->
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
import { useRouter } from 'vue-router'
import {
  normalizeProjectStatus,
  getProjectStatusText
} from '@/utils/status'

const props = defineProps({
  project: { type: Object, default: () => ({}) },
  canEdit: { type: Boolean, default: false }
})

const router = useRouter()

const normalizedStatus = computed(() => normalizeProjectStatus(props.project?.status))

const statusText = computed(() => {
  return getProjectStatusText(props.project?.status)
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

// 格式化团队名称
const formatTeamName = (teamName) => {
  return teamName || '--'
}

// 处理发布方点击事件
const handlePublisherClick = () => {
  if (!props.project?.publisherId) {
    console.warn('发布方ID不存在')
    return
  }

  // 跳转到企业主页
  router.push({
    path: `/enterprise/profile/${props.project.publisherId}`
  })
}
</script>

<style scoped>
.project-overview-card {
  padding: 6px;
  background: #fff;
  border-radius: 0px;
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
  font-size: 25px;
  font-weight: 600;
  color: #1f2937;
  flex: 1;
  min-width: 0;
}

/* 状态指示器 */
.status-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

/* 待开始状态 */
.status-pending {
  background: #f3f4f6;
  color: #6b7280;
}

.status-pending .status-dot {
  background: #9ca3af;
  box-shadow: 0 0 0 3px rgba(156, 163, 175, 0.2);
}

.status-draft {
  background: #f4f4f5;
  color: #606266;
}

.status-draft .status-dot {
  background: #909399;
  box-shadow: 0 0 0 3px rgba(144, 147, 153, 0.2);
}

.status-pending_review {
  background: #fdf6ec;
  color: #e6a23c;
}

.status-pending_review .status-dot {
  background: #e6a23c;
  box-shadow: 0 0 0 3px rgba(230, 162, 60, 0.2);
}

/* 进行中状态 */
.status-in-progress {
  background: #eff6ff;
  color: #1890ff;
}

.status-in-progress .status-dot {
  background: #1890ff;
  box-shadow: 0 0 0 3px rgba(24, 144, 255, 0.2);
}

.status-published {
  background: #ecf5ff;
  color: #409eff;
}

.status-published .status-dot {
  background: #409eff;
  box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.2);
}

.status-in_progress {
  background: #f0f9eb;
  color: #67c23a;
}

.status-in_progress .status-dot {
  background: #67c23a;
  box-shadow: 0 0 0 3px rgba(103, 194, 58, 0.2);
}

/* 已完成状态 */
.status-completed {
  background: #f0fdf4;
  color: #52c41a;
}

.status-completed .status-dot {
  background: #52c41a;
  box-shadow: 0 0 0 3px rgba(82, 196, 26, 0.2);
}

.status-rejected {
  background: #fef0f0;
  color: #f56c6c;
}

.status-rejected .status-dot {
  background: #f56c6c;
  box-shadow: 0 0 0 3px rgba(245, 108, 108, 0.2);
}

.status-closed {
  background: #f4f4f5;
  color: #909399;
}

.status-closed .status-dot {
  background: #909399;
  box-shadow: 0 0 0 3px rgba(144, 147, 153, 0.2);
}

/* 脉动动画 */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
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

/* 发布方链接样式 */
.publisher-link {
  color: #1e40af;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  border-bottom: 1px solid transparent;
}

.publisher-link:hover {
  color: #1e3a8a;
  border-bottom-color: #1e3a8a;
}


/* 项目描述区域 */
.project-description {
  margin-top: 8px;
  padding: 10px;
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

