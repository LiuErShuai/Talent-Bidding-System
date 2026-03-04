# [142] 企业端 manage 揭榜管理页 API 接入实施文档

## 背景与目标
企业端项目管理页（`/enterprise/project/:id/manage`）的"揭榜管理"子页面（`BiddingManagement.vue`）目前完全依赖硬编码 Mock 数据（4个假团队），无法反映后端真实竞榜状态。
本次改造目标：将揭榜列表数据和审核操作（入围/拒绝/中标）全部对接后端 API，并通过团队详情接口补充团队名称等信息。

## 目录
1. 改造范围
2. 接口与字段映射
3. 详细 TODOLIST（实施步骤）
4. 关键实现说明
5. 验证清单

## 1. 改造范围
- API 封装层：`src/api/project.js`
- 揭榜管理组件：`src/components/enterprise/BiddingManagement.vue`
- API 文档同步：`project_document/[002]API文档.md`（已完成）
- 模块总文档同步：`project_document/[000]功能模块文档.md`

## 2. 接口与字段映射

### 2.1 接口清单
| 接口 | 方法 | 路径 | 用途 |
|------|------|------|------|
| 竞榜列表 | GET | `/bid/project/{projectId}` | 获取申请列表 |
| 团队详情 | GET | `/team/detail/{teamId}` | 补充团队名称、人数 |
| 入围 | POST | `/bid/shortlist` | 审核通过（入围） |
| 确认中标 | POST | `/bid/confirm` | 选为中标团队 |
| 拒绝 | POST | `/bid/reject` | 拒绝申请 |

### 2.2 竞榜列表返回字段
```json
{
  "bidId": "xxx",
  "projectId": "xxx",
  "teamId": "xxx",
  "status": "applied",
  "content": "申请说明",
  "attachmentUrl": "https://...",
  "remark": null,
  "createdAt": "2026-02-15T17:02:44",
  "updatedAt": "2026-02-15T17:02:44"
}
```

### 2.3 字段映射规则
| 组件字段 | 来源 | 映射规则 |
|---------|------|---------|
| `id` | bid.bidId | 直接使用 |
| `teamName` | team.teamName | 通过 teamId 查询，兜底 `'未知团队'` |
| `memberCount` | team.memberCount | 通过 teamId 查询，兜底 `0` |
| `leader` | — | 后端无负责人姓名字段，显示 `'--'` |
| `contact` | — | 后端无联系方式字段，显示 `'--'` |
| `applyTime` | bid.createdAt | 格式化为本地时间 |
| `description` | bid.content | 直接使用，兜底 `''` |
| `status` | bid.status | 后端已返回小写，直接使用 |
| `detailFiles` | bid.attachmentUrl | 非空时转为单元素数组 `[{id, name, url}]` |
| `reviewHistory` | — | 后端无此字段，显示空数组 `[]` |

## 3. 详细 TODOLIST（实施步骤）

- [x] Step 1：API 封装层新增接口
  - [x] 在 `src/api/project.js` 新增 `shortlistBidAPI(data)`
  - [x] 在 `src/api/project.js` 新增 `confirmBidAPI(data)`
  - [x] 在 `src/api/project.js` 新增 `rejectBidAPI(data)`
  - [x] 在 `src/api/project.js` 新增 `getTeamDetailAPI(teamId)`

- [x] Step 2：改造 BiddingManagement.vue 数据加载
  - [x] 删除硬编码 Mock 数据
  - [x] 新增 `loadApplications()` 函数：调用 `getProjectBidsAPI` 获取列表
  - [x] 对每个 bid 的 teamId 并发调用 `getTeamDetailAPI` 补充团队信息
  - [x] 新增 `mapBidToApplication(bid, teamDetail)` 映射函数
  - [x] 组件 `onMounted` 时调用 `loadApplications()`
  - [x] 接口失败时保留现有 Mock 数据兜底

- [x] Step 3：改造审核操作为 API 调用
  - [x] `handleApproveWithNote` → 调用 `shortlistBidAPI`，成功后刷新列表
  - [x] `handleRejectWithNote` → 调用 `rejectBidAPI`，成功后刷新列表
  - [x] `handleSelectTeamWithNote` → 调用 `confirmBidAPI`，成功后刷新列表
  - [x] 操作期间添加 loading 状态防止重复提交

- [x] Step 4：清理冗余代码
  - [x] 删除未使用的旧审核对话框相关代码（`handleApprove`、`handleReject`、`handleSelectTeam`、`handleConfirmReview`、`reviewDialogVisible` 等）
  - [x] 删除未使用的审核对话框模板

- [x] Step 5：同步功能模块文档
  - [x] 更新 `[000]功能模块文档.md`

## 4. 关键实现说明

### 4.1 数据加载流程
```
组件挂载
  → getProjectBidsAPI(projectId) 获取 bids 列表
  → 提取所有唯一 teamId
  → Promise.allSettled 并发请求 getTeamDetailAPI(teamId)
  → 构建 teamId → teamDetail 映射表
  → bids.map(bid => mapBidToApplication(bid, teamMap[bid.teamId]))
  → 赋值给 applications
```

### 4.2 审核操作流程
```
用户点击操作按钮
  → 调用对应 API（shortlist/reject/confirm）
  → 成功：ElMessage.success + 重新调用 loadApplications() 刷新列表
  → 失败：ElMessage.error 提示
```

### 4.3 降级策略
- 竞榜列表请求失败：回退 Mock 数据，弹出错误提示
- 团队详情请求失败：该 bid 的团队信息显示为兜底值（'未知团队'）
- 审核操作失败：仅提示错误，不修改本地状态

## 5. 验证清单
- [ ] 打开揭榜管理页，列表从后端加载并显示团队名称
- [ ] 筛选功能正常（全部/待审核/已入围/已拒绝/已中标）
- [ ] 点击"查看详情"弹窗正常显示
- [ ] 审核通过操作调用 `/bid/shortlist`，成功后列表刷新
- [ ] 拒绝操作调用 `/bid/reject`，成功后列表刷新
- [ ] 选为中标团队调用 `/bid/confirm`，成功后列表刷新
- [ ] 后端无数据时显示空状态
- [ ] 接口异常时回退 Mock 数据不白屏
