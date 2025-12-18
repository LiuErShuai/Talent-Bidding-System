<template>
  <div class="user-container">
    <!-- 主要内容区域 -->
    <main class="main-content">
      <div class="user-layout">
        <!-- 侧边栏 -->
        <aside class="user-sidebar">
          <div class="sidebar-title">个人中心</div>
          <button
            class="sidebar-item"
            :class="{ active: activeSection === 'profile' }"
            @click="activeSection = 'profile'"
          >
            个人资料
          </button>
          <button
            class="sidebar-item"
            :class="{ active: activeSection === 'detail' }"
            @click="activeSection = 'detail'"
          >
            详细资料
          </button>
          <button
            class="sidebar-item"
            :class="{ active: activeSection === 'skills' }"
            @click="activeSection = 'skills'"
          >
            技能标签管理
          </button>
          <button
            class="sidebar-item"
            :class="{ active: activeSection === 'account' }"
            @click="activeSection = 'account'"
          >
            账号设置
          </button>
          <button
            class="sidebar-item"
            :class="{ active: activeSection === 'achievements' }"
            @click="activeSection = 'achievements'"
          >
            我的成果
          </button>
          <button
            class="sidebar-item"
            :class="{ active: activeSection === 'rewards' }"
            @click="activeSection = 'rewards'"
          >
            我的奖金
          </button>
          <button
            class="sidebar-item"
            :class="{ active: activeSection === 'ability' }"
            @click="activeSection = 'ability'"
          >
            能力评估
          </button>
          <button
            class="sidebar-item"
            :class="{ active: activeSection === 'certificates' }"
            @click="activeSection = 'certificates'"
          >
            我的证书
          </button>
          <button
            class="sidebar-item"
            :class="{ active: activeSection === 'privacy' }"
            @click="activeSection = 'privacy'"
          >
            隐私设置
          </button>
        </aside>

        <!-- 主内容区 -->
        <div class="user-main">
          <!-- 用户信息Banner区 -->
          <section class="user-banner-section">
            <div class="banner-content">
              <div class="user-avatar-section">
                <div class="avatar-upload" @click="editMode ? $refs.avatarInput.click() : null">
                  <div class="user-avatar-large">
                    <img :src="userProfileData?.avatar || userInfo.avatar || 'https://picsum.photos/seed/user123/120/120.jpg'" alt="用户头像" />
                    <div v-if="editMode" class="avatar-edit-overlay">
                      <span>更换头像</span>
                    </div>
                  </div>
                  <input 
                    ref="avatarInput" 
                    type="file" 
                    accept="image/*" 
                    style="display: none" 
                    @change="handleAvatarUpload"
                  >
                </div>
                <div class="user-info-main">
                  <div class="user-name-row">
                    <h1 class="user-name">{{ userInfo.username || userProfileData?.realName || '用户' }}</h1>
                    <span class="role-tag" :class="userRole === 'admin' ? 'admin' : 'user'">
                      {{ userRole === 'admin' ? '管理员' : userRole === 'student' ? '学生' : userRole === 'enterprise' ? '企业' : userRole === 'teacher' ? '教师' : '普通用户' }}
                    </span>
                  </div>
                  <p class="user-description">欢迎来到个人中心，管理您的个人信息和项目</p>
                </div>
              </div>
              
              <div class="user-stats-overview">
                <div class="stat-item">
                  <span class="stat-number">{{ userStats.createdProjects || 0 }}</span>
                  <span class="stat-label">创建项目</span>
                </div>
                <div class="stat-item">
                  <span class="stat-number">{{ userStats.participatedBids || 0 }}</span>
                  <span class="stat-label">参与竞标</span>
                </div>
                <div class="stat-item">
                  <span class="stat-number">{{ userStats.completedProjects || 0 }}</span>
                  <span class="stat-label">完成项目</span>
                </div>
                <div class="stat-item">
                  <span class="stat-number">{{ userStats.successRate || 0 }}%</span>
                  <span class="stat-label">成功率</span>
                </div>
              </div>
            </div>
          </section>

          <!-- 个人资料 -->
          <section v-if="activeSection === 'profile'" class="info-section">
            <ProfileCard 
              v-if="userProfileData"
              :user-data="userProfileData"
              :has-profile="!!userProfileData"
            />
            <div v-else class="loading-container">
              <el-skeleton :rows="5" animated />
            </div>
          </section>

          <!-- 详细资料 -->
          <section v-else-if="activeSection === 'detail'" class="info-section">
            <SettingsForm />
          </section>

          <!-- 技能标签管理 -->
          <section v-else-if="activeSection === 'skills'" class="info-section">
        <div class="section-header">
          <h2 class="section-title">技能标签管理</h2>
        </div>
        <div class="info-grid">
          <div class="info-card">
            <div class="skills-input-row">
              <input
                v-model="newSkillTag"
                class="info-input"
                placeholder="输入技能标签，如：Vue、Python"
                @keyup.enter="addSkillTag"
              />
              <button class="save-btn" @click="addSkillTag">添加标签</button>
            </div>
            <div class="skills-tags">
              <span
                v-for="(tag, index) in skillTags"
                :key="tag + index"
                class="skill-tag"
              >
                {{ tag }}
                <button class="tag-remove" @click="removeSkillTag(index)">×</button>
              </span>
              <p v-if="!skillTags.length" class="empty-hint">暂未添加任何技能标签</p>
            </div>
          </div>
        </div>
          </section>

          <!-- 账号设置 -->
          <section v-else-if="activeSection === 'account'" class="info-section">
        <div class="section-header">
          <h2 class="section-title">账号设置</h2>
        </div>
        <div class="info-grid">
          <div class="info-card">
            <div class="info-item">
              <label class="info-label">登录账号：</label>
              <span class="info-value">{{ userInfo.username }}</span>
            </div>
            <div class="info-item">
              <label class="info-label">绑定手机号：</label>
              <span class="info-value">{{ userInfo.phone || '未设置' }}</span>
            </div>
            <div class="info-item">
              <label class="info-label">绑定邮箱：</label>
              <span class="info-value">{{ userInfo.email || '未设置' }}</span>
            </div>
            <p class="empty-hint">密码修改、二次验证等功能可在此扩展。</p>
          </div>
        </div>
          </section>

          <!-- 我的成果 -->
          <section v-else-if="activeSection === 'achievements'" class="info-section">
        <div class="section-header">
          <h2 class="section-title">我的成果</h2>
        </div>
        <div class="info-grid">
          <div class="info-card">
            <p class="empty-hint">这里可以展示你在项目中的成果、作品链接等内容。</p>
          </div>
        </div>
          </section>

          <!-- 我的奖金 -->
          <section v-else-if="activeSection === 'rewards'" class="info-section">
        <div class="section-header">
          <h2 class="section-title">我的奖金</h2>
        </div>
        <div class="info-grid">
          <div class="info-card">
            <p class="empty-hint">这里可以展示项目奖金统计、收益明细等信息。</p>
          </div>
        </div>
          </section>

          <!-- 能力评估 -->
          <section v-else-if="activeSection === 'ability'" class="info-section">
            <div class="section-header">
              <h2 class="section-title">能力评估</h2>
            </div>
            <div class="info-grid">
              <div class="info-card">
                <p class="empty-hint">这里可以展示能力雷达图和综合评分。</p>
              </div>
            </div>
          </section>

          <!-- 我的证书 -->
          <section v-else-if="activeSection === 'certificates'" class="info-section">
        <div class="section-header">
          <h2 class="section-title">我的证书</h2>
        </div>
        <div class="info-grid">
          <div class="info-card">
            <p class="empty-hint">这里可以展示平台颁发的项目证书、荣誉证明等。</p>
          </div>
        </div>
          </section>

          <!-- 隐私设置 -->
          <section v-else-if="activeSection === 'privacy'" class="info-section">
            <div class="section-header">
              <h2 class="section-title">隐私设置</h2>
            </div>
            <div class="info-grid">
              <div class="info-card">
                <p class="empty-hint">这里可以配置资料公开范围、消息通知等隐私选项。</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@store/modules/user'
