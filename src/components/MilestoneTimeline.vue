<template>
  <div class="milestone-timeline">
    <div
      v-for="(milestone, index) in milestones"
      :key="milestone.id"
      class="timeline-item"
      :class="getItemClass(milestone, index)"
    >
      <!-- 时间轴连接线 -->
      <div
        v-if="index < milestones.length - 1"
        class="timeline-connector"
        :class="getConnectorClass(milestone)"
      ></div>

      <!-- 里程碑标记点 -->
      <div class="timeline-marker" :class="getMarkerClass(milestone)">
        <!-- 已完成：打勾图标 -->
        <el-icon v-if="milestone.status === 'completed'">
          <CircleCheck />
        </el-icon>
        <!-- 进行中：脉冲圆点（无需额外嵌套） -->
        <div v-else-if="milestone.status === 'in-progress'" class="pulse-dot"></div>
        <!-- 待开始/逾期：通过 CSS ::after 伪元素实现 -->
      </div>

      <!-- 里程碑卡片 -->
      <milestone-card-contractor
        :milestone="milestone"
        :default-expanded="milestone.status === 'in-progress'"
        :next-milestone="getNextMilestone(index)"
        @upload="handleUpload"
        @viewSubmission="handleViewSubmission"
        @downloadSubmission="handleDownloadSubmission"
        @guideAction="handleGuideAction"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { CircleCheck } from '@element-plus/icons-vue'
import MilestoneCardContractor from './MilestoneCardContractor.vue'

const props = defineProps({
  milestones: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['upload', 'viewSubmission', 'downloadSubmission', 'guideAction'])

// 获取时间线项目样式类
function getItemClass(milestone, index) {
  const classes = [`timeline-item-${milestone.status}`]

  // 为当前里程碑添加特殊类
  if (milestone.status === 'in-progress') {
    classes.push('timeline-item-current')
  }

  return classes
}

// 获取连接线样式类
function getConnectorClass(milestone) {
  if (milestone.status === 'completed') {
    return 'connector-completed'
  }
  if (milestone.status === 'in-progress') {
    return 'connector-gradient'
  }
  return 'connector-pending'
}

// 获取标记点样式类
function getMarkerClass(milestone) {
  return `marker-${milestone.status}`
}

// 获取下一个里程碑名称
function getNextMilestone(currentIndex) {
  if (currentIndex < props.milestones.length - 1) {
    return props.milestones[currentIndex + 1].title
  }
  return ''
}

// 事件传递
function handleUpload(milestoneId) {
  emit('upload', milestoneId)
}

function handleViewSubmission(submission) {
  emit('viewSubmission', submission)
}

function handleDownloadSubmission(submission) {
  emit('downloadSubmission', submission)
}

function handleGuideAction(payload) {
  emit('guideAction', payload)
}
</script>

<style scoped>
.milestone-timeline {
  position: relative;
  padding: 20px 0 20px 40px;
}

/* 时间线项目 */
.timeline-item {
  position: relative;
  margin-bottom: 24px;
}

.timeline-item:last-child {
  margin-bottom: 0;
}

/* 当前里程碑突出显示 */
.timeline-item-current {
  z-index: 10;
}

/* 时间轴连接线 */
.timeline-connector {
  position: absolute;
  left: -28px;
  top: 32px;
  width: 4px;
  height: calc(100% + 24px);
  z-index: 1;
}

/* 已完成连接线：绿色实线 */
.connector-completed {
  background: #52c41a;
}

/* 进行中连接线：渐变色（从绿色到蓝色） */
.connector-gradient {
  background: linear-gradient(to bottom, #52c41a 0%, #1890ff 50%, #d9d9d9 100%);
}

/* 待开始连接线：灰色虚线 */
.connector-pending {
  background: repeating-linear-gradient(
    0deg,
    #d9d9d9,
    #d9d9d9 4px,
    transparent 4px,
    transparent 8px
  );
}

/* 时间轴标记点 */
.timeline-marker {
  position: absolute;
  left: -26px;  /* 连接线中心位置 */
  top: 12px;
  z-index: 2;
}

/* 已完成标记：绿色打勾 */
.marker-completed .el-icon {
  font-size: 24px;
  color: #52c41a;
  background: #fff;
  border-radius: 50%;
  transform: translateX(-50%);
}

/* 进行中标记：蓝色脉冲圆点 */
.marker-in-progress .pulse-dot {
  width: 16px;
  height: 16px;
  background: #1890ff;
  border-radius: 50%;
  position: relative;
  transform: translateX(-50%);
  animation: pulse 1.5s ease-in-out infinite;
}

.marker-in-progress .pulse-dot::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 24px;
  height: 24px;
  background: rgba(24, 144, 255, 0.3);
  border-radius: 50%;
  animation: pulse-ring 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.8;
  }
}

@keyframes pulse-ring {
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

/* 待开始标记：灰色空心圆（使用伪元素） */
.marker-pending::after {
  content: '';
  display: block;
  width: 12px;
  height: 12px;
  background: #fff;
  border: 3px solid #d9d9d9;
  border-radius: 50%;
  transform: translateX(-50%);
}

/* 逾期标记：红色空心圆 */
.marker-delayed::after {
  border-color: #ff4d4f;
}

/* 响应式 */
@media (max-width: 768px) {
  .milestone-timeline {
    padding-left: 30px;
  }

  .timeline-marker {
    left: -23px;  /* 调整移动端位置 */
  }

  .timeline-connector {
    left: -25px;
  }
}
</style>
