<template>
  <div class="message-center-page">
    <div class="message-center-card">
      <header class="page-header">
        <div class="header-left">
          <h1 class="page-title">消息中心</h1>
        </div>

        <div class="header-right">
          <el-button type="primary" plain class="settings-btn" @click="handleOpenSettings">
            <el-icon class="settings-icon"><Setting /></el-icon>
            消息设置
          </el-button>
        </div>
      </header>

      <div class="type-tabs">
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
      </div>

      <section class="message-center-main">
        <aside class="left-panel">
          <div class="left-toolbar">
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

          <div class="message-list" role="list">
            <div
              v-for="item in filteredList"
              :key="item.id"
              class="message-item"
              :class="{ active: item.id === selectedId }"
              role="listitem"
              @click="selectItem(item.id)"
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

            <div v-if="!filteredList.length" class="list-empty">
              <el-empty description="暂无消息" />
            </div>
          </div>
        </aside>

        <main class="right-panel">
          <div v-if="selectedItem" class="detail">
            <div class="detail-header">
              <div class="detail-title">
                <h2 class="detail-h2">{{ selectedItem.title }}</h2>
                <div class="detail-sub">
                  <span class="detail-from">来自：{{ selectedItem.fromName }}</span>
                  <span class="detail-sep">·</span>
                  <span class="detail-time">{{ selectedItem.timeText }}</span>
                </div>
              </div>

              <div class="detail-actions">
                <el-button
                  v-if="selectedItem.unread > 0"
                  type="primary"
                  @click="markSelectedAsRead"
                >
                  标记已读
                </el-button>
                <el-button type="danger" plain @click="removeSelected">
                  删除
                </el-button>
              </div>
            </div>

            <div class="detail-body">
              <p class="detail-content">
                {{ selectedItem.content }}
              </p>
            </div>
          </div>

          <div v-else class="detail-empty">
            <el-empty description="请选择左侧一条消息查看详情" />
          </div>
        </main>
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'

const messageTypes = [
  { key: 'my', label: '我的消息', icon: 'Bell' },
  { key: 'favorite', label: '收藏关注', icon: 'Star' },
  { key: 'comment', label: '评论', icon: 'ChatLineRound' },
  { key: 'reply', label: '回复', icon: 'ChatDotRound' }
]

const activeType = ref('my')
const keyword = ref('')
const selectedId = ref('')

// 使用 mock 数据占位，后续对接接口时只需要替换本数据源即可
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

const listByType = computed(() => dataByType.value[activeType.value] || [])

const unreadCountByType = computed(() => {
  const result = {}
  for (const tab of messageTypes) {
    const items = dataByType.value[tab.key] || []
    result[tab.key] = items.reduce((sum, item) => sum + (item.unread || 0), 0)
  }
  return result
})

const filteredList = computed(() => {
  const kw = keyword.value.trim().toLowerCase()
  if (!kw) return listByType.value

  return listByType.value.filter((item) => {
    const hay = `${item.title} ${item.summary} ${item.content}`.toLowerCase()
    return hay.includes(kw)
  })
})

const selectedItem = computed(() => {
  if (!selectedId.value) return null
  return listByType.value.find((item) => item.id === selectedId.value) || null
})

const selectItem = (id) => {
  selectedId.value = id
}

const handleTypeChange = () => {
  keyword.value = ''
  selectedId.value = ''
}

const markSelectedAsRead = () => {
  if (!selectedItem.value) return
  const items = dataByType.value[activeType.value] || []
  const target = items.find((it) => it.id === selectedItem.value.id)
  if (target) target.unread = 0
}

const removeSelected = () => {
  if (!selectedItem.value) return
  const items = dataByType.value[activeType.value] || []
  dataByType.value[activeType.value] = items.filter((it) => it.id !== selectedItem.value.id)
  selectedId.value = ''
}

const handleOpenSettings = () => {
  // 预留：后续可打开抽屉/对话框，配置消息免打扰、通知方式等
}

watch(
  () => activeType.value,
  () => {
    // 切换分类时，若列表只有一条消息也不强制选中，保持与 CSDN 类似的“先选后看”体验
    selectedId.value = ''
  }
)

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

.page-header {
  padding: 18px 20px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.page-title {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #1f274b;
  letter-spacing: 0.5px;
}

.settings-btn {
  border-radius: 999px;
}

.settings-icon {
  margin-right: 6px;
}

.type-tabs {
  padding: 0 14px;
  border-bottom: 1px solid #eef2fb;
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
  height: min(680px, calc(100vh - 240px));
}

.left-panel {
  width: 340px;
  border-right: 1px solid #eef2fb;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.left-toolbar {
  padding: 14px 14px 10px;
  flex: none;
}

.search-input :deep(.el-input__wrapper) {
  border-radius: 999px;
}

.message-list {
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

.message-item:hover {
  background: #f6f9ff;
}

.message-item.active {
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

  .message-list {
    max-height: 420px;
  }
}
</style>
