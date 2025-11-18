<template>
  <div class="user-container">
    <!-- 顶部导航栏 -->
    <header class="header">
      <div class="header-content">
        <div class="logo-section">
          <img src="../assets/Logo.png" alt="产教融合平台" class="logo" />
          <span class="platform-name">产教融合项目揭榜平台</span>
        </div>
        
        <nav class="nav-menu">
          <router-link to="/home" class="nav-item">首页</router-link>
          <router-link to="/projects" class="nav-item">项目大厅</router-link>
          <router-link to="/statistics" class="nav-item">数据中心</router-link>
          <router-link to="/messages" class="nav-item">
            消息
            <span class="badge">2</span>
          </router-link>
        </nav>
        
        <div class="auth-section">
          <div class="user-menu">
            <div class="user-avatar">
              <img :src="userInfo.avatar || 'https://picsum.photos/seed/user123/40/40.jpg'" alt="用户头像" />
            </div>
            <div class="user-info">
              <span class="username">{{ userInfo.username || '用户' }}</span>
              <div class="dropdown-menu">
                <router-link to="/home" class="dropdown-item">系统首页</router-link>
                <router-link to="/my-projects" class="dropdown-item">我的项目</router-link>
                <button class="dropdown-item logout-btn" @click="handleLogout">退出登录</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>


    <!-- 主要内容区域 -->
    <main class="main-content">
      <!-- 用户信息Banner区 -->
      <section class="user-banner-section">
        <div class="banner-content">
          <div class="user-avatar-section">
            <div class="avatar-upload" @click="editMode ? $refs.avatarInput.click() : null">
              <div class="user-avatar-large">
                <img :src="userInfo.avatar || 'https://picsum.photos/seed/user123/120/120.jpg'" alt="用户头像" />
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
              <h1 class="user-name">{{ userInfo.username || '用户' }}</h1>
              <p class="user-role">
                <span class="role-tag" :class="userInfo.role === 'admin' ? 'admin' : 'user'">
                  {{ userInfo.role === 'admin' ? '管理员' : '普通用户' }}
                </span>
              </p>
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

      <!-- 个人信息编辑区 -->
      <section class="info-section">
        <div class="section-header">
          <h2 class="section-title">个人信息</h2>
          <button class="edit-btn" @click="editMode = !editMode">
            {{ editMode ? '取消编辑' : '编辑信息' }}
          </button>
        </div>
        
        <div class="info-grid">
          <div class="info-card">
            <div class="info-item">
              <label class="info-label">用户名：</label>
              <span v-if="!editMode" class="info-value">{{ userInfo.username }}</span>
              <input v-else class="info-input" v-model="userInfo.username" />
            </div>
            <div class="info-item">
              <label class="info-label">手机号：</label>
              <span v-if="!editMode" class="info-value">{{ userInfo.phone || '未设置' }}</span>
              <input v-else class="info-input" v-model="userInfo.phone" />
            </div>
            <div class="info-item">
              <label class="info-label">邮箱：</label>
              <span v-if="!editMode" class="info-value">{{ userInfo.email || '未设置' }}</span>
              <input v-else class="info-input" v-model="userInfo.email" />
            </div>
            <div class="info-item">
              <label class="info-label">注册时间：</label>
              <span class="info-value">{{ formatDate(userInfo.registerTime) }}</span>
            </div>
            <div class="info-item">
              <label class="info-label">上次登录：</label>
              <span class="info-value">{{ formatDate(userInfo.lastLoginTime) }}</span>
            </div>
            <div class="info-item full-width">
              <label class="info-label">地址：</label>
              <span v-if="!editMode" class="info-value">{{ userInfo.address || '未设置' }}</span>
              <textarea v-else class="info-textarea" v-model="userInfo.address" rows="2"></textarea>
            </div>
            
            <div v-if="editMode" class="form-actions">
              <button class="save-btn" @click="saveUserInfo">保存修改</button>
              <button class="cancel-btn" @click="cancelEdit">取消</button>
            </div>
          </div>
        </div>
      </section>

      <!-- 最近活动区 -->
      <section class="activity-section">
        <div class="section-header">
          <h2 class="section-title">最近活动</h2>
        </div>
        
        <div class="activity-list">
          <div v-for="log in userLogs" :key="log.id" class="activity-item">
            <div class="activity-icon">{{ getLogIcon(log.type) }}</div>
            <div class="activity-content">
              <div class="activity-text">{{ log.action }}</div>
              <div class="activity-time">{{ formatTime(log.time) }}</div>
            </div>
          </div>
          <div v-if="userLogs.length === 0" class="empty-activity">
            <div class="empty-icon">📝</div>
            <p>暂无活动记录</p>
          </div>
        </div>
      </section>
    </main>

    <!-- 底部信息区 -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-links">
          <a href="#" class="footer-link">关于我们</a>
          <a href="#" class="footer-link">联系我们</a>
          <a href="#" class="footer-link">帮助中心</a>
          <a href="#" class="footer-link">隐私政策</a>
        </div>
        <div class="copyright">
          Copyright © 2025 产教融合平台 All Rights Reserved
        </div>
      </div>
    </footer>
  </div>
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
/* 全局样式 */
.user-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: 'Microsoft YaHei', '微软雅黑', 'Source Han Sans CN', 'Roboto', Arial, sans-serif;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  color: #333;
  scroll-behavior: smooth;
}

