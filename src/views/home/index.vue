<template>
  <div class="home-page">
    <header class="main-header">
      <div class="header-inner">
        <div class="brand">
          <img src="../../../assets/Logo.png" alt="产教融合平台" class="brand-logo" />
          <span class="brand-name">产教融合项目揭榜平台</span>
        </div>
        <nav class="main-nav">
          <router-link to="/home" class="nav-link" active-class="active">首页</router-link>
          <router-link to="/projects" class="nav-link" active-class="active">项目大厅</router-link>
          <router-link to="/my-projects" class="nav-link" active-class="active">我的项目</router-link>
          <router-link to="/statistics" class="nav-link" active-class="active">数据中心</router-link>
          <router-link to="/messages" class="nav-link messages" active-class="active">
            <span>消息</span>
            <span v-if="isLoggedIn && unreadCount > 0" class="badge">{{ unreadCount }}</span>
          </router-link>
        </nav>
        <div class="auth-area">
          <template v-if="!isLoggedIn">
            <router-link to="/login" class="auth-btn solid">登录</router-link>
          </template>
          <div v-else class="user-panel" @click="toggleDropdown">
            <img :src="userInfo.avatar" :alt="userInfo.username" class="user-avatar" />
            <div class="user-dropdown" :class="{ active: showDropdown }">
              <span class="user-name">{{ userInfo.username }}</span>
              <!-- 学生端菜单 -->
              <template v-if="userRole === 'student'">
                <button class="dropdown-link" @click.stop="goGrowthCenter">成长中心</button>
                <button class="dropdown-link" @click.stop="goSmartMatch">智能匹配</button>
                <button class="dropdown-link" @click.stop="goUserCenter">个人中心</button>
                <button class="dropdown-link danger" @click.stop="handleLogout">退出登录</button>
              </template>
              <!-- 企业端菜单 -->
              <template v-else>
                <button class="dropdown-link" @click.stop="goProjectReview">项目评审</button>
                <button class="dropdown-link" @click.stop="goUserCenter">个人中心</button>
                <button class="dropdown-link danger" @click.stop="handleLogout">退出登录</button>
              </template>
            </div>
          </div>
        </div>
      </div>
    </header>

    <main class="page-body">
      <!-- Hero Section：创客空间 -->
      <section class="hero-section">
        <div class="hero-container">
          <div class="hero-grid">
            <!-- 左侧内容 -->
            <div class="hero-left">
              <h1 class="hero-title">创客空间</h1>
              <p class="hero-description">
                面向大众普惠群体征集技术成果，创意思想和解决方案，实现供需高效对接！
              </p>
              <div class="stats-grid">
                <div class="stat-item">
                  <div class="stat-value">778</div>
                  <div class="stat-label">创客任务总数(个)</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value">972</div>
                  <div class="stat-label">创客人数(人)</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value">9510.4<span class="stat-unit">w</span></div>
                  <div class="stat-label">当前悬金池总额(元)</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value">4973.3<span class="stat-unit">w</span></div>
                  <div class="stat-label">已支付悬金额(元)</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value">23+</div>
                  <div class="stat-label">任务领域(个)</div>
                </div>
              </div>
            </div>
            <!-- 右侧卡片 -->
            <div class="hero-right">
              <div class="hero-card">
                <!-- 装饰性渐变圆形 -->
                <div class="decoration-circle circle-1"></div>
                <div class="decoration-circle circle-2"></div>
                <div class="decoration-circle circle-3"></div>
                <!-- 内容 -->
                <div class="hero-card-content">
                  <h2 class="hero-card-title">创客文化</h2>
                  <p class="hero-card-text">
                    创客精神引领创新，开源文化汇聚众智，共创无限可能
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 筛选器区域 -->
      <section class="filter-section">
        <div class="filter-card">
          <!-- 任务领域筛选 -->
          <div class="filter-row">
            <span class="filter-label">任务领域:</span>
            <div class="filter-buttons">
              <button
                v-for="field in taskFields"
                :key="field"
                :class="['filter-btn', { active: selectedField === field }]"
                @click="selectedField = field"
              >
                {{ field }}
              </button>
              <button class="filter-btn more-btn">更多 ≡</button>
            </div>
          </div>
          <!-- 任务状态筛选 -->
          <div class="filter-row">
            <span class="filter-label">任务状态:</span>
            <div class="filter-buttons">
              <button
                v-for="status in taskStatuses"
                :key="status"
                :class="['filter-btn', { active: selectedStatus === status }]"
                @click="selectedStatus = status"
              >
                {{ status }}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section class="module">
        <div class="module-header">
          <h2>热门项目推荐</h2>
          <router-link to="/projects" class="more-link">更多 &gt;</router-link>
        </div>
        <div class="project-grid">
          <router-link 
            v-for="project in hotProjects" 
            :key="project.id" 
            :to="`/projects/${project.id}`"
            class="project-card"
          >
            <div class="project-head">
              <h3>{{ project.title }}</h3>
            </div>
            <p class="project-desc">{{ project.description }}</p>
            <div class="project-meta">
              <span class="price">{{ project.price }}</span>
              <span class="meta-title">预算</span>
            </div>
            <div class="project-status">
              <span :class="['status-tag', project.status]">{{ project.statusText }}</span>
            </div>
          </router-link>
        </div>
      </section>

      <section class="module">
        <div class="module-header">
          <h2>最新动态</h2>
          <router-link to="/news" class="more-link">更多 &gt;</router-link>
        </div>
        <ul class="news-list">
          <li class="news-item" v-for="item in latestNews" :key="item.id">
            <span class="dot">•</span>
            <span class="news-text">{{ item.content }}</span>
            <span class="news-time">{{ item.time }}</span>
          </li>
        </ul>
      </section>

      <!-- 合作企业：展示合作企业，增强信任感 -->
      <section class="module">
        <div class="module-header">
          <h2>合作企业</h2>
          <p class="module-subtitle">与众多知名企业建立深度合作关系</p>
        </div>
        <div class="partners-grid">
          <div class="partner-card" v-for="partner in partners" :key="partner.id">
            <div class="partner-logo">{{ partner.logo }}</div>
            <div class="partner-name">{{ partner.name }}</div>
          </div>
        </div>
      </section>

      <footer class="page-footer">
        <div class="footer-links">
          <router-link to="/about" class="footer-link">关于我们</router-link>
          <router-link to="/contact" class="footer-link">联系我们</router-link>
          <router-link to="/help" class="footer-link">帮助中心</router-link>
          <router-link to="/privacy" class="footer-link">隐私政策</router-link>
        </div>
        <p class="copyright">
          Copyright © 2025 产教融合平台 All Rights Reserved
        </p>
      </footer>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isLoggedIn = ref(false)
