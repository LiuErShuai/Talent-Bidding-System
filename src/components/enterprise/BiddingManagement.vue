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
        <el-radio-button value="applied">待审核 ({{ submittedCount }})</el-radio-button>
        <el-radio-button value="shortlisted">已入围 ({{ approvedCount }})</el-radio-button>
        <el-radio-button value="rejected">已拒绝 ({{ rejectedCount }})</el-radio-button>
        <el-radio-button value="confirmed">已中标 ({{ selectedCount }})</el-radio-button>
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
              :type="record.action === 'shortlisted' || record.action === 'confirmed' ? 'success' : 'danger'"
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
          <template v-if="currentTeam.status === 'applied'">
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

          <!-- 审核通过状态（已入围） -->
          <template v-if="currentTeam.status === 'shortlisted'">
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
          <template v-if="currentTeam.status === 'confirmed'">
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

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  User,
  Select,
  Clock,
  Trophy,
  Document,
  Download,
  Close
} from '@element-plus/icons-vue'
import {
  getProjectBidsAPI,
  shortlistBidAPI,
  confirmBidAPI,
  rejectBidAPI,
  getTeamDetailAPI
} from '@/api/project'

const emit = defineEmits(['refresh'])

const props = defineProps({
  projectId: {
    type: String,
    required: true
  }
})

// Mock 数据（接口失败兜底）
const MOCK_APPLICATIONS = [
  {
    id: 'app-001',
    teamName: '创新科技团队',
    leader: '--',
    memberCount: 5,
    contact: '--',
    applyTime: '2025-11-01 10:30',
    description: '我们是一支经验丰富的AI开发团队，曾参与多个智能客服项目的开发。',
    status: 'confirmed',
    detailFiles: [],
    reviewHistory: []
  },
  {
    id: 'app-002',
    teamName: '智能开发小组',
    leader: '--',
    memberCount: 4,
    contact: '--',
    applyTime: '2025-11-01 11:20',
    description: '我们团队专注于人工智能领域，有丰富的机器学习和深度学习项目经验。',
    status: 'applied',
    detailFiles: [],
    reviewHistory: []
  }
]

// 状态
const applications = ref([])
const loading = ref(false)
const actionLoading = ref(false)
const teamDetailDialogVisible = ref(false)
const currentTeam = ref(null)
const actionNote = ref('')
const filterStatus = ref('all')

// 计算属性
const submittedCount = computed(() => applications.value.filter(app => app.status === 'applied').length)
const pendingCount = computed(() => submittedCount.value)
const approvedCount = computed(() => applications.value.filter(app => app.status === 'shortlisted').length)
const rejectedCount = computed(() => applications.value.filter(app => app.status === 'rejected').length)
const selectedCount = computed(() => applications.value.filter(app => app.status === 'confirmed').length)
const selectedTeam = computed(() => applications.value.find(app => app.status === 'confirmed'))

const filteredApplications = computed(() => {
  if (filterStatus.value === 'all') return applications.value
  return applications.value.filter(app => app.status === filterStatus.value)
})

// 将后端 bid + teamDetail 映射为组件数据结构
function mapBidToApplication(bid, teamDetail) {
  // 附件：将单个 URL 转为文件数组
  const detailFiles = []
  if (bid.attachmentUrl) {
    const fileName = bid.attachmentUrl.split('/').pop() || '附件'
    detailFiles.push({ id: bid.bidId, name: fileName, url: bid.attachmentUrl })
  }

  return {
    id: bid.bidId,
    teamName: teamDetail?.teamName || '未知团队',
    leader: '--',
    memberCount: teamDetail?.memberCount || 0,
    contact: '--',
    applyTime: bid.createdAt ? new Date(bid.createdAt).toLocaleString('zh-CN') : '--',
    description: bid.content || '',
    status: bid.status || 'applied',
    detailFiles,
    reviewHistory: []
  }
}

