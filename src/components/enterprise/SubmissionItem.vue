<template>
  <div class="submission-item">
    <div class="submission-info">
      <el-icon class="file-icon"><Document /></el-icon>
      <span class="submission-name">{{ submission.fileName }}</span>
      <span class="file-size">{{ submission.fileSize }}</span>
      <span class="upload-time">{{ submission.uploadTime }}</span>
      <el-icon class="download-icon" @click="handleDownload">
        <Download />
      </el-icon>
    </div>

    <!--
      当前后端版本未实现文件说明字段（description/versionNote），
      先注释展示，避免界面显示无效说明信息
    -->
    <!--
    <div v-if="submission.versionNote || submission.description" class="submission-description">
      {{ submission.versionNote || submission.description }}
    </div>
    -->
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

const emit = defineEmits(['download'])

function handleDownload() {
  emit('download', props.submission)
}
</script>

<style scoped>
.submission-item {
  background: #f5f7fb;
  border-radius: 6px;
  padding: 12px 16px;
  transition: all 0.3s ease;
}

.submission-item:hover {
  background: #e8ecf3;
}

.submission-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.file-icon {
  font-size: 14px;
  color: #606266;
  flex-shrink: 0;
}

.submission-name {
  flex: 1;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-size {
  font-size: 12px;
  color: #909399;
  flex-shrink: 0;
}

.upload-time {
  font-size: 12px;
  color: #909399;
  flex-shrink: 0;
}

.download-icon {
  font-size: 18px;
  color: #409eff;
  cursor: pointer;
  flex-shrink: 0;
  transition: color 0.3s ease;
}

.download-icon:hover {
  color: #66b1ff;
}

/*
  当前后端版本未实现文件说明字段（description/versionNote），
  对应的说明样式暂时注释
*/
/*
.submission-description {
  font-size: 13px;
  color: #606266;
  line-height: 1.6;
}
*/
</style>
