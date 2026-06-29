# 认证与权限

## 目标

认证与权限体系用于回答四个问题：

1. 当前用户是否已登录。
2. 当前用户是谁。
3. 当前用户能访问哪些页面。
4. 当前用户能执行哪些操作。

当前模板已经具备 token、用户信息、角色、权限点、路由守卫和按钮权限指令的基础能力。

## 当前实现位置

| 文件 | 职责 |
| --- | --- |
| `src/store/modules/user.ts` | 登录、退出、token、用户信息 |
| `src/store/modules/acl.ts` | 角色、权限点、管理员标识 |
| `src/router/permissions.ts` | 登录拦截和路由初始化 |
| `src/utils/permission.ts` | 权限判断 |
| `library/plugins/directive.ts` | `v-permissions` 指令 |
| `src/api/user.ts` | 登录、用户信息、退出接口 |
| `src/utils/token.ts` | token 读写删除 |

## 登录流程

1. 登录页调用 `useUserStore().login(userInfo)`。
2. `src/api/user.ts` 请求 `/login`。
3. 登录接口返回 `tokenName` 对应字段，默认是 `token`。
4. `afterLogin()` 写入 Pinia 和本地存储。
5. 立即调用 `getUserInfo()` 获取用户信息、角色和权限。
6. 路由守卫调用 `routesStore.setRoutes(authentication)` 生成可访问路由。
7. 用户进入目标页面。

## 用户信息接口协议

`/userInfo` 建议返回：

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "username": "admin",
    "avatar": "./static/svg/avatar.svg",
    "roles": ["Admin"],
    "permissions": ["system:user:read", "system:user:write"]
  }
}
```

字段说明：

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `username` | `string` | 否 | 显示用户名 |
| `avatar` | `string` | 否 | 用户头像 |
| `roles` | `string[]` | 否 | 用户角色 |
| `permissions` | `string[]` | 否 | 权限点 |

如果 `permissions` 包含 `*`，前端视为拥有所有权限。

## Token 策略

当前配置位于 `src/config/setting.config.ts`：

```ts
tokenName: 'token'
tokenTableName: 'shop-vite-token'
storage: 'localStorage'
```

企业项目建议：

- 普通后台可使用 `sessionStorage` 或短期 `localStorage`。
- 高安全系统优先使用 BFF + HttpOnly Cookie。
- token 过期时由请求层统一刷新或跳转登录。
- 退出登录必须清理 token、ACL、tabs、用户信息和路由缓存。

## 权限模型

推荐统一使用 `GuardType`：

```ts
{
  role?: string[]
  permission?: string[]
  mode?: 'allOf' | 'oneOf' | 'except'
}
```

示例：

```ts
meta: {
  guard: {
    role: ['Admin'],
    permission: ['system:user:read'],
    mode: 'oneOf',
  },
}
```

模式说明：

| 模式 | 含义 |
| --- | --- |
| `oneOf` | 满足任一角色或权限即可 |
| `allOf` | 必须满足全部角色或权限 |
| `except` | 不包含指定角色或权限时通过 |

## 路由权限

路由权限通过 `meta.guard` 配置：

```ts
{
  path: 'roleManagement',
  name: 'RoleManagement',
  component: () => import('/@/views/setting/roleManagement/index.vue'),
  meta: {
    title: '角色管理',
    icon: 'admin-line',
    guard: { permission: ['system:role:read'], mode: 'oneOf' },
  },
}
```

`routesStore.setRoutes()` 会调用 `filterRoutes()` 过滤当前用户不可访问的路由。

## 按钮权限

当前模板提供 `v-permissions`：

```vue
<el-button v-permissions="['system:user:write']" type="primary">
  新增
</el-button>
```

当前行为是无权限时移除 DOM。后续建议升级为可配置模式：

```vue
<el-button v-auth="{ permission: ['system:user:write'], mode: 'oneOf', effect: 'disabled' }">
  新增
</el-button>
```

常见效果：

| effect | 行为 |
| --- | --- |
| `remove` | 从 DOM 移除 |
| `hidden` | 保留 DOM 但隐藏 |
| `disabled` | 禁用控件 |
| `readonly` | 只读展示 |

## 多租户和数据权限

前端权限只负责页面和操作入口展示，不负责最终数据安全。以下能力必须由后端兜底：

- 租户隔离。
- 组织范围。
- 数据行权限。
- 字段权限。
- 审计日志。

前端可以通过请求 header 携带 `tenantId`、`locale`、`timezone` 等上下文，但不能信任前端传入值作为安全依据。

## 维护要求

- 新增页面时必须明确路由权限。
- 新增操作按钮时必须明确权限点。
- 权限点命名建议使用 `domain:resource:action`，例如 `system:user:create`。
- 登录和用户信息接口结构变更时，必须同步更新本文档和 `userStore`。
- token 刷新失败应抛出认证错误并跳转登录，不建议返回空对象。
