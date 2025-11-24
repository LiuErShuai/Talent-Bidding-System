# /home 页面重构开发方案

## 一、项目背景

### 1.1 当前状态
- **当前项目技术栈**：Vue 3 + Vue Router + Element Plus + Pinia + Vite
- **当前 /home 页面**：包含轮播banner、统计数据、热门项目、最新动态、合作企业等模块
- **重构参考页面**：`testcopy/osredm-clone` 目录下的静态页面（Next.js + React + Tailwind CSS）

### 1.2 重构目标
- 将 testcopy 中的页面效果完全迁移到当前项目的 `/home` 页面
- 保持页面视觉效果完全一致
- 使用当前项目的技术栈（Vue 3 + Element Plus + 自定义 CSS）
- 保持代码风格和架构一致性

## 二、技术栈对比分析

### 2.1 testcopy 技术栈
- **框架**：Next.js 15 + React 18
- **样式**：Tailwind CSS
- **UI组件**：shadcn/ui（基于 Radix UI）
- **图标**：lucide-react
- **语言**：TypeScript

### 2.2 当前项目技术栈
- **框架**：Vue 3 + Vue Router
- **样式**：自定义 CSS（scoped styles）
- **UI组件**：Element Plus
- **图标**：Element Plus Icons
- **语言**：JavaScript

### 2.3 转换策略
1. **React 组件 → Vue 3 Composition API**
   - 使用 `<script setup>` 语法
   - 使用 `ref`、`computed`、`reactive` 等响应式 API
   - 生命周期钩子：`onMounted`、`onUnmounted` 等

2. **Tailwind CSS → 自定义 CSS**
   - 将 Tailwind 类名转换为对应的 CSS 样式
   - 使用 scoped styles 保持样式隔离
   - 保持相同的视觉效果和布局

3. **shadcn/ui 组件 → Element Plus / 自定义组件**
   - Button → Element Plus Button 或自定义按钮
   - Card → Element Plus Card 或自定义卡片
   - Badge → Element Plus Tag 或自定义标签
   - Input → Element Plus Input 或自定义输入框

4. **图标转换**
   - lucide-react → Element Plus Icons 或 SVG 图标

## 三、页面结构分析

### 3.1 testcopy 页面结构

```
┌─────────────────────────────────────────┐
│ Header（品牌logo、导航、登录/注册）      │
├─────────────────────────────────────────┤
│ Hero Section                            │
│ ├─ 左侧：标题、描述、统计数据（5个）    │
│ └─ 右侧：渐变背景卡片（创客文化）        │
├─────────────────────────────────────────┤
│ 筛选器区域                              │
│ ├─ 任务领域筛选（全部、理论研究...）     │
│ └─ 任务状态筛选（全部、成果征集中...）  │
├─────────────────────────────────────────┤
│ 流程展示（4个步骤）                     │
│ ├─ 任务应征                             │
│ ├─ 成果生成                             │
│ ├─ 成果提交                             │
│ └─ 成果发表                             │
├─────────────────────────────────────────┤
│ 主内容区                                │
│ ├─ 左侧（2/3）：任务列表                │
│ │  ├─ 搜索框                           │
│ │  ├─ 排序按钮                         │
│ │  └─ 任务列表（暂无数据）             │
│ └─ 右侧（1/3）：侧边栏                  │
│    ├─ 最新发布                          │
│    ├─ 创客统计总览                      │
│    │  ├─ 发布任务数（柱状图）           │
│    │  ├─ 任务总金额（柱状图）           │
│    │  └─ 任务热门领域分布（饼图）       │
│    └─ 最新动态                          │
├─────────────────────────────────────────┤
│ 浮动帮助按钮（右侧固定）                │
└─────────────────────────────────────────┘
│ Footer（多列链接、二维码、版权信息）    │
└─────────────────────────────────────────┘
```

### 3.2 当前页面结构

```
┌─────────────────────────────────────────┐
│ Header（品牌logo、导航、用户面板）       │
├─────────────────────────────────────────┤
│ 轮播Banner区                             │
├─────────────────────────────────────────┤
│ 统计数据（4个）                          │
├─────────────────────────────────────────┤
│ 热门项目推荐（4个项目卡片）              │
├─────────────────────────────────────────┤
│ 最新动态（列表）                         │
├─────────────────────────────────────────┤
│ 合作企业（6个企业卡片）                  │
└─────────────────────────────────────────┘
│ Footer（简单链接和版权）                 │
└─────────────────────────────────────────┘
```

## 三、导航栏改进方案

### 3.1 当前导航栏问题分析

**当前导航栏结构**（`AppHeader` 组件）：
- 首页
- 项目大厅
- 我的项目
- 数据中心
- 消息

**存在的问题**：
1. **功能定位不清晰**：导航栏混合了公共功能和私有功能（如"我的项目"、"数据中心"需要登录）
2. **缺少核心功能入口**：根据需求文档，缺少"智能匹配"、"成长中心"等重要功能入口
3. **角色区分不明显**：不同用户角色（学生、企业、教师、管理员）看到的导航栏相同，不符合实际使用场景
4. **层级结构不合理**：所有功能平铺，没有使用下拉菜单组织相关功能
5. **与项目定位不符**：当前导航栏更像是通用项目管理平台，而非"创客空间"为核心的产教融合平台

### 3.2 改进方案设计

#### 3.2.1 设计原则

1. **核心功能突出**：将"创客空间"（项目大厅）作为核心功能，在导航栏中突出显示
2. **角色区分**：根据用户角色（未登录/学生/企业/教师/管理员）动态显示不同的导航菜单
3. **功能分组**：使用下拉菜单组织相关功能，减少导航栏项目数量
4. **公共优先**：未登录用户也能看到核心功能入口，降低使用门槛
5. **视觉一致性**：保持与testcopy页面风格一致，但内容适配项目实际需求

#### 3.2.2 导航栏结构设计

**方案一：基于角色的动态导航（推荐）**

```
┌─────────────────────────────────────────────────────────────┐
│ Logo | 首页 | 创客空间 ▼ | 智能匹配 | 成长中心 | 消息 | 登录/用户面板 │
└─────────────────────────────────────────────────────────────┘
```

**未登录用户导航栏**：
- 首页
- 创客空间（下拉菜单：项目大厅、项目详情、热门项目）
- 智能匹配（跳转到登录页提示）
- 成长中心（跳转到登录页提示）
- 消息（跳转到登录页提示）
- 登录 / 注册

**学生用户导航栏**：
- 首页
- 创客空间（下拉菜单：项目大厅、我的项目、项目进度）
- 智能匹配
- 成长中心（下拉菜单：我的成长、排行榜、勋章墙）
- 消息（带未读消息数）
- 用户面板（头像下拉：个人中心、设置、退出）

**企业用户导航栏**：
- 首页
- 创客空间（下拉菜单：项目大厅、我的项目、发布项目）
- 智能匹配（精准筛选学生）
- 数据中心（企业数据统计）
- 消息
- 用户面板

**教师用户导航栏**：
- 首页
- 创客空间（下拉菜单：项目大厅、指导学生项目）
- 智能匹配（推荐项目给学生）
- 数据中心（学生成长数据）
- 消息
- 用户面板

**管理员导航栏**：
- 首页
- 创客空间（下拉菜单：项目大厅、项目审核）
- 项目管理（下拉菜单：项目初审、项目终审、中期答辩）
- 数据中心
- 协议处理
- 消息
- 用户面板

**方案二：简化版导航（备选）**

如果希望导航栏更简洁，可以采用以下结构：

```
┌─────────────────────────────────────────────────────────────┐
│ Logo | 首页 | 创客空间 | 智能匹配 | 成长中心 | 消息 | 登录/用户面板 │
└─────────────────────────────────────────────────────────────┘
```

所有功能直接点击，不使用下拉菜单，相关功能通过侧边栏或页面内导航访问。

#### 3.2.3 导航栏实现建议

**技术实现要点**：

