<template>
  <div class="message-container">
    <div class="message-header">
      <h2>消息中心</h2>
      <p>查看和管理您的所有消息</p>
    </div>
    
    <div class="message-content">
      <el-empty description="暂无消息" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

onMounted(() => {
  console.log('Message view mounted')
})
</script>

<style scoped>
.message-container {
  padding: 20px;
  height: 100%;
  background: #f5f5f5;
}

.message-header {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.message-header h2 {
  margin: 0 0 8px 0;
  color: #333;
}

.message-header p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.message-content {
  background: white;
  border-radius: 8px;
  padding: 40px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>