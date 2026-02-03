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
            @click="setActiveSection('profile')"
          >
            个人资料
          </button>
          <button
            class="sidebar-item"
            :class="{ active: activeSection === 'account' }"
            @click="setActiveSection('account')"
          >
            账号设置
          </button>
          <button
            class="sidebar-item"
            :class="{ active: activeSection === 'achievements' }"
            @click="setActiveSection('achievements')"
          >
            我的成果
          </button>
          <button
            class="sidebar-item"
            :class="{ active: activeSection === 'certificates' }"
            @click="setActiveSection('certificates')"
          >
            我的证书
          </button>
          <button
            class="sidebar-item"
            :class="{ active: activeSection === 'team' }"
            @click="setActiveSection('team')"
          >
            团队管理
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

          <!-- 团队管理 -->
          <section v-else-if="activeSection === 'team'" class="info-section">
            <div class="section-header">
              <h2 class="section-title">团队管理</h2>
              <button class="save-btn ghost" @click="openCreateTeamDialog">创建团队</button>
            </div>
            <div class="info-grid">
              <div class="info-card">
                <div class="info-item full-width">
                  <label class="info-label">团队概览</label>
                  <div class="team-list">
                    <button
                      v-for="team in teamList"
                      :key="team.id"
                      class="team-item"
                      @click="openManageDialog(team)"
                    >
                      <div class="team-header">
                        <div>
                          <div class="team-name">{{ team.name }}</div>
                          <p class="team-desc">{{ team.description }}</p>
                        </div>
                        <span class="team-meta">成员：{{ team.members.length }} | 角色：{{ team.roleLabel }}</span>
                      </div>
                      <div class="team-project">
                        关联项目：{{ team.project.name }}（{{ team.project.stage }} / {{ team.project.statusText }}）
                      </div>
                    </button>
                    <p v-if="!teamList.length" class="empty-hint">暂无团队，可点击右上角“创建团队”添加。</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>

    <!-- 创建团队弹窗 -->
    <div v-if="createDialogVisible" class="overlay">
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title">创建团队</h3>
          <button class="close-btn" @click="closeCreateTeamDialog">×</button>
        </div>
        <div class="modal-body">
          <div class="form-row">
            <label class="info-label">团队名称</label>
            <input v-model="teamForm.name" class="info-input" placeholder="输入团队名称，如：智能开发小组" />
          </div>
          <div class="form-row">
            <label class="info-label">团队简介</label>
            <textarea v-model="teamForm.description" class="info-textarea" rows="3" placeholder="简要描述团队职责与定位"></textarea>
          </div>
          <div class="form-row">
            <label class="info-label">可见范围</label>
            <select v-model="teamForm.visibility" class="info-input">
              <option value="private">仅团队成员</option>
              <option value="school">校内可见</option>
              <option value="public">公开可见</option>
            </select>
          </div>
          <div class="form-row">
            <label class="info-label">关联项目</label>
            <input v-model="teamForm.project" class="info-input" placeholder="输入关联项目名称或ID" />
          </div>
          <div class="form-row">
            <label class="info-label">团队标签</label>
            <input v-model="teamForm.tags" class="info-input" placeholder="如：前端 / 数据 / 移动端" />
          </div>
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" @click="closeCreateTeamDialog">取消</button>
          <button class="save-btn" @click="createTeam">创建团队</button>
        </div>
      </div>
    </div>

    <!-- 管理团队弹窗 -->
    <div v-if="manageDialogVisible && selectedTeam" class="overlay">
      <div class="modal large">
        <div class="modal-header">
          <div>
            <h3 class="modal-title">{{ selectedTeam.name }}</h3>
            <p class="modal-subtitle">{{ selectedTeam.description }}</p>
            <p class="modal-subtitle">关联项目：{{ selectedTeam.project.name }}（{{ selectedTeam.project.stage }} / {{ selectedTeam.project.statusText }}）</p>
          </div>
          <button class="close-btn" @click="closeManageDialog">×</button>
        </div>
        <div class="modal-body">
          <div class="member-tag-grid">
            <button
              v-for="member in selectedTeam.members"
              :key="member.name"
              class="member-tag"
              :class="{ selected: selectedMemberName === member.name }"
              @click="toggleMemberSelection(member)"
            >
              <span class="member-tag-name">{{ member.name }}</span>
              <span class="member-tag-role">{{ member.role }}</span>
              <span class="member-tag-duty">{{ member.duty }}</span>
            </button>
            <p v-if="!selectedTeam.members.length" class="empty-hint">暂无成员，可先邀请成员。</p>
          </div>
          <div class="form-actions" style="justify-content:flex-start; gap:8px; margin-top:12px;">
            <button class="save-btn" @click="openInviteForm">邀请成员</button>
            <button class="ghost-chip" @click="handleManageAction('role')">调整角色</button>
            <button class="ghost-chip danger" @click="handleManageAction('remove')">移除成员</button>
          </div>
          <div v-if="manageMessage" class="dialog-feedback">{{ manageMessage }}</div>
          <div v-if="inviteFormVisible" class="form-actions-block">
            <h4 class="section-subtitle">邀请成员</h4>
            <div class="form-row">
              <label class="info-label">成员邮箱</label>
              <input v-model="inviteEmail" class="info-input" placeholder="输入成员邮箱，发送邀请" />
            </div>
            <div class="form-row">
              <label class="info-label">角色</label>
              <select v-model="inviteRole" class="info-input">
                <option value="负责人">负责人</option>
                <option value="前端">前端</option>
                <option value="后端">后端</option>
                <option value="算法">算法</option>
                <option value="测试">测试</option>
                <option value="产品">产品</option>
              </select>
            </div>
            <div class="form-actions">
              <button class="save-btn" @click="sendInvite">发送邀请</button>
            </div>
            <p v-if="inviteMessage" class="dialog-feedback">{{ inviteMessage }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@store/modules/user'
import { useAuthStore } from '@store/modules/auth'
import { ElMessage } from 'element-plus'
import ProfileCard from '@/components/user/ProfileCard.vue'
  
const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const authStore = useAuthStore()

// 个人中心内部菜单
const activeSection = ref('profile')
const setActiveSection = (section) => {
  activeSection.value = section
  router.replace({ path: route.path, query: { section } })
}

// 编辑模式
const editMode = ref(false)
const avatarInput = ref(null)

// 用户资料数据
const userProfileData = ref(null)

// 用户信息（从authStore获取）
const userInfo = computed(() => authStore.userInfo || {})

const userRole = computed(() => authStore.userRole || 'student')

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

// 团队管理数据
const teamList = ref([
  {
    id: 'team-1',
    name: '智能开发小组',
    description: '负责前端与移动端交互开发，兼顾性能优化与体验提升。',
    roleLabel: '负责人',
    project: { name: '智慧校园协同平台', stage: '开发中', statusText: '进行中' },
    members: [{ name: '张三' }, { name: '李四' }, { name: '王五' }]
  },
  {
    id: 'team-2',
    name: '数据先锋队',
    description: '聚焦数据分析与可视化交付，支持业务看板建设。',
    roleLabel: '成员',
    project: { name: '运营数据看板', stage: '测试中', statusText: '待验收' },
    members: [{ name: '张三' }, { name: '周八' }]
  }
])

const teamForm = reactive({
  name: '',
  description: '',
  visibility: 'private',
  project: '',
  tags: ''
})

const inviteEmail = ref('')
const inviteRole = ref('前端')
const inviteMessage = ref('')
const manageMessage = ref('')
const createDialogVisible = ref(false)
const manageDialogVisible = ref(false)
const selectedTeam = ref(null)
const inviteFormVisible = ref(false)
const selectedMemberName = ref('')

// 创建团队占位逻辑（仅前端模拟）
const createTeam = () => {
  if (!teamForm.name.trim()) {
    ElMessage.warning('请输入团队名称')
    return
  }
  teamList.value.unshift({
    id: `team-${Date.now()}`,
    name: teamForm.name,
    description: teamForm.description || '团队简介待补充',
    roleLabel: '负责人',
    project: { name: teamForm.project || '待关联项目', stage: '规划中', statusText: '草拟' },
    members: []
  })
  ElMessage.success('已创建团队（前端示例）')
  Object.assign(teamForm, { name: '', description: '', visibility: 'private', project: '', tags: '' })
  closeCreateTeamDialog()
}

// 邀请成员占位逻辑（仅前端模拟）
const sendInvite = () => {
  if (!inviteEmail.value.trim()) {
    ElMessage.warning('请输入成员邮箱')
    return
  }
  inviteMessage.value = `已向 ${inviteEmail.value} 发送邀请，角色：${inviteRole.value}（前端示例）`
  ElMessage.success('邀请已发送（前端示例）')
  inviteEmail.value = ''
}

const openCreateTeamDialog = () => {
  createDialogVisible.value = true
}

const closeCreateTeamDialog = () => {
  createDialogVisible.value = false
}

const openManageDialog = (team) => {
  selectedTeam.value = team
  manageDialogVisible.value = true
  manageMessage.value = ''
  inviteFormVisible.value = false
  selectedMemberName.value = ''
}

const closeManageDialog = () => {
  manageDialogVisible.value = false
  selectedTeam.value = null
  inviteFormVisible.value = false
  manageMessage.value = ''
  inviteMessage.value = ''
  selectedMemberName.value = ''
}

const openInviteForm = () => {
  inviteFormVisible.value = true
}

// 成员管理占位逻辑
const handleManageAction = (action) => {
  if (!selectedMemberName.value) {
    ElMessage.warning('请选择需要操作的成员')
    return
  }
  manageMessage.value = `已对 ${selectedMemberName.value} 触发${action === 'role' ? '角色调整' : '移除成员'}操作（前端示例）`
  ElMessage.success(manageMessage.value)
}

const toggleMemberSelection = (member) => {
  const name = member.name
  selectedMemberName.value = selectedMemberName.value === name ? '' : name
}

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

  // 如果路由带有section参数，默认切换到对应模块
  const section = route.query.section
  if (section && typeof section === 'string') {
    activeSection.value = section
  }
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
  border: 1px solid #1890ff;
  padding: 12px 22px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 18px rgba(24, 144, 255, 0.25);
}

