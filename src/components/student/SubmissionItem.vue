<template>
  <div class="submission-item">
    <div class="submission-info">
      <el-icon class="file-icon"><Document /></el-icon>
      <span class="submission-name">{{ submission.fileName }}</span>
      <span class="submission-meta-inline">
        <span>{{ submission.uploadTime }}</span>
        <span>{{ submission.fileSize }}</span>
      </span>
      <el-icon class="download-icon" @click="$emit('download', submission)"><Download /></el-icon>
    </div>
    <div v-if="submission.description" class="submission-description">
      {{ submission.description }}
    </div>
  </div>
</template>

<script setup>
import { Document, Download } from '@element-plus/icons-vue'

const props = defineProps({
  submission: {
    type: Object,
    required: true
  }
})

defineEmits(['view', 'download'])
</script>

<style scoped>
.submission-item {
  padding: 12px 16px;
  border-bottom: 1px dashed #9ca3af;
}

.submission-item:last-child {
  border-bottom: none;
  padding-bottom: 12px;
}

.submission-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.submission-description {
  font-size: 13px;
  color: #6b7280;
  line-height: 1.4;
  margin-bottom: 8px;
  padding-left: 20px; /* 为图标留出空间 */
}

.file-icon {
  font-size: 16px;
  color: #6b7280;
  flex-shrink: 0;
}

.submission-name {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
}

.download-icon {
  font-size: 16px;
  color: #1890ff;
  flex-shrink: 0;
  cursor: pointer;
  transition: color 0.3s ease;
}

.download-icon:hover {
  color: #40a9ff;
}

.submission-meta-inline {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #6b7280;
  margin-left: auto;
  flex-shrink: 0;
}

.submission-meta-inline span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.submission-meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #6b7280;
}

.submission-meta span {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 响应式 */
@media (max-width: 768px) {
  .submission-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .submission-meta-inline {
    margin-left: 0;
    margin-top: 4px;
    width: 100%;
    justify-content: flex-start;
  }

  .submission-meta {
    flex-direction: column;
    gap: 4px;
  }
}
</style>
