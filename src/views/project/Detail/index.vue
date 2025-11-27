<template>
  <div class="project-details-container">
    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- ========== 开始：面包屑导航部分 (BREADCRUMB_NAVIGATION_SECTION) ========== -->
      <div class="breadcrumb-section mb20">
        <router-link class="color-deep-blue" to="/home">首页 &gt; </router-link>
        <router-link class="color-deep-blue" to="/projects">项目大厅 &gt; </router-link>
        <span>项目详情</span>
      </div>
      <!-- ========== 结束：面包屑导航部分 (BREADCRUMB_NAVIGATION_SECTION) ========== -->
      
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
                <span class="value time-left">7天</span>
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
      
      <!-- ========== 开始：项目进度条部分 (PROJECT_STEPS_PROGRESS_SECTION) ========== -->
      <div class="project-steps-container mt15">
        <div class="ant-steps ant-steps-horizontal project-steps ant-steps-label-vertical">
          <div 
            v-for="(step, index) in projectSteps" 
            :key="step.code"
            :class="[
              'ant-steps-item',
              'ant-steps-item-custom',
              {
                'ant-steps-item-finish': step.status === 'finish',
                'ant-steps-item-process': step.status === 'process',
                'ant-steps-item-wait': step.status === 'wait'
              }
            ]"
          >
            <div class="ant-steps-item-container">
              <div class="ant-steps-item-tail"/>
              <div class="ant-steps-item-icon">
                <span class="ant-steps-icon">
                  <el-icon v-if="step.status === 'finish'" class="icon-check"><Check /></el-icon>
                  <div v-else class="circle-icon"/>
                </span>
              </div>
              <div class="ant-steps-item-content">
                <div class="ant-steps-item-title">{{ step.title }}</div>
                <div v-if="step.timeInfo" class="ant-steps-item-description">
                  <span class="color-grey-6 font-12">{{ step.timeInfo }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- ========== 结束：项目进度条部分 (PROJECT_STEPS_PROGRESS_SECTION) ========== -->

      <!-- 当前/下一阶段卡片 -->
      <section class="stage-highlight detail-highlight">
        <el-row :gutter="20">
          <el-col :xs="24">
            <el-card class="highlight-card current" v-if="currentMilestoneHighlight">
              <!-- 左上角页签 -->
              <div class="milestone-tab-label">当前里程碑</div>
              <!-- 标题和状态标签在同一行 -->
              <div class="title-with-status">
                <h2 class="stage-title">{{ currentMilestoneHighlight.title }}</h2>
                <el-tag :type="getMilestoneTagType(currentMilestoneHighlight.status)" class="status-tag-inline">
                  {{ getMilestoneStatusText(currentMilestoneHighlight.status) }}
                </el-tag>
              </div>
              <p class="stage-desc">{{ truncateText(currentMilestoneHighlight.description, 110) }}</p>
              <!-- 交付物、计划完成时间、剩余/逾期天数和查看详情按钮水平排列 -->
              <div class="stage-info-row">
                <div class="info-items-group">
                  <div class="info-item-compact">
                    <span class="info-label">交付物</span>
                    <span class="info-value">{{ currentMilestoneHighlight.deliverables ? currentMilestoneHighlight.deliverables.length : 0 }}</span>
                  </div>
                  <div class="info-item-compact">
                    <span class="info-label">计划完成时间</span>
                    <span class="info-value">{{ currentMilestoneHighlight.plannedDate || '待定' }}</span>
                  </div>
                  <div class="info-item-compact">
                    <span class="info-label">剩余/逾期天数</span>
                    <span class="info-value" :class="{ overdue: currentMilestoneHighlightRemainInfo.overdue }">
                      {{ currentMilestoneHighlightRemainInfo.text }}
                    </span>
                  </div>
                </div>
                <!-- 查看详情按钮在右侧，与状态标签右端对齐 -->
                <div class="stage-actions-inline">
                  <el-button
                    type="primary"
                    size="small"
                    text
                    @click="openMilestoneDetailDialog(currentMilestoneHighlight)"
                  >
                    查看详情
                    <el-icon><ArrowRight /></el-icon>
                  </el-button>
                </div>
              </div>
            </el-card>
            <el-card class="highlight-card empty" v-else>
              <p class="card-empty">暂无当前里程碑信息</p>
            </el-card>
          </el-col>
        </el-row>
      </section>

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
          
          <!-- ========== 开始：项目里程碑跟踪标签页 (PROJECT_MILESTONE_TRACKING_SECTION) ========== -->
          <el-tab-pane label="项目里程碑" name="milestones">
            <div class="milestone-tracking-content">
              <!-- 权限提示 -->
              <div v-if="!isProjectParticipant" class="permission-notice">
                <el-alert
                  type="info"
                  :closable="false"
                  show-icon
                >
                  <template #title>
                    <span>您当前以访客身份查看，部分敏感信息仅对项目参与者（发布方和承接方）可见</span>
                  </template>
                </el-alert>
              </div>
              
              <!-- 里程碑时间轴 -->
              <div class="milestone-timeline">
                <div 
                  v-for="(milestone, index) in milestones" 
                  :key="milestone.id"
                  class="milestone-item"
                  :class="{
                    'milestone-completed': milestone.status === 'completed',
                    'milestone-in-progress': milestone.status === 'in-progress',
                    'milestone-pending': milestone.status === 'pending',
                    'milestone-delayed': milestone.status === 'delayed'
                  }"
                >
                  <!-- 时间轴连接线 -->
                  <div v-if="index < milestones.length - 1" class="timeline-connector"></div>
                  
                  <!-- 里程碑标记 -->
                  <div class="milestone-marker">
                    <el-icon v-if="milestone.status === 'completed'" class="marker-icon completed">
                      <Check />
                    </el-icon>
                    <div v-else-if="milestone.status === 'in-progress'" class="marker-icon in-progress">
                      <div class="pulse-dot"></div>
                    </div>
                    <div v-else class="marker-icon pending"></div>
                  </div>
                  
                  <!-- 里程碑内容卡片（缩略版） -->
                  <div class="milestone-card">
                    <div class="milestone-header">
                      <div class="milestone-title-row">
                        <h3 class="milestone-title">{{ milestone.title }}</h3>
                        <div class="milestone-header-actions">
                          <el-tag
                            :type="getMilestoneTagType(milestone.status)"
                            size="small"
                          >
                            {{ getMilestoneStatusText(milestone.status) }}
                          </el-tag>
                          <el-button
                            type="primary"
                            size="small"
                            text
                            @click="openMilestoneDetailDialog(milestone)"
                          >
                            查看详情
                            <el-icon><ArrowRight /></el-icon>
                          </el-button>
                        </div>
                      </div>
                      <div class="milestone-meta">
                        <span class="milestone-date">
                          <el-icon><Calendar /></el-icon>
                          {{ milestone.plannedDate }}
                        </span>
                        <span v-if="milestone.actualDate" class="milestone-actual-date">
                          实际完成：{{ milestone.actualDate }}
                        </span>
                        <span v-if="milestone.delayDays && milestone.delayDays > 0" class="milestone-delay">
                          延迟 {{ milestone.delayDays }} 天
                        </span>
                      </div>
                    </div>

                    <!-- 缩略描述（最多2行） -->
                    <div class="milestone-description-short">
                      <p>{{ truncateText(milestone.description, 100) }}</p>
                    </div>

                    <!-- 交付物数量提示 -->
                    <div class="milestone-summary">
                      <div v-if="milestone.deliverables && milestone.deliverables.length > 0" class="summary-item">
                        <el-icon><Document /></el-icon>
                        <span>交付物：{{ milestone.deliverables.length }} 项</span>
                      </div>
                      <div v-if="milestone.progressDetail" class="summary-item">
                        <el-icon><TrendCharts /></el-icon>
                        <span>进度：{{ milestone.progressDetail.percentage }}%</span>
                      </div>
                    </div>

                    <!-- 操作按钮区域：仅承接方可操作 -->
                    <div v-if="isProjectParticipant && canOperateMilestone(milestone)" class="milestone-actions">
                      <el-button
                        v-if="isSimpleMilestone(milestone)"
                        type="primary"
                        size="default"
                        @click="openMilestoneDialog(milestone)"
                      >
                        <el-icon><Edit /></el-icon>
                        更新进度
                      </el-button>
                      <el-button
                        v-else
                        type="primary"
                        size="default"
                        @click="goToMilestoneSubmit(milestone)"
                      >
                        <el-icon><Upload /></el-icon>
                        提交{{ milestone.title }}
                      </el-button>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 空状态 -->
              <el-empty v-if="milestones.length === 0" description="暂无里程碑信息" />
            </div>
          </el-tab-pane>
          <!-- ========== 结束：项目里程碑跟踪标签页 (PROJECT_MILESTONE_TRACKING_SECTION) ========== -->
        </el-tabs>
      </div>
    </div>
    
    <!-- ========== 开始：里程碑操作弹窗 (MILESTONE_OPERATION_DIALOG) ========== -->
    <el-dialog
      v-model="milestoneDialogVisible"
      :title="currentMilestoneDialog ? currentMilestoneDialog.title + ' - 更新进度' : '里程碑操作'"
      width="800px"
      :close-on-click-modal="false"
      destroy-on-close
    >
      <el-form 
        v-if="currentMilestoneDialog"
        ref="milestoneFormRef"
        :model="milestoneForm" 
        :rules="milestoneRules" 
        label-width="120px"
      >
        <!-- 完成进度 -->
        <el-form-item label="完成进度" prop="progress">
          <div class="progress-input-group">
            <el-slider 
              v-model="milestoneForm.progress" 
              :min="0" 
              :max="100"
              :show-tooltip="true"
            />
            <span class="progress-text">{{ milestoneForm.progress }}%</span>
          </div>
        </el-form-item>
        
        <!-- 完成说明 -->
        <el-form-item label="完成说明" prop="description">
          <el-input
            v-model="milestoneForm.description"
            type="textarea"
            :rows="4"
            placeholder="请描述本里程碑的完成情况、遇到的问题、解决方案等..."
            show-word-limit
            maxlength="1000"
          />
        </el-form-item>
        
        <!-- 交付物上传 -->
        <el-form-item label="交付物" prop="deliverables">
          <el-upload
            v-model:file-list="milestoneForm.deliverables"
            action="#"
            multiple
            :auto-upload="false"
            :limit="10"
          >
            <el-button type="primary">
              <el-icon><Upload /></el-icon>
              上传文件
            </el-button>
            <template #tip>
              <div class="el-upload__tip">
                支持上传多个文件，单个文件不超过 100MB，最多10个文件
              </div>
            </template>
          </el-upload>
        </el-form-item>
        
        <!-- 问题与风险（可选） -->
        <el-form-item label="问题与风险">
          <el-input
            v-model="milestoneForm.risks"
            type="textarea"
            :rows="3"
            placeholder="如有问题或风险，请在此说明..."
            show-word-limit
            maxlength="500"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="milestoneDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitMilestone" :loading="submitting">
            提交
          </el-button>
        </div>
      </template>
    </el-dialog>
    <!-- ========== 结束：里程碑操作弹窗 (MILESTONE_OPERATION_DIALOG) ========== -->

    <!-- ========== 开始：里程碑详情弹窗 (MILESTONE_DETAIL_DIALOG) ========== -->
    <el-dialog
      v-model="milestoneDetailDialogVisible"
      :title="selectedMilestoneForDetail ? selectedMilestoneForDetail.title + ' - 详情' : '里程碑详情'"
      width="950px"
      :close-on-click-modal="false"
      destroy-on-close
    >
      <div v-if="selectedMilestoneForDetail" class="milestone-detail-content">
        <!-- 基本信息 -->
        <div class="detail-section">
          <div class="section-header">
            <h4>基本信息</h4>
            <el-tag :type="getMilestoneTagType(selectedMilestoneForDetail.status)" size="small">
              {{ getMilestoneStatusText(selectedMilestoneForDetail.status) }}
            </el-tag>
          </div>
          <div class="section-content">
            <p class="description-full">{{ selectedMilestoneForDetail.description }}</p>
            <div class="meta-info">
              <div class="meta-row">
                <span class="meta-label">阶段编码：</span>
                <span>{{ selectedMilestoneForDetail.code }}</span>
              </div>
              <div class="meta-row">
                <span class="meta-label">计划日期：</span>
                <span>{{ selectedMilestoneForDetail.plannedDate }}</span>
              </div>
              <div v-if="selectedMilestoneForDetail.actualDate" class="meta-row">
                <span class="meta-label">实际完成：</span>
                <span>{{ selectedMilestoneForDetail.actualDate }}</span>
              </div>
              <div v-if="selectedMilestoneForDetail.delayDays" class="meta-row">
                <span class="meta-label">延迟天数：</span>
                <span :class="{ 'text-danger': selectedMilestoneForDetail.delayDays > 0 }">
                  {{ selectedMilestoneForDetail.delayDays > 0 ? `延迟 ${selectedMilestoneForDetail.delayDays} 天` : `提前 ${Math.abs(selectedMilestoneForDetail.delayDays)} 天` }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 交付物列表 -->
        <div v-if="selectedMilestoneForDetail.deliverables && selectedMilestoneForDetail.deliverables.length > 0" class="detail-section">
          <div class="section-header">
            <h4>交付物</h4>
            <span class="count-badge">{{ selectedMilestoneForDetail.deliverables.length }} 项</span>
          </div>
          <div class="section-content">
            <ul class="deliverables-list-full">
              <li v-for="(deliverable, idx) in selectedMilestoneForDetail.deliverables" :key="idx">
                <el-icon><Document /></el-icon>
                <span>{{ deliverable }}</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- 敏感信息区域：仅项目参与者可见 -->
        <div v-if="isProjectParticipant" class="detail-section sensitive-section">
          <el-divider>
            <el-icon><Lock /></el-icon>
            <span>项目参与者信息</span>
          </el-divider>

          <!-- 详细进度信息 -->
          <div v-if="selectedMilestoneForDetail.progressDetail" class="section-content">
            <div class="section-header">
              <h4>详细进度</h4>
            </div>
            <div class="progress-detail-full">
              <el-progress
                :percentage="selectedMilestoneForDetail.progressDetail.percentage"
                :status="selectedMilestoneForDetail.progressDetail.status"
                :stroke-width="10"
              />
              <p class="progress-note">{{ selectedMilestoneForDetail.progressDetail.note }}</p>
            </div>
          </div>

          <!-- 内部沟通记录 -->
          <div v-if="selectedMilestoneForDetail.communications && selectedMilestoneForDetail.communications.length > 0" class="section-content">
            <div class="section-header">
              <h4>沟通记录</h4>
              <span class="count-badge">{{ selectedMilestoneForDetail.communications.length }} 条</span>
            </div>
            <div class="communications-list-full">
              <div
                v-for="(comm, idx) in selectedMilestoneForDetail.communications"
                :key="idx"
                class="communication-item-full"
              >
                <div class="comm-header">
                  <span class="comm-author">{{ comm.author }}</span>
                  <span class="comm-time">{{ comm.time }}</span>
                </div>
                <p class="comm-content">{{ comm.content }}</p>
              </div>
            </div>
          </div>

          <!-- 内部备注 -->
          <div v-if="selectedMilestoneForDetail.internalNotes" class="section-content">
            <div class="section-header">
              <h4>内部备注</h4>
            </div>
            <div class="internal-notes-full">
              <p>{{ selectedMilestoneForDetail.internalNotes }}</p>
            </div>
          </div>

          <!-- 内部附件 -->
          <div v-if="selectedMilestoneForDetail.sensitiveAttachments && selectedMilestoneForDetail.sensitiveAttachments.length > 0" class="section-content">
            <div class="section-header">
              <h4>内部附件</h4>
              <span class="count-badge">{{ selectedMilestoneForDetail.sensitiveAttachments.length }} 个</span>
            </div>
            <div class="attachments-list-full">
              <div
                v-for="(attachment, idx) in selectedMilestoneForDetail.sensitiveAttachments"
                :key="idx"
                class="attachment-item-full"
              >
                <el-icon><Document /></el-icon>
                <span>{{ attachment.name }} ({{ attachment.size }})</span>
                <el-link type="primary" :underline="false">[下载]</el-link>
              </div>
            </div>
          </div>
        </div>

        <!-- 非参与者提示 -->
        <div v-else class="detail-section">
          <el-alert
            type="info"
            :closable="false"
            show-icon
          >
            <template #title>
              <span>此里程碑包含项目参与者专属信息，仅项目发布方和承接方可查看</span>
            </template>
          </el-alert>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="milestoneDetailDialogVisible = false">关闭</el-button>
          <el-button
            v-if="isProjectParticipant && canOperateMilestone(selectedMilestoneForDetail)"
            type="primary"
            @click="handleMilestoneActionFromDetail"
          >
            <el-icon v-if="isSimpleMilestone(selectedMilestoneForDetail)"><Edit /></el-icon>
            <el-icon v-else><Upload /></el-icon>
            {{ isSimpleMilestone(selectedMilestoneForDetail) ? '更新进度' : '提交' + selectedMilestoneForDetail.title }}
          </el-button>
        </div>
      </template>
    </el-dialog>
    <!-- ========== 结束：里程碑详情弹窗 (MILESTONE_DETAIL_DIALOG) ========== -->
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Star, ChatDotRound, Document, Trophy, View, User, Check, Calendar, Lock, Edit, Upload, ArrowRight, TrendCharts } from '@element-plus/icons-vue'
import { useAuthStore } from '@/store/modules/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const activeTab = ref('details')

