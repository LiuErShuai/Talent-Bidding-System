<template>
  <div class="milestone-card-contractor" :class="cardClass">
    <!-- 卡片头部：标题 + 状态 + 元信息 -->
    <div class="card-header">
      <div class="header-left">
        <h3 class="card-title">{{ milestone.title }}</h3>
        <el-tag :type="tagType" size="large">{{ statusText }}</el-tag>
      </div>

      <!-- 元信息区域 -->
      <div class="header-meta">
        <div class="meta-item">
          <el-icon><Calendar /></el-icon>
          <span>计划: {{ milestone.plannedDate }}</span>
        </div>
        <div v-if="milestone.actualDate" class="meta-item">
          <el-icon><Checked /></el-icon>
          <span>实际: {{ milestone.actualDate }}</span>
        </div>
        <div v-if="remainingDays !== null" class="meta-item" :class="{ 'text-danger': remainingDays < 0 }">
          <el-icon><Clock /></el-icon>
          <span>{{ remainingDaysText }}</span>
        </div>
        <div class="meta-item">
          <el-icon><Document /></el-icon>
          <span>交付物: {{ milestone.deliverables.length }}</span>
        </div>
      </div>

      <el-button
        text
        :icon="expanded ? ArrowUp : ArrowDown"
        @click="toggleExpand"
        class="expand-btn"
      >
        {{ expanded ? '折叠详情' : '展开详情' }}
      </el-button>
    </div>

    <!-- 描述（始终可见） -->
    <div class="card-description">
      {{ milestone.description }}
    </div>

    <!-- 可折叠内容 -->
    <el-collapse-transition>
      <div v-show="expanded" class="card-content">
        <!-- 交付物要求 -->
        <div class="section deliverables-requirements">
          <h4 class="section-title collapsible" @click="deliverablesExpanded = !deliverablesExpanded">
            <el-icon><List /></el-icon>
            交付物要求
            <el-icon class="collapse-icon">
              <ArrowUp v-if="deliverablesExpanded" />
              <ArrowDown v-else />
            </el-icon>
          </h4>
          <el-collapse-transition>
            <ul v-show="deliverablesExpanded" class="deliverables-list">
              <li v-for="d in milestone.deliverables" :key="d.id" class="deliverable-item">
                <div class="deliverable-info">
                  <span class="deliverable-name">{{ d.name }}</span>
                  <el-tag size="small" type="info">{{ d.format.join(' / ') }}</el-tag>
                </div>
                <p class="deliverable-requirement">{{ d.requirement }}</p>
              </li>
            </ul>
          </el-collapse-transition>
        </div>

        <!-- 我的提交记录 -->
        <div class="section submissions">
          <h4 class="section-title collapsible" @click="submissionsExpanded = !submissionsExpanded">
            <el-icon><Files /></el-icon>
            我的提交
            <el-icon class="collapse-icon">
              <ArrowUp v-if="submissionsExpanded" />
              <ArrowDown v-else />
            </el-icon>
          </h4>

          <el-collapse-transition>
            <div v-show="submissionsExpanded">
              <div v-if="milestone.submissions?.length > 0" class="submissions-list">
            <submission-item
              v-for="sub in sortedSubmissions"
              :key="sub.id"
              :submission="sub"
              @view="handleViewSubmission"
              @download="handleDownloadSubmission"
            />
          </div>

          <div v-else class="empty-submissions">
            <el-icon :size="48" color="#C0C4CC"><FolderOpened /></el-icon>
            <p>暂无提交记录</p>
          </div>

          <!-- 上传按钮 -->
          <el-button type="primary" @click="handleUpload" class="upload-btn">
            <el-icon><UploadFilled /></el-icon>
            上传/更新文件
          </el-button>
            </div>
          </el-collapse-transition>
        </div>

        <!-- 发布方反馈 -->
        <div class="section feedback">
          <h4 class="section-title collapsible" @click="feedbackExpanded = !feedbackExpanded">
            <el-icon><ChatDotRound /></el-icon>
            发布方反馈
            <el-icon class="collapse-icon">
              <ArrowUp v-if="feedbackExpanded" />
              <ArrowDown v-else />
            </el-icon>
          </h4>

          <el-collapse-transition>
            <div v-show="feedbackExpanded">
              <div v-if="sortedFeedbacks.length > 0" class="feedbacks-list">
            <div
              v-for="feedback in sortedFeedbacks"
              :key="feedback.id"
              class="feedback-item"
            >
              <div class="feedback-header">
                <span class="feedback-publisher">{{ feedback.publisher }}</span>
                <span class="feedback-time">{{ feedback.time }}</span>
              </div>
              <div class="feedback-content">
                {{ feedback.content }}
                <div v-if="feedback.suggestions?.length > 0" class="suggestions-inline">
                  <div class="suggestion-title">修改建议：</div>
                  <ul class="suggestion-list">
                    <li v-for="(suggestion, index) in feedback.suggestions" :key="index" class="suggestion-item">
                      {{ suggestion }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="empty-feedback">
            <el-icon :size="48" color="#C0C4CC"><ChatDotRound /></el-icon>
            <p>暂无反馈意见</p>
          </div>
            </div>
          </el-collapse-transition>
        </div>

      </div>
    </el-collapse-transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  ArrowUp,
  ArrowDown,
  Calendar,
  Checked,
  Clock,
  Document,
  List,
  Files,
  FolderOpened,
  UploadFilled,
  ChatDotRound
} from '@element-plus/icons-vue'
import SubmissionItem from './SubmissionItem.vue'
import { calculateRemainingDays } from '@/mock/projectManage'