1. **角色判断**：使用 `useUserStore` 获取用户角色，动态渲染导航菜单
2. **下拉菜单**：使用 Element Plus 的 `el-dropdown` 组件实现下拉菜单
3. **激活状态**：使用 Vue Router 的 `router-link` 和 `active-class` 实现激活状态
4. **未读消息**：在消息菜单项上显示未读消息数徽章
5. **响应式设计**：移动端使用汉堡菜单（`el-menu` 的折叠模式）

**代码结构建议**：

```vue
<template>
  <header class="main-header">
    <div class="header-inner">
      <!-- Logo -->
      <div class="brand">...</div>
      
      <!-- 导航菜单 -->
      <nav class="main-nav">
        <router-link to="/home">首页</router-link>
        
        <!-- 创客空间下拉菜单 -->
        <el-dropdown>
          <span class="nav-link">
            创客空间
            <el-icon><ArrowDown /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>
                <router-link to="/projects">项目大厅</router-link>
              </el-dropdown-item>
              <el-dropdown-item v-if="isLoggedIn">
                <router-link to="/my-projects">我的项目</router-link>
              </el-dropdown-item>
              <!-- 根据角色显示不同菜单项 -->
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        
        <!-- 其他导航项 -->
        ...
      </nav>
      
      <!-- 用户区域 -->
      <div class="auth-area">...</div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()
const userRole = computed(() => userStore.userRole)
const isLoggedIn = computed(() => userStore.isLoggedIn)

// 根据角色返回不同的导航菜单配置
const navMenuConfig = computed(() => {
  // 返回菜单配置对象
})
</script>
```

#### 3.2.4 视觉设计建议

1. **品牌Logo**：
   - 保持当前项目的Logo设计（产教融合项目揭榜平台）
   - 或参考testcopy的渐变菱形图标设计，但使用项目品牌色

2. **导航菜单样式**：
   - 激活状态：使用蓝色渐变下划线（参考testcopy）
   - 悬停效果：文字颜色变化 + 轻微动画
   - 下拉菜单：使用阴影和圆角，提升视觉层次

3. **响应式适配**：
   - 桌面端：横向导航栏
   - 平板端：部分菜单项折叠到"更多"下拉菜单
   - 移动端：使用汉堡菜单，侧边栏展开

### 3.3 /home页面内容调整

基于新的导航栏设计，`/home` 页面应该：

1. **突出"创客空间"主题**：
   - Hero Section 标题改为"创客空间"（参考testcopy）
   - 统计数据展示创客相关数据（任务数、创客人数、奖金池等）

2. **功能入口优化**：
   - 在Hero Section或筛选器区域添加"智能匹配"快速入口
   - 添加"成长中心"入口（如果用户已登录）

3. **内容适配项目需求**：
   - 任务列表 → 项目列表
   - 任务领域 → 项目领域
   - 任务状态 → 项目状态（揭榜中、评审中、已完成等）

4. **保持视觉一致性**：
   - 完全复刻testcopy的视觉效果
   - 但内容替换为项目实际数据

## 四、详细重构计划

### 4.1 Header 区域重构

**当前实现**：
- 使用 `AppHeader` 组件
- 品牌logo + 导航菜单（首页、项目大厅、我的项目、数据中心、消息）+ 用户面板

**目标实现**（基于导航栏改进方案）：
- 品牌logo（保持当前项目Logo或参考testcopy样式）
- **动态导航菜单**（根据用户角色显示）：
  - 未登录：首页、创客空间（下拉）、智能匹配、成长中心、消息、登录/注册
  - 学生：首页、创客空间（下拉）、智能匹配、成长中心（下拉）、消息、用户面板
  - 企业：首页、创客空间（下拉）、智能匹配、数据中心、消息、用户面板
  - 教师：首页、创客空间（下拉）、智能匹配、数据中心、消息、用户面板
  - 管理员：首页、创客空间（下拉）、项目管理（下拉）、数据中心、协议处理、消息、用户面板
- 用户面板（已登录）或登录/注册按钮（未登录）

**转换要点**：
- 实现基于角色的动态导航菜单
- 使用 Element Plus 的 `el-dropdown` 实现下拉菜单
- 保持当前项目Logo设计（或根据需求调整）
- 保留用户面板功能，但优化导航菜单结构

**代码实现**（基于角色动态导航）：

```vue
<template>
  <header class="main-header">
    <div class="header-inner">
      <!-- Logo区域 -->
      <div class="brand">
        <router-link to="/home" class="brand-link">
          <img src="@/assets/Logo.png" alt="产教融合平台" class="brand-logo" />
          <span class="brand-name">产教融合项目揭榜平台</span>
        </router-link>
      </div>
      
      <!-- 导航菜单 -->
      <nav class="main-nav">
        <!-- 首页 -->
        <router-link to="/home" class="nav-link" active-class="active">首页</router-link>
        
        <!-- 创客空间下拉菜单 -->
        <el-dropdown trigger="hover" class="nav-dropdown">
          <span class="nav-link">
            创客空间
            <el-icon><ArrowDown /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>
                <router-link to="/projects">项目大厅</router-link>
              </el-dropdown-item>
              <el-dropdown-item v-if="isLoggedIn && (userRole === 'student' || userRole === 'enterprise')">
                <router-link to="/my-projects">我的项目</router-link>
              </el-dropdown-item>
              <el-dropdown-item v-if="isLoggedIn && userRole === 'enterprise'">
                <router-link to="/enterprise/publish">发布项目</router-link>
              </el-dropdown-item>
              <el-dropdown-item v-if="isLoggedIn && userRole === 'admin'">
                <router-link to="/pre-review">项目审核</router-link>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        
        <!-- 智能匹配 -->
        <router-link 
          v-if="!isLoggedIn || userRole === 'student' || userRole === 'enterprise'"
          to="/smart-match" 
          class="nav-link" 
          active-class="active"
        >
          智能匹配
        </router-link>
        
        <!-- 成长中心（仅学生） -->
        <el-dropdown v-if="isLoggedIn && userRole === 'student'" trigger="hover" class="nav-dropdown">
          <span class="nav-link">
            成长中心
            <el-icon><ArrowDown /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>
                <router-link to="/growth-center">我的成长</router-link>
              </el-dropdown-item>
              <el-dropdown-item>
                <router-link to="/growth-center/ranking">排行榜</router-link>
              </el-dropdown-item>
              <el-dropdown-item>
                <router-link to="/growth-center/badges">勋章墙</router-link>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        
        <!-- 数据中心（企业、教师、管理员） -->
        <router-link 
          v-if="isLoggedIn && (userRole === 'enterprise' || userRole === 'teacher' || userRole === 'admin')"
          to="/statistics" 
          class="nav-link" 
          active-class="active"
        >
          数据中心
        </router-link>
        
        <!-- 项目管理（仅管理员） -->
        <el-dropdown v-if="isLoggedIn && userRole === 'admin'" trigger="hover" class="nav-dropdown">
          <span class="nav-link">
            项目管理
            <el-icon><ArrowDown /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>
                <router-link to="/pre-review">项目初审</router-link>
              </el-dropdown-item>
              <el-dropdown-item>
                <router-link to="/final-review">项目终审</router-link>
              </el-dropdown-item>
              <el-dropdown-item>
                <router-link to="/midterm-defense">中期答辩</router-link>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        
        <!-- 协议处理（仅管理员） -->
        <router-link 
          v-if="isLoggedIn && userRole === 'admin'"
          to="/agreement-processing" 
          class="nav-link" 
          active-class="active"
        >
          协议处理
        </router-link>
        
        <!-- 消息 -->
        <router-link to="/messages" class="nav-link messages" active-class="active">
          <span>消息</span>
          <span v-if="isLoggedIn && unreadCount > 0" class="badge">{{ unreadCount }}</span>
        </router-link>
      </nav>
      
      <!-- 用户区域 -->
      <div class="auth-area">
        <template v-if="!isLoggedIn">
          <router-link to="/login" class="auth-btn text">登录</router-link>
          <router-link to="/register" class="auth-btn solid">注 册</router-link>
        </template>
        <UserPanel v-else :user-info="userInfo" :user-role="userRole" />
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useUserStore } from '@/store/user'
import { ArrowDown } from '@element-plus/icons-vue'
import UserPanel from './UserPanel.vue'

const userStore = useUserStore()

const isLoggedIn = computed(() => userStore.isLoggedIn)
const userInfo = computed(() => userStore.userInfo || {})
const userRole = computed(() => userInfo.value.role || 'student')
const unreadCount = ref(0)

// 获取未读消息数
onMounted(() => {
  if (isLoggedIn.value) {
    // TODO: 从store或API获取未读消息数
    unreadCount.value = 2 // 示例数据
  }
})
</script>

<style scoped>
.header {
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
}

.header-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.logo-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo-icon {
  width: 2.5rem;
  height: 2.5rem;
  background: linear-gradient(to bottom right, #fb923c, #fbbf24);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-diamond {
  width: 1.5rem;
  height: 1.5rem;
  background: #ffffff;
  border-radius: 50%;
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
}

.logo-text {
  display: flex;
  flex-direction: column;
}

.logo-title {
  font-weight: bold;
  font-size: 1.125rem;
  line-height: 1.5;
}

.logo-subtitle {
  font-size: 0.75rem;
  color: #6b7280;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-item {
  color: #374151;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  transition: color 0.2s;
}

.nav-item:hover {
  color: #2563eb;
}

.nav-item.active {
  color: #2563eb;
}

.auth-buttons {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.login-btn {
  color: #2563eb;
}

.register-btn {
  background: #2563eb;
  border-color: #2563eb;
}

.register-btn:hover {
  background: #1d4ed8;
  border-color: #1d4ed8;
}
</style>
```

