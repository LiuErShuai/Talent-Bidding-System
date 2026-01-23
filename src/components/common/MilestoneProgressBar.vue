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
      <!-- 状态标签（在圆点上方） -->
      <div class="node-status-tag" :class="`status-${milestone.status}`">
        {{ getStatusText(milestone.status) }}
      </div>

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

      <!-- 节点标签（标题和剩余时间） -->
      <div class="node-label">
        <div class="node-title">{{ milestone.title }}</div>
        <div class="node-time" :class="getRemainingTimeClass(milestone)">
          {{ getRemainingTime(milestone) }}
        </div>
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
  // 计算节点在可用区域内的百分比位置（0 到 1）
  const ratio = index / (totalNodes - 1)

  // 使用百分比计算，确保节点在进度线范围内
  // 进度线占据容器的中间部分（左右各留 40px）
  // 节点位置 = 左边距 + 比例 * 进度线宽度
  const percentage = ratio * 100
  return `calc(40px + ${percentage}% * (100% - 80px) / 100%)`
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

// 获取状态文本
const getStatusText = (status) => {
  const statusMap = {
    'completed': '已完成',
    'in-progress': '进行中',
    'pending': '待开始'
  }
  return statusMap[status] || ''
}

// 计算剩余时间
const getRemainingTime = (milestone) => {
  if (!milestone.endDate) return '--'
  if (milestone.status === 'completed') return '已完成'

  try {
    const endDate = new Date(milestone.endDate)
    const now = new Date()
    const diffTime = endDate - now
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      return `逾期${Math.abs(diffDays)}天`
    } else if (diffDays === 0) {
      return '今日截止'
    } else if (diffDays === 1) {
      return '明日截止'
    } else {
      return `剩${diffDays}天`
    }
  } catch {
    return '--'
  }
}

// 获取剩余时间样式类
const getRemainingTimeClass = (milestone) => {
  if (!milestone.endDate) return ''
  if (milestone.status === 'completed') return 'time-success'

  try {
    const endDate = new Date(milestone.endDate)
    const now = new Date()
    const diffTime = endDate - now
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return 'time-danger'
    if (diffDays <= 3) return 'time-warning'
    return ''
  } catch {
    return ''
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
  height: 100px;
  padding: 10px 0;
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
  max-width: calc(100% / var(--node-count, 4) - 10px);
}

.milestone-node:hover {
  transform: translate(-50%, -50%) scale(1.05);
}

/* 状态标签（在圆点上方） */
.node-status-tag {
  position: absolute;
  bottom: 48px;
  left: 50%;
  transform: translateX(-50%);
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
  pointer-events: none;
}

.status-completed {
  background: #f6ffed;
  color: #52c41a;
  border: 1px solid #b7eb8f;
}

.status-in-progress {
  background: #e6f4ff;
  color: #1890ff;
  border: 1px solid #91caff;
}

.status-pending {
  background: #f5f5f5;
  color: #8c8c8c;
  border: 1px solid #d9d9d9;
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

/* 节点标签（在圆点下方） */
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

.node-time {
  font-size: 11px;
  color: #9ca3af;
}

.time-danger {
  color: #ef4444;
  font-weight: 600;
}

.time-warning {
  color: #f59e0b;
  font-weight: 600;
}

.time-success {
  color: #10b981;
}

/* 当前节点高亮 */
.node-current .node-title {
  color: #1890ff;
}

.node-current .node-time {
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
    height: 110px;
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

  .node-status-tag {
    bottom: 42px;
    font-size: 10px;
    padding: 2px 6px;
  }

  .node-label {
    top: 42px;
  }

  .node-title {
    font-size: 11px;
  }

  .node-time {
    font-size: 10px;
  }
}
</style>
