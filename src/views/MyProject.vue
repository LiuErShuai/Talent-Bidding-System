<template>
  <div class="myproject-container">
    <div class="page-header">
      <h1 class="page-title">我的项目</h1>
      <p class="page-subtitle">管理您参与的项目</p>
    </div>
    
    <div class="myproject-content">
      <el-tabs v-model="activeTab" type="card">
        <el-tab-pane label="我创建的" name="created">
          <el-table :data="createdProjects" style="width: 100%">
            <el-table-column prop="name" label="项目名称" />
            <el-table-column prop="status" label="状态" />
            <el-table-column prop="applicants" label="申请人数" />
            <el-table-column label="操作">
              <template #default>
                <el-button type="text">查看</el-button>
                <el-button type="text">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        
        <el-tab-pane label="我参与的" name="participated">
          <el-table :data="participatedProjects" style="width: 100%">
            <el-table-column prop="name" label="项目名称" />
            <el-table-column prop="status" label="状态" />
            <el-table-column prop="progress" label="进度" />
            <el-table-column label="操作">
              <template #default>
                <el-button type="text">进入项目</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const activeTab = ref('created')

const createdProjects = ref([
  { id: 1, name: '电商平台开发', status: '进行中', applicants: 15 },
  { id: 2, name: '智能客服系统', status: '待审核', applicants: 8 }
])

const participatedProjects = ref([
  { id: 3, name: '数据分析平台', status: '已完成', progress: '100%' },
  { id: 4, name: '移动应用开发', status: '进行中', progress: '60%' }
])
</script>

<style scoped>
.myproject-container {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;
}

.page-header {
  text-align: center;
  margin-bottom: 30px;
}

.myproject-content {
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>