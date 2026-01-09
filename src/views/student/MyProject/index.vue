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

            <div class="sidebar-section">
              <div class="sidebar-title">我的成果</div>
              <button
                class="sidebar-item"
                :class="{ active: activeModule === 'results' && activeResult === 'pending' }"
                @click="setResultModule('pending')"
              >
                待提交 (2)
              </button>
              <button
                class="sidebar-item"
                :class="{ active: activeModule === 'results' && activeResult === 'review' }"
                @click="setResultModule('review')"
              >
                评审中 (3)
              </button>
              <button
                class="sidebar-item"
                :class="{ active: activeModule === 'results' && activeResult === 'passed' }"
                @click="setResultModule('passed')"
              >
                已通过 (8)
              </button>
            </div>

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

              <div class="project-list">
                <article
                  v-for="project in projects"
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
                      <span>状态：{{ project.stageText }}</span>
                      <span>剩余时间：{{ project.remainDays }}天</span>
                      <span>发布方：{{ project.publisher }}</span>
                    </div>

                    <div class="project-content-row">
                      <p class="project-brief">{{ project.brief }}</p>
                      <button
                        type="button"
                        class="ghost-chip manage-btn"
                        @click.stop.prevent="manageProject(project)"
                      >
                        管理项目
                      </button>
                    </div>
                  </div>
                </article>

                <div v-if="projects.length === 0" class="empty-state">
                  暂无承接的项目
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

            <!-- 我的成果模块 -->
            <div v-else-if="activeModule === 'results'">
              <div class="section-header">
                <h2 class="section-title">我的成果</h2>
              </div>
              <div class="project-list">
                <div class="project-card" v-if="activeResult === 'pending'">
                  <div class="project-card-main">
                    <div class="project-card-header">
                      <h3 class="project-name">待提交 (2)</h3>
                    </div>
                    <p class="project-brief">还有 2 个项目待上传最终成果，请尽快完成提交。</p>
                  </div>
                </div>
                <div class="project-card" v-else-if="activeResult === 'review'">
                  <div class="project-card-main">
                    <div class="project-card-header">
                      <h3 class="project-name">评审中 (3)</h3>
                    </div>
                    <p class="project-brief">3 个项目成果正在评审中，请耐心等待结果。</p>
                  </div>
                </div>
                <div class="project-card" v-else-if="activeResult === 'passed'">
                  <div class="project-card-main">
                    <div class="project-card-header">
                      <h3 class="project-name">已通过 (8)</h3>
                    </div>
                    <p class="project-brief">恭喜！已有 8 个项目成果通过评审。</p>
                  </div>
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
                    <span>状态：{{ project.stageText }}</span>
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
  </div>

  <!-- 团队详情弹窗 -->
  <div v-if="teamDialogVisible && selectedTeam" class="team-dialog-overlay">
    <div class="team-dialog">
      <div class="team-dialog-header">
        <div>
          <h3 class="dialog-title">{{ selectedTeam.name }}</h3>
          <p class="dialog-subtitle">
            关联项目：{{ selectedTeam.project.name }}（{{ selectedTeam.project.stage }} / {{ selectedTeam.project.statusText }}）
          </p>
        </div>
        <button class="close-btn" @click="closeTeamDetail">×</button>
      </div>

      <div class="team-dialog-body">
        <div class="dialog-section">
          <h4>团队简介</h4>
          <p class="dialog-text">{{ selectedTeam.description }}</p>
        </div>

        <div class="dialog-section">
          <h4>项目概况</h4>
          <div class="dialog-meta-row">
            <span>阶段：{{ selectedTeam.project.stage }}</span>
            <span>状态：{{ selectedTeam.project.statusText }}</span>
            <span>进度：{{ selectedTeam.project.progress }}%</span>
            <span>截止：{{ selectedTeam.project.deadline }}</span>
          </div>
          <p class="dialog-text">{{ selectedTeam.project.detail }}</p>
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

        <div v-if="selectedTeam.isOwner" class="dialog-section manage-actions">
          <h4>成员管理</h4>
          <div class="dialog-actions">
            <button class="ghost-chip" @click="handleManageMember('add')">新增成员</button>
            <button class="ghost-chip" @click="handleManageMember('edit')">调整角色</button>
            <button class="ghost-chip danger" @click="handleManageMember('remove')">移除成员</button>
          </div>
          <p class="dialog-tip">当前为负责人视角，可在此处进行成员管理（前端占位操作）。</p>
          <p v-if="manageActionMessage" class="dialog-feedback">{{ manageActionMessage }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const userInfo = ref({
  username: '张三',
  role: 'student', // student / enterprise
  avatar: 'https://picsum.photos/seed/user123/40/40.jpg'
})

const userRole = computed(() => (userInfo.value.role === 'enterprise' ? 'enterprise' : 'student'))

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

// 我承接的项目数据
const projects = ref([
  {
    id: 1,
    name: 'AI智能客服系统开发',
    ownerType: 'student',
    stage: 'ongoing',
    stageText: '开发中',
    status: 'ongoing',
    statusText: '进行中',
    progress: 60,
    remainDays: 15,
    reward: 15000,
    publisher: 'XX科技有限公司',
    brief: '为平台构建基于NLP的智能客服系统，提高服务效率。',
    canUpload: true,
    uploadLabel: '上传成果',
    canCollaborate: true
  },
  {
    id: 2,
    name: '电商平台前端开发',
    ownerType: 'student',
    stage: 'ongoing',
    stageText: '待提交',
    status: 'awarded',
    statusText: '已揭榜',
    progress: 80,
    remainDays: 3,
    reward: 8000,
    publisher: 'YY信息技术有限公司',
    brief: '实现现代化商城前端页面，适配 PC 与移动端。',
    canUpload: true,
    uploadLabel: '上传成果',
    canCollaborate: false
  },
  {
    id: 3,
    name: '数据分析与可视化项目',
    ownerType: 'student',
    stage: 'testing',
    stageText: '测试中',
    status: 'review',
    statusText: '待评审',
    progress: 90,
    remainDays: 7,
    reward: 10000,
    publisher: 'ZZ数据科技有限公司',
    brief: '对销售数据深度分析并制作可视化报表。',
    canUpload: true,
    uploadLabel: '提交成果',
    canCollaborate: false
  }
])

// 团队数据：区分负责人视角与成员视角，前端 mock
const teamData = ref({
  owned: [
    {
      id: 'team-dev',
      name: '智能开发小组',
      isOwner: true,
      description: '负责平台前端与移动端开发的学生团队，承担核心架构与交互体验交付。',
      project: {
        name: '智慧校园协同平台',
        stage: '开发中',
        statusText: '进行中',
        progress: 72,
        deadline: '2024-09-30',
        brief: '交付多角色协同的前端与移动端界面，聚焦性能与可用性。',
        detail: '当前迭代聚焦课堂互动、项目协同与消息模块的性能优化与体验提升。'
      },
      members: [
        { name: '张三', role: '负责人', duty: '统筹 / 前端开发' },
        { name: '李四', role: '前端', duty: 'UI 组件与样式联调' },
        { name: '王五', role: '后端', duty: '接口联调与接口网关' },
        { name: '赵六', role: '测试', duty: '功能回归与用例维护' }
      ]
    },
    {
      id: 'team-mobile',
      name: '移动端共建组',
      isOwner: true,
      description: '移动端专项团队，负责课程与项目的移动端适配与迭代。',
      project: {
        name: '实训工厂移动端',
        stage: '设计评审',
        statusText: '待开发',
        progress: 35,
        deadline: '2024-10-12',
        brief: '完成实训工厂移动端的交互设计与核心功能开发。',
        detail: '设计稿已通过一轮评审，正补充离线场景与消息推送方案，后续进入开发。'
      },
      members: [
        { name: '张三', role: '负责人', duty: '需求拆解与计划制定' },
        { name: '周七', role: '后端', duty: '接口适配与鉴权' },
        { name: '钱八', role: '客户端', duty: '跨端框架与性能优化' }
      ]
    }
  ],
  joined: [
    {
      id: 'team-ai',
      name: 'AI创新团队',
      isOwner: false,
      description: '聚焦人工智能与数据分析的项目团队，负责算法与数据管道搭建。',
      project: {
        name: '智能问答助手',
        stage: '联调中',
        statusText: '进行中',
        progress: 64,
        deadline: '2024-09-05',
        brief: '实现面向客服场景的智能问答与知识库检索。',
        detail: '已完成意图识别与 FAQ 检索，正在对接知识库更新与对话流程监控。'
      },
      members: [
        { name: '陈静', role: '负责人', duty: '算法方案与进度跟进' },
        { name: '刘阳', role: '算法', duty: '意图识别与召回' },
        { name: '张三', role: '前端', duty: '对话界面与配置面板' }
      ]
    },
    {
      id: 'team-data',
      name: '数据先锋团队',
      isOwner: false,
      description: '数据可视化与报表团队，聚焦业务看板建设。',
      project: {
        name: '企业运营数据看板',
        stage: '测试中',
        statusText: '待验收',
        progress: 88,
        deadline: '2024-08-28',
        brief: '搭建运营数据大屏与核心指标监控。',
        detail: '指标定义与联调已完成，正在做跨端适配与性能压测，准备提交验收。'
      },
      members: [
        { name: '周远', role: '负责人', duty: '需求对接与验收' },
        { name: '王一', role: '数据', duty: '指标口径与 ETL' },
        { name: '张三', role: '前端', duty: '数据大屏可视化' }
      ]
    }
  ]
})

const currentTeams = computed(() => {
  if (!activeTeamCategory.value) return []
  return teamData.value[activeTeamCategory.value] || []
})

// 切换模块辅助方法
const setTeamModule = (category) => {
  activeModule.value = 'team'
  activeTeamCategory.value = category
}

const teamDialogVisible = ref(false)
const selectedTeam = ref(null)
const manageActionMessage = ref('')

// 打开团队详情弹窗
const openTeamDetail = (team) => {
  selectedTeam.value = team
  teamDialogVisible.value = true
}

// 关闭团队详情弹窗
const closeTeamDetail = () => {
  teamDialogVisible.value = false
  manageActionMessage.value = ''
}

// 成员管理操作占位（仅负责人可见）
const handleManageMember = (action) => {
  // 前端占位反馈，实际对接后可替换为接口调用
  manageActionMessage.value = `已触发「${action}」操作（团队：${selectedTeam.value?.name}），后续可接入真实接口。`
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
  router.push(`/projects/${project.id}/manage`)
}

const uploadDeliverable = (project) => {
  router.push(`/submit/${project.id}`)
}

const openTeamCollab = (project) => {
  router.push(`/tracker/${project.id}`)
}

onMounted(() => {
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
  padding: 0 24px 24px 24px; /* 移除顶部padding */
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
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 24px;
}

.sidebar {
  background: #fff;
  border-radius: 12px;
  padding: 16px 12px;
  box-shadow: 0 6px 18px rgba(15, 39, 106, 0.08);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sidebar-section {
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f3fa;
}

.sidebar-section:last-child {
  border-bottom: none;
}

.sidebar-title {
  font-size: 13px;
  font-weight: 600;
  color: #9aa5c2;
  margin-bottom: 6px;
}

.sidebar-item {
  display: block;
  width: 100%;
  padding: 6px 10px;
  margin-bottom: 4px;
  border-radius: 8px;
  border: none;
  background: transparent;
  text-align: left;
  font-size: 14px;
  color: #4a5676;
  cursor: pointer;
}

.sidebar-item:hover {
  background: #f5f7ff;
}

.sidebar-item.active {
  background: #e6f4ff;
  color: #1890ff;
}

.main-content {
  background: #fff;
  border-radius: 12px;
  padding: 20px 24px 24px;
  box-shadow: 0 6px 18px rgba(15, 39, 106, 0.08);
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

.project-tag.ongoing {
  background: #1890ff;
}

.project-tag.awarded {
  background: #52c41a;
}

.project-tag.review {
  background: #faad14;
}

.project-tag.finished {
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

.dialog-title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #1f274b;
}

.dialog-subtitle {
  margin: 4px 0 0;
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
