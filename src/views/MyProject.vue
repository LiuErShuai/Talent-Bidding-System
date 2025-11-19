<template>
  <div class="myproject-page">
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

    <div class="myproject-container">
      <div class="myproject-layout">
        <!-- 侧边栏：学生与企业展示不同 -->
        <aside class="sidebar">
          <!-- 学生端侧边栏 -->
          <template v-if="userRole === 'student'">
            <div class="sidebar-section">
              <div class="sidebar-title">我的项目</div>
              <button
                class="sidebar-item"
                :class="{ active: activeModule === 'projects' && activeStatus === 'ongoing' }"
                @click="activeSidebar = 'ongoing'; activeStatus = 'ongoing'; activeModule = 'projects'"
              >
                进行中 ({{ ongoingCount }})
              </button>
              <button
                class="sidebar-item"
                :class="{ active: activeModule === 'projects' && activeStatus === 'awarded' }"
                @click="activeSidebar = 'awarded'; activeStatus = 'awarded'; activeModule = 'projects'"
              >
                已揭榜 ({{ awardedCount }})
              </button>
              <button
                class="sidebar-item"
                :class="{ active: activeModule === 'projects' && activeStatus === 'review' }"
                @click="activeSidebar = 'review'; activeStatus = 'review'; activeModule = 'projects'"
              >
                待评审 ({{ reviewCount }})
              </button>
              <button
                class="sidebar-item"
                :class="{ active: activeModule === 'projects' && activeStatus === 'finished' }"
                @click="activeSidebar = 'finished'; activeStatus = 'finished'; activeModule = 'projects'"
              >
                已完成 ({{ finishedCount }})
              </button>
            </div>

            <div class="sidebar-section">
              <div class="sidebar-title">我的团队</div>
              <button
                class="sidebar-item"
                :class="{ active: activeModule === 'team' && activeTeam === 'dev' }"
                @click="setTeamModule('dev')"
              >
                智能开发小组
              </button>
              <button
                class="sidebar-item"
                :class="{ active: activeModule === 'team' && activeTeam === 'ai' }"
                @click="setTeamModule('ai')"
              >
                AI创新团队
              </button>
            </div>

            <div class="sidebar-section">
              <div class="sidebar-title">我的成果</div>
              <button
                class="sidebar-item"
                :class="{ active: activeModule === 'results' && activeResult === 'pending' }"
                @click="setResultModule('pending')"
              >
                待提交 (2)
              </button>
              <button
                class="sidebar-item"
                :class="{ active: activeModule === 'results' && activeResult === 'review' }"
                @click="setResultModule('review')"
              >
                评审中 (3)
              </button>
              <button
                class="sidebar-item"
                :class="{ active: activeModule === 'results' && activeResult === 'passed' }"
                @click="setResultModule('passed')"
              >
                已通过 (8)
              </button>
            </div>

            <div class="sidebar-section">
              <div class="sidebar-title">我的数据</div>
              <button
                class="sidebar-item"
                :class="{ active: activeModule === 'data' && activeData === 'radar' }"
                @click="setDataModule('radar')"
              >
                能力雷达图
              </button>
              <button
                class="sidebar-item"
                :class="{ active: activeModule === 'data' && activeData === 'stats' }"
                @click="setDataModule('stats')"
              >
                项目统计
              </button>
              <button
                class="sidebar-item"
                :class="{ active: activeModule === 'data' && activeData === 'income' }"
                @click="setDataModule('income')"
              >
                收入明细
              </button>
            </div>
          </template>

          <!-- 企业端侧边栏：使用角色标签 -->
          <template v-else>
            <div class="sidebar-section">
              <div class="sidebar-title">我的项目</div>
              <button
                v-for="tab in roleTabs"
                :key="tab.key"
                class="sidebar-item"
                :class="{ active: activeRoleTab === tab.key }"
                @click="activeRoleTab = tab.key"
              >
                {{ tab.label }}
              </button>
            </div>
          </template>
        </aside>

        <!-- 主内容区 -->
        <section class="main-content">
          <!-- 学生端：根据侧边栏切换不同模块 -->
          <template v-if="userRole === 'student'">
            <!-- 我的项目模块 -->
            <div v-if="activeModule === 'projects'">
              <div class="section-header">
                <h2 class="section-title">
                  进行中的项目 ({{ filteredProjects.length }})
                </h2>
              </div>

              <div class="project-list">
                <article
                  v-for="project in filteredProjects"
                  :key="project.id"
                  class="project-card"
                  @click="viewDetail(project)"
                >
                  <div class="project-card-main">
                    <div class="project-card-header">
                      <h3 class="project-name">{{ project.name }}</h3>
                      <span class="project-tag" :class="project.status">
                        {{ project.statusText }}
                      </span>
                    </div>

                    <div class="project-meta-row">
                      <span>状态：{{ project.stageText }}</span>
                      <span>进度：{{ project.progress }}%</span>
                      <span>剩余时间：{{ project.remainDays }}天</span>
                      <span>奖金：￥{{ project.reward.toLocaleString() }}</span>
                    </div>

                    <p class="project-brief">{{ project.brief }}</p>

                    <div class="project-actions-row">
                      <div class="project-actions">
                        <button
                          v-if="project.canUpload"
                          class="primary-chip"
                          @click.stop="uploadDeliverable(project)"
                        >
                          {{ project.uploadLabel }}
                        </button>
                        <button
                          v-if="project.canCollaborate"
                          class="ghost-chip"
                          @click.stop="openTeamCollab(project)"
                        >
                          团队协作
                        </button>
                      </div>
                      <div class="project-progress">
                        <div class="progress-bar">
                          <div
                            class="progress-inner"
                            :style="{ width: project.progress + '%' }"
                          ></div>
                        </div>
                        <span class="progress-text">{{ project.progress }}%</span>
                      </div>
                    </div>
                  </div>
                </article>

                <div v-if="filteredProjects.length === 0" class="empty-state">
                  暂无符合条件的项目
                </div>
              </div>
            </div>

            <!-- 我的团队模块 -->
            <div v-else-if="activeModule === 'team'">
              <div class="section-header">
                <h2 class="section-title">我的团队</h2>
              </div>
              <div class="project-list">
                <div class="project-card" v-if="activeTeam === 'dev'">
                  <div class="project-card-main">
                    <div class="project-card-header">
                      <h3 class="project-name">智能开发小组</h3>
                    </div>
                    <p class="project-brief">负责平台前端与移动端开发的学生团队。</p>
                  </div>
                </div>
                <div class="project-card" v-else-if="activeTeam === 'ai'">
                  <div class="project-card-main">
                    <div class="project-card-header">
                      <h3 class="project-name">AI创新团队</h3>
                    </div>
                    <p class="project-brief">聚焦人工智能与数据分析方向的创新团队。</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- 我的成果模块 -->
            <div v-else-if="activeModule === 'results'">
              <div class="section-header">
                <h2 class="section-title">我的成果</h2>
              </div>
              <div class="project-list">
                <div class="project-card" v-if="activeResult === 'pending'">
                  <div class="project-card-main">
                    <div class="project-card-header">
                      <h3 class="project-name">待提交 (2)</h3>
                    </div>
                    <p class="project-brief">还有 2 个项目待上传最终成果，请尽快完成提交。</p>
                  </div>
                </div>
                <div class="project-card" v-else-if="activeResult === 'review'">
                  <div class="project-card-main">
                    <div class="project-card-header">
                      <h3 class="project-name">评审中 (3)</h3>
                    </div>
                    <p class="project-brief">3 个项目成果正在评审中，请耐心等待结果。</p>
                  </div>
                </div>
                <div class="project-card" v-else-if="activeResult === 'passed'">
                  <div class="project-card-main">
                    <div class="project-card-header">
                      <h3 class="project-name">已通过 (8)</h3>
                    </div>
                    <p class="project-brief">恭喜！已有 8 个项目成果通过评审。</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- 我的数据模块 -->
            <div v-else-if="activeModule === 'data'">
              <div class="section-header">
                <h2 class="section-title">我的数据</h2>
              </div>
              <div class="project-list">
                <div class="project-card" v-if="activeData === 'radar'">
                  <div class="project-card-main">
                    <div class="project-card-header">
                      <h3 class="project-name">能力雷达图</h3>
                    </div>
                    <p class="project-brief">从技术、项目管理、团队协作等多维度评估你的综合能力。</p>
                  </div>
                </div>
                <div class="project-card" v-else-if="activeData === 'stats'">
                  <div class="project-card-main">
                    <div class="project-card-header">
                      <h3 class="project-name">项目统计</h3>
                    </div>
                    <p class="project-brief">统计你参与的项目数量、完成率、平均评分等关键指标。</p>
                  </div>
                </div>
                <div class="project-card" v-else-if="activeData === 'income'">
                  <div class="project-card-main">
                    <div class="project-card-header">
                      <h3 class="project-name">收入明细</h3>
                    </div>
                    <p class="project-brief">查看各个项目获得的奖金与收入明细。</p>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <!-- 企业端：保持原有项目列表视图 -->
          <template v-else>
            <div class="section-header">
              <h2 class="section-title">
                进行中的项目 ({{ filteredProjects.length }})
              </h2>
            </div>

            <div class="project-list">
              <article
                v-for="project in filteredProjects"
                :key="project.id"
                class="project-card"
                @click="viewDetail(project)"
              >
                <div class="project-card-main">
                  <div class="project-card-header">
                    <h3 class="project-name">{{ project.name }}</h3>
                    <span class="project-tag" :class="project.status">
                      {{ project.statusText }}
                    </span>
                  </div>

                  <div class="project-meta-row">
                    <span>状态：{{ project.stageText }}</span>
                    <span>进度：{{ project.progress }}%</span>
                    <span>剩余时间：{{ project.remainDays }}天</span>
                    <span>奖金：￥{{ project.reward.toLocaleString() }}</span>
                  </div>

                  <p class="project-brief">{{ project.brief }}</p>

                  <div class="project-actions-row">
                    <div class="project-actions">
                      <button
                        v-if="project.canUpload"
                        class="primary-chip"
                        @click.stop="uploadDeliverable(project)"
                      >
                        {{ project.uploadLabel }}
                      </button>
                      <button
                        v-if="project.canCollaborate"
                        class="ghost-chip"
                        @click.stop="openTeamCollab(project)"
                      >
                        团队协作
                      </button>
                    </div>
                    <div class="project-progress">
                      <div class="progress-bar">
                        <div
                          class="progress-inner"
                          :style="{ width: project.progress + '%' }"
                        ></div>
                      </div>
                      <span class="progress-text">{{ project.progress }}%</span>
                    </div>
                  </div>
                </div>
              </article>

              <div v-if="filteredProjects.length === 0" class="empty-state">
                暂无符合条件的项目
              </div>
            </div>
          </template>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const isLoggedIn = ref(false)
