<template>
  <div class="campus-project-list">
    <div class="list-header">
      <h2 class="list-title">热门项目</h2>
      <router-link to="/projects" class="more-link">更多 ></router-link>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <div v-for="i in 4" :key="i" class="skeleton-card"></div>
    </div>

    <!-- 项目列表 -->
    <div v-else-if="projects.length" class="project-list">
      <div
        v-for="project in projects"
        :key="project.id"
        class="project-card"
        @click="goToDetail(project.id)"
      >
        <div class="card-row-1">
          <span class="project-title">{{ project.title }}</span>
          <span class="project-status" :class="project.status">
            {{ project.statusText }}
          </span>
        </div>
        <div class="card-row-2">
          <span class="project-info">发布方：{{ project.company }}</span>
          <span class="separator">|</span>
          <span class="project-info">领域：{{ project.field }}</span>
          <span class="separator">|</span>
          <span class="project-info">截止时间：{{ getDeadlineText(project.deadlineDays) }}</span>
          <span class="separator">|</span>
          <span class="project-reward">￥{{ project.reward.toLocaleString() }}</span>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="empty-state">
      <p>暂无热门项目</p>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

defineProps({
  projects: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const router = useRouter()

// 计算截止时间文本
function getDeadlineText(days) {
  if (days > 0) {
    return `${days}天后截止`
  } else if (days === 0) {
    return '今天截止'
  } else {
    return '已截止'
  }
}

// 跳转到项目详情
function goToDetail(id) {
  router.push(`/projects/${id}`)
}
</script>

<style scoped>
.campus-project-list {
  background: #ffffff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 0;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.list-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f274b;
  margin: 0;
}

.more-link {
  font-size: 14px;
  color: #2563eb;
  text-decoration: none;
}

.more-link:hover {
  text-decoration: underline;
}

.project-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.project-card {
  padding: 12px 16px;
  background: #ffffff;
  border: 1px solid #edf1fb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.project-card:hover {
  border-color: #2563eb;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.1);
}

.card-row-1 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.project-title {
  font-size: 14px;
  font-weight: 600;
  color: #1f274b;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 12px;
}

.project-card:hover .project-title {
  color: #2563eb;
}

.project-status {
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 11px;
  background: #ffffff;
  border: 1px solid;
  flex-shrink: 0;
}

.project-status.pending {
  color: #d97706;
  border-color: #d97706;
}

.project-status.ongoing {
  color: #2563eb;
  border-color: #2563eb;
}

.project-status.completed {
  color: #16a34a;
  border-color: #16a34a;
}

.card-row-2 {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #7b859f;
  flex-wrap: wrap;
}

.project-info {
  color: #7b859f;
}

.project-reward {
  color: #7b859f;
}

.separator {
  color: #d1d5db;
}

/* 加载骨架屏 */
.loading-state {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton-card {
  height: 60px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 40px 0;
  color: #9ca3af;
}
</style>