// 根据项目ID初始化项目数据（模拟数据，后续从API获取）
const initProjectData = () => {
  const projectId = route.params.id
  
  // 项目1的承接方包含测试学生用户
  const bidderIdsMap = {
    '1': ['test_student_001', 'student-001', 'student-002'], // project/1 包含测试学生用户
    '2': ['student-001', 'student-002'],
    '3': ['student-002', 'student-003']
  }
  
  return {
    rating: 4.5,
    publisherId: 'enterprise-001', // 发布方ID（模拟数据，后续从API获取）
    bidderIds: bidderIdsMap[projectId] || ['student-001', 'student-002'] // 承接方ID列表（根据项目ID设置，project/1包含测试学生用户）
  }
}

const project = ref(initProjectData())

// ========== 开始：项目里程碑跟踪数据 (PROJECT_MILESTONE_TRACKING_DATA) ==========
// 从store获取当前用户信息
const currentUser = computed(() => {
  return {
    id: authStore.userInfo?.id || '', // 当前用户ID
    role: authStore.userRole || 'visitor', // 当前用户角色：'student' | 'enterprise' | 'teacher' | 'admin' | 'visitor'
    isLoggedIn: authStore.isAuthenticated // 是否已登录
  }
})

// 判断当前用户是否是项目参与者（发布方或承接方）
const isProjectParticipant = computed(() => {
  if (!currentUser.value.isLoggedIn) return false
  
  const userId = currentUser.value.id
  const userRole = currentUser.value.role
  
  // 判断是否是发布方
  if (userRole === 'enterprise' && userId === project.value.publisherId) {
    return true
  }
  
  // 判断是否是承接方（学生角色且在承接方列表中）
  if (userRole === 'student' && project.value.bidderIds && project.value.bidderIds.includes(userId)) {
    return true
  }
  
  // 管理员和教师也可以查看（可选，根据需求调整）
  // if (userRole === 'admin' || userRole === 'teacher') {
  //   return true
  // }
  
  return false
})

