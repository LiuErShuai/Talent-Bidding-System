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

      <!-- 表单主体 -->
      <section class="apply-body">
        <el-form
          ref="applyFormRef"
          :model="applyForm"
          :rules="rules"
          label-width="120px"
          class="apply-form"
        >
          <!-- 揭榜方式 -->
          <el-form-item label="揭榜方式" prop="mode">
            <el-radio-group v-model="applyForm.mode">
              <el-radio label="personal">个人揭榜</el-radio>
              <el-radio label="team">团队揭榜</el-radio>
            </el-radio-group>
          </el-form-item>

          <!-- 团队选择：仅团队揭榜时必选 -->
          <template v-if="applyForm.mode === 'team'">
            <el-divider />
            <el-form-item label="团队选择" prop="teamId">
              <div class="team-select-block">
                <el-select
                  v-model="applyForm.teamId"
                  placeholder="选择已有团队"
                  class="team-select"
                >
                  <el-option
                    v-for="team in teamOptions"
                    :key="team.id"
                    :label="`${team.name}（${team.memberCount}人）`"
                    :value="team.id"
                  />
                  <el-option label="+ 创建新团队" value="new" />
                </el-select>

                <div class="team-radio-list">
                  <el-radio-group v-model="applyForm.teamId">
                    <el-radio
                      v-for="team in teamOptions"
                      :key="team.id"
                      :label="team.id"
                    >
                      {{ team.name }}（{{ team.memberCount }}人）
                    </el-radio>
                    <el-radio label="new">+ 创建新团队</el-radio>
                  </el-radio-group>
                </div>
              </div>
            </el-form-item>
          </template>

          <el-divider />

          <!-- 项目实施方案：必填，至少500字 -->
          <el-form-item label="项目实施方案" prop="plan">
            <el-input
              v-model="applyForm.plan"
              type="textarea"
              autosize
              show-word-limit
              placeholder="请详细描述你/你的团队的实施方案，包括：&#10;1. 技术选型&#10;2. 实施步骤&#10;3. 时间安排&#10;4. 预期成果&#10;（至少500字）"
            />
          </el-form-item>

          <!-- 团队优势说明：必填，至少200字 -->
          <el-form-item label="团队优势说明" prop="advantages">
            <el-input
              v-model="applyForm.advantages"
              type="textarea"
              autosize
              show-word-limit
              placeholder="请说明你的团队的优势，包括：&#10;- 成员技能&#10;- 往期项目经验&#10;- 分工计划&#10;（至少200字）"
            />
          </el-form-item>

          <!-- 成员分工计划：可编辑 -->
          <el-form-item label="成员分工计划">
            <el-input
              v-model="applyForm.division"
              type="textarea"
              autosize
              show-word-limit
              placeholder="请描述每位成员的具体分工（如负责模块、任务等）"
            />
          </el-form-item>

          <!-- 附件上传 -->
          <el-form-item label="附件上传">
            <el-upload
              v-model:file-list="applyForm.attachments"
              action="#"
              multiple
              :limit="5"
              :auto-upload="false"
              :on-exceed="handleExceed"
              :before-upload="handleBeforeUpload"
            >
              <el-button type="primary">选择文件</el-button>
              <template #tip>
                <div class="el-upload__tip">
                  支持 pdf / doc / ppt / zip，单个文件不超过 20MB，最多 5 个。
                </div>
              </template>
            </el-upload>
          </el-form-item>

          <el-divider />

          <!-- 协议勾选 -->
          <el-form-item prop="agree" label-width="0">
            <el-checkbox v-model="applyForm.agree">
              我已阅读并同意
              <a href="javascript:void(0)">《揭榜协议》</a>
              和
              <a href="javascript:void(0)">《平台使用条款》</a>
            </el-checkbox>
          </el-form-item>

          <!-- 底部按钮 -->
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

const route = useRoute()
const router = useRouter()

const projectTitle = ref('项目名称')
const loading = ref(false)
const applyFormRef = ref()

const teamOptions = ref([
  { id: 'team-dev', name: '智能开发小组', memberCount: 4 },
  { id: 'team-ai', name: 'AI创新团队', memberCount: 3 }
])

const applyForm = ref({
  mode: 'team', // personal | team
  teamId: '',
  plan: '',
  advantages: '',
  division: '',
  attachments: [],
  agree: false
})

// 校验：项目实施方案 >= 500 字
const validatePlan = (rule, value, callback) => {
  const len = (value || '').trim().length
  if (!len) {
    callback(new Error('请填写项目实施方案'))
  } else if (len < 500) {
    callback(new Error('项目实施方案至少 500 字'))
  } else {
    callback()
  }
}

// 校验：团队优势说明 >= 200 字
const validateAdvantages = (rule, value, callback) => {
  const len = (value || '').trim().length
  if (!len) {
    callback(new Error('请填写团队优势说明'))
  } else if (len < 200) {
    callback(new Error('团队优势说明至少 200 字'))
  } else {
    callback()
  }
}

// 校验：团队选择（仅团队模式必选）
const validateTeam = (rule, value, callback) => {
  if (applyForm.value.mode === 'team' && !value) {
    callback(new Error('团队揭榜时，请选择一个团队或创建新团队'))
  } else {
    callback()
  }
}

// 校验：必须勾选协议
const validateAgree = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请先阅读并同意相关协议'))
  } else {
    callback()
  }
}

const rules = {
  mode: [{ required: true, message: '请选择揭榜方式', trigger: 'change' }],
  teamId: [{ validator: validateTeam, trigger: 'change' }],
  plan: [{ validator: validatePlan, trigger: 'blur' }],
  advantages: [{ validator: validateAdvantages, trigger: 'blur' }],
  agree: [{ validator: validateAgree, trigger: 'change' }]
}

const handleExceed = () => {
  ElMessage.warning('最多只能上传 5 个附件')
}

const handleBeforeUpload = (file) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/zip',
    'application/x-zip-compressed'
  ]

  const isAllowedType = allowedTypes.includes(file.type)
  const isLt20M = file.size / 1024 / 1024 < 20

  if (!isAllowedType) {
    ElMessage.error('仅支持 pdf / doc / ppt / zip 类型的文件')
    return false
  }

  if (!isLt20M) {
    ElMessage.error('单个文件大小不能超过 20MB')
    return false
  }

  return true
}

const submitApply = async () => {
  if (!applyFormRef.value) return

  try {
    await applyFormRef.value.validate()
    loading.value = true

    // 这里应调用后端 API 提交数据
    setTimeout(() => {
      ElMessage.success('揭榜申请提交成功！')
      router.push('/projects')
    }, 1000)
  } catch (error) {
    // 校验不通过时不做处理，错误提示由规则给出
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
