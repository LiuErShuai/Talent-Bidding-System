<template>
  <article class="project-card-compact" @click="onView">
    <div class="project-card-main">
      <div class="project-card-header">
        <h3 class="project-name">{{ project.name }}</h3>
        <span class="project-tag" :class="project.status">{{ project.statusText }}</span>
      </div>
      <div class="project-meta-row">
        <span>状态：{{ project.stageText }}</span>
        <span>进度：{{ project.progress }}%</span>
        <span>剩余：{{ project.remainDays }}天</span>
        <span>奖金：￥{{ project.reward?.toLocaleString() }}</span>
      </div>
      <p class="project-brief">{{ project.brief }}</p>
    </div>
  </article>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
const props = defineProps({ project: { type: Object, required: true } })
const emit = defineEmits(['view'])
function onView() { emit('view', props.project.id) }
</script>

<style scoped>
.project-card-compact { background:#fff; border-radius:8px; padding:12px; box-shadow:0 2px 8px rgba(0,0,0,0.06); cursor:pointer; }
.project-card-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; }
.project-name { margin:0; font-size:16px; font-weight:600; }
.project-meta-row { display:flex; gap:12px; font-size:13px; color:#6b7280; margin-bottom:8px; flex-wrap:wrap; }
.project-brief { margin:0; color:#4b5563; font-size:13px; }
</style>





