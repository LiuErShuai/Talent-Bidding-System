<template>
  <div class="campus-home">
    <!-- 主内容区 -->
    <div class="main-content">
      <!-- 左侧：我的项目 + 热门项目 -->
      <div class="content-left">
        <MyProjectsCard :projects="myProjects" :loading="loading" />
        <CampusProjectList :projects="hotProjects" :loading="loading" />
      </div>

      <!-- 右侧：侧边栏 -->
      <div class="sidebar">
        <CampusLatestNews :news="latestNews" :loading="loading" />
        <CampusActivities :activities="latestActivities" :loading="loading" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import MyProjectsCard from '@/components/campus/MyProjectsCard.vue'
import CampusProjectList from '@/components/campus/CampusProjectList.vue'
import CampusLatestNews from '@/components/campus/CampusLatestNews.vue'
import CampusActivities from '@/components/campus/CampusActivities.vue'

const loading = ref(false)
const hotProjects = ref([])
const myProjects = ref([])
const latestNews = ref([])
const latestActivities = ref([])

// 获取数据
async function fetchData() {
  loading.value = true
  try {
    // TODO: 对接后端 API，目前使用 Mock 数据
    await new Promise(resolve => setTimeout(resolve, 500))

    // Mock 热门项目数据（只保留3个）
    hotProjects.value = [
      {
        id: 1,
        title: 'AI智能助手开发',
        company: 'XX科技有限公司',
        field: '人工智能',
        deadlineDays: 7,
        reward: 5000,
        status: 'ongoing',
        statusText: '进行中'
      },
      {
        id: 2,
        title: 'Web前端开发',
        company: 'YY网络公司',
        field: '前端开发',
        deadlineDays: 5,
        reward: 8000,
        status: 'ongoing',
        statusText: '进行中'
      },
      {
        id: 3,
        title: '数据分析平台',
        company: 'ZZ数据公司',
        field: '大数据',
        deadlineDays: 10,
        reward: 6000,
        status: 'completed',
        statusText: '已完成'
      }
    ]

    // Mock 我的项目数据
    myProjects.value = [
      {
        id: 1,
        title: 'AI智能助手开发',
        publisher: 'XX科技有限公司',
        field: '人工智能',
        deadlineDays: 25,
        currentMilestone: '方案提交',
        status: 'ongoing',
        statusText: '进行中'
      },
      {
        id: 2,
        title: 'Web前端开发',
        publisher: 'YY网络公司',
        field: '前端开发',
        deadlineDays: 15,
        currentMilestone: '协议签订',
        status: 'ongoing',
        statusText: '进行中'
      }
    ]

    // Mock 最新发布数据
    latestNews.value = [
      { id: 1, date: '1/23', title: '风寒软件普法自适应选择与参数', isNew: true },
      { id: 2, date: '1/23', title: '小型舟桥搭建套件', isNew: true },
      { id: 3, date: '1/22', title: '航天器智能交互式双敏感协诊断工具', isNew: false },
      { id: 4, date: '1/22', title: '信息系统资源合调度模型及评估软件', isNew: false }
    ]

    // Mock 最新动态数据
    latestActivities.value = [
      { id: 1, teamName: '创新科技团队', milestone: '方案提交', time: '15小时前' },
      { id: 2, teamName: '智能开发小组', milestone: '协议签订', time: '16小时前' },
      { id: 3, teamName: '先进技术组', milestone: '中期答辩', time: '20小时前' },
      { id: 4, teamName: '精英开发者', milestone: '成果提交', time: '23小时前' }
    ]
  } catch (error) {
    console.error('获取数据失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.campus-home {
  min-height: calc(100vh - 72px);
  background: transparent;
  color: #1f274b;
  position: relative;
}

/* 背景图片样式 - 与外网首页保持一致 */
.campus-home::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  background-image: url('@/assets/images/backgrounds/home_bg.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 0.15;
  z-index: 0;
  pointer-events: none;
  mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.8) 30%, rgba(0, 0, 0, 0.4) 50%, rgba(0, 0, 0, 0) 100%);
  -webkit-mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.8) 30%, rgba(0, 0, 0, 0.4) 50%, rgba(0, 0, 0, 0) 100%);
}

.main-content {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}

.content-left {
  min-width: 0;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 响应式布局 */
@media (max-width: 1024px) {
  .main-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 24px 16px;
  }
}
</style>
