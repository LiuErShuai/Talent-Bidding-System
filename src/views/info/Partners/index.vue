<template>
  <div class="partners-page">
    <!-- 页面标题区 -->
    <section class="page-header">
      <div class="header-content">
        <h1 class="page-title">合作企业</h1>
        <p class="page-subtitle">与众多优秀企业建立深度合作关系，共同推动产教融合发展</p>
      </div>
    </section>

    <!-- 合作企业列表 -->
    <section class="partners-section">
      <div class="section-container">
        <!-- 战略合作伙伴 -->
        <div class="partner-category">
          <h2 class="category-title">战略合作伙伴</h2>
          <div class="partners-grid strategic">
            <div
              v-for="partner in strategicPartners"
              :key="partner.id"
              class="partner-card strategic"
            >
              <div class="partner-logo">{{ partner.logo }}</div>
              <div class="partner-info">
                <h3 class="partner-name">{{ partner.name }}</h3>
                <p class="partner-desc">{{ partner.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 行业合作伙伴 -->
        <div class="partner-category">
          <h2 class="category-title">行业合作伙伴</h2>
          <div class="partners-grid">
            <div
              v-for="partner in industryPartners"
              :key="partner.id"
              class="partner-card"
            >
              <div class="partner-logo">{{ partner.logo }}</div>
              <div class="partner-name">{{ partner.name }}</div>
            </div>
          </div>
        </div>

        <!-- 教育合作伙伴 -->
        <div class="partner-category">
          <h2 class="category-title">教育合作伙伴</h2>
          <div class="partners-grid">
            <div
              v-for="partner in educationPartners"
              :key="partner.id"
              class="partner-card"
            >
              <div class="partner-logo">{{ partner.logo }}</div>
              <div class="partner-name">{{ partner.name }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 合作优势 -->
    <section class="advantages-section">
      <div class="section-container">
        <h2 class="section-title">合作优势</h2>
        <div class="advantages-grid">
          <div class="advantage-card">
            <div class="advantage-icon">01</div>
            <h3 class="advantage-title">人才对接</h3>
            <p class="advantage-desc">直接对接高校优秀学生，精准匹配企业需求，降低招聘成本</p>
          </div>
          <div class="advantage-card">
            <div class="advantage-icon">02</div>
            <h3 class="advantage-title">项目合作</h3>
            <p class="advantage-desc">发布真实项目需求，获取创新解决方案，加速产品研发</p>
          </div>
          <div class="advantage-card">
            <div class="advantage-icon">03</div>
            <h3 class="advantage-title">品牌曝光</h3>
            <p class="advantage-desc">在高校群体中提升品牌知名度，建立良好企业形象</p>
          </div>
          <div class="advantage-card">
            <div class="advantage-icon">04</div>
            <h3 class="advantage-title">产学研合作</h3>
            <p class="advantage-desc">与高校建立长期合作关系，共同开展技术研究与成果转化</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 合作流程 -->
    <section class="process-section">
      <div class="section-container">
        <h2 class="section-title">合作流程</h2>
        <div class="process-steps">
          <div class="process-step">
            <div class="step-number">1</div>
            <div class="step-content">
              <h3 class="step-title">提交申请</h3>
              <p class="step-desc">填写企业信息，提交合作意向</p>
            </div>
          </div>
          <div class="process-line"></div>
          <div class="process-step">
            <div class="step-number">2</div>
            <div class="step-content">
              <h3 class="step-title">资质审核</h3>
              <p class="step-desc">平台审核企业资质，确保合作质量</p>
            </div>
          </div>
          <div class="process-line"></div>
          <div class="process-step">
            <div class="step-number">3</div>
            <div class="step-content">
              <h3 class="step-title">签订协议</h3>
              <p class="step-desc">双方签订合作协议，明确权责</p>
            </div>
          </div>
          <div class="process-line"></div>
          <div class="process-step">
            <div class="step-number">4</div>
            <div class="step-content">
              <h3 class="step-title">开始合作</h3>
              <p class="step-desc">正式入驻平台，发布项目需求</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 联系我们 -->
    <section class="contact-section">
      <div class="section-container">
        <div class="contact-card">
          <h2 class="contact-title">成为合作伙伴</h2>
          <p class="contact-desc">如果您的企业有意向与我们建立合作关系，欢迎联系我们</p>
          <div class="contact-info">
            <div class="contact-item">
              <span class="contact-label">联系邮箱：</span>
              <span class="contact-value">partner@talent-platform.com</span>
            </div>
            <div class="contact-item">
              <span class="contact-label">联系电话：</span>
              <span class="contact-value">400-888-8888</span>
            </div>
          </div>
          <router-link to="/contact" class="contact-btn">联系我们</router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 战略合作伙伴
const strategicPartners = ref([
  { id: 1, name: '腾讯科技', logo: 'T', description: '全球领先的互联网科技公司，在社交、游戏、金融科技等领域深度合作' },
  { id: 2, name: '阿里巴巴', logo: 'A', description: '全球最大的电子商务平台，在云计算、大数据等领域开展产学研合作' },
  { id: 3, name: '华为技术', logo: 'H', description: '全球领先的ICT基础设施和智能终端提供商，共建人才培养基地' }
])

// 行业合作伙伴
const industryPartners = ref([
  { id: 1, name: '字节跳动', logo: 'B' },
  { id: 2, name: '百度', logo: 'B' },
  { id: 3, name: '京东', logo: 'J' },
  { id: 4, name: '美团', logo: 'M' },
  { id: 5, name: '网易', logo: 'N' },
  { id: 6, name: '小米', logo: 'X' },
  { id: 7, name: '滴滴出行', logo: 'D' },
  { id: 8, name: '快手', logo: 'K' }
])

// 教育合作伙伴
const educationPartners = ref([
  { id: 1, name: '清华大学', logo: '清' },
  { id: 2, name: '北京大学', logo: '北' },
  { id: 3, name: '浙江大学', logo: '浙' },
  { id: 4, name: '上海交通大学', logo: '交' },
  { id: 5, name: '复旦大学', logo: '复' },
  { id: 6, name: '桂林电子科技大学', logo: '桂' }
])
</script>

<style scoped>
.partners-page {
  min-height: 100vh;
  background: #f5f7fb;
}

/* 页面标题区 */
.page-header {
  background: linear-gradient(135deg, #0c5fe7 0%, #2fb7ff 100%);
  padding: 60px 24px;
  text-align: center;
  color: #fff;
}

.header-content {
  max-width: 800px;
  margin: 0 auto;
}

.page-title {
  font-size: 36px;
  font-weight: 700;
  margin: 0 0 16px 0;
}

.page-subtitle {
  font-size: 16px;
  opacity: 0.9;
  margin: 0;
}

/* 通用容器 */
.section-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

/* 合作企业列表 */
.partners-section {
  padding: 60px 0;
}

.partner-category {
  margin-bottom: 48px;
}

.partner-category:last-child {
  margin-bottom: 0;
}

.category-title {
  font-size: 24px;
  font-weight: 600;
  color: #1f274b;
  margin: 0 0 24px 0;
  padding-left: 12px;
  border-left: 4px solid #2563eb;
}

.partners-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.partners-grid.strategic {
  grid-template-columns: repeat(3, 1fr);
}

.partner-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  cursor: pointer;
}

.partner-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(37, 99, 235, 0.15);
}

.partner-card.strategic {
  text-align: left;
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.partner-logo {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #0c5fe7, #2fb7ff);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 24px;
  font-weight: 700;
  flex-shrink: 0;
  margin: 0 auto 12px;
}

.partner-card.strategic .partner-logo {
  margin: 0;
}

.partner-info {
  flex: 1;
}

.partner-name {
  font-size: 16px;
  font-weight: 600;
  color: #1f274b;
  margin: 0;
}

.partner-card.strategic .partner-name {
  margin-bottom: 8px;
}

.partner-desc {
  font-size: 14px;
  color: #7b859f;
  margin: 0;
  line-height: 1.6;
}

/* 合作优势 */
.advantages-section {
  padding: 60px 0;
  background: #fff;
}

.section-title {
  font-size: 28px;
  font-weight: 600;
  color: #1f274b;
  text-align: center;
  margin: 0 0 40px 0;
}

.advantages-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.advantage-card {
  background: #f5f7fb;
  border-radius: 12px;
  padding: 32px 24px;
  text-align: center;
}

.advantage-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #0c5fe7, #2fb7ff);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 18px;
  font-weight: 700;
  margin: 0 auto 16px;
}

.advantage-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f274b;
  margin: 0 0 12px 0;
}

.advantage-desc {
  font-size: 14px;
  color: #7b859f;
  margin: 0;
  line-height: 1.6;
}

/* 合作流程 */
.process-section {
  padding: 60px 0;
}

.process-steps {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 0;
}

.process-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 180px;
}

