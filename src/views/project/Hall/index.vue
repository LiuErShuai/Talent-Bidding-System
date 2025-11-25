<template>
  <div class="project-hall-page">
    <main class="page-body">
      <!-- 搜索与筛选区 -->
      <section class="search-filter-section">
        <div class="search-row">
          <div class="search-box">
            <input
              v-model="searchKeyword"
              type="text"
              class="search-input"
              placeholder="搜索项目名称 / 编号 / 企业名称"
              @input="handleSearchInput"
            />
            <button class="search-btn" @click="handleSearch">搜索</button>
            <ul v-if="showSuggestions && searchSuggestions.length" class="search-suggestions">
              <li
                v-for="item in searchSuggestions"
                :key="item.id"
                class="suggestion-item"
                @click="applySuggestion(item)"
              >
                <span class="suggestion-title">{{ item.title }}</span>
                <span class="suggestion-company">{{ item.company }}</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="filter-rows">
          <div class="filter-row">
            <span class="filter-label">项目领域：</span>
            <button
              v-for="field in fields"
              :key="field.value"
              class="filter-chip"
              :class="{ active: selectedField === field.value }"
              @click="toggleField(field.value)"
            >
              {{ field.label }}
            </button>
          </div>

          <div class="filter-row">
            <span class="filter-label">项目状态：</span>
            <button
              v-for="status in statuses"
              :key="status.value"
              class="filter-chip"
              :class="{ active: selectedStatuses.includes(status.value) }"
              @click="toggleStatus(status.value)"
            >
              {{ status.label }}
            </button>
          </div>

          <div class="filter-row">
            <span class="filter-label">奖金范围：</span>
            <button
              v-for="range in rewardRanges"
              :key="range.value"
              class="filter-chip"
              :class="{ active: selectedReward === range.value }"
              @click="toggleReward(range.value)"
            >
              {{ range.label }}
            </button>
          </div>

          <div class="filter-row sort-row">
            <span class="filter-label">排序方式：</span>
            <button
              v-for="sort in sortOptions"
              :key="sort.value"
              class="filter-chip"
              :class="{ active: sortBy === sort.value }"
              @click="setSort(sort.value)"
            >
              {{ sort.label }}
            </button>
          </div>
        </div>
      </section>

      <!-- 项目列表区 -->
      <section class="project-list-section">
        <div class="list-header">
          <span>共找到 <strong>{{ totalProjects }}</strong> 个项目</span>
        </div>

        <div v-if="pagedProjects.length" class="project-list">
          <article
            v-for="project in pagedProjects"
            :key="project.id"
            class="project-card"
            @click="goToDetail(project.id)"
          >
            <div class="project-card-main">
              <div class="project-card-left">
                <div class="project-card-title-row">
                  <div class="project-badges">
                    <span v-if="project.tag" class="badge" :class="project.tag">{{ project.tagText }}</span>
                  </div>
                  <h2 class="project-title">{{ project.title }}</h2>
                </div>

                <div class="project-meta-row">
                  <span class="meta-item">发布方：{{ project.company }}</span>
                  <span class="meta-sep">|</span>
                  <span class="meta-item">领域：{{ project.field }}</span>
                  <span class="meta-sep">|</span>
                  <span class="meta-item">
                    截止：{{ project.deadlineText }}
                  </span>
                </div>

                <p class="project-brief">
                  {{ project.brief }}
                </p>

                <div class="project-footer-row">
                  <div class="project-actions">
                    <button
                      v-if="project.status === 'bidding'"
                      class="apply-btn"
                      @click.stop="goToApply(project.id)"
                    >
                      立即揭榜
                    </button>
                  </div>
                  <div class="project-stats">
                    <span class="stat-text">
                      已有 {{ project.joinCount }} 人{{ project.status === 'reviewing' ? '提交' : '揭榜' }}
                    </span>
                    <span class="like-text">❤ {{ project.likeCount }}</span>
                  </div>
                </div>
              </div>

                <div class="project-card-right">
                  <div class="reward">￥{{ project.reward.toLocaleString() }}</div>
                  <div class="status-tag" :class="project.status">
                    {{ statusTextMap[project.status] }}
                  </div>
                </div>
            </div>
          </article>
        </div>

        <div v-else class="empty-state">
          暂无符合当前筛选条件的项目
        </div>

        <!-- 分页 -->
        <div v-if="totalPages > 1" class="pagination">
          <button
            class="page-btn"
            :disabled="currentPage === 1"
            @click="goToPage(currentPage - 1)"
          >
            上一页
          </button>
          <button
            v-for="page in pages"
            :key="page"
            class="page-btn"
            :class="{ active: page === currentPage }"
            @click="goToPage(page)"
          >
            {{ page }}
          </button>
          <button
            class="page-btn"
            :disabled="currentPage === totalPages"
            @click="goToPage(currentPage + 1)"
          >
            下一页
          </button>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 登录状态
