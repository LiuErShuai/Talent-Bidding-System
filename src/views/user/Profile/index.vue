<template>
  <div class="user-container">
    <!-- 顶部导航栏 -->
    <header class="main-header">
      <div class="header-inner">
        <div class="brand">
          <img src="@/assets/images/logo/桂电透明背景logo.png" alt="桂电创客空间" class="brand-logo" />
          <span class="brand-name">桂电创客空间</span>
        </div>
        
        <!-- 学生端导航 -->
        <nav class="main-nav" v-if="userInfo.role === 'student'">
          <router-link to="/home" class="nav-link" active-class="active">首页</router-link>
          <router-link to="/smart-match" class="nav-link" active-class="active">智能匹配</router-link>
          <router-link to="/growth-center" class="nav-link" active-class="active">成长中心</router-link>
          <router-link to="/my-projects" class="nav-link" active-class="active">我的项目</router-link>
          <router-link to="/tracker" class="nav-link" active-class="active">项目进度跟踪</router-link>
        </nav>
        
        <!-- 企业端导航 -->
        <nav class="main-nav" v-else-if="userInfo.role === 'enterprise'">
          <router-link to="/pre-review" class="nav-link" active-class="active">项目评审页面</router-link>
          <router-link to="/final-review" class="nav-link" active-class="active">项目发布与终审页面</router-link>
          <router-link to="/agreement-processing" class="nav-link" active-class="active">协议签署与支付归档</router-link>
          <router-link to="/tracker" class="nav-link" active-class="active">项目进度跟踪</router-link>
        </nav>
        
        <!-- 默认导航（未登录或其他角色） -->
        <nav class="main-nav" v-else>
          <router-link to="/home" class="nav-link" active-class="active">首页</router-link>
          <router-link to="/projects" class="nav-link" active-class="active">项目大厅</router-link>
          <router-link to="/my-projects" class="nav-link" active-class="active">我的项目</router-link>
          <router-link to="/statistics" class="nav-link" active-class="active">数据中心</router-link>
          <router-link to="/messages" class="nav-link" active-class="active">消息</router-link>
        </nav>
        
        <div class="auth-area">
          <template v-if="!isLoggedIn">
            <router-link to="/login" class="auth-btn solid">登录</router-link>
          </template>
          <div v-else class="user-panel">
            <!-- 角色切换按钮 -->
            <div class="role-switch" @click="toggleRole">
              <span class="role-label">{{ userInfo.role === 'student' ? '学生' : '企业' }}</span>
              <span class="role-icon">🔄</span>
            </div>
            
            <div class="user-avatar-container" @click="toggleDropdown">
              <img :src="userInfo.avatar || 'https://picsum.photos/seed/user123/40/40.jpg'" :alt="userInfo.username" class="user-avatar" />
              <div class="user-dropdown" :class="{ active: showDropdown }">
                <span class="user-name">{{ userInfo.username || '用户' }}</span>
                <span class="user-role-display">当前身份：{{ userInfo.role === 'student' ? '学生' : '企业用户' }}</span>
                
                <!-- 学生端菜单 -->
                <template v-if="userInfo.role === 'student'">
                  <button class="dropdown-link" @click.stop="goHome">首页</button>
                  <button class="dropdown-link" @click.stop="goSmartMatch">智能匹配</button>
                  <button class="dropdown-link" @click.stop="goGrowthCenter">成长中心</button>
                  <button class="dropdown-link" @click.stop="goMyProjects">我的项目</button>
                  <button class="dropdown-link" @click.stop="goTracker">项目进度跟踪</button>
                  <div class="dropdown-divider"></div>
                  <button class="dropdown-link" @click.stop="goUserCenter">个人中心</button>
                  <button class="dropdown-link danger" @click.stop="handleLogout">退出登录</button>
                </template>
                
                <!-- 企业端菜单 -->
                <template v-else-if="userInfo.role === 'enterprise'">
                  <button class="dropdown-link" @click.stop="goPreReview">项目评审页面</button>
                  <button class="dropdown-link" @click.stop="goFinalReview">项目发布与终审</button>
                  <button class="dropdown-link" @click.stop="goAgreementProcessing">协议签署与归档</button>
                  <button class="dropdown-link" @click.stop="goTracker">项目进度跟踪</button>
                  <div class="dropdown-divider"></div>
                  <button class="dropdown-link" @click.stop="goUserCenter">个人中心</button>
                  <button class="dropdown-link danger" @click.stop="handleLogout">退出登录</button>
                </template>
                
                <!-- 默认菜单 -->
                <template v-else>
                  <button class="dropdown-link" @click.stop="goUserCenter">个人中心</button>
                  <button class="dropdown-link danger" @click.stop="handleLogout">退出登录</button>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>


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

          <!-- 个人资料 -->
          <section v-if="activeSection === 'profile'" class="info-section">
        <div class="section-header">
          <h2 class="section-title">个人资料</h2>
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

    <!-- 底部信息区 -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-links">
          <router-link to="/about" class="footer-link">关于我们</router-link>
          <router-link to="/contact" class="footer-link">联系我们</router-link>
          <router-link to="/help" class="footer-link">帮助中心</router-link>
          <router-link to="/privacy" class="footer-link">隐私政策</router-link>
        </div>
        <div class="copyright">
          Copyright © 2025 产教融合平台 All Rights Reserved
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../store/user'
  import { ElMessage } from 'element-plus'
  
  const router = useRouter()
  const userStore = useUserStore()

  // 顶部导航登录状态
  const isLoggedIn = ref(false)
  const showDropdown = ref(false)

  // 个人中心内部菜单
  const activeSection = ref('profile')

  // 编辑模式
  const editMode = ref(false)
  const avatarInput = ref(null)

