<template>
  <div class="campus-latest-news">
    <div class="card-header">
      <div class="header-line"></div>
      <h3 class="card-title">最新发布</h3>
      <div class="header-line"></div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <div v-for="i in 4" :key="i" class="skeleton-item"></div>
    </div>

    <!-- 新闻列表 -->
    <div v-else-if="news.length" class="news-list">
      <div
        v-for="item in news"
        :key="item.id"
        class="news-item"
        @click="goToDetail(item.id)"
      >
        <div class="news-date">{{ item.date }}</div>
        <div class="news-content">
          <p class="news-text">{{ item.title }}</p>
          <span v-if="item.isNew" class="new-badge">NEW</span>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="empty-state">
      <p>暂无最新发布</p>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

defineProps({
  news: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const router = useRouter()

function goToDetail(id) {
  router.push(`/projects/${id}`)
}
</script>

<style scoped>
.campus-latest-news {
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  gap: 12px;
}

.header-line {
  width: 32px;
  height: 3px;
  background: #2563eb;
  border-radius: 2px;
}

.card-title {
  font-weight: 600;
  font-size: 16px;
  color: #1f274b;
  margin: 0;
}

.news-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.news-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding-bottom: 12px;
  border-bottom: 1px solid #f3f4f6;
  cursor: pointer;
  transition: background 0.2s;
}

.news-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.news-item:hover {
  background: #f9fafb;
  margin: 0 -12px;
  padding: 8px 12px;
  border-radius: 6px;
}

.news-date {
  color: #2563eb;
  font-weight: 600;
  font-size: 13px;
  white-space: nowrap;
  min-width: 36px;
}

.news-content {
  flex: 1;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  min-width: 0;
}

.news-text {
  font-size: 14px;
  color: #374151;
  margin: 0;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.news-item:hover .news-text {
  color: #2563eb;
}

.new-badge {
  background: #ef4444;
  color: #ffffff;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 600;
  flex-shrink: 0;
}

/* 加载骨架屏 */
.loading-state {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton-item {
  height: 24px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
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
  padding: 24px 0;
  color: #9ca3af;
  font-size: 14px;
}
</style>