// 加载竞榜列表
async function loadApplications() {
  loading.value = true
  try {
    const res = await getProjectBidsAPI(props.projectId, { pageNum: 1, pageSize: 200 })
    const data = res?.data ?? res
    const bids = Array.isArray(data?.bids) ? data.bids : Array.isArray(data) ? data : []

    if (bids.length === 0) {
      applications.value = []
      return
    }

    // 收集唯一 teamId，并发请求团队详情
    const teamIds = [...new Set(bids.map(b => b.teamId).filter(Boolean))]
    const teamResults = await Promise.allSettled(
      teamIds.map(id => getTeamDetailAPI(id))
    )

    // 构建 teamId → teamDetail 映射表
    const teamMap = {}
    teamIds.forEach((id, index) => {
      if (teamResults[index].status === 'fulfilled') {
        const teamData = teamResults[index].value
        teamMap[id] = teamData?.data ?? teamData
      }
    })

    applications.value = bids.map(bid => mapBidToApplication(bid, teamMap[bid.teamId]))
  } catch (error) {
    console.error('加载竞榜列表失败：', error)
    ElMessage.error('加载竞榜列表失败，已切换为默认数据')
    applications.value = MOCK_APPLICATIONS
  } finally {
    loading.value = false
  }
}

// 查看团队详情
function handleViewTeamDetail(app) {
  currentTeam.value = app
  actionNote.value = ''
  teamDetailDialogVisible.value = true
}

// 审核通过（入围）
async function handleApproveWithNote(app) {
  if (actionLoading.value) return
  actionLoading.value = true
  try {
    const remark = actionNote.value.trim() || undefined
    await shortlistBidAPI({ bidId: app.id, remark })
    ElMessage.success('已审核通过，团队已入围')
    teamDetailDialogVisible.value = false
    await loadApplications()
    emit('refresh')
  } catch (error) {
    console.error('入围操作失败：', error)
    ElMessage.error('操作失败，请重试')
  } finally {
    actionLoading.value = false
    actionNote.value = ''
  }
}

// 拒绝申请
async function handleRejectWithNote(app) {
  const note = actionNote.value.trim()
  if (!note) {
    ElMessage.warning('拒绝申请时必须填写备注信息')
    return
  }
  if (actionLoading.value) return
  actionLoading.value = true
  try {
    await rejectBidAPI({ bidId: app.id, remark: note })
    ElMessage.success('已拒绝申请')
    teamDetailDialogVisible.value = false
    await loadApplications()
    emit('refresh')
  } catch (error) {
    console.error('拒绝操作失败：', error)
    ElMessage.error('操作失败，请重试')
  } finally {
    actionLoading.value = false
    actionNote.value = ''
  }
}

// 选为中标团队
async function handleSelectTeamWithNote(app) {
  const existingSelectedTeam = applications.value.find(a => a.status === 'confirmed')
  if (existingSelectedTeam) {
    ElMessageBox.alert(
      `已存在中标团队"${existingSelectedTeam.teamName}"，中标团队确定后不可更改。如需更换，请先联系管理员处理。`,
      '无法选择',
      { confirmButtonText: '知道了', type: 'warning' }
    )
    return
  }

  try {
    await ElMessageBox.confirm(
      `确定选择"${app.teamName}"作为中标团队吗？选定后将无法更改。`,
      '确认选择',
      { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
    )
  } catch {
    return // 用户取消
  }

  if (actionLoading.value) return
  actionLoading.value = true
  try {
    const remark = actionNote.value.trim() || undefined
    await confirmBidAPI({ bidId: app.id, remark })
    ElMessage.success('已选定中标团队')
    teamDetailDialogVisible.value = false
    await loadApplications()
    emit('refresh')
  } catch (error) {
    console.error('确认中标操作失败：', error)
    ElMessage.error('操作失败，请重试')
  } finally {
    actionLoading.value = false
    actionNote.value = ''
  }
}

// 状态标签类型
function getStatusTagType(status) {
  const map = { applied: 'warning', shortlisted: 'success', rejected: 'info', confirmed: 'success' }
  return map[status] || 'info'
}

// 状态文本
function getStatusText(status) {
  const map = { applied: '待审核', shortlisted: '已入围', rejected: '已拒绝', confirmed: '已中标' }
  return map[status] || '未知'
}

// 筛选变化（逻辑已通过计算属性实现）
function handleFilterChange() {}

// 下载文件
function handleDownloadFile(file) {
  if (file.url) {
    window.open(file.url, '_blank')
  } else {
    ElMessage.info('暂无下载链接')
  }
}

onMounted(() => {
  loadApplications()
})
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
