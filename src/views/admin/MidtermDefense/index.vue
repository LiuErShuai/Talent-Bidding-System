<template>
  <div class="midterm-defense">
    <div class="page-header">
      <h1>中期答辩管理页面</h1>
      <p>管理项目中期答辩流程和评审</p>
    </div>
    
    <div class="content-area">
      <div class="filter-section">
        <div class="filter-group">
          <label>项目状态：</label>
          <select>
            <option>全部</option>
            <option>待答辩</option>
            <option>已安排</option>
            <option>已完成</option>
          </select>
        </div>
        <div class="filter-group">
          <label>时间范围：</label>
          <input type="date">
          <span>至</span>
          <input type="date">
        </div>
        <button class="btn-primary">筛选</button>
      </div>
      
      <div class="defense-list">
        <div class="defense-item">
          <div class="defense-info">
            <h4>智能客服系统开发 - 中期答辩</h4>
            <div class="defense-meta">
              <span>项目负责人：张三</span>
              <span>答辩时间：2024-03-20 14:00</span>
              <span>地点：会议室A</span>
            </div>
            <div class="progress">
              <span>项目进度：65%</span>
              <div class="progress-bar">
                <div class="progress-fill" style="width: 65%"></div>
              </div>
            </div>
          </div>
          <div class="defense-status">
            <span class="status scheduled">已安排</span>
            <div class="actions">
              <button class="btn-primary">答辩详情</button>
              <button class="btn-secondary">调整时间</button>
            </div>
          </div>
        </div>
        
        <div class="defense-item">
          <div class="defense-info">
            <h4>数据分析平台构建 - 中期答辩</h4>
            <div class="defense-meta">
              <span>项目负责人：李四</span>
              <span>答辩时间：待安排</span>
              <span>地点：待定</span>
            </div>
            <div class="progress">
              <span>项目进度：45%</span>
              <div class="progress-bar">
                <div class="progress-fill" style="width: 45%"></div>
              </div>
            </div>
          </div>
          <div class="defense-status">
            <span class="status pending">待安排</span>
            <div class="actions">
              <button class="btn-primary">安排答辩</button>
              <button class="btn-secondary">查看进度</button>
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
.midterm-defense {
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

.filter-section {
  display: flex;
  gap: 20px;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-group label {
  font-weight: bold;
  color: #333;
}

.filter-group select,
.filter-group input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.defense-list {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.defense-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.defense-item:last-child {
  border-bottom: none;
}

.defense-info h4 {
  margin: 0 0 15px 0;
  color: #333;
}

.defense-meta {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
  color: #666;
  font-size: 14px;
}

.progress {
  display: flex;
  align-items: center;
  gap: 10px;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #52c41a;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.defense-status {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.status {
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: bold;
}

.status.scheduled {
  background: #e6f7ff;
  color: #1890ff;
}

.status.pending {
  background: #fff7e6;
  color: #fa8c16;
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
}

.btn-secondary {
  background: #f0f0f0;
  color: #666;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary:hover {
  background: #40a9ff;
}

.btn-secondary:hover {
  background: #e6e6e6;
}
</style>