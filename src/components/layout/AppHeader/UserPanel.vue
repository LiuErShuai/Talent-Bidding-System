<template>
  <div class="user-panel" v-click-outside="hideDropdown">
    <img :src="userInfo.avatar || defaultAvatar" :alt="userInfo.username" class="user-avatar" @click="toggleDropdown" />
    <div class="user-dropdown" :class="{ active: showDropdown }">
      <span class="user-name">{{ userInfo.username || '用户' }}</span>
      <!-- 所有角色的通用菜单 -->
      <button class="dropdown-link" @click.stop="goUserCenter">个人中心</button>
      <button class="dropdown-link" @click.stop="goSettings">设置</button>
      <button class="dropdown-link danger" @click.stop="handleLogout">退出登录</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store/modules/auth'

const props = defineProps({
  userInfo: {
    type: Object,
    default: () => ({})
  },
  userRole: {
    type: String,
    default: 'student'
  }
})

const router = useRouter()
const authStore = useAuthStore()

const showDropdown = ref(false)
const defaultAvatar = 'https://picsum.photos/seed/user123/40/40.jpg'

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const hideDropdown = () => {
  showDropdown.value = false
}

const goUserCenter = () => {
  hideDropdown()
  router.push('/user')
}

const goSettings = () => {
  hideDropdown()
  router.push('/user?tab=settings')
}

const handleLogout = () => {
  hideDropdown()
  authStore.logout()
  // 清除旧的localStorage数据
  localStorage.removeItem('token')
  localStorage.removeItem('userRole')
  localStorage.removeItem('userData')
  router.push('/login')
}

// 点击外部关闭下拉菜单的指令
const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value()
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent)
  }
}
</script>

<style scoped>
.user-panel {
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
  cursor: pointer;
}

.user-avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: 2px solid rgba(12, 95, 231, 0.2);
  object-fit: cover;
  transition: transform 0.2s;
}

.user-panel:hover .user-avatar {
  transform: scale(1.05);
}

.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: #fff;
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 10px 30px rgba(15, 39, 106, 0.15);
  border: 1px solid #e0e6f2;
  min-width: 160px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  z-index: 1000;
}

.user-dropdown.active {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.user-name {
  font-weight: 600;
  color: #1f274b;
  margin-bottom: 4px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f3fa;
}

.dropdown-link {
  background: none;
  border: none;
  padding: 8px 12px;
  color: #5a6486;
  text-decoration: none;
  font-size: 14px;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s ease;
  text-align: left;
}

.dropdown-link:hover {
  background: #f5f7fb;
  color: #0c5fe7;
}

.dropdown-link.danger {
  color: #ff4d4f;
}

.dropdown-link.danger:hover {
  background: #fff2f0;
  color: #ff4d4f;
}
</style>

