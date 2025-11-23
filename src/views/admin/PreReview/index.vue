<template>
  <div class="pre-review">
    <div class="page-header">
      <h1>立项预审工作台</h1>
      <p>对项目申请进行初步审核和评估</p>
    </div>
    
    <div class="content-area">
      <div class="stats-overview">
        <div class="stat-card">
          <h3>待审核项目</h3>
          <span class="number">12</span>
        </div>
        <div class="stat-card">
          <h3>已审核项目</h3>
          <span class="number">45</span>
        </div>
        <div class="stat-card">
          <h3>通过率</h3>
          <span class="number">78%</span>
        </div>
      </div>
      
      <div class="review-list">
        <h2>待审核项目列表</h2>
        <div class="project-item">
          <div class="project-info">
            <h4>智能客服系统开发</h4>
            <p>申请人：张三 | 申请时间：2024-03-15</p>
          </div>
          <div class="actions">
            <button class="btn-primary">审核详情</button>
          </div>
        </div>
        <div class="project-item">
          <div class="project-info">
            <h4>数据分析平台构建</h4>
            <p>申请人：李四 | 申请时间：2024-03-14</p>
          </div>
          <div class="actions">
            <button class="btn-primary">审核详情</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 页面逻辑待实现
</script>

<style scoped>
.pre-review {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 30px;
}

.page-header h1 {
  color: #333;
  margin-bottom: 10px;
}

.page-header p {
  color: #666;
  font-size: 16px;
}

.stats-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.stat-card h3 {
  color: #666;
  margin-bottom: 10px;
  font-size: 14px;
}

.stat-card .number {
  font-size: 24px;
  font-weight: bold;
  color: #1890ff;
}

.review-list {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.review-list h2 {
  margin-bottom: 20px;
  color: #333;
}

.project-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #eee;
}

.project-item:last-child {
  border-bottom: none;
}

.project-info h4 {
  margin: 0 0 5px 0;
  color: #333;
}

.project-info p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.btn-primary {
  background: #1890ff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary:hover {
  background: #40a9ff;
}
</style>