<template>
    <div v-if="members && members.length" class="members-list">
      <div v-for="m in members" :key="m.id" class="member-item">
        <img :src="m.avatar" alt="avatar" class="avatar" />
        <div class="info">
          <div class="name">{{ m.name }}</div>
          <div class="role">{{ m.role }}</div>
        </div>
      </div>
    </div>
    <div v-else class="empty">暂无成员</div>
</template>

<script setup>
import { defineProps } from 'vue'
const props = defineProps({ members: { type: Array, default: () => [] }, canEdit: { type: Boolean, default: false } })
</script>

<style scoped>
.members-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.member-item {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 8px 12px;
  border-radius: 6px;
  background: #f8fafc;
  transition: background-color 0.2s;
}

.member-item:hover {
  background: #e2e8f0;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.info .name {
  font-weight: 600;
  font-size: 14px;
  color: #1f2937;
}

.info .role {
  color: #6b7280;
  font-size: 12px;
}

.empty {
  color: #9aa5c2;
  text-align: center;
  padding: 20px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .members-list {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }
}
</style>



