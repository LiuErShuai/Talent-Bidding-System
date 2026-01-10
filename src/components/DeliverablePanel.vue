<template>
  <el-card class="deliverable-panel">
    <div class="panel-header">
      <h4>交付物</h4>
    </div>
    <el-upload
      :action="uploadUrl"
      :data="uploadData"
      :headers="uploadHeaders"
      :on-success="onUploadSuccess"
      :on-error="onUploadError"
      :limit="5"
      :show-file-list="true"
    >
      <el-button size="small" type="primary">上传交付物</el-button>
    </el-upload>
    <div class="deliverable-list" v-if="deliverables.length">
      <div v-for="d in deliverables" :key="d.id" class="deliverable-item">
        <a :href="d.url" target="_blank">{{ d.name }}</a>
        <span class="status">{{ d.status }}</span>
      </div>
    </div>
    <div v-else class="empty">暂无交付物</div>
  </el-card>
</template>

<script setup>
import { ref, onMounted, defineProps, defineEmits } from 'vue'
import { getToken } from '@/utils/storage' // assume helper exists
const props = defineProps({ projectId: [String, Number] })
const emit = defineEmits(['uploaded'])
const uploadUrl = `/api/v1/projects/${props.projectId}/deliverables`
const uploadData = { projectId: props.projectId }
const uploadHeaders = { Authorization: `Bearer ${getToken() || ''}` }
const deliverables = ref([])

function onUploadSuccess(res, file) {
  emit('uploaded', res)
  fetchDeliverables()
  // show success
}
function onUploadError(err) {
  // show error
}
async function fetchDeliverables() {
  // placeholder: fetch deliverables list from API
  deliverables.value = []
}
onMounted(fetchDeliverables)
</script>

<style scoped>
.deliverable-panel { padding:12px; }
.deliverable-list { margin-top:12px; display:flex; flex-direction:column; gap:8px; }
.deliverable-item { display:flex; justify-content:space-between; align-items:center; }
.empty { color:#9aa5c2; margin-top:8px; }
</style>










