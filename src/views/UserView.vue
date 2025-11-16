<template>
  <el-container style="height: 100vh; background: #f5f7fa;">
    <!-- 顶部导航栏 -->
    <el-header height="60px" class="header">
      <div class="logo">🏆 揭榜挂帅系统</div>
      <div class="user-info">
        <el-dropdown>
          <span class="user-avatar">
            <el-avatar :size="32" :src="userInfo.avatar">
              {{ userInfo.username?.charAt(0) || 'U' }}
            </el-avatar>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="$router.push('/home')">系统首页</el-dropdown-item>
              <el-dropdown-item divided @click="handleLogout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>

  <!-- 主体区域 -->
  <el-container style="overflow: auto;">
    <!-- 主内容区 -->
    <el-main class="main" style="overflow-y: auto; height: calc(100vh - 60px);">
        <!-- 用户个人中心 -->
        <div class="user-profile">
          <div class="profile-header">
            <h1>个人中心</h1>
            <p>管理您的个人信息和账户设置</p>
          </div>

          <!-- 基本信息卡片 -->
          <div class="vertical-layout">
            <!-- 基本信息 -->
            <el-card class="basic-info-card">
              <template #header>
                <div class="card-header">
                  <span>基本信息</span>
                  <el-button type="primary" size="small" @click="editMode = !editMode">
                    {{ editMode ? '取消' : '编辑' }}
                  </el-button>
                </div>
              </template>
              
              <!-- 头像编辑区域 -->
              <div class="avatar-section">
                <div class="avatar-upload" @click="editMode ? $refs.avatarInput.click() : null">
                  <el-avatar :size="80" :src="userInfo.avatar" class="profile-avatar">
                    {{ userInfo.username?.charAt(0) || 'U' }}
                  </el-avatar>
                  <div v-if="editMode" class="avatar-edit-overlay">
                    <el-icon><Camera /></el-icon>
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

              <!-- 基本信息表单 -->
              <el-form :model="userInfo" label-width="100px" class="info-form">
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item label="用户名：">
                      <el-input v-if="editMode" v-model="userInfo.username" />
                      <span v-else class="info-text">{{ userInfo.username }}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="角色：">
                      <el-tag v-if="userInfo.role === 'admin'" type="danger">管理员</el-tag>
                      <el-tag v-else type="success">普通用户</el-tag>
                    </el-form-item>
                  </el-col>
                </el-row>
                
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item label="手机号：">
                      <el-input v-if="editMode" v-model="userInfo.phone" />
                      <span v-else class="info-text">{{ userInfo.phone || '未设置' }}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="邮箱：">
                      <el-input v-if="editMode" v-model="userInfo.email" />
                      <span v-else class="info-text">{{ userInfo.email || '未设置' }}</span>
                    </el-form-item>
                  </el-col>
                </el-row>
                
                <el-row :gutter="20">
                  <el-col :span="12">
                    <el-form-item label="注册时间：">
                      <span class="info-text">{{ formatDate(userInfo.registerTime) }}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="上次登录：">
                      <span class="info-text">{{ formatDate(userInfo.lastLoginTime) }}</span>
                    </el-form-item>
                  </el-col>
                </el-row>
                
                <el-form-item v-if="editMode" label="地址：">
                  <el-input v-model="userInfo.address" type="textarea" :rows="2" />
                </el-form-item>
                <el-form-item v-else label="地址：">
                  <span class="info-text">{{ userInfo.address || '未设置' }}</span>
                </el-form-item>
              </el-form>
              
              <div v-if="editMode" class="form-actions">
                <el-button type="primary" @click="saveUserInfo">保存</el-button>
                <el-button @click="cancelEdit">取消</el-button>
              </div>
            </el-card>
            
            <!-- 关联项目统计 -->
            <el-card class="stats-card">
              <template #header>
                <div class="card-header">
                  <span>关联项目统计</span>
                </div>
              </template>
              <div class="stats-content">
                <div class="stat-item">
                  <div class="stat-icon created-projects">📋</div>
                  <div class="stat-info">
                    <div class="stat-value">{{ userStats.createdProjects || 0 }}</div>
                    <div class="stat-label">创建的项目</div>
                  </div>
                </div>
                <div class="stat-item">
                  <div class="stat-icon participated-bids">🎯</div>
                  <div class="stat-info">
                    <div class="stat-value">{{ userStats.participatedBids || 0 }}</div>
                    <div class="stat-label">参与竞标</div>
                  </div>
                </div>
                <div class="stat-item">
                  <div class="stat-icon completed-projects">✅</div>
                  <div class="stat-info">
                    <div class="stat-value">{{ userStats.completedProjects || 0 }}</div>
                    <div class="stat-label">完成项目</div>
                  </div>
                </div>
                <div class="stat-item">
                  <div class="stat-icon success-rate">📈</div>
                  <div class="stat-info">
                    <div class="stat-value">{{ userStats.successRate || 0 }}%</div>
                    <div class="stat-label">成功率</div>
                  </div>
                </div>
              </div>
            </el-card>
            
            <!-- 操作日志 -->
            <el-card class="logs-card">
              <template #header>
                <div class="card-header">
                  <span>最近活动</span>
                </div>
              </template>
              <div class="logs-content">
                <div v-for="log in userLogs" :key="log.id" class="log-item">
                  <div class="log-icon">{{ getLogIcon(log.type) }}</div>
                  <div class="log-details">
                    <div class="log-action">{{ log.action }}</div>
                    <div class="log-time">{{ formatTime(log.time) }}</div>
                  </div>
                </div>
                <div v-if="userLogs.length === 0" class="empty-logs">
                  <el-empty description="暂无活动记录" />
                </div>
              </div>
            </el-card>
          </div>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../store/user'