// 里程碑数据（当前使用模拟数据，后续接入后端）
// 里程碑与项目7个核心阶段对应：
// 1. BIDDING: 揭榜征集
// 2. PROPOSAL: 方案提交
// 3. MIDTERM: 中期答辩
// 4. DELIVERY: 成果提交
// 5. REVIEW: 成果评审
// 6. ANNOUNCEMENT: 结项公示
// 7. COMPLETION: 任务完成
const milestones = ref([
  {
    id: 'milestone-bidding',
    code: 'BIDDING',
    title: '揭榜征集',
    description: '学生查看并提交揭榜申请，企业/学校审核通过后确定承接方',
    status: 'completed',
    plannedDate: '2025-11-05',
    actualDate: '2025-11-04',
    delayDays: -1,
    deliverables: ['揭榜申请表', '审核结果通知'],
    progressDetail: {
      percentage: 100,
      status: 'success',
      note: '所有申请已审核完毕，承接方已确定'
    },
    riskLevel: 'low',
    communications: [
      {
        author: '陈老师（教务中心）',
        time: '2025-11-04 16:30',
        content: '本次揭榜共收到12份申请，质量整体较高'
      }
    ],
    internalNotes: '本期导师资源充足，匹配顺利',
    sensitiveAttachments: []
  },
  {
    id: 'milestone-proposal',
    code: 'PROPOSAL',
    title: '方案提交',
    description: '提交项目实施方案，包括技术方案、实施计划、团队分工等，经多角色评审后确定最终方案',
    status: 'completed',
    plannedDate: '2025-11-20',
    actualDate: '2025-11-19',
    delayDays: -1,
    deliverables: ['实施方案包', '评审意见清单'],
    progressDetail: {
      percentage: 100,
      status: 'success',
      note: '方案已通过评审，获得专家组一致认可'
    },
    riskLevel: 'low',
    communications: [
      {
        author: '王岚（评审专家）',
        time: '2025-11-19 16:00',
        content: '方案整体架构合理，技术选型得当，建议在安全性方面加强'
      }
    ],
    internalNotes: '评审过程顺利，团队表现优秀',
    sensitiveAttachments: [
      { name: '评审专家意见汇总.docx', size: '2.3MB' }
    ]
  },
  {
    id: 'milestone-midterm',
    code: 'MIDTERM',
    title: '中期答辩',
    description: '项目中期检查，展示项目进展和阶段性成果，专家评审并提出优化建议',
    status: 'in-progress',
    plannedDate: '2025-12-25',
    actualDate: null,
    delayDays: 0,
    deliverables: ['中期答辩PPT', '阶段成果包', '评审结论'],
    progressDetail: {
      percentage: 78,
      status: 'warning',
      note: '中期答辩已完成，等待评审结论归档'
    },
    riskLevel: 'medium',
    communications: [
      {
        author: '孙赫（专家委员会）',
        time: '2025-12-22 15:30',
        content: '项目进度符合预期，建议加强性能优化'
      },
      {
        author: '林一舟（项目经理）',
        time: '2025-12-23 09:00',
        content: '已记录专家建议，将在后续开发中重点关注'
      }
    ],
    internalNotes: '中期进展良好，团队执行力强',
    sensitiveAttachments: [
      { name: '中期评审打分表.xlsx', size: '1.2MB' }
    ]
  },
  {
    id: 'milestone-delivery',
    code: 'DELIVERY',
    title: '成果提交',
    description: '提交最终项目成果，包括代码包、文档、测试报告等，完成学校初审',
    status: 'pending',
    plannedDate: '2026-01-20',
    actualDate: null,
    delayDays: null,
    deliverables: ['成果代码仓', '技术文档', '运维手册', '测试报告'],
    progressDetail: {
      percentage: 20,
      status: 'exception',
      note: '成果整理中，注意截止日期临近'
    },
    riskLevel: 'high',
    communications: [],
    internalNotes: '需要加快进度，确保按时提交',
    sensitiveAttachments: []
  },
  {
    id: 'milestone-review',
    code: 'REVIEW',
    title: '成果评审',
    description: '企业+专家联合评审，评分并生成评审结果，确定项目排名',
    status: 'pending',
    plannedDate: '2026-02-05',
    actualDate: null,
    delayDays: null,
    deliverables: ['评审打分表', '评审报告'],
    progressDetail: {
      percentage: 0,
      status: 'info',
      note: '等待成果提交完成后启动评审'
    },
    riskLevel: 'high',
    communications: [],
    internalNotes: '',
    sensitiveAttachments: []
  },
  {
    id: 'milestone-announcement',
    code: 'ANNOUNCEMENT',
    title: '结项公示',
    description: '结果公示、处理申诉、协议签订、费用结算',
    status: 'pending',
    plannedDate: '2026-02-20',
    actualDate: null,
    delayDays: null,
    deliverables: ['公示文件', '项目协议', '结算单据'],
    progressDetail: {
      percentage: 0,
      status: 'info',
      note: '等待评审完成后启动公示流程'
    },
    riskLevel: 'medium',
    communications: [],
    internalNotes: '',
    sensitiveAttachments: []
  },
  {
    id: 'milestone-completion',
    code: 'COMPLETION',
    title: '任务完成',
    description: '完成验收签署、费用结算、经验复盘，标志项目顺利结束',
    status: 'pending',
    plannedDate: '2026-02-28',
    actualDate: null,
    delayDays: null,
    deliverables: ['验收确认单', '项目复盘报告'],
    progressDetail: {
      percentage: 0,
      status: 'info',
      note: '等待前序阶段完成'
    },
    riskLevel: 'low',
    communications: [],
    internalNotes: '',
    sensitiveAttachments: []
  }
])

