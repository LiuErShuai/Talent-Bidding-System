<template>
  <div class="admin-layout">
    <!-- 左侧导航 -->
    <AdminSidebar />

    <!-- 右侧主体 -->
    <section class="main-content">
      <h1 class="page-title">预审管理</h1>

      <!-- 示例表格：待预审项目列表 -->
      <el-table
        :data="projects"
        style="width: 100%"
        stripe
        border
        v-loading="loading"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="项目名称" />
        <el-table-column prop="status" label="状态" width="120" />
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleReview(row)">审核</el-button>
          </template>
        </el-table-column>
      </el-table>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import AdminSidebar from '@/components/layout/AdminSidebar.vue';
import type { Project } from '@/types'; // 根据项目自行补充类型定义

// 项目列表数据
const projects = ref<Project[]>([]);
const loading = ref(false);

async function fetchProjects() {
  loading.value = true;
  try {
    // 这里使用统一的请求封装，请自行确认路径和方法名
    const { data } = await import('@/api/project').then(m => m.getPreReviewList());
    projects.value = data;
  } catch (e) {
    console.error(e);
    ElMessage.error('获取待预审项目失败');
  } finally {
    loading.value = false;
  }
}

function handleReview(row: Project) {
  // 简单示例：可以跳转到具体审核页面或弹出对话框
  ElMessage.success(`点击审核项目 ${row.name}`);
  // 示例路由跳转（若存在相应路由）
  // router.push(`/admin/pre-review/${row.id}`);
}

onMounted(() => {
  fetchProjects();
});
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  padding: 24px;
  background-color: #fff;
}

.page-title {
  margin: 0 0 20px;
  font-size: 20px;
  color: #333;
}

/* 表格背景使用淡色，保持简约 */
.el-table {
  background-color: #fafafa;
}
</style>
