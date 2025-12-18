<template>
  <div class="message-center-page">
    <div class="message-center-layout">
      <!-- 左侧：消息中心列表（参考常见社交软件双栏布局） -->
      <aside class="left-panel">
        <header class="left-header">
          <section class="tabs-bar" role="tablist" aria-label="消息分类">
            <button
              v-for="tab in tabs"
              :key="tab.key"
              type="button"
              class="tab"
              :class="{ active: activeTab === tab.key }"
              @click="activeTab = tab.key"
            >
              <span class="tab-label">{{ tab.label }}</span>
              <span v-if="tabUnreadCount(tab.key) > 0" class="tab-badge">
                {{ formatUnread(tabUnreadCount(tab.key)) }}
              </span>
            </button>
          </section>

          <button type="button" class="settings-btn">
            消息设置
          </button>
        </header>

        <div class="search">
          <input
            v-model="keyword"
            class="search-input"
            type="text"
            placeholder="搜索联系人 / 关键词"
          />
        </div>

        <main class="list-area">
          <div v-if="filteredItems.length" class="list" role="list">
            <button
              v-for="item in filteredItems"
              :key="`${item.type}-${item.id}`"
              type="button"
              class="list-item"
              role="listitem"
              :class="{ selected: isChatSelected(item) }"
              @click="openItem(item)"
            >
              <div class="avatar-wrap">
                <img class="avatar" :src="item.avatar" :alt="item.title" @error="handleAvatarError" />
                <span v-if="item.unread > 0" class="unread-dot">{{ formatUnread(item.unread) }}</span>
              </div>

              <div class="item-main">
                <div class="item-top">
                  <span class="item-title">{{ item.title }}</span>
                  <span class="item-time">{{ formatTime(item.time) }}</span>
                </div>
                <div class="item-bottom">
                  <span class="item-preview">
                    <span class="type-tag" :class="item.type">
                      {{ typeText(item.type) }}
                    </span>
                    {{ item.preview }}
                  </span>
                </div>
              </div>
            </button>
          </div>

          <div v-else class="empty">
            <div class="empty-icon">消息为空</div>
            <div class="empty-title">暂无消息</div>
            <div class="empty-desc">收到新消息后会在这里显示</div>
          </div>
        </main>
      </aside>

      <!-- 右侧：聊天内容（桌面端展示，移动端仍采用跳转详情页） -->
      <section class="right-panel">
        <div v-if="isWideScreen && activeChatItem" class="chat-panel">
          <header class="chat-header">
            <div class="chat-title">{{ activeChatItem.title }}</div>
            <div class="chat-subtitle">在线咨询</div>
          </header>

          <div ref="chatScroller" class="chat-scroller">
            <div class="chat-list">
              <div
                v-for="msg in activeMessages"
                :key="msg.id"
                class="chat-row"
                :class="{ me: msg.sender === 'me' }"
              >
                <img
                  class="bubble-avatar"
                  :src="msg.sender === 'me' ? myAvatar : activeChatItem.avatar"
                  alt="头像"
                  @error="handleAvatarError"
                />
                <div class="bubble">
                  <div class="bubble-text">{{ msg.text }}</div>
                  <div class="bubble-time">{{ formatTimeFull(msg.time) }}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="composer">
            <input
              v-model="draft"
              type="text"
              class="composer-input"
              placeholder="输入消息…"
              @keydown.enter="sendInPanel"
            />
            <button type="button" class="send-btn" :disabled="!draft.trim()" @click="sendInPanel">
              发送
            </button>
          </div>
        </div>

        <div v-else class="right-empty">
          <div class="right-empty-title">请选择一个会话</div>
          <div class="right-empty-desc">点击左侧聊天即可在这里查看内容</div>
        </div>
      </section>
    </div>

    <!-- @我 / 评论：使用弹窗展示详情与操作 -->
    <el-dialog
      v-model="notifyDialogVisible"
      width="520px"
      :show-close="true"
      align-center
      class="notify-dialog"
      :title="notifyDialogTitle"
      @close="handleDialogClose"
    >
      <div v-if="selectedNotify" class="notify-dialog-body">
        <div class="notify-card">
          <div class="notify-title-row">
            <span class="type-tag" :class="selectedNotify.type">{{ typeText(selectedNotify.type) }}</span>
            <span class="notify-title">{{ selectedNotify.title }}</span>
          </div>
          <p class="notify-content">{{ selectedNotify.preview }}</p>
          <div class="notify-meta">
            <span>时间：{{ formatTime(selectedNotify.time) }}</span>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="notify-dialog-actions">
          <el-button @click="notifyDialogVisible = false">关闭</el-button>
          <el-button
            v-if="selectedNotify?.targetRoute"
            type="primary"
            @click="goNotifyTarget"
          >
            跳转到相关内容
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const MESSAGE_READ_KEY = 'messageReadState'

