<template>
  <div class="message-center-page">
    <div class="message-center-card">
      <div class="type-tabs">
        <div class="tabs-row">
          <el-tabs v-model="activeType" @tab-change="handleTypeChange">
            <el-tab-pane
              v-for="tab in messageTypes"
              :key="tab.key"
              :name="tab.key"
            >
              <template #label>
                <span class="tab-label">
                  <el-icon class="tab-icon">
                    <component :is="tab.icon" />
                  </el-icon>
                  {{ tab.label }}
                  <el-badge
                    v-if="unreadCountByType[tab.key] > 0"
                    :value="unreadCountByType[tab.key]"
                    class="tab-badge"
                  />
                </span>
              </template>
            </el-tab-pane>
          </el-tabs>

          <div class="header-tools">
            <el-input
              v-model="keyword"
              placeholder="搜索消息内容"
              clearable
              class="search-input"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
          </div>
        </div>
      </div>

      <section class="message-center-main">
        <aside class="left-panel">
          <div v-if="activeType === 'my'" class="left-topbar">
            <div class="sub-tabs" role="tablist" aria-label="我的消息子分类">
              <button
                type="button"
                class="sub-tab-btn"
                :class="{ active: mySubType === 'private' }"
                role="tab"
                :aria-selected="mySubType === 'private'"
                @click="switchMySubType('private')"
              >
                私信
              </button>
              <button
                type="button"
                class="sub-tab-btn"
                :class="{ active: mySubType === 'notice' }"
                role="tab"
                :aria-selected="mySubType === 'notice'"
                @click="switchMySubType('notice')"
              >
                系统通知
              </button>
            </div>

            <el-button
              v-if="mySubType === 'private'"
              type="primary"
              class="new-chat-btn"
              @click="openNewChat"
            >
              <el-icon><Plus /></el-icon>
              发起私信
            </el-button>
          </div>

          <!-- 私信会话列表（仅“我的消息”下展示） -->
          <div v-if="isPrivateMode" class="conversation-list" role="list">
            <div
              v-for="conv in filteredConversations"
              :key="conv.id"
              class="conversation-item"
              :class="{ active: conv.id === selectedConversationId }"
              role="listitem"
              @click="selectConversation(conv.id)"
            >
              <el-avatar :size="44" :src="conv.peerAvatar" class="message-avatar">
                {{ conv.peerName?.slice(0, 1) || 'U' }}
              </el-avatar>

              <div class="conversation-meta">
                <div class="meta-top">
                  <div class="from-row">
                    <span class="from-name">{{ conv.peerName }}</span>
                    <span class="role-tag" :class="conv.peerRole">
                      {{ roleTextMap[conv.peerRole] || '用户' }}
                    </span>
                  </div>
                  <span class="time">{{ conv.lastTimeText }}</span>
                </div>

                <div class="meta-bottom">
                  <p class="summary">{{ conv.lastMessage }}</p>
                  <el-badge
                    v-if="conv.unread > 0"
                    :value="conv.unread"
                    class="unread-badge"
                  />
                </div>
              </div>
            </div>

            <div v-if="!filteredConversations.length" class="list-empty">
              <el-empty description="暂无私信会话" />
            </div>
          </div>

          <!-- 通知列表（收藏关注/评论/回复/系统通知） -->
          <div v-else class="message-list" role="list">
            <div
              v-for="item in filteredNotices"
              :key="item.id"
              class="message-item"
              :class="{ active: item.id === selectedNoticeId }"
              role="listitem"
              @click="selectNotice(item.id)"
            >
              <el-avatar :size="44" :src="item.avatar" class="message-avatar">
                {{ item.fromName?.slice(0, 1) || 'U' }}
              </el-avatar>

              <div class="message-meta">
                <div class="meta-top">
                  <div class="from-row">
                    <span class="from-name">{{ item.fromName }}</span>
                    <span v-if="item.subTitle" class="sub-title">{{ item.subTitle }}</span>
                  </div>
                  <span class="time">{{ item.timeText }}</span>
                </div>

                <div class="meta-bottom">
                  <p class="summary">{{ item.summary }}</p>
                  <el-badge
                    v-if="item.unread > 0"
                    :value="item.unread"
                    class="unread-badge"
                  />
                </div>
              </div>
            </div>

            <div v-if="!filteredNotices.length" class="list-empty">
              <el-empty description="暂无消息" />
            </div>
          </div>
        </aside>

        <main class="right-panel">
          <!-- 私信聊天窗口 -->
          <div v-if="isPrivateMode" class="chat">
            <div v-if="selectedConversation" class="chat-inner">
              <div class="chat-header">
                <div class="chat-peer">
                  <el-avatar :size="40" :src="selectedConversation.peerAvatar" class="chat-avatar">
                    {{ selectedConversation.peerName?.slice(0, 1) || 'U' }}
                  </el-avatar>
                  <div class="chat-peer-meta">
                    <div class="chat-peer-name-row">
                      <span class="chat-peer-name">{{ selectedConversation.peerName }}</span>
                      <span class="role-tag" :class="selectedConversation.peerRole">
                        {{ roleTextMap[selectedConversation.peerRole] || '用户' }}
                      </span>
                    </div>
                    <span class="chat-peer-tip">在这里可以和企业/同学进行私信交流</span>
                  </div>
                </div>
              </div>

              <div ref="chatScroller" class="chat-scroller">
                <div
                  v-for="msg in selectedConversationMessages"
                  :key="msg.id"
                  class="chat-msg-row"
                  :class="{ me: msg.fromId === currentUser.id }"
                >
                  <el-avatar
                    :size="32"
                    :src="msg.fromId === currentUser.id ? currentUser.avatar : selectedConversation.peerAvatar"
                    class="chat-msg-avatar"
                  >
                    {{ (msg.fromId === currentUser.id ? currentUser.name : selectedConversation.peerName)?.slice(0, 1) }}
                  </el-avatar>

                  <div class="chat-msg-main">
                    <div class="chat-bubble">
                      <div class="chat-text">{{ msg.content }}</div>
                    </div>
                    <div class="chat-time-out">{{ msg.timeText }}</div>
                  </div>
                </div>
              </div>

              <div class="chat-input">
                <el-input
                  v-model="draftText"
                  type="textarea"
                  :rows="2"
                  class="chat-textarea"
                  placeholder="输入消息，Enter 发送，Shift+Enter 换行"
                  @keydown.enter.exact.prevent="sendMessage"
                />
                <div class="chat-send-row">
                  <el-button type="primary" :disabled="!draftText.trim()" @click="sendMessage">
                    发送
                  </el-button>
                </div>
              </div>
            </div>

            <div v-else class="detail-empty">
              <el-empty description="请选择左侧一个会话开始聊天" />
            </div>
          </div>

          <!-- 通知详情窗口 -->
          <div v-else>
            <div v-if="selectedNotice" class="detail">
              <div class="detail-header">
                <div class="detail-title">
                  <h2 class="detail-h2">{{ selectedNotice.title }}</h2>
                  <div class="detail-sub">
                    <span class="detail-from">来自：{{ selectedNotice.fromName }}</span>
                    <span class="detail-sep">·</span>
                    <span class="detail-time">{{ selectedNotice.timeText }}</span>
                  </div>
                </div>

                <div class="detail-actions">
                  <el-button
                    v-if="selectedNotice.unread > 0"
                    type="primary"
                    @click="markSelectedNoticeAsRead"
                  >
                    标记已读
                  </el-button>
                  <el-button type="danger" plain @click="removeSelectedNotice">
                    删除
                  </el-button>
                </div>
              </div>

              <div class="detail-body">
                <p class="detail-content">
                  {{ selectedNotice.content }}
                </p>
              </div>
            </div>

            <div v-else class="detail-empty">
              <el-empty description="请选择左侧一条消息查看详情" />
            </div>
          </div>
        </main>
      </section>
    </div>

    <el-dialog v-model="showNewChatDialog" title="发起私信" width="420px">
      <div class="new-chat-dialog">
        <el-input
          v-model="contactKeyword"
          clearable
          placeholder="搜索联系人（学生/企业）"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>

        <div class="contact-list">
          <button
            v-for="c in filteredContacts"
            :key="c.id"
            type="button"
            class="contact-item"
            @click="startChatWith(c)"
          >
            <el-avatar :size="40" :src="c.avatar" class="contact-avatar">
              {{ c.name?.slice(0, 1) || 'U' }}
            </el-avatar>
            <div class="contact-meta">
              <div class="contact-name-row">
                <span class="contact-name">{{ c.name }}</span>
                <span class="role-tag" :class="c.role">{{ roleTextMap[c.role] || '用户' }}</span>
              </div>
              <span class="contact-desc">{{ c.desc }}</span>
            </div>
          </button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useAuthStore } from '@/store/modules/auth'

