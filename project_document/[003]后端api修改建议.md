# [003] 后端API修改建议

本文档记录前端在对接后端API过程中发现的问题，按功能模块分类整理，并提出修改建议。

> **文档版本**：2.1
> **更新日期**：2026-02-08
> **维护说明**：各模块开发过程中发现的API问题均应追加到对应模块章节下

---

## 目录

- [一、企业发布项目模块](#一企业发布项目模块)
  - [1.1 save_draft需返回projectId](#11-save_draft需返回projectid)
  - [1.2 缺少"协议签订"里程碑模板](#12-缺少协议签订里程碑模板)
  - [1.3 里程碑期限无批量更新接口](#13-里程碑期限无批量更新接口)
  - [1.4 里程碑缺少goal和deliverables字段](#14-里程碑缺少goal和deliverables字段)
  - [1.5 缺少通用文件上传API](#15-缺少通用文件上传api)
- [二、发布项目所需后端API（重新设计）](#二发布项目所需后端api重新设计)
  - [方案一：分步保存](#方案一分步保存)
    - [2.1 整体流程与API总览](#21-整体流程与api总览)
    - [2.2 保存项目草稿](#22-保存项目草稿)
    - [2.3 更新项目草稿](#23-更新项目草稿)
    - [2.4 获取项目草稿详情](#24-获取项目草稿详情)
    - [2.5 通用文件上传](#25-通用文件上传)
    - [2.6 获取里程碑模板列表](#26-获取里程碑模板列表)
    - [2.7 批量保存里程碑配置](#27-批量保存里程碑配置)
    - [2.8 提交发布（提交审核）](#28-提交发布提交审核)
    - [2.9 获取项目分类列表](#29-获取项目分类列表)
  - [方案二：一次性提交](#方案二一次性提交)
    - [2.10 整体流程与API总览](#210-整体流程与api总览)
    - [2.11 一次性发布项目](#211-一次性发布项目)
    - [2.12 保存草稿（中途退出时）](#212-保存草稿中途退出时)
    - [2.13 获取草稿（恢复编辑）](#213-获取草稿恢复编辑)
    - [2.14 通用文件上传（同方案一 2.5）](#214-通用文件上传同方案一-25)
    - [2.15 获取里程碑模板列表（同方案一 2.6）](#215-获取里程碑模板列表同方案一-26)
    - [2.16 获取项目分类列表（同方案一 2.9）](#216-获取项目分类列表同方案一-29)
  - [方案对比](#方案对比)
- [三、企业审核揭榜团队模块](#三企业审核揭榜团队模块)
  - [3.1 现有后端API](#31-现有后端-api)
  - [3.2 前端需求与后端gap分析](#32-前端需求与后端-gap-分析)
  - [3.3 补充：申请列表接口增强](#33-补充申请列表接口增强)
  - [3.4 新增：获取申请详情](#34-新增获取申请详情)
  - [3.5 新增：获取揭榜统计](#35-新增获取揭榜统计)
  - [3.6 补充：拒绝申请接口完善](#36-补充拒绝申请接口完善)
  - [3.7 API总览](#37-api-总览)

---

## 一、企业发布项目模块

本章节涉及企业创建/发布项目的三步流程（基本信息 → 里程碑配置 → 确认发布）。

### 前后端交互流程设计

前端采用"先存草稿，再配里程碑，最后提交审核"的分步流程，完全复用后端现有API：

```
步骤1: 填写基本信息
  ↓ 点击"下一步"
  POST /api/v1/project/save_draft          → 保存草稿，返回 projectId ⚠️(需修改返回值)
  （必选里程碑由后端自动创建）
  ↓
步骤2: 配置里程碑
  GET  /api/v1/milestone/project/{id}      → 获取已有里程碑列表
  POST /api/v1/milestone/template/create   → 添加用户启用的可选里程碑
  POST /api/v1/milestone/deadline/update   → 逐个设置里程碑期限
  ↓ 点击"上一步"（可选）
  POST /api/v1/project/update_project      → 更新草稿基本信息，再回到步骤2
  ↓ 点击"下一步"
步骤3: 确认预览
  ↓ 点击"发布"
  POST /api/v1/project/submit_review/{id}  → 提交审核（draft → pending_review）
```

**关键点**：
- 后端不需要新增接口或新增项目状态，`draft` 状态即可满足需求
- 唯一的阻塞性改动是 `save_draft` 需要返回 `projectId`（见 1.1）
- 用户可以在步骤2点"上一步"回退修改基本信息，通过 `update_project` 更新草稿

### 1.1 save_draft需返回projectId

**优先级**：P0（阻塞性问题）

**问题描述**：

`POST /api/v1/project/save_draft` 的返回值为：

```json
{
  "code": "0000",
  "info": "成功",
  "data": true
}
```

`data` 只返回布尔值 `true`，不返回新创建的项目ID。前端在步骤1保存草稿后，需要立即拿到 `projectId` 才能进入步骤2进行里程碑配置（添加可选里程碑、更新里程碑期限等操作都依赖 `projectId`）。

**影响**：前端无法在保存草稿后继续完成里程碑配置流程，整个发布流程被阻塞。

**建议修改**：`save_draft` 返回值中包含 `projectId`：

```json
{
  "code": "0000",
  "info": "成功",
  "data": {
    "projectId": "1988942614044479488"
  }
}
```

> 注：`create_project`（直接发布）如果后续仍需使用，也建议同步修改返回值。但在当前流程设计中，发布走的是 `save_draft` + `submit_review` 的组合，`create_project` 暂不涉及。

---

### 1.2 缺少"协议签订"里程碑模板

**优先级**：P1

**问题描述**：

前端设计中项目生命周期包含"协议签订"阶段（方案提交之后、中期答辩之前），但后端里程碑模板中没有此项。

**当前后端模板**（6个）：

| sequenceOrder | milestoneCode | name | milestoneType |
|:---:|---|---|---|
| 1 | proposal_submission | 方案提交 | required |
| 2 | mid_term_defense | 中期答辩 | optional |
| 3 | deliverable_submission | 成果提交 | required |
| 4 | result_review | 成果评审 | optional |
| 5 | project_settlement | 项目结算 | required |
| 6 | closure_announcement | 结项公示 | optional |

**建议**：新增 `agreement_signing`（协议签订）模板，类型为 `required`，插入到 `proposal_submission` 之后：

| sequenceOrder | milestoneCode | name | milestoneType |
|:---:|---|---|---|
| 1 | proposal_submission | 方案提交 | required |
| **2** | **agreement_signing** | **协议签订** | **required** |
| 3 | mid_term_defense | 中期答辩 | optional |
| 4 | deliverable_submission | 成果提交 | required |
| 5 | result_review | 成果评审 | optional |
| 6 | project_settlement | 项目结算 | required |
| 7 | closure_announcement | 结项公示 | optional |

**前端临时方案**：在后端添加之前，前端暂时移除"协议签订"里程碑，不展示该节点。

---

### 1.3 里程碑期限无批量配置/更新接口

**优先级**：P1

**问题描述**：

在步骤2（里程碑配置）中，前端需要为每个启用的里程碑设置期限。当前只有单条更新接口 `POST /api/v1/milestone/deadline/update`，需要逐个调用：

```
步骤2 中的API调用序列：
1. GET  /api/v1/milestone/project/{projectId}      → 获取已有里程碑列表
2. POST /api/v1/milestone/template/create           → 添加可选里程碑
3. GET  /api/v1/milestone/project/{projectId}      → 重新获取完整列表（拿到新的 milestoneId）
4. POST /api/v1/milestone/deadline/update × N       → 逐个更新每个里程碑的期限
```

如果启用了全部7个里程碑，步骤4需要调用7次，整个步骤2共需 1+1+1+7=10 次API调用。

**问题**：
- `POST /api/v1/milestone/deadline/update` 只支持单个里程碑更新，无批量接口
- 多次调用存在中间失败导致数据不一致的风险

**建议**：提供里程碑期限批量更新接口 `POST /api/v1/milestone/deadline/batch_update`：

```json
{
  "deadlines": [
    {
      "milestoneId": "2000786110992748544",
      "plannedStartTime": "2025-03-01T00:00:00",
      "plannedEndTime": "2025-03-15T23:59:59",
      "remindBeforeHours": 72
    },
    {
      "milestoneId": "2000786111051468800",
      "plannedStartTime": "2025-04-01T00:00:00",
      "plannedEndTime": "2025-04-30T23:59:59",
      "remindBeforeHours": 48
    }
  ]
}
```

这样步骤4从 N 次调用减少为 1 次，整个步骤2只需 4 次API调用。

**前端临时方案**：在批量接口提供之前，前端使用 `Promise.all` 并发调用单条更新接口。

---

### 1.4 里程碑缺少goal和deliverables字段

**优先级**：P2（后续版本）

**问题描述**：

前端里程碑配置页面支持企业为每个里程碑设置"目标"和"交付物要求"，但后端里程碑表中没有对应字段。

当前后端里程碑数据结构中只有 `description`（来自模板的固定描述），缺少：

| 缺少字段 | 类型 | 说明 |
|---------|------|------|
| `goal` | TEXT | 企业自定义的里程碑目标描述 |
| `deliverables` | JSON | 交付物要求列表 |

**deliverables 字段格式**：
```json
[
  {
    "name": "技术方案文档",
    "format": "PDF / Word",
    "requirement": "不少于10页，需包含系统架构设计"
  }
]
```
一共四个配置：里程碑目标、计划完成时间、交付物要求（标题 格式 备注）、任务文件

┌───────────────────────────────────────────────────────────────────────────────────────────────────────────┐
| 里程碑目标      □ 请描述该里程碑的目标和要求..                                                           |
|                                                                                                           |
|                                                                                                           |
|                                                                                                           |
|                                                                                                       0/500|
├───────────────────────────────────────────────────────────────────────────────────────────────────────────┤
| 计划完成时间    □ 选择计划完成日期                                                                        |
├───────────────────────────────────────────────────────────────────────────────────────────────────────────┤
| 交付物要求                                                                                                |
| ┌───────────────────────────────────────────────────────────────────────────────────────────────────────┐ |
| | 技术方案文档                                                                                         | |
| | PDF / Word                                                                                           | |
| | 不少于10页，需包含系统架构设计、技术选型依据                                                         | |
| |                                                                                                       | |
| | [删除交付物]                                                                                         | |
| └───────────────────────────────────────────────────────────────────────────────────────────────────────┘ |
| ┌───────────────────────────────────────────────────────────────────────────────────────────────────────┐ |
| | 项目计划甘特图                                                                                       | |
| | Excel / Project / PDF                                                                                | |
| | 详细到周级别的任务分解                                                                               | |
| |                                                                                                       | |
| | [删除交付物]                                                                                         | |
| └───────────────────────────────────────────────────────────────────────────────────────────────────────┘ |
|                                                                                                           |
| + 添加交付物                                                                                              |
├───────────────────────────────────────────────────────────────────────────────────────────────────────────┤
| 任务文件        □ 上传文件                                                                                |
└───────────────────────────────────────────────────────────────────────────────────────────────────────────┘

**前端临时方案**：里程碑配置中保留 goal 和 deliverables 的 UI 输入，但提交时不传这些字段（仅传期限相关字段）。待后端支持后再对接。

---

### 1.5 缺少通用文件上传API

**优先级**：P2（后续版本）

**问题描述**：

前端在以下场景需要文件上传能力：
- 步骤1：项目任务文件上传（需求文档、参考资料等）
- 步骤2：里程碑任务文件上传（每个里程碑的参考文件）

当前后端只有 `POST /api/v1/milestone/deliverable/upload`（方案提交节点的成果上传），没有通用的文件上传接口。

**建议**：提供通用文件上传接口 `POST /api/v1/file/upload`：

```
Content-Type: multipart/form-data

参数：
- file: 文件对象
- type: project_task | milestone_task | deliverable
- relatedId: 关联的项目ID或里程碑ID
```

```json
// 响应
{
  "code": "0000",
  "info": "成功",
  "data": {
    "fileId": "file-001",
    "fileName": "技术方案.pdf",
    "fileUrl": "https://xxx.com/files/xxx.pdf",
    "fileSize": 1024000
  }
}
```

**前端临时方案**：暂时隐藏文件上传功能，或仅做前端展示不实际上传。

---

---

## 二、发布项目所需后端API（重新设计）

由于现有后端逻辑需要大改，本章节从前端三步发布流程出发，给出完整的后端 API 设计建议，不依赖现有后端实现。

提供两种方案供选择：
- **方案一（分步保存）**：每个步骤点击"下一步"时即调用后端保存，数据实时持久化
- **方案二（一次性提交）**：三步数据全部在前端维护，最终点击"发布"时一次性提交；中途退出时才调用保存草稿

---

### 方案一：分步保存

> 核心思路：步骤1完成即创建草稿，步骤2完成即保存里程碑，步骤3确认后提交审核。每一步都与后端交互，数据不会丢失。

### 2.1 整体流程与API总览

```
步骤1: 填写基本信息
  ↓ 点击"下一步"
  POST /api/v1/project/draft                    → 创建/更新草稿，返回 projectId
  POST /api/v1/file/upload                      → 上传项目任务文件（如有）
  ↓
步骤2: 配置里程碑
  GET  /api/v1/milestone/templates              → 获取里程碑模板列表（含必选/可选标记）
  POST /api/v1/project/{projectId}/milestones   → 批量保存里程碑配置
  POST /api/v1/file/upload                      → 上传里程碑任务文件（如有）
  ↓
步骤3: 确认发布
  GET  /api/v1/project/{projectId}/draft        → 获取草稿完整数据用于预览
  ↓ 点击"提交发布"
  POST /api/v1/project/{projectId}/submit       → 提交审核（draft → pending_review）
```

**API 总览**：

| 序号 | 方法 | 路径 | 用途 | 调用时机 |
|------|------|------|------|---------|
| 1 | POST | `/api/v1/project/draft` | 创建/更新项目草稿 | 步骤1 → 步骤2 |
| 2 | PUT | `/api/v1/project/{projectId}/draft` | 更新已有草稿 | 步骤2回退步骤1后再次下一步 |
| 3 | GET | `/api/v1/project/{projectId}/draft` | 获取草稿详情（含里程碑） | 步骤3预览 |
| 4 | POST | `/api/v1/file/upload` | 通用文件上传 | 步骤1、步骤2 |
| 5 | GET | `/api/v1/milestone/templates` | 获取里程碑模板列表 | 步骤2初始化 |
| 6 | POST | `/api/v1/project/{projectId}/milestones` | 批量保存里程碑配置 | 步骤2 → 步骤3 |
| 7 | POST | `/api/v1/project/{projectId}/submit` | 提交审核 | 步骤3确认发布 |
| 8 | GET | `/api/v1/project/categories` | 获取项目分类列表 | 步骤1初始化 |

---

### 2.2 保存项目草稿

创建新草稿或更新已有草稿。首次调用（无 projectId）为创建，后续调用（有 projectId）为更新。

**请求**：`POST /api/v1/project/draft`

```json
{
  "projectId": null,
  "title": "AI智能客服系统开发",
  "categoryId": "cat-001",
  "description": "为平台构建基于NLP的智能客服系统...",
  "reward": 15000,
  "teamSizeMin": 2,
  "teamSizeMax": 4,
  "durationDays": 60,
  "applicationDeadline": "2025-12-15",
  "expectedEndDate": "2026-02-13",
  "requirements": "熟悉 NLP 技术，有智能客服项目经验...",
  "maxApplications": 20,
  "taskFileIds": ["file-001", "file-002"]
}
```

**字段说明**：

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| projectId | string | 否 | 为空则创建新草稿，非空则更新已有草稿 |
| title | string | 是 | 项目名称，5-50字符 |
| categoryId | string | 是 | 项目分类ID，来自分类列表接口 |
| description | string | 是 | 项目详情，至少100字符 |
| reward | number | 是 | 悬赏金额（元），最低1000 |
| teamSizeMin | number | 否 | 最小团队人数，默认2 |
| teamSizeMax | number | 否 | 最大团队人数，默认4 |
| durationDays | number | 是 | 项目周期（天），7-365 |
| applicationDeadline | string | 是 | 揭榜截止时间，ISO 日期格式 |
| expectedEndDate | string | 是 | 预计交付时间，ISO 日期格式 |
| requirements | string | 否 | 对揭榜团队的要求 |
| maxApplications | number | 否 | 最大申请数，默认不限制 |
| taskFileIds | string[] | 否 | 项目任务文件ID列表，来自文件上传接口 |

**响应**（参考）：

```json
{
  "code": "0000",
  "info": "成功",
  "data": {
    "projectId": "proj-20260211-001"
  }
}
```

**响应字段说明**：

| 字段 | 类型 | 说明 |
|------|------|------|
| code | string | 状态码，"0000" 表示成功 |
| info | string | 状态描述 |
| data.projectId | string | 项目ID，后续步骤需要使用 |

---

### 2.3 更新项目草稿

用于步骤2回退到步骤1修改基本信息后重新保存。字段与 2.2 相同，projectId 从路径获取。

**请求**：`PUT /api/v1/project/{projectId}/draft`

请求体同 2.2（不含 projectId 字段）。

**响应**：同 2.2。

---

### 2.4 获取项目草稿详情

步骤3预览时调用，返回草稿的完整信息（含已配置的里程碑）。

**请求**：`GET /api/v1/project/{projectId}/draft`

**响应**（参考）：

```json
{
  "code": "0000",
  "info": "成功",
  "data": {
    "projectId": "proj-20260211-001",
    "title": "AI智能客服系统开发",
    "categoryId": "cat-001",
    "categoryName": "人工智能",
    "description": "为平台构建基于NLP的智能客服系统...",
    "reward": 15000,
    "teamSizeMin": 2,
    "teamSizeMax": 4,
    "durationDays": 60,
    "applicationDeadline": "2025-12-15",
    "expectedEndDate": "2026-02-13",
    "requirements": "熟悉 NLP 技术...",
    "maxApplications": 20,
    "taskFiles": [
      {
        "fileId": "file-001",
        "fileName": "需求说明书.pdf",
        "fileUrl": "https://xxx.com/files/xxx.pdf",
        "fileSize": 1024000
      }
    ],
    "milestones": [
      {
        "milestoneCode": "proposal_submission",
        "title": "方案提交",
        "required": true,
        "enabled": true,
        "goal": "提交完整的技术方案...",
        "plannedDate": "2025-12-25",
        "deliverables": [
          {
            "name": "技术方案文档",
            "format": "PDF / Word",
            "requirement": "不少于10页"
          }
        ],
        "taskFileIds": ["file-003"]
      }
    ]
  }
}
```

**响应字段说明**：

| 字段 | 类型 | 说明 |
|------|------|------|
| data.projectId | string | 项目ID |
| data.title | string | 项目名称 |
| data.categoryId | string | 分类ID |
| data.categoryName | string | 分类名称（后端关联查询） |
| data.description | string | 项目详情 |
| data.reward | number | 悬赏金额（元） |
| data.teamSizeMin | number | 最小团队人数 |
| data.teamSizeMax | number | 最大团队人数 |
| data.durationDays | number | 项目周期（天） |
| data.applicationDeadline | string | 揭榜截止时间 |
| data.expectedEndDate | string | 预计交付时间 |
| data.requirements | string | 项目要求 |
| data.maxApplications | number | 最大申请数 |
| data.taskFiles | array | 项目任务文件列表 |
| data.taskFiles[].fileId | string | 文件ID |
| data.taskFiles[].fileName | string | 文件名 |
| data.taskFiles[].fileUrl | string | 文件下载地址 |
| data.taskFiles[].fileSize | number | 文件大小（字节） |
| data.milestones | array | 里程碑配置列表 |
| data.milestones[].milestoneCode | string | 里程碑模板代码 |
| data.milestones[].title | string | 里程碑名称 |
| data.milestones[].required | boolean | 是否必选 |
| data.milestones[].enabled | boolean | 是否启用 |
| data.milestones[].goal | string | 里程碑目标 |
| data.milestones[].plannedDate | string | 计划完成时间 |
| data.milestones[].deliverables | array | 交付物要求列表 |
| data.milestones[].taskFileIds | string[] | 里程碑任务文件ID列表 |

---

### 2.5 通用文件上传

用于上传项目任务文件和里程碑任务文件。上传后返回 fileId，前端在保存草稿或里程碑配置时传入 fileId 列表进行关联。

**请求**：`POST /api/v1/file/upload`

```
Content-Type: multipart/form-data

参数：
- file: 文件对象（必填）
- type: 文件用途类型（必填）
    - "project_task"    项目任务文件
    - "milestone_task"  里程碑任务文件
```

**请求字段说明**：

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| file | File | 是 | 文件对象 |
| type | string | 是 | 文件用途类型：`project_task`（项目任务文件）/ `milestone_task`（里程碑任务文件） |

**文件限制**：
- 项目任务文件：单个不超过 50MB，单个项目最多 5 个
- 里程碑任务文件：单个不超过 50MB，单个里程碑最多 3 个

**响应**（参考）：

```json
{
  "code": "0000",
  "info": "成功",
  "data": {
    "fileId": "file-001",
    "fileName": "需求说明书.pdf",
    "fileUrl": "https://xxx.com/files/xxx.pdf",
    "fileSize": 1024000
  }
}
```

**响应字段说明**：

| 字段 | 类型 | 说明 |
|------|------|------|
| data.fileId | string | 文件唯一ID，后续关联到项目或里程碑时使用 |
| data.fileName | string | 原始文件名 |
| data.fileUrl | string | 文件下载/访问地址 |
| data.fileSize | number | 文件大小（字节） |

---

### 2.6 获取里程碑模板列表

步骤2初始化时调用，获取平台预定义的里程碑模板，前端据此渲染里程碑配置列表。

**请求**：`GET /api/v1/milestone/templates`

**响应**（参考）：

```json
{
  "code": "0000",
  "info": "成功",
  "data": [
    {
      "milestoneCode": "proposal_submission",
      "title": "方案提交",
      "description": "提交详细的技术方案和项目实施计划...",
      "sequenceOrder": 1,
      "required": true,
      "defaultDeliverables": [
        { "name": "技术方案文档", "format": "PDF / Word", "requirement": "不少于10页，需包含系统架构设计" },
        { "name": "项目计划甘特图", "format": "Excel / Project / PDF", "requirement": "详细到周级别的任务分解" }
      ]
    }
  ]
}
```

**响应字段说明**：

| 字段 | 类型 | 说明 |
|------|------|------|
| data[] | array | 里程碑模板列表 |
| data[].milestoneCode | string | 里程碑唯一代码，前端提交里程碑配置时使用 |
| data[].title | string | 里程碑名称 |
| data[].description | string | 里程碑描述（模板预设） |
| data[].sequenceOrder | number | 排序序号，前端按此排序展示 |
| data[].required | boolean | 是否必选（true=必选，用户不可禁用） |
| data[].defaultDeliverables | array | 预设交付物列表，前端作为默认值填充 |
| data[].defaultDeliverables[].name | string | 交付物名称 |
| data[].defaultDeliverables[].format | string | 支持的文件格式 |
| data[].defaultDeliverables[].requirement | string | 具体要求说明 |

> 注：响应示例中只展示了一条模板，完整列表包含 7 个里程碑模板（方案提交、协议签订、中期答辩、成果提交、成果评审、项目结算、结项公示），完整数据见方案一 2.6 原始示例。

---

### 2.7 批量保存里程碑配置

步骤2点击"下一步"时调用，一次性提交所有启用的里程碑配置。后端应覆盖该项目已有的里程碑数据（先删后建或全量更新）。

**请求**：`POST /api/v1/project/{projectId}/milestones`

```json
{
  "milestones": [
    {
      "milestoneCode": "proposal_submission",
      "enabled": true,
      "goal": "提交完整的技术方案和项目实施计划",
      "plannedDate": "2025-12-25",
      "deliverables": [
        { "name": "技术方案文档", "format": "PDF / Word", "requirement": "不少于10页，需包含系统架构设计" },
        { "name": "项目计划甘特图", "format": "Excel / Project / PDF", "requirement": "详细到周级别的任务分解" }
      ],
      "taskFileIds": ["file-003"]
    },
    {
      "milestoneCode": "agreement_signing",
      "enabled": true,
      "goal": "完成项目合作协议签订",
      "plannedDate": "2025-12-30",
      "deliverables": [
        { "name": "项目合作协议", "format": "PDF", "requirement": "双方签字盖章的正式协议" }
      ],
      "taskFileIds": []
    },
    {
      "milestoneCode": "mid_term_defense",
      "enabled": false,
      "goal": "",
      "plannedDate": "",
      "deliverables": [],
      "taskFileIds": []
    },
    {
      "milestoneCode": "deliverable_submission",
      "enabled": true,
      "goal": "提交全部项目成果",
      "plannedDate": "2026-02-01",
      "deliverables": [
        { "name": "源代码", "format": "ZIP / Git仓库", "requirement": "完整项目源代码，包含README" },
        { "name": "部署文档", "format": "PDF / Markdown", "requirement": "详细的部署和配置说明" }
      ],
      "taskFileIds": ["file-004", "file-005"]
    }
  ]
}
```

**字段说明**：

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| milestoneCode | string | 是 | 里程碑模板代码，来自模板列表 |
| enabled | boolean | 是 | 是否启用（必选里程碑必须为 true） |
| goal | string | 条件必填 | 里程碑目标，enabled=true 时必填 |
| plannedDate | string | 条件必填 | 计划完成时间，enabled=true 时必填 |
| deliverables | array | 否 | 交付物要求列表 |
| taskFileIds | string[] | 否 | 里程碑任务文件ID列表 |

**后端校验要求**：
- 所有 `required=true` 的里程碑必须 `enabled=true`
- `enabled=true` 的里程碑必须有 `goal` 和 `plannedDate`
- `plannedDate` 不能早于项目的 `applicationDeadline`

**响应**（参考）：

```json
{
  "code": "0000",
  "info": "成功",
  "data": true
}
```

**响应字段说明**：

| 字段 | 类型 | 说明 |
|------|------|------|
| data | boolean | 保存是否成功 |

---

### 2.8 提交发布（提交审核）

步骤3确认后调用，将项目状态从 `draft` 变更为 `pending_review`。

**请求**：`POST /api/v1/project/{projectId}/submit`

无请求体。

**后端校验要求**：
- 项目状态必须为 `draft`
- 项目基本信息完整（title、description、categoryId、reward、durationDays、applicationDeadline、expectedEndDate）
- 至少有一个启用的里程碑，且所有必选里程碑已启用
- 每个启用的里程碑有 goal 和 plannedDate

**响应**（参考）：

```json
{
  "code": "0000",
  "info": "成功",
  "data": {
    "projectId": "proj-20260211-001",
    "status": "pending_review"
  }
}
```

**响应字段说明**：

| 字段 | 类型 | 说明 |
|------|------|------|
| data.projectId | string | 项目ID |
| data.status | string | 项目新状态，`pending_review` 表示已提交待审核 |

**失败响应示例**（参考）：

```json
{
  "code": "4001",
  "info": "项目信息不完整：缺少项目描述",
  "data": null
}
```

---

### 2.9 获取项目分类列表

步骤1初始化时调用，用于填充"项目领域"下拉选项。

**请求**：`GET /api/v1/project/categories`

**响应**（参考）：

```json
{
  "code": "0000",
  "info": "成功",
  "data": [
    { "categoryId": "cat-001", "name": "人工智能" },
    { "categoryId": "cat-002", "name": "大数据" },
    { "categoryId": "cat-003", "name": "云计算" },
    { "categoryId": "cat-004", "name": "物联网" },
    { "categoryId": "cat-005", "name": "区块链" },
    { "categoryId": "cat-006", "name": "移动开发" },
    { "categoryId": "cat-007", "name": "Web开发" },
    { "categoryId": "cat-008", "name": "其他" }
  ]
}
```

**响应字段说明**：

| 字段 | 类型 | 说明 |
|------|------|------|
| data[] | array | 分类列表 |
| data[].categoryId | string | 分类ID，提交项目时作为 `categoryId` 传入 |
| data[].name | string | 分类名称，用于前端下拉选项展示 |

---

### 方案二：一次性提交

> 核心思路：三个步骤的数据全部在前端内存中维护，步骤间切换不调用后端。只有两个时机会与后端交互：
> 1. 用户点击"提交发布" → 一次性提交全部数据（基本信息 + 里程碑配置）
> 2. 用户中途退出（关闭页面/点击取消/导航离开） → 调用保存草稿，下次进入可恢复

### 2.10 整体流程与API总览

```
页面初始化:
  GET  /api/v1/project/categories              → 获取项目分类列表
  GET  /api/v1/milestone/templates              → 获取里程碑模板列表
  GET  /api/v1/project/{projectId}/draft        → 恢复草稿（如有未完成的草稿）
  ↓
步骤1: 填写基本信息
  POST /api/v1/file/upload                      → 上传项目任务文件（如有，即时上传拿fileId）
  ↓ 点击"下一步"（纯前端切换，不调后端）
步骤2: 配置里程碑
  POST /api/v1/file/upload                      → 上传里程碑任务文件（如有）
  ↓ 点击"下一步"（纯前端切换，不调后端）
步骤3: 确认发布
  ↓ 点击"提交发布"
  POST /api/v1/project/publish                  → 一次性提交全部数据（基本信息 + 里程碑）
  ↓
  ↑ 中途退出（关闭/取消/导航离开）
  POST /api/v1/project/draft                    → 保存草稿（基本信息 + 里程碑，无论填到哪一步）
```

**API 总览**：

| 序号 | 方法 | 路径 | 用途 | 调用时机 |
|------|------|------|------|---------|
| 1 | POST | `/api/v1/project/publish` | 一次性发布项目 | 步骤3点击"提交发布" |
| 2 | POST | `/api/v1/project/draft` | 保存草稿 | 中途退出时 |
| 3 | GET | `/api/v1/project/{projectId}/draft` | 获取草稿 | 页面初始化（恢复未完成的草稿） |
| 4 | POST | `/api/v1/file/upload` | 通用文件上传 | 步骤1、步骤2（同方案一） |
| 5 | GET | `/api/v1/milestone/templates` | 获取里程碑模板列表 | 页面初始化（同方案一） |
| 6 | GET | `/api/v1/project/categories` | 获取项目分类列表 | 页面初始化（同方案一） |

---

### 2.11 一次性发布项目

步骤3点击"提交发布"时调用，将基本信息和里程碑配置一次性提交。后端创建项目并直接进入 `pending_review` 状态。

**请求**：`POST /api/v1/project/publish`

```json
{
  "title": "AI智能客服系统开发",
  "categoryId": "cat-001",
  "description": "为平台构建基于NLP的智能客服系统...",
  "reward": 15000,
  "teamSizeMin": 2,
  "teamSizeMax": 4,
  "durationDays": 60,
  "applicationDeadline": "2025-12-15",
  "expectedEndDate": "2026-02-13",
  "requirements": "熟悉 NLP 技术，有智能客服项目经验...",
  "maxApplications": 20,
  "taskFileIds": ["file-001", "file-002"],
  "milestones": [
    {
      "milestoneCode": "proposal_submission",
      "enabled": true,
      "goal": "提交完整的技术方案和项目实施计划",
      "plannedDate": "2025-12-25",
      "deliverables": [
        { "name": "技术方案文档", "format": "PDF / Word", "requirement": "不少于10页，需包含系统架构设计" },
        { "name": "项目计划甘特图", "format": "Excel / Project / PDF", "requirement": "详细到周级别的任务分解" }
      ],
      "taskFileIds": ["file-003"]
    },
    {
      "milestoneCode": "agreement_signing",
      "enabled": true,
      "goal": "完成项目合作协议签订",
      "plannedDate": "2025-12-30",
      "deliverables": [
        { "name": "项目合作协议", "format": "PDF", "requirement": "双方签字盖章的正式协议" }
      ],
      "taskFileIds": []
    },
    {
      "milestoneCode": "mid_term_defense",
      "enabled": false,
      "goal": "",
      "plannedDate": "",
      "deliverables": [],
      "taskFileIds": []
    },
    {
      "milestoneCode": "deliverable_submission",
      "enabled": true,
      "goal": "提交全部项目成果",
      "plannedDate": "2026-02-01",
      "deliverables": [
        { "name": "源代码", "format": "ZIP / Git仓库", "requirement": "完整项目源代码，包含README" },
        { "name": "部署文档", "format": "PDF / Markdown", "requirement": "详细的部署和配置说明" }
      ],
      "taskFileIds": ["file-004", "file-005"]
    },
    {
      "milestoneCode": "project_settlement",
      "enabled": true,
      "goal": "完成项目验收和费用结算",
      "plannedDate": "2026-02-10",
      "deliverables": [
        { "name": "验收报告", "format": "PDF", "requirement": "项目验收通过的正式报告" }
      ],
      "taskFileIds": []
    }
  ]
}
```

**字段说明**：

项目基本信息字段同方案一 2.2，里程碑字段同方案一 2.7，此处合并为一个请求体。额外说明：

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| title | string | 是 | 项目名称，5-50字符 |
| categoryId | string | 是 | 项目分类ID |
| description | string | 是 | 项目详情，至少100字符 |
| reward | number | 是 | 悬赏金额（元），最低1000 |
| teamSizeMin | number | 否 | 最小团队人数，默认2 |
| teamSizeMax | number | 否 | 最大团队人数，默认4 |
| durationDays | number | 是 | 项目周期（天），7-365 |
| applicationDeadline | string | 是 | 揭榜截止时间，ISO 日期格式 |
| expectedEndDate | string | 是 | 预计交付时间，ISO 日期格式 |
| requirements | string | 否 | 对揭榜团队的要求 |
| maxApplications | number | 否 | 最大申请数，默认不限制 |
| taskFileIds | string[] | 否 | 项目任务文件ID列表 |
| milestones | array | 是 | 里程碑配置列表，至少包含所有必选里程碑 |
| milestones[].milestoneCode | string | 是 | 里程碑模板代码 |
| milestones[].enabled | boolean | 是 | 是否启用 |
| milestones[].goal | string | 条件必填 | 里程碑目标，enabled=true 时必填 |
| milestones[].plannedDate | string | 条件必填 | 计划完成时间，enabled=true 时必填 |
| milestones[].deliverables | array | 否 | 交付物要求列表 |
| milestones[].deliverables[].name | string | 是 | 交付物名称 |
| milestones[].deliverables[].format | string | 是 | 支持的文件格式 |
| milestones[].deliverables[].requirement | string | 是 | 具体要求说明 |
| milestones[].taskFileIds | string[] | 否 | 里程碑任务文件ID列表 |

**后端处理逻辑**：
1. 创建项目记录，状态直接设为 `pending_review`
2. 批量创建里程碑记录（仅 `enabled=true` 的）
3. 关联任务文件
4. 如果该用户有同项目的草稿记录，删除草稿

**后端校验要求**：
- 项目基本信息完整（title、description、categoryId、reward、durationDays、applicationDeadline、expectedEndDate）
- 至少有一个启用的里程碑，且所有必选里程碑已启用
- 每个启用的里程碑有 goal 和 plannedDate
- plannedDate 不能早于 applicationDeadline

**响应**（参考）：

```json
{
  "code": "0000",
  "info": "成功",
  "data": {
    "projectId": "proj-20260211-001",
    "status": "pending_review"
  }
}
```

**响应字段说明**：

| 字段 | 类型 | 说明 |
|------|------|------|
| data.projectId | string | 新创建的项目ID |
| data.status | string | 项目状态，`pending_review` 表示已提交待审核 |

---

### 2.12 保存草稿（中途退出时）

用户在任意步骤中途退出时调用（通过 `beforeunload` 事件或路由守卫 `beforeRouteLeave` 触发），将当前已填写的数据保存为草稿。

**请求**：`POST /api/v1/project/draft`

```json
{
  "draftId": null,
  "currentStep": 1,
  "project": {
    "title": "AI智能客服系统开发",
    "categoryId": "cat-001",
    "description": "为平台构建基于NLP的智能客服系统...",
    "reward": 15000,
    "teamSizeMin": 2,
    "teamSizeMax": 4,
    "durationDays": 60,
    "applicationDeadline": "2025-12-15",
    "expectedEndDate": "2026-02-13",
    "requirements": "熟悉 NLP 技术...",
    "maxApplications": 20,
    "taskFileIds": ["file-001"]
  },
  "milestones": [
    {
      "milestoneCode": "proposal_submission",
      "enabled": true,
      "goal": "提交完整的技术方案",
      "plannedDate": "2025-12-25",
      "deliverables": [
        { "name": "技术方案文档", "format": "PDF / Word", "requirement": "不少于10页" }
      ],
      "taskFileIds": []
    }
  ]
}
```

**字段说明**：

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| draftId | string | 否 | 为空则创建新草稿，非空则覆盖已有草稿 |
| currentStep | number | 是 | 用户退出时所在的步骤（0/1/2），恢复时直接跳到该步骤 |
| project | object | 是 | 项目基本信息，字段可以不完整（草稿允许部分填写） |
| project.title | string | 否 | 项目名称 |
| project.categoryId | string | 否 | 项目分类ID |
| project.description | string | 否 | 项目详情 |
| project.reward | number | 否 | 悬赏金额（元） |
| project.teamSizeMin | number | 否 | 最小团队人数 |
| project.teamSizeMax | number | 否 | 最大团队人数 |
| project.durationDays | number | 否 | 项目周期（天） |
| project.applicationDeadline | string | 否 | 揭榜截止时间 |
| project.expectedEndDate | string | 否 | 预计交付时间 |
| project.requirements | string | 否 | 项目要求 |
| project.maxApplications | number | 否 | 最大申请数 |
| project.taskFileIds | string[] | 否 | 项目任务文件ID列表 |
| milestones | array | 否 | 已配置的里程碑，可以为空（用户还没到步骤2） |
| milestones[].milestoneCode | string | 是 | 里程碑模板代码 |
| milestones[].enabled | boolean | 是 | 是否启用 |
| milestones[].goal | string | 否 | 里程碑目标（草稿允许为空） |
| milestones[].plannedDate | string | 否 | 计划完成时间（草稿允许为空） |
| milestones[].deliverables | array | 否 | 交付物要求列表 |
| milestones[].taskFileIds | string[] | 否 | 里程碑任务文件ID列表 |

**与方案一草稿接口的区别**：
- 方案一的草稿只保存基本信息，里程碑通过单独接口保存
- 方案二的草稿保存全部数据（基本信息 + 里程碑），且不做必填校验（允许半成品）

**后端校验要求**：
- 不做必填校验（草稿允许任何字段为空）
- 同一用户同一时间只保留一份草稿（新草稿覆盖旧草稿）

**响应**（参考）：

```json
{
  "code": "0000",
  "info": "成功",
  "data": {
    "draftId": "draft-20260211-001"
  }
}
```

**响应字段说明**：

| 字段 | 类型 | 说明 |
|------|------|------|
| data.draftId | string | 草稿ID，下次保存时传入可覆盖更新 |

---

### 2.13 获取草稿（恢复编辑）

页面初始化时调用，检查当前用户是否有未完成的草稿。如有，前端弹窗询问"是否恢复上次编辑？"，用户确认后将数据回填到表单并跳转到对应步骤。

**请求**：`GET /api/v1/project/draft/latest`

**响应（有草稿）**（参考）：

```json
{
  "code": "0000",
  "info": "成功",
  "data": {
    "draftId": "draft-20260211-001",
    "currentStep": 1,
    "updatedAt": "2026-02-11T14:30:00",
    "project": {
      "title": "AI智能客服系统开发",
      "categoryId": "cat-001",
      "description": "为平台构建基于NLP的智能客服系统...",
      "reward": 15000,
      "teamSizeMin": 2,
      "teamSizeMax": 4,
      "durationDays": 60,
      "applicationDeadline": "2025-12-15",
      "expectedEndDate": "2026-02-13",
      "requirements": "熟悉 NLP 技术...",
      "maxApplications": 20,
      "taskFiles": [
        { "fileId": "file-001", "fileName": "需求说明书.pdf", "fileUrl": "...", "fileSize": 1024000 }
      ]
    },
    "milestones": [
      {
        "milestoneCode": "proposal_submission",
        "enabled": true,
        "goal": "提交完整的技术方案",
        "plannedDate": "2025-12-25",
        "deliverables": [
          { "name": "技术方案文档", "format": "PDF / Word", "requirement": "不少于10页" }
        ],
        "taskFileIds": []
      }
    ]
  }
}
```

**响应字段说明**：

| 字段 | 类型 | 说明 |
|------|------|------|
| data | object \| null | 草稿数据，无草稿时为 `null` |
| data.draftId | string | 草稿ID |
| data.currentStep | number | 上次退出时所在步骤（0/1/2），前端据此跳转 |
| data.updatedAt | string | 草稿最后更新时间，ISO 格式，前端可展示"上次编辑于..." |
| data.project | object | 项目基本信息（字段可能不完整） |
| data.project.title | string | 项目名称 |
| data.project.categoryId | string | 分类ID |
| data.project.description | string | 项目详情 |
| data.project.reward | number | 悬赏金额（元） |
| data.project.teamSizeMin | number | 最小团队人数 |
| data.project.teamSizeMax | number | 最大团队人数 |
| data.project.durationDays | number | 项目周期（天） |
| data.project.applicationDeadline | string | 揭榜截止时间 |
| data.project.expectedEndDate | string | 预计交付时间 |
| data.project.requirements | string | 项目要求 |
| data.project.maxApplications | number | 最大申请数 |
| data.project.taskFiles | array | 项目任务文件列表（含完整文件信息） |
| data.project.taskFiles[].fileId | string | 文件ID |
| data.project.taskFiles[].fileName | string | 文件名 |
| data.project.taskFiles[].fileUrl | string | 文件下载地址 |
| data.project.taskFiles[].fileSize | number | 文件大小（字节） |
| data.milestones | array | 已配置的里程碑列表（可能为空） |
| data.milestones[].milestoneCode | string | 里程碑模板代码 |
| data.milestones[].enabled | boolean | 是否启用 |
| data.milestones[].goal | string | 里程碑目标（可能为空） |
| data.milestones[].plannedDate | string | 计划完成时间（可能为空） |
| data.milestones[].deliverables | array | 交付物要求列表 |
| data.milestones[].taskFileIds | string[] | 里程碑任务文件ID列表 |

**响应（无草稿）**（参考）：

```json
{
  "code": "0000",
  "info": "成功",
  "data": null
}
```

---

### 2.14 通用文件上传（同方案一 2.5）

接口定义与方案一完全相同，参见 [2.5 通用文件上传](#25-通用文件上传)。

文件上传是即时操作（选择文件后立即上传拿到 fileId），不受方案选择影响。

---

### 2.15 获取里程碑模板列表（同方案一 2.6）

接口定义与方案一完全相同，参见 [2.6 获取里程碑模板列表](#26-获取里程碑模板列表)。

---

### 2.16 获取项目分类列表（同方案一 2.9）

接口定义与方案一完全相同，参见 [2.9 获取项目分类列表](#29-获取项目分类列表)。

---

### 方案对比

| 对比维度 | 方案一：分步保存 | 方案二：一次性提交 |
|---------|----------------|------------------|
| **核心思路** | 每步"下一步"都调后端保存 | 全部在前端维护，最后一次性提交 |
| **后端接口数** | 8 个（草稿CRUD + 里程碑保存 + 提交 + 文件 + 模板 + 分类） | 6 个（发布 + 草稿保存/获取 + 文件 + 模板 + 分类） |
| **步骤间切换** | 每次"下一步"有网络请求，需 loading | 纯前端切换，无延迟 |
| **数据安全性** | 高，每步都持久化，浏览器崩溃不丢数据 | 中，浏览器崩溃会丢失未保存的数据 |
| **草稿机制** | 步骤1即创建草稿，天然支持 | 需额外实现退出时保存（beforeunload + 路由守卫） |
| **后端复杂度** | 中，需维护草稿状态和里程碑的分步写入 | 低，发布接口一次性处理，草稿接口只做整体存取 |
| **前端复杂度** | 中，需管理 projectId 在步骤间传递 | 中，需实现退出保存和草稿恢复逻辑 |
| **用户体验** | 步骤切换稍慢（有网络请求） | 步骤切换流畅，但退出时可能丢数据 |
| **适合场景** | 表单内容多、填写耗时长、需要可靠保存 | 表单内容适中、希望流畅体验 |

---

## 三、企业审核揭榜团队模块

本章节梳理企业审核揭榜团队的完整流程，对照后端现有 API（来自 [002]API文档.md）和前端 BiddingManagement.vue 的实际需求，指出需要补充和完善的内容。

### 3.1 现有后端 API

后端已定义 5 个揭榜相关接口：

| 序号 | 方法 | 路径 | 用途 | 现状 |
|------|------|------|------|------|
| 1 | POST | `/api/v1/bid/apply` | 学生申请揭榜 | 已定义 |
| 2 | GET | `/api/v1/bid/project/{projectId}` | 企业查看申请列表 | 已定义 |
| 3 | POST | `/api/v1/bid/shortlist` | 企业筛选入围 | 已定义 |
| 4 | POST | `/api/v1/bid/confirm` | 企业确认中标 | 已定义 |
| 5 | POST | `/api/v1/bid/reject` | 企业拒绝申请 | 已定义，但参数和响应不完整 |

### 3.2 前端需求与后端 gap 分析

前端 BiddingManagement.vue 的实际交互需求如下，逐项对照后端 API：

#### 3.2.1 申请列表返回数据不足

**现有接口**：`GET /api/v1/bid/project/{projectId}`

**现有返回字段**：

```json
{
  "bidId": "string",
  "projectId": "string",
  "studentId": "string",
  "status": "APPLIED",
  "content": "string",
  "attachmentUrl": "string",
  "remark": "string",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

**前端需要但后端缺少的字段**：

| 缺少字段 | 类型 | 说明 | 前端用途 |
|---------|------|------|---------|
| teamName | string | 团队名称 | 列表卡片标题 |
| leader | string | 团队负责人姓名 | 列表卡片展示 |
| memberCount | number | 团队人数 | 列表卡片展示 |
| contact | string | 联系方式 | 详情弹窗展示 |
| detailFiles | array | 团队资料文件列表 | 详情弹窗下载 |

**问题**：后端只返回 `studentId`，前端无法直接展示团队名称、负责人等信息。如果要前端逐个调用用户详情接口来补全，会产生 N+1 查询问题。

**建议**：申请列表接口返回时关联查询团队/学生信息，补充上述字段。建议的返回结构见 [3.3 补充：申请列表接口增强](#33-补充申请列表接口增强)。

#### 3.2.2 拒绝申请接口参数缺失

**现有接口**：`POST /api/v1/bid/reject`

API 文档中该接口没有定义请求参数和请求体，但前端拒绝操作需要传入：

| 缺少参数 | 类型 | 必填 | 说明 |
|---------|------|------|------|
| bidId | string | 是 | 要拒绝的申请ID |
| remark | string | 是 | 拒绝原因（前端要求拒绝时必须填写备注） |

**建议**：补全 reject 接口的请求参数，与 shortlist/confirm 保持一致的 `{ bidId, remark }` 格式。

#### 3.2.3 缺少申请详情接口

前端详情弹窗需要展示单个申请的完整信息（团队基本信息、申请说明、资料文件、审核记录时间线），但后端没有单独的申请详情接口。

列表接口如果不返回完整信息（如审核记录、资料文件），则需要一个单独的详情接口。

**建议新增**：`GET /api/v1/bid/{bidId}` — 获取单个申请详情，见 [3.4 新增：获取申请详情](#34-新增获取申请详情)。

#### 3.2.4 缺少审核记录查询

前端详情弹窗中有"审核记录"时间线（el-timeline），展示该申请的所有审核操作历史（通过/拒绝/中标，含时间、操作人、备注）。后端没有提供审核记录查询接口。

**建议**：审核记录可以作为申请详情的一部分返回（嵌套在 3.4 的响应中），或单独提供接口。

#### 3.2.5 缺少揭榜统计接口

前端 BiddingBasicInfo.vue 和 BiddingManagement.vue 都需要展示揭榜统计数据：

- 申请团队总数
- 审核通过数
- 待审核数
- 中标团队名称

目前前端是从申请列表中自行计算这些统计值。如果列表数据量大且分页，前端无法准确计算总数。

**建议新增**：`GET /api/v1/bid/project/{projectId}/stats` — 获取揭榜统计，见 [3.5 新增：获取揭榜统计](#35-新增获取揭榜统计)。

#### 3.2.6 申请状态枚举不一致

后端申请状态为 `APPLIED`（大写），前端使用的状态值为 `submitted / approved / rejected / selected`（小写）。

**后端状态**（推测，文档只出现了 APPLIED）：

| 后端状态 | 含义 |
|---------|------|
| APPLIED | 已申请（待审核） |
| SHORTLISTED | 入围（初审通过） |
| CONFIRMED | 已中标 |
| REJECTED | 已拒绝 |

**前端状态**：

| 前端状态 | 含义 |
|---------|------|
| submitted | 待审核 |
| approved | 审核通过 |
| selected | 已中标 |
| rejected | 已拒绝 |

**建议**：后端明确定义完整的状态枚举并在文档中列出，前端做映射适配。

---

### 3.3 补充：申请列表接口增强

**接口**：`GET /api/v1/bid/project/{projectId}`

**请求参数**：

| 字段 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| projectId | path | string | 是 | 项目ID |
| status | query | string | 否 | 按状态筛选（APPLIED/SHORTLISTED/CONFIRMED/REJECTED），不传则返回全部 |
| pageNum | query | number | 否 | 页码，默认1 |
| pageSize | query | number | 否 | 每页条数，默认10 |

**建议响应**（参考）：

```json
{
  "code": "0000",
  "info": "成功",
  "data": {
    "bids": [
      {
        "bidId": "1988942715785711616",
        "projectId": "1988942614044479488",
        "studentId": "1988942088670154752",
        "status": "APPLIED",
        "content": "擅长Java后端与MySQL调优...",
        "attachmentUrl": "https://resume.example.com/student-001.pdf",
        "remark": null,
        "createdAt": "2025-11-13T20:11:11",
        "updatedAt": "2025-11-13T20:11:11",
        "teamName": "创新科技团队",
        "leader": "张三",
        "memberCount": 5,
        "contact": "13800138000",
        "detailFiles": [
          {
            "fileId": "f1",
            "fileName": "团队介绍.pdf",
            "fileUrl": "https://xxx.com/files/f1.pdf",
            "fileSize": 2411724
          }
        ]
      }
    ],
    "total": 4,
    "pageNum": 1,
    "pageSize": 10
  }
}
```

**新增响应字段说明**：

| 字段 | 类型 | 说明 |
|------|------|------|
| data.bids[].teamName | string | 团队名称（关联团队表查询） |
| data.bids[].leader | string | 团队负责人姓名（关联用户表查询） |
| data.bids[].memberCount | number | 团队成员数量 |
| data.bids[].contact | string | 负责人联系方式 |
| data.bids[].detailFiles | array | 团队资料文件列表 |
| data.bids[].detailFiles[].fileId | string | 文件ID |
| data.bids[].detailFiles[].fileName | string | 文件名 |
| data.bids[].detailFiles[].fileUrl | string | 文件下载地址 |
| data.bids[].detailFiles[].fileSize | number | 文件大小（字节） |

---

### 3.4 新增：获取申请详情

**接口**：`GET /api/v1/bid/{bidId}`

**请求参数**：

| 字段 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| bidId | path | string | 是 | 申请ID |

**响应**（参考）：

```json
{
  "code": "0000",
  "info": "成功",
  "data": {
    "bidId": "1988942715785711616",
    "projectId": "1988942614044479488",
    "status": "SHORTLISTED",
    "content": "擅长Java后端与MySQL调优，近期完成过校园实验室排班系统。",
    "attachmentUrl": "https://resume.example.com/student-001.pdf",
    "remark": "简历匹配度高，进入面试环节。",
    "createdAt": "2025-11-13T20:11:11",
    "updatedAt": "2025-11-14T10:30:00",
    "team": {
      "teamName": "创新科技团队",
      "leader": "张三",
      "memberCount": 5,
      "contact": "13800138000",
      "description": "我们是一支经验丰富的AI开发团队...",
      "members": [
        { "userId": "u1", "name": "张三", "role": "负责人", "major": "计算机科学" },
        { "userId": "u2", "name": "李四", "role": "开发", "major": "软件工程" }
      ]
    },
    "detailFiles": [
      { "fileId": "f1", "fileName": "团队介绍.pdf", "fileUrl": "...", "fileSize": 2411724 },
      { "fileId": "f2", "fileName": "技术方案.pdf", "fileUrl": "...", "fileSize": 4404019 }
    ],
    "reviewHistory": [
      {
        "recordId": "r1",
        "action": "SHORTLISTED",
        "actionText": "审核通过",
        "operator": "XX科技有限公司",
        "remark": "简历匹配度高，进入面试环节。",
        "createdAt": "2025-11-14T10:30:00"
      }
    ]
  }
}
```

**响应字段说明**：

| 字段 | 类型 | 说明 |
|------|------|------|
| data.bidId | string | 申请ID |
| data.projectId | string | 项目ID |
| data.status | string | 申请状态（APPLIED/SHORTLISTED/CONFIRMED/REJECTED） |
| data.content | string | 申请说明 |
| data.attachmentUrl | string | 附件URL |
| data.remark | string | 最新备注 |
| data.createdAt | string | 申请时间 |
| data.updatedAt | string | 最后更新时间 |
| data.team | object | 团队信息 |
| data.team.teamName | string | 团队名称 |
| data.team.leader | string | 负责人姓名 |
| data.team.memberCount | number | 团队人数 |
| data.team.contact | string | 联系方式 |
| data.team.description | string | 团队介绍 |
| data.team.members | array | 团队成员列表 |
| data.team.members[].userId | string | 成员用户ID |
| data.team.members[].name | string | 成员姓名 |
| data.team.members[].role | string | 成员角色（负责人/开发/设计等） |
| data.team.members[].major | string | 专业 |
| data.detailFiles | array | 资料文件列表 |
| data.detailFiles[].fileId | string | 文件ID |
| data.detailFiles[].fileName | string | 文件名 |
| data.detailFiles[].fileUrl | string | 文件下载地址 |
| data.detailFiles[].fileSize | number | 文件大小（字节） |
| data.reviewHistory | array | 审核记录列表（按时间正序） |
| data.reviewHistory[].recordId | string | 记录ID |
| data.reviewHistory[].action | string | 操作类型（SHORTLISTED/CONFIRMED/REJECTED） |
| data.reviewHistory[].actionText | string | 操作文本（审核通过/确认中标/拒绝申请） |
| data.reviewHistory[].operator | string | 操作人名称 |
| data.reviewHistory[].remark | string | 备注内容 |
| data.reviewHistory[].createdAt | string | 操作时间 |

---

### 3.5 新增：获取揭榜统计

**接口**：`GET /api/v1/bid/project/{projectId}/stats`

**请求参数**：

| 字段 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| projectId | path | string | 是 | 项目ID |

**响应**（参考）：

```json
{
  "code": "0000",
  "info": "成功",
  "data": {
    "totalApplications": 4,
    "shortlistedCount": 2,
    "pendingCount": 1,
    "rejectedCount": 1,
    "confirmedTeam": {
      "teamName": "创新科技团队",
      "leader": "张三",
      "bidId": "1988942715785711616"
    }
  }
}
```

**响应字段说明**：

| 字段 | 类型 | 说明 |
|------|------|------|
| data.totalApplications | number | 申请团队总数 |
| data.shortlistedCount | number | 入围（审核通过）数量 |
| data.pendingCount | number | 待审核数量 |
| data.rejectedCount | number | 已拒绝数量 |
| data.confirmedTeam | object \| null | 中标团队信息，未选定时为 `null` |
| data.confirmedTeam.teamName | string | 中标团队名称 |
| data.confirmedTeam.leader | string | 中标团队负责人 |
| data.confirmedTeam.bidId | string | 中标申请ID |

---

### 3.6 补充：拒绝申请接口完善

**接口**：`POST /api/v1/bid/reject`

当前 API 文档中该接口缺少请求参数定义，建议补全：

**请求**（参考）：

```json
{
  "bidId": "2000785891890696192",
  "remark": "团队人数不足，经验不符合要求"
}
```

**请求字段说明**：

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| bidId | string | 是 | 要拒绝的申请ID |
| remark | string | 是 | 拒绝原因（前端要求必填） |

**响应**（参考）：

```json
{
  "code": "0000",
  "info": "成功",
  "data": true
}
```

**响应字段说明**：

| 字段 | 类型 | 说明 |
|------|------|------|
| data | boolean | 操作是否成功 |

---

### 3.7 API 总览

| 序号 | 方法 | 路径 | 用途 | 状态 |
|------|------|------|------|------|
| 1 | POST | `/api/v1/bid/apply` | 学生申请揭榜 | 已有 |
| 2 | GET | `/api/v1/bid/project/{projectId}` | 企业查看申请列表 | 已有，需增强返回字段（3.3） |
| 3 | GET | `/api/v1/bid/{bidId}` | 获取申请详情 | **新增**（3.4） |
| 4 | GET | `/api/v1/bid/project/{projectId}/stats` | 获取揭榜统计 | **新增**（3.5） |
| 5 | POST | `/api/v1/bid/shortlist` | 企业筛选入围 | 已有 |
| 6 | POST | `/api/v1/bid/confirm` | 企业确认中标 | 已有 |
| 7 | POST | `/api/v1/bid/reject` | 企业拒绝申请 | 已有，需补全参数（3.6） |

---

## 四、（预留：其他模块）

> 后续其他模块（学生揭榜、管理员审核、消息通知等）在对接过程中发现的API问题，请追加到对应章节下。

---

## 附录：问题优先级总览

| 优先级 | 编号 | 问题 | 模块 | 状态 |
|:---:|------|------|------|:---:|
| P0 | 1.1 | save_draft 需返回 projectId | 企业发布项目 | 待修改 |
| P1 | 1.2 | 缺少"协议签订"里程碑模板 | 企业发布项目 | 待修改 |
| P1 | 1.3 | 里程碑期限无批量更新接口 | 企业发布项目 | 待修改 |
| P2 | 1.4 | 里程碑缺少goal/deliverables字段 | 企业发布项目 | 后续版本 |
| P2 | 1.5 | 缺少通用文件上传API | 企业发布项目 | 后续版本 |
| — | 2.x | 发布项目所需后端API重新设计（方案一8个/方案二6个） | 企业发布项目 | 新增建议 |
| P1 | 3.3 | 申请列表接口返回字段不足，需增强 | 揭榜审核 | 待修改 |
| P1 | 3.4 | 缺少申请详情接口（含团队信息+审核记录） | 揭榜审核 | 新增建议 |
| P2 | 3.5 | 缺少揭榜统计接口 | 揭榜审核 | 新增建议 |
| P1 | 3.6 | 拒绝申请接口参数和响应缺失 | 揭榜审核 | 待修改 |