import { useAuthStore } from '@store/modules/auth'
import { ElMessage } from 'element-plus'
import ProfileCard from '@/components/user/ProfileCard.vue'
import SettingsForm from '@/components/user/SettingsForm.vue'
  
const router = useRouter()
const userStore = useUserStore()
const authStore = useAuthStore()

// 个人中心内部菜单
const activeSection = ref('profile')

// 编辑模式
const editMode = ref(false)
const avatarInput = ref(null)

// 用户资料数据
const userProfileData = ref(null)

// 用户信息（从authStore获取）
const userInfo = computed(() => authStore.userInfo || {})

const userRole = computed(() => authStore.userRole || 'student')

  // 技能标签管理
  const skillTags = ref(['Vue', 'JavaScript', 'Python'])
  const newSkillTag = ref('')

  const addSkillTag = () => {
    const value = newSkillTag.value.trim()
    if (!value) return
    if (!skillTags.value.includes(value)) {
      skillTags.value.push(value)
    }
    newSkillTag.value = ''
  }

  const removeSkillTag = (index) => {
    skillTags.value.splice(index, 1)
  }

// 用户统计信息
const userStats = reactive({
  createdProjects: 12,
  participatedBids: 25,
  completedProjects: 8,
  successRate: 67
})

// 用户操作日志
const userLogs = reactive([
  { id: 1, type: 'login', action: '登录系统', time: new Date(Date.now() - 1000 * 60 * 30) },
  { id: 2, type: 'project', action: '发布了新项目 "AI智能客服系统开发"', time: new Date(Date.now() - 1000 * 60 * 60 * 2) },
  { id: 3, type: 'bid', action: '参与竞标 "电商平台UI设计"', time: new Date(Date.now() - 1000 * 60 * 60 * 5) },
  { id: 4, type: 'login', action: '上次登录', time: new Date(Date.now() - 1000 * 60 * 60 * 24) }
])

