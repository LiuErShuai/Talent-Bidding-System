<template>
  <div class="help-page">
    <!-- 整个页面内容都在一个滚动容器中 -->
    <div class="page-content">
      <div class="container">
        <button class="back-btn" @click="goBack">返回</button>
        <div class="help-layout">
          <!-- 侧边栏导航 -->
          <aside class="sidebar">
            <nav class="help-nav">
              <h3>帮助分类</h3>
              <ul>
                <li 
                  v-for="category in categories" 
                  :key="category.id"
                  :class="{ active: activeCategory === category.id }"
                  @click="setActiveCategory(category.id)"
                >
                  {{ category.name }}
                </li>
              </ul>
            </nav>
          </aside>

          <!-- 主要内容区域 -->
          <div class="main-content">
            <div class="search-section">
              <div class="search-box">
                <input 
                  type="text" 
                  v-model="searchQuery" 
                  placeholder="搜索帮助内容..."
                  @input="handleSearch"
                >
                <span class="search-icon">🔍</span>
              </div>
            </div>

            <div class="content-section">
              <h2>{{ getCategoryName(activeCategory) }}</h2>
              
              <!-- 常见问题列表 -->
              <div class="faq-section">
                <h3>常见问题</h3>
                <div class="faq-list">
                  <div 
                    v-for="faq in filteredFaqs" 
                    :key="faq.id"
                    class="faq-item"
                    :class="{ active: activeFaq === faq.id }"
                    @click="toggleFaq(faq.id)"
                  >
                    <div class="faq-question">
                      <span>{{ faq.question }}</span>
                      <span class="faq-icon">{{ activeFaq === faq.id ? '−' : '+' }}</span>
                    </div>
                    <div v-if="activeFaq === faq.id" class="faq-answer">
                      <p>{{ faq.answer }}</p>
                      <div v-if="faq.steps" class="faq-steps">
                        <div v-for="(step, index) in faq.steps" :key="index" class="step">
                          <span class="step-number">{{ index + 1 }}</span>
                          <span>{{ step }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 操作指南 -->
              <div class="guide-section">
                <h3>操作指南</h3>
                <div class="guide-grid">
                  <div v-for="guide in filteredGuides" :key="guide.id" class="guide-card">
                    <div class="guide-icon">{{ guide.icon }}</div>
                    <h4>{{ guide.title }}</h4>
                    <p>{{ guide.description }}</p>
                    <button class="guide-btn" @click="viewGuide(guide.id)">查看详情</button>
                  </div>
                </div>
              </div>

              <!-- 详细帮助内容 -->
              <div class="detailed-help">
                <h3>详细帮助内容</h3>
                <div class="help-details">
                  <div class="help-item">
                    <h4>平台使用流程</h4>
                    <p>从注册到项目完成的完整使用流程指南，帮助您快速上手平台。</p>
                    <ul>
                      <li>注册并完成实名认证</li>
                      <li>浏览项目大厅，筛选合适项目</li>
                      <li>提交项目揭榜申请</li>
                      <li>与项目方沟通确认需求</li>
                      <li>按时完成项目交付</li>
                      <li>提交项目成果等待验收</li>
                      <li>获得项目奖金</li>
                    </ul>
                  </div>
                  
                  <div class="help-item">
                    <h4>常见问题解答</h4>
                    <p>针对用户常见问题的详细解答，帮助您解决使用过程中的疑问。</p>
                    <div class="faq-details">
                      <div class="detail-item">
                        <h5>如何提高项目揭榜成功率？</h5>
                        <p>完善个人资料、展示相关技能和经验、与项目方充分沟通。</p>
                      </div>
                      <div class="detail-item">
                        <h5>项目交付期限可以延长吗？</h5>
                        <p>可以与项目方协商，但需要提前沟通并获得同意。</p>
                      </div>
                      <div class="detail-item">
                        <h5>奖金如何计算和发放？</h5>
                        <p>根据项目难度和完成质量评估，通过平台担保安全发放。</p>
                      </div>
                    </div>
                  </div>
                  
                  <div class="help-item">
                    <h4>技术支持服务</h4>
                    <p>遇到技术问题时的支持渠道和解决方案。</p>
                    <div class="support-info">
                      <div class="support-channel">
                        <span class="channel-icon">💻</span>
                        <span>在线技术支持</span>
                      </div>
                      <div class="support-channel">
                        <span class="channel-icon">📱</span>
                        <span>移动端使用指导</span>
                      </div>
                      <div class="support-channel">
                        <span class="channel-icon">🔧</span>
                        <span>技术问题排查</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 快速帮助浮动按钮 -->
    <div class="quick-help">
      <button class="help-btn" @click="showQuickHelp = !showQuickHelp">
        💬
      </button>
      <div v-if="showQuickHelp" class="quick-help-popup">
        <h4>需要帮助？</h4>
        <p>联系在线客服获取即时帮助</p>
        <button class="chat-btn">开始对话</button>
        <button class="email-btn" @click="goToContact">发送邮件</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const activeCategory = ref('getting-started')
const activeFaq = ref(null)
const searchQuery = ref('')
const showQuickHelp = ref(false)

const categories = [
  { id: 'getting-started', name: '新手上路' },
  { id: 'account', name: '账户管理' },
  { id: 'projects', name: '项目相关' },
  { id: 'payment', name: '奖金支付' },
  { id: 'technical', name: '技术问题' },
  { id: 'safety', name: '安全保障' }
]

const faqs = [
  {
    id: 1,
    category: 'getting-started',
    question: '如何注册成为平台用户？',
    answer: '注册成为平台用户非常简单，只需几个步骤即可完成。',
    steps: [
      '点击首页右上角的"注册"按钮',
      '填写基本信息（姓名、邮箱、密码等）',
      '完成邮箱验证',
      '设置个人资料'
    ]
  },
  {
    id: 2,
    category: 'getting-started',
    question: '如何完成实名认证？',
    answer: '实名认证是参与项目揭榜的必要条件，确保交易安全。'
  },
  {
    id: 3,
    category: 'account',
    question: '如何修改个人信息？',
    answer: '在个人中心页面可以修改基本信息、头像、联系方式等。'
  },
  {
    id: 4,
    category: 'projects',
    question: '如何参与项目揭榜？',
    answer: '浏览项目大厅，选择感兴趣的项目，点击"立即揭榜"按钮。'
  },
  {
    id: 5,
    category: 'payment',
    question: '奖金如何发放？',
    answer: '项目完成后，奖金将通过平台担保的方式安全发放到您的账户。'
  }
]

const guides = [
  {
    id: 1,
    category: 'getting-started',
    title: '新手入门指南',
    description: '从注册到参与项目的完整流程',
    icon: '🚀'
  },
  {
    id: 2,
    category: 'projects',
    title: '项目揭榜指南',
    description: '如何选择合适的项目并成功揭榜',
    icon: '💼'
  },
  {
    id: 3,
    category: 'payment',
    title: '奖金提现指南',
    description: '奖金申请和提现的详细流程',
    icon: '💰'
  }
]

const goBack = () => {
  router.back()
}

const filteredFaqs = computed(() => {
  let result = faqs.filter(faq => faq.category === activeCategory.value)
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(faq => 
      faq.question.toLowerCase().includes(query) || 
      faq.answer.toLowerCase().includes(query)
    )
  }
  
  return result
})