const showDropdown = ref(false)
const unreadCount = ref(0)
const userInfo = ref({
  username: '张三',
  role: 'student', // student / enterprise
  avatar: 'https://picsum.photos/seed/user123/40/40.jpg'
})

const userRole = computed(() => (userInfo.value.role === 'enterprise' ? 'enterprise' : 'student'))

// 侧边栏和角色视图
const activeSidebar = ref('ongoing')
const activeRoleTab = ref('studentProjects')
const activeStatus = ref('ongoing')
const activeModule = ref('projects')
const activeTeam = ref('dev') // dev | ai
const activeResult = ref('pending') // pending | review | passed
const activeData = ref('radar') // radar | stats | income

// 角色标签，根据用户角色展示不同入口
const roleTabs = computed(() => {
  const role = userRole.value
  const tabs = []
  if (role === 'enterprise') {
    tabs.push({ key: 'published', label: '我发布的（企业）' })
  }
  if (role === 'student') {
    tabs.push({ key: 'studentProjects', label: '我揭榜的（学生）' })
    tabs.push({ key: 'studentTeams', label: '我的团队（学生）' })
  }
  tabs.push({ key: 'timeline', label: '项目进度跟踪' })
  // 默认激活第一个 tab
  if (!tabs.find((t) => t.key === activeRoleTab.value)) {
    activeRoleTab.value = tabs[0]?.key || 'timeline'
  }
  return tabs
})