.step-number {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #0c5fe7, #2fb7ff);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 16px;
}

.step-content {
  text-align: center;
}

.step-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f274b;
  margin: 0 0 8px 0;
}

.step-desc {
  font-size: 14px;
  color: #7b859f;
  margin: 0;
}

.process-line {
  width: 60px;
  height: 2px;
  background: #d1d5db;
  margin-top: 24px;
}

/* 联系我们 */
.contact-section {
  padding: 60px 0;
  background: #fff;
}

.contact-card {
  background: linear-gradient(135deg, #0c5fe7 0%, #2fb7ff 100%);
  border-radius: 16px;
  padding: 48px;
  text-align: center;
  color: #fff;
}

.contact-title {
  font-size: 28px;
  font-weight: 600;
  margin: 0 0 16px 0;
}

.contact-desc {
  font-size: 16px;
  opacity: 0.9;
  margin: 0 0 32px 0;
}

.contact-info {
  display: flex;
  justify-content: center;
  gap: 48px;
  margin-bottom: 32px;
}

.contact-item {
  font-size: 16px;
}

.contact-label {
  opacity: 0.8;
}

.contact-value {
  font-weight: 600;
}

.contact-btn {
  display: inline-block;
  padding: 12px 32px;
  background: #fff;
  color: #2563eb;
  border-radius: 999px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.contact-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

/* 响应式 */
@media (max-width: 1024px) {
  .partners-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .partners-grid.strategic {
    grid-template-columns: repeat(2, 1fr);
  }

  .advantages-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .process-steps {
    flex-wrap: wrap;
    gap: 24px;
  }

  .process-line {
    display: none;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 28px;
  }

  .partners-grid,
  .partners-grid.strategic {
    grid-template-columns: repeat(2, 1fr);
  }

  .partner-card.strategic {
    flex-direction: column;
    text-align: center;
  }

  .partner-card.strategic .partner-logo {
    margin: 0 auto 12px;
  }

  .advantages-grid {
    grid-template-columns: 1fr;
  }

  .contact-info {
    flex-direction: column;
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .partners-grid,
  .partners-grid.strategic {
    grid-template-columns: 1fr;
  }

  .process-step {
    width: 100%;
  }
}
</style>
