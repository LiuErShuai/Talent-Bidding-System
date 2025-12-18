<template>
  <div class="enterprise-container">
    <main class="main-content">
      <div class="layout">
        <!-- 侧边导航 -->
        <aside class="sidebar">
          <div class="sidebar-title">企业中心</div>
          <button class="sidebar-item" :class="{ active: activeSection === 'overview' }" @click="activeSection = 'overview'">概览</button>
          <button class="sidebar-item" :class="{ active: activeSection === 'contact' }" @click="activeSection = 'contact'">联系人</button>
          <button class="sidebar-item" :class="{ active: activeSection === 'business' }" @click="activeSection = 'business'">业务与需求</button>
          <button class="sidebar-item" :class="{ active: activeSection === 'cert' }" @click="activeSection = 'cert'">资质文件</button>
        </aside>

        <!-- 主内容 -->
        <div class="content">
          <!-- 概览 -->
          <section v-if="activeSection === 'overview'" class="section">
            <div class="hero">
              <div class="hero-left">
                <div class="logo-box">
                  <img :src="enterpriseAvatar" alt="企业Logo" />
                </div>
                <div class="hero-info">
                  <div class="hero-title">
                    <h1>{{ enterpriseInfo.name }}</h1>
                    <span class="role-tag">企业</span>
                    <span class="status-tag" :class="enterpriseInfo.certStatusClass">{{ enterpriseInfo.certStatusText }}</span>
                  </div>
                  <p class="hero-desc">{{ enterpriseInfo.intro }}</p>
                  <div class="hero-tags">
                    <span class="tag" v-for="tag in displayTags" :key="tag">{{ tag }}</span>
                    <span v-if="!displayTags.length" class="tag ghost">暂无标签</span>
                  </div>
                </div>
              </div>
              <div class="hero-stats">
                <div class="stat">
                  <div class="num">{{ stats.published }}</div>
                  <div class="label">已发布</div>
                </div>
                <div class="stat">
                  <div class="num">{{ stats.running }}</div>
                  <div class="label">进行中</div>
                </div>
                <div class="stat">
                  <div class="num">{{ stats.completed }}</div>
                  <div class="label">已完成</div>
                </div>
                <div class="stat">
                  <div class="num">{{ stats.satisfaction }}%</div>
                  <div class="label">满意度</div>
                </div>
              </div>
            </div>

            <div class="card">
              <div class="card-header">
                <h2>企业介绍</h2>
              </div>
              <p class="intro-text">
                {{ enterpriseInfo.companyBrief }}
              </p>
            </div>

            <div class="grid">
              <div class="card">
                <div class="card-header">
                  <h2>企业基础资料</h2>
                </div>
                <div class="info-list">
                  <div class="info-item">
                    <span class="label">统一社会信用代码</span>
                    <span class="value">{{ enterpriseInfo.creditCode }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">行业领域</span>
                    <span class="value">{{ enterpriseInfo.industry }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">企业规模</span>
                    <span class="value">{{ enterpriseInfo.scale }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">所在地区</span>
                    <span class="value">{{ enterpriseInfo.location }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">官方网址</span>
                    <a v-if="enterpriseInfo.website" class="value link" :href="enterpriseInfo.website" target="_blank" rel="noreferrer">
                      {{ enterpriseInfo.website }}
                    </a>
                    <span v-else class="value">未填写</span>
                  </div>
                  <div class="info-item">
                    <span class="label">成立年份</span>
                    <span class="value">{{ enterpriseInfo.foundedYear }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">注册资本</span>
                    <span class="value">{{ enterpriseInfo.registeredCapital }}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- 联系人 -->
          <section v-else-if="activeSection === 'contact'" class="section">
            <div class="card">
              <div class="card-header">
                <h2>联系人与对接信息</h2>
              </div>
              <div class="info-list">
                <div class="info-item">
                  <span class="label">主要联系人</span>
                  <span class="value">{{ enterpriseInfo.contactName }}</span>
                </div>
                <div class="info-item">
                  <span class="label">联系人职务</span>
                  <span class="value">{{ enterpriseInfo.contactTitle }}</span>
                </div>
                <div class="info-item">
                  <span class="label">联系电话</span>
                  <span class="value">{{ enterpriseInfo.contactPhone }}</span>
                </div>
                <div class="info-item">
                  <span class="label">联系邮箱</span>
                  <span class="value">{{ enterpriseInfo.contactEmail }}</span>
                </div>
              </div>
            </div>
          </section>

          <!-- 业务与需求 -->
          <section v-else-if="activeSection === 'business'" class="section">
            <div class="card">
              <div class="card-header">
                <h2>业务与合作信息</h2>
              </div>
              <div class="info-list">
                <div class="info-item">
                  <span class="label">主营方向</span>
                  <span class="value">{{ enterpriseInfo.businessFocus }}</span>
                </div>
                <div class="info-item">
                  <span class="label">近期需求</span>
                  <span class="value">{{ enterpriseInfo.recentNeeds }}</span>
                </div>
                <div class="info-item">
                  <span class="label">合作偏好</span>
                  <span class="value">{{ enterpriseInfo.cooperationPreference }}</span>
                </div>
              </div>
            </div>
          </section>

          <!-- 资质与文件 -->
          <section v-else-if="activeSection === 'cert'" class="section">
            <div class="card">
              <div class="card-header">
                <h2>资质与文件</h2>
              </div>
              <div class="cert-list">
                <div v-if="enterpriseInfo.certifications.length" class="cert-chip" v-for="cert in enterpriseInfo.certifications" :key="cert">
                  {{ cert }}
                </div>
                <p v-else class="empty">暂未上传资质信息</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useAuthStore } from '@store/modules/auth'
import { useUserStore } from '@store/modules/user'

const authStore = useAuthStore()
const userStore = useUserStore()

// 左侧导航选中状态
const activeSection = ref('overview')

// 从 store 读取企业资料并提供兜底文案（填入演示用的完整假数据）
const enterpriseInfo = computed(() => {
  const profile = userStore.profile || {}
  const info = authStore.userInfo || {}

  return {
    name: profile.companyName || profile.enterpriseName || info.companyName || '星河数智科技有限公司',
    creditCode: profile.creditCode || '1235456677',
    industry: profile.industry || '人工智能 / 智慧城市 / 计算机软件',
    scale: profile.scale || '500-1000人',
    location: profile.location || '广西桂林电子科技大学',
    website: profile.website || 'https://demo-enterprise.example.com',
    contactName: profile.contactName || info.contactName || '李若晴',
    contactTitle: profile.contactTitle || '产教融合负责人',
    contactPhone: profile.contactPhone || info.phone || '138-0013-8000',
    contactEmail: profile.contactEmail || info.email || 'partner@demo-enterprise.com',
    intro: profile.companyIntro || profile.bio || '星河数智专注AI+教育与智慧城市，提供从大模型落地、数据中台到教学数字化的端到端解决方案，累计服务200+ 政企与高校场景。',
    tags: profile.tags || profile.businessTags || ['AI大模型','智慧校园','城市物联','数据中台','SaaS交付','安全合规'],
    businessFocus: profile.businessFocus || 'AI 应用落地、教育数字化平台、智慧城市物联平台研发',
    recentNeeds: profile.recentNeeds || '面向高校共建“智能实训工厂”示范项目，寻求计算机视觉与数据治理方向团队合作；同步招聘算法实习生与前端实习生。',
    cooperationPreference: profile.cooperationPreference || '优先长期共建与校企联合实验室，鼓励成果转化与联合申报课题。',
    certifications: profile.certifications || ['CMMI3 研发体系','ISO27001 信息安全','高新技术企业','专精特新小巨人'],
    certStatusText: profile.certStatusText || '认证通过',
    certStatusClass: profile.certStatusClass || 'status-pass',
    foundedYear: profile.foundedYear || '2017年',
    registeredCapital: profile.registeredCapital || '5000万人民币',
    companyBrief: profile.companyBrief || '星河数智是一家专注计算机软件与人工智能的技术公司，核心团队来自头部互联网与科研机构，提供从AI中台、数据治理到行业SaaS的全栈产品与交付服务，累计落地教育、城市物联、政企办公等200+场景，具备快速定制与安全合规的行业化能力。'
  }
})

// 展示标签
const displayTags = computed(() => enterpriseInfo.value.tags?.slice(0, 6) || [])

// 统计数据
const stats = computed(() => {
  const profile = userStore.profile || {}
  return {
    published: profile.publishedProjects || 0,
    running: profile.runningProjects || 0,
    completed: profile.completedProjects || 0,
    satisfaction: profile.satisfactionRate || 0
  }
})

const enterpriseAvatar = computed(() => {
  const profile = userStore.profile || {}
  const info = authStore.userInfo || {}
  return profile.logo || info.avatar || 'https://picsum.photos/seed/enterprise-logo/120/120'
})

// 初次加载时拉取企业资料
onMounted(() => {
  userStore.fetchUserProfile()
})
</script>

<style scoped>
.enterprise-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #edf1f7 100%);
  color: #333;
}

.main-content {
  max-width: 1340px;
  margin: 0 auto;
  padding: 24px 20px 48px;
  width: 100%;
}

.layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 24px;
}

.sidebar {
  align-self: flex-start;
  background: #ffffff;
  border-radius: 12px;
  padding: 16px 14px;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.08);
  border: 1px solid #f0f3fa;
}

.sidebar-title {
  font-size: 14px;
  font-weight: 600;
  color: #9aa5c2;
  margin-bottom: 8px;
  padding: 4px 8px;
}

.sidebar-item {
  display: block;
  width: 100%;
  padding: 8px 10px;
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

.content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section {
  animation: fadeInUp 0.4s ease-out;
}

.hero {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
  border: 1px solid #f0f2f5;
}

.hero-left {
  display: flex;
  gap: 16px;
  flex: 1;
}

.logo-box {
  width: 96px;
  height: 96px;
  border-radius: 16px;
  background: #f5f7fb;
  border: 1px solid #e5e9f2;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.logo-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.hero-title {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.hero-title h1 {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
}

.role-tag {
  padding: 4px 10px;
  border-radius: 999px;
  background: #e6f4ff;
  color: #1890ff;
  font-weight: 600;
  font-size: 13px;
}

.status-tag {
  padding: 4px 10px;
  border-radius: 999px;
  background: #fff1f0;
  color: #ff4d4f;
  font-weight: 600;
  font-size: 13px;
}

.status-tag.status-pass {
  background: #f6ffed;
  color: #52c41a;
}

.status-tag.status-pending {
  background: #fff7e6;
  color: #fa8c16;
}

.hero-desc {
  margin: 0;
  color: #4a5676;
  line-height: 1.6;
}

.hero-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  padding: 6px 10px;
  border-radius: 999px;
  background: #f5f7fb;
  color: #1f274b;
  font-size: 12px;
}

.tag.ghost {
  background: #fafafa;
  color: #999;
}

.hero-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  min-width: 240px;
}

