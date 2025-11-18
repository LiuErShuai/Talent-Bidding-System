<template>
  <div class="privacy-page">
    <!-- 整个页面内容都在一个滚动容器中 -->
    <div class="page-content">
      <!-- 顶部banner -->
      <header class="page-header">
        <div class="header-content">
          <h1>隐私政策</h1>
          <p>保护您的个人信息是我们的首要任务</p>
        </div>
      </header>
      <div class="container">
        <div class="privacy-content">
          <!-- 目录导航 -->
          <nav class="toc">
            <h3>目录</h3>
            <ul>
              <li 
                v-for="section in sections" 
                :key="section.id"
                :class="{ active: activeSection === section.id }"
                @click="scrollToSection(section.id)"
              >
                {{ section.title }}
              </li>
            </ul>
          </nav>

          <!-- 主要内容 -->
          <div class="content">
            <!-- 更新日期 -->
            <div class="update-info">
              <p><strong>最后更新日期：</strong>2025年1月17日</p>
            </div>

            <!-- 引言 -->
            <section id="introduction" class="policy-section">
              <h2>1. 引言</h2>
              <p>
                产教融合项目揭榜平台（以下简称"我们"）深知个人信息对您的重要性，并会尽力保护您的个人信息安全可靠。
                我们致力于维持您对我们的信任，保护您的个人信息，严格遵守法律法规，遵循以下隐私保护原则。
              </p>
            </section>

            <!-- 信息收集 -->
            <section id="collection" class="policy-section">
              <h2>2. 我们如何收集和使用您的个人信息</h2>
              <h3>2.1 注册信息</h3>
              <p>当您注册平台账户时，我们需要收集以下信息：</p>
              <ul>
                <li>姓名、邮箱地址、手机号码</li>
                <li>身份证信息（用于实名认证）</li>
                <li>个人技能和专业背景</li>
                <li>教育经历和工作经验</li>
              </ul>

              <h3>2.2 项目参与信息</h3>
              <p>当您参与项目揭榜时，我们可能会收集：</p>
              <ul>
                <li>项目作品和相关材料</li>
                <li>项目进度和沟通记录</li>
                <li>评价和反馈信息</li>
                <li>支付信息（仅用于奖金发放）</li>
              </ul>

              <h3>2.3 技术信息</h3>
              <p>我们自动收集的技术信息包括：</p>
              <ul>
                <li>IP地址、浏览器类型、操作系统</li>
                <li>访问时间和页面浏览记录</li>
                <li>设备信息和位置信息</li>
              </ul>
            </section>

            <!-- 信息使用 -->
            <section id="usage" class="policy-section">
              <h2>3. 我们如何使用您的信息</h2>
              <p>我们使用收集的信息用于以下目的：</p>
              <ul>
                <li><strong>提供服务：</strong>确保平台功能的正常运行</li>
                <li><strong>身份验证：</strong>验证用户身份，确保交易安全</li>
                <li><strong>项目匹配：</strong>为您推荐合适的项目机会</li>
                <li><strong>沟通通知：</strong>发送项目更新和重要通知</li>
                <li><strong>改善服务：</strong>分析和优化用户体验</li>
                <li><strong>安全保障：</strong>检测和防止欺诈行为</li>
              </ul>
            </section>

            <!-- 信息共享 -->
            <section id="sharing" class="policy-section">
              <h2>4. 我们如何共享、转让、公开披露您的个人信息</h2>
              <h3>4.1 共享</h3>
              <p>我们不会与任何第三方共享您的个人信息，除非：</p>
              <ul>
                <li>获得您的明确同意</li>
                <li>根据法律法规要求</li>
                <li>为保护我们的合法权益</li>
                <li>与项目发布方进行必要的项目协调</li>
              </ul>

              <h3>4.2 转让</h3>
              <p>我们不会将您的个人信息转让给任何公司、组织或个人，除非：</p>
              <ul>
                <li>获得您的明确同意</li>
                <li>在涉及合并、收购或破产清算时</li>
              </ul>
            </section>

            <!-- Cookie政策 -->
            <section id="cookies" class="policy-section">
              <h2>5. Cookie和同类技术</h2>
              <p>我们使用Cookie和类似技术来提升用户体验：</p>
              <ul>
                <li><strong>必要Cookie：</strong>用于网站基本功能的运行</li>
                <li><strong>偏好Cookie：</strong>记住您的语言偏好和设置</li>
                <li><strong>统计Cookie：</strong>帮助我们了解用户如何使用网站</li>
              </ul>
              <p>您可以通过浏览器设置拒绝Cookie，但可能会影响网站功能。</p>
            </section>

            <!-- 信息安全 -->
            <section id="security" class="policy-section">
              <h2>6. 我们如何保护您的个人信息</h2>
              <p>我们采取各种安全技术措施来保护您的个人信息：</p>
              <ul>
                <li>数据加密传输（SSL/TLS）</li>
                <li>访问控制和身份验证</li>
                <li>定期安全审计</li>
                <li>数据备份和恢复</li>
                <li>员工隐私保护培训</li>
              </ul>
            </section>

            <!-- 您的权利 -->
            <section id="rights" class="policy-section">
              <h2>7. 您的权利</h2>
              <p>按照中国相关的法律、法规、标准，我们保障您对自己的个人信息行使以下权利：</p>
              
              <div class="rights-grid">
                <div class="right-item">
                  <div class="right-icon">👁️</div>
                  <h4>访问权</h4>
                  <p>您有权访问您的个人信息</p>
                </div>
                <div class="right-item">
                  <div class="right-icon">✏️</div>
                  <h4>更正权</h4>
                  <p>您有权更正不准确的个人信息</p>
                </div>
                <div class="right-item">
                  <div class="right-icon">🗑️</div>
                  <h4>删除权</h4>
                  <p>在特定情形下，您有权删除个人信息</p>
                </div>
                <div class="right-item">
                  <div class="right-icon">⏸️</div>
                  <h4>撤回同意权</h4>
                  <p>您有权撤回已同意的隐私政策</p>
                </div>
              </div>
            </section>

            <!-- 未成年人保护 -->
            <section id="minors" class="policy-section">
              <h2>8. 未成年人保护</h2>
              <p>我们非常重视对未成年人个人信息的保护：</p>
              <ul>
                <li>我们不主动收集未成年人的个人信息</li>
                <li>如您是未成年人，请在监护人指导下使用我们的服务</li>
                <li>如发现我们无意中收集了未成年人的个人信息，请立即联系我们</li>
              </ul>
            </section>

            <!-- 政策更新 -->
            <section id="updates" class="policy-section">
              <h2>9. 本政策如何更新</h2>
              <p>我们的隐私政策可能适时变更：</p>
              <ul>
                <li>重大变更时，我们会通过显著方式通知您</li>
                <li>您继续使用我们的服务即表示接受更新后的政策</li>
                <li>我们会在本页面顶部显示更新日期</li>
              </ul>
            </section>

            <!-- 联系我们 -->
            <section id="contact" class="policy-section">
              <h2>10. 如何联系我们</h2>
              <p>如果您对本隐私政策有任何疑问、意见或建议，请通过以下方式联系我们：</p>
              <div class="contact-info">
                <p><strong>邮箱：</strong>privacy@talent-bidding.com</p>
                <p><strong>电话：</strong>400-123-4567</p>
                <p><strong>地址：</strong>北京市海淀区中关村科技园创业大厦A座10层</p>
              </div>
              <p>我们将在15个工作日内回复您的请求。</p>
            </section>

            <!-- 同意按钮 -->
            <div class="consent-section">
              <div class="consent-box">
                <h3>隐私政策确认</h3>
                <p>我已阅读并同意以上隐私政策</p>
                <div class="consent-buttons">
                  <button class="agree-btn" @click="handleAgree">同意并继续</button>
                  <button class="disagree-btn" @click="handleDisagree">不同意</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const activeSection = ref('introduction')

