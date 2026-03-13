<template>
  <div class="enterprise-container">
    <main class="main-content">
      <div class="layout">
        <!-- 侧边导航 -->
        <aside class="sidebar">
          <div class="sidebar-title">企业中心</div>
          <button class="sidebar-item" :class="{ active: activeSection === 'overview' }" @click="activeSection = 'overview'">概览</button>
          <button class="sidebar-item" :class="{ active: activeSection === 'cert' }" @click="activeSection = 'cert'">资质文件</button>
        </aside>

        <!-- 主内容 -->
        <div class="content">
          <!-- 概览 -->
          <section v-if="activeSection === 'overview'" class="section">
            <div class="hero">
              <div class="hero-left">
                <div class="logo-box">
                  <img :src="enterpriseAvatar" alt="企业Logo" />
                </div>
                <div class="hero-info">
                  <div class="hero-title">
                    <div class="title-left">
                      <h1>{{ enterpriseInfo.name }}</h1>
                      <span class="role-tag">企业</span>
                      <span class="status-tag" :class="enterpriseInfo.certStatusClass">{{ enterpriseInfo.certStatusText }}</span>
                    </div>
                    <div class="hero-actions">
                      <el-button type="primary" size="small" @click="toggleEdit">{{ editMode ? '取消' : '编辑资料' }}</el-button>
                      <el-button v-if="editMode" type="success" size="small" @click="saveProfile">保存</el-button>
                      <el-button v-if="!editMode" type="warning" size="small" @click="submitCertification">{{ enterpriseInfo.certStatusText !== '已认证' ? '提交认证' : '重新认证' }}</el-button>
                    </div>
                  </div>
                  <div v-if="!editMode" class="hero-desc">{{ enterpriseInfo.companyIntro }}</div>
                  <div v-else class="hero-desc">
                    <el-input type="textarea" v-model="formData.companyIntro" placeholder="企业简介" rows="3"></el-input>
                  </div>
                  <div class="hero-tags">
                    <template v-if="!editMode">
                      <span class="tag" v-for="tag in displayTags" :key="tag">{{ tag }}</span>
                      <span v-if="!displayTags.length" class="tag ghost">暂无标签</span>
                    </template>
                    <template v-else>
                      <el-input v-model="tagsString" placeholder="标签，使用逗号分隔"></el-input>
                    </template>
                  </div>
                </div>
              </div>
            </div>

            <div class="grid">
              <!-- 认证信息（不可随意修改） -->
              <div class="card">
                <div class="card-header">
                  <h2>
                    认证信息
                    <el-icon v-if="enterpriseInfo.certStatusText === '已认证'" style="color: #52c41a; margin-left: 8px; font-size: 18px;">
                      <SuccessFilled />
                    </el-icon>
                  </h2>
                </div>
                <div class="info-list">
                  <div class="info-item">
                    <span class="label">统一社会信用代码</span>
                    <span class="value">{{ enterpriseInfo.creditCode }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">所属行业</span>
                    <span class="value">{{ enterpriseInfo.companyIndustry }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">企业规模</span>
                    <span class="value">{{ enterpriseInfo.companyScale }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">主要联系人</span>
                    <span class="value">{{ enterpriseInfo.contactPerson || '未填写' }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">联系人职务</span>
                    <span class="value">{{ enterpriseInfo.contactPosition || '未填写' }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">联系电话</span>
                    <span class="value">{{ enterpriseInfo.contactPhone || '未填写' }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">联系邮箱</span>
                    <span class="value">{{ enterpriseInfo.contactEmail || '未填写' }}</span>
                  </div>
                </div>
              </div>

              <!-- 基本资料（可随意修改） -->
              <div class="card">
                <div class="card-header">
                  <h2>基本资料</h2>
                </div>
                <div class="info-list">
                  <div class="info-item">
                    <span class="label">所在地区</span>
                    <template v-if="!editMode">
                      <span class="value">{{ enterpriseInfo.companyRegion }}</span>
                    </template>
                    <template v-else>
                      <el-input v-model="formData.companyRegion" placeholder="企业所在地区" size="small" style="flex: 1"></el-input>
                    </template>
                  </div>
                  <div class="info-item">
                    <span class="label">官网链接</span>
                    <template v-if="!editMode">
                      <a v-if="enterpriseInfo.companyWebsite" class="value link" :href="enterpriseInfo.companyWebsite" target="_blank" rel="noreferrer">{{ enterpriseInfo.companyWebsite }}</a>
                      <span v-else class="value">未填写</span>
                    </template>
                    <template v-else>
                      <el-input v-model="formData.companyWebsite" placeholder="企业官网" size="small" style="flex: 1"></el-input>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- 资质与文件 -->
          <section v-else-if="activeSection === 'cert'" class="section">
            <div class="card">
              <div class="card-header">
                <h2>资质与文件</h2>
              </div>
              <div class="file-grid">
                <div v-if="enterpriseInfo.certifications && enterpriseInfo.certifications.length"
                     class="file-card"
                     v-for="(fileUrl, index) in enterpriseInfo.certifications"
                     :key="index">
                  <div class="file-icon">
                    <el-icon :size="40" :color="getFileIconColor(fileUrl)">
                      <component :is="getFileIcon(fileUrl)" />
                    </el-icon>
                  </div>
                  <div class="file-info">
                    <div class="file-name">{{ getFileName(fileUrl) }}</div>
                    <div class="file-actions">
                      <el-button link type="primary" size="small" @click="previewFile(fileUrl)">预览</el-button>
                      <el-button link type="primary" size="small" @click="downloadFile(fileUrl)">下载</el-button>
                    </div>
                  </div>
                </div>
                <p v-else class="empty">暂未上传资质信息</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useAuthStore } from '@store/modules/auth'
import { useUserStore } from '@store/modules/user'
import { useEnterpriseStore } from '@store/modules/enterprise'

const authStore = useAuthStore()
const userStore = useUserStore()
const enterpriseStore = useEnterpriseStore()

// 左侧导航选中状态
const activeSection = ref('overview')

// 编辑模式
const editMode = ref(false)
const formData = ref({})
const tagsString = ref('')

// 从 store 读取企业资料并映射字段
const enterpriseInfo = computed(() => {
  const raw = enterpriseStore.enterpriseInfo || {}

  // 认证状态映射
  const statusMap = {
    'uncertified': { text: '未认证', class: 'status-pending' },
    'pending_review': { text: '待审核', class: 'status-pending' },
    'certified': { text: '已认证', class: 'status-pass' },
    'rejected': { text: '已拒绝', class: 'status-pending' }
  }
  const status = statusMap[raw.certificationStatus] || { text: '未认证', class: 'status-pending' }

  return {
    name: raw.nickname || '企业名称',
    creditCode: raw.creditCode || '-',
    companyIndustry: raw.companyIndustry || '-',
    companyScale: raw.companyScale || '-',
    companyRegion: raw.companyRegion || '-',
    companyWebsite: raw.companyWebsite || '-',
    companyIntro: raw.companyIntro || '企业简介',
    tags: raw.companyTags || [],
    contactPerson: raw.contactPerson || '-',
    contactPosition: raw.contactPosition || '-',
    contactPhone: raw.contactPhone || '-',
    contactEmail: raw.contactEmail || '-',
    certifications: raw.qualificationFiles || [],
    certStatusText: status.text,
    certStatusClass: status.class
  }
})

// 展示标签
const displayTags = computed(() => enterpriseInfo.value.tags?.slice(0, 6) || [])

// 统计数据
const stats = computed(() => {
  const profile = userStore.profile || {}
  return {
    published: profile.publishedProjects || 0,
    running: profile.runningProjects || 0,
    completed: profile.completedProjects || 0,
    satisfaction: profile.satisfactionRate || 0
  }
})

const enterpriseAvatar = computed(() => {
  const profile = userStore.profile || {}
  const info = authStore.userInfo || {}
  return profile.logo || info.avatar || 'https://picsum.photos/seed/enterprise-logo/120/120'
})

// 切换编辑模式
const toggleEdit = () => {
  if (editMode.value) {
    editMode.value = false
  } else {
    editMode.value = true
    formData.value = {
      companyIntro: enterpriseInfo.value.companyIntro || '',
      companyTags: enterpriseInfo.value.tags || [],
      companyRegion: enterpriseInfo.value.companyRegion || '',
      companyWebsite: enterpriseInfo.value.companyWebsite || ''
    }
    tagsString.value = (enterpriseInfo.value.tags || []).join(',')
  }
}

// 保存企业资料
const saveProfile = async () => {
  const tags = tagsString.value.split(',').map(t => t.trim()).filter(Boolean)
  await enterpriseStore.updateProfile({
    companyIntro: formData.value.companyIntro,
    companyTags: tags,
    companyRegion: formData.value.companyRegion,
    companyWebsite: formData.value.companyWebsite
  })
  editMode.value = false
}

// 提交认证
const submitCertification = async () => {
  const data = {
    creditCode: enterpriseInfo.value.creditCode,
    companyIndustry: enterpriseInfo.value.companyIndustry,
    companyScale: enterpriseInfo.value.companyScale,
    contactPerson: enterpriseInfo.value.contactPerson,
    contactPosition: enterpriseInfo.value.contactPosition,
    contactPhone: enterpriseInfo.value.contactPhone,
    contactEmail: enterpriseInfo.value.contactEmail,
    fileUrls: enterpriseInfo.value.certifications || []
  }
  await enterpriseStore.submitQualification(data)
}

// 自定义上传方法
const customUpload = async ({ file }) => {
  const url = await enterpriseStore.uploadFile(file)
  if (url) {
    // 将上传成功的文件 URL 添加到列表
    if (!enterpriseStore.profile.certifications) {
      enterpriseStore.profile.certifications = []
    }
    enterpriseStore.profile.certifications.push(url)
  }
}

// 初次加载时拉取企业资料
onMounted(async () => {
  const userId = authStore.userInfo?.userId
  if (userId) {
    await enterpriseStore.fetchEnterpriseProfile(userId)
  }
  await userStore.fetchUserProfile()
})

// 获取文件图标
const getFileIcon = (url) => {
  const ext = url.split('.').pop().toLowerCase()
  if (['pdf'].includes(ext)) return 'Document'
  if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return 'Picture'
  return 'Document'
}

// 获取文件图标颜色
const getFileIconColor = (url) => {
  const ext = url.split('.').pop().toLowerCase()
  if (['pdf'].includes(ext)) return '#f56c6c'
  if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return '#67c23a'
  return '#909399'
}

// 获取文件名
const getFileName = (url) => {
  return url.split('/').pop()
}

// 预览文件
const previewFile = (url) => {
  window.open(url, '_blank')
}

// 下载文件
const downloadFile = (url) => {
  const link = document.createElement('a')
  link.href = url
  link.download = getFileName(url)
  link.click()
}
</script>

<style scoped>
.enterprise-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #edf1f7 100%);
  color: #333;
}

.main-content {
  max-width: 1340px;
  margin: 0 auto;
  padding: 24px 20px 48px;
  width: 100%;
}

.layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 24px;
}

.sidebar {
  align-self: flex-start;
  background: #ffffff;
  border-radius: 12px;
  padding: 16px 14px;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.08);
  border: 1px solid #f0f3fa;
}

.sidebar-title {
  font-size: 14px;
  font-weight: 600;
  color: #9aa5c2;
  margin-bottom: 8px;
  padding: 4px 8px;
}

.sidebar-item {
  display: block;
  width: 100%;
  padding: 8px 10px;
  margin-bottom: 4px;
  border-radius: 8px;
  border: none;
  background: transparent;
  text-align: left;
  font-size: 14px;
  color: #4a5676;
  cursor: pointer;
}

.sidebar-item:hover {
  background: #f5f7ff;
}

.sidebar-item.active {
  background: #e6f4ff;
  color: #1890ff;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section {
  animation: fadeInUp 0.4s ease-out;
}

.hero {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
  border: 1px solid #f0f2f5;
}

.hero-left {
  display: flex;
  gap: 16px;
  flex: 1;
}

.logo-box {
  width: 96px;
  height: 96px;
  border-radius: 16px;
  background: #f5f7fb;
  border: 1px solid #e5e9f2;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.logo-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.hero-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
}

.title-left {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.hero-title h1 {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
}

.hero-actions {
  display: flex;
  gap: 8px;
}

.hero-actions .el-button {
  min-width: 90px;
}

.role-tag {
  padding: 4px 10px;
  border-radius: 999px;
  background: #e6f4ff;
  color: #1890ff;
  font-weight: 600;
  font-size: 13px;
}

.status-tag {
  padding: 4px 10px;
  border-radius: 999px;
  background: #fff1f0;
  color: #ff4d4f;
  font-weight: 600;
  font-size: 13px;
}

.status-tag.status-pass {
  background: #f6ffed;
  color: #52c41a;
}

.status-tag.status-pending {
  background: #fff7e6;
  color: #fa8c16;
}

.hero-desc {
  margin: 0;
  color: #4a5676;
  line-height: 1.6;
}

.hero-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  padding: 6px 10px;
  border-radius: 999px;
  background: #f5f7fb;
  color: #1f274b;
  font-size: 12px;
}

.tag.ghost {
  background: #fafafa;
  color: #999;
}

.hero-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  min-width: 240px;
}

.stat {
  background: linear-gradient(135deg, #f8fbff 0%, #eef3ff 100%);
  border: 1px solid #e5e9f2;
  border-radius: 12px;
  padding: 12px;
  text-align: center;
}

.stat .num {
  font-size: 20px;
  font-weight: 700;
  color: #0c5fe7;
}

.stat .label {
  color: #6b7390;
  font-size: 13px;
}

.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

.card {
  background: #fff;
  border-radius: 12px;
  padding: 18px 20px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.05);
  border: 1px solid #f0f2f5;
}

.intro-text {
  margin: 0;
  padding: 4px 2px 2px;
  color: #4a5676;
  line-height: 1.7;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.card-header h2 {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #1f274b;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 12px;
  background: #f9fbff;
  border: 1px dashed #e6eaf5;
  border-radius: 10px;
}

.label {
  color: #6b7390;
  font-weight: 600;
}

.value {
  color: #1f274b;
  font-weight: 600;
}

.value.link {
  color: #0c5fe7;
  text-decoration: none;
}

.cert-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.cert-chip {
  padding: 8px 12px;
  background: #f5f7fb;
  border-radius: 10px;
  border: 1px solid #e5e9f2;
  color: #1f274b;
  font-weight: 600;
}

.file-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.file-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f9fbff;
  border: 1px solid #e6eaf5;
  border-radius: 12px;
  transition: all 0.3s;
}

.file-card:hover {
  background: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.file-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background: #fff;
  border-radius: 10px;
  border: 1px solid #e5e9f2;
}

.file-info {
  flex: 1;
  min-width: 0;
}

.file-name {
  font-size: 14px;
  font-weight: 600;
  color: #1f274b;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.file-actions {
  display: flex;
  gap: 12px;
}

.empty {
  margin: 0;
  color: #999;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .hero {
    flex-direction: column;
  }

  .hero-stats {
    width: 100%;
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>