.stat {
  background: linear-gradient(135deg, #f8fbff 0%, #eef3ff 100%);
  border: 1px solid #e5e9f2;
  border-radius: 12px;
  padding: 12px;
  text-align: center;
}

.stat .num {
  font-size: 20px;
  font-weight: 700;
  color: #0c5fe7;
}

.stat .label {
  color: #6b7390;
  font-size: 13px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 16px;
}

.card {
  background: #fff;
  border-radius: 12px;
  padding: 18px 20px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.05);
  border: 1px solid #f0f2f5;
}

.intro-text {
  margin: 0;
  padding: 4px 2px 2px;
  color: #4a5676;
  line-height: 1.7;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.card-header h2 {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #1f274b;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 12px;
  background: #f9fbff;
  border: 1px dashed #e6eaf5;
  border-radius: 10px;
}

.label {
  color: #6b7390;
  font-weight: 600;
}

.value {
  color: #1f274b;
  font-weight: 600;
}

.value.link {
  color: #0c5fe7;
  text-decoration: none;
}

.cert-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.cert-chip {
  padding: 8px 12px;
  background: #f5f7fb;
  border-radius: 10px;
  border: 1px solid #e5e9f2;
  color: #1f274b;
  font-weight: 600;
}

.empty {
  margin: 0;
  color: #999;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .hero {
    flex-direction: column;
  }

  .hero-stats {
    width: 100%;
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>

