<template>
  <div class="agreement-processing">
    <div class="page-header">
      <h1>协议签署与支付归档页面</h1>
      <p>管理项目协议签署、支付和文档归档流程</p>
    </div>
    
    <div class="content-area">
      <div class="process-steps">
        <div class="step active">
          <div class="step-number">1</div>
          <div class="step-info">
            <h4>协议准备</h4>
            <p>生成项目协议文档</p>
          </div>
        </div>
        <div class="step">
          <div class="step-number">2</div>
          <div class="step-info">
            <h4>协议签署</h4>
            <p>双方签署协议</p>
          </div>
        </div>
        <div class="step">
          <div class="step-number">3</div>
          <div class="step-info">
            <h4>支付处理</h4>
            <p>处理项目款项支付</p>
          </div>
        </div>
        <div class="step">
          <div class="step-number">4</div>
          <div class="step-info">
            <h4>归档完成</h4>
            <p>文档归档存储</p>
          </div>
        </div>
      </div>
      
      <div class="agreement-list">
        <h2>待处理协议</h2>
        <div class="agreement-item">
          <div class="agreement-info">
            <h4>智能客服系统开发项目协议</h4>
            <div class="agreement-details">
              <span>项目编号：PRJ-2024-001</span>
              <span>甲方：创新科技团队</span>
              <span>乙方：企业客户</span>
              <span>合同金额：¥50,000</span>
            </div>
            <div class="progress-status">
              <span class="status preparing">协议准备中</span>
              <div class="progress">
                <span>进度：25%</span>
                <div class="progress-bar">
                  <div class="progress-fill" style="width: 25%"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="agreement-actions">
            <button class="btn-primary">生成协议</button>
            <button class="btn-secondary">查看详情</button>
            <button class="btn-secondary">下载模板</button>
          </div>
        </div>
        
        <div class="agreement-item">
          <div class="agreement-info">
            <h4>数据分析平台构建项目协议</h4>
            <div class="agreement-details">
              <span>项目编号：PRJ-2024-002</span>
              <span>甲方：数据先锋团队</span>
              <span>乙方：企业客户</span>
              <span>合同金额：¥80,000</span>
            </div>
            <div class="progress-status">
              <span class="status signing">等待签署</span>
              <div class="progress">
                <span>进度：50%</span>
                <div class="progress-bar">
                  <div class="progress-fill" style="width: 50%"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="agreement-actions">
            <button class="btn-primary">发送签署</button>
            <button class="btn-secondary">查看协议</button>
            <button class="btn-secondary">催办提醒</button>
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
.agreement-processing {
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

.process-steps {
  display: flex;
  justify-content: space-between;
  margin-bottom: 40px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.step {
  display: flex;
  align-items: center;
  flex: 1;
  opacity: 0.5;
}

.step.active {
  opacity: 1;
}

.step-number {
  width: 30px;
  height: 30px;
  background: #1890ff;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  font-weight: bold;
}

.step-info h4 {
  margin: 0 0 5px 0;
  color: #333;
}

.step-info p {
  margin: 0;
  color: #666;
  font-size: 12px;
}

.agreement-list {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.agreement-list h2 {
  margin-bottom: 20px;
  color: #333;
}

.agreement-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
  margin-bottom: 15px;
  background: #fafafa;
}

.agreement-info h4 {
  margin: 0 0 15px 0;
  color: #333;
}

.agreement-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-bottom: 15px;
  color: #666;
  font-size: 14px;
}

.progress-status {
  display: flex;
  align-items: center;
  gap: 20px;
}

.status {
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: bold;
}

.status.preparing {
  background: #fff7e6;
  color: #fa8c16;
}

.status.signing {
  background: #e6f7ff;
  color: #1890ff;
}

.progress {
  display: flex;
  align-items: center;
  gap: 10px;
}

.progress-bar {
  width: 100px;
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

.agreement-actions {
  display: flex;
  flex-direction: column;
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