### 4.2 Hero Section 重构

**新增内容**：
- 左侧：标题"创客空间"、描述文字、5个统计数据
  - 创客任务总数(个)：778
  - 创客人数(人)：972
  - 当前悬金池总额(元)：9510.4w
  - 已支付悬金额(元)：4973.3w
  - 任务领域(个)：23+
- 右侧：渐变背景卡片
  - 背景：蓝色渐变 + 装饰性圆形渐变
  - 内容："创客文化"标题 + 描述文字

**实现要点**：
- 使用 Grid 布局（2列）
- 统计数据使用响应式布局（2列网格）
- 右侧卡片使用绝对定位的装饰元素

**代码实现**：

```vue
<template>
  <section class="hero-section">
    <div class="hero-container">
      <div class="hero-grid">
        <!-- 左侧内容 -->
        <div class="hero-left">
          <h1 class="hero-title">创客空间</h1>
          <p class="hero-description">
            面向大众普惠群体征集技术成果，创意思想和解决方案，实现供需高效对接！
          </p>
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-value">778</div>
              <div class="stat-label">创客任务总数(个)</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">972</div>
              <div class="stat-label">创客人数(人)</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">
                9510.4<span class="stat-unit">w</span>
              </div>
              <div class="stat-label">当前悬金池总额(元)</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">
                4973.3<span class="stat-unit">w</span>
              </div>
              <div class="stat-label">已支付悬金额(元)</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">23+</div>
              <div class="stat-label">任务领域(个)</div>
            </div>
          </div>
        </div>
        <!-- 右侧卡片 -->
        <div class="hero-right">
          <div class="hero-card">
            <!-- 装饰性渐变圆形 -->
            <div class="decoration-circle circle-1"></div>
            <div class="decoration-circle circle-2"></div>
            <div class="decoration-circle circle-3"></div>
            <!-- 内容 -->
            <div class="hero-card-content">
              <h2 class="hero-card-title">创客文化</h2>
              <p class="hero-card-text">
                创客精神引领创新，开源文化汇聚众智，共创无限可能
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// 统计数据可以后续从API获取
const stats = ref([
  { value: '778', label: '创客任务总数(个)' },
  { value: '972', label: '创客人数(人)' },
  { value: '9510.4', unit: 'w', label: '当前悬金池总额(元)' },
  { value: '4973.3', unit: 'w', label: '已支付悬金额(元)' },
  { value: '23+', label: '任务领域(个)' }
])
</script>

<style scoped>
.hero-section {
  background: #ffffff;
}

.hero-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 3rem 1.5rem;
}

.hero-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

.hero-left {
  display: flex;
  flex-direction: column;
}

.hero-title {
  font-size: 2.25rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #111827;
}

.hero-description {
  color: #4b5563;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 2.25rem;
  font-weight: bold;
  color: #2563eb;
  margin-bottom: 0.5rem;
}

.stat-unit {
  font-size: 1.5rem;
}

.stat-label {
  font-size: 0.875rem;
  color: #4b5563;
}

.hero-right {
  position: relative;
}

.hero-card {
  position: relative;
  overflow: hidden;
  border-radius: 1rem;
  background: linear-gradient(to bottom right, #3b82f6, #60a5fa, #93c5fd);
  padding: 3rem;
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.decoration-circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.5;
}

.circle-1 {
  top: 0;
  right: 0;
  width: 16rem;
  height: 16rem;
  background: linear-gradient(to bottom right, #86efac, transparent);
}

.circle-2 {
  bottom: 0;
  left: 0;
  width: 24rem;
  height: 24rem;
  background: linear-gradient(to top right, #2563eb, transparent);
  opacity: 0.3;
}

.circle-3 {
  top: 25%;
  left: 25%;
  width: 12rem;
  height: 12rem;
  background: linear-gradient(to bottom right, #67e8f9, transparent);
  opacity: 0.4;
}

.hero-card-content {
  position: relative;
  z-index: 10;
  text-align: center;
  color: #ffffff;
}

.hero-card-title {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

.hero-card-text {
  font-size: 1.125rem;
  opacity: 0.9;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .hero-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
```

### 4.3 筛选器区域（新增）

**内容**：
- 任务领域筛选：全部、理论研究、政策法规、医学、电子信息...
- 任务状态筛选：全部、成果征集中、成果评选中、公示中...

**实现要点**：
- 使用按钮组实现筛选
- 当前选中项高亮显示（蓝色背景）
- 响应式布局（flex-wrap）

**代码实现**：

```vue
<template>
  <section class="filter-section">
    <div class="filter-container">
      <div class="filter-card">
        <!-- 任务领域筛选 -->
        <div class="filter-row">
          <span class="filter-label">任务领域:</span>
          <div class="filter-buttons">
            <button
              v-for="field in taskFields"
              :key="field"
              :class="['filter-btn', { active: selectedField === field }]"
              @click="selectedField = field"
            >
              {{ field }}
            </button>
            <button class="filter-btn more-btn">更多 ≡</button>
          </div>
        </div>
        <!-- 任务状态筛选 -->
        <div class="filter-row">
          <span class="filter-label">任务状态:</span>
          <div class="filter-buttons">
            <button
              v-for="status in taskStatuses"
              :key="status"
              :class="['filter-btn', { active: selectedStatus === status }]"
              @click="selectedStatus = status"
            >
              {{ status }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const taskFields = ref([
  '全部', '理论研究', '政策法规', '医学', '电子信息',
  '通信工程', '计算机科学', '软件工程', '人工智能', '知识'
])

const taskStatuses = ref([
  '全部', '成果征集中', '成果评选中', '公示中',
  '协议签订中', '支付中', '已完成', '已关闭'
])

const selectedField = ref('全部')
const selectedStatus = ref('全部')
</script>

<style scoped>
.filter-section {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.filter-container {
  margin-bottom: 1.5rem;
}

.filter-card {
  background: #ffffff;
  border-radius: 0.5rem;
  padding: 1.5rem;
}

.filter-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.filter-row:last-child {
  margin-bottom: 0;
}

.filter-label {
  color: #374151;
  font-weight: 500;
  white-space: nowrap;
}

.filter-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.filter-btn {
  padding: 0.375rem 1rem;
  border-radius: 0.25rem;
  border: none;
  background: transparent;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
}

.filter-btn:hover {
  background: #f9fafb;
}

.filter-btn.active {
  background: #dbeafe;
  color: #2563eb;
}

.more-btn {
  color: #2563eb;
}

.more-btn:hover {
  color: #1d4ed8;
  background: transparent;
}
</style>
```

### 4.4 流程展示（新增）

