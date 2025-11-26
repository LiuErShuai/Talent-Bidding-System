<template>
  <div class="tracker-page">
    <section class="hero-card">
      <div class="hero-info">
        <p class="hero-label">当前项目</p>
        <h1 class="hero-title">{{ projectTitle }}</h1>
        <p class="hero-desc">聚焦产业数字化实践，通过七阶段全流程管理保障高质量交付。</p>
        <div class="hero-meta">
          <div class="meta-item">
            <span class="meta-label">项目编号</span>
            <strong>{{ projectInfo.code }}</strong>
          </div>
          <div class="meta-item">
            <span class="meta-label">责任单位</span>
            <strong>{{ projectInfo.owner }}</strong>
          </div>
          <div class="meta-item">
            <span class="meta-label">项目经理</span>
            <strong>{{ projectInfo.manager }}</strong>
          </div>
        </div>
      </div>
      <div class="hero-progress">
        <el-progress
          type="dashboard"
          :percentage="projectProgress"
          :width="170"
          :color="progressColors"
        />
        <div class="progress-text">
          <span class="progress-status">{{ progressStatusLabel }}</span>
          <small>平均完成度</small>
        </div>
      </div>
    </section>

    <section class="stage-steps-card">
      <el-card shadow="never">
        <template #header>
          <div class="card-header">
            <span>阶段轨迹</span>
            <div class="card-extra">
              <el-tag type="info">共 {{ milestones.length }} 个里程碑</el-tag>
              <el-tag type="success">交付物 {{ totalDeliverables }} 份</el-tag>
            </div>
          </div>
        </template>
        <el-steps :active="stepActiveIndex" align-center>
          <el-step
            v-for="stage in milestones"
            :key="stage.id"
            :title="stage.title"
            :description="stage.shortCode"
            :status="mapStepStatus(stage.status)"
          />
        </el-steps>
      </el-card>
    </section>

    <section class="stage-highlight">
      <el-row :gutter="20">
        <el-col :xs="24" :md="12">
          <el-card class="highlight-card current" v-if="currentStage">
            <div class="card-header">
              <span>当前里程碑</span>
              <el-tag :type="statusTagType(currentStage.status)">{{ stageStatusText(currentStage.status) }}</el-tag>
            </div>
            <h2 class="stage-title">{{ currentStage.title }}</h2>
            <p class="stage-desc">{{ truncateDescription(currentStage.description, 110) }}</p>
            <div class="stage-meta">
              <div class="meta-item">
                <span>计划周期</span>
                <strong>{{ currentStage.period }}</strong>
              </div>
              <div class="meta-item" v-if="currentStage.owner">
                <span>责任人</span>
                <strong>{{ currentStage.owner.name }} · {{ currentStage.owner.role }}</strong>
              </div>
              <div class="meta-item">
                <span>剩余/逾期天数</span>
                <strong :class="{ overdue: remainInfo.overdue }">
                  {{ remainInfo.text }}
                </strong>
              </div>
            </div>
            <div class="stage-summary">
              <div class="summary-item">
                <span>完成度</span>
                <strong>{{ currentStage.progress }}%</strong>
              </div>
              <div class="summary-item">
                <span>交付物</span>
                <strong>{{ currentStage.deliverables.length }}</strong>
              </div>
              <div class="summary-item">
                <span>风险等级</span>
                <el-tag :type="riskTagType(currentStage.riskLevel)" effect="plain">{{ riskLabel(currentStage.riskLevel) }}</el-tag>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :xs="24" :md="12">
          <el-card class="highlight-card upcoming">
            <div class="card-header">
              <span>下一个动作</span>
              <el-tag type="warning" v-if="nextStage">准备中</el-tag>
            </div>
            <template v-if="nextStage">
              <h2 class="stage-title">{{ nextStage.title }}</h2>
              <p class="stage-desc">{{ truncateDescription(nextStage.description, 120) }}</p>
              <ul class="checklist">
                <li v-for="task in nextStage.processChecklist" :key="task.id">
                  <span class="bullet" />
                  <div class="check-content">
                    <p>{{ task.text }}</p>
                    <small>{{ task.done ? '完成' : '待启动' }}</small>
                  </div>
                </li>
              </ul>
            </template>
            <div v-else class="empty-state">
              <p>所有里程碑均已完成，等待成果确认。</p>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </section>

    <section class="milestone-grid">
      <div class="section-title">
        <h3>里程碑看板</h3>
        <p>整体追踪交付状态，可随时展开查看详情</p>
      </div>
      <el-row :gutter="20">
        <el-col
          v-for="stage in milestones"
          :key="stage.id"
          :xs="24"
          :sm="12"
          :lg="8"
        >
          <el-card
            class="milestone-card"
            :class="[`status-${stage.status}`]"
            shadow="hover"
          >
            <!-- 里程碑标题行 -->
            <div class="milestone-title-row">
              <h4 class="milestone-title">{{ stage.title }}</h4>
              <div class="milestone-actions-header">
                <el-tag :type="statusTagType(stage.status)" size="small">
                  {{ stageStatusText(stage.status) }}
                </el-tag>
                <el-button
                  type="primary"
                  size="small"
                  text
                  @click="openMilestone(stage)"
                >
                  查看详情
                  <el-icon><ArrowRight /></el-icon>
                </el-button>
              </div>
            </div>

            <!-- 计划日期 -->
            <div class="milestone-meta-date">
              <el-icon><Calendar /></el-icon>
              <span>{{ stage.period }}</span>
            </div>

            <!-- 缩略描述（最多2行） -->
            <div class="milestone-description-short">
              <p class="description-text">{{ truncateDescription(stage.description, 100) }}</p>
            </div>

            <!-- 交付物数量提示 -->
            <div class="milestone-info-row">
              <div v-if="stage.deliverables && stage.deliverables.length > 0" class="milestone-deliverables-count">
                <el-icon><Document /></el-icon>
                <span>交付物：{{ stage.deliverables.length }} 项</span>
              </div>
              <!-- 过程任务清单提示 -->
              <div v-if="stage.processChecklist && stage.processChecklist.length > 0" class="sub-milestones-hint">
                <el-icon><List /></el-icon>
                <span>{{ stage.processChecklist.length }} 个过程任务</span>
              </div>
            </div>

            <!-- 进度条 -->
            <div class="milestone-progress-bar">
              <el-progress
                :percentage="stage.progress"
                :status="stage.progress === 100 ? 'success' : undefined"
                :stroke-width="6"
              />
            </div>
          </el-card>
        </el-col>
      </el-row>
    </section>

    <!-- 里程碑详情弹窗 -->
    <el-dialog
      v-model="detailVisible"
      :title="detailTitle"
      width="950px"
      :close-on-click-modal="false"
      destroy-on-close
    >
      <div v-if="selectedMilestone" class="milestone-detail-content">
        <!-- 基本信息 -->
        <div class="detail-section">
          <div class="section-header">
            <h4>基本信息</h4>
            <el-tag :type="statusTagType(selectedMilestone.status)" size="small">
              {{ stageStatusText(selectedMilestone.status) }}
            </el-tag>
          </div>
          <div class="section-content">
            <p class="description-full">{{ selectedMilestone.description }}</p>
            <div class="meta-info">
              <div class="meta-row">
                <span class="meta-label">阶段编码：</span>
                <span>{{ selectedMilestone.shortCode }}</span>
              </div>
              <div class="meta-row">
                <span class="meta-label">计划周期：</span>
                <span>{{ selectedMilestone.period }}</span>
              </div>
              <div v-if="selectedMilestone.owner" class="meta-row">
                <span class="meta-label">责任人：</span>
                <span>{{ selectedMilestone.owner.name }} · {{ selectedMilestone.owner.role }}</span>
              </div>
              <div class="meta-row">
                <span class="meta-label">风险等级：</span>
                <el-tag :type="riskTagType(selectedMilestone.riskLevel)" effect="plain" size="small">
                  {{ riskLabel(selectedMilestone.riskLevel) }}
                </el-tag>
              </div>
            </div>
          </div>
        </div>

        <!-- 交付物列表 -->
        <div v-if="selectedMilestone.deliverables && selectedMilestone.deliverables.length > 0" class="detail-section">
          <div class="section-header">
            <h4>交付物</h4>
            <span class="count-badge">{{ selectedMilestone.deliverables.length }} 项</span>
          </div>
          <div class="section-content">
            <ul class="deliverables-list-full">
              <li v-for="(deliverable, idx) in selectedMilestone.deliverables" :key="idx">
                <div class="deliverable-info">
                  <el-icon><Document /></el-icon>
                  <div>
                    <strong>{{ deliverable.name }}</strong>
                    <p class="deliverable-type">{{ deliverable.type }}</p>
                  </div>
                </div>
                <el-tag
                  :type="deliverable.status === 'approved' ? 'success' : deliverable.status === 'review' ? 'warning' : 'info'"
                  size="small"
                >
                  {{ deliverable.status === 'approved' ? '已通过' : deliverable.status === 'review' ? '审核中' : '草稿' }}
                </el-tag>
              </li>
            </ul>
          </div>
        </div>

        <!-- 过程任务清单 -->
        <div v-if="selectedMilestone.processChecklist && selectedMilestone.processChecklist.length > 0" class="detail-section">
          <div class="section-header">
            <h4>过程任务</h4>
            <span class="count-badge">{{ selectedMilestone.processChecklist.length }} 个</span>
          </div>
          <div class="section-content">
            <div class="sub-milestones-list">
              <div
                v-for="(task, idx) in selectedMilestone.processChecklist"
                :key="task.id"
                class="sub-milestone-item"
              >
                <div class="sub-milestone-header">
                  <span class="sub-milestone-title">{{ task.text }}</span>
                  <el-tag
                    :type="task.done ? 'success' : 'info'"
                    size="small"
                  >
                    {{ task.done ? '已完成' : '待开始' }}
                  </el-tag>
                </div>
                <div v-if="task.time" class="sub-milestone-meta">
                  <span>时间：{{ task.time }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 敏感信息区域：仅项目参与者可见 -->
        <div v-if="isProjectParticipant" class="detail-section sensitive-section">
          <el-divider>
            <el-icon><Lock /></el-icon>
            <span>项目参与者信息</span>
          </el-divider>

          <!-- 详细进度信息 -->
          <div v-if="selectedMilestone.progressDetail" class="section-content">
            <div class="section-header">
              <h4>详细进度</h4>
            </div>
            <div class="progress-detail-full">
              <el-progress
                :percentage="selectedMilestone.progressDetail.percentage"
                :status="selectedMilestone.progressDetail.status"
                :stroke-width="10"
              />
              <p class="progress-note">{{ selectedMilestone.progressDetail.note }}</p>
            </div>
          </div>

          <!-- 内部沟通记录 -->
          <div v-if="selectedMilestone.communications && selectedMilestone.communications.length > 0" class="section-content">
            <div class="section-header">
              <h4>沟通记录</h4>
              <span class="count-badge">{{ selectedMilestone.communications.length }} 条</span>
            </div>
            <div class="communications-list-full">
              <div
                v-for="(comm, idx) in selectedMilestone.communications"
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
          <div v-if="selectedMilestone.internalNotes" class="section-content">
            <div class="section-header">
              <h4>内部备注</h4>
            </div>
            <div class="internal-notes-full">
              <p>{{ selectedMilestone.internalNotes }}</p>
            </div>
          </div>

          <!-- 内部附件 -->
          <div v-if="selectedMilestone.sensitiveAttachments && selectedMilestone.sensitiveAttachments.length > 0" class="section-content">
            <div class="section-header">
              <h4>内部附件</h4>
              <span class="count-badge">{{ selectedMilestone.sensitiveAttachments.length }} 个</span>
            </div>
            <div class="attachments-list-full">
              <div
                v-for="(attachment, idx) in selectedMilestone.sensitiveAttachments"
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

        <!-- 公开附件 -->
        <div v-if="selectedMilestone.attachments && selectedMilestone.attachments.length > 0" class="detail-section">
          <div class="section-header">
            <h4>公开附件</h4>
          </div>
          <div class="section-content">
            <div class="attachments-list-full">
              <el-link
                v-for="file in selectedMilestone.attachments"
                :key="file.name"
                type="primary"
                :href="file.url"
                target="_blank"
              >
                {{ file.name }}
              </el-link>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="detailVisible = false">关闭</el-button>
          <el-button type="primary">导出里程碑报告</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import {
  Calendar,
  Document,
  ArrowRight,
  List,
  Lock
} from '@element-plus/icons-vue'

// 里程碑状态映射信息
const STAGE_STATUS_TEXT = {
  completed: '已完成',
  'in-progress': '进行中',
  pending: '待开始',
  delayed: '逾期'
}

const route = useRoute()

// 模拟用户是否为项目参与者（实际应从用户权限中获取）
const isProjectParticipant = ref(true)

const projectTitle = ref('智慧交通数字孪生项目')
const projectInfo = ref({
  code: 'RB-2024-0913',
  owner: '星辰城市科技',
  manager: '林一舟'
})

const progressColors = [
  { color: '#67c23a', percentage: 30 },
  { color: '#409eff', percentage: 60 },
  { color: '#e6a23c', percentage: 85 },
  { color: '#f56c6c', percentage: 100 }
]

const milestones = ref([
  {
    id: 'stage-1',
    title: '揭榜征集',
    shortCode: 'S1',
    code: 'BIDDING',
    description: '学生查看并提交揭榜申请，企业/学校审核通过后确定承接方。',
    period: '2024/07/15 - 2024/08/05',
    startDate: '2024-07-15',
    endDate: '2024-08-05',
    deliverables: [
      { name: '揭榜申请表', type: 'DOC', status: 'approved' },
      { name: '审核结果通知', type: 'PDF', status: 'approved' }
    ],
    processChecklist: [
      { id: 's1-1', text: '宣讲会完成', done: true, time: '2024-07-16' },
      { id: 's1-2', text: '导师分配确认', done: true, time: '2024-07-20' },
      { id: 's1-3', text: '企业初审', done: true, time: '2024-08-01' }
    ],
    attachments: [{ name: '宣讲回放.mp4', url: '#' }],
    tags: ['招生', '导师匹配'],
    owner: { role: '教务中心', name: '陈晓' },
    riskLevel: 'low',
    status: 'completed',
    progress: 100,
    isSensitive: false,
    progressDetail: {
      percentage: 100,
      status: 'success',
      note: '所有申请已审核完毕，承接方已确定'
    },
    communications: [
      {
        author: '陈晓',
        time: '2024-07-25 14:30',
        content: '本次揭榜共收到12份申请，质量整体较高'
      }
    ],
    internalNotes: '本期导师资源充足，匹配顺利',
    sensitiveAttachments: []
  },
  {
    id: 'stage-2',
    title: '方案提交',
    shortCode: 'S2',
    code: 'PROPOSAL',
    description: '提交项目实施方案，包括技术方案、实施计划、团队分工等，经多角色评审后确定最终方案。',
    period: '2024/08/06 - 2024/08/20',
    startDate: '2024-08-06',
    endDate: '2024-08-20',
    deliverables: [
      { name: '实施方案包', type: 'ZIP', status: 'approved' },
      { name: '评审意见清单', type: 'DOC', status: 'approved' }
    ],
    processChecklist: [
      { id: 's2-1', text: '需求澄清会', done: true, time: '2024-08-07' },
      { id: 's2-2', text: '系统设计稿', done: true, time: '2024-08-12' },
      { id: 's2-3', text: '团队提交方案', done: true, time: '2024-08-15' },
      { id: 's2-4', text: '多轮答辩', done: true, time: '2024-08-19' }
    ],
    attachments: [{ name: '方案合集.zip', url: '#' }],
    tags: ['方案', '评审'],
    owner: { role: '评审专家', name: '王岚' },
    riskLevel: 'medium',
    status: 'completed',
    progress: 100,
    isSensitive: false,
    progressDetail: {
      percentage: 100,
      status: 'success',
      note: '方案已通过评审，获得专家组一致认可'
    },
    communications: [
      {
        author: '王岚',
        time: '2024-08-19 16:00',
        content: '方案整体架构合理，技术选型得当，建议在安全性方面加强'
      }
    ],
    internalNotes: '评审过程顺利，团队表现优秀',
    sensitiveAttachments: [
      { name: '评审专家意见汇总.docx', size: '2.3MB' }
    ]
  },
  {
    id: 'stage-3',
    title: '中期答辩',
    shortCode: 'S3',
    code: 'MIDTERM',
    description: '项目中期检查，展示项目进展和阶段性成果，专家评审并提出优化建议。',
    period: '2024/10/16 - 2024/10/25',
    startDate: '2024-10-16',
    endDate: '2024-10-25',
    deliverables: [
      { name: '中期答辩PPT', type: 'PPT', status: 'approved' },
      { name: '阶段成果包', type: 'ZIP', status: 'approved' },
      { name: '评审结论', type: 'DOC', status: 'review' }
    ],
    processChecklist: [
      { id: 's3-1', text: '周报/月报跟进', done: true, time: '2024-08-21 - 2024-10-15' },
      { id: 's3-2', text: '核心功能开发', done: true, time: '2024-09-30' },
      { id: 's3-3', text: '提交中期材料', done: true, time: '2024-10-16' },
      { id: 's3-4', text: '专家评审会议', done: true, time: '2024-10-22' },
      { id: 's3-5', text: '结论归档', done: false }
    ],
    attachments: [{ name: '专家名单.xlsx', url: '#' }],
    tags: ['评审', '优化'],
    owner: { role: '专家委员会', name: '孙赫' },
    riskLevel: 'medium',
    status: 'in-progress',
    progress: 78,
    isSensitive: false,
    progressDetail: {
      percentage: 78,
      status: 'warning',
      note: '中期答辩已完成，等待评审结论归档'
    },
    communications: [
      {
        author: '孙赫',
        time: '2024-10-22 15:30',
        content: '项目进度符合预期，建议加强性能优化'
      },
      {
        author: '林一舟',
        time: '2024-10-23 09:00',
        content: '已记录专家建议，将在后续开发中重点关注'
      }
    ],
    internalNotes: '中期进展良好，团队执行力强',
    sensitiveAttachments: [
      { name: '中期评审打分表.xlsx', size: '1.2MB' }
    ]
  },
  {
    id: 'stage-4',
    title: '成果提交',
    shortCode: 'S4',
    code: 'DELIVERY',
    description: '提交最终项目成果，包括代码包、文档、测试报告等，完成学校初审。',
    period: '2024/10/26 - 2024/11/20',
    startDate: '2024-10-26',
    endDate: '2024-11-20',
    deliverables: [
      { name: '成果代码仓', type: 'Git', status: 'draft' },
      { name: '技术文档', type: 'PDF', status: 'draft' },
      { name: '运维手册', type: 'DOC', status: 'draft' },
      { name: '测试报告', type: 'PDF', status: 'draft' }
    ],
    processChecklist: [
      { id: 's4-1', text: '成果物料打包', done: false },
      { id: 's4-2', text: '代码质量检查', done: false },
      { id: 's4-3', text: '文档完整性审核', done: false },
      { id: 's4-4', text: '合规复检', done: false }
    ],
    attachments: [],
    tags: ['成果', '合规'],
    owner: { role: '交付团队', name: '高然' },
    riskLevel: 'high',
    status: 'pending',
    progress: 20,
    isSensitive: true,
    progressDetail: {
      percentage: 20,
      status: 'exception',
      note: '成果整理中，注意截止日期临近'
    },
    communications: [],
    internalNotes: '需要加快进度，确保按时提交',
    sensitiveAttachments: []
  },
  {
    id: 'stage-5',
    title: '成果评审',
    shortCode: 'S5',
    code: 'REVIEW',
    description: '企业+专家联合评审，评分并生成评审结果，确定项目排名。',
    period: '2024/11/21 - 2024/12/05',
    startDate: '2024-11-21',
    endDate: '2024-12-05',
    deliverables: [
      { name: '评审打分表', type: 'XLS', status: 'draft' },
      { name: '评审报告', type: 'PDF', status: 'draft' }
    ],
    processChecklist: [
      { id: 's5-1', text: '专家打分', done: false },
      { id: 's5-2', text: '企业评分', done: false },
      { id: 's5-3', text: '结果确认', done: false },
      { id: 's5-4', text: '排名生成', done: false }
    ],
    attachments: [],
    tags: ['评审', '排名'],
    owner: { role: '企业评审团', name: '徐萌' },
    riskLevel: 'high',
    status: 'pending',
    progress: 0,
    isSensitive: true,
    progressDetail: {
      percentage: 0,
      status: 'info',
      note: '等待成果提交完成后启动评审'
    },
    communications: [],
    internalNotes: '',
    sensitiveAttachments: []
  },
  {
    id: 'stage-6',
    title: '结项公示',
    shortCode: 'S6',
    code: 'ANNOUNCEMENT',
    description: '结果公示、处理申诉、协议签订、费用结算。',
    period: '2024/12/06 - 2024/12/20',
    startDate: '2024-12-06',
    endDate: '2024-12-20',
    deliverables: [
      { name: '公示文件', type: 'PDF', status: 'draft' },
      { name: '项目协议', type: 'PDF', status: 'draft' },
      { name: '结算单据', type: 'XLS', status: 'draft' }
    ],
    processChecklist: [
      { id: 's6-1', text: '评审结果公示', done: false },
      { id: 's6-2', text: '申诉处理', done: false },
      { id: 's6-3', text: '协议签订', done: false },
      { id: 's6-4', text: '费用结算', done: false }
    ],
    attachments: [],
    tags: ['公示', '协议', '结算'],
    owner: { role: '项目管理办公室', name: '张华' },
    riskLevel: 'medium',
    status: 'pending',
    progress: 0,
    isSensitive: true,
    progressDetail: {
      percentage: 0,
      status: 'info',
      note: '等待评审完成后启动公示流程'
    },
    communications: [],
    internalNotes: '',
    sensitiveAttachments: []
  },
  {
    id: 'stage-7',
    title: '任务完成',
    shortCode: 'S7',
    code: 'COMPLETION',
    description: '完成验收签署、费用结算、经验复盘，标志项目顺利结束。',
    period: '2024/12/21 - 2024/12/31',
    startDate: '2024-12-21',
    endDate: '2024-12-31',
    deliverables: [
      { name: '验收确认单', type: 'PDF', status: 'draft' },
      { name: '项目复盘报告', type: 'DOC', status: 'draft' }
    ],
    processChecklist: [
      { id: 's7-1', text: '验收确认单签署', done: false },
      { id: 's7-2', text: '最终款项结算', done: false },
      { id: 's7-3', text: '项目复盘会议', done: false },
      { id: 's7-4', text: '归档整理', done: false }
    ],
    attachments: [],
    tags: ['验收', '复盘'],
    owner: { role: '项目经理', name: '林一舟' },
    riskLevel: 'low',
    status: 'pending',
    progress: 0,
    isSensitive: false,
    progressDetail: {
      percentage: 0,
      status: 'info',
      note: '等待前序阶段完成'
    },
    communications: [],
    internalNotes: '',
    sensitiveAttachments: []
  }
])

const detailVisible = ref(false)
const selectedMilestone = ref(null)
const detailTitle = computed(() => selectedMilestone.value?.title || '里程碑详情')

// 计算总体进度（四舍五入便于展示）
const projectProgress = computed(() => {
  const total = milestones.value.reduce((sum, stage) => sum + stage.progress, 0)
  return Math.round(total / milestones.value.length)
})

const progressStatusLabel = computed(() => {
  if (projectProgress.value >= 90) return '冲刺收尾'
  if (projectProgress.value >= 70) return '稳态推进'
  if (projectProgress.value >= 40) return '按计划推进'
  return '待加速'
})

const totalDeliverables = computed(() =>
  milestones.value.reduce((sum, stage) => sum + stage.deliverables.length, 0)
)

const currentStage = computed(() => {
  return (
    milestones.value.find(stage => stage.status === 'in-progress') ||
    milestones.value.find(stage => stage.status === 'pending') ||
    milestones.value[milestones.value.length - 1]
  )
})

const nextStage = computed(() => {
  if (!currentStage.value) return null
  const index = milestones.value.findIndex(stage => stage.id === currentStage.value.id)
  return milestones.value[index + 1] || null
})

const remainInfo = computed(() => {
  if (!currentStage.value) {
    return { text: '—', overdue: false }
  }
  return calculateRemainingDays(currentStage.value.endDate)
})

const stepActiveIndex = computed(() => {
  const progressIndex = milestones.value.findIndex(stage => stage.status === 'in-progress')
  if (progressIndex !== -1) return progressIndex
  const pendingIndex = milestones.value.findIndex(stage => stage.status === 'pending')
  if (pendingIndex !== -1) return Math.max(pendingIndex - 1, 0)
  return milestones.value.length - 1
})

const openMilestone = stage => {
  selectedMilestone.value = stage
  detailVisible.value = true
}

const mapStepStatus = status => {
  if (status === 'completed') return 'finish'
  if (status === 'in-progress') return 'process'
  if (status === 'delayed') return 'error'
  return 'wait'
}

const statusTagType = status => {
  switch (status) {
    case 'completed':
      return 'success'
    case 'in-progress':
      return 'primary'
    case 'pending':
      return 'info'
    case 'delayed':
      return 'danger'
    default:
      return 'info'
  }
}

const riskTagType = level => {
  if (level === 'high') return 'danger'
  if (level === 'medium') return 'warning'
  return 'success'
}

const riskLabel = level => {
  if (level === 'high') return '高风险'
  if (level === 'medium') return '中风险'
  return '低风险'
}

const stageStatusText = status => STAGE_STATUS_TEXT[status] || '未知'

const truncateDescription = (text, limit = 60) => {
  if (!text) return ''
  return text.length > limit ? `${text.slice(0, limit)}...` : text
}

// 计算剩余天数，返回包含提示文本与是否逾期的对象
const calculateRemainingDays = dateStr => {
  const end = new Date(dateStr)
  const now = new Date()
  const diffTime = end.getTime() - now.getTime()
  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  if (days >= 0) {
    return { text: `${days} 天`, overdue: false }
  }
  return { text: `逾期 ${Math.abs(days)} 天`, overdue: true }
}

// 根据路由参数动态覆盖项目标题
const projectId = route.params.projectId
if (projectId) {
  projectTitle.value = `智慧交通数字孪生项目 · ${projectId}`
}
</script>

<style scoped>
.tracker-page {
  padding: 24px;
  padding-bottom: 40px;
  background: #f5f7fb;
}

.hero-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #1f7ae0, #5ab1ff);
  border-radius: 20px;
  padding: 32px;
  margin-bottom: 24px;
  color: #fff;
}