// 头像上传处理
const handleAvatarUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (file.size > 2 * 1024 * 1024) {
    ElMessage.error('头像大小不能超过2MB')
    return
  }

  try {
    const { uploadAvatarAPI } = await import('@/api/user')
    const result = await uploadAvatarAPI(file)
    
    if (result.code === 200) {
      // 更新头像显示
      if (userProfileData.value) {
        userProfileData.value.avatar = result.data.avatarUrl
      }
      // 更新authStore中的头像
      authStore.updateUserInfo({ avatar: result.data.avatarUrl })
      ElMessage.success('头像上传成功')
    } else {
      ElMessage.error(result.message || '头像上传失败')
    }
  } catch (error) {
    console.error('Upload avatar error:', error)
    ElMessage.error('头像上传失败')
  }
}

// 格式化日期
const formatDate = (date) => {
  if (!date) return '--'
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

// 格式化时间
const formatTime = (time) => {
  const now = new Date()
  const diff = now - new Date(time)
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 60) {
    return `${minutes}分钟前`
  } else if (hours < 24) {
    return `${hours}小时前`
  } else {
    return `${days}天前`
  }
}

// 获取日志图标
const getLogIcon = (type) => {
  const icons = {
    login: '🔐',
    project: '📋',
    bid: '🎯',
    system: '⚙️'
  }
  return icons[type] || '📝'
}

// 加载用户详细信息
const loadUserProfile = async () => {
  try {
    const profile = await userStore.fetchUserProfile()
    if (profile) {
      userProfileData.value = profile
    }
  } catch (error) {
    console.error('Load user profile error:', error)
  }
}

onMounted(() => {
  // 加载用户详细信息
  loadUserProfile()
})
</script>

<style scoped>
/* 全局样式 */
.user-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: 'Microsoft YaHei', '微软雅黑', 'Source Han Sans CN', 'Roboto', Arial, sans-serif;
  /* 背景改为更淡的冷色渐变，减小与内容区的色差 */
  background: linear-gradient(135deg, #f8fafc 0%, #edf1f7 100%);
  color: #333;
  scroll-behavior: smooth;
}

/* 主要内容区域 */
.main-content {
  flex: 1;
  /* 主内容区加宽，视觉更舒展 */
  max-width: 1340px;
  margin: 0 auto;
  padding: 24px;
  width: 100%;
  animation: fadeInUp 0.8s ease-out;
  /* 统一使用页面滚动，移除内部滚动条 */
  overflow: visible;
}

.user-layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 24px;
}

