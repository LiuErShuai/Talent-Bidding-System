<template>
  <div class="enterprise-profile">
    <section class="hero">
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
    </section>

    <section class="grid">
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
        </div>
      </div>

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

    <section class="grid">
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
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useAuthStore } from '@store/modules/auth'
import { useUserStore } from '@store/modules/user'

const authStore = useAuthStore()
const userStore = useUserStore()

// 从 store 读取企业资料并提供兜底文案
const enterpriseInfo = computed(() => {
  const profile = userStore.profile || {}
  const info = authStore.userInfo || {}

  return {
    name: profile.companyName || profile.enterpriseName || info.companyName || '未命名企业',
    creditCode: profile.creditCode || '未填写',
    industry: profile.industry || '未填写',
    scale: profile.scale || '未填写',
    location: profile.location || '未填写',
    website: profile.website || '',
    contactName: profile.contactName || info.contactName || '未设置',
    contactTitle: profile.contactTitle || '未设置',
    contactPhone: profile.contactPhone || info.phone || '未填写',
    contactEmail: profile.contactEmail || info.email || '未填写',
    intro: profile.companyIntro || profile.bio || '企业尚未补充简介，可前往编辑完善展示。',
    tags: profile.tags || profile.businessTags || [],
    businessFocus: profile.businessFocus || '未填写',
    recentNeeds: profile.recentNeeds || '暂未发布需求',
    cooperationPreference: profile.cooperationPreference || '未填写',
    certifications: profile.certifications || [],
    certStatusText: profile.certStatusText || '未认证',
    certStatusClass: profile.certStatusClass || 'status-pending'
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
.enterprise-profile {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 20px 48px;
  display: flex;
  flex-direction: column;
  gap: 20px;
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

@media (max-width: 768px) {
  .hero {
    flex-direction: column;
  }

  .hero-stats {
    width: 100%;
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>

