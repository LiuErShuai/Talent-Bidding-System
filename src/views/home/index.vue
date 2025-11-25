<template>
  <div class="home-page">
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

      <!-- 流程展示区域 -->
      <section class="process-section">
        <div class="process-card">
          <div class="process-grid">
            <!-- 流程步骤 -->
            <template v-for="(step, index) in processSteps" :key="index">
              <div class="process-item">
                <div :class="['process-icon', `icon-${index + 1}`]">
                  <svg
                    class="process-svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      :d="step.iconPath"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                    />
                  </svg>
                </div>
                <div class="process-content">
                  <h3 class="process-title">{{ step.title }}</h3>
                  <p class="process-description">{{ step.description }}</p>
                </div>
              </div>
              <!-- 流程箭头 -->
              <div v-if="index < processSteps.length - 1" class="process-arrow">
                <img src="@/assets/images/icons/流程箭头.png" alt="下一步" />
              </div>
            </template>
          </div>
        </div>
      </section>

      <!-- 主内容区 -->
      <section class="main-content-section">
        <div class="main-content-grid">
          <!-- 左侧任务列表（2/3宽度） -->
          <div class="task-list-section">
            <div class="task-list-card">
              <div class="task-list-header">
                <h2 class="task-list-title">
                  <span class="title-icon">≡</span> 任务列表
                </h2>
                <div class="task-list-search">
                  <div class="search-wrapper">
                    <svg class="search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      v-model="searchKeyword"
                      type="text"
                      placeholder="输入任务编号/名称"
                      class="search-input"
                    />
                  </div>
                </div>
                <div class="task-list-sort">
                  <el-select v-model="selectedTaskMode" placeholder="任务模式" class="filter-select">
                    <el-option
                      v-for="item in taskModeOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                  <el-select v-model="selectedTaskDuration" placeholder="任务时限" class="filter-select">
                    <el-option
                      v-for="item in taskDurationOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                  <el-select v-model="selectedProjectStatus" placeholder="项目状态" class="filter-select">
                    <el-option
                      v-for="item in projectStatusOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </div>
              </div>
              <div class="task-list-empty">
                <div class="empty-icon">📋</div>
                <p class="empty-text">暂无任务数据</p>
              </div>
            </div>
          </div>

          <!-- 右侧侧边栏（1/3宽度） -->
          <div class="sidebar-section">
            <!-- 最新发布 -->
            <div class="sidebar-card">
              <div class="sidebar-header">
                <div class="header-line"></div>
                <h3 class="sidebar-title">最新发布</h3>
                <div class="header-line"></div>
              </div>
              <div class="latest-list">
                <div
                  v-for="(item, index) in latestReleases"
                  :key="index"
                  class="latest-item"
                >
                  <div class="latest-date">{{ item.date }}</div>
                  <div class="latest-content">
                    <p class="latest-text">{{ item.title }}</p>
                    <span v-if="item.isNew" class="new-badge">NEW</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 创客统计总览 -->
            <div class="sidebar-card">
              <div class="sidebar-header">
                <div class="header-line"></div>
                <h3 class="sidebar-title">创客统计总览</h3>
                <div class="header-line"></div>
              </div>

              <!-- 发布任务数柱状图 -->
              <div class="chart-section">
                <h4 class="chart-title">发布任务数</h4>
                <p class="chart-subtitle">任务数据一目了然，改善流程并可见</p>
                <div class="bar-chart">
                  <div class="bar-item">
                    <div class="bar" style="height: 30%; background: #dbeafe;"></div>
                    <div class="bar-value">58</div>
                    <div class="bar-label">2023年</div>
                  </div>
                  <div class="bar-item">
                    <div class="bar" style="height: 60%; background: #93c5fd;"></div>
                    <div class="bar-value">229</div>
                    <div class="bar-label">2024年</div>
                  </div>
                  <div class="bar-item">
                    <div class="bar" style="height: 100%; background: #3b82f6;"></div>
                    <div class="bar-value">346</div>
                    <div class="bar-label">2025年</div>
                  </div>
                </div>
              </div>

              <!-- 任务总金额柱状图 -->
              <div class="chart-section">
                <h4 class="chart-title">任务总金额</h4>
                <p class="chart-subtitle">任务数据一目了然，改善流程并可见</p>
                <div class="bar-chart">
                  <div class="bar-item">
                    <div class="bar" style="height: 40%; background: #dbeafe;"></div>
                    <div class="bar-value">877w</div>
                    <div class="bar-label">2023年</div>
                  </div>
                  <div class="bar-item">
                    <div class="bar" style="height: 70%; background: #93c5fd;"></div>
                    <div class="bar-value">1289w</div>
                    <div class="bar-label">2024年</div>
                  </div>
                  <div class="bar-item">
                    <div class="bar" style="height: 100%; background: #3b82f6;"></div>
                    <div class="bar-value">5128w</div>
                    <div class="bar-label">2025年</div>
                  </div>
                </div>
              </div>

              <!-- 饼图 -->
              <div class="chart-section">
                <div class="donut-chart">
                  <svg viewBox="0 0 200 200" class="donut-svg">
                    <circle cx="100" cy="100" r="80" fill="none" stroke="#4e7cff" stroke-width="40" stroke-dasharray="352 528" transform="rotate(-90 100 100)" />
                    <circle cx="100" cy="100" r="80" fill="none" stroke="#2dd4bf" stroke-width="40" stroke-dasharray="57 528" stroke-dashoffset="-352" transform="rotate(-90 100 100)" />
                    <circle cx="100" cy="100" r="80" fill="none" stroke="#a78bfa" stroke-width="40" stroke-dasharray="27 528" stroke-dashoffset="-409" transform="rotate(-90 100 100)" />
                    <circle cx="100" cy="100" r="80" fill="none" stroke="#fbbf24" stroke-width="40" stroke-dasharray="25 528" stroke-dashoffset="-436" transform="rotate(-90 100 100)" />
                    <circle cx="100" cy="100" r="80" fill="none" stroke="#f87171" stroke-width="40" stroke-dasharray="21 528" stroke-dashoffset="-461" transform="rotate(-90 100 100)" />
                    <circle cx="100" cy="100" r="80" fill="none" stroke="#34d399" stroke-width="40" stroke-dasharray="18 528" stroke-dashoffset="-482" transform="rotate(-90 100 100)" />
                  </svg>
                </div>
                <h4 class="chart-title center">任务热门领域分布</h4>
                <div class="legend-grid">
                  <div class="legend-item">
                    <div class="legend-color" style="background: #4e7cff;"></div>
                    <span class="legend-label">军事历史</span>
                    <span class="legend-value">70.0%</span>
                  </div>
                  <div class="legend-item">
                    <div class="legend-color" style="background: #2dd4bf;"></div>
                    <span class="legend-label">软件工程</span>
                    <span class="legend-value">11.3%</span>
                  </div>
                  <div class="legend-item">
                    <div class="legend-color" style="background: #a78bfa;"></div>
                    <span class="legend-label">文武翻译</span>
                    <span class="legend-value">5.4%</span>
                  </div>
                  <div class="legend-item">
                    <div class="legend-color" style="background: #fbbf24;"></div>
                    <span class="legend-label">其他</span>
                    <span class="legend-value">5.1%</span>
                  </div>
                  <div class="legend-item">
                    <div class="legend-color" style="background: #f87171;"></div>
                    <span class="legend-label">通信工程</span>
                    <span class="legend-value">4.3%</span>
                  </div>
                  <div class="legend-item">
                    <div class="legend-color" style="background: #34d399;"></div>
                    <span class="legend-label">电子元器件</span>
                    <span class="legend-value">4.0%</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 最新动态 -->
            <div class="sidebar-card">
              <div class="sidebar-header">
                <div class="header-line"></div>
                <h3 class="sidebar-title">最新动态</h3>
                <div class="header-line"></div>
              </div>
              <div class="activities-list">
                <div
                  v-for="(item, index) in latestActivities"
                  :key="index"
                  class="activity-item"
                >
                  <div class="activity-avatar">{{ item.user[0] }}</div>
                  <div class="activity-content">
                    <p class="activity-text">
                      <span class="activity-user">{{ item.user }}</span> {{ item.action }}
                      <span v-if="item.id" class="activity-id">{{ item.id }}</span>
                    </p>
                    <div class="activity-time">
                      <svg class="time-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{{ item.time }}</span>
                    </div>
                  </div>
                </div>
              </div>
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
        <div class="footer-content">
          <div class="footer-grid">
            <!-- Logo区域 -->
            <div class="footer-col">
              <div class="footer-brand">
                <img src="@/assets/images/logo/桂电透明背景logo.png" alt="桂电创客空间" class="footer-logo-img" />
                <div class="footer-brand-text">
                  <div class="footer-brand-name">桂电创客空间</div>
                  <div class="footer-brand-subtitle">创客空间</div>
                </div>
              </div>
            </div>

            <!-- 关于我们 -->
            <div class="footer-col">
              <h4 class="footer-title">关于我们</h4>
              <ul class="footer-list">
                <li><router-link to="/about" class="footer-link">平台简介</router-link></li>
                <li><router-link to="/about" class="footer-link">友情链接</router-link></li>
                <li><router-link to="/about" class="footer-link">加入我们</router-link></li>
              </ul>
            </div>

            <!-- 使用条款 -->
            <div class="footer-col">
              <h4 class="footer-title">使用条款</h4>
              <ul class="footer-list">
                <li><router-link to="/privacy" class="footer-link">平台服务协议</router-link></li>
                <li><router-link to="/privacy" class="footer-link">创客应征投稿协议</router-link></li>
              </ul>
            </div>

            <!-- 用户手册 -->
            <div class="footer-col">
              <h4 class="footer-title">用户手册</h4>
              <ul class="footer-list">
                <li><router-link to="/projects" class="footer-link">项目大厅</router-link></li>
                <li><router-link to="/smart-match" class="footer-link">智能匹配</router-link></li>
                <li><router-link to="/help" class="footer-link">帮助中心</router-link></li>
                <li><router-link to="/help" class="footer-link">API文档</router-link></li>
              </ul>
            </div>

            <!-- 开源科普 -->
            <div class="footer-col">
              <h4 class="footer-title">开源科普</h4>
              <ul class="footer-list">
                <li><router-link to="/about" class="footer-link">开源合规科普</router-link></li>
                <li><router-link to="/about" class="footer-link">专家观点</router-link></li>
              </ul>
            </div>

            <!-- 公众号 -->
            <div class="footer-col">
              <h4 class="footer-title">公众号</h4>
              <div class="qr-code">
                <div class="qr-placeholder"></div>
              </div>
            </div>
          </div>

          <!-- 底部信息栏 -->
          <div class="footer-bottom">
            <div class="footer-info">
              <span>📍 地址：北京市海淀区西三环北路72号</span>
              <span>✉️ support@talent-platform.com</span>
            </div>
            <div class="footer-copyright">
              <span>Copyright © 产教融合平台</span>
              <span>京ICP备2021005060</span>
              <span>🔒 京公网安备11010802034576号</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/modules/auth'