// 示例项目数据
const projects = ref([
  {
    id: 1,
    name: 'AI智能客服系统开发',
    ownerType: 'student',
    stage: 'ongoing',
    stageText: '开发中',
    status: 'ongoing',
    statusText: '进行中',
    progress: 60,
    remainDays: 15,
    reward: 15000,
    brief: '为平台构建基于NLP的智能客服系统，提高服务效率。',
    canUpload: true,
    uploadLabel: '上传成果',
    canCollaborate: true
  },
  {
    id: 2,
    name: '电商平台前端开发',
    ownerType: 'student',
    stage: 'ongoing',
    stageText: '待提交',
    status: 'awarded',
    statusText: '已揭榜',
    progress: 80,
    remainDays: 3,
    reward: 8000,
    brief: '实现现代化商城前端页面，适配 PC 与移动端。',
    canUpload: true,
    uploadLabel: '上传成果',
    canCollaborate: false
  },
  {
    id: 3,
    name: '数据分析与可视化项目',
    ownerType: 'enterprise',
    stage: 'testing',
    stageText: '测试中',
    status: 'review',
    statusText: '待评审',
    progress: 90,
    remainDays: 7,
    reward: 10000,
    brief: '对销售数据深度分析并制作可视化报表。',
    canUpload: true,
    uploadLabel: '提交成果',
    canCollaborate: false
  }
])

