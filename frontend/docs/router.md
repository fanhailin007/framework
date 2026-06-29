# 路由与菜单协议

## 目标

路由体系同时承担页面注册、菜单展示、权限过滤、面包屑、多标签页、动态路由和错误页兜底。大规模应用中，路由协议必须稳定，否则菜单、权限、缓存和页面跳转会互相影响。

## 当前实现位置

| 文件 | 职责 |
| --- | --- |
| `src/router/index.ts` | 创建 Router、注册常量路由、注册动态路由、重置路由 |
| `src/router/permissions.ts` | 全局路由守卫、登录拦截、权限路由初始化 |
| `src/router/modules/*.ts` | 业务路由模块 |
| `src/store/modules/routes.ts` | 路由树、菜单树、面包屑树状态管理 |
| `src/utils/routes.ts` | 后端路由转换、权限过滤、标签页路径处理 |
| `types/route.d.ts` | 路由元数据类型 |

## 路由模式

当前配置项位于 `src/config/setting.config.ts`：

```ts
authentication: 'intelligence'
```

支持模式：

| 模式 | 含义 | 适用场景 |
| --- | --- | --- |
| `intelligence` | 前端维护完整异步路由，并按角色权限过滤 | 中小后台、前端自主维护菜单 |
| `all` | 后端返回路由 JSON，前端动态转换组件 | 多租户、菜单由后台配置、权限由后端集中管理 |
| `visit` | 游客白名单路由 | 门户、公开页面 |

## 路由元数据协议

建议业务路由统一使用以下字段：

```ts
{
  path: '/setting',
  name: 'Setting',
  component: Layout,
  meta: {
    title: '配置',
    icon: 'user-settings-line',
    guard: ['Admin'],
    hidden: false,
    noKeepAlive: false,
    tabHidden: false,
    breadcrumbHidden: false,
  },
  children: []
}
```

常用字段说明：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `title` | `string` | 菜单、标签页、面包屑显示名称 |
| `icon` | `string` | 菜单图标 |
| `guard` | `string[] \| GuardType` | 路由权限要求 |
| `hidden` | `boolean` | 是否从菜单隐藏 |
| `activeMenu` | `string` | 当前页面高亮的菜单路径 |
| `noKeepAlive` | `boolean` | 是否禁用页面缓存 |
| `tabHidden` | `boolean` | 是否不显示在多标签页 |
| `breadcrumbHidden` | `boolean` | 是否隐藏面包屑 |
| `dynamicNewTab` | `boolean` | 动态参数页面是否打开新标签 |
| `target` | `'_blank' \| string` | 外链打开方式 |
| `fullscreen` | `boolean` | 页面是否全屏 |

## 业务路由模块规范

每个业务域应维护自己的路由文件：

```txt
src/router/modules/system.ts
src/router/modules/goods.ts
src/router/modules/workflow.ts
```

路由模块应导出命名数组：

```ts
import Layout from '/@vab/layouts/index.vue'

export const systemRoutes = [
  {
    path: '/system',
    name: 'System',
    component: Layout,
    meta: {
      title: '系统管理',
      icon: 'settings-3-line',
      guard: ['Admin'],
    },
    children: [
      {
        path: 'user',
        name: 'SystemUser',
        component: () => import('/@/views/system/user/index.vue'),
        meta: {
          title: '用户管理',
          icon: 'user-3-line',
          guard: { permission: ['system:user:read'], mode: 'oneOf' },
        },
      },
    ],
  },
]
```

新增模块后，在 `src/router/modules/index.ts` 汇总导出。

## 后端路由协议

当 `authentication` 为 `all` 时，后端接口 `/router/getList` 应返回可转换的路由树：

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "list": [
      {
        "path": "/system",
        "name": "System",
        "component": "Layout",
        "meta": {
          "title": "系统管理",
          "icon": "settings-3-line"
        },
        "children": [
          {
            "path": "user",
            "name": "SystemUser",
            "component": "views/system/user/index.vue",
            "meta": {
              "title": "用户管理",
              "guard": {
                "permission": ["system:user:read"],
                "mode": "oneOf"
              }
            }
          }
        ]
      }
    ]
  }
}
```

约束：

- `name` 必须全局唯一，首字母建议大写。
- `component` 为 `Layout` 时映射到主布局。
- 页面组件路径必须指向 `src/views` 下真实 Vue 文件。
- 后端必须追加或允许前端追加 404 兜底路由。
- 权限字段只控制前端展示，接口数据权限必须由后端再次校验。

## 菜单、面包屑和多标签页

`routesStore.setRoutes()` 会生成三类结构：

- `routes`：菜单展示使用，过滤 `hidden`。
- `allRoutes`：完整可访问路由。
- `breadcrumbRoutes`：面包屑使用。

多标签页由 `src/store/modules/tabs.ts` 和 `src/utils/routes.ts` 协同处理。业务页面如果不希望进入多标签页，应设置：

```ts
meta: {
  tabHidden: true,
}
```

## 维护要求

- 新路由必须补 `title`，否则菜单、标签页和页面标题会失去语义。
- 新业务模块禁止直接写入大型路由文件，应创建模块路由。
- 使用后端动态路由时，必须对返回 JSON 做 schema 校验。
- 不建议开启 `disableRouterWarning` 掩盖路由错误。
- 删除页面时必须同步删除路由、菜单配置、权限点和 Mock。