// 用户信息
const userInfo = reactive({
  username: userStore.username || '用户',
  role: 'student', // student / enterprise
  phone: '138****1234',
  email: 'user@example.com',
  registerTime: new Date('2024-01-01'),
  lastLoginTime: new Date(),
  address: '北京市朝阳区',
  avatar: ''
  })
  
  const userRole = computed(() => userInfo.role || 'student')

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

// 检查登录状态
const checkLoginStatus = () => {
  const token = localStorage.getItem('token')
  if (token) {
    isLoggedIn.value = true
    const userData = localStorage.getItem('userData')
    if (userData) {
      const parsed = JSON.parse(userData)
      userInfo.username = parsed.username || userInfo.username
      userInfo.role = parsed.role || userInfo.role
      userInfo.avatar = parsed.avatar || userInfo.avatar
    }
  } else {
    isLoggedIn.value = false
  }
}

// 切换下拉菜单
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

// 隐藏下拉菜单
const hideDropdown = () => {
  showDropdown.value = false
}

// 导航到成长中心
const goGrowthCenter = () => {
  hideDropdown()
  router.push('/growth-center')
}

// 导航到智能匹配
const goSmartMatch = () => {
  hideDropdown()
  router.push('/smart-match')
}

// 导航到个人中心
const goUserCenter = () => {
  hideDropdown()
  router.push('/user')
}

// 角色切换功能
const toggleRole = () => {
  userInfo.role = userInfo.role === 'student' ? 'enterprise' : 'student'
  ElMessage.success(`已切换到${userInfo.role === 'student' ? '学生' : '企业'}身份`)
  
  // 保存角色到本地存储
  const userData = localStorage.getItem('userData')
  if (userData) {
    const parsed = JSON.parse(userData)
    parsed.role = userInfo.role
    localStorage.setItem('userData', JSON.stringify(parsed))
  }
}

// 导航功能
const goHome = () => {
  hideDropdown()
  router.push('/home')
}

const goMyProjects = () => {
  hideDropdown()
  router.push('/my-projects')
}

const goTracker = () => {
  hideDropdown()
  router.push('/tracker')
}