const authStore = useAuthStore()

const roleTextMap = {
  student: '学生',
  enterprise: '企业',
  teacher: '教师',
  admin: '管理员'
}

const currentUser = computed(() => ({
  id: authStore.username || authStore.userInfo?.id || authStore.token || 'me',
  name: authStore.username || '我',
  role: authStore.role || 'student',
  avatar: authStore.avatar || ''
}))

const messageTypes = [
  { key: 'my', label: '我的消息', icon: 'Bell' },
  { key: 'favorite', label: '收藏关注', icon: 'Star' },
  { key: 'comment', label: '评论', icon: 'ChatLineRound' },
  { key: 'reply', label: '回复', icon: 'ChatDotRound' }
]

const activeType = ref('my')
const mySubType = ref('private') // private | notice
const keyword = ref('')
const selectedNoticeId = ref('')
const selectedConversationId = ref('')

const isPrivateMode = computed(() => activeType.value === 'my' && mySubType.value === 'private')

// 通知类数据（非私信），使用 mock 数据占位，后续对接接口时只需要替换本数据源即可
const dataByType = ref({
  my: [
    {
      id: 'my-1',
      fromName: '系统通知',
      subTitle: '官方',
      avatar: '',
      title: '欢迎使用人才揭榜系统',
      summary: '你的账号已完成初始化，快去完善个人资料吧。',
      content:
        '欢迎使用人才揭榜系统！\n\n你可以在「个人中心」完善头像、简介、技能标签等信息，以便更快匹配项目与机会。',
      timeText: '今天 09:12',
      unread: 1
    },
    {
      id: 'my-2',
      fromName: '项目助手',
      subTitle: '',
      avatar: '',
      title: '项目进度提醒',
      summary: '你参与的项目「电商平台前端开发」有新的里程碑更新。',
      content:
        '项目「电商平台前端开发」里程碑已更新。\n\n建议你及时查看项目进度页，确认自己的任务与截止时间。',
      timeText: '昨天 20:41',
      unread: 0
    }
  ],
  favorite: [
    {
      id: 'fav-1',
      fromName: '你关注的发布方',
      subTitle: '',
      avatar: '',
      title: '发布方更新了项目需求',
      summary: '你关注的发布方更新了项目「AI智能客服系统开发」需求说明。',
      content:
        '你关注的发布方更新了项目「AI智能客服系统开发」的需求说明。\n\n可前往项目详情查看最新版本，评估是否需要调整方案。',
      timeText: '12-17 16:08',
      unread: 2
    }
  ],
  comment: [
    {
      id: 'cmt-1',
      fromName: '张同学',
      subTitle: '',
      avatar: '',
      title: '有人评论了你的动态',
      summary: '“方案写得很清晰，期待你的最终交付！”',
      content:
        '张同学评论了你的动态：\n\n“方案写得很清晰，期待你的最终交付！”\n\n你可以进入相关页面查看上下文并进行互动。',
      timeText: '12-16 11:32',
      unread: 1
    }
  ],
  reply: [
    {
      id: 'rpl-1',
      fromName: '李同学',
      subTitle: '',
      avatar: '',
      title: '有人回复了你的评论',
      summary: '“我这边也遇到同样的问题，已按你说的解决。”',
      content:
        '李同学回复了你的评论：\n\n“我这边也遇到同样的问题，已按你说的解决。”\n\n你可以继续回复，或将该讨论整理到项目说明中。',
      timeText: '12-15 18:20',
      unread: 0
    }
  ]
})