import { ElMessage } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()

// 编辑模式
const editMode = ref(false)
const avatarInput = ref(null)

// 用户信息
const userInfo = reactive({
  username: userStore.username || '用户',
  role: 'user',
  phone: '138****1234',
  email: 'user@example.com',
  registerTime: new Date('2024-01-01'),
  lastLoginTime: new Date(),
  address: '北京市朝阳区',
  avatar: ''
})

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

// 当前菜单
const currentMenu = ref('')

// 菜单选择处理
const handleMenuSelect = (index) => {
  currentMenu.value = index
  if (index !== '') {
    router.push('/home')
  }
}

// 登出处理
const handleLogout = () => {
  userStore.logout()
  router.push('/login')
  ElMessage.success('已退出登录')
}

// 头像上传处理
const handleAvatarUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (file.size > 2 * 1024 * 1024) {
      ElMessage.error('头像大小不能超过2MB')
      return
    }
    
    const reader = new FileReader()
    reader.onload = (e) => {
      userInfo.avatar = e.target.result
      ElMessage.success('头像上传成功')
    }
    reader.readAsDataURL(file)
  }
}

// 保存用户信息
const saveUserInfo = () => {
  // 这里应该调用API保存用户信息
  ElMessage.success('用户信息保存成功')
  editMode.value = false
}

