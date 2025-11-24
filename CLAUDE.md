# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个揭榜挂帅平台的前端项目，基于 Vue 3 + Vite + Element Plus 技术栈构建。平台实现"智能撮合+动态竞榜"双引擎，连接企业项目需求与学生技能培养，构建完整的产教融合生态系统。

核心特性：
- **智能撮合引擎**：基于大模型的项目-学生匹配系统
- **游戏化成长体系**：积分、段位、勋章系统
- **全流程管理**：8个阶段的项目生命周期管理（立项预审 → 项目发布 → 揭榜征集 → 方案提交 → 项目执行 → 中期答辩 → 成果提交 → 成果评审 → 公示收尾）
- **多角色协作**：支持学生、企业、教师、管理员四种角色

## 开发命令

```bash
# 安装依赖
npm install

# 启动开发服务器（带热重载）
npm run dev

# 生产环境构建
npm run build

# 预览生产构建
npm run preview
```

## 技术栈

- **前端框架**：Vue 3.5+ (Composition API + `<script setup>`)
- **构建工具**：Vite 7.1+
- **UI 组件库**：Element Plus 2.11+
- **状态管理**：Pinia 3.0+
- **路由**：Vue Router 4.6+
- **HTTP 客户端**：Axios 1.13+
- **图标**：@element-plus/icons-vue（全局注册）

## 架构设计

### 目录结构

```
src/
├── api/              # API请求封装
│   ├── request.js    # Axios实例配置（baseURL, 拦截器）
│   ├── user.js       # 用户相关API
│   └── project.js    # 项目相关API
├── assets/           # 静态资源（图片、样式）
├── components/       # 公共组件
│   ├── common/       # 通用业务组件（ProjectCard, StatusTag）
│   └── layout/       # 布局组件（AppHeader, AppFooter, AppSidebar, Breadcrumb）
├── composables/      # 组合式函数
│   ├── useAuth.js    # 认证逻辑
│   ├── useForm.js    # 表单处理
│   └── usePagination.js  # 分页逻辑
├── layouts/          # 页面布局
│   ├── AdminLayout.vue    # 管理员布局
│   ├── AuthLayout.vue     # 认证页面布局
│   ├── DefaultLayout.vue  # 默认布局
│   └── EmptyLayout.vue    # 空布局
├── router/           # 路由配置
│   ├── modules/      # 模块化路由（auth, student, enterprise, teacher, admin, common）
│   ├── guards.js     # 路由守卫
│   └── index.js      # 路由主入口
├── store/            # Pinia状态管理
│   ├── modules/      # 状态模块（auth, user, project, app）
│   └── index.js      # Store统一导出
├── utils/            # 工具函数
│   ├── constants.js  # 常量定义
│   ├── enums.js      # 枚举定义
│   ├── formatter.js  # 格式化工具
│   ├── helpers.js    # 辅助函数
│   ├── permission.js # 权限判断
│   ├── storage.js    # 本地存储封装
│   └── validator.js  # 表单验证
├── views/            # 页面组件
│   ├── auth/         # 认证页面（Login, Register）
│   ├── home/         # 首页
│   ├── project/      # 项目相关（Hall, Detail, Tracker）
│   ├── student/      # 学生功能（Apply, MyProject, SmartMatch, GrowthCenter, Submit）
│   ├── enterprise/   # 企业功能（Evaluation, ResultsCenter）
│   ├── admin/        # 管理员功能（PreReview, FinalReview, MidtermDefense, AgreementProcessing, DataCenter）
│   ├── message/      # 消息中心
│   ├── user/         # 用户中心（Profile）
│   └── info/         # 信息页面（About, Contact, Help, Privacy）
├── App.vue           # 根组件
├── main.js           # 应用入口
└── style.css         # 全局样式
```

### 路径别名配置

在 `vite.config.js` 中配置了以下别名：
- `@` → `src/`
- `@components` → `src/components/`
- `@views` → `src/views/`
- `@layouts` → `src/layouts/`
- `@api` → `src/api/`
- `@utils` → `src/utils/`
- `@assets` → `src/assets/`
- `@store` → `src/store/`
- `@composables` → `src/composables/`

### API请求配置

- **Base URL**: `http://localhost:8091/api/v1`（在 `src/api/request.js` 中配置）
- **超时时间**: 5000ms
- **认证方式**: Bearer Token（从 localStorage 读取）
- **响应拦截**: 统一处理错误（code !== 200 时显示错误消息）

### 状态管理结构

使用 Pinia 进行状态管理，分为以下模块：
- **authStore**: 用户认证状态（登录、登出、token管理）
- **userStore**: 用户信息管理
- **projectStore**: 项目数据管理
- **appStore**: 应用全局状态（侧边栏、主题等）

### 路由守卫机制