// =========================
// 私信：本地持久化（localStorage）
// =========================

const privateStorageKey = computed(() => `tbs_private_chat_${currentUser.value.id}`)

const privateState = ref({
  conversations: [],
  messagesByConversationId: {}
})

const contacts = ref([
  {
    id: 'stu-1001',
    name: '王同学',
    role: 'student',
    avatar: '',
    desc: '学生 · Web前端'
  },
  {
    id: 'stu-1002',
    name: '李同学',
    role: 'student',
    avatar: '',
    desc: '学生 · 数据分析'
  },
  {
    id: 'ent-2001',
    name: 'XX科技有限公司',
    role: 'enterprise',
    avatar: '',
    desc: '企业 · 发布方'
  },
  {
    id: 'ent-2002',
    name: 'YY网络公司',
    role: 'enterprise',
    avatar: '',
    desc: '企业 · 发布方'
  }
])

const showNewChatDialog = ref(false)
const contactKeyword = ref('')

const formatTime = (ts) => {
  if (!ts) return ''
  const d = new Date(ts)
  const now = new Date()
  const sameDay =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()

  const pad2 = (n) => String(n).padStart(2, '0')
  if (sameDay) return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`
  return `${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}

const buildDefaultPrivateState = () => {
  const now = Date.now()
  const conv1 = {
    id: 'conv-ent-2001',
    peerId: 'ent-2001',
    peerName: 'XX科技有限公司',
    peerRole: 'enterprise',
    peerAvatar: '',
    lastMessage: '你好，我们想了解一下你的项目经验。',
    lastTime: now - 1000 * 60 * 40,
    unread: 1
  }

  const conv2 = {
    id: 'conv-stu-1001',
    peerId: 'stu-1001',
    peerName: '王同学',
    peerRole: 'student',
    peerAvatar: '',
    lastMessage: '这周一起对一下需求文档？',
    lastTime: now - 1000 * 60 * 60 * 6,
    unread: 0
  }

  return {
    conversations: [conv1, conv2],
    messagesByConversationId: {
      [conv1.id]: [
        {
          id: 'm-1',
          fromId: conv1.peerId,
          content: '你好，我们想了解一下你的项目经验。',
          ts: now - 1000 * 60 * 40
        }
      ],
      [conv2.id]: [
        {
          id: 'm-2',
          fromId: conv2.peerId,
          content: '这周一起对一下需求文档？',
          ts: now - 1000 * 60 * 60 * 6
        },
        {
          id: 'm-3',
          fromId: currentUser.value.id,
          content: '可以的，我周五下午有空。',
          ts: now - 1000 * 60 * 60 * 5
        }
      ]
    }
  }
}

const loadPrivateState = () => {
  try {
    const raw = localStorage.getItem(privateStorageKey.value)
    if (!raw) {
      privateState.value = buildDefaultPrivateState()
      return
    }
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') {
      privateState.value = buildDefaultPrivateState()
      return
    }
    privateState.value = {
      conversations: Array.isArray(parsed.conversations) ? parsed.conversations : [],
      messagesByConversationId:
        parsed.messagesByConversationId && typeof parsed.messagesByConversationId === 'object'
          ? parsed.messagesByConversationId
          : {}
    }
  } catch {
    privateState.value = buildDefaultPrivateState()
  }
}

