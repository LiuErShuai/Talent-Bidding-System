<template>
  <div class="bidding-management">
    <!-- 统计卡片 -->
    <div class="stats-section">
      <el-card class="stat-card">
        <div class="stat-content">
          <el-icon class="stat-icon" color="#409eff"><User /></el-icon>
          <div class="stat-info">
            <div class="stat-label">申请团队</div>
            <div class="stat-value">{{ applications.length }}</div>
          </div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <el-icon class="stat-icon" color="#67c23a"><Select /></el-icon>
          <div class="stat-info">
            <div class="stat-label">初审通过</div>
            <div class="stat-value">{{ approvedCount }}</div>
          </div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <el-icon class="stat-icon" color="#e6a23c"><Clock /></el-icon>
          <div class="stat-info">
            <div class="stat-label">待审核</div>
            <div class="stat-value">{{ pendingCount }}</div>
          </div>
        </div>
      </el-card>
      <el-card class="stat-card">
        <div class="stat-content">
          <el-icon class="stat-icon" color="#f56c6c"><Trophy /></el-icon>
          <div class="stat-info">
            <div class="stat-label">中标团队</div>
            <div class="stat-value">{{ selectedTeam ? '已选定' : '未选定' }}</div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 筛选和操作栏 -->
    <div class="filter-section">
      <el-radio-group v-model="filterStatus" @change="handleFilterChange">
        <el-radio-button value="all">全部 ({{ applications.length }})</el-radio-button>
        <el-radio-button value="submitted">待审核 ({{ submittedCount }})</el-radio-button>
        <el-radio-button value="approved">审核通过 ({{ approvedCount }})</el-radio-button>
        <el-radio-button value="rejected">已拒绝 ({{ rejectedCount }})</el-radio-button>
        <el-radio-button value="selected">已中标 ({{ selectedCount }})</el-radio-button>
      </el-radio-group>
    </div>

    <!-- 团队申请列表 -->
    <div class="applications-list">
      <el-card v-for="app in filteredApplications" :key="app.id" class="application-card">
        <div class="application-header">
          <div class="team-info">
            <h3 class="team-name">{{ app.teamName }}</h3>
            <el-tag :type="getStatusTagType(app.status)" size="small">
              {{ getStatusText(app.status) }}
            </el-tag>
          </div>
          <div class="header-actions">
            <span class="application-time">申请时间：{{ app.applyTime }}</span>
            <el-button
              link
              @click="toggleCardExpand(app.id)"
              class="expand-btn"
            >
              <el-icon>
                <component :is="expandedCards[app.id] ? 'ArrowUp' : 'ArrowDown'" />
              </el-icon>
            </el-button>
          </div>
        </div>

        <el-collapse-transition>
          <div v-show="expandedCards[app.id]" class="application-body">
          <!-- 团队基本信息 -->
          <div class="info-section">
            <div class="info-item">
              <span class="label">团队负责人：</span>
              <span class="value">{{ app.leader }}</span>
            </div>
            <div class="info-item">
              <span class="label">团队人数：</span>
              <span class="value">{{ app.memberCount }} 人</span>
            </div>
            <div class="info-item">
              <span class="label">联系方式：</span>
              <span class="value">{{ app.contact }}</span>
            </div>
          </div>

          <!-- 申请说明 -->
          <div class="description-section">
            <div class="section-title">申请说明</div>
            <div class="description-text">{{ app.description }}</div>
          </div>

          <!-- 详细资料（如果已提交） -->
          <div v-if="app.detailFiles && app.detailFiles.length > 0" class="detail-files-section">
            <div class="section-title">详细资料</div>
            <div class="file-list">
              <div v-for="file in app.detailFiles" :key="file.id" class="file-item">
                <el-icon><Document /></el-icon>
                <span class="file-name">{{ file.name }}</span>
                <span class="file-size">{{ file.size }}</span>
                <el-button link type="primary" @click="handleDownloadFile(file)">
                  <el-icon><Download /></el-icon>
                  下载
                </el-button>
              </div>
            </div>
          </div>

          <!-- 审核记录 -->
          <div v-if="app.reviewHistory && app.reviewHistory.length > 0" class="review-history-section">
            <div class="section-title-with-toggle">
              <div class="section-title">审核记录</div>
              <el-button
                link
                size="small"
                @click="toggleReviewHistory(app.id)"
              >
                {{ expandedReviews[app.id] ? '收起' : '展开' }}
              </el-button>
            </div>
            <el-collapse-transition>
              <el-timeline v-show="expandedReviews[app.id]">
                <el-timeline-item
                  v-for="record in app.reviewHistory"
                  :key="record.id"
                  :timestamp="record.time"
                  :type="record.action === 'approved' ? 'success' : 'danger'"
                >
                  <div class="review-record">
                    <div class="review-action">{{ record.actionText }}</div>
                    <div class="review-comment">{{ record.comment }}</div>
                  </div>
                </el-timeline-item>
              </el-timeline>
            </el-collapse-transition>
          </div>
        </div>
        </el-collapse-transition>

        <!-- 操作按钮 -->
        <div class="application-footer">
          <!-- 待审核状态（已提交详细资料） -->
          <template v-if="app.status === 'submitted'">
            <el-button type="success" @click="handleApprove(app)">
              <el-icon><Select /></el-icon>
              审核通过
            </el-button>
            <el-button type="danger" @click="handleReject(app)">
              <el-icon><Close /></el-icon>
              拒绝申请
            </el-button>
            <el-button @click="handleViewDetail(app)">
              <el-icon><View /></el-icon>
              查看详细资料
            </el-button>
          </template>

          <!-- 审核通过状态 -->
          <template v-if="app.status === 'approved'">
            <el-button type="success" @click="handleSelectTeam(app)">
              <el-icon><Trophy /></el-icon>
              选为中标团队
            </el-button>
            <el-button @click="handleViewDetail(app)">
              <el-icon><View /></el-icon>
              查看详细资料
            </el-button>
          </template>

          <!-- 已中标状态 -->
          <template v-if="app.status === 'selected'">
            <el-tag type="success" size="large">
              <el-icon><Trophy /></el-icon>
              中标团队
            </el-tag>
          </template>

          <!-- 已拒绝状态 -->
          <template v-if="app.status === 'rejected'">
            <el-tag type="info" size="large">已拒绝</el-tag>
          </template>
        </div>
      </el-card>

      <!-- 空状态 -->
      <el-empty v-if="filteredApplications.length === 0" description="暂无申请团队" />
    </div>

    <!-- 审核对话框 -->
    <el-dialog v-model="reviewDialogVisible" :title="reviewDialogTitle" width="600px">
      <el-form :model="reviewForm" label-width="100px">
        <el-form-item label="审核意见">
          <el-input
            v-model="reviewForm.comment"
            type="textarea"
            :rows="4"
            placeholder="请输入审核意见"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="reviewDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmReview">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  User,
  Select,
  Clock,
  Trophy,
  Document,
  Download,
  Close,
  View,
  ArrowUp,
  ArrowDown
} from '@element-plus/icons-vue'

