<template>
  <div class="message-detail-page">
    <header class="detail-header">
      <button type="button" class="back-btn" @click="goBack" aria-label="返回">
        <ArrowLeft class="icon" />
      </button>
      <div class="header-main">
        <div class="header-title">{{ headerTitle }}</div>
        <div class="header-subtitle">{{ headerSubtitle }}</div>
      </div>
      <button type="button" class="more-btn" aria-label="更多">
        <MoreFilled class="icon" />
      </button>
    </header>

    <!-- 聊天 -->
    <main v-if="type === 'chat'" class="chat-main">
      <div ref="chatScroller" class="chat-scroller">
        <div v-if="messages.length" class="chat-list">
          <div
            v-for="msg in messages"
            :key="msg.id"
            class="chat-row"
            :class="{ me: msg.sender === 'me' }"
          >
            <img
              class="bubble-avatar"
              :src="msg.sender === 'me' ? myAvatar : peerAvatar"
              alt="头像"
              @error="handleAvatarError"
            />
            <div class="bubble">
              <div class="bubble-text">{{ msg.text }}</div>
              <div class="bubble-time">{{ formatTime(msg.time) }}</div>
            </div>
          </div>
        </div>

        <div v-else class="chat-empty">
          <div class="chat-empty-icon">💬</div>
          <div class="chat-empty-title">暂无聊天记录</div>
          <div class="chat-empty-desc">试着发一句话开始对话吧</div>
        </div>
      </div>

      <div class="composer">
        <input
          v-model="draft"
          type="text"
          class="composer-input"
          placeholder="输入消息…"
          @keydown.enter="send"
        />
        <button type="button" class="send-btn" :disabled="!draft.trim()" @click="send">
          发送
        </button>
      </div>
    </main>

    <!-- @我 / 评论 -->
    <main v-else class="notify-main">
      <div class="notify-card">
        <div class="notify-title">
          <span class="notify-badge" :class="type">{{ typeLabel }}</span>
          <span class="notify-title-text">{{ notifyItem?.title || '通知详情' }}</span>
        </div>

        <div class="notify-content">
          <p class="notify-text">{{ notifyItem?.content || '暂无内容' }}</p>
          <div class="notify-meta">
            <span>时间：{{ notifyItem ? formatTime(notifyItem.time) : '-' }}</span>
            <span v-if="notifyItem?.from">来自：{{ notifyItem.from }}</span>
          </div>
        </div>

        <div class="notify-actions">
          <button
            v-if="notifyItem?.targetRoute"
            type="button"
            class="primary-btn"
            @click="goTarget(notifyItem.targetRoute)"
          >
            跳转到相关内容
            <span class="arrow">→</span>
          </button>
          <button type="button" class="ghost-btn" @click="goBack">返回消息中心</button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const type = computed(() => String(route.params.type || 'chat'))
const id = computed(() => String(route.params.id || ''))

// 模拟头像（后续可与用户系统打通）
const myAvatar = 'https://picsum.photos/seed/me-001/96/96.jpg'
const peerAvatar = computed(() => `https://picsum.photos/seed/${encodeURIComponent(id.value)}/96/96.jpg`)

// ========== 聊天 ==========
const draft = ref('')
const chatScroller = ref(null)

const chatMap = ref({
  'c-1001': [
    { id: 'm1', sender: 'peer', text: '你好，我想咨询一下项目的交付要求。', time: Date.now() - 1000 * 60 * 80 },
    { id: 'm2', sender: 'me', text: '可以的，你们更关注哪些交付物？', time: Date.now() - 1000 * 60 * 76 },
    { id: 'm3', sender: 'peer', text: '主要是接口文档、部署说明和演示视频。', time: Date.now() - 1000 * 60 * 70 }
  ],
  'c-1002': [
    { id: 'm1', sender: 'peer', text: '我已经提交揭榜申请了。', time: Date.now() - 1000 * 60 * 55 },
    { id: 'm2', sender: 'me', text: '收到，我会尽快查看。', time: Date.now() - 1000 * 60 * 52 }
  ]
})

const messages = computed(() => {
  if (type.value !== 'chat') return []
  return chatMap.value[id.value] || []
})

const scrollToBottom = async () => {
  await nextTick()
  const el = chatScroller.value
  if (!el) return
  el.scrollTop = el.scrollHeight
}

const send = async () => {
  const text = draft.value.trim()
  if (!text) return
  const list = chatMap.value[id.value] || []
  list.push({ id: `me-${Date.now()}`, sender: 'me', text, time: Date.now() })
  chatMap.value[id.value] = list
  draft.value = ''
  await scrollToBottom()
}

// ========== 通知（@我/评论） ==========
const notifyData = ref({
  'm-2001': {
    title: '@我通知',
    from: '李四（学生）',
    time: Date.now() - 1000 * 60 * 90,
    content: '在「AI智能客服系统开发」里 @了你：你看看这个接口约定是否 OK？',
    targetRoute: '/projects/1'
  },
  'cm-3001': {
    title: '评论通知',
    from: '王老师（指导教师）',
    time: Date.now() - 1000 * 60 * 60 * 7,
    content: '评论了你的方案：整体思路清晰，建议补充测试与验收标准。',
    targetRoute: '/projects/1'
  }
})

