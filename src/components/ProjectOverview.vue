<template>
  <el-card class="project-overview-card">
    <div class="overview-left">
      <h2 class="project-title">{{ project?.name || '项目名称' }}</h2>
      <div class="meta">
        <el-tag v-if="project" :type="project.status === 'ongoing' ? 'info' : project.status === 'completed' ? 'success' : 'warning'">{{ project?.statusText }}</el-tag>
        <span class="reward">奖金：￥{{ project?.reward?.toLocaleString() || '--' }}</span>
        <span class="progress">进度：{{ project?.progress || 0 }}%</span>
      </div>
      <p class="brief">{{ project?.brief }}</p>
    </div>
    <div class="overview-actions">
      <el-button v-if="canEdit" type="primary" size="small" @click="$emit('edit', project)">编辑</el-button>
      <el-button v-if="canEdit" type="text" size="small">邀请成员</el-button>
    </div>
  </el-card>
</template>

<script setup>
import { defineProps } from 'vue'
const props = defineProps({
  project: { type: Object, default: () => ({}) },
  canEdit: { type: Boolean, default: false }
})
</script>

<style scoped>
.project-overview-card { display:flex; justify-content:space-between; align-items:flex-start; padding:16px; }
.overview-left { max-width: 70%; }
.project-title { margin:0 0 8px; font-size:18px; }
.meta { display:flex; gap:12px; align-items:center; margin-bottom:8px; color:#6b7280; font-size:13px; }
.brief { margin:0; color:#4b5563; }
.overview-actions { display:flex; gap:8px; align-items:center; }
</style>