const keyword = ref('')
const activeTab = ref('chat')
const isWideScreen = ref(false)

const tabs = [
  { key: 'chat', label: '聊天' },
  { key: 'mention', label: '@我' },
  { key: 'comment', label: '评论' }
]

// 聊天面板：模拟聊天数据（后续可替换为 API / WebSocket）
const draft = ref('')
const chatScroller = ref(null)
const myAvatar = 'https://picsum.photos/seed/me-001/96/96.jpg'
const activeChatId = ref('')

// 模拟数据：后续可替换为 API / WebSocket
const items = ref([
  {
    id: 'c-1001',
    type: 'chat',
    title: '星河数智科技（企业）',
    avatar: 'https://picsum.photos/seed/enterprise-001/96/96.jpg',
    preview: '好的，我们这边确认一下需求清单，今晚给你回复。',
    time: Date.now() - 1000 * 60 * 6,
    unread: 2
  },
  {
    id: 'c-1002',
    type: 'chat',
    title: '张三（学生）',
    avatar: 'https://picsum.photos/seed/student-001/96/96.jpg',
    preview: '我已经提交揭榜申请了，麻烦看下是否需要补充材料？',
    time: Date.now() - 1000 * 60 * 40,
    unread: 0
  },
  {
    id: 'm-2001',
    type: 'mention',
    title: '@我',
    avatar: 'https://picsum.photos/seed/mention/96/96.jpg',
    preview: '李四 在「AI智能客服系统开发」里 @了你：你看看这个接口约定是否OK？',
    time: Date.now() - 1000 * 60 * 90,
    unread: 1,
    targetRoute: '/projects/1'
  },
  {
    id: 'cm-3001',
    type: 'comment',
    title: '评论',
    avatar: 'https://picsum.photos/seed/comment/96/96.jpg',
    preview: '王老师 评论了你的方案：整体思路清晰，建议补充测试与验收标准。',
    time: Date.now() - 1000 * 60 * 60 * 7,
    unread: 3,
    targetRoute: '/projects/1'
  }
])

const chatMap = ref({
  'c-1001': [
    { id: 'm1', sender: 'peer', text: '你好，我想咨询一下项目的交付要求。', time: Date.now() - 1000 * 60 * 80 },
    { id: 'm2', sender: 'me', text: '可以的，你们更关注哪些交付物？', time: Date.now() - 1000 * 60 * 76 },
    { id: 'm3', sender: 'peer', text: '主要是接口文档、部署说明和演示视频。', time: Date.now() - 1000 * 60 * 70 }
  ],
  'c-1002': [
    { id: 'm1', sender: 'peer', text: '我已经提交揭榜申请了，麻烦看下是否需要补充材料？', time: Date.now() - 1000 * 60 * 55 },
    { id: 'm2', sender: 'me', text: '收到，我会尽快查看。', time: Date.now() - 1000 * 60 * 52 }
  ]
})

const readState = ref({})
let mediaQuery = null
let mediaQueryListener = null

const loadReadState = () => {
  try {
    const raw = localStorage.getItem(MESSAGE_READ_KEY)
    readState.value = raw ? JSON.parse(raw) : {}
  } catch {
    readState.value = {}
  }
}

const saveReadState = () => {
  try {
    localStorage.setItem(MESSAGE_READ_KEY, JSON.stringify(readState.value || {}))
  } catch {
    // 忽略 localStorage 不可用的情况（例如隐私模式/浏览器限制）
  }
}

const markItemRead = (type, id) => {
  if (!type || !id) return
  if (!readState.value[type]) readState.value[type] = {}
  readState.value[type][id] = { readAt: Date.now() }
  saveReadState()
}