const notifyItem = computed(() => {
  if (type.value === 'chat') return null
  return notifyData.value[id.value] || null
})

const typeLabel = computed(() => {
  if (type.value === 'mention') return '@我'
  if (type.value === 'comment') return '评论'
  return '通知'
})

const headerTitle = computed(() => {
  if (type.value === 'chat') return '聊天详情'
  if (type.value === 'mention') return '@我'
  if (type.value === 'comment') return '评论'
  return '消息详情'
})

const headerSubtitle = computed(() => {
  if (type.value === 'chat') return `会话：${id.value}`
  if (notifyItem.value?.from) return `来自：${notifyItem.value.from}`
  return ''
})

const formatTime = (ts) => {
  const date = new Date(ts)
  return date.toLocaleString([], { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}

const goBack = () => router.push('/messages')
const goTarget = (targetRoute) => router.push(targetRoute)

const handleAvatarError = (event) => {
  const img = event?.target
  if (!img) return
  img.src = 'https://picsum.photos/seed/avatar-fallback/96/96.jpg'
}

onMounted(() => {
  if (type.value === 'chat') scrollToBottom()
})

watch([type, id], () => {
  if (type.value === 'chat') scrollToBottom()
})
</script>

<style scoped>
.message-detail-page {
  min-height: 100vh;
  background: #f5f7fb;
  color: #1f274b;
  display: flex;
  flex-direction: column;
}

.detail-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: rgba(255, 255, 255, 0.96);
  border-bottom: 1px solid #edf1fb;
  box-shadow: 0 10px 24px rgba(15, 39, 106, 0.06);
  padding: 10px 12px;
  display: grid;
  grid-template-columns: 44px 1fr 44px;
  align-items: center;
  gap: 8px;
}

.back-btn,
.more-btn {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  border: 1px solid #edf1fb;
  background: #fff;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.back-btn:hover,
.more-btn:hover {
  transform: translateY(-1px);
  border-color: rgba(12, 95, 231, 0.3);
  box-shadow: 0 10px 20px rgba(15, 39, 106, 0.08);
}

.icon {
  width: 18px;
  height: 18px;
  color: #4a5676;
}

.header-main {
  min-width: 0;
}

.header-title {
  font-weight: 900;
  font-size: 16px;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.header-subtitle {
  margin-top: 2px;
  color: #7b859f;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* chat */
.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.chat-scroller {
  flex: 1;
  min-height: 0;
  padding: 16px 12px 10px;
  overflow-y: auto;
  scroll-behavior: smooth;
}

.chat-list {
  max-width: 980px;
  margin: 0 auto;
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
}

.bubble {
  max-width: min(680px, 78vw);
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

.chat-empty {
  max-width: 980px;
  margin: 0 auto;
  border: 1px dashed #d6ddf5;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 52px 16px;
  text-align: center;
  color: #7b859f;
}

.chat-empty-icon {
  font-size: 38px;
  margin-bottom: 10px;
}

.chat-empty-title {
  font-weight: 900;
  color: #4a5676;
  margin-bottom: 6px;
}

.chat-empty-desc {
  font-size: 13px;
}

.composer {
  position: sticky;
  bottom: 0;
  background: rgba(255, 255, 255, 0.96);
  border-top: 1px solid #edf1fb;
  padding: 10px 12px;
  display: flex;
  gap: 10px;
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

/* notify */
.notify-main {
  flex: 1;
  padding: 18px 12px 28px;
}

.notify-card {
  max-width: 980px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid #edf1fb;
  border-radius: 22px;
  padding: 18px 18px 16px;
  box-shadow: 0 18px 35px rgba(15, 39, 106, 0.08);
}

.notify-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.notify-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 22px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 800;
  color: #fff;
  background: #9aa5c2;
}

.notify-badge.mention {
  background: linear-gradient(120deg, #9254de, #b37feb);
}

.notify-badge.comment {
  background: linear-gradient(120deg, #ff9f0a, #ffb347);
}

.notify-title-text {
  font-size: 16px;
  font-weight: 900;
}

.notify-text {
  margin: 0;
  color: #4f5d7a;
  line-height: 1.8;
  font-size: 14px;
}

.notify-meta {
  margin-top: 12px;
  color: #9aa5c2;
  font-size: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px 14px;
}

.notify-actions {
  margin-top: 16px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.primary-btn {
  border: none;
  border-radius: 14px;
  padding: 10px 14px;
  background: linear-gradient(120deg, #0c5fe7, #2fb7ff);
  color: #fff;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 12px 24px rgba(12, 95, 231, 0.2);
}

.primary-btn .arrow {
  margin-left: 6px;
}

.ghost-btn {
  border: 1px solid #d6ddf5;
  border-radius: 14px;
  padding: 10px 14px;
  background: #fff;
  color: #4a5676;
  font-weight: 800;
  cursor: pointer;
}
</style>