const persistPrivateState = () => {
  try {
    localStorage.setItem(privateStorageKey.value, JSON.stringify(privateState.value))
  } catch {
    // 忽略持久化失败（例如浏览器隐私模式限制）
  }
}

let persistTimer = null

const schedulePersistPrivateState = () => {
  if (persistTimer) clearTimeout(persistTimer)
  // localStorage 写入为同步操作，频繁写入会造成交互卡顿，这里做轻量节流
  persistTimer = setTimeout(() => {
    persistPrivateState()
    persistTimer = null
  }, 200)
}

watch(privateStorageKey, () => loadPrivateState(), { immediate: true })
watch(privateState, () => schedulePersistPrivateState(), { deep: true, flush: 'post' })

const privateConversations = computed(() => {
  const list = [...(privateState.value.conversations || [])]
  list.sort((a, b) => (b.lastTime || 0) - (a.lastTime || 0))
  return list.map((c) => ({
    ...c,
    lastTimeText: formatTime(c.lastTime)
  }))
})

const filteredContacts = computed(() => {
  const kw = contactKeyword.value.trim().toLowerCase()
  if (!kw) return contacts.value
  return contacts.value.filter((c) => `${c.name} ${c.desc}`.toLowerCase().includes(kw))
})

// =========================
// 未读数：通知 + 私信汇总
// =========================