**4个步骤**：
1. 任务应征：蓝色渐变图标 + 描述
2. 成果生成：青色渐变图标 + 描述
3. 成果提交：紫色渐变图标 + 描述
4. 成果发表：粉色渐变图标 + 描述

**实现要点**：
- 4列网格布局
- 步骤之间的连接线（使用绝对定位）
- 每个步骤：图标 + 标题 + 描述

**代码实现**：

```vue
<template>
  <section class="process-section">
    <div class="process-container">
      <div class="process-card">
        <div class="process-grid">
          <!-- 连接线 -->
          <div class="process-line line-1"></div>
          <div class="process-line line-2"></div>
          <div class="process-line line-3"></div>
          
          <!-- 流程步骤 -->
          <div
            v-for="(step, index) in processSteps"
            :key="index"
            class="process-item"
          >
            <div :class="['process-icon', `icon-${index + 1}`]">
              <svg
                class="process-svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  :d="step.iconPath"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                />
              </svg>
            </div>
            <h3 class="process-title">{{ step.title }}</h3>
            <p class="process-description">{{ step.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const processSteps = ref([
  {
    title: '任务应征',
    description: '根据产生任务发布的任务，进行应征许可',
    iconPath: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    gradient: 'from-blue-400 to-blue-600'
  },
  {
    title: '成果生成',
    description: '针对拟题任务各种解答和出版协议成果',
    iconPath: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
    gradient: 'from-cyan-400 to-cyan-600'
  },
  {
    title: '成果提交',
    description: '根据提出平台个一键提交技术成果',
    iconPath: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12',
    gradient: 'from-purple-400 to-purple-600'
  },
  {
    title: '成果发表',
    description: '平台评审核评后征选最，用户按需求资源',
    iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    gradient: 'from-pink-400 to-pink-600'
  }
])
</script>

<style scoped>
.process-section {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1.5rem 1.5rem;
}

.process-card {
  background: #ffffff;
  border-radius: 0.5rem;
  padding: 2rem;
}

.process-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  position: relative;
}

.process-line {
  position: absolute;
  top: 2rem;
  height: 2px;
  background: #e5e7eb;
  z-index: 0;
}

.line-1 {
  left: 22%;
  right: 78%;
}

.line-2 {
  left: 47%;
  right: 53%;
}

.line-3 {
  left: 72%;
  right: 28%;
}

.process-item {
  text-align: center;
  position: relative;
  z-index: 10;
}

.process-icon {
  width: 4rem;
  height: 4rem;
  margin: 0 auto 1rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-1 {
  background: linear-gradient(to bottom right, #60a5fa, #2563eb);
}

.icon-2 {
  background: linear-gradient(to bottom right, #22d3ee, #0891b2);
}

.icon-3 {
  background: linear-gradient(to bottom right, #a78bfa, #7c3aed);
}

.icon-4 {
  background: linear-gradient(to bottom right, #f472b6, #db2777);
}

.process-svg {
  width: 2rem;
  height: 2rem;
  color: #ffffff;
}

.process-title {
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #111827;
}

.process-description {
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.5;
}

@media (max-width: 1024px) {
  .process-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .process-line {
    display: none;
  }
}

@media (max-width: 768px) {
  .process-grid {
    grid-template-columns: 1fr;
  }
}
</style>
```

### 4.5 主内容区重构

**整体布局代码**：

```vue
<template>
  <section class="main-content-section">
    <div class="main-content-container">
      <div class="main-content-grid">
        <!-- 左侧任务列表（2/3宽度） -->
        <!-- 见 4.5.1 -->
        
        <!-- 右侧侧边栏（1/3宽度） -->
        <!-- 见 4.5.2 -->
      </div>
    </div>
  </section>
</template>

<style scoped>
.main-content-section {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1.5rem 2rem;
}

.main-content-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

@media (max-width: 1024px) {
  .main-content-grid {
    grid-template-columns: 1fr;
  }
}
</style>
```

#### 4.5.1 左侧任务列表（2/3宽度）

**内容**：
- 标题："≡ 任务列表"
- 搜索框（带搜索图标）
- 排序按钮（任务模式、任务时限、综合排序）
- 任务列表区域（暂无数据提示）

**实现要点**：
- 使用 Element Plus Input 组件
- 使用 Element Plus Button 组件
- 暂无数据时显示占位符

**代码实现**：

```vue
<template>
  <div class="task-list-section">
    <div class="task-list-card">
      <div class="task-list-header">
        <h2 class="task-list-title">
          <span class="title-icon">≡</span> 任务列表
        </h2>
        <div class="task-list-search">
          <el-input
            v-model="searchKeyword"
            placeholder="输入任务编号/名称或描述（我的？）"
            class="search-input"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>
        <div class="task-list-sort">
          <el-button size="small" plain>任务模式 ▼</el-button>
          <el-button size="small" plain>任务时限 ▼</el-button>
          <el-button size="small" plain>综合排序 ▼</el-button>
        </div>
      </div>
      <div class="task-list-empty">
        <div class="empty-icon">📋</div>
        <p class="empty-text">暂无任务数据</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'

const searchKeyword = ref('')
</script>

<style scoped>
.task-list-section {
  grid-column: span 2;
}

.task-list-card {
  background: #ffffff;
  border-radius: 0.5rem;
  padding: 1.5rem;
}

.task-list-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.task-list-title {
  font-size: 1.5rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.title-icon {
  color: #2563eb;
}

.task-list-search {
  flex: 1;
}

.search-input {
  background: #f9fafb;
  border: none;
}

.task-list-sort {
  display: flex;
  gap: 0.5rem;
}

.task-list-empty {
  text-align: center;
  padding: 5rem 0;
  color: #9ca3af;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-text {
  font-size: 1rem;
}
</style>
```

#### 4.5.2 右侧侧边栏（1/3宽度）

**最新发布卡片**：
- 标题（带装饰线）
- 列表项：日期 + 标题 + NEW标签

**创客统计总览卡片**：
- 标题（带装饰线）
- 发布任务数（柱状图）
  - 2023年：58（30%高度）
  - 2024年：229（60%高度）
  - 2025年：346（100%高度）
- 任务总金额（柱状图）
  - 2023年：877w（40%高度）
  - 2024年：1289w（70%高度）
  - 2025年：5128w（100%高度）
- 任务热门领域分布（饼图）
  - SVG 实现的环形图
  - 图例（6个领域）

**最新动态卡片**：
- 标题（带装饰线）
- 动态列表：头像 + 用户名 + 操作 + 时间

**实现要点**：
- 使用 Card 组件或自定义卡片
- 柱状图使用 CSS 实现（flex布局 + 高度百分比）
- 饼图使用 SVG 实现
- 头像使用渐变背景 + 首字母

**代码实现**：

