<template>
  <header class="main-header">
    <div class="header-inner">
      <div class="brand">
        <router-link to="/home" class="brand-link">
          <img src="@/assets/Logo.png" alt="产教融合平台" class="brand-logo" />
          <span class="brand-name">产教融合项目揭榜平台</span>
        </router-link>
      </div>
      <nav class="main-nav">
        <router-link to="/home" class="nav-link" active-class="active">首页</router-link>
        <router-link to="/projects" class="nav-link" active-class="active">项目大厅</router-link>
        <router-link to="/my-projects" class="nav-link" active-class="active">我的项目</router-link>
        <router-link to="/statistics" class="nav-link" active-class="active">数据中心</router-link>
        <router-link to="/messages" class="nav-link messages" active-class="active">
          <span>消息</span>
          <span v-if="isLoggedIn && unreadCount > 0" class="badge">{{ unreadCount }}</span>
        </router-link>
      </nav>
      <div class="auth-area">
        <template v-if="!isLoggedIn">
          <router-link to="/login" class="auth-btn solid">登录</router-link>
        </template>
        <UserPanel v-else :user-info="userInfo" :user-role="userRole" />
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/store/user'
import UserPanel from './UserPanel.vue'

const userStore = useUserStore()

const isLoggedIn = computed(() => userStore.isLoggedIn)
const userInfo = computed(() => userStore.userInfo || {})
const userRole = computed(() => userInfo.value.role || 'student')
const unreadCount = ref(0)

// 获取未读消息数（后续从store或API获取）
onMounted(() => {
  // TODO: 从store或API获取未读消息数
  if (isLoggedIn.value) {
    unreadCount.value = 2 // 示例数据
  }
})
</script>

<style scoped>
.main-header {
  position: relative;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 6px 30px rgba(15, 39, 106, 0.1);
  z-index: 10;
}

.header-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-link {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: inherit;
}

.brand-logo {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  object-fit: cover;
  box-shadow: 0 10px 20px rgba(12, 80, 194, 0.2);
}

.brand-name {
  font-size: 18px;
  font-weight: 700;
  color: #0f2c85;
}

.main-nav {
  flex: 1;
  display: flex;
  justify-content: center;
  gap: 32px;
}

.nav-link {
  position: relative;
  text-decoration: none;
  color: #5a6486;
  font-weight: 600;
  transition: color 0.2s;
}

.nav-link.active,
.nav-link:hover {
  color: #0c5fe7;
}

.nav-link.active::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -8px;
  width: 100%;
  height: 3px;
  border-radius: 999px;
  background: linear-gradient(120deg, #0c5fe7, #2fb7ff);
}

.messages {
  display: flex;
  align-items: center;
  gap: 6px;
}

.badge {
  display: inline-flex;
  min-width: 18px;
  padding: 0 6px;
  height: 18px;
  border-radius: 999px;
  background: #ff4d4f;
  color: #fff;
  font-size: 12px;
  justify-content: center;
  align-items: center;
}

.auth-area {
  display: flex;
  align-items: center;
  gap: 12px;
}

.auth-btn {
  padding: 8px 22px;
  border-radius: 999px;
  border: 1px solid transparent;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.2s;
}

.auth-btn.solid {
  background: linear-gradient(120deg, #0c5fe7, #2fb7ff);
  color: #fff;
  box-shadow: 0 12px 24px rgba(12, 95, 231, 0.25);
}

.auth-btn:hover {
  transform: translateY(-2px);
}

@media (max-width: 1024px) {
  .header-inner {
    flex-direction: column;
  }

  .main-nav {
    flex-wrap: wrap;
  }
}
</style>