const props = defineProps({
  projectId: {
    type: String,
    required: true
  }
})

// 展开/折叠状态
const expandedCards = ref({})
const expandedReviews = ref({})

// 初始化所有卡片为展开状态
const initializeExpandedStates = () => {
  applications.value.forEach(app => {
    expandedCards.value[app.id] = true
    expandedReviews.value[app.id] = false
  })
}

// 申请列表数据（从 Mock 数据获取）
const applications = ref([
  {
    id: 'app-001',
    teamName: '创新科技团队',
    leader: '张三',
    memberCount: 5,
    contact: '13800138000',
    applyTime: '2025-11-01 10:30',
    description: '我们是一支经验丰富的AI开发团队，曾参与多个智能客服项目的开发，对NLP技术有深入研究。团队成员来自计算机科学专业，具备扎实的技术功底。',
    status: 'selected',
    detailFiles: [
      { id: 'f1', name: '团队介绍.pdf', size: '2.3 MB' },
      { id: 'f2', name: '身份认证.pdf', size: '1.5 MB' },
      { id: 'f3', name: '技术方案.pdf', size: '4.2 MB' }
    ],
    reviewHistory: [
      {
        id: 'r1',
        time: '2025-11-02 14:00',
        action: 'approved',
        actionText: '审核通过',
        comment: '团队资质符合要求，技术方案完善'
      },
      {
        id: 'r2',
        time: '2025-11-03 10:00',
        action: 'selected',
        actionText: '选为中标团队',
        comment: '技术方案完善，团队经验丰富，综合评分最高'
      }
    ]
  },
  {
    id: 'app-002',
    teamName: '智能开发小组',
    leader: '李四',
    memberCount: 4,
    contact: '13900139000',
    applyTime: '2025-11-01 11:20',
    description: '我们团队专注于人工智能领域，有丰富的机器学习和深度学习项目经验。',
    status: 'approved',
    detailFiles: [
      { id: 'f4', name: '团队介绍.pdf', size: '1.8 MB' },
      { id: 'f5', name: '技术方案.pdf', size: '3.5 MB' }
    ],
    reviewHistory: [
      {
        id: 'r3',
        time: '2025-11-02 15:30',
        action: 'approved',
        actionText: '审核通过',
        comment: '团队经验丰富，符合项目要求'
      }
    ]
  },
  {
    id: 'app-003',
    teamName: '未来科技工作室',
    leader: '王五',
    memberCount: 3,
    contact: '13700137000',
    applyTime: '2025-11-01 14:50',
    description: '我们是一支年轻但充满活力的团队，虽然经验不多，但学习能力强，愿意接受挑战。',
    status: 'submitted',
    detailFiles: [
      { id: 'f6', name: '团队介绍.pdf', size: '1.2 MB' },
      { id: 'f7', name: '技术方案.pdf', size: '2.8 MB' }
    ],
    reviewHistory: []
  },
  {
    id: 'app-004',
    teamName: '测试团队',
    leader: '赵六',
    memberCount: 2,
    contact: '13600136000',
    applyTime: '2025-11-01 16:00',
    description: '测试申请',
    status: 'rejected',
    detailFiles: [
      { id: 'f8', name: '团队介绍.pdf', size: '800 KB' }
    ],
    reviewHistory: [
      {
        id: 'r4',
        time: '2025-11-02 16:30',
        action: 'rejected',
        actionText: '拒绝申请',
        comment: '团队人数不足，经验不符合要求'
      }
    ]
  }
])

