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
        <!-- 团队概要信息（一行显示） -->
        <div class="application-summary">
          <div class="summary-left">
            <h3 class="team-name">{{ app.teamName }}</h3>
            <el-tag :type="getStatusTagType(app.status)" size="small">
              {{ getStatusText(app.status) }}
            </el-tag>
            <span class="summary-info">负责人：{{ app.leader }}</span>
            <span class="summary-info">团队人数：{{ app.memberCount }}人</span>
            <span class="summary-info">申请时间：{{ app.applyTime }}</span>
          </div>
          <div class="summary-right">
            <el-button type="primary" plain @click="handleViewTeamDetail(app)">
              查看详情
            </el-button>
          </div>
        </div>
      </el-card>

      <!-- 空状态 -->
      <el-empty v-if="filteredApplications.length === 0" description="暂无申请团队" />
    </div>

    <!-- 团队详情弹窗 -->
    <el-dialog
      v-model="teamDetailDialogVisible"
      :title="currentTeam?.teamName"
      width="800px"
      class="team-detail-dialog"
    >
      <div v-if="currentTeam" class="team-detail-content">
        <!-- 团队基本信息 -->
        <div class="detail-section">
          <div class="section-title">团队基本信息</div>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">团队负责人：</span>
              <span class="value">{{ currentTeam.leader }}</span>
            </div>
            <div class="info-item">
              <span class="label">团队人数：</span>
              <span class="value">{{ currentTeam.memberCount }} 人</span>
            </div>
            <div class="info-item">
              <span class="label">联系方式：</span>
              <span class="value">{{ currentTeam.contact }}</span>
            </div>
            <div class="info-item">
              <span class="label">申请时间：</span>
              <span class="value">{{ currentTeam.applyTime }}</span>
            </div>
          </div>
        </div>

        <!-- 申请说明 -->
        <div class="detail-section">
          <div class="section-title">申请说明</div>
          <div class="description-text">{{ currentTeam.description }}</div>
        </div>

        <!-- 详细资料 -->
        <div v-if="currentTeam.detailFiles && currentTeam.detailFiles.length > 0" class="detail-section">
          <div class="section-title">详细资料</div>
          <div class="file-list">
            <div v-for="file in currentTeam.detailFiles" :key="file.id" class="file-item">
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
        <div v-if="currentTeam.reviewHistory && currentTeam.reviewHistory.length > 0" class="detail-section">
          <div class="section-title">审核记录</div>
          <el-timeline>
            <el-timeline-item
              v-for="record in currentTeam.reviewHistory"
              :key="record.id"
              :timestamp="record.time"
              :type="record.action === 'approved' || record.action === 'selected' ? 'success' : 'danger'"
            >
              <div class="review-record">
                <div class="review-action">{{ record.actionText }}</div>
                <div class="review-comment">{{ record.comment }}</div>
              </div>
            </el-timeline-item>
          </el-timeline>
        </div>

        <!-- 操作按钮 -->
        <div class="detail-actions">
          <!-- 待审核状态 -->
          <template v-if="currentTeam.status === 'submitted'">
            <div class="action-with-note">
              <el-input
                v-model="actionNote"
                type="textarea"
                :rows="2"
                placeholder="请输入备注信息（选填）"
                class="action-note-input"
              />
              <div class="action-buttons">
                <el-button type="success" @click="handleApproveWithNote(currentTeam)">
                  <el-icon><Select /></el-icon>
                  审核通过
                </el-button>
                <el-button type="danger" @click="handleRejectWithNote(currentTeam)">
                  <el-icon><Close /></el-icon>
                  拒绝申请
                </el-button>
              </div>
            </div>
          </template>

          <!-- 审核通过状态 -->
          <template v-if="currentTeam.status === 'approved'">
            <div class="action-with-note">
              <el-input
                v-model="actionNote"
                type="textarea"
                :rows="2"
                placeholder="请输入备注信息（选填）"
                class="action-note-input"
              />
              <div class="action-buttons">
                <el-button type="success" @click="handleSelectTeamWithNote(currentTeam)">
                  <el-icon><Trophy /></el-icon>
                  选为中标团队
                </el-button>
              </div>
            </div>
          </template>

          <!-- 已中标状态 -->
          <template v-if="currentTeam.status === 'selected'">
            <el-tag type="success" size="large">
              <el-icon><Trophy /></el-icon>
              中标团队
            </el-tag>
          </template>

          <!-- 已拒绝状态 -->
          <template v-if="currentTeam.status === 'rejected'">
            <el-tag type="info" size="large">已拒绝</el-tag>
          </template>
        </div>
      </div>
    </el-dialog>

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
  View
} from '@element-plus/icons-vue'

const props = defineProps({
  projectId: {
    type: String,
    required: true
  }
})

// 团队详情弹窗状态
const teamDetailDialogVisible = ref(false)
const currentTeam = ref(null)
const actionNote = ref('')

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

// 查看团队详情
function handleViewTeamDetail(app) {
  currentTeam.value = app
  actionNote.value = ''
  teamDetailDialogVisible.value = true
}

