<template>
  <aside class="app-sidebar">
    <nav class="sidebar-nav">
      <router-link
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        class="nav-item"
        active-class="active"
      >
        <component :is="item.icon" class="nav-icon" />
        <span class="nav-text">{{ item.title }}</span>
      </router-link>
    </nav>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '@store/modules/user'
import { 
  Document, 
  Folder, 
  DataAnalysis, 
  User, 
  Setting 
} from '@element-plus/icons-vue'

const userStore = useUserStore()

// 根据用户角色显示不同的菜单
const menuItems = computed(() => {
  const role = userStore.userRole
  
  const baseMenu = [
    { path: '/home', title: '首页', icon: Document },
    { path: '/projects', title: '项目大厅', icon: Folder }
  ]

  if (role === 'admin') {
    return [
      ...baseMenu,
      { path: '/pre-review', title: '项目初审', icon: Document },
      { path: '/final-review', title: '项目终审', icon: Document },
      { path: '/midterm-defense', title: '中期答辩', icon: Document },
      { path: '/statistics', title: '数据中心', icon: DataAnalysis },
      { path: '/agreement-processing', title: '协议处理', icon: Document }
    ]
  }

  return baseMenu
})
</script>

<style scoped>
.app-sidebar {
  width: 240px;
  background: #fff;
  border-right: 1px solid #e0e6f2;
  padding: 20px 0;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  color: #5a6486;
  text-decoration: none;
  transition: all 0.2s;
  border-left: 3px solid transparent;
}

.nav-item:hover {
  background: #f5f7fb;
  color: #0c5fe7;
}

.nav-item.active {
  background: #f0f7ff;
  color: #0c5fe7;
  border-left-color: #0c5fe7;
}

.nav-icon {
  font-size: 18px;
}

.nav-text {
  font-weight: 500;
}
</style>