```vue
<template>
  <div class="sidebar-section">
    <!-- 最新发布 -->
    <el-card class="sidebar-card">
      <template #header>
        <div class="card-header">
          <div class="header-line"></div>
          <h3 class="card-title">最新发布</h3>
          <div class="header-line"></div>
        </div>
      </template>
      <div class="latest-releases">
        <div
          v-for="(item, index) in latestReleases"
          :key="index"
          class="release-item"
        >
          <div class="release-date">{{ item.date }}</div>
          <div class="release-content">
            <div class="release-title-row">
              <p class="release-title">{{ item.title }}</p>
              <el-tag v-if="item.isNew" type="danger" size="small">NEW</el-tag>
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 创客统计总览 -->
    <el-card class="sidebar-card">
      <template #header>
        <div class="card-header">
          <div class="header-line"></div>
          <h3 class="card-title">创客统计总览</h3>
          <div class="header-line"></div>
        </div>
      </template>
      
      <!-- 发布任务数 -->
      <div class="chart-section">
        <h4 class="chart-title">发布任务数</h4>
        <p class="chart-desc">任务数据一目了然，改善流程并可见</p>
        <div class="bar-chart">
          <div
            v-for="item in taskCountData"
            :key="item.year"
            class="bar-item"
          >
            <div
              class="bar"
              :style="{ height: item.height }"
            ></div>
            <div class="bar-value">{{ item.value }}</div>
            <div class="bar-label">{{ item.year }}</div>
          </div>
        </div>
      </div>

      <!-- 任务总金额 -->
      <div class="chart-section">
        <h4 class="chart-title">任务总金额</h4>
        <p class="chart-desc">任务数据一目了然，改善流程并可见</p>
        <div class="bar-chart">
          <div
            v-for="item in budgetData"
            :key="item.year"
            class="bar-item"
          >
            <div
              class="bar"
              :style="{ height: item.height }"
            ></div>
            <div class="bar-value">{{ item.value }}</div>
            <div class="bar-label">{{ item.year }}</div>
          </div>
        </div>
      </div>

      <!-- 任务热门领域分布 -->
      <div class="chart-section">
        <div class="donut-chart-wrapper">
          <svg viewBox="0 0 200 200" class="donut-chart">
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="#4e7cff"
              stroke-width="40"
              stroke-dasharray="352 528"
            />
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="#2dd4bf"
              stroke-width="40"
              stroke-dasharray="57 528"
              stroke-dashoffset="-352"
            />
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="#a78bfa"
              stroke-width="40"
              stroke-dasharray="27 528"
              stroke-dashoffset="-409"
            />
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="#fbbf24"
              stroke-width="40"
              stroke-dasharray="25 528"
              stroke-dashoffset="-436"
            />
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="#f87171"
              stroke-width="40"
              stroke-dasharray="21 528"
              stroke-dashoffset="-461"
            />
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="#34d399"
              stroke-width="40"
              stroke-dasharray="18 528"
              stroke-dashoffset="-482"
            />
          </svg>
        </div>
        <h4 class="chart-title text-center">任务热门领域分布</h4>
        <div class="chart-legend">
          <div
            v-for="item in fieldDistribution"
            :key="item.name"
            class="legend-item"
          >
            <div
              class="legend-color"
              :style="{ background: item.color }"
            ></div>
            <span class="legend-name">{{ item.name }}</span>
            <span class="legend-value">{{ item.percentage }}</span>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 最新动态 -->
    <el-card class="sidebar-card">
      <template #header>
        <div class="card-header">
          <div class="header-line"></div>
          <h3 class="card-title">最新动态</h3>
          <div class="header-line"></div>
        </div>
      </template>
      <div class="latest-activities">
        <div
          v-for="(item, index) in latestActivities"
          :key="index"
          class="activity-item"
        >
          <div class="activity-avatar">
            {{ item.user[0] }}
          </div>
          <div class="activity-content">
            <p class="activity-text">
              <span class="activity-user">{{ item.user }}</span>
              {{ item.action }}
              <span v-if="item.id" class="activity-id">{{ item.id }}</span>
            </p>
            <div class="activity-time">
              <el-icon><Clock /></el-icon>
              <span>{{ item.time }}</span>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Clock } from '@element-plus/icons-vue'

const latestReleases = ref([
  { date: '7\n10月', title: '风寒软件普法自适应选择与参数', isNew: true },
  { date: '7\n10月', title: '小型舟桥搭建套件', isNew: true },
  { date: '7\n10月', title: '航天器智能交互式双敏感协诊断工具', isNew: true },
  { date: '7\n10月', title: '信息系统资源合调度模型及评估软件', isNew: false },
  { date: '7\n10月', title: '穿越机/大载重无人机智群系统', isNew: false },
  { date: '7\n10月', title: '面向USB主机控制器驱动芯片级模拟测试的虚拟总线设备', isNew: false }
])

const taskCountData = ref([
  { year: '2023年', value: '58', height: '30%' },
  { year: '2024年', value: '229', height: '60%' },
  { year: '2025年', value: '346', height: '100%' }
])

const budgetData = ref([
  { year: '2023年', value: '877w', height: '40%' },
  { year: '2024年', value: '1289w', height: '70%' },
  { year: '2025年', value: '5128w', height: '100%' }
])

const fieldDistribution = ref([
  { name: '军事历史', color: '#4e7cff', percentage: '70.0%' },
  { name: '软件工程', color: '#2dd4bf', percentage: '11.3%' },
  { name: '文武翻译', color: '#a78bfa', percentage: '5.4%' },
  { name: '其他', color: '#fbbf24', percentage: '5.1%' },
  { name: '通信工程', color: '#f87171', percentage: '4.3%' },
  { name: '电子元器件', color: '#34d399', percentage: '4.0%' }
])

const latestActivities = ref([
  { user: 'Hzxdata', action: '在创客任务 利用窗函数人员主管测系统 下提交了成果', id: '39271087', time: '15小时前' },
  { user: '木国', action: '在创客任务 即插即用式应急高速网络通信装备 下提交了成果', id: '54419956', time: '16小时前' },
  { user: '远费叶·帆', action: '已通过该创任务 空间两高无人机（二次）的评选依据材料', time: '20小时前' },
  { user: '系统管理员-维翼', action: '已通过创客任务 小型舟跨搭建套件 下提交了成果', id: '86782660', time: '20小时前' },
  { user: '芜湖等星', action: '在创客任务 小型舟跨搭建套件 下提交了成果', id: '86782660', time: '23小时前' },
  { user: '姜航', action: '在创客任务 即插即用式应急高速网络通信装备 下提交了成果', id: '35397049', time: '1天前' }
])
</script>

<style scoped>
.sidebar-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.sidebar-card {
  border-radius: 0.5rem;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.header-line {
  position: absolute;
  width: 2rem;
  height: 0.25rem;
  background: #2563eb;
  border-radius: 0.125rem;
}

.header-line:first-child {
  left: 0;
}

.header-line:last-child {
  right: 0;
}

.card-title {
  font-weight: bold;
  font-size: 1.125rem;
}

.latest-releases {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.release-item {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
}

.release-item:last-child {
  border-bottom: none;
}

.release-date {
  text-align: center;
  color: #2563eb;
  font-weight: bold;
  font-size: 0.875rem;
  white-space: pre-line;
  line-height: 1.2;
}

.release-content {
  flex: 1;
}

.release-title-row {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}

.release-title {
  font-size: 0.875rem;
  color: #374151;
  flex: 1;
}

.chart-section {
  margin-bottom: 1.5rem;
}

.chart-section:last-child {
  margin-bottom: 0;
}

.chart-title {
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.75rem;
}

.chart-desc {
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.75rem;
}

.bar-chart {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 6rem;
  gap: 1rem;
}

.bar-item {
  flex: 1;
  text-align: center;
}

.bar {
  background: #3b82f6;
  border-radius: 0.25rem 0.25rem 0 0;
  width: 100%;
  transition: height 0.3s;
}

.bar-item:nth-child(1) .bar {
  background: #dbeafe;
}

.bar-item:nth-child(2) .bar {
  background: #bfdbfe;
}

.bar-item:nth-child(3) .bar {
  background: #3b82f6;
}

.bar-value {
  margin-top: 0.5rem;
  font-weight: bold;
  color: #2563eb;
}

.bar-label {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

.donut-chart-wrapper {
  width: 12rem;
  height: 12rem;
  margin: 0 auto 1rem;
  position: relative;
}

.donut-chart {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.text-center {
  text-align: center;
}

.chart-legend {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  font-size: 0.75rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.legend-color {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 0.125rem;
}

.legend-name {
  flex: 1;
}

.legend-value {
  color: #6b7280;
  margin-left: auto;
}

.latest-activities {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-avatar {
  width: 2rem;
  height: 2rem;
  background: linear-gradient(to bottom right, #60a5fa, #2563eb);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: bold;
  flex-shrink: 0;
}

.activity-content {
  flex: 1;
  min-width: 0;
}

.activity-text {
  font-size: 0.875rem;
  color: #374151;
  margin-bottom: 0.25rem;
  line-height: 1.5;
}

.activity-user {
  color: #2563eb;
  font-weight: 500;
}

.activity-id {
  color: #2563eb;
}

.activity-time {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: #9ca3af;
}
</style>
```

### 4.6 浮动帮助按钮（新增）

**内容**：
- 固定在右侧中间位置
- 垂直文字："便用手册"
- 蓝色背景 + 圆角

**实现要点**：
- 使用 `position: fixed`
- 垂直文字使用 `writing-mode: vertical-rl`

**代码实现**：