.hero-info {
  max-width: 60%;
}

.hero-label {
  font-size: 14px;
  opacity: 0.8;
  margin-bottom: 4px;
}

.hero-title {
  font-size: 28px;
  margin-bottom: 12px;
}

.hero-desc {
  font-size: 15px;
  margin-bottom: 18px;
  opacity: 0.9;
}

.hero-meta {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  flex-direction: column;
  font-size: 13px;
  opacity: 0.9;
}

.meta-item strong {
  font-size: 18px;
  color: #fff;
}

.hero-progress {
  text-align: center;
}

.progress-text {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  text-align: center;
}

.progress-status {
  font-size: 18px;
  font-weight: 600;
}

.stage-steps-card,
.stage-highlight,
.milestone-grid {
  margin-bottom: 24px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-extra {
  display: flex;
  gap: 8px;
}

.highlight-card {
  border-radius: 16px;
  min-height: 100%;
}

.highlight-card.current {
  background: #fff;
}

.highlight-card.upcoming {
  background: #fff9f0;
}

.stage-title {
  font-size: 20px;
  margin: 8px 0;
}

.stage-desc {
  font-size: 14px;
  color: #666;
  margin-bottom: 16px;
}

.stage-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  font-size: 13px;
  color: #999;
  margin-bottom: 16px;
}