在 `src/router/guards.js` 中配置：
- **认证守卫**: 检查 `meta.requiresAuth`，未登录重定向到登录页
- **权限守卫**: 根据用户角色控制页面访问
- **标题守卫**: 自动设置页面标题

## 核心业务流程

### 项目生命周期（8个阶段）

1. **阶段0 - 立项预审**: 企业草稿 → 需求校验 → 学校初审
2. **阶段1 - 项目发布**: 企业提交 → 学校终审 → 发布榜单
3. **阶段2 - 揭榜征集**: 学生浏览 → 提交申请 → 企业审核
4. **阶段3 - 方案提交**: 提交实施方案 → 多角色审核
5. **阶段4 - 项目执行**: 进度跟踪 → 里程碑管理 → 风险预警
6. **阶段5 - 中期答辩**: 提交中期材料 → 专家评审
7. **阶段6 - 成果提交**: 上传成果 → 学校初审
8. **阶段7 - 成果评审**: 企业+专家评分 → 排名 → 确定中标
9. **阶段8 - 公示收尾**: 公示 → 申诉处理 → 协议签订 → 支付归档

### 用户角色与权限

- **学生**: 浏览项目、揭榜、提交成果、查看成长数据
- **企业**: 发布项目、审核揭榜、评审成果、发放奖金
- **教师**: 指导学生、参与评审、查看学生成长
- **管理员**: 审核项目、管理平台、统计数据

## 开发规范

### 组件开发

- **优先使用 `<script setup>` 语法**
- **组件命名**: 大驼峰（PascalCase），如 `ProjectCard.vue`
- **Props 定义**: 使用 TypeScript 风格的类型定义（defineProps）
- **Emit 定义**: 使用 defineEmits 显式声明事件
- **组件拆分**: 单个组件不超过 300 行，复杂组件拆分为子组件

### 代码风格

- **缩进**: 2个空格
- **引号**: 单引号
- **分号**: 不使用分号（Vite默认配置）
- **注释**: 复杂逻辑必须添加中文注释
- **命名规范**:
  - 变量/函数: 小驼峰（camelCase）
  - 常量: 大写下划线（UPPER_SNAKE_CASE）
  - 组件: 大驼峰（PascalCase）
  - 路由path: 短横线（kebab-case）

### 样式规范

- **优先使用 scoped 样式**
- **全局样式**: 仅在 `src/style.css` 中定义
- **Element Plus 主题**: 通过 CSS 变量覆盖
- **响应式**: 优先使用 Element Plus 的栅格系统

### 状态管理最佳实践

- **Store 命名**: use + 模块名 + Store，如 `useAuthStore`
- **State 最小化**: 只存储必要的全局状态
- **Actions 命名**: 动词开头，如 `fetchProjects`、`updateUser`
- **Getters 使用**: 复杂的计算逻辑抽取为 getter

### API 封装规范

- **统一在 `src/api/` 下按模块组织**
- **函数命名**: 动词 + 名词，如 `getProjectList`、`createProject`
- **错误处理**: 在拦截器中统一处理，业务代码只关注成功逻辑
- **参数传递**: 使用对象参数，方便扩展

## 重要注意事项

### 后端 API 配置

- 当前 baseURL 为 `http://localhost:8091/api/v1`
- 修改后端地址需同步修改 `src/api/request.js` 中的 `baseURL`
- 所有 API 响应格式应为 `{ code, data, message }`

### 权限控制

- Token 存储在 localStorage，key 为 `token`
- 路由守卫会自动检查 `meta.requiresAuth`
- 角色权限通过 `meta.roles` 数组控制

### 图标使用

- Element Plus 图标已在 `main.js` 中全局注册
- 使用方式: `<el-icon><Edit /></el-icon>`
- 可用图标列表: https://element-plus.org/zh-CN/component/icon.html

### 文件上传

- 单文件最大 500MB（需与后端协商）
- 支持类型: 文档（PDF/Word）、代码压缩包、图片、视频
- 使用 Element Plus 的 `<el-upload>` 组件

## 项目文档

项目文档位于 `project_document/` 目录：
- **编号 000-099**: 核心文档（需求分析、原型设计、API文档等）
- **编号 100-199**: 阶段性文档（实施方案、技术方案、实现报告）
- **编号 200-299**: 测试修复文档（测试报告、bug修复、模块完善）
- **编号 300-399**: 技术专题文档（技术说明、教学文档）

重要文档：
- `[000]需求分析文档.md`: 完整的业务需求和功能模块定义
- `[001]原型设计文档.md`: UI/UX设计规范
- `[100]目录结构重组.md`: 项目重构计划

## 协作规范

项目遵循 RIPER-5 工作流（Research → Investigate → Plan → Execute → Review），详见 `AGENTS.md`。

关键规则：
1. 所有代码注释使用中文
2. 删除文件前必须说明原因并获得许可
3. 完整任务完成后需要创建 Git 提交
4. 重要决策需要记录到 `project_document/` 目录
