<template>
  <div class="my-projects-card">
    <div class="card-header">
      <h2 class="card-title">我的项目</h2>
      <router-link to="/my-projects" class="more-link">我的项目 ></router-link>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <div v-for="i in 2" :key="i" class="skeleton-item"></div>
    </div>

    <!-- 项目列表 -->
    <div v-else-if="projects.length" class="projects-list">
      <div
        v-for="project in projects"
        :key="project.id"
        class="project-item"
        @click="goToDetail(project.id)"
      >
        <div class="project-info">
          <span class="project-title">{{ project.title }}</span>
          <span class="project-status" :class="project.status">
            {{ project.statusText }}
          </span>
        </div>
        <div class="project-meta">
          <span class="project-publisher">发布方：{{ project.publisher }}</span>
          <span class="separator">|</span>
          <span class="project-field">领域：{{ project.field }}</span>
          <span class="separator">|</span>
          <span class="project-deadline">截止时间：{{ getDeadlineText(project.deadlineDays) }}</span>
          <span class="separator">|</span>
          <span class="project-milestone">当前里程碑：{{ project.currentMilestone }}</span>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="empty-state">
      <p>暂无项目</p>
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
  router.push(`/my-projects/${id}`)
}
</script>

<style scoped>
.my-projects-card {
  background: #ffffff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 16px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f274b;
  margin: 0;
}

.more-link {
  font-size: 12px;
  color: #2563eb;
  text-decoration: none;
}

.more-link:hover {
  text-decoration: underline;
}

.projects-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.project-item {
  padding: 12px 16px;
  background: #ffffff;
  border: 1px solid #edf1fb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.project-item:hover {
  border-color: #2563eb;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.1);
}

.project-info {
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

.project-item:hover .project-title {
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

.project-status.ongoing {
  color: #2563eb;
  border-color: #2563eb;
}

.project-status.completed {
  color: #16a34a;
  border-color: #16a34a;
}

.project-status.pending {
  color: #d97706;
  border-color: #d97706;
}

.project-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #7b859f;
  flex-wrap: wrap;
}

.project-publisher {
  color: #7b859f;
}

.project-field {
  color: #7b859f;
}

.project-deadline {
  color: #7b859f;
}

.project-milestone {
  color: #7b859f;
}

.separator {
  color: #d1d5db;
}

/* 加载骨架屏 */
.loading-state {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skeleton-item {
  height: 72px;
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
  padding: 20px 0;
  color: #9ca3af;
  font-size: 14px;
}
</style>
