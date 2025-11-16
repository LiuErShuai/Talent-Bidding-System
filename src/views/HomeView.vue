<template>
  <div class="page-wrapper">
    <!-- 顶部导航栏 -->
    <header class="top-header">
      <div class="header-container">
        <div class="logo-section">
          <div class="logo">🏆 揭榜挂帅系统</div>
        </div>
        <nav class="nav-menu">
          <el-menu mode="horizontal" :default-active="activeNav" @select="handleNavSelect" class="top-nav">
            <el-menu-item index="home">首页</el-menu-item>
            <el-menu-item index="tasks">项目大厅</el-menu-item>
            <el-menu-item index="statistics">数据中心</el-menu-item>
            <el-menu-item index="messages">
              消息
              <el-badge :value="unreadCount" class="message-badge" v-if="unreadCount > 0"></el-badge>
            </el-menu-item>
          </el-menu>
        </nav>
        <div class="auth-section">
          <!-- 未登录状态 -->
          <div v-if="!isLoggedIn" class="login-buttons">
            <el-button @click="goLogin" type="text" class="login-btn">登录</el-button>
            <el-button @click="goRegister" type="primary" class="register-btn">注册</el-button>
          </div>
          <!-- 已登录状态 -->
          <div v-else class="user-section">
            <el-dropdown>
              <span class="user-info">
                <el-avatar :size="32" :src="userInfo.avatar">
                  {{ userInfo.username?.charAt(0) || 'U' }}
                </el-avatar>
                <span class="username">{{ userInfo.username || '用户' }}</span>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="$router.push('/user')">
                    <el-icon><User /></el-icon>
                    个人中心
                  </el-dropdown-item>
                  <el-dropdown-item divided @click="handleLogout">
                    <el-icon><SwitchButton /></el-icon>
                    退出登录
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </div>
    </header>

    <!-- 主内容区 -->
    <main class="main-content">
      <!-- 首页内容 -->
      <div v-if="activeNav === 'home'" class="content-section home-section">
        <!-- 英雄区域 - 轮播图 -->
        <section class="hero-section">
          <el-carousel :interval="5000" type="card" height="400px" class="carousel">
            <el-carousel-item v-for="item in carouselItems" :key="item.id">
              <div class="carousel-item">
                <img :src="item.image" :alt="item.title" />
                <div class="carousel-content">
                  <h3>{{ item.title }}</h3>
                  <p>{{ item.description }}</p>
                  <el-button type="primary" class="cta-button" @click="item.action">{{ item.buttonText }}</el-button>
                </div>
              </div>
            </el-carousel-item>
          </el-carousel>
        </section>

        <!-- 数据统计区域 -->
        <section class="stats-section">
          <div class="section-header">
            <h2>平台数据</h2>
            <p>实时统计，见证成长</p>
          </div>
          <div class="stats-grid">
            <div v-for="stat in statsData" :key="stat.key" class="stat-card">
              <div class="stat-icon">{{ stat.icon }}</div>
              <div class="stat-info">
                <h3>{{ stat.value }}</h3>
                <p>{{ stat.label }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- 最新任务区域 -->
        <section class="latest-tasks-section">
          <div class="section-header">
            <h2>最新任务</h2>
            <el-button type="text" @click="activeNav = 'tasks'">查看更多 →</el-button>
          </div>
          <div class="tasks-grid">
            <div v-for="task in latestTasks" :key="task.id" class="task-card">
              <div class="task-header">
                <h4>{{ task.title }}</h4>
                <el-tag :type="getTaskStatusType(task.status)">{{ task.statusText }}</el-tag>
              </div>
              <p class="task-desc">{{ task.description }}</p>
              <div class="task-meta">
                <span class="task-budget">💰 {{ task.budget }}</span>
                <span class="task-deadline">⏰ {{ task.deadline }}</span>
              </div>
              <div class="task-footer">
                <span class="task-applicants">👥 {{ task.applicants }}人申请</span>
                <span class="task-category">{{ task.category }}</span>
                <el-button size="small" type="primary">立即申请</el-button>
              </div>
            </div>
          </div>
        </section>

        <!-- 热门分类区域 -->
        <section class="categories-section">
          <div class="section-header">
            <h2>热门分类</h2>
            <p>找到您感兴趣的项目类型</p>
          </div>
          <div class="category-grid">
            <div v-for="category in categories" :key="category.id" class="category-item" @click="filterByCategory(category.id)">
              <div class="category-icon">{{ category.icon }}</div>
              <div class="category-name">{{ category.name }}</div>
              <div class="category-count">{{ category.count }}个任务</div>
            </div>
          </div>
        </section>
      </div>

      <!-- 任务大厅内容 -->
      <div v-else-if="activeNav === 'tasks'" class="content-section">
        <div class="page-header">
          <h2>任务大厅</h2>
          <div class="filter-controls">
            <el-input v-model="searchKeyword" placeholder="搜索任务..." style="width: 300px; margin-right: 16px;">
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-select v-model="filterCategory" placeholder="选择分类" style="width: 150px; margin-right: 16px;">
              <el-option label="全部分类" value=""></el-option>
              <el-option label="技术开发" value="tech"></el-option>
              <el-option label="设计创意" value="design"></el-option>
              <el-option label="市场营销" value="marketing"></el-option>
            </el-select>
            <el-select v-model="filterStatus" placeholder="任务状态" style="width: 150px;">
              <el-option label="全部状态" value=""></el-option>
              <el-option label="进行中" value="active"></el-option>
              <el-option label="待审核" value="pending"></el-option>
            </el-select>
          </div>
        </div>
        
        <div class="tasks-grid">
          <el-col :span="8" v-for="task in filteredTasks" :key="task.id">
            <el-card class="task-card" shadow="hover" @click="viewTaskDetail(task.id)">
              <div class="task-header">
                <h4>{{ task.title }}</h4>
                <el-tag :type="getTaskStatusType(task.status)">{{ task.statusText }}</el-tag>
              </div>
              <p class="task-desc">{{ task.description }}</p>
              <div class="task-meta">
                <span class="task-budget">💰 {{ task.budget }}</span>
                <span class="task-deadline">⏰ {{ task.deadline }}</span>
              </div>
              <div class="task-footer">
                <span class="task-applicants">👥 {{ task.applicants }}人申请</span>
                <span class="task-category">{{ task.category }}</span>
              </div>
            </el-card>
          </el-col>
        </div>
      </div>

      <!-- 发布任务内容 -->
      <div v-else-if="activeNav === 'publish'" class="content-section">
        <div class="page-header">
          <h2>发布任务</h2>
        </div>
        <el-card class="publish-form">
          <el-form :model="taskForm" :rules="taskRules" ref="taskFormRef" label-width="120px">
            <el-form-item label="任务标题" prop="title">
              <el-input v-model="taskForm.title" placeholder="请输入任务标题"></el-input>
            </el-form-item>
            <el-form-item label="任务分类" prop="category">
              <el-select v-model="taskForm.category" placeholder="请选择任务分类" style="width: 100%;">
                <el-option label="技术开发" value="tech"></el-option>
                <el-option label="设计创意" value="design"></el-option>
                <el-option label="市场营销" value="marketing"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="任务描述" prop="description">
              <el-input v-model="taskForm.description" type="textarea" :rows="6" placeholder="详细描述任务需求"></el-input>
            </el-form-item>
            <el-form-item label="任务预算" prop="budget">
              <el-input v-model="taskForm.budget" placeholder="请输入预算金额">
                <template #append>元</template>
              </el-input>
            </el-form-item>
            <el-form-item label="截止日期" prop="deadline">
              <el-date-picker v-model="taskForm.deadline" type="date" placeholder="选择截止日期" style="width: 100%;"></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitTask" :loading="submitting">发布任务</el-button>
              <el-button @click="resetForm">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>

      <!-- 我的任务内容 -->
      <div v-else-if="activeNav === 'my-tasks'" class="content-section">
        <div class="page-header">
          <h2>我的任务</h2>
        </div>
        <el-tabs v-model="myTasksTab" class="my-tasks-tabs">
          <el-tab-pane label="我发布的" name="published">
            <el-table :data="myPublishedTasks" style="width: 100%">
              <el-table-column prop="title" label="任务标题" width="200"></el-table-column>
              <el-table-column prop="createTime" label="发布时间" width="150"></el-table-column>
              <el-table-column prop="status" label="状态" width="100">
                <template #default="scope">
                  <el-tag :type="getTaskStatusType(scope.row.status)">{{ scope.row.statusText }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="applicants" label="申请人数" width="100"></el-table-column>
              <el-table-column label="操作">
                <template #default="scope">
                  <el-button link type="primary" @click="viewTaskDetail(scope.row.id)">查看详情</el-button>
                  <el-button link type="success" @click="manageTask(scope.row.id)">管理</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="我申请的" name="applied">
            <el-table :data="myAppliedTasks" style="width: 100%">
              <el-table-column prop="title" label="任务标题" width="200"></el-table-column>
              <el-table-column prop="applyTime" label="申请时间" width="150"></el-table-column>
              <el-table-column prop="status" label="状态" width="100">
                <template #default="scope">
                  <el-tag :type="getApplyStatusType(scope.row.status)">{{ scope.row.statusText }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template #default="scope">
                  <el-button link type="primary" @click="viewTaskDetail(scope.row.id)">查看详情</el-button>
                  <el-button link type="warning" @click="withdrawApplication(scope.row.id)">撤回申请</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>

      <!-- 数据统计内容 -->
      <div v-else-if="activeNav === 'statistics'" class="content-section">
        <div class="page-header">
          <h2>数据统计</h2>
        </div>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-card class="chart-card">
              <template #header>
                <div class="card-header">
                  <span>任务发布趋势</span>
                </div>
              </template>
              <div class="chart-placeholder">
                <el-empty description="图表功能开发中"></el-empty>
              </div>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card class="chart-card">
              <template #header>
                <div class="card-header">
                  <span>分类统计</span>
                </div>
              </template>
              <div class="chart-placeholder">
                <el-empty description="图表功能开发中"></el-empty>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </main>

    <!-- 底部 -->
    <footer class="page-footer">
      <div class="footer-container">
        <div class="footer-section">
          <h4>关于我们</h4>
          <p>揭榜挂帅系统是一个专业的任务发布与承接平台，连接需求方与服务方。</p>
        </div>
        <div class="footer-section">
          <h4>快速链接</h4>
          <ul>
            <li><el-link type="info" @click="activeNav = 'home'">首页</el-link></li>
            <li><el-link type="info" @click="activeNav = 'tasks'">任务大厅</el-link></li>
            <li><el-link type="info" @click="activeNav = 'publish'">发布任务</el-link></li>
          </ul>
        </div>
        <div class="footer-section">
          <h4>联系方式</h4>
          <p>邮箱：support@task.com</p>
          <p>电话：400-123-4567</p>
        </div>
        <div class="footer-section">
          <h4>关注我们</h4>
          <div class="social-links">
            <span class="social-icon">📱</span>
            <span class="social-icon">💬</span>
            <span class="social-icon">📧</span>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2025 揭榜挂帅系统. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../store/user'
import { ElMessageBox, ElMessage } from 'element-plus'
import { 
  User, SwitchButton, Search
} from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()

// 当前激活的导航
const activeNav = ref('home')
const isLoggedIn = ref(false)
const userInfo = reactive({
  username: userStore.username || '用户',
  avatar: ''
})
const unreadCount = ref(2) // 未读消息数量

// 轮播图数据
const carouselItems = ref([
  {
    id: 1,
    title: '发布任务，寻找专业人才',
    description: '快速发布您的任务需求，获得专业人才的优质服务',
    buttonText: '立即发布',
    image: '/src/assets/task-banner-1.jpg',
    action: () => activeNav.value = 'publish'
  },
  {
    id: 2,
    title: '承接任务，展示专业技能',
    description: '发挥您的专业技能，承接各类任务获得收益',
    buttonText: '查看任务',
    image: '/src/assets/task-banner-2.jpg',
    action: () => activeNav.value = 'tasks'
  },
  {
    id: 3,
    title: '安全可靠的交易平台',
    description: '提供安全的交易保障，让双方合作无忧',
    buttonText: '了解更多',
    image: '/src/assets/task-banner-3.jpg',
    action: () => activeNav.value = 'home'
  }
])

// 统计数据
const statsData = ref([
  {
    key: 'total',
    icon: '📊',
    value: '1,234',
    label: '总任务数'
  },
  {
    key: 'active',
    icon: '🎯',
    value: '567',
    label: '进行中'
  },
  {
    key: 'completed',
    icon: '✅',
    value: '890',
    label: '已完成'
  },
  {
    key: 'users',
    icon: '👥',
    value: '2,456',
    label: '注册用户'
  }
])

// 最新任务
const latestTasks = ref([
  {
    id: 1,
    title: '企业官网前端开发',
    description: '需要开发响应式企业官网，包含首页、产品展示、关于我们等模块',
    budget: '¥50,000',
    deadline: '2025-12-15',
    status: 'active',
    statusText: '进行中',
    applicants: 8,
    category: '技术开发'
  },
  {
    id: 2,
    title: '移动应用UI设计',
    description: '为电商APP设计完整的UI界面，需要符合现代审美趋势',
    budget: '¥30,000',
    deadline: '2025-11-30',
    status: 'active',
    statusText: '进行中',
    applicants: 15,
    category: '设计创意'
  },
  {
    id: 3,
    title: '数据分析平台后端开发',
    description: '开发数据分析平台后端API，支持大数据处理和分析',
    budget: '¥80,000',
    deadline: '2025-12-20',
    status: 'pending',
    statusText: '待审核',
    applicants: 5,
    category: '技术开发'
  }
])

// 分类数据
const categories = ref([
  { id: 'tech', name: '技术开发', icon: '💻', count: 456 },
  { id: 'design', name: '设计创意', icon: '🎨', count: 234 },
  { id: 'marketing', name: '市场营销', icon: '📈', count: 189 },
  { id: 'writing', name: '文案写作', icon: '✍️', count: 156 },
  { id: 'video', name: '视频制作', icon: '🎬', count: 123 },
  { id: 'consulting', name: '咨询服务', icon: '💡', count: 98 }
])

// 搜索和筛选
const searchKeyword = ref('')
const filterCategory = ref('')
const filterStatus = ref('')

// 任务表单
const taskForm = reactive({
  title: '',
  category: '',
  description: '',
  budget: '',
  deadline: ''
})

const taskRules = {
  title: [{ required: true, message: '请输入任务标题', trigger: 'blur' }],
  category: [{ required: true, message: '请选择任务分类', trigger: 'change' }],
  description: [{ required: true, message: '请输入任务描述', trigger: 'blur' }],
  budget: [{ required: true, message: '请输入任务预算', trigger: 'blur' }],
  deadline: [{ required: true, message: '请选择截止日期', trigger: 'change' }]
}

const taskFormRef = ref(null)
const submitting = ref(false)

// 我的任务标签页
const myTasksTab = ref('published')

// 我发布的任务
const myPublishedTasks = ref([
  {
    id: 1,
    title: '企业官网前端开发',
    createTime: '2025-11-10',
    status: 'active',
    statusText: '进行中',
    applicants: 8
  },
  {
    id: 2,
    title: '移动应用UI设计',
    createTime: '2025-11-08',
    status: 'completed',
    statusText: '已完成',
    applicants: 12
  }
])

// 我申请的任务
const myAppliedTasks = ref([
  {
    id: 3,
    title: '数据分析平台后端开发',
    applyTime: '2025-11-05',
    status: 'pending',
    statusText: '待审核'
  },
  {
    id: 4,
    title: '品牌Logo设计',
    applyTime: '2025-11-03',
    status: 'approved',
    statusText: '已通过'
  }
])

// 所有任务列表（用于任务大厅）
const allTasks = ref([
  ...latestTasks.value,
  {
    id: 4,
    title: '品牌Logo设计',
    description: '为初创公司设计品牌Logo，需要简洁大方，体现公司特色',
    budget: '¥15,000',
    deadline: '2025-11-25',
    status: 'active',
    statusText: '进行中',
    applicants: 12,
    category: '设计创意'
  },
  {
    id: 5,
    title: '社交媒体营销策划',
    description: '制定完整的社交媒体营销方案，提升品牌影响力',
    budget: '¥25,000',
    deadline: '2025-12-10',
    status: 'active',
    statusText: '进行中',
    applicants: 6,
    category: '市场营销'
  }
])

// 计算属性：筛选后的任务
const filteredTasks = computed(() => {
  let filtered = allTasks.value
  
  if (searchKeyword.value) {
    filtered = filtered.filter(task => 
      task.title.includes(searchKeyword.value) || 
      task.description.includes(searchKeyword.value)
    )
  }
  
  if (filterCategory.value) {
    filtered = filtered.filter(task => task.category === filterCategory.value)
  }
  
  if (filterStatus.value) {
    filtered = filtered.filter(task => task.status === filterStatus.value)
  }
  
  return filtered
})

// 消息相关数据
const messageTab = ref('system')
const systemMessages = ref([
  { id: 1, title: '系统维护通知', content: '系统将于今晚22:00-24:00进行维护升级，期间可能影响正常使用。', time: '2024-01-15 18:30', read: false },
  { id: 2, title: '新功能上线', content: '项目大厅新增智能推荐功能，为您推荐更合适的项目。', time: '2024-01-14 10:00', read: true },
  { id: 3, title: '安全提醒', content: '请定期修改密码，确保账户安全。', time: '2024-01-13 15:20', read: true }
])

const projectMessages = ref([
  { id: 1, title: '项目申请通过', content: '您申请的"企业官网开发"项目已通过审核，请及时联系项目发布者。', time: '2024-01-15 14:30', read: false },
  { id: 2, title: '项目完成通知', content: '恭喜您完成的"Logo设计"项目已获得好评，收益已发放到您的账户。', time: '2024-01-14 16:45', read: true },
  { id: 3, title: '新项目推荐', content: '根据您的技能，我们为您推荐了3个新的项目机会。', time: '2024-01-13 09:15', read: false }
])

// 导航选择处理
const handleNavSelect = (index) => {
  activeNav.value = index
  
  // 如果点击消息，清除未读数量
  if (index === 'messages') {
    setTimeout(() => {
      unreadCount.value = 0
      // 标记所有消息为已读
      systemMessages.value.forEach(msg => msg.read = true)
      projectMessages.value.forEach(msg => msg.read = true)
    }, 1000)
  }
}

// 查看任务详情
const viewTaskDetail = (taskId) => {
  ElMessage.info(`查看任务 ${taskId} 详情功能开发中`)
}

// 按分类筛选
const filterByCategory = (categoryId) => {
  activeNav.value = 'tasks'
  filterCategory.value = categoryId
}

// 提交任务
const submitTask = () => {
  if (!taskFormRef.value) return
  
  taskFormRef.value.validate((valid) => {
    if (!valid) return
    
    submitting.value = true
    try {
      // 模拟提交
      setTimeout(() => {
        ElMessage.success('任务发布成功！')
        resetForm()
        activeNav.value = 'tasks'
        submitting.value = false
      }, 1500)
    } catch (error) {
      ElMessage.error('发布失败，请重试')
      submitting.value = false
    }
  })
}

// 重置表单
const resetForm = () => {
  if (taskFormRef.value) {
    taskFormRef.value.resetFields()
  }
  Object.assign(taskForm, {
    title: '',
    category: '',
    description: '',
    budget: '',
    deadline: ''
  })
}

// 管理任务
const manageTask = (taskId) => {
  ElMessage.info(`管理任务 ${taskId} 功能开发中`)
}

// 撤回申请
const withdrawApplication = (taskId) => {
  ElMessageBox.confirm('确定要撤回申请吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('申请已撤回')
  }).catch(() => {})
}

// 获取任务状态类型
const getTaskStatusType = (status) => {
  const statusMap = {
    'active': 'success',
    'pending': 'warning',
    'completed': 'info',
    'cancelled': 'danger'
  }
  return statusMap[status] || 'info'
}

// 获取申请状态类型
const getApplyStatusType = (status) => {
  const statusMap = {
    'pending': 'warning',
    'approved': 'success',
    'rejected': 'danger',
    'completed': 'info'
  }
  return statusMap[status] || 'info'
}

// 退出登录
const handleLogout = () => {
  ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      userStore.logout()
      localStorage.removeItem('token')
      ElMessage.success('已退出登录')
      router.push('/login')
    })
    .catch(() => {})
}

