<template>
  <div :class="['project-card', mode]" @click="handleClick">
    <div class="project-head">
      <h3 class="project-title">{{ project.title }}</h3>
      <StatusTag :status="project.status" size="small" />
    </div>
    <p class="project-desc">{{ project.description || '暂无描述' }}</p>
    <div class="project-meta">
      <div class="meta-item">
        <span class="meta-label">发布方</span>
        <span class="meta-value">{{ project.company || '未知' }}</span>
      </div>
      <div class="meta-item">
        <span class="meta-label">领域</span>
        <span class="meta-value">{{ project.field || '未分类' }}</span>
      </div>
    </div>
    <div class="project-footer">
      <div class="project-price">
        <span class="price-symbol">¥</span>
        <span class="price-value">{{ formatPrice(project.price) }}</span>
      </div>
      <div class="project-stats">
        <span class="stat-item">
          <el-icon><View /></el-icon>
          {{ project.views || 0 }}
        </span>
        <span class="stat-item">
          <el-icon><User /></el-icon>
          {{ project.applicants || 0 }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { View, User } from '@element-plus/icons-vue'
import StatusTag from '../StatusTag/index.vue'
import { formatMoney } from '@/utils/formatter'

const props = defineProps({
  project: {
    type: Object,
    required: true
  },
  mode: {
    type: String,
    default: 'card', // card, list
    validator: (value) => ['card', 'list'].includes(value)
  },
  clickable: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['click'])

const router = useRouter()

const formatPrice = (price) => {
  if (!price) return '0'
  return formatMoney(price).replace('¥', '').replace(',', '')
}

const handleClick = () => {
  if (!props.clickable) return
  if (props.project.id) {
    router.push(`/projects/${props.project.id}`)
  }
  emit('click', props.project)
}
</script>

<style scoped>
.project-card {
  border-radius: 20px;
  border: 1px solid #edf1fb;
  padding: 20px;
  background: linear-gradient(180deg, #ffffff, #f9fbff);
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.project-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 40px rgba(15, 39, 106, 0.12);
}

.project-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.project-title {
  flex: 1;
  font-size: 18px;
  font-weight: 600;
  color: #1f274b;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.project-desc {
  color: #5f6c8b;
  font-size: 14px;
  line-height: 1.6;
  min-height: 48px;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.project-meta {
  display: flex;
  gap: 16px;
  font-size: 13px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.meta-label {
  color: #9aa5c2;
}

.meta-value {
  color: #5a6486;
  font-weight: 500;
}

.project-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #f0f3fa;
}

.project-price {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.price-symbol {
  font-size: 16px;
  font-weight: 600;
  color: #0f2c85;
}

.price-value {
  font-size: 24px;
  font-weight: 700;
  color: #0f2c85;
}

.project-stats {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: #9aa5c2;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 列表模式 */
.project-card.list {
  flex-direction: row;
  align-items: center;
}

.project-card.list .project-head {
  flex-direction: column;
  align-items: flex-start;
}

.project-card.list .project-desc {
  min-height: auto;
}
</style>