const hydrateUnreadFromReadState = () => {
  items.value.forEach((item) => {
    const wasRead = !!readState.value?.[item.type]?.[item.id]
    if (wasRead) item.unread = 0
  })
}

const notifyDialogVisible = ref(false)
const selectedNotify = ref(null)
const notifyDialogTitle = computed(() => {
  if (!selectedNotify.value) return '消息详情'
  if (selectedNotify.value.type === 'mention') return '@我'
  if (selectedNotify.value.type === 'comment') return '评论'
  return '消息详情'
})

const tabUnreadCount = (tabKey) =>
  items.value.filter((i) => i.type === tabKey).reduce((sum, i) => sum + (i.unread || 0), 0)

const filteredItems = computed(() => {
  const list = items.value
    .filter((i) => i.type === activeTab.value)
    .slice()
    .sort((a, b) => b.time - a.time)

  const kw = keyword.value.trim().toLowerCase()
  if (!kw) return list

  return list.filter((i) => {
    const title = (i.title || '').toLowerCase()
    const preview = (i.preview || '').toLowerCase()
    return title.includes(kw) || preview.includes(kw)
  })
})

const activeChatItem = computed(() => {
  if (!activeChatId.value) return null
  const found = items.value.find((i) => i.type === 'chat' && i.id === activeChatId.value)
  return found || null
})

const activeMessages = computed(() => {
  const id = activeChatId.value
  if (!id) return []
  return chatMap.value[id] || []
})

const isChatSelected = (item) => {
  if (item.type !== 'chat') return false
  return isWideScreen.value && activeChatId.value === item.id
}

const typeText = (type) => {
  if (type === 'chat') return '会话'
  if (type === 'mention') return '@'
  if (type === 'comment') return '评'
  return '消'
}

const formatUnread = (count) => (count > 99 ? '99+' : String(count))

const formatTime = (ts) => {
  const date = new Date(ts)
  const now = new Date()
  const sameDay = date.toDateString() === now.toDateString()
  if (sameDay) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  return date.toLocaleDateString([], { month: '2-digit', day: '2-digit' })
}