import { ElMessage } from 'element-plus'

const router = useRouter()
const authStore = useAuthStore()

// 初始化认证状态
onMounted(() => {
  authStore.initAuth()
})

const isLoggedIn = computed(() => authStore.isLoggedIn)
const userInfo = computed(() => authStore.userInfo || {})
const userRole = computed(() => authStore.userRole || '')

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

// 流程步骤数据
const processSteps = ref([
  {
    title: '任务应征',
    description: '根据产生任务发布的任务，进行应征许可',
    iconPath: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
  },
  {
    title: '成果生成',
    description: '针对拟题任务各种解答和出版协议成果',
    iconPath: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z'
  },
  {
    title: '成果提交',
    description: '根据提出平台个一键提交技术成果',
    iconPath: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
  },
  {
    title: '成果发表',
    description: '平台评审核评后征选最，用户按需求资源',
    iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
  }
])

// 任务列表搜索关键词
const searchKeyword = ref('')

// 任务列表筛选选项
const selectedTaskMode = ref('')
const selectedTaskDuration = ref('')
const selectedProjectStatus = ref('')

// 任务模式选项
const taskModeOptions = ref([
  { label: '全部', value: '' },
  { label: '个人任务', value: 'individual' },
  { label: '团队任务', value: 'team' }
])

