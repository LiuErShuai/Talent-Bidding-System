# [140] 企业端 manage 基本信息页 API 接入实施文档

## 背景与目标
企业端项目管理页（`/enterprise/project/:id/manage`）的“基本信息”区此前依赖本地 mock 数据，无法稳定反映后端真实项目状态。
本次改造目标：在保持现有页面结构与交互不变的前提下，完成后端 API 聚合接入，确保项目名称、发布方、发布时间、周期、揭榜状态、里程碑摘要等信息来自真实接口，并在接口异常时可回退 mock 数据避免白屏。

## 目录
1. 改造范围
2. 接口与字段映射
3. 详细 TODOLIST（实施步骤）
4. 关键实现说明
5. 验证清单
6. 风险与后续优化

## 1. 改造范围
- 页面聚合层：`src/views/enterprise/ProjectManage.vue`
- API 封装层：`src/api/project.js`
- 基本信息展示层：`src/components/enterprise/BiddingBasicInfo.vue`
- 模块总文档同步：`project_document/[000]功能模块文档.md`

## 2. 接口与字段映射

### 2.1 接口清单
- `GET /project/detail/{projectId}`：项目详情主数据
- `GET /project/my_projects`：补齐项目统计字段（如申请数）
- `GET /bid/project/{projectId}`：竞榜记录统计（待审/通过/中标）
- `GET /milestone/project/{projectId}`：里程碑列表

### 2.2 页面字段映射
| 页面字段 | 来源 | 映射规则 |
| --- | --- | --- |
| `project.id` | detail | `projectId` / `id` |
| `project.name` | detail / my_projects | `title` -> 默认 `未命名项目` |
| `project.status` | detail.status | 通过 `mapProjectStatus` 转组件状态 |
| `project.statusText` | detail.status | 通过 `mapProjectStatusText` 转中文文案 |
| `project.startDate` | detail | `expectedStartDate` / `startDate` |
| `project.endDate` | detail | `expectedEndDate` / `endDate` |
| `project.publisher` | detail | `publisherName` / `enterpriseName` / `--` |
| `project.publisherId` | detail | `publisherId` |
| `biddingStats.totalApplications` | my_projects / bids | `applicationCount` 或 `bids.length` |
| `biddingStats.approvedApplications` | bids | `status in [shortlisted, confirmed]` |
| `biddingStats.pendingApplications` | bids | `status === applied` |
| `biddingStats.selectedTeam` | bids / my_projects | `confirmed.teamName` 或 acceptedTeam 占位 |
| `milestones[]` | milestone | 标准化 `id/title/status/statusText/plannedDate/deliverables` |

## 3. 详细 TODOLIST（实施步骤）

- [x] Step 1：修正并补充 API 封装
  - [x] 修正 `getProjectDetailAPI` 路径为 `/project/detail/${projectId}`
  - [x] `getMyProjectsAPI` 支持 `params` 透传
  - [x] 新增 `getProjectBidsAPI(projectId, params)`

- [x] Step 2：改造 manage 页面数据主流程
  - [x] 引入 `getProjectDetailAPI/getMyProjectsAPI/getMilestonesByProjectAPI/getProjectBidsAPI`
  - [x] 使用 `Promise.allSettled` 并发请求四个接口
  - [x] 详情接口失败时直接抛错触发降级
  - [x] 新增 `extractData` 统一响应提取

- [x] Step 3：建立页面所需 ViewModel 映射
  - [x] 新增 `mapProjectStatusText`、`mapProjectStatus`
  - [x] 新增 `mapMilestoneStatus`、`mapMilestoneStatusText`
  - [x] 新增 `buildProjectModel` 与 `buildMilestoneModel`
  - [x] 输出结构对齐 `BiddingBasicInfo` 现有 props，不改组件结构

- [x] Step 4：保留失败兜底能力
  - [x] 请求异常时弹出错误提示
  - [x] 回退 `mockProjectManageData`，保证页面可用

- [x] Step 5：补充 basic 区必要容错
  - [x] 发布方空值显示 `--`
  - [x] 发布时间空值显示 `--`
  - [x] 周期为 0 或不可计算时显示 `--`

- [x] Step 6：同步功能模块文档
  - [x] 在 `[000]功能模块文档.md` 最新更新记录新增本次改造条目

## 4. 关键实现说明

### 4.1 聚合策略
`ProjectManage.vue` 中由单数据源切换为多接口聚合：
1. 详情接口提供主字段；
2. 我的项目列表补充统计字段；
3. 竞榜列表用于计算待审/通过/中标；
4. 里程碑接口提供当前阶段摘要。

该策略避免改动多个展示组件，只在页面层做一次结构化转换。

### 4.2 状态统一
- 项目状态：后端 `pending_review/published/in_progress...` 映射到组件可识别状态 `pending/bidding/ongoing...`
- 里程碑状态：后端 `planned/in_progress/delivered/under_review...` 映射到 `pending/in-progress/completed/skipped`

### 4.3 稳定性设计（最小化）
- 仅保留必要空值兜底与请求异常回退，不增加额外复杂抽象。
- 保持现有页面布局、组件接口与交互路径不变。

## 5. 验证清单
- [ ] 打开 `/enterprise/project/:id/manage`，基本信息区可显示真实项目标题与状态。
- [ ] 发布方字段正常显示，空值时展示 `--`。
- [ ] 发布时间和周期显示正常，缺失字段不报错。
- [ ] 揭榜征集状态统计（申请/通过/待审/中标）可随后端数据变化。
- [ ] 里程碑状态区在有中标团队时正常渲染。
- [ ] 任意接口失败时，页面回退 mock 且不白屏。

## 6. 风险与后续优化
- 风险1：后端字段命名存在环境差异（如 `records/projects`、`plannedEndTime/planEndTime`）。
  - 已处理：在映射层做多字段兼容读取。
- 风险2：状态枚举后续新增。
  - 已处理：映射保底 fallback 到默认文案/状态。
- 后续建议：待后端字段完全稳定后，可将映射常量抽取到统一枚举文件，减少页面内重复映射代码。