.stage-meta strong {
  display: block;
  font-size: 15px;
  color: #333;
}

.stage-meta .overdue {
  color: #f56c6c;
}

.stage-summary {
  display: flex;
  gap: 16px;
  border-top: 1px dashed #e4e7ed;
  padding-top: 16px;
}

.summary-item span {
  display: block;
  font-size: 12px;
  color: #999;
}

.summary-item strong {
  font-size: 18px;
}

.checklist {
  list-style: none;
  padding: 0;
  margin: 0;
}

.checklist li {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  margin-bottom: 12px;
}

.checklist .bullet {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #ffc046;
  margin-top: 6px;
}

.check-content p {
  margin: 0;
  font-size: 14px;
  color: #444;
}

.check-content small {
  color: #999;
}

.empty-state {
  text-align: center;
  color: #999;
  padding: 24px 0;
}

.section-title h3 {
  margin: 0;
}

.section-title p {
  margin: 4px 0 16px;
  color: #888;
}

/* 里程碑卡片优化样式 */
.milestone-card {
  border-radius: 12px;
  min-height: 260px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.milestone-card.status-completed {
  border: 1px solid #e1f3d8;
}

.milestone-card.status-in-progress {
  border: 1px solid #d9ecff;
}

.milestone-card.status-delayed {
  border: 1px solid #fde2e2;
}

.milestone-title-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
}