// 任务时限选项
const taskDurationOptions = ref([
  { label: '全部', value: '' },
  { label: '7天内', value: '7days' },
  { label: '1个月内', value: '1month' },
  { label: '3个月内', value: '3months' },
  { label: '6个月内', value: '6months' },
  { label: '长期项目', value: 'longterm' }
])

// 项目状态选项
const projectStatusOptions = ref([
  { label: '全部', value: '' },
  { label: '揭榜中', value: 'bidding' },
  { label: '方案提交中', value: 'proposal' },
  { label: '项目进行中', value: 'executing' },
  { label: '中期答辩中', value: 'midterm' },
  { label: '成果评选中', value: 'reviewing' },
  { label: '项目公示中', value: 'publicizing' },
  { label: '已完成', value: 'completed' },
  { label: '已关闭', value: 'closed' }
])

// 最新发布数据
const latestReleases = ref([
  { date: '7\n10月', title: '风寒软件普法自适应选择与参数', isNew: true },
  { date: '7\n10月', title: '小型舟桥搭建套件', isNew: true },
  { date: '7\n10月', title: '航天器智能交互式双敏感协诊断工具', isNew: true },
  { date: '7\n10月', title: '信息系统资源合调度模型及评估软件', isNew: false },
  { date: '7\n10月', title: '穿越机/大载重无人机智群系统', isNew: false },
  { date: '7\n10月', title: '面向USB主机控制器驱动芯片级模拟测试的虚拟总线设备', isNew: false }
])