const showDropdown = ref(false)
const unreadCount = ref(2)
const userInfo = ref({
  username: '张三',
  role: 'student',
  avatar: 'https://picsum.photos/seed/user123/40/40.jpg'
})

const userRole = computed(() => userInfo.value.role || 'student')

// 筛选器数据
const taskFields = ref([
  '全部', '理论研究', '政策法规', '医学', '电子信息',
  '通信工程', '计算机科学', '软件工程', '人工智能', '知识'
])

const taskStatuses = ref([
  '全部', '成果征集中', '成果评选中', '公示中',
  '协议签订中', '支付中', '已完成', '已关闭'
])

const selectedField = ref('全部')
const selectedStatus = ref('全部')

const hotProjects = ref([
  {
    id: 1,
    title: 'AI智能助手开发',
    price: '¥5,000',
    status: 'bidding',
    statusText: '揭榜中',
    description: '基于深度学习的智能客服系统'
  },
  {
    id: 2,
    title: 'Web前端开发',
    price: '¥8,000',
    status: 'bidding',
    statusText: '揭榜中',
    description: '响应式企业官网开发'
  },
  {
    id: 3,
    title: '数据分析平台',
    price: '¥6,000',
    status: 'reviewing',
    statusText: '评审中',
    description: '大数据可视化分析系统'
  },
  {
    id: 4,
    title: '移动应用开发',
    price: '¥10,000',
    status: 'bidding',
    statusText: '揭榜中',
    description: '跨平台移动应用开发'
  }
])

