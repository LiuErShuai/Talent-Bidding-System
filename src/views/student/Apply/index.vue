<template>
  <div class="apply-page">
    <div class="apply-modal">
      <!-- 顶部标题栏 -->
      <header class="apply-header">
        <div class="title-group">
          <h1 class="title">提交揭榜申请 - {{ projectTitle }}</h1>
          <p class="subtitle">请完整填写以下信息，以便企业和平台评估你的团队</p>
        </div>
        <button class="close-btn" @click="goBack">返回</button>
      </header>

      <section class="apply-body">
        <el-form
          ref="applyFormRef"
          :model="applyForm"
          :rules="rules"
          label-width="120px"
          class="apply-form"
        >
          <el-alert
            title="已按后端接口精简为申请说明和附件链接，项目 ID 会根据当前页面自动提交。"
            type="info"
            :closable="false"
            show-icon
            class="form-note"
          />

          <el-form-item label="申请说明" prop="content">
            <el-input
              v-model="applyForm.content"
              type="textarea"
              :rows="8"
              maxlength="1000"
              show-word-limit
              placeholder="请说明团队或个人优势、实施计划和相关经验"
            />
          </el-form-item>

          <el-form-item label="附件链接">
            <el-input
              v-model="applyForm.attachmentUrl"
              placeholder="如有附件，请填写可访问的文件链接（可选）"
              maxlength="500"
              clearable
            />
            <div class="form-note-text">
              当前前端没有独立上传接口，如需附加材料，请先上传到可访问位置后粘贴链接。
            </div>
          </el-form-item>

          <div class="form-actions">
            <el-button @click="goBack">取消</el-button>
            <el-button type="primary" :loading="loading" @click="submitApply">
              提交揭榜申请
            </el-button>
          </div>
        </el-form>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { applyBidAPI, getProjectDetailAPI } from '@/api/project'

const route = useRoute()
const router = useRouter()

const projectTitle = ref('项目名称')
const loading = ref(false)
const applyFormRef = ref()

const createInitialApplyForm = () => ({
  content: '',
  attachmentUrl: ''
})

const applyForm = ref(createInitialApplyForm())

const validateContent = (rule, value, callback) => {
  if (!value || !value.trim()) {
    callback(new Error('请填写申请说明'))
    return
  }
  callback()
}

const rules = {
  content: [{ validator: validateContent, trigger: 'blur' }]
}

const resetApplyForm = () => {
  if (applyFormRef.value) {
    applyFormRef.value.clearValidate()
  }
  applyForm.value = createInitialApplyForm()
}

const submitApply = async () => {
  if (!applyFormRef.value) return

  try {
    await applyFormRef.value.validate()
    loading.value = true

    const projectId = route.params.projectId
    if (!projectId) {
      throw new Error('缺少项目 ID')
    }

    const response = await applyBidAPI({
      projectId,
      content: applyForm.value.content.trim(),
      attachmentUrl: applyForm.value.attachmentUrl.trim()
    })

    if (response.code !== '0000') {
      throw new Error(response.info || '揭榜申请提交失败')
    }

    ElMessage.success('揭榜申请提交成功！')
    resetApplyForm()
    router.push(`/projects/${projectId}`)
  } catch (error) {
    if (error !== false) {
      ElMessage.error(error.message || '提交失败，请稍后重试')
    }
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.back()
}

const loadProjectTitle = async () => {
  const projectId = route.params.projectId
  if (!projectId) {
    ElMessage.error('缺少项目 ID')
    router.push('/projects')
    return
  }

  try {
    const response = await getProjectDetailAPI(projectId)
    if (response.code === '0000' && response.data?.title) {
      projectTitle.value = response.data.title
      return
    }
  } catch (error) {
    console.error('加载项目标题失败:', error)
  }

  projectTitle.value = `项目 ${projectId}`
}

onMounted(() => {
  loadProjectTitle()
})
</script>

<style scoped>
.apply-page {
  min-height: 100vh;
  background: #f5f7fb;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 40px 16px;
}

.apply-modal {
  width: 960px;
  max-width: 100%;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 18px 40px rgba(15, 39, 106, 0.12);
  max-height: calc(100vh - 80px);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  /* 隐藏滚动条，但保留滚动能力 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
}

.apply-modal::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.apply-header {
  padding: 20px 24px;
  border-bottom: 1px solid #edf1fb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
  color: #1b2b5a;
}

.title-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.subtitle {
  margin: 0;
  font-size: 13px;
  opacity: 0.8;
}

.close-btn {
  border: 1px solid #d0d6ea;
  background: #ffffff;
  color: #1b51da;
  padding: 4px 14px;
  border-radius: 999px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
}

.close-btn:hover {
  background: #f0f4ff;
  border-color: #1b51da;
}

.apply-body {
  padding: 24px 24px 20px;
}

.apply-form {
  max-width: 880px;
}

.form-note {
  margin-bottom: 20px;
}

.form-note-text {
  margin-top: 8px;
  font-size: 13px;
  line-height: 1.6;
  color: #606266;
}

/* 禁止用户拖拽调整文本域大小，由 autosize 自动根据内容增高 */
.apply-form :deep(.el-textarea__inner) {
  resize: none;
}

.team-select-block {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.team-select {
  max-width: 320px;
}

.team-radio-list {
  padding: 12px 14px;
  border-radius: 10px;
  background: #f5f7fb;
}

.division-card {
  padding: 12px 14px;
  border-radius: 8px;
  border: 1px dashed #d9d9d9;
  background: #fafafa;
  font-size: 13px;
  color: #555;
}

.division-card p {
  margin: 4px 0;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
}

@media (max-width: 768px) {
  .apply-page {
    padding: 16px;
  }

  .apply-body {
    padding: 16px;
  }

  .apply-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>