const unreadCountByType = computed(() => {
  const result = {}
  for (const tab of messageTypes) {
    if (tab.key === 'my') {
      const noticeUnread = (dataByType.value.my || []).reduce((sum, item) => sum + (item.unread || 0), 0)
      const privateUnread = privateConversations.value.reduce((sum, c) => sum + (c.unread || 0), 0)
      result[tab.key] = noticeUnread + privateUnread
    } else {
      const items = dataByType.value[tab.key] || []
      result[tab.key] = items.reduce((sum, item) => sum + (item.unread || 0), 0)
    }
  }
  return result
})

// =========================
// 左侧列表：按模式过滤
// =========================

const noticeList = computed(() =>
  activeType.value === 'my' ? (dataByType.value.my || []) : (dataByType.value[activeType.value] || [])
)

const filteredNotices = computed(() => {
  const list = noticeList.value
  const kw = keyword.value.trim().toLowerCase()
  if (!kw) return list

  return list.filter((item) => {
    const hay = `${item.title} ${item.summary} ${item.content}`.toLowerCase()
    return hay.includes(kw)
  })
})

const filteredConversations = computed(() => {
  const kw = keyword.value.trim().toLowerCase()
  if (!kw) return privateConversations.value

  return privateConversations.value.filter((c) => {
    const hay = `${c.peerName} ${c.lastMessage}`.toLowerCase()
    return hay.includes(kw)
  })
})

const selectedNotice = computed(() => {
  if (!selectedNoticeId.value) return null
  return noticeList.value.find((item) => item.id === selectedNoticeId.value) || null
})

const selectedConversation = computed(() => {
  if (!selectedConversationId.value) return null
  return privateConversations.value.find((c) => c.id === selectedConversationId.value) || null
})

const selectedConversationMessages = computed(() => {
  if (!selectedConversation.value) return []
  const list = privateState.value.messagesByConversationId[selectedConversation.value.id] || []
  return list.map((m) => ({
    ...m,
    timeText: formatTime(m.ts)
  }))
})

const selectNotice = (id) => {
  selectedNoticeId.value = id
}

const selectConversation = (id) => {
  selectedConversationId.value = id
  const idx = privateState.value.conversations.findIndex((c) => c.id === id)
  if (idx !== -1) {
    privateState.value.conversations[idx].unread = 0
  }
  nextTick(() => scrollChatToBottom())
}

const switchMySubType = (value) => {
  mySubType.value = value
  selectedNoticeId.value = ''
  selectedConversationId.value = ''
}

const handleTypeChange = () => {
  keyword.value = ''
  selectedNoticeId.value = ''
  selectedConversationId.value = ''
}

const markSelectedNoticeAsRead = () => {
  if (!selectedNotice.value) return
  const items = dataByType.value[activeType.value] || []
  const target = items.find((it) => it.id === selectedNotice.value.id)
  if (target) target.unread = 0
}

