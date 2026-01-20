<template>
  <div class="history-records">
    <h2 class="section-title">历史记录</h2>
    <p class="section-desc">查看所有文件上传记录</p>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <el-icon class="is-loading"><Loading /></el-icon>
      <span>加载中...</span>
    </div>

    <!-- 历史记录列表 -->
    <div v-else-if="records && records.length" class="records-container">
      <div class="records-list">
        <div v-for="record in paginatedRecords" :key="record.id" class="record-item">
          <div class="record-header">
            <div class="record-info">
              <el-icon class="file-icon"><Document /></el-icon>
              <div class="file-info">
                <div class="file-name-row">
                  <span class="file-name">{{ record.fileName }}</span>
                  <el-tag v-if="record.milestone" size="small" type="info">{{ record.milestone }}</el-tag>
                </div>
                <div class="file-meta">
                  <span>{{ record.fileSize }}</span>
                  <span class="separator">|</span>
                  <span>{{ record.uploadTime }}</span>
                  <span class="separator">|</span>
                  <span>上传人：{{ record.uploader }}</span>
                </div>
              </div>
            </div>
            <div class="record-actions">
              <el-button
                link
                type="primary"
                @click="handleDownload(record)"
              >
                <el-icon><Download /></el-icon>
                下载
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[5, 10, 20, 50]"
          :total="records.length"
          layout="total, sizes, prev, pager, next, jumper"
          background
        />
      </div>
    </div>

    <!-- 空状态 -->
    <el-empty v-else description="暂无上传记录" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Loading, Document, Download } from '@element-plus/icons-vue'

const props = defineProps({
  projectId: {
    type: String,
    required: true
  }
})

const loading = ref(true)
const records = ref([])

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)

// 计算分页后的数据
const paginatedRecords = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return records.value.slice(start, end)
})

// 加载历史记录
async function fetchHistoryRecords() {
  loading.value = true
  try {
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 500))

    // Mock 数据 - 从所有里程碑中收集提交记录
    records.value = [
      {
        id: 1,
        fileName: '揭榜申请-张三.pdf',
        fileSize: '1.2 MB',
        uploadTime: '2025-11-03 14:20',
        uploader: '张三',
        milestone: '揭榜征集',
        versionNote: '初次申请，附带个人简历和项目经验说明'
      },
      {
        id: 2,
        fileName: '技术方案-AI智能客服系统.pdf',
        fileSize: '2.3 MB',
        uploadTime: '2025-11-15 10:00',
        uploader: '张三',
        milestone: '方案提交',
        versionNote: '初版技术方案，包含系统架构设计和技术选型'
      },
      {
        id: 3,
        fileName: '技术方案-AI智能客服系统-v2.pdf',
        fileSize: '3.1 MB',
        uploadTime: '2025-11-18 14:30',
        uploader: '张三',
        milestone: '方案提交',
        versionNote: '补充了技术选型依据、风险评估章节和数据库ER图'
      }
    ]
  } catch (error) {
    ElMessage.error('加载历史记录失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 下载文件
function handleDownload(record) {
  ElMessage.success(`开始下载：${record.fileName}`)
  console.log('下载文件：', record)
  // 实际项目中应该调用后端API获取下载链接
}

onMounted(fetchHistoryRecords)
</script>

<style scoped>
.history-records {
  max-width: 1200px;
}

.section-title {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 600;
  color: #303133;
}

.section-desc {
  margin: 0 0 24px 0;
  font-size: 14px;
  color: #909399;
}

/* 加载状态 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  gap: 12px;
  color: #909399;
}

.loading-container .el-icon {
  font-size: 36px;
}

/* 记录容器 */
.records-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 记录列表 */
.records-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 500px;
  max-height: 600px;
  overflow-y: auto;
  padding-right: 8px;
}

/* 滚动条样式 */
.records-list::-webkit-scrollbar {
  width: 6px;
}

.records-list::-webkit-scrollbar-track {
  background: #f5f7fb;
  border-radius: 3px;
}

.records-list::-webkit-scrollbar-thumb {
  background: #dcdfe6;
  border-radius: 3px;
}

.records-list::-webkit-scrollbar-thumb:hover {
  background: #c0c4cc;
}

/* 记录项 */
.record-item {
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 16px;
  transition: all 0.3s ease;
}

.record-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

/* 记录头部 */
.record-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 12px;
}

.record-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.file-icon {
  font-size: 32px;
  color: #409eff;
  flex-shrink: 0;
}

.file-info {
  flex: 1;
  min-width: 0;
}

.file-name-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.file-name {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-meta {
  font-size: 13px;
  color: #909399;
  display: flex;
  align-items: center;
  gap: 8px;
}

.separator {
  color: #dcdfe6;
}

.record-actions {
  flex-shrink: 0;
}

/* 分页容器 */
.pagination-container {
  display: flex;
  justify-content: center;
  padding-top: 16px;
  border-top: 1px solid #e4e7ed;
}

/* 响应式 */
@media (max-width: 768px) {
  .record-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .record-actions {
    width: 100%;
  }

  .record-actions .el-button {
    width: 100%;
  }
}
</style>