// 取消编辑
const cancelEdit = () => {
  editMode.value = false
  // 这里可以重置用户信息为原始数据
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

onMounted(() => {
  // 初始化用户信息
  if (userStore.username) {
    userInfo.username = userStore.username
  }
})
</script>

<style scoped>
/* 全局滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
  transition: background 0.3s ease;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 页面容器动画 */
.el-container {
  animation: pageSlideIn 0.6s ease-out;
}

@keyframes pageSlideIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 平滑滚动 */
html {
  scroll-behavior: smooth;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  color: white;
  animation: headerSlideDown 0.8s ease-out;
}

@keyframes headerSlideDown {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.logo {
  font-size: 20px;
  font-weight: bold;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-avatar {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: transform 0.2s ease;
}

.user-avatar:hover {
  transform: scale(1.05);
}

.aside {
  background: #fff;
  border-right: 1px solid #e6e6e6;
}

.main {
  padding: 20px;
  background: #f5f7fa;
  height: calc(100vh - 60px);
  overflow-y: auto;
  overflow-x: hidden;
}

.profile-header {
  text-align: center;
  margin-bottom: 30px;
}

.profile-header h1 {
  color: #333;
  margin-bottom: 10px;
}

.profile-header p {
  color: #666;
  font-size: 14px;
}

.vertical-layout {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 800px;
  margin: 0 auto;
  min-height: calc(100vh - 200px);
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
}

.basic-info-card,
.stats-card,
.logs-card {
  width: 100%;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.basic-info-card:hover,
.stats-card:hover,
.logs-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.avatar-section {
  text-align: center;
  margin-bottom: 30px;
}

.avatar-upload {
  position: relative;
  display: inline-block;
  cursor: pointer;
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
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  opacity: 0;
  transition: opacity 0.3s;
}

.avatar-upload:hover .avatar-edit-overlay {
  opacity: 1;
}

.profile-avatar {
  border: 3px solid #e6e6e6;
}

.info-form {
  margin-top: 20px;
}

.info-text {
  color: #333;
  font-size: 14px;
}

.form-actions {
  text-align: center;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e6e6e6;
}

.stats-card {
  margin-bottom: 20px;
}

.stat-item {
  display: flex;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;
}

.stat-item:last-child {
  border-bottom: none;
}

.stat-icon {
  font-size: 24px;
  margin-right: 15px;
  width: 40px;
  text-align: center;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.stat-label {
  font-size: 12px;
  color: #666;
}

.logs-card {
  margin-top: 20px;
}

.log-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.log-item:last-child {
  border-bottom: none;
}

.log-icon {
  font-size: 16px;
  margin-right: 12px;
  width: 20px;
  text-align: center;
}

.log-details {
  flex: 1;
}

.log-action {
  font-size: 13px;
  color: #333;
  margin-bottom: 4px;
}

.log-time {
  font-size: 11px;
  color: #999;
}

.empty-logs {
  padding: 20px 0;
}

.created-projects { color: #409EFF; }
.participated-bids { color: #E6A23C; }
.completed-projects { color: #67C23A; }
.success-rate { color: #F56C6C; }

/* 卡片滑入动画 */
.basic-info-card {
  animation: cardSlideIn 0.8s ease-out 0.2s both;
}

.stats-card {
  animation: cardSlideIn 0.8s ease-out 0.4s both;
}

.logs-card {
  animation: cardSlideIn 0.8s ease-out 0.6s both;
}

@keyframes cardSlideIn {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 内容区域进入动画 */
.profile-header {
  animation: fadeInUp 0.8s ease-out;
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

/* 添加更多鼠标悬停效果 */
.user-avatar {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: transform 0.2s ease;
}

.user-avatar:hover {
  transform: scale(1.05);
}

/* 按钮悬停效果 */
.el-button {
  transition: all 0.3s ease;
}

.el-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* 下拉菜单项悬停效果 */
.el-dropdown-menu__item {
  transition: all 0.2s ease;
}

.el-dropdown-menu__item:hover {
  background-color: #f5f7fa;
  transform: translateX(5px);
}

/* 统计项悬停效果 */
.stat-item {
  transition: all 0.3s ease;
}

.stat-item:hover {
  background-color: #f8f9fa;
  transform: translateX(10px);
  border-radius: 8px;
}

/* 日志项悬停效果 */
.log-item {
  transition: all 0.3s ease;
}

.log-item:hover {
  background-color: #f8f9fa;
  transform: translateX(10px);
  border-radius: 8px;
}

/* 滚动视差效果 */
.main {
  perspective: 1px;
  transform-style: preserve-3d;
  overflow-x: hidden;
  overflow-y: auto;
  height: calc(100vh - 60px);
}

.profile-header {
  transform: translateZ(0);
}

/* 触摸滑动优化 */
.vertical-layout {
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
  min-height: calc(100vh - 200px);
}

/* 卡片触摸反馈 */
.basic-info-card,
.stats-card,
.logs-card {
  -webkit-tap-highlight-color: transparent;
  cursor: pointer;
}

/* 滑动过渡效果 */
.vertical-layout {
  transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* 响应式动画调整 */
@media (max-width: 768px) {
  .basic-info-card,
  .stats-card,
  .logs-card {
    animation: cardSlideIn 0.6s ease-out 0.2s both;
  }
  
  @keyframes cardSlideIn {
    from {
      opacity: 0;
      transform: translateY(50px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
}

/* 头像悬停效果增强 */
.avatar-upload {
  transition: all 0.3s ease;
}

.avatar-upload:hover {
  transform: scale(1.05);
}

/* 表单输入框悬停效果 */
.el-input__wrapper {
  transition: all 0.3s ease;
}

.el-input__wrapper:hover {
  box-shadow: 0 0 0 1px #409EFF;
}

/* 卡片标题悬停效果 */
.card-header {
  transition: all 0.3s ease;
}

.card-header:hover {
  background-color: #f8f9fa;
}
</style>