const removeSelectedNotice = () => {
  if (!selectedNotice.value) return
  const items = dataByType.value[activeType.value] || []
  dataByType.value[activeType.value] = items.filter((it) => it.id !== selectedNotice.value.id)
  selectedNoticeId.value = ''
}

// =========================
// 私信：发消息与新建会话
// =========================

const chatScroller = ref()
const draftText = ref('')

const scrollChatToBottom = () => {
  const el = chatScroller.value
  if (!el) return
  el.scrollTop = el.scrollHeight
}

const openNewChat = () => {
  contactKeyword.value = ''
  showNewChatDialog.value = true
}

const startChatWith = (contact) => {
  const existing = privateState.value.conversations.find((c) => c.peerId === contact.id)
  if (existing) {
    selectedConversationId.value = existing.id
  } else {
    const now = Date.now()
    const convId = `conv-${contact.id}`
    privateState.value.conversations.unshift({
      id: convId,
      peerId: contact.id,
      peerName: contact.name,
      peerRole: contact.role,
      peerAvatar: contact.avatar || '',
      lastMessage: '已建立会话',
      lastTime: now,
      unread: 0
    })
    privateState.value.messagesByConversationId[convId] = [
      {
        id: `m-${now}`,
        fromId: currentUser.value.id,
        content: '你好，很高兴认识你！',
        ts: now
      }
    ]
    selectedConversationId.value = convId
  }

  showNewChatDialog.value = false
  nextTick(() => scrollChatToBottom())
}

const sendMessage = () => {
  if (!selectedConversation.value) return
  const text = draftText.value.trim()
  if (!text) return

  const now = Date.now()
  const convId = selectedConversation.value.id

  if (!privateState.value.messagesByConversationId[convId]) {
    privateState.value.messagesByConversationId[convId] = []
  }

  privateState.value.messagesByConversationId[convId].push({
    id: `m-${now}`,
    fromId: currentUser.value.id,
    content: text,
    ts: now
  })

  const idx = privateState.value.conversations.findIndex((c) => c.id === convId)
  if (idx !== -1) {
    privateState.value.conversations[idx].lastMessage = text
    privateState.value.conversations[idx].lastTime = now
  }

  draftText.value = ''
  nextTick(() => scrollChatToBottom())
}

onMounted(() => {
  // 默认不选中消息，避免首屏右侧闪烁
})
</script>

<style scoped>
.message-center-page {
  padding: 24px;
  background: #f5f7fb;
}

.message-center-card {
  max-width: 1200px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid #edf1fb;
  border-radius: 18px;
  box-shadow: 0 18px 35px rgba(15, 39, 106, 0.08);
  overflow: hidden;
}

.type-tabs {
  padding: 10px 14px 0;
  border-bottom: 1px solid #eef2fb;
}

.tabs-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.tabs-row :deep(.el-tabs__header) {
  margin: 0;
}

.tabs-row :deep(.el-tabs__nav-wrap::after) {
  display: none;
}

.header-tools {
  flex: none;
  width: 360px;
  padding-bottom: 10px;
}

.search-input :deep(.el-input__wrapper) {
  border-radius: 999px;
}

.tab-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.tab-icon {
  font-size: 16px;
}

.tab-badge {
  margin-left: 6px;
}

.message-center-main {
  display: flex;
  min-height: 520px;
  height: min(700px, calc(100vh - 200px));
}

.left-panel {
  width: 340px;
  border-right: 1px solid #eef2fb;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.left-topbar {
  padding: 10px 12px 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid #f0f3fa;
}

.sub-tabs {
  display: inline-flex;
  background: #f5f7ff;
  border: 1px solid #e7ecff;
  border-radius: 999px;
  padding: 3px;
  gap: 4px;
}

.sub-tab-btn {
  border: none;
  background: transparent;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 13px;
  color: #5a6486;
  cursor: pointer;
}

