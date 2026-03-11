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
      <el-table-column prop="projectId" label="项目编号" width="100" />
      <el-table-column prop="title" label="项目标题" min-width="200" />
      <el-table-column prop="enterpriseName" label="发布企业" width="150" />
      <el-table-column prop="budget" label="预算(元)" width="120" />
      <el-table-column prop="createdAt" label="申请时间" width="180" />
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
    <el-dialog v-model="detailVisible" title="项目详情" width="60%">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="项目编号">{{ currentProject.projectId }}</el-descriptions-item>
        <el-descriptions-item label="项目标题">{{ currentProject.title }}</el-descriptions-item>
        <el-descriptions-item label="发布企业">{{ currentProject.enterpriseName }}</el-descriptions-item>
        <el-descriptions-item label="预算">{{ currentProject.budget }} 元</el-descriptions-item>
        <el-descriptions-item label="申请时间" :span="2">{{ currentProject.createdAt }}</el-descriptions-item>
        <el-descriptions-item label="项目描述" :span="2">{{ currentProject.description }}</el-descriptions-item>
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
import { getAdminPendingProjectsAPI, approveProjectAPI, rejectProjectAPI } from '@/api/project'

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
    tableData.value = res.data.projects || []
    pagination.total = res.data.total || 0
  } catch (error) {
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

// 查看详情
const handleViewDetail = (row) => {
  currentProject.value = row
  detailVisible.value = true
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
</style>
