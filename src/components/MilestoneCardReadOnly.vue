<template>
  <div class="milestone-card-readonly">
    <div class="milestone-title-row">
      <h4 class="milestone-title">{{ milestone.title }}</h4>
      <el-tag size="small" :type="tagType">{{ statusText }}</el-tag>
    </div>
    <div class="milestone-meta">
      <span class="planned"><el-icon><Calendar /></el-icon> {{ milestone.plannedDate }}</span>
      <span v-if="milestone.actualDate" class="actual">实际：{{ milestone.actualDate }}</span>
    </div>
    <div class="milestone-footer">
      <div class="progress-wrapper">
        <div class="progress-bar"><div class="progress-inner" :style="{ width: (milestone.progress || 0) + '%' }"></div></div>
        <span class="progress-text">{{ milestone.progress || 0 }}%</span>
      </div>
      <div class="deliverables-count">交付物：{{ (milestone.deliverables && milestone.deliverables.length) || 0 }}</div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue'
const props = defineProps({ milestone: { type: Object, required: true } })
const statusText = computed(() => ({ 'completed': '已完成', 'in-progress': '进行中', 'pending': '待开始' }[props.milestone.status] || props.milestone.status))
const tagType = computed(() => props.milestone.status === 'completed' ? 'success' : (props.milestone.status === 'in-progress' ? 'info' : 'warning'))
</script>

<style scoped>
.milestone-card-readonly { background:#fff; padding:8px; border-radius:8px; min-height:90px; display:flex; flex-direction:column; gap:8px; box-shadow:0 2px 6px rgba(0,0,0,0.04); }
.milestone-title { margin:0; font-size:14px; font-weight:600; }
.milestone-meta { color:#6b7280; font-size:13px; display:flex; gap:12px; align-items:center; }
.progress-bar { height:8px; background:#f0f2f5; border-radius:4px; overflow:hidden; width:160px; margin-right:8px; }
.progress-inner { height:100%; background:#409eff; }
.milestone-footer { display:flex; justify-content:space-between; align-items:center; gap:12px; }
.deliverables-count { color:#606266; font-size:13px; }
</style>