// 计算当前里程碑，确保卡片始终有聚焦阶段
const currentMilestoneHighlight = computed(() => {
  if (!milestones.value.length) return null
  return (
    milestones.value.find(milestone => milestone.status === 'in-progress') ||
    milestones.value.find(milestone => milestone.status === 'pending') ||
    milestones.value[milestones.value.length - 1]
  )
})

const currentMilestoneHighlightRemainInfo = computed(() => {
  if (!currentMilestoneHighlight.value) {
    return { text: '—', overdue: false }
  }
  const targetDate =
    currentMilestoneHighlight.value.plannedDate ||
    currentMilestoneHighlight.value.actualDate
  if (!targetDate) {
    return { text: '—', overdue: false }
  }
  return calculateRemainingDays(targetDate)
})

// 获取里程碑状态标签类型
const getMilestoneTagType = (status) => {
  const typeMap = {
    'completed': 'success',
    'in-progress': 'warning',
    'pending': 'info',
    'delayed': 'danger'
  }
  return typeMap[status] || 'info'
}

// 获取里程碑状态文本
const getMilestoneStatusText = (status) => {
  const textMap = {
    'completed': '已完成',
    'in-progress': '进行中',
    'pending': '待开始',
    'delayed': '已延迟'
  }
  return textMap[status] || '未知'
}

