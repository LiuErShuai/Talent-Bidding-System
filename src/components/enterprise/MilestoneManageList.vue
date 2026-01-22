<template>
  <div class="milestone-manage-list">
    <div class="list-header">
      <h3>里程碑看板</h3>
      <el-button type="primary" size="small" @click="openCreate">新建里程碑</el-button>
    </div>
    <div class="milestone-list">
      <MilestoneCardManage
        v-for="m in milestones"
        :key="m.id"
        :milestone="m"
        :canEdit="canEdit"
        :canReview="canReview"
        @edit="$emit('edit', $event)"
        @review="$emit('review', $event)"
      />
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'
import MilestoneCardManage from './MilestoneCardManage.vue'
const props = defineProps({
  milestones: { type: Array, default: () => [] },
  canEdit: { type: Boolean, default: false },
  canReview: { type: Boolean, default: false }
})
function openCreate() {
  // placeholder: open create modal
  console.log('open create milestone')
}
</script>

<style scoped>
.milestone-manage-list { background:#fff; padding:12px; border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.04); }
.list-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; }
.milestone-list { display:flex; flex-direction:column; gap:12px; }
</style>


