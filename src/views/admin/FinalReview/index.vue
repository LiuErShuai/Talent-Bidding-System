<template>
  <div class="final-review">
    <div class="page-header">
      <h1>项目发布与终审页面</h1>
      <p>对通过预审的项目进行最终审核和发布</p>
    </div>
    
    <div class="content-area">
      <div class="tabs">
        <button class="tab-btn active">待终审项目</button>
        <button class="tab-btn">已发布项目</button>
        <button class="tab-btn">审核历史</button>
      </div>
      
      <div class="review-section">
        <h2>待终审项目</h2>
        <div class="project-grid">
          <div class="project-card">
            <div class="project-header">
              <h4>智能客服系统开发</h4>
              <span class="status pending">待终审</span>
            </div>
            <p>项目描述：基于AI的智能客服系统，支持多轮对话...</p>
            <div class="project-meta">
              <span>申请人：张三</span>
              <span>预算：¥50,000</span>
            </div>
            <div class="actions">
              <button class="btn-primary">终审详情</button>
              <button class="btn-secondary">查看预审</button>
            </div>
          </div>
          
          <div class="project-card">
            <div class="project-header">
              <h4>数据分析平台构建</h4>
              <span class="status pending">待终审</span>
            </div>
            <p>项目描述：大数据分析平台，支持实时数据处理...</p>
            <div class="project-meta">
              <span>申请人：李四</span>
              <span>预算：¥80,000</span>
            </div>
            <div class="actions">
              <button class="btn-primary">终审详情</button>
              <button class="btn-secondary">查看预审</button>
            </div>
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
.final-review {
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

.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.tab-btn {
  background: none;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 4px 4px 0 0;
}

.tab-btn.active {
  background: #1890ff;
  color: white;
}

.review-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.review-section h2 {
  margin-bottom: 20px;
  color: #333;
}

.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.project-card {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 15px;
  background: #fafafa;
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.project-header h4 {
  margin: 0;
  color: #333;
}

.status {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
}

.status.pending {
  background: #fff7e6;
  color: #fa8c16;
}

.project-card p {
  color: #666;
  margin-bottom: 10px;
  font-size: 14px;
  line-height: 1.4;
}

.project-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  font-size: 12px;
  color: #999;
}

.actions {
  display: flex;
  gap: 10px;
}

.btn-primary {
  background: #1890ff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  flex: 1;
}

.btn-secondary {
  background: #f0f0f0;
  color: #666;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  flex: 1;
}

.btn-primary:hover {
  background: #40a9ff;
}

.btn-secondary:hover {
  background: #e6e6e6;
}
</style>