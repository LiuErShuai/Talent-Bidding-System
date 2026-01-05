<template>
  <div class="milestone-timeline">
    <div
      v-for="(milestone, index) in milestones"
      :key="milestone.id"
      class="timeline-item"
      :class="getItemClass(milestone, index)"
    >

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
  padding: 20px 0;
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


/* 响应式 */
@media (max-width: 768px) {
  .milestone-timeline {
    padding: 20px 10px;  /* 移动端适当减少padding */
  }
}
</style>