// 统计数量（示意）
const ongoingCount = computed(() => projects.value.filter((p) => p.status === 'ongoing').length)
const awardedCount = computed(() => projects.value.filter((p) => p.status === 'awarded').length)
const reviewCount = computed(() => projects.value.filter((p) => p.status === 'review').length)
const finishedCount = computed(() => projects.value.filter((p) => p.status === 'finished').length)

// 切换模块辅助方法
const setTeamModule = (key) => {
  activeModule.value = 'team'
  activeTeam.value = key
}

const setResultModule = (key) => {
  activeModule.value = 'results'
  activeResult.value = key
}

const setDataModule = (key) => {
  activeModule.value = 'data'
  activeData.value = key
}

// 根据角色和状态过滤项目
const filteredProjects = computed(() => {
  return projects.value.filter((p) => {
    // 按角色 tab 过滤
    if (activeRoleTab.value === 'published' && p.ownerType !== 'enterprise') return false
    if (activeRoleTab.value === 'studentProjects' && p.ownerType !== 'student') return false
    // 时间线、团队等 tab 这里简化为同样展示

    // 按状态筛选
    if (activeStatus.value === 'ongoing' && p.status !== 'ongoing') return false
    if (activeStatus.value === 'awarded' && p.status !== 'awarded') return false
    if (activeStatus.value === 'review' && p.status !== 'review') return false
    if (activeStatus.value === 'finished' && p.status !== 'finished') return false

    return true
  })
})

// 顶部登录状态逻辑
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
  router.push('/login')
}

const viewDetail = (project) => {
  router.push(`/projects/${project.id}`)
}

const uploadDeliverable = (project) => {
  router.push(`/submit/${project.id}`)
}

const openTeamCollab = (project) => {
  router.push(`/tracker/${project.id}`)
}

onMounted(() => {
  checkLoginStatus()
})
</script>

