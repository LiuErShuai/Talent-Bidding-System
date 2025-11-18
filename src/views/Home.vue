<template>
  <div class="home-page">
    <header class="main-header">
      <div class="header-inner">
        <div class="brand">
          <img src="../assets/Logo.png" alt="产教融合平台" class="brand-logo" />
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
      <!-- 轮播Banner区：展示平台特色、优秀案例、重要通知 -->
      <section class="banner-section">
        <div class="banner-container">
          <button class="banner-arrow banner-arrow-left" @click="prevBanner">&#8249;</button>
          <button class="banner-arrow banner-arrow-right" @click="nextBanner">&#8250;</button>

          <div class="banner-slider">
            <div
              v-for="(slide, index) in bannerSlides"
              :key="slide.id"
              class="banner-slide"
              :class="[slide.class, getBannerSlideClass(index)]"
            >
              <div class="banner-card">
                <div class="banner-card-content">
                  <span class="banner-tag">{{ slide.tag }}</span>
                  <h1 class="banner-title">{{ slide.title }}</h1>
                  <p class="banner-description">{{ slide.description }}</p>
                  <div class="banner-actions">
                    <router-link :to="slide.actionLink" class="banner-btn primary">
                      {{ slide.actionText }}
                    </router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="banner-indicators">
            <button
              class="indicator"
              :class="{ active: index === activeBannerIndex }"
              v-for="(slide, index) in bannerSlides"
              :key="index"
              @click="goToBanner(index)"
            ></button>
          </div>
        </div>
      </section>

      <section class="stats-section">
        <div class="stat-card" v-for="stat in stats" :key="stat.label">
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-label">{{ stat.label }}</div>
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
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

const stats = ref([
  { label: '项目总数', value: '1,234' },
  { label: '企业总数', value: '456' },
  { label: '奖金总额', value: '328.5w' },
  { label: '学生总数', value: '892' }
])

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

const activeBannerIndex = ref(0)
let bannerTimer = null