// 初始化展开状态
initializeExpandedStates()

// 筛选状态
const filterStatus = ref('all')

// 计算属性
const submittedCount = computed(() => applications.value.filter(app => app.status === 'submitted').length)
const pendingCount = computed(() => submittedCount.value)
const approvedCount = computed(() => applications.value.filter(app => app.status === 'approved').length)
const rejectedCount = computed(() => applications.value.filter(app => app.status === 'rejected').length)
const selectedCount = computed(() => applications.value.filter(app => app.status === 'selected').length)
const selectedTeam = computed(() => applications.value.find(app => app.status === 'selected'))

// 过滤后的申请列表
const filteredApplications = computed(() => {
  if (filterStatus.value === 'all') {
    return applications.value
  }
  return applications.value.filter(app => app.status === filterStatus.value)
})

// 审核对话框
const reviewDialogVisible = ref(false)
const reviewDialogTitle = ref('')
const reviewForm = ref({
  comment: '',
  action: '',
  applicationId: ''
})

// 切换卡片展开/折叠
function toggleCardExpand(appId) {
  expandedCards.value[appId] = !expandedCards.value[appId]
}

// 切换审核记录展开/折叠
function toggleReviewHistory(appId) {
  expandedReviews.value[appId] = !expandedReviews.value[appId]
}

// 状态标签类型
function getStatusTagType(status) {
  const map = {
    submitted: 'warning',
    approved: 'success',
    rejected: 'info',
    selected: 'success'
  }
  return map[status] || 'info'
}

// 状态文本
function getStatusText(status) {
  const map = {
    submitted: '待审核',
    approved: '审核通过',
    rejected: '已拒绝',
    selected: '已中标'
  }
  return map[status] || '未知'
}

