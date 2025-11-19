<template>
  <div class="project-details-container">
    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 双栏布局 -->
      <div class="content-row">
        <!-- 左侧：项目主要信息区 -->
        <div class="main-info-section">
          <div class="project-header">
            <div class="project-header-left">
              <el-tag class="status-tag" type="success">揭榜中</el-tag>
              <h1 class="project-title">AI智能客服系统</h1>
            </div>
            <button class="back-project-btn" @click="goBackToHall">返回大厅</button>
          </div>
          
          <div class="publisher-info">
            <span class="publisher">发布方：XX科技有限公司</span>
            <div class="rating">
              <el-rate v-model="project.rating" disabled show-score text-color="#ff9900" />
              <span class="rating-text">4.5分 (28条评价)</span>
            </div>
          </div>
          
          <!-- 项目基本信息卡片 -->
          <div class="basic-info-card">
            <div class="info-row">
              <div class="info-item">
                <span class="label">悬赏金额</span>
                <span class="value price">￥15,000</span>
              </div>
              <div class="info-item">
                <span class="label">项目领域</span>
                <span class="value">人工智能</span>
              </div>
            </div>
            
            <div class="info-row">
              <div class="info-item">
                <span class="label">揭榜模式</span>
                <span class="value">团队悬赏</span>
              </div>
              <div class="info-item">
                <span class="label">需求人数</span>
                <span class="value">2-4人</span>
              </div>
            </div>
            
            <div class="info-row">
              <div class="info-item">
                <span class="label">项目周期</span>
                <span class="value">60天</span>
              </div>
              <div class="info-item">
                <span class="label">发布时间</span>
                <span class="value">2025-11-01</span>
              </div>
            </div>
            
            <div class="info-row">
              <div class="info-item">
                <span class="label">截止时间</span>
                <span class="value">2025-11-15</span>
              </div>
              <div class="info-item">
                <span class="label">剩余时间</span>
                <span class="value time-left">⏰ 7天</span>
              </div>
            </div>
            
            <div class="info-row">
              <div class="info-item">
                <span class="label">已揭榜数</span>
                <span class="value">12人</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 右侧：操作区 -->
        <div class="action-section">
      <div class="action-buttons">
        <el-button type="primary" class="action-btn primary" @click="goApply">
          <el-icon><Trophy /></el-icon>
          我要揭榜
        </el-button>
        <el-button class="action-btn secondary">
          <el-icon><Star /></el-icon>
          关注项目
        </el-button>
        <el-button class="action-btn secondary">
          <el-icon><ChatDotRound /></el-icon>
          咨询企业
        </el-button>
      </div>
      
      <!-- 项目进度 -->
      <div class="progress-section">
        <h4>项目进度</h4>
        <div class="progress-bar">
          <div class="progress-line">
            <div class="progress-dot active"></div>
            <div class="progress-dot"></div>
            <div class="progress-dot"></div>
            <div class="progress-dot"></div>
          </div>
          <div class="progress-labels">
            <span class="active">发布</span>
            <span>揭榜</span>
            <span>评审</span>
            <span>完成</span>
          </div>
        </div>
      </div>
      
      <!-- 统计信息 -->
      <div class="stats-section">
        <h4>统计信息</h4>
        <div class="stats">
          <div class="stat-item">
            <el-icon><View /></el-icon>
            <span>浏览量: 1,234</span>
          </div>
          <div class="stat-item">
            <el-icon><Star /></el-icon>
            <span>关注数: 45</span>
          </div>
          <div class="stat-item">
            <el-icon><User /></el-icon>
            <span>揭榜数: 12</span>
          </div>
        </div>
      </div>
    </div>
      </div>
      
      <!-- 标签页切换 -->
      <div class="tab-section">
        <el-tabs v-model="activeTab" class="detail-tabs">
          <el-tab-pane label="项目详情" name="details">
            <div class="detail-content">
              <div class="section">
                <h3>■ 项目背景</h3>
                <p>随着人工智能技术的发展，智能客服已成为企业提升服务质量的重要工具。当前市场上大多数智能客服系统存在响应速度慢、理解能力有限等问题，急需开发一款高性能的AI智能客服系统。</p>
              </div>
              
              <div class="section">
                <h3>■ 项目目标</h3>
                <ul>
                  <li>实现7×24小时智能在线客服</li>
                  <li>支持多轮对话和上下文理解</li>
                  <li>集成知识库管理系统</li>
                  <li>支持多种渠道接入（网页、微信、APP）</li>
                  <li>提供完善的统计分析功能</li>
                </ul>
              </div>
              
              <div class="section">
                <h3>■ 成果形式</h3>
                <ul>
                  <li>完整的系统源代码</li>
                  <li>系统部署文档</li>
                  <li>用户使用手册</li>
                  <li>项目演示视频</li>
                </ul>
              </div>
              
              <div class="section">
                <h3>■ 功能要求</h3>
                <el-collapse>
                  <el-collapse-item title="点击展开查看详细功能要求">
                    <div>详细的功能需求包括：用户管理、对话管理、知识库管理、统计分析、系统设置等模块。</div>
                  </el-collapse-item>
                </el-collapse>
              </div>
              
              <div class="section">
                <h3>■ 性能指标</h3>
                <el-collapse>
                  <el-collapse-item title="点击展开查看性能指标">
                    <div>响应时间小于200ms，并发用户数支持1000+，系统可用性99.9%。</div>
                  </el-collapse-item>
                </el-collapse>
              </div>
              
              <div class="section">
                <h3>■ 评审方式</h3>
                <p>企业+专家联合评审</p>
              </div>
              
              <div class="section">
                <h3>■ 知识产权</h3>
                <p>所有权归学生团队，企业拥有使用权</p>
              </div>
              
              <div class="section">
                <h3>■ 附件资料</h3>
                <div class="attachments">
                  <div class="attachment-item">
                    <el-icon><Document /></el-icon>
                    <span>需求规格说明书.pdf (2.3MB)</span>
                    <el-link type="primary">[下载]</el-link>
                  </div>
                  <div class="attachment-item">
                    <el-icon><Document /></el-icon>
                    <span>接口文档.docx (856KB)</span>
                    <el-link type="primary">[下载]</el-link>
                  </div>
                </div>
              </div>
              
              <div class="section">
                <h3>■ 联系方式</h3>
                <p>联系人：李经理</p>
                <p>联系电话：138****1234 <el-link type="primary">[查看完整]</el-link> (揭榜后可见)</p>
              </div>
            </div>
          </el-tab-pane>
          
          <el-tab-pane label="揭榜名单" name="bidders">
            <div class="tab-content">揭榜名单内容将在这里显示</div>
          </el-tab-pane>
          
          <el-tab-pane label="评论(23)" name="comments">
            <div class="tab-content">评论内容将在这里显示</div>
          </el-tab-pane>
          
          <el-tab-pane label="企业介绍" name="company">
            <div class="tab-content">企业介绍内容将在这里显示</div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Star, ChatDotRound, Document, Trophy, View, User } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const activeTab = ref('details')
