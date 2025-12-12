<template>
  <!-- 用户档案预览 -->
  <el-card v-if="hasProfile" class="profile-card">
    <template #header>
      <div class="card-header">
        <h2>
          <User style="width: 1em; height: 1em; margin-right: 8px;" />
          <span>个人资料</span>
        </h2>
        <p>您的完整个人信息</p>
      </div>
    </template>

    <!-- 基本信息 -->
    <div class="profile-section">
      <h3>
        <Document style="width: 1em; height: 1em; margin-right: 8px;" />
        <span>基本信息</span>
      </h3>
      <el-descriptions :column="2" border size="default">
        <el-descriptions-item label="姓名">
          <el-tag v-if="userData.realName" type="success">
            {{ userData.realName }}
          </el-tag>
          <span v-else class="not-available">暂无信息</span>
        </el-descriptions-item>
        <el-descriptions-item label="学号">
          <el-tag v-if="userData.studentId" type="info">
            {{ userData.studentId }}
          </el-tag>
          <span v-else class="not-available">暂无信息</span>
        </el-descriptions-item>
        <el-descriptions-item label="学院">
          <el-tag v-if="userData.college" type="warning">
            <Document style="width: 1em; height: 1em; margin-right: 4px;" />
            {{ userData.college }}
          </el-tag>
          <span v-else class="not-available">暂无信息</span>
        </el-descriptions-item>
        <el-descriptions-item label="专业">
          <el-tag v-if="userData.major" type="primary">
            <Document style="width: 1em; height: 1em; margin-right: 4px;" />
            {{ userData.major }}
          </el-tag>
          <span v-else class="not-available">暂无信息</span>
        </el-descriptions-item>
        <el-descriptions-item label="年级">
          <el-tag v-if="userData.grade" type="success">
            {{ userData.grade }}
          </el-tag>
          <span v-else class="not-available">暂无信息</span>
        </el-descriptions-item>
        <el-descriptions-item label="联系方式">
          <el-tag v-if="userData.phone" type="success">
            <Phone style="width: 1em; height: 1em; margin-right: 4px;" />
            {{ userData.phone }}
          </el-tag>
          <span v-else class="not-available">暂无信息</span>
        </el-descriptions-item>
        <el-descriptions-item label="邮箱">
          <el-tag v-if="userData.email" type="info">
            <Message style="width: 1em; height: 1em; margin-right: 4px;" />
            {{ userData.email }}
          </el-tag>
          <span v-else class="not-available">暂无信息</span>
        </el-descriptions-item>
        <el-descriptions-item label="注册时间">
          <span v-if="userData.registerTime">
            {{ formatDate(userData.registerTime) }}
          </span>
          <span v-else class="not-available">暂无信息</span>
        </el-descriptions-item>
      </el-descriptions>
    </div>

    <el-divider />

    <!-- 技术技能 -->
    <div class="profile-section" v-if="userData.skills?.length">
      <h3>
        <Setting style="width: 1em; height: 1em; margin-right: 8px;" />
        <span>技术技能</span>
      </h3>
      <div>
        <el-tag
          v-for="skill in userData.skills"
          :key="skill"
          class="skill-tag"
          type="info"
          effect="light"
        >
          {{ skill }}
        </el-tag>
      </div>
    </div>

    <el-divider v-if="userData.bio" />

    <!-- 个人简介 -->
    <div class="profile-section" v-if="userData.bio">
      <h3>
        <Document style="width: 1em; height: 1em; margin-right: 8px;" />
        <span>个人技术简介</span>
      </h3>
      <div class="bio-content">
        <p>{{ userData.bio }}</p>
      </div>
    </div>

    <el-divider v-if="userData.projectExperiences?.length" />

    <!-- 项目经历 -->
    <div class="profile-section" v-if="userData.projectExperiences?.length">
      <h3>
        <Folder style="width: 1em; height: 1em; margin-right: 8px;" />
        <span>项目经历</span>
      </h3>
      <el-timeline>
        <el-timeline-item
          v-for="(project, index) in userData.projectExperiences"
          :key="index"
          :timestamp="formatProjectTime(project)"
          placement="top"
        >
          <div class="project-item">
            <h4>
              <Folder style="width: 1em; height: 1em; margin-right: 8px;" />
              <span>{{ project.projectName }}</span>
              <el-tag :type="getStatusType(project.status)" size="small" style="margin-left: 8px">
                {{ project.status }}
              </el-tag>
            </h4>
            <p class="project-role">角色：{{ project.role }}</p>
            <p v-if="project.description" class="project-description">{{ project.description }}</p>
          </div>
        </el-timeline-item>
      </el-timeline>
    </div>
  </el-card>
</template>

<script setup>
import { computed } from 'vue'
import { User, Document, Phone, Message, Setting, Folder } from '@element-plus/icons-vue'

// Props定义
const props = defineProps({
  userData: {
    type: Object,
    required: true,
    default: () => ({})
  },
  hasProfile: {
    type: Boolean,
    default: true
  }
})

// 格式化日期
const formatDate = (dateStr) => {
  if (!dateStr) return '未知'
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

// 格式化项目时间
const formatProjectTime = (project) => {
  if (project.startTime && project.endTime) {
    return `${formatDate(project.startTime)} - ${formatDate(project.endTime)}`
  } else if (project.startTime) {
    return `${formatDate(project.startTime)} - 进行中`
  }
  return '时间未知'
}

// 获取项目状态对应的标签类型
const getStatusType = (status) => {
  const statusMap = {
    '已完成': 'success',
    '进行中': 'warning',
    '已暂停': 'info',
    '已取消': 'danger'
  }
  return statusMap[status] || 'info'
}
</script>

<style scoped>
/* 简历档案样式 */
.profile-card {
  margin: 24px 0;
}

.profile-card .card-header h2 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1890ff;
}

.profile-card .card-header p {
  margin: 4px 0 0 0;
  color: #666;
  font-size: 14px;
}

.profile-section {
  margin: 24px 0;
}

.profile-section h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  color: #333;
  font-weight: 600;
  font-size: 16px;
  border-bottom: 2px solid rgba(24, 144, 255, 0.1);
  padding-bottom: 8px;
}

/* 基本信息样式 */
.not-available {
  color: #999;
  font-style: italic;
}

/* 技能标签样式 */
.skill-tag {
  margin-right: 8px;
  margin-bottom: 8px;
}

/* 个人简介样式 */
.bio-content {
  padding: 12px;
  background: #f5f7fa;
  border-radius: 6px;
  line-height: 1.8;
  color: #666;
}

.bio-content p {
  margin: 0;
}

/* 项目经历样式 */
.project-item h4 {
  color: #333;
  margin-bottom: 8px;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.project-role {
  color: #666;
  margin: 4px 0;
  font-size: 14px;
}

.project-description {
  color: #666;
  margin: 8px 0 0 0;
  line-height: 1.6;
  font-size: 14px;
}
</style>

