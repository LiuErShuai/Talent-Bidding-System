<template>
  <div class="project-review">
    <div class="page-header">
      <h2>项目审核管理</h2>
    </div>

    <el-table
      v-loading="loading"
      :data="tableData"
      stripe
      style="width: 100%"
    >
      <el-table-column label="项目编号" width="180">
        <template #default="{ row }">
          <div class="id-cell" @mouseenter="row.showCopy = true" @mouseleave="row.showCopy = false">
            <span>{{ formatId(row.projectId) }}</span>
            <el-icon v-show="row.showCopy" class="copy-icon" @click="copyId(row.projectId)">
              <DocumentCopy />
            </el-icon>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="项目标题" min-width="200" />
      <el-table-column prop="publisherName" label="发布企业" width="150" />
      <el-table-column label="项目状态" width="120">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">
            {{ getStatusText(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="budgetAmount" label="预算(元)" width="120" />
      <el-table-column prop="createTime" label="申请时间" width="180" />
      <el-table-column label="操作" width="280" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="handleViewDetail(row)">查看详情</el-button>
          <el-button type="success" size="small" @click="handleApprove(row)">审核通过</el-button>
          <el-button type="danger" size="small" @click="handleReject(row)">拒绝</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      v-model:current-page="pagination.currentPage"
      v-model:page-size="pagination.pageSize"
      :total="pagination.total"
      :page-sizes="[10, 20, 50]"
      layout="total, sizes, prev, pager, next, jumper"
      @current-change="fetchData"
      @size-change="fetchData"
      style="margin-top: 20px; justify-content: center"
    />

    <!-- 详情对话框 -->
    <el-dialog v-model="detailVisible" title="项目详情" width="70%">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="项目编号">{{ currentProject.projectId }}</el-descriptions-item>
        <el-descriptions-item label="项目状态">
          <el-tag :type="getStatusType(currentProject.status)">
            {{ getStatusText(currentProject.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="项目标题" :span="2">{{ currentProject.title }}</el-descriptions-item>
        <el-descriptions-item label="发布企业">{{ currentProject.publisherName }}</el-descriptions-item>
        <el-descriptions-item label="企业ID">{{ currentProject.publisherId }}</el-descriptions-item>
        <el-descriptions-item label="项目分类">{{ currentProject.categoryId || '未分类' }}</el-descriptions-item>
        <el-descriptions-item label="技能等级">{{ currentProject.skillLevel || '-' }}</el-descriptions-item>
        <el-descriptions-item label="团队规模">{{ currentProject.teamSizeMin }}-{{ currentProject.teamSizeMax }}人</el-descriptions-item>
        <el-descriptions-item label="项目周期">{{ currentProject.durationDays }}天</el-descriptions-item>
        <el-descriptions-item label="预算类型">{{ currentProject.budgetType || '-' }}</el-descriptions-item>
        <el-descriptions-item label="预算金额">{{ currentProject.budgetAmount }} {{ currentProject.currency }}</el-descriptions-item>
        <el-descriptions-item label="申请截止时间" :span="2">{{ currentProject.applicationDeadline }}</el-descriptions-item>
        <el-descriptions-item label="预计开始日期">{{ currentProject.expectedStartDate }}</el-descriptions-item>
        <el-descriptions-item label="预计结束日期">{{ currentProject.expectedEndDate }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ currentProject.createTime }}</el-descriptions-item>
        <el-descriptions-item label="更新时间">{{ currentProject.updateTime }}</el-descriptions-item>
        <el-descriptions-item label="项目标签" :span="2">
          <el-tag v-for="tag in (currentProject.tags || [])" :key="tag" style="margin-right: 8px">{{ tag }}</el-tag>
          <span v-if="!currentProject.tags || currentProject.tags.length === 0">暂无标签</span>
        </el-descriptions-item>
        <el-descriptions-item label="项目描述" :span="2">{{ currentProject.description }}</el-descriptions-item>
        <el-descriptions-item label="项目要求" :span="2">{{ currentProject.requirements || '无特殊要求' }}</el-descriptions-item>
        <el-descriptions-item v-if="currentProject.rejectReason" label="拒绝原因" :span="2">
          <span style="color: #f56c6c">{{ currentProject.rejectReason }}</span>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>

    <!-- 拒绝对话框 -->
    <el-dialog v-model="rejectVisible" title="拒绝项目" width="500px">
      <el-form>
        <el-form-item label="拒绝原因">
          <el-input
            v-model="rejectReason"
            type="textarea"
            :rows="4"
            placeholder="请输入拒绝原因"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="rejectVisible = false">取消</el-button>
        <el-button type="primary" @click="submitReject">确认拒绝</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { DocumentCopy } from '@element-plus/icons-vue'
import { getAdminPendingProjectsAPI, approveProjectAPI, rejectProjectAPI, getAdminProjectDetailAPI } from '@/api/project'

const loading = ref(false)
const tableData = ref([])
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

const detailVisible = ref(false)
const rejectVisible = ref(false)
const currentProject = ref({})
const rejectReason = ref('')

// 获取待审核项目列表
const fetchData = async () => {
  loading.value = true
  try {
    const res = await getAdminPendingProjectsAPI({
      pageNum: pagination.currentPage,
      pageSize: pagination.pageSize
    })
    const list = res.data.projects || []
    tableData.value = list.map(item => ({
      projectId: item.projectId,
      title: item.title,
      publisherName: item.publisherName,
      status: item.status,
      budgetAmount: item.budgetAmount,
      createTime: item.createTime
    }))
    pagination.total = res.data.total || 0
  } catch (error) {
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

// 查看详情
const handleViewDetail = async (row) => {
  try {
    const res = await getAdminProjectDetailAPI(row.projectId)
    currentProject.value = res.data
    detailVisible.value = true
  } catch (error) {
    ElMessage.error('加载项目详情失败')
  }
}

// 审核通过
const handleApprove = async (row) => {
  await ElMessageBox.confirm(`确认审核通过项目「${row.title}」？`, '审核确认', {
    confirmButtonText: '确认通过',
    cancelButtonText: '取消',
    type: 'success'
  })
  try {
    await approveProjectAPI(row.projectId)
    ElMessage.success('审核通过')
    fetchData()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

// 拒绝项目
const handleReject = (row) => {
  currentProject.value = row
  rejectVisible.value = true
  rejectReason.value = ''
}

// 提交拒绝
const submitReject = async () => {
  if (!rejectReason.value.trim()) {
    ElMessage.warning('请输入拒绝原因')
    return
  }
  try {
    await rejectProjectAPI({
      projectId: currentProject.value.projectId,
      rejectReason: rejectReason.value
    })
    ElMessage.success('已拒绝')
    rejectVisible.value = false
    fetchData()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}

// 格式化项目ID显示
const formatId = (id) => {
  if (!id || id.length <= 10) return id
  return `${id.slice(0, 6)}...${id.slice(-4)}`
}

// 复制项目ID
const copyId = async (id) => {
  try {
    await navigator.clipboard.writeText(id)
    ElMessage.success('ID已复制')
  } catch (error) {
    ElMessage.error('复制失败')
  }
}

// 获取状态标签类型
const getStatusType = (status) => {
  const typeMap = {
    pending_review: 'warning',
    approved: 'success',
    rejected: 'danger',
    draft: 'info'
  }
  return typeMap[status] || 'info'
}

// 获取状态文本
const getStatusText = (status) => {
  const textMap = {
    pending_review: '待审核',
    approved: '已通过',
    rejected: '已拒绝',
    draft: '草稿'
  }
  return textMap[status] || '未知'
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.project-review {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
  font-size: 24px;
  color: #303133;
}

.id-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.copy-icon {
  cursor: pointer;
  color: #409eff;
  font-size: 16px;
}

.copy-icon:hover {
  color: #66b1ff;
}
</style>