```vue
<template>
  <div class="floating-helper">
    <button class="helper-button" @click="handleHelperClick">
      <span class="helper-text">便</span>
      <span class="helper-text">用</span>
      <span class="helper-text">手</span>
      <span class="helper-text">册</span>
    </button>
  </div>
</template>

<script setup>
const handleHelperClick = () => {
  // 打开帮助手册逻辑
  console.log('打开帮助手册')
}
</script>

<style scoped>
.floating-helper {
  position: fixed;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  z-index: 50;
}

.helper-button {
  background: #2563eb;
  color: #ffffff;
  padding: 0.75rem 0.5rem;
  border-radius: 0.5rem 0 0 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
}

.helper-button:hover {
  background: #1d4ed8;
}

.helper-text {
  font-size: 0.75rem;
  writing-mode: vertical-rl;
  text-orientation: upright;
}
</style>
```

### 4.7 Footer 重构

**当前实现**：简单的链接列表

**目标实现**：
- 6列布局
  - 第1列：品牌logo + 名称
  - 第2列：关于我们（平台简介、友情链接、加入我们）
  - 第3列：使用条款（平台服务协议、创客应征投稿协议）
  - 第4列：用户手册（开源项目、创客空间、Git指令大全、API文档）
  - 第5列：开源科普（开源合规科普、专家观点）
  - 第6列：小程序二维码 + 公众号二维码
- 底部：地址、邮箱、版权、ICP备案、公网安备

**实现要点**：
- 使用 Grid 布局（6列）
- 深色背景（#22336b）
- 响应式布局（移动端单列）

**代码实现**：

```vue
<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-grid">
        <!-- 第1列：品牌logo -->
        <div class="footer-col">
          <div class="footer-logo">
            <div class="footer-logo-icon"></div>
            <div class="footer-logo-text">
              <div class="footer-logo-title">红山开源</div>
              <div class="footer-logo-subtitle">OSRedM</div>
            </div>
          </div>
        </div>
        
        <!-- 第2列：关于我们 -->
        <div class="footer-col">
          <h4 class="footer-title">关于我们</h4>
          <ul class="footer-links">
            <li><a href="#">平台简介</a></li>
            <li><a href="#">友情链接</a></li>
            <li><a href="#">加入我们</a></li>
          </ul>
        </div>
        
        <!-- 第3列：使用条款 -->
        <div class="footer-col">
          <h4 class="footer-title">使用条款</h4>
          <ul class="footer-links">
            <li><a href="#">平台服务协议</a></li>
            <li><a href="#">创客应征投稿协议</a></li>
          </ul>
        </div>
        
        <!-- 第4列：用户手册 -->
        <div class="footer-col">
          <h4 class="footer-title">用户手册</h4>
          <ul class="footer-links">
            <li><a href="#">开源项目</a></li>
            <li><a href="#">创客空间</a></li>
            <li><a href="#">Git指令大全</a></li>
            <li><a href="#">API文档</a></li>
          </ul>
        </div>
        
        <!-- 第5列：开源科普 -->
        <div class="footer-col">
          <h4 class="footer-title">开源科普</h4>
          <ul class="footer-links">
            <li><a href="#">开源合规科普</a></li>
            <li><a href="#">专家观点</a></li>
          </ul>
        </div>
        
        <!-- 第6列：二维码 -->
        <div class="footer-col">
          <h4 class="footer-title">小程序</h4>
          <div class="footer-qrcode"></div>
          <h4 class="footer-title footer-title-margin">公众号</h4>
          <div class="footer-qrcode"></div>
        </div>
      </div>
      
      <!-- 底部信息 -->
      <div class="footer-bottom">
        <div class="footer-bottom-left">
          <span>📍 地址：北京市海淀区西三环北路72号</span>
          <span>✉️ support@osredm.com</span>
        </div>
        <div class="footer-bottom-right">
          <span>Copyright©红山开源平台</span>
          <span>京ICP备2021005060</span>
          <span>🔒 京公网安备11010802034576号</span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
// Footer数据可以后续从配置或API获取
</script>

<style scoped>
.footer {
  background: #22336b;
  color: #ffffff;
  margin-top: 5rem;
}

.footer-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 3rem 1.5rem;
}

.footer-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-col {
  display: flex;
  flex-direction: column;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.footer-logo-icon {
  width: 3rem;
  height: 3rem;
  background: linear-gradient(to bottom right, #fb923c, #fbbf24);
  border-radius: 0.5rem;
}

.footer-logo-text {
  display: flex;
  flex-direction: column;
}

.footer-logo-title {
  font-weight: bold;
  font-size: 1.125rem;
}

.footer-logo-subtitle {
  font-size: 0.875rem;
  opacity: 0.7;
}

.footer-title {
  font-weight: bold;
  margin-bottom: 1rem;
}

.footer-title-margin {
  margin-top: 1rem;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.footer-links li a {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.2s;
}

.footer-links li a:hover {
  color: #60a5fa;
}

.footer-qrcode {
  width: 6rem;
  height: 6rem;
  background: #ffffff;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding-top: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  opacity: 0.7;
}

.footer-bottom-left,
.footer-bottom-right {
  display: flex;
  gap: 2rem;
}

@media (max-width: 1024px) {
  .footer-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .footer-grid {
    grid-template-columns: 1fr;
  }
  
  .footer-bottom {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .footer-bottom-left,
  .footer-bottom-right {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
```

## 五、样式转换对照表

### 5.1 颜色系统

| testcopy (Tailwind) | 当前项目 | 说明 |
|---------------------|---------|------|
| `bg-[#f3f6fb]` | `#f3f6fb` | 页面背景色 |
| `bg-white` | `#ffffff` | 白色背景 |
| `bg-blue-600` | `#2563eb` | 主蓝色 |
| `text-blue-600` | `#2563eb` | 蓝色文字 |
| `text-gray-700` | `#374151` | 深灰色文字 |
| `text-gray-500` | `#6b7280` | 中灰色文字 |
| `bg-[#22336b]` | `#22336b` | Footer背景色 |

### 5.2 布局系统

| testcopy (Tailwind) | CSS 实现 |
|---------------------|----------|
| `max-w-[1400px]` | `max-width: 1400px` |
| `mx-auto` | `margin: 0 auto` |
| `px-6` | `padding-left: 1.5rem; padding-right: 1.5rem` |
| `py-4` | `padding-top: 1rem; padding-bottom: 1rem` |
| `grid grid-cols-2` | `display: grid; grid-template-columns: repeat(2, 1fr)` |
| `grid grid-cols-3` | `display: grid; grid-template-columns: repeat(3, 1fr)` |
| `grid grid-cols-4` | `display: grid; grid-template-columns: repeat(4, 1fr)` |
| `flex items-center` | `display: flex; align-items: center` |
| `gap-6` | `gap: 1.5rem` |

### 5.3 圆角系统

| testcopy (Tailwind) | CSS 实现 |
|---------------------|----------|
| `rounded-lg` | `border-radius: 0.5rem` |
| `rounded-xl` | `border-radius: 0.75rem` |
| `rounded-2xl` | `border-radius: 1rem` |
| `rounded-full` | `border-radius: 9999px` |

## 六、组件映射方案

### 6.1 UI 组件映射

| testcopy 组件 | Vue 实现方案 |
|--------------|-------------|
| `Button` | Element Plus `el-button` 或自定义按钮 |
| `Card` | Element Plus `el-card` 或自定义卡片 |
| `Badge` | Element Plus `el-tag` 或自定义标签 |
| `Input` | Element Plus `el-input` |

### 6.2 图标映射

| testcopy 图标 | Vue 实现方案 |
|--------------|-------------|
| `ChevronDown` | Element Plus Icons `ArrowDown` 或 SVG |
| `Search` | Element Plus Icons `Search` 或 SVG |
| `Clock` | Element Plus Icons `Clock` 或 SVG |

## 七、开发步骤

### 阶段一：基础结构搭建（1-2小时）
1. 备份当前 `/home/index.vue` 文件
2. 创建新的页面结构（template、script、style）
3. 实现基础布局容器