const props = defineProps({
  milestone: {
    type: Object,
    required: true
  },
  defaultExpanded: {
    type: Boolean,
    default: false
  },
  nextMilestone: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['upload', 'viewSubmission', 'downloadSubmission', 'guideAction'])

// 折叠/展开状态
const expanded = ref(props.defaultExpanded)

// 各模块折叠状态
const deliverablesExpanded = ref(true) // 交付物要求默认展开
const submissionsExpanded = ref(true)  // 我的提交默认展开
const feedbackExpanded = ref(true)     // 发布方反馈默认展开

function toggleExpand() {
  expanded.value = !expanded.value
}

// 卡片样式类
const cardClass = computed(() => ({
  'milestone-completed': props.milestone.status === 'completed',
  'milestone-in-progress': props.milestone.status === 'in-progress',
  'milestone-pending': props.milestone.status === 'pending',
  'milestone-delayed': props.milestone.status === 'delayed'
}))

// 状态文本
const statusText = computed(() => {
  const map = {
    'completed': '已完成',
    'in-progress': '进行中',
    'pending': '待开始',
    'delayed': '已逾期'
  }
  return map[props.milestone.status] || props.milestone.status
})

// 标签类型
const tagType = computed(() => {
  const map = {
    'completed': 'success',
    'in-progress': 'primary',
    'pending': 'info',
    'delayed': 'danger'
  }
  return map[props.milestone.status] || 'info'
})

// 剩余天数
const remainingDays = computed(() => {
  if (props.milestone.status === 'completed' || !props.milestone.plannedDate) {
    return null
  }
  return calculateRemainingDays(props.milestone.plannedDate)
})

// 排序后的反馈记录（新到旧）
const sortedFeedbacks = computed(() => {
  if (!props.milestone.feedbacks) return []
  return [...props.milestone.feedbacks].sort((a, b) => {
    return new Date(b.time) - new Date(a.time)
  })
})

// 剩余天数文本
const remainingDaysText = computed(() => {
  if (remainingDays.value === null) return ''
  if (remainingDays.value > 0) return `剩余 ${remainingDays.value} 天`
  if (remainingDays.value === 0) return '今天截止'
  return `逾期 ${-remainingDays.value} 天`
})

// 提交记录排序（最新版本在前）
const sortedSubmissions = computed(() => {
  if (!props.milestone.submissions) return []
  return [...props.milestone.submissions].sort((a, b) => b.version - a.version)
})

// 事件处理
function handleUpload() {
  emit('upload', props.milestone.id)
}

function handleViewSubmission(submission) {
  emit('viewSubmission', submission)
}

function handleDownloadSubmission(submission) {
  emit('downloadSubmission', submission)
}
</script>

<style scoped>
.milestone-card-contractor {
  background: #fff;
  border-radius: 12px;
  padding: 18px;
  margin-bottom: 0px;
  margin-top: 0px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border-left: 4px solid #e4e7ed;
}

.milestone-card-contractor:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

/* 状态样式 */
.milestone-completed {
  background: #f6ffed;
  border-left-color: #52c41a;
}

.milestone-in-progress {
  border-left-color: #1890ff;
  box-shadow: 0 4px 16px rgba(24, 144, 255, 0.2);
  transform: scale(1.01);
}

.milestone-pending {
  opacity: 0.9;
  border-left-color: #d9d9d9;
}

.milestone-delayed {
  border-left-color: #ff4d4f;
  background: #fff1f0;
}

/* 卡片头部 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding-bottom: 2px;
  border-bottom: 1px solid #f0f0f0;
  gap: 16px; /* 添加间距 */
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.header-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  justify-content: center;
}

