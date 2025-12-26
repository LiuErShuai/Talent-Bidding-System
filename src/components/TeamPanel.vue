<template>
  <el-card class="team-panel">
    <h4>团队成员</h4>
    <div v-if="members && members.length" class="members-list">
      <div v-for="m in members" :key="m.id" class="member-item">
        <img :src="m.avatar" alt="avatar" class="avatar" />
        <div class="info">
          <div class="name">{{ m.name }}</div>
          <div class="role">{{ m.role }}</div>
        </div>
      </div>
    </div>
    <div v-else class="empty">暂无成员</div>
  </el-card>
</template>

<script setup>
import { defineProps } from 'vue'
const props = defineProps({ members: { type: Array, default: () => [] }, canEdit: { type: Boolean, default: false } })
</script>

<style scoped>
.team-panel { padding:12px; }
.members-list { display:flex; flex-direction:column; gap:8px; }
.member-item { display:flex; gap:8px; align-items:center; }
.avatar { width:36px; height:36px; border-radius:50%; object-fit:cover; }
.info .name { font-weight:600; }
.info .role { color:#6b7280; font-size:12px; }
.empty { color:#9aa5c2; }
</style>