// 筛选变化
function handleFilterChange() {
  // 筛选逻辑已通过计算属性实现
}

// 通过初审
function handleApprove(app) {
  reviewDialogTitle.value = '通过初审'
  reviewForm.value = {
    comment: '',
    action: 'approved',
    applicationId: app.id
  }
  reviewDialogVisible.value = true
}

// 拒绝申请
function handleReject(app) {
  reviewDialogTitle.value = '拒绝申请'
  reviewForm.value = {
    comment: '',
    action: 'rejected',
    applicationId: app.id
  }
  reviewDialogVisible.value = true
}

// 确认审核
function handleConfirmReview() {
  if (!reviewForm.value.comment.trim()) {
    ElMessage.warning('请输入审核意见')
    return
  }

  const app = applications.value.find(a => a.id === reviewForm.value.applicationId)
  if (app) {
    app.status = reviewForm.value.action
    app.reviewHistory.push({
      id: `r${Date.now()}`,
      time: new Date().toLocaleString('zh-CN'),
      action: reviewForm.value.action,
      actionText: reviewForm.value.action === 'approved' ? '审核通过' : '拒绝申请',
      comment: reviewForm.value.comment
    })

    ElMessage.success(reviewForm.value.action === 'approved' ? '已审核通过' : '已拒绝申请')
  }

  reviewDialogVisible.value = false
}

// 选为中标团队
function handleSelectTeam(app) {
  ElMessageBox.confirm(
    `确定选择"${app.teamName}"作为中标团队吗？选定后将无法更改。`,
    '确认选择',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // 将其他团队状态重置
    applications.value.forEach(a => {
      if (a.id === app.id) {
        a.status = 'selected'
      }
    })
    ElMessage.success('已选定中标团队')
  }).catch(() => {
    // 取消操作
  })
}

// 查看详细资料
function handleViewDetail(app) {
  ElMessage.info('查看详细资料功能开发中')
}

// 下载文件
function handleDownloadFile(file) {
  ElMessage.success(`正在下载：${file.name}`)
}
</script>

<style scoped>
.bidding-management {
  max-width: 1400px;
}

/* 统计卡片 */
.stats-section {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  cursor: default;
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  font-size: 40px;
}

.stat-info {
  flex: 1;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
}

/* 筛选区 */
.filter-section {
  margin-bottom: 20px;
}

/* 申请列表 */
.applications-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.application-card {
  transition: all 0.3s;
}

.application-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.application-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #ebeef5;
}

.team-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.team-name {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.application-time {
  font-size: 13px;
  color: #909399;
}

.expand-btn {
  font-size: 18px;
  padding: 4px;
}

/* 申请内容 */
.application-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  padding: 12px;
  background: #f5f7fb;
  border-radius: 6px;
}

.info-item {
  font-size: 14px;
}

.label {
  color: #909399;
  margin-right: 4px;
}

.value {
  color: #303133;
  font-weight: 500;
}

.description-section,
.detail-files-section,
.review-history-section {
  padding: 12px;
  background: #fafafa;
  border-radius: 6px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #606266;
  margin-bottom: 8px;
}

.section-title-with-toggle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.section-title-with-toggle .section-title {
  margin-bottom: 0;
}

.description-text {
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
}

/* 文件列表 */
.file-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: #fff;
  border-radius: 4px;
  font-size: 14px;
}

.file-name {
  flex: 1;
  color: #303133;
}

.file-size {
  color: #909399;
  font-size: 13px;
}

/* 审核记录 */
.review-record {
  font-size: 14px;
}

.review-action {
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.review-comment {
  color: #606266;
  line-height: 1.5;
}

/* 操作按钮 */
.application-footer {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
}

/* 对话框内容 */
.detail-request-content {
  padding: 12px 0;
}

.detail-request-content p {
  margin-bottom: 16px;
  color: #606266;
}

/* 响应式 */
@media (max-width: 1200px) {
  .stats-section {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .stats-section {
    grid-template-columns: 1fr;
  }

  .info-section {
    grid-template-columns: 1fr;
  }

  .application-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>
