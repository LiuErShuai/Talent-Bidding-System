<template>
  <header class="main-header" :class="{ transparent: variant === 'transparent' }">
    <div class="header-inner">
      <!-- Logo 区域 -->
      <div class="brand">
        <router-link to="/home" class="brand-logo-link">
          <img
            src="@/assets/images/logo/桂电透明背景logo.png"
            alt="创客平台"
            style="height: 45px; width: auto; max-width: 180px; object-fit: contain; border-radius: 8px;"
          />
        </router-link>
        <router-link to="/home" class="brand-name-link">
          <span class="brand-name">创客平台</span>
        </router-link>
      </div>

      <!-- 导航区域 -->
      <nav class="main-nav">
        <template v-for="(item, index) in navItems" :key="index">
          <!-- 下拉菜单类型 -->
          <el-dropdown
            v-if="item.type === 'dropdown'"
            trigger="hover"
            class="nav-dropdown"
          >
            <span class="nav-link dropdown-trigger">
              {{ item.label }}
              <el-icon class="dropdown-icon"><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="(child, childIndex) in item.children"
                  :key="childIndex"
                >
                  <router-link :to="child.path" class="dropdown-item-link">
                    {{ child.label }}
                  </router-link>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>

          <!-- 普通链接类型 -->
          <component
            v-else
            :is="item.requireLogin && !isLoggedIn ? 'span' : 'router-link'"
            :to="item.path"
            class="nav-link"
            :class="{
              active: isNavActive(item),
              messages: item.badgeKey === 'messages'
            }"
            active-class="active"
            @click="handleNavClick(item, $event)"
          >
            <span>{{ item.label }}</span>
            <!-- 未读徽章 -->
            <span
              v-if="item.badgeKey && unreadCount[item.badgeKey] > 0"
              class="badge"
            >
              {{ unreadCount[item.badgeKey] }}
            </span>
          </component>
        </template>
      </nav>

      <!-- 登录/用户区域 -->
      <div v-if="showAuthArea" class="auth-area">
        <!-- 未登录状态 -->
        <template v-if="!isLoggedIn">
          <router-link to="/login" class="auth-btn">登录</router-link>
          <router-link to="/register" class="auth-btn solid">注册</router-link>
        </template>

        <!-- 已登录状态 -->
        <UserPanel
          v-else
          :user-info="userInfo"
          :user-role="userRole"
          :quick-actions="quickActions"
        />
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/store/modules/auth'
import { ArrowDown } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import UserPanel from './UserPanel.vue'

// ========================================
// Props 定义
// ========================================

const props = defineProps({
  // 导航项数组
  navItems: {
    type: Array,
    default: () => []
  },
  // 快捷操作（传递给 UserPanel）
  quickActions: {
    type: Array,
    default: () => []
  },
  // 样式变体：default（白色背景） | transparent（透明背景）
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'transparent'].includes(value)
  },
  // 未读消息数量映射 { messages: 2, ... }
  unreadCount: {
    type: Object,
    default: () => ({})
  },
  // 是否显示登录/用户区域
  showAuthArea: {
    type: Boolean,
    default: true
  }
})

// ========================================
// 组合式 API
// ========================================

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// 初始化认证状态
onMounted(() => {
  authStore.initAuth()
})

// ========================================
// 计算属性
// ========================================

const isLoggedIn = computed(() => authStore.isLoggedIn)
const userInfo = computed(() => authStore.userInfo || {})
const userRole = computed(() => authStore.userRole || '')

// ========================================
// 方法
// ========================================

/**
 * 判断导航项是否激活
 * @param {object} item - 导航项配置
 * @returns {boolean}
 */
const isNavActive = (item) => {
  // 如果有自定义匹配函数，使用自定义逻辑
  if (item.matchRoute && typeof item.matchRoute === 'function') {
    return item.matchRoute(route)
  }

  // 默认使用路径匹配
  return route.path === item.path
}

/**
 * 处理导航项点击
 * @param {object} item - 导航项配置
 * @param {Event} event - 点击事件
 */
const handleNavClick = (item, event) => {
  // 如果需要登录但未登录，拦截跳转
  if (item.requireLogin && !isLoggedIn.value) {
    event.preventDefault()
    ElMessage.warning(`请先登录后再使用${item.label}功能`)
    router.push(`/login?redirect=${encodeURIComponent(item.path)}`)
  }
}
</script>

<style scoped>
/* ========================================
   主容器样式
   ======================================== */

.main-header {
  position: relative;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 6px 30px rgba(15, 39, 106, 0.1);
  z-index: 10;
}

/* 透明变体（仅首页使用） */
.main-header.transparent {
  background: transparent;
  box-shadow: none;
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

/* ========================================
   品牌区域
   ======================================== */

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: inherit;
  flex-shrink: 0;
}

.brand-name-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: inherit;
}

.brand-name {
  font-size: 18px;
  font-weight: 700;
  color: #0f2c85;
}

/* ========================================
   导航区域
   ======================================== */

.main-nav {
  flex: 1;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 24px;
  margin-left: 40px;
}

.nav-link {
  position: relative;
  text-decoration: none;
  color: #5a6486;
  font-weight: 600;
  font-size: 16px;
  line-height: 1;
  transition: color 0.2s;
  cursor: pointer;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  gap: 4px;
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

/* 下拉菜单 */
.nav-dropdown {
  cursor: pointer;
}

.dropdown-trigger {
  display: flex;
  align-items: center;
  gap: 4px;
}

.dropdown-icon {
  font-size: 12px;
  transition: transform 0.2s;
}

.nav-dropdown:hover .dropdown-icon {
  transform: rotate(180deg);
}

.dropdown-item-link {
  display: block;
  width: 100%;
  text-decoration: none;
  color: inherit;
}

/* 消息导航项 */
.messages {
  display: flex;
  align-items: center;
  gap: 6px;
}

/* 未读徽章 */
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

/* ========================================
   登录/用户区域
   ======================================== */

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
  color: #5a6486;
  background: transparent;
}

.auth-btn.solid {
  background: linear-gradient(120deg, #0c5fe7, #2fb7ff);
  color: #fff;
  box-shadow: 0 12px 24px rgba(12, 95, 231, 0.25);
}

.auth-btn:hover {
  transform: translateY(-2px);
}

/* ========================================
   Element Plus 下拉菜单样式覆盖
   ======================================== */

:deep(.el-dropdown-menu__item) {
  padding: 0;
}

:deep(.el-dropdown-menu__item a) {
  display: block;
  padding: 8px 20px;
  color: #606266;
  text-decoration: none;
}

:deep(.el-dropdown-menu__item:hover a) {
  color: #0c5fe7;
  background-color: #f5f7fb;
}

/* ========================================
   响应式适配
   ======================================== */

@media (max-width: 1024px) {
  .header-inner {
    flex-direction: column;
  }

  .main-nav {
    flex-wrap: wrap;
    justify-content: center;
    margin-left: 0;
    gap: 16px;
  }
}
</style>