const bannerSlides = ref([
  {
    id: 1,
    tag: '平台特色',
    title: '产教融合，创新未来',
    description: '连接高校与企业，让知识创造价值，让创意落地生根',
    actionText: '了解平台',
    actionLink: '/about',
    class: 'banner-1'
  },
  {
    id: 2,
    tag: '优秀案例',
    title: '成功案例分享',
    description: '多位学生通过平台成功完成项目，获得丰厚奖励和实习机会',
    actionText: '查看案例',
    actionLink: '/projects',
    class: 'banner-2'
  },
  {
    id: 3,
    tag: '重要通知',
    title: '新项目发布',
    description: 'AI智能助手开发项目已上线，预算丰厚，欢迎揭榜',
    actionText: '立即查看',
    actionLink: '/projects',
    class: 'banner-3'
  }
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

const startBannerAutoPlay = () => {
  if (!bannerSlides.value.length) return
  stopBannerAutoPlay()
  bannerTimer = setInterval(() => {
    activeBannerIndex.value = (activeBannerIndex.value + 1) % bannerSlides.value.length
  }, 5000)
}

const stopBannerAutoPlay = () => {
  if (bannerTimer) {
    clearInterval(bannerTimer)
    bannerTimer = null
  }
}

const goToBanner = (index) => {
  if (index < 0 || index >= bannerSlides.value.length) return
  activeBannerIndex.value = index
  startBannerAutoPlay()
}

const prevBanner = () => {
  if (!bannerSlides.value.length) return
  const total = bannerSlides.value.length
  const nextIndex = (activeBannerIndex.value - 1 + total) % total
  goToBanner(nextIndex)
}

const nextBanner = () => {
  if (!bannerSlides.value.length) return
  const total = bannerSlides.value.length
  const nextIndex = (activeBannerIndex.value + 1) % total
  goToBanner(nextIndex)
}

const getBannerSlideClass = (index) => {
  const total = bannerSlides.value.length
  if (!total) return ''

  if (index === activeBannerIndex.value) {
    return 'is-center'
  }

  const prevIndex = (activeBannerIndex.value - 1 + total) % total
  const nextIndex = (activeBannerIndex.value + 1) % total

  if (index === prevIndex) return 'is-left'
  if (index === nextIndex) return 'is-right'

  return 'is-hidden'
}

onMounted(() => {
  checkLoginStatus()
  startBannerAutoPlay()
})

onUnmounted(() => {
  stopBannerAutoPlay()
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

.banner-section {
  width: 100%;
}

.banner-container {
  position: relative;
  overflow: hidden;
  border-radius: 28px;
  padding: 28px 12px 40px;
  background: linear-gradient(135deg, #f6f8ff, #e8ecf8);
  box-shadow: 0 18px 40px rgba(15, 39, 106, 0.12);
}

.banner-slider {
  position: relative;
  height: 240px;
}

.banner-slide {
  position: absolute;
  top: 0;
  left: 50%;
  width: 68%;
  max-width: 820px;
  transform: translateX(-50%) scale(0.85);
  opacity: 0;
  transition: transform 0.5s ease, opacity 0.5s ease, z-index 0.5s ease;
  z-index: 1;
}

.banner-slide.is-center {
  opacity: 1;
  z-index: 3;
  transform: translateX(-50%) scale(1);
}

.banner-slide.is-left {
  opacity: 0.7;
  z-index: 2;
  transform: translateX(-118%) scale(0.92);
}

.banner-slide.is-right {
  opacity: 0.7;
  z-index: 2;
  transform: translateX(18%) scale(0.92);
}

.banner-slide.is-hidden {
  opacity: 0;
  z-index: 1;
  pointer-events: none;
}

.banner-card {
  height: 100%;
  border-radius: 24px;
  overflow: hidden;
  background: radial-gradient(circle at 0 0, #4a6bff 0, #1b1f3a 55%, #111320 100%);
  box-shadow: 0 26px 48px rgba(7, 15, 46, 0.55);
  display: flex;
  align-items: flex-end;
}

.banner-card-content {
  width: 100%;
  padding: 26px 40px 32px;
  color: #fff;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.08));
  backdrop-filter: blur(6px);
}

.banner-content {
  max-width: 640px;
}

.banner-tag {
  display: inline-block;
  padding: 4px 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.18);
  letter-spacing: 4px;
  font-size: 12px;
  margin-bottom: 12px;
}

.banner-title {
  font-size: 30px;
  font-weight: 700;
  margin-bottom: 12px;
}

.banner-description {
  font-size: 16px;
  opacity: 0.9;
  margin-bottom: 24px;
  max-width: 520px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.banner-actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.banner-btn {
  padding: 10px 26px;
  border-radius: 999px;
  text-decoration: none;
  border: 1px solid rgba(255, 255, 255, 0.85);
  font-weight: 600;
  color: #1b51da;
  background: #fff;
  box-shadow: 0 12px 24px rgba(8, 31, 89, 0.3);
}

.banner-slide.is-left .banner-card-content,
.banner-slide.is-right .banner-card-content {
  opacity: 0.7;
}

.banner-slide.is-left .banner-btn,
.banner-slide.is-right .banner-btn {
  box-shadow: none;
}

.banner-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  /* 默认：半透明灰白色按钮 */
  background: rgba(255, 255, 255, 0.35);
  color: #4a4a4a;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.25);
  /* 默认不显示，鼠标靠近轮播区时再显现 */
  opacity: 0;
  transition: opacity 0.2s ease, background 0.2s ease, transform 0.2s ease;
  z-index: 6;
}

.banner-arrow-left {
  left: 16px;
}

.banner-arrow-right {
  right: 16px;
}

.banner-container:hover .banner-arrow {
  opacity: 1;
}

.banner-arrow:hover {
  /* 悬停：更明亮一些 */
  background: rgba(255, 255, 255, 0.75);
  transform: translateY(-50%) scale(1.05);
}

.banner-arrow:active {
  /* 点击：基本不透明，略微缩小作为按压反馈 */
  background: rgba(255, 255, 255, 0.95);
  transform: translateY(-50%) scale(0.97);
}

.banner-indicators {
  position: absolute;
  right: 32px;
  bottom: 24px;
  display: flex;
  gap: 8px;
}

.indicator {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  border: none;
  background: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  transition: width 0.2s ease, background 0.2s ease;
}

.indicator.active {
  width: 24px;
  background: #fff;
}




.stats-section {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;
}

.stat-card {
  background: #fff;
  border-radius: 20px;
  text-align: center;
  padding: 24px;
  box-shadow: 0 18px 35px rgba(15, 39, 106, 0.08);
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #0f2c85;
}

.stat-label {
  color: #5f6c8b;
  margin-top: 8px;
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