// 供当前里程碑卡片使用的风险等级语义化
const riskTagType = (level) => {
  if (level === 'high') return 'danger'
  if (level === 'medium') return 'warning'
  return 'success'
}

const riskLabel = (level) => {
  if (level === 'high') return '高风险'
  if (level === 'medium') return '中风险'
  return '低风险'
}

// ========== 开始：里程碑操作相关 (MILESTONE_OPERATION_LOGIC) ==========
// 判断是否可以操作里程碑
const canOperateMilestone = (milestone) => {
  // 1. 必须是项目参与者
  if (!isProjectParticipant.value) return false
  
  // 2. 必须是承接方（学生角色）
  if (currentUser.value.role !== 'student') return false
  
  // 3. 必须在承接方列表中
  if (!project.value.bidderIds?.includes(currentUser.value.id)) {
    return false
  }
  
  // 4. 里程碑状态必须是"进行中"或"待开始"
  if (milestone.status !== 'in-progress' && milestone.status !== 'pending') {
    return false
  }
  
  return true
}

// 判断是否是简单里程碑（使用弹窗操作）
const isSimpleMilestone = (milestone) => {
  // 复杂里程碑需要专门页面提交：方案提交、中期答辩、成果提交
  // 其他里程碑可以用弹窗更新进度
  const complexMilestones = [
    'PROPOSAL',
    'MIDTERM',
    'DELIVERY'
  ]
  return !complexMilestones.includes(milestone.code)
}

// 里程碑操作弹窗相关
const milestoneDialogVisible = ref(false)
const currentMilestoneDialog = ref(null)
const milestoneFormRef = ref(null)
const submitting = ref(false)

const milestoneForm = ref({
  progress: 0,
  description: '',
  deliverables: [],
  risks: ''
})

const milestoneRules = {
  progress: [
    { required: true, message: '请设置完成进度', trigger: 'change' }
  ],
  description: [
    { required: true, message: '请填写完成说明', trigger: 'blur' },
    { min: 10, message: '完成说明至少10个字符', trigger: 'blur' }
  ]
}

// 打开里程碑操作弹窗
const openMilestoneDialog = (milestone) => {
  currentMilestoneDialog.value = milestone
  // 初始化表单数据
  milestoneForm.value = {
    progress: milestone.progressDetail?.percentage || 0,
    description: milestone.progressDetail?.note || '',
    deliverables: [],
    risks: ''
  }
  milestoneDialogVisible.value = true
}

// 提交里程碑操作
const submitMilestone = async () => {
  if (!milestoneFormRef.value) return
  
  try {
    await milestoneFormRef.value.validate()
    submitting.value = true
    
    // TODO: 调用API提交数据
    // const response = await submitMilestoneProgress(currentMilestoneDialog.value.id, milestoneForm.value)
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 更新本地里程碑状态
    const index = milestones.value.findIndex(m => m.id === currentMilestoneDialog.value.id)
    if (index !== -1) {
      milestones.value[index] = {
        ...milestones.value[index],
        status: milestoneForm.value.progress === 100 ? 'completed' : 'in-progress',
        actualDate: milestoneForm.value.progress === 100 ? new Date().toISOString().split('T')[0] : null,
        progressDetail: {
          percentage: milestoneForm.value.progress,
          status: milestoneForm.value.progress === 100 ? 'success' : null,
          note: milestoneForm.value.description
        }
      }
    }
    
    ElMessage.success('提交成功')
    milestoneDialogVisible.value = false
  } catch (error) {
    if (error !== false) { // 表单验证失败时不显示错误
      ElMessage.error('提交失败：' + (error.message || '未知错误'))
    }
  } finally {
    submitting.value = false
  }
}

// 跳转到里程碑提交页面
const goToMilestoneSubmit = (milestone) => {
  const projectId = route.params.id
  const milestoneCode = milestone.code

  // 根据里程碑类型跳转到不同的提交页面
  const routeMap = {
    'PROPOSAL': `/project/${projectId}/milestone/proposal`,
    'MIDTERM': `/project/${projectId}/milestone/midterm`,
    'DELIVERY': `/project/${projectId}/milestone/delivery`
  }

  const targetRoute = routeMap[milestoneCode] || `/student/Submit?id=${projectId}&milestone=${milestoneCode}`
  router.push(targetRoute)
}

// ========== 开始：里程碑详情弹窗相关 (MILESTONE_DETAIL_DIALOG_LOGIC) ==========
// 详情弹窗状态
const milestoneDetailDialogVisible = ref(false)
const selectedMilestoneForDetail = ref(null)

// 打开里程碑详情弹窗
const openMilestoneDetailDialog = (milestone) => {
  selectedMilestoneForDetail.value = milestone
  milestoneDetailDialogVisible.value = true
}