### 阶段二：Header 重构（1小时）
1. 修改品牌logo样式（渐变背景 + 菱形图标）
2. 更新导航菜单项
3. 调整登录/注册按钮样式

### 阶段三：Hero Section 实现（2小时）
1. 实现左侧内容（标题、描述、统计数据）
2. 实现右侧渐变卡片（背景 + 装饰元素）
3. 调整响应式布局

### 阶段四：筛选器和流程展示（2小时）
1. 实现任务领域筛选器
2. 实现任务状态筛选器
3. 实现4步流程展示（图标 + 连接线）

### 阶段五：主内容区实现（3-4小时）
1. 实现左侧任务列表区域
   - 搜索框
   - 排序按钮
   - 暂无数据提示
2. 实现右侧侧边栏
   - 最新发布卡片
   - 创客统计总览卡片（柱状图 + 饼图）
   - 最新动态卡片

### 阶段六：Footer 和辅助功能（2小时）
1. 重构 Footer（6列布局）
2. 实现浮动帮助按钮
3. 添加响应式样式

### 阶段七：细节优化和测试（1-2小时）
1. 调整间距、颜色、字体
2. 测试响应式布局
3. 检查浏览器兼容性
4. 优化动画效果

## 八、注意事项

### 8.1 技术要点
1. **保持 Vue 3 Composition API 风格**
   - 使用 `<script setup>`
   - 合理使用 `ref`、`computed`、`reactive`
   - 注意响应式数据的更新

2. **样式实现**
   - 使用 scoped styles 避免样式污染
   - 保持与 testcopy 页面完全一致的视觉效果
   - 注意响应式断点（移动端、平板、桌面）

3. **组件复用**
   - 考虑将可复用部分提取为组件
   - 保持与项目现有组件风格一致

4. **性能优化**
   - 避免不必要的重渲染
   - 合理使用 `v-if` 和 `v-show`
   - 图片使用懒加载（如需要）

### 8.2 数据管理
1. **静态数据**
   - 统计数据、任务列表、动态列表等使用 `ref` 存储
   - 后续可接入真实 API

2. **状态管理**
   - 筛选器状态使用本地 `ref` 管理
   - 登录状态可继续使用 Pinia store

### 8.3 兼容性
1. **浏览器兼容**
   - 确保 CSS Grid、Flexbox 兼容性
   - 注意 `writing-mode` 的兼容性

2. **响应式设计**
   - 移动端：单列布局
   - 平板：2列布局
   - 桌面：完整布局

## 九、验收标准

### 9.1 视觉效果
- [ ] 页面布局与 testcopy 页面完全一致
- [ ] 颜色、字体、间距与参考页面一致
- [ ] 图标和装饰元素位置正确
- [ ] 响应式布局在不同屏幕尺寸下正常显示

### 9.2 功能完整性
- [ ] Header 导航正常工作
- [ ] 筛选器按钮可点击（状态切换）
- [ ] 搜索框可输入
- [ ] 排序按钮可点击
- [ ] 所有链接和按钮有正确的交互效果

### 9.3 代码质量
- [ ] 代码符合 Vue 3 最佳实践
- [ ] 样式使用 scoped，无样式污染
- [ ] 代码结构清晰，易于维护
- [ ] 无控制台错误和警告

## 十、预计工作量

- **总时长**：12-15 小时
- **开发人员**：1 名前端开发
- **难度等级**：中等

---

## 十一、完整页面结构示例

以下是将所有部分整合在一起的完整页面结构：

```vue
<template>
  <div class="home-page">
    <!-- Header -->
    <!-- 见 4.1 代码实现 -->
    
    <!-- Hero Section -->
    <!-- 见 4.2 代码实现 -->
    
    <!-- 筛选器区域 -->
    <!-- 见 4.3 代码实现 -->
    
    <!-- 流程展示 -->
    <!-- 见 4.4 代码实现 -->
    
    <!-- 主内容区 -->
    <section class="main-content-section">
      <div class="main-content-container">
        <div class="main-content-grid">
          <!-- 左侧任务列表 -->
          <!-- 见 4.5.1 代码实现 -->
          
          <!-- 右侧侧边栏 -->
          <!-- 见 4.5.2 代码实现 -->
        </div>
      </div>
    </section>
    
    <!-- 浮动帮助按钮 -->
    <!-- 见 4.6 代码实现 -->
    
    <!-- Footer -->
    <!-- 见 4.7 代码实现 -->
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ArrowDown, Search, Clock } from '@element-plus/icons-vue'

// 页面背景色
// 所有数据定义见各部分的 script setup
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: #f3f6fb;
}

/* 全局样式补充 */
.main-content-section {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1.5rem 2rem;
}

.main-content-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

@media (max-width: 1024px) {
  .main-content-grid {
    grid-template-columns: 1fr;
  }
}
</style>
```

## 十二、关键实现细节

### 12.1 响应式断点

```css
/* 移动端 */
@media (max-width: 768px) {
  /* 单列布局 */
}

/* 平板 */
@media (max-width: 1024px) {
  /* 2列布局 */
}

/* 桌面 */
@media (min-width: 1025px) {
  /* 完整布局 */
}
```

### 12.2 数据初始化示例

```javascript
// 在 script setup 中初始化所有数据
const stats = ref([...])
const taskFields = ref([...])
const processSteps = ref([...])
const latestReleases = ref([...])
const latestActivities = ref([...])
// ... 其他数据
```

### 12.3 交互功能实现

```javascript
// 筛选器切换
const selectedField = ref('全部')
const selectedStatus = ref('全部')

// 搜索功能
const searchKeyword = ref('')
const handleSearch = () => {
  // 搜索逻辑
}

// 排序功能
const sortType = ref('综合排序')
const handleSort = (type) => {
  sortType.value = type
  // 排序逻辑
}
```

### 12.4 样式变量定义

建议在全局样式或组件中定义颜色变量：

```css
:root {
  --primary-blue: #2563eb;
  --bg-light: #f3f6fb;
  --bg-white: #ffffff;
  --text-gray-700: #374151;
  --text-gray-500: #6b7280;
  --footer-bg: #22336b;
}
```

---

## 十三、重要说明

### 13.1 代码实现仅供参考

**⚠️ 重要提示**：

本文档中提供的所有代码实现示例（包括但不限于 Vue 组件代码、CSS 样式代码、JavaScript 逻辑代码）**仅供参考**，在实际开发过程中需要根据以下因素进行调整：

1. **项目实际需求**：
   - 根据需求文档和实际业务逻辑调整代码
   - 某些功能可能需要简化或扩展
   - API 接口调用方式需要与后端对接

2. **技术栈差异**：
   - testcopy 使用 Next.js + React + Tailwind CSS
   - 当前项目使用 Vue 3 + Element Plus + 自定义 CSS
   - 组件库和工具函数的使用方式可能不同

3. **项目架构**：
   - 实际项目的目录结构可能与示例不同
   - Store 管理、路由配置、组件组织方式需要适配项目现有架构
   - 需要遵循项目的代码规范和最佳实践

4. **数据格式**：
   - 示例中的数据格式可能与实际 API 返回格式不同
   - 需要根据后端接口文档调整数据处理逻辑

5. **样式细节**：
   - 颜色、间距、字体等样式可能需要微调以符合设计规范
   - 响应式断点可能需要根据实际设备测试结果调整

**建议**：
- 将代码示例作为**实现思路参考**，而非直接复制使用
- 在实现前先理解代码逻辑，再根据项目实际情况进行改写
- 遇到问题时，优先查阅项目现有代码和文档，保持代码风格一致性
- 定期与团队沟通，确保实现方案符合项目整体规划

### 13.2 导航栏改进方案实施建议

1. **分阶段实施**：
   - 第一阶段：实现基础的角色判断和动态菜单显示
   - 第二阶段：添加下拉菜单功能
   - 第三阶段：优化响应式设计和交互体验

2. **测试要点**：
   - 测试不同角色用户看到的导航菜单是否正确
   - 测试下拉菜单的交互是否流畅
   - 测试移动端响应式布局是否正常
   - 测试路由跳转和激活状态是否正确

