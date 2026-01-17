<template>
  <div class="team-members">
    <h2 class="section-title">团队成员</h2>

    <div v-if="members && members.length" class="members-list">
      <div v-for="member in members" :key="member.id" class="member-card">
        <img :src="member.avatar" alt="avatar" class="avatar" />
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

    <el-empty v-else description="暂无团队成员信息" />
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  members: {
    type: Array,
    default: () => []
  }
})
</script>

<style scoped>
.team-members {
  max-width: 1200px;
}

.section-title {
  margin: 0 0 24px 0;
  font-size: 20px;
  font-weight: 600;
  color: #303133;
}

/* 成员列表 */
.members-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

/* 成员卡片 */
.member-card {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  padding: 16px;
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.member-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

/* 头像 */
.avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  border: 2px solid #f0f0f0;
}

/* 成员信息 */
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

/* 技能标签 */
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
  .members-list {
    grid-template-columns: 1fr;
  }
}
</style>
