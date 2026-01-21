<template>
  <div class="milestone-progress-bar">
    <!-- 进度条背景线 -->
    <div class="progress-line">
      <!-- 已完成部分的进度线 -->
      <div class="progress-line-active" :style="{ width: progressWidth }"></div>
    </div>

    <!-- 里程碑节点 -->
    <div
      v-for="(milestone, index) in milestones"
      :key="milestone.id"
      class="milestone-node"
      :class="[
        `node-${milestone.status}`,
        { 'node-current': milestone.status === 'in-progress' }
      ]"
      :style="{ left: getNodePosition(index) }"
      @click="handleNodeClick(milestone)"
    >
      <!-- 节点圆点 -->
      <div class="node-dot">
        <el-icon v-if="milestone.status === 'completed'" class="node-icon">
          <Check />
        </el-icon>
        <span v-else-if="milestone.status === 'in-progress'" class="node-number">
          {{ index + 1 }}
        </span>
        <span v-else class="node-number">{{ index + 1 }}</span>
      </div>

      <!-- 节点标签 -->
      <div class="node-label">
        <div class="node-title">{{ milestone.title }}</div>
        <div class="node-date">{{ formatDate(milestone.endDate) }}</div>
      </div>

      <!-- 当前进行中的脉动效果 -->
      <div v-if="milestone.status === 'in-progress'" class="node-pulse"></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Check } from '@element-plus/icons-vue'

const props = defineProps({
  milestones: {
    type: Array,
    required: true,
    default: () => []
  }
})

const emit = defineEmits(['nodeClick'])

// 计算整体进度百分比
const progressWidth = computed(() => {
  if (!props.milestones || props.milestones.length === 0) return '0%'

  const completedCount = props.milestones.filter(m => m.status === 'completed').length
  const totalCount = props.milestones.length

  // 如果有进行中的，进度到该节点的一半
  const inProgressIndex = props.milestones.findIndex(m => m.status === 'in-progress')
  if (inProgressIndex !== -1) {
    const percentage = ((completedCount + 0.5) / totalCount) * 100
    return `${percentage}%`
  }

  const percentage = (completedCount / totalCount) * 100
  return `${percentage}%`
})

// 计算节点位置
const getNodePosition = (index) => {
  const totalNodes = props.milestones.length
  if (totalNodes <= 1) return '50%'

  // 均匀分布节点，首尾留出边距
  // 节点在可用区域内均匀分布（0% 到 100%）
  const percentage = (index / (totalNodes - 1)) * 100

  // 使用 calc 计算实际位置：40px起始 + 百分比 * 可用宽度
  return `calc(40px + (100% - 80px) * ${percentage / 100})`
}

// 格式化日期
const formatDate = (dateStr) => {
  if (!dateStr) return ''

  try {
    const date = new Date(dateStr)
    const month = date.getMonth() + 1
    const day = date.getDate()
    return `${month}/${day}`
  } catch {
    return dateStr
  }
}

// 节点点击事件
const handleNodeClick = (milestone) => {
  emit('nodeClick', milestone)
}
</script>

<style scoped>
.milestone-progress-bar {
  position: relative;
  width: 100%;
  height: 80px;
  padding: 10px 40px; /* 左右留出边距，避免节点超出 */
}

/* 进度条背景线 */
.progress-line {
  position: absolute;
  top: 50%;
  left: 40px;
  right: 40px;
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  transform: translateY(-50%);
}

/* 已完成部分的进度线 */
.progress-line-active {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(90deg, #1890ff 0%, #52c41a 100%);
  border-radius: 2px;
  transition: width 0.6s ease;
}

/* 里程碑节点 */
.milestone-node {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  cursor: pointer;
  z-index: 2;
  transition: all 0.3s ease;
}

.milestone-node:hover {
  transform: translate(-50%, -50%) scale(1.1);
}

/* 节点圆点 */
.node-dot {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
  position: relative;
  z-index: 3;
}

/* 待开始状态 */
.node-pending .node-dot {
  background: #fff;
  border: 3px solid #d1d5db;
  color: #9ca3af;
}

.node-pending:hover .node-dot {
  border-color: #9ca3af;
  box-shadow: 0 0 0 4px rgba(156, 163, 175, 0.1);
}

/* 进行中状态 */
.node-in-progress .node-dot {
  background: #1890ff;
  border: 3px solid #1890ff;
  color: #fff;
  box-shadow: 0 0 0 4px rgba(24, 144, 255, 0.2);
}

.node-in-progress:hover .node-dot {
  box-shadow: 0 0 0 6px rgba(24, 144, 255, 0.3);
}

/* 已完成状态 */
.node-completed .node-dot {
  background: #52c41a;
  border: 3px solid #52c41a;
  color: #fff;
}

.node-completed:hover .node-dot {
  box-shadow: 0 0 0 4px rgba(82, 196, 26, 0.2);
}

/* 节点图标 */
.node-icon {
  font-size: 18px;
}

.node-number {
  font-size: 14px;
}

/* 节点标签 */
.node-label {
  position: absolute;
  top: 48px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  white-space: nowrap;
  pointer-events: none;
}

.node-title {
  font-size: 12px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 2px;
}

.node-date {
  font-size: 11px;
  color: #9ca3af;
}

/* 当前节点高亮 */
.node-current .node-title {
  color: #1890ff;
}

.node-current .node-date {
  color: #1890ff;
}

/* 脉动效果 */
.node-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #1890ff;
  opacity: 0;
  animation: pulse-animation 2s ease-out infinite;
  z-index: 1;
}

@keyframes pulse-animation {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.6;
  }
  100% {
    transform: translate(-50%, -50%) scale(2);
    opacity: 0;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .milestone-progress-bar {
    height: 100px;
    padding: 10px 20px;
  }

  .progress-line {
    left: 20px;
    right: 20px;
  }

  .node-dot {
    width: 30px;
    height: 30px;
    font-size: 12px;
  }

  .node-icon {
    font-size: 14px;
  }

  .node-label {
    top: 42px;
  }

  .node-title {
    font-size: 11px;
  }

  .node-date {
    font-size: 10px;
  }
}
</style>