// 从详情弹窗触发操作
const handleMilestoneActionFromDetail = () => {
  if (!selectedMilestoneForDetail.value) return

  // 关闭详情弹窗
  milestoneDetailDialogVisible.value = false

  // 根据里程碑类型执行不同操作
  if (isSimpleMilestone(selectedMilestoneForDetail.value)) {
    // 简单里程碑：打开操作弹窗
    openMilestoneDialog(selectedMilestoneForDetail.value)
  } else {
    // 复杂里程碑：跳转到提交页面
    goToMilestoneSubmit(selectedMilestoneForDetail.value)
  }
}

// 文本截断工具函数
const truncateText = (text, maxLength = 100) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}
// ========== 结束：里程碑详情弹窗相关 (MILESTONE_DETAIL_DIALOG_LOGIC) ==========
// ========== 结束：里程碑操作相关 (MILESTONE_OPERATION_LOGIC) ==========
// ========== 结束：项目里程碑跟踪数据 (PROJECT_MILESTONE_TRACKING_DATA) ==========

// ========== 开始：项目阶段数据 (PROJECT_STEPS_DATA) ==========
// 项目阶段数据（7个核心阶段，当前使用模拟数据，后续接入后端）
const projectSteps = ref([
  {
    code: 'BIDDING',
    title: '揭榜征集',
    status: 'finish',
    timeInfo: '2025-11-04',
    startDate: '2025-11-01',
    endDate: '2025-11-05',
    deadline: '2025-11-05'
  },
  {
    code: 'PROPOSAL',
    title: '方案提交',
    status: 'finish',
    timeInfo: '2025-11-19',
    startDate: '2025-11-06',
    endDate: '2025-11-20',
    deadline: '2025-11-20'
  },
  {
    code: 'MIDTERM',
    title: '中期答辩',
    status: 'process',  // 当前进行中
    timeInfo: '剩余2天',
    startDate: '2025-11-21',
    endDate: '2025-12-25',
    deadline: '2025-12-25'
  },
  {
    code: 'DELIVERY',
    title: '成果提交',
    status: 'wait',
    timeInfo: '预计25天',
    startDate: null,
    endDate: null,
    deadline: '2026-01-20'
  },
  {
    code: 'REVIEW',
    title: '成果评审',
    status: 'wait',
    timeInfo: '预计15天',
    startDate: null,
    endDate: null,
    deadline: '2026-02-05'
  },
  {
    code: 'ANNOUNCEMENT',
    title: '结项公示',
    status: 'wait',
    timeInfo: '预计15天',
    startDate: null,
    endDate: null,
    deadline: '2026-02-20'
  },
  {
    code: 'COMPLETION',
    title: '任务完成',
    status: 'wait',
    timeInfo: '预计8天',
    startDate: null,
    endDate: null,
    deadline: '2026-02-28'
  }
])

/**
 * 格式化项目阶段数据（预留函数，后续接入后端时使用）
 * @param {Object} data - 后端返回的项目数据
 * @returns {Array} 格式化后的阶段数组
 */
const formatProjectSteps = (data) => {
  // TODO: 根据后端数据结构格式化阶段数据
  // 计算每个阶段的状态和时间信息
  return projectSteps.value
}

/**
 * 计算剩余时间（预留函数，后续接入后端时使用）
 * @param {String} deadline - 截止日期
 * @returns {String} 剩余时间文本
 */
const calculateRemainingTime = (deadline) => {
  if (!deadline) return ''
  const now = new Date()
  const end = new Date(deadline)
  const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24))
  if (diff > 0) {
    return `剩余${diff}天`
  } else if (diff === 0) {
    return '今天截止'
  } else {
    return `已逾期${Math.abs(diff)}天`
  }
}
// ========== 结束：项目阶段数据 (PROJECT_STEPS_DATA) ==========

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
    // TODO: 后续接入后端API获取真实数据
    // loadProjectSteps(projectId)
    // loadMilestones(projectId)
    // loadProjectInfo(projectId) // 加载项目信息，包括发布方ID和承接方ID列表
  }
})

// TODO: 后续接入后端API时使用
// 加载项目里程碑数据
// const loadMilestones = async (projectId) => {
//   try {
//     // const response = await getProjectMilestones(projectId)
//     // milestones.value = formatMilestones(response.data)
//   } catch (error) {
//     console.error('加载项目里程碑失败:', error)
//     ElMessage.error('加载项目里程碑失败，请稍后重试')
//   }
// }

// TODO: 后续接入后端API时使用
// const loadProjectSteps = async (projectId) => {
//   try {
//     // const response = await getProjectSteps(projectId)
//     // projectSteps.value = formatProjectSteps(response.data)
//   } catch (error) {
//     console.error('加载项目进度失败:', error)
//   }
// }

// 计算距离目标日期的剩余/逾期信息，提供给当前里程碑卡片
const calculateRemainingDays = (dateStr) => {
  if (!dateStr) {
    return { text: '—', overdue: false }
  }
  const endDate = new Date(dateStr)
  if (Number.isNaN(endDate.getTime())) {
    return { text: '—', overdue: false }
  }
  const now = new Date()
  const diff = endDate.getTime() - now.getTime()
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
  if (days >= 0) {
    return { text: `剩余 ${days} 天`, overdue: false }
  }
  return { text: `逾期 ${Math.abs(days)} 天`, overdue: true }
}
</script>

<style scoped>
.project-details-container {
  background: #f5f7fa;
  padding: 20px;
  padding-bottom: 40px;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
}

/* ========== 开始：面包屑导航样式 (BREADCRUMB_NAVIGATION_STYLES) ========== */
.breadcrumb-section {
  font-size: 14px;
  color: #666;
}

.mb20 {
  margin-bottom: 20px;
}

.color-deep-blue {
  color: #4a7cdd;
  text-decoration: none;
}

.color-deep-blue:hover {
  text-decoration: underline;
}
/* ========== 结束：面包屑导航样式 (BREADCRUMB_NAVIGATION_STYLES) ========== */

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
  flex-direction: row;
  align-items: baseline;
  gap: 12px;
}

.info-item .label {
  color: #666;
  font-size: 16px;
  font-weight: 600;
  min-width: 90px;
  flex-shrink: 0;
  text-align: right;
}

