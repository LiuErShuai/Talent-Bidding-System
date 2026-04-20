<template>
  <div class="myproject-page">
    <div class="myproject-container">
      <div class="myproject-layout">
        <!-- 侧边栏：学生与企业展示不同 -->
        <aside class="sidebar">
          <!-- 学生端侧边栏 -->
          <template v-if="userRole === 'student'">
            <div class="sidebar-section">
              <div class="sidebar-title">我的项目</div>
              <button
                class="sidebar-item"
                :class="{ active: activeModule === 'projects' }"
                @click="activeModule = 'projects'"
              >
                我承接的项目 ({{ projects.length }})
              </button>
              <button
                class="sidebar-item"
                :class="{ active: activeModule === 'bids' }"
                @click="activeModule = 'bids'"
              >
                我的揭榜 ({{ bids.length }})
              </button>
            </div>

            <div class="sidebar-section">
              <div class="sidebar-title">我的团队</div>
              <button
                class="sidebar-item"
                :class="{ active: activeModule === 'team' && activeTeamCategory === 'owned' }"
                @click="setTeamModule('owned')"
              >
                我负责的
              </button>
              <button
                class="sidebar-item"
                :class="{ active: activeModule === 'team' && activeTeamCategory === 'joined' }"
                @click="setTeamModule('joined')"
              >
                我参与的
              </button>
            </div>

            <!--
            <div class="sidebar-section">
              <div class="sidebar-title">我的数据</div>
              <button
                class="sidebar-item"
                :class="{ active: activeModule === 'data' && activeData === 'radar' }"
                @click="setDataModule('radar')"
              >
                能力雷达图
              </button>
              <button
                class="sidebar-item"
                :class="{ active: activeModule === 'data' && activeData === 'stats' }"
                @click="setDataModule('stats')"
              >
                项目统计
              </button>
              <button
                class="sidebar-item"
                :class="{ active: activeModule === 'data' && activeData === 'income' }"
                @click="setDataModule('income')"
              >
                收入明细
              </button>
            </div>
            -->
          </template>

          <!-- 企业端侧边栏：使用角色标签 -->
          <template v-else>
            <div class="sidebar-section">
              <div class="sidebar-title">我的项目</div>
              <button
                v-for="tab in roleTabs"
                :key="tab.key"
                class="sidebar-item"
                :class="{ active: activeRoleTab === tab.key }"
                @click="activeRoleTab = tab.key"
              >
                {{ tab.label }}
              </button>
            </div>
          </template>
        </aside>

        <!-- 主内容区 -->
        <section class="main-content">
          <!-- 学生端：根据侧边栏切换不同模块 -->
          <template v-if="userRole === 'student'">
            <!-- 我的项目模块 -->
            <div v-if="activeModule === 'projects'">
              <div class="section-header">
                <h2 class="section-title">
                  我承接的项目 ({{ projects.length }})
                </h2>
              </div>

              <!-- 加载状态 -->
              <div v-if="loading" class="loading-state">
                <el-skeleton :rows="3" animated />
              </div>

              <!-- 错误状态 -->
              <div v-else-if="error" class="error-state">
                <el-alert :title="error" type="error" show-icon />
              </div>

              <div v-else class="project-list">
                <article
                  v-for="project in projects"
                  :key="project.id"
                  class="project-card accepted-project-card"
                  @click="viewDetail(project)"
                >
                  <div class="project-card-main">
                    <div class="project-card-body">
                      <div class="project-card-left">
                        <h3 class="project-name">{{ project.name }}</h3>
                        <div class="project-meta-row">
                          <span>阶段：{{ project.currentMilestone || '--' }}</span>
                          <span>团队：{{ project.teamName || '--' }}</span>
                          <span>发布方：{{ project.publisherName || '--' }}</span>
                        </div>
                      </div>

                      <div class="project-card-right">
                        <span class="project-tag" :class="project.status">
                          {{ project.statusText }}
                        </span>
                        <button
                          type="button"
                          class="ghost-chip manage-btn"
                          @click.stop.prevent="manageProject(project)"
                        >
                          管理项目
                        </button>
                      </div>
                    </div>
                  </div>
                </article>

                <div v-if="projects.length === 0" class="empty-state">
                  暂无承接的项目
                </div>
              </div>
            </div>

            <!-- 我的揭榜模块 -->
            <div v-else-if="activeModule === 'bids'">
              <div class="section-header">
                <h2 class="section-title">
                  我的揭榜 ({{ bids.length }})
                </h2>
              </div>

              <!-- 加载状态 -->
              <div v-if="bidsLoading" class="loading-state">
                <el-skeleton :rows="3" animated />
              </div>

              <!-- 错误状态 -->
              <div v-else-if="bidsError" class="error-state">
                <el-alert :title="bidsError" type="error" show-icon />
              </div>

              <div v-else class="project-list">
                <article
                  v-for="bid in bids"
                  :key="bid.bidId"
                  class="project-card bid-project-card"
                  @click="viewBidDetail(bid)"
                >
                  <div class="project-card-main">
                    <div class="project-card-body">
                      <div class="project-card-left">
                        <h3 class="project-name">{{ bid.projectTitle }}</h3>
                        <div class="project-meta-row">
                          <span>发布方：{{ bid.publisherName }}</span>
                          <span>团队：{{ bid.teamName }}</span>
                          <span>当前里程碑：{{ bid.currentMilestone || '--' }}</span>
                          <span>申请时间：{{ formatDate(bid.createdAt) }}</span>
                        </div>
                      </div>

                      <div class="project-card-right">
                        <span class="project-tag" :class="getBidStatusClass(bid.status)">
                          {{ getBidStatusText(bid.status) }}
                        </span>
                        <button
                          type="button"
                          class="ghost-chip manage-btn"
                          @click.stop.prevent="viewBidDetail(bid)"
                        >
                          查看详情
                        </button>
                      </div>
                    </div>
                  </div>
                </article>

                <div v-if="bids.length === 0" class="empty-state">
                  暂无揭榜记录
                </div>
              </div>
            </div>

            <!-- 我的团队模块 -->
            <div v-else-if="activeModule === 'team'">
              <div class="section-header">
                <h2 class="section-title">我的团队</h2>
                <div v-if="activeTeamCategory" class="section-extra">
                  <span class="section-chip" :class="{ primary: activeTeamCategory === 'owned' }">
                    {{ activeTeamCategory === 'owned' ? '负责人视角' : '成员视角' }}
                  </span>
                </div>
              </div>
              <div v-if="!activeTeamCategory" class="empty-state">
                请选择左侧“我负责的”或“我参与的”查看团队
              </div>
              <div v-else class="project-list">
                <article
                  v-for="team in currentTeams"
                  :key="team.id"
                  class="project-card team-card"
                  @click="openTeamDetail(team)"
                >
                  <div class="project-card-main">
                    <div class="project-card-header">
                      <h3 class="project-name">{{ team.name }}</h3>
                      <span class="team-role-chip" :class="{ owner: team.isOwner }">
                        {{ team.isOwner ? '负责人' : '成员' }}
                      </span>
                    </div>

                    <div class="project-meta-row">
                      <span>关联项目：{{ team.project.name }}</span>
                      <span>阶段：{{ team.project.stage }}</span>
                      <span>进度：{{ team.project.progress }}%</span>
                      <span>状态：{{ team.project.statusText }}</span>
                    </div>

                    <div class="project-content-row">
                      <p class="project-brief">{{ team.project.brief }}</p>
                      <button
                        type="button"
                        class="ghost-chip manage-btn"
                        @click.stop.prevent="openTeamDetail(team)"
                      >
                        查看详情
                      </button>
                    </div>
                  </div>
                </article>

                <div v-if="currentTeams.length === 0" class="empty-state">
                  暂无团队数据
                </div>
              </div>
            </div>

            <!-- 我的数据模块 -->
            <div v-else-if="activeModule === 'data'">
              <div class="section-header">
                <h2 class="section-title">我的数据</h2>
              </div>
              <div class="project-list">
                <div class="project-card" v-if="activeData === 'radar'">
                  <div class="project-card-main">
                    <div class="project-card-header">
                      <h3 class="project-name">能力雷达图</h3>
                    </div>
                    <p class="project-brief">从技术、项目管理、团队协作等多维度评估你的综合能力。</p>
                  </div>
                </div>
                <div class="project-card" v-else-if="activeData === 'stats'">
                  <div class="project-card-main">
                    <div class="project-card-header">
                      <h3 class="project-name">项目统计</h3>
                    </div>
                    <p class="project-brief">统计你参与的项目数量、完成率、平均评分等关键指标。</p>
                  </div>
                </div>
                <div class="project-card" v-else-if="activeData === 'income'">
                  <div class="project-card-main">
                    <div class="project-card-header">
                      <h3 class="project-name">收入明细</h3>
                    </div>
                    <p class="project-brief">查看各个项目获得的奖金与收入明细。</p>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <!-- 企业端：保持原有项目列表视图 -->
          <template v-else>
            <div class="section-header">
              <h2 class="section-title">
                进行中的项目 ({{ filteredProjects.length }})
              </h2>
            </div>

            <div class="project-list">
              <article
                v-for="project in filteredProjects"
                :key="project.id"
                class="project-card"
                @click="viewDetail(project)"
              >
                <div class="project-card-main">
                  <div class="project-card-header">
                    <h3 class="project-name">{{ project.name }}</h3>
                    <span class="project-tag" :class="project.status">
                      {{ project.statusText }}
                    </span>
                  </div>

                  <div class="project-meta-row">
                    <span>阶段：{{ project.stageText }}</span>
                    <span>进度：{{ project.progress }}%</span>
                    <span>剩余时间：{{ project.remainDays }}天</span>
                    <span>奖金：￥{{ project.reward.toLocaleString() }}</span>
                  </div>

                  <p class="project-brief">{{ project.brief }}</p>

                  <div class="project-actions-row">
                    <div class="project-actions">
                      <button
                        v-if="project.canUpload"
                        class="primary-chip"
                        @click.stop="uploadDeliverable(project)"
                      >
                        {{ project.uploadLabel }}
                      </button>
                      <button
                        v-if="project.canCollaborate"
                        class="ghost-chip"
                        @click.stop="openTeamCollab(project)"
                      >
                        团队协作
                      </button>
                    </div>
                    <div class="project-progress">
                      <div class="progress-bar">
                        <div
                          class="progress-inner"
                          :style="{ width: project.progress + '%' }"
                        ></div>
                      </div>
                      <span class="progress-text">{{ project.progress }}%</span>
                    </div>
                  </div>
                </div>
              </article>

              <div v-if="filteredProjects.length === 0" class="empty-state">
                暂无符合条件的项目
              </div>
            </div>
          </template>
        </section>
      </div>
    </div>

    <!-- 团队详情弹窗 -->
    <div v-if="teamDialogVisible && selectedTeam" class="team-dialog-overlay">
      <div class="team-dialog">
        <div class="team-dialog-header">
          <div class="dialog-title-area">
            <h3 class="dialog-title">{{ selectedTeam.name }}</h3>
            <div class="dialog-project-block">
              <div class="project-block-title">执行项目</div>
              <div class="dialog-project-row">
                <button class="project-link" @click="goProjectDetail(selectedTeam.project)">
                  关联项目：{{ selectedTeam.project.name }}
                </button>
                <span class="dialog-subtitle-inline">
                  （{{ selectedTeam.project.stage }} / {{ selectedTeam.project.statusText }}）
                </span>
                <span v-if="selectedTeam.project.progress !== undefined" class="dialog-subtitle-inline">
                  · 进度：{{ selectedTeam.project.progress }}%
                </span>
                <span v-if="selectedTeam.project.deadline" class="dialog-subtitle-inline">
                  · 截止：{{ selectedTeam.project.deadline }}
                </span>
              </div>
            </div>
          </div>
          <button class="close-btn" @click="closeTeamDetail">×</button>
        </div>

        <div class="team-dialog-body">
          <div class="dialog-section">
            <h4>团队简介</h4>
            <p class="dialog-text">{{ selectedTeam.description }}</p>
          </div>

          <div class="dialog-section">
            <h4>成员列表</h4>
            <ul class="member-list">
              <li v-for="member in selectedTeam.members" :key="member.name" class="member-item">
                <div class="member-info">
                  <span class="member-name">{{ member.name }}</span>
                  <span class="member-role">{{ member.role }}</span>
                </div>
                <span class="member-duty">{{ member.duty }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- 揭榜详情弹窗 -->
    <div v-if="bidDialogVisible && selectedBid" class="team-dialog-overlay">
      <div class="team-dialog">
        <div class="team-dialog-header">
          <div class="dialog-title-area">
            <h3 class="dialog-title">{{ selectedBid.projectTitle }}</h3>
            <span class="project-tag" :class="getBidStatusClass(selectedBid.status)">
              {{ getBidStatusText(selectedBid.status) }}
            </span>
          </div>
          <button class="close-btn" @click="closeBidDetail">×</button>
        </div>

        <div class="team-dialog-body">
          <div class="dialog-section">
            <h4>揭榜信息</h4>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">团队名称</span>
                <span class="info-value">{{ selectedBid.teamName }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">我的角色</span>
                <span class="info-value">{{ getRoleText(selectedBid.currentUserRole) }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">申请时间</span>
                <span class="info-value">{{ formatDate(selectedBid.createdAt) }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">更新时间</span>
                <span class="info-value">{{ formatDate(selectedBid.updatedAt) }}</span>
              </div>
            </div>
          </div>

          <div class="dialog-section" v-if="selectedBid.content">
            <h4>申请内容</h4>
            <p class="dialog-text">{{ selectedBid.content }}</p>
          </div>

          <div class="dialog-section" v-if="selectedBid.attachmentUrl">
            <h4>附件</h4>
            <a :href="selectedBid.attachmentUrl" target="_blank" class="attachment-link">
              查看附件
            </a>
          </div>

          <div class="dialog-section" v-if="selectedBid.remark">
            <h4>备注</h4>
            <p class="dialog-text">{{ selectedBid.remark }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStudentProjectStore } from '@/store/modules/studentProject'
import { useUserStore } from '@/store'
import { getMyBidsAPI, getBidDetailAPI } from '@/api/project'
import { ElMessage } from 'element-plus'

const router = useRouter()
const studentProjectStore = useStudentProjectStore()
const userStore = useUserStore()

const userRole = computed(() => userStore.userInfo?.type === 2 ? 'enterprise' : 'student')

// 侧边栏和模块切换
const activeModule = ref('projects')
const activeTeamCategory = ref('') // owned | joined，不默认选中
const activeResult = ref('pending') // pending | review | passed
const activeData = ref('radar') // radar | stats | income

// 企业端角色标签（暂时保留，未来可能使用）
const activeRoleTab = ref('published')
const roleTabs = computed(() => {
  const tabs = []
  if (userRole.value === 'enterprise') {
    tabs.push({ key: 'published', label: '我发布的（企业）' })
  }
  return tabs
})

// 临时演示开关：true 使用静态展示数据，false 恢复接口数据
const USE_STATIC_DEMO_DATA = false

/*
// 临时静态项目数据（用于汇报展示）
const staticProjects = ref([
  {
    id: 301,
    name: '工业视觉质检系统（一期）',
    status: 'ongoing',
    statusText: '进行中',
    stageText: '项目执行',
    remainDays: 18,
    publisher: '杭州云启智能科技有限公司',
    brief: '已完成缺陷样本标注与初版模型训练，当前进入产线相机适配与误检率优化阶段。'
  },
  {
    id: 302,
    name: '智慧仓储调度看板',
    status: 'review',
    statusText: '评审中',
    stageText: '中期答辩',
    remainDays: 9,
    publisher: '苏州智澜数据科技有限公司',
    brief: '中期材料已提交，包含任务排程算法说明、看板原型与调度仿真报告。'
  },
  {
    id: 303,
    name: '企业运营后台前端重构',
    status: 'awarded',
    statusText: '已中标',
    stageText: '协议签订',
    remainDays: 26,
    publisher: '南京星河数联科技股份有限公司',
    brief: '完成需求澄清与模块拆分，准备进入权限系统和数据驾驶舱页面开发。'
  },
  {
    id: 304,
    name: '供应链异常预警平台',
    status: 'finished',
    statusText: '已完成',
    stageText: '成果评审',
    remainDays: 0,
    publisher: '广东维拓供应链科技有限公司',
    brief: '项目验收通过，形成异常预警规则库与可视化分析报表，进入成果归档阶段。'
  }
])

// 临时静态团队数据（用于汇报展示）
const staticOwnedTeams = ref([
  {
    id: 901,
    name: '智联协同研发团队',
    isOwner: true,
    description: '面向工业场景的算法与前端联合团队，负责从需求拆解到交付验收的全流程协同。',
    project: {
      id: 301,
      name: '工业视觉质检系统（一期）',
      stage: '项目执行',
      progress: 62,
      statusText: '进行中',
      brief: '聚焦缺陷识别精度提升与现场部署稳定性优化。',
      deadline: '2026-05-12'
    },
    members: [
      { name: '李明轩', role: '负责人', duty: '进度统筹与企业沟通' },
      { name: '周雨桐', role: '算法工程师', duty: '目标检测模型训练' },
      { name: '陈子昂', role: '前端工程师', duty: '质检看板开发' },
      { name: '孙佳怡', role: '测试工程师', duty: '测试用例与回归验证' }
    ]
  }
])

const staticJoinedTeams = ref([
  {
    id: 902,
    name: '云枢前端工程组',
    isOwner: false,
    description: '负责企业运营后台的交互实现与组件体系建设，支撑多角色场景快速交付。',
    project: {
      id: 303,
      name: '企业运营后台前端重构',
      stage: '协议签订',
      progress: 28,
      statusText: '已中标',
      brief: '已完成信息架构评审，正在推进页面骨架与权限路由设计。',
      deadline: '2026-06-03'
    },
    members: [
      { name: '林书航', role: '负责人', duty: '技术方案评审' },
      { name: '王可欣', role: '前端工程师', duty: '组件封装与页面实现' },
      { name: '赵文博', role: '产品助理', duty: '需求跟踪与验收文档' }
    ]
  },
  {
    id: 903,
    name: '工业数据建模小组',
    isOwner: false,
    description: '围绕仓储与供应链场景进行指标建模与可视化分析，提供决策支持能力。',
    project: {
      id: 302,
      name: '智慧仓储调度看板',
      stage: '中期答辩',
      progress: 74,
      statusText: '评审中',
      brief: '关键里程碑已完成，正在整理答辩材料与优化体验细节。',
      deadline: '2026-04-25'
    },
    members: [
      { name: '许嘉禾', role: '负责人', duty: '方案设计与答辩把控' },
      { name: '高思远', role: '数据工程师', duty: '数据清洗与指标建模' },
      { name: '刘若彤', role: '可视化工程师', duty: '图表看板实现' }
    ]
  }
])

// 临时静态揭榜数据（用于汇报展示）
const staticBids = ref([
  {
    bidId: 6001,
    projectTitle: '智慧能源管理驾驶舱',
    status: 'shortlisted',
    publisherName: '上海澄智能源科技有限公司',
    teamName: '能效优化联合小组',
    createdAt: '2026-03-18T10:20:00',
    updatedAt: '2026-04-10T15:30:00',
    currentUserRole: 'leader',
    content: '围绕园区能耗监测、告警闭环和多维报表进行交付，计划在6周内完成可上线版本。',
    attachmentUrl: 'https://example.com/bid/6001/proposal.pdf',
    remark: '企业建议补充峰谷电价策略说明。'
  },
  {
    bidId: 6002,
    projectTitle: '跨境电商智能选品分析',
    status: 'applied',
    publisherName: '深圳海岳数字贸易有限公司',
    teamName: '数据洞察实践队',
    createdAt: '2026-04-02T09:40:00',
    updatedAt: '2026-04-02T09:40:00',
    currentUserRole: 'member',
    content: '已提交选品指标体系、竞品画像分析方案和阶段性交付计划。',
    attachmentUrl: '',
    remark: ''
  },
  {
    bidId: 6003,
    projectTitle: '城市应急信息可视化平台',
    status: 'confirmed',
    publisherName: '武汉数安应急技术有限公司',
    teamName: '应急协同开发团队',
    createdAt: '2026-02-26T14:10:00',
    updatedAt: '2026-03-05T11:00:00',
    currentUserRole: 'leader',
    content: '方案已通过并确认中标，当前已进入实施排期与接口联调准备。',
    attachmentUrl: 'https://example.com/bid/6003/technical-plan.pdf',
    remark: '已中标，等待项目启动会。'
  }
])

// 使用 store/静态数据双模式
*/

const projects = computed(() => studentProjectStore.projects)
const loading = computed(() => studentProjectStore.loading)
const error = computed(() => studentProjectStore.error)

const currentTeams = computed(() => {
  if (!activeTeamCategory.value) return []

  return activeTeamCategory.value === 'owned'
    ? studentProjectStore.ownedTeams
    : studentProjectStore.joinedTeams
})

// 揭榜相关状态
const bids = ref([])
const bidsLoading = ref(false)
const bidsError = ref(null)
const bidDialogVisible = ref(false)
const selectedBid = ref(null)

// 切换模块辅助方法
const setTeamModule = (category) => {
  activeModule.value = 'team'
  activeTeamCategory.value = category
}

const teamDialogVisible = ref(false)
const selectedTeam = ref(null)

// 打开团队详情弹窗
const openTeamDetail = (team) => {
  selectedTeam.value = team
  teamDialogVisible.value = true
}

// 关闭团队详情弹窗
const closeTeamDetail = () => {
  teamDialogVisible.value = false
}

const setResultModule = (key) => {
  activeModule.value = 'results'
  activeResult.value = key
}

const setDataModule = (key) => {
  activeModule.value = 'data'
  activeData.value = key
}

const viewDetail = (project) => {
  router.push(`/projects/${project.id}`)
}

const manageProject = (project) => {
  console.log('manageProject clicked ->', project?.id)
  // 根据用户角色跳转到不同的管理页面
  if (userRole.value === 'enterprise') {
    // 企业用户跳转到企业方管理页面
    router.push(`/enterprise/project/${project.id}/manage`)
  } else {
    // 学生用户跳转到承接方管理页面
    router.push(`/projects/${project.id}/manage`)
  }
}

const uploadDeliverable = (project) => {
  router.push(`/submit/${project.id}`)
}

const openTeamCollab = (project) => {
  router.push(`/tracker/${project.id}`)
}

// 跳转关联项目详情
const goProjectDetail = (project) => {
  if (!project?.id) return
  router.push(`/projects/${project.id}`)
}

// 加载揭榜列表
const fetchBids = async () => {
  bidsLoading.value = true
  bidsError.value = null
  try {
    const res = await getMyBidsAPI()
    if (res.code === '0000') {
      bids.value = res.data || []
    } else {
      bids.value = []
      bidsError.value = res.info || '加载揭榜列表失败'
    }
  } catch (error) {
    console.error('加载揭榜列表失败', error)
    bidsError.value = '加载揭榜列表失败'
  } finally {
    bidsLoading.value = false
  }
}

// 查看揭榜详情
const viewBidDetail = async (bid) => {
  try {
    const res = await getBidDetailAPI(bid.bidId)
    selectedBid.value = res.data
    bidDialogVisible.value = true
  } catch (error) {
    console.error('加载揭榜详情失败', error)
    ElMessage.error('加载揭榜详情失败')
  }
}

// 关闭揭榜详情弹窗
const closeBidDetail = () => {
  bidDialogVisible.value = false
}

// 揭榜状态文本映射
const getBidStatusText = (status) => {
  const map = {
    applied: '已申请',
    shortlisted: '已入围',
    confirmed: '已中标',
    rejected: '已拒绝',
    cancelled: '已取消'
  }
  return map[status] || status
}

// 揭榜状态样式类映射
const getBidStatusClass = (status) => {
  const map = {
    applied: 'pending',
    shortlisted: 'ongoing',
    confirmed: 'completed',
    rejected: 'cancelled',
    cancelled: 'cancelled'
  }
  return map[status] || 'pending'
}

// 角色文本映射
const getRoleText = (role) => {
  const map = {
    leader: '负责人',
    member: '成员',
    none: '无'
  }
  return map[role] || role
}

// 日期格式化
const formatDate = (dateStr) => {
  if (!dateStr) return '--'
  return dateStr.split('T')[0]
}

onMounted(async () => {
  const params = {
    pageNum: 1,
    pageSize: 10
  }

  await Promise.all([
    studentProjectStore.fetchMyProjects(params),
    studentProjectStore.fetchMyTeams(),
    fetchBids()
  ])
})
</script>

<style scoped>
.myproject-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f7fb;
  color: #1f274b;
}

.myproject-container {
  flex: 1;
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
  width: 100%;
  background: #f5f7fa;
  min-height: calc(100vh - 90px); /* 减去导航栏高度 */
}

.page-header {
  margin-bottom: 24px;
}

.page-title {
  margin: 0 0 4px;
  font-size: 24px;
  font-weight: 700;
  color: #1f274b;
}

.page-subtitle {
  margin: 0;
  color: #7b859f;
  font-size: 14px;
}

.myproject-layout {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.sidebar {
  width: 240px;
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  flex-shrink: 0;
}

.sidebar-section {
  margin-bottom: 24px;
}

.sidebar-section:last-child {
  margin-bottom: 0;
}

.sidebar-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 12px;
  padding-left: 12px;
}

.sidebar-item {
  width: 100%;
  padding: 10px 12px;
  background: transparent;
  border: none;
  border-radius: 6px;
  text-align: left;
  font-size: 14px;
  color: #606266;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 4px;
}

.sidebar-item:hover {
  background: #f5f7fb;
  color: #409eff;
}

.sidebar-item.active {
  background: #ecf5ff;
  color: #409eff;
  font-weight: 500;
}

.main-content {
  flex: 1;
  min-width: 0;
}

.role-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.role-tab {
  padding: 6px 14px;
  border-radius: 999px;
  border: 1px solid #e0e6f2;
  background: #f5f7fb;
  font-size: 13px;
  cursor: pointer;
  color: #4a5676;
}

.role-tab.active {
  background: #1890ff;
  border-color: #1890ff;
  color: #fff;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: #1f274b;
}

.section-extra {
  display: flex;
  gap: 8px;
  align-items: center;
}

.section-chip {
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid #e0e6f2;
  background: #f7f9ff;
  font-size: 12px;
  color: #4a5676;
}

.section-chip.primary {
  background: #1890ff;
  border-color: #1890ff;
  color: #fff;
}

.status-filters {
  display: flex;
  gap: 8px;
}

.status-chip {
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid #e0e6f2;
  background: #f7f9ff;
  font-size: 12px;
  cursor: pointer;
  color: #4a5676;
}

.status-chip.active {
  background: #1890ff;
  border-color: #1890ff;
  color: #fff;
}

.project-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.project-card {
  border-radius: 12px;
  border: 1px solid #edf1fb;
  padding: 16px 18px;
  background: linear-gradient(180deg, #ffffff, #f9fbff);
  box-shadow: 0 8px 20px rgba(15, 39, 106, 0.08);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.project-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgba(15, 39, 106, 0.12);
}

.project-card-main {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.project-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.project-name {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.project-tag {
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 12px;
  color: #fff;
  margin-right: 13px; 
}

.project-tag.draft {
  background: #909399;
}

.project-tag.pending_review {
  background: #e6a23c;
}

.project-tag.published {
  background: #409eff;
}

.project-tag.in_progress,
.project-tag.ongoing {
  background: #1890ff;
}

.project-tag.rejected {
  background: #f56c6c;
}

.project-tag.awarded {
  background: #52c41a;
}

.project-tag.review {
  background: #faad14;
}

.project-tag.completed,
.project-tag.finished {
  background: #67c23a;
}

.project-tag.closed {
  background: #8c8c8c;
}

.project-meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 13px;
  color: #7b859f;
}

.project-brief {
  font-size: 13px;
  color: #4f5d7a;
  margin: 0;
}

/* 项目内容行：简介文本和按钮水平排列 */
.project-content-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.project-content-row .project-brief {
  flex: 1;
  margin: 0;
}

.project-content-row .manage-btn {
  flex-shrink: 0;
  align-self: flex-start;
  background: #1890ff;
  color: #fff;
  border-color: #1890ff;
}

.project-content-row .manage-btn:hover {
  background: #40a9ff;
  border-color: #40a9ff;
}

.project-content-row .manage-btn:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.accepted-project-card .project-card-main {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.accepted-project-card .project-card-body {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.accepted-project-card .project-card-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.accepted-project-card .project-card-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
  flex-shrink: 0;
}

.accepted-project-card .project-name {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  flex: 1;
}

.accepted-project-card .project-meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  font-size: 14px;
  color: #606266;
}

.accepted-project-card .project-tag {
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  margin-right: 0;
  color: inherit;
}

.accepted-project-card .project-tag.draft {
  background: #f4f4f5;
  color: #909399;
}

.accepted-project-card .project-tag.pending_review {
  background: #fff7e6;
  color: #fa8c16;
}

.accepted-project-card .project-tag.published {
  background: #e6f7ff;
  color: #1890ff;
}

.accepted-project-card .project-tag.in_progress,
.accepted-project-card .project-tag.ongoing {
  background: #f0f9eb;
  color: #67c23a;
}

.accepted-project-card .project-tag.rejected {
  background: #fef0f0;
  color: #f56c6c;
}

.accepted-project-card .project-tag.awarded {
  background: #f0f9eb;
  color: #67c23a;
}

.accepted-project-card .project-tag.review {
  background: #fff7e6;
  color: #fa8c16;
}

.accepted-project-card .project-tag.completed,
.accepted-project-card .project-tag.finished {
  background: #f6ffed;
  color: #52c41a;
}

.accepted-project-card .project-tag.closed {
  background: #f4f4f5;
  color: #909399;
}

.accepted-project-card .manage-btn {
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 14px;
  background: #409eff;
  color: #fff;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.accepted-project-card .manage-btn:hover {
  background: #66b1ff;
  border-color: #66b1ff;
}

.accepted-project-card .manage-btn:focus {
  outline: none;
  box-shadow: none;
}

.bid-project-card .project-card-main {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.bid-project-card .project-card-body {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.bid-project-card .project-card-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.bid-project-card .project-card-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
  flex-shrink: 0;
}

.bid-project-card .project-name {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  flex: 1;
}

.bid-project-card .project-meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  font-size: 14px;
  color: #606266;
}

.bid-project-card .project-tag {
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  margin-right: 0;
  color: inherit;
}

.bid-project-card .project-tag.pending {
  background: #fff7e6;
  color: #fa8c16;
}

.bid-project-card .project-tag.ongoing {
  background: #e6f7ff;
  color: #1890ff;
}

.bid-project-card .project-tag.completed {
  background: #f0f9eb;
  color: #67c23a;
}

.bid-project-card .project-tag.cancelled {
  background: #fef0f0;
  color: #f56c6c;
}

.bid-project-card .manage-btn {
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 14px;
  background: #409eff;
  color: #fff;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.bid-project-card .manage-btn:hover {
  background: #66b1ff;
  border-color: #66b1ff;
}

.bid-project-card .manage-btn:focus {
  outline: none;
  box-shadow: none;
}

.team-card .project-card-header {
  align-items: flex-start;
}

.team-role-chip {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  background: #f0f3fa;
  color: #4a5676;
}

.team-role-chip.owner {
  background: #e6f4ff;
  color: #1890ff;
}

.project-actions-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.project-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.link-btn {
  border: none;
  background: none;
  color: #1890ff;
  cursor: pointer;
  font-size: 13px;
  padding: 0;
}

.primary-chip {
  padding: 6px 12px;
  border-radius: 999px;
  border: none;
  background: #1890ff;
  color: #fff;
  font-size: 13px;
  cursor: pointer;
}

.ghost-chip {
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid #d6ddf5;
  background: #fff;
  color: #4a5676;
  font-size: 13px;
  cursor: pointer;
}

.project-progress {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 140px;
}

.progress-bar {
  flex: 1;
  height: 6px;
  border-radius: 999px;
  background: #edf1fb;
  overflow: hidden;
}

.progress-inner {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #1890ff, #52c41a);
}

.progress-text {
  font-size: 12px;
  color: #7b859f;
}

.empty-state {
  text-align: center;
  padding: 32px 0;
  color: #9aa5c2;
}

.loading-state {
  padding: 20px;
}

.error-state {
  margin-bottom: 16px;
}

.team-dialog-overlay {
  position: fixed;
  inset: 0;
  background: rgba(31, 39, 75, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  padding: 12px;
}

.team-dialog {
  width: 720px;
  max-width: 90vw;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 12px 36px rgba(15, 39, 106, 0.2);
  padding: 18px 20px;
}

.team-dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.dialog-title-area {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.dialog-title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #1f274b;
}

.dialog-project-block {
  background: linear-gradient(180deg, #f7faff 0%, #f1f5ff 100%);
  border: 1px solid #dbe6ff;
  border-radius: 12px;
  padding: 12px 14px;
  box-shadow: 0 10px 24px rgba(12, 95, 231, 0.12);
}

.project-block-title {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 700;
  color: #0c2f88;
  margin: 0 0 8px;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(12, 95, 231, 0.08);
  border: 1px solid rgba(12, 95, 231, 0.12);
}

.dialog-project-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.project-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid #c7d9ff;
  background: linear-gradient(120deg, #f2f6ff, #e6efff);
  color: #0c5fe7;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  border-radius: 999px;
  box-shadow: 0 6px 12px rgba(12, 95, 231, 0.12);
  transition: all 0.2s ease;
}

.project-link:hover {
  color: #0848b3;
  border-color: #84a7ff;
  box-shadow: 0 8px 16px rgba(12, 95, 231, 0.18);
  transform: translateY(-1px);
}

.dialog-subtitle-inline {
  font-size: 13px;
  color: #7b859f;
}

.close-btn {
  border: none;
  background: transparent;
  font-size: 20px;
  cursor: pointer;
  color: #7b859f;
  line-height: 1;
}

.close-btn:hover {
  color: #1f274b;
}

.team-dialog-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 8px;
}

.dialog-section h4 {
  margin: 0 0 6px;
  font-size: 14px;
  color: #1f274b;
}

.dialog-text {
  margin: 0;
  font-size: 13px;
  color: #4f5d7a;
}

.dialog-meta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 13px;
  color: #7b859f;
}

.member-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.member-item {
  padding: 10px 12px;
  border: 1px solid #edf1fb;
  border-radius: 10px;
  background: #f9fbff;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.member-info {
  display: flex;
  gap: 8px;
  align-items: center;
}

.member-name {
  font-weight: 600;
  color: #1f274b;
}

.member-role {
  font-size: 12px;
  color: #1890ff;
  background: #e6f4ff;
  padding: 2px 6px;
  border-radius: 8px;
}

.member-duty {
  font-size: 12px;
  color: #4f5d7a;
}

.dialog-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.dialog-tip {
  margin: 6px 0 0;
  font-size: 12px;
  color: #7b859f;
}

.dialog-feedback {
  margin: 8px 0 0;
  font-size: 12px;
  color: #1890ff;
  background: #e6f4ff;
  padding: 8px 10px;
  border-radius: 8px;
}

.ghost-chip.danger {
  border-color: #ffa39e;
  color: #cf1322;
  background: #fff1f0;
}

/* 揭榜详情弹窗样式 */
.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-size: 12px;
  color: #7b859f;
}

.info-value {
  font-size: 14px;
  color: #1f274b;
  font-weight: 500;
}

.attachment-link {
  display: inline-block;
  padding: 8px 16px;
  background: #e6f4ff;
  color: #1890ff;
  border-radius: 6px;
  text-decoration: none;
  font-size: 14px;
  transition: all 0.3s;
}

.attachment-link:hover {
  background: #bae0ff;
}

@media (max-width: 960px) {
  .myproject-layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    order: 2;
  }

  .main-content {
    order: 1;
  }
}
</style>