const isLoggedIn = ref(false)
const showDropdown = ref(false)
const unreadCount = ref(0)
const userInfo = ref({
  username: '张三',
  role: 'student',
  avatar: 'https://picsum.photos/seed/user123/40/40.jpg'
})

const userRole = computed(() => userInfo.value.role || 'student')

const checkLoginStatus = () => {
  const token = localStorage.getItem('token')
  if (token) {
    isLoggedIn.value = true
    const userData = localStorage.getItem('userData')
    if (userData) {
      userInfo.value = JSON.parse(userData)
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

// 搜索与筛选
const searchKeyword = ref('')
const showSuggestions = ref(false)
const selectedField = ref('all')
const selectedStatuses = ref(['all'])
const selectedReward = ref('all')
const sortBy = ref('comprehensive')
const currentPage = ref(1)
const pageSize = ref(5)

const fields = [
  { label: '全部', value: 'all' },
  { label: '软件工程', value: 'software' },
  { label: '人工智能', value: 'ai' },
  { label: '大数据', value: 'big-data' },
  { label: '移动开发', value: 'mobile' },
  { label: 'Web前端', value: 'frontend' }
]

const statuses = [
  { label: '全部', value: 'all' },
  { label: '揭榜中', value: 'bidding' },
  { label: '评审中', value: 'reviewing' },
  { label: '公示中', value: 'publishing' },
  { label: '已完成', value: 'completed' }
]

const rewardRanges = [
  { label: '全部', value: 'all' },
  { label: '0-5千', value: '0-5k' },
  { label: '5千-1万', value: '5k-10k' },
  { label: '1万-3万', value: '10k-30k' },
  { label: '3万以上', value: '30k+' }
]

const sortOptions = [
  { label: '综合排序', value: 'comprehensive' },
  { label: '最新发布', value: 'latest' },
  { label: '奖金最高', value: 'reward-desc' },
  { label: '即将截止', value: 'deadline-asc' }
]

const statusTextMap = {
  bidding: '揭榜中',
  reviewing: '评审中',
  publishing: '公示中',
  completed: '已完成'
}

// 模拟项目数据
const projects = ref([
  {
    id: 1,
    title: 'AI智能客服系统开发',
    company: 'XX科技有限公司',
    field: '人工智能',
    fieldValue: 'ai',
    status: 'bidding',
    reward: 15000,
    deadlineDays: 7,
    brief: '需要开发一套基于自然语言处理的智能客服系统，用于提升客户服务效率...',
    tag: 'HOT',
    tagText: 'HOT',
    joinCount: 12,
    likeCount: 45,
    createdAt: '2025-01-10'
  },
  {
    id: 2,
    title: '电商平台前端开发',
    company: 'YY网络公司',
    field: 'Web前端',
    fieldValue: 'frontend',
    status: 'bidding',
    reward: 8000,
    deadlineDays: 5,
    brief: '开发一个现代化的电商平台前端页面，支持响应式布局和多终端适配...',
    tag: 'NEW',
    tagText: 'NEW',
    joinCount: 8,
    likeCount: 32,
    createdAt: '2025-01-14'
  },
  {
    id: 3,
    title: '数据分析与可视化项目',
    company: 'ZZ数据公司',
    field: '大数据',
    fieldValue: 'big-data',
    status: 'reviewing',
    reward: 10000,
    deadlineDays: 0,
    brief: '需要对销售数据进行深度分析并制作可视化报表，支持多维度钻取分析...',
    tag: '',
    tagText: '',
    joinCount: 15,
    likeCount: 28,
    createdAt: '2025-01-05'
  },
  {
    id: 4,
    title: '移动学习APP开发',
    company: '智慧教育科技有限公司',
    field: '移动开发',
    fieldValue: 'mobile',
    status: 'bidding',
    reward: 20000,
    deadlineDays: 3,
    brief: '开发一款面向高校学生的移动学习应用，支持课程学习、作业提交、在线测验等...',
    tag: 'URGENT',
    tagText: '急',
    joinCount: 20,
    likeCount: 60,
    createdAt: '2025-01-15'
  },
  {
    id: 5,
    title: '高校实验室管理系统',
    company: '校园信息化中心',
    field: '软件工程',
    fieldValue: 'software',
    status: 'publishing',
    reward: 12000,
    deadlineDays: 0,
    brief: '为高校实验室建设一套预约与管理系统，支持实验预约、设备管理和数据统计...',
    tag: '',
    tagText: '',
    joinCount: 18,
    likeCount: 40,
    createdAt: '2024-12-30'
  },
  {
    id: 6,
    title: '企业数据中台建设',
    company: '鸿云科技集团',
    field: '大数据',
    fieldValue: 'big-data',
    status: 'completed',
    reward: 35000,
    deadlineDays: -10,
    brief: '搭建企业级数据中台，统一数据标准，支持多业务系统的数据服务能力...',
    tag: 'HOT',
    tagText: 'HOT',
    joinCount: 25,
    likeCount: 80,
    createdAt: '2024-11-20'
  }
])

// 衍生数据
const enhancedProjects = computed(() =>
  projects.value.map((p) => ({
    ...p,
    deadlineText:
      p.deadlineDays > 0
        ? `${p.deadlineDays}天后`
        : p.deadlineDays === 0
        ? '今天截止'
        : '已截止'
  }))
)

// 搜索建议
const searchSuggestions = computed(() => {
  if (!searchKeyword.value.trim()) return []
  const keyword = searchKeyword.value.trim().toLowerCase()
  return enhancedProjects.value
    .filter(
      (p) =>
        p.title.toLowerCase().includes(keyword) ||
        p.company.toLowerCase().includes(keyword)
    )
    .slice(0, 5)
})

const handleSearchInput = () => {
  showSuggestions.value = !!searchKeyword.value.trim()
  currentPage.value = 1
}

const handleSearch = () => {
  showSuggestions.value = false
  currentPage.value = 1
}

const applySuggestion = (item) => {
  searchKeyword.value = item.title
  showSuggestions.value = false
  currentPage.value = 1
}

const toggleField = (value) => {
  selectedField.value = value
  currentPage.value = 1
}

const toggleStatus = (value) => {
  if (value === 'all') {
    selectedStatuses.value = ['all']
  } else {
    const exists = selectedStatuses.value.includes(value)
    const next = selectedStatuses.value.filter((v) => v !== 'all')
    if (exists) {
      const filtered = next.filter((v) => v !== value)
      selectedStatuses.value = filtered.length ? filtered : ['all']
    } else {
      next.push(value)
      selectedStatuses.value = next
    }
  }
  currentPage.value = 1
}

const toggleReward = (value) => {
  selectedReward.value = value
  currentPage.value = 1
}

const setSort = (value) => {
  sortBy.value = value
  currentPage.value = 1
}

// 过滤 + 排序 + 分页
const filteredProjects = computed(() => {
  const keyword = searchKeyword.value.trim().toLowerCase()

  return enhancedProjects.value.filter((p) => {
    const matchesSearch =
      !keyword ||
      p.title.toLowerCase().includes(keyword) ||
      p.company.toLowerCase().includes(keyword)

    const matchesField =
      selectedField.value === 'all' || p.fieldValue === selectedField.value

    const matchesStatus =
      selectedStatuses.value.includes('all') ||
      selectedStatuses.value.includes(p.status)

    let matchesReward = true
    if (selectedReward.value === '0-5k') {
      matchesReward = p.reward <= 5000
    } else if (selectedReward.value === '5k-10k') {
      matchesReward = p.reward > 5000 && p.reward <= 10000
    } else if (selectedReward.value === '10k-30k') {
      matchesReward = p.reward > 10000 && p.reward <= 30000
    } else if (selectedReward.value === '30k+') {
      matchesReward = p.reward > 30000
    }

    return matchesSearch && matchesField && matchesStatus && matchesReward
  })
})

const sortedProjects = computed(() => {
  const list = [...filteredProjects.value]

  if (sortBy.value === 'latest') {
    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  } else if (sortBy.value === 'reward-desc') {
    list.sort((a, b) => b.reward - a.reward)
  } else if (sortBy.value === 'deadline-asc') {
    list.sort((a, b) => a.deadlineDays - b.deadlineDays)
  } else {
    // 综合排序：热门优先，其次最新
    list.sort((a, b) => {
      const hotScoreA = (a.tag === 'HOT' ? 2 : 0) + (a.tag === 'URGENT' ? 1 : 0)
      const hotScoreB = (b.tag === 'HOT' ? 2 : 0) + (b.tag === 'URGENT' ? 1 : 0)
      if (hotScoreB !== hotScoreA) return hotScoreB - hotScoreA
      return new Date(b.createdAt) - new Date(a.createdAt)
    })
  }

  return list
})

const totalProjects = computed(() => sortedProjects.value.length)
const totalPages = computed(() => Math.max(1, Math.ceil(totalProjects.value / pageSize.value)))

const pagedProjects = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return sortedProjects.value.slice(start, start + pageSize.value)
})

const pages = computed(() => {
  const result = []
  for (let i = 1; i <= totalPages.value; i++) {
    result.push(i)
  }
  return result
})

const goToPage = (page) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page

  // 回到列表顶部
  const el = document.querySelector('.project-list-section')
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}

