<template>
  <div class="team-workspace">
    <div class="team-toolbar">
      <div class="toolbar-left">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          type="button"
          class="view-tab"
          :class="{ active: activeView === tab.key }"
          @click="activeView = tab.key"
        >
          <span>{{ tab.label }}</span>
          <span v-if="tab.key === 'invites' && pendingInviteCount" class="view-tab-count">{{ pendingInviteCount }}</span>
        </button>
      </div>

      <div class="toolbar-right">
        <button type="button" class="action-btn" @click="loadWorkspace">刷新数据</button>
        <button
          type="button"
          class="action-btn action-btn--primary"
          :disabled="hasActiveTeam"
          :title="hasActiveTeam ? '当前已加入活跃团队，不能重复创建' : ''"
          @click="openCreateDialog"
        >
          创建团队
        </button>
        <template v-if="showLeaderActions">
          <button type="button" class="action-btn" @click="openEditDialog">编辑团队</button>
          <button type="button" class="action-btn" @click="openInviteDialog">邀请成员</button>
          <button type="button" class="action-btn action-btn--danger" @click="disbandCurrentTeam">解散团队</button>
        </template>
      </div>
    </div>

    <div class="team-stage">
      <div class="stage-head">
        <div>
          <h3 class="stage-title">{{ currentViewMeta.title }}</h3>
          <p class="stage-desc">{{ currentViewMeta.desc }}</p>
        </div>
      </div>

      <div v-if="pageLoading" class="stage-empty">正在加载团队数据...</div>

      <template v-else>
        <section v-if="activeView === 'myTeam'" class="list-panel">
          <div v-if="activeTeam" class="stack-list">
            <article class="stack-item stack-item--table">
              <div class="table-grid table-grid--team">
                <div class="table-cell table-cell--head">团队名称</div>
                <div class="table-cell table-cell--value">{{ activeTeam.teamName }}</div>
                <div class="table-cell table-cell--head">我的身份</div>
                <div class="table-cell table-cell--value">{{ currentRoleLabel }}</div>
                <div class="table-cell table-cell--head">团队简介</div>
                <div class="table-cell table-cell--value">{{ activeTeam.description || '暂无简介' }}</div>
                <div class="table-cell table-cell--head">成员规模</div>
                <div class="table-cell table-cell--value">{{ activeTeam.memberCount }} / {{ activeTeam.maxMemberCount }}</div>
              </div>
              <div class="stack-item-side">
                <button type="button" class="action-btn" @click="openTeamDetail(activeTeam.teamId, 'myTeam')">查看详情</button>
              </div>
            </article>

            <div class="member-panel member-panel--compact">
              <div class="section-head">
                <h4 class="section-title">团队成员</h4>
                <span class="section-sub">共 {{ activeTeam.members.length }} 人</span>
              </div>
              <div v-if="activeTeam.members.length" class="member-inline-list">
                <span
                  v-for="member in activeTeam.members"
                  :key="member.userId || member.nickname"
                  class="member-inline-item"
                >
                  {{ member.nickname || '未命名成员' }}
                </span>
              </div>
              <div v-else class="stage-empty stage-empty--inner">当前团队没有成员信息。</div>
            </div>
          </div>

          <div v-else class="stage-empty">你当前没有加入活跃团队，可以点击右上角创建团队，或等待队长通过学生用户 ID 向你发起邀请。</div>
        </section>

        <section v-else class="list-panel">
          <div v-if="currentList.length" class="stack-list">
            <article v-for="item in currentList" :key="getListKey(item)" class="stack-item">
              <div class="stack-item-main">
                <div class="stack-item-top">
                  <h4 class="stack-title">{{ getListTitle(item) }}</h4>
                  <span class="state-pill" :class="getListStatusClass(item)">{{ getListStatusText(item) }}</span>
                </div>

                <p class="stack-desc">{{ getListDescription(item) }}</p>

                <div class="stack-meta">
                  <span v-for="meta in getListMeta(item)" :key="meta">{{ meta }}</span>
                </div>
              </div>

              <div class="stack-item-side">
                <button
                  type="button"
                  class="action-btn"
                  @click="activeView === 'invites' ? openInviteDetail(item) : openTeamDetail(item.teamId, 'created')"
                >
                  查看详情
                </button>
              </div>
            </article>
          </div>

          <div v-else class="stage-empty">{{ currentViewMeta.empty }}</div>
        </section>
      </template>
    </div>

    <teleport to="body">
      <div v-if="teamDialogVisible" class="dialog-mask">
        <div class="dialog-card dialog-card--form">
          <div class="dialog-head">
            <div>
              <h3 class="dialog-title">{{ teamDialogMode === 'create' ? '创建团队' : '编辑团队' }}</h3>
              <p class="dialog-desc">当前阶段只维护团队基础信息，前端暂不实现团队图标功能。</p>
            </div>
            <button type="button" class="dialog-close" @click="closeTeamDialog">×</button>
          </div>

          <div class="dialog-body">
            <div class="dialog-field">
              <label class="dialog-label" for="team-name">团队名称</label>
              <input id="team-name" v-model.trim="teamForm.teamName" class="dialog-input" type="text" maxlength="32" placeholder="请输入团队名称" />
            </div>

            <div class="dialog-field">
              <label class="dialog-label" for="team-description">团队简介</label>
              <textarea id="team-description" v-model.trim="teamForm.description" class="dialog-textarea" rows="4" maxlength="160" placeholder="简要描述团队定位和分工"></textarea>
            </div>

            <div class="dialog-field">
              <label class="dialog-label" for="team-avatar-url">团队头像地址</label>
              <input
                id="team-avatar-url"
                v-model.trim="teamForm.avatarUrl"
                class="dialog-input"
                type="text"
                maxlength="255"
                placeholder="请输入团队头像 URL（对应后端 avatarUrl）"
              />
            </div>

            <div class="dialog-field">
              <label class="dialog-label" for="team-size">最大成员数</label>
              <input id="team-size" v-model.number="teamForm.maxMemberCount" class="dialog-input" type="number" min="2" max="20" placeholder="默认 10" />
            </div>
          </div>

          <div class="dialog-foot">
            <button type="button" class="action-btn" @click="closeTeamDialog">取消</button>
            <button type="button" class="action-btn action-btn--primary" :disabled="teamSubmitting" @click="submitTeamForm">
              {{ teamSubmitting ? '提交中...' : teamDialogMode === 'create' ? '创建团队' : '保存修改' }}
            </button>
          </div>
        </div>
      </div>
    </teleport>

    <teleport to="body">
      <div v-if="inviteDialogVisible" class="dialog-mask">
        <div class="dialog-card dialog-card--form">
          <div class="dialog-head">
            <div>
              <h3 class="dialog-title">邀请成员</h3>
              <p class="dialog-desc">根据最新接口，当前通过学生用户 ID 发起邀请。</p>
            </div>
            <button type="button" class="dialog-close" @click="closeInviteDialog">×</button>
          </div>

          <div class="dialog-body">
            <div class="dialog-field">
              <label class="dialog-label" for="invite-user-id">学生用户 ID</label>
              <input id="invite-user-id" v-model.trim="inviteForm.invitedUserId" class="dialog-input" type="text" placeholder="请输入被邀请成员的用户 ID" />
            </div>
          </div>

          <div class="dialog-foot">
            <button type="button" class="action-btn" @click="closeInviteDialog">取消</button>
            <button type="button" class="action-btn action-btn--primary" :disabled="inviteSubmitting" @click="submitInvite">
              {{ inviteSubmitting ? '发送中...' : '发送邀请' }}
            </button>
          </div>
        </div>
      </div>
    </teleport>

    <teleport to="body">
      <div v-if="detailDialogVisible" class="dialog-mask">
        <div class="dialog-card dialog-card--detail">
          <div class="dialog-head">
            <div>
              <h3 class="dialog-title">{{ detailDialogTitle }}</h3>
              <p class="dialog-desc">{{ detailDialogDesc }}</p>
            </div>
            <button type="button" class="dialog-close" @click="closeDetailDialog">×</button>
          </div>

          <div class="dialog-body dialog-body--detail">
            <div v-if="detailDialogMode === 'invite' && selectedInvite" class="detail-block">
              <div class="detail-grid">
                <div class="detail-item">
                  <span class="detail-key">团队名称</span>
                  <span class="detail-value">{{ selectedInvite.teamName }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-key">邀请人</span>
                  <span class="detail-value">{{ selectedInvite.inviterName || '--' }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-key">邀请状态</span>
                  <span class="detail-value">{{ inviteStatusText(selectedInvite.status) }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-key">邀请时间</span>
                  <span class="detail-value">{{ formatDateTime(selectedInvite.createTime) }}</span>
                </div>
                <div v-if="selectedInvite.handleTime" class="detail-item detail-item--full">
                  <span class="detail-key">处理时间</span>
                  <span class="detail-value">{{ formatDateTime(selectedInvite.handleTime) }}</span>
                </div>
              </div>
            </div>

            <div v-if="detailLoading" class="stage-empty stage-empty--inner">正在加载团队详情...</div>

            <template v-else-if="detailTeam">
              <div class="detail-block">
                <div class="detail-grid">
                  <div class="detail-item">
                    <span class="detail-key">团队 ID</span>
                    <span class="detail-value">{{ detailTeam.teamId }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-key">团队状态</span>
                    <span class="detail-value">{{ statusText(detailTeam.status) }}</span>
                  </div>
                  <div class="detail-item detail-item--full">
                    <span class="detail-key">团队名称</span>
                    <span class="detail-value">{{ detailTeam.teamName }}</span>
                  </div>
                  <div class="detail-item detail-item--full">
                    <span class="detail-key">团队简介</span>
                    <span class="detail-value">{{ detailTeam.description || '暂无简介' }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-key">成员规模</span>
                    <span class="detail-value">{{ detailTeam.memberCount }} / {{ detailTeam.maxMemberCount }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-key">队长</span>
                    <span class="detail-value">{{ detailLeaderName }}</span>
                  </div>
                  <div class="detail-item detail-item--full">
                    <span class="detail-key">时间信息</span>
                    <span class="detail-value">创建于 {{ formatDateTime(detailTeam.createTime) }}，更新于 {{ formatDateTime(detailTeam.updateTime || detailTeam.createTime) }}</span>
                  </div>
                </div>
              </div>

              <div class="detail-block">
                <div class="section-head">
                  <h4 class="section-title">成员列表</h4>
                  <span class="section-sub">共 {{ detailTeam.members.length }} 人</span>
                </div>
                <div v-if="detailTeam.members.length" class="member-inline-list member-inline-list--detail">
                  <span
                    v-for="member in detailTeam.members"
                    :key="member.userId || member.nickname"
                    class="member-inline-item member-inline-item--detail"
                  >
                    <span>{{ member.nickname || '未命名成员' }}</span>
                    <span v-if="member.role === 'leader'" class="member-inline-role">队长</span>
                  </span>
                </div>
                <div v-else class="stage-empty stage-empty--inner">当前团队没有成员明细。</div>
              </div>
            </template>

            <div v-else class="stage-empty stage-empty--inner">暂未读取到团队详情。</div>
          </div>

          <div class="dialog-foot">
            <template v-if="detailDialogMode === 'invite' && selectedInvite?.status === 'pending'">
              <button type="button" class="action-btn" :disabled="inviteSubmitting" @click="processInvite(false)">
                {{ inviteSubmitting ? '处理中...' : '拒绝邀请' }}
              </button>
              <button
                type="button"
                class="action-btn action-btn--primary"
                :disabled="inviteSubmitting || hasActiveTeam"
                :title="hasActiveTeam ? '已在活跃团队中，不能再接受其他邀请' : ''"
                @click="processInvite(true)"
              >
                {{ inviteSubmitting ? '处理中...' : '接受邀请' }}
              </button>
            </template>
            <template v-else-if="canManageDetail">
              <button type="button" class="action-btn" @click="openEditDialogFromDetail">编辑团队</button>
              <button type="button" class="action-btn" @click="openInviteDialogFromDetail">邀请成员</button>
              <button type="button" class="action-btn action-btn--danger" @click="disbandCurrentTeam">解散团队</button>
            </template>
            <button type="button" class="action-btn" @click="closeDetailDialog">关闭</button>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/store/modules/auth'
import {
  createTeamAPI,
  disbandTeamAPI,
  getMyTeamAPI,
  getMyTeamInvitesAPI,
  getMyTeamListAPI,
  getTeamDetailAPI,
  handleTeamInviteAPI,
  inviteTeamMemberAPI,
  updateTeamAPI
} from '@/api/team'

const authStore = useAuthStore()
const USE_STATIC_TEAM_DEMO = true
const STATIC_CURRENT_USER_ID = '202200310214'
const STATIC_CURRENT_USER_NAME = '林叙白'

function createStaticWorkspace() {
  const activeTeam = {
    teamId: 'TM20260408001',
    teamName: '蛋仔派对',
    leaderId: STATIC_CURRENT_USER_ID,
    description: '团队长期参与空间博弈建模、三维地理可视化与策略仿真类课题，擅长把复杂模型做成可演示、可答辩、可落地的完整交付。',
    avatarUrl: 'https://picsum.photos/seed/team-danza/160/160',
    status: 'active',
    memberCount: 4,
    maxMemberCount: 5,
    createTime: '2026-03-05T14:20:00',
    updateTime: '2026-04-19T21:10:00',
    members: [
      {
        userId: STATIC_CURRENT_USER_ID,
        nickname: STATIC_CURRENT_USER_NAME,
        avatarUrl: 'https://picsum.photos/seed/user-linxubai/120/120',
        role: 'leader'
      },
      {
        userId: '202200310228',
        nickname: '周以航',
        avatarUrl: 'https://picsum.photos/seed/user-zhouyihang/120/120',
        role: 'member'
      },
      {
        userId: '202200310233',
        nickname: '宋知遥',
        avatarUrl: 'https://picsum.photos/seed/user-songzhiyao/120/120',
        role: 'member'
      },
      {
        userId: '202200310247',
        nickname: '许闻川',
        avatarUrl: 'https://picsum.photos/seed/user-xuwenchuan/120/120',
        role: 'member'
      }
    ]
  }

  const createdTeams = [
    activeTeam,
    {
      teamId: 'TM20251017002',
      teamName: '城市数智工坊',
      leaderId: STATIC_CURRENT_USER_ID,
      description: '以城市运行数据建模和信息可视化为主要方向，曾完成区级应急驾驶舱、舆情监测专题页面等交付。',
      avatarUrl: 'https://picsum.photos/seed/team-citylab/160/160',
      status: 'disbanded',
      memberCount: 3,
      maxMemberCount: 6,
      createTime: '2025-10-17T09:30:00',
      updateTime: '2026-01-12T18:00:00',
      members: [
        {
          userId: STATIC_CURRENT_USER_ID,
          nickname: STATIC_CURRENT_USER_NAME,
          avatarUrl: 'https://picsum.photos/seed/user-linxubai/120/120',
          role: 'leader'
        },
        {
          userId: '202100410103',
          nickname: '沈砚秋',
          avatarUrl: 'https://picsum.photos/seed/user-shenyanqiu/120/120',
          role: 'member'
        },
        {
          userId: '202100410117',
          nickname: '顾明安',
          avatarUrl: 'https://picsum.photos/seed/user-gumingan/120/120',
          role: 'member'
        }
      ]
    },
    {
      teamId: 'TM20250309003',
      teamName: '星海协同实验队',
      leaderId: STATIC_CURRENT_USER_ID,
      description: '偏向后端与算法协同实现，做过低空轨迹回放、目标识别演示系统和实验数据管理后台。',
      avatarUrl: 'https://picsum.photos/seed/team-xinghai/160/160',
      status: 'disbanded',
      memberCount: 5,
      maxMemberCount: 5,
      createTime: '2025-03-09T11:10:00',
      updateTime: '2025-07-01T16:45:00',
      members: [
        {
          userId: STATIC_CURRENT_USER_ID,
          nickname: STATIC_CURRENT_USER_NAME,
          avatarUrl: 'https://picsum.photos/seed/user-linxubai/120/120',
          role: 'leader'
        },
        {
          userId: '202100210031',
          nickname: '崔亦鸣',
          avatarUrl: 'https://picsum.photos/seed/user-cuiyiming/120/120',
          role: 'member'
        },
        {
          userId: '202100210057',
          nickname: '叶时安',
          avatarUrl: 'https://picsum.photos/seed/user-yeshian/120/120',
          role: 'member'
        },
        {
          userId: '202100210076',
          nickname: '赵景行',
          avatarUrl: 'https://picsum.photos/seed/user-zhaojingxing/120/120',
          role: 'member'
        },
        {
          userId: '202100210088',
          nickname: '何以宁',
          avatarUrl: 'https://picsum.photos/seed/user-heyining/120/120',
          role: 'member'
        }
      ]
    }
  ]

  const inviteTeam = {
    teamId: 'TM20260401009',
    teamName: '智策推演联合队',
    leaderId: '202100120016',
    description: '团队核心能力集中在强化学习策略求解、时空数据处理和推演结果讲解，近期在准备省级创新创业训练项目结题材料。',
    avatarUrl: 'https://picsum.photos/seed/team-zhice/160/160',
    status: 'active',
    memberCount: 3,
    maxMemberCount: 5,
    createTime: '2026-04-01T10:00:00',
    updateTime: '2026-04-18T19:45:00',
    members: [
      {
        userId: '202100120016',
        nickname: '韩知序',
        avatarUrl: 'https://picsum.photos/seed/user-hanzhixu/120/120',
        role: 'leader'
      },
      {
        userId: '202100120028',
        nickname: '顾朝宁',
        avatarUrl: 'https://picsum.photos/seed/user-guzhaoning/120/120',
        role: 'member'
      },
      {
        userId: '202100120041',
        nickname: '陆曜臣',
        avatarUrl: 'https://picsum.photos/seed/user-luyaochen/120/120',
        role: 'member'
      }
    ]
  }

  return {
    activeTeam,
    createdTeams,
    invites: [
      {
        inviteId: 'INV20260418001',
        teamId: inviteTeam.teamId,
        teamName: inviteTeam.teamName,
        inviterId: '202100120016',
        inviterName: '韩知序',
        invitedUserId: STATIC_CURRENT_USER_ID,
        invitedUserName: STATIC_CURRENT_USER_NAME,
        status: 'pending',
        createTime: '2026-04-18T19:45:00',
        handleTime: ''
      },
      {
        inviteId: 'INV20260312007',
        teamId: 'TM20260301005',
        teamName: '数据建模特攻组',
        inviterId: '202100520086',
        inviterName: '沈临舟',
        invitedUserId: STATIC_CURRENT_USER_ID,
        invitedUserName: STATIC_CURRENT_USER_NAME,
        status: 'rejected',
        createTime: '2026-03-12T13:15:00',
        handleTime: '2026-03-12T20:10:00'
      }
    ],
    teamDetails: {
      [activeTeam.teamId]: activeTeam,
      [createdTeams[1].teamId]: createdTeams[1],
      [createdTeams[2].teamId]: createdTeams[2],
      [inviteTeam.teamId]: inviteTeam,
      TM20260301005: {
        teamId: 'TM20260301005',
        teamName: '数据建模特攻组',
        leaderId: '202100520086',
        description: '主做指标建模、SQL 治理和实验报告整理，交付风格偏稳健，适合需要持续迭代的数据分析类项目。',
        avatarUrl: 'https://picsum.photos/seed/team-dataforce/160/160',
        status: 'active',
        memberCount: 4,
        maxMemberCount: 6,
        createTime: '2026-03-01T09:20:00',
        updateTime: '2026-03-12T13:15:00',
        members: [
          {
            userId: '202100520086',
            nickname: '沈临舟',
            avatarUrl: 'https://picsum.photos/seed/user-shenlinzhou/120/120',
            role: 'leader'
          },
          {
            userId: '202100520104',
            nickname: '曹时屿',
            avatarUrl: 'https://picsum.photos/seed/user-caoshiyu/120/120',
            role: 'member'
          },
          {
            userId: '202100520126',
            nickname: '周慕白',
            avatarUrl: 'https://picsum.photos/seed/user-zhoumubai/120/120',
            role: 'member'
          },
          {
            userId: '202100520139',
            nickname: '贺闻舒',
            avatarUrl: 'https://picsum.photos/seed/user-hewenshu/120/120',
            role: 'member'
          }
        ]
      }
    }
  }
}

function cloneData(value) {
  return JSON.parse(JSON.stringify(value))
}

const tabs = [
  { key: 'myTeam', label: '我的团队' },
  { key: 'created', label: '我创建的团队' },
  { key: 'invites', label: '收到的邀请' }
]

const activeView = ref('myTeam')
const pageLoading = ref(false)
const teamSubmitting = ref(false)
const inviteSubmitting = ref(false)
const detailLoading = ref(false)

const activeTeam = ref(null)
const createdTeams = ref([])
const invites = ref([])
const detailTeam = ref(null)
const selectedInvite = ref(null)
const detailDialogMode = ref('team')
const detailFromView = ref('myTeam')

const teamDialogVisible = ref(false)
const teamDialogMode = ref('create')
const inviteDialogVisible = ref(false)
const detailDialogVisible = ref(false)

const teamForm = reactive({
  teamId: '',
  teamName: '',
  description: '',
  avatarUrl: '',
  maxMemberCount: 10
})

const inviteForm = reactive({
  invitedUserId: ''
})

const staticWorkspace = ref(createStaticWorkspace())

const normalizeTeam = (raw = {}) => ({
  teamId: raw.teamId || raw.id || '',
  teamName: raw.teamName || raw.name || '未命名团队',
  leaderId: raw.leaderId || '',
  description: raw.description || '',
  avatarUrl: raw.avatarUrl || '',
  status: raw.status || 'active',
  memberCount: Number(raw.memberCount ?? raw.members?.length ?? 0),
  maxMemberCount: Number(raw.maxMemberCount ?? 10),
  createTime: raw.createTime || raw.createdAt || '',
  updateTime: raw.updateTime || raw.updatedAt || '',
  members: Array.isArray(raw.members)
    ? raw.members.map((member) => ({
        userId: member.userId || '',
        nickname: member.nickname || member.name || '未命名成员',
        avatarUrl: member.avatarUrl || '',
        role: member.role || 'member'
      }))
    : []
})

const normalizeInvite = (raw = {}) => ({
  inviteId: raw.inviteId || '',
  teamId: raw.teamId || '',
  teamName: raw.teamName || '未命名团队',
  inviterId: raw.inviterId || '',
  inviterName: raw.inviterName || '',
  invitedUserId: raw.invitedUserId || '',
  invitedUserName: raw.invitedUserName || '',
  status: raw.status || 'pending',
  createTime: raw.createTime || raw.createdAt || '',
  handleTime: raw.handleTime || raw.updatedAt || ''
})

const unwrap = (response) => response?.data ?? response
const currentUserId = computed(() => String(authStore.userInfo?.userId || authStore.userInfo?.id || STATIC_CURRENT_USER_ID))
const currentUserName = computed(() => authStore.userInfo?.nickname || authStore.userInfo?.username || STATIC_CURRENT_USER_NAME)

function syncWorkspaceFromStatic() {
  const workspace = staticWorkspace.value
  activeTeam.value = workspace.activeTeam ? normalizeTeam(cloneData(workspace.activeTeam)) : null
  createdTeams.value = sortByLatest((workspace.createdTeams || []).map((team) => normalizeTeam(cloneData(team))))
  invites.value = sortByLatest((workspace.invites || []).map((invite) => normalizeInvite(cloneData(invite))))
}

function getStaticTeamDetail(teamId) {
  const raw = staticWorkspace.value.teamDetails?.[teamId]
  return raw ? normalizeTeam(cloneData(raw)) : null
}

function replaceStaticTeam(team) {
  const normalized = normalizeTeam(team)
  normalized.memberCount = normalized.members.length || normalized.memberCount
  staticWorkspace.value.teamDetails = {
    ...staticWorkspace.value.teamDetails,
    [normalized.teamId]: cloneData(normalized)
  }
  staticWorkspace.value.createdTeams = staticWorkspace.value.createdTeams.map((item) =>
    String(item.teamId) === String(normalized.teamId) ? cloneData(normalized) : item
  )
  if (String(staticWorkspace.value.activeTeam?.teamId || '') === String(normalized.teamId)) {
    staticWorkspace.value.activeTeam = normalized.status === 'active' ? cloneData(normalized) : null
  }
}

function nowIsoString() {
  return new Date().toISOString()
}

const hasActiveTeam = computed(() => Boolean(activeTeam.value?.teamId))
const leaderTeamIds = computed(() => new Set(createdTeams.value.map((team) => String(team.teamId))))
const isLeader = computed(() => {
  if (!activeTeam.value?.teamId) {
    return false
  }
  if (currentUserId.value && String(activeTeam.value.leaderId) === currentUserId.value) {
    return true
  }
  return leaderTeamIds.value.has(String(activeTeam.value.teamId))
})
const showLeaderActions = computed(() => hasActiveTeam.value && isLeader.value)
const detailLeaderName = computed(() => {
  if (!detailTeam.value?.members?.length) {
    return '--'
  }
  return detailTeam.value.members.find((member) => member.role === 'leader')?.nickname || '--'
})
const currentRoleLabel = computed(() => {
  if (!hasActiveTeam.value) {
    return '未加入团队'
  }
  return isLeader.value ? '队长' : '成员'
})
const pendingInviteCount = computed(() => invites.value.filter((invite) => invite.status === 'pending').length)
const currentViewMeta = computed(() => {
  return {
    myTeam: {
      title: '我的团队',
      desc: '这里以简洁列表形式展示你当前团队和成员信息。',
      empty: '你当前没有加入活跃团队。'
    },
    created: {
      title: '我创建的团队',
      desc: '这里按列表展示你作为队长创建过的团队。',
      empty: '目前还没有你创建过的团队记录。'
    },
    invites: {
      title: '收到的邀请',
      desc: '这里按列表展示你收到的团队邀请，详情和处理操作都放在弹窗中。',
      empty: '当前没有团队邀请记录。'
    }
  }[activeView.value]
})
const currentList = computed(() => (activeView.value === 'created' ? createdTeams.value : invites.value))
const detailDialogTitle = computed(() => detailDialogMode.value === 'invite' ? '邀请详情' : '团队详情')
const detailDialogDesc = computed(() => {
  if (detailDialogMode.value === 'invite') {
    return '查看邀请信息，并在需要时完成接受或拒绝操作。'
  }
  if (detailFromView.value === 'created') {
    return '查看我创建的团队详情和成员信息。'
  }
  return '查看团队完整信息和成员列表。'
})
const canManageDetail = computed(() => {
  if (!detailDialogVisible.value || detailDialogMode.value !== 'team') {
    return false
  }
  if (!detailTeam.value?.teamId || !activeTeam.value?.teamId || !isLeader.value) {
    return false
  }
  return String(detailTeam.value.teamId) === String(activeTeam.value.teamId) && detailTeam.value.status !== 'disbanded'
})

function formatDateTime(value) {
  if (!value) {
    return '--'
  }
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function roleText(role) {
  return role === 'leader' ? '队长' : '成员'
}

function statusText(status) {
  return status === 'disbanded' ? '已解散' : '活跃中'
}

function statusClass(status) {
  return status === 'disbanded' ? 'state-pill--muted' : 'state-pill--active'
}

function inviteStatusText(status) {
  return {
    pending: '待处理',
    accepted: '已接受',
    rejected: '已拒绝',
    cancelled: '已取消'
  }[status] || status || '--'
}

function inviteStatusClass(status) {
  if (status === 'accepted') {
    return 'state-pill--active'
  }
  if (status === 'rejected' || status === 'cancelled') {
    return 'state-pill--muted'
  }
  return 'state-pill--pending'
}

function sortByLatest(list = [], fieldName = 'createTime') {
  return [...list].sort((left, right) => {
    const leftTime = new Date(left[fieldName] || 0).getTime()
    const rightTime = new Date(right[fieldName] || 0).getTime()
    return rightTime - leftTime
  })
}

function getListKey(item) {
  return activeView.value === 'created' ? item.teamId : item.inviteId
}

function getListTitle(item) {
  return activeView.value === 'created' ? item.teamName : item.teamName
}

function getListDescription(item) {
  if (activeView.value === 'created') {
    return item.description || '暂无简介'
  }
  return `邀请人：${item.inviterName || '--'}，点击查看详情后可查看团队信息并处理邀请。`
}

function getListMeta(item) {
  if (activeView.value === 'created') {
    return [
      `成员 ${item.memberCount} / ${item.maxMemberCount}`,
      `创建于 ${formatDateTime(item.createTime)}`,
      `更新于 ${formatDateTime(item.updateTime || item.createTime)}`
    ]
  }
  const meta = [`创建于 ${formatDateTime(item.createTime)}`]
  if (item.handleTime) {
    meta.push(`处理于 ${formatDateTime(item.handleTime)}`)
  }
  return meta
}

function getListStatusText(item) {
  return activeView.value === 'created' ? statusText(item.status) : inviteStatusText(item.status)
}

function getListStatusClass(item) {
  return activeView.value === 'created' ? statusClass(item.status) : inviteStatusClass(item.status)
}

async function loadWorkspace() {
  if (USE_STATIC_TEAM_DEMO) {
    pageLoading.value = true
    syncWorkspaceFromStatic()
    pageLoading.value = false
    return
  }

  pageLoading.value = true

  const [activeResult, createdResult, inviteResult] = await Promise.allSettled([
    getMyTeamAPI(),
    getMyTeamListAPI({ pageNum: 1, pageSize: 50 }),
    getMyTeamInvitesAPI()
  ])

  if (activeResult.status === 'fulfilled') {
    const data = unwrap(activeResult.value)
    activeTeam.value = data ? normalizeTeam(data) : null
  } else {
    activeTeam.value = null
    console.error('Load active team error:', activeResult.reason)
  }

  if (createdResult.status === 'fulfilled') {
    const data = unwrap(createdResult.value)
    const teams = Array.isArray(data?.teams) ? data.teams : []
    createdTeams.value = sortByLatest(teams.map(normalizeTeam))
  } else {
    createdTeams.value = []
    console.error('Load created teams error:', createdResult.reason)
  }

  if (inviteResult.status === 'fulfilled') {
    const data = unwrap(inviteResult.value)
    const inviteList = Array.isArray(data) ? data : []
    invites.value = sortByLatest(inviteList.map(normalizeInvite))
  } else {
    invites.value = []
    console.error('Load team invites error:', inviteResult.reason)
  }

  if ([activeResult, createdResult, inviteResult].some((result) => result.status === 'rejected')) {
    ElMessage.error('部分团队数据加载失败，请稍后重试')
  }

  pageLoading.value = false
}

function resetTeamForm() {
  Object.assign(teamForm, {
    teamId: '',
    teamName: '',
    description: '',
    avatarUrl: '',
    maxMemberCount: 10
  })
}

function openCreateDialog() {
  if (hasActiveTeam.value) {
    ElMessage.warning('当前已加入活跃团队，不能重复创建团队')
    return
  }
  teamDialogMode.value = 'create'
  resetTeamForm()
  teamDialogVisible.value = true
}

function openEditDialog() {
  if (!activeTeam.value || !isLeader.value) {
    ElMessage.warning('仅队长可以编辑团队信息')
    return
  }
  teamDialogMode.value = 'edit'
  Object.assign(teamForm, {
    teamId: activeTeam.value.teamId,
    teamName: activeTeam.value.teamName,
    description: activeTeam.value.description || '',
    avatarUrl: activeTeam.value.avatarUrl || '',
    maxMemberCount: activeTeam.value.maxMemberCount || 10
  })
  teamDialogVisible.value = true
}

function openEditDialogFromDetail() {
  closeDetailDialog()
  openEditDialog()
}

function closeTeamDialog() {
  teamDialogVisible.value = false
  resetTeamForm()
}

async function submitTeamForm() {
  if (!teamForm.teamName) {
    ElMessage.warning('请输入团队名称')
    return
  }

  const maxMemberCount = Number(teamForm.maxMemberCount) || 10
  if (maxMemberCount < 2) {
    ElMessage.warning('最大成员数不能小于 2')
    return
  }
  if (teamDialogMode.value === 'edit' && activeTeam.value?.memberCount && maxMemberCount < activeTeam.value.memberCount) {
    ElMessage.warning(`最大成员数不能小于当前成员数 ${activeTeam.value.memberCount}`)
    return
  }

  const payload = {
    teamName: teamForm.teamName,
    description: teamForm.description || undefined,
    avatarUrl: teamForm.avatarUrl || undefined,
    maxMemberCount
  }

  teamSubmitting.value = true
  try {
    if (USE_STATIC_TEAM_DEMO) {
      const currentTime = nowIsoString()

      if (teamDialogMode.value === 'create') {
        const nextTeam = normalizeTeam({
          teamId: `TM${Date.now()}`,
          leaderId: currentUserId.value,
          status: 'active',
          memberCount: 1,
          createTime: currentTime,
          updateTime: currentTime,
          ...payload,
          members: [
            {
              userId: currentUserId.value,
              nickname: currentUserName.value,
              avatarUrl: authStore.userInfo?.avatar || '',
              role: 'leader'
            }
          ]
        })

        staticWorkspace.value.activeTeam = cloneData(nextTeam)
        staticWorkspace.value.createdTeams = [cloneData(nextTeam), ...staticWorkspace.value.createdTeams]
        staticWorkspace.value.teamDetails = {
          ...staticWorkspace.value.teamDetails,
          [nextTeam.teamId]: cloneData(nextTeam)
        }
        ElMessage.success('团队创建成功')
      } else {
        const updatedTeam = normalizeTeam({
          ...cloneData(staticWorkspace.value.teamDetails[teamForm.teamId] || activeTeam.value),
          ...payload,
          teamId: teamForm.teamId,
          updateTime: currentTime
        })

        replaceStaticTeam(updatedTeam)
        ElMessage.success('团队信息已更新')
      }

      activeView.value = 'myTeam'
      closeTeamDialog()
      await loadWorkspace()
      return
    }

    if (teamDialogMode.value === 'create') {
      await createTeamAPI(payload)
      ElMessage.success('团队创建成功')
    } else {
      await updateTeamAPI({
        teamId: teamForm.teamId,
        ...payload
      })
      ElMessage.success('团队信息已更新')
    }
    activeView.value = 'myTeam'
    closeTeamDialog()
    await loadWorkspace()
  } catch (error) {
    console.error('Submit team form error:', error)
    ElMessage.error(error?.info || error?.message || '团队操作失败')
  } finally {
    teamSubmitting.value = false
  }
}

function openInviteDialog() {
  if (!activeTeam.value || !isLeader.value) {
    ElMessage.warning('仅队长可以邀请成员')
    return
  }
  inviteForm.invitedUserId = ''
  inviteDialogVisible.value = true
}

function openInviteDialogFromDetail() {
  closeDetailDialog()
  openInviteDialog()
}

function closeInviteDialog() {
  inviteDialogVisible.value = false
  inviteForm.invitedUserId = ''
}

async function submitInvite() {
  if (!activeTeam.value?.teamId) {
    ElMessage.warning('当前没有可邀请成员的团队')
    return
  }
  if (!inviteForm.invitedUserId) {
    ElMessage.warning('请输入被邀请学生用户 ID')
    return
  }
  if (activeTeam.value.members.some((member) => String(member.userId) === String(inviteForm.invitedUserId))) {
    ElMessage.warning('该学生已在当前团队中')
    return
  }
  if (activeTeam.value.memberCount >= activeTeam.value.maxMemberCount) {
    ElMessage.warning('团队人数已满，无法继续邀请成员')
    return
  }

  inviteSubmitting.value = true
  try {
    if (USE_STATIC_TEAM_DEMO) {
      ElMessage.success(`已向学生用户 ${inviteForm.invitedUserId} 发送邀请`)
      closeInviteDialog()
      return
    }

    await inviteTeamMemberAPI({
      teamId: activeTeam.value.teamId,
      invitedUserId: inviteForm.invitedUserId
    })
    ElMessage.success('邀请已发送')
    closeInviteDialog()
    await loadWorkspace()
  } catch (error) {
    console.error('Invite member error:', error)
    ElMessage.error(error?.info || error?.message || '发送邀请失败')
  } finally {
    inviteSubmitting.value = false
  }
}

async function handleInvite(invite, accept) {
  inviteSubmitting.value = true
  try {
    if (USE_STATIC_TEAM_DEMO) {
      const currentTime = nowIsoString()
      staticWorkspace.value.invites = staticWorkspace.value.invites.map((item) =>
        String(item.inviteId) === String(invite.inviteId)
          ? {
              ...item,
              status: accept ? 'accepted' : 'rejected',
              handleTime: currentTime
            }
          : item
      )

      if (accept) {
        const targetTeam = cloneData(staticWorkspace.value.teamDetails[invite.teamId] || {})
        if (targetTeam.teamId) {
          const exists = (targetTeam.members || []).some((member) => String(member.userId) === currentUserId.value)
          if (!exists) {
            targetTeam.members = [
              ...(targetTeam.members || []),
              {
                userId: currentUserId.value,
                nickname: currentUserName.value,
                avatarUrl: authStore.userInfo?.avatar || '',
                role: 'member'
              }
            ]
          }
          targetTeam.memberCount = targetTeam.members.length
          targetTeam.updateTime = currentTime
          staticWorkspace.value.teamDetails = {
            ...staticWorkspace.value.teamDetails,
            [targetTeam.teamId]: targetTeam
          }
          staticWorkspace.value.activeTeam = cloneData(targetTeam)
        }
      }

      ElMessage.success(accept ? '已接受团队邀请' : '已拒绝团队邀请')
      activeView.value = accept ? 'myTeam' : 'invites'
      closeDetailDialog()
      await loadWorkspace()
      return
    }

    await handleTeamInviteAPI({
      inviteId: invite.inviteId,
      accept
    })
    ElMessage.success(accept ? '已接受团队邀请' : '已拒绝团队邀请')
    activeView.value = accept ? 'myTeam' : 'invites'
    closeDetailDialog()
    await loadWorkspace()
  } catch (error) {
    console.error('Handle team invite error:', error)
    ElMessage.error(error?.info || error?.message || '处理邀请失败')
  } finally {
    inviteSubmitting.value = false
  }
}

async function processInvite(accept) {
  if (!selectedInvite.value) {
    return
  }
  await handleInvite(selectedInvite.value, accept)
}

async function disbandCurrentTeam() {
  if (!activeTeam.value?.teamId || !isLeader.value) {
    ElMessage.warning('仅队长可以解散团队')
    return
  }
  if (!window.confirm(`确认解散团队“${activeTeam.value.teamName}”吗？`)) {
    return
  }

  try {
    if (USE_STATIC_TEAM_DEMO) {
      const currentTime = nowIsoString()
      const target = cloneData(staticWorkspace.value.teamDetails[activeTeam.value.teamId] || activeTeam.value)
      target.status = 'disbanded'
      target.updateTime = currentTime
      replaceStaticTeam(target)
      staticWorkspace.value.activeTeam = null
      ElMessage.success('团队已解散')
      closeDetailDialog()
      await loadWorkspace()
      return
    }

    await disbandTeamAPI(activeTeam.value.teamId)
    ElMessage.success('团队已解散')
    closeDetailDialog()
    await loadWorkspace()
  } catch (error) {
    console.error('Disband team error:', error)
    ElMessage.error(error?.info || error?.message || '解散团队失败')
  }
}

async function openTeamDetail(teamId, source = 'myTeam') {
  detailDialogMode.value = 'team'
  detailFromView.value = source
  selectedInvite.value = null
  detailDialogVisible.value = true
  detailLoading.value = true
  detailTeam.value = null

  if (USE_STATIC_TEAM_DEMO) {
    detailTeam.value = getStaticTeamDetail(teamId)
    detailLoading.value = false
    if (!detailTeam.value) {
      ElMessage.warning('暂未找到该团队的静态详情')
    }
    return
  }

  try {
    const response = await getTeamDetailAPI(teamId)
    const data = unwrap(response)
    detailTeam.value = data ? normalizeTeam(data) : null
  } catch (error) {
    console.error('Load team detail error:', error)
    ElMessage.error(error?.info || error?.message || '团队详情加载失败')
  } finally {
    detailLoading.value = false
  }
}

async function openInviteDetail(invite) {
  detailDialogMode.value = 'invite'
  detailFromView.value = 'invites'
  selectedInvite.value = invite
  detailDialogVisible.value = true
  detailLoading.value = true
  detailTeam.value = null

  if (USE_STATIC_TEAM_DEMO) {
    detailTeam.value = invite.teamId ? getStaticTeamDetail(invite.teamId) : null
    detailLoading.value = false
    return
  }

  if (!invite.teamId) {
    detailLoading.value = false
    return
  }

  try {
    const response = await getTeamDetailAPI(invite.teamId)
    const data = unwrap(response)
    detailTeam.value = data ? normalizeTeam(data) : null
  } catch (error) {
    console.error('Load invite team detail error:', error)
    ElMessage.error(error?.info || error?.message || '团队详情加载失败')
  } finally {
    detailLoading.value = false
  }
}

function closeDetailDialog() {
  detailDialogVisible.value = false
  detailLoading.value = false
  detailTeam.value = null
  selectedInvite.value = null
  detailFromView.value = 'myTeam'
  detailDialogMode.value = 'team'
}

onMounted(() => {
  loadWorkspace()
})
</script>

<style scoped>
.team-workspace {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.team-toolbar,
.team-stage,
.dialog-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
}

.team-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  padding: 18px 20px;
}

.toolbar-left,
.toolbar-right,
.panel-actions,
.dialog-foot,
.stack-item-side {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.toolbar-left {
  flex: 1;
}

.toolbar-right {
  justify-content: flex-end;
}

.view-tab,
.action-btn {
  border: 1px solid #d6dae1;
  background: #ffffff;
  color: #374151;
  border-radius: 10px;
  padding: 10px 16px;
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-tab {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.view-tab:hover,
.action-btn:hover:not(:disabled) {
  border-color: #9ca3af;
}

.view-tab.active {
  border-color: #111827;
  color: #111827;
  background: #f3f4f6;
}

.view-tab-count {
  min-width: 18px;
  height: 18px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: #111827;
  color: #ffffff;
  font-size: 12px;
  padding: 0 5px;
}

.action-btn--primary {
  border-color: #111827;
  background: #111827;
  color: #ffffff;
}

.action-btn--danger {
  border-color: #ef4444;
  color: #ef4444;
  background: #ffffff;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.team-stage {
  padding: 22px;
}

.stage-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 18px;
}

.stage-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #111827;
}

.stage-desc {
  margin: 8px 0 0;
  font-size: 14px;
  line-height: 1.7;
  color: #6b7280;
}

.member-panel,
.stack-item,
.detail-block {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
}

.stack-item--table {
  align-items: stretch;
}

.table-grid {
  display: grid;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  overflow: hidden;
  background: #ffffff;
}

.table-grid--team {
  flex: 1;
  grid-template-columns: 140px minmax(0, 1fr) 140px minmax(0, 1fr);
}

.table-grid--member {
  grid-template-columns: 1.1fr 0.8fr 1.2fr;
}

.table-cell {
  padding: 14px 16px;
  font-size: 14px;
  line-height: 1.7;
  border-right: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
  word-break: break-all;
}

.table-cell--head {
  background: #f3f4f6;
  color: #374151;
  font-weight: 600;
}

.table-cell--value {
  background: #ffffff;
  color: #111827;
}

.table-grid > .table-cell:nth-child(4n),
.table-grid--member > .table-cell:nth-child(3n) {
  border-right: none;
}

.member-panel--compact {
  padding: 18px;
}

.member-inline-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.member-inline-item {
  display: inline-flex;
  align-items: center;
  min-height: 36px;
  padding: 0 14px;
  border-radius: 999px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  font-size: 14px;
  color: #111827;
}

.member-inline-list--detail {
  gap: 8px;
}

.member-inline-item--detail {
  gap: 8px;
  min-height: 34px;
  padding: 0 12px;
}

.member-inline-role {
  font-size: 12px;
  color: #6b7280;
  background: #f3f4f6;
  border-radius: 999px;
  padding: 2px 8px;
}

.state-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  padding: 0 12px;
  border-radius: 999px;
  font-size: 12px;
  border: 1px solid #d1d5db;
  color: #4b5563;
  background: #ffffff;
}

.state-pill--plain {
  border-color: #d1d5db;
  color: #374151;
}

.state-pill--active {
  border-color: #bbf7d0;
  color: #15803d;
  background: #f0fdf4;
}

.state-pill--muted {
  border-color: #e5e7eb;
  color: #6b7280;
  background: #f9fafb;
}

.state-pill--pending {
  border-color: #fde68a;
  color: #b45309;
  background: #fffbeb;
}

.panel-actions {
  margin-top: 16px;
}

.member-panel,
.detail-block {
  padding: 14px;
}

.member-panel {
  margin-top: 16px;
}

.section-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.section-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

.section-sub {
  font-size: 13px;
  color: #6b7280;
}

.member-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.member-grid--detail {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.member-card {
  padding: 14px;
  border-radius: 10px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
}

.member-name-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.member-name {
  font-size: 15px;
  font-weight: 600;
  color: #111827;
}

.member-role {
  font-size: 12px;
  color: #374151;
  background: #f3f4f6;
  border-radius: 999px;
  padding: 4px 10px;
}

.member-id {
  margin-top: 10px;
  font-size: 13px;
  color: #6b7280;
}

.list-panel {
  display: flex;
  flex-direction: column;
}

.stack-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.stack-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 18px;
  padding: 18px;
}

.stack-item-main {
  flex: 1;
  min-width: 0;
}

.stack-item-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.stack-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #111827;
}

.stack-desc {
  margin: 12px 0 0;
  font-size: 14px;
  line-height: 1.7;
  color: #4b5563;
}

.stack-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 12px;
  font-size: 13px;
  color: #6b7280;
}

.stack-item-side {
  align-items: center;
}

.stage-empty {
  min-height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  text-align: center;
  font-size: 14px;
  line-height: 1.8;
  color: #6b7280;
  border: 1px dashed #d1d5db;
  border-radius: 12px;
  background: #fafafa;
}

.stage-empty--inner {
  min-height: 120px;
}

.dialog-mask {
  position: fixed;
  inset: 0;
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(15, 23, 42, 0.46);
  backdrop-filter: blur(2px);
}

.dialog-card {
  width: 720px;
  max-width: 100%;
  max-height: calc(100vh - 32px);
  overflow: auto;
}

.dialog-card--form {
  width: 560px;
}

.dialog-card--detail {
  width: 760px;
}

.dialog-head,
.dialog-body,
.dialog-foot {
  padding: 16px 18px;
}

.dialog-head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.dialog-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #111827;
}

.dialog-desc {
  margin: 8px 0 0;
  font-size: 14px;
  line-height: 1.7;
  color: #6b7280;
}

.dialog-close {
  width: 34px;
  height: 34px;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  background: #ffffff;
  color: #4b5563;
  font-size: 18px;
  cursor: pointer;
}

.dialog-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.dialog-body--detail {
  gap: 10px;
}

.dialog-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.dialog-label {
  font-size: 13px;
  color: #374151;
}

.dialog-input,
.dialog-textarea {
  width: 100%;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  background: #ffffff;
  color: #111827;
  font-size: 14px;
  padding: 11px 13px;
}

.dialog-input:focus,
.dialog-textarea:focus {
  outline: none;
  border-color: #111827;
}

.dialog-textarea {
  resize: vertical;
}

.dialog-foot {
  justify-content: flex-end;
  border-top: 1px solid #e5e7eb;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px;
  border-radius: 10px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
}

.detail-item--full {
  grid-column: 1 / -1;
}

.detail-key {
  font-size: 13px;
  color: #6b7280;
}

.detail-value {
  font-size: 14px;
  line-height: 1.6;
  color: #111827;
}

@media (max-width: 1024px) {
  .member-grid--detail,
  .detail-grid,
  .table-grid--team,
  .table-grid--member {
    grid-template-columns: 1fr;
  }

  .table-grid > .table-cell,
  .table-grid--member > .table-cell {
    border-right: none;
  }
}

@media (max-width: 768px) {
  .team-toolbar,
  .stack-item,
  .stack-item-top,
  .section-head,
  .dialog-head,
  .dialog-foot {
    flex-direction: column;
    align-items: stretch;
  }

  .toolbar-right,
  .stack-item-side,
  .panel-actions {
    justify-content: flex-start;
  }

  .team-stage,
  .team-toolbar,
  .dialog-head,
  .dialog-body,
  .dialog-foot {
    padding: 16px;
  }

  .view-tab,
  .action-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
