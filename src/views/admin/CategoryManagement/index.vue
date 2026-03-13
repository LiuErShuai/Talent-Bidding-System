<template>
  <div class="category-management">
    <div class="page-header">
      <h2>项目分类管理</h2>
      <el-button type="primary" @click="handleCreate">新建分类</el-button>
    </div>

    <el-table
      v-loading="loading"
      :data="tableData"
      stripe
      style="width: 100%"
    >
      <el-table-column prop="name" label="分类名称" width="150" />
      <el-table-column prop="parentName" label="父分类" width="150" />
      <el-table-column prop="description" label="描述" min-width="200" />
      <el-table-column prop="icon" label="图标" width="100" />
      <el-table-column prop="sortOrder" label="排序" width="80" />
      <el-table-column label="可见性" width="100">
        <template #default="{ row }">
          <el-tag :type="row.isVisible ? 'success' : 'info'">
            {{ row.isVisible ? '可见' : '隐藏' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.isActive ? 'success' : 'danger'">
            {{ row.isActive ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <el-button size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新建/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑分类' : '新建分类'"
      width="600px"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="120px"
      >
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="父分类" prop="parentId">
          <el-select v-model="formData.parentId" placeholder="请选择父分类" clearable style="width: 100%">
            <el-option label="无" :value="null" />
            <el-option
              v-for="item in tableData"
              :key="item.categoryId"
              :label="item.name"
              :value="item.categoryId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="formData.description" type="textarea" :rows="3" placeholder="请输入分类描述" />
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model="formData.icon" placeholder="请输入图标名称" />
        </el-form-item>
        <el-form-item label="排序" prop="sortOrder">
          <el-input-number v-model="formData.sortOrder" :min="0" />
        </el-form-item>
        <el-form-item label="可见性" prop="isVisible">
          <el-switch v-model="formData.isVisible" />
        </el-form-item>
        <el-form-item label="状态" prop="isActive">
          <el-switch v-model="formData.isActive" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const tableData = ref([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref(null)

const formData = reactive({
  categoryId: null,
  name: '',
  parentId: null,
  description: '',
  icon: '',
  sortOrder: 0,
  isVisible: true,
  isActive: true
})

const formRules = {
  name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
}

const fetchData = async () => {
  loading.value = true
  try {
    // TODO: 调用API获取分类列表
    tableData.value = []
  } catch (error) {
    ElMessage.error('获取数据失败')
  } finally {
    loading.value = false
  }
}

const handleCreate = () => {
  isEdit.value = false
  Object.assign(formData, {
    categoryId: null,
    name: '',
    parentId: null,
    description: '',
    icon: '',
    sortOrder: 0,
    isVisible: true,
    isActive: true
  })
  dialogVisible.value = true
}

const handleEdit = (row) => {
  isEdit.value = true
  Object.assign(formData, row)
  dialogVisible.value = true
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        // TODO: 调用API保存数据
        ElMessage.success(isEdit.value ? '编辑成功' : '创建成功')
        dialogVisible.value = false
        fetchData()
      } catch (error) {
        ElMessage.error('操作失败')
      }
    }
  })
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('确定要删除该分类吗？', '提示', {
      type: 'warning'
    })
    // TODO: 调用API删除数据
    ElMessage.success('删除成功')
    fetchData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.category-management {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 500;
}
</style>