const formatTimeFull = (ts) => {
  const date = new Date(ts)
  return date.toLocaleString([], { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}

const scrollToBottom = async () => {
  await nextTick()
  const el = chatScroller.value
  if (!el) return
  el.scrollTop = el.scrollHeight
}

const sendInPanel = async () => {
  const text = draft.value.trim()
  if (!text || !activeChatId.value) return

  const list = chatMap.value[activeChatId.value] || []
  list.push({ id: `me-${Date.now()}`, sender: 'me', text, time: Date.now() })
  chatMap.value[activeChatId.value] = list
  draft.value = ''
  await scrollToBottom()
}

const openItem = (item) => {
  // 标记已读（前端模拟）
  item.unread = 0
  markItemRead(item.type, item.id)

  // 聊天进入详情页；@我/评论使用弹窗展示，避免路由跳转
  if (item.type === 'chat') {
    if (isWideScreen.value) {
      activeChatId.value = item.id
      scrollToBottom()
    } else {
      router.push(`/messages/${item.type}/${item.id}`)
    }
    return
  }

  selectedNotify.value = item
  notifyDialogVisible.value = true
}

const handleDialogClose = () => {
  selectedNotify.value = null
}

const goNotifyTarget = () => {
  if (!selectedNotify.value?.targetRoute) return
  const target = selectedNotify.value.targetRoute
  notifyDialogVisible.value = false
  selectedNotify.value = null
  router.push(target)
}

const handleAvatarError = (event) => {
  const img = event?.target
  if (!img) return
  img.src = 'https://picsum.photos/seed/avatar-fallback/96/96.jpg'
}

onMounted(() => {
  loadReadState()
  hydrateUnreadFromReadState()

  // 桌面端默认选中第一条会话，展示右侧聊天面板
  const firstChat = items.value.find((i) => i.type === 'chat')
  if (firstChat) activeChatId.value = firstChat.id

  mediaQuery = window.matchMedia('(min-width: 1024px)')
  mediaQueryListener = () => {
    isWideScreen.value = !!mediaQuery?.matches
  }
  mediaQueryListener()

  if (mediaQuery.addEventListener) mediaQuery.addEventListener('change', mediaQueryListener)
  else mediaQuery.addListener(mediaQueryListener)
})

onUnmounted(() => {
  if (!mediaQuery || !mediaQueryListener) return
  if (mediaQuery.removeEventListener) mediaQuery.removeEventListener('change', mediaQueryListener)
  else mediaQuery.removeListener(mediaQueryListener)
  mediaQuery = null
  mediaQueryListener = null
})
</script>

<style scoped>
.message-center-page {
  min-height: 100vh;
  background: #f5f7fb;
  color: #1f274b;
  padding: 18px 16px 24px;
}

.message-center-layout {
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 16px;
}

.left-panel {
  min-width: 0;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid #edf1fb;
  border-radius: 18px;
  box-shadow: 0 18px 35px rgba(15, 39, 106, 0.06);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 130px);
}

.left-header {
  padding: 12px 12px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  border-bottom: 1px solid #edf1fb;
}

.search-input {
  width: 100%;
  border-radius: 999px;
  border: 1px solid #d6ddf5;
  padding: 10px 14px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 6px 18px rgba(15, 39, 106, 0.08);
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.search-input:focus {
  border-color: rgba(12, 95, 231, 0.55);
  box-shadow: 0 10px 24px rgba(12, 95, 231, 0.12);
}

.tabs-bar {
  flex: 1;
  background: transparent;
  border: none;
  border-radius: 12px;
  padding: 0;
  display: flex;
  gap: 8px;
}

.settings-btn {
  border: none;
  background: transparent;
  color: #4a5676;
  cursor: pointer;
  font-weight: 700;
  padding: 8px 10px;
  border-radius: 12px;
  flex: none;
  transition: background 0.2s ease, color 0.2s ease;
}

.settings-btn:hover {
  background: #f5f7ff;
  color: #0c5fe7;
}

.search {
  padding: 10px 12px 12px;
}

.tab {
  flex: 1;
  border: none;
  background: transparent;
  border-radius: 12px;
  padding: 10px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #4a5676;
  font-weight: 700;
  transition: background 0.2s ease, color 0.2s ease;
}

.tab.active {
  background: linear-gradient(120deg, rgba(12, 95, 231, 0.16), rgba(47, 183, 255, 0.16));
  color: #0c5fe7;
}

.tab-badge {
  min-width: 22px;
  height: 18px;
  padding: 0 6px;
  border-radius: 999px;
  background: #ff4d4f;
  color: #fff;
  font-size: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.list-area {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 0 12px 12px;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.list-item {
  width: 100%;
  text-align: left;
  border: 1px solid #edf1fb;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 18px;
  padding: 12px 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.list-item.selected {
  border-color: rgba(12, 95, 231, 0.45);
  background: linear-gradient(120deg, rgba(12, 95, 231, 0.08), rgba(47, 183, 255, 0.08));
}

.list-item:hover {
  border-color: rgba(12, 95, 231, 0.35);
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(15, 39, 106, 0.08);
}

.avatar-wrap {
  width: 46px;
  height: 46px;
  position: relative;
  flex: none;
}

.avatar {
  width: 46px;
  height: 46px;
  border-radius: 14px;
  object-fit: cover;
  box-shadow: 0 10px 24px rgba(15, 39, 106, 0.12);
}

.unread-dot {
  position: absolute;
  top: -6px;
  right: -6px;
  min-width: 18px;
  height: 18px;
  padding: 0 6px;
  border-radius: 999px;
  background: #ff4d4f;
  color: #fff;
  font-size: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #fff;
}

.item-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.item-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.item-title {
  font-weight: 800;
  font-size: 15px;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-time {
  color: #9aa5c2;
  font-size: 12px;
  flex: none;
}

.item-preview {
  color: #6a7696;
  font-size: 13px;
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.type-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 26px;
  height: 18px;
  padding: 0 8px;
  border-radius: 999px;
  font-size: 12px;
  margin-right: 6px;
  color: #fff;
  background: #9aa5c2;
}

.type-tag.chat {
  background: linear-gradient(120deg, #0c5fe7, #2fb7ff);
}

.type-tag.mention {
  background: linear-gradient(120deg, #9254de, #b37feb);
}

.type-tag.comment {
  background: linear-gradient(120deg, #ff9f0a, #ffb347);
}

.right-panel {
  min-width: 0;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid #edf1fb;
  border-radius: 18px;
  box-shadow: 0 18px 35px rgba(15, 39, 106, 0.06);
  min-height: calc(100vh - 130px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.right-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #7b859f;
  padding: 24px;
  text-align: center;
}

.right-empty-title {
  font-size: 16px;
  font-weight: 900;
  color: #4a5676;
  margin-bottom: 8px;
}

.right-empty-desc {
  font-size: 13px;
}

.chat-panel {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.chat-header {
  padding: 14px 16px 12px;
  border-bottom: 1px solid #edf1fb;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
}

.chat-title {
  font-weight: 900;
  color: #1f274b;
  font-size: 15px;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chat-subtitle {
  color: #9aa5c2;
  font-size: 12px;
  flex: none;
}

.chat-scroller {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 16px 14px 10px;
  scroll-behavior: smooth;
}

.chat-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.chat-row {
  display: flex;
  align-items: flex-end;
  gap: 10px;
}

.chat-row.me {
  flex-direction: row-reverse;
}

.bubble-avatar {
  width: 34px;
  height: 34px;
  border-radius: 12px;
  object-fit: cover;
  box-shadow: 0 10px 22px rgba(15, 39, 106, 0.12);
  flex: none;
}

.bubble {
  max-width: min(640px, 56vw);
  background: #fff;
  border: 1px solid #edf1fb;
  border-radius: 16px;
  padding: 10px 12px;
  box-shadow: 0 10px 24px rgba(15, 39, 106, 0.06);
}

.chat-row.me .bubble {
  background: linear-gradient(120deg, rgba(12, 95, 231, 0.12), rgba(47, 183, 255, 0.12));
  border-color: rgba(12, 95, 231, 0.18);
}

.bubble-text {
  font-size: 14px;
  line-height: 1.6;
  color: #1f274b;
  white-space: pre-wrap;
  word-break: break-word;
}

.bubble-time {
  margin-top: 6px;
  font-size: 12px;
  color: #9aa5c2;
  text-align: right;
}

.composer {
  padding: 10px 12px;
  border-top: 1px solid #edf1fb;
  display: flex;
  gap: 10px;
  background: rgba(255, 255, 255, 0.96);
}

.composer-input {
  flex: 1;
  border-radius: 14px;
  border: 1px solid #d6ddf5;
  padding: 12px 12px;
  outline: none;
  background: #fff;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.composer-input:focus {
  border-color: rgba(12, 95, 231, 0.55);
  box-shadow: 0 10px 24px rgba(12, 95, 231, 0.12);
}

.send-btn {
  border: none;
  border-radius: 14px;
  padding: 0 16px;
  background: linear-gradient(120deg, #0c5fe7, #2fb7ff);
  color: #fff;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 12px 24px rgba(12, 95, 231, 0.2);
  transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
}

.send-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 16px 28px rgba(12, 95, 231, 0.26);
}

.send-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.notify-dialog-body {
  padding-top: 6px;
}

.notify-card {
  background: rgba(245, 247, 251, 0.7);
  border: 1px solid #edf1fb;
  border-radius: 16px;
  padding: 14px;
}

.notify-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.notify-title {
  font-weight: 900;
  color: #1f274b;
}

.notify-content {
  margin: 0;
  color: #4f5d7a;
  line-height: 1.8;
  font-size: 14px;
}

.notify-meta {
  margin-top: 10px;
  color: #9aa5c2;
  font-size: 12px;
}

.notify-dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.empty {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 22px;
  border: 1px dashed #d6ddf5;
  padding: 56px 16px;
  text-align: center;
  color: #7b859f;
}

.empty-icon {
  font-size: 40px;
  margin-bottom: 10px;
}

.empty-title {
  font-size: 16px;
  font-weight: 800;
  color: #4a5676;
  margin-bottom: 6px;
}

.empty-desc {
  font-size: 13px;
}

@media (max-width: 768px) {
  .message-center-layout {
    grid-template-columns: 1fr;
  }

  .right-panel {
    display: none;
  }
}
</style>
