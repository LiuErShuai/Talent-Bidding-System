<template>
  <div class="next-step-guide">
    <div class="guide-header">
      <el-icon class="guide-icon"><Guide /></el-icon>
      <span class="guide-label">下一步：</span>
    </div>

    <!-- 场景1: 需要上传交付物 -->
    <div v-if="needUpload" class="guide-content">
      <span class="guide-text">请上传 <strong>{{ pendingDeliverables }}</strong></span>
      <el-button type="primary" size="small" @click="$emit('action', 'upload')">
        <el-icon><UploadFilled /></el-icon>
        立即上传
      </el-button>
    </div>

    <!-- 场景2: 已提交待审核 -->
    <div v-else-if="hasPending" class="guide-content">
      <el-alert type="info" :closable="false" show-icon>
        <template #title>交付物已提交，等待企业审核...</template>
      </el-alert>
    </div>

    <!-- 场景3: 被驳回需要修改 -->
    <div v-else-if="hasRejected" class="guide-content">
      <el-alert type="warning" :closable="false" show-icon>
        <template #title>审核未通过，请根据反馈修改后重新提交</template>
        <p class="alert-desc">{{ rejectedFeedback }}</p>
      </el-alert>
      <el-button type="warning" size="small" @click="$emit('action', 'view-feedback')">
        <el-icon><Warning /></el-icon>
        查看反馈
      </el-button>
    </div>

    <!-- 场景4: 已完成 -->
    <div v-else-if="isCompleted" class="guide-content">
      <el-alert type="success" :closable="false" show-icon>
        <template #title>
          本里程碑已完成！
          <span v-if="nextMilestone">下一里程碑：{{ nextMilestone }}</span>
        </template>
      </el-alert>
      <el-button
        v-if="nextMilestone"
        type="success"
        size="small"
        @click="$emit('action', 'next')"
      >
        <el-icon><ArrowRight /></el-icon>
        查看下一里程碑
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  Guide,
  UploadFilled,
  Warning,
  ArrowRight
} from '@element-plus/icons-vue'

const props = defineProps({
  milestone: {
    type: Object,
    required: true
  },
  nextMilestone: {
    type: String,
    default: ''
  }
})

defineEmits(['action'])

// 判断是否需要上传交付物
const needUpload = computed(() => {
  const submissions = props.milestone.submissions || []
  const deliverables = props.milestone.deliverables || []

  // 获取已提交的交付物ID（只考虑待审核或已通过的）
  const submittedDeliverableIds = submissions
    .filter(s => s.status === 'pending' || s.status === 'approved')
    .map(s => s.deliverableId)

  // 检查是否还有未提交的交付物
  return deliverables.some(d => !submittedDeliverableIds.includes(d.id))
})

// 判断是否有待审核的提交
const hasPending = computed(() => {
  return props.milestone.submissions?.some(s => s.status === 'pending') || false
})

// 判断是否有被驳回的提交
const hasRejected = computed(() => {
  return props.milestone.submissions?.some(s => s.status === 'rejected') || false
})

// 判断里程碑是否已完成
const isCompleted = computed(() => {
  return props.milestone.status === 'completed'
})

// 计算待上传的交付物名称
const pendingDeliverables = computed(() => {
  const submissions = props.milestone.submissions || []
  const deliverables = props.milestone.deliverables || []

  const submittedDeliverableIds = submissions
    .filter(s => s.status === 'pending' || s.status === 'approved')
    .map(s => s.deliverableId)

  const pending = deliverables.filter(d => !submittedDeliverableIds.includes(d.id))
  return pending.map(d => d.name).join('、')
})

// 获取被驳回的反馈
const rejectedFeedback = computed(() => {
  const rejected = props.milestone.submissions?.find(s => s.status === 'rejected')
  return rejected?.reviewResult?.comment || '请查看详细反馈'
})
</script>

<style scoped>
.next-step-guide {
  margin-top: 16px;
  padding: 16px;
  background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
  border-radius: 12px;
  border-left: 4px solid #1890ff;
}

.guide-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.guide-icon {
  font-size: 20px;
  color: #1890ff;
}

.guide-label {
  font-size: 14px;
  font-weight: 600;
  color: #1f274b;
}

.guide-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.guide-text {
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
}

.guide-text strong {
  color: #1890ff;
  font-weight: 600;
}

.guide-content .el-button {
  align-self: flex-start;
}

.alert-desc {
  margin-top: 8px;
  font-size: 13px;
  color: #606266;
  line-height: 1.6;
}

/* Alert样式覆盖 */
.guide-content :deep(.el-alert) {
  padding: 12px;
  border-radius: 8px;
}

.guide-content :deep(.el-alert__title) {
  font-size: 14px;
  font-weight: 500;
}

/* 响应式 */
@media (max-width: 768px) {
  .next-step-guide {
    padding: 12px;
  }

  .guide-header {
    margin-bottom: 8px;
  }

  .guide-content {
    gap: 8px;
  }

  .guide-content .el-button {
    width: 100%;
  }
}
</style>