.card-title {
  margin: 0;
  font-size: 23px;
  font-weight: 600;
  color: #1f274b;
}

.expand-btn {
  font-size: 13px;
}

/* 头部元数据 */
.header-meta .meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #606266;
}

.header-meta .meta-item .el-icon {
  font-size: 14px;
  color: #909399;
}

.header-meta .meta-item.text-danger {
  color: #ff4d4f;
  font-weight: 600;
}

.header-meta .meta-item.text-danger .el-icon {
  color: #ff4d4f;
}

/* 描述 */
.card-description {
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
  margin-bottom: 0px;
}

/* 可折叠内容 */
.card-content {
  padding-top: 16px;
  border-top: 1px dashed #e4e7ed;
}

/* 区块 */
.section {
  margin-bottom: 20px;
  position: relative;
}

.section:last-child {
  margin-bottom: 0;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: #1f274b;
  position: relative;
  background: #e5e7eb;
  padding: 8px 12px;
  border-top: 1px solid #000000;
  border-bottom: 1px solid #000000;
}

.section-title .el-icon {
  font-size: 16px;
  color: #1890ff;
}

.count-badge {
  margin-left: 8px;
  padding: 2px 8px;
  background: #1890ff;
  color: #fff;
  font-size: 12px;
  border-radius: 10px;
  font-weight: 500;
}

/* 交付物要求 */
.deliverables-list {
  list-style: none;
  padding: 0;
  margin: 4px 0 0 0;
  background: #f5f7fb;
  border-radius: 0 0 8px 8px;
  overflow: hidden;
}

.deliverable-item {
  padding: 12px 16px;
  border-bottom: 1px dashed #9ca3af;
}

.deliverable-item:last-child {
  border-bottom: none;
  padding-bottom: 12px;
}

.deliverable-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 6px;
}

.deliverable-name {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.deliverable-requirement {
  margin: 0;
  font-size: 13px;
  color: #606266;
  line-height: 1.6;
}

/* 提交记录 */
.submissions-list {
  margin-bottom: 16px;
  background: #f5f7fb;
  border-radius: 0 0 8px 8px;
  overflow: hidden;
}

.empty-submissions {
  text-align: center;
  padding: 40px 20px;
  color: #909399;
}

.empty-submissions p {
  margin-top: 12px;
  font-size: 14px;
}

.upload-btn {
  width: 100%;
}

/* 发布方反馈 */
.feedbacks-list {
  margin-top: 8px;
}

.feedback-item {
  background: #f5f7fb;
  border-radius: 0 0 8px 8px;
  padding: 12px 16px;
  margin-bottom: 8px;
}

.feedback-item:last-child {
  margin-bottom: 0;
}

.feedback-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.feedback-publisher {
  font-weight: 600;
  color: #303133;
  font-size: 14px;
}

.feedback-time {
  font-size: 12px;
  color: #909399;
}

.feedback-content {
  font-size: 13px;
  color: #606266;
  line-height: 1.5;
  margin-bottom: 12px;
}

.suggestions-inline {
  margin-top: 8px;
}

.suggestion-title {
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
  font-size: 13px;
}

.suggestion-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.suggestion-item {
  font-size: 13px;
  color: #606266;
  line-height: 1.5;
  position: relative;
  padding-left: 16px;
  margin-bottom: 4px;
}

.suggestion-item:before {
  content: '•';
  color: #909399;
  position: absolute;
  left: 0;
  font-weight: normal;
}

.suggestion-item:last-child {
  margin-bottom: 0;
}

.empty-feedback {
  text-align: center;
  padding: 24px 16px;
  color: #C0C4CC;
}

.empty-feedback p {
  margin-top: 12px;
  font-size: 14px;
}

/* 折叠功能样式 */
.collapsible {
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-right: 8px;
}

.collapsible:hover {
  /* 使用更深的背景以突出高亮（比原来的浅色更明显） */
  background-color: #cfcfcf;
}

.collapse-icon {
  font-size: 16px;
  color: #000000; /* 改为黑色 */
  transition: transform 0.3s ease;
  margin-left: 6px;
  transform: translateX(-5px); /* 向左微移 */
}

/* 更高优先级覆盖：确保折叠图标在可折叠标题中为黑色 */
.section-title.collapsible .collapse-icon {
  color: #000000 !important;
}

/* 响应式 */
@media (max-width: 768px) {
  .milestone-card-contractor {
    padding: 16px;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .header-left {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .header-meta {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 8px;
    width: 100%;
    justify-content: flex-start;
  }

  .card-title {
    font-size: 16px;
  }

  .deliverable-info {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
