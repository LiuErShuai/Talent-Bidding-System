<template>
  <div class="submit-page">
    <div class="submit-modal">
      <!-- 顶部标题栏 -->
      <header class="submit-header">
        <div class="title-group">
          <h1 class="title">提交项目成果 - {{ projectTitle }}</h1>
          <p class="subtitle">请完整填写以下信息，以便进行项目评审</p>
        </div>
        <button class="back-btn" @click="goBack">返回</button>
      </header>

      <!-- 主体内容 -->
      <section class="submit-body">
        <!-- 项目信息 -->
        <section class="project-info-card">
          <div class="project-info-header">
            <div class="project-info-title">
              <span class="dot"></span>
              <h2 class="section-title">项目信息</h2>
            </div>
            <span class="project-tag">进行中</span>
          </div>
          <div class="info-grid">
            <div class="info-row wide">
              <span class="info-label">项目名称</span>
              <span class="info-value project-name">{{ projectTitle }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">项目编号</span>
              <span class="info-value mono">{{ projectCode }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">发布方</span>
              <span class="info-value">{{ projectPublisher }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">截止时间</span>
              <span class="info-value">{{ projectDeadline }}</span>
            </div>
          </div>
        </section>

        <el-divider />

        <!-- 表单 -->
        <el-form
          ref="submitFormRef"
          :model="submitForm"
          :rules="rules"
          label-width="120px"
          class="submit-form"
        >
          <!-- 成果标题 -->
          <el-form-item label="成果标题" prop="title">
            <el-input
              v-model="submitForm.title"
              placeholder="请输入成果标题，例如：基于BERT的智能客服对话系统"
            />
          </el-form-item>

          <!-- 成果描述 -->
          <el-form-item label="成果描述" prop="description">
            <el-input
              v-model="submitForm.description"
              type="textarea"
              autosize
              show-word-limit
              placeholder="请详细描述你的成果，包括：&#10;1. 实现的功能&#10;2. 使用的技术&#10;3. 创新点&#10;4. 测试情况&#10;（至少800字）"
            />
          </el-form-item>

          <!-- 源代码包 -->
          <el-form-item label="源代码包" required>
            <div class="upload-block">
              <div class="upload-title">
                <span class="emoji">📦</span>
                <span class="text">源代码包（必需）</span>
              </div>
              <el-upload
                v-model:file-list="submitForm.codeFiles"
                action="#"
                drag
                :auto-upload="false"
                :limit="1"
                :before-upload="beforeCodeUpload"
              >
                <el-icon class="upload-icon"><UploadFilled /></el-icon>
                <div class="el-upload__text">
                  拖拽文件到此处，或 <em>点击上传</em>
                </div>
                <template #tip>
                  <div class="el-upload__tip">
                    支持格式：.zip / .rar / .7z，单个文件最大 500MB
                  </div>
                </template>
              </el-upload>
            </div>
          </el-form-item>

          <!-- 项目文档 -->
          <el-form-item label="项目文档" required>
            <div class="upload-block">
              <div class="upload-title">
                <span class="emoji">📄</span>
                <span class="text">项目文档（必需）</span>
              </div>
              <el-upload
                v-model:file-list="submitForm.docFiles"
                action="#"
                multiple
                :limit="5"
                :auto-upload="false"
                :before-upload="beforeDocUpload"
              >
                <el-button type="primary">上传文档</el-button>
                <template #tip>
                  <div class="el-upload__tip">
                    建议上传设计文档、部署说明、用户手册等，单个文件不超过 100MB
                  </div>
                </template>
              </el-upload>
            </div>
          </el-form-item>

          <!-- 演示视频 -->
          <el-form-item label="演示视频">
            <div class="upload-block">
              <div class="upload-title">
                <span class="emoji">🎬</span>
                <span class="text">演示视频（可选）</span>
              </div>
              <el-upload
                v-model:file-list="submitForm.videoFiles"
                action="#"
                :limit="1"
                :auto-upload="false"
                :before-upload="beforeVideoUpload"
              >
                <el-button>上传视频文件</el-button>
                <template #tip>
                  <div class="el-upload__tip">
                    支持格式：.mp4 / .avi / .mov，单个文件最大 1GB
                  </div>
                </template>
              </el-upload>
              <div class="video-link-row">
                <span class="video-label">或视频链接：</span>
                <el-input
                  v-model="submitForm.videoUrl"
                  placeholder="例如：https://video.example.com/..."
                  clearable
                />
              </div>
            </div>
          </el-form-item>

          <!-- 在线演示地址 -->
          <el-form-item label="在线演示地址">
            <el-input
              v-model="submitForm.demoUrl"
              placeholder="例如：https://demo.example.com"
              clearable
            />
          </el-form-item>

          <!-- 技术栈标签 -->
          <el-form-item label="技术栈标签">
            <div class="tags-block">
              <el-input
                v-model="tagInput"
                placeholder="输入后回车添加标签，例如：Python"
                size="small"
                @keyup.enter="addTag"
              />
              <div class="tag-list">
                <el-tag
                  v-for="tag in submitForm.tags"
                  :key="tag"
                  closable
                  @close="removeTag(tag)"
                >
                  {{ tag }}
                </el-tag>
              </div>
            </div>
          </el-form-item>

          <el-divider />

          <!-- 协议勾选 -->
          <el-form-item label-width="0">
            <div class="agreements">
              <el-checkbox v-model="submitForm.originalConfirm">
                我确认提交的成果为本人/团队原创，不存在抄袭等违规行为
              </el-checkbox>
              <el-checkbox v-model="submitForm.displayConfirm">
                我同意将成果用于项目评审和展示
              </el-checkbox>
            </div>
          </el-form-item>

          <!-- 底部按钮 -->
          <div class="form-actions">
            <el-button @click="saveDraft">保存草稿</el-button>
            <el-button @click="previewResult">预览</el-button>
            <el-button type="primary" :loading="loading" @click="submitResult">
              提交成果
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
import { UploadFilled } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

const projectTitle = ref('项目名称')
const projectCode = ref('202511080001')
const projectPublisher = ref('XX科技有限公司')
const projectDeadline = ref('2025-11-15 23:59:59')

const loading = ref(false)
const submitFormRef = ref()
const tagInput = ref('')

const submitForm = ref({
  title: '',
  description: '',
  codeFiles: [],
  docFiles: [],
  videoFiles: [],
  videoUrl: '',
  demoUrl: '',
  tags: ['Python', 'TensorFlow', 'BERT', 'Flask', 'Vue.js'],
  originalConfirm: false,
  displayConfirm: false
})

// 成果描述校验：至少 800 字
const validateDescription = (rule, value, callback) => {
  const len = (value || '').trim().length
  if (!len) {
    callback(new Error('请输入成果描述'))
  } else if (len < 800) {
    callback(new Error('成果描述至少 800 字'))
  } else {
    callback()
  }
}

const rules = {
  title: [{ required: true, message: '请输入成果标题', trigger: 'blur' }],
  description: [{ validator: validateDescription, trigger: 'blur' }]
}

// 源代码包校验
const beforeCodeUpload = (file) => {
  const ext = file.name.split('.').pop()?.toLowerCase()
  const allowed = ['zip', 'rar', '7z']
  const isAllowed = allowed.includes(ext)
  const isLt500M = file.size / 1024 / 1024 < 500

  if (!isAllowed) {
    ElMessage.error('源代码包仅支持 .zip / .rar / .7z 格式')
    return false
  }
  if (!isLt500M) {
    ElMessage.error('源代码包大小不能超过 500MB')
    return false
  }
  return true
}

// 文档校验
const beforeDocUpload = (file) => {
  const ext = file.name.split('.').pop()?.toLowerCase()
  const allowed = ['pdf', 'doc', 'docx']
  const isAllowed = allowed.includes(ext)
  const isLt100M = file.size / 1024 / 1024 < 100

  if (!isAllowed) {
    ElMessage.error('项目文档仅支持 .pdf / .doc / .docx 格式')
    return false
  }
  if (!isLt100M) {
    ElMessage.error('单个文档大小不能超过 100MB')
    return false
  }
  return true
}

// 视频校验
const beforeVideoUpload = (file) => {
  const ext = file.name.split('.').pop()?.toLowerCase()
  const allowed = ['mp4', 'avi', 'mov']
  const isAllowed = allowed.includes(ext)
  const isLt1G = file.size / 1024 / 1024 < 1024

  if (!isAllowed) {
    ElMessage.error('演示视频仅支持 .mp4 / .avi / .mov 格式')
    return false
  }
  if (!isLt1G) {
    ElMessage.error('演示视频大小不能超过 1GB')
    return false
  }
  return true
}

// 标签处理
const addTag = () => {
  const value = tagInput.value.trim()
  if (!value) return
  if (!submitForm.value.tags.includes(value)) {
    submitForm.value.tags.push(value)
  }
  tagInput.value = ''
}

const removeTag = (tag) => {
  submitForm.value.tags = submitForm.value.tags.filter((t) => t !== tag)
}

// 保存草稿 / 预览 / 提交
const saveDraft = () => {
  ElMessage.success('草稿已保存（示例）')
}

const previewResult = () => {
  ElMessage.info('预览功能待实现，这里先作为示例提示')
}

const submitResult = async () => {
  if (!submitFormRef.value) return

  try {
    await submitFormRef.value.validate()

    // 附件与协议附加校验
    if (!submitForm.value.codeFiles.length) {
      ElMessage.error('请上传源代码包')
      return
    }
    if (!submitForm.value.docFiles.length) {
      ElMessage.error('请至少上传一份项目文档')
      return
    }
    if (!submitForm.value.originalConfirm || !submitForm.value.displayConfirm) {
      ElMessage.error('请勾选成果原创和展示相关确认选项')
      return
    }

    loading.value = true

    // 此处应调用后端 API 提交成果数据
    setTimeout(() => {
      ElMessage.success('成果提交成功！等待评审')
      router.push('/my-projects')
    }, 1000)
  } catch (error) {
    // 校验失败提示已在规则中处理
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
.submit-page {
  min-height: 100vh;
  background: #f5f7fb;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 40px 16px;
}

.submit-modal {
  width: 960px;
  max-width: 100%;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 18px 40px rgba(15, 39, 106, 0.12);
  max-height: calc(100vh - 80px);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.submit-modal::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.submit-header {
  padding: 20px 24px;
  border-bottom: 1px solid #edf1fb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
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
  color: #1b2b5a;
}

.subtitle {
  margin: 0;
  font-size: 13px;
  color: #6b748b;
}

.back-btn {
  border: 1px solid #d0d6ea;
  background: #ffffff;
  color: #1b51da;
  padding: 4px 14px;
  border-radius: 999px;
  cursor: pointer;
  font-size: 13px;
}

.back-btn:hover {
  background: #f0f4ff;
  border-color: #1b51da;
}

.submit-body {
  padding: 24px 24px 20px;
}

.project-info-card {
  padding: 16px 18px 14px;
  border-radius: 14px;
  background: linear-gradient(135deg, #f7f9ff 0%, #ffffff 40%);
  border: 1px solid #dde4ff;
  box-shadow: 0 8px 20px rgba(15, 39, 106, 0.06);
  margin-bottom: 18px;
}

.project-info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.project-info-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.project-info-title .dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #1b51da;
}

.section-title {
  margin: 0 0 10px;
  font-size: 15px;
  font-weight: 600;
  color: #1b2b5a;
}

.project-tag {
  font-size: 12px;
  padding: 2px 10px;
  border-radius: 999px;
  background: rgba(37, 197, 108, 0.08);
  color: #25c56c;
  border: 1px solid rgba(37, 197, 108, 0.3);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 6px 24px;
}

.info-row {
  display: flex;
  align-items: baseline;
  font-size: 13px;
}

.info-row.wide {
  grid-column: 1 / -1;
}

.info-label {
  min-width: 70px;
  color: #6b748b;
  font-weight: 500;
}

.info-value {
  color: #273155;
}

.info-value.project-name {
  font-weight: 600;
}

.info-value.mono {
  font-family: SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono',
    'Courier New', monospace;
}

.submit-form {
  max-width: 880px;
}

.submit-form :deep(.el-textarea__inner) {
  resize: none;
}

.upload-block {
  width: 100%;
}

.upload-title {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
  font-size: 13px;
  color: #3c4560;
}

.upload-title .emoji {
  font-size: 16px;
}

.upload-icon {
  font-size: 32px;
  color: #8fa4ff;
  margin-bottom: 8px;
}

.video-link-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
}

.video-label {
  font-size: 13px;
  color: #6b748b;
}

.tags-block {
  width: 100%;
}

.tag-list {
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.agreements {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 12px;
}

@media (max-width: 768px) {
  .submit-page {
    padding: 16px;
  }

  .submit-body {
    padding: 16px;
  }

  .submit-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>
