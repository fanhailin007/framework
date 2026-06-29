# 接口规范和错误处理

## 目标

请求层用于统一处理 baseURL、token、请求格式、业务状态码、错误提示、刷新 token、错误日志和接口类型。大规模应用中，接口协议必须稳定，并且业务代码不应直接处理底层 Axios 细节。

## 当前实现位置

| 文件 | 职责 |
| --- | --- |
| `src/utils/request.ts` | Axios 实例、请求拦截、响应拦截、错误处理 |
| `src/config/net.config.ts` | content-type、timeout、successCode、字段名 |
| `src/api/*.ts` | 业务 API 函数 |
| `src/api/refreshToken.ts` | 刷新 token |
| `library/plugins/errorLog.ts` | 错误日志记录 |

## 统一响应结构

当前配置：

```ts
successCode: [200, 0, '200', '0']
statusName: 'code'
messageName: 'msg'
```

推荐后端统一返回：

```ts
interface ApiResponse<T> {
  code: number | string
  msg: string
  data: T
}
```

分页返回：

```ts
interface PageResult<T> {
  list: T[]
  total: number
  pageNo: number
  pageSize: number
}
```

示例：

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "list": [],
    "total": 0,
    "pageNo": 1,
    "pageSize": 20
  }
}
```

## API 模块写法

当前写法：

```ts
import request from '/@/utils/request'

export function getList(params: any) {
  return request({
    url: '/table/getList',
    method: 'get',
    params,
  })
}
```

推荐逐步改造为类型化写法：

```ts
import request from '/@/utils/request'

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

export const getUserList = (params: UserListQuery) => {
  return request<PageResult<UserListItem>>({
    url: '/system/user/getList',
    method: 'get',
    params,
  })
}
```

在完成 `request<T>` 泛型改造前，新 API 至少应定义请求参数和响应数据类型，减少 `any` 扩散。

## 请求拦截规则

当前请求拦截会执行：

- 从 `userStore` 获取 token。
- 写入 `Authorization: Bearer ${token}`。
- 当 content-type 是 form-urlencoded 时使用 `qs.stringify`。
- 当 URL 命中 `debounce` 配置时显示全局 loading。

企业项目建议增加：

- `X-Trace-Id`：链路追踪。
- `X-Tenant-Id`：租户上下文。
- `Accept-Language`：语言。
- `X-Timezone`：时区。
- 幂等请求 header，例如 `Idempotency-Key`。

## 响应处理规则

当前核心状态码行为：

| code | 行为 |
| --- | --- |
| `200` | 返回 `data` |
| `205` | 触发锁屏 |
| `401` | 清理登录态并跳转登录 |
| `402` | 尝试刷新 token 并重放请求 |
| `403` | 跳转 403 页面 |
| 其他 | 显示错误消息，记录错误日志，抛出错误 |

建议：

- 刷新 token 失败时必须抛出认证错误。
- 网络错误、业务错误、权限错误应使用不同错误类型。
- 请求层不应强制所有错误都弹全局消息，复杂页面需要局部错误提示。

## 错误类型建议

```ts
type ApiErrorType = 'network' | 'auth' | 'permission' | 'business' | 'server'

interface ApiError {
  type: ApiErrorType
  code?: number | string
  message: string
  response?: unknown
}
```

页面处理示例：

```ts
try {
  const data = await getUserList(queryForm)
  list.value = data.list
} catch (error) {
  list.value = []
  // 页面可选择局部 empty、局部 alert 或保持全局提示
}
```

## Mock 规范

当前 Mock 位于 `mock/controller/*.ts`，由 `vite-plugin-mock` 加载。

要求：

- 本地开发 Mock 可以开启。
- 生产环境默认关闭 Mock。
- Mock 返回结构必须与真实接口一致。
- API 字段变更时，必须同步修改 Mock。
- 推荐后续基于 OpenAPI 自动生成 Mock，降低漂移。

## 维护要求

- 新增 API 必须放在 `src/api` 或业务模块自己的 `api.ts` 中。
- 禁止页面内直接使用裸 Axios。
- 列表接口统一使用 `pageNo`、`pageSize`、`list`、`total`。
- 导入导出接口需明确文件类型、文件名来源和错误返回格式。
- 请求层配置变更时，必须同步更新 `src/config/net.config.ts` 和本文档。
