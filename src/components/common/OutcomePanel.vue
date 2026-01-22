<template>
  <div class="outcome-panel">
    <!-- 操作栏 -->
    <div class="action-bar">
      <h3 class="panel-title">项目成果</h3>
      <el-button v-if="canUpload" type="primary" @click="showUploadDialog">
        <el-icon><Upload /></el-icon>
        上传成果
      </el-button>
    </div>

    <!-- 成果列表 -->
    <div v-if="outcomes.length > 0" class="outcomes-list">
      <div
        v-for="outcome in outcomes"
        :key="outcome.id"
        class="outcome-card"
      >
        <div class="outcome-icon">
          <el-icon :size="32" :color="getFileIconColor(outcome.type)">
            <component :is="getFileIcon(outcome.type)" />
          </el-icon>
        </div>

        <div class="outcome-info">
          <div class="outcome-header">
            <h4 class="outcome-name">{{ outcome.name }}</h4>
            <el-tag :type="getStatusTagType(outcome.status)" size="small">
              {{ outcome.statusText }}
            </el-tag>
          </div>

          <div class="outcome-meta">
            <span class="meta-item">
              <el-icon><User /></el-icon>
              {{ outcome.uploader }}
            </span>
            <span class="meta-item">
              <el-icon><Clock /></el-icon>
              {{ outcome.uploadTime }}
            </span>
            <span class="meta-item">
              <el-icon><Box /></el-icon>
              {{ outcome.size }}
            </span>
            <span class="meta-item">
              <el-icon><PriceTag /></el-icon>
              {{ outcome.version }}
            </span>
          </div>
        </div>

        <div class="outcome-actions">
          <el-button link type="primary" @click="viewOutcome(outcome)">
            <el-icon><View /></el-icon>
            查看
          </el-button>
          <el-button link type="primary" @click="downloadOutcome(outcome)">
            <el-icon><Download /></el-icon>
            下载
          </el-button>
          <el-button v-if="canUpload" link type="danger" @click="deleteOutcome(outcome)">
            <el-icon><Delete /></el-icon>
            删除
          </el-button>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="empty-state">
      <el-icon :size="64" color="#C0C4CC"><DocumentCopy /></el-icon>
      <p>暂无成果提交</p>
      <el-button v-if="canUpload" type="primary" @click="showUploadDialog">
        立即上传
      </el-button>
    </div>

    <!-- 上传对话框 -->
    <el-dialog
      v-model="uploadDialogVisible"
      title="上传成果"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form :model="uploadForm" label-width="80px">
        <el-form-item label="成果名称">
          <el-input v-model="uploadForm.name" placeholder="请输入成果名称" />
        </el-form-item>
        <el-form-item label="成果描述">
          <el-input
            v-model="uploadForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入成果描述"
          />
        </el-form-item>
        <el-form-item label="文件上传">
          <el-upload
            class="upload-demo"
            drag
            :auto-upload="false"
            :on-change="handleFileChange"
            :limit="1"
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                支持上传 PDF、Word、PPT、压缩包等文件，单个文件不超过 500MB
              </div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="uploadDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleUpload">确定上传</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Upload,
  User,
  Clock,
  Box,
  PriceTag,
  View,
  Download,
  Delete,
  DocumentCopy,
  Document,
  FolderOpened,
  Picture,
  VideoCamera,
  UploadFilled
} from '@element-plus/icons-vue'

// Props
const props = defineProps({
  projectId: {
    type: [String, Number],
    required: true
  },
  outcomes: {
    type: Array,
    default: () => []
  },
  canUpload: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['upload', 'delete', 'view'])

// 上传对话框
const uploadDialogVisible = ref(false)
const uploadForm = ref({
  name: '',
  description: '',
  file: null
})

// 获取文件图标
function getFileIcon(type) {
  const iconMap = {
    document: Document,
    archive: FolderOpened,
    image: Picture,
    video: VideoCamera
  }
  return iconMap[type] || Document
}

// 获取文件图标颜色
function getFileIconColor(type) {
  const colorMap = {
    document: '#409eff',
    archive: '#e6a23c',
    image: '#67c23a',
    video: '#f56c6c'
  }
  return colorMap[type] || '#909399'
}

// 获取状态标签类型
function getStatusTagType(status) {
  const typeMap = {
    approved: 'success',
    pending: 'warning',
    rejected: 'danger'
  }
  return typeMap[status] || 'info'
}

// 显示上传对话框
function showUploadDialog() {
  uploadForm.value = {
    name: '',
    description: '',
    file: null
  }
  uploadDialogVisible.value = true
}

// 文件改变
function handleFileChange(file) {
  uploadForm.value.file = file.raw
  if (!uploadForm.value.name) {
    uploadForm.value.name = file.name
  }
}

// 上传成果
function handleUpload() {
  if (!uploadForm.value.name) {
    ElMessage.warning('请输入成果名称')
    return
  }
  if (!uploadForm.value.file) {
    ElMessage.warning('请选择要上传的文件')
    return
  }

  emit('upload', {
    name: uploadForm.value.name,
    description: uploadForm.value.description,
    file: uploadForm.value.file
  })

  uploadDialogVisible.value = false
}

// 查看成果
function viewOutcome(outcome) {
  emit('view', outcome)
  ElMessage.info(`查看成果：${outcome.name}`)
}

// 下载成果
function downloadOutcome(outcome) {
  ElMessage.success(`开始下载：${outcome.name}`)
  console.log('下载成果:', outcome)
}

// 删除成果
function deleteOutcome(outcome) {
  ElMessageBox.confirm(
    `确定要删除成果"${outcome.name}"吗？`,
    '确认删除',
    {
      type: 'warning'
    }
  ).then(() => {
    emit('delete', outcome.id)
    ElMessage.success('删除成功')
  }).catch(() => {})
}
</script>

<style scoped>
.outcome-panel {
  padding: 20px 0;
}

/* 操作栏 */
.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.panel-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f274b;
  margin: 0;
}

/* 成果列表 */
.outcomes-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.outcome-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 16px;
  transition: transform 0.3s, box-shadow 0.3s;
}

.outcome-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.outcome-icon {
  width: 64px;
  height: 64px;
  background: #f5f7fb;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.outcome-info {
  flex: 1;
  min-width: 0;
}

.outcome-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.outcome-name {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.outcome-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #909399;
}

.meta-item .el-icon {
  font-size: 14px;
}

.outcome-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: #909399;
}

.empty-state p {
  margin: 16px 0 24px;
  font-size: 14px;
}

/* 上传区域 */
.upload-demo {
  width: 100%;
}

/* 响应式 */
@media (max-width: 768px) {
  .outcome-card {
    flex-direction: column;
    align-items: flex-start;
  }

  .outcome-actions {
    width: 100%;
    justify-content: flex-end;
  }

  .outcome-meta {
    flex-direction: column;
    gap: 8px;
  }
}
</style>
