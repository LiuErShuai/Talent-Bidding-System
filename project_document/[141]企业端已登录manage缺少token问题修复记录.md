# [141] 企业端已登录但/manage接口缺少token问题修复记录

## 背景与目标
企业账号已登录后访问 `/enterprise/project/:id/manage`，控制台仍出现“`[请求拦截器] 未找到 token`”，并伴随接口权限异常（如竞榜接口无权限）。本次目标是在不重构认证体系的前提下，做最小修复，保证请求头稳定带上登录令牌。

## 目录
1. 问题现象
2. 根因定位
3. 详细 TODOLIST（实施步骤）
4. 具体改动
5. 验证清单
6. 风险与后续建议

## 1. 问题现象
- 企业用户已登录，进入 manage 页面后部分请求未携带 `Authorization`。
- 请求拦截器打印“未找到 token”。
- 后端返回权限类业务错误（如 `ERR_BIZ_035`）。

## 2. 根因定位
- `src/api/request.js` 请求拦截器仅从 `localStorage` 读取 token。
- 认证状态实际由 Pinia `authStore` 维护，存在“store已登录但localStorage值瞬时不可用/未同步”的窗口，导致请求偶发丢 token。
- `UserPanel.vue` 退出登录中存在额外手动 `localStorage.removeItem`，与 `authStore.logout()` 重复，放大了认证状态分叉风险。

## 3. 详细 TODOLIST（实施步骤）
- [x] Step 1：审查 token 读写链路
  - [x] 检查 `authStore.login/logout/initAuth`
  - [x] 检查 `request.js` 请求拦截器 token 注入逻辑
  - [x] 检查头部退出登录实现是否存在重复清理

- [x] Step 2：修复请求拦截器 token 来源优先级
  - [x] 优先读取 `authStore.token`
  - [x] `authStore` 无值时再兜底读取 localStorage
  - [x] 过滤 `null/undefined` 字符串型脏值

- [x] Step 3：统一退出登录路径
  - [x] `UserPanel.vue` 仅调用 `authStore.logout()`
  - [x] 删除重复手动清理 token/userRole/userData 代码

- [x] Step 4：同步模块文档
  - [x] 在 `[000]功能模块文档.md` 写入本次修复记录

## 4. 具体改动
### 4.1 请求拦截器
文件：`src/api/request.js`
- 由“仅 localStorage 读取 token”改为“优先 Pinia、兜底 localStorage”。
- 保持后端约定：`Authorization` 直接传 token（不加 Bearer）。

### 4.2 退出登录统一
文件：`src/components/layout/AppHeader/UserPanel.vue`
- 删除额外 `localStorage.removeItem('token'/'userRole'/'userData')`。
- 统一依赖 `authStore.logout()` 维护认证状态与本地存储。

## 5. 验证清单
- [ ] 企业账号登录后访问 `/enterprise/project/:id/manage`，请求头稳定包含 `Authorization`。
- [ ] 控制台不再出现“`[请求拦截器] 未找到 token`”（在已登录场景）。
- [ ] `project/detail`、`milestone/project`、`bid/project` 请求权限表现与账号实际权限一致。
- [ ] 点击头像退出登录后，首页状态与权限拦截表现正常。

## 6. 风险与后续建议
- 风险：项目内仍存在历史 `store/user.js` 与部分页面直接读写 localStorage 的旧逻辑，后续可能继续引入状态分叉。
- 建议：后续逐步收敛为“认证状态仅由 `authStore` 单源管理”，页面侧通过 store/composable 获取登录状态，不再直接读写 token。
