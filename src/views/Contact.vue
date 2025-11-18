<template>
  <div class="contact-page">
    <!-- 整个页面内容都在一个滚动容器中 -->
    <div class="page-content">
      <!-- 顶部banner -->
      <header class="page-header">
        <div class="header-content">
          <h1>联系我们</h1>
          <p>有问题需要帮助？我们随时为您服务</p>
        </div>
      </header>
      <section class="contact-section">
        <div class="container">
          <div class="contact-grid">
            <div class="contact-info">
              <h2>联系信息</h2>
              <div class="contact-items">
                <div class="contact-item">
                  <div class="contact-icon">📧</div>
                  <div class="contact-details">
                    <h3>邮箱</h3>
                    <p>contact@talent-bidding.com</p>
                    <span>工作时间：9:00-18:00</span>
                  </div>
                </div>
                <div class="contact-item">
                  <div class="contact-icon">📞</div>
                  <div class="contact-details">
                    <h3>电话</h3>
                    <p>400-123-4567</p>
                    <span>技术支持热线</span>
                  </div>
                </div>
                <div class="contact-item">
                  <div class="contact-icon">📍</div>
                  <div class="contact-details">
                    <h3>地址</h3>
                    <p>北京市海淀区中关村科技园</p>
                    <span>创业大厦A座10层</span>
                  </div>
                </div>
                <div class="contact-item">
                  <div class="contact-icon">🕒</div>
                  <div class="contact-details">
                    <h3>工作时间</h3>
                    <p>周一至周五 9:00-18:00</p>
                    <span>周末及节假日休息</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="contact-form-section">
              <h2>发送消息</h2>
              <form @submit.prevent="submitForm" class="contact-form">
                <div class="form-group">
                  <label for="name">姓名 *</label>
                  <input 
                    type="text" 
                    id="name" 
                    v-model="formData.name" 
                    placeholder="请输入您的姓名"
                    required
                  >
                </div>
                <div class="form-group">
                  <label for="email">邮箱 *</label>
                  <input 
                    type="email" 
                    id="email" 
                    v-model="formData.email" 
                    placeholder="请输入您的邮箱"
                    required
                  >
                </div>
                <div class="form-group">
                  <label for="subject">主题 *</label>
                  <select id="subject" v-model="formData.subject" required>
                    <option value="">请选择咨询主题</option>
                    <option value="project">项目咨询</option>
                    <option value="technical">技术支持</option>
                    <option value="cooperation">合作洽谈</option>
                    <option value="suggestion">意见建议</option>
                    <option value="other">其他问题</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="message">留言内容 *</label>
                  <textarea 
                    id="message" 
                    v-model="formData.message" 
                    placeholder="请详细描述您的问题或需求"
                    rows="5"
                    required
                  ></textarea>
                </div>
                <button type="submit" class="submit-btn" :disabled="isSubmitting">
                  {{ isSubmitting ? '发送中...' : '发送消息' }}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section class="faq-section">
        <div class="container">
          <h2>常见问题</h2>
          <div class="faq-grid">
            <div class="faq-item">
              <h3>如何注册成为平台用户？</h3>
              <p>点击首页右上角的"注册"按钮，填写基本信息即可完成注册。</p>
            </div>
            <div class="faq-item">
              <h3>项目揭榜需要什么条件？</h3>
              <p>需要实名认证并通过相关技能审核，具体条件因项目而异。</p>
            </div>
            <div class="faq-item">
              <h3>奖金如何发放？</h3>
              <p>项目完成后，奖金将通过平台担保的方式安全发放。</p>
            </div>
            <div class="faq-item">
              <h3>企业如何发布项目？</h3>
              <p>企业用户需通过企业认证后，在项目大厅发布项目需求。</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const formData = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const isSubmitting = ref(false)

const submitForm = async () => {
  isSubmitting.value = true
  
  // 模拟表单提交
  setTimeout(() => {
    alert('消息发送成功！我们将尽快回复您。')
    // 重置表单
    formData.value = {
      name: '',
      email: '',
      subject: '',
      message: ''
    }
    isSubmitting.value = false
  }, 2000)
}
</script>

<style scoped>
.contact-page {
  min-height: 100vh;
  background: #f5f7fb;
}

.page-header {
  background: linear-gradient(135deg, #1b51da, #2ee4ff);
  color: white;
  padding: 80px 0 60px;
  text-align: center;
}

.header-content h1 {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 16px;
}

.header-content p {
  font-size: 18px;
  opacity: 0.9;
}

.page-content {
  height: 100vh;
  overflow-y: auto;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.page-content::-webkit-scrollbar {
  display: none;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  margin-bottom: 80px;
}

.contact-info h2,
.contact-form-section h2 {
  font-size: 32px;
  color: #1f274b;
  margin-bottom: 32px;
}

.contact-items {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.contact-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 8px 25px rgba(15, 39, 106, 0.06);
}

.contact-icon {
  font-size: 24px;
  min-width: 40px;
}

.contact-details h3 {
  font-size: 18px;
  color: #1f274b;
  margin-bottom: 8px;
}

.contact-details p {
  font-size: 16px;
  color: #0c5fe7;
  font-weight: 600;
  margin-bottom: 4px;
}

.contact-details span {
  font-size: 14px;
  color: #9aa5c2;
}

.contact-form {
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(15, 39, 106, 0.08);
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #1f274b;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e6f2;
  border-radius: 12px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #0c5fe7;
}

.submit-btn {
  width: 100%;
  background: linear-gradient(120deg, #0c5fe7, #2fb7ff);
  color: white;
  border: none;
  padding: 16px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.faq-section {
  background: white;
  padding: 60px 0;
  border-radius: 20px;
}

.faq-section h2 {
  text-align: center;
  font-size: 32px;
  color: #1f274b;
  margin-bottom: 48px;
}

.faq-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 32px;
}

.faq-item {
  padding: 24px;
  border-left: 4px solid #0c5fe7;
  background: #f8faff;
  border-radius: 0 12px 12px 0;
}

.faq-item h3 {
  font-size: 18px;
  color: #1f274b;
  margin-bottom: 12px;
}

.faq-item p {
  color: #5a6486;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .contact-grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  
  .contact-form {
    padding: 24px;
  }
  
  .header-content h1 {
    font-size: 36px;
  }
  
  .faq-grid {
    grid-template-columns: 1fr;
  }
}
</style>