3. **兼容性考虑**：
   - 保持与现有 `AppHeader` 组件的兼容性
   - 确保不影响其他页面的导航功能
   - 考虑向后兼容，避免破坏现有功能

---

## 十四、阶段实施计划

### 14.1 实施策略

**核心原则**：拆分方案，渐进式重构，降低风险

本重构方案涉及全局组件（Header、Footer）和页面级重构（Home），应拆分为三个独立阶段实施：

```
阶段一：Header 导航栏改进（全局影响，优先级：高）
阶段二：Home 页面内容重构（页面级，优先级：中）
阶段三：Footer 重构（全局影响，优先级：低）
```

### 14.2 阶段一：Header 导航栏改进（3-5 小时）

**目标**：在 `src/components/layout/AppHeader/index.vue` 中实现基于角色的动态导航

**关键任务**：
1. **角色判断逻辑**（1 小时）
   - 从 `useAuthStore` 获取用户角色
   - 定义各角色的导航配置对象
   - 实现动态菜单渲染逻辑

2. **下拉菜单实现**（1.5 小时）
   - 使用 `el-dropdown` 实现"创客空间"下拉菜单
   - 为学生角色添加"成长中心"下拉菜单
   - 为管理员添加"项目管理"下拉菜单
   - 调整激活状态样式

3. **测试验证**（1 小时）
   - 测试未登录/学生/企业/教师/管理员五种角色
   - 验证下拉菜单交互
   - 验证路由跳转和激活状态
   - 测试移动端响应式

4. **文档更新**（0.5 小时）
   - 更新组件使用文档
   - 记录导航菜单配置规则

**产出**：
- 全局可用的动态导航栏组件
- 导航栏使用文档

**注意事项**：
- ⚠️ 全局组件，修改前需充分测试
- ✅ 向后兼容，不影响现有页面
- ✅ 品牌 Logo 保持当前项目设计

---

### 14.3 阶段二：Home 页面内容重构（12-15 小时）

**目标**：重构 `src/views/home/index.vue`，实现参考页面的视觉效果

**子阶段划分**：

#### 阶段 2.1：基础结构搭建（2 小时）
- [ ] 备份当前 `home/index.vue`
- [ ] 创建组件目录 `src/views/home/components/`
- [ ] 设置页面基础布局和容器
- [ ] 确保页面可访问，保留现有功能

#### 阶段 2.2：Hero Section 实现（2.5 小时）
- [ ] 实现左侧：标题、描述、5 个统计数据
- [ ] 实现右侧：渐变卡片 + 装饰元素
- [ ] 对接统计数据 API（或使用 mock）
- [ ] 响应式布局适配

#### 阶段 2.3：筛选器和流程展示（2.5 小时）
- [ ] 实现任务领域筛选（按钮组 + 更多）
- [ ] 实现任务状态筛选
- [ ] 实现 4 步流程展示（图标 + 连接线）
- [ ] 添加筛选交互逻辑

#### 阶段 2.4：主内容区 - 左侧任务列表（2 小时）
- [ ] 实现标题、搜索框、排序按钮
- [ ] 对接项目列表 API（或使用 mock）
- [ ] 实现暂无数据状态
- [ ] 后续接入真实项目卡片

#### 阶段 2.5：主内容区 - 右侧侧边栏（3.5 小时）
- [ ] 实现"最新发布"卡片
- [ ] 实现"创客统计总览"卡片
  - 发布任务数柱状图（CSS 实现）
  - 任务总金额柱状图（CSS 实现）
  - 任务热门领域分布饼图（SVG 实现）
- [ ] 实现"最新动态"卡片
- [ ] 对接数据 API（或使用 mock）

#### 阶段 2.6：浮动帮助按钮（0.5 小时）
- [ ] 实现固定定位的帮助按钮
- [ ] 添加点击交互

#### 阶段 2.7：细节优化和测试（2 小时）
- [ ] 调整间距、颜色、字体细节
- [ ] 测试响应式布局（移动端、平板、桌面）
- [ ] 浏览器兼容性测试
- [ ] 性能优化（懒加载、防抖等）

**产出**：
- 全新的 Home 页面
- 组件化的页面结构
- mock 数据文件（如需要）

**注意事项**：
- ✅ 采用组件化开发，提高可维护性
- ✅ 区分静态配置和动态 API 数据
- ✅ 每个子阶段完成后确保页面可运行
- ⚠️ 图表实现可先用简化版，后续优化

---

### 14.4 阶段三：Footer 重构（2-3 小时）

**目标**：在 `src/components/layout/AppFooter/index.vue` 中实现新的 Footer 设计

**关键任务**：
1. **调整品牌元素**（0.5 小时）
   - ⚠️ 使用项目自己的品牌："产教融合平台"
   - ❌ 不要使用"红山开源 OSRedM"
   - 调整 Logo 和品牌文案

2. **6 列布局实现**（1.5 小时）
   - 第 1 列：品牌 Logo + 名称
   - 第 2-5 列：链接列表（关于我们、使用条款、用户手册、开源科普）
   - 第 6 列：二维码（根据实际需求保留或删除）
   - 底部：地址、邮箱、版权、备案信息

3. **响应式适配**（0.5 小时）
   - 桌面：6 列布局
   - 平板：3 列布局
   - 移动：1 列布局

4. **测试验证**（0.5 小时）
   - 验证各页面 Footer 显示
   - 验证响应式布局
   - 验证链接跳转

**产出**：
- 全局可用的新 Footer 组件

**注意事项**：
- ⚠️ 全局组件，修改前需充分测试
- ✅ 品牌信息需与项目定位一致
- ⚠️ 备案信息、版权信息需根据实际情况填写

---

### 14.5 总体时间估算

| 阶段 | 预估时间 | 风险等级 | 优先级 |
|------|---------|---------|--------|
| **阶段一：Header 导航栏改进** | 3-5 小时 | 🟡 中 | ⭐⭐⭐ 高 |
| **阶段二：Home 页面重构** | 12-15 小时 | 🟢 低 | ⭐⭐ 中 |
| **阶段三：Footer 重构** | 2-3 小时 | 🟡 中 | ⭐ 低 |
| **代码审查与优化** | 2-3 小时 | - | - |
| **联调测试** | 2-3 小时 | - | - |
| **总计** | **21-29 小时** | - | - |

**建议实施顺序**：阶段一 → 阶段二 → 阶段三

---

### 14.6 风险控制

#### 风险点 1：全局组件修改影响范围大
**应对措施**：
- 修改前创建 Git 分支
- 充分测试所有使用该组件的页面
- 准备回滚方案

#### 风险点 2：API 数据格式未确定
**应对措施**：
- 先使用 mock 数据开发
- 定义清晰的数据接口约定
- 预留数据适配层

#### 风险点 3：图表实现复杂度高
**应对措施**：
- 柱状图使用 CSS 实现（简单）
- 饼图使用 SVG 手动绘制（中等）
- 如需复杂图表，可考虑引入 ECharts

#### 风险点 4：响应式布局兼容性问题
**应对措施**：
- 使用 CSS Grid 和 Flexbox（现代浏览器支持良好）
- 设置明确的断点（768px、1024px）
- 在真实设备上测试

---

### 14.7 验收标准

#### 阶段一验收标准：
- [ ] 不同角色用户看到的导航菜单正确
- [ ] 下拉菜单交互流畅
- [ ] 路由跳转正常，激活状态正确
- [ ] 移动端响应式布局正常
- [ ] 不影响其他页面的 Header 显示

#### 阶段二验收标准：
- [ ] 页面布局与参考页面一致
- [ ] 所有模块正常显示（Hero、筛选器、流程、内容区）
- [ ] 响应式布局在不同屏幕尺寸下正常
- [ ] 无控制台错误和警告
- [ ] 图表显示正确（柱状图、饼图）

#### 阶段三验收标准：
- [ ] Footer 在所有页面正常显示
- [ ] 品牌信息正确（产教融合平台）
- [ ] 链接跳转正常
- [ ] 响应式布局正常

---

**备注**：本方案基于对两个项目的详细分析制定，实际开发过程中可能需要根据具体情况调整。所有代码实现示例均已提供，**仅供参考使用**，需要根据项目实际情况进行修改和优化。
