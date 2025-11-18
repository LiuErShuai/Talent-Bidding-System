<template>
  <div class="results-center">
    <div class="page-header">
      <h1>结果公示与申诉中心</h1>
      <p>公示项目评审结果，处理申诉请求</p>
    </div>
    
    <div class="content-area">
      <div class="tabs">
        <button class="tab-btn active">结果公示</button>
        <button class="tab-btn">申诉处理</button>
        <button class="tab-btn">历史记录</button>
      </div>
      
      <div class="results-section">
        <h2>最新公示结果</h2>
        <div class="results-list">
          <div class="result-item">
            <div class="result-header">
              <h4>智能客服系统开发项目评审结果</h4>
              <span class="publish-date">2024-03-18</span>
            </div>
            <div class="result-content">
              <div class="result-details">
                <div class="detail">
                  <span class="label">中标团队：</span>
                  <span class="value">创新科技团队</span>
                </div>
                <div class="detail">
                  <span class="label">评审得分：</span>
                  <span class="value score">92.5</span>
                </div>
                <div class="detail">
                  <span class="label">公示期限：</span>
                  <span class="value">2024-03-18 至 2024-03-25</span>
                </div>
              </div>
              <div class="appeal-info">
                <span class="appeal-count">申诉数量：3</span>
                <button class="btn-primary">查看详情</button>
              </div>
            </div>
          </div>
          
          <div class="result-item">
            <div class="result-header">
              <h4>数据分析平台构建项目评审结果</h4>
              <span class="publish-date">2024-03-17</span>
            </div>
            <div class="result-content">
              <div class="result-details">
                <div class="detail">
                  <span class="label">中标团队：</span>
                  <span class="value">数据先锋团队</span>
                </div>
                <div class="detail">
                  <span class="label">评审得分：</span>
                  <span class="value score">88.0</span>
                </div>
                <div class="detail">
                  <span class="label">公示期限：</span>
                  <span class="value">2024-03-17 至 2024-03-24</span>
                </div>
              </div>
              <div class="appeal-info">
                <span class="appeal-count">申诉数量：1</span>
                <button class="btn-primary">查看详情</button>
              </div>
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
.results-center {
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

.results-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.results-section h2 {
  margin-bottom: 20px;
  color: #333;
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.result-item {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 20px;
  background: #fafafa;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.result-header h4 {
  margin: 0;
  color: #333;
}

.publish-date {
  color: #999;
  font-size: 14px;
}

.result-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.result-details {
  flex: 1;
}

.detail {
  display: flex;
  margin-bottom: 8px;
}

.detail .label {
  width: 100px;
  color: #666;
  font-weight: bold;
}

.detail .value {
  color: #333;
}

.detail .score {
  color: #52c41a;
  font-weight: bold;
}

.appeal-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.appeal-count {
  color: #fa8c16;
  font-weight: bold;
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