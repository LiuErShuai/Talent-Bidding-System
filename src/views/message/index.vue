<template>
  <div class="message-page">
    <div class="message-container">
      <div class="message-content">
        <el-empty description="暂无消息" />
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.message-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f7fb;
  color: #1f274b;
}

.message-container {
  padding: 24px;
  min-height: calc(100vh - 80px);
  background: #f5f7fa;
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

@media (max-width: 1024px) {
  .header-inner {
    flex-direction: column;
  }

  .main-nav {
    flex-wrap: wrap;
  }
}
</style>
