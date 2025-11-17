<template>
  <div class="apply-container">
    <div class="page-header">
      <h1 class="page-title">项目申请</h1>
      <p class="page-subtitle">申请参与项目揭榜</p>
    </div>
    
    <div class="apply-content">
      <el-alert type="info" show-icon>
        您正在申请项目：{{ projectTitle }}
      </el-alert>
      
      <el-form :model="applyForm" :rules="rules" ref="applyFormRef" label-width="100px">
        <el-form-item label="申请理由" prop="reason">
          <el-input v-model="applyForm.reason" type="textarea" :rows="4" placeholder="请详细说明您申请该项目的理由和能力" />
        </el-form-item>
        
        <el-form-item label="预计工时" prop="estimatedHours">
          <el-input-number v-model="applyForm.estimatedHours" :min="1" :max="1000" />
          <span class="unit">小时</span>
        </el-form-item>
        
        <el-form-item label="报价" prop="price">
          <el-input-number v-model="applyForm.price" :min="0" :precision="2" />
          <span class="unit">元</span>
        </el-form-item>
        
        <el-form-item label="附件" prop="attachments">
          <el-upload
            v-model:file-list="applyForm.attachments"
            action="#"
            multiple
            :limit="5"
            :on-exceed="handleExceed"
          >
            <el-button type="primary">点击上传</el-button>
            <template #tip>
              <div class="el-upload__tip">
                可上传简历、作品集等文件，单个文件不超过10MB
              </div>
            </template>
          </el-upload>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="submitApply" :loading="loading">提交申请</el-button>
          <el-button @click="goBack">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()

const projectTitle = ref('项目名称')
const loading = ref(false)
const applyFormRef = ref()

const applyForm = ref({
  reason: '',
  estimatedHours: 80,
  price: 5000,
  attachments: []
})

const rules = {
  reason: [{ required: true, message: '请输入申请理由', trigger: 'blur' }],
  estimatedHours: [{ required: true, message: '请输入预计工时', trigger: 'blur' }],
  price: [{ required: true, message: '请输入报价', trigger: 'blur' }]
}

const handleExceed = () => {
  ElMessage.warning('最多只能上传5个文件')
}

const submitApply = async () => {
  if (!applyFormRef.value) return
  
  try {
    await applyFormRef.value.validate()
    loading.value = true
    
    // 模拟提交
    setTimeout(() => {
      ElMessage.success('申请提交成功！')
      router.push('/projects')
    }, 1000)
  } catch (error) {
    console.error('表单验证失败:', error)
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.back()
}

onMounted(() => {
  // 根据路由参数获取项目信息
  const projectId = route.params.projectId
  if (projectId) {
    projectTitle.value = `项目 ${projectId}`
  }
})
</script>

<style scoped>
.apply-container {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;
}

.page-header {
  text-align: center;
  margin-bottom: 30px;
}

.apply-content {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.unit {
  margin-left: 10px;
  color: #666;
}
</style>