.sub-tab-btn.active {
  background: #fff;
  color: #0c5fe7;
  box-shadow: 0 6px 16px rgba(15, 39, 106, 0.08);
}

.new-chat-btn {
  border-radius: 999px;
  padding: 8px 12px;
}

.message-list {
  padding: 8px 6px 12px;
  overflow: auto;
  min-height: 0;
}

.conversation-list {
  padding: 8px 6px 12px;
  overflow: auto;
  min-height: 0;
}

.message-item {
  display: flex;
  gap: 12px;
  padding: 12px 12px;
  border-radius: 14px;
  cursor: pointer;
  transition: background 0.15s ease, box-shadow 0.15s ease;
}

.conversation-item {
  display: flex;
  gap: 12px;
  padding: 12px 12px;
  border-radius: 14px;
  cursor: pointer;
  transition: background 0.15s ease, box-shadow 0.15s ease;
}

.message-item:hover {
  background: #f6f9ff;
}

.conversation-item:hover {
  background: #f6f9ff;
}

.message-item.active {
  background: #eef5ff;
  box-shadow: inset 0 0 0 1px rgba(12, 95, 231, 0.2);
}

.conversation-item.active {
  background: #eef5ff;
  box-shadow: inset 0 0 0 1px rgba(12, 95, 231, 0.2);
}