// 带备注的审核通过
function handleApproveWithNote(app) {
  const note = actionNote.value.trim() || '审核通过'

  app.status = 'approved'
  app.reviewHistory.push({
    id: `r${Date.now()}`,
    time: new Date().toLocaleString('zh-CN'),
    action: 'approved',
    actionText: '审核通过',
    comment: note
  })

  ElMessage.success('已审核通过')

  // 更新弹窗内容
  if (currentTeam.value && currentTeam.value.id === app.id) {
    currentTeam.value = app
  }

  actionNote.value = ''
}

// 带备注的拒绝申请
function handleRejectWithNote(app) {
  const note = actionNote.value.trim()

  if (!note) {
    ElMessage.warning('拒绝申请时必须填写备注信息')
    return
  }

  app.status = 'rejected'
  app.reviewHistory.push({
    id: `r${Date.now()}`,
    time: new Date().toLocaleString('zh-CN'),
    action: 'rejected',
    actionText: '拒绝申请',
    comment: note
  })

  ElMessage.success('已拒绝申请')

  // 更新弹窗内容
  if (currentTeam.value && currentTeam.value.id === app.id) {
    currentTeam.value = app
  }

  actionNote.value = ''
}

// 带备注的选为中标团队
function handleSelectTeamWithNote(app) {
  // 检查是否已经存在中标团队
  const existingSelectedTeam = applications.value.find(a => a.status === 'selected')

  if (existingSelectedTeam) {
    ElMessageBox.alert(
      `已存在中标团队"${existingSelectedTeam.teamName}"，中标团队确定后不可更改。如需更换，请先联系管理员处理。`,
      '无法选择',
      {
        confirmButtonText: '知道了',
        type: 'warning'
      }
    )
    return
  }

  const note = actionNote.value.trim() || '恭喜！您的团队已被选为中标团队'

  ElMessageBox.confirm(
    `确定选择"${app.teamName}"作为中标团队吗？选定后将无法更改。`,
    '确认选择',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // 设置当前团队为中标
    app.status = 'selected'
    app.reviewHistory.push({
      id: `r${Date.now()}`,
      time: new Date().toLocaleString('zh-CN'),
      action: 'selected',
      actionText: '选为中标团队',
      comment: note
    })

    // 更新弹窗内容
    if (currentTeam.value && currentTeam.value.id === app.id) {
      currentTeam.value = app
    }

    ElMessage.success('已选定中标团队')
    actionNote.value = ''
  }).catch(() => {
    // 取消操作
  })
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

    // 如果当前弹窗显示的是该团队，更新弹窗内容
    if (currentTeam.value && currentTeam.value.id === app.id) {
      currentTeam.value = app
    }
  }

  reviewDialogVisible.value = false
}

// 选为中标团队
function handleSelectTeam(app) {
  // 检查是否已经存在中标团队
  const existingSelectedTeam = applications.value.find(a => a.status === 'selected')

  if (existingSelectedTeam) {
    ElMessageBox.alert(
      `已存在中标团队"${existingSelectedTeam.teamName}"，中标团队确定后不可更改。如需更换，请先联系管理员处理。`,
      '无法选择',
      {
        confirmButtonText: '知道了',
        type: 'warning'
      }
    )
    return
  }

  ElMessageBox.confirm(
    `确定选择"${app.teamName}"作为中标团队吗？选定后将无法更改。`,
    '确认选择',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // 设置当前团队为中标
    app.status = 'selected'
    app.reviewHistory.push({
      id: `r${Date.now()}`,
      time: new Date().toLocaleString('zh-CN'),
      action: 'selected',
      actionText: '选为中标团队',
      comment: '恭喜！您的团队已被选为中标团队'
    })

    ElMessage.success('已选定中标团队')
  }).catch(() => {
    // 取消操作
  })
}

// 查看详细资料（已废弃，使用 handleViewTeamDetail 代替）
function handleViewDetail(app) {
  handleViewTeamDetail(app)
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

/* 团队概要信息（一行显示） */
.application-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.summary-left {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
  flex-wrap: wrap;
}

.team-name {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.summary-info {
  font-size: 14px;
  color: #606266;
  padding: 0 12px;
  border-left: 1px solid #dcdfe6;
}

.summary-info:first-of-type {
  border-left: none;
  padding-left: 0;
}

.summary-right {
  flex-shrink: 0;
}

/* 团队详情弹窗 */
.team-detail-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detail-section {
  padding: 16px;
  background: #f5f7fb;
  border-radius: 8px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 12px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
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

/* 弹窗操作按钮 */
.detail-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
}

.action-with-note {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.action-note-input {
  width: 100%;
}

.action-buttons {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
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

  .summary-left {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .summary-info {
    border-left: none;
    padding-left: 0;
  }

  .application-summary {
    flex-direction: column;
    align-items: flex-start;
  }

  .summary-right {
    width: 100%;
  }

  .summary-right .el-button {
    width: 100%;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