.info-item .value {
  color: #333;
  font-weight: 500;
  font-size: 15px;
  flex: 1;
  text-align: left;
  line-height: 1.5;
}

.price {
  color: #f56c6c;
  font-weight: bold;
  font-size: 15px;
  line-height: 1.5;
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

/* ========== 开始：项目进度条样式 (PROJECT_STEPS_PROGRESS_STYLES) ========== */
.project-steps-container {
  margin-top: 15px;
  margin-bottom: 30px;
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.mt15 {
  margin-top: 15px;
}

.ant-steps {
  display: flex;
  gap: 0;
}

.ant-steps-horizontal {
  flex-direction: row;
}

.ant-steps-label-vertical .ant-steps-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.ant-steps-item {
  position: relative;
}

.ant-steps-item-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.ant-steps-item-tail {
  position: absolute;
  left: 50%;
  top: 16px;
  width: 100%;
  height: 2px;
  background: #e8e8e8;
  z-index: 0;
}

.ant-steps-item:last-child .ant-steps-item-tail {
  display: none;
}

.ant-steps-item-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  z-index: 1;
  position: relative;
}

.ant-steps-item-finish .ant-steps-item-icon {
  background: #4a7cdd;
  color: white;
}

.ant-steps-item-finish .ant-steps-item-tail {
  background: #4a7cdd;
}

.ant-steps-item-process .ant-steps-item-icon {
  background: white;
  border: 2px solid #4a7cdd;
}

.ant-steps-item-wait .ant-steps-item-icon {
  background: white;
  border: 2px solid #e8e8e8;
}

.ant-steps-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-check {
  font-size: 18px;
}

.circle-icon {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #e8e8e8;
}

.ant-steps-item-process .circle-icon {
  background: #4a7cdd;
}

.ant-steps-item-content {
  margin-top: 12px;
  text-align: center;
}

.stage-highlight {
  margin-top: 24px;
  margin-bottom: 20px;
}

.stage-highlight .highlight-card {
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 20px 26px;
  padding-top: 40px;
  min-height: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
  overflow: visible;
}

/* 当前里程碑左上角页签样式 */
.stage-highlight .milestone-tab-label {
  position: absolute;
  top: 0;
  left: 0;
  background: linear-gradient(135deg, #409eff, #337ecc);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  padding: 8px 24px;
  border-radius: 0 0 16px 0;
  box-shadow: 0 3px 10px rgba(64, 158, 255, 0.4);
  z-index: 10;
  letter-spacing: 0.8px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
  white-space: nowrap;
}

.stage-highlight .highlight-card.empty {
  background: #f8f9fa;
  justify-content: center;
  align-items: center;
  text-align: center;
}

/* 标题和状态标签在同一行 */
.stage-highlight .title-with-status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 4px;
  margin-bottom: 8px;
}

.stage-highlight .stage-title {
  font-size: 22px;
  font-weight: 600;
  margin: 0;
  flex: 1;
}

.stage-highlight .status-tag-inline {
  flex-shrink: 0;
}

.stage-highlight .stage-desc {
  margin: 0 0 12px 0;
  color: #666;
  font-size: 14px;
  line-height: 1.6;
}

/* 信息项和按钮在同一行，信息偏左，按钮偏右 */
.stage-highlight .stage-info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 0;
}

/* 信息项组（偏左） */
.stage-highlight .info-items-group {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  flex: 1;
}

.stage-highlight .info-item-compact {
  display: flex;
  align-items: baseline;
  gap: 8px;
  flex-shrink: 0;
}

.stage-highlight .info-item-compact .info-label {
  font-size: 15px;
  font-weight: 600;
  color: #666;
  flex-shrink: 0;
}

.stage-highlight .info-item-compact .info-value {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.stage-highlight .info-item-compact .info-value.overdue {
  color: #f56c6c;
}

/* 查看详情按钮（偏右，与状态标签右端对齐） */
.stage-highlight .stage-actions-inline {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.stage-highlight .stage-actions-inline .el-button {
  display: flex;
  align-items: center;
  gap: 6px;
}

.stage-highlight .card-empty {
  color: #999;
}

.stage-highlight strong.overdue {
  color: #f56c6c;
}

.ant-steps-item-title {
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
}

.ant-steps-item-description {
  font-size: 12px;
  color: #999;
}

.color-grey-6 {
  color: #999;
}

.font-12 {
  font-size: 12px;
}
/* ========== 结束：项目进度条样式 (PROJECT_STEPS_PROGRESS_STYLES) ========== */

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

/* ========== 开始：项目里程碑跟踪样式 (PROJECT_MILESTONE_TRACKING_STYLES) ========== */
.milestone-tracking-content {
  padding: 20px 0;
}

.permission-notice {
  margin-bottom: 24px;
}

.milestone-timeline {
  position: relative;
  padding-left: 40px;
}

.milestone-item {
  position: relative;
  margin-bottom: 32px;
  display: flex;
  align-items: flex-start;
}

.milestone-item:last-child {
  margin-bottom: 0;
}

/* 时间轴连接线 */
.timeline-connector {
  position: absolute;
  left: -32px;
  top: 24px;
  bottom: -32px;
  width: 2px;
  background: #e4e7ed;
  z-index: 0;
}

.milestone-item.milestone-completed .timeline-connector {
  background: #67c23a;
}

.milestone-item.milestone-in-progress .timeline-connector {
  background: linear-gradient(to bottom, #67c23a 0%, #67c23a 50%, #e4e7ed 50%);
}

/* 里程碑标记 */
.milestone-marker {
  position: absolute;
  left: -40px;
  top: 0;
  width: 24px;
  height: 24px;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.marker-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 2px solid #e4e7ed;
  color: #e4e7ed;
  font-size: 14px;
}

.marker-icon.completed {
  background: #67c23a;
  border-color: #67c23a;
  color: white;
}

.marker-icon.in-progress {
  border-color: #409eff;
  position: relative;
}

.pulse-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #409eff;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.2);
  }
}

/* 里程碑卡片 */
.milestone-card {
  flex: 1;
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-left: 4px solid #e4e7ed;
  transition: all 0.3s ease;
}

.milestone-item.milestone-completed .milestone-card {
  border-left-color: #67c23a;
}

.milestone-item.milestone-in-progress .milestone-card {
  border-left-color: #409eff;
}

.milestone-item.milestone-delayed .milestone-card {
  border-left-color: #f56c6c;
}

.milestone-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.milestone-header {
  margin-bottom: 16px;
}

.milestone-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.milestone-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.milestone-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  font-size: 14px;
  color: #666;
}