.milestone-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f274b;
  flex: 1;
}

.milestone-actions-header {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.milestone-meta-date {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #999;
  margin-top: -4px;
}

.milestone-description-short {
  margin: 8px 0;
}

.milestone-description-short .description-text {
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

.milestone-info-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 8px;
}

.milestone-deliverables-count {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #666;
  font-size: 13px;
}

.sub-milestones-hint {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #409eff;
  font-size: 13px;
}

.milestone-progress-bar {
  margin-top: auto;
  padding-top: 8px;
}

/* 里程碑详情弹窗样式 */
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

.milestone-detail-content .deliverables-list-full {
  list-style: none;
  padding: 0;
  margin: 0;
}

.milestone-detail-content .deliverables-list-full li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px;
  border-bottom: 1px solid #f5f5f5;
  border-radius: 6px;
  margin-bottom: 8px;
  background: #fafafa;
}

.milestone-detail-content .deliverables-list-full li:last-child {
  margin-bottom: 0;
}

.milestone-detail-content .deliverable-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.milestone-detail-content .deliverable-info strong {
  font-size: 14px;
  color: #333;
}

.milestone-detail-content .deliverable-type {
  margin: 4px 0 0 0;
  font-size: 12px;
  color: #999;
}

.milestone-detail-content .sub-milestones-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.milestone-detail-content .sub-milestone-item {
  padding: 12px;
  background: #f9f9f9;
  border-radius: 6px;
  border-left: 3px solid #409eff;
}

.milestone-detail-content .sub-milestone-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.milestone-detail-content .sub-milestone-title {
  font-weight: 600;
  color: #1f274b;
  font-size: 14px;
}

.milestone-detail-content .sub-milestone-meta {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #999;
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

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

@media (max-width: 992px) {
  .hero-card {
    flex-direction: column;
    align-items: flex-start;
  }

  .hero-info {
    max-width: 100%;
    margin-bottom: 20px;
  }

  .detail-meta {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .hero-card {
    padding: 24px;
  }

  .hero-title {
    font-size: 22px;
  }

  .stage-summary {
    flex-direction: column;
  }

  .detail-meta {
    grid-template-columns: 1fr;
  }
}
</style>