<template>
  <div class="project-basic-info">
    <!-- 项目基本信息卡片 -->
    <div class="project-info-section">
      <div class="project-header">
        <div class="project-header-left">
          <el-tag class="status-tag" :type="getStatusType(project.status)">
            {{ project.statusText }}
          </el-tag>
          <h1 class="project-title">{{ project.name }}</h1>
        </div>
      </div>

      <div class="publisher-info">
        <span class="publisher">发布方：{{ project.publisher }}</span>
      </div>

      <!-- 项目基本信息卡片 -->
      <div class="basic-info-card">
        <div class="info-row">
          <div class="info-item">
            <span class="label">悬赏金额</span>
            <span class="value price">¥{{ project.reward?.toLocaleString() }}</span>
          </div>
          <div class="info-item">
            <span class="label">项目领域</span>
            <span class="value">{{ project.category }}</span>
          </div>
        </div>

        <div class="info-row">
          <div class="info-item">
            <span class="label">项目周期</span>
            <span class="value">{{ calculateDuration() }}天</span>
          </div>
          <div class="info-item">
            <span class="label">发布时间</span>
            <span class="value">{{ project.startDate }}</span>
          </div>
        </div>

        <div class="info-row">
          <div class="info-item">
            <span class="label">截止时间</span>
            <span class="value">{{ project.endDate }}</span>
          </div>
          <div class="info-item">
            <span class="label">项目进度</span>
            <span class="value">{{ project.progress }}%</span>
          </div>
        </div>

        <div class="info-row">
          <div class="info-item full-width">
            <span class="label">项目描述</span>
            <span class="value">{{ project.description }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 当前里程碑信息 -->
    <div class="current-milestone-section">
      <div class="section-header">
        <h2 class="section-title">当前里程碑</h2>
      </div>

      <div v-if="currentMilestone" class="milestone-card-compact">
        <div class="milestone-header">
          <div class="milestone-left">
            <h3 class="milestone-title">{{ currentMilestone.title }}</h3>
            <el-tag :type="getMilestoneTagType(currentMilestone.status)" size="large">
              {{ getMilestoneStatusText(currentMilestone.status) }}
            </el-tag>
          </div>
          <el-button type="primary" @click="viewMilestoneDetail">
            查看详情
            <el-icon><ArrowRight /></el-icon>
          </el-button>
        </div>

        <div class="milestone-meta">
          <div class="meta-item">
            <el-icon><Calendar /></el-icon>
            <span>计划: {{ currentMilestone.plannedDate }}</span>
          </div>
          <div v-if="currentMilestone.actualDate" class="meta-item">
            <el-icon><Checked /></el-icon>
            <span>实际: {{ currentMilestone.actualDate }}</span>
          </div>
          <div v-if="currentMilestone.delayDays && currentMilestone.delayDays > 0" class="meta-item text-danger">
            <el-icon><Clock /></el-icon>
            <span>逾期 {{ currentMilestone.delayDays }} 天</span>
          </div>
          <div class="meta-item">
            <el-icon><Document /></el-icon>
            <span>交付物: {{ currentMilestone.deliverables?.length || 0 }}</span>
          </div>
        </div>

        <div class="milestone-description">
          {{ currentMilestone.description }}
        </div>
      </div>

      <el-empty v-else description="暂无进行中的里程碑" :image-size="100" />
    </div>

    <!-- 团队成员信息 -->
    <div class="team-members-section">
      <div class="section-header">
        <h2 class="section-title">团队成员</h2>
      </div>

      <div v-if="project.members && project.members.length" class="members-grid">
        <div v-for="member in project.members" :key="member.id" class="member-card">
          <img :src="member.avatar" alt="avatar" class="member-avatar" />
          <div class="member-info">
            <div class="member-name">{{ member.name }}</div>
            <div class="member-role">{{ member.role }}</div>
            <div v-if="member.skills && member.skills.length" class="member-skills">
              <el-tag
                v-for="skill in member.skills"
                :key="skill"
                size="small"
                type="info"
                class="skill-tag"
              >
                {{ skill }}
              </el-tag>
            </div>
          </div>
        </div>
      </div>

      <el-empty v-else description="暂无团队成员信息" :image-size="100" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Calendar, Checked, Clock, Document, ArrowRight } from '@element-plus/icons-vue'