/* 顶部导航栏 */
.header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #e8e8e8;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.1);
  animation: slideDown 0.5s ease-out;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo {
  height: 40px;
  width: auto;
  border-radius: 4px;
}

.platform-name {
  font-size: 18px;
  font-weight: 600;
  color: #1890FF;
  letter-spacing: 1px;
}

.nav-menu {
  display: flex;
  gap: 32px;
}

.nav-item {
  padding: 8px 16px;
  text-decoration: none;
  color: #666;
  font-weight: 500;
  border-radius: 6px;
  transition: all 0.3s ease;
  position: relative;
}

.nav-item:hover,
.nav-item.active {
  color: #1890FF;
  background: rgba(24, 144, 255, 0.1);
  transform: translateY(-1px);
}

.nav-item.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 16px;
  right: 16px;
  height: 2px;
  background: #1890FF;
  border-radius: 1px;
}

.badge {
  background: #F5222D;
  color: white;
  border-radius: 10px;
  padding: 2px 6px;
  font-size: 12px;
  margin-left: 4px;
}

.auth-section {
  display: flex;
  gap: 16px;
}

/* 用户菜单样式 */
.user-menu {
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #e8e8e8;
  transition: all 0.3s ease;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-menu:hover .user-avatar {
  border-color: #1890FF;
  transform: scale(1.05);
}

.user-info {
  position: relative;
  cursor: pointer;
}

.username {
  color: #333;
  font-weight: 500;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.user-info:hover .username {
  background: rgba(24, 144, 255, 0.1);
  color: #1890FF;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-width: 120px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  z-index: 1000;
}

.user-info:hover .dropdown-menu {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-item {
  display: block;
  padding: 10px 16px;
  text-decoration: none;
  color: #333;
  border-bottom: 1px solid #f0f0f0;
  transition: all 0.3s ease;
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-item:hover {
  background: rgba(24, 144, 255, 0.1);
  color: #1890FF;
}

.logout-btn {
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  font-family: inherit;
  font-size: inherit;
  cursor: pointer;
}

/* 主要内容区域 */
.main-content {
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  width: 100%;
  animation: fadeInUp 0.8s ease-out;
  overflow-y: auto;
  max-height: calc(100vh - 64px - 80px);
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.main-content::-webkit-scrollbar {
  display: none;
}

/* 用户Banner区 */
.user-banner-section {
  background: linear-gradient(135deg, #1890FF 0%, #40a9ff 100%);
  border-radius: 12px;
  padding: 40px 32px;
  margin-bottom: 24px;
  color: white;
  position: relative;
  overflow: hidden;
  animation: bannerSlideIn 1s ease-out;
}

.user-banner-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
}

.banner-content {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-avatar-section {
  display: flex;
  align-items: center;
  gap: 24px;
}

.user-avatar-large {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid rgba(255, 255, 255, 0.3);
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
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 8px;
  letter-spacing: 1px;
}

.user-role {
  margin-bottom: 16px;
}

.role-tag {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  white-space: nowrap;
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
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  text-align: center;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 0.9rem;
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

/* 个人信息编辑区 */
.info-section {
  margin-bottom: 40px;
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