// 检查登录状态
const checkLoginStatus = () => {
  const token = localStorage.getItem('token')
  const userInfoStr = localStorage.getItem('userInfo')
  
  if (token && userInfoStr) {
    isLoggedIn.value = true
    try {
      const userData = JSON.parse(userInfoStr)
      userInfo.username = userData.username || '用户'
      userInfo.avatar = userData.avatar || ''
    } catch (e) {
      console.error('解析用户信息失败:', e)
      userInfo.username = '用户'
      userInfo.avatar = ''
    }
  } else {
    isLoggedIn.value = false
    userInfo.username = '用户'
    userInfo.avatar = ''
  }
}

// 跳转登录
const goLogin = () => {
  router.push('/login')
}

// 跳转注册
const goRegister = () => {
  router.push('/register')
}

// 组件挂载时加载数据
onMounted(() => {
  // 检查登录状态
  checkLoginStatus()
  // 初始化数据
})
</script>

<style scoped>
/* 页面整体布局 */
.page-wrapper {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

/* 顶部导航栏 */
.top-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
  animation: slideDown 0.5s ease-out;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 60px;
}

.logo-section {
  display: flex;
  align-items: center;
}

.logo {
  font-size: 24px;
  font-weight: bold;
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-menu {
  flex: 1;
  display: flex;
  justify-content: center;
}

.top-nav {
  background: transparent;
  border: none;
}

.top-nav .el-menu-item {
  color: white;
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease;
  font-weight: 500;
}

.top-nav .el-menu-item:hover,
.top-nav .el-menu-item.is-active {
  background-color: rgba(255, 255, 255, 0.1);
  border-bottom-color: white;
  color: white;
}

/* 认证区域样式 */
.auth-section {
  display: flex;
  align-items: center;
}

.login-buttons {
  display: flex;
  align-items: center;
  gap: 12px;
}

.login-btn {
  color: #409eff;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.login-btn:hover {
  background-color: rgba(64, 158, 255, 0.1);
  color: #337ecc;
}

.register-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  padding: 8px 20px;
  font-weight: 500;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.register-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.user-section {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.user-info:hover {
  background-color: rgba(64, 158, 255, 0.1);
}

.username {
  font-weight: 500;
  color: #333;
}

/* 消息徽章样式 */
.message-badge {
  margin-left: 4px;
}

/* 主内容区 */
.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px 80px;
  min-height: calc(100vh - 60px);
  overflow-y: auto;
  max-height: calc(100vh - 60px);
  scroll-behavior: smooth;
}

.content-section {
  animation: fadeInUp 0.6s ease-out;
  margin-bottom: 60px;
}

/* 隐藏滚动条但保持滚动功能 */
.main-content::-webkit-scrollbar {
  display: none;
}

/* 兼容 Firefox */
.main-content {
  scrollbar-width: none;
}

/* 兼容 IE 和 Edge */
.main-content {
  -ms-overflow-style: none;
}

/* 区域标题样式 */
.section-header {
  text-align: center;
  margin-bottom: 40px;
}

.section-header h2 {
  font-size: 32px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.section-header p {
  font-size: 16px;
  color: #666;
  margin: 0;
}

/* 首页英雄区域 */
.hero-section {
  margin-bottom: 40px;
}

.carousel {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.carousel-item {
  position: relative;
  height: 100%;
  border-radius: 16px;
  overflow: hidden;
}

.carousel-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.carousel-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  color: white;
  padding: 40px;
  text-align: center;
}

.carousel-content h3 {
  font-size: 28px;
  margin-bottom: 12px;
}

.carousel-content p {
  font-size: 16px;
  margin-bottom: 24px;
  opacity: 0.9;
}

.cta-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  padding: 12px 32px;
  font-size: 16px;
  border-radius: 24px;
}

/* 数据统计区域 */
.stats-section {
  margin-bottom: 40px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
}

.stat-card {
  background: white;
  padding: 32px 24px;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  text-align: center;
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;
}

.stat-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

.stat-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.stat-info h3 {
  font-size: 32px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.stat-info p {
  color: #666;
  font-size: 16px;
  margin: 0;
}

/* 任务卡片样式 */
.latest-tasks-section {
  margin-bottom: 40px;
}

.tasks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
}

.task-card {
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;
  cursor: pointer;
}

.task-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.task-header h4 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
  flex: 1;
}