const goToApply = (id) => {
  // 直接跳转到揭榜申请页，由 Apply 页面自行处理登录校验
  router.push(`/apply/${id}`)
}

const goToDetail = (id) => {
  router.push(`/projects/${id}`)
}

onMounted(() => {
  checkLoginStatus()
})
</script>

<style scoped>
.project-hall-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f7fb;
  color: #1f274b;
  overflow: hidden;
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
}

.user-avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 2px solid rgba(12, 95, 231, 0.2);
  object-fit: cover;
  cursor: pointer;
}

.user-dropdown {
  position: absolute;
  right: 0;
  top: 52px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 18px 35px rgba(15, 39, 106, 0.18);
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 140px;
  z-index: 20;
}

.user-name {
  font-weight: 600;
  margin-bottom: 4px;
}

.dropdown-link {
  background: none;
  border: none;
  padding: 0;
  color: #5a6486;
  text-decoration: none;
  font-size: 14px;
  cursor: pointer;
  text-align: left;
}

.dropdown-link:hover {
  color: #0c5fe7;
}

.dropdown-link.danger {
  color: #ff4d4f;
}

.page-body {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 32px 24px 80px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  /* 移除固定高度限制，让内容自适应 */
  overflow-y: auto;
  max-height: calc(100vh - 82px);
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.page-body::-webkit-scrollbar {
  display: none;
}

.project-list-section {
  background: #fff;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 18px 35px rgba(15, 39, 106, 0.08);
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-height: 0;
  flex: none;
}

.search-row {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.search-box {
  position: relative;
  width: 100%;
  max-width: 600px;
  display: flex;
  gap: 12px;
  align-items: center;
}

.search-input {
  flex: 1;
  padding: 14px 18px;
  border-radius: 999px;
  border: 1px solid #d6ddf5;
  font-size: 16px;
  background: #fff;
  box-shadow: 0 4px 12px rgba(15, 39, 106, 0.08);
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #0c5fe7;
  box-shadow: 0 4px 16px rgba(12, 95, 231, 0.15);
}

.search-btn {
  padding: 14px 28px;
  border-radius: 999px;
  border: none;
  background: linear-gradient(120deg, #0c5fe7, #2fb7ff);
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  font-size: 16px;
  box-shadow: 0 8px 20px rgba(12, 95, 231, 0.3);
  transition: transform 0.2s ease;
}

.search-btn:hover {
  transform: translateY(-2px);
}

.search-suggestions {
  position: absolute;
  top: 52px;
  left: 0;
  right: 140px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 12px 30px rgba(15, 39, 106, 0.16);
  padding: 8px 0;
  z-index: 10;
  max-height: 260px;
  overflow-y: auto;
}

.suggestion-item {
  padding: 8px 14px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  font-size: 13px;
}

.suggestion-item:hover {
  background: #f5f7ff;
}

.suggestion-title {
  font-weight: 600;
}

.suggestion-company {
  color: #9aa5c2;
}

.filter-rows {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.filter-label {
  font-size: 14px;
  color: #808aa7;
  min-width: 70px;
}

.filter-chip {
  border-radius: 999px;
  border: 1px solid #d6ddf5;
  padding: 4px 12px;
  font-size: 13px;
  background: #fff;
  cursor: pointer;
  color: #4a5676;
}

.filter-chip.active {
  background: #0c5fe7;
  border-color: #0c5fe7;
  color: #fff;
}

.project-list-section {
  background: transparent;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.list-header {
  font-size: 14px;
  color: #5a6486;
}

.project-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.project-card {
  background: #fff;
  border-radius: 18px;
  padding: 18px 20px;
  box-shadow: 0 12px 30px rgba(15, 39, 106, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  display: block;
}

.project-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 45px rgba(15, 39, 106, 0.14);
}

.project-card-main {
  display: flex;
  justify-content: space-between;
  gap: 24px;
}

.project-card-left {
  flex: 1;
}

.project-card-right {
  width: 140px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  gap: 8px;
}

.project-card-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}

.project-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f274b;
}

.project-meta-row {
  font-size: 13px;
  color: #7b859f;
  margin-bottom: 8px;
}

.meta-item {
  margin-right: 4px;
}

.meta-sep {
  margin: 0 4px;
  color: #c0c7dd;
}

.project-brief {
  font-size: 14px;
  color: #4f5d7a;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.project-footer-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
}

.project-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.apply-btn {
  padding: 6px 14px;
  border-radius: 999px;
  border: none;
  background: linear-gradient(120deg, #0c5fe7, #2fb7ff);
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  font-size: 13px;
}

.project-stats {
  display: flex;
  gap: 12px;
  align-items: center;
}

.stat-text {
  color: #808aa7;
}

.like-text {
  color: #ff6b81;
}

.reward {
  font-size: 20px;
  font-weight: 700;
  color: #0f2c85;
}

.status-tag {
  margin-top: 6px;
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

.status-tag.publishing {
  background: linear-gradient(120deg, #9254de, #b37feb);
}

.status-tag.completed {
  background: linear-gradient(120deg, #52c41a, #73d13d);
}

.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  color: #fff;
}

.badge.HOT {
  background: #ff4d4f;
}

.badge.NEW {
  background: #0c5fe7;
}

.badge.URGENT {
  background: #faad14;
}

.empty-state {
  text-align: center;
  padding: 40px 0;
  color: #9aa5c2;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 12px;
  margin-bottom: 8px;
  padding-top: 12px;
  padding-bottom: 8px;
  border-top: 1px solid #f0f3fa;
}

.page-btn {
  min-width: 32px;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid #d6ddf5;
  background: #fff;
  cursor: pointer;
  font-size: 13px;
}

.page-btn.active {
  background: #0c5fe7;
  border-color: #0c5fe7;
  color: #fff;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quick-help {
  position: fixed;
  bottom: 40px;
  right: 40px;
  z-index: 1000;
}

.help-btn {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1b51da, #2ee4ff);
  color: white;
  border: none;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 8px 25px rgba(15, 39, 106, 0.3);
}

@media (max-width: 1024px) {
  .header-inner {
    flex-direction: column;
  }

  .main-nav {
    flex-wrap: wrap;
  }

  .project-card-main {
    flex-direction: column;
    align-items: flex-start;
  }

  .project-card-right {
    width: auto;
    align-items: flex-start;
  }

  .page-body {
    max-height: calc(100vh - 102px);
  }
}

@media (max-width: 640px) {
  .page-body {
    padding: 24px 16px 80px;
    max-height: calc(100vh - 72px);
  }

  .search-box {
    max-width: 100%;
  }

  .search-suggestions {
    right: 0;
  }

  .project-card-main {
    flex-direction: column;
  }

  .quick-help {
    bottom: 20px;
    right: 20px;
  }

  .pagination {
    margin-bottom: 16px;
    padding-bottom: 12px;
  }
}
</style>