<style scoped>
.myproject-page {
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

.auth-btn.ghost {
  color: #0c5fe7;
  border-color: rgba(12, 95, 231, 0.3);
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

.myproject-container {
  padding: 24px;
  background: #f5f7fa;
  min-height: calc(100vh - 80px);
}

.page-header {
  margin-bottom: 24px;
}

.page-title {
  margin: 0 0 4px;
  font-size: 24px;
  font-weight: 700;
  color: #1f274b;
}

.page-subtitle {
  margin: 0;
  color: #7b859f;
  font-size: 14px;
}

.myproject-layout {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 24px;
}

.sidebar {
  background: #fff;
  border-radius: 12px;
  padding: 16px 12px;
  box-shadow: 0 6px 18px rgba(15, 39, 106, 0.08);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sidebar-section {
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f3fa;
}

.sidebar-section:last-child {
  border-bottom: none;
}

.sidebar-title {
  font-size: 13px;
  font-weight: 600;
  color: #9aa5c2;
  margin-bottom: 6px;
}

.sidebar-item {
  display: block;
  width: 100%;
  padding: 6px 10px;
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

.main-content {
  background: #fff;
  border-radius: 12px;
  padding: 20px 24px 24px;
  box-shadow: 0 6px 18px rgba(15, 39, 106, 0.08);
}

.role-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.role-tab {
  padding: 6px 14px;
  border-radius: 999px;
  border: 1px solid #e0e6f2;
  background: #f5f7fb;
  font-size: 13px;
  cursor: pointer;
  color: #4a5676;
}

.role-tab.active {
  background: #1890ff;
  border-color: #1890ff;
  color: #fff;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: #1f274b;
}

.status-filters {
  display: flex;
  gap: 8px;
}

.status-chip {
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid #e0e6f2;
  background: #f7f9ff;
  font-size: 12px;
  cursor: pointer;
  color: #4a5676;
}

.status-chip.active {
  background: #1890ff;
  border-color: #1890ff;
  color: #fff;
}

.project-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.project-card {
  border-radius: 12px;
  border: 1px solid #edf1fb;
  padding: 16px 18px;
  background: linear-gradient(180deg, #ffffff, #f9fbff);
  box-shadow: 0 8px 20px rgba(15, 39, 106, 0.08);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.project-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgba(15, 39, 106, 0.12);
}

.project-card-main {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.project-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.project-name {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.project-tag {
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 12px;
  color: #fff;
}

.project-tag.ongoing {
  background: #1890ff;
}

.project-tag.awarded {
  background: #52c41a;
}

.project-tag.review {
  background: #faad14;
}

.project-tag.finished {
  background: #8c8c8c;
}

.project-meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 13px;
  color: #7b859f;
}

.project-brief {
  font-size: 13px;
  color: #4f5d7a;
  margin: 0;
}

.project-actions-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.project-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.link-btn {
  border: none;
  background: none;
  color: #1890ff;
  cursor: pointer;
  font-size: 13px;
  padding: 0;
}

.primary-chip {
  padding: 6px 12px;
  border-radius: 999px;
  border: none;
  background: #1890ff;
  color: #fff;
  font-size: 13px;
  cursor: pointer;
}

.ghost-chip {
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid #d6ddf5;
  background: #fff;
  color: #4a5676;
  font-size: 13px;
  cursor: pointer;
}

.project-progress {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 140px;
}

.progress-bar {
  flex: 1;
  height: 6px;
  border-radius: 999px;
  background: #edf1fb;
  overflow: hidden;
}

.progress-inner {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #1890ff, #52c41a);
}

.progress-text {
  font-size: 12px;
  color: #7b859f;
}

.empty-state {
  text-align: center;
  padding: 32px 0;
  color: #9aa5c2;
}

@media (max-width: 960px) {
  .myproject-layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    order: 2;
  }

  .main-content {
    order: 1;
  }
}
</style>
