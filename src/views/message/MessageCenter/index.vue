<template>
  <div class="message-center-page">
    <header class="page-header">
      <div class="search">
        <input
          v-model="keyword"
          class="search-input"
          type="text"
          placeholder="搜索联系人 / 关键词"
        />
      </div>
    </header>

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

    <main class="content">
      <div v-if="filteredItems.length" class="list" role="list">
        <button
          v-for="item in filteredItems"
          :key="`${item.type}-${item.id}`"
          type="button"
          class="list-item"
          role="listitem"
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
        <div class="empty-icon">💬</div>
        <div class="empty-title">暂无消息</div>
        <div class="empty-desc">收到新消息后会在这里显示</div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const MESSAGE_READ_KEY = 'messageReadState'

const keyword = ref('')
const activeTab = ref('chat')

const tabs = [
  { key: 'chat', label: '聊天' },
  { key: 'mention', label: '@我' },
  { key: 'comment', label: '评论' }
]

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

const readState = ref({})

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

const openItem = (item) => {
  // 标记已读（前端模拟）
  item.unread = 0
  markItemRead(item.type, item.id)
  router.push(`/messages/${item.type}/${item.id}`)
}

const handleAvatarError = (event) => {
  const img = event?.target
  if (!img) return
  img.src = 'https://picsum.photos/seed/avatar-fallback/96/96.jpg'
}

onMounted(() => {
  loadReadState()
  hydrateUnreadFromReadState()
})
</script>

<style scoped>
.message-center-page {
  min-height: 100vh;
  background: #f5f7fb;
  color: #1f274b;
  padding: 20px 16px 28px;
}

.page-header {
  max-width: 1100px;
  margin: 0 auto;
  padding: 10px 4px 16px;
}

.search {
  width: min(560px, 100%);
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
  max-width: 1100px;
  margin: 0 auto 14px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #edf1fb;
  border-radius: 16px;
  padding: 6px;
  display: flex;
  gap: 8px;
  box-shadow: 0 12px 30px rgba(15, 39, 106, 0.06);
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

.content {
  max-width: 1100px;
  margin: 0 auto;
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
  .page-header {
    padding: 6px 4px 14px;
  }

  .search {
    width: 100%;
  }
}
</style>