// 最新动态数据
const latestActivities = ref([
  { user: 'Hzxdata', action: '在创客任务 利用窗函数人员主管测系统 下提交了成果', id: '39271087', time: '15小时前' },
  { user: '木国', action: '在创客任务 即插即用式应急高速网络通信装备 下提交了成果', id: '54419956', time: '16小时前' },
  { user: '远费叶·帆', action: '已通过该创任务 空间两高无人机（二次）的评选依据材料', time: '20小时前' },
  { user: '系统管理员-维翼', action: '已通过创客任务 小型舟跨搭建套件 下提交了成果', id: '86782660', time: '20小时前' },
  { user: '芜湖等星', action: '在创客任务 小型舟跨搭建套件 下提交了成果', id: '86782660', time: '23小时前' },
  { user: '姜航', action: '在创客任务 即插即用式应急高速网络通信装备 下提交了成果', id: '35397049', time: '1天前' }
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

const partners = ref([
  { id: 1, name: '腾讯科技', logo: 'T' },
  { id: 2, name: '阿里巴巴', logo: 'A' },
  { id: 3, name: '华为技术', logo: 'H' },
  { id: 4, name: '字节跳动', logo: 'B' },
  { id: 5, name: '百度', logo: 'B' },
  { id: 6, name: '京东', logo: 'J' }
])
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: transparent; /* 背景透明，让背景图显示 */
  color: #1f274b;
  position: relative;
}

/* 背景图片样式 - 放在最底层，淡一点，从上到下渐变，跟随页面滚动 */
.home-page::before {
  content: '';
  position: absolute; /* absolute 定位，跟随页面滚动 */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0; /* 使用 top/bottom 让背景图完全跟随父元素高度 */
  width: 100%;
  background-image: url('@/assets/images/backgrounds/home_bg.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0.15; /* 淡一点 */
  z-index: 0;
  pointer-events: none; /* 不阻挡交互 */
  /* 从上到下渐变，渐变提前一点，下半部分看不见 */
  mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.8) 30%, rgba(0, 0, 0, 0.4) 50%, rgba(0, 0, 0, 0) 100%);
  -webkit-mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.8) 30%, rgba(0, 0, 0, 0.4) 50%, rgba(0, 0, 0, 0) 100%);
}

