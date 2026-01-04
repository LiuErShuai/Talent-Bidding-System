<template>
  <div class="submission-item" :class="statusClass">
    <div class="submission-header">
      <div class="submission-info">
        <el-icon class="file-icon"><Document /></el-icon>
        <span class="submission-name">{{ submission.fileName }}</span>
        <el-tag :type="statusTagType" size="small">{{ statusText }}</el-tag>
      </div>
      <span class="submission-version">v{{ submission.version }}</span>
    </div>

    <div class="submission-meta">
      <span class="meta-item">
        <el-icon><Upload /></el-icon>
        上传: {{ submission.uploadTime }}
      </span>
      <span v-if="submission.reviewResult" class="meta-item">
        <el-icon><Checked /></el-icon>
        审核: {{ submission.reviewResult.reviewTime }}
      </span>
      <span class="meta-item">
        <el-icon><Box /></el-icon>
        {{ submission.fileSize }}
      </span>
    </div>

    <div v-if="submission.versionNote" class="submission-note">
      <el-icon><EditPen /></el-icon>
      <span>{{ submission.versionNote }}</span>
    </div>

    <div v-if="submission.reviewResult" class="submission-review">
      <el-alert
        :type="submission.status === 'approved' ? 'success' : 'warning'"
        :closable="false"
        show-icon
      >
        <template #title>
          <strong>{{ submission.reviewResult.reviewer }}</strong>
        </template>
        <p>{{ submission.reviewResult.comment }}</p>
        <div v-if="submission.reviewResult.rating" class="review-rating">
          <span>评分：</span>
          <el-rate v-model="submission.reviewResult.rating" disabled size="small" />
        </div>
      </el-alert>
    </div>

    <div class="submission-actions">
      <el-button link type="primary" @click="$emit('view', submission)">
        <el-icon><View /></el-icon>
        查看详情
      </el-button>
      <el-button link type="primary" @click="$emit('download', submission)">
        <el-icon><Download /></el-icon>
        下载
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  Document,
  Upload,
  Checked,
  Box,
  EditPen,
  View,
  Download
} from '@element-plus/icons-vue'

const props = defineProps({
  submission: {
    type: Object,
    required: true
  }
})

defineEmits(['view', 'download'])

// 根据状态确定卡片样式类
const statusClass = computed(() => {
  return `submission-${props.submission.status}`
})

// 状态文本
const statusText = computed(() => {
  const map = {
    'approved': '已通过',
    'pending': '待审核',
    'rejected': '被驳回'
  }
  return map[props.submission.status] || props.submission.status
})

// 状态标签类型
const statusTagType = computed(() => {
  const map = {
    'approved': 'success',
    'pending': 'warning',
    'rejected': 'danger'
  }
  return map[props.submission.status] || 'info'
})
</script>

<style scoped>
.submission-item {
  background: #f5f7fb;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  border-left: 4px solid #e4e7ed;
  transition: all 0.3s;
}

.submission-item:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.submission-approved {
  background: #f6ffed;
  border-left-color: #52c41a;
}

.submission-pending {
  background: #fffbe6;
  border-left-color: #faad14;
}

.submission-rejected {
  background: #fff1f0;
  border-left-color: #ff4d4f;
}

.submission-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.submission-info {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.file-icon {
  font-size: 18px;
  color: #1890ff;
}

.submission-name {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 300px;
}

.submission-version {
  font-size: 13px;
  color: #909399;
  font-weight: 500;
  padding: 2px 8px;
  background: #fff;
  border-radius: 4px;
}

.submission-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 8px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #606266;
}

.meta-item .el-icon {
  font-size: 14px;
  color: #909399;
}

.submission-note {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  font-size: 13px;
  color: #606266;
  padding: 8px 12px;
  background: #fff;
  border-radius: 6px;
  margin-bottom: 12px;
  line-height: 1.6;
}

.submission-note .el-icon {
  font-size: 14px;
  color: #1890ff;
  margin-top: 2px;
  flex-shrink: 0;
}

.submission-review {
  margin-bottom: 12px;
}

.submission-review :deep(.el-alert__content) {
  padding: 0;
}

.submission-review p {
  margin: 8px 0;
  font-size: 13px;
  line-height: 1.6;
}

.review-rating {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  font-size: 13px;
}

.submission-actions {
  display: flex;
  gap: 12px;
  padding-top: 8px;
  border-top: 1px dashed #e4e7ed;
}

.submission-actions .el-button {
  padding: 4px 8px;
  font-size: 13px;
}

/* 响应式 */
@media (max-width: 768px) {
  .submission-meta {
    flex-direction: column;
    gap: 8px;
  }

  .submission-name {
    max-width: 200px;
  }

  .submission-actions {
    flex-direction: column;
    gap: 4px;
  }
}
</style>