.milestone-date {
  display: flex;
  align-items: center;
  gap: 4px;
}

.milestone-actual-date {
  color: #67c23a;
}

.milestone-delay {
  color: #f56c6c;
  font-weight: 500;
}

.milestone-description {
  margin-bottom: 16px;
  color: #666;
  line-height: 1.6;
}

.milestone-description p {
  margin: 0;
}

/* 交付物列表 */
.milestone-deliverables {
  margin-bottom: 16px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 6px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.deliverables-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.deliverables-list li {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 0;
  color: #666;
  font-size: 14px;
}

/* 敏感信息区域 */
.milestone-sensitive-info {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px dashed #e4e7ed;
}

.sensitive-section {
  margin-bottom: 20px;
}

.sensitive-section:last-child {
  margin-bottom: 0;
}

.progress-detail {
  padding: 12px;
  background: #f8f9fa;
  border-radius: 6px;
}

.progress-note {
  margin: 8px 0 0 0;
  font-size: 13px;
  color: #666;
}

/* 沟通记录 */
.communications-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.communication-item {
  padding: 12px;
  background: #f8f9fa;
  border-radius: 6px;
  border-left: 3px solid #409eff;
}

.comm-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
  font-size: 13px;
}

.comm-author {
  font-weight: 600;
  color: #409eff;
}

.comm-time {
  color: #999;
}

.comm-content {
  margin: 0;
  color: #666;
  line-height: 1.5;
  font-size: 14px;
}

/* 内部备注 */
.internal-notes {
  padding: 12px;
  background: #fff7e6;
  border-radius: 6px;
  border-left: 3px solid #faad14;
}

.internal-notes p {
  margin: 0;
  color: #666;
  line-height: 1.6;
  font-size: 14px;
}

/* 敏感附件 */
.attachments-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.attachments-list .attachment-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 4px;
}

/* 敏感信息占位符 */
.sensitive-info-placeholder {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px dashed #e4e7ed;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .milestone-timeline {
    padding-left: 30px;
  }
  
  .milestone-marker {
    left: -30px;
  }
  
  .timeline-connector {
    left: -22px;
  }
  
  .milestone-title-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .milestone-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
/* 里程碑操作按钮区域 */
.milestone-actions {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e4e7ed;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.milestone-actions .el-button {
  display: flex;
  align-items: center;
  gap: 6px;
}

/* 里程碑操作弹窗样式 */
.progress-input-group {
  display: flex;
  align-items: center;
  gap: 16px;
}

.progress-input-group .el-slider {
  flex: 1;
}

.progress-text {
  min-width: 60px;
  text-align: right;
  font-weight: 600;
  color: #409eff;
  font-size: 16px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 里程碑卡片缩略版样式优化 */
.milestone-header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.milestone-description-short {
  margin: 12px 0;
}

.milestone-description-short p {
  margin: 0;
  color: #666;
  font-size: 14px;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.milestone-summary {
  display: flex;
  gap: 16px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px dashed #f0f0f0;
}

.milestone-summary .summary-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #666;
  font-size: 13px;
}

/* ========== 开始：里程碑详情弹窗样式 (MILESTONE_DETAIL_DIALOG_STYLES) ========== */
.milestone-detail-content {
  max-height: 70vh;
  overflow-y: auto;
}

.milestone-detail-content .detail-section {
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #f0f0f0;
}

.milestone-detail-content .detail-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.milestone-detail-content .section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.milestone-detail-content .section-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f274b;
}

.milestone-detail-content .count-badge {
  background: #f0f0f0;
  color: #666;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
}

.milestone-detail-content .description-full {
  color: #666;
  font-size: 14px;
  line-height: 1.8;
  margin: 0 0 16px 0;
}

.milestone-detail-content .meta-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.milestone-detail-content .meta-row {
  display: flex;
  gap: 8px;
  font-size: 14px;
}

.milestone-detail-content .meta-label {
  color: #999;
  min-width: 90px;
}

.milestone-detail-content .text-danger {
  color: #f56c6c;
}

.milestone-detail-content .deliverables-list-full {
  list-style: none;
  padding: 0;
  margin: 0;
}

.milestone-detail-content .deliverables-list-full li {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  border-bottom: 1px solid #f5f5f5;
}

.milestone-detail-content .deliverables-list-full li:last-child {
  border-bottom: none;
}

.milestone-detail-content .sensitive-section {
  background: #fcfcfc;
  padding: 16px;
  border-radius: 8px;
}

.milestone-detail-content .progress-detail-full {
  margin-top: 12px;
}

.milestone-detail-content .progress-note {
  margin: 8px 0 0 0;
  color: #666;
  font-size: 13px;
}

.milestone-detail-content .communications-list-full {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 12px;
}

.milestone-detail-content .communication-item-full {
  background: #f9f9f9;
  padding: 12px;
  border-radius: 6px;
  border-left: 3px solid #409eff;
}

.milestone-detail-content .comm-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.milestone-detail-content .comm-author {
  font-weight: 600;
  color: #1f274b;
}

.milestone-detail-content .comm-time {
  color: #999;
  font-size: 12px;
}

.milestone-detail-content .comm-content {
  margin: 0;
  color: #666;
  font-size: 14px;
  line-height: 1.6;
}

.milestone-detail-content .internal-notes-full {
  background: #f9f9f9;
  padding: 12px;
  border-radius: 6px;
  margin-top: 12px;
}

.milestone-detail-content .internal-notes-full p {
  margin: 0;
  color: #666;
  font-size: 14px;
  line-height: 1.8;
}

.milestone-detail-content .attachments-list-full {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
}

.milestone-detail-content .attachment-item-full {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #f9f9f9;
  border-radius: 6px;
}
/* ========== 结束：里程碑详情弹窗样式 (MILESTONE_DETAIL_DIALOG_STYLES) ========== */
/* ========== 结束：项目里程碑跟踪样式 (PROJECT_MILESTONE_TRACKING_STYLES) ========== */

@media (max-width: 768px) {
  .content-row {
    flex-direction: column;
  }
  
  .action-section {
    width: 100%;
  }
}
</style>