.save-btn:hover {
  background: linear-gradient(120deg, #1890ff, #40a9ff);
  transform: translateY(-1px);
  box-shadow: 0 10px 22px rgba(24, 144, 255, 0.35);
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

.ghost-chip {
  padding: 10px 18px;
  border-radius: 12px;
  border: 1px solid #d6ddf5;
  background: #fff;
  color: #4a5676;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);
}

.ghost-chip:hover {
  border-color: #1890ff;
  color: #1890ff;
  box-shadow: 0 6px 14px rgba(24, 144, 255, 0.2);
}

.ghost-chip.danger {
  border-color: #ffa39e;
  color: #cf1322;
  background: #fff1f0;
  box-shadow: 0 6px 14px rgba(255, 163, 158, 0.2);
}

.close-btn {
  border: none;
  background: transparent;
  font-size: 20px;
  cursor: pointer;
  color: #7b859f;
  line-height: 1;
  padding: 8px;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.close-btn:hover {
  color: #1f274b;
  background: rgba(0, 0, 0, 0.05);
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

/* 团队管理样式 */
.team-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.team-item {
  border: 1px solid #e6f0ff;
  border-radius: 10px;
  padding: 12px;
  background: #f8fbff;
  cursor: pointer;
  text-align: left;
}

.team-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.team-name {
  font-size: 15px;
  font-weight: 600;
  margin: 0;
}

.team-desc {
  margin: 4px 0 0;
  font-size: 13px;
  color: #4f5d7a;
}

.team-meta {
  font-size: 12px;
  color: #7b859f;
  white-space: nowrap;
}

.team-project {
  margin-top: 8px;
  font-size: 13px;
  color: #1f274b;
}

.section-subtitle {
  font-size: 14px;
  font-weight: 600;
  margin: 16px 0 12px;
  color: #1f274b;
}

.form-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.form-row .info-label {
  width: 90px;
  margin-right: 0;
}

.form-actions-block {
  margin-top: 20px;
  padding-top: 12px;
  border-top: 1px dashed #e0e6f2;
}

.dialog-feedback {
  margin: 8px 0 0;
  font-size: 12px;
  color: #1890ff;
  background: #e6f4ff;
  padding: 8px 10px;
  border-radius: 8px;
}

.member-tag-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 12px;
}

.member-tag {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  padding: 10px 12px;
  border: 1px solid #e6f0ff;
  border-radius: 10px;
  background: #f8fbff;
  cursor: pointer;
  min-width: 160px;
  transition: all 0.2s ease;
}

.member-tag:hover {
  border-color: #1890ff;
  box-shadow: 0 6px 14px rgba(24, 144, 255, 0.18);
}

.member-tag.selected {
  border-color: #1890ff;
  background: #e6f4ff;
  box-shadow: 0 6px 14px rgba(24, 144, 255, 0.2);
}

.member-tag-name {
  font-weight: 600;
  color: #1f274b;
}

.member-tag-role {
  font-size: 12px;
  color: #1890ff;
  background: #e6f4ff;
  border-radius: 8px;
  padding: 2px 6px;
}

.member-tag-duty {
  font-size: 12px;
  color: #4f5d7a;
}

.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 12px;
}

.modal {
  width: 640px;
  max-width: 95vw;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.18);
  overflow: hidden;
}

.modal.large {
  width: 800px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.modal-title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #1f274b;
}

.modal-subtitle {
  margin: 4px 0 0;
  font-size: 13px;
  color: #7b859f;
}

.modal-body {
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.modal-footer {
  padding: 12px 20px 16px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  border-top: 1px solid #f0f0f0;
}

.save-btn.ghost {
  background: transparent;
  color: #1890ff;
  border: 1px solid #1890ff;
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