const latestNews = ref([
  { id: 1, content: '某某学生团队成功中标"XX系统开发"项目', time: '2小时前' },
  { id: 2, content: 'XX公司发布"智能客服机器人"项目', time: '3小时前' },
  { id: 3, content: '恭喜张三同学获得本月"最佳创客"称号', time: '1天前' }
])

const partners = ref([
  { id: 1, name: '腾讯科技', logo: 'T' },
  { id: 2, name: '阿里巴巴', logo: 'A' },
  { id: 3, name: '华为技术', logo: 'H' },
  { id: 4, name: '字节跳动', logo: 'B' },
  { id: 5, name: '百度', logo: 'B' },
  { id: 6, name: '京东', logo: 'J' }
])

const checkLoginStatus = () => {
  const token = localStorage.getItem('token')
  if (token) {
    isLoggedIn.value = true
    const userData = localStorage.getItem('userData')
    if (userData) {
      const parsed = JSON.parse(userData)
      userInfo.value = {
        ...userInfo.value,
        ...parsed
      }
    }
  } else {
    isLoggedIn.value = false
    // 未登录默认全部已读
    unreadCount.value = 0
  }
}

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const hideDropdown = () => {
  showDropdown.value = false
}

const goGrowthCenter = () => {
  hideDropdown()
  router.push('/growth-center')
}

const goSmartMatch = () => {
  hideDropdown()
  router.push('/smart-match')
}

const goUserCenter = () => {
  hideDropdown()
  router.push('/user')
}

const goProjectReview = () => {
  hideDropdown()
  router.push('/my-projects')
}

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('userData')
  isLoggedIn.value = false
  showDropdown.value = false
  userInfo.value = {
    username: '张三',
    role: 'student',
    avatar: 'https://picsum.photos/seed/user123/40/40.jpg'
  }
  localStorage.removeItem('loginFormData')
  localStorage.removeItem('loginRemember')
  router.push('/login')
}

onMounted(() => {
  checkLoginStatus()
})
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f7fb;
  color: #1f274b;
}



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

.messages {
  display: flex;
  align-items: center;
  gap: 6px;
}

