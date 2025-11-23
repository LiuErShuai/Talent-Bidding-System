<template>
  <div class="about-page">
    <!-- 整个页面内容都在一个滚动容器中 -->
    <div class="page-content">
      <button class="back-btn" @click="goBack">返回</button>
      <section class="intro-section">
        <div class="container">
          <div class="intro-content">
            <h2>产教融合项目揭榜平台</h2>
            <p class="intro-text">
              我们致力于搭建高校与企业之间的桥梁，为学生提供实践机会，为企业输送优秀人才。
              通过项目揭榜的方式，让创新想法落地生根，让知识创造价值。
            </p>
          </div>
        </div>
      </section>

      <section class="mission-section">
        <div class="container">
          <div class="mission-grid">
            <div class="mission-card">
              <div class="mission-icon">🎯</div>
              <h3>我们的使命</h3>
              <p>连接高校教育与企业需求，打造产教融合新生态</p>
            </div>
            <div class="mission-card">
              <div class="mission-icon">🚀</div>
              <h3>我们的愿景</h3>
              <p>成为国内领先的产教融合项目平台，培养创新型人才</p>
            </div>
            <div class="mission-card">
              <div class="mission-icon">💡</div>
              <h3>我们的价值</h3>
              <p>实践驱动学习，项目培养能力，创新引领未来</p>
            </div>
          </div>
        </div>
      </section>

      <section class="stats-section">
        <div class="container">
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-value">100+</div>
              <div class="stat-label">合作企业</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">500+</div>
              <div class="stat-label">成功项目</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">1000+</div>
              <div class="stat-label">注册学生</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">¥500万+</div>
              <div class="stat-label">项目奖金</div>
            </div>
          </div>
        </div>
      </section>

      <section class="team-section">
        <div class="container">
          <h2>团队介绍</h2>
          <div class="team-grid">
            <div class="team-member">
              <div class="member-avatar">张</div>
              <h3>张三</h3>
              <p>平台创始人</p>
              <span class="member-desc">10年互联网产品经验</span>
            </div>
            <div class="team-member">
              <div class="member-avatar">李</div>
              <h3>李四</h3>
              <p>技术总监</p>
              <span class="member-desc">全栈工程师，教育技术专家</span>
            </div>
            <div class="team-member">
              <div class="member-avatar">王</div>
              <h3>王五</h3>
              <p>运营总监</p>
              <span class="member-desc">校企合作资深专家</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const goBack = () => {
  router.back()
}
</script>

<style scoped>
.about-page {
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

.intro-section {
  margin-bottom: 80px;
}

.intro-content {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

.intro-content h2 {
  font-size: 36px;
  color: #1f274b;
  margin-bottom: 24px;
}

.intro-text {
  font-size: 18px;
  line-height: 1.8;
  color: #5a6486;
}

.mission-section {
  margin-bottom: 80px;
}

.mission-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
}

.mission-card {
  background: white;
  padding: 40px 32px;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(15, 39, 106, 0.08);
  transition: transform 0.3s ease;
}

.mission-card:hover {
  transform: translateY(-5px);
}

.mission-icon {
  font-size: 48px;
  margin-bottom: 20px;
}

.mission-card h3 {
  font-size: 20px;
  color: #1f274b;
  margin-bottom: 12px;
}

.mission-card p {
  color: #5a6486;
  line-height: 1.6;
}

.stats-section {
  margin-bottom: 80px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 32px;
}

.stat-item {
  text-align: center;
  background: white;
  padding: 32px 24px;
  border-radius: 16px;
  box-shadow: 0 8px 25px rgba(15, 39, 106, 0.06);
}

.stat-value {
  font-size: 48px;
  font-weight: 700;
  color: #0c5fe7;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 16px;
  color: #5a6486;
  font-weight: 600;
}

.team-section h2 {
  text-align: center;
  font-size: 36px;
  color: #1f274b;
  margin-bottom: 48px;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 32px;
}

.team-member {
  background: white;
  padding: 40px 32px;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(15, 39, 106, 0.08);
}

.member-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1b51da, #2ee4ff);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: 700;
  margin: 0 auto 20px;
}

.team-member h3 {
  font-size: 20px;
  color: #1f274b;
  margin-bottom: 8px;
}

.team-member p {
  color: #0c5fe7;
  font-weight: 600;
  margin-bottom: 8px;
}

.member-desc {
  color: #5a6486;
  font-size: 14px;
}

@media (max-width: 768px) {
  .header-content h1 {
    font-size: 36px;
  }
  
  .mission-grid,
  .stats-grid,
  .team-grid {
    grid-template-columns: 1fr;
  }
  
  .page-content {
    padding: 40px 16px 48px;
  }
}
</style>
