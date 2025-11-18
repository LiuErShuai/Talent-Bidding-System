<template>
  <div class="submit-container">
    <div class="page-header">
      <h1 class="page-title">提交成果</h1>
      <p class="page-subtitle">提交项目完成成果</p>
    </div>
    
    <div class="submit-content">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>项目：{{ projectTitle }}</span>
          </div>
        </template>
        
        <el-form :model="submitForm" :rules="rules" ref="submitFormRef" label-width="120px">
          <el-form-item label="成果标题" prop="title">
            <el-input v-model="submitForm.title" placeholder="请输入成果标题" />
          </el-form-item>
          
          <el-form-item label="成果描述" prop="description">
            <el-input v-model="submitForm.description" type="textarea" :rows="4" placeholder="详细描述项目完成情况和成果" />
          </el-form-item>
          
          <el-form-item label="完成度" prop="completion">
            <el-slider v-model="submitForm.completion" show-stops :step="10" />
            <span style="margin-left: 20px;">{{ submitForm.completion }}%</span>
          </el-form-item>
          
          <el-form-item label="附件" prop="attachments">
            <el-upload
              v-model:file-list="submitForm.attachments"
              action="#"
              multiple
              :limit="10"
            >
              <el-button type="primary">上传文件</el-button>
              <template #tip>
                <div class="el-upload__tip">
                  可上传源代码、文档、演示视频等，单个文件不超过50MB
                </div>
              </template>
            </el-upload>
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" @click="submitResult" :loading="loading">提交成果</el-button>
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
const submitFormRef = ref()

const submitForm = ref({
  title: '',
  description: '',
  completion: 100,
  attachments: []
})

const rules = {
  title: [{ required: true, message: '请输入成果标题', trigger: 'blur' }],
  description: [{ required: true, message: '请输入成果描述', trigger: 'blur' }],
  completion: [{ required: true, message: '请设置完成度', trigger: 'change' }]
}

const submitResult = async () => {
  if (!submitFormRef.value) return
  
  try {
    await submitFormRef.value.validate()
    loading.value = true
    
    // 模拟提交
    setTimeout(() => {
      ElMessage.success('成果提交成功！等待审核')
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
.submit-container {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;
}

.page-header {
  text-align: center;
  margin-bottom: 30px;
}

.submit-content {
  max-width: 800px;
  margin: 0 auto;
}
</style>