const props = defineProps({
  project: {
    type: Object,
    required: true
  },
  milestones: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['viewMilestone'])

// 当前进行中的里程碑
const currentMilestone = computed(() => {
  return props.milestones.find(m => m.status === 'in-progress') || null
})

// 计算项目周期
function calculateDuration() {
  if (!props.project.startDate || !props.project.endDate) return 0
  const start = new Date(props.project.startDate)
  const end = new Date(props.project.endDate)
  const diff = end - start
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

// 项目状态类型
function getStatusType(status) {
  const map = {
    'ongoing': 'primary',
    'completed': 'success',
    'pending': 'info',
    'cancelled': 'danger'
  }
  return map[status] || 'info'
}

// 里程碑状态文本
function getMilestoneStatusText(status) {
  const map = {
    'completed': '已完成',
    'in-progress': '进行中',
    'pending': '待开始',
    'skipped': '已跳过'
  }
  return map[status] || status
}

// 里程碑标签类型
function getMilestoneTagType(status) {
  const map = {
    'completed': 'success',
    'in-progress': 'primary',
    'pending': 'info',
    'skipped': 'warning'
  }
  return map[status] || 'info'
}

// 查看里程碑详情
function viewMilestoneDetail() {
  if (currentMilestone.value) {
    emit('viewMilestone', currentMilestone.value.id)
  }
}
</script>

<style scoped>
.project-basic-info {
  max-width: 1200px;
}

/* 项目信息区域 */
.project-info-section {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.project-header {
  margin-bottom: 16px;
}

.project-header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.status-tag {
  font-size: 14px;
  font-weight: 600;
}

.project-title {
  margin: 0;
  font-size: 24px;
  color: #333;
  font-weight: 600;
}

.publisher-info {
  margin-bottom: 24px;
}

.publisher {
  display: block;
  color: #666;
  font-size: 15px;
}

/* 基本信息卡片 */
.basic-info-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
}

.info-row {
  display: flex;
  margin-bottom: 16px;
}

.info-row:last-child {
  margin-bottom: 0;
}

.info-item {
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: baseline;
  gap: 12px;
}

.info-item.full-width {
  flex: 1 1 100%;
}

.info-item .label {
  color: #666;
  font-size: 16px;
  font-weight: 600;
  min-width: 90px;
  flex-shrink: 0;
  text-align: right;
}

.info-item .value {
  color: #333;
  font-weight: 500;
  font-size: 15px;
  flex: 1;
  text-align: left;
  line-height: 1.5;
}

.price {
  color: #f56c6c;
  font-weight: bold;
  font-size: 18px;
}

/* 当前里程碑区域 */
.current-milestone-section {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.section-header {
  margin-bottom: 16px;
}

.section-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

/* 里程碑卡片（紧凑版） */
.milestone-card-compact {
  background: #f5f7fb;
  border-radius: 8px;
  padding: 16px;
  border-left: 4px solid #1890ff;
}

.milestone-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  gap: 16px;
}

.milestone-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.milestone-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.milestone-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #606266;
}

.meta-item .el-icon {
  font-size: 14px;
  color: #909399;
}

.meta-item.text-danger {
  color: #ff4d4f;
  font-weight: 600;
}

.meta-item.text-danger .el-icon {
  color: #ff4d4f;
}

.milestone-description {
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
}

/* 团队成员区域 */
.team-members-section {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.members-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.member-card {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  padding: 16px;
  background: #f5f7fb;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.member-card:hover {
  background: #e8ecf3;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.member-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  border: 2px solid #fff;
}

.member-info {
  flex: 1;
  min-width: 0;
}

.member-name {
  font-weight: 600;
  font-size: 15px;
  color: #303133;
  margin-bottom: 4px;
}

.member-role {
  color: #909399;
  font-size: 13px;
  margin-bottom: 8px;
}

.member-skills {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.skill-tag {
  font-size: 12px;
}

/* 响应式 */
@media (max-width: 768px) {
  .info-row {
    flex-direction: column;
    gap: 12px;
  }

  .info-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .info-item .label {
    text-align: left;
    min-width: auto;
  }

  .milestone-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .milestone-left {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .members-grid {
    grid-template-columns: 1fr;
  }
}
</style>
