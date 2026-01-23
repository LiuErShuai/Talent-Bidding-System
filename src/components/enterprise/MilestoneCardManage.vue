<template>
  <el-card class="milestone-card-manage" shadow="hover">
    <div class="title-row">
      <div class="title-left">
        <h4 class="title">{{ milestone.title }}</h4>
        <el-tag size="small" :type="tagType">{{ statusText }}</el-tag>
      </div>
      <div class="title-actions">
        <el-button v-if="canEdit" type="text" size="small" @click="onEdit">编辑</el-button>
        <el-button v-if="canEdit" type="text" size="small" @click="onDelete">删除</el-button>
        <el-button v-if="canReview && milestone.status !== 'completed'" type="primary" size="small" @click="onReview">审核</el-button>
        <el-button type="text" size="small" @click="viewDeliverables">查看交付物</el-button>
      </div>
    </div>
    <div class="meta-row">
      <span class="planned"><i class="el-icon-date"></i> {{ milestone.plannedDate }}</span>
      <span v-if="milestone.actualDate" class="actual">实际：{{ milestone.actualDate }}</span>
    </div>
    <div class="desc">{{ milestone.description }}</div>
  </el-card>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue'
const props = defineProps({
  milestone: { type: Object, required: true },
  canEdit: { type: Boolean, default: false },
  canReview: { type: Boolean, default: false }
})
const emit = defineEmits(['edit','delete','review','viewDeliverables'])

const statusText = computed(() => {
  return { 'completed': '已完成', 'in-progress': '进行中', 'pending': '待开始' }[props.milestone.status] || props.milestone.status
})
const tagType = computed(() => props.milestone.status === 'completed' ? 'success' : (props.milestone.status === 'in-progress' ? 'info' : 'warning'))

function onEdit() { emit('edit', props.milestone) }
function onDelete() { emit('delete', props.milestone.id) }
function onReview() { emit('review', { milestoneId: props.milestone.id, action: 'approved' }) }
function viewDeliverables() { emit('viewDeliverables', props.milestone.id) }
</script>

<style scoped>
.milestone-card-manage { padding:12px; }
.title-row { display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; }
.title-left { display:flex; gap:8px; align-items:center; }
.title { margin:0; font-size:16px; }
.meta-row { color:#6b7280; font-size:13px; margin-bottom:8px; display:flex; gap:12px; }
.desc { color:#4b5563; }
</style>


