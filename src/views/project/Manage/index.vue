<template>
  <div class="project-manage-root">
    <project-overview :project="project" :canEdit="canEdit" @edit="onProjectEdit" />
    <div class="manage-grid">
      <milestone-manage-list :milestones="milestones" :canEdit="canEdit" :canReview="canReview" @edit="openMilestoneEdit" @review="handleMilestoneReview" />
      <div class="side-panels">
        <deliverable-panel :projectId="project?.id" @uploaded="refreshMilestones" />
        <team-panel :members="project?.members" :canEdit="canEdit" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useProjectStore } from '@/store/modules/project'

const route = useRoute()
const projectId = route.params.id
const store = useProjectStore()
const project = ref(null)
const milestones = ref([])
const canEdit = ref(false)
const canReview = ref(false)

async function fetchManageData() {
  const res = await store.fetchProjectForManage(projectId)
  project.value = res.project
  milestones.value = res.milestones
  canEdit.value = store.isCurrentUserOwner(res.project)
  canReview.value = canEdit.value || store.isCurrentUserAdmin()
}

onMounted(fetchManageData)

function onProjectEdit(payload) {
  return store.updateProject(projectId, payload).then(fetchManageData)
}

function refreshMilestones() {
  return store.fetchProjectForManage(projectId).then(r => { milestones.value = r.milestones })
}

function openMilestoneEdit(milestone) {
  // placeholder: open modal (to be implemented)
  console.log('openMilestoneEdit', milestone)
}

function handleMilestoneReview(payload) {
  // placeholder: call store.updateMilestone
  return store.updateMilestone(payload.milestoneId, { status: payload.action, remark: payload.remark }).then(fetchManageData)
}
</script>

<style scoped>
.project-manage-root {
  padding: 16px;
  background: #f7f9fc;
}
.manage-grid {
  display: flex;
  gap: 16px;
  margin-top: 12px;
}
.side-panels {
  width: 320px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>