const filteredGuides = computed(() => {
  return guides.filter(guide => guide.category === activeCategory.value)
})

const setActiveCategory = (categoryId) => {
  activeCategory.value = categoryId
  activeFaq.value = null
  searchQuery.value = ''
}

const toggleFaq = (faqId) => {
  activeFaq.value = activeFaq.value === faqId ? null : faqId
}

const handleSearch = () => {
  // 搜索功能逻辑
}

const viewGuide = (guideId) => {
  // 查看指南详情
}

const goToContact = () => {
  router.push('/contact')
}

const getCategoryName = (categoryId) => {
  const category = categories.find(cat => cat.id === categoryId)
  return category ? category.name : '帮助中心'
}
</script>

<style scoped>
.help-page {
  min-height: 100vh;
  background: #f5f7fb;
}

.back-btn {
  position: fixed;
  top: 80px;
  right: 40px;
  z-index: 100;
  padding: 10px 22px;
  border-radius: 999px;
  border: none;
  background: linear-gradient(120deg, #0c5fe7, #2fb7ff);
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  box-shadow: 0 8px 20px rgba(12, 95, 231, 0.25);
}

.back-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(12, 95, 231, 0.35);
}

.page-header {
  background: linear-gradient(135deg, #1b51da, #2ee4ff);
  color: white;
  padding: 80px 0 60px;
  text-align: center;
}

.header-content h1 {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 16px;
}

.header-content p {
  font-size: 18px;
  opacity: 0.9;
}

.page-content {
  height: 100vh;
  overflow-y: auto;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.page-content::-webkit-scrollbar {
  display: none;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.help-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 40px;
}

.sidebar {
  position: sticky;
  top: 100px;
  height: fit-content;
}

.help-nav {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 25px rgba(15, 39, 106, 0.06);
}

.help-nav h3 {
  font-size: 18px;
  color: #1f274b;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f3fa;
}

.help-nav ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.help-nav li {
  padding: 12px 16px;
  cursor: pointer;
  border-radius: 8px;
  margin-bottom: 8px;
  transition: all 0.3s ease;
}

.help-nav li:hover,
.help-nav li.active {
  background: #f0f7ff;
  color: #0c5fe7;
}

.main-content {
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 8px 25px rgba(15, 39, 106, 0.06);
}

.search-section {
  margin-bottom: 32px;
}

.search-box {
  position: relative;
  max-width: 400px;
}

.search-box input {
  width: 100%;
  padding: 16px 48px 16px 16px;
  border: 2px solid #e0e6f2;
  border-radius: 12px;
  font-size: 16px;
}

.search-icon {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 20px;
}

.content-section h2 {
  font-size: 28px;
  color: #1f274b;
  margin-bottom: 32px;
}

.faq-section h3,
.guide-section h3 {
  font-size: 20px;
  color: #1f274b;
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f3fa;
}

.faq-list {
  margin-bottom: 40px;
}

.faq-item {
  border: 1px solid #e0e6f2;
  border-radius: 12px;
  margin-bottom: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.faq-item.active {
  border-color: #0c5fe7;
}

.faq-question {
  padding: 20px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8faff;
}

.faq-question span {
  font-weight: 600;
  color: #1f274b;
}

.faq-icon {
  font-size: 20px;
  font-weight: bold;
}

.faq-answer {
  padding: 0 20px 20px;
  background: white;
}

.faq-steps {
  margin-top: 16px;
}

.step {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.step-number {
  width: 24px;
  height: 24px;
  background: #0c5fe7;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  margin-right: 12px;
}

.guide-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
}

.guide-card {
  border: 1px solid #e0e6f2;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  transition: transform 0.3s ease;
}

.guide-card:hover {
  transform: translateY(-5px);
}

.guide-icon {
  font-size: 32px;
  margin-bottom: 16px;
}

.guide-card h4 {
  font-size: 18px;
  color: #1f274b;
  margin-bottom: 12px;
}

.guide-card p {
  color: #5a6486;
  margin-bottom: 16px;
  line-height: 1.5;
}

.guide-btn {
  background: #f0f7ff;
  color: #0c5fe7;
  border: 1px solid #0c5fe7;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.guide-btn:hover {
  background: #0c5fe7;
  color: white;
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

.quick-help-popup {
  position: absolute;
  bottom: 70px;
  right: 0;
  width: 280px;
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(15, 39, 106, 0.15);
}

.quick-help-popup h4 {
  margin-bottom: 8px;
}

.quick-help-popup p {
  color: #5a6486;
  margin-bottom: 16px;
}

.chat-btn,
.email-btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 8px;
}

.chat-btn {
  background: #0c5fe7;
  color: white;
}

.email-btn {
  background: #f0f7ff;
  color: #0c5fe7;
}

@media (max-width: 768px) {
  .help-layout {
    grid-template-columns: 1fr;
  }
  
  .sidebar {
    position: static;
  }
  
  .main-content {
    padding: 24px;
  }
  
  .guide-grid {
    grid-template-columns: 1fr;
  }
  
  .quick-help {
    bottom: 20px;
    right: 20px;
  }
  
  .quick-help-popup {
    width: 250px;
  }
}


</style>