.badge {
  display: inline-flex;
  min-width: 18px;
  padding: 0 6px;
  height: 18px;
  border-radius: 999px;
  background: #ff4d4f;
  color: #fff;
  font-size: 12px;
  justify-content: center;
  align-items: center;
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
  gap: 12px;
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

.user-panel:hover .user-avatar {
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
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f3fa;
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

.page-body {
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 48px 24px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  /* 滑动效果 */
  overflow-y: auto;
  max-height: calc(100vh - 80px);
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.page-body::-webkit-scrollbar {
  display: none;
}

.page-footer {
  margin-top: auto;
  border-top: 1px solid #e0e6f2;
  padding: 32px 16px 40px;
  text-align: center;
  color: #7b89a9;
  background: #fff;
}

/* Hero Section */
.hero-section {
  background: #ffffff;
  margin-bottom: 32px;
}

.hero-container {
  width: 100%;
}

.hero-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px;
}

.hero-left {
  display: flex;
  flex-direction: column;
}

.hero-title {
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 16px;
  color: #111827;
}

.hero-description {
  color: #4b5563;
  margin-bottom: 32px;
  line-height: 1.6;
  font-size: 16px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.stat-item {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 36px;
  font-weight: bold;
  color: #2563eb;
  margin-bottom: 8px;
}

.stat-unit {
  font-size: 24px;
}

.stat-label {
  font-size: 14px;
  color: #4b5563;
}

.hero-right {
  position: relative;
}

.hero-card {
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  background: linear-gradient(to bottom right, #3b82f6, #60a5fa, #93c5fd);
  padding: 48px;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.decoration-circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.5;
}

.circle-1 {
  top: 0;
  right: 0;
  width: 256px;
  height: 256px;
  background: linear-gradient(to bottom right, #86efac, transparent);
}

.circle-2 {
  bottom: 0;
  left: 0;
  width: 384px;
  height: 384px;
  background: linear-gradient(to top right, #2563eb, transparent);
  opacity: 0.3;
}

.circle-3 {
  top: 25%;
  left: 25%;
  width: 192px;
  height: 192px;
  background: linear-gradient(to bottom right, #67e8f9, transparent);
  opacity: 0.4;
}

.hero-card-content {
  position: relative;
  z-index: 10;
  text-align: center;
  color: #ffffff;
}

.hero-card-title {
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 16px;
}

.hero-card-text {
  font-size: 18px;
  opacity: 0.9;
  line-height: 1.6;
}

/* 筛选器区域 */
.filter-section {
  margin-bottom: 24px;
}

.filter-card {
  background: #ffffff;
  border-radius: 8px;
  padding: 24px;
}

.filter-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.filter-row:last-child {
  margin-bottom: 0;
}

.filter-label {
  color: #374151;
  font-weight: 500;
  white-space: nowrap;
  min-width: 80px;
}

.filter-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.filter-btn {
  padding: 6px 16px;
  border-radius: 4px;
  border: none;
  background: transparent;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
}

.filter-btn:hover {
  background: #f9fafb;
}

.filter-btn.active {
  background: #dbeafe;
  color: #2563eb;
}

.more-btn {
  color: #2563eb;
}

.more-btn:hover {
  color: #1d4ed8;
  background: transparent;
}

.module {
  background: #fff;
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 25px 50px rgba(15, 39, 106, 0.08);
}

.module-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.project-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;
}

.project-card {
  border-radius: 20px;
  border: 1px solid #edf1fb;
  padding: 20px;
  background: linear-gradient(180deg, #ffffff, #f9fbff);
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: transform 0.2s, box-shadow 0.2s;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
}

.project-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 40px rgba(15, 39, 106, 0.12);
}

.project-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-tag {
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12px;
  color: #fff;
}

.status-tag.bidding {
  background: linear-gradient(120deg, #0c5fe7, #2fb7ff);
}

.status-tag.reviewing {
  background: linear-gradient(120deg, #ff9f0a, #ffb347);
}

.project-desc {
  color: #5f6c8b;
  min-height: 48px;
  flex: 1;
}

.project-meta {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.price {
  font-size: 20px;
  font-weight: 700;
  color: #0f2c85;
}

.meta-title {
  color: #9aa5c2;
}

.project-status {
  display: flex;
  justify-content: flex-end;
  margin-top: auto;
}

.news-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.news-item {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #415070;
}

.dot {
  font-size: 24px;
  color: #0c5fe7;
  line-height: 1;
}

.news-text {
  flex: 1;
}

.news-time {
  color: #9aa5c2;
  font-size: 14px;
}

.partners-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;
}

.partner-card {
  border: 1px dashed #cfd7f1;
  border-radius: 16px;
  padding: 30px;
  text-align: center;
  color: #4f5d7a;
  font-weight: 600;
  background: #f8faff;
}

.page-footer {
  border-top: 1px solid #e0e6f2;
  padding: 32px 16px 40px;
  text-align: center;
  color: #7b89a9;
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: 32px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.footer-link {
  color: inherit;
  text-decoration: none;
  font-weight: 600;
}

@media (max-width: 1024px) {
  .header-inner {
    flex-direction: column;
  }

  .main-nav {
    flex-wrap: wrap;
  }

  .project-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .stats-section,
  .partners-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .page-body {
    padding: 32px 16px 48px;
  }

  .hero {
    padding: 32px 20px;
  }

  .project-grid,
  .stats-section,
  .partners-grid {
    grid-template-columns: 1fr;
  }

  .project-actions {
    flex-direction: column;
  }
}
</style>