.user-sidebar {
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

.user-main {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 用户信息卡片区域 */
.user-banner-section {
  border-radius: 12px;
  /* 压缩上下空间 */
  padding: 16px 20px;
  /* 缩小与下方信息区的间距 */
  margin-bottom: 10px;
  background: #ffffff;
  border: 1px dashed #d9d9d9;
  position: relative;
}

.banner-content {
  position: relative;
  display: flex;
  align-items: center;
  gap: 32px;
}

.user-avatar-section {
  display: flex;
  align-items: center;
  gap: 24px;
}

.user-avatar-large {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #d9d9d9;
  position: relative;
}

.user-avatar-large img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-upload {
  position: relative;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.avatar-upload:hover {
  transform: scale(1.05);
}

.avatar-edit-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.avatar-upload:hover .avatar-edit-overlay {
  opacity: 1;
}

.user-info-main {
  flex: 1;
}

.user-name {
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 4px;
  letter-spacing: 0.5px;
}

.user-name-row {
  display: flex;
  align-items: center;
  gap: 100px;
  flex-wrap: wrap;
  margin-top: -20px; 
}

.role-tag {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  white-space: nowrap;
  margin-top: 20px; 
}

.role-tag.admin {
  background: rgba(245, 34, 45, 0.2);
  color: #f5222d;
}

.role-tag.user {
  background: rgba(82, 196, 26, 0.2);
  color: #52c41a;
}

.user-description {
  font-size: 1.1rem;
  opacity: 0.9;
  margin: 0;
}

.user-stats-overview {
  /* 横向排列且不换行，控制宽度占比约30% */
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  text-align: left;
  max-width: 30%;
  justify-content: space-between;
  align-self: center;
  margin-left: auto;
}

.stat-item {
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 4px 6px;
  min-width: 60px;
}

.stat-number {
  display: block;
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 2px;
}

.stat-label {
  font-size: 0.8rem;
  opacity: 0.8;
}

/* 通用区块样式 */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1890FF;
  margin: 0;
}

.edit-btn {
  background: #1890FF;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.edit-btn:hover {
  background: #40a9ff;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
}

/* 个人中心内部菜单 */
.user-tabs {
  display: none;
}

.user-tab {
  padding: 6px 14px;
  border-radius: 999px;
  border: 1px solid #e0e6f2;
  background: #f5f7fb;
  font-size: 13px;
  cursor: pointer;
  color: #4a5676;
}

.user-tab.active {
  background: #1890FF;
  border-color: #1890FF;
  color: #fff;
}

/* 个人信息编辑区 */
.info-section {
  /* 减少信息区之间的垂直间距 */
  margin-bottom: 28px;
  animation: fadeInUp 0.8s ease-out 0.2s both;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

.info-card {
  background: white;
  padding: 32px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.1);
  border: 1px solid #f0f0f0;
  transition: all 0.3s ease;
}

.info-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(24, 144, 255, 0.15);
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.info-item.full-width {
  flex-direction: column;
  align-items: flex-start;
}

.info-label {
  width: 100px;
  font-weight: 500;
  color: #666;
  margin-right: 16px;
}

.info-value {
  flex: 1;
  color: #333;
}

.info-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.info-input:focus {
  outline: none;
  border-color: #1890FF;
}

.info-textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  font-size: 14px;
  resize: vertical;
  transition: border-color 0.3s ease;
}

.info-textarea:focus {
  outline: none;
  border-color: #1890FF;
}

.skills-input-row {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.skills-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 999px;
  background: #f0f5ff;
  color: #1d39c4;
  font-size: 12px;
}

.tag-remove {
  border: none;
  background: transparent;
  cursor: pointer;
  color: #8c8c8c;
  font-size: 12px;
}

.empty-hint {
  margin-top: 8px;
  font-size: 13px;
  color: #999;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #f0f0f0;
}

.save-btn {
  background: #1890FF;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.save-btn:hover {
  background: #40a9ff;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
}

.cancel-btn {
  background: #f5f5f5;
  color: #666;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  background: #e8e8e8;
}

/* 最近活动区 */
.activity-section {
  animation: fadeInUp 0.8s ease-out 0.4s both;
}

.activity-list {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.1);
  border: 1px solid #f0f0f0;
}

.activity-item {
  display: flex;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  font-size: 18px;
  margin-right: 16px;
  width: 24px;
  text-align: center;
}

.activity-content {
  flex: 1;
}

.activity-text {
  color: #333;
  margin-bottom: 4px;
}

.activity-time {
  color: #999;
  font-size: 0.9rem;
}

.empty-activity {
  text-align: center;
  padding: 40px 0;
  color: #999;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 16px;
  opacity: 0.5;
}

/* 底部信息区 */
.footer {
  background: rgba(255, 255, 255, 0.95);
  border-top: 1px solid #e8e8e8;
  backdrop-filter: blur(10px);
  animation: fadeInUp 0.8s ease-out 0.6s both;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px;
  text-align: center;
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: 32px;
  margin-bottom: 16px;
}

.footer-link {
  color: #666;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: #1890FF;
}

.copyright {
  color: #999;
  font-size: 0.9rem;
}

/* 动画效果 */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bannerSlideIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-content {
    padding: 0 16px;
    flex-direction: column;
    height: auto;
    padding: 16px;
  }
  
  .nav-menu {
    gap: 16px;
    margin: 16px 0;
  }
  
  .auth-section {
    gap: 12px;
  }
  
  .main-content {
    padding: 24px 16px;
  }
  
  .user-banner-section {
    padding: 40px 24px;
  }
  
  .banner-content {
    flex-direction: column;
    gap: 24px;
    text-align: center;
  }
  
  .user-avatar-section {
    flex-direction: column;
    gap: 16px;
  }
  
  .user-name {
    font-size: 2rem;
  }
  
  .user-stats-overview {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .info-label {
    width: auto;
    margin-right: 0;
  }
  
  .footer-links {
    flex-direction: column;
    gap: 16px;
  }
}

/* 平滑滚动效果 */
html {
  scroll-behavior: smooth;
}
</style>