const goPreReview = () => {
  hideDropdown()
  router.push('/pre-review')
}

const goFinalReview = () => {
  hideDropdown()
  router.push('/final-review')
}

const goAgreementProcessing = () => {
  hideDropdown()
  router.push('/agreement-processing')
}

// 导航到项目评审
const goProjectReview = () => {
  hideDropdown()
  router.push('/pre-review')
}

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
  localStorage.removeItem('token')
  localStorage.removeItem('userData')
  isLoggedIn.value = false
  showDropdown.value = false
  userInfo.username = '用户'
  userInfo.role = 'student'
  userInfo.avatar = ''
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
.main-header {
  position: relative;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 6px 30px rgba(15, 39, 106, 0.1);
  z-index: 10;
}

.header-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-logo {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  object-fit: cover;
  box-shadow: 0 10px 20px rgba(12, 80, 194, 0.2);
}

.brand-name {
  font-size: 18px;
  font-weight: 700;
  color: #0f2c85;
}

.main-nav {
  flex: 1;
  display: flex;
  justify-content: center;
  gap: 32px;
}

.nav-link {
  position: relative;
  text-decoration: none;
  color: #5a6486;
  font-weight: 600;
}

.nav-link.active,
.nav-link:hover {
  color: #0c5fe7;
}

.nav-link.active::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -8px;
  width: 100%;
  height: 3px;
  border-radius: 999px;
  background: linear-gradient(120deg, #0c5fe7, #2fb7ff);
}

.auth-area {
  display: flex;
  align-items: center;
  gap: 12px;
}

.auth-btn {
  padding: 8px 22px;
  border-radius: 999px;
  border: 1px solid transparent;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.2s;
}

.auth-btn.solid {
  background: linear-gradient(120deg, #0c5fe7, #2fb7ff);
  color: #fff;
  box-shadow: 0 12px 24px rgba(12, 95, 231, 0.25);
}

.auth-btn:hover {
  transform: translateY(-2px);
}

.user-panel {
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
}

.role-switch {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(12, 95, 231, 0.1);
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(12, 95, 231, 0.2);
}

.role-switch:hover {
  background: rgba(12, 95, 231, 0.15);
  transform: translateY(-1px);
}

.role-label {
  font-size: 14px;
  font-weight: 600;
  color: #0c5fe7;
}

.role-icon {
  font-size: 12px;
  transition: transform 0.3s ease;
}

.role-switch:hover .role-icon {
  transform: rotate(180deg);
}

.user-avatar-container {
  position: relative;
  cursor: pointer;
}

.user-avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 2px solid rgba(12, 95, 231, 0.2);
  object-fit: cover;
  transition: transform 0.2s;
}

.user-avatar-container:hover .user-avatar {
  transform: scale(1.05);
}

.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: #fff;
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 10px 30px rgba(15, 39, 106, 0.15);
  border: 1px solid #e0e6f2;
  min-width: 160px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  z-index: 1000;
}

.user-dropdown.active {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.user-name {
  font-weight: 600;
  color: #1f274b;
  margin-bottom: 4px;
}

.user-role-display {
  font-size: 12px;
  color: #8a94a6;
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f3fa;
}

.dropdown-divider {
  height: 1px;
  background: #f0f3fa;
  margin: 8px 0;
}

.dropdown-link {
  background: none;
  border: none;
  padding: 8px 12px;
  color: #5a6486;
  text-decoration: none;
  font-size: 14px;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s ease;
  text-align: left;
}

.dropdown-link:hover {
  background: #f5f7fb;
  color: #0c5fe7;
}

.dropdown-link.danger {
  color: #ff4d4f;
}

.dropdown-link.danger:hover {
  background: #fff2f0;
  color: #ff4d4f;
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
  padding: 24px 24px;
  margin-bottom: 24px;
  background: #ffffff;
  border: 1px dashed #d9d9d9;
  position: relative;
}

.banner-content {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 32px;
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
  font-size: 2rem;
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
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  text-align: left;
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