const project = ref({
  rating: 4.5
})

const goBackToHall = () => {
  router.push('/projects')
}

const goApply = () => {
  const projectId = route.params.id
  if (projectId) {
    router.push(`/apply/${projectId}`)
  }
}

onMounted(() => {
  const projectId = route.params.id
  if (projectId) {
    // 根据项目ID加载数据
  }
})
</script>

<style scoped>
.project-details-container {
  background: #f5f7fa;
  min-height: 100vh;
  padding: 20px;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  /* 滑动效果区域 */
  max-height: calc(100vh - 40px);
  overflow-y: auto;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.main-content::-webkit-scrollbar {
  display: none;
}

.content-row {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.main-info-section {
  flex: 1;
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.project-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.project-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.status-tag {
  font-size: 14px;
  font-weight: 600;
}

.project-title {
  margin: 0;
  font-size: 24px;
  color: #333;
}

.back-project-btn {
  padding: 8px 14px;
  border-radius: 999px;
  border: none;
  background: linear-gradient(135deg, #409eff, #337ecc);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  box-shadow: 0 4px 10px rgba(12, 95, 231, 0.25);
  transition: all 0.2s ease;
}

.back-project-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(12, 95, 231, 0.35);
}

.publisher-info {
  margin-bottom: 24px;
}

.publisher {
  display: block;
  color: #666;
  margin-bottom: 8px;
}

.rating {
  display: flex;
  align-items: center;
  gap: 8px;
}

.rating-text {
  color: #666;
  font-size: 14px;
}

.basic-info-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
}

.info-row {
  display: flex;
  margin-bottom: 16px;
}

.info-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-item .label {
  color: #666;
  font-size: 14px;
}

.info-item .value {
  color: #333;
  font-weight: 500;
}

.price {
  color: #f56c6c;
  font-weight: bold;
  font-size: 18px;
}

.time-left {
  color: #e6a23c;
}

.action-section {
  width: 320px;
  background: white;
  border-radius: 8px;
  padding: 24px 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
  padding: 0 2px;
}

.action-btn {
  width: 100% !important;
  box-sizing: border-box !important;
  margin: 0 !important;
  padding: 0 !important;
  height: 44px !important;
  font-size: 16px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 8px !important;
  font-weight: 500 !important;
  transition: all 0.3s ease !important;
  border-radius: 6px !important;
  border: 1px solid transparent;
}

.action-btn.primary {
  background: linear-gradient(135deg, #409eff, #337ecc);
  border: none;
  color: white;
  box-shadow: 0 4px 12px rgba(12, 95, 231, 0.25);
}

.action-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(12, 95, 231, 0.35);
}

.action-btn.secondary {
  border-color: #dcdfe6;
  background: #fff;
  color: #606266;
}

.action-btn.secondary:hover {
  border-color: #409eff;
  color: #409eff;
  transform: translateY(-1px);
}

.progress-section, .stats-section {
  margin-bottom: 24px;
}

.progress-section h4, .stats-section h4 {
  margin: 0 0 12px 0;
  color: #333;
  font-size: 16px;
}

.progress-bar {
  text-align: center;
}

.progress-line {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  position: relative;
}

.progress-line::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 2px;
  background: #e4e7ed;
  z-index: 1;
}

.progress-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #e4e7ed;
  position: relative;
  z-index: 2;
}

.progress-dot.active {
  background: #409eff;
}

.progress-labels {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #909399;
}

.progress-labels .active {
  color: #409eff;
  font-weight: 500;
}

.stats {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stat-item {
  color: #666;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.tab-section {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.detail-tabs {
  padding: 0 24px;
}

.detail-content {
  padding: 20px 0;
}

.section {
  margin-bottom: 32px;
}

.section h3 {
  color: #333;
  margin-bottom: 12px;
  font-size: 16px;
}

.section p, .section ul {
  color: #666;
  line-height: 1.6;
  margin: 0;
}

.section ul {
  padding-left: 20px;
}

.section li {
  margin-bottom: 8px;
}

.attachments {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.attachment-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #f5f7fa;
  border-radius: 4px;
}

.tab-content {
  padding: 20px 0;
  color: #666;
}

@media (max-width: 768px) {
  .content-row {
    flex-direction: column;
  }
  
  .action-section {
    width: 100%;
  }
}
</style>