.task-desc {
  color: #666;
  line-height: 1.5;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.task-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.task-meta span {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #666;
  font-size: 14px;
}

.task-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.task-applicants {
  color: #666;
  font-size: 14px;
}

.task-category {
  background: #f0f7ff;
  color: #409eff;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

/* 分类区域 */
.categories-section {
  margin-bottom: 40px;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
}

.category-item {
  background: white;
  padding: 32px 24px;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  text-align: center;
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;
  cursor: pointer;
}

.category-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

.category-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.category-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.category-count {
  color: #666;
  font-size: 14px;
  margin: 0;
}

/* 任务大厅样式 */
.filter-controls {
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
}

/* 发布表单样式 */
.publish-form {
  background: white;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
  max-width: 600px;
  margin: 0 auto;
}

/* 我的任务样式 */
.my-tasks-tabs {
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
}

/* 数据统计样式 */
.chart-card {
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
}

.chart-placeholder {
  height: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  border-radius: 12px;
  color: #666;
}

/* 底部样式 */
.page-footer {
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  color: white;
  padding: 60px 0 20px;
  margin-top: 80px;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
  padding: 0 20px;
}

.footer-section h4 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: white;
}

.footer-section p {
  color: #bdc3c7;
  line-height: 1.6;
  margin-bottom: 8px;
}

.footer-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-section ul li {
  margin-bottom: 8px;
}

.footer-section ul li a {
  color: #bdc3c7;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-section ul li a:hover {
  color: white;
}

.social-links {
  display: flex;
  gap: 16px;
}

.social-icon {
  background: rgba(255, 255, 255, 0.1);
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.social-icon:hover {
  background: rgba(255, 255, 255, 0.2);
}

.footer-bottom {
  text-align: center;
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 40px;
}

.footer-bottom p {
  color: #bdc3c7;
  margin: 0;
  font-size: 14px;
}

/* 动画效果 */
@keyframes slideDown {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes fadeInUp {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-container {
    padding: 0 16px;
  }
  
  .nav-menu {
    display: none;
  }
  
  .main-content {
    padding: 20px 16px;
  }
  
  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
  }
  
  .tasks-grid {
    grid-template-columns: 1fr;
  }
  
  .category-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
  
  .filter-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .footer-container {
    grid-template-columns: 1fr;
    gap: 30px;
  }
}
</style>