.message-avatar {
  flex: none;
  background: linear-gradient(135deg, #0c5fe7, #2fb7ff);
  color: #fff;
}

.message-meta {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.meta-top {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: center;
}

.from-row {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.from-name {
  font-size: 14px;
  font-weight: 700;
  color: #1f274b;
  max-width: 170px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sub-title {
  font-size: 12px;
  color: #0c5fe7;
  background: rgba(12, 95, 231, 0.12);
  border-radius: 999px;
  padding: 2px 8px;
  flex: none;
}

.role-tag {
  font-size: 12px;
  border-radius: 999px;
  padding: 2px 8px;
  flex: none;
  background: rgba(90, 100, 134, 0.12);
  color: #5a6486;
}

.role-tag.student {
  background: rgba(12, 95, 231, 0.12);
  color: #0c5fe7;
}

.role-tag.enterprise {
  background: rgba(245, 158, 11, 0.16);
  color: #b45309;
}

.role-tag.teacher {
  background: rgba(34, 197, 94, 0.14);
  color: #15803d;
}

.role-tag.admin {
  background: rgba(239, 68, 68, 0.12);
  color: #b91c1c;
}

.time {
  font-size: 12px;
  color: #9aa5c2;
  flex: none;
}

.meta-bottom {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: center;
  min-width: 0;
}

.summary {
  margin: 0;
  font-size: 13px;
  color: #5a6486;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  min-width: 0;
}

.unread-badge {
  flex: none;
}

.list-empty {
  padding: 24px 10px;
}

.right-panel {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat {
  height: 100%;
  min-height: 0;
}

.chat-inner {
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.chat-header {
  padding: 14px 18px;
  border-bottom: 1px solid #eef2fb;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.chat-peer {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.chat-avatar {
  flex: none;
  background: linear-gradient(135deg, #0c5fe7, #2fb7ff);
  color: #fff;
}

.chat-peer-meta {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.chat-peer-name-row {
  display: inline-flex;
  gap: 8px;
  align-items: center;
}

.chat-peer-name {
  font-weight: 700;
  color: #1f274b;
  max-width: 320px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chat-peer-tip {
  font-size: 12px;
  color: #9aa5c2;
}

.chat-scroller {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 14px 18px;
  background: #f7f9ff;
}

.chat-msg-row {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  margin-bottom: 12px;
}

.chat-msg-row.me {
  flex-direction: row-reverse;
}

.chat-msg-avatar {
  flex: none;
  background: linear-gradient(135deg, #0c5fe7, #2fb7ff);
  color: #fff;
}

.chat-msg-main {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  min-width: 0;
}

.chat-msg-row.me .chat-msg-main {
  flex-direction: row-reverse;
}

.chat-time-out {
  font-size: 12px;
  color: #9aa5c2;
  white-space: nowrap;
  flex: none;
  margin-bottom: 2px;
}

.chat-bubble {
  max-width: min(560px, 70%);
  background: #fff;
  border-radius: 14px;
  padding: 10px 12px;
  box-shadow: 0 12px 24px rgba(15, 39, 106, 0.08);
  border: 1px solid #edf1fb;
}

.chat-msg-row.me .chat-bubble {
  background: #0c5fe7;
  border-color: rgba(12, 95, 231, 0.3);
}

.chat-text {
  white-space: pre-wrap;
  font-size: 14px;
  color: #1f274b;
  line-height: 1.7;
}

.chat-msg-row.me .chat-text {
  color: #fff;
}

.chat-input {
  padding: 12px 18px 16px;
  border-top: 1px solid #eef2fb;
  background: #fff;
  flex: none;
}

.chat-textarea :deep(.el-textarea__inner) {
  border-radius: 12px;
  height: 68px;
  min-height: 68px;
  max-height: 68px;
  overflow-y: auto;
  resize: none;
}

.chat-textarea :deep(.el-textarea__inner::placeholder) {
  font-size: 15px;
}

.chat-textarea :deep(.el-textarea__inner) {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.chat-textarea :deep(.el-textarea__inner::-webkit-scrollbar) {
  width: 0;
  height: 0;
  display: none;
}

.chat-send-row {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
}

.new-chat-dialog {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.contact-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 320px;
  overflow: auto;
  padding-right: 4px;
}

/* 隐藏滚动条（保持可滚动） */
.message-list,
.conversation-list,
.chat-scroller,
.contact-list {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.message-list::-webkit-scrollbar,
.conversation-list::-webkit-scrollbar,
.chat-scroller::-webkit-scrollbar,
.contact-list::-webkit-scrollbar {
  width: 0;
  height: 0;
  display: none;
}

.contact-item {
  border: 1px solid #edf1fb;
  background: #fff;
  border-radius: 14px;
  padding: 10px 12px;
  display: flex;
  gap: 12px;
  align-items: center;
  cursor: pointer;
  text-align: left;
}

.contact-item:hover {
  border-color: rgba(12, 95, 231, 0.35);
  box-shadow: 0 12px 24px rgba(15, 39, 106, 0.08);
}

.contact-avatar {
  flex: none;
  background: linear-gradient(135deg, #0c5fe7, #2fb7ff);
  color: #fff;
}

.contact-meta {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.contact-name-row {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  min-width: 0;
}

.contact-name {
  font-weight: 700;
  color: #1f274b;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.contact-desc {
  font-size: 12px;
  color: #9aa5c2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.detail {
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.detail-header {
  padding: 18px 20px;
  border-bottom: 1px solid #eef2fb;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
}

.detail-title {
  min-width: 0;
}

.detail-h2 {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 700;
  color: #1f274b;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.detail-sub {
  font-size: 12px;
  color: #8a94b1;
  display: inline-flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.detail-sep {
  color: #c3cbe0;
}

.detail-actions {
  display: inline-flex;
  gap: 10px;
  flex: none;
}

.detail-body {
  padding: 18px 20px 24px;
  overflow: auto;
  min-height: 0;
}

.detail-content {
  margin: 0;
  font-size: 14px;
  line-height: 1.8;
  color: #3f4b6b;
  white-space: pre-wrap;
}

.detail-empty {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 960px) {
  .message-center-page {
    padding: 16px;
  }

  .tabs-row {
    flex-wrap: wrap;
    justify-content: flex-start;
  }

  .header-tools {
    width: 100%;
    padding-bottom: 12px;
  }

  .message-center-main {
    flex-direction: column;
    height: auto;
    min-height: 0;
  }

  .left-panel {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #eef2fb;
  }

  .message-list,
  .conversation-list {
    max-height: 420px;
  }
}
</style>