/* 确保内容在背景之上 */
.home-page > * {
  position: relative;
  z-index: 1;
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
  background: #22336b;
  color: #ffffff;
  padding: 48px 0;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr repeat(5, 1fr);
  gap: 32px;
  margin-bottom: 32px;
}

/* .footer-col 使用默认样式，占据一列 */
.footer-col:first-child {
  min-width: 0;
  overflow: visible;
  width: auto;
}

.footer-brand {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  min-width: 0;
  overflow: visible;
}

.footer-logo-img {
  width: auto;
  height: 60px;
  max-width: none;
  max-height: 60px;
  object-fit: contain;
  display: block;
  flex-shrink: 0;
  overflow: visible;
}

.footer-brand-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.footer-brand-name {
  font-weight: bold;
  font-size: 18px;
}

.footer-brand-subtitle {
  font-size: 14px;
  opacity: 0.7;
}

.footer-title {
  font-weight: bold;
  margin-bottom: 16px;
}

.footer-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.footer-link {
  color: #ffffff;
  text-decoration: none;
  font-size: 14px;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.footer-link:hover {
  opacity: 1;
  color: #60a5fa;
}

.qr-code {
  margin-top: 8px;
}

.qr-placeholder {
  width: 96px;
  height: 96px;
  background: #ffffff;
  border-radius: 8px;
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding-top: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  opacity: 0.7;
}

.footer-info {
  display: flex;
  gap: 32px;
}

.footer-copyright {
  display: flex;
  gap: 32px;
}

/* Hero Section */
.hero-section {
  background: transparent; /* 背景透明，让背景图显示 */
  margin-bottom: 16px;
  /* 突破父容器宽度限制，实现全屏宽度 */
  width: 100vw;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
}

.hero-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 24px;
  background: transparent; /* 背景透明 */
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
  padding: 24px 48px;
  min-height: 300px;
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
  margin-bottom: 16px;
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

/* 流程展示区域 */
.process-section {
  margin-bottom: 16px;
}

.process-card {
  background: #ffffff;
  border-radius: 8px;
  padding: 32px;
}

.process-grid {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.process-item {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.process-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icon-1 {
  background: linear-gradient(to bottom right, #60a5fa, #2563eb);
}

.icon-2 {
  background: linear-gradient(to bottom right, #22d3ee, #0891b2);
}

.icon-3 {
  background: linear-gradient(to bottom right, #a78bfa, #7c3aed);
}

.icon-4 {
  background: linear-gradient(to bottom right, #f472b6, #db2777);
}

.process-svg {
  width: 24px;
  height: 24px;
  color: #ffffff;
}

.process-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
}

.process-title {
  font-weight: bold;
  font-size: 16px;
  color: #111827;
  line-height: 1;
  margin-top: 5px; 
  margin-bottom: 2px;
}

.process-description {
  font-size: 13px;
  color: #6b7280;
  line-height: 1;
  margin-top: 5px; 
  margin-bottom: 5px;
}

.process-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 24px;
}

.process-arrow img {
  width: 100%;
  height: auto;
  display: block;
}

/* 主内容区 */
.main-content-section {
  margin-bottom: 16px;
}

.main-content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}

/* 左侧任务列表 */
.task-list-card {
  background: #ffffff;
  border-radius: 8px;
  padding: 24px;
}

.task-list-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.task-list-title {
  font-size: 24px;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}

.title-icon {
  color: #2563eb;
}

.task-list-search {
  /* 移除 flex: 1，让搜索框宽度适应内容 */
}

.search-wrapper {
  position: relative;
  width: auto;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: #9ca3af;
}

.search-input {
  width: 180px;
  padding: 8px 12px 8px 40px;
  background: #f9fafb;
  border: none;
  border-radius: 4px;
  font-size: 14px;
}

.search-input:focus {
  outline: none;
  background: #f3f4f6;
}

.task-list-sort {
  display: flex;
  gap: 8px;
  margin-left: auto;
}

.filter-select {
  width: 130px;
}

/* Element Plus 下拉框自定义样式 */
.task-list-card :deep(.el-select) {
  --el-select-border-color-hover: #000000;
  --el-select-input-focus-border-color: #000000;
}

.task-list-card :deep(.el-select .el-input__wrapper) {
  background: transparent;
  border: 1px solid #000000;
  box-shadow: none;
  border-radius: 4px;
  padding: 0 10px;
  height: 32px;
}

.task-list-card :deep(.el-select .el-input__wrapper:hover) {
  border-color: #000000;
  box-shadow: none;
}

.task-list-card :deep(.el-select .el-input__wrapper.is-focus) {
  border-color: #000000;
  box-shadow: none;
}

.task-list-card :deep(.el-select .el-input__inner) {
  color: #000000;
  font-size: 14px;
  height: 30px;
  line-height: 30px;
}

.task-list-card :deep(.el-select .el-input__suffix) {
  color: #000000;
}

.task-list-card :deep(.el-select .el-select__placeholder) {
  color: #000000;
  font-size: 14px;
}

.sort-btn {
  padding: 6px 12px;
  border: 1px solid #000000;
  background: transparent;
  color: #000000;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.2s, color 0.2s;
}

.sort-btn:hover {
  background: #000000;
  color: #ffffff;
}

.task-list-empty {
  text-align: center;
  padding: 80px 0;
  color: #9ca3af;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 16px;
}

/* 右侧侧边栏 */
.sidebar-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.sidebar-card {
  background: #ffffff;
  border-radius: 8px;
  padding: 24px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  position: relative;
}

.header-line {
  position: absolute;
  width: 32px;
  height: 4px;
  background: #2563eb;
  border-radius: 2px;
}

.header-line:first-child {
  left: 0;
}

.header-line:last-child {
  right: 0;
}

.sidebar-title {
  font-weight: bold;
  font-size: 18px;
}

/* 最新发布 */
.latest-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.latest-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding-bottom: 12px;
  border-bottom: 1px solid #f3f4f6;
}

.latest-item:last-child {
  border-bottom: none;
}

.latest-date {
  color: #2563eb;
  font-weight: bold;
  font-size: 14px;
  white-space: pre-line;
  line-height: 1.2;
  text-align: center;
  min-width: 30px;
}

.latest-content {
  flex: 1;
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.latest-text {
  font-size: 14px;
  color: #374151;
  flex: 1;
}

.new-badge {
  background: #ef4444;
  color: #ffffff;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: bold;
}

/* 统计图表 */
.chart-section {
  margin-bottom: 24px;
}

.chart-section:last-child {
  margin-bottom: 0;
}

.chart-title {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  color: #111827;
}

.chart-title.center {
  text-align: center;
  margin-top: 16px;
}

.chart-subtitle {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 12px;
}

.bar-chart {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 96px;
  gap: 16px;
}

.bar-item {
  flex: 1;
  text-align: center;
}

.bar {
  border-radius: 4px 4px 0 0;
  margin-bottom: 8px;
}

.bar-value {
  font-weight: bold;
  color: #2563eb;
  margin-bottom: 4px;
}

.bar-label {
  font-size: 12px;
  color: #6b7280;
}

.donut-chart {
  width: 192px;
  height: 192px;
  margin: 0 auto 16px;
}

.donut-svg {
  width: 100%;
  height: 100%;
}

.legend-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  font-size: 12px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  flex-shrink: 0;
}

.legend-label {
  flex: 1;
}

.legend-value {
  color: #6b7280;
}

/* 最新动态 */
.activities-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.activity-item {
  display: flex;
  gap: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f3f4f6;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-avatar {
  width: 32px;
  height: 32px;
  background: linear-gradient(to bottom right, #60a5fa, #2563eb);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 12px;
  font-weight: bold;
  flex-shrink: 0;
}

.activity-content {
  flex: 1;
  min-width: 0;
}

.activity-text {
  font-size: 14px;
  color: #374151;
  margin-bottom: 4px;
}

.activity-user {
  color: #2563eb;
  font-weight: 500;
}

.activity-id {
  color: #2563eb;
}

.activity-time {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #9ca3af;
}

.time-icon {
  width: 12px;
  height: 12px;
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

/* 响应式适配 */
@media (max-width: 1024px) {
  .header-inner {
    flex-direction: column;
  }

  .main-nav {
    flex-wrap: wrap;
  }

  /* Hero Section */
  .hero-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  /* 流程展示 */
  .process-grid {
    flex-wrap: wrap;
  }

  .process-item {
    min-width: calc(50% - 20px);
  }

  .process-arrow {
    display: none;
  }

  /* 主内容区 */
  .main-content-grid {
    grid-template-columns: 1fr;
  }

  .task-list-header {
    flex-wrap: wrap;
  }

  /* 项目网格 */
  .project-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .partners-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  /* Footer */
  .footer-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .footer-bottom {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .footer-info,
  .footer-copyright {
    flex-direction: column;
    gap: 8px;
  }
}

@media (max-width: 768px) {
  /* Hero Section */
  .hero-title {
    font-size: 28px;
  }

  .hero-card-title {
    font-size: 36px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  /* 筛选器 */
  .filter-row {
    flex-direction: column;
    align-items: flex-start;
  }

  /* 流程展示 */
  .process-grid {
    flex-direction: column;
  }

  .process-item {
    width: 100%;
    min-width: 100%;
  }

  .process-arrow {
    display: none;
  }

  /* Footer */
  .footer-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .page-body {
    padding: 32px 16px 48px;
  }

  /* Hero Section */
  .hero-title {
    font-size: 24px;
  }

  .hero-description {
    font-size: 14px;
  }

  .stat-value {
    font-size: 28px;
  }

  .hero-card {
    padding: 16px 32px;
    min-height: 250px;
  }

  .hero-card-title {
    font-size: 28px;
  }

  .hero-card-text {
    font-size: 14px;
  }

  /* 筛选器 */
  .filter-label {
    min-width: auto;
  }

  /* 流程展示 */
  .process-icon {
    width: 40px;
    height: 40px;
  }

  .process-svg {
    width: 20px;
    height: 20px;
  }

  .process-title {
    font-size: 14px;
  }

  .process-description {
    font-size: 12px;
  }

  /* 主内容区 */
  .task-list-title {
    font-size: 20px;
  }

  .task-list-search {
    order: 3;
    width: 100%;
  }

  .task-list-sort {
    flex-wrap: wrap;
  }

  .sort-btn {
    font-size: 12px;
    padding: 4px 8px;
  }

  /* 项目网格 */
  .project-grid,
  .partners-grid {
    grid-template-columns: 1fr;
  }

  /* Footer */
  .footer-grid {
    grid-template-columns: 1fr;
  }

  .footer-bottom {
    font-size: 12px;
  }
}
</style>
