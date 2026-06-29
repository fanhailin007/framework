# 业务模块开发规范

## 目标

业务模块规范用于让多个团队在同一个框架中开发时保持一致的目录、命名、路由、接口、权限、Mock 和测试组织方式。模块应能独立理解、独立开发、独立测试，并尽量降低跨模块耦合。

## 当前现状

当前模板主要按技术层分布：

```txt
src/api/
src/router/modules/
src/store/modules/
src/views/
mock/controller/
```

这种方式适合模板演示，但当业务模块增多时，相关代码会分散在多个目录。推荐新业务逐步使用“模块内聚”结构。

## 推荐目录

新业务模块建议放在 `src/modules/<moduleName>`：

```txt
src/modules/system/user/
  api.ts
  routes.ts
  store.ts
  types.ts
  hooks/
    useUserList.ts
  pages/
    index.vue
    detail.vue
  components/
    UserEditDialog.vue
    UserStatusTag.vue
  mocks/
    user.mock.ts
  tests/
    permission.spec.ts
    user-list.spec.ts
```

如果暂时不调整构建和路由扫描，也可以继续把页面放在 `src/views`，但同一模块的类型、接口和组件应尽量靠近：

```txt
src/views/system/user/
  index.vue
  components/
  hooks/
  types.ts
src/api/systemUser.ts
src/router/modules/system.ts
```

## 模块命名

| 类型 | 规则 | 示例 |
| --- | --- | --- |
| 目录 | kebab-case 或业务域分层 | `system/user` |
| 路由 name | PascalCase，全局唯一 | `SystemUser` |
| 页面组件 name | PascalCase | `SystemUser` |
| API 函数 | 动词 + 资源 | `getUserList`、`createUser` |
| 权限点 | `domain:resource:action` | `system:user:create` |
| Store id | 模块名 | `systemUser` |

## 标准模块内容

### `types.ts`

模块类型集中定义：

```ts
export interface UserListQuery {
  pageNo: number
  pageSize: number
  username?: string
}

export interface UserListItem {
  id: string
  username: string
  status: 'enabled' | 'disabled'
}
```

### `api.ts`

API 只负责请求，不处理页面状态：

```ts
import request from '/@/utils/request'
import type { UserListItem, UserListQuery } from './types'

export const getUserList = (params: UserListQuery) => {
  return request<PageResult<UserListItem>>({
    url: '/system/user/getList',
    method: 'get',
    params,
  })
}
```

### `routes.ts`

路由只描述页面注册、菜单和权限：

```ts
export const userRoutes = [
  {
    path: 'user',
    name: 'SystemUser',
    component: () => import('./pages/index.vue'),
    meta: {
      title: '用户管理',
      icon: 'user-3-line',
      guard: { permission: ['system:user:read'], mode: 'oneOf' },
    },
  },
]
```

### `store.ts`

Store 只保存跨页面共享状态。页面局部状态优先放在页面或 hook 中，不要全部塞入 Store。

```ts
export const useSystemUserStore = defineStore('systemUser', {
  state: () => ({
    selectedUserId: '',
  }),
  actions: {
    selectUser(id: string) {
      this.selectedUserId = id
    },
  },
})
```

### `hooks`

复杂列表查询、表单提交、批量操作建议抽成 hook：

```ts
export const useUserList = () => {
  const list = ref<UserListItem[]>([])
  const total = ref(0)
  const loading = ref(false)

  const fetchData = async (query: UserListQuery) => {
    loading.value = true
    try {
      const data = await getUserList(query)
      list.value = data.list
      total.value = data.total
    } finally {
      loading.value = false
    }
  }

  return { list, total, loading, fetchData }
}
```

## 页面开发要求

- 页面只组织 UI、交互和局部状态，不直接拼接复杂接口逻辑。
- 表格页必须处理 loading、empty、分页、查询重置、错误状态。
- 编辑弹窗必须明确新增和编辑模式。
- 删除操作必须二次确认。
- 批量操作必须处理未选择行的提示。
- 页面按钮必须配置权限点。

## 权限要求

每个模块至少定义：

| 操作 | 权限点示例 |
| --- | --- |
| 查看 | `system:user:read` |
| 新增 | `system:user:create` |
| 编辑 | `system:user:update` |
| 删除 | `system:user:delete` |
| 导入 | `system:user:import` |
| 导出 | `system:user:export` |

路由权限控制页面入口，按钮权限控制操作入口，接口权限由后端兜底。

## Mock 要求

模块 Mock 必须：

- 返回统一 `code`、`msg`、`data`。
- 分页字段与真实接口一致。
- 覆盖列表、详情、新增、编辑、删除。
- 使用稳定 id，便于 E2E 测试。

## 测试要求

新模块至少应覆盖：

- 权限过滤逻辑。
- 列表查询参数。
- 新增/编辑表单校验。
- 删除确认流程。
- 关键页面 E2E smoke。

当前项目尚未接入测试框架，补齐测试体系后，新模块必须随代码提交对应测试。