const sections = [
  { id: 'introduction', title: '引言' },
  { id: 'collection', title: '信息收集' },
  { id: 'usage', title: '信息使用' },
  { id: 'sharing', title: '信息共享' },
  { id: 'cookies', title: 'Cookie政策' },
  { id: 'security', title: '信息安全' },
  { id: 'rights', title: '您的权利' },
  { id: 'minors', title: '未成年人保护' },
  { id: 'updates', title: '政策更新' },
  { id: 'contact', title: '联系我们' }
]

const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
    activeSection.value = sectionId
  }
}

const handleScroll = () => {
  const scrollPosition = window.scrollY + 100
  
  for (let i = sections.length - 1; i >= 0; i--) {
    const section = document.getElementById(sections[i].id)
    if (section && scrollPosition >= section.offsetTop) {
      activeSection.value = sections[i].id
      break
    }
  }
}

const handleAgree = () => {
  localStorage.setItem('privacyConsent', 'true')
  alert('感谢您同意我们的隐私政策！')
  router.back()
}

const handleDisagree = () => {
  alert('您需要同意隐私政策才能继续使用我们的服务。')
  router.push('/login')
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.privacy-page {
  min-height: 100vh;
  background: #f5f7fb;
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

.privacy-content {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 40px;
}

.toc {
  position: sticky;
  top: 100px;
  height: fit-content;
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 25px rgba(15, 39, 106, 0.06);
}

.toc h3 {
  font-size: 18px;
  color: #1f274b;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f3fa;
}

.toc ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.toc li {
  padding: 12px 16px;
  cursor: pointer;
  border-radius: 8px;
  margin-bottom: 8px;
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
}

.toc li:hover,
.toc li.active {
  background: #f0f7ff;
  color: #0c5fe7;
  border-left-color: #0c5fe7;
}

.content {
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 8px 25px rgba(15, 39, 106, 0.06);
}

.update-info {
  background: #f8faff;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 32px;
  border-left: 4px solid #0c5fe7;
}

.policy-section {
  margin-bottom: 48px;
}

.policy-section h2 {
  font-size: 24px;
  color: #1f274b;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid #f0f3fa;
}

.policy-section h3 {
  font-size: 18px;
  color: #1f274b;
  margin: 24px 0 12px;
}

.policy-section p {
  line-height: 1.8;
  color: #5a6486;
  margin-bottom: 16px;
}

.policy-section ul {
  margin: 16px 0;
  padding-left: 24px;
}

.policy-section li {
  line-height: 1.6;
  color: #5a6486;
  margin-bottom: 8px;
}

.rights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
  margin-top: 24px;
}

.right-item {
  text-align: center;
  padding: 24px;
  border: 1px solid #e0e6f2;
  border-radius: 12px;
  transition: transform 0.3s ease;
}

.right-item:hover {
  transform: translateY(-5px);
}

.right-icon {
  font-size: 32px;
  margin-bottom: 12px;
}

.right-item h4 {
  font-size: 16px;
  color: #1f274b;
  margin-bottom: 8px;
}

.right-item p {
  font-size: 14px;
  color: #5a6486;
}

.contact-info {
  background: #f8faff;
  padding: 20px;
  border-radius: 8px;
  margin: 16px 0;
}

.consent-section {
  margin-top: 60px;
  padding-top: 40px;
  border-top: 1px solid #e0e6f2;
}

.consent-box {
  text-align: center;
  background: #f8faff;
  padding: 40px;
  border-radius: 16px;
}

.consent-box h3 {
  font-size: 20px;
  color: #1f274b;
  margin-bottom: 12px;
}

.consent-box p {
  color: #5a6486;
  margin-bottom: 24px;
}

.consent-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.agree-btn,
.disagree-btn {
  padding: 12px 32px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.agree-btn {
  background: linear-gradient(120deg, #0c5fe7, #2fb7ff);
  color: white;
}

.agree-btn:hover {
  transform: translateY(-2px);
}

.disagree-btn {
  background: #f0f3fa;
  color: #5a6486;
}

.disagree-btn:hover {
  background: #e0e6f2;
}

@media (max-width: 768px) {
  .privacy-content {
    grid-template-columns: 1fr;
  }
  
  .toc {
    position: static;
    margin-bottom: 24px;
  }
  
  .content {
    padding: 24px;
  }
  
  .rights-grid {
    grid-template-columns: 1fr;
  }
  
  .consent-buttons {
    flex-direction: column;
  }
  
  .header-content h1 {
    font-size: 36px;
  }
}
</style>
