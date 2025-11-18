<template>
  <div class="evaluation-container">
    <div class="page-header">
      <h1 class="page-title">项目评估</h1>
      <p class="page-subtitle">项目成果评估与反馈</p>
    </div>
    
    <div class="evaluation-content">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>项目：{{ projectTitle }}</span>
            <el-tag type="success">待评估</el-tag>
          </div>
        </template>
        
        <el-form :model="evaluationForm" :rules="rules" ref="evaluationFormRef" label-width="120px">
          <el-form-item label="完成质量" prop="quality">
            <el-rate v-model="evaluationForm.quality" show-text />
          </el-form-item>
          
          <el-form-item label="按时完成" prop="timeliness">
            <el-rate v-model="evaluationForm.timeliness" show-text />
          </el-form-item>
          
          <el-form-item label="沟通能力" prop="communication">
            <el-rate v-model="evaluationForm.communication" show-text />
          </el-form-item>
          
          <el-form-item label="专业水平" prop="professionalism">
            <el-rate v-model="evaluationForm.professionalism" show-text />
          </el-form-item>
          
          <el-form-item label="总体评价" prop="overall">
            <el-rate v-model="evaluationForm.overall" show-text />
          </el-form-item>
          
          <el-form-item label="详细评价" prop="comment">
            <el-input v-model="evaluationForm.comment" type="textarea" :rows="4" placeholder="请详细描述项目的完成情况和建议" />
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" @click="submitEvaluation" :loading="loading">提交评估</el-button>
            <el-button @click="goBack">取消</el-button>
          </el-form-item>
        </el-form>
      </el-card>
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
const evaluationFormRef = ref()

const evaluationForm = ref({
  quality: 0,
  timeliness: 0,
  communication: 0,
  professionalism: 0,
  overall: 0,
  comment: ''
})

const rules = {
  quality: [{ required: true, message: '请评价完成质量', trigger: 'change' }],
  overall: [{ required: true, message: '请给出总体评价', trigger: 'change' }],
  comment: [{ required: true, message: '请输入详细评价', trigger: 'blur' }]
}

const submitEvaluation = async () => {
  if (!evaluationFormRef.value) return
  
  try {
    await evaluationFormRef.value.validate()
    loading.value = true
    
    // 模拟提交
    setTimeout(() => {
      ElMessage.success('评估提交成功！')
      router.push('/my-projects')
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
  const projectId = route.params.projectId
  if (projectId) {
    projectTitle.value = `项目 ${projectId}`
  }
})
</script>

<style scoped>
.evaluation-container {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;
}

.page-header {
  text-align: center;
  margin-bottom: 30px;
}

.evaluation-content {
  max-width: 800px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>