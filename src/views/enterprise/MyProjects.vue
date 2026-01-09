<template>
  <div class="myproject-page">
    <div class="myproject-container">
      <div class="myproject-layout">
        <!-- 侧边栏 -->
        <aside class="sidebar">
          <div class="sidebar-section">
            <div class="sidebar-title">我的项目</div>
            <button
              class="sidebar-item"
              :class="{ active: activeTab === 'contracted' }"
              @click="activeTab = 'contracted'"
            >
              我承接的项目 ({{ contractedProjects.length }})
            </button>
            <button
              class="sidebar-item"
              :class="{ active: activeTab === 'published' }"
              @click="activeTab = 'published'"
            >
              我发布的 ({{ publishedProjects.length }})
            </button>
          </div>
        </aside>

        <!-- 主内容区 -->
        <section class="main-content">
          <!-- 我承接的项目 -->
          <div v-if="activeTab === 'contracted'">
            <div class="section-header">
              <h2 class="section-title">
                我承接的项目 ({{ contractedProjects.length }})
              </h2>
            </div>

            <div class="project-list">
              <article
                v-for="project in contractedProjects"
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
                      @click.stop.prevent="manageContractedProject(project)"
                    >
                      管理项目
                    </button>
                  </div>
                </div>
              </article>

              <div v-if="contractedProjects.length === 0" class="empty-state">
                暂无承接的项目
              </div>
            </div>
          </div>

          <!-- 我发布的项目 -->
          <div v-else-if="activeTab === 'published'">
            <div class="section-header">
              <h2 class="section-title">
                我发布的项目 ({{ publishedProjects.length }})
              </h2>
            </div>

            <div class="project-list">
              <article
                v-for="project in publishedProjects"
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
                    <span>承接方：{{ project.contractor || '待确定' }}</span>
                  </div>

                  <div class="project-content-row">
                    <p class="project-brief">{{ project.brief }}</p>
                    <button
                      type="button"
                      class="ghost-chip manage-btn"
                      @click.stop.prevent="managePublishedProject(project)"
                    >
                      管理项目
                    </button>
                  </div>
                </div>
              </article>

              <div v-if="publishedProjects.length === 0" class="empty-state">
                暂无发布的项目
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/modules/auth'

const router = useRouter()
const authStore = useAuthStore()

// 当前激活的标签页
const activeTab = ref('contracted')

// 我承接的项目（企业作为承接方）
const contractedProjects = ref([
  // Mock 数据 - 企业承接的项目（较少见，但可能存在）
])

// 我发布的项目（企业作为发布方）
const publishedProjects = ref([
  {
    id: 'proj-001',
    name: 'AI智能客服系统开发',
    status: 'ongoing',
    statusText: '进行中',
    stageText: '方案提交阶段',
    remainDays: 45,
    contractor: '张三团队',
    publisher: 'XX科技有限公司',
    brief: '为平台构建基于NLP的智能客服系统，提高客户服务效率和满意度。'
  },
  {
    id: 'proj-002',
    name: '企业数据分析平台',
    status: 'ongoing',
    statusText: '进行中',
    stageText: '项目执行阶段',
    remainDays: 30,
    contractor: '李四团队',
    publisher: 'XX科技有限公司',
    brief: '开发企业级数据分析平台，支持多维度数据可视化和智能报表生成。'
  },
  {
    id: 'proj-003',
    name: '移动端电商APP',
    status: 'completed',
    statusText: '已完成',
    stageText: '项目结算',
    remainDays: 0,
    contractor: '王五团队',
    publisher: 'XX科技有限公司',
    brief: '开发一款功能完善的移动端电商应用，包含商品展示、购物车、支付等功能。'
  }
])

// 查看项目详情
function viewDetail(project) {
  router.push(`/projects/${project.id}`)
}

// 管理承接的项目（跳转到承接方管理页面）
function manageContractedProject(project) {
  console.log('管理承接的项目 ->', project.id)
  router.push(`/projects/${project.id}/manage`)
}

// 管理发布的项目（跳转到企业方管理页面）
function managePublishedProject(project) {
  console.log('管理发布的项目 ->', project.id)
  router.push(`/enterprise/project/${project.id}/manage`)
}

onMounted(() => {
  console.log('企业端"我的项目"页面加载')
  console.log('当前用户角色:', authStore.userRole)
})
</script>

<style scoped>
.myproject-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.myproject-container {
  flex: 1;
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
  width: 100%;
}

.myproject-layout {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

/* 侧边栏 */
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

/* 主内容区 */
.main-content {
  flex: 1;
  min-width: 0;
}

.section-header {
  margin-bottom: 20px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

/* 项目列表 */
.project-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 项目卡片 */
.project-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.3s ease;
}

.project-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.project-card-main {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.project-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.project-name {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  flex: 1;
}

.project-tag {
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  flex-shrink: 0;
}

.project-tag.ongoing {
  background: #e6f7ff;
  color: #1890ff;
}

.project-tag.completed {
  background: #f6ffed;
  color: #52c41a;
}

.project-tag.pending {
  background: #fff7e6;
  color: #fa8c16;
}

.project-meta-row {
  display: flex;
  gap: 24px;
  font-size: 14px;
  color: #606266;
}

.project-content-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.project-brief {
  margin: 0;
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.manage-btn {
  padding: 8px 16px;
  background: #409eff;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.manage-btn:hover {
  background: #66b1ff;
}

.ghost-chip {
  background: transparent;
  border: 1px solid #409eff;
  color: #409eff;
}

.ghost-chip:hover {
  background: #409eff;
  color: #fff;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #909399;
  font-size: 14px;
}

/* 响应式 */
@media (max-width: 1024px) {
  .myproject-layout {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
  }

  .sidebar-section {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .sidebar-title {
    width: 100%;
  }

  .sidebar-item {
    width: auto;
    flex: 1;
    min-width: 150px;
  }
}

@media (max-width: 768px) {
  .project-card-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .project-meta-row {
    flex-direction: column;
    gap: 8px;
  }

  .project-content-row {
    flex-direction: column;
    align-items: flex-start;
  }

  .manage-btn {
    width: 100%;
  }
}
</style>
