<template>
  <div class="campus-activities">
    <div class="card-header">
      <div class="header-line"></div>
      <h3 class="card-title">最新动态</h3>
      <div class="header-line"></div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <div v-for="i in 4" :key="i" class="skeleton-item"></div>
    </div>

    <!-- 动态列表 -->
    <div v-else-if="activities.length" class="activities-list">
      <div
        v-for="item in activities"
        :key="item.id"
        class="activity-item"
      >
        <div class="activity-content">
          <span class="activity-team">{{ item.teamName }}</span>
          完成了
          <span class="activity-milestone">{{ item.milestone }}</span>
          里程碑节点
        </div>
        <div class="activity-time">{{ item.time }}</div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="empty-state">
      <p>暂无最新动态</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  activities: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.campus-activities {
  background: #ffffff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
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

.activities-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.activity-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f3f4f6;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-content {
  flex: 1;
  font-size: 14px;
  color: #374151;
  line-height: 1.4;
}

.activity-team {
  color: #2563eb;
  font-weight: 500;
}

.activity-milestone {
  color: #059669;
  font-weight: 500;
}

.activity-time {
  font-size: 12px;
  color: #9ca3af;
  flex-shrink: 0;
  margin-left: 8px;
}

/* 加载骨架屏 */
.loading-state {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton-item {
  height: 20